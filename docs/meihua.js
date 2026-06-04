const MH_KEY='meihua_history';
let mhRolling=false;
const MH_TRI_LINES={1:[1,1,1],2:[0,1,1],3:[1,0,1],4:[0,0,1],5:[1,1,0],6:[0,1,0],7:[1,0,0],8:[0,0,0]};
const MH_TRI_NAME={1:'乾',2:'兌',3:'離',4:'震',5:'巽',6:'坎',7:'艮',8:'坤'};
const MH_TRI_NATURE={1:'天',2:'澤',3:'火',4:'雷',5:'風',6:'水',7:'山',8:'地'};
const MH_HEX=(()=>{
  const h={};
  const add=(u,l,n,fort,desc,plain,cls,adv)=>{
    h[u+','+l]={name:n,fortune:fort,description:desc,plainExplanation:plain,classicText:cls,advice:adv};
  };
  add(1,1,'乾為天','大吉','乾卦，象徵天，剛健中正，萬物之始。','這是一個充滿力量與創造力的時刻。你目前的狀態如同天空般遼闊無限，擁有強大的行動力與領導能力。現在適合積極進取，大膽地去追求你的目標。但要注意保持謙遜，過於剛強反而容易折斷。','乾：元亨利貞。《象》曰：天行健，君子以自強不息。','積極行動，保持剛健中正的態度，但要懂得適時收斂。');
  add(2,1,'澤天夬','吉','夬卦，澤水上升於天，決斷之象。','現在是做出重大決定的時候了。你面前有需要果斷處理的事情，猶豫不決只會讓問題惡化。相信自己的判斷，勇敢地做出選擇。','夬：揚于王庭，孚號有厲。','果斷決策，光明正大地處理問題。');
  add(3,1,'火天大有','大吉','大有卦，火在天上，光明普照，豐盛之象。','恭喜！你正處於一個豐收和成功的時期。你的努力終於得到了回報，各方面都有很好的發展。','大有：元亨。','享受成功的果實，但要保持謙遜。');
  add(4,1,'雷天大壯','吉','大壯卦，雷在天上，聲威赫赫，壯盛之象。','你現在充滿了力量和能量，正是大展身手的好時機。但要記住，真正的強大不僅在於力量，更在於知道何時使用力量。','大壯：利貞。','善用你的力量，但要遵守規則。');
  add(5,1,'風天小畜','平','小畜卦，風行天上，密雲不雨。','目前的情況是積蓄力量的階段。雖然還不能大展宏圖，但這是一個很好的準備時期。','小畜：亨。密雲不雨。','耐心蓄積，等待時機成熟。');
  add(6,1,'水天需','吉','需卦，雲上於天，等待之象。','現在需要耐心等待。你想要的事情會成功，但不是現在。','需：有孚，光亨，貞吉。','耐心等待，做好準備。');
  add(7,1,'山天大畜','大吉','大畜卦，天在山中，大有蓄積之象。','你已經累積了豐富的資源和能力，現在是一個蓄勢待發的時期。','大畜：利貞，不家食吉。','善用蓄積的實力。');
  add(8,1,'地天泰','大吉','泰卦，天地交泰，萬物通暢之象。','這是極為吉祥的時刻！天地和諧，萬事通順。','泰：小往大來，吉亨。','大吉大利，積極行動。');
  add(1,2,'天澤履','平','履卦，如履虎尾，小心謹慎之象。','你正處於一個需要格外小心的環境中。','履：履虎尾，不咥人，亨。','小心謹慎，以禮待人。');
  add(2,2,'兌為澤','吉','兌卦，澤水相連，喜悅之象。','這是一個充滿喜悅和和諧的時期。','兌：亨，利貞。','保持喜悅的心情。');
  add(3,2,'火澤睽','平','睽卦，火焰向上澤水向下，相違之象。','目前可能面臨一些分歧或矛盾。','睽：小事吉。','求同存異。');
  add(4,2,'雷澤歸妹','平','歸妹卦，雷動澤悅，婚嫁之象。','這個卦象暗示著一段新的關係或合作的開始。','歸妹：征凶，无攸利。','謹慎處理新的關係。');
  add(5,2,'風澤中孚','吉','中孚卦，風行澤上，誠信之象。','這是一個強調誠信的時期。','中孚：豚魚吉。','以誠待人。');
  add(6,2,'水澤節','平','節卦，水在澤上，節制之象。','現在是需要節制和自律的時候。','節：亨。苦節不可貞。','適度節制。');
  add(7,2,'山澤損','平','損卦，山下有澤，減損之象。','這個時期可能需要你做出一些犧牲或讓步。','損：有孚，元吉。','適當讓步。');
  add(8,2,'地澤臨','吉','臨卦，地在澤上，親臨之象。','這是一個充滿希望和機遇的時期。','臨：元亨，利貞。','把握機遇。');
  add(1,3,'天火同人','吉','同人卦，天與火同，志同道合之象。','這是一個適合與他人合作和社交的時期。','同人于野，亨。','團結合作。');
  add(2,3,'澤火革','吉','革卦，澤中有火，變革之象。','變革的時刻已經到來！','革：已日乃孚，元亨利貞。','順應變革。');
  add(3,3,'離為火','吉','離卦，光明相繼，依附之象。','你現在處於一個光明和清晰的狀態。','離：利貞，亨。','保持光明正大。');
  add(4,3,'雷火豐','大吉','豐卦，雷電皆至，豐盛之象。','你正處於人生的豐盛時期！','豐：亨。王假之，勿憂。','享受豐盛，居安思危。');
  add(5,3,'風火家人','吉','家人卦，風自火出，家庭之象。','家庭和人際關係是現在的重心。','家人：利女貞。','重視家庭。');
  add(6,3,'水火既濟','吉','既濟卦，水在火上，事已成就之象。','恭喜！你之前的努力已經取得了成果。','既濟：亨小，利貞。','享受成果，居安思危。');
  add(7,3,'山火賁','平','賁卦，山下有火，文飾之象。','現在是注重外在形象和內在修養的時候。','賁：亨。小利有攸往。','注重修養。');
  add(8,3,'地火明夷','凶','明夷卦，火入地中，光明受傷之象。','你可能正在經歷一段困難或黑暗的時期。','明夷：利艱利艱貞。','韜光養晦。');
  add(1,4,'天雷无妄','吉','无妄卦，天下雷行，无妄之象。','這是一個強調自然和真實的時期。','无妄：元亨利貞。','順其自然。');
  add(2,4,'澤雷隨','吉','隨卦，澤中有雷，隨從之象。','現在是適合順應時勢的時候。','隨：元亨利貞，无咎。','隨機應變。');
  add(3,4,'火雷噬嗑','平','噬嗑卦，雷電交合，決斷之象。','你面前有需要解決的障礙。','噬嗑：亨。利用獄。','果斷解決問題。');
  add(4,4,'震為雷','平','震卦，重雷震動，震驚之象。','可能會有意想不到的事情發生。','震：亨。震來虩虩。','保持冷靜。');
  add(5,4,'風雷益','大吉','益卦，風雷相益，增益之象。','這是一個充滿正面能量的時期！','益：利有攸往。','積極進取。');
  add(6,4,'水雷屯','平','屯卦，雷雨交加，草創之象。','你正處於事業或計劃的初始階段。','屯：元亨利貞。','堅持不懈。');
  add(7,4,'山雷頤','吉','頤卦，山下有雷，養身之象。','現在是注重自我照顧和修養的時候。','頤：貞吉。','注重養生。');
  add(8,4,'地雷復','吉','復卦，地中有雷，復返之象。','好消息！你之前經歷的困難即將結束。','復：亨。出入无疾。','把握復甦時機。');
  add(1,5,'天風姤','平','姤卦，天下有風，相遇之象。','你可能會遇到一些意想不到的機會。','姤：女壯，勿用取女。','把握機會，謹慎選擇。');
  add(2,5,'澤風大過','凶','大過卦，澤水滅木，大有過失之象。','你可能正面臨一些超出常規的壓力。','大過：棟橈。','勇於突破常規。');
  add(3,5,'火風鼎','大吉','鼎卦，木上有火，鼎新之象。','這是一個適合創新和變革的時期。','鼎：元吉，亨。','大膽創新。');
  add(4,5,'雷風恒','吉','恒卦，雷風相與，恒久之象。','這個時期強調的是持久和堅持。','恒：亨，无咎，利貞。','堅持不懈。');
  add(5,5,'巽為風','吉','巽卦，風行無阻，順從之象。','現在適合以柔克剛。','巽：小亨，利有攸往。','以柔克剛。');
  add(6,5,'水風井','吉','井卦，木上有水，養人之象。','這個時期提醒你要注重根本。','井：改邑不改井。','注重根本。');
  add(7,5,'山風蠱','平','蠱卦，山下有風，整飭之象。','有些問題需要你去處理和修復。','蠱：元亨，利涉大川。','積極修復問題。');
  add(8,5,'地風升','大吉','升卦，地中生木，上升之象。','你的事業或生活正在穩步上升！','升：元亨。用見大人。','穩步前進。');
  add(1,6,'天水訟','凶','訟卦，天與水違行，爭訟之象。','可能會有一些爭執或糾紛出現。','訟：有孚窒惕，中吉。','以和為貴。');
  add(2,6,'澤水困','凶','困卦，澤中无水，困窮之象。','你可能會感覺資源不足或受到限制。','困：亨，貞，大人吉。','保持樂觀。');
  add(3,6,'火水未濟','平','未濟卦，火在水上，事未成之象。','事情還沒有完成，還需要繼續努力。','未濟：亨。小狐汔濟。','繼續努力。');
  add(4,6,'雷水解','吉','解卦，雷雨作，解除之象。','好消息！之前困擾你的問題即將得到解決。','解：利西南。','把握解決時機。');
  add(5,6,'風水渙','平','渙卦，風行水上，渙散之象。','現在可能面臨一些分散或流失的情況。','渙：亨。王假有廟。','重新凝聚力量。');
  add(6,6,'坎為水','凶','坎卦，重水相疊，險陷之象。','你可能正處於一個充滿挑戰和困難的時期。','習坎：有孚，維心亨。','保持堅韌。');
  add(7,6,'山水蒙','平','蒙卦，山下有泉，蒙昧之象。','你可能對某些事情還不太了解或迷茫。','蒙：亨。匪我求童蒙。','虛心學習。');
  add(8,6,'地水師','平','師卦，地中有水，師旅之象。','現在可能需要你發揮領導能力。','師：貞，丈人吉。','發揮領導力。');
  add(1,7,'天山遁','平','遁卦，天下有山，退避之象。','現在可能是需要暫時退讓的時候。','遁：亨，小利貞。','策略性退讓。');
  add(2,7,'澤山咸','吉','咸卦，山上有澤，感應之象。','這是一個適合建立情感連結的時期。','咸：亨，利貞。取女吉。','用心感受。');
  add(3,7,'火山旅','平','旅卦，山上有火，旅行之象。','你可能處於一個不穩定或過渡的時期。','旅：小亨，旅貞吉。','保持靈活。');
  add(4,7,'雷山小過','平','小過卦，山上有雷，小有過越之象。','這個時期要小心謹慎。','小過：亨，利貞。可小事。','小心謹慎。');
  add(5,7,'風山漸','吉','漸卦，山上有木，漸進之象。','你的發展是穩定而漸進的。','漸：女歸吉，利貞。','循序漸進。');
  add(6,7,'水山蹇','凶','蹇卦，山上有水，艱難之象。','你可能正面臨一些困難和障礙。','蹇：利西南，不利東北。','尋求幫助。');
  add(7,7,'艮為山','平','艮卦，山山相疊，止而不動之象。','現在是一個需要停下來思考的時候。','艮其背，不獲其身。','停下來思考。');
  add(8,7,'地山謙','吉','謙卦，地中有山，謙虛之象。','這是一個強調謙遜美德的時期。','謙：亨，君子有終。','保持謙遜。');
  add(1,8,'天地否','凶','否卦，天地不交，閉塞之象。','目前的狀況可能不太理想。','否之匪人，不利君子貞。','保持忍耐。');
  add(2,8,'澤地萃','吉','萃卦，澤上於地，聚集之象。','這是一個適合聚集和團結的時期。','萃：亨。王假有廟。','團結他人。');
  add(3,8,'火地晉','大吉','晉卦，明出地上，進展之象。','你的事業或生活正在穩步前進！','晉：康侯用錫馬蕃庶。','積極進取。');
  add(4,8,'雷地豫','吉','豫卦，雷出地奮，喜悅之象。','這是一個充滿活力和喜悅的時期。','豫：利建侯行師。','享受生活。');
  add(5,8,'風地觀','平','觀卦，風行地上，觀察之象。','現在是一個觀察和思考的時期。','觀：盥而不薦。','仔細觀察。');
  add(6,8,'水地比','吉','比卦，水與地相親，親比之象。','這是一個適合建立親密關係和合作的時期。','比：吉。原筮元永貞。','建立良好關係。');
  add(7,8,'山地剝','凶','剝卦，山附於地，剝落之象。','你可能正在經歷一些損失或衰退。','剝：不利有攸往。','保守行事。');
  add(8,8,'坤為地','吉','坤卦，地勢坤厚，承載萬物之象。','這是一個需要包容和承載的時期。','坤：元亨，利牝馬之貞。','以柔克剛。');
  return h;
})();

