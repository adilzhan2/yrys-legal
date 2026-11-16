# yrys.app — сайт Yrys

Лендинг (en/ar), поддержка и политика конфиденциальности приложения Yrys.
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

## App Store Connect

Ссылки ведут сюда:
- Privacy Policy URL (en, ar): `https://yrys.app/privacy.html`
- Support URL: `https://yrys.app/#support` (en), `https://yrys.app/ar.html#support` (ar)
- Marketing URL: `https://yrys.app/` (en), `https://yrys.app/ar.html` (ar)

Старые адреса `adilzhan2.github.io/yrys-legal/...` автоматически перенаправляются на `yrys.app`.
