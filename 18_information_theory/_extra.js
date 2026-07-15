// Session 18 — binary entropy curve with live cross-entropy & KL
(function(){
  const cv=document.getElementById('infoplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, PAD=54, BASE=H-46;
  let p=0.5, q=0.5;
  const L2=x=>Math.log(x)/Math.log(2);
  const Hf=t=>{t=Math.min(0.999,Math.max(0.001,t)); return -(t*L2(t)+(1-t)*L2(1-t));};
  const CEf=(a,b)=>{b=Math.min(0.999,Math.max(0.001,b)); return -(a*L2(b)+(1-a)*L2(1-b));};
  const px=t=>PAD+t*(W-2*PAD);
  const py=v=>BASE-v*(BASE-30);      // v in [0,1] bits

  function draw(){
    ctx.clearRect(0,0,W,H);
    // axis + x ticks
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(PAD,BASE);ctx.lineTo(W-PAD,BASE);ctx.stroke();
    ctx.fillStyle='#8A8698';ctx.font='11px "JetBrains Mono",monospace';ctx.textAlign='center';
    for(let t=0;t<=10;t++)ctx.fillText((t/10).toFixed(1),px(t/10),BASE+18);
    ctx.fillText('1 bit', PAD-24, py(1)+4);
    // entropy curve
    ctx.strokeStyle='#5A4FCF';ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<=200;i++){const t=0.001+i/200*0.998; i?ctx.lineTo(px(t),py(Hf(t))):ctx.moveTo(px(t),py(Hf(t)));}
    ctx.stroke();
    // q vertical line (model)
    ctx.strokeStyle='#0E8C80';ctx.lineWidth=2;ctx.setLineDash([6,5]);
    ctx.beginPath();ctx.moveTo(px(q),30);ctx.lineTo(px(q),BASE);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#0E8C80';ctx.fillText('model q', px(q), 22);
    // p marker on curve
    ctx.fillStyle='#5A4FCF';ctx.beginPath();ctx.arc(px(p),py(Hf(p)),7,0,7);ctx.fill();
    ctx.strokeStyle='#5A4FCF';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px(p),py(Hf(p)));ctx.lineTo(px(p),BASE);ctx.stroke();
    ctx.fillText('true p', px(p), py(Hf(p))-12);
    upd();
  }
  function upd(){
    const r=v=>Math.round(v*1000)/1000, el=id=>document.getElementById(id);
    const h=Hf(p), ce=CEf(p,q), kl=ce-h;
    el('rH').textContent=r(h); el('rCE').textContent=r(ce); el('rKL').textContent=r(Math.max(0,kl));
    el('rPv').textContent=p.toFixed(2); el('rQv').textContent=q.toFixed(2);
    const n=el('rNote');
    if(Math.abs(p-q)<0.02){n.textContent='q = p → KL = 0 (perfect model) ✓';n.style.color='#0E8C80';}
    else{n.textContent='wrong model → KL > 0 (extra bits)';n.style.color='#C13A57';}
  }
  const bind=(id,setter,span)=>{const s=document.getElementById(id);if(s)s.addEventListener('input',()=>{setter(parseFloat(s.value));draw();});};
  bind('sP',v=>p=v); bind('sQ',v=>q=v);
  draw();
})();
