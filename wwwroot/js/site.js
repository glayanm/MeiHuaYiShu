let isRolling = false;

const trigramLines = {
    1: [1, 1, 1], 2: [0, 1, 1], 3: [1, 0, 1], 4: [0, 0, 1],
    5: [1, 1, 0], 6: [0, 1, 0], 7: [1, 0, 0], 8: [0, 0, 0]
};

const trigramNames = {
    1: '乾', 2: '兌', 3: '離', 4: '震',
    5: '巽', 6: '坎', 7: '艮', 8: '坤'
};
const trigramNatures = {
    1: '天', 2: '澤', 3: '火', 4: '雷',
    5: '風', 6: '水', 7: '山', 8: '地'
};

const HISTORY_KEY = 'meihua_yishu_history';

// ===== Dice Rendering =====

function renderBinaryDice(diceEl, value) {
    const face = diceEl.querySelector('.dice-face');
    if (value === 1) {
        face.innerHTML = `
            <div class="binary-value">
                <span class="binary-yang">1</span>
                <div class="binary-yang-symbol">
                    <div class="binary-yang-bar"></div>
                </div>
            </div>`;
    } else {
        face.innerHTML = `
            <div class="binary-value">
                <span class="binary-yang">2</span>
                <div class="binary-yin-symbol">
                    <div class="binary-yin-bar"></div>
                    <div class="binary-yin-bar"></div>
                </div>
            </div>`;
    }
}

function renderStandardDice(diceEl, value) {
    const face = diceEl.querySelector('.dice-face');
    face.innerHTML = `<div class="standard-value">${value}</div>`;
}

// ===== Hexagram Rendering =====

function getFortuneClass(fortune) {
    if (fortune.includes('大吉')) return 'great';
    if (fortune.includes('吉')) return 'good';
    if (fortune.includes('凶')) return 'bad';
    return 'neutral';
}

function renderHexagramLines(lines, movingLineIndex) {
    let html = '';
    for (let i = 5; i >= 0; i--) {
        const isMoving = (i === movingLineIndex);
        const cls = isMoving ? 'moving' : '';
        if (lines[i] === 1) {
            html += `<div class="hex-line yang ${cls}"></div>`;
        } else {
            html += `<div class="hex-line yin ${cls}"><div class="segment"></div><div class="segment"></div></div>`;
        }
    }
    return html;
}

function getHexagramLines(upperNum, lowerNum) {
    const lower = trigramLines[lowerNum] || [0, 0, 0];
    const upper = trigramLines[upperNum] || [0, 0, 0];
    return [...lower, ...upper];
}

// ===== Divination =====

function startDivination() {
    if (isRolling) return;
    isRolling = true;

    const btn = document.getElementById('btnDivine');
    btn.disabled = true;
    btn.textContent = '卦象生成中...';

    const allDice = [
        document.getElementById('ud1'),
        document.getElementById('ud2'),
        document.getElementById('ud3'),
        document.getElementById('ld1'),
        document.getElementById('ld2'),
        document.getElementById('ld3'),
        document.getElementById('md')
    ];
    allDice.forEach(d => d.classList.add('rolling'));

    let rollCount = 0;
    const rollInterval = setInterval(() => {
        renderBinaryDice(allDice[0], Math.random() < 0.5 ? 1 : 2);
        renderBinaryDice(allDice[1], Math.random() < 0.5 ? 1 : 2);
        renderBinaryDice(allDice[2], Math.random() < 0.5 ? 1 : 2);
        renderBinaryDice(allDice[3], Math.random() < 0.5 ? 1 : 2);
        renderBinaryDice(allDice[4], Math.random() < 0.5 ? 1 : 2);
        renderBinaryDice(allDice[5], Math.random() < 0.5 ? 1 : 2);
        renderStandardDice(allDice[6], Math.floor(Math.random() * 6) + 1);
        rollCount++;
        if (rollCount >= 15) {
            clearInterval(rollInterval);
            callDivinationAPI(allDice, btn);
        }
    }, 100);
}

async function callDivinationAPI(allDice, btn) {
    try {
        const resp = await fetch('/api/divination', { method: 'POST' });
        const data = await resp.json();

        allDice.forEach(d => d.classList.remove('rolling'));

        renderBinaryDice(allDice[0], data.upperDice[0]);
        renderBinaryDice(allDice[1], data.upperDice[1]);
        renderBinaryDice(allDice[2], data.upperDice[2]);
        renderBinaryDice(allDice[3], data.lowerDice[0]);
        renderBinaryDice(allDice[4], data.lowerDice[1]);
        renderBinaryDice(allDice[5], data.lowerDice[2]);
        renderStandardDice(allDice[6], data.movingLineDice);

        const question = document.getElementById('questionInput').value.trim();
        data.question = question || '（未輸入問事）';
        data.timestamp = new Date().toLocaleString('zh-TW');

        saveToHistory(data);
        displayResult(data);
    } catch (err) {
        console.error('Divination API error:', err);
    } finally {
        isRolling = false;
        btn.disabled = false;
        btn.textContent = '誠心問卦';
    }
}

