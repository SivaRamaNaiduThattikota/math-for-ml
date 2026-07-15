// Session 5 — span & rank playground (drag two vectors; watch the reachable set)
(function(){
  const cv=document.getElementById('splay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.52}, S=44;
  let v={x:2,y:1}, w={x:-1,y:1}, drag=null;
  const P=p=>({x:O.x+p.x*S, y:O.y-p.y*S});
  const toData=q=>({x:(q.x-O.x)/S, y:(O.y-q.y)/S});
  const EPS=0.12;

  function arrow(f,t,col){
    ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=3.5;ctx.lineCap='round';
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

    const cross=v.x*w.y - v.y*w.x;
    const rank=(Math.abs(cross)>EPS)?2:((Math.hypot(v.x,v.y)>1e-6||Math.hypot(w.x,w.y)>1e-6)?1:0);

    // if rank 1, draw the span line through origin along the nonzero vector
    if(rank===1){
      const d=(Math.hypot(v.x,v.y)>1e-6)?v:w, L=40;
      const a=P({x:-L*d.x,y:-L*d.y}), b=P({x:L*d.x,y:L*d.y});
      ctx.strokeStyle='#B07514';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    }
    // lattice of integer combinations i*v + j*w
    ctx.fillStyle = rank===2 ? 'rgba(90,79,207,0.55)' : 'rgba(176,117,20,0.75)';
    for(let i=-9;i<=9;i++) for(let j=-9;j<=9;j++){
      const px=P({x:i*v.x+j*w.x, y:i*v.y+j*w.y});
      if(px.x<-5||px.x>W+5||px.y<-5||px.y>H+5) continue;
      ctx.beginPath();ctx.arc(px.x,px.y,2.4,0,7);ctx.fill();
    }
    // vectors + handles
    const o=P({x:0,y:0});
    arrow(o,P(w),'#0E8C80'); arrow(o,P(v),'#5A4FCF');
    [[P(v),'#5A4FCF'],[P(w),'#0E8C80']].forEach(([p,c])=>{
      ctx.fillStyle='#fff';ctx.strokeStyle=c;ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(p.x,p.y,8,0,7);ctx.fill();ctx.stroke();
    });
    upd(rank);
  }
  function upd(rank){
    const r=x=>Math.round(x*100)/100, el=id=>document.getElementById(id);
    el('rV').textContent=`[${r(v.x)}, ${r(v.y)}]`;
    el('rW').textContent=`[${r(w.x)}, ${r(w.y)}]`;
    const span = rank===2 ? 'the whole plane' : rank===1 ? 'a line through the origin' : 'just the origin';
    el('rSpan').textContent=span; el('rRank').textContent=rank;
    el('rRank').style.color = rank===2 ? '#0E8C80' : '#C13A57';
  }
  function pos(e){const R=cv.getBoundingClientRect(),sx=cv.width/R.width,sy=cv.height/R.height,s=e.touches?e.touches[0]:e;return{x:(s.clientX-R.left)*sx,y:(s.clientY-R.top)*sy};}
  function pick(p){const pv=P(v),pw=P(w);if(Math.hypot(p.x-pv.x,p.y-pv.y)<18)return'v';if(Math.hypot(p.x-pw.x,p.y-pw.y)<18)return'w';return null;}
  function down(e){drag=pick(pos(e));if(drag)e.preventDefault();}
  function move(e){if(!drag)return;e.preventDefault();const d=toData(pos(e)),sn=x=>Math.round(x*2)/2;if(drag==='v')v={x:sn(d.x),y:sn(d.y)};else w={x:sn(d.x),y:sn(d.y)};draw();}
  function up(){drag=null;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);

  draw();
})();
