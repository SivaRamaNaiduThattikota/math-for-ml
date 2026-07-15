// Session 17 — MLE likelihood curve for a coin: slide p, watch the peak sit at the data proportion
(function(){
  const cv=document.getElementById('mleplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, PAD=52, BASE=H-46, N=20, TRUE=0.65;
  let k=14, guess=0.5;
  const px=p=>PAD+p*(W-2*PAD);
  const logL=p=>k*Math.log(p)+(N-k)*Math.log(1-p);
  function newData(){ let c=0; for(let i=0;i<N;i++) if(Math.random()<TRUE)c++; k=c; }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const mle=k/N, Lstar=logL(Math.min(0.999,Math.max(0.001,mle)));  // log of peak
    const py=lp=>{ const v=Math.exp(lp-Lstar); return BASE-v*(BASE-30); };  // normalize by peak
    // axis
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(PAD,BASE);ctx.lineTo(W-PAD,BASE);ctx.stroke();
    ctx.fillStyle='#8A8698';ctx.font='11px "JetBrains Mono",monospace';ctx.textAlign='center';
    for(let t=0;t<=10;t++){const p=t/10;ctx.fillText(p.toFixed(1),px(p),BASE+18);}
    // likelihood curve
    ctx.strokeStyle='#5A4FCF';ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<=200;i++){const p=0.01+i/200*0.98; const y=py(logL(p)); i?ctx.lineTo(px(p),y):ctx.moveTo(px(p),y);}
    ctx.stroke();
    // MLE line
    ctx.strokeStyle='#B07514';ctx.lineWidth=2;ctx.setLineDash([6,5]);
    ctx.beginPath();ctx.moveTo(px(mle),30);ctx.lineTo(px(mle),BASE);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#B07514';ctx.fillText('MLE p̂='+mle.toFixed(2), px(mle), 22);
    // marker at guess
    const g=Math.min(0.98,Math.max(0.02,guess)), gy=py(logL(g));
    ctx.strokeStyle='#C13A57';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(px(g),gy);ctx.lineTo(px(g),BASE);ctx.stroke();
    ctx.fillStyle='#C13A57';ctx.beginPath();ctx.arc(px(g),gy,7,0,7);ctx.fill();
    upd(mle);
  }
  function upd(mle){
    const el=id=>document.getElementById(id);
    el('rData').textContent=k+' heads / '+N;
    el('rLL').textContent=logL(Math.min(0.98,Math.max(0.02,guess))).toFixed(2);
    el('rMLE').textContent=mle.toFixed(2);
    el('rP').textContent=guess.toFixed(2);
    const n=el('rNote');
    if(Math.abs(guess-mle)<0.02){n.textContent='at the MLE! ✓ (peak likelihood)';n.style.color='#0E8C80';}
    else{n.textContent=guess<mle?'too low — climb right ↗':'too high — climb left ↖';n.style.color='var(--muted)';}
  }
  const sl=document.getElementById('sP');
  if(sl) sl.addEventListener('input',()=>{guess=parseFloat(sl.value);draw();});
  const b=document.getElementById('mleBtn'); if(b) b.addEventListener('click',()=>{newData();draw();});
  draw();
})();
