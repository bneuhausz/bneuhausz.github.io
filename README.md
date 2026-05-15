# bneuhausz.github.io

Personal blog built with [Astro](https://astro.build/), with Angular islands for interactive UI where needed.

## Setup

Run `npm install` to install the application dependencies.

## Development

Run `npm start` for a dev server. Navigate to `http://localhost:4321/`. The application automatically reloads if you change source files.

## Build

Run `npm run build` to generate the static site in `dist/`.

Run `npm run preview` to preview the production output locally.

## Test

Run `npm run test` to run unit tests with [Vitest](https://vitest.dev).

## Content

- Blog posts are stored in `src/content/*.md`.
- Front matter schema is validated in `src/content/config.ts`.
- Blog routes are generated as `/blog/{slug}` from the `slug` front matter field.
