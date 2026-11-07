
/* LAYMR sub-pages */
const D = window.LAYMR_DATA;
const $ = (s, r=document) => r.querySelector(s);
const q = new URLSearchParams(location.search);
const price = v => '₪' + Number(v).toLocaleString('he-IL', {maximumFractionDigits: 2}).replace(/\.00$/, '');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dec = s => { try { return decodeURIComponent(s); } catch(e){ return s; } };
const P = D.products, byHandle = Object.fromEntries(P.map(p => [p.handle, p]));
const colTitle = h => (D.collections.find(c => c.handle === h) || {}).title || h;

/* ---- shell ---- */
$('#hnav').innerHTML = D.nav.slice(0, 6).map(n => '<a href="' + n.u + '">' + n.t + '</a>').join('') + '<a href="index.html#about" data-about>אודות</a>';
$('#moLinks').innerHTML = D.nav.map(n => '<a href="' + n.u + '">' + n.t + '</a>').join('') + '<a href="index.html#about">אודות</a>';
$('#fshop').innerHTML = D.nav.map(n => '<li><a href="' + n.u + '">' + n.t + '</a></li>').join('');
const MSGS = ['משלוח חינם בקנייה מעל 199 ₪', 'עד 199 ₪ — משלוח ב-29 ₪ בלבד', 'משלוח מהיר עד 5 ימי עסקים עם שליח עד הבית', 'LAYMR — SUMMER SALE'];
const tHTML = MSGS.concat(MSGS, MSGS).map(m => '<span dir="rtl">' + m + '</span>').join('');
$('#tickerA').innerHTML = tHTML; $('#tickerB').innerHTML = tHTML;
document.querySelector('header').classList.add('scrolled');
const scrim = $('#scrim'), menuOverlay = $('#menuOverlay'), cartDrawer = $('#cartDrawer');
const closeAll = () => { scrim.classList.remove('open'); menuOverlay.classList.remove('open'); cartDrawer.classList.remove('open'); };
$('#menuOpen').onclick = () => menuOverlay.classList.add('open');
$('#menuClose').onclick = closeAll; $('#cartClose').onclick = closeAll; scrim.onclick = closeAll;
$('#cartOpen').onclick = () => { renderCart(); scrim.classList.add('open'); cartDrawer.classList.add('open'); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
const nf = $('#newsForm'); if (nf) nf.addEventListener('submit', e => { e.preventDefault(); $('#newsOk').style.display = 'block'; });
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }), {threshold:.1});
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

/* ---- cart (demo, localStorage) ---- */
const cartGet = () => { try { return JSON.parse(localStorage.getItem('laymr-cart') || '[]'); } catch(e){ return []; } };
const cartSet = c => { try { localStorage.setItem('laymr-cart', JSON.stringify(c)); } catch(e){} renderCart(); };
function renderCart(){
  const c = cartGet(); const n = c.reduce((a, b) => a + b.qty, 0);
  $('#cartDrawer .cd-head span').textContent = 'עגלה (' + n + ')';
  const body = $('#cartDrawer .cd-body');
  if (!c.length){ body.innerHTML = '<p>עגלת הקניות שלך ריקה</p><a class="btn-line" href="collection.html?c=all">המשך בקנייה</a>'; return; }
  const total = c.reduce((a, b) => a + Number(b.price) * b.qty, 0);
  body.innerHTML = '<div class="cd-items">' + c.map((it, i) => '<div class="cd-item"><img src="' + it.img + '" alt=""><div><a href="product.html?p=' + encodeURIComponent(it.handle) + '">' + esc(it.title) + '</a><div class="cd-meta">' + esc(it.variant) + ' · ' + price(it.price) + '</div><div class="cd-qty"><button data-i="' + i + '" data-d="-1">−</button><span>' + it.qty + '</span><button data-i="' + i + '" data-d="1">+</button></div></div></div>').join('') + '</div>' +
    '<div class="cd-total"><span>סה"כ</span><span dir="ltr">' + price(total) + '</span></div><a class="pd-add cd-go" href="#">לתשלום (דמו)</a>';
  body.querySelectorAll('.cd-qty button').forEach(b => b.onclick = () => { const c2 = cartGet(); const it = c2[+b.dataset.i]; it.qty += +b.dataset.d; if (it.qty <= 0) c2.splice(+b.dataset.i, 1); cartSet(c2); });
}
window.addToCart = item => { const c = cartGet(); const ex = c.find(x => x.vid === item.vid); if (ex) ex.qty += item.qty; else c.push(item); cartSet(c); scrim.classList.add('open'); cartDrawer.classList.add('open'); };
renderCart();

