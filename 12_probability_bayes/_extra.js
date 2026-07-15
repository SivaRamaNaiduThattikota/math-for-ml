// Session 12 — Bayes base-rate visualizer: 1,000 people as an icon array
(function(){
  const cv=document.getElementById('bayesplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, COLS=40, ROWS=25, N=COLS*ROWS;
  const CW=Math.floor(W/COLS), CH=Math.floor((H-14)/ROWS), TOP=8;
  const COL={TP:'#C13A57', FN:'#EBA0AC', FP:'#B07514', TN:'#9C99A6'};
  let prev=0.01, sens=0.99, spec=0.95;

  function draw(){
    ctx.clearRect(0,0,W,H);
    const sick=Math.round(N*prev), healthy=N-sick;
    const TP=Math.round(sick*sens), FN=sick-TP;
    const FP=Math.round(healthy*(1-spec)), TN=healthy-FP;
    const cats=[]; // order: TP, FN, FP, TN
    for(let k=0;k<TP;k++)cats.push('TP');
    for(let k=0;k<FN;k++)cats.push('FN');
    for(let k=0;k<FP;k++)cats.push('FP');
    for(let k=0;k<TN;k++)cats.push('TN');
    for(let i=0;i<N;i++){
      const col=i%COLS, row=(i/COLS)|0;
      ctx.fillStyle=COL[cats[i]]||'#9C99A6';
      ctx.fillRect(col*CW+1, TOP+row*CH+1, CW-2, CH-2);
    }
    upd(TP,FP);
  }
  function upd(TP,FP){
    const el=id=>document.getElementById(id);
    el('rPrev').textContent=(prev*100).toFixed(1)+'%';
    el('rSens').textContent=Math.round(sens*100)+'%';
    el('rSpec').textContent=Math.round(spec*100)+'%';
    const post = sens*prev/(sens*prev+(1-spec)*(1-prev));
    el('rPost').textContent = (post*100).toFixed(1)+'%  ('+TP+' true / '+(TP+FP)+' positives)';
    el('rPost').style.color = post<0.5 ? '#C13A57' : '#0E8C80';
  }
  const bind=(id,setter,fmt)=>{ const s=document.getElementById(id); if(s) s.addEventListener('input',()=>{setter(parseFloat(s.value));draw();}); };
  bind('sPrev',v=>prev=v); bind('sSens',v=>sens=v); bind('sSpec',v=>spec=v);
  draw();
})();
