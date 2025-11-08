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
    modal.innerHTML = `<div class="inner"><iframe src="${src}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>`;
    modal.addEventListener('click', function(e){
      if(e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
  }
  if(videoThumb){
    videoThumb.addEventListener('click', function(){
      const src = videoThumb.getAttribute('data-video');
      // se for um youtube link sem autoplay, adiciona autoplay=1
      let url = src;
      if(src.indexOf('autoplay') === -1) url = src + (src.indexOf('?')===-1 ? '?autoplay=1' : '&autoplay=1');
      openVideoModal(url);
    });
  }

  // WhatsApp quick contact
  const whatsappNumber = '+5511999999999'; // <- substitua pelo número real (formato internacional, sem espaços)
  const defaultMessage = encodeURIComponent('Olá, tenho interesse na mentoria Intureon — quero agendar.');

  function openWhatsApp(){
    const base = 'https://wa.me/';
    const num = whatsappNumber.replace(/\D/g,'');
    const url = `${base}${num}?text=${defaultMessage}`;
    window.open(url, '_blank');
  }

  const fab = document.getElementById('whatsapp-fab');
  if(fab) fab.addEventListener('click', openWhatsApp);

  const headerWA = document.getElementById('header-whatsapp');
  if(headerWA) headerWA.addEventListener('click', function(e){ e.preventDefault(); openWhatsApp(); });
  // Unified lead capture: name / email / phone + options
  const leadForm = document.getElementById('lead-form');
  const leadFeedback = document.getElementById('lead-feedback');
  const waGroupUrl = 'https://chat.whatsapp.com/INVITE_CODE'; // <- substitua pelo link real do grupo

  function saveLead(lead){
    try{
      const key = 'intureon_leads_v1';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(lead);
      localStorage.setItem(key, JSON.stringify(existing));
    }catch(err){
      // fail silently
    }
  }

  if(leadForm){
    leadForm.addEventListener('submit', async function(e){
      e.preventDefault();
      leadFeedback.textContent = '';
      const name = document.getElementById('lead-name').value.trim();
      const email = document.getElementById('lead-email').value.trim();
      const phone = document.getElementById('lead-phone').value.trim();
      const wantGroup = document.getElementById('lead-want-group').checked;
      const wantEbook = document.getElementById('lead-want-ebook').checked;

      if(!name || !email || !phone){
        leadFeedback.textContent = 'Por favor preencha nome, e-mail e telefone.';
        return;
      }

      // store lead locally (placeholder for real backend)
      const lead = {name, email, phone, wantGroup, wantEbook, createdAt: new Date().toISOString()};
      saveLead(lead);

      try{
        leadFeedback.textContent = 'Processando...';
        await new Promise(r => setTimeout(r, 800));

        // If user wants ebook, generate placeholder download (text file) — or replace with real PDF link
        if(wantEbook){
          const content = `eBook Intureon - Conteúdo de exemplo\n\nNome: ${name}\nEmail: ${email}\n\nObrigado por baixar!`;
          const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ebook-intureon-sample.txt';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }

        // If user wants group, open group invite
        if(wantGroup){
          window.open(waGroupUrl, '_blank');
        }

        leadFeedback.textContent = 'Pronto! Verifique seu e-mail e downloads.';
        leadForm.reset();
      }catch(err){
        leadFeedback.textContent = 'Ocorreu um erro. Tente novamente.';
      }
    });
  }

  // Certificate modal: open when elements with [data-cert-open] are clicked
  function openCertModal(){
    // prevent duplicate
    if(document.querySelector('.cert-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'cert-modal';
    modal.innerHTML = `
      <div class="inner">
        <button class="close" aria-label="Fechar">×</button>
        <img src="assets/sample-certificate.svg" alt="Exemplo de certificado Intureon" />
      </div>
    `;
    modal.addEventListener('click', (ev)=>{ if(ev.target===modal) modal.remove(); });
    modal.querySelector('.close').addEventListener('click', ()=> modal.remove());
    document.body.appendChild(modal);
    // close on esc
    function onKey(e){ if(e.key==='Escape'){ modal.remove(); document.removeEventListener('keydown', onKey); } }
    document.addEventListener('keydown', onKey);
  }

  document.querySelectorAll('[data-cert-open]').forEach(el=> el.addEventListener('click', function(e){ e.preventDefault(); openCertModal(); }));

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
