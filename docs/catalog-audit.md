# Framework documentation audit — 2026-11-01

The catalog covers all 19 distinct framework dependencies found in the ten Unity game manifests in this workspace. Game-owned packages are excluded. This audit did not change the Unity games or framework package repositories.

## Evidence

- Compared all ten `Packages/manifest.json` files with the framework catalog.
- Inspected the 34 catalog source repositories and six constructor starters.
- Compared names and versions of all 28 installable Unity packages with their root `package.json` files.
- Checked named runtime assembly references against the catalog dependency closure. This does not resolve GUID references, compile C#, or test platform SDKs.
- Reviewed NetSession, shell/account configuration, fixed-camera and overhead-camera contracts against source.
- Five schemas and the Character View template are not installable UPM packages.

## Corrections

- Replaced the obsolete Arena 0.1/server-network/XR example with the host-authoritative `3d-unity-net` stack used by current projects.
- Marked unverified game attributions as generic capability examples; a framework capability does not prove a current game uses it.
- Distinguished camera-only packages from complete camera-and-controls constructors.
- Added dependency-complete Character View and shell manifests. Schemas stay out of UPM dependencies.
- Corrected embedded-package contribution instructions in generated `packages.md` to match the guide and starter repositories.
- Documented configurable account projects, published tags/full commit revisions, and optional scene/assets/audio/XR capabilities.
- Removed concrete game-package identifiers from public site content and added a build-time guard.

## Workspace revisions

| Unity project | Framework packages | Project revision inspected |
| --- | ---: | --- |
| arena.temnorid.com | 15 | `33aea560449ae66e93405c779cf9d1d18ad35df8` |
| caravan-guard.temnorid.com | 12 | `45011ac8cc8b0b1c2ed75e59d9fb91fd52ca08cb` |
| conquest.temnorid.com | 16 | `70b3c64325259b8dafa548475f6b16c121e37545` |
| craft.temnorid.com | 13 | `3ffd7228ccc666dc51e7bd86de40e9239b314307` |
| detective.temnorid.com | 13 | `fc21a74519a1572a29747e2fca24d94fe11eaa60` |
| dungeons.temnorid.com | 16 | `a7b49924953828b5b4c134f768af2d0f647f4ede` |
| escape.temnorid.com | 13 | `f3b0a046582c85afd92343310ccd9c99a810f76a` |
| hippodrome.temnorid.com | 9 | `5c48be7906717df1eb8de31e08c8dcb7912ac6b5` |
| legends.temnorid.com | 12 | `ddc2fefb1ed88b29bd603ac29da36457e7830a78` |
| master.temnorid.com | 12 | `70db7e30d84271b8560a86234e3193d663e10bd6` |

## Framework source revisions

Versions below are package metadata, not a claim that matching Git tags exist. Pin actual revisions when releasing.