// ===== Display Result =====

function diceToLineSymbol(v) { return v === 1 ? '━━━' : '━ ━'; }

function displayResult(data) {
    document.getElementById('placeholder').style.display = 'none';
    const resultContent = document.getElementById('resultContent');
    resultContent.classList.remove('hidden');

    document.getElementById('resultQuestion').textContent = '問：' + data.question;

    const origLines = getHexagramLines(data.upperTrigramInfo.number, data.lowerTrigramInfo.number);
    document.getElementById('originalSymbol').innerHTML = renderHexagramLines(origLines, data.movingLine - 1);
    document.getElementById('originalName').textContent = data.original.name;
    document.getElementById('originalTrigrams').textContent =
        `${data.upperTrigramInfo.name}${data.upperTrigramInfo.nature} / ${data.lowerTrigramInfo.name}${data.lowerTrigramInfo.nature}`;

    const origFortune = document.getElementById('originalFortune');
    origFortune.textContent = data.original.fortune;
    origFortune.className = 'fortune-badge ' + getFortuneClass(data.original.fortune);

    document.getElementById('movingLineNum').textContent = data.movingLine;

    document.getElementById('hexDescription').textContent = data.original.description;
    document.getElementById('hexPlainExplanation').textContent = data.original.plainExplanation;
    document.getElementById('hexClassicText').textContent = data.original.classicText;
    document.getElementById('hexAdvice').textContent = data.original.advice;

    const changedDiv = document.getElementById('changedInterpretation');
    if (data.changed) {
        const chLines = getHexagramLines(data.changed.upperTrigram, data.changed.lowerTrigram);
        document.getElementById('changedSymbol').innerHTML = renderHexagramLines(chLines, -1);
        document.getElementById('changedName').textContent = data.changed.name;

        const chTrigramNames = {
            1: '乾天', 2: '兌澤', 3: '離火', 4: '震雷',
            5: '巽風', 6: '坎水', 7: '艮山', 8: '坤地'
        };
        document.getElementById('changedTrigrams').textContent =
            `${chTrigramNames[data.changed.upperTrigram] || ''} / ${chTrigramNames[data.changed.lowerTrigram] || ''}`;

        const chFortune = document.getElementById('changedFortune');
        chFortune.textContent = data.changed.fortune;
        chFortune.className = 'fortune-badge ' + getFortuneClass(data.changed.fortune);

        document.getElementById('changedDescription').textContent = data.changed.description;
        document.getElementById('changedPlainExplanation').textContent = data.changed.plainExplanation;
        document.getElementById('changedAdvice').textContent = data.changed.advice;

        changedDiv.style.display = 'grid';
    } else {
        changedDiv.style.display = 'none';
    }

    displayVerification(data);
}

// ===== Verification =====

