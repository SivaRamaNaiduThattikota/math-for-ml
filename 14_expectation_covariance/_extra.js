// Session 14 — correlation scatter with live covariance ellipse
(function(){
  const cv=document.getElementById('covplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.5}, S=52, N=400;
  let rho=0.7;
  const P=(x,y)=>({x:O.x+x*S, y:O.y-y*S});
  // fixed base normals so the cloud morphs continuously as rho changes
  function randn(){let u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
  const bx=[], bz=[]; for(let i=0;i<N;i++){bx.push(randn());bz.push(randn());}

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#EDEAE0';ctx.lineWidth=1;
    for(let gx=O.x%S;gx<W;gx+=S){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
    for(let gy=O.y%S;gy<H;gy+=S){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,O.y);ctx.lineTo(W,O.y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(O.x,0);ctx.lineTo(O.x,H);ctx.stroke();

    const s=Math.sqrt(Math.max(0,1-rho*rho));
    const xs=[], ys=[];
    for(let i=0;i<N;i++){ const x=bx[i], y=rho*bx[i]+s*bz[i]; xs.push(x); ys.push(y);
      const p=P(x,y); ctx.fillStyle='rgba(90,79,207,0.55)'; ctx.beginPath();ctx.arc(p.x,p.y,3,0,7);ctx.fill(); }

    // sample covariance
    const mx=xs.reduce((a,b)=>a+b,0)/N, my=ys.reduce((a,b)=>a+b,0)/N;
    let cxx=0,cyy=0,cxy=0;
    for(let i=0;i<N;i++){cxx+=(xs[i]-mx)**2;cyy+=(ys[i]-my)**2;cxy+=(xs[i]-mx)*(ys[i]-my);}
    cxx/=N;cyy/=N;cxy/=N;
    const corr=cxy/Math.sqrt(cxx*cyy);
    // covariance ellipse (eigen of [[cxx,cxy],[cxy,cyy]])
    const tr=cxx+cyy, det=cxx*cyy-cxy*cxy, disc=Math.sqrt(Math.max(0,tr*tr-4*det));
    const l1=(tr+disc)/2, l2=(tr-disc)/2;
    let e1 = Math.abs(cxy)>1e-9 ? [cxy, l1-cxx] : [1,0];
    const n1=Math.hypot(e1[0],e1[1])||1; e1=[e1[0]/n1,e1[1]/n1];
    const e2=[-e1[1],e1[0]];
    const k=2.2, a1=k*Math.sqrt(Math.max(0,l1)), a2=k*Math.sqrt(Math.max(0,l2));
    ctx.strokeStyle='#B07514';ctx.lineWidth=3;ctx.beginPath();
    for(let t=0;t<=64;t++){const th=t/64*2*Math.PI;
      const x=mx+a1*Math.cos(th)*e1[0]+a2*Math.sin(th)*e2[0];
      const y=my+a1*Math.cos(th)*e1[1]+a2*Math.sin(th)*e2[1];
      const p=P(x,y); t?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}
    ctx.closePath();ctx.stroke();
    upd(corr,cxy);
  }
  function upd(corr,cxy){
    const r=v=>Math.round(v*100)/100, el=id=>document.getElementById(id);
    el('rCorr').textContent=r(corr); el('rCov').textContent=r(cxy);
    const n=el('rNote');
    if(rho>0.1){n.textContent='positive: rise together ↗';n.style.color='#0E8C80';}
    else if(rho<-0.1){n.textContent='negative: move opposite ↘';n.style.color='#C13A57';}
    else{n.textContent='uncorrelated: round blob';n.style.color='var(--muted)';}
    el('rRhoVal').textContent=rho.toFixed(2);
  }
  const sl=document.getElementById('sRho');
  if(sl) sl.addEventListener('input',()=>{rho=parseFloat(sl.value);draw();});
  draw();
})();
