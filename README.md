# IT Kamianets 3D Engine

IT Kamianets 3D Engine is a set of reusable Unity packages for building 3D games and apps. You'll also see it called ITKP 3D Engine or just ITKP 3D. Same thing.

Website: `3d.itkamianets.com`

This repository is the website. The packages live in their own `3d-*` repositories in the [IT-Kamianets GitHub organization](https://github.com/IT-Kamianets).

## Why it exists

Every new game ends up rebuilding the same things: scene loading, input, a character controller, saves, menus, a camera that fits the genre. We'd rather write those once, keep them in small packages, and spend the time on what makes each game different.

## How it fits together

Work flows from generic to specific:

```text
3d-*-schema          JSON formats shared between engines, no runtime
3d-unity-*           Unity packages: core, game kit, specific integrations
3d-constructor-*     a starting point for one camera and gameplay style
game packages        rules, content and assets of one game
        ↓
the game
```

A constructor is where a new game starts. You clone its starter repository, pull in the packages it lists, and add your own game packages on top. Game rules and content never go back into the framework. If something turns out to be useful for a second game, it moves into a `3d-*` package instead.

## Packages

The catalog has 35 entries: five JSON schemas, 29 Unity (UPM) packages and one Unity template project. The site groups them the same way the catalog does.

Schemas (5): `3d-scene-schema`, `3d-asset-schema`, `3d-network-schema`, `3d-save-schema`, `3d-inventory-schema`. Plain JSON formats with no engine code, so a scene or a save file isn't tied to Unity.

Core (6): `3d-unity-core`, `3d-unity-scene`, `3d-unity-input`, `3d-unity-character`, `3d-unity-assets`, `3d-unity-audio`. What nearly every 3D game needs.

Game kit (8): `3d-unity-ui`, `3d-unity-save`, `3d-unity-synth`, `3d-unity-graybox`, `3d-unity-shell`, `3d-unity-account`, `3d-unity-update`, `3d-unity-net`. The pieces around the game itself: menus, saves, accounts, updates, networking, prototyping.

Specific (10): `3d-unity-interaction`, `3d-unity-spatial`, `3d-unity-xr`, `3d-unity-firebase`, `3d-unity-assetra`, `3d-unity-network`, `3d-unity-combat`, `3d-unity-feedback`, `3d-unity-ai`, `3d-unity-inventory`. Devices, platforms, services and gameplay systems that only some games use.

Constructor (6): `3d-constructor-character-view-camera`, `3d-constructor-character-view-controls`, `3d-constructor-vr-controls`, `3d-constructor-character-view-template`, `3d-unity-fixed-camera`, `3d-unity-topdown-camera`. The parts that belong to one constructor.

## Constructors

There are six, one per camera style. The game names are only there to show the style; none of them are built with this engine.

- Character View: first or third person, the player controls a character directly (think GTA V, Elden Ring).
- Top-Down: seen from above, direct movement, action first (Hades, Vampire Survivors).
- Isometric: an angled camera for RPGs and strategy (Baldur's Gate 3, Diablo IV).
- Side View: platformers, metroidvanias, sandbox games (Hollow Knight, Terraria).
- Fixed Camera: the scene decides where the camera is (Resident Evil, INSIDE).
- God / Free Camera: the player looks after a world from above (Civilization, Cities: Skylines).

Where things stand: Character View has its camera and controls. The fixed and top-down cameras exist as separate packages but don't come with full player controls yet. The other styles have starter projects and still need their implementation.

## The website

It's a prerendered Angular site. Ukrainian is the default language, English is one click away, and every piece of text is translated, including package, constructor and docs content.

- Home: what the engine is, how packages and constructors work, and how to start.
- Packages and one page per package: purpose, dependencies, installation, usage, API, current state, examples, roadmap and related packages.
- Constructors and one page per constructor: suitable game types, the packages it includes, the starter repository and its clone command, setup steps and roadmap.
- Applications and one page per application: the games built with the engine, such as Math Runner, KP Paintball Arena and the Temnorid games, each with the constructor and packages it uses. The original plan is in [docs/applications-page.md](docs/applications-page.md).
- Docs: overview, installation, architecture (with a package dependency graph) and examples.
- Development: our public backlog, the roadmaps, packages and weekly plan that visitors can vote on and send requests to. It reads the shared Web Art Work backlog from Firestore in the browser and shows only the Unity category. This is the one page that talks to a backend; everything else is static.

## Principles

- Core packages stay reusable and know nothing about any one product.
- Constructors hold reusable gameplay architecture, not a particular game.
- Game logic stays in the game.
- Scene and asset formats are shared between engines where we can manage it.
- Constructors compose existing packages rather than copying them.
- A package should be small enough to reuse and big enough to have one clear job.

## Roadmap

Done so far: the website (landing, package and constructor catalogs and pages, docs, GitHub links) and documentation for the existing packages, including install guides, architecture, the dependency graph and examples.

Still ahead:

1. Constructors: finish all six camera styles.
2. Game generation: a defined project structure, constructor configuration, starter assets, example projects, and creating a project from the command line or with an AI agent.
3. Ecosystem: community packages, showcase games, versioning and compatibility information, other engines.

## Development

```bash
npm install
npm start          # dev server
npm run validate   # check the catalog
npm run catalog    # regenerate src/assets/packages.md only
npm run build      # validate, packages.md, production build, prerender, sitemap.xml and robots.txt
```

The built site ends up in `dist/app/browser`. The production domain is in `CNAME`.

### Recommended Unity version

We recommend Unity 6000.6.8f1. It's a suggestion, not a requirement. If it changes, update it in three places: `src/data/docs/docs.json` (Installation, Requirements, and its Ukrainian text in `src/i18n/ua.json`), the "Using packages" text in `tools/catalog/generate-packages-md.mjs`, and `src/assets/llms.txt`. Package entries keep the minimum version line (`Unity 6000.6`).

### Editing content

- Packages: `src/data/catalog/packages.json`
- Constructors: `src/data/catalog/constructors.json`
- Applications: `src/data/catalog/applications.json`
- Site name, SEO defaults and per-page SEO: `src/data/company/company.json`
- Docs pages: `src/data/docs/docs.json`
- Translations: `src/i18n/ua.json`, keyed by the English text. English needs no entries. Every string that comes from package, constructor or docs data needs one. The dictionary is bundled, so prerendered pages are already in Ukrainian.

Routes, prerendering and the sitemap all come from the catalog JSON, so a new entry gets its page automatically. Add a matching `pageSeo` entry in `company.json` for its title and description; SEO text is Ukrainian only.

Package content comes from the `IT-Kamianets/3d-*` repository READMEs and `package.json` files. The site doesn't show a ready or planned status for packages or constructors. Each constructor has `repo`, its starter repository, and `parts`, its own packages such as camera and controls. The setup steps on its page change depending on whether `parts` is empty.

### Files for developers and AI agents

- `src/assets/packages.md`, served at `/packages.md`: every package in one Markdown file, with purpose, usage, contents, dependencies, install order and git URL, plus the constructors. It's generated from the catalog on every build by `tools/catalog/generate-packages-md.mjs`, so edit the JSON, not this file.
- `src/assets/llms.txt`, served at `/llms.txt`: the short entry point AI tools look for. It's written by hand, so update it when docs pages are added or renamed.

### Catalog checks

The site documents framework packages and constructor starters only. Game packages stay out of the catalog.

- `npm run validate` checks package IDs, the dependency graph, constructor references and install snippets in the docs.
- `node tools/catalog/validate-catalog.mjs --workspace ..` compares the catalog with the Unity manifests in the workspace.
- Add `--sources <directory>` to compare versions and assembly dependencies with checked-out package repositories.

[docs/catalog-audit.md](docs/catalog-audit.md) explains the source audit and what it can't catch.

## License

MIT
