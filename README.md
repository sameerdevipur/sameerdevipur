# sameerdevipur.com

Personal website and research notebook for Sameer Devipur. The site is built by
GitHub Pages with Jekyll and uses shared includes for metadata, navigation, the
footer, and analytics consent.

## Local development

Prerequisites:

- Ruby and Bundler
- Node.js 22 or newer

Install dependencies:

```sh
bundle install
npm install
npx playwright install chromium
```

Start the local site:

```sh
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000`.

## Repository structure

- `_includes/`: shared head metadata, navigation, footer, and consent UI.
- `assets/css/style.css`: tokens, base rules, components, and responsive styles.
- `assets/js/theme-init.js`: guarded, synchronous theme initialization.
- `assets/js/site.js`: theme toggle, disclosures, and consent-gated analytics.
- `blog/` and `countries/`: article and travel pages.
- `tests/`: browser regression tests.

Each page declares front matter for its title, description, navigation state, root
path, social type, and optional `noindex` behavior. Use `page.root` for local links
so the site works on both the custom domain and a GitHub Pages project path.

## Quality checks

Run all checks:

```sh
npm run validate
```

The validation suite checks formatting, JavaScript, CSS, generated HTML, local
links, accessibility-related interaction behavior, responsive overflow, and the
consent boundary around Google Analytics.

Format files:

```sh
npm run format
```

## Analytics and privacy

Google Analytics is opt-in. The site does not request `gtag.js` until a visitor
allows analytics, defaults Consent Mode storage to denied, respects Global Privacy
Control, and exposes preference withdrawal on `privacy.html`.

The GA4 property itself should use the shortest practical event-data retention
period and should keep advertising personalization disabled. These account-level
settings cannot be enforced from this repository.

## Deployment and security

GitHub Pages builds from the default branch. The site avoids inline executable
JavaScript and only uses build-controlled Liquid JSON-LD blocks. GitHub Pages does
not support arbitrary HTTP response headers, so a response-header Content Security
Policy requires placing a configurable CDN or proxy in front of the site.

The validation workflow runs for every pull request and every push to `main`.
