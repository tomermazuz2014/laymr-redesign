
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
$('#hnav').innerHTML = D.nav.map(n => '<a href="' + n.u + '">' + n.t + '</a>').join('') + '<a href="index.html#about" data-about>אודות</a>';
const moChev = '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>';
const curC = (() => { try { return decodeURIComponent(new URLSearchParams(location.search).get('c') || ''); } catch (e) { return ''; } })();
$('#moLinks').innerHTML = D.nav.map((n, i) => { const ch = (() => { try { return decodeURIComponent((n.u.split('c=')[1] || '')); } catch (e) { return ''; } })(); return '<a href="' + n.u + '" class="' + (ch && ch === curC ? 'on' : '') + '" style="transition-delay:' + (0.06 + i*0.04) + 's"><span>' + n.t + '</span>' + moChev + '</a>'; }).join('') + '<a href="index.html#about" style="transition-delay:.46s"><span>אודות</span></a>';
$('#fshop').innerHTML = D.nav.map(n => '<li><a href="' + n.u + '">' + n.t + '</a></li>').join('');
const MSGS = ['משלוח חינם בקנייה מעל 199 ₪', 'עד 199 ₪ — משלוח ב-29 ₪ בלבד', 'משלוח מהיר עד 5 ימי עסקים עם שליח עד הבית', 'LAYMR — SUMMER SALE'];
const tHTML = MSGS.concat(MSGS, MSGS).map(m => '<span dir="rtl">' + m + '</span>').join('');
$('#tickerA').innerHTML = tHTML; $('#tickerB').innerHTML = tHTML;
document.querySelectorAll('footer .fcol h3').forEach(h => h.addEventListener('click', () => { if (matchMedia('(max-width:700px)').matches) h.parentElement.classList.toggle('open'); }));
const hdrEl = document.querySelector('header'); const onScr = () => hdrEl.classList.toggle('scrolled', scrollY > 8); onScr(); addEventListener('scroll', onScr, {passive:true});
const scrim = $('#scrim'), menuOverlay = $('#menuOverlay'), cartDrawer = $('#cartDrawer');
const closeAll = () => { scrim.classList.remove('open'); menuOverlay.classList.remove('open'); cartDrawer.classList.remove('open'); const ad = $('#acctDrawer'); if (ad) ad.classList.remove('open'); };
$('#menuOpen').onclick = () => { if (matchMedia('(min-width:1181px)').matches){ const h = document.querySelector('header'); const o = h.classList.toggle('nav-open'); $('#menuOpen').setAttribute('aria-expanded', o); } else menuOverlay.classList.add('open'); };
$('#menuClose').onclick = closeAll; $('#cartClose').onclick = closeAll; scrim.onclick = closeAll;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
const nf = $('#newsForm'); if (nf) nf.addEventListener('submit', e => { e.preventDefault(); $('#newsOk').style.display = 'block'; });
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }), {threshold:.1});
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

/* cart lives in assets/cart.js */