function mhInit(){
  ['ud1','ud2','ud3','ld1','ld2','ld3'].forEach(id=>{const el=document.getElementById(id);if(el)mhRenderBin(el,rand12())});
  const md=document.getElementById('md');if(md)mhRenderStd(md,Math.floor(Math.random()*6)+1);
}
function rand12(){return Math.random()<.5?1:2}
function mhRenderBin(el,v){const f=el.querySelector('.dice-face');if(v===1)f.innerHTML='<div class="binary-value"><span class="binary-yang">1</span><div class="binary-yang-sym"><div class="binary-yang-bar"></div></div></div>';else f.innerHTML='<div class="binary-value"><span class="binary-yang">2</span><div class="binary-yin-sym"><div class="binary-yin-bar"></div><div class="binary-yin-bar"></div></div></div>'}
function mhRenderStd(el,v){el.querySelector('.dice-face').innerHTML=`<div class="standard-value">${v}</div>`}

function mhStart(){
  if(mhRolling)return;mhRolling=true;
  const btn=document.getElementById('btnDivine');btn.disabled=true;btn.textContent='卦象生成中...';
  const dice=['ud1','ud2','ud3','ld1','ld2','ld3','md'].map(id=>document.getElementById(id));
  dice.forEach(d=>d.classList.add('rolling'));
  let cnt=0;
  const iv=setInterval(()=>{
    mhRenderBin(dice[0],rand12());mhRenderBin(dice[1],rand12());mhRenderBin(dice[2],rand12());
    mhRenderBin(dice[3],rand12());mhRenderBin(dice[4],rand12());mhRenderBin(dice[5],rand12());
    mhRenderStd(dice[6],Math.floor(Math.random()*6)+1);
    if(++cnt>=15){clearInterval(iv);mhFinish(dice,btn)}
  },100);
}

