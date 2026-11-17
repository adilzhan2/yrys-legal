// Zakat calculator for yrys.app. Same rules as the app (ZakatCalculator.swift):
// rate 2.5%, nisab 85 g of gold or 595 g of silver, debts due now are subtracted,
// metal prices are entered by the person. Everything stays in the browser.
(function () {
  var form = document.getElementById('zakat-form');
  if (!form) return;
  var lang = document.documentElement.lang || 'en';
  var locale = { en: 'en-US', fr: 'fr-FR', ar: 'ar', ru: 'ru-RU' }[lang] || 'en-US';

  var T = {
    en: {
      due: 'Your zakat',
      below: 'No zakat due',
      belowNote: 'Your zakatable wealth is under the nisab, so no zakat is due on it this year.',
      needPrice: { gold: 'First enter the gold price per gram (step 1), or tap “Use today’s price”.', silver: 'First enter the silver price per gram (step 1), or tap “Use today’s price”.' },
      empty: 'Enter what you have (step 2) and your answer appears here.',
      dueNote: '2.5% of your zakatable wealth, if it stayed above the nisab for one lunar year.',
      metalNoPrice: 'Gold or silver without a price per gram is not counted yet.',
      dueWhy: function (base, nisab) { return 'You have ' + base + ', which is at or above the nisab (' + nisab + '). Zakat is 2.5% of this amount. It is paid once a year, if the amount stayed at or above the nisab for a full lunar year.'; },
      belowWhy: function (base, nisab) { return 'You have ' + base + ', which is below the nisab (' + nisab + '), the minimum amount on which zakat is due.'; },
      nisabInline: function (n) { return 'Nisab, the minimum for zakat: ' + n; },
      autoLoading: 'Loading the price…',
      autoDone: function (date) { return 'Market price as of ' + date + ' filled in. Jewellers may charge more, so you can change it.'; },
      autoFail: 'Couldn’t load the price. Enter it yourself: ask a jeweller or search “gold price per gram”.'
    },
    fr: {
      due: 'Votre zakat',
      below: 'Pas de zakat à verser',
      belowNote: 'Vos biens soumis à la zakat sont sous le nissab : pas de zakat à verser cette année.',
      needPrice: { gold: 'Indiquez d’abord le prix du gramme d’or (étape 1), ou touchez « Utiliser le prix du jour ».', silver: 'Indiquez d’abord le prix du gramme d’argent (étape 1), ou touchez « Utiliser le prix du jour ».' },
      empty: 'Saisissez ce que vous avez (étape 2) : la réponse s’affichera ici.',
      dueNote: '2,5 % de vos biens soumis à la zakat, s’ils sont restés au-dessus du nissab pendant une année lunaire.',
      metalNoPrice: 'L’or ou l’argent sans prix au gramme n’est pas encore compté.',
      dueWhy: function (base, nisab) { return 'Vous avez ' + base + ', soit au moins le nissab (' + nisab + '). La zakat est de 2,5 % de ce montant. Elle se verse une fois par an, si le montant est resté au-dessus du nissab pendant une année lunaire complète.'; },
      belowWhy: function (base, nisab) { return 'Vous avez ' + base + ', soit moins que le nissab (' + nisab + '), le montant minimum à partir duquel la zakat est due.'; },
      nisabInline: function (n) { return 'Nissab, le minimum pour la zakat : ' + n; },
      autoLoading: 'Chargement du prix…',
      autoDone: function (date) { return 'Prix du marché du ' + date + ' saisi. Chez un bijoutier, le prix peut être plus élevé : vous pouvez le modifier.'; },
      autoFail: 'Impossible de charger le prix. Saisissez-le vous-même : demandez à un bijoutier ou cherchez « prix du gramme d’or ».'
    },
    ru: {
      due: 'Ваш закят',
      below: 'Закят платить не нужно',
      belowNote: 'Ваше имущество, облагаемое закятом, ниже нисаба: в этом году закят с него не выплачивается.',
      needPrice: { gold: 'Сначала укажите цену грамма золота (шаг 1) — можно нажать «Подставить сегодняшнюю цену».', silver: 'Сначала укажите цену грамма серебра (шаг 1) — можно нажать «Подставить сегодняшнюю цену».' },
      empty: 'Впишите, что у вас есть (шаг 2), — и здесь появится ответ.',
      dueNote: '2,5% от облагаемого имущества, если оно было не ниже нисаба целый лунный год.',
      metalNoPrice: 'Золото или серебро без цены за грамм пока не учтено.',
      dueWhy: function (base, nisab) { return 'У вас ' + base + ' — это не меньше нисаба (' + nisab + '). Закят — 2,5% от этой суммы. Его отдают раз в год, если сумма продержалась не ниже нисаба целый лунный год.'; },
      belowWhy: function (base, nisab) { return 'У вас ' + base + ' — это меньше нисаба (' + nisab + '), минимальной суммы, с которой платят закят.'; },
      nisabInline: function (n) { return 'Нисаб — минимальная сумма для закята: ' + n; },
      autoLoading: 'Загружаем цену…',
      autoDone: function (date) { return 'Подставлена биржевая цена на ' + date + '. У ювелира цена бывает выше — можно исправить вручную.'; },
      autoFail: 'Не получилось загрузить цену. Впишите её вручную — её можно узнать у ювелира или в интернете по запросу «цена золота за грамм».'
    },
    ar: {
      due: 'زكاتك',
      below: 'لا زكاة عليك',
      belowNote: 'أموالك الزكوية أقل من النصاب، فلا زكاة عليها هذا العام.',
      needPrice: { gold: 'أدخل أولًا سعر غرام الذهب (الخطوة 1)، أو اضغط «استخدم سعر اليوم».', silver: 'أدخل أولًا سعر غرام الفضة (الخطوة 1)، أو اضغط «استخدم سعر اليوم».' },
      empty: 'أدخل ما تملكه (الخطوة 2) لتظهر النتيجة هنا.',
      dueNote: '2.5% من أموالك الزكوية إذا بقيت فوق النصاب حولًا قمريًا كاملًا.',
      metalNoPrice: 'الذهب أو الفضة بلا سعر للغرام لا يدخل في الحساب بعد.',
      dueWhy: function (base, nisab) { return 'لديك ' + base + '، وهو يبلغ النصاب (' + nisab + ') أو يزيد. الزكاة 2.5% من هذا المبلغ، وتُخرج مرة في السنة إذا بقي المال فوق النصاب حولًا قمريًا كاملًا.'; },
      belowWhy: function (base, nisab) { return 'لديك ' + base + '، وهو أقل من النصاب (' + nisab + ')، أي أقل مبلغ تجب فيه الزكاة.'; },
      nisabInline: function (n) { return 'النصاب، أقل مبلغ تجب فيه الزكاة: ' + n; },
      autoLoading: 'جارٍ تحميل السعر…',
      autoDone: function (date) { return 'تم إدخال سعر السوق بتاريخ ' + date + '. قد يكون سعر الصائغ أعلى، ويمكنك تعديله.'; },
      autoFail: 'تعذّر تحميل السعر. أدخله بنفسك: اسأل صائغًا أو ابحث عن «سعر غرام الذهب».'
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
      s = (lang !== 'fr' && lang !== 'ru' && /^\d{1,3}(,\d{3})+$/.test(s)) ? s.replace(/,/g, '') : s.replace(/,/g, '.');
    }
    var n = parseFloat(s);
    return isFinite(n) && n > 0 ? n : 0; // negatives are typos: debts have their own field
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  // Amounts are in whatever currency the person typed, so no symbol is shown.
  function money(n) {
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  }

  function val(name) { var el = form.elements[name]; return el ? parse(el.value) : 0; }

  var out = {
    box: document.getElementById('zakat-result'),
    label: document.getElementById('zr-label'),
    amount: document.getElementById('zr-amount'),
    note: document.getElementById('zr-note'),
    wealth: document.getElementById('zr-wealth'),
    nisab: document.getElementById('zr-nisab'),
    warn: document.getElementById('zr-warn'),
    nisabInline: document.getElementById('nisab-inline')
  };
  var priceSlot = document.getElementById('price-slot');

  // On phones the result sits below the form, so a small bar keeps the amount in view.
  var mini = document.createElement('a');
  mini.className = 'zr-mini';
  mini.href = '#zakat-result';
  mini.innerHTML = '<span></span><strong></strong>';
  document.body.appendChild(mini);

  function update() {
    var basis = form.elements.basis.value;
    var goldG = val('goldGrams'), goldP = val('goldPrice');
    var silverG = val('silverGrams'), silverP = val('silverPrice');

    var assets = val('cash') + val('savings') + val('investments') + val('business') + val('receivables')
      + goldG * goldP + silverG * silverP;
    var base = round2(Math.max(0, assets - val('debts')));
    var price = basis === 'gold' ? goldP : silverP;
    var nisab = price > 0 ? round2(NISAB_GRAMS[basis] * price) : null;

    out.wealth.textContent = money(base);
    out.nisab.textContent = nisab === null ? '—' : money(nisab);
    out.warn.hidden = !((goldG > 0 && goldP <= 0) || (silverG > 0 && silverP <= 0));
    out.warn.textContent = T.metalNoPrice;

    var state;
    if (nisab === null) {
      state = 'wait';
      out.label.textContent = T.due;
      out.amount.textContent = '—';
      out.note.textContent = (assets > 0 || priceSlot) ? T.needPrice[basis] : T.empty;
    } else if (base >= nisab) {
      state = 'due';
      out.label.textContent = T.due;
      out.amount.textContent = money(round2(base * 0.025));
      out.note.textContent = T.dueWhy ? T.dueWhy(money(base), money(nisab)) : T.dueNote;
    } else {
      state = 'below';
      out.label.textContent = T.below;
      out.amount.textContent = money(0);
      out.note.textContent = assets > 0 ? (T.belowWhy ? T.belowWhy(money(base), money(nisab)) : T.belowNote) : T.empty;
    }
    // Only the nisab metal's price is asked for; the other appears once its weight is entered.
    document.querySelectorAll('[data-price]').forEach(function (field) {
      var metal = field.getAttribute('data-price');
      var grams = metal === 'gold' ? goldG : silverG;
      field.hidden = !(metal === basis || grams > 0);
      if (!priceSlot) return;
      // Step-by-step page: the nisab price sits in step 1, the other one right under its weight.
      if (metal === basis) {
        if (field.parentNode !== priceSlot) priceSlot.appendChild(field);
      } else {
        var gramsField = form.elements[metal + 'Grams'] && form.elements[metal + 'Grams'].closest('.field');
        if (gramsField && gramsField.nextElementSibling !== field) gramsField.after(field);
      }
    });
    if (out.nisabInline) out.nisabInline.textContent = nisab === null ? '' : T.nisabInline(money(nisab));
    out.box.setAttribute('data-state', state);
    mini.firstChild.textContent = out.label.textContent;
    mini.lastChild.textContent = out.amount.textContent;
    mini.setAttribute('data-state', state);
  }

  // "?" buttons open a short explanation right below them.
  document.querySelectorAll('button.info').forEach(function (btn) {
    var box = document.getElementById(btn.getAttribute('aria-controls'));
    if (!box) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      box.hidden = !open;
    });
  });

  // Group thousands while typing: 5000000 -> 5 000 000 (ru, fr) or 5,000,000 (en, ar).
  var spaceGroups = lang === 'fr' || lang === 'ru';
  var GROUP = spaceGroups ? ' ' : ',';
  var DEC = spaceGroups ? ',' : '.';

  function group(raw) {
    if (/[^0-9\s.,]/.test(raw)) return raw; // sums like 100+50 or other digits: leave as typed
    var plain = spaceGroups ? raw.replace(/\s/g, '') : raw.replace(/[\s,]/g, '');
    var decAt = spaceGroups ? plain.search(/[.,]/) : plain.indexOf('.');
    var intPart = decAt < 0 ? plain : plain.slice(0, decAt);
    var rest = decAt < 0 ? '' : DEC + plain.slice(decAt + 1).replace(/[.,]/g, '');
    return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP) + rest;
  }

  form.addEventListener('input', function (e) {
    var el = e.target;
    if (el.tagName !== 'INPUT' || el.inputMode !== 'decimal') return;
    var caret = el.selectionStart == null ? el.value.length : el.selectionStart;
    var digitsBefore = el.value.slice(0, caret).replace(/[^0-9]/g, '').length;
    var next = group(el.value);
    if (next === el.value) return;
    el.value = next;
    var pos = 0, seen = 0;
    while (pos < next.length && seen < digitsBefore) { if (/[0-9]/.test(next[pos])) seen++; pos++; }
    el.setSelectionRange(pos, pos);
  });

  // "Use today's price": spot price in USD per troy ounce, converted to the chosen currency.
  // Only the visitor's request goes out; nothing they typed is sent.
  var autoBtn = document.getElementById('auto-price');
  if (autoBtn) {
    // The few common currencies for this language are in the page; add every other one the rate service knows.
    var curSelect = document.getElementById('auto-cur');
    var ALL = 'AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BRL BSD BTN BWP BYN BZD CAD CDF CHF CLP CNY COP CRC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD GNF GTQ GYD HKD HNL HTG HUF IDR ILS INR IQD IRR ISK JMD JOD JPY KES KGS KHR KMF KRW KWD KYD KZT LAK LBP LKR LRD LSL LYD MAD MDL MGA MKD MMK MNT MOP MRU MUR MVR MWK MXN MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLE SOS SRD SSP STN SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD UYU UZS VES VND VUV WST XAF XCD XOF XPF YER ZAR ZMW ZWG'.split(' ');
    var have = {};
    Array.prototype.forEach.call(curSelect.options, function (o) { have[o.value] = true; });
    var names = null;
    try { names = new Intl.DisplayNames([locale], { type: 'currency' }); } catch (e) {}
    var rest = ALL.filter(function (c) { return !have[c]; }).map(function (c) {
      var n = names ? names.of(c) : c;
      return { code: c, label: c + ' — ' + n };
    }).sort(function (a, b) { return a.label.localeCompare(b.label, locale); });
    var groupEl = document.createElement('optgroup');
    groupEl.label = { ru: 'Все валюты', en: 'All currencies', fr: 'Toutes les devises', ar: 'جميع العملات' }[lang] || 'All currencies';
    rest.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.code; o.textContent = c.label;
      groupEl.appendChild(o);
    });
    curSelect.appendChild(groupEl);

    // Show the chosen currency's sign next to every money field.
    var showCur = function () {
      var c = curSelect.value, sign = c;
      try {
        var part = new Intl.NumberFormat(locale, { style: 'currency', currency: c, currencyDisplay: 'narrowSymbol' })
          .formatToParts(0).filter(function (p) { return p.type === 'currency'; })[0];
        if (part) sign = part.value;
      } catch (e) {}
      document.querySelectorAll('[data-cur]').forEach(function (el) { el.textContent = sign; });
    };
    curSelect.addEventListener('change', showCur);
    showCur();

    var autoStatus = document.getElementById('auto-status');
    var OZ = 31.1034768;
    var getJSON = function (url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); };
    var setPrice = function (name, n) {
      var el = form.elements[name];
      el.value = group(String(n >= 100 ? Math.round(n) : round2(n)).replace('.', DEC));
    };
    autoBtn.addEventListener('click', function () {
      var cur = document.getElementById('auto-cur').value;
      autoBtn.disabled = true;
      autoStatus.textContent = T.autoLoading;
      Promise.all([
        getJSON('https://api.gold-api.com/price/XAU'),
        getJSON('https://api.gold-api.com/price/XAG'),
        cur === 'USD' ? Promise.resolve({ rates: { USD: 1 } }) : getJSON('https://open.er-api.com/v6/latest/USD')
      ]).then(function (res) {
        var rate = res[2].rates && res[2].rates[cur];
        if (!(res[0].price > 0) || !(res[1].price > 0) || !(rate > 0)) throw new Error('no data');
        setPrice('goldPrice', res[0].price / OZ * rate);
        setPrice('silverPrice', res[1].price / OZ * rate);
        autoStatus.textContent = T.autoDone(new Date(res[0].updatedAt || Date.now()).toLocaleDateString(locale));
        update();
      }).catch(function () {
        autoStatus.textContent = T.autoFail;
      }).then(function () { autoBtn.disabled = false; });
    });
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); update(); });
  form.addEventListener('reset', function () { setTimeout(update, 0); });
  update();
})();
