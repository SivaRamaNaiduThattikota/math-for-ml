// Session 3 — linear transformation visualizer (drag where the basis vectors land)
(function(){
  const cv=document.getElementById('tplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.52}, S=42;
  let i={x:2,y:0}, j={x:1,y:3}, drag=null;                 // images of the basis vectors
  const P=v=>({x:O.x+v.x*S, y:O.y-v.y*S});                  // plane coords -> pixels
  const toData=q=>({x:(q.x-O.x)/S, y:(O.y-q.y)/S});

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
    // faint original grid
    ctx.strokeStyle='#EDEAE0';ctx.lineWidth=1;
    for(let x=O.x%S;x<W;x+=S){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=O.y%S;y<H;y+=S){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // transformed grid (lines along i spaced by j, and along j spaced by i)
    const N=9;
    ctx.strokeStyle='#C3BCF0';ctx.lineWidth=1;
    for(let k=-N;k<=N;k++){
      let a=P({x:k*i.x-N*j.x, y:k*i.y-N*j.y}), b=P({x:k*i.x+N*j.x, y:k*i.y+N*j.y});
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      let c=P({x:k*j.x-N*i.x, y:k*j.y-N*i.y}), d=P({x:k*j.x+N*i.x, y:k*j.y+N*i.y});
      ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.stroke();
    }
    // original axes
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,O.y);ctx.lineTo(W,O.y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(O.x,0);ctx.lineTo(O.x,H);ctx.stroke();
    // unit-square image (parallelogram) — fill signals det sign
    const det=i.x*j.y - i.y*j.x;
    const o=P({x:0,y:0}), pi=P(i), pj=P(j), pij=P({x:i.x+j.x,y:i.y+j.y});
    ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(pi.x,pi.y);ctx.lineTo(pij.x,pij.y);ctx.lineTo(pj.x,pj.y);ctx.closePath();
    ctx.fillStyle = det<0 ? 'rgba(193,58,87,0.20)' : 'rgba(14,140,128,0.20)';
    ctx.fill();
    // basis image arrows + handles
    arrow(o,pj,'#0E8C80',3.5);
    arrow(o,pi,'#5A4FCF',3.5);
    [[pi,'#5A4FCF'],[pj,'#0E8C80']].forEach(([p,c])=>{
      ctx.fillStyle='#fff';ctx.strokeStyle=c;ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(p.x,p.y,8,0,7);ctx.fill();ctx.stroke();
    });
    upd(det);
  }
  function upd(det){
    const r=v=>Math.round(v*100)/100, el=id=>document.getElementById(id);
    el('rI').textContent=`[${r(i.x)}, ${r(i.y)}]`;
    el('rJ').textContent=`[${r(j.x)}, ${r(j.y)}]`;
    el('rMat').textContent=`[[${r(i.x)}, ${r(j.x)}], [${r(i.y)}, ${r(j.y)}]]`;
    el('rDet').textContent=r(det);
    el('rDet').style.color = det<-0.001 ? '#C13A57' : det>0.001 ? '#0E8C80' : '#B07514';
  }
  function pos(e){const R=cv.getBoundingClientRect(),sx=cv.width/R.width,sy=cv.height/R.height,s=e.touches?e.touches[0]:e;return{x:(s.clientX-R.left)*sx,y:(s.clientY-R.top)*sy};}
  function pick(p){const pi=P(i),pj=P(j);if(Math.hypot(p.x-pi.x,p.y-pi.y)<18)return'i';if(Math.hypot(p.x-pj.x,p.y-pj.y)<18)return'j';return null;}
  function down(e){drag=pick(pos(e));if(drag)e.preventDefault();}
  function move(e){if(!drag)return;e.preventDefault();const d=toData(pos(e)),sn=v=>Math.round(v*2)/2;if(drag==='i')i={x:sn(d.x),y:sn(d.y)};else j={x:sn(d.x),y:sn(d.y)};draw();}
  function up(){drag=null;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);

  const rb=document.getElementById('resetBtn');
  if(rb) rb.addEventListener('click',()=>{ i={x:1,y:0}; j={x:0,y:1}; draw(); });

  draw();
})();