function mhFinish(dice,btn){
  const u=[rand12(),rand12(),rand12()],l=[rand12(),rand12(),rand12()],ml=Math.floor(Math.random()*6)+1;
  dice.forEach(d=>d.classList.remove('rolling'));
  mhRenderBin(dice[0],u[0]);mhRenderBin(dice[1],u[1]);mhRenderBin(dice[2],u[2]);
  mhRenderBin(dice[3],l[0]);mhRenderBin(dice[4],l[1]);mhRenderBin(dice[5],l[2]);
  mhRenderStd(dice[6],ml);
  const uy=u.map(v=>v===1?1:0),ly=l.map(v=>v===1?1:0);
  const ui=mhLinesToTri(uy),li=mhLinesToTri(ly);
  const orig=MH_HEX[ui+','+li];
  const all=[...ly,...uy];all[ml-1]=all[ml-1]===1?0:1;
  const ci=mhLinesToTri(all.slice(3,6)),cli=mhLinesToTri(all.slice(0,3));
  const changed=MH_HEX[ci+','+cli];
  if(changed){changed._upper=ci;changed._lower=cli}
  const data={u,l,ml,ui,li,orig,changed,question:document.getElementById('mhQuestion').value.trim()||'（未輸入問事）',timestamp:new Date().toLocaleString('zh-TW'),
    upperInfo:{n:ui,name:MH_TRI_NAME[ui],nature:MH_TRI_NATURE[ui]},lowerInfo:{n:li,name:MH_TRI_NAME[li],nature:MH_TRI_NATURE[li]}};
  mhSaveHistory(data);mhDisplay(data);
  mhRolling=false;btn.disabled=false;btn.textContent='誠心問卦';
}

