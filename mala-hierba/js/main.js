// ─────────────────────────────────────────────
//  Mala Hierba Workshop — main.js
//  Carga contenido desde archivos JSON en /content
// ─────────────────────────────────────────────

const COLOR_GRADIENTS = {
  purple: 'linear-gradient(135deg, #1a0a2e 0%, #2d1a4a 40%, #0a1a1a 100%)',
  green:  'linear-gradient(135deg, #0a1a12 0%, #1a2d1a 40%, #2a1a0a 100%)',
  red:    'linear-gradient(135deg, #1a0a0a 0%, #2d1a1a 40%, #0a0a2a 100%)',
  blue:   'linear-gradient(135deg, #0a0a1a 0%, #1a1a2d 40%, #0a1a2a 100%)',
};

const FORMAT_LABELS = {
  vertical: 'Microdrama Vertical',
  serie:    'Serie Vertical',
  corto:    'Cortometraje',
  largo:    'Largometraje',
};

const FORMAT_BADGE = {
  vertical: 'badge-vertical',
  serie:    'badge-serie',
  corto:    'badge-corto',
  largo:    'badge-largo',
};

// ── Fetch helpers ──────────────────────────────

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar ${path}`);
  return res.json();
}

async function loadWriterFiles() {
  // Carga los JSON de cada escritor
  const slugs = [
    'aldo-hernandez',
    'lex-bravo',
    'leslie-solis',
    'karen-espinal',
    'paco-ramirez',
    'paloma-pelayo',
  ];
  const results = await Promise.allSettled(
    slugs.map(s => fetchJSON(`content/escritores/${s}.json`))
  );
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));
}

async function loadProjectFiles() {
  const slugs = [
    'tarotista-cancelada',
    'la-inquilina-secreta',
    'el-visitante',
  ];
  const results = await Promise.allSettled(
    slugs.map(s => fetchJSON(`content/proyectos/${s}.json`))
  );
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));
}

// ── Render escritores ──────────────────────────

function renderWriters(writers) {
  const grid = document.getElementById('writers-grid');
  if (!grid) return;
  grid.innerHTML = writers.map(w => {
    const avatar = w.foto
      ? `<img src="${w.foto}" alt="${w.nombre}" class="writer-avatar">`
      : `<div class="writer-initials">${w.iniciales || w.nombre.slice(0,2).toUpperCase()}</div>`;
    return `
      <div class="writer-card">
        ${avatar}
        <div class="writer-name">${w.nombre}</div>
        <div class="writer-role">${w.rol}</div>
        <p class="writer-bio">${w.bio}</p>
      </div>
    `;
  }).join('');
  animateCards('.writer-card');
  document.getElementById('fondo-escritores-count').textContent = writers.length;
}

// ── Render proyectos ───────────────────────────

let allProjects = [];

function renderProjects(projects) {
  allProjects = projects;
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map((p, i) => {
    const featured = p.destacado ? 'featured' : '';
    const thumbClass = p.destacado ? 'featured' : '';
    const bg = p.imagen
      ? `background-image: url('${p.imagen'); background-size: cover; background-position: center;`
      : `background: ${COLOR_GRADIENTS[p.color_fondo || 'purple']};`;
    const formatLabel = FORMAT_LABELS[p.formato] || p.formato;
    const badgeClass  = FORMAT_BADGE[p.formato] || 'badge-vertical';
    const price = Number(p.precio).toLocaleString('es-MX');

    return `
      <div class="project-card ${featured}" data-format="${p.formato}" data-index="${i}" onclick="openModal(${i})">
        <div class="project-thumb ${thumbClass}">
          <div class="thumb-bg" style="${bg}"></div>
          <div class="thumb-overlay"></div>
          <span class="project-format-badge ${badgeClass}">${formatLabel}</span>
        </div>
        <div class="project-info">
          <div class="project-writer">${p.escritor}</div>
          <h3 class="project-title">${p.titulo}</h3>
          <p class="project-sinopsis">${p.sinopsis_corta}</p>
          <div class="project-footer">
            <div class="project-price">
              <span class="currency">MXN · desde</span>
              $${price}
            </div>
            <button class="btn-cotizar" onclick="event.stopPropagation(); openModal(${i})">Cotizar →</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('hero-count').textContent = projects.length;
  animateCards('.project-card');
}

