/* LAYMR cart drawer (demo, localStorage) */
(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const price = v => '₪' + Number(v).toLocaleString('he-IL', {maximumFractionDigits: 2}).replace(/\.00$/, '');
  const drawer = $('#cartDrawer'), scrim = $('#scrim'), openBtn = $('#cartOpen');
  if (!drawer || !openBtn) return;
  const FREE = 199;
  const get = () => { try { return JSON.parse(localStorage.getItem('laymr-cart') || '[]'); } catch (e) { return []; } };
  const set = c => { try { localStorage.setItem('laymr-cart', JSON.stringify(c)); } catch (e) {} render(); };
  let badge = openBtn.querySelector('.hic-badge');
  if (!badge){ badge = document.createElement('span'); badge.className = 'hic-badge'; openBtn.appendChild(badge); }
  const BAG = '<svg viewBox="0 0 24 24"><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>';
  const suggestions = () => {
    const D = window.LAYMR_DATA; if (!D) return '';
    const list = (D.collectionProducts['קיץ-new'] || []).map(h => D.products.find(p => p.handle === h)).filter(p => p && p.images && p.images.length).slice(0, 3);
    if (!list.length) return '';
    return '<div class="cd-sugg"><h5>New in</h5><div class="cd-sugg-grid">' + list.map(p => { const v = p.variants[0] || {price: 0}; return '<a href="product.html?p=' + encodeURIComponent(p.handle) + '"><div class="im"><img src="' + p.images[0].src + '" alt="' + esc(p.title) + '"></div><span class="t">' + esc(p.title) + '</span><span class="pr">' + price(v.price) + '</span></a>'; }).join('') + '</div></div>';
  };
  function render(){
    const c = get(); const n = c.reduce((a, b) => a + b.qty, 0);
    $('#cdCount').textContent = n; badge.textContent = n; badge.classList.toggle('on', n > 0);
    drawer.classList.toggle('empty', !c.length);
    const body = $('#cdBody'), foot = $('#cdFoot'), ship = $('#cdShip');
    if (!c.length){
      body.innerHTML = '<div class="cd-empty">' + BAG + '<h4>העגלה שלך ריקה</h4><p>הפריטים שתוסיפו יופיעו כאן. משלוח חינם בקנייה מעל ' + price(FREE) + '.</p><a class="btn-line" href="collection.html?c=all">המשך בקנייה</a>' + suggestions() + '</div>';
      foot.innerHTML = ''; return;
    }
    const total = c.reduce((a, b) => a + Number(b.price) * b.qty, 0);
    const left = Math.max(0, FREE - total);
    ship.classList.toggle('done', left === 0);
    ship.querySelector('p').innerHTML = left > 0 ? 'עוד <b>' + price(left) + '</b> למשלוח חינם' : 'הרווחתם משלוח חינם ✓';
    requestAnimationFrame(() => { ship.querySelector('.cd-bar i').style.width = Math.min(100, total / FREE * 100) + '%'; });
    body.innerHTML = c.map((it, i) => '<div class="cd-item"><a href="product.html?p=' + encodeURIComponent(it.handle) + '"><img src="' + it.img + '" alt=""></a><div><a class="cd-ttl" href="product.html?p=' + encodeURIComponent(it.handle) + '">' + esc(it.title) + '</a>' + (it.variant ? '<div class="cd-var">' + esc(it.variant) + '</div>' : '') +
      '<div class="cd-row"><div class="cd-qty"><button data-i="' + i + '" data-d="1" aria-label="יותר">+</button><span>' + it.qty + '</span><button data-i="' + i + '" data-d="-1" aria-label="פחות">−</button></div><span class="cd-pr">' + price(Number(it.price) * it.qty) + '</span></div>' +
      '<button class="cd-rm" data-rm="' + i + '">הסרה</button></div></div>').join('');
    const shipFee = left > 0 ? 29 : 0; const grand = total + shipFee; const note = (() => { try { return localStorage.getItem('laymr-note') || ''; } catch (e) { return ''; } })();
    foot.innerHTML = '<div class="cd-lines"><div class="cd-line"><span>סה"כ מוצרים</span><span>' + price(total) + '</span></div><div class="cd-line"><span>משלוח</span><span>' + (shipFee ? price(shipFee) : 'חינם') + '</span></div></div>' +
      '<div class="cd-sub"><span>עלות כולל משלוח</span><span>' + price(grand) + '</span></div><p class="cd-note">המס כלול. <a href="page.html?id=shipping-policy">דמי משלוח</a> יחושבו סופית בעת התשלום.</p>' +
      '<details class="cd-memo"' + (note ? ' open' : '') + '><summary>הוספת הערה להזמנה</summary><textarea id="cdNote" rows="3" placeholder="לדוגמה: להשאיר אצל השכן, מידה חלופית אם אזל…">' + esc(note) + '</textarea></details>' +
      '<a class="cd-go" href="#"><span>לתשלום</span><span>' + price(grand) + '</span></a><a class="cd-more" href="collection.html?c=all">המשך בקנייה</a>';
    const ta = $('#cdNote'); if (ta) ta.oninput = () => { try { localStorage.setItem('laymr-note', ta.value); } catch (e) {} };
    body.querySelectorAll('.cd-qty button').forEach(b => b.onclick = () => { const c2 = get(); const it = c2[+b.dataset.i]; it.qty += +b.dataset.d; if (it.qty <= 0) c2.splice(+b.dataset.i, 1); set(c2); });
    body.querySelectorAll('.cd-rm').forEach(b => b.onclick = () => { const c2 = get(); c2.splice(+b.dataset.rm, 1); set(c2); });
  }
  const open = () => { render(); if (scrim) scrim.classList.add('open'); drawer.classList.add('open'); };
  window.addToCart = item => { const c = get(); const ex = c.find(x => x.vid === item.vid); if (ex) ex.qty += item.qty; else c.push(item); set(c); open(); };
  openBtn.onclick = open;
  render();
})();
