// ===== بيانات المبادرات =====
const initiatives = [
  {cat:'reforest', tag:'إعادة التشجير', color:'#059669', icon:'bi-tree', title:'ممر استعادة مظلة الأمازون', desc:'بناء ممرات للحياة البرية في أراضي حوض الأمازون عبر إعادة غرس 15,000 هكتار بالأشجار الأصلية.', progress:72, lead:'د. إلينا ريفيرا'},
  {cat:'oceans', tag:'المحيطات النظيفة', color:'#0284c7', icon:'bi-water', title:'الدرع المرجاني والحاجز الساحلي', desc:'إنقاذ الشعاب المبيضة ومنع التآكل الساحلي بمعدن مبتكر. تغطية الشعاب 78% مكتمل.', progress:78, lead:'مارك كوسكي'},
  {cat:'solar', tag:'الطاقة الشمسية', color:'#d97706', icon:'bi-sun', title:'طاقة شمسية مستقلة لعيادات أفريقيا', desc:'تشغيل 80 مركزًا طبيًا ريفيًا بطاريات تخزين؛ دخلت الخدمة 91% من العيادات.', progress:64, lead:'أمينة أوسي'},
  {cat:'policy', tag:'السياسات والتعليم', color:'#7c3aed', icon:'bi-mortarboard', title:'زمالة شباب المناخ العالمية', desc:'تدريب شباب على التعامل مع مخاطر المناخ بالأدوات القانونية والاقتصادية البيئية.', progress:100, lead:'تاني ويلسون'},
  {cat:'oceans', tag:'المحيطات النظيفة', color:'#0284c7', icon:'bi-recycle', title:'مصدات الجسيمات البلاستيكية النهرية', desc:'اعتراض النفايات البلاستيكية في الأنهار قبل وصولها للمحيطات. 52% تم تشغيل تجهيزات المصبات.', progress:52, lead:'د. ر. بانيرجي'},
  {cat:'reforest', tag:'إعادة التشجير', color:'#059669', icon:'bi-flower1', title:'جدار سوندربانس الأخضر للقرم', desc:'احتجاز الكربون الأزرق عالي الكثافة في الدلتا. 85% من الشتلات المغروسة.', progress:85, lead:'صوفيا تشانغ'}
];

const cards = document.getElementById('cards');
cards.innerHTML = initiatives.map(i => `
  <div class="col-md-6 col-lg-4 init-col" data-cat="${i.cat}">
    <article class="card-box init">
      <div class="img"><i class="bi ${i.icon}"></i><span class="tag" style="background:${i.color}">${i.tag}</span></div>
      <div class="body">
        <h5>${i.title}</h5><p>${i.desc}</p>
        <div class="progress"><div class="progress-bar" style="width:${i.progress}%"></div></div>
        <div class="foot"><span>المشرف: ${i.lead}</span><a href="#">التفاصيل ←</a></div>
      </div>
    </article>
  </div>`).join('');

// ===== الفلاتر =====
document.getElementById('filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  b.classList.add('active');
  document.querySelectorAll('.init-col').forEach(c =>
    c.classList.toggle('d-none', b.dataset.f !== 'all' && c.dataset.cat !== b.dataset.f));
});

// ===== المعرض =====
document.getElementById('gal').innerHTML =
  Array.from({length:6}, () => '<div class="col-6 col-md-4"><div class="shot"><i class="bi bi-image"></i></div></div>').join('');

// ===== عدادات الأرقام =====
const fmt = n => n.toLocaleString('en-US');
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, plus = el.dataset.plus || '', suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1400;
    (function tick(t){
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = plus + fmt(Math.round(end * (1 - Math.pow(1 - p, 3)))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    io.unobserve(el);
  });
}, {threshold:.4});
document.querySelectorAll('[data-count]').forEach(el => io.observe(el));

// ===== معالج التسجيل =====
let step = 1;
const panes = document.querySelectorAll('.pane'), stepEls = document.querySelectorAll('.step');
const next = document.getElementById('next'), prev = document.getElementById('prev');

function showStep() {
  panes.forEach(p => p.classList.toggle('d-none', +p.dataset.pane !== step));
  stepEls.forEach((s, i) => { s.classList.toggle('active', i + 1 === step); s.classList.toggle('done', i + 1 < step); });
  prev.classList.toggle('d-none', step === 1);
  next.innerHTML = step === 3 ? 'إرسال الطلب' : 'الخطوة التالية <i class="bi bi-arrow-left"></i>';
}
function valid(scope) {
  let ok = true;
  scope.querySelectorAll('[required]').forEach(f => { const v = f.checkValidity(); f.classList.toggle('is-invalid', !v); if (!v) ok = false; });
  return ok;
}
next.addEventListener('click', () => {
  const pane = document.querySelector(`.pane[data-pane="${step}"]`);
  if (!valid(pane)) return;
  if (step < 3) { step++; showStep(); }
  else { toast('تم إرسال طلب التطوع بنجاح ✔'); document.getElementById('volForm').reset(); step = 1; showStep(); }
});
prev.addEventListener('click', () => { step--; showStep(); });

// ===== نموذج التواصل =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!valid(e.target)) return;
  toast('تم إرسال رسالتك، سنرد خلال 24 ساعة ✔'); e.target.reset();
});

function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
