// Session 16 — A/B test simulator: observed rates, CI whiskers, two-proportion z-test
(function(){
  const cv=document.getElementById('abplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, BASE=H-46, YS=430;
  let rateA=0.10, lift=0.02, n=2000, pA=0, pB=0;
  function erf(x){const s=x<0?-1:1;x=Math.abs(x);const t=1/(1+0.3275911*x);
    const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);return s*y;}
  const Phi=z=>0.5*(1+erf(z/Math.sqrt(2)));
  function count(rate){let c=0;for(let i=0;i<n;i++) if(Math.random()<rate)c++;return c;}

  function experiment(){ const rB=Math.max(0,Math.min(0.95,rateA+lift)); pA=count(rateA)/n; pB=count(rB)/n; }

  function bar(cx,p,col,label){
    const w=130, h=p*YS, x=cx-w/2, y=BASE-h;
    ctx.fillStyle=col; ctx.fillRect(x,y,w,h);
    // CI whisker
    const se=Math.sqrt(Math.max(1e-9,p*(1-p)/n)), d=1.96*se*YS;
    ctx.strokeStyle='#26252E';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(cx,y-d);ctx.lineTo(cx,y+d);
    ctx.moveTo(cx-10,y-d);ctx.lineTo(cx+10,y-d);ctx.moveTo(cx-10,y+d);ctx.lineTo(cx+10,y+d);ctx.stroke();
    ctx.fillStyle='#131219';ctx.textAlign='center';ctx.font='600 15px "JetBrains Mono",monospace';
    ctx.fillText((p*100).toFixed(1)+'%', cx, y-d-8);
    ctx.fillStyle='#6E6C7A';ctx.font='13px Inter,sans-serif';ctx.fillText(label, cx, BASE+20);
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(60,BASE);ctx.lineTo(W-60,BASE);ctx.stroke();
    bar(W*0.36, pA, '#9C99A6', 'A (control)');
    bar(W*0.64, pB, '#5A4FCF', 'B (treatment)');
    // stats
    const pool=(pA*n+pB*n)/(2*n), se=Math.sqrt(Math.max(1e-12,pool*(1-pool)*(2/n)));
    const z=(pB-pA)/se, pval=2*(1-Phi(Math.abs(z)));
    upd(pval);
  }
  function upd(pval){
    const el=id=>document.getElementById(id);
    el('rObs').textContent=(pA*100).toFixed(1)+'% / '+(pB*100).toFixed(1)+'%';
    el('rP').textContent=pval<0.0001?'<0.0001':pval.toFixed(4);
    const v=el('rVerdict');
    if(pval<0.05){v.textContent='✓ significant (p < 0.05)';v.style.color='#0E8C80';}
    else{v.textContent='✗ not significant';v.style.color='#C13A57';}
  }
  const bind=(id,setter,fmt)=>{const s=document.getElementById(id);if(s)s.addEventListener('input',()=>{setter(parseFloat(s.value));fmt&&fmt(parseFloat(s.value));experiment();draw();});};
  bind('sRateA',v=>rateA=v, v=>document.getElementById('rRA').textContent=Math.round(v*100)+'%');
  bind('sLift', v=>lift=v,  v=>document.getElementById('rLift').textContent=(v>=0?'+':'')+(v*100).toFixed(1)+'%');
  bind('sNum',  v=>n=Math.round(v), v=>document.getElementById('rNum').textContent=Math.round(v));
  const b=document.getElementById('abBtn'); if(b) b.addEventListener('click',()=>{experiment();draw();});
  experiment(); draw();
})();
