# Café Costa Kalundborg – Shopify-tema

Bygget på en ren kopi af Shopifys **Dawn 16.1.1** (commit `3e9ee22` fra github.com/Shopify/dawn).
Alt Café Costa-specifikt ligger i filer, der starter med `costa-`, så Dawn kan opdateres senere.

## Hvor ligger hvad

| Hvad | Fil |
|---|---|
| Al styling (farver, skrifter, afstande, hjørner, knapper) | `assets/costa-tokens.css` |
| Kobling fra tema-indstillinger til CSS-variabler | `snippets/costa-token-settings.liquid` |
| Indstillinger: «Costa – stil» og «Costa – virksomhed» | `config/settings_schema.json` |
| Sektioner | `sections/costa-*.liquid` |
| Forside og undersider | `templates/index.json`, `templates/page.*.json` |
| Danske tekster i temaet | `locales/da.json` (nøglen `costa`) |
| Billeder hentet fra den gamle side | `content/billeder/` + `content/billeder.json` |

**Stilen skiftes i Theme Editor › Tema-indstillinger › Costa – stil.** Sektionerne indeholder ingen faste
farver eller størrelser – kun variabler. Standarden er en neutral, varm palet, indtil stilen er valgt.

**Adresse, telefon, CVR-navn og åbningstider ligger ét sted:** Tema-indstillinger › Costa – virksomhed.
Topbjælken, footeren og kontakt-sektionen henter dem derfra.

## Sektioner

- `costa-hero` – logo, overskrift, tagline og knapper over et baggrundsbillede (forside og undersider)
- `costa-text-image` – tekst med billede (billedet kan slås fra, så det bliver ren tekst)
- `costa-focus-cards` – fokuskort (Risteriet, Kaffevogn, Kaffe til erhverv)
- `costa-gallery` – billedgalleri eller logo-række (erhvervskunder)
- `costa-social` – sociale medier
- `costa-contact` – kontaktoplysninger og Shopify-kontaktformular med frit valgte felter
- `costa-map` – kort (Google Maps, indlæses først efter klik pga. cookies)
- `costa-menu` – menukort med kategorier, undergrupper, retter og priser
- `costa-video` – video (kaffevognen)
- `costa-topbar` – topbjælke med «Find vej», telefon og åbningstider (header)
- `costa-footer` – logo, adresse med rutevejledning, telefon, åbningstider, Facebook, Instagram, Findsmiley og LAG

## Skal bekræftes af ejeren

- **Åbningstider:** sat til «Alle dage: 09.00–17.00». Den gamle side viser 17.00 i toppen, men 18.00 i
  footeren. Siden *Åbningstider* forklarer forskellen: sommersæson (1. maj – 18. okt.) til 18.00, resten
  af året til 17.00. Ejeren skal bekræfte, om det er 17 eller 18 – og huske at rette indstillingen ved
  sæsonskift.
- **Sæsonmenuens priser:** på den gamle side står de tre priser 55,- / 55,- / 95,- samlet under
  «Sæsonens drik». Jeg har sat Winter Latte 55,-, Gløgg 55,- og menuen 95,-.
- **Kaffevognens video** hentes stadig fra den gamle udbyders server (gostmediaserviceprod.blob.core.windows.net).
  Den forsvinder sandsynligvis, når den gamle side lukkes. Upload videoen til Shopify og vælg den i sektionen.
- **Job-formularen** kunne vedhæfte filer. Det kan Shopifys kontaktformular ikke. Ansøgningen skrives i stedet
  i tekstfeltet.
- **Formularer** sendes til butikkens mail (Indstillinger › Butiksoplysninger). Hver besked har feltet
  «Formular», så man kan se, om den kom fra kaffevogn, erhverv, kontakt eller job.

## Rettede stavefejl

Teksten er flyttet ordret. Kun disse åbenlyse fejl er rettet:

| Side | Før | Efter |
|---|---|---|
| Menu | vinterfarvorit | vinterfavorit |
| Menu | En ægte juleklassisker | En ægte juleklassiker |
| Kaffevogn | Cappucino | Cappuccino |
| Kaffe til erhverv | om kan leverer | som kan levere |
| Kaffe til erhverv | de JON​G DUKE (usynligt tegn midt i ordet) | de JONG DUKE |
| Kaffe til erhverv | så er i meget velkomne … så kan i tage | så er I meget velkomne … så kan I tage |
| Kaffe til erhverv | nyde en kom frisk malet kaffe | nyde en kop frisk malet kaffe |
| Historie | mit ynglingsristeri | mit yndlingsristeri |
| Historie | “Flat White,, | “Flat White” |
| Historie | nu var tiden inden til | nu var tiden inde til |
| Historie | da mulighedden kom | da muligheden kom |

Desuden er usynlige tegn (zero-width space) og tomme afsnit fra den gamle sidebygger fjernet.

## Omdirigeringer fra den gamle side

| Gammel adresse | Ny adresse |
|---|---|
| /menu.aspx | /pages/menu |
| /risteriet.aspx | /pages/risteriet |
| /kaffevogn.aspx | /pages/kaffevogn |
| /kaffe-til-erhverv.aspx | /pages/kaffe-til-erhverv |
| /historie.aspx | /pages/historie |
| /aabningstider.aspx | /pages/aabningstider |
| /job.aspx | /pages/job |
| /default.aspx | / |

## Billeder

Skabelonerne peger på billeder i Shopify Files med faste navne (`shopify://shop_images/costa-….jpg`).
Filerne ligger i `content/billeder/`, og `content/billeder.json` viser, hvor hvert billede kom fra på den
gamle side. De uploades til Shopify Files under præcis de navne, så de dukker op af sig selv.

Shopify ignorerer mappen `content/` og denne README – de er kun til arkiv.
