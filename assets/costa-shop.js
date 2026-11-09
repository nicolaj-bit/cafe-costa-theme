/*
  Café Costa – produktgitter.
  1) Filterknapper viser/skjuler kort ud fra produkt-tags.
  2) Valg af malning opdaterer prisen.
  3) «Læg i kurv» lægger varen i kurven uden at forlade siden.
  4) Antal (+/−) og valg af variant på produktsiden; adressen følger varianten.
     Virker JavaScript ikke, sendes formularen helt almindeligt til kurven.
*/
(function () {
  if (window.costaShopReady) return;
  window.costaShopReady = true;

  function filterShop(shop, tag) {
    var items = shop.querySelectorAll('.costa-shop__item');
    var shown = 0;
    items.forEach(function (item) {
      var tags = ' ' + (item.getAttribute('data-costa-tags') || '') + ' ';
      var match = !tag || tags.indexOf(' ' + tag + ' ') !== -1;
      item.hidden = !match;
      if (match) shown++;
    });
    var empty = shop.querySelector('[data-costa-empty]');
    if (empty) empty.hidden = shown !== 0;
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-costa-filter]');
    if (!button) return;
    var shop = button.closest('[data-costa-shop]');
    shop.querySelectorAll('[data-costa-filter]').forEach(function (b) {
      b.setAttribute('aria-pressed', b === button ? 'true' : 'false');
    });
    filterShop(shop, button.getAttribute('data-costa-filter'));
  });

  document.addEventListener('change', function (event) {
    var input = event.target;
    var form = input.closest('[data-costa-add]');
    if (!form) return;
    var source = input.tagName === 'SELECT' ? input.options[input.selectedIndex] : input;
    var price = source.getAttribute('data-price');
    var compare = source.getAttribute('data-compare');
    var scope = input.closest('[data-costa-product]') || form;
    var target = scope.querySelector('[data-costa-price]');
    var page = input.closest('[data-costa-product]');
    if (page && input.name === 'id' && window.history && window.history.replaceState) {
      var url = new URL(window.location.href);
      url.searchParams.set('variant', input.value);
      window.history.replaceState({}, '', url.toString());
    }
    if (price && target) target.innerHTML = (compare ? '<s>' + compare + '</s>' : '') + price;
  });

  document.addEventListener('click', function (event) {
    var step = event.target.closest('[data-costa-qty]');
    if (!step) return;
    var input = step.parentElement.querySelector('input[name="quantity"]');
    var next = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(step.getAttribute('data-costa-qty'), 10));
    input.value = next;
  });

  function updateCount() {
    var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
    return fetch(root + 'cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        document.querySelectorAll('[data-costa-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
          el.hidden = cart.item_count === 0;
        });
        document.dispatchEvent(new CustomEvent('costa:cart-updated', { detail: cart }));
      });
  }

  document.addEventListener('submit', function (event) {
    var form = event.target.closest('[data-costa-add]');
    if (!form || !window.fetch) return;
    event.preventDefault();
    var button = form.querySelector('[type="submit"]');
    var status = form.querySelector('[data-costa-status]');
    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
    button.textContent = button.getAttribute('data-label-adding');
    if (status) status.textContent = '';

    fetch(form.action.replace(/\/?$/, '') + '.js', {
      method: 'POST',
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: new FormData(form)
    })
      .then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) throw new Error(data.description || data.message || 'error');
          return data;
        });
      })
      .then(function () {
        if (status) status.textContent = status.getAttribute('data-added');
        var link = form.querySelector('[data-costa-cart-link]');
        if (link) link.hidden = false;
        return updateCount();
      })
      .catch(function (error) {
        if (status) status.textContent = error.message && error.message !== 'error' ? error.message : status.getAttribute('data-error');
      })
      .finally(function () {
        button.removeAttribute('aria-busy');
        button.disabled = false;
        button.textContent = button.getAttribute('data-label-add');
      });
  });
})();
