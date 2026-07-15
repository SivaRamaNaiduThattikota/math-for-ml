// Session 9 — gradient on a landscape: drag a point, see ∂f/∂x, ∂f/∂y and ∇f (⟂ to contours)
(function(){
  const cv=document.getElementById('gplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.52}, S=40, CELL=11;
  const FN={
    bowl:(x,y)=>x*x+y*y,
    saddle:(x,y)=>x*x-y*y,
    ellipse:(x,y)=>0.4*x*x+1.6*y*y,
    ripple:(x,y)=>Math.sin(x)+Math.cos(y),
  };
  let key='bowl', x0=1.4, y0=0.9, drag=false;
  const P=(x,y)=>({x:O.x+x*S, y:O.y-y*S});
  const f=(x,y)=>FN[key](x,y);
  const partials=(x,y)=>{const h=1e-3; return [ (f(x+h,y)-f(x-h,y))/(2*h), (f(x,y+h)-f(x,y-h))/(2*h) ];};

  function colr(t){ // banded low->high colormap
    const tb=Math.min(0.999,Math.max(0,t)); const q=(Math.floor(tb*8)+0.5)/8;
    const lo=[42,46,92], hi=[242,206,138];
    const r=Math.round(lo[0]+(hi[0]-lo[0])*q), g=Math.round(lo[1]+(hi[1]-lo[1])*q), b=Math.round(lo[2]+(hi[2]-lo[2])*q);
    return `rgb(${r},${g},${b})`;
  }
  function draw(){
    // sample values
    const cols=[], vals=[]; let mn=Infinity,mx=-Infinity;
    for(let cx=0;cx<W;cx+=CELL){ for(let cy=0;cy<H;cy+=CELL){
      const wx=(cx+CELL/2-O.x)/S, wy=(O.y-(cy+CELL/2))/S, val=f(wx,wy);
      vals.push({cx,cy,val}); if(val<mn)mn=val; if(val>mx)mx=val;
    }}
    const rng=(mx-mn)||1;
    vals.forEach(v=>{ ctx.fillStyle=colr((v.val-mn)/rng); ctx.fillRect(v.cx,v.cy,CELL+1,CELL+1); });

    // gradient arrow at (x0,y0)
    const [gx,gy]=partials(x0,y0), mag=Math.hypot(gx,gy), o=P(x0,y0);
    if(mag>1e-4){
      const ux=gx/mag, uy=gy/mag, L=1.7;
      const tip=P(x0+ux*L, y0+uy*L);
      ctx.strokeStyle='#fff';ctx.fillStyle='#fff';ctx.lineWidth=4;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(tip.x,tip.y);ctx.stroke();
      const an=Math.atan2(tip.y-o.y,tip.x-o.x),h=13;
      ctx.beginPath();ctx.moveTo(tip.x,tip.y);
      ctx.lineTo(tip.x-h*Math.cos(an-0.42),tip.y-h*Math.sin(an-0.42));
      ctx.lineTo(tip.x-h*Math.cos(an+0.42),tip.y-h*Math.sin(an+0.42));
      ctx.closePath();ctx.fill();
    }
    // point
    ctx.fillStyle='#C13A57';ctx.strokeStyle='#fff';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(o.x,o.y,7,0,7);ctx.fill();ctx.stroke();
    upd(gx,gy,mag);
  }
  function upd(gx,gy,mag){
    const r=x=>Math.round(x*100)/100, el=id=>document.getElementById(id);
    el('rFx').textContent=r(gx); el('rFy').textContent=r(gy); el('rMag').textContent=r(mag);
    const n=el('rNote');
    if(mag<0.15){ n.textContent='flat — critical point!'; n.style.color='#0E8C80'; }
    else { n.textContent='white arrow = steepest ascent'; n.style.color='var(--muted)'; }
    document.querySelectorAll('.ctrl').forEach(b=>b.classList.toggle('active', b.dataset.key===key));
  }
  function pos(e){const R=cv.getBoundingClientRect(),sx=cv.width/R.width,sy=cv.height/R.height,s=e.touches?e.touches[0]:e;return{x:(s.clientX-R.left)*sx,y:(s.clientY-R.top)*sy};}
  function setPt(p){const sn=x=>Math.round(x*10)/10; x0=sn((p.x-O.x)/S); y0=sn((O.y-p.y)/S); draw();}
  function down(e){drag=true;setPt(pos(e));e.preventDefault();}
  function move(e){if(!drag)return;e.preventDefault();setPt(pos(e));}
  function up(){drag=false;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);
  document.querySelectorAll('.ctrl').forEach(b=>b.addEventListener('click',()=>{ key=b.dataset.key; draw(); }));

  draw();
})();
