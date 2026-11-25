# ITKP 3D Engine: Applications page

A request for this site, written while building the sister site [ai.itkamianets.com](https://ai.itkamianets.com) (November 2026). Not started yet.

## Why

The AI framework site has an **Agents** page: a list of the products built on the framework, each with its own page that links back to the framework packages and constructor it uses, and the apps that drive it. This site has the packages and constructors, but no place that lists what is built with them. Games and apps are only named in passing, in the docs examples and in `llms.txt`.

An **Applications** page closes the loop the same way: engine, then constructors, then the games and apps made from them.

## What it should be

- Route `/applications`, in the top bar and the footer next to Packages, Constructors, Docs and Development.
- A detail page per application, `/applications/<slug>`, prerendered like packages and constructors.
- Data in `src/data/catalog/applications.json`, loaded in `src/app/feature/catalog/catalog.data.ts`, checked by `tools/catalog/validate-catalog.mjs` (every package and constructor it names exists) and listed in `tools/seo/generate-static-seo.mjs` and in `packages.md`.
- Each entry: name, icon, one-line tagline, description, status (planned, in progress, released), the constructor it started from, the engine packages it uses, platforms (Windows, Android, Quest, web), a link to the game's own site or store page, and its own packages by name only.
- A short "Add your application" note: open a pull request with an entry in `applications.json`.
- Ukrainian SEO title and description for every new route in `company.json` (SEO is Ukrainian only; no em dash anywhere).

## Rules to keep

- Game package identifiers stay off the framework site: the validator already rejects them in `src`. An application page lists its own packages as plain text without the game-specific package ids, or the validator rule is narrowed to allow names on this page only. Decide which before building it.
- An application page describes what the game is and what it is built from. Game rules and content stay in the game's repository.

## Reference

Built the same way on ai.itkamianets.com: `src/data/catalog/agents.json`, `src/app/pages/agents/`, `src/app/pages/agent-detail/`.
