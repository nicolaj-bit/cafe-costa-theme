/*
  Café Costa – kurv-skuffe (sections/costa-cart-drawer.liquid).
  1) Åbner, når kunden lægger noget i kurven eller trykker på kurv-ikonet.
  2) Antal og «Fjern» ændrer kurven og henter skuffens indhold igen fra Shopify.
  3) «Gå til kassen» er slået fra, indtil handelsbetingelserne er accepteret.
     Krydset huskes, mens fanen er åben – det sættes aldrig på forhånd.
*/
(function () {
  if (window.costaDrawerReady) return;
  window.costaDrawerReady = true;

  var SECTION = 'costa-cart-drawer';
  var TERMS = 'costa-terms-accepted';
  var drawer = document.querySelector('[data-costa-drawer]');
  if (!drawer) return;
  var panel = drawer.querySelector('[data-costa-drawer-panel]');
  var opener = null;
  var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  function accepted() {
    try { return window.sessionStorage.getItem(TERMS) === '1'; } catch (e) { return false; }
  }

  function syncTerms() {
    var box = drawer.querySelector('[data-costa-terms]');
    var button = drawer.querySelector('[data-costa-checkout]');
    if (!box || !button) return;
    if (accepted()) box.checked = true;
    button.disabled = !box.checked;
  }

  function open(from) {
    if (!drawer.hidden) return;
    opener = from || document.activeElement;
    drawer.hidden = false;
    // Næste billede, så overgangen kan ses.
    window.requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    document.documentElement.classList.add('costa-drawer-open');
    panel.focus();
  }

  function close() {
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    document.documentElement.classList.remove('costa-drawer-open');
    window.setTimeout(function () { drawer.hidden = true; }, 250);
    if (opener && opener.focus) opener.focus();
  }

  function setCount(count) {
    document.querySelectorAll('[data-costa-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
  }

  function replace(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var fresh = doc.querySelector('[data-costa-drawer-content]');
    var current = drawer.querySelector('[data-costa-drawer-content]');
    if (fresh && current) current.innerHTML = fresh.innerHTML;
    syncTerms();
  }

  function refresh() {
    return fetch(root + '?section_id=' + SECTION, { headers: { Accept: 'text/html' } })
      .then(function (r) { return r.text(); })
      .then(replace);
  }

  function change(key, quantity) {
    var content = drawer.querySelector('[data-costa-drawer-content]');
    content.setAttribute('aria-busy', 'true');
    return fetch(root + 'cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity, sections: SECTION })
    })
      .then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) throw new Error(data.description || data.message || '');
          return data;
        });
      })
      .then(function (cart) {
        setCount(cart.item_count);
        if (cart.sections && cart.sections[SECTION]) replace(cart.sections[SECTION]);
        else return refresh();
      })
      .catch(function (error) {
        var status = drawer.querySelector('[data-costa-drawer-status]');
        if (status) status.textContent = error.message || status.getAttribute('data-error');
      })
      .finally(function () { content.removeAttribute('aria-busy'); });
  }

  // Lagt i kurven fra et produktkort eller produktsiden (assets/costa-shop.js).
  document.addEventListener('costa:cart-updated', function () {
    refresh().then(function () { open(); });
  });

  // Erhvervsportalens «Læg i kurv» sender normalt kunden til kurv-siden.
  // Her lægges varen i kurven i baggrunden, og skuffen åbner i stedet.
  document.addEventListener('submit', function (event) {
    var form = event.target.closest('form.costa-bag__form:not([data-costa-add])');
    if (!form || event.defaultPrevented) return;
    event.preventDefault();
    fetch(root + 'cart/add.js', { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      .then(function (r) { if (!r.ok) throw new Error(); return fetch(root + 'cart.js'); })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        setCount(cart.item_count);
        return refresh().then(function () { open(form.querySelector('[type="submit"]')); });
      })
      .catch(function () { form.submit(); });
  });

  document.addEventListener('click', function (event) {
    var cartLink = event.target.closest('[data-costa-cart-open]');
    // På selve kurv-siden er skuffen overflødig.
    if (cartLink && !/\/cart\/?$/.test(window.location.pathname)) {
      event.preventDefault();
      refresh().then(function () { open(cartLink); });
      return;
    }
    if (event.target.closest('[data-costa-drawer-close]')) { close(); return; }
    var line = event.target.closest('[data-costa-line]');
    if (line && drawer.contains(line)) change(line.getAttribute('data-costa-line'), parseInt(line.getAttribute('data-quantity'), 10));
  });

  document.addEventListener('change', function (event) {
    var input = event.target.closest('[data-costa-line-input]');
    if (input && drawer.contains(input)) {
      change(input.getAttribute('data-costa-line-input'), Math.max(0, parseInt(input.value, 10) || 0));
      return;
    }
    var box = event.target.closest('[data-costa-terms]');
    if (box && drawer.contains(box)) {
      try { window.sessionStorage.setItem(TERMS, box.checked ? '1' : '0'); } catch (e) { /* privat vindue */ }
      syncTerms();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (drawer.hidden) return;
    if (event.key === 'Escape') { close(); return; }
    if (event.key !== 'Tab') return;
    // Hold fokus inde i skuffen, mens den er åben.
    var items = panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])');
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  syncTerms();
})();
