// Session 10 — single-neuron forward pass + backprop sweep
(function(){
  const cv=document.getElementById('bplay'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height, YC=150;
  const X=1.5, Y=1.0;
  const sig=z=>1/(1+Math.exp(-z));
  let w=0.5, hi=-1, timer=null;
  const CX=[110,350,590,820], BW=150, BH=64;
  const r2=v=>Math.round(v*1000)/1000;

  function state(){
    const z=w*X, a=sig(z), L=(a-Y)*(a-Y);
    const dLda=2*(a-Y), dLdz=dLda*a*(1-a), dLdw=dLdz*X;
    return {z,a,L,dLda,dLdz,dLdw};
  }
  function rrect(x,y,ww,hh,rad){ctx.beginPath();ctx.moveTo(x+rad,y);ctx.arcTo(x+ww,y,x+ww,y+hh,rad);ctx.arcTo(x+ww,y+hh,x,y+hh,rad);ctx.arcTo(x,y+hh,x,y,rad);ctx.arcTo(x,y,x+ww,y,rad);ctx.closePath();}
  function node(cx,label,val){
    rrect(cx-BW/2, YC-BH/2, BW, BH, 12);
    ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#5A4FCF';ctx.lineWidth=2;ctx.stroke();
    ctx.textAlign='center';
    ctx.fillStyle='#131219';ctx.font='600 15px Inter,sans-serif';ctx.fillText(label,cx,YC-6);
    ctx.fillStyle='#5A4FCF';ctx.font='600 15px "JetBrains Mono",monospace';ctx.fillText(String(r2(val)),cx,YC+18);
  }
  function edge(i, local, back, active){
    const x1=CX[i]+BW/2, x2=CX[i+1]-BW/2, mid=(x1+x2)/2;
    ctx.strokeStyle=active?'#0E8C80':'#C9C4B6';ctx.lineWidth=active?3:2;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(x1,YC);ctx.lineTo(x2-8,YC);ctx.stroke();
    ctx.fillStyle=active?'#0E8C80':'#C9C4B6';
    ctx.beginPath();ctx.moveTo(x2,YC);ctx.lineTo(x2-9,YC-5);ctx.lineTo(x2-9,YC+5);ctx.closePath();ctx.fill();
    ctx.textAlign='center';
    ctx.fillStyle='#8A8698';ctx.font='11px "JetBrains Mono",monospace';ctx.fillText(local,mid,YC+34);
    ctx.fillStyle='#B07514';ctx.font=(active?'600 ':'')+'12px "JetBrains Mono",monospace';ctx.fillText(back,mid,YC-26);
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const s=state();
    // backward-flow header
    ctx.textAlign='center';ctx.fillStyle='#B07514';ctx.font='11px "JetBrains Mono",monospace';
    ctx.fillText('◄ gradient flows back (upstream × local)', W/2, 34);
    // edges (drawn first, behind boxes)
    edge(0, '∂z/∂w = x = 1.5', 'dL/dw = '+r2(s.dLdw), hi===0);
    edge(1, "σ'(z) = a(1−a)",  'dL/dz = '+r2(s.dLdz), hi===1);
    edge(2, '∂L/∂a = 2(a−y)',  'dL/da = '+r2(s.dLda), hi===2);
    // seed gradient at L
    ctx.fillStyle='#B07514';ctx.font='600 12px "JetBrains Mono",monospace';ctx.fillText('dL/dL = 1', CX[3], YC-26);
    // nodes
    node(CX[0],'w', w);
    node(CX[1],'z = w·x', s.z);
    node(CX[2],'a = σ(z)', s.a);
    node(CX[3],'L = (a−y)²', s.L);
    // forward header
    ctx.fillStyle='#5A4FCF';ctx.font='11px "JetBrains Mono",monospace';
    ctx.fillText('forward pass ►', W/2, H-24);
    upd(s);
  }
  function upd(s){
    const el=id=>document.getElementById(id);
    el('rL').textContent=r2(s.L); el('rGrad').textContent=r2(s.dLdw);
    el('rGrad').style.color = Math.abs(s.dLdw)<0.02 ? '#0E8C80' : '#B07514';
  }
  const sl=document.getElementById('wSlider');
  if(sl) sl.addEventListener('input',()=>{ w=parseFloat(sl.value); draw(); });
  const btn=document.getElementById('bpBtn');
  if(btn) btn.addEventListener('click',()=>{
    if(window.MFML_REDUCED){ return; }
    if(timer) clearInterval(timer);
    btn.disabled=true; let k=2;
    hi=k; draw();
    timer=setInterval(()=>{ k--; if(k<0){ clearInterval(timer);timer=null;hi=-1;btn.disabled=false; draw(); return;} hi=k; draw(); }, 650);
  });
  draw();
})();