/* ---- cards ---- */
const cheapest = p => p.variants.reduce((a, v) => Number(v.price) < Number(a.price) ? v : a, p.variants[0]);
const COLORS = {'שחור':'#141414','שחור.':'#141414','לבן':'#ffffff','אפור':'#9a9a9a','אבן':'#cfc6b8','ג\'ינס':'#5b7aa6','ג׳ינס':'#5b7aa6','ג׳ינס כהה':'#2f4468','ירוק':'#6b7a4a','חום':'#6b4a2f','כחול':'#2c4a8a','כחול נייבי':'#1c2b55','כחול עם לוגו צהוב':'#2c4a8a','ורוד':'#e9a9b8','סגול':'#8b6fb3','שמנת':'#efe6d4','בז\'':'#d9c7a8','פיסטוק':'#b9c79a','אדום':'#b23a2a','תכלת':'#9cc6e8','צהוב':'#e6c74a','זהב':'#c9a24a','מוקה':'#8a6a53','קאמל':'#c19a6b','black':'#141414','white':'#ffffff','grey':'#9a9a9a','gray':'#9a9a9a','blue':'#2c4a8a','green':'#6b7a4a','brown':'#6b4a2f','beige':'#d9c7a8'};
const isColor = o => /צבע|color/i.test(o.name), isSize = o => /מידה|size/i.test(o.name);
const NEWSET = new Set(D.collectionProducts['קיץ-new'] || []);
/* product cards that play a campaign clip instead of the first photo (hover still shows the 2nd photo) */
const CARD_VIDEOS = {'בגד-ים-אייל': 'media/pc-swim-hat.mp4', 'בגד-ים-אייל-כחול': 'media/pc-swim-pool.mp4'};
const optIdx = (p, test) => p.options.findIndex(test);
function card(p){
  const v = cheapest(p); const sale = v.cmp && Number(v.cmp) > Number(v.price); const out = !p.variants.some(x => x.avail);
  const im0 = p.images[0] ? p.images[0].src : 'images/logo-lm.png', im1 = p.images[1] ? p.images[1].src : null;
  const ci = optIdx(p, isColor), si = optIdx(p, isSize);
  const dots = ci >= 0 ? '<div class="pc-dots">' + p.options[ci].values.slice(0, 6).map(c => '<span title="' + esc(c) + '" style="background:' + (COLORS[c.trim()] || '#bdb5aa') + '"></span>').join('') + '</div>' : '';
  const sizeAvail = sz => p.variants.some(x => [x.o1, x.o2, x.o3][si] === sz && x.avail);
  const isNew = NEWSET.has(p.handle);
  const sizes = si >= 0 ? '<div class="pc-sizes">' + p.options[si].values.map(sz => '<button data-sz="' + esc(sz) + '" class="' + (sizeAvail(sz) ? '' : 'off') + '">' + esc(sz) + '</button>').join('') + '</div>' : '<span></span>';
  const vid = CARD_VIDEOS[p.handle];
  const primary = vid ? '<video class="pc-vid" autoplay muted loop playsinline preload="metadata" poster="' + im0 + '"><source src="' + vid + '" type="video/mp4"></video>' : '<img loading="lazy" src="' + im0 + '" alt="' + esc(p.title) + '">';
  return '<div class="pc" data-h="' + esc(p.handle) + '"><a class="pc-img" href="product.html?p=' + encodeURIComponent(p.handle) + '">' + primary + (im1 ? '<img loading="lazy" class="alt" src="' + im1 + '" alt="">' : '') + '</a><div class="pc-top">' + (isNew && !out ? '<span class="pc-new">New</span>' : '') + dots + '</div>' +
    (out ? '<span class="pc-tag">Sold out</span>' : '') +
    '<div class="pc-panel"><div class="pc-row"><a class="pc-title" href="product.html?p=' + encodeURIComponent(p.handle) + '">' + esc(p.title) + '</a><button class="pc-plus" aria-label="בחירת מידה">+</button><div class="pc-price' + (sale ? ' sale' : '') + '">' + (sale ? '<s>' + price(v.cmp) + '</s>' : '') + '<span class="now">' + price(v.price) + '</span></div></div>' +
    '<div class="pc-row2">' + sizes + '<button class="pc-add"' + (out ? ' disabled' : '') + '>' + (out ? 'אזל' : 'הוספה לסל') + '</button></div></div></div>';
}
/* grid interactions: size pick + quick add */
document.addEventListener('click', e => {
  const szBtn = e.target.closest('.pc-sizes button');
  if (szBtn){ if (szBtn.classList.contains('off')) return; szBtn.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === szBtn)); return; }
  const plus = e.target.closest('.pc-plus');
  if (plus){ const pc = plus.closest('.pc'); const was = pc.classList.contains('open'); document.querySelectorAll('.pc.open').forEach(x => x.classList.remove('open')); pc.classList.toggle('open', !was); return; }
  const addBtn = e.target.closest('.pc-add');
  if (addBtn){ const pc = addBtn.closest('.pc'); const p = byHandle[pc.dataset.h]; if (!p) return;
    const si = optIdx(p, isSize); const chosen = pc.querySelector('.pc-sizes button.on');
    let v = p.variants.find(x => x.avail && (si < 0 || !chosen || [x.o1, x.o2, x.o3][si] === chosen.dataset.sz)) || p.variants.find(x => x.avail) || p.variants[0];
    if (si >= 0 && !chosen){ pc.querySelector('.pc-sizes button:not(.off)')?.classList.add('on'); const first = pc.querySelector('.pc-sizes button.on'); if (first) v = p.variants.find(x => x.avail && [x.o1, x.o2, x.o3][si] === first.dataset.sz) || v; }
    addToCart({vid: v.id, handle: p.handle, title: p.title, variant: v.title === 'Default Title' ? '' : v.title, price: v.price, qty: 1, img: p.images[0] ? p.images[0].src : 'images/logo-lm.png'}); }
});

