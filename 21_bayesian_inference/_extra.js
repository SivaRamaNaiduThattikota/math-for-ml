// Session 21 — Beta-Binomial conjugate updating
(function(){
  const cv=document.getElementById('betaplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, PAD=48, BASE=H-40, GRID=300;
  let a0=2, b0=2, h=0, t=0;
  const px=x=>PAD+x*(W-2*PAD);

  function betaGrid(a,b){ // normalized Beta pdf on [0,1]
    const d=[], dx=1/GRID; let area=0;
    for(let i=0;i<=GRID;i++){ const x=Math.min(1-1e-6,Math.max(1e-6,i*dx));
      const v=Math.pow(x,a-1)*Math.pow(1-x,b-1); d.push(v); area+=v*dx; }
    return d.map(v=>v/area);
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const prior=betaGrid(a0,b0), post=betaGrid(a0+h,b0+t);
    const ymax=Math.max(...post,...prior)*1.08||1;
    const py=v=>BASE-v/ymax*(BASE-24);
    // axis
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(PAD,BASE);ctx.lineTo(W-PAD,BASE);ctx.stroke();
    ctx.fillStyle='#8A8698';ctx.font='11px "JetBrains Mono",monospace';ctx.textAlign='center';
    for(let k=0;k<=10;k+=2)ctx.fillText((k/10).toFixed(1),px(k/10),BASE+18);
    // prior (faint)
    ctx.strokeStyle='#C3BCF0';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();
    prior.forEach((v,i)=>{const x=px(i/GRID); i?ctx.lineTo(x,py(v)):ctx.moveTo(x,py(v));});ctx.stroke();ctx.setLineDash([]);
    // posterior (solid amber, filled)
    ctx.beginPath(); post.forEach((v,i)=>{const x=px(i/GRID); i?ctx.lineTo(x,py(v)):ctx.moveTo(x,py(v));});
    ctx.lineTo(px(1),BASE);ctx.lineTo(px(0),BASE);ctx.closePath();
    ctx.fillStyle='rgba(176,117,20,0.16)';ctx.fill();
    ctx.strokeStyle='#B07514';ctx.lineWidth=3;ctx.beginPath();
    post.forEach((v,i)=>{const x=px(i/GRID); i?ctx.lineTo(x,py(v)):ctx.moveTo(x,py(v));});ctx.stroke();
    // credible interval from posterior CDF
    let cum=0, lo=0, hi=1, dx=1/GRID;
    for(let i=0;i<=GRID;i++){ cum+=post[i]*dx; if(lo===0&&cum>=0.025)lo=i/GRID; if(cum>=0.975){hi=i/GRID;break;} }
    ctx.strokeStyle='#0E8C80';ctx.lineWidth=1.5;
    [lo,hi].forEach(q=>{ctx.beginPath();ctx.moveTo(px(q),BASE);ctx.lineTo(px(q),BASE-6);ctx.stroke();});
    upd(lo,hi);
  }
  function upd(lo,hi){
    const el=id=>document.getElementById(id), a=a0+h,b=b0+t;
    el('rData').textContent=h+'H / '+t+'T';
    el('rMean').textContent=(a/(a+b)).toFixed(3);
    el('rCI').textContent='['+lo.toFixed(2)+', '+hi.toFixed(2)+']';
  }
  const bind=(id,f)=>{const s=document.getElementById(id);if(s)s.addEventListener('input',()=>{f(parseFloat(s.value));draw();});};
  bind('sA',v=>{a0=v;document.getElementById('rA').textContent=v;});
  bind('sB',v=>{b0=v;document.getElementById('rB').textContent=v;});
  const click=(id,f)=>{const b=document.getElementById(id);if(b)b.addEventListener('click',()=>{f();draw();});};
  click('addH',()=>h++); click('addT',()=>t++); click('resetD',()=>{h=0;t=0;});
  draw();
})();
