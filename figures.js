/* 圖版：手寫 SVG，無外部相依。
   語法沿用 lieflat-charts 的 Mono：明度即數據、發絲線、確定性偽隨機、
   全大寫來源行、捲入視野才播並可點擊重播。色彩取自站台的 CSS 變數，
   因此深色模式自動跟著換。 */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function cv(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function el(p,t,a){ var n=document.createElementNS(NS,t); for(var k in a) n.setAttribute(k,a[k]); p.appendChild(n); return n; }
  function txt(p,a,s){ var n=el(p,'text',a); n.textContent=s; return n; }
  function tip(n,s){ var t=document.createElementNS(NS,'title'); t.textContent=s; n.appendChild(t); }
  // 確定性偽隨機：重新整理必須長一樣
  function rnd(i,k){ return Math.abs(((i*73856093)^(k*19349663))%1000)/1000; }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function dly(s){ return reduce ? '' : 'animation-delay:' + s + 's'; }
  function cls(c){ return reduce ? '' : c; }

  // 年 + 月 → x 座標用的小數年
  function yf(y,m){ return y + ((m||1)-1)/12; }

  var FIGS = {};

  /* ── 212 期的分布 ───────────────────────────────────────── */
  FIGS['issue-field'] = function (s) {
    var INK=cv('--amber'), SEC=cv('--text'), MUT=cv('--muted'), GRID=cv('--line'), PAPER=cv('--ground');
    var HELD=[1], CITED={8:'11/5',9:'11/20',28:'9/1',31:'10/17',212:'4/25'};
    var COLS=20, X0=26, Y0=44, DX=18, DY=20;
    for (var n=1; n<=212; n++) {
      var i=n-1, c=i%COLS, r=(i/COLS)|0;
      var x=X0+c*DX, y=Y0+r*DY, d=(r*COLS+c)*0.004;
      if (HELD.indexOf(n)>=0) {
        var sq=el(s,'rect',{x:x-4,y:y-4,width:8,height:8,fill:INK,class:cls('pop'),style:dly(0.2)});
        tip(sq,'第 '+n+' 期 — 館藏（1987-07-20《電視遊樂快訊》創刊號）');
      } else if (CITED[n]) {
        var ci=el(s,'circle',{cx:x,cy:y,r:4,fill:'none',stroke:SEC,'stroke-width':1.3,
          class:cls('pop'),style:dly(0.3+d)});
        tip(ci,'第 '+n+' 期 — 出刊日由別的刊物引述得知（'+CITED[n]+'）');
      } else {
        el(s,'line',{x1:x,y1:y-3.2-rnd(n,3)*1.4,x2:x,y2:y+3.2,stroke:GRID,'stroke-width':0.65,
          class:cls('fade'),style:dly(0.15+d)});
      }
    }
    // 標註線：只標館藏那一期與最後一期
    [[1,'館藏'],[212,'1996-04-25']].forEach(function(p,k){
      var n=p[0], i=n-1, c=i%COLS, r=(i/COLS)|0;
      var x=X0+c*DX, y=Y0+r*DY;
      // 館藏（首行）標上方，No.212（末行）標下方；底注再往下讓開
      var up = k===0, ly = up ? y-14 : y+17;
      el(s,'line',{x1:x,y1:up?y-7:y+7,x2:x,y2:up?ly+4:ly-9,stroke:up?INK:SEC,'stroke-width':0.7,
        class:cls('fade'),style:dly(1.0)});
      txt(s,{x:x,y:ly,'font-size':8.5,'font-weight':600,fill:up?INK:SEC,'text-anchor':'middle',
        style:'paint-order:stroke;stroke:'+PAPER+';stroke-width:3px;'+dly(1.05),
        class:cls('fade')}, p[1]);
    });
    txt(s,{x:200,y:284,'font-size':7.5,'font-weight':600,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.12em',class:cls('fade'),style:dly(1.2)},
      '一格 ＝ 一期 · ■ 館藏 1 · ○ 他刊引述 5 · │ 無材料 206');
  };

  /* ── 館藏 23 冊在時間軸上的分布 ─────────────────────────── */
  FIGS['holdings'] = function (s) {
    var INK=cv('--amber'), SEC=cv('--text'), MUT=cv('--muted'), GRID=cv('--line'), G2=cv('--line'), PAPER=cv('--ground');
    var X0=42, X1=384, Y0=1987, Y1=1996.99;
    function X(t){ return X0+(t-Y0)/(Y1-Y0)*(X1-X0); }
    // 年格線
    for (var y=1987; y<=1996; y++) {
      el(s,'line',{x1:X(y),y1:38,x2:X(y),y2:196,stroke:GRID,'stroke-width':0.6,
        class:cls('fade'),style:dly((y-1987)*0.02)});
      txt(s,{x:X(y+0.5),y:210,'font-size':8,'font-weight':600,fill:MUT,'text-anchor':'middle',
        class:cls('fade'),style:dly((y-1987)*0.02)}, '\u2019'+String(y).slice(2));
    }
    // 本刊 7 冊
    var HON=[[1987,7,'試刊'],[1987,7.5,'創刊'],[1987,11,'情報'],[1988,8.8,'報導000'],
             [1988,9.3,'002'],[1988,10.3,'004'],[1989,10.2,'027']];
    txt(s,{x:X0-6,y:62,'font-size':8,'font-weight':500,fill:SEC,'text-anchor':'end',
      class:cls('fade'),style:dly(0.2)},'本刊');
    HON.forEach(function(b,i){
      var x=X(yf(b[0],b[1]));
      var c=el(s,'circle',{cx:x,cy:58,r:4.2,fill:INK,class:cls('pop'),style:dly(0.25+i*0.05)});
      tip(c,b[2]);
    });
    // 已知年月的特輯 9 冊
    var TOK=[[1991,7,'MD 特輯 4'],[1992,12,'秘技 1'],[1992,12,'秘技 2'],[1992,12,'秘技 3'],
             [1993,7,'MD 特輯 6'],[1994,10,'RPG 特輯 2'],[1995,10,'A’can 特輯'],
             [1996,3,'SLG 特輯 2'],[1996,3,'RPG 特輯 3']];
    txt(s,{x:X0-6,y:106,'font-size':8,'font-weight':500,fill:SEC,'text-anchor':'end',
      class:cls('fade'),style:dly(0.2)},'特輯');
    var seen={};
    TOK.forEach(function(b,i){
      var key=b[0]+'-'+b[1]; seen[key]=(seen[key]||0)+1;
      var x=X(yf(b[0],b[1])), yy=102+(seen[key]-1)*10;
      var c=el(s,'circle',{cx:x,cy:yy,r:4.2,fill:'none',stroke:SEC,'stroke-width':1.3,
        class:cls('pop'),style:dly(0.4+i*0.05)});
      tip(c,b[2]+'（'+b[0]+'-'+String(b[1]).padStart(2,'0')+'）');
    });
    // 年份待考的 7 冊：畫在推定區間上，不給確切點
    txt(s,{x:X0-6,y:152,'font-size':8,'font-weight':500,fill:MUT,'text-anchor':'end',
      class:cls('fade'),style:dly(0.5)},'待考');
    var UNK=[['MD 特輯 1',1989.6,1991.4],['MD 特輯 2',1989.6,1991.6],['MD 特輯 3',1990.0,1992.0],
             ['MD 特輯 5',1991.4,1992.6],['CD-ROM 特輯',1990.5,1993.6],
             ['RPG 特輯 1',1991.0,1992.9],['SLG 特輯 1',1991.5,1992.95]];
    UNK.forEach(function(b,i){
      var yy=148+i*7;
      var ln=el(s,'line',{x1:X(b[1]),y1:yy,x2:X(b[2]),y2:yy,stroke:G2,'stroke-width':2.2,
        'stroke-linecap':'round',opacity:0.5,class:cls('fade'),style:dly(0.55+i*0.05)});
      tip(ln,b[0]+' — 版權頁未印出版年月，此為推定區間');
    });
    // 底下：212 期的刊期線與五個定點
    var yb=238;
    el(s,'line',{x1:X(yf(1987,7.65)),y1:yb,x2:X(yf(1996,4.8)),y2:yb,stroke:G2,'stroke-width':0.8,
      class:cls('fade'),style:dly(0.8)});
    // [年, 月, 標籤, 同一標籤下的其他刻度月份]
    var PTS=[[1987,7.65,'No.1',[]],[1987,11.15,'8·9',[11.6]],
             [1988,9.8,'28·31',[9.0,10.55]],[1996,4.8,'212',[]]];
    PTS.forEach(function(p,i){
      var x=X(yf(p[0],p[1]));
      var marks=(p[3].length?p[3]:[p[1]]).map(function(m){return X(yf(p[0],m));});
      marks.forEach(function(mx){
        el(s,'line',{x1:mx,y1:yb-5,x2:mx,y2:yb+5,stroke:INK,'stroke-width':1.1,
          class:cls('fade'),style:dly(0.85+i*0.06)});
      });
      txt(s,{x:x,y:yb+16,'font-size':7.5,'font-weight':500,fill:INK,'text-anchor':'middle',
        style:'paint-order:stroke;stroke:'+PAPER+';stroke-width:3px;'+dly(0.9+i*0.06),
        class:cls('fade')}, p[2]);
    });
    txt(s,{x:X0-6,y:yb+4,'font-size':8,'font-weight':500,fill:SEC,'text-anchor':'end',
      class:cls('fade'),style:dly(0.8)},'刊期');
    txt(s,{x:200,y:274,'font-size':7.5,'font-weight':600,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.12em',class:cls('fade'),style:dly(1.1)},
      '● 本刊 7 · ○ 特輯 9（已印年月）· ▬ 特輯 7（推定區間）· 刊期線上為六個已知期號');
  };

  /* ── 版權頁人員的在職跨度 ───────────────────────────────── */
  FIGS['tenure'] = function (s) {
    var INK=cv('--amber'), SEC=cv('--text'), MUT=cv('--muted'), GRID=cv('--line'), G2=cv('--line');
    var X0=110, X1=296, Y0=1987, Y1=1996.99, NX=306;
    function X(t){ return X0+(t-Y0)/(Y1-Y0)*(X1-X0); }
    for (var y=1987; y<=1996; y++) {
      el(s,'line',{x1:X(y),y1:30,x2:X(y),y2:236,stroke:GRID,'stroke-width':0.6,
        class:cls('fade'),style:dly((y-1987)*0.02)});
      if (y % 2 === 1) txt(s,{x:X(y+0.5),y:250,'font-size':8,'font-weight':600,fill:MUT,
        'text-anchor':'middle',class:cls('fade'),style:dly((y-1987)*0.02)}, String(y));
    }
    // [姓名, 註記, [[年,月,職務], …]]
    var P=[
      ['陳希芳','總編輯九年不變',[[1987,7,'總編輯'],[1987,7.5,'總編輯'],[1989,10,'總編輯'],
        [1991,7,'負責人兼總編輯'],[1992,12,'負責人兼總編輯'],[1994,10,'發行人兼總編輯'],[1996,3,'總編輯']]],
      ['楊素慧','館藏中任期最長',[[1988,8.8,'財務部'],[1989,10,'財務部'],[1991,7,'財務主任'],
        [1992,12,'財務主任'],[1994,10,'財務'],[1996,3,'財務']]],
      ['黃鎮隆','攝影→負責人',[[1987,7,'專任攝影'],[1987,7.5,'專任攝影'],[1988,8.8,'發行人兼總編輯'],
        [1989,10,'專任攝影'],[1993,7,'負責人'],[1994,10,'負責人'],[1996,3,'負責人兼發行人']]],
      ['葛麗英','美編→企劃主編→行銷',[[1987,7,'美術編輯'],[1987,7.5,'美術編輯'],[1989,10,'美術編輯'],
        [1991,7,'美術編輯'],[1992,12,'企劃主編'],[1994,10,'行銷'],[1996,3,'行銷']]],
      ['廖桂華','九冊特輯全在',[[1991,7,'行政管理'],[1992,12,'行政管理'],[1993,7,'行政管理'],
        [1994,10,'行政管理'],[1996,3,'行政管理']]],
      ['許麗容','編輯→版權',[[1991,7,'文字編輯'],[1992,12,'版權推進'],[1994,10,'國際版權'],[1996,3,'國際版權']]],
      ['陳日陞','發行人',[[1987,7,'發行人'],[1987,7.5,'發行人'],[1987,11,'發行人'],[1989,10,'發行人'],
        [1991,7,'發行人'],[1992,12,'發行人']]],
      ['陳松本','美術編輯',[[1987,7,'美術編輯'],[1987,7.5,'美術編輯'],[1989,10,'美術編輯'],[1991,7,'美術主編']]]
    ];
    P.forEach(function(p,i){
      var yy=44+i*25, ev=p[2];
      var x0=X(yf(ev[0][0],ev[0][1])), xN=X(yf(ev[ev.length-1][0],ev[ev.length-1][1]));
      // 跨度線：只表示「首見到末見」，中間各期不在館藏
      el(s,'line',{x1:x0,y1:yy,x2:xN,y2:yy,stroke:G2,'stroke-width':1,'stroke-dasharray':'2 4',
        class:cls('fade'),style:dly(0.3+i*0.06)});
      ev.forEach(function(e,k){
        var x=X(yf(e[0],e[1]));
        var d=el(s,'circle',{cx:x,cy:yy,r:3.4,fill:INK,class:cls('pop'),style:dly(0.35+i*0.06+k*0.03)});
        tip(d, p[0]+'　'+e[0]+'-'+String(e[1]|0).padStart(2,'0')+'　'+e[2]);
      });
      txt(s,{x:X0-8,y:yy+3,'font-size':8.5,'font-weight':500,fill:INK,'text-anchor':'end',
        class:cls('fade'),style:dly(0.3+i*0.06)}, p[0]);
      txt(s,{x:NX,y:yy+3,'font-size':7,'font-weight':600,fill:MUT,
        class:cls('fade'),style:dly(0.5+i*0.06)}, p[1]);
    });
    txt(s,{x:200,y:274,'font-size':7.5,'font-weight':600,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.12em',class:cls('fade'),style:dly(1.0)},
      '一點 ＝ 一份已核實的版權頁 · 虛線只表示首見到末見，中間各期不在館藏');
  };

  /* ── 一冊要處理的平台數 ─────────────────────────────────── */
  FIGS['platforms'] = function (s) {
    var INK=cv('--amber'), SEC=cv('--text'), MUT=cv('--muted'), GRID=cv('--line'), G2=cv('--line'), PAPER=cv('--ground');
    var COL=[
      ['1987','快訊創刊號',['FC']],
      ['1988','報導創刊號',['FC','PC Engine','SEGA','大型機台']],
      ['1992','秘技大全',['FC','SFC','PC Engine','GB','MD']],
      ['1996','SLG 特輯 2',['SFC','SS','PS','3DO','FX','SCD','GB','GG','32X']]
    ];
    var ORDER=['FC','大型機台','PC Engine','SFC','MD','GB','SCD','SS','PS','3DO','FX','GG','32X'];
    var X0=72, DX=92, Y0=52, DY=17;
    COL.forEach(function(c,i){
      var x=X0+i*DX;
      txt(s,{x:x,y:30,'font-size':11,'font-weight':600,fill:INK,'text-anchor':'middle',
        class:cls('fade'),style:dly(0.1+i*0.08)}, c[0]);
      txt(s,{x:x,y:42,'font-size':7.5,'font-weight':600,fill:MUT,'text-anchor':'middle',
        class:cls('fade'),style:dly(0.12+i*0.08)}, c[1]);
      c[2].forEach(function(p,k){
        var y=Y0+k*DY;
        el(s,'line',{x1:x-30,y1:y,x2:x+28,y2:y,stroke:GRID,'stroke-width':0.6,
          class:cls('fade'),style:dly(0.2+i*0.08+k*0.03)});
        var dot=el(s,'circle',{cx:x-30,cy:y,r:2.6,fill:INK,class:cls('pop'),style:dly(0.22+i*0.08+k*0.03)});
        tip(dot, c[0]+'　'+c[1]+'　'+p);
        txt(s,{x:x-24,y:y+3,'font-size':7.5,'font-weight':600,fill:SEC,
          class:cls('fade'),style:dly(0.24+i*0.08+k*0.03)}, p);
      });
      // 該冊的平台數
      var yn=Y0+c[2].length*DY+8;
      txt(s,{x:x,y:yn+6,'font-size':15,'font-weight':600,fill:INK,'text-anchor':'middle',
        style:'paint-order:stroke;stroke:'+PAPER+';stroke-width:3px;'+dly(0.5+i*0.08),
        class:cls('fade')}, String(c[2].length));
      txt(s,{x:x,y:yn+17,'font-size':7,'font-weight':600,fill:MUT,'text-anchor':'middle',
        'letter-spacing':'.1em',class:cls('fade'),style:dly(0.52+i*0.08)}, '個平台');
    });
    // 同一平台跨冊的延續線
    ORDER.forEach(function(p,pi){
      var pts=[];
      COL.forEach(function(c,i){
        var k=c[2].indexOf(p);
        if(k>=0) pts.push([X0+i*DX+30, Y0+k*DY]);
      });
      for(var j=0;j<pts.length-1;j++){
        el(s,'line',{x1:pts[j][0]-2,y1:pts[j][1],x2:pts[j+1][0]-60,y2:pts[j+1][1],
          stroke:G2,'stroke-width':0.6,class:cls('fade'),style:dly(0.7+pi*0.03)});
      }
    });
    txt(s,{x:200,y:268,'font-size':7.5,'font-weight':600,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.12em',class:cls('fade'),style:dly(1.0)},
      '一列 ＝ 該冊處理的一個平台 · 細線串起同一平台的延續');
  };

  /* ── 掛載：捲入視野才播，點擊重播 ───────────────────────── */
  function mount(node) {
    var fn = FIGS[node.getAttribute('data-fig')];
    if (!fn) return;
    var go = function () { node.innerHTML = ''; fn(node); };
    if (!('IntersectionObserver' in window)) { go(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { go(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(node);
    node.style.cursor = 'pointer';
    node.addEventListener('click', go);
  }
  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('svg[data-fig]'), mount);
  });
})();
