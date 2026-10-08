# IT Kamianets 3D Engine

**IT Kamianets 3D Engine** is a framework ecosystem for building reusable 3D applications and games.

Website: `3d.itkamianets.com`

The project continues the `3d-*` repository architecture and provides a public entry point for the framework, its packages, constructors, documentation, and generated game projects.

## Concept

The ecosystem is divided into three layers:

1. **Core packages**
   Reusable `3d-*` packages that provide shared engine functionality such as scene handling, assets, interaction, XR, spatial data, and engine-independent scene structures.

2. **Constructors**
   Higher-level packages built on top of the core framework. Each constructor provides a starting architecture for a specific type of 3D game or experience.

3. **Game-specific packages**
   Packages generated or created from constructors for a particular game. These contain the rules, content, assets, configuration, and functionality unique to that project.

The goal is to avoid rebuilding the same systems for every new game.

```text
3d-* core packages
        ↓
3d-constructor-* packages
        ↓
game-specific packages
        ↓
final game
```

## Website

The website is primarily a landing page and documentation/catalog interface for the framework.

It is a fully static, prerendered Angular site with no backend and no runtime API calls. Ukrainian is the default language and English is available through the language switch. All page text, including the package, constructor, and documentation content, is translated.

### Landing Page

Introduces IT Kamianets 3D Engine and explains:

- what the framework is
- how the package architecture works
- how constructors work
- how a constructor becomes a game
- how developers can start using the framework
- featured packages
- featured constructors
- example games and projects

### Packages Page

Catalog of reusable framework packages.

Packages should be grouped by areas such as:

- Core
- Scene
- Assets
- Interaction
- XR
- Spatial
- Engine integrations
- Utilities

Each package links to its dedicated package page.

### Package Page

Documentation page for an individual package.

It should include:

- package name
- short description
- purpose
- repository link
- dependencies
- installation
- usage
- API / main features
- examples
- roadmap
- related packages

### Constructors Page

Catalog of available game constructors.

Each constructor represents a reusable starting point for a particular camera/gameplay style and can be used to generate a new game project.

### Constructor Page

Documentation and showcase page for a specific constructor.

It should include:

- constructor name
- description
- suitable game types
- example games
- included framework packages
- generated package structure
- configurable features
- setup guide
- screenshots / demo
- roadmap
- repository link
- create-project action

## Constructors

### 🎮 Character View

**1st + 3rd Person**

For games where the player directly controls a character from first-person or third-person perspective.

Examples:

- GTA V
- Cyberpunk 2077
- Elden Ring

### 🔝 Top-Down

For games viewed primarily from above, with direct player movement and action-focused gameplay.

Examples:

- Hades
- Vampire Survivors
- Hotline Miami

### 💎 Isometric

For games using an angled isometric-style camera, commonly used for RPGs, strategy games, and action RPGs.

Examples:

- Baldur's Gate 3
- Diablo IV
- Path of Exile 2

### ↔️ Side View

For games viewed from the side, including platformers, metroidvanias, action games, and sandbox games.

Examples:

- Hollow Knight
- Dead Cells
- Terraria

### 🎥 Fixed Camera

For games where camera positions are predefined or controlled by the scene rather than directly by the player.

Examples:

- Resident Evil
- INSIDE
- Little Nightmares

### 🌍 God / Free Camera

For games where the user controls the world from a free, strategic, or god-like camera.

Examples:

- Civilization
- Cities: Skylines
- Total War

## Repository Architecture

Example ecosystem:

```text
3d-scene-schema
3d-unity-core
3d-unity-scene
3d-unity-assets
3d-unity-interaction
3d-unity-xr
3d-unity-spatial

3d-constructor-character
3d-constructor-top-down
3d-constructor-isometric
3d-constructor-side-view
3d-constructor-fixed-camera
3d-constructor-god-camera

game-temnorid-core
game-temnorid-world
game-temnorid-units
game-temnorid-ui
```

The exact package split can evolve as constructors are implemented.

## Principles

- Keep core packages reusable and product-independent.
- Keep constructors focused on reusable gameplay architecture.
- Keep game-specific logic outside the framework.
- Prefer shared scene and asset structures between engines.
- Allow constructors to compose existing packages instead of duplicating them.
- Make generated projects easy to understand, modify, and extend.
- Keep packages small enough to reuse but large enough to have a clear responsibility.

## Initial Roadmap

### Phase 1: Website

- Landing page
- Packages catalog
- Package detail page
- Constructors catalog
- Constructor detail page
- Documentation structure
- GitHub repository links

### Phase 2: Framework Documentation

- Document existing `3d-*` packages
- Package dependency visualization
- Installation guides
- Architecture documentation
- Examples

### Phase 3: Constructors

- Character View constructor
- Top-Down constructor
- Isometric constructor
- Side View constructor
- Fixed Camera constructor
- God / Free Camera constructor

### Phase 4: Game Generation

- Define generated project structure
- Constructor configuration
- Game package generation
- Starter assets
- Example projects
- CLI / agent-assisted project creation

### Phase 5: Ecosystem

- Community packages
- Constructor templates
- Showcase games
- Package versioning
- Compatibility information
- Additional engine integrations

## Development

```bash
npm install
npm start        # dev server
npm run build    # production build, prerender, and sitemap.xml/robots.txt generation
```

The built site is written to `dist/app/browser`; the production domain is set in `CNAME`.

### Editing content

- Packages: `src/data/catalog/packages.json`
- Constructors: `src/data/catalog/constructors.json`
- Company name, SEO defaults, and per-page SEO: `src/data/company/company.json`
- Documentation pages: `src/data/docs/docs.json`
- Translations: `src/i18n/ua.json` maps each English source string to its Ukrainian text (English needs no entry). Every string shown from package, constructor, or docs data must have an entry. Strings are bundled into the app so prerendered pages are already Ukrainian

Routes, prerendering, and the sitemap are generated from the catalog JSON, so adding an entry creates its page automatically. Add matching `pageSeo` entries in `company.json` for its title and description.

Package status is shown on each page; package content is taken from the `IT-Kamianets/3d-*` repository READMEs and `package.json` files. Constructors are marked **Planned** because their repositories do not exist yet.
