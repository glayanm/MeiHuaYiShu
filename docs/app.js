let isRolling = false;
const HISTORY_KEY = 'meihua_yishu_history';

function getHexagram(upper, lower) {
    return HEXAGRAMS[`${upper},${lower}`] || null;
}

function linesToTrigram(lines) {
    const map = [[1,1,1],[0,1,1],[1,0,1],[0,0,1],[1,1,0],[0,1,0],[1,0,0],[0,0,0]];
    for (let i = 0; i < map.length; i++) {
        if (map[i][0]===lines[0] && map[i][1]===lines[1] && map[i][2]===lines[2]) return i+1;
    }
    return 1;
}

function performDivination() {
    const u = [rand12(), rand12(), rand12()];
    const l = [rand12(), rand12(), rand12()];
    const ml = Math.floor(Math.random()*6)+1;
    const uy = u.map(v => v===1?1:0);
    const ly = l.map(v => v===1?1:0);
    const ui = linesToTrigram(uy);
    const li = linesToTrigram(ly);
    const orig = getHexagram(ui, li);
    const all = [...ly, ...uy];
    all[ml-1] = all[ml-1]===1?0:1;
    const ci = linesToTrigram(all.slice(3,6));
    const cli = linesToTrigram(all.slice(0,3));
    const changed = getHexagram(ci, cli);
    if (changed) { changed.upperTrigram = ci; changed.lowerTrigram = cli; }
    return { upperDice:u, lowerDice:l, movingLineDice:ml, upperIndex:ui, lowerIndex:li,
             movingLine:ml, original:orig, changed, upperTrigramInfo:{number:ui,name:TRIGRAM_NAMES[ui],nature:TRIGRAM_NATURES[ui]},
             lowerTrigramInfo:{number:li,name:TRIGRAM_NAMES[li],nature:TRIGRAM_NATURES[li]} };
}

function rand12() { return Math.random()<0.5?1:2; }

function renderBinaryDice(el, v) {
    const f = el.querySelector('.dice-face');
    if (v===1) f.innerHTML='<div class="binary-value"><span class="binary-yang">1</span><div class="binary-yang-symbol"><div class="binary-yang-bar"></div></div></div>';
    else f.innerHTML='<div class="binary-value"><span class="binary-yang">2</span><div class="binary-yin-symbol"><div class="binary-yin-bar"></div><div class="binary-yin-bar"></div></div></div>';
}

function renderStandardDice(el, v) {
    el.querySelector('.dice-face').innerHTML=`<div class="standard-value">${v}</div>`;
}

function getFortuneClass(f) {
    if (f.includes('大吉')) return 'great';
    if (f.includes('吉')) return 'good';
    if (f.includes('凶')) return 'bad';
    return 'neutral';
}

function renderHexLines(lines, mi) {
    let h='';
    for (let i=5;i>=0;i--) {
        const cls = i===mi?'moving':'';
        if (lines[i]===1) h+=`<div class="hex-line yang ${cls}"></div>`;
        else h+=`<div class="hex-line yin ${cls}"><div class="segment"></div><div class="segment"></div></div>`;
    }
    return h;
}

function getHexLines(u,l) { return [...(TRIGRAM_LINES[l]||[0,0,0]),...(TRIGRAM_LINES[u]||[0,0,0])]; }

function diceToSym(v) { return v===1?'━━━':'━ ━'; }

function startDivination() {
    if (isRolling) return;
    isRolling = true;
    const btn = document.getElementById('btnDivine');
    btn.disabled=true; btn.textContent='卦象生成中...';
    const dice = ['ud1','ud2','ud3','ld1','ld2','ld3','md'].map(id=>document.getElementById(id));
    dice.forEach(d=>d.classList.add('rolling'));
    let cnt=0;
    const iv = setInterval(()=>{
        renderBinaryDice(dice[0],rand12()); renderBinaryDice(dice[1],rand12()); renderBinaryDice(dice[2],rand12());
        renderBinaryDice(dice[3],rand12()); renderBinaryDice(dice[4],rand12()); renderBinaryDice(dice[5],rand12());
        renderStandardDice(dice[6],Math.floor(Math.random()*6)+1);
        if (++cnt>=15) { clearInterval(iv); finishDivination(dice,btn); }
    }, 100);
}

