// Session 8 — derivative scrubber: drag along a curve, watch the tangent slope
(function(){
  const cv=document.getElementById('dplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.60}, S=46;
  const FN={ sq:x=>x*x, cubic:x=>x*x*x-3*x, sin:x=>Math.sin(x), exp:x=>Math.exp(x) };
  let key='sq', x0=1.2, drag=false;
  const P=(x,y)=>({x:O.x+x*S, y:O.y-y*S});
  const f=x=>FN[key](x);
  const deriv=x=>{const h=1e-4; return (f(x+h)-f(x-h))/(2*h);};
  const YMAX=(H*0.9)/S;   // clip curve beyond this |y| in world units

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#EDEAE0';ctx.lineWidth=1;
    for(let x=O.x%S;x<W;x+=S){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=O.y%S;y<H;y+=S){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,O.y);ctx.lineTo(W,O.y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(O.x,0);ctx.lineTo(O.x,H);ctx.stroke();

    // curve
    ctx.strokeStyle='#5A4FCF';ctx.lineWidth=3;ctx.beginPath();
    let pen=false;
    for(let px=0;px<=W;px+=2){
      const wx=(px-O.x)/S, wy=f(wx);
      if(!isFinite(wy)||Math.abs(wy)>YMAX){pen=false;continue;}
      const p=P(wx,wy); if(pen)ctx.lineTo(p.x,p.y); else ctx.moveTo(p.x,p.y); pen=true;
    }
    ctx.stroke();

    // tangent at x0
    const y0=f(x0), m=deriv(x0);
    const xa=x0-4.5, xb=x0+4.5;
    const A=P(xa, y0+m*(xa-x0)), B=P(xb, y0+m*(xb-x0));
    ctx.strokeStyle='#B07514';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();
    // point
    const pt=P(x0,y0);
    ctx.fillStyle='#fff';ctx.strokeStyle='#B07514';ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(pt.x,pt.y,7,0,7);ctx.fill();ctx.stroke();
    upd(y0,m);
  }
  function upd(y0,m){
    const r=x=>Math.round(x*100)/100, el=id=>document.getElementById(id);
    el('rX').textContent=r(x0); el('rFx').textContent=r(y0); el('rSlope').textContent=r(m);
    const n=el('rNote');
    if(Math.abs(m)<0.08){ n.textContent='flat — critical point!'; n.style.color='#0E8C80'; }
    else if(m>0){ n.textContent='increasing ↗'; n.style.color='var(--muted)'; }
    else { n.textContent='decreasing ↘'; n.style.color='var(--muted)'; }
    document.querySelectorAll('.ctrl').forEach(b=>b.classList.toggle('active', b.dataset.key===key));
  }
  function pos(e){const R=cv.getBoundingClientRect(),sx=cv.width/R.width,s=e.touches?e.touches[0]:e;return (s.clientX-R.left)*sx;}
  function setX(px){ x0=Math.round(((px-O.x)/S)*20)/20; draw(); }
  function down(e){drag=true;setX(pos(e));e.preventDefault();}
  function move(e){if(!drag)return;e.preventDefault();setX(pos(e));}
  function up(){drag=false;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);
  document.querySelectorAll('.ctrl').forEach(b=>b.addEventListener('click',()=>{ key=b.dataset.key; draw(); }));

  draw();
})();
