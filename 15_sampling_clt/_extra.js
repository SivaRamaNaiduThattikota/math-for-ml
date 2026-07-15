// Session 15 — Central Limit Theorem: means of a non-Gaussian source turn into a bell
(function(){
  const cv=document.getElementById('cltplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, PAD=40, BASE=H-30, M=2500, BINS=48;
  function randn(){let u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
  const SRC={
    uniform: ()=>Math.random(),
    exp:     ()=>-Math.log(1-Math.random()),
    bimodal: ()=> (Math.random()<0.5 ? 0.2 : 0.8) + randn()*0.05,
    dice:    ()=> Math.floor(Math.random()*6)+1,
  };
  let key='uniform', n=1, mu=0.5, sig=0.29;

  function estimateStats(){
    let s=0,s2=0,K=20000; const f=SRC[key];
    for(let i=0;i<K;i++){const x=f();s+=x;s2+=x*x;}
    mu=s/K; sig=Math.sqrt(Math.max(1e-9, s2/K - mu*mu));
  }
  function gauss(x, m, sd){ return Math.exp(-(x-m)*(x-m)/(2*sd*sd))/(sd*Math.sqrt(2*Math.PI)); }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const f=SRC[key], sd_n=sig/Math.sqrt(n);
    // sample means
    const means=[];
    for(let i=0;i<M;i++){ let s=0; for(let j=0;j<n;j++) s+=f(); means.push(s/n); }
    // x-range zoomed to the sampling distribution
    const x0=mu-4*sd_n, x1=mu+4*sd_n, rng=x1-x0||1, binw=rng/BINS;
    const hist=new Array(BINS).fill(0);
    means.forEach(m=>{ let b=Math.floor((m-x0)/binw); if(b>=0&&b<BINS) hist[b]++; });
    const dens=hist.map(c=>c/(M*binw));
    const gpeak=gauss(mu,mu,sd_n);
    const ymax=Math.max(gpeak, ...dens)*1.1 || 1;
    const px=x=>PAD+(x-x0)/rng*(W-2*PAD);
    const py=d=>BASE-(d/ymax)*(BASE-24);
    // axis
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(PAD,BASE);ctx.lineTo(W-PAD,BASE);ctx.stroke();
    // bars
    ctx.fillStyle='rgba(90,79,207,0.55)';
    for(let b=0;b<BINS;b++){ const x=px(x0+b*binw), w=(W-2*PAD)/BINS; ctx.fillRect(x, py(dens[b]), w-1, BASE-py(dens[b])); }
    // Gaussian overlay
    ctx.strokeStyle='#B07514';ctx.lineWidth=3;ctx.beginPath();
    for(let p=0;p<=120;p++){ const x=x0+p/120*rng, y=py(gauss(x,mu,sd_n)); p?ctx.lineTo(px(x),y):ctx.moveTo(px(x),y); }
    ctx.stroke();
    // mean line
    ctx.strokeStyle='#C13A57';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(px(mu),24);ctx.lineTo(px(mu),BASE);ctx.stroke();ctx.setLineDash([]);
    upd(means, sd_n);
  }
  function upd(means, sd_n){
    const r=v=>Math.round(v*1000)/1000, el=id=>document.getElementById(id);
    const mm=means.reduce((a,b)=>a+b,0)/means.length;
    let s2=0; means.forEach(m=>s2+=(m-mm)*(m-mm)); const sm=Math.sqrt(s2/means.length);
    el('rMu').textContent=r(mm); el('rSE').textContent=r(sm); el('rN').textContent=n;
    const note=el('rNote');
    if(n===1){note.textContent='n=1: the raw source (not Gaussian)';note.style.color='#C13A57';}
    else if(n<10){note.textContent='getting there…';note.style.color='var(--muted)';}
    else{note.textContent='≈ Gaussian ✓ (hugs the amber curve)';note.style.color='#0E8C80';}
    document.querySelectorAll('.ctrl').forEach(b=>b.classList.toggle('active', b.dataset.key===key));
  }
  const sl=document.getElementById('sN');
  if(sl) sl.addEventListener('input',()=>{n=parseInt(sl.value);draw();});
  document.querySelectorAll('.ctrl').forEach(b=>b.addEventListener('click',()=>{key=b.dataset.key;estimateStats();draw();}));
  estimateStats(); draw();
})();