// ── Filtros ────────────────────────────────────

function filterProjects(type, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    if (type === 'all' || card.dataset.format === type) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ── Modal ──────────────────────────────────────

function openModal(index) {
  const p = allProjects[index];
  if (!p) return;

  const formatLabel = FORMAT_LABELS[p.formato] || p.formato;
  const price = Number(p.precio).toLocaleString('es-MX');

  document.getElementById('modal-body').innerHTML = `
    <div class="modal-tag">${formatLabel}</div>
    <div class="modal-title">${p.titulo}</div>
    <div class="modal-writer">Por ${p.escritor}</div>
    <p class="modal-sinopsis">${p.sinopsis_larga || p.sinopsis_corta}</p>
    <div class="modal-price-row">
      <div class="modal-price">$${price} MXN</div>
      <div class="modal-price-note">Precio base — ${formatLabel}<br>Sujeto a cotización final</div>
    </div>
    <button class="modal-btn" onclick="goContact()">Solicitar cotización →</button>
  `;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModalBtn();
}

function closeModalBtn() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function goContact() {
  closeModalBtn();
  setTimeout(() => {
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
  }, 200);
}

// ── Formulario ─────────────────────────────────

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '✓ Solicitud enviada — te contactaremos pronto';
  btn.style.background = 'var(--musgo)';
  btn.style.color = 'var(--lima)';
  btn.disabled = true;
}

// ── Site config ────────────────────────────────

async function loadSiteConfig() {
  try {
    const site = await fetchJSON('content/site.json');
    const setEl = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setEl('hero-tagline', site.tagline);
    setEl('hero-desc', site.descripcion_hero);
    setEl('manifiesto-cita', `"${site.cita_manifiesto}"`);
    setEl('manifiesto-p1', site.manifiesto_p1);
    setEl('manifiesto-p2', site.manifiesto_p2);
    setEl('agencia-nombre', site.agencia);
    setEl('contact-ciudad', site.ciudad);
    setEl('contact-agencia', `${site.agencia} — Content & Design Thinking`);
    setEl('footer-lof', site.agencia);
  } catch (err) {
    console.warn('No se pudo cargar site.json:', err);
  }
}

async function loadFondoConfig() {
  try {
    const fondo = await fetchJSON('content/fondo.json');
    const setEl = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.textContent = val; };
    setEl('fondo-titulo', fondo.titulo);
    setEl('fondo-desc1', fondo.desc1);
    setEl('fondo-desc2', fondo.desc2);
    setEl('fondo-porcentaje', fondo.porcentaje);
    if (fondo.precio_mercado) {
      document.getElementById('precio-mercado').textContent = `$${Number(fondo.precio_mercado).toLocaleString('es-MX')}`;
      const diff = fondo.precio_mh - fondo.precio_mercado;
      document.getElementById('precio-fondo').textContent = `$${Number(diff).toLocaleString('es-MX')}`;
    }
    if (fondo.precio_mh) {
      document.getElementById('precio-mh').textContent = `$${Number(fondo.precio_mh).toLocaleString('es-MX')} MXN`;
    }
  } catch (err) {
    console.warn('No se pudo cargar fondo.json:', err);
  }
}

// ── Scroll reveal ──────────────────────────────

function animateCards(selector) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(selector).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ── Nav mobile ─────────────────────────────────

function toggleMenu() {
  const links = document.querySelector('.nav-links');
  if (links.style.display === 'flex') {
    links.style.display = 'none';
  } else {
    links.style.cssText = 'display:flex; flex-direction:column; position:fixed; top:4rem; left:0; right:0; background:rgba(10,10,8,0.97); padding:2rem 3rem; gap:1.5rem; z-index:99;';
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { links.style.display = 'none'; }, { once: true }));
  }
}

// ── Init ───────────────────────────────────────

async function init() {
  await loadSiteConfig();
  await loadFondoConfig();

  const [writers, projects] = await Promise.all([
    loadWriterFiles(),
    loadProjectFiles(),
  ]);

  renderWriters(writers);
  renderProjects(projects);

  // Animate steps on scroll
  animateCards('.step');
}

document.addEventListener('DOMContentLoaded', init);
