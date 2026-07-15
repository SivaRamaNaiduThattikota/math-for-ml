// Session 2 — dot product / projection playground
(function(){
  const cv=document.getElementById('dplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, O={x:W*0.5,y:H*0.52}, S=44;
  let a={x:4,y:2}, b={x:1,y:3}, drag=null;
  const px=p=>({x:O.x+p.x*S,y:O.y-p.y*S});
  const dt=q=>({x:(q.x-O.x)/S,y:(O.y-q.y)/S});

  function arrow(f,t,col,w){
    ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(t.x,t.y);ctx.stroke();
    const an=Math.atan2(t.y-f.y,t.x-f.x),h=13;
    ctx.beginPath();ctx.moveTo(t.x,t.y);
    ctx.lineTo(t.x-h*Math.cos(an-0.42),t.y-h*Math.sin(an-0.42));
    ctx.lineTo(t.x-h*Math.cos(an+0.42),t.y-h*Math.sin(an+0.42));
    ctx.closePath();ctx.fill();
  }
  function base(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#EDEAE0';ctx.lineWidth=1;
    for(let x=O.x%S;x<W;x+=S){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=O.y%S;y<H;y+=S){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle='#C9C4B6';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,O.y);ctx.lineTo(W,O.y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(O.x,0);ctx.lineTo(O.x,H);ctx.stroke();
  }
  function draw(){
    base();
    const bb=b.x*b.x+b.y*b.y;
    const dot=a.x*b.x+a.y*b.y;
    const k= bb>0 ? dot/bb : 0;
    const proj={x:k*b.x, y:k*b.y};                 // projection vector of a onto b
    const pa=px(a), pb=px(b), pp=px(proj);
    // projection (amber) + dashed perpendicular from a tip to proj tip
    ctx.setLineDash([6,6]); ctx.strokeStyle='#9C99A6'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pp.x,pp.y); ctx.stroke();
    ctx.setLineDash([]);
    arrow(O,pp,'#B07514',5);
    arrow(O,pb,'#0E8C80',3.5);
    arrow(O,pa,'#5A4FCF',3.5);
    [[pa,'#5A4FCF'],[pb,'#0E8C80']].forEach(([p,c])=>{
      ctx.fillStyle='#fff';ctx.strokeStyle=c;ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(p.x,p.y,8,0,7);ctx.fill();ctx.stroke();
    });
    upd(dot);
  }
  function upd(dot){
    const mA=Math.hypot(a.x,a.y), mB=Math.hypot(b.x,b.y), r=v=>Math.round(v*100)/100;
    const cos=(mA>0&&mB>0)? Math.max(-1,Math.min(1,dot/(mA*mB))):0;
    const ang=Math.acos(cos)*180/Math.PI;
    const projLen=mB>0? dot/mB : 0;
    const el=id=>document.getElementById(id);
    el('rA').textContent=`[${r(a.x)}, ${r(a.y)}]`; el('rB').textContent=`[${r(b.x)}, ${r(b.y)}]`;
    el('rDot').textContent=r(dot); el('rAng').textContent=r(ang);
    el('rCos').textContent=cos.toFixed(2); el('rProj').textContent=r(projLen);
    // colour the dot readout by sign (agreement cue)
    el('rDot').style.color = dot>0.001 ? '#0E8C80' : dot<-0.001 ? '#C13A57' : '#B07514';
  }
  function pos(e){const R=cv.getBoundingClientRect(),sx=cv.width/R.width,sy=cv.height/R.height,s=e.touches?e.touches[0]:e;return{x:(s.clientX-R.left)*sx,y:(s.clientY-R.top)*sy};}
  function pick(p){const pa=px(a),pb=px(b);if(Math.hypot(p.x-pa.x,p.y-pa.y)<18)return'a';if(Math.hypot(p.x-pb.x,p.y-pb.y)<18)return'b';return null;}
  function down(e){drag=pick(pos(e));if(drag)e.preventDefault();}
  function move(e){if(!drag)return;e.preventDefault();const d=dt(pos(e)),sn=v=>Math.round(v*2)/2;if(drag==='a')a={x:sn(d.x),y:sn(d.y)};else b={x:sn(d.x),y:sn(d.y)};draw();}
  function up(){drag=null;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);

  // sweep b through 360° to show the dot product change sign
  const btn=document.getElementById('sweepBtn');
  if(btn) btn.addEventListener('click',()=>{
    if(window.MFML_REDUCED){ return; }
    btn.disabled=true; const orig=btn.textContent; btn.textContent='sweeping…';
    const r=Math.hypot(b.x,b.y)||3, start=Math.atan2(b.y,b.x);
    let step=0; const N=120;
    const iv=setInterval(()=>{
      step++; const ang=start+ (step/N)*2*Math.PI;
      b={x:Math.round(r*Math.cos(ang)*2)/2, y:Math.round(r*Math.sin(ang)*2)/2}; draw();
      if(step>=N){ clearInterval(iv); btn.disabled=false; btn.textContent=orig; }
    },24);
  });

  draw();
})();
