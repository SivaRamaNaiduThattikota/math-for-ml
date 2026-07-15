// Session 20 — t-distribution vs standard normal, df slider
(function(){
  const cv=document.getElementById('tplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, PAD=46, BASE=H-40, XR=4.2, YS=(BASE-30)/0.42;
  let df=3;
  const px=x=>W/2 + x/XR*(W/2-PAD);
  const py=v=>BASE - v*YS;
  const normpdf=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
  function tpdf(nu){ // numerically normalized t density over the grid
    const xs=[], u=[]; let area=0; const dx=8.4/400;
    for(let i=0;i<=400;i++){const x=-4.2+i*dx; xs.push(x); const v=Math.pow(1+x*x/nu, -(nu+1)/2); u.push(v); area+=v*dx;}
    return {xs, d:u.map(v=>v/area)};
  }
  function curve(fn,col){ ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<=200;i++){const x=-XR+i/200*2*XR; const y=py(fn(x)); i?ctx.lineTo(px(x),y):ctx.moveTo(px(x),y);} ctx.stroke(); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(PAD,BASE);ctx.lineTo(W-PAD,BASE);ctx.stroke();
    ctx.fillStyle='#8A8698';ctx.font='11px "JetBrains Mono",monospace';ctx.textAlign='center';
    for(let k=-4;k<=4;k++)ctx.fillText(String(k),px(k),BASE+18);
    // t (numerical) — build a lookup then interpolate
    const t=tpdf(df);
    const tval=x=>{ const idx=Math.min(400,Math.max(0,Math.round((x+4.2)/8.4*400))); return t.d[idx]; };
    curve(normpdf,'#5A4FCF');   // standard normal
    curve(tval,'#B07514');      // t
    upd();
  }
  function upd(){
    document.getElementById('rDf').textContent=df;
    const n=document.getElementById('rNote');
    if(df<=3){n.textContent='low df: fat tails, lower peak';n.style.color='#C13A57';}
    else if(df<15){n.textContent='approaching normal…';n.style.color='var(--muted)';}
    else{n.textContent='≈ normal (df large) ✓';n.style.color='#0E8C80';}
  }
  const sl=document.getElementById('sDf'); if(sl) sl.addEventListener('input',()=>{df=parseInt(sl.value);draw();});
  draw();
})();