/* ---- cards ---- */
const cheapest = p => p.variants.reduce((a, v) => Number(v.price) < Number(a.price) ? v : a, p.variants[0]);
function card(p){
  const v = cheapest(p); const sale = v.cmp && Number(v.cmp) > Number(v.price); const out = !p.variants.some(x => x.avail);
  const im0 = p.images[0] ? p.images[0].src : 'images/logo-lm.png', im1 = p.images[1] ? p.images[1].src : null;
  return '<a class="pc" href="product.html?p=' + encodeURIComponent(p.handle) + '"><div class="pc-img"><img loading="lazy" src="' + im0 + '" alt="' + esc(p.title) + '">' + (im1 ? '<img loading="lazy" class="alt" src="' + im1 + '" alt="">' : '') +
    (out ? '<span class="pc-tag out">Sold out</span>' : sale ? '<span class="pc-tag">Sale</span>' : '') + '</div>' +
    '<div class="pc-info"><h3 class="pc-title">' + esc(p.title) + '</h3><div class="pc-price' + (sale ? ' sale' : '') + '">' + (sale ? '<s>' + price(v.cmp) + '</s>' : '') + '<span class="now">' + price(v.price) + '</span></div></div></a>';
}

/* ---- pages ---- */
const page = document.body.dataset.page;
if (page === 'collection'){
  const h = dec(q.get('c') || 'all'); const title = h === 'all' ? 'כל המוצרים' : colTitle(h);
  let list = h === 'all' ? P.slice() : (D.collectionProducts[h] || []).map(x => byHandle[x]).filter(Boolean);
  document.title = title + ' — LAYMR';
  $('#colTitle').innerHTML = '<small>Collection</small>' + esc(title); $('#crumb').textContent = title;
  const grid = $('#grid'), sort = $('#sort'), cnt = $('#count');
  const draw = () => { let l = list.slice(); const s = sort.value;
    if (s === 'low') l.sort((a, b) => Number(cheapest(a).price) - Number(cheapest(b).price));
    if (s === 'high') l.sort((a, b) => Number(cheapest(b).price) - Number(cheapest(a).price));
    if (s === 'new') l.sort((a, b) => (b.published || '').localeCompare(a.published || ''));
    cnt.textContent = l.length + ' פריטים'; grid.innerHTML = l.length ? l.map(card).join('') : '<div class="empty">אין כרגע פריטים בקולקציה הזו</div>'; };
  sort.onchange = draw; draw();
}
if (page === 'product'){
  const p = byHandle[dec(q.get('p') || '')] || P[0];
  document.title = p.title + ' — LAYMR';
  const col = Object.entries(D.collectionProducts).find(([h, l]) => h !== 'all' && h !== 'frontpage' && l.includes(p.handle));
  if (col) $('#crumbCol').innerHTML = '<a href="collection.html?c=' + encodeURIComponent(col[0]) + '">' + esc(colTitle(col[0])) + '</a><i></i>';
  $('#crumb').textContent = p.title; $('#ptitle').textContent = p.title; $('#ptype').textContent = p.type || p.vendor || 'LAYMR';
  const imgs = p.images.length ? p.images : [{src: 'images/logo-lm.png'}];
  const main = $('#galMain'), thumbs = $('#galThumbs'); let cur = 0;
  const show = i => { cur = i; main.innerHTML = '<img src="' + imgs[i].src + '" alt="' + esc(p.title) + '">'; thumbs.querySelectorAll('button').forEach((b, n) => b.classList.toggle('on', n === i)); };
  thumbs.innerHTML = imgs.map((im, i) => '<button aria-label="תמונה ' + (i + 1) + '"><img src="' + im.src + '" alt=""></button>').join('');
  thumbs.querySelectorAll('button').forEach((b, i) => b.onclick = () => show(i)); show(0);
  main.addEventListener('click', () => show((cur + 1) % imgs.length));
  const sel = {}; const realOpts = p.options.filter(o => !(o.values.length === 1 && o.values[0] === 'Default Title'));
  realOpts.forEach((o, i) => { sel[i] = o.values[0]; });
  const optsEl = $('#opts');
  const variantFor = () => p.variants.find(v => realOpts.every((o, i) => [v.o1, v.o2, v.o3][i] === sel[i])) || p.variants[0];
  const availFor = (i, val) => p.variants.some(v => [v.o1, v.o2, v.o3][i] === val && v.avail);
  const drawOpts = () => { optsEl.innerHTML = realOpts.map((o, i) => '<div class="opt"><div class="opt-head"><span>' + esc(o.name) + '</span><span>' + esc(sel[i]) + '</span></div><div class="opt-vals">' +
      o.values.map(v => '<button data-i="' + i + '" data-v="' + esc(v) + '" class="' + (sel[i] === v ? 'on' : '') + (availFor(i, v) ? '' : ' off') + '">' + esc(v) + '</button>').join('') + '</div></div>').join('');
    optsEl.querySelectorAll('button').forEach(b => b.onclick = () => { sel[+b.dataset.i] = b.dataset.v; drawOpts(); drawPrice(); });
  };
  const priceEl = $('#pprice'), addBtn = $('#addBtn');
  const drawPrice = () => { const v = variantFor(); const sale = v.cmp && Number(v.cmp) > Number(v.price);
    priceEl.className = 'pd-price' + (sale ? ' sale' : '');
    priceEl.innerHTML = (sale ? '<span class="pct">-' + Math.round((1 - Number(v.price) / Number(v.cmp)) * 100) + '%</span><s>' + price(v.cmp) + '</s>' : '') + '<span class="now">' + price(v.price) + '</span>';
    addBtn.disabled = !v.avail; addBtn.textContent = v.avail ? 'הוספה לעגלה' : 'אזל מהמלאי';
    if (v.img){ const k = imgs.findIndex(im => im.id === v.img); if (k >= 0) show(k); } };
  drawOpts(); drawPrice();
  let qty = 1; const qtyEl = $('#qty');
  $('#qMinus').onclick = () => { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; }; $('#qPlus').onclick = () => { qty = Math.min(9, qty + 1); qtyEl.textContent = qty; };
  addBtn.onclick = () => { const v = variantFor(); addToCart({vid: v.id, handle: p.handle, title: p.title, variant: v.title === 'Default Title' ? '' : v.title, price: v.price, qty, img: imgs[cur].src}); };
  $('#pdesc').innerHTML = p.body || '<p>פריט מקולקציית LAYMR.</p>';
  const related = (col ? col[1].map(x => byHandle[x]) : P).filter(x => x && x.handle !== p.handle).slice(0, 4);
  $('#related').innerHTML = related.map(card).join('');
}
if (page === 'page'){
  const id = q.get('id') || 'privacy-policy'; const pg = D.pages[id] || {title: 'עמוד', html: '<p>העמוד לא נמצא.</p>'};
  document.title = pg.title + ' — LAYMR'; $('#pgTitle').textContent = pg.title; $('#crumb').textContent = pg.title; $('#pgBody').innerHTML = pg.html;
}
if (page === 'search'){
  const inp = $('#sq'), grid = $('#grid'), cnt = $('#count');
  const run = () => { const t = inp.value.trim().toLowerCase(); const l = t ? P.filter(p => (p.title + ' ' + p.type + ' ' + p.tags.join(' ')).toLowerCase().includes(t)) : [];
    cnt.textContent = t ? l.length + ' תוצאות עבור "' + inp.value.trim() + '"' : ''; grid.innerHTML = l.map(card).join(''); history.replaceState(null, '', t ? '?q=' + encodeURIComponent(inp.value.trim()) : location.pathname); };
  inp.value = q.get('q') || ''; inp.addEventListener('input', run); $('#sform').addEventListener('submit', e => { e.preventDefault(); run(); }); run(); inp.focus();
}
