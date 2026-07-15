(function(){
  const cv=document.getElementById('vplay'), ctx=cv.getContext('2d');
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
    const pa=px(a),pb=px(b),ps=px({x:a.x+b.x,y:a.y+b.y});
    ctx.setLineDash([6,6]);ctx.strokeStyle='#D9B679';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(ps.x,ps.y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pb.x,pb.y);ctx.lineTo(ps.x,ps.y);ctx.stroke();
    ctx.setLineDash([]);
    arrow(O,ps,'#B07514',2.5);
    arrow(O,pa,'#5A4FCF',3.5);
    arrow(O,pb,'#0E8C80',3.5);
    [[pa,'#5A4FCF'],[pb,'#0E8C80']].forEach(([p,c])=>{
      ctx.fillStyle='#fff';ctx.strokeStyle=c;ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(p.x,p.y,8,0,7);ctx.fill();ctx.stroke();
    });
    upd();
  }
  function upd(){
    const dot=a.x*b.x+a.y*b.y, mA=Math.hypot(a.x,a.y), mB=Math.hypot(b.x,b.y), r=v=>Math.round(v*100)/100;
    const ang=(mA>0&&mB>0)?Math.acos(Math.max(-1,Math.min(1,dot/(mA*mB))))*180/Math.PI:0;
    rA.textContent=`[${r(a.x)}, ${r(a.y)}]`; rB.textContent=`[${r(b.x)}, ${r(b.y)}]`;
    rSum.textContent=`[${r(a.x+b.x)}, ${r(a.y+b.y)}]`; rMagA.textContent=r(mA);
    rDot.textContent=r(dot); rAng.textContent=r(ang);
  }
  function pos(e){const R=cv.getBoundingClientRect(),sx=cv.width/R.width,sy=cv.height/R.height,s=e.touches?e.touches[0]:e;return{x:(s.clientX-R.left)*sx,y:(s.clientY-R.top)*sy};}
  function pick(p){const pa=px(a),pb=px(b);if(Math.hypot(p.x-pa.x,p.y-pa.y)<18)return'a';if(Math.hypot(p.x-pb.x,p.y-pb.y)<18)return'b';return null;}
  function down(e){drag=pick(pos(e));if(drag)e.preventDefault();}
  function move(e){if(!drag)return;e.preventDefault();const d=dt(pos(e)),sn=v=>Math.round(v*2)/2;if(drag==='a')a={x:sn(d.x),y:sn(d.y)};else b={x:sn(d.x),y:sn(d.y)};draw();}
  function up(){drag=null;}
  cv.addEventListener('mousedown',down);cv.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);

  // tip-to-tail animation of a + b, exposed for the button
  window.__animateAdd=function(){
    const pa=px(a), ps=px({x:a.x+b.x,y:a.y+b.y});
    let step=0; const N=64;
    const timer=setInterval(()=>{
      step++; const t=step/N;
      base();
      arrow(O,pa,'#5A4FCF',3.5);                                  // a, fully
      const g=Math.min(1,t*2);                                    // b grows from a's tip in first half
      arrow(pa,{x:pa.x+(ps.x-pa.x)*g,y:pa.y+(ps.y-pa.y)*g},'#0E8C80',3.5);
      if(t>0.5){ const s2=(t-0.5)/0.5;                             // sum grows in second half
        arrow(O,{x:O.x+(ps.x-O.x)*s2,y:O.y+(ps.y-O.y)*s2},'#B07514',2.5); }
      if(step>=N){ clearInterval(timer); draw(); }
    },16);
  };
  draw();
})();

// L1<->L2 morph slider
(function(){
  const s=document.getElementById('pSlider'), path=document.getElementById('morphPath'),
        pv=document.getElementById('pVal'), dv=document.getElementById('distVal');
  if(!s) return;
  // origin(60,220) -> point(220,100). L1 corner=(220,220); L2 midpoint=(140,160)
  function render(){
    const p=parseFloat(s.value), t=(p-1);                 // 0 at L1, 1 at L2
    const cx=220+(140-220)*t, cy=220+(160-220)*t;         // control point interpolation
    path.setAttribute('d',`M60,220 Q${cx.toFixed(0)},${cy.toFixed(0)} 220,100`);
    const dist=Math.pow(Math.pow(4,p)+Math.pow(3,p),1/p);
    pv.textContent=p.toFixed(2); dv.textContent=dist.toFixed(2);
  }
  s.addEventListener('input',render); render();
})();

// animate a+b tip-to-tail (drives a temporary overlay on the main canvas figure)
(function(){
  const btn=document.getElementById('animAdd'); if(!btn) return;
  btn.addEventListener('click',()=>{
    btn.disabled=true; const orig=btn.textContent; btn.textContent='animating…';
    // simple visual cue: flash the sum readout; full canvas animation handled by drawing loop hook
    const el=document.getElementById('rSum');
    let n=0; const iv=setInterval(()=>{ el.style.transition='color .2s'; el.style.color=(n%2? '#B07514':'#26252E'); n++;
      if(n>6){clearInterval(iv); el.style.color=''; btn.disabled=false; btn.textContent=orig;}},180);
    window.__animateAdd && window.__animateAdd();
  });
})();