function mhLinesToTri(ls){const m=[[1,1,1],[0,1,1],[1,0,1],[0,0,1],[1,1,0],[0,1,0],[1,0,0],[0,0,0]];for(let i=0;i<8;i++)if(m[i][0]===ls[0]&&m[i][1]===ls[1]&&m[i][2]===ls[2])return i+1;return 1}

function mhRenderHexLines(lines,mi){let h='';for(let i=5;i>=0;i--){const c=i===mi?'moving':'';if(lines[i]===1)h+=`<div class="hex-line yang ${c}"></div>`;else h+=`<div class="hex-line yin ${c}"><div class="seg"></div><div class="seg"></div></div>`}return h}
function mhGetLines(u,l){return[...MH_TRI_LINES[l],...MH_TRI_LINES[u]]}
function mhDiceSym(v){return v===1?'━━━':'━ ━'}

function mhDisplay(d){
  document.getElementById('mhPlaceholder').classList.add('hidden');
  document.getElementById('mhResult').classList.remove('hidden');
  document.getElementById('mhRQ').textContent='問：'+d.question;
  const ol=mhGetLines(d.ui,d.li);
  document.getElementById('mhOS').innerHTML=mhRenderHexLines(ol,d.ml-1);
  document.getElementById('mhON').textContent=d.orig.name;
  document.getElementById('mhOT').textContent=d.upperInfo.name+d.upperInfo.nature+' / '+d.lowerInfo.name+d.lowerInfo.nature;
  const of=document.getElementById('mhOF');of.textContent=d.orig.fortune;of.className='fortune '+getFortuneClass(d.orig.fortune);
  document.getElementById('mhML').textContent=d.ml;
  document.getElementById('mhDesc').textContent=d.orig.description;
  document.getElementById('mhPlain').textContent=d.orig.plainExplanation;
  document.getElementById('mhClassic').textContent=d.orig.classicText;
  document.getElementById('mhAdvice').textContent=d.orig.advice;
  const cg=document.getElementById('mhChangedGrid');
  if(d.changed){
    const cl=mhGetLines(d.changed._upper||d.ui,d.changed._lower||d.li);
    document.getElementById('mhCS').innerHTML=mhRenderHexLines(cl,-1);
    document.getElementById('mhCN').textContent=d.changed.name;
    document.getElementById('mhCT').textContent=MH_TRI_NAME[d.changed._upper]+MH_TRI_NATURE[d.changed._upper]+' / '+MH_TRI_NAME[d.changed._lower]+MH_TRI_NATURE[d.changed._lower];
    const cf=document.getElementById('mhCF');cf.textContent=d.changed.fortune;cf.className='fortune '+getFortuneClass(d.changed.fortune);
    document.getElementById('mhCDesc').textContent=d.changed.description;
    document.getElementById('mhCPlain').textContent=d.changed.plainExplanation;
    document.getElementById('mhCAdvice').textContent=d.changed.advice;
    cg.classList.remove('hidden');
  }else{cg.classList.add('hidden')}
  mhVerify(d);
}

