// Session 13 — Gaussian PDF explorer with 68-95-99.7 shaded bands
(function(){
  const cv=document.getElementById('normplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, OX=W/2, S=W/12, BASE=H-34, YS=410;
  let mu=0, sig=1;
  const px=x=>OX+x*S;
  const pdf=x=>Math.exp(-(x-mu)*(x-mu)/(2*sig*sig))/(sig*Math.sqrt(2*Math.PI));

  function draw(){
    ctx.clearRect(0,0,W,H);
    // axis
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,BASE);ctx.lineTo(W,BASE);ctx.stroke();
    // shaded area under curve by band
    for(let p=0;p<=W;p+=1){
      const x=(p-OX)/S, d=Math.abs(x-mu)/sig, y=pdf(x);
      let c=null;
      if(d<1) c='rgba(90,79,207,0.38)'; else if(d<2) c='rgba(90,79,207,0.22)'; else if(d<3) c='rgba(90,79,207,0.10)';
      if(c){ ctx.strokeStyle=c; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(p,BASE); ctx.lineTo(p,BASE-y*YS); ctx.stroke(); }
    }
    // curve
    ctx.strokeStyle='#5A4FCF';ctx.lineWidth=3;ctx.beginPath();
    for(let p=0;p<=W;p+=2){ const x=(p-OX)/S, y=BASE-pdf(x)*YS; p?ctx.lineTo(p,y):ctx.moveTo(p,y); }
    ctx.stroke();
    // mean line
    ctx.strokeStyle='#C13A57';ctx.lineWidth=2;ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(px(mu),BASE);ctx.lineTo(px(mu),BASE-pdf(mu)*YS);ctx.stroke();ctx.setLineDash([]);
    // sigma ticks + labels
    ctx.fillStyle='#8A8698';ctx.font='11px "JetBrains Mono",monospace';ctx.textAlign='center';
    for(let k=-3;k<=3;k++){ const xx=px(mu+k*sig); if(xx<8||xx>W-8) continue;
      ctx.strokeStyle='#C9C4B6';ctx.beginPath();ctx.moveTo(xx,BASE);ctx.lineTo(xx,BASE+5);ctx.stroke();
      ctx.fillText(k===0?'μ':(k>0?'+':'')+k+'σ', xx, BASE+18); }
    // band labels
    ctx.fillStyle='#5A4FCF';ctx.font='600 12px "JetBrains Mono",monospace';
    ctx.fillText('68%', px(mu), BASE-pdf(mu)*YS*0.45);
    upd();
  }
  function upd(){
    document.getElementById('rMu').textContent=mu.toFixed(1);
    document.getElementById('rSig').textContent=sig.toFixed(2);
  }
  const bind=(id,setter)=>{const s=document.getElementById(id);if(s)s.addEventListener('input',()=>{setter(parseFloat(s.value));draw();});};
  bind('sMu',v=>mu=v); bind('sSig',v=>sig=v);
  draw();
})();
