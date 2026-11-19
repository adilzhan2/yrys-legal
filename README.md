# yrys.app — сайт Yrys

Лендинг (en/ar/fr/ru), поддержка и политика конфиденциальности приложения Yrys.
Живой адрес: https://yrys.app

## Как обновить сайт

Правка → `git commit` → `git push` в ветку `main`. GitHub Pages сам выкладывает
новую версию примерно за минуту. Ничего больше делать не нужно.

Коммиты — с личной почты (локальный `git config user.email`).

## Файлы

| Файл | Что это |
|---|---|
| `index.html` | Главная (английский). Якорь `#support` — ссылка Support из App Store |
| `ar.html` | Главная (арабский, RTL). Якорь `#support` — Support для ar-SA |
| `fr.html` | Главная (французский). Якорь `#support` — Support для fr-FR. Кнопки App Store с `ct=site-fr` |
| `ru.html` | Главная (русский). Якорь `#support` — Support для ru. Кнопки App Store с `ct=site-ru`. Ссылка «Yrys» на русских гайдах и калькуляторе ведёт сюда |
| `zakat-calculator.html`, `calculateur-zakat.html`, `ar-zakat.html`, `kalkulyator-zakata.html` | Калькулятор закята (en/fr/ar/ru) для поиска: три шага, нисаб по золоту по умолчанию, кредиты — 12 ближайших платежей. Кнопка «Подставить сегодняшнюю цену» берёт цену с api.gold-api.com и курс с open.er-api.com (только по нажатию). Логика — `zakat.js`: ставка, нисаб и вычет долгов как в приложении (`ZakatCalculator.swift`), но в приложении пока нисаб по серебру и «долги на сейчас». Кнопки App Store с `ct=site-zakat-en/fr/ar/ru` |
| Гайды (по 4 на en/fr/ar/ru): золото — `zakat-on-gold` / `zakat-sur-or` / `ar-zakat-gold` / `zakyat-s-zolota`; нисаб — `nisab-amount-2027` / `nissab-2027` / `ar-nisab-2027` / `nisab-2027`; закят и садака — `zakat-vs-sadaqah` / `zakat-et-sadaqa` / `ar-zakat-sadaqa` / `zakyat-i-sadaka`; бюджет — `halal-budget` / `budget-halal` / `ar-halal-budget` / `halyalnyy-byudzhet` (все `.html`) | К Рамадану 2027. Каждый ведёт на калькулятор своего языка; список гайдов — внизу каждого калькулятора (`#guides`); версии связаны через hreflang и кнопки языков. Кнопки App Store с `ct=site-guide-<gold/nisab/sadaka/budget>-<en/fr/ar/ru>`. **Таблицы нисаба (4 страницы нисаба) и цены в примерах (4 страницы о золоте) — по ценам на 18.11.2026: в конце января 2027 обновить цифры и даты** |
| `privacy.html` | Privacy Policy — ссылка из App Store и из приложения. **Не переименовывать и не удалять** |
| `site.css`, `img/` | Стили и картинки лендинга |
| `CNAME` | Подключает домен `yrys.app` к GitHub Pages. **Не удалять** |
| `robots.txt`, `sitemap.xml` | Для поисковиков. Новую страницу — добавить в `sitemap.xml` |

## Домен и DNS

- **Регистратор:** Spaceship (тот же аккаунт, что у Pera). Куплен 2026-11-16,
  продлевается автоматически, следующая оплата 2027-11-16 (~$14.49). Whois скрыт (Privacy: Private).
- **DNS:** Cloudflare (тот же аккаунт, что у Pera). NS: `ivy.ns.cloudflare.com`, `odin.ns.cloudflare.com`.
- **Хостинг:** GitHub Pages, репозиторий `adilzhan2/yrys-legal`, HTTPS включён.

### Записи DNS в Cloudflare — не удалять

Все записи — **DNS only** (серое облако). Если включить прокси (оранжевое), GitHub
перестанет продлевать HTTPS-сертификат, а `.app` без HTTPS не открывается.

| Тип | Имя | Значение | Зачем |
|---|---|---|---|
| A | `@` | `185.199.108.153` | GitHub Pages |
| A | `@` | `185.199.109.153` | GitHub Pages |
| A | `@` | `185.199.110.153` | GitHub Pages |
| A | `@` | `185.199.111.153` | GitHub Pages |
| CNAME | `www` | `adilzhan2.github.io` | `www.yrys.app` → `yrys.app` |
| TXT | `@` | `google-site-verification=ILC7SQGj_-m8YXLykTzXvQyssWtFeWzR5e28JwgXiLU` | Подтверждение в Google Search Console |
| CNAME | `046457a8cc402118bf13bba1d0e40ec7` | `verify.bing.com` | Подтверждение в Bing Webmaster |

### Почта support@yrys.app

