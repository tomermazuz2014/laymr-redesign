/* LAYMR account drawer (demo, localStorage) */
(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const drawer = $('#acctDrawer'), scrim = $('#scrim'), openBtn = $('#acctOpen');
  if (!drawer || !openBtn) return;
  const body = $('#acctBody'), title = $('#acctTitle');
  const getUser = () => { try { return JSON.parse(localStorage.getItem('laymr-user') || 'null'); } catch (e) { return null; } };
  const setUser = u => { try { u ? localStorage.setItem('laymr-user', JSON.stringify(u)) : localStorage.removeItem('laymr-user'); } catch (e) {} document.body.classList.toggle('logged', !!u); document.dispatchEvent(new CustomEvent('laymr:auth', {detail: u})); };
  const users = () => { try { return JSON.parse(localStorage.getItem('laymr-users') || '{}'); } catch (e) { return {}; } };
  const saveUsers = u => { try { localStorage.setItem('laymr-users', JSON.stringify(u)); } catch (e) {} };
  const EYE = '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const CHEV = '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>';
  const G = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9l3.3-2.5Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5L6.4 10C7.2 7.8 9.4 6 12 6Z"/></svg>';
  const A = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.6 1.3-2.7 0 0-2.6-1-2.6-4ZM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.4Z"/></svg>';
  const field = (id, label, type, lat, extra) => '<div class="ac-field' + (lat ? ' lat' : '') + '"><input id="' + id + '" type="' + type + '" placeholder=" " ' + (extra || '') + '><label for="' + id + '">' + label + '</label>' + (type === 'password' ? '<button type="button" class="ac-eye" data-eye="' + id + '" aria-label="הצגת סיסמה">' + EYE + '</button>' : '') + '</div>';
  const social = () => '<div class="ac-or">או</div><div class="ac-soc"><button type="button" data-soc="Google">' + G + 'Google</button><button type="button" data-soc="Apple">' + A + 'Apple</button></div>';
  const wire = () => {
    body.querySelectorAll('.ac-eye').forEach(b => b.onclick = () => { const i = $('#' + b.dataset.eye); i.type = i.type === 'password' ? 'text' : 'password'; });
    body.querySelectorAll('[data-soc]').forEach(b => b.onclick = () => { const v = body.querySelector('.ac-view'); v.innerHTML = '<div class="ac-ok"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg><h4>התחברות עם ' + b.dataset.soc + '</h4><p>בגרסת הדמו החיבור החברתי אינו פעיל — בחנות החיה הוא יתחבר ל-Shopify Customer Accounts.</p><button class="ac-link" data-go="login">חזרה</button></div>'; wireGo(); });
    wireGo();
  };
  const wireGo = () => body.querySelectorAll('[data-go]').forEach(b => b.onclick = () => views[b.dataset.go]());
  const busy = (btn, fn) => { btn.disabled = true; btn.classList.add('busy'); setTimeout(() => { btn.disabled = false; btn.classList.remove('busy'); fn(); }, 750); };
  const err = (id, msg) => { const f = $('#' + id).closest('.ac-field'); f.classList.toggle('err', !!msg); const m = body.querySelector('.ac-msg'); if (msg) m.textContent = msg; };
  const views = {};
  views.login = () => {
    title.textContent = 'החשבון שלי';
    body.innerHTML = '<div class="ac-view"><div class="ac-tabs"><button class="on" data-go="login">התחברות</button><button data-go="signup">הרשמה</button><i></i></div>' +
      '<p class="ac-intro">ברוכים השבים ל-LAYMR. התחברו כדי לעקוב אחרי הזמנות, לשמור פריטים וליהנות מהטבות המועדון.</p>' +
      '<form class="ac-f" id="acF" novalidate>' + field('lEmail', 'אימייל', 'email', true, 'autocomplete="email"') + field('lPass', 'סיסמה', 'password', true, 'autocomplete="current-password"') +
      '<div class="ac-msg"></div><div class="ac-between"><label class="ac-check"><input type="checkbox" checked> זכור אותי</label><button type="button" class="ac-link" data-go="reset">שכחתי סיסמה</button></div>' +
      '<button class="ac-btn" type="submit"><i class="sp"></i>התחברות</button></form>' + social() +
      '<p class="ac-foot">אין לכם חשבון? <button type="button" class="ac-link" data-go="signup">הרשמו עכשיו</button> וקבלו 10% הנחה על ההזמנה הראשונה.</p></div>';
    wire();
    $('#acF').onsubmit = e => { e.preventDefault(); const em = $('#lEmail').value.trim().toLowerCase(), pw = $('#lPass').value;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return err('lEmail', 'נא להזין כתובת אימייל תקינה');
      if (pw.length < 6) return err('lPass', 'הסיסמה צריכה להכיל לפחות 6 תווים');
      err('lEmail', ''); err('lPass', '');
      busy(e.target.querySelector('.ac-btn'), () => { const u = users()[em] || {first: em.split('@')[0], last: '', email: em}; setUser({first: u.first, last: u.last, email: em}); views.account(true); });
    };
  };
  views.signup = () => {
    title.textContent = 'יצירת חשבון';
    body.innerHTML = '<div class="ac-view"><div class="ac-tabs alt"><button data-go="login">התחברות</button><button class="on" data-go="signup">הרשמה</button><i></i></div>' +
      '<p class="ac-intro">הצטרפו למועדון LAYMR — מעקב הזמנות, החלפות קלות, והטבות שמגיעות ראשונות אליכם.</p>' +
      '<form class="ac-f" id="acF" novalidate><div class="ac-row2">' + field('sFirst', 'שם פרטי', 'text', false, 'autocomplete="given-name"') + field('sLast', 'שם משפחה', 'text', false, 'autocomplete="family-name"') + '</div>' +
      field('sEmail', 'אימייל', 'email', true, 'autocomplete="email"') + field('sPhone', 'טלפון (אופציונלי)', 'tel', true, 'autocomplete="tel"') + field('sPass', 'סיסמה (6 תווים לפחות)', 'password', true, 'autocomplete="new-password"') +
      '<div class="ac-msg"></div><label class="ac-check" style="font-size:12.5px;color:#5a5248"><input type="checkbox" id="sNews" checked> אני מאשר/ת קבלת עדכונים והטבות במייל</label>' +
      '<button class="ac-btn" type="submit"><i class="sp"></i>יצירת חשבון</button></form>' + social() +
      '<p class="ac-foot">בהרשמה אתם מאשרים את <a href="page.html?id=terms-of-service">תנאי השימוש</a> ו<a href="page.html?id=privacy-policy">מדיניות הפרטיות</a>.</p></div>';
    wire();
    $('#acF').onsubmit = e => { e.preventDefault(); const first = $('#sFirst').value.trim(), last = $('#sLast').value.trim(), em = $('#sEmail').value.trim().toLowerCase(), pw = $('#sPass').value;
      if (!first) return err('sFirst', 'נא להזין שם פרטי');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return err('sEmail', 'נא להזין כתובת אימייל תקינה');
      if (pw.length < 6) return err('sPass', 'הסיסמה צריכה להכיל לפחות 6 תווים');
      ['sFirst','sEmail','sPass'].forEach(i => err(i, ''));
      busy(e.target.querySelector('.ac-btn'), () => { const all = users(); all[em] = {first, last, email: em, news: $('#sNews').checked}; saveUsers(all); setUser({first, last, email: em}); views.account(true, true); });
    };
  };
  views.reset = () => {
    title.textContent = 'איפוס סיסמה';
    body.innerHTML = '<div class="ac-view"><p class="ac-intro">הזינו את האימייל שאיתו נרשמתם ונשלח אליכם קישור לאיפוס הסיסמה.</p><form class="ac-f" id="acF" novalidate>' + field('rEmail', 'אימייל', 'email', true, 'autocomplete="email"') + '<div class="ac-msg"></div><button class="ac-btn" type="submit"><i class="sp"></i>שליחת קישור</button></form><p class="ac-foot"><button type="button" class="ac-link" data-go="login">חזרה להתחברות</button></p></div>';
    wire();
    $('#acF').onsubmit = e => { e.preventDefault(); const em = $('#rEmail').value.trim(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return err('rEmail', 'נא להזין כתובת אימייל תקינה');
      busy(e.target.querySelector('.ac-btn'), () => { body.innerHTML = '<div class="ac-view"><div class="ac-ok"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg><h4>הקישור בדרך אליכם</h4><p>אם קיים חשבון עבור ' + esc(em) + ', תקבלו מייל עם הוראות לאיפוס תוך מספר דקות.</p><button class="ac-link" data-go="login">חזרה להתחברות</button></div></div>'; wireGo(); }); };
  };
  views.account = (fresh, isNew) => {
    const u = getUser(); if (!u) return views.login();
    title.textContent = 'החשבון שלי';
    body.innerHTML = '<div class="ac-view">' + (fresh ? '<p class="ac-intro" style="color:#2e6b3f;margin-bottom:10px">' + (isNew ? 'החשבון נוצר בהצלחה ✓ קוד ההנחה WELCOME10 מחכה לכם בקופה.' : 'התחברת בהצלחה ✓') + '</p>' : '') +
      '<h2 class="ac-hello">היי, ' + esc(u.first) + '</h2><p class="ac-sub">' + esc(u.email) + '</p>' +
      '<div class="ac-club"><div><b>LAYMR Club</b><span>חבר/ת מועדון · צוברים 5% מכל הזמנה</span></div><span class="pts">0 ₪</span></div>' +
      '<div class="ac-menu"><a href="account.html">סקירת החשבון' + CHEV + '</a><a href="account.html#orders">ההזמנות שלי<small>אין הזמנות עדיין</small>' + CHEV + '</a><a href="account.html#profile">פרטים אישיים' + CHEV + '</a><a href="account.html#addresses">כתובות למשלוח' + CHEV + '</a><a href="account.html#prefs">העדפות דיוור' + CHEV + '</a></div>' +
      '<button class="ac-link ac-out" id="acOut">התנתקות</button></div>';
    $('#acOut').onclick = () => { setUser(null); views.login(); };
  };
  const open = () => { getUser() ? views.account() : views.login(); if (scrim) scrim.classList.add('open'); drawer.classList.add('open'); setTimeout(() => { const f = body.querySelector('input'); if (f && matchMedia('(hover:hover)').matches) f.focus(); }, 500); };
  openBtn.onclick = open;
  document.querySelectorAll('[data-acct]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const mo = $('#menuOverlay'); if (mo) mo.classList.remove('open'); open(); }));
  $('#acctClose').onclick = () => { drawer.classList.remove('open'); if (scrim && !document.querySelector('.cart-drawer.open')) scrim.classList.remove('open'); };
  setUser(getUser());
})();
