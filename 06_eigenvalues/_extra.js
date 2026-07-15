// Session 6 — eigenvector hunt: drag v, watch Av; align onto an eigen-line
(function(){
  const cv=document.getElementById('eplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.52}, S=48;
  const PRESET={ sym:[[2,1],[1,2]], diag:[[3,0],[0,1]], shear:[[1,1],[0,1]], rot:[[0,-1],[1,0]] };
  let key='sym', v={x:1,y:0.5}, drag=null;
  const P=p=>({x:O.x+p.x*S, y:O.y-p.y*S});
  const toData=q=>({x:(q.x-O.x)/S, y:(O.y-q.y)/S});
  const applyM=(M,p)=>({x:M[0][0]*p.x+M[0][1]*p.y, y:M[1][0]*p.x+M[1][1]*p.y});

  function eig2(M){
    const a=M[0][0],b=M[0][1],c=M[1][0],d=M[1][1], tr=a+d, det=a*d-b*c, disc=tr*tr-4*det;
    if(disc < -1e-9) return {real:false, tr, det};
    const s=Math.sqrt(Math.max(0,disc)), ls=[(tr+s)/2,(tr-s)/2];
    const vecs=ls.map(l=>{
      let e;
      if(Math.abs(b)>1e-9) e=[b, l-a];
      else if(Math.abs(c)>1e-9) e=[l-d, c];
      else e = Math.abs(l-a)<1e-9 ? [1,0] : [0,1];
      const n=Math.hypot(e[0],e[1])||1; return [e[0]/n, e[1]/n];
    });
    return {real:true, vals:ls, vecs};
  }
  function arrow(f,t,col,w){
    ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(t.x,t.y);ctx.stroke();
    const an=Math.atan2(t.y-f.y,t.x-f.x),h=13;
    ctx.beginPath();ctx.moveTo(t.x,t.y);
    ctx.lineTo(t.x-h*Math.cos(an-0.42),t.y-h*Math.sin(an-0.42));
    ctx.lineTo(t.x-h*Math.cos(an+0.42),t.y-h*Math.sin(an+0.42));
    ctx.closePath();ctx.fill();
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#EDEAE0';ctx.lineWidth=1;
    for(let x=O.x%S;x<W;x+=S){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=O.y%S;y<H;y+=S){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,O.y);ctx.lineTo(W,O.y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(O.x,0);ctx.lineTo(O.x,H);ctx.stroke();

    const M=PRESET[key], E=eig2(M);
    // eigen-lines
    if(E.real){
      ctx.setLineDash([7,6]); ctx.strokeStyle='#B07514'; ctx.lineWidth=2; const L=30;
      const seen=[];
      E.vecs.forEach(e=>{
        if(seen.some(s=>Math.abs(s[0]*e[1]-s[1]*e[0])<1e-6)) return; seen.push(e);
        const a=P({x:-L*e[0],y:-L*e[1]}), b=P({x:L*e[0],y:L*e[1]});
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      });
      ctx.setLineDash([]);
    }
    const Av=applyM(M,v);
    // angle between v and Av
    const dot=v.x*Av.x+v.y*Av.y, mv=Math.hypot(v.x,v.y), mAv=Math.hypot(Av.x,Av.y);
    let ang = (mv>1e-6&&mAv>1e-6) ? Math.acos(Math.max(-1,Math.min(1,dot/(mv*mAv))))*180/Math.PI : 0;
    const aligned = mAv>1e-6 && (ang<6 || ang>174);
    arrow(P({x:0,y:0}), P(Av), aligned?'#0E8C80':'#B07514', 3);
    arrow(P({x:0,y:0}), P(v), '#5A4FCF', 3.5);
    ctx.fillStyle='#fff';ctx.strokeStyle='#5A4FCF';ctx.lineWidth=3;
    const pv=P(v); ctx.beginPath();ctx.arc(pv.x,pv.y,8,0,7);ctx.fill();ctx.stroke();
    upd(E, ang, aligned, dot, mv);
  }
  function upd(E, ang, aligned, dot, mv){
    const r=x=>Math.round(x*100)/100, el=id=>document.getElementById(id), M=PRESET[key];
    el('rMat').textContent=`[[${M[0][0]}, ${M[0][1]}], [${M[1][0]}, ${M[1][1]}]]`;
    el('rEig').textContent = E.real ? E.vals.map(x=>r(x)).join(', ') : 'complex (no real eigenvectors)';
    el('rAngle').textContent = r(ang)+'°';
    const st=el('rStatus');
    if(aligned){ const lam=r(dot/(mv*mv)); st.textContent=`✓ eigenvector!  λ ≈ ${lam}`; st.style.color='#0E8C80'; }
    else { st.textContent='drag v onto a dashed line'; st.style.color='var(--muted)'; }
    document.querySelectorAll('.ctrl').forEach(b=>b.classList.toggle('active', b.dataset.key===key));
  }
  function pos(e){const R=cv.getBoundingClientRect(),sx=cv.width/R.width,sy=cv.height/R.height,s=e.touches?e.touches[0]:e;return{x:(s.clientX-R.left)*sx,y:(s.clientY-R.top)*sy};}
  function down(e){const p=pos(e),pv=P(v);if(Math.hypot(p.x-pv.x,p.y-pv.y)<20){drag=true;e.preventDefault();}}
  function move(e){if(!drag)return;e.preventDefault();const d=toData(pos(e)),sn=x=>Math.round(x*4)/4;v={x:sn(d.x),y:sn(d.y)};draw();}
  function up(){drag=false;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);
  document.querySelectorAll('.ctrl').forEach(b=>b.addEventListener('click',()=>{ key=b.dataset.key; draw(); }));

  draw();
})();
