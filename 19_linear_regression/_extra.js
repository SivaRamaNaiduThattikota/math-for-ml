// Session 19 — bias–variance: fit a degree-d polynomial to noisy data, watch train vs test
(function(){
  const cv=document.getElementById('brplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, PAD=46, CY=H*0.5, YS=H*0.2;
  let deg=1, data=[];
  function randn(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
  const px=x=>PAD+x*(W-2*PAD), py=v=>CY-v*YS;

  function gen(){ data=[]; const xs=Array.from({length:30},()=>Math.random()).sort((a,b)=>a-b);
    xs.forEach((x,i)=>data.push({x, y:Math.sin(2*Math.PI*x)+0.2*randn(), test:(i%3===0)})); }
  function solve(A,b){ // Gaussian elimination with partial pivoting
    const n=b.length, M=A.map((r,i)=>r.concat(b[i]));
    for(let c=0;c<n;c++){ let p=c; for(let r=c+1;r<n;r++) if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
      [M[c],M[p]]=[M[p],M[c]]; const pivot=M[c][c]||1e-9;
      for(let r=0;r<n;r++){ if(r===c)continue; const f=M[r][c]/pivot; for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k]; } }
    return M.map((r,i)=>r[n]/(r[i]||1e-9)); }
  function polyfit(pts,d){ // returns coefficients c[0..d]
    const V=pts.map(p=>{const row=[]; let xk=1; for(let k=0;k<=d;k++){row.push(xk); xk*=p.x;} return row;});
    const A=Array.from({length:d+1},()=>new Array(d+1).fill(0)), b=new Array(d+1).fill(0);
    for(let i=0;i<=d;i++){ for(let j=0;j<=d;j++){ let s=0; V.forEach(r=>s+=r[i]*r[j]); A[i][j]=s+(i===j?1e-7:0); }
      let sb=0; V.forEach((r,ri)=>sb+=r[i]*pts[ri].y); b[i]=sb; }
    return solve(A,b); }
  const polyval=(c,x)=>{let s=0,xk=1; for(let k=0;k<c.length;k++){s+=c[k]*xk; xk*=x;} return s;};
  const mse=(c,pts)=>pts.reduce((a,p)=>a+(polyval(c,p.x)-p.y)**2,0)/pts.length;

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(PAD,py(0));ctx.lineTo(W-PAD,py(0));ctx.stroke();
    const tr=data.filter(p=>!p.test), te=data.filter(p=>p.test);
    const c=polyfit(tr,deg);
    // fitted curve
    ctx.strokeStyle='#B07514';ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<=200;i++){const x=i/200, y=Math.max(-3,Math.min(3,polyval(c,x))); i?ctx.lineTo(px(x),py(y)):ctx.moveTo(px(x),py(y));}
    ctx.stroke();
    // points
    tr.forEach(p=>{ctx.fillStyle='#5A4FCF';ctx.beginPath();ctx.arc(px(p.x),py(p.y),4,0,7);ctx.fill();});
    te.forEach(p=>{ctx.fillStyle='#C13A57';ctx.beginPath();ctx.arc(px(p.x),py(p.y),4,0,7);ctx.fill();});
    upd(mse(c,tr), mse(c,te));
  }
  function upd(trE,teE){
    const r=v=>v>=1000?v.toExponential(1):Math.round(v*1000)/1000, el=id=>document.getElementById(id);
    el('rTrain').textContent=r(trE); el('rTest').textContent=r(teE); el('rDeg').textContent=deg;
    const f=el('rFit');
    if(deg<=1){f.textContent='underfit (high bias)';f.style.color='#C13A57';}
    else if(deg<=5){f.textContent='good balance ✓';f.style.color='#0E8C80';}
    else{f.textContent='overfit (high variance)';f.style.color='#C13A57';}
  }
  const sl=document.getElementById('sDeg'); if(sl) sl.addEventListener('input',()=>{deg=parseInt(sl.value);draw();});
  const b=document.getElementById('brBtn'); if(b) b.addEventListener('click',()=>{gen();draw();});
  gen(); draw();
})();
