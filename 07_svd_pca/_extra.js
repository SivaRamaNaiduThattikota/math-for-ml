// Session 7 — SVD geometry: the unit circle maps to an ellipse whose axes are the singular values
(function(){
  const cv=document.getElementById('vplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.52}, S=52;
  let i={x:2,y:0.4}, j={x:0.6,y:1.6}, drag=null;   // columns of A (images of basis)
  const P=p=>({x:O.x+p.x*S, y:O.y-p.y*S});
  const toData=q=>({x:(q.x-O.x)/S, y:(O.y-q.y)/S});
  const applyM=p=>({x:i.x*p.x + j.x*p.y, y:i.y*p.x + j.y*p.y});

  function svd2(){
    const a=i.x,b=j.x,c=i.y,d=j.y;                 // A = [[a,b],[c,d]]
    const p=a*a+c*c, q=a*b+c*d, r=b*b+d*d;         // A^T A (symmetric)
    const tr=p+r, det=p*r-q*q, disc=Math.sqrt(Math.max(0,tr*tr-4*det));
    const l=[(tr+disc)/2,(tr-disc)/2];
    const V=l.map(lam=>{
      let e = Math.abs(q)>1e-9 ? [q, lam-p] : (Math.abs(lam-p)<1e-9?[1,0]:[0,1]);
      const n=Math.hypot(e[0],e[1])||1; return {x:e[0]/n, y:e[1]/n};
    });
    const sig=l.map(x=>Math.sqrt(Math.max(0,x)));
    const U=V.map((v,k)=>{ const av=applyM(v), n=sig[k]>1e-6?sig[k]:1; return {x:av.x/n,y:av.y/n}; });
    return {sig, V, U};
  }
  function arrow(f,t,col,w){
    ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(t.x,t.y);ctx.stroke();
    const an=Math.atan2(t.y-f.y,t.x-f.x),h=12;
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

    // unit circle (faint)
    ctx.strokeStyle='#C3BCF0';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);
    ctx.beginPath();
    for(let k=0;k<=64;k++){const t=k/64*2*Math.PI,pp=P({x:Math.cos(t),y:Math.sin(t)});k?ctx.lineTo(pp.x,pp.y):ctx.moveTo(pp.x,pp.y);}
    ctx.stroke();ctx.setLineDash([]);
    // image ellipse
    ctx.strokeStyle='#B07514';ctx.lineWidth=2.5;ctx.fillStyle='rgba(176,117,20,0.10)';
    ctx.beginPath();
    for(let k=0;k<=64;k++){const t=k/64*2*Math.PI,pp=P(applyM({x:Math.cos(t),y:Math.sin(t)}));k?ctx.lineTo(pp.x,pp.y):ctx.moveTo(pp.x,pp.y);}
    ctx.closePath();ctx.fill();ctx.stroke();

    const {sig,V,U}=svd2(), o=P({x:0,y:0});
    // right singular vectors on the unit circle -> matching ellipse axes
    const cols=['#5A4FCF','#0E8C80'];
    for(let k=0;k<2;k++){
      arrow(o, P(V[k]), cols[k], 2);                                  // input direction on circle
      arrow(o, P({x:sig[k]*U[k].x, y:sig[k]*U[k].y}), cols[k], 3.5);  // stretched ellipse axis
    }
    // draggable column handles
    [[P(i),'#8A8698'],[P(j),'#8A8698']].forEach(([pp,c])=>{
      ctx.fillStyle='#fff';ctx.strokeStyle=c;ctx.lineWidth=2.5;
      ctx.beginPath();ctx.arc(pp.x,pp.y,7,0,7);ctx.fill();ctx.stroke();
    });
    upd(sig);
  }
  function upd(sig){
    const r=x=>Math.round(x*100)/100, el=id=>document.getElementById(id);
    el('rS1').textContent=r(sig[0]); el('rS2').textContent=r(sig[1]);
    const rank=(sig[0]>0.05?1:0)+(sig[1]>0.05?1:0);
    el('rRank').textContent=rank; el('rRank').style.color = rank===2?'#0E8C80':'#C13A57';
    el('rCond').textContent = sig[1]>0.05 ? r(sig[0]/sig[1]) : '∞ (near-singular)';
  }
  function pos(e){const R=cv.getBoundingClientRect(),sx=cv.width/R.width,sy=cv.height/R.height,s=e.touches?e.touches[0]:e;return{x:(s.clientX-R.left)*sx,y:(s.clientY-R.top)*sy};}
  function pick(p){const pi=P(i),pj=P(j);if(Math.hypot(p.x-pi.x,p.y-pi.y)<18)return'i';if(Math.hypot(p.x-pj.x,p.y-pj.y)<18)return'j';return null;}
  function down(e){drag=pick(pos(e));if(drag)e.preventDefault();}
  function move(e){if(!drag)return;e.preventDefault();const d=toData(pos(e)),sn=x=>Math.round(x*10)/10;if(drag==='i')i={x:sn(d.x),y:sn(d.y)};else j={x:sn(d.x),y:sn(d.y)};draw();}
  function up(){drag=null;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);

  draw();
})();
