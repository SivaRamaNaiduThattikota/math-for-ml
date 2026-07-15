// Session 11 — gradient descent on a loss landscape (choose surface, learning rate; watch the path)
(function(){
  const cv=document.getElementById('gdplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.52}, S=45, CELL=11;
  const FN={
    bowl:(x,y)=>x*x+y*y,
    valley:(x,y)=>0.15*x*x+3*y*y,
    double:(x,y)=>(x*x-1)*(x*x-1)+y*y,
  };
  let key='bowl', eta=0.1, sx=2.6, sy=1.9, path=[], reveal=0, status='', drag=false, timer=null;
  const P=(x,y)=>({x:O.x+x*S, y:O.y-y*S});
  const f=(x,y)=>FN[key](x,y);
  const grad=(x,y)=>{const h=1e-3; return [ (f(x+h,y)-f(x-h,y))/(2*h), (f(x,y+h)-f(x,y-h))/(2*h) ];};

  function colr(t){const q=(Math.floor(Math.min(0.999,Math.max(0,t))*8)+0.5)/8;
    const lo=[42,46,92],hi=[242,206,138];
    return `rgb(${Math.round(lo[0]+(hi[0]-lo[0])*q)},${Math.round(lo[1]+(hi[1]-lo[1])*q)},${Math.round(lo[2]+(hi[2]-lo[2])*q)})`;}
  function heat(){
    const vals=[]; let mn=Infinity,mx=-Infinity;
    for(let cx=0;cx<W;cx+=CELL)for(let cy=0;cy<H;cy+=CELL){
      const wx=(cx+CELL/2-O.x)/S, wy=(O.y-(cy+CELL/2))/S, v=Math.min(f(wx,wy),60);
      vals.push({cx,cy,v}); if(v<mn)mn=v; if(v>mx)mx=v;
    }
    const rng=(mx-mn)||1;
    vals.forEach(o=>{ctx.fillStyle=colr((o.v-mn)/rng);ctx.fillRect(o.cx,o.cy,CELL+1,CELL+1);});
  }
  function draw(){
    ctx.clearRect(0,0,W,H); heat();
    // path
    if(path.length){
      ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();
      for(let k=0;k<=reveal&&k<path.length;k++){const p=P(path[k].x,path[k].y);k?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}
      ctx.stroke();
      for(let k=0;k<=reveal&&k<path.length;k++){const p=P(path[k].x,path[k].y);
        ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(p.x,p.y,2.6,0,7);ctx.fill();}
    }
    // start dot
    const s=P(sx,sy);
    ctx.fillStyle='#C13A57';ctx.strokeStyle='#fff';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(s.x,s.y,7,0,7);ctx.fill();ctx.stroke();
    // current point
    if(path.length && reveal<path.length){const c=P(path[reveal].x,path[reveal].y);
      ctx.fillStyle='#0E8C80';ctx.strokeStyle='#fff';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.arc(c.x,c.y,6,0,7);ctx.fill();ctx.stroke();}
    upd();
  }
  function upd(){
    const el=id=>document.getElementById(id), r=v=>Math.round(v*1000)/1000;
    el('rStep').textContent = path.length? Math.min(reveal,path.length-1) : 0;
    const cur = path.length? path[Math.min(reveal,path.length-1)] : {x:sx,y:sy};
    el('rLoss').textContent = r(f(cur.x,cur.y));
    const st=el('rStatus');
    st.textContent = status || 'drag the start dot, then Run';
    st.style.color = status==='diverged!' ? '#C13A57' : status==='converged ✓' ? '#0E8C80' : 'var(--muted)';
    document.querySelectorAll('.ctrl').forEach(b=>b.classList.toggle('active', b.dataset.key===key));
  }
  function compute(){
    path=[{x:sx,y:sy}]; status='running…'; let p={x:sx,y:sy};
    for(let i=0;i<70;i++){
      const g=grad(p.x,p.y);
      if(Math.hypot(g[0],g[1])<1e-3){status='converged ✓';break;}
      p={x:p.x-eta*g[0], y:p.y-eta*g[1]};
      path.push(p);
      if(Math.hypot(p.x,p.y)>14){status='diverged!';break;}
    }
    if(status==='running…') status='converged ✓';
  }
  function run(){
    if(timer)clearInterval(timer);
    compute(); reveal=0;
    if(window.MFML_REDUCED){ reveal=path.length-1; draw(); return; }
    const btn=document.getElementById('runBtn'); btn.disabled=true;
    timer=setInterval(()=>{ reveal++; draw();
      if(reveal>=path.length-1){clearInterval(timer);timer=null;btn.disabled=false;} }, 55);
  }
  function pos(e){const R=cv.getBoundingClientRect(),sc=cv.width/R.width,s=e.touches?e.touches[0]:e;return{x:(s.clientX-R.left)*sc,y:(s.clientY-R.top)*(cv.height/R.height)};}
  function down(e){const p=pos(e),sp=P(sx,sy);if(Math.hypot(p.x-sp.x,p.y-sp.y)<22){drag=true;e.preventDefault();}}
  function move(e){if(!drag)return;e.preventDefault();const p=pos(e),sn=v=>Math.round(v*10)/10;sx=sn((p.x-O.x)/S);sy=sn((O.y-p.y)/S);path=[];reveal=0;status='';draw();}
  function up(){drag=false;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);

  const sl=document.getElementById('lrSlider');
  if(sl) sl.addEventListener('input',()=>{eta=parseFloat(sl.value);document.getElementById('rLR').textContent=eta.toFixed(2);});
  document.getElementById('runBtn').addEventListener('click',run);
  document.querySelectorAll('.ctrl').forEach(b=>b.addEventListener('click',()=>{key=b.dataset.key;path=[];reveal=0;status='';draw();}));

  draw();
})();