Cloudflare Email Routing: `support@yrys.app` пересылается на личный gmail
(правило в Email Routing → Routing rules; остальные адреса — Drop).
Письма только **принимаются**; отвечать — со своего gmail. Для этого Cloudflare добавил
записи (не удалять, они «Locked»):

| Тип | Имя | Значение |
|---|---|---|
| MX | `@` | `route1.mx.cloudflare.net` (90), `route2…` (75), `route3…` (88) |
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net ~all` |
| TXT | `cf2024-1._domainkey` | DKIM-ключ Cloudflare |

### Подтверждение в поисковиках — не удалять

- **Google Search Console:** доменный ресурс `yrys.app`, подтверждён TXT-записью выше.
  Sitemap отправлен 2026-11-16.
- **Bing Webmaster Tools:** сайт `https://yrys.app/`. Подтверждение держится на мета-теге
  в `<head>` файла `index.html`:
  `<meta name="msvalidate.01" content="5BE59292307556CA39473C721B903FFA">`
  и на CNAME-записи выше. Sitemap отправлен 2026-11-16.

Оба входа — через личный Google-аккаунт.

Эти коды — не пароли и не ключи: они только доказывают, что домен наш, и и так видны
публично через DNS. Скрывать их не нужно, но если удалить — подтверждение слетит
и придётся проходить его заново.

## Ссылки на App Store с меткой источника

Формат: `https://apps.apple.com/app/apple-store/id6817070500?pt=129525827&ct=<метка>&mt=8`.
`pt=129525827` — наш provider token (общий для Yrys и Pera), `ct` — откуда пришёл человек
(до 40 символов, латиница). Загрузки по меткам видны в App Store Connect →
Yrys → Аналитика → Приобретение → Кампании (появляются, когда по ссылке кто-то пришёл;
данные считаются только у пользователей, разрешивших делиться аналитикой с разработчиками).

| Где | Ссылка |
|---|---|
| Сайт, английская страница (все кнопки) | `…&ct=site-en&mt=8` — уже стоит |
| Сайт, арабская страница (все кнопки) | `…&ct=site-ar&mt=8` — уже стоит |
| Сайт, французская страница (все кнопки) | `…&ct=site-fr&mt=8` — уже стоит |
| Сайт, русская страница (все кнопки) | `…&ct=site-ru&mt=8` — уже стоит |
| Instagram, ссылка в профиле | https://apps.apple.com/app/apple-store/id6817070500?pt=129525827&ct=instagram&mt=8 |
| TikTok, ссылка в профиле | https://apps.apple.com/app/apple-store/id6817070500?pt=129525827&ct=tiktok&mt=8 |
| YouTube, описание канала и Shorts | https://apps.apple.com/app/apple-store/id6817070500?pt=129525827&ct=youtube&mt=8 |
| Facebook, страница | https://apps.apple.com/app/apple-store/id6817070500?pt=129525827&ct=facebook&mt=8 |
| X (арабский) | https://apps.apple.com/app/apple-store/id6817070500?pt=129525827&ct=x-ar&mt=8 |
| WhatsApp-канал | https://apps.apple.com/app/apple-store/id6817070500?pt=129525827&ct=whatsapp&mt=8 |
| Reddit | https://apps.apple.com/app/apple-store/id6817070500?pt=129525827&ct=reddit&mt=8 |
| Гайды на сайте | `…&ct=site-guide-<gold/nisab/sadaka/budget>-<en/fr/ar/ru>` (16 меток) — уже стоят |

Новую метку можно придумать самому (например `ct=ramadan-reel1`), регистрировать её нигде не нужно.

### Короткие ссылки для профилей

Папки `ig/`, `tt/` и т.д. — страницы-переадресации: `yrys.app/tt` сразу открывает App Store
с меткой `ct=tiktok`. Их и ставить в профили и называть в роликах. Не индексируются (`noindex`).

| Короткая ссылка | Метка |
|---|---|
| https://yrys.app/ig | `instagram` |
| https://yrys.app/tt | `tiktok` |
| https://yrys.app/yt | `youtube` |
| https://yrys.app/fb | `facebook` |
| https://yrys.app/x | `x-ar` |
| https://yrys.app/wa | `whatsapp` |
| https://yrys.app/rd | `reddit` |

Новая короткая ссылка: скопировать любую папку (например `tt/` → `blogger1/`) и поменять `ct=` в трёх местах внутри `index.html`.

## App Store Connect

Ссылки ведут сюда:
- Privacy Policy URL (en, ar): `https://yrys.app/privacy.html`
- Support URL: `https://yrys.app/#support` (en), `https://yrys.app/ar.html#support` (ar)
- Marketing URL: `https://yrys.app/` (en), `https://yrys.app/ar.html` (ar)

Старые адреса `adilzhan2.github.io/yrys-legal/...` автоматически перенаправляются на `yrys.app`.