| Repository | Catalog version | Source revision inspected |
| --- | --- | --- |
| 3d-scene-schema | 1.1.0 | `2c44ba6e67a71abe89680d5a38e3abfaf36f7db7` |
| 3d-asset-schema | 1.0.0 | `7d66338ec131c72a3c411319e1d0acb647b7a782` |
| 3d-network-schema | 1.0.0 | `9e2aa301ef81e837f8268616e757b592bbd400b3` |
| 3d-save-schema | 0.1.0 | `1f6b8cbdbe80bd99e425debcba37056e1265a7db` |
| 3d-inventory-schema | 0.1.0 | `28d4cd52e0bb89c17cb5580942373891b4b73b0b` |
| 3d-unity-core | 0.1.0 | `d4d8f944759ae32d7ee2a3111aa1904c3f53a06a` |
| 3d-unity-scene | 0.1.0 | `e805fa6189e5313be26e0390bc07849f05dd709e` |
| 3d-unity-input | 0.1.0 | `b380862568245c3389881c9af0105b0fc6207734` |
| 3d-unity-character | 0.1.0 | `d7a3f6bd49e72549b6a4457aca9d52bfbff01c6b` |
| 3d-unity-assets | 0.1.0 | `bfd1d60bf25252a4e24c1378e19d89c1909e0091` |
| 3d-unity-audio | 0.1.0 | `9863267c3fbb3de0a323478debdca015f6a8f32c` |
| 3d-unity-ui | 0.1.1 | `cf928ffbc0efe1a61f4ca14915f7b9e21c65243e` |
| 3d-unity-save | 0.1.1 | `9f3636331fa6cbe6e41e2a9ad512ed6e19922f98` |
| 3d-unity-synth | 0.1.0 | `b8dbb92bbeeba4957fc2ef206ee234c2ec73edd4` |
| 3d-unity-graybox | 0.1.1 | `e6f040a6fc13ac4a80d80adfe21787e076335b6c` |
| 3d-unity-shell | 0.2.2 | `a16c7e69e25fac03c153bc9566f50ec2951744b2` |
| 3d-unity-account | 0.2.0 | `67e38b98fa10eca3ef7bf038290be86e55a1b9de` |
| 3d-unity-update | 0.1.0 | `bfe4d27e4e8efc131810b962c09c53fe3b3993b0` |
| 3d-unity-net | 0.1.0 | `c7d68f77aa6af368b41df3b36c0b38f8df9aefb1` |
| 3d-unity-interaction | 0.1.0 | `7ea30b03f17b021da1d2e6c54478d147fb51aa14` |
| 3d-unity-spatial | 0.1.0 | `b0a22daed0832bca86c1e0bf67ffb1a9074acd39` |
| 3d-unity-xr | 0.1.0 | `f4c835f1197f5c13fafcdf5d39d6d2d4b1901517` |
| 3d-unity-firebase | 0.1.0 | `6181c068d654cbb83c794bdca5d762784ad0254e` |
| 3d-unity-network | 0.1.0 | `ea73d063158c4a1952cb7243bd0cf564cffe42d0` |
| 3d-unity-combat | 0.2.0 | `96fb3411c95f3bb7e6aa3bde9278be6634f677c8` |
| 3d-unity-feedback | 0.1.0 | `d3251e2666aefc97b1fb294eede2762c93ffd4fd` |
| 3d-unity-ai | 0.2.0 | `959651777450d350c166ad78bab2c56412e0711f` |
| 3d-unity-inventory | 0.1.0 | `94ed39d9964d17fa6066c7d853d7ae5a9edad9e4` |
| 3d-constructor-character-view-camera | 0.1.0 | `dbbd9e72e5aefb01b53019c91c7cfe1f2ee3facb` |
| 3d-constructor-character-view-controls | 0.1.0 | `51ca9abf707f796748c684b83336e1be9bcb4d8d` |
| 3d-constructor-vr-controls | 0.1.0 | `6c8c113d90025a5c7ce31ff3bf0625c51e1542a9` |
| 3d-constructor-character-view-template | 0.1.0 | `cf52b7013287f1c422ffe83d145e9c1b01fbd380` |
| 3d-unity-fixed-camera | 0.1.0 | `57eb7b3fd33f3d8944a4da7db77fbe18033a3028` |
| 3d-unity-topdown-camera | 0.1.0 | `8cbf62d12da6ed339dccc9d11c21d65dfb48391d` |

## Repeating the audit

Run `npm run validate`. With the game workspace available, run `node tools/catalog/validate-catalog.mjs --workspace ..`. Add `--sources <directory>` containing one checked-out repository per package slug to compare versions and named assembly references.

`npm run build` validates the catalog, regenerates the package reference, prerenders 49 routes and regenerates SEO files. Browser evidence is a website check, not a Unity compilation or multiplayer playtest. Catalog data remains a maintained snapshot; rerun source checks after package changes.

## Website validation

- Production build passed and prerendered all 49 routes. The existing 800 kB initial-bundle warning remains (about 1.02 MB raw); the build error limit is unchanged.
- Headless Chrome passed 189 checks: 320/390/768/1440/1728 layouts, all 49 hydrated routes, all 49 prerendered SEO responses, images, search and URL filters, empty/reset states, keyboard documentation navigation, anchors, clipboard success/failure, both languages, both themes and reduced motion. No runtime exceptions were observed.
- Additional checks confirmed a semantic mobile installation table (34 rows, row headers and data cells), seven shell manifest dependencies, contained code scrolling, and no viewport overflow with 200% text at 320/390/768/1440.
- Matching before/after screenshots were reviewed at 390 and 1440; additional 1728 captures and interaction screenshots were inspected.
- Better Design comprehension checks passed for package discovery, the installation code panel and mobile navigation. Its first combined navigation/action check treated documentation destinations as competing task actions; the final review separates the collapsed navigation from the code panel's copy action.
- Better Design measured all five changed page templates at 390/1440/1728 and the relevant focus, hover, selected, menu-open, manifest-open and mobile-table states. Final measured reports contain no critical or serious findings. Remaining moderate warnings concern retained spacing tokens, inferred density and an existing small repository link.
- A separate source review confirmed the documentation corrections and found no remaining serious source-level issues.

Browser screenshots, raw DOM captures and machine-readable review results are retained in the local framework-site review directory, outside the repository.