function finishDivination(dice, btn) {
    const data = performDivination();
    dice.forEach(d=>d.classList.remove('rolling'));
    renderBinaryDice(dice[0],data.upperDice[0]); renderBinaryDice(dice[1],data.upperDice[1]); renderBinaryDice(dice[2],data.upperDice[2]);
    renderBinaryDice(dice[3],data.lowerDice[0]); renderBinaryDice(dice[4],data.lowerDice[1]); renderBinaryDice(dice[5],data.lowerDice[2]);
    renderStandardDice(dice[6],data.movingLineDice);
    data.question = document.getElementById('questionInput').value.trim() || '（未輸入問事）';
    data.timestamp = new Date().toLocaleString('zh-TW');
    saveToHistory(data);
    displayResult(data);
    isRolling=false; btn.disabled=false; btn.textContent='誠心問卦';
}

function displayResult(data) {
    document.getElementById('placeholder').style.display='none';
    document.getElementById('resultContent').classList.remove('hidden');
    document.getElementById('resultQuestion').textContent='問：'+data.question;

    const origLines = getHexLines(data.upperTrigramInfo.number, data.lowerTrigramInfo.number);
    document.getElementById('originalSymbol').innerHTML = renderHexLines(origLines, data.movingLine-1);
    document.getElementById('originalName').textContent = data.original.name;
    document.getElementById('originalTrigrams').textContent = `${data.upperTrigramInfo.name}${data.upperTrigramInfo.nature} / ${data.lowerTrigramInfo.name}${data.lowerTrigramInfo.nature}`;
    const of = document.getElementById('originalFortune');
    of.textContent=data.original.fortune; of.className='fortune-badge '+getFortuneClass(data.original.fortune);
    document.getElementById('movingLineNum').textContent = data.movingLine;
    document.getElementById('hexDescription').textContent = data.original.description;
    document.getElementById('hexPlainExplanation').textContent = data.original.plainExplanation;
    document.getElementById('hexClassicText').textContent = data.original.classicText;
    document.getElementById('hexAdvice').textContent = data.original.advice;

    const cd = document.getElementById('changedInterpretation');
    if (data.changed) {
        const chLines = getHexLines(data.changed.upperTrigram||data.upperIndex, data.changed.lowerTrigram||data.lowerIndex);
        document.getElementById('changedSymbol').innerHTML = renderHexLines(chLines, -1);
        document.getElementById('changedName').textContent = data.changed.name;
        const chU = data.changed.upperTrigram||data.upperIndex, chL = data.changed.lowerTrigram||data.lowerIndex;
        document.getElementById('changedTrigrams').textContent = `${TRIGRAM_NAMES[chU]}${TRIGRAM_NATURES[chU]} / ${TRIGRAM_NAMES[chL]}${TRIGRAM_NATURES[chL]}`;
        const cf = document.getElementById('changedFortune');
        cf.textContent=data.changed.fortune; cf.className='fortune-badge '+getFortuneClass(data.changed.fortune);
        document.getElementById('changedDescription').textContent = data.changed.description;
        document.getElementById('changedPlainExplanation').textContent = data.changed.plainExplanation;
        document.getElementById('changedAdvice').textContent = data.changed.advice;
        cd.style.display='grid';
    } else { cd.style.display='none'; }

    displayVerification(data);
}

