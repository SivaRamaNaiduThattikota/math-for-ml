// Session 4 — matrix multiplication as composition (pick B then A, watch AB)
(function(){
  const cv=document.getElementById('cplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.55}, S=60;
  const PRESET={
    rot:     [[0,-1],[1,0]],
    shear:   [[1,1],[0,1]],
    scale:   [[1.5,0],[0,1.5]],
    reflect: [[-1,0],[0,1]],
  };
  let keyB='shear', keyA='rot', anim=null;

  const P=v=>({x:O.x+v[0]*S, y:O.y-v[1]*S});
  const mul=(A,B)=>[[A[0][0]*B[0][0]+A[0][1]*B[1][0], A[0][0]*B[0][1]+A[0][1]*B[1][1]],
                    [A[1][0]*B[0][0]+A[1][1]*B[1][0], A[1][0]*B[0][1]+A[1][1]*B[1][1]]];
  const apply=(M,p)=>[M[0][0]*p[0]+M[0][1]*p[1], M[1][0]*p[0]+M[1][1]*p[1]];
  const lerp=(A,B,t)=>[[A[0][0]+(B[0][0]-A[0][0])*t, A[0][1]+(B[0][1]-A[0][1])*t],
                       [A[1][0]+(B[1][0]-A[1][0])*t, A[1][1]+(B[1][1]-A[1][1])*t]];
  const I=[[1,0],[0,1]];
  const corners=[[0,0],[1,0],[1,1],[0,1]];

  function base(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#EDEAE0';ctx.lineWidth=1;
    for(let x=O.x%S;x<W;x+=S){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=O.y%S;y<H;y+=S){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,O.y);ctx.lineTo(W,O.y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(O.x,0);ctx.lineTo(O.x,H);ctx.stroke();
  }
  function poly(M,pts,stroke,fill){
    ctx.beginPath();
    pts.forEach((c,k)=>{const p=P(apply(M,c)); k?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    ctx.strokeStyle=stroke;ctx.lineWidth=2.5;ctx.stroke();
  }
  function arrow(f,t,col){
    ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=3;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(t.x,t.y);ctx.stroke();
    const an=Math.atan2(t.y-f.y,t.x-f.x),h=11;
    ctx.beginPath();ctx.moveTo(t.x,t.y);
    ctx.lineTo(t.x-h*Math.cos(an-0.45),t.y-h*Math.sin(an-0.45));
    ctx.lineTo(t.x-h*Math.cos(an+0.45),t.y-h*Math.sin(an+0.45));
    ctx.closePath();ctx.fill();
  }
  function render(M){
    base();
    // original unit square (dashed)
    ctx.setLineDash([6,5]);
    poly(I, corners, '#9C99A6', 'rgba(156,153,166,0.10)');
    ctx.setLineDash([]);
    // transformed square
    const det=M[0][0]*M[1][1]-M[0][1]*M[1][0];
    poly(M, corners, det<0?'#C13A57':'#5A4FCF', det<0?'rgba(193,58,87,0.16)':'rgba(90,79,207,0.16)');
    // basis images (columns of M)
    arrow(P([0,0]), P([M[0][0],M[1][0]]), '#5A4FCF');
    arrow(P([0,0]), P([M[0][1],M[1][1]]), '#0E8C80');
  }
  function upd(){
    const A=PRESET[keyA], B=PRESET[keyB], AB=mul(A,B), BA=mul(B,A);
    const r=v=>Math.round(v*100)/100;
    document.getElementById('rProd').textContent=`[[${r(AB[0][0])}, ${r(AB[0][1])}], [${r(AB[1][0])}, ${r(AB[1][1])}]]`;
    const same=Math.abs(AB[0][0]-BA[0][0])<1e-9&&Math.abs(AB[0][1]-BA[0][1])<1e-9&&Math.abs(AB[1][0]-BA[1][0])<1e-9&&Math.abs(AB[1][1]-BA[1][1])<1e-9;
    const el=document.getElementById('rComm');
    el.textContent = same ? 'AB = BA (these commute)' : 'AB ≠ BA (order matters!)';
    el.style.color = same ? '#0E8C80' : '#C13A57';
    if(!anim) render(AB);
    document.querySelectorAll('.ctrl').forEach(b=>{
      b.classList.toggle('active', (b.dataset.slot==='A'&&b.dataset.key===keyA)||(b.dataset.slot==='B'&&b.dataset.key===keyB));
    });
  }
  document.querySelectorAll('.ctrl').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.slot==='A') keyA=b.dataset.key; else keyB=b.dataset.key; upd();
  }));
  const play=document.getElementById('playBtn');
  if(play) play.addEventListener('click',()=>{
    if(window.MFML_REDUCED || anim) { return; }
    const A=PRESET[keyA], B=PRESET[keyB], AB=mul(A,B);
    play.disabled=true; const orig=play.textContent; play.textContent='playing…';
    let step=0; const N=90;
    anim=setInterval(()=>{
      step++; const t=step/N;
      if(t<=0.5) render(lerp(I,B,t/0.5));         // phase 1: identity -> B
      else       render(lerp(B,AB,(t-0.5)/0.5));  // phase 2: B -> A·B
      if(step>=N){ clearInterval(anim); anim=null; play.disabled=false; play.textContent=orig; render(AB); }
    },22);
  });
  upd();
})();
