// Zakat calculator for yrys.app. Same rules as the app (ZakatCalculator.swift):
// rate 2.5%, nisab 85 g of gold or 595 g of silver, debts due now are subtracted,
// metal prices are entered by the person. Everything stays in the browser.
(function () {
  var form = document.getElementById('zakat-form');
  if (!form) return;
  var lang = document.documentElement.lang || 'en';
  var locale = { en: 'en-US', fr: 'fr-FR', ar: 'ar' }[lang] || 'en-US';

  var T = {
    en: {
      due: 'Zakat due',
      below: 'Below the nisab',
      belowNote: 'Your zakatable wealth is under the nisab, so no zakat is due on it this year.',
      needPrice: { gold: 'Enter the gold price per gram to check the nisab.', silver: 'Enter the silver price per gram to check the nisab.' },
      empty: 'Enter your amounts to see your zakat.',
      dueNote: '2.5% of your zakatable wealth, if it stayed above the nisab for one lunar year.',
      metalNoPrice: 'Gold or silver without a price per gram is not counted yet.'
    },
    fr: {
      due: 'Zakat à verser',
      below: 'Sous le nissab',
      belowNote: 'Vos biens soumis à la zakat sont sous le nissab : pas de zakat à verser cette année.',
      needPrice: { gold: 'Saisissez le prix du gramme d’or pour vérifier le nissab.', silver: 'Saisissez le prix du gramme d’argent pour vérifier le nissab.' },
      empty: 'Saisissez vos montants pour voir votre zakat.',
      dueNote: '2,5 % de vos biens soumis à la zakat, s’ils sont restés au-dessus du nissab pendant une année lunaire.',
      metalNoPrice: 'L’or ou l’argent sans prix au gramme n’est pas encore compté.'
    },
    ar: {
      due: 'الزكاة الواجبة',
      below: 'أقل من النصاب',
      belowNote: 'أموالك الزكوية أقل من النصاب، فلا زكاة عليها هذا العام.',
      needPrice: { gold: 'أدخل سعر غرام الذهب للتحقق من النصاب.', silver: 'أدخل سعر غرام الفضة للتحقق من النصاب.' },
      empty: 'أدخل المبالغ لترى زكاتك.',
      dueNote: '2.5% من أموالك الزكوية إذا بقيت فوق النصاب حولًا قمريًا كاملًا.',
      metalNoPrice: 'الذهب أو الفضة بلا سعر للغرام لا يدخل في الحساب بعد.'
    }
  }[lang];
  if (!T) return;

  var NISAB_GRAMS = { gold: 85, silver: 595 };

  // Accepts 1,234.50 / 1 234,50 / ١٢٣٤٫٥ and simple sums like 100+250.
  function parse(text) {
    if (!text) return 0;
    var s = String(text)
      .replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 0x0660; })
      .replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 0x06F0; })
      .replace(/٫/g, '.').replace(/٬/g, '')
      .replace(/[\s  ']/g, '');
    return s.split('+').reduce(function (sum, part) { return sum + parseOne(part); }, 0);
  }

  function parseOne(s) {
    if (!s) return 0;
    var lastComma = s.lastIndexOf(','), lastDot = s.lastIndexOf('.');
    if (lastComma >= 0 && lastDot >= 0) {
      if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
      else s = s.replace(/,/g, '');
    } else if (lastComma >= 0) {
      s = (lang !== 'fr' && /^\d{1,3}(,\d{3})+$/.test(s)) ? s.replace(/,/g, '') : s.replace(/,/g, '.');
    }
    var n = parseFloat(s);
    return isFinite(n) && n > 0 ? n : 0; // negatives are typos: debts have their own field
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  function money(n, currency) {
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency: currency, maximumFractionDigits: 2 }).format(n);
    } catch (e) {
      return n.toFixed(2) + ' ' + currency;
    }
  }

  function val(name) { var el = form.elements[name]; return el ? parse(el.value) : 0; }

  var out = {
    box: document.getElementById('zakat-result'),
    label: document.getElementById('zr-label'),
    amount: document.getElementById('zr-amount'),
    note: document.getElementById('zr-note'),
    wealth: document.getElementById('zr-wealth'),
    nisab: document.getElementById('zr-nisab'),
    warn: document.getElementById('zr-warn')
  };

  // On phones the result sits below the form, so a small bar keeps the amount in view.
  var mini = document.createElement('a');
  mini.className = 'zr-mini';
  mini.href = '#zakat-result';
  mini.innerHTML = '<span></span><strong></strong>';
  document.body.appendChild(mini);

  function update() {
    var currency = form.elements.currency.value;
    var basis = form.elements.basis.value;
    var goldG = val('goldGrams'), goldP = val('goldPrice');
    var silverG = val('silverGrams'), silverP = val('silverPrice');

    var assets = val('cash') + val('savings') + val('investments') + val('business') + val('receivables')
      + goldG * goldP + silverG * silverP;
    var base = round2(Math.max(0, assets - val('debts')));
    var price = basis === 'gold' ? goldP : silverP;
    var nisab = price > 0 ? round2(NISAB_GRAMS[basis] * price) : null;

    out.wealth.textContent = money(base, currency);
    out.nisab.textContent = nisab === null ? '—' : money(nisab, currency);
    out.warn.hidden = !((goldG > 0 && goldP <= 0) || (silverG > 0 && silverP <= 0));
    out.warn.textContent = T.metalNoPrice;

    var state;
    if (nisab === null) {
      state = 'wait';
      out.label.textContent = T.due;
      out.amount.textContent = '—';
      out.note.textContent = assets > 0 ? T.needPrice[basis] : T.empty;
    } else if (base >= nisab) {
      state = 'due';
      out.label.textContent = T.due;
      out.amount.textContent = money(round2(base * 0.025), currency);
      out.note.textContent = T.dueNote;
    } else {
      state = 'below';
      out.label.textContent = T.below;
      out.amount.textContent = money(0, currency);
      out.note.textContent = assets > 0 ? T.belowNote : T.empty;
    }
    out.box.setAttribute('data-state', state);
    mini.firstChild.textContent = out.label.textContent;
    mini.lastChild.textContent = out.amount.textContent;
    mini.setAttribute('data-state', state);
    document.querySelectorAll('[data-cur]').forEach(function (el) { el.textContent = currency; });
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); update(); });
  form.addEventListener('reset', function () { setTimeout(update, 0); });
  update();
})();
