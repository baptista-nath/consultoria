/* Contador regressivo - ajustável para a data da Black Friday */
document.addEventListener('DOMContentLoaded', function(){
  // Defina a data alvo (exemplo: 30 de novembro 23:59 local)
  const target = new Date();
  // Se agora for antes do final de novembro, defina para 30/11 do ano atual
  target.setMonth(10); // novembro (0-indexed)
  target.setDate(30);
  target.setHours(23,59,59,999);

  const timerEl = document.getElementById('countdown-timer');
  function updateTimer(){
    const now = new Date();
    let diff = target - now;
    if(diff <= 0){
      timerEl.textContent = 'Oferta expirada';
      return clearInterval(interval);
    }
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = String(Math.floor(diff / (1000*60*60))).padStart(2,'0');
    diff -= hours * (1000*60*60);
    const mins = String(Math.floor(diff / (1000*60))).padStart(2,'0');
    diff -= mins * (1000*60);
    const secs = String(Math.floor(diff / 1000)).padStart(2,'0');
    timerEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
  }
  const interval = setInterval(updateTimer, 1000);
  updateTimer();

  // Preenche ano no rodapé
  document.getElementById('year').textContent = new Date().getFullYear();

  // --- Lightweight A/B headline variant picker ---
  // basic event tracker that calls gtag if available, otherwise logs to console
  function trackEvent(name, params){
    try{
      console.log('trackEvent', name, params || {});
      if(window.gtag) gtag('event', name, params || {});
    }catch(e){ /* ignore */ }
  }

  (function pickHeadlineVariant(){
    try{
      const key = 'intureon_h1_variant_v1';
      let v = localStorage.getItem(key);
      if(!v){
        v = (Math.random() < 0.5) ? 'A' : 'B';
        localStorage.setItem(key, v);
      }
      const variants = document.querySelectorAll('.h1-variant');
      variants.forEach(el => {
        const isThis = el.dataset.variant === v;
        el.style.display = isThis ? '' : 'none';
        el.setAttribute('aria-hidden', isThis ? 'false' : 'true');
      });
      trackEvent('h1_variant_shown', {variant: v});
    }catch(err){ /* ignore */ }
  })();

  // --- Slots / Vagas counter (persistent) ---
  const SLOTS_KEY = 'intureon_slots_v1';
  let slots = Number(localStorage.getItem(SLOTS_KEY) || 12);
  function updateSlotsDisplay(){
    const el = document.getElementById('slot-count');
    if(el) el.textContent = String(Math.max(0, slots));
    // update offer note if present
    const offerNote = document.querySelector('.offer-card .price .old');
    if(offerNote) offerNote.textContent = slots > 0 ? `Vagas restantes: ${slots}` : 'Turma esgotada';
    // disable all lead-form submit buttons if no slots
    const submits = document.querySelectorAll('.lead-form button[type="submit"]');
    submits.forEach(btn => btn.disabled = slots <= 0);
  }
  updateSlotsDisplay();

  // Form submission (mock) - envia para endpoint via fetch se configurado
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    feedback.textContent = '';
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      offer: 'Black Friday 40% OFF'
    };

    // validação simples
    if(!data.name || !data.email || !data.message){
      feedback.textContent = 'Por favor preencha os campos obrigatórios.';
      return;
    }

    // Simula envio
    try{
      feedback.textContent = 'Enviando...';
      await new Promise(r => setTimeout(r, 900));
      feedback.textContent = 'Obrigado! Recebemos sua solicitação. Iremos entrar em contato em até 24h.';
      form.reset();
    }catch(err){
      feedback.textContent = 'Ocorreu um erro ao enviar. Tente novamente.';
    }
  });

  // Botão schedule rápido (ex.: abrir calendly - placeholder)
  document.getElementById('btn-schedule').addEventListener('click', function(){
    window.open('https://calendly.com/', '_blank');
  });

  // Vídeo modal (abrir/fechar)
  const videoThumb = document.querySelector('.video-thumb');
  function openVideoModal(src){
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.innerHTML = `<div class="inner" tabindex="-1"><button class="close-modal" aria-label="Fechar" style="position:absolute;right:12px;top:12px;background:transparent;border:0;color:#fff;font-size:22px;cursor:pointer">×</button><iframe src="${src}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>`;
    modal.addEventListener('click', function(e){
      if(e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);

    // focus management: focus inner container and trap focus
    const inner = modal.querySelector('.inner');
    const focusableSelector = 'a[href], area[href], input:not([disabled]), button:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(modal.querySelectorAll(focusableSelector));
    const firstFocusable = focusables[0] || inner;
    firstFocusable.focus();

    function handleKey(e){
      if(e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', handleKey); }
      if(e.key === 'Tab' && focusables.length){
        const idx = focusables.indexOf(document.activeElement);
        if(e.shiftKey){
          if(idx === 0){ e.preventDefault(); focusables[focusables.length-1].focus(); }
        } else {
          if(idx === focusables.length-1){ e.preventDefault(); focusables[0].focus(); }
        }
      }
    }
    document.addEventListener('keydown', handleKey);
    const closeBtn = modal.querySelector('.close-modal');
    if(closeBtn) closeBtn.addEventListener('click', ()=> modal.remove());
  }
  if(videoThumb){
    videoThumb.addEventListener('click', function(){
      const src = videoThumb.getAttribute('data-video');
      // garante autoplay no embed
      let url = src;
      if(src.indexOf('autoplay') === -1) url = src + (src.indexOf('?')===-1 ? '?autoplay=1' : '&autoplay=1');

      // Em telas largas, embarca o vídeo inline para destaque; em mobile abre modal (UX mais leve)
      if(window.innerWidth >= 980){
        try{
          // salva conteúdo original para poder restaurar
          if(!videoThumb.dataset._orig) videoThumb.dataset._orig = videoThumb.innerHTML;
          // monta iframe responsivo ocupando todo o container
          videoThumb.innerHTML = '';
          const iframe = document.createElement('iframe');
          iframe.setAttribute('src', url);
          iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
          iframe.setAttribute('allowfullscreen', '');
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = '0';
          // close button (pequeno) para parar o vídeo e restaurar thumbnail
          const close = document.createElement('button');
          close.className = 'video-close';
          close.setAttribute('aria-label', 'Fechar vídeo');
          close.style.cssText = 'position:absolute;right:10px;top:10px;background:rgba(0,0,0,0.5);border:0;color:#fff;padding:8px 10px;border-radius:8px;cursor:pointer;z-index:5';
          close.textContent = '×';
          // posiciona container relative para o botão
          videoThumb.style.position = 'relative';
          videoThumb.appendChild(iframe);
          videoThumb.appendChild(close);

          close.addEventListener('click', function(ev){
            ev.stopPropagation();
            // restaura thumb original
            videoThumb.innerHTML = videoThumb.dataset._orig || '';
            videoThumb.style.position = '';
          });
        }catch(err){
          // fallback para modal se algo falhar
          openVideoModal(url);
        }
      } else {
        openVideoModal(url);
      }
    });
  }

  // No quick-contact handlers — contact buttons removed per design.
  // Unified lead capture: attach handler to all forms with class 'lead-form'
  const leadForms = Array.from(document.querySelectorAll('.lead-form'));

  // WhatsApp group invite - configure your real group link here
  // Leave as empty string or placeholder until you have the real invite link.
  // If empty or placeholder, the form will show a message instead of redirecting.
  // Configurado como link click-to-chat (wa.me) para atendimento imediato
  // Número informado: 51985501971 (formato internacional 55 51 985501971)
  // Mensagem preparada para abrir o chat
  const WHATSAPP_GROUP = 'https://wa.me/551985501971?text=Quero%20entrar%20no%20Grupo%20VIP%20Intureon';

  // Optional webhook endpoint to forward leads to your CRM. Leave empty to skip.
  // Example: const WEBHOOK_URL = 'https://hooks.example.com/intureon-leads';
  const WEBHOOK_URL = '';

  function saveLead(lead){
    try{
      const key = 'intureon_leads_v1';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(lead);
      localStorage.setItem(key, JSON.stringify(existing));
      // decrement slots when a lead is captured (but do not go below 0)
      try{
        if(typeof slots === 'number' && slots > 0){
          slots = Math.max(0, slots - 1);
          localStorage.setItem(SLOTS_KEY, String(slots));
          updateSlotsDisplay();
          trackEvent('slot_decrement', {slots});
        }
      }catch(err){/* ignore */}
      // If a webhook URL is configured, POST the lead (best-effort, non-blocking)
      try{
        if(WEBHOOK_URL && WEBHOOK_URL.indexOf('http') === 0){
          fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
            keepalive: true
          }).then(res => {
            trackEvent('webhook_sent', {status: res.status});
          }).catch(err => {
            console.warn('webhook error', err);
            trackEvent('webhook_error', {error: String(err)});
          });
        }
      }catch(err){ /* ignore webhook errors */ }
    }catch(err){
      // fail silently
    }
  }
  // attach submit handler to each lead form (hero and footer)
  leadForms.forEach(formEl => {
    formEl.addEventListener('submit', async function(e){
      e.preventDefault();
      // try to find a feedback node inside the form, otherwise use the shared #lead-feedback
      const feedbackEl = formEl.querySelector('.feedback') || document.getElementById('lead-feedback');
      if(feedbackEl) feedbackEl.textContent = '';

      const nameEl = formEl.querySelector('[name="leadName"]') || formEl.querySelector('[name="leadName"]');
      const phoneEl = formEl.querySelector('[name="leadPhone"]');
      const emailEl = formEl.querySelector('[name="leadEmail"]');
      const consentEl = formEl.querySelector('[name="leadConsent"]');
      const ebookEl = formEl.querySelector('[name="leadEbook"]');

      const name = nameEl ? nameEl.value.trim() : '';
      const phoneRaw = phoneEl ? phoneEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const consent = consentEl ? consentEl.checked : false;
      const ebook = ebookEl ? ebookEl.checked : false;

      const phoneDigits = (phoneRaw || '').replace(/\D/g, '');
      if(!name){ if(feedbackEl) feedbackEl.textContent = 'Por favor preencha seu nome.'; return; }
      if(!phoneDigits || phoneDigits.length < 8){ if(feedbackEl) feedbackEl.textContent = 'Informe um número de contato válido.'; return; }
      if(!consent){ if(feedbackEl) feedbackEl.textContent = 'É necessário concordar em entrar no grupo WhatsApp.'; return; }
      if(!ebook){ if(feedbackEl) feedbackEl.textContent = 'Por favor confirme que deseja baixar o eBook.'; return; }

      const lead = {name, phone: phoneDigits, email, createdAt: new Date().toISOString()};
      saveLead(lead);

      try{
        if(feedbackEl) feedbackEl.textContent = 'Processando...';
        await new Promise(r => setTimeout(r, 650));
        showSuccessAndRedirect('Obrigado! Você será redirecionado para o Grupo VIP.');
        formEl.reset();
      }catch(err){ if(feedbackEl) feedbackEl.textContent = 'Ocorreu um erro. Tente novamente.'; }
    });
  });

  // Phone formatting: attach lightweight mask to all inputs with class 'lead-phone'
  document.querySelectorAll('.lead-phone').forEach(function(phoneInput){
    phoneInput.addEventListener('input', function(e){
      const v = e.target.value.replace(/\D/g,'');
      // format: +55 (XX) 9XXXX-XXXX when possible
      let out = v;
      if(v.length > 2){
        let rest = v;
        if(v.length > 11){ // maybe contains country code
          rest = v.slice(v.length-11);
        }
        if(rest.length <= 2) out = rest;
        else if(rest.length <= 6) out = `+55 (${rest.slice(0,2)}) ${rest.slice(2)}`;
        else if(rest.length <= 10) out = `+55 (${rest.slice(0,2)}) ${rest.slice(2, rest.length-4)}-${rest.slice(rest.length-4)}`;
        else out = `+55 (${rest.slice(0,2)}) ${rest.slice(2,7)}-${rest.slice(7,11)}`;
      }
      e.target.value = out;
    });
  });

  // success modal + redirect helper
  function showSuccessAndRedirect(message){
    // remove existing if any
    const existing = document.querySelector('.lead-success-modal');
    if(existing) existing.remove();
    const m = document.createElement('div');
    m.className = 'lead-success-modal';
    m.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(2,6,10,0.6);z-index:2600;padding:20px;';
  // eBook URL (use existing asset in repo)
  const EBOOK_URL = 'assets/Estratégias Comprovadas para Transformar sua empresa (1).png';
  m.innerHTML = `<div style="max-width:520px;width:100%;background:#071018;padding:22px;border-radius:12px;color:#fff;text-align:center;font-weight:700;"><div style="font-size:18px;margin-bottom:6px">${escapeHtml(message)}</div><div style="font-size:13px;color:#cbd5da;margin-bottom:12px">Abrindo o Grupo VIP do WhatsApp...</div><div style="margin-top:8px"><button id=lead-continue class=btn style=padding:10px 14px;border-radius:10px;background:#00b8b8;color:#071018;border:0;font-weight:800>Ir agora</button></div><div style=margin-top:12px><a id=ebook-download href="${encodeURI(EBOOK_URL)}" download="Ebook_Intureon_Presente.png" class=btn style="margin-top:10px;display:inline-block;background:transparent;border:1px solid #00b8b8;color:#00b8b8;padding:10px 12px;border-radius:10px;font-weight:800;margin-left:8px">Baixar eBook de Agradecimento</a></div></div>`;
    m.addEventListener('click', function(e){ if(e.target===m) m.remove(); });
    document.body.appendChild(m);

    document.getElementById('lead-continue').addEventListener('click', function(){
      window.location.href = WHATSAPP_GROUP;
    });

    // auto-redirect after short delay as fallback (only if a real link is configured)
    if(WHATSAPP_GROUP && !WHATSAPP_GROUP.includes('SeuLinkDoGrupoVIP')){
      setTimeout(()=>{ window.location.href = WHATSAPP_GROUP; }, 1200);
    } else {
      // no group link configured: update modal to inform the user and keep the ebook download available
      const note = document.createElement('div');
      note.style.cssText = 'color:#cbd5da;margin-top:10px;font-size:13px';
      note.textContent = 'Ainda não temos o link do grupo no ar. Enviaremos o convite via WhatsApp em até 24h. Enquanto isso, baixe seu eBook de agradecimento.';
      // append the note below the buttons
      const container = m.querySelector('div');
      container.appendChild(note);
      // keep modal visible for a few seconds so user can click download, then remove
      setTimeout(()=>{ m.remove(); }, 4500);
    }
  }

  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; }); }

  // Certificate modal: open when elements with [data-cert-open] are clicked
  function openCertModal(src){
    // prevent duplicate
    if(document.querySelector('.cert-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'cert-modal';
    modal.innerHTML = `
      <div class="inner">
        <button class="close" aria-label="Fechar">×</button>
        <img src="${src}" alt="Exemplo de certificado Intureon" />
      </div>
    `;
    modal.addEventListener('click', (ev)=>{ if(ev.target===modal) modal.remove(); });
    modal.querySelector('.close').addEventListener('click', ()=> modal.remove());
    document.body.appendChild(modal);
    // close on esc
    function onKey(e){ if(e.key==='Escape'){ modal.remove(); document.removeEventListener('keydown', onKey); } }
    document.addEventListener('keydown', onKey);
  }

  document.querySelectorAll('[data-cert-open]').forEach(el=> el.addEventListener('click', function(e){ e.preventDefault(); const src = el.dataset.certSrc || 'assets/sample-certificate.svg'; openCertModal(src); }));

  // Lightweight reveal animation for cards (uses IntersectionObserver)
  try{
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if('IntersectionObserver' in window && !prefersReduced){
      const cards = document.querySelectorAll('.card');
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12});
      cards.forEach(c => obs.observe(c));
    }else{
      // fallback: show cards immediately
      document.querySelectorAll('.card').forEach(c => c.classList.add('in-view'));
    }
  }catch(err){
    // fail silently
    document.querySelectorAll('.card').forEach(c => c.classList.add('in-view'));
  }
});