function mhVerify(d){
  const{u,ml,upperInfo,lowerInfo}=d;
  let h=`<div class="step"><span class="lbl">上卦：</span>${u[0]}(下) ${u[1]}(中) ${u[2]}(上) → ${mhDiceSym(u[0])} ${mhDiceSym(u[1])} ${mhDiceSym(u[2])} → <span class="hl">${upperInfo.name}（${upperInfo.nature}）</span></div>`;
  h+=`<div class="step"><span class="lbl">下卦：</span>${d.l[0]}(下) ${d.l[1]}(中) ${d.l[2]}(上) → ${mhDiceSym(d.l[0])} ${mhDiceSym(d.l[1])} ${mhDiceSym(d.l[2])} → <span class="hl">${lowerInfo.name}（${lowerInfo.nature}）</span></div>`;
  h+=`<div class="step"><span class="lbl">動爻：</span><span class="hl">第 ${ml} 爻</span> 變動</div>`;
  document.getElementById('mhV1').innerHTML=`<div class="verify-steps">${h}</div>`;
  const ub=`${u[2]===1?'1':'0'}${u[1]===1?'1':'0'}${u[0]===1?'1':'0'}`,lb=`${d.l[2]===1?'1':'0'}${d.l[1]===1?'1':'0'}${d.l[0]===1?'1':'0'}`;
  let m=`<div class="step"><span class="lbl">上卦爻線：</span>上${mhDiceSym(u[2])} 中${mhDiceSym(u[1])} 下${mhDiceSym(u[0])} → 二進位 <span class="hl">${ub}</span> → <span class="hl">${MH_TRI_NAME[d.ui]}${MH_TRI_NATURE[d.ui]}</span></div>`;
  m+=`<div class="step"><span class="lbl">下卦爻線：</span>上${mhDiceSym(d.l[2])} 中${mhDiceSym(d.l[1])} 下${mhDiceSym(d.l[0])} → 二進位 <span class="hl">${lb}</span> → <span class="hl">${MH_TRI_NAME[d.li]}${MH_TRI_NATURE[d.li]}</span></div>`;
  m+=`<div class="step"><span class="lbl">合成：</span>${MH_TRI_NAME[d.ui]}${MH_TRI_NATURE[d.ui]}＋${MH_TRI_NAME[d.li]}${MH_TRI_NATURE[d.li]} → <span class="hl">${d.orig.name}</span></div>`;
  if(d.changed)m+=`<div class="step"><span class="lbl">變卦：</span>第${ml}爻翻轉 → <span class="hl">${d.changed.name}</span></div>`;
  document.getElementById('mhV2').innerHTML=`<div class="verify-steps">${m}</div>`;
}

