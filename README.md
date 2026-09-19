# Lenar Sabirov — Product Manager

A bilingual personal portfolio featuring payment product experience and independent AI and automation projects.

**Website:** https://lafootballer.github.io/

## Development

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

The English and Russian copy lives in `src/content.js`. Project illustrations are in `public/images` and are presented as concept illustrations.

## Build and publish

```sh
npm run build
npm run test:sites
```

GitHub Actions builds and publishes `dist/client` to GitHub Pages on each push to `main`. Deployment can also be started manually from the Actions tab.

The project uses React, Vite, locally bundled Inter fonts and Phosphor icons. It requires no API keys or external services at runtime.