/* ---- pages ---- */
const page = document.body.dataset.page;
if (page === 'collection'){
  document.querySelector('main.pg').classList.add('collection');
  const h = dec(q.get('c') || 'all'); const title = h === 'all' ? 'כל המוצרים' : colTitle(h);
  const list = h === 'all' ? P.slice() : (D.collectionProducts[h] || []).map(x => byHandle[x]).filter(Boolean);
  const FEAT_SETS = {
  'all': ['GUYP1172.jpg','Snapinst.app_350143470_999611704364660_6428162201381596142_n_1080.jpg','GUYP1327.jpg','LAYMR212211.jpg','GUYP1263.jpg','Snapinst.app_353623109_943617180224884_1525858055982929976_n_1080.jpg','GUYP1226.jpg','10_78f335ef-829e-47a2-b195-afca1506cd2a.png'],
  'קיץ-new': ['LAYMR211944.jpg','LAYMR212016.jpg','LAYMR211985.jpg','LAYMR212025.jpg'],
  'קולקציית-חג': ['EyalGolanbrand0085.jpg','EyalGolanbrand5002_1.jpg','EyalGolanbrand0328.jpg','EyalGolanbrand0425_2.jpg'],
  'קפוצונים': ['LAYMR212100.jpg','LAYMR212256.jpg','LAYMR212029.jpg','LAYMR212485.jpg'],
  'חולצות': ['GUYP1226.jpg','LAYMR212016.jpg','LAYMR212211.jpg','GUYP1263.jpg'],
  'גופיות': ['Snapinst.app_350143470_999611704364660_6428162201381596142_n_1080.jpg','IMG_4301_copy.jpg','Snapinst.app_353623109_943617180224884_1525858055982929976_n_1080.jpg','10_78f335ef-829e-47a2-b195-afca1506cd2a.png'],
  'חליפות': ['EyalGolanbrand1144.jpg','EyalGolanbrand0093.jpg','EyalGolanbrand0501.jpg','Eyal_Golan_brand0870_1.jpg'],
  'ספורט': ['LAYMR211944.jpg','LAYMR212211.jpg','LAYMR212457.jpg','LAYMR211985.jpg'],
  'קולקציית-קיץ': ['GUYP1327.jpg','GUYP1172.jpg','EyalGolanbrand0644.jpg','EyalGolanbrand4726_1.jpg'],
  'בגדי-ים': ['10_78f335ef-829e-47a2-b195-afca1506cd2a.png','EyalGolanbrand0890_1.jpg','EyalGolanbrand1001_1.jpg','GUYP1172.jpg'],
  'best-sellers': ['EyalGolanbrand0890_1.jpg','LAYMR211978.jpg','GUYP1263.jpg','Snapinst.app_353623109_943617180224884_1525858055982929976_n_1080.jpg']
};
  document.title = title + ' — LAYMR'; $('#colTitle').textContent = title;
  const cats = [{t: 'הכל', u: 'collection.html?c=all'}].concat(D.nav);
  $('#colCats').innerHTML = cats.map(n => { const ch = dec((n.u.split('c=')[1] || '')); return '<a href="' + n.u + '" class="' + (ch === h ? 'on' : '') + '">' + n.t + '</a>'; }).join('');
  const onCat = $('#colCats a.on'); if (onCat) onCat.scrollIntoView({block: 'nearest', inline: 'center'});
  const sizeSet = []; list.forEach(p => { const si = optIdx(p, isSize); if (si >= 0) p.options[si].values.forEach(v => { if (!sizeSet.includes(v)) sizeSet.push(v); }); });
  const order = ['XS','S','M','L','XL','XXL','XXXL','2XL','3XL','4XL']; sizeSet.sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99) || a.localeCompare(b));
  $('#sizeOpts').innerHTML = sizeSet.map(v => '<button data-v="' + esc(v) + '">' + esc(v) + '</button>').join('');
  const heroSet = FEAT_SETS[h] || FEAT_SETS.all;
  const state = {sort: 'featured', size: null, hideOut: false};
  const grid = $('#grid'), cnt = $('#count');
  const draw = () => { let l = list.slice();
    if (state.size) l = l.filter(p => { const si = optIdx(p, isSize); return si >= 0 && p.variants.some(v => [v.o1, v.o2, v.o3][si] === state.size && v.avail); });
    if (state.hideOut) l = l.filter(p => p.variants.some(v => v.avail));
    if (state.sort === 'low') l.sort((a, b) => Number(cheapest(a).price) - Number(cheapest(b).price));
    if (state.sort === 'high') l.sort((a, b) => Number(cheapest(b).price) - Number(cheapest(a).price));
    if (state.sort === 'new') l.sort((a, b) => (b.published || '').localeCompare(a.published || ''));
    cnt.textContent = l.length;
    let html = '', f = 0;
    l.forEach((p, i) => { if (l.length >= 8 && i % 8 === 4){ html += '<div class="feat' + (f % 2 ? ' l' : '') + '"><img loading="lazy" src="images/' + (FEAT_SETS[h] || FEAT_SETS.all)[f % (FEAT_SETS[h] || FEAT_SETS.all).length] + '" alt=""></div>'; f++; } html += card(p); });
    grid.innerHTML = l.length ? html : '<div class="empty">אין פריטים שמתאימים לסינון</div>';
    if (typeof fillGaps === 'function') requestAnimationFrame(fillGaps); };
  /* leftover cells at the end of the grid: ONE bold message tile + editorial image tiles */
  const ARROW = '<svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>';
  const PROMOS = [
    '<div class="pfill" data-acct>' + '<video class="pf-vid" muted loop playsinline preload="metadata" poster="images/about-m-poster.jpg"><source src="media/about-m.mp4" type="video/mp4"></video><span class="pf-shade"></span>' + '<span class="pf-k"><i></i>LAYMR Club</span><div class="pf-mid"><span class="pf-big">10<small>%</small></span><span class="pf-sub">הנחה על ההזמנה הראשונה</span></div><div class="pf-bot"><span class="pf-code">WELCOME10</span><span class="pf-btn">להרשמה' + ARROW + '</span></div></div>',
    '<a class="pfill" href="page.html?id=shipping-policy">' + '<video class="pf-vid" muted loop playsinline preload="metadata" poster="images/hero-m-poster.jpg"><source src="media/hero-m.mp4" type="video/mp4"></video><span class="pf-shade"></span>' + '<span class="pf-k"><i></i>Free Shipping</span><div class="pf-mid"><span class="pf-big">199<small>₪</small></span><span class="pf-sub">משלוח חינם מעל 199 ₪ · עד 5 ימי עסקים עד הבית</span></div><div class="pf-bot"><span class="pf-code">EXPRESS</span><span class="pf-btn">למדיניות' + ARROW + '</span></div></a>',
    '<a class="pfill" href="https://www.instagram.com/laymr.official/" target="_blank" rel="noopener">' + '<video class="pf-vid" muted loop playsinline preload="metadata" poster="images/hero-rep-m.jpg"><source src="media/hero-rep-m.mp4" type="video/mp4"></video><span class="pf-shade"></span>' + '<span class="pf-k"><i></i>Instagram</span><div class="pf-mid"><span class="pf-big pf-ig">@laymr</span><span class="pf-sub">הלוקים מהקמפיין, מאחורי הקלעים וההשקות — קודם באינסטגרם</span></div><div class="pf-bot"><span class="pf-code">.official</span><span class="pf-btn">לעקוב' + ARROW + '</span></div></a>'
  ];
  const promoIdx = Math.max(0, D.nav.findIndex(n => dec((n.u.split('c=')[1] || '')) === h)) % PROMOS.length;
  const fillGaps = () => {
    grid.querySelectorAll('.pfill, .pimg').forEach(x => x.remove());
    if (!grid.querySelector('.pc')) return;
    const usedFeats = grid.querySelectorAll('.feat').length;
    const pool = heroSet.slice(usedFeats).concat(FEAT_SETS.all.filter(x => !heroSet.includes(x)));
    let promoDone = false, imgK = 0;
    for (let round = 0; round < 6; round++){
      const cs = getComputedStyle(grid); const cols = cs.gridTemplateColumns.split(' ').length; const gap = parseFloat(cs.columnGap) || 0;
      const gw = grid.getBoundingClientRect().width; const cellW = (gw - gap * (cols - 1)) / cols;
      const kids = [...grid.children]; let maxB = 0; kids.forEach(c => { maxB = Math.max(maxB, c.getBoundingClientRect().bottom); });
      let used = 0; kids.forEach(c => { const r = c.getBoundingClientRect(); if (Math.abs(r.bottom - maxB) < 2) used += Math.max(1, Math.round((r.width + gap) / (cellW + gap))); });
      const empty = cols - used; if (empty <= 0) break;
      for (let i = 0; i < empty; i++){
        if (!promoDone){ grid.insertAdjacentHTML('beforeend', PROMOS[promoIdx]); promoDone = true; }
        else { const src = pool[imgK++ % pool.length]; grid.insertAdjacentHTML('beforeend', '<a class="pimg" href="collection.html?c=' + encodeURIComponent(h) + '"><img loading="lazy" src="images/' + src + '" alt=""><span>LAYMR · 2026</span></a>'); }
      }
    }
    grid.querySelectorAll('.pfill[data-acct]').forEach(el => el.onclick = () => { const b = $('#acctOpen'); if (b) b.click(); });
    grid.querySelectorAll('.pf-vid').forEach(v => { v.parentElement.style.backgroundImage = 'url(' + v.getAttribute('poster') + ')'; v.addEventListener('playing', () => v.classList.add('on')); const q = v.play(); if (q && q.catch) q.catch(() => {}); });
  };
  fillGaps(); let rsT; addEventListener('resize', () => { clearTimeout(rsT); rsT = setTimeout(fillGaps, 150); });
  $('#sortOpts').onclick = e => { const b = e.target.closest('button'); if (!b) return; state.sort = b.dataset.v; $('#sortOpts').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); draw(); };
  $('#sizeOpts').onclick = e => { const b = e.target.closest('button'); if (!b) return; state.size = state.size === b.dataset.v ? null : b.dataset.v; $('#sizeOpts').querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.v === state.size)); draw(); };
  $('#hideOut').onchange = e => { state.hideOut = e.target.checked; draw(); };
  $('#fpClear').onclick = () => { state.sort = 'featured'; state.size = null; state.hideOut = false; $('#hideOut').checked = false; $('#sortOpts').querySelectorAll('button').forEach((x, i) => x.classList.toggle('on', i === 0)); $('#sizeOpts').querySelectorAll('button').forEach(x => x.classList.remove('on')); draw(); };
  const pop = $('#filterPop'), fbtn = $('#filterBtn');
  fbtn.onclick = () => { const o = pop.classList.toggle('open'); fbtn.setAttribute('aria-expanded', o); };
  $('#mFilterBtn').onclick = e => { e.stopPropagation(); pop.classList.toggle('open'); };
  document.addEventListener('click', e => { if (!e.target.closest('.col-filter') && !e.target.closest('#mFilterBtn')) pop.classList.remove('open'); });
  draw();
}
if (page === 'product'){
  const p = byHandle[dec(q.get('p') || '')] || P[0];
  document.title = p.title + ' — LAYMR';
  document.querySelector('main.pg').classList.add('product');
  const col = Object.entries(D.collectionProducts).find(([h, l]) => h !== 'all' && h !== 'frontpage' && l.includes(p.handle));
  if (col) $('#crumbCol').innerHTML = '<a href="collection.html?c=' + encodeURIComponent(col[0]) + '">' + esc(colTitle(col[0])) + '</a><span>/</span>';
  $('#crumb').textContent = p.title; $('#ptitle').textContent = p.title;
  /* gallery: snap slider */
  const imgs = p.images.length ? p.images : [{src: 'images/logo-lm.png'}];
  const track = $('#galTrack'), dots = $('#galDots'), gal = document.querySelector('.pdp-gal'); let cur = 0;
  track.innerHTML = imgs.map((im, i) => '<div class="pdp-slide"><img class="main" ' + (i ? 'loading="lazy" ' : '') + 'src="' + im.src + '" alt="' + esc(p.title) + '"></div>').join('');
  /* extend each photo's own background colour into the side margins (sampled from the image edges) */
  const edgeTone = img => { try { const c = document.createElement('canvas'); c.width = 24; c.height = 24; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 24, 24); const d = x.getImageData(0, 0, 24, 24).data; let r = 0, g = 0, bl = 0, n = 0; for (let y = 0; y < 24; y++) for (const xx of [0, 1, 22, 23]) { const k = (y * 24 + xx) * 4; r += d[k]; g += d[k + 1]; bl += d[k + 2]; n++; } return 'rgb(' + Math.round(r / n) + ',' + Math.round(g / n) + ',' + Math.round(bl / n) + ')'; } catch (e) { return ''; } };
  track.querySelectorAll('img.main').forEach(img => { const paint = () => { const c = edgeTone(img); if (c) img.parentElement.style.background = c; }; if (img.complete && img.naturalWidth) paint(); else img.addEventListener('load', paint, {once: true}); });
  dots.innerHTML = imgs.map((_, i) => '<i class="' + (i ? '' : 'on') + '"></i>').join('');
  if (imgs.length < 2) gal.classList.add('single');
  const goTo = i => { cur = (i + imgs.length) % imgs.length; track.scrollTo({left: cur * track.clientWidth, behavior: 'smooth'}); };
  track.addEventListener('scroll', () => { const i = Math.round(track.scrollLeft / track.clientWidth); if (i !== cur){ cur = i; dots.querySelectorAll('i').forEach((d, n) => d.classList.toggle('on', n === i)); } }, {passive: true});
  $('#galNext').onclick = () => goTo(cur + 1); $('#galPrev').onclick = () => goTo(cur - 1);
  dots.querySelectorAll('i').forEach((d, i) => d.onclick = () => goTo(i));
  $('#saveBtn').onclick = e => e.currentTarget.classList.toggle('on');
  /* options */
  const sel = {}; const realOpts = p.options.filter(o => !(o.values.length === 1 && o.values[0] === 'Default Title'));
  const firstAvail = p.variants.find(v => v.avail) || p.variants[0];
  realOpts.forEach((o, i) => { sel[i] = firstAvail ? ([firstAvail.o1, firstAvail.o2, firstAvail.o3][i] || o.values[0]) : o.values[0]; });
  const optsEl = $('#opts');
  const variantFor = () => p.variants.find(v => realOpts.every((o, i) => [v.o1, v.o2, v.o3][i] === sel[i])) || p.variants[0];
  const availFor = (i, val) => p.variants.some(v => [v.o1, v.o2, v.o3][i] === val && v.avail);
  const dot = c => '<i style="background:' + (COLORS[String(c).trim()] || '#bdb5aa') + '"></i>';
  const drawOpts = () => {
    optsEl.innerHTML = realOpts.map((o, i) => {
      if (isColor(o)) return '<div class="pdp-row" data-i="' + i + '"><span class="lbl">בחירת צבע</span><button class="pdp-cur" type="button">' + dot(sel[i]) + esc(sel[i]) + '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg></button><div class="pdp-list">' +
        o.values.map(v => '<button type="button" data-i="' + i + '" data-v="' + esc(v) + '" class="' + (sel[i] === v ? 'on' : '') + (availFor(i, v) ? '' : ' off') + '">' + dot(v) + esc(v) + '</button>').join('') + '</div></div>';
      return '<div class="pdp-size"><span class="lbl">' + (isSize(o) ? 'בחירת מידה:' : esc(o.name) + ':') + '</span><div class="pdp-chips">' +
        o.values.map(v => '<button type="button" data-i="' + i + '" data-v="' + esc(v) + '" class="' + (sel[i] === v ? 'on' : '') + (availFor(i, v) ? '' : ' off') + '">' + esc(v) + '</button>').join('') + '</div></div>';
    }).join('');
    optsEl.querySelectorAll('.pdp-cur').forEach(b => b.onclick = () => b.parentElement.classList.toggle('open'));
    optsEl.querySelectorAll('button[data-v]').forEach(b => b.onclick = () => { sel[+b.dataset.i] = b.dataset.v; drawOpts(); drawPrice(); });
  };
  const priceEl = $('#pprice'), addBtn = $('#addBtn');
  const drawPrice = () => { const v = variantFor(); const sale = v.cmp && Number(v.cmp) > Number(v.price);
    priceEl.className = 'pdp-price' + (sale ? ' sale' : '');
    priceEl.innerHTML = (sale ? '<span class="pct">-' + Math.round((1 - Number(v.price) / Number(v.cmp)) * 100) + '%</span><s>' + price(v.cmp) + '</s>' : '') + '<span class="now">' + price(v.price) + '</span>';
    addBtn.disabled = !v.avail; addBtn.textContent = v.avail ? 'הוספה לסל' : 'אזל מהמלאי';
    if (v.img){ const k = imgs.findIndex(im => im.id === v.img); if (k >= 0 && k !== cur) goTo(k); } };
  drawOpts(); drawPrice();
  addBtn.onclick = () => { const v = variantFor(); addToCart({vid: v.id, handle: p.handle, title: p.title, variant: v.title === 'Default Title' ? '' : v.title, price: v.price, qty: 1, img: imgs[cur].src}); };
  $('#pdesc').innerHTML = p.body || '<p>פריט מקולקציית LAYMR.</p>';
  const pair = (col ? col[1].map(x => byHandle[x]) : P).filter(x => x && x.handle !== p.handle && x.images.length).slice(0, 3);
  $('#pair').innerHTML = pair.map(x => { const v = cheapest(x); return '<a href="product.html?p=' + encodeURIComponent(x.handle) + '"><div class="im"><img loading="lazy" src="' + x.images[0].src + '" alt="' + esc(x.title) + '"></div><span class="t">' + esc(x.title) + '</span><span class="pr">' + price(v.price) + '</span></a>'; }).join('');
  if (!pair.length) document.querySelector('.pdp-pair').remove();
}
if (page === 'account'){
  const getUser = () => { try { return JSON.parse(localStorage.getItem('laymr-user') || 'null'); } catch (e) { return null; } };
  const store = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const wrap = $('#accWrap'), gate = $('#accGate'), main = $('#accMain');
  const PIN = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  const BOX = '<svg viewBox="0 0 24 24"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>';
  const field = (id, label, val, type, lat, cls) => '<div class="ac-field' + (lat ? ' lat' : '') + (cls ? ' ' + cls : '') + '"><input id="' + id + '" type="' + (type || 'text') + '" placeholder=" " value="' + esc(val || '') + '"><label for="' + id + '">' + label + '</label></div>';
  const newIn = () => (D.collectionProducts['קיץ-new'] || []).map(h => byHandle[h]).filter(x => x && x.images.length);
  const views = {};
  views.overview = u => {
    const addr = store('laymr-addr', []); const pics = ['images/GUYP1327.jpg', 'images/Snapinst.app_350143470_999611704364660_6428162201381596142_n_1080.jpg', 'images/LAYMR211944.jpg'];
    return '<span class="acc-kick"><i></i>Overview</span><h1 class="acc-h1">היי, <em>' + esc(u.first) + '</em></h1><p class="acc-sub">טוב לראות אותך שוב. כאן תוכלו לעקוב אחרי ההזמנות, לנהל כתובות ולהתעדכן בהטבות המועדון.</p>' +
      '<div class="acc-grid"><div class="acc-stat"><span class="acc-chip">Orders</span><small>הזמנות</small><b>0</b></div><div class="acc-stat"><span class="acc-chip">Saved</span><small>פריטים שמורים</small><b>0</b></div><div class="acc-stat"><span class="acc-chip">Addresses</span><small>כתובות</small><b>' + addr.length + '</b></div></div>' +
      '<div class="acc-club"><div><b>LAYMR Club · Member</b><h3>מועדון הלקוחות של LAYMR</h3><p>צוברים 5% מכל הזמנה, מקבלים גישה מוקדמת להשקות ומשלוח חינם מעל 199 ₪. 10% הנחה על ההזמנה הראשונה עם הקוד <strong style="font-family:var(--font-lat);font-size:13px">WELCOME10</strong>.</p></div><div class="tier"><b>Points</b><strong>0</strong></div><div class="bar"><i></i></div><div class="bar-txt"><span>Member</span><span>Gold · 1,500 נק׳</span></div></div>' +
      '<div class="acc-split"><div class="acc-card"><h3>ההזמנות האחרונות<a href="#orders">לכל ההזמנות</a></h3><div class="acc-empty">' + BOX + '<p>עדיין לא ביצעתם הזמנה. ברגע שתזמינו, המעקב והסטטוס יופיעו כאן.</p><a class="acc-btn" href="collection.html?c=%D7%A7%D7%99%D7%A5-new">לקולקציה החדשה</a></div></div>' +
      '<div class="acc-collage">' + pics.map(s => '<img src="' + s + '" alt="">').join('') + '<span class="cap">New season · 2026</span></div></div>';
  };
  views.orders = () => '<span class="acc-kick"><i></i>Orders</span><h1 class="acc-h1">ההזמנות <em>שלי</em></h1><p class="acc-sub">כל ההזמנות, הסטטוסים והמעקב — במקום אחד.</p>' +
    '<div class="acc-orders-empty">' + BOX + '<h3>עדיין אין הזמנות</h3><p>ברוכים הבאים ל-LAYMR. מוכנים לקנות? ההזמנה הראשונה שלכם מחכה — עם 10% הנחה בקוד WELCOME10.</p><a class="pdp-add" style="display:inline-flex;width:auto;padding:0 34px;align-items:center" href="collection.html?c=all">לקנייה</a></div>' +
    '<div class="acc-sugg"><h3>חדש באתר</h3><div class="plist">' + newIn().slice(0, 4).map(card).join('') + '</div></div>';
  views.profile = u => '<span class="acc-kick"><i></i>Profile</span><h1 class="acc-h1">פרטים <em>אישיים</em></h1><p class="acc-sub">הפרטים משמשים אותנו למשלוחים, לעדכונים על ההזמנה ולהטבות המועדון.</p>' +
    '<div class="acc-card"><h3>פרטי קשר</h3><form class="acc-form" id="profForm" novalidate>' + field('pFirst', 'שם פרטי', u.first) + field('pLast', 'שם משפחה', u.last) + field('pEmail', 'אימייל', u.email, 'email', true) + field('pPhone', 'טלפון', u.phone, 'tel', true) + field('pBday', 'תאריך לידה (להטבת יום הולדת)', u.bday, 'text', true, 'full') +
    '<div class="full acc-actions"><button class="acc-save" type="submit">שמירת שינויים</button><span class="acc-saved" id="profSaved">נשמר ✓</span></div></form></div>' +
    '<div class="acc-card" style="margin-top:14px"><h3>סיסמה</h3><form class="acc-form" id="passForm" novalidate>' + field('pwCur', 'סיסמה נוכחית', '', 'password', true) + field('pwNew', 'סיסמה חדשה (6 תווים לפחות)', '', 'password', true) + '<div class="full acc-actions"><button class="acc-ghost" type="submit">עדכון סיסמה</button><span class="acc-saved" id="passSaved">הסיסמה עודכנה ✓</span></div></form></div>';
  views.addresses = () => { const a = store('laymr-addr', []);
    return '<span class="acc-kick"><i></i>Addresses</span><h1 class="acc-h1">כתובות <em>למשלוח</em></h1><p class="acc-sub">שמרו כתובות כדי לסיים את הקנייה הבאה בלחיצה.</p>' +
      '<div class="acc-addr" id="addrList">' + a.map((x, i) => '<div class="acc-addr-card' + (x.def ? ' def' : '') + '">' + (x.def ? '<span class="tag">Default</span>' : '') + '<b>' + esc(x.name) + '</b>' + esc(x.street) + '<br>' + esc(x.city) + (x.zip ? ', ' + esc(x.zip) : '') + '<br><span dir="ltr">' + esc(x.phone) + '</span><div class="ops">' + (x.def ? '' : '<button data-def="' + i + '">הגדרה כברירת מחדל</button>') + '<button data-del="' + i + '">מחיקה</button></div></div>').join('') +
      '<button class="acc-addr-new" id="addrNew"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>הוספת כתובת</button></div>' +
      '<div class="acc-card" id="addrFormWrap" hidden style="margin-top:14px"><h3>כתובת חדשה</h3><form class="acc-form" id="addrForm" novalidate>' + field('aName', 'שם מלא', '', 'text', false, 'full') + field('aStreet', 'רחוב ומספר', '', 'text', false, 'full') + field('aCity', 'עיר', '') + field('aZip', 'מיקוד', '', 'text', true) + field('aPhone', 'טלפון', '', 'tel', true, 'full') +
      '<div class="full acc-actions"><label class="ac-check" style="font-size:13px"><input type="checkbox" id="aDef" checked> כתובת ברירת מחדל</label></div><div class="full acc-actions"><button class="acc-save" type="submit">שמירת כתובת</button><button class="acc-ghost" type="button" id="addrCancel">ביטול</button><span class="acc-saved" id="addrMsg" style="color:#b4452f"></span></div></form></div>'; };
  views.prefs = () => { const p = store('laymr-prefs', {email: true, sms: false, wa: true});
    const sw = (k, t, d) => '<div class="acc-pref"><div><b>' + t + '</b><small>' + d + '</small></div><button class="sw' + (p[k] ? ' on' : '') + '" data-k="' + k + '" role="switch" aria-checked="' + !!p[k] + '" aria-label="' + t + '"></button></div>';
    return '<span class="acc-kick"><i></i>Preferences</span><h1 class="acc-h1">העדפות <em>דיוור</em></h1><p class="acc-sub">בחרו איך תרצו לשמוע מאיתנו. אפשר לשנות בכל רגע.</p><div class="acc-card">' + sw('email', 'אימייל', 'השקות, הטבות מועדון ועדכוני SALE — פעם-פעמיים בחודש.') + sw('sms', 'SMS', 'עדכוני משלוח והטבות בזק.') + sw('wa', 'WhatsApp', 'עדכונים על ההזמנה ושירות לקוחות בצ׳אט.') + '</div>'; };
  const render = () => {
    const u = getUser();
    if (!u){ wrap.hidden = true; gate.hidden = false; return; }
    wrap.hidden = false; gate.hidden = true;
    $('#accAv').textContent = ((u.first || '?')[0] + (u.last ? u.last[0] : '')).toUpperCase(); $('#accName').textContent = (u.first + ' ' + (u.last || '')).trim(); $('#accMail').textContent = u.email;
    const v = (location.hash || '#overview').slice(1); const view = views[v] ? v : 'overview';
    document.querySelectorAll('#accNav a').forEach(a => a.classList.toggle('on', a.dataset.v === view));
    main.innerHTML = views[view](u); main.style.animation = 'none'; void main.offsetWidth; main.style.animation = '';
    if (view === 'profile'){
      $('#profForm').onsubmit = e => { e.preventDefault(); const nu = Object.assign({}, u, {first: $('#pFirst').value.trim() || u.first, last: $('#pLast').value.trim(), email: $('#pEmail').value.trim() || u.email, phone: $('#pPhone').value.trim(), bday: $('#pBday').value.trim()}); save('laymr-user', nu); $('#profSaved').classList.add('on'); setTimeout(() => $('#profSaved').classList.remove('on'), 2200); $('#accName').textContent = (nu.first + ' ' + nu.last).trim(); $('#accMail').textContent = nu.email; $('#accAv').textContent = ((nu.first || '?')[0] + (nu.last ? nu.last[0] : '')).toUpperCase(); };
      $('#passForm').onsubmit = e => { e.preventDefault(); if ($('#pwNew').value.length < 6) return; $('#passSaved').classList.add('on'); setTimeout(() => $('#passSaved').classList.remove('on'), 2200); e.target.reset(); };
    }
    if (view === 'addresses'){
      const fw = $('#addrFormWrap'); $('#addrNew').onclick = () => { fw.hidden = false; fw.scrollIntoView({behavior: 'smooth', block: 'start'}); setTimeout(() => $('#aName').focus(), 300); }; $('#addrCancel').onclick = () => fw.hidden = true;
      $('#addrForm').onsubmit = e => { e.preventDefault(); const n = $('#aName').value.trim(), st = $('#aStreet').value.trim(), c = $('#aCity').value.trim(); if (!n || !st || !c){ $('#addrMsg').textContent = 'נא למלא שם, רחוב ועיר'; return; } const a = store('laymr-addr', []); const def = $('#aDef').checked || !a.length; if (def) a.forEach(x => x.def = false); a.push({name: n, street: st, city: c, zip: $('#aZip').value.trim(), phone: $('#aPhone').value.trim(), def}); save('laymr-addr', a); render(); };
      main.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { const a = store('laymr-addr', []); a.splice(+b.dataset.del, 1); if (a.length && !a.some(x => x.def)) a[0].def = true; save('laymr-addr', a); render(); });
      main.querySelectorAll('[data-def]').forEach(b => b.onclick = () => { const a = store('laymr-addr', []); a.forEach((x, i) => x.def = i === +b.dataset.def); save('laymr-addr', a); render(); });
    }
    if (view === 'prefs') main.querySelectorAll('.sw').forEach(b => b.onclick = () => { const p = store('laymr-prefs', {email: true, sms: false, wa: true}); p[b.dataset.k] = !p[b.dataset.k]; save('laymr-prefs', p); b.classList.toggle('on', p[b.dataset.k]); b.setAttribute('aria-checked', p[b.dataset.k]); });
  };
  addEventListener('hashchange', render); document.addEventListener('laymr:auth', render);
  $('#accOut').onclick = () => { try { localStorage.removeItem('laymr-user'); } catch (e) {} document.body.classList.remove('logged'); location.href = 'index.html'; };
  $('#gateLogin').onclick = () => $('#acctOpen').click();
  render();
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