function displayVerification(data) {
    const ud=data.upperDice, ld=data.lowerDice, ml=data.movingLineDice;
    let d=`<div class="step"><span class="label">上卦三骰：</span><span class="value">${ud[0]}(下) ${ud[1]}(中) ${ud[2]}(上) → ${diceToSym(ud[0])} ${diceToSym(ud[1])} ${diceToSym(ud[2])} → <span class="highlight">${data.upperTrigramInfo.name}（${data.upperTrigramInfo.nature}）</span></span></div>`;
    d+=`<div class="step"><span class="label">下卦三骰：</span><span class="value">${ld[0]}(下) ${ld[1]}(中) ${ld[2]}(上) → ${diceToSym(ld[0])} ${diceToSym(ld[1])} ${diceToSym(ld[2])} → <span class="highlight">${data.lowerTrigramInfo.name}（${data.lowerTrigramInfo.nature}）</span></span></div>`;
    d+=`<div class="step"><span class="label">動爻骰：</span><span class="value"><span class="highlight">第 ${ml} 爻</span> 變動</span></div>`;
    document.getElementById('verifyDiceSteps').innerHTML=d;

    const ub=`${ud[2]===1?'1':'0'}${ud[1]===1?'1':'0'}${ud[0]===1?'1':'0'}`;
    const lb=`${ld[2]===1?'1':'0'}${ld[1]===1?'1':'0'}${ld[0]===1?'1':'0'}`;
    let m=`<div class="step"><span class="label">上卦爻線：</span><span class="value">上${diceToSym(ud[2])} 中${diceToSym(ud[1])} 下${diceToSym(ud[0])} → 二進位 <span class="highlight">${ub}</span> → 先天序 <span class="highlight">${data.upperIndex}</span> → <span class="highlight">${TRIGRAM_NAMES[data.upperIndex]}${TRIGRAM_NATURES[data.upperIndex]}</span></span></div>`;
    m+=`<div class="step"><span class="label">下卦爻線：</span><span class="value">上${diceToSym(ld[2])} 中${diceToSym(ld[1])} 下${diceToSym(ld[0])} → 二進位 <span class="highlight">${lb}</span> → 先天序 <span class="highlight">${data.lowerIndex}</span> → <span class="highlight">${TRIGRAM_NAMES[data.lowerIndex]}${TRIGRAM_NATURES[data.lowerIndex]}</span></span></div>`;
    m+=`<div class="step"><span class="label">合成卦象：</span><span class="value">${TRIGRAM_NAMES[data.upperIndex]}${TRIGRAM_NATURES[data.upperIndex]}（上）＋ ${TRIGRAM_NAMES[data.lowerIndex]}${TRIGRAM_NATURES[data.lowerIndex]}（下） → <span class="highlight">${data.original.name}</span></span></div>`;
    if (data.changed) {
        const cu=TRIGRAM_NAMES[data.changed.upperTrigram||data.upperIndex]+TRIGRAM_NATURES[data.changed.upperTrigram||data.upperIndex];
        const cl=TRIGRAM_NAMES[data.changed.lowerTrigram||data.lowerIndex]+TRIGRAM_NATURES[data.changed.lowerTrigram||data.lowerIndex];
        m+=`<div class="step"><span class="label">動爻變卦：</span><span class="value">第${ml}爻翻轉 → ${cu}（上）＋ ${cl}（下） → <span class="highlight">${data.changed.name}</span></span></div>`;
    }
    document.getElementById('verifyTrigramMap').innerHTML=m;

    document.querySelectorAll('.mapping-table tbody tr').forEach(r=>r.classList.remove('active-row'));
    const rows=document.querySelectorAll('.mapping-table tbody tr');
    if (data.upperIndex>=1&&data.upperIndex<=8) rows[data.upperIndex-1].classList.add('active-row');
    if (data.lowerIndex>=1&&data.lowerIndex<=8&&data.lowerIndex!==data.upperIndex) rows[data.lowerIndex-1].classList.add('active-row');
}

function getHistory() { try{return JSON.parse(localStorage.getItem(HISTORY_KEY))||[]}catch{return[]} }
function saveToHistory(data) {
    const h=getHistory();
    h.unshift({id:Date.now(),question:data.question,timestamp:data.timestamp,hexagramName:data.original.name,fortune:data.original.fortune,data});
    if (h.length>50) h.pop();
    localStorage.setItem(HISTORY_KEY,JSON.stringify(h));
}
function toggleHistory() {
    const p=document.getElementById('historyPanel');
    if (p.classList.contains('hidden')) { renderHistoryList(); p.classList.remove('hidden'); }
    else p.classList.add('hidden');
}
function renderHistoryList() {
    const list=document.getElementById('historyList'), h=getHistory();
    if (!h.length) { list.innerHTML='<p class="history-empty">尚無紀錄</p>'; return; }
    list.innerHTML=h.map(item=>{
        const fc=getFortuneClass(item.fortune);
        return `<div class="history-item" onclick="loadHistory(${item.id})">
            <div class="history-item-info"><div class="history-item-question">${esc(item.question)}</div><div class="history-item-meta">${item.timestamp}</div></div>
            <div class="history-item-hexagram">${item.hexagramName}</div>
            <span class="history-item-fortune ${fc}">${item.fortune}</span>
            <button class="history-item-delete" onclick="event.stopPropagation();deleteHistory(${item.id})" title="刪除">✕</button></div>`;
    }).join('');
}
function loadHistory(id) { const r=getHistory().find(h=>h.id===id); if(r){displayResult(r.data);toggleHistory();} }
function deleteHistory(id) { localStorage.setItem(HISTORY_KEY,JSON.stringify(getHistory().filter(h=>h.id!==id))); renderHistoryList(); }
function esc(t) { const d=document.createElement('div'); d.textContent=t; return d.innerHTML; }

document.addEventListener('DOMContentLoaded',()=>{
    ['ud1','ud2','ud3','ld1','ld2','ld3'].forEach(id=>renderBinaryDice(document.getElementById(id),rand12()));
    renderStandardDice(document.getElementById('md'),Math.floor(Math.random()*6)+1);
});