function displayVerification(data) {
    const ud = data.upperDice;
    const ld = data.lowerDice;
    const ml = data.movingLineDice;

    const diceSteps = document.getElementById('verifyDiceSteps');
    let dhtml = '';

    dhtml += `<div class="step"><span class="label">上卦三骰：</span>`;
    dhtml += `<span class="value">${ud[0]}(下) ${ud[1]}(中) ${ud[2]}(上) → `;
    dhtml += `${diceToLineSymbol(ud[0])} ${diceToLineSymbol(ud[1])} ${diceToLineSymbol(ud[2])}`;
    dhtml += ` → <span class="highlight">${data.upperTrigramInfo.name}（${data.upperTrigramInfo.nature}）</span></span></div>`;

    dhtml += `<div class="step"><span class="label">下卦三骰：</span>`;
    dhtml += `<span class="value">${ld[0]}(下) ${ld[1]}(中) ${ld[2]}(上) → `;
    dhtml += `${diceToLineSymbol(ld[0])} ${diceToLineSymbol(ld[1])} ${diceToLineSymbol(ld[2])}`;
    dhtml += ` → <span class="highlight">${data.lowerTrigramInfo.name}（${data.lowerTrigramInfo.nature}）</span></span></div>`;

    dhtml += `<div class="step"><span class="label">動爻骰：</span>`;
    dhtml += `<span class="value"><span class="highlight">第 ${ml} 爻</span> 變動</span></div>`;

    diceSteps.innerHTML = dhtml;

    const mapSteps = document.getElementById('verifyTrigramMap');
    let mhtml = '';

    const uBinary = `${ud[2]===1?'1':'0'}${ud[1]===1?'1':'0'}${ud[0]===1?'1':'0'}`;
    const lBinary = `${ld[2]===1?'1':'0'}${ld[1]===1?'1':'0'}${ld[0]===1?'1':'0'}`;

    mhtml += `<div class="step"><span class="label">上卦爻線：</span>`;
    mhtml += `<span class="value">上${diceToLineSymbol(ud[2])} 中${diceToLineSymbol(ud[1])} 下${diceToLineSymbol(ud[0])}`;
    mhtml += ` → 二進位 <span class="highlight">${uBinary}</span>`;
    mhtml += ` → 先天序 <span class="highlight">${data.upperIndex}</span>`;
    mhtml += ` → <span class="highlight">${trigramNames[data.upperIndex]}${trigramNatures[data.upperIndex]}</span></span></div>`;

    mhtml += `<div class="step"><span class="label">下卦爻線：</span>`;
    mhtml += `<span class="value">上${diceToLineSymbol(ld[2])} 中${diceToLineSymbol(ld[1])} 下${diceToLineSymbol(ld[0])}`;
    mhtml += ` → 二進位 <span class="highlight">${lBinary}</span>`;
    mhtml += ` → 先天序 <span class="highlight">${data.lowerIndex}</span>`;
    mhtml += ` → <span class="highlight">${trigramNames[data.lowerIndex]}${trigramNatures[data.lowerIndex]}</span></span></div>`;

    mhtml += `<div class="step"><span class="label">合成卦象：</span>`;
    mhtml += `<span class="value">${trigramNames[data.upperIndex]}${trigramNatures[data.upperIndex]}（上）＋ ${trigramNames[data.lowerIndex]}${trigramNatures[data.lowerIndex]}（下）`;
    mhtml += ` → <span class="highlight">${data.original.name}</span></span></div>`;

    if (data.changed) {
        const chUpperName = trigramNames[data.changed.upperTrigram] + trigramNatures[data.changed.upperTrigram];
        const chLowerName = trigramNames[data.changed.lowerTrigram] + trigramNatures[data.changed.lowerTrigram];
        mhtml += `<div class="step"><span class="label">動爻變卦：</span>`;
        mhtml += `<span class="value">第${ml}爻翻轉 → ${chUpperName}（上）＋ ${chLowerName}（下）`;
        mhtml += ` → <span class="highlight">${data.changed.name}</span></span></div>`;
    }

    mapSteps.innerHTML = mhtml;

    const rows = document.querySelectorAll('.mapping-table tbody tr');
    rows.forEach(r => r.classList.remove('active-row'));
    if (data.upperIndex >= 1 && data.upperIndex <= 8) {
        rows[data.upperIndex - 1].classList.add('active-row');
    }
    if (data.lowerIndex >= 1 && data.lowerIndex <= 8 && data.lowerIndex !== data.upperIndex) {
        rows[data.lowerIndex - 1].classList.add('active-row');
    }
}

// ===== LocalStorage History =====

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function saveToHistory(data) {
    const history = getHistory();
    const record = {
        id: Date.now(),
        question: data.question,
        timestamp: data.timestamp,
        hexagramName: data.original.name,
        fortune: data.original.fortune,
        data: data
    };
    history.unshift(record);
    if (history.length > 50) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function toggleHistory() {
    const panel = document.getElementById('historyPanel');
    const isHidden = panel.classList.contains('hidden');
    if (isHidden) {
        renderHistoryList();
        panel.classList.remove('hidden');
    } else {
        panel.classList.add('hidden');
    }
}

function renderHistoryList() {
    const list = document.getElementById('historyList');
    const history = getHistory();

    if (history.length === 0) {
        list.innerHTML = '<p class="history-empty">尚無紀錄</p>';
        return;
    }

    let html = '';
    history.forEach(item => {
        const fc = getFortuneClass(item.fortune);
        html += `
            <div class="history-item" onclick="loadHistory(${item.id})">
                <div class="history-item-info">
                    <div class="history-item-question">${escapeHtml(item.question)}</div>
                    <div class="history-item-meta">${item.timestamp}</div>
                </div>
                <div class="history-item-hexagram">${item.hexagramName}</div>
                <span class="history-item-fortune ${fc}">${item.fortune}</span>
                <button class="history-item-delete" onclick="event.stopPropagation(); deleteHistory(${item.id})" title="刪除">✕</button>
            </div>`;
    });
    list.innerHTML = html;
}

function loadHistory(id) {
    const history = getHistory();
    const record = history.find(h => h.id === id);
    if (record) {
        displayResult(record.data);
        toggleHistory();
    }
}

function deleteHistory(id) {
    let history = getHistory();
    history = history.filter(h => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistoryList();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Init =====

document.addEventListener('DOMContentLoaded', () => {
    const allDice = [
        document.getElementById('ud1'),
        document.getElementById('ud2'),
        document.getElementById('ud3'),
        document.getElementById('ld1'),
        document.getElementById('ld2'),
        document.getElementById('ld3'),
        document.getElementById('md')
    ];
    allDice.slice(0, 6).forEach(d => renderBinaryDice(d, Math.random() < 0.5 ? 1 : 2));
    renderStandardDice(allDice[6], Math.floor(Math.random() * 6) + 1);
});
