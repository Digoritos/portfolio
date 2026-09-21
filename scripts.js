(function(){
  const BTN_TOP = document.getElementById('backToTop');
  const ZMODAL  = document.getElementById('zoom-modal');
  const ZIMG    = document.getElementById('zoom-img');
  const ZCLOSE  = document.getElementById('zoom-close');
  let zoomOpen = false;

  /* ── IntersectionObserver: video play/pause ── */
  const videoObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause(); });
  },{threshold:0.1});

  /* ── lazy load media ── */
  document.querySelectorAll('video.lazy-video').forEach(v=>{
    const webm=v.dataset.webm,gif=v.dataset.gif;
    if(webm){const s=document.createElement('source');s.src=webm;s.type='video/webm';v.appendChild(s);}
    if(gif){const s=document.createElement('source');s.src=gif;s.type='image/gif';v.appendChild(s);}
    v.load();
    videoObs.observe(v);
  });

  /* ── YouTube lite embed ── */
  document.addEventListener('click',e=>{
    const el=e.target.closest('.yt-lite');
    if(!el||el.querySelector('iframe')) return;
    const id=el.dataset.videoid;
    const iframe=document.createElement('iframe');
    iframe.src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    iframe.allow='accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture';
    iframe.allowFullscreen=true;iframe.loading='lazy';
    el.innerHTML='';el.appendChild(iframe);
  });

  /* ── Zoom modal ── */
  function openZoom(src,alt){
    ZIMG.src=src; ZIMG.alt=alt||'';
    ZMODAL.classList.remove('opacity-0','pointer-events-none');
    ZMODAL.classList.add('opacity-100');
    zoomOpen=true;
    document.documentElement.style.overflow='hidden';
  }
  function closeZoom(){
    ZMODAL.classList.add('opacity-0','pointer-events-none');
    ZMODAL.classList.remove('opacity-100');
    zoomOpen=false;
    document.documentElement.style.overflow='';
    setTimeout(()=>{ if(!zoomOpen) ZIMG.src=''; },200);
  }
  document.addEventListener('click',e=>{
    const zImg=e.target.closest('.zoomable');
    if(zImg){ openZoom(zImg.dataset.fullsrc||zImg.src, zImg.alt); return; }
    if(e.target===ZMODAL||e.target===ZCLOSE||ZCLOSE.contains(e.target)) closeZoom();
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&zoomOpen) closeZoom(); });
  window.addEventListener('orientationchange',()=>{ if(zoomOpen){ ZIMG.style.maxWidth='95vw'; ZIMG.style.maxHeight='95vh'; } });

  /* ── back to top ── */
  function onScroll(){
    window.scrollY>400
      ?BTN_TOP.classList.remove('opacity-0','pointer-events-none','translate-y-3')
      :BTN_TOP.classList.add('opacity-0','pointer-events-none','translate-y-3');
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  BTN_TOP.classList.add('opacity-0','pointer-events-none','translate-y-3');
  BTN_TOP.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  document.addEventListener('click',e=>{
    if(e.target.closest('.js-footer-top')) window.scrollTo({top:0,behavior:'smooth'});
  });

  /* ── responsive button sizes ── */
  function resizeBtns(){
    const D=window.innerWidth>=1024;
    document.querySelectorAll('.js-nav-work').forEach(b=>{
      b.style.width=D?'108px':'75.6px'; b.style.height=D?'40px':'28px';
      const s=b.querySelector('span'); if(s){s.style.fontSize=D?'23px':'16.2px';s.style.fontWeight='300';}
    });
    document.querySelectorAll('.js-nav-about').forEach(b=>{
      b.style.width=D?'108px':'84px'; b.style.height=D?'40px':'28px';
      const s=b.querySelector('span'); if(s){s.style.fontSize=D?'23px':'16.2px';s.style.fontWeight='300';}
    });
    document.querySelectorAll('#li-btn').forEach(b=>{ b.style.width=b.style.height=D?'40px':'28px'; });
    document.querySelectorAll('#li-icon').forEach(i=>{ i.style.width=i.style.height=D?'30px':'20px'; });
  }
  window.addEventListener('resize',resizeBtns);

  /* ── init ── */
  resizeBtns();
})();