function mhSaveHistory(d){const h=JSON.parse(localStorage.getItem(MH_KEY)||'[]');h.unshift({id:Date.now(),q:d.question,t:d.timestamp,hn:d.orig.name,f:d.orig.fortune,d});if(h.length>50)h.pop();localStorage.setItem(MH_KEY,JSON.stringify(h))}
function mhToggleHistory(){const p=document.getElementById('mhHistoryPanel');if(p.classList.contains('hidden')){mhRenderHistory();p.classList.remove('hidden')}else p.classList.add('hidden')}
function mhRenderHistory(){const list=document.getElementById('mhHistoryList'),h=JSON.parse(localStorage.getItem(MH_KEY)||'[]');if(!h.length){list.innerHTML='<p class="empty-text">尚無紀錄</p>';return}list.innerHTML=h.map(i=>`<div class="history-item" onclick="mhLoadHistory(${i.id})"><div class="history-item-info"><div class="history-item-q">${esc(i.q)}</div><div class="history-item-meta">${i.t}</div></div><div class="history-item-hex">${i.hn}</div><span class="fortune ${getFortuneClass(i.f)}" style="font-size:.7rem;padding:1px 8px">${i.f}</span><button class="history-item-del" onclick="event.stopPropagation();mhDelHistory(${i.id})">✕</button></div>`).join('')}
function mhLoadHistory(id){const r=(JSON.parse(localStorage.getItem(MH_KEY)||'[]')).find(h=>h.id===id);if(r){mhDisplay(r.d);mhToggleHistory()}}
function mhDelHistory(id){localStorage.setItem(MH_KEY,JSON.stringify((JSON.parse(localStorage.getItem(MH_KEY)||'[]')).filter(h=>h.id!==id)));mhRenderHistory()}
