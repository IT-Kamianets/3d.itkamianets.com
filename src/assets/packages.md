# IT Kamianets 3D Engine: packages

Every public package of the IT Kamianets 3D Engine: what it does, what it depends on, and how to install it. Use this file to choose packages for a new constructor or game.

- Website: https://3d.itkamianets.com
- Source: https://github.com/IT-Kamianets
- This file: https://3d.itkamianets.com/packages.md (generated from the website catalog on every build)

34 packages: 5 schemas, 6 core, 8 game kit, 9 specific, 6 constructor. 6 constructors.

## How the engine is built

```text
schemas            3d-*-schema                JSON, no engine
Unity packages     3d-unity-*                 core systems, game kit, specific ones
constructors       3d-constructor-<style>-*   one per camera style
game packages      <game>-*                   e.g. temnorid-arena-core
```

Each layer uses only the layers above it in this list. Game rules never go into engine or constructor packages.

## Using packages

**Start a game from a starter repository.** Each constructor has one (`https://github.com/IT-Kamianets/3d-constructor-<style>`, listed under Constructors). Clone it under your game name; its AGENTS.md walks you or your AI agent through creating the Unity project, the engine packages to add, and what to build first.

**Add a package to an existing Unity project.** In Unity, `Window › Package Manager › + › Add package from git URL`, then paste the package's git URL. Add its dependencies first: each package below lists its install order. Pin a version with a tag, e.g. `https://github.com/IT-Kamianets/3d-unity-core.git#v0.1.0`.

**Name your own packages** `<game>-<part>`, with the Unity package id `com.itkamianets.<game>-<part>`. A new game usually starts with the interface (`<game>-menus`, `<game>-hud`) and the gameplay (`<game>-core`, `<game>-maps`). A package that more than one game could use belongs in the engine instead.

**Change an engine package through a pull request**, never by copying it into a game. Clone it inside your game's repository (the starter's `.gitignore` ignores `/3d-*/`), work on a branch or your fork, point `Packages/manifest.json` at `file:../<package>` while you work, and open a pull request to the package's `master` branch. After the merge, switch back to the git URL pinned to the new tag. Full flow: https://3d.itkamianets.com/docs/start-a-game

## Packages at a glance

### Schemas

JSON formats with no engine. Not Unity packages: read them, validate against them, or use the Unity package that implements them.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-scene-schema`](#3d-scene-schema) | Where things are: a scene as plain JSON, with objects, transforms, hierarchy, tags and asset ids. | - |
| [`3d-asset-schema`](#3d-asset-schema) | What things are: models, materials, textures and sounds described as JSON asset libraries. | - |
| [`3d-network-schema`](#3d-network-schema) | What happens between players: multiplayer sessions, messages, results and replays as JSON. | - |
| [`3d-save-schema`](#3d-save-schema) | What a save looks like on disk: the envelope around one game save slot, as JSON. | - |
| [`3d-inventory-schema`](#3d-inventory-schema) | What a container holds: a backpack, chest or warehouse of stackable items, as JSON. | - |

### Core

Unity systems every 3D game needs.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-unity-core`](#3d-unity-core) | Shared base for the engine's Unity packages: logging, player settings, typed events and services. | - |
| [`3d-unity-scene`](#3d-unity-scene) | Builds live Unity scenes from 3d-scene-schema JSON and saves them back to the same format. | `3d-unity-core`, `3d-scene-schema` |
| [`3d-unity-input`](#3d-unity-input) | One set of input actions for keyboard and mouse, gamepad, touch and VR controllers. | `3d-unity-core` |
| [`3d-unity-character`](#3d-unity-character) | A reusable character motor: walking, sprinting, jumping, crouching, slopes and steps, for any camera style. | `3d-unity-core` |
| [`3d-unity-assets`](#3d-unity-assets) | Loads 3d-asset-schema assets by id in Unity: models, materials, textures and sounds, with placeholders. | `3d-unity-core`, `3d-unity-scene`, `3d-asset-schema` |
| [`3d-unity-audio`](#3d-unity-audio) | Positional 3D sound, sound events with variations, footsteps by surface, volume groups and music. | `3d-unity-core`, `3d-unity-scene`, `3d-unity-assets`, `3d-unity-character` |

### Game kit

Building blocks for shipping a game: screens, saves, generated sounds, scene-builder helpers, and the shared start screens, sign-in, self-update and online sessions.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-unity-ui`](#3d-unity-ui) | Small helpers for building a game's screens in code with plain uGUI: panels, labels, bars, buttons and an event system wired to the engine's input. | `3d-unity-core`, `3d-unity-input` |
| [`3d-unity-save`](#3d-unity-save) | Versioned local JSON save files: one slot per file, written safely, with a clear result for a missing, damaged or newer save. | - |
| [`3d-unity-synth`](#3d-unity-synth) | Procedural sound: short clips built in code from waves and noise, and a sound board with volumes and a looping ambience, so a game needs no audio files. | - |
| [`3d-unity-graybox`](#3d-unity-graybox) | Build a game's first playable from Unity primitives: stable asset ids on everything that will get a real model, and Editor helpers for primitives, plain materials and world text. | - |
| [`3d-unity-shell`](#3d-unity-shell) | The screens every Temnorid game shares: splash, landing, sign-in, onboarding, lobby and in-game top and bottom bars. | `3d-unity-core`, `3d-unity-input`, `3d-unity-ui`, `3d-unity-account`, `3d-unity-update`, `3d-unity-net` |
| [`3d-unity-account`](#3d-unity-account) | The player's Lords account in every game: sign in as a guest or with Google over Firebase's REST API, with no Firebase SDK. | `3d-unity-core` |
| [`3d-unity-update`](#3d-unity-update) | Keeps a game on its newest GitHub release: checks for a new version and installs it silently on Windows. | - |
| [`3d-unity-net`](#3d-unity-net) | A small multiplayer layer over Netcode for GameObjects for games that build their scenes in code: host or join by address or online code. | - |

### Specific

Editing tools, devices, platforms and services that only some games need.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-unity-interaction`](#3d-unity-interaction) | Scene editing: select, move, rotate, scale, duplicate and delete objects, with snapping and undo. | `3d-unity-core`, `3d-unity-scene`, `3d-unity-input` |
| [`3d-unity-spatial`](#3d-unity-spatial) | Turns a Meta Quest room scan into a scene, measures scanned rooms and builds them as solid geometry. | `3d-unity-core`, `3d-unity-scene` |
| [`3d-unity-xr`](#3d-unity-xr) | VR for a character: a headset rig on a character motor, comfort settings, a VR/flat mode switch and world-space status. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character` |
| [`3d-unity-firebase`](#3d-unity-firebase) | Firebase over its REST API: sign-in, player profiles, saved progress and stored scenes. | `3d-unity-core`, `3d-unity-scene` |
| [`3d-unity-network`](#3d-unity-network) | Real-time multiplayer on Netcode: sessions, server-authoritative characters, schema messages. | `3d-unity-core`, `3d-unity-character`, `3d-network-schema` |
| [`3d-unity-combat`](#3d-unity-combat) | Generic combat: health with damage and death events, teams, projectiles, and melee cone and area attacks. | - |
| [`3d-unity-feedback`](#3d-unity-feedback) | Cheap visual feedback for fights, made from primitives: pulses, rings, floor warnings and a health bar. | `3d-unity-combat` |
| [`3d-unity-ai`](#3d-unity-ai) | Generic bots: notice a target, chase it over a NavMesh, attack, give up and patrol. | - |
| [`3d-unity-inventory`](#3d-unity-inventory) | Item containers: stackable items by id, slot and stack limits, transfers, and portable inventory data. | - |

### Constructor

The parts of a constructor: its camera, its controls, and a starter project.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera) | First- and third-person camera that follows a character and owns where the player looks. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character` |
| [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls) | Turns player input into character commands: forward is where the camera looks, looking turns the character. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character`, `3d-constructor-character-view-camera` |
| [`3d-constructor-vr-controls`](#3d-constructor-vr-controls) | Turns XR controllers into character commands: walk where you look, turn with the stick, crouch for real. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character`, `3d-unity-xr` |
| [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) | Starter Unity project for first- and third-person games with a test level and a playable character. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character`, `3d-constructor-character-view-camera`, `3d-constructor-character-view-controls` |
| [`3d-unity-fixed-camera`](#3d-unity-fixed-camera) | Fixed cinematic camera shots for third-person games, chosen by the boxes the player walks through. | - |
| [`3d-unity-topdown-camera`](#3d-unity-topdown-camera) | Overhead camera for strategy and tower-defense games: pan, zoom and stay inside the map. | `3d-unity-core`, `3d-unity-input` |

## Constructors

A constructor is a ready start for one camera style: it adds a camera, controls and a starter project on top of the engine packages.

### Character View

For games where the player directly controls a character from first-person or third-person perspective.

| | |
|---|---|
| Camera | 1st + 3rd Person |
| Games like | GTA V, Cyberpunk 2077, Elden Ring |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-xr`](#3d-unity-xr) |
| Constructor packages | [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-vr-controls`](#3d-constructor-vr-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-character-view |
| Page | https://3d.itkamianets.com/constructors/character-view |

### Top-Down

For games viewed primarily from above, with direct player movement and action-focused gameplay.

| | |
|---|---|
| Camera | Viewed from above |
| Games like | Hades, Vampire Survivors, Hotline Miami |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio) |
| Constructor packages | [`3d-unity-topdown-camera`](#3d-unity-topdown-camera) |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-top-down |
| Page | https://3d.itkamianets.com/constructors/top-down |

### Isometric

For games using an angled isometric-style camera, commonly used for RPGs, strategy games, and action RPGs.

| | |
|---|---|
| Camera | Angled camera |
| Games like | Baldur's Gate 3, Diablo IV, Path of Exile 2 |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio) |
| Constructor packages | - |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-isometric |
| Page | https://3d.itkamianets.com/constructors/isometric |

### Side View

For games viewed from the side, including platformers, metroidvanias, action games, and sandbox games.

| | |
|---|---|
| Camera | Viewed from the side |
| Games like | Hollow Knight, Dead Cells, Terraria |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio) |
| Constructor packages | - |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-side-view |
| Page | https://3d.itkamianets.com/constructors/side-view |

### Fixed Camera

For games where camera positions are predefined or controlled by the scene rather than directly by the player.

| | |
|---|---|
| Camera | Scene-controlled camera |
| Games like | Resident Evil, INSIDE, Little Nightmares |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio) |
| Constructor packages | [`3d-unity-fixed-camera`](#3d-unity-fixed-camera) |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-fixed-view |
| Page | https://3d.itkamianets.com/constructors/fixed-view |

### God / Free Camera

For games where the user controls the world from a free, strategic, or god-like camera.

| | |
|---|---|
| Camera | Strategic, free camera |
| Games like | Civilization, Cities: Skylines, Total War |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-interaction`](#3d-unity-interaction) |
| Constructor packages | - |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-free-view |
| Page | https://3d.itkamianets.com/constructors/free-view |

## Schemas

JSON formats with no engine. Not Unity packages: read them, validate against them, or use the Unity package that implements them.

### 3d-scene-schema

Where things are: a scene as plain JSON, with objects, transforms, hierarchy, tags and asset ids.

| | |
|---|---|
| Kind | JSON Schema (2020-12) |
| Version | 1.1.0 |
| Depends on | nothing |
| Used by | [`3d-unity-scene`](#3d-unity-scene) |
| Repository | https://github.com/IT-Kamianets/3d-scene-schema |
| Page | https://3d.itkamianets.com/packages/3d-scene-schema |

**Purpose.** The source of truth for a 3D scene, independent of any engine. It describes both room scans and authored game levels, so the same document can feed Unity, other engines, web tools and AI. It carries no Unity or Unreal fields and no business context such as which building or product a scene belongs to.

**Usage.** A scene document holds a schemaVersion, a sceneId, an origin and a flat list of objects linked by parentId. Each SceneObject has a semantic type, a transform, an optional boundary or volume, an optional asset id and metadata tags that carry game roles such as spawn or team:a. Units are meters in a right-handed, Y-up system; 3d-unity-scene converts to and from Unity.

**Includes:**

- scene.schema.json: the root document with schemaVersion, sceneId, timestamps, units, coordinate system, origin, objects and metadata.
- scene-object.schema.json: an object with an id, name, semantic type, parentId, transform, boundary polygon, volume bounds, asset id and metadata.
- Scan types that mirror Meta Quest scene labels: ROOM, FLOOR, CEILING, WALL_FACE, INVISIBLE_WALL_FACE, DOOR_FRAME, WINDOW_FRAME and common furniture.
- Level types since 1.1.0: GROUP for containers, MARKER for points whose meaning is in tags, PROP for objects shown with an asset.
- transform.schema.json and common.schema.json: position, rotation, scale, Vector2, Vector3, Quaternion, Polygon2D, Bounds3D and Metadata.
- Examples that validate: an arena level with team spawns, an objective zone and crates, plus two room scans that share one coordinate frame.

**API:**

| Member | What it does |
|---|---|
| `scene.schema.json` | The root document: schemaVersion, sceneId, units, coordinateSystem, origin and objects are required. |
| `Scene.schemaVersion` | The schema version the document follows: 1.0.0 or 1.1.0. |
| `Scene.origin` | The scene's transform in a shared parent frame; identity when the scene stands alone. |
| `scene-object.schema.json` | One SceneObject: id, type and transform are required. |
| `SceneObject.type` | The SemanticLabel: a scan label such as WALL_FACE, or GROUP, MARKER or PROP for levels. |
| `SceneObject.parentId` | The id of the containing object, or null for a top-level object. |
| `SceneObject.boundary` | A Polygon2D of at least three points in the object's local X/Y plane, for planar surfaces. |
| `SceneObject.volume` | A Bounds3D box in local space, for furniture, props and trigger zones. |
| `SceneObject.asset` | The id of a 3d-asset-schema asset the object is shown with, such as props/crate-wood. |
| `SceneObject.metadata.tags` | Strings with the roles a game reads, such as spawn and team:a. |
| `transform.schema.json` | Position and rotation, plus an optional scale, in the parent's local space. |

**Example:**

```json
{
  "schemaVersion": "1.1.0",
  "sceneId": "example-arena",
  "units": "meters",
  "coordinateSystem": "right-handed-y-up",
  "origin": { "position": { "x": 0, "y": 0, "z": 0 }, "rotation": { "x": 0, "y": 0, "z": 0, "w": 1 } },
  "objects": [
    {
      "id": "spawn-a-1",
      "type": "MARKER",
      "parentId": "spawns",
      "transform": {
        "position": { "x": -8, "y": 0, "z": 0 },
        "rotation": { "x": 0, "y": -0.7071068, "z": 0, "w": 0.7071068 }
      },
      "metadata": { "tags": ["spawn", "team:a"] }
    },
    {
      "id": "crate-1",
      "type": "PROP",
      "asset": "props/crate-wood",
      "transform": { "position": { "x": 2, "y": 0, "z": 2 }, "rotation": { "x": 0, "y": 0.258819, "z": 0, "w": 0.9659258 } }
    }
  ]
}
```

**Install:**

Nothing to install: the repository holds JSON Schema (2020-12) files. Read schema/v1/ and examples/ at https://github.com/IT-Kamianets/3d-scene-schema and validate documents with any JSON Schema validator. In Unity, 3d-unity-scene reads and writes this format.

### 3d-asset-schema

What things are: models, materials, textures and sounds described as JSON asset libraries.

| | |
|---|---|
| Kind | JSON Schema (2020-12) |
| Version | 1.0.0 |
| Depends on | nothing |
| Used by | [`3d-unity-assets`](#3d-unity-assets) |
| Repository | https://github.com/IT-Kamianets/3d-asset-schema |
| Page | https://3d.itkamianets.com/packages/3d-asset-schema |

**Purpose.** A scene object names an asset by id; this schema says what that id resolves to. It describes files in standard formats (glTF/GLB, PNG/JPG, WAV/OGG/MP3) and a glTF-style material, but never says how an engine loads them. That decision belongs to engine packages such as 3d-unity-assets.

**Usage.** Write an asset library: a schemaVersion, a libraryId, units and a list of assets. Each Asset has a path-like id, a kind (model, material, texture or audio), a source file, and for models optional materials, bounds and a placeholder. Scenes keep only the id, and 3d-unity-assets loads the file or shows the placeholder at runtime.

**Includes:**

- asset-library.schema.json: the root document with schemaVersion, libraryId, units, assets and metadata.
- asset.schema.json: one asset with an id, name, kind, source, material, materials, bounds, placeholder and metadata.
- A metallic/roughness material like glTF's: base color, base color texture, metallic, roughness, emission and transparency.
- Placeholders: a box, sphere or capsule with a color, sized to the bounds, shown while loading or when a file is missing.
- Rules per kind: a material needs material, a texture or sound needs source, a model needs source or placeholder.
- An example library with real files: a 1 m crate (GLB), a wood texture (PNG), a footstep (WAV) and a barrel with only a placeholder.

**API:**

| Member | What it does |
|---|---|
| `asset-library.schema.json` | The root document: schemaVersion, libraryId, units and assets are required. |
| `Asset.id` | A lowercase, path-like AssetId such as props/crate-wood or sounds/footstep-stone-1. |
| `Asset.kind` | What the asset is: model, material, texture or audio. |
| `Asset.source` | The file: a uri relative to the library or an http(s) URL, and its format (glb, gltf, png, jpg, wav, ogg or mp3). |
| `Asset.material` | For a material: baseColor, baseColorTexture, metallic, roughness, emission and transparent. |
| `Asset.materials` | For a model: material asset ids that replace the model's own materials, in order. |
| `Asset.bounds` | For a model: the Bounds3D space it takes, used for placement and placeholders before it loads. |
| `Asset.placeholder` | A shape (box, sphere or capsule) and a color shown instead of the asset while it loads or fails. |
| `Asset.metadata.tags` | Free tags such as footstep and surface:stone that games and tools read. |
| `common.schema.json Color` | An sRGB color with r, g, b and an optional a, each from 0 to 1. |

**Example:**

```json
{
  "schemaVersion": "1.0.0",
  "libraryId": "example-props",
  "units": "meters",
  "assets": [
    {
      "id": "props/crate-wood",
      "kind": "model",
      "source": { "uri": "files/crate.glb", "format": "glb" },
      "materials": ["materials/wood"],
      "bounds": { "min": { "x": -0.5, "y": 0, "z": -0.5 }, "max": { "x": 0.5, "y": 1, "z": 0.5 } },
      "placeholder": { "shape": "box", "color": { "r": 0.55, "g": 0.36, "b": 0.2 } }
    },
    {
      "id": "materials/wood",
      "kind": "material",
      "material": { "baseColorTexture": "textures/wood", "metallic": 0, "roughness": 0.8 }
    },
    { "id": "textures/wood", "kind": "texture", "source": { "uri": "files/wood.png", "format": "png" } }
  ]
}
```

**Install:**

Nothing to install: the repository holds JSON Schema (2020-12) files. Read schema/v1/ and examples/ at https://github.com/IT-Kamianets/3d-asset-schema and validate documents with any JSON Schema validator. In Unity, 3d-unity-assets reads this format.

### 3d-network-schema

What happens between players: multiplayer sessions, messages, results and replays as JSON.

| | |
|---|---|
| Kind | JSON Schema (2020-12) |
| Version | 1.0.0 |
| Depends on | nothing |
| Used by | [`3d-unity-network`](#3d-unity-network) |
| Repository | https://github.com/IT-Kamianets/3d-network-schema |
| Page | https://3d.itkamianets.com/packages/3d-network-schema |

**Purpose.** The shared contract for multiplayer between the Unity game, a dedicated server in any language, web spectators, stats storage, bots and AI tools. It covers the messages that matter after the fact: joins, leaves, lifecycle changes, game events and results. The per-tick stream of positions and inputs is not part of it; that stays in the networking backend.

**Usage.** A session document lists the mode, the sceneId, the lifecycle state, teams and players. Every message has an envelope (messageId, sessionId, seq, tick, sentAt, from, type) and a payload typed by type. session.* types belong to the schema; game events use names namespaced by the game, such as temnorid-arena.round-ended. In Unity, SessionChannel in 3d-unity-network sends and records these messages.

**Includes:**

- session.schema.json: sessionId, mode, sceneId, state (lobby, starting, running, ended), maxPlayers, teams, players, timestamps and game settings.
- Players with a role (player, spectator or bot), a team and a connected flag.
- message.schema.json: session.join, session.joined, session.left, session.snapshot, session.state-changed and session.ended, plus game events.
- result.schema.json: when and why a session ended (completed, abandoned or cancelled), the winners, and team or player scores with game-defined stats.
- replay.schema.json: the session as it started, then every server message in seq order.
- Examples that validate: a short Temnorid Arena match replay with a disconnect, a reconnect and the result, and a client join request.

**API:**

| Member | What it does |
|---|---|
| `session.schema.json` | The session document: schemaVersion, sessionId, mode, state, players and createdAt are required. |
| `Session.state` | The lifecycle: lobby, starting, running or ended. |
| `Session.mode` | A game-namespaced name of the game and mode, such as temnorid-arena.competitive. |
| `Player` | playerId and connected are required; displayName, teamId and role (player, spectator or bot) are optional. |
| `message.schema.json` | One message: schemaVersion, messageId, sessionId, sentAt, from, type and payload are required. |
| `Message.type` | A session.* type defined by the schema, or a game event named <game>.<name>. |
| `Message.seq` | The server-set order within the session: starts at 1 with no gaps, absent on client messages. |
| `Message.from` | server, or the playerId of the sending client. |
| `Message.tick` | The server simulation tick the message belongs to, when the game runs on ticks. |
| `result.schema.json Result` | endedAt, reason, winners and scores; each Score has a teamId or a playerId, a score and optional stats. |
| `replay.schema.json` | A finished session: the starting session and its server messages ordered by seq. |

**Example:**

```json
{
  "schemaVersion": "1.0.0",
  "messageId": "m-2",
  "sessionId": "match-7f3a",
  "seq": 2,
  "tick": 2210,
  "sentAt": "2026-10-14T18:02:04Z",
  "from": "server",
  "type": "temnorid-arena.player-defeated",
  "payload": { "playerId": "p-oleh", "byPlayerId": "p-ira", "spell": "fireball" }
}
```

**Install:**

Nothing to install: the repository holds JSON Schema (2020-12) files. Read schema/v1/ and examples/ at https://github.com/IT-Kamianets/3d-network-schema and validate documents with any JSON Schema validator. In Unity, 3d-unity-network reads and writes this format.

### 3d-save-schema

What a save looks like on disk: the envelope around one game save slot, as JSON.

| | |
|---|---|
| Kind | JSON Schema (2020-12) |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-save-schema |
| Page | https://3d.itkamianets.com/packages/3d-save-schema |

**Purpose.** The shared shape of a game save, independent of any engine. It describes only the envelope: which game and slot the save belongs to, when it was written and which version of the game's own data it holds. The payload inside is owned and versioned by the game, so the schema says nothing about it and holds no game rules.

**Usage.** A save document has six fields: schemaVersion, gameId, slotId, savedAt, payloadVersion and payload. gameId is a lowercase id such as hippodrome, and slotId names the slot, such as default. Raise payloadVersion when the shape of the game's payload changes, so the game can migrate older saves. In Unity, SaveStore in 3d-unity-save writes this envelope to one file per slot and checks both versions when it loads.

**Includes:**

- save.schema.json: the envelope, with schemaVersion, gameId, slotId, savedAt, payloadVersion and payload, all required and no extra fields.
- gameId as a lowercase id of letters, digits and hyphens, slotId as any non-empty name, and savedAt as a date-time.
- payload as an opaque object that the game defines and versions with payloadVersion.
- One example that validates: a Temnorid Hippodrome save in the default slot with the best lap, the best total time and the race counts.

**API:**

| Member | What it does |
|---|---|
| `save.schema.json` | The envelope: schemaVersion, gameId, slotId, savedAt, payloadVersion and payload are required. |
| `Save.schemaVersion` | The version of the envelope: the constant 1. |
| `Save.gameId` | The stable id of the game, in lowercase letters, digits and hyphens, such as hippodrome. |
| `Save.slotId` | The name of the save slot, such as default; at least one character. |
| `Save.savedAt` | When the save was written, as a date-time string such as 2026-10-29T12:00:00Z. |
| `Save.payloadVersion` | The version of the game's own payload: an integer from 1. |
| `Save.payload` | The game's own data, an object that the schema does not describe. |

**Example:**

```json
{
  "schemaVersion": 1,
  "gameId": "hippodrome",
  "slotId": "default",
  "savedAt": "2026-10-29T12:00:00Z",
  "payloadVersion": 1,
  "payload": { "bestLapSeconds": 21.4, "bestTotalSeconds": 66.9, "wins": 2, "races": 5 }
}
```

**Install:**

Nothing to install: the repository holds a JSON Schema (2020-12) file. Read save.schema.json and examples/ at https://github.com/IT-Kamianets/3d-save-schema and validate documents with any JSON Schema validator. In Unity, 3d-unity-save reads and writes this format.

### 3d-inventory-schema

What a container holds: a backpack, chest or warehouse of stackable items, as JSON.

| | |
|---|---|
| Kind | JSON Schema (2020-12) |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-inventory-schema |
| Page | https://3d.itkamianets.com/packages/3d-inventory-schema |

**Purpose.** The shared form of an item container, independent of any engine: how many slots it has, how many items fit in one slot and which items it holds, by id and total quantity. The schema does not say what an item is: ids belong to the game, and it carries no item definitions, prices or weights.

**Usage.** A container document has schemaVersion, slots, stackLimit and items. Each item has an itemId, the game's own string such as wood, and a quantity, the total of that kind across all slots. The slot layout is not stored: it follows from slots and stackLimit. In Unity, ItemContainer in 3d-unity-inventory converts to and from this form with ToData and FromData, and a game that keeps inventories in a save file can put this data into the payload of a 3d-save-schema save.

**Includes:**

- inventory.schema.json: the container, with schemaVersion, slots, stackLimit and items, all required and no extra fields.
- slots and stackLimit as integers from 1: each slot holds one kind of item, up to the stack limit.
- items as a list of itemId and quantity, given as a total per kind rather than slot by slot.
- One example that validates: a backpack with 3 slots and a stack limit of 8, holding 10 wood and 2 iron.

**API:**

| Member | What it does |
|---|---|
| `inventory.schema.json` | The container: schemaVersion, slots, stackLimit and items are required. |
| `Inventory.schemaVersion` | The version of the schema: the constant 1. |
| `Inventory.slots` | The number of slots, an integer from 1; each slot holds one kind of item. |
| `Inventory.stackLimit` | The most items of one kind in a single slot, an integer from 1. |
| `Inventory.items` | The contents as a list of items, each with a total quantity. |
| `Item` | itemId and quantity are required; quantity is an integer from 1. |
| `Item.itemId` | The game's own item id, a non-empty string such as wood. |

**Example:**

```json
{
  "schemaVersion": 1,
  "slots": 3,
  "stackLimit": 8,
  "items": [
    { "itemId": "wood", "quantity": 10 },
    { "itemId": "iron", "quantity": 2 }
  ]
}
```

**Install:**

Nothing to install: the repository holds a JSON Schema (2020-12) file. Read inventory.schema.json and examples/ at https://github.com/IT-Kamianets/3d-inventory-schema and validate documents with any JSON Schema validator. In Unity, 3d-unity-inventory reads and writes this format.

## Core

Unity systems every 3D game needs.

### 3d-unity-core

Shared base for the engine's Unity packages: logging, player settings, typed events and services.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-core` |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-ui`](#3d-unity-ui), [`3d-unity-shell`](#3d-unity-shell), [`3d-unity-account`](#3d-unity-account), [`3d-unity-interaction`](#3d-unity-interaction), [`3d-unity-spatial`](#3d-unity-spatial), [`3d-unity-xr`](#3d-unity-xr), [`3d-unity-firebase`](#3d-unity-firebase), [`3d-unity-network`](#3d-unity-network), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-vr-controls`](#3d-constructor-vr-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template), [`3d-unity-topdown-camera`](#3d-unity-topdown-camera) |
| Repository | https://github.com/IT-Kamianets/3d-unity-core |
| Page | https://3d.itkamianets.com/packages/3d-unity-core |

**Purpose.** Other engine packages need the same few basics: a log with categories, a place to save player settings, a way to talk without references, and a way to swap a default. This package gives exactly that and nothing more. It holds no game, scene or device logic.

**Usage.** Write log lines with EngineLog.Info(category, message) and its sibling methods. Save player settings through EngineStorage.Current, which uses PlayerPrefs unless a game registers its own IEngineStorage. Publish and subscribe to plain structs with EngineEvents, and replace defaults with EngineServices.Set.

**Includes:**

- EngineLog: Debug, Info, Warning and Error lines prefixed with a category, such as [Network] Client 1 joined.
- A minimum log level: Debug in the Editor and development builds, Info in release builds, changeable at runtime.
- IEngineStorage for per-device player settings, with a PlayerPrefs implementation used by default.
- Storage helpers for bool values and for objects saved as JSON with Unity's JsonUtility.
- EngineEvents: typed publish and subscribe, where the event type is the channel.
- EngineServices: one replaceable instance per type, with Get, TryGet and Remove.

**API:**

| Member | What it does |
|---|---|
| `EngineLog.Info(category, message, context)` | Writes an Info line prefixed with the category; Debug, Warning and Error work the same way. |
| `EngineLog.MinimumLevel` | Lines below this LogLevel are dropped; None turns logging off. |
| `EngineStorage.Current` | The storage packages use: the registered IEngineStorage, or PlayerPrefs if none is set. |
| `IEngineStorage` | Get and set strings, floats and ints by key, check and delete keys, and Save to disk. |
| `storage.GetJson<T>(key, fallback) / SetJson<T>(key, value)` | Reads and writes an object as JSON using Unity's JsonUtility. |
| `storage.GetBool(key, fallback) / SetBool(key, value)` | Reads and writes a bool stored as an int. |
| `EngineEvents.Subscribe<T>(handler) / Unsubscribe<T>(handler)` | Adds or removes a handler for events of type T. |
| `EngineEvents.Publish<T>(message)` | Calls every handler subscribed to T with the message. |
| `EngineServices.Set<T>(service)` | Registers or replaces the service for type T; null removes it. |
| `EngineServices.TryGet<T>(out service)` | Returns the registered service for T, or false if there is none. |

**Example:**

```csharp
using ITKamianets.Engine.Core;

public struct RoundEnded { public int WinnerTeam; }

EngineLog.Info("Arena", "Round 3 started");

var storage = EngineStorage.Current;
storage.SetFloat("camera.sensitivity", 1.4f);
storage.SetBool("hud.showFps", true);

EngineEvents.Subscribe<RoundEnded>(e => EngineLog.Info("Hud", $"Team {e.WinnerTeam} wins"));
EngineEvents.Publish(new RoundEnded { WinnerTeam = 1 });

EngineServices.Set<IEngineStorage>(new MyCloudStorage());
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-core.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6

### 3d-unity-scene

Builds live Unity scenes from 3d-scene-schema JSON and saves them back to the same format.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-scene` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-scene-schema`](#3d-scene-schema) |
| Used by | [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-interaction`](#3d-unity-interaction), [`3d-unity-spatial`](#3d-unity-spatial), [`3d-unity-firebase`](#3d-unity-firebase) |
| Repository | https://github.com/IT-Kamianets/3d-unity-scene |
| Page | https://3d.itkamianets.com/packages/3d-unity-scene |

**Purpose.** Levels and room scans are stored as engine-independent Scene JSON, not as Unity scenes. This package turns that JSON into GameObjects and captures the result back after changes. It does not load models or textures: it hands asset ids to a resolver, such as 3d-unity-assets.

**Usage.** Call SceneLoader.Load with a JSON string or a SceneData and get a LoadedScene. Find objects with FindById, FindByTag or FindByType, and read roles from each SceneObject's tags. SceneLoadOptions sets the surface material, colliders and the ISceneAssetResolver. SceneSaver.CaptureJson writes the scene as it is now.

**Includes:**

- A C# model of 3d-scene-schema 1.1.0 with exact field names, and SceneJson to read and write it; 1.0.0 documents load too.
- One GameObject per scene object in the document's hierarchy, with the scene origin applied to the root.
- A SceneObject component on each object with its id, type, asset id and tags, including key:value tags such as team:a.
- Double-sided surface meshes and mesh colliders from boundaries, with concave outlines triangulated; invisible walls get a collider only.
- Box colliders from volumes, and trigger colliders for MARKER volumes such as objective zones.
- Saving: moved objects get new transforms, removed and inactive ones are left out, and runtime objects with a SceneObject are added.
- CoordinateConversion between the schema's right-handed space and Unity's left-handed space.

**API:**

| Member | What it does |
|---|---|
| `SceneLoader.Load(json, parent, options)` | Builds a scene from JSON or a SceneData under an optional parent and returns its LoadedScene. |
| `SceneLoadOptions` | Sets BuildSurfaces, SurfaceMaterial, BuildColliders, MarkerVolumesAsTriggers and AssetResolver. |
| `LoadedScene.FindById(id)` | Returns the scene object with this id, or null. |
| `LoadedScene.FindByTag(tag) / FindByType(type)` | Returns every object with this tag or this semantic type. |
| `LoadedScene.Unload()` | Destroys the scene's GameObjects. |
| `SceneObject.HasTag(tag)` | Tells whether the object has a tag such as spawn. |
| `SceneObject.TryGetTag(key, out value)` | Reads a key:value tag, so TryGetTag("team", out var team) gives a for team:a. |
| `ISceneAssetResolver.Resolve(target)` | Called for every object with an asset id so another package can show its content. |
| `SceneSaver.Capture(scene) / CaptureJson(scene)` | Turns a LoadedScene back into a SceneData or a JSON string as it is now. |
| `SceneJson.Serialize(scene) / Deserialize(json)` | Converts between SceneData and the schema's JSON. |
| `CoordinateConversion.FromSchema(value) / ToSchema(value)` | Converts positions and rotations between schema space and Unity space. |

**Example:**

```csharp
using ITKamianets.Engine.Scene;

var level = SceneLoader.Load(json, null, new SceneLoadOptions
{
    SurfaceMaterial = floorMaterial,
    AssetResolver = assets,
});

foreach (var spawn in level.FindByTag("spawn"))
{
    spawn.TryGetTag("team", out var team);   // "a" or "b"
}

string saved = SceneSaver.CaptureJson(level);
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-scene.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core`.

Requirements:

- Unity 6000.6
- com.unity.nuget.newtonsoft-json 3.2.2, resolved by the Package Manager
- com.unity.modules.physics 1.0.0, resolved by the Package Manager

### 3d-unity-input

One set of input actions for keyboard and mouse, gamepad, touch and VR controllers.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-input` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core) |
| Used by | [`3d-unity-ui`](#3d-unity-ui), [`3d-unity-shell`](#3d-unity-shell), [`3d-unity-interaction`](#3d-unity-interaction), [`3d-unity-xr`](#3d-unity-xr), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-vr-controls`](#3d-constructor-vr-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template), [`3d-unity-topdown-camera`](#3d-unity-topdown-camera) |
| Repository | https://github.com/IT-Kamianets/3d-unity-input |
| Page | https://3d.itkamianets.com/packages/3d-unity-input |

**Purpose.** Other packages read actions such as Move, Look and Primary instead of devices. Supporting a new device means adding a binding here, not changing every package that reacts to input. Actions are named by intent, never by device or game.

**Usage.** Use EngineInput.Default and read actions from its Player and UI maps. ReadLookDegrees gives the same rotation from a mouse, a stick, a touch drag or an XR controller. Turn gameplay input off with PlayerEnabled while a menu is open. A game adds its own actions with AddMap, and they rebind and save like the engine actions. On a phone, draw on-screen sticks and buttons with the Input System’s OnScreenStick and OnScreenButton, pointed at EngineTouchControls paths, and add TouchLookArea for dragging to look. In VR, read poses with TryReadHead and TryReadHandAim and buzz a controller with Haptic.

**Includes:**

- Player map: Move, Look, Turn (XR), Jump, Sprint, Crouch, Primary, Secondary, Interact, ToggleView, NextSlot and Slot1 to Slot4.
- UI map: Navigate, Submit, Cancel, Point, Click, ScrollWheel, Pause, TrackedDevicePosition and TrackedDeviceOrientation, named as Unity’s InputSystemUIInputModule expects.
- Bindings for keyboard and mouse, gamepad, touch and XR controllers (the OpenXR controller layouts, such as Meta Quest Touch).
- Touch: EngineTouchControls is a virtual device for a game’s on-screen move stick, look drag and buttons, so a phone drives the same actions as a keyboard. Touch look is scaled to a 1080-pixel-tall screen, so a swipe turns the view the same on every phone.
- XR: left stick moves, right stick turns, the dominant hand’s trigger is Primary and the other Secondary; head and hand poses come from an always-on XR map (TryReadHead, TryReadHandAim) and survive a device reset.
- DominantHand, saved per player, swaps the triggers for left-handed players; Haptic buzzes a controller.
- Every controller and every finger is also a UI pointer, so world-space canvases and multi-touch work.
- Detection of the device kind in use (the scheme starts as Touch on phones), with a SchemeChanged event when the player switches.
- Look normalized to degrees: pointer movement per pixel, stick tilt per second, with optional inverted Y.
- Interactive rebinding with Escape to cancel, saved to EngineStorage under input.bindings and loaded on start.
- Game-specific action maps added to the same asset at runtime.

**API:**

| Member | What it does |
|---|---|
| `EngineInput.Default` | The shared instance, created and enabled on first use. |
| `EngineInput.Player / UI` | The Player and UI action maps, with one InputAction property per action. |
| `EngineInput.ReadLookDegrees()` | This frame's look rotation in degrees, the same for every device. |
| `Player.SlotPressedThisFrame()` | Returns the hotbar slot pressed this frame, from 1 to 4, or 0 if none. |
| `EngineInput.PlayerEnabled` | Turns gameplay input on or off while the UI map stays on. |
| `EngineInput.Scheme / SchemeChanged` | The InputScheme used last (KeyboardMouse, Gamepad, Touch or XR) and the event raised when it changes. |
| `EngineInput.AddMap(name, define)` | Adds a map of game actions to the shared asset, so they rebind and save like the engine actions. |
| `EngineInput.StartRebind(action, bindingIndex, done)` | Waits for the player to press a new control for one binding and saves the result. |
| `EngineInput.GetBindingDisplay(action)` | The binding shown to the player for the current scheme, such as Space or A. |
| `EngineInput.SaveBindingOverrides() / LoadBindingOverrides(json)` | Exports or imports the player's changed bindings as JSON, for example to sync a cloud profile. |
| `EngineInput.ResetBindingOverrides()` | Restores the default bindings and saves the change. |
| `EngineInputActions.Groups` | Binding group names for each scheme, used when a game adds its own bindings. |
| `EngineTouchControls` | A virtual device holding a game’s on-screen controls; EngineTouchControls.Path(...) gives the control path for an OnScreenStick or OnScreenButton. |
| `TouchLookArea` | A UI area where dragging a finger looks around. |
| `EngineInput.TryReadHead(out pose) / TryReadHandAim(hand, out pose)` | The headset’s and a controller’s aim pose in tracking space; false when none is tracked. |
| `EngineInput.DominantHand` | Which hand’s trigger is Primary; saved per player. |
| `EngineInput.Haptic(hand, amplitude, seconds)` | Buzzes a controller; does nothing without one. |

**Example:**

```csharp
using ITKamianets.Engine.Input;
using UnityEngine.InputSystem;

var input = EngineInput.Default;

Vector2 move = input.Player.Move.ReadValue<Vector2>();
Vector2 look = input.ReadLookDegrees();
if (input.Player.Jump.WasPressedThisFrame()) { /* jump */ }
int slot = input.Player.SlotPressedThisFrame();  // 1..4, or 0

input.PlayerEnabled = false;                     // a menu is open
input.SchemeChanged += scheme => { /* show gamepad or keyboard hints */ };

input.AddMap("TemnoridArena", map =>
    map.AddAction("Scoreboard", InputActionType.Button, "<Keyboard>/tab",
        groups: EngineInputActions.Groups.KeyboardMouse));
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-input.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core`.

Requirements:

- Unity 6000.6
- com.unity.inputsystem 1.20.0, resolved by the Package Manager
- com.unity.ugui 2.6.0, resolved by the Package Manager
- com.unity.modules.xr 1.0.0, resolved by the Package Manager

### 3d-unity-character

A reusable character motor: walking, sprinting, jumping, crouching, slopes and steps, for any camera style.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-character` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core) |
| Used by | [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-xr`](#3d-unity-xr), [`3d-unity-network`](#3d-unity-network), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-vr-controls`](#3d-constructor-vr-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Repository | https://github.com/IT-Kamianets/3d-unity-character |
| Page | https://3d.itkamianets.com/packages/3d-unity-character |

**Purpose.** Every game style needs a character that moves well, so one implementation is shared by all constructors. The character does not read input and does not own a camera. It only follows a movement command, so player controls, an AI and the network can all drive it.

**Usage.** Add a CharacterMotor to an object with its origin at the feet; it adds a Unity CharacterController. Each frame, build a CharacterCommand (world-space move direction, yaw, sprint, jump and crouch) and pass it to SetCommand. For a fixed network tick, turn SimulateInUpdate off and call Simulate yourself, using GetState and SetState to correct a predicted character. Add a CharacterAnimator next to the model’s Animator to animate it from the motor’s movement. Gameplay that aims asks the enabled IAimSource and falls back to its own default.

**Includes:**

- Walk, sprint and crouch speeds with ground acceleration, deceleration and limited air control.
- Jumps to a set height, with coyote time and jump buffering.
- Ground detection that treats step and ledge edges as walkable; slopes up to a limit, steeper ground slides the character down.
- Walks up steps to a set height without jumping.
- Crouching that stays crouched until there is room to stand, with the eye height easing between the two.
- Teleport for spawns, GetState and SetState (including jump timers) for network correction, ConsumeCommand for fixed-tick stepping.
- Events and values for other packages: Jumped, Landed, LeftGround, CrouchChanged, EyePosition, GroundCollider, Velocity, IsSprinting.
- CharacterAnimator feeds the movement to the model’s Animator as Forward, Right, Speed, Grounded, Crouching and VerticalSpeed (parameters the controller lacks are skipped). It reads the motor’s state, so network copies animate too, and uses no root motion.
- IAimSource: where a character aims (a VR hand, a turret barrel); gameplay asks the enabled one and falls back to its own default, such as the screen centre.

**API:**

| Member | What it does |
|---|---|
| `CharacterMotor` | Component that moves a character on Unity's CharacterController, with its origin at the feet. |
| `CharacterCommand` | One step's intent: Move (world-space direction), Yaw, Sprint, Jump and Crouch. |
| `SetCommand(command)` | Sets the command used by the next Update step. |
| `Simulate(command, deltaTime)` | Advances the character by one step; used for fixed-tick and network stepping. |
| `SimulateInUpdate` | When on (the default), the motor steps itself in Update; turn it off to drive it with a fixed tick. |
| `ConsumeCommand()` | Returns the command set since the last call and clears its jump press, so a jump between two ticks is not lost. |
| `Teleport(position, yaw)` | Moves the character instantly, for example to a spawn point, and clears its speed. |
| `GetState() / SetState(state)` | Saves and restores a CharacterState (position, yaw, velocity, ground and crouch, jump timers) without raising events. |
| `Jumped, Landed(impactSpeed), LeftGround, CrouchChanged(isCrouching)` | Movement events for footstep, landing and animation code. |
| `EyePosition` | World position of the eyes, easing between standing and crouching height, for a first-person camera. |
| `GroundCollider` | The collider the character stands on, so sounds can pick the surface. |
| `CharacterSettings` | Speeds, acceleration, jump height, gravity, coyote time, slope limit, step height and body sizes. |
| `CharacterAnimator` | Component next to the model’s Animator that sets the movement parameters from the motor. |
| `IAimSource` | Interface for something that provides an aim ray, such as a VR hand; gameplay reads the enabled one. |

**Example:**

```csharp
var motor = GetComponent<CharacterMotor>();   // origin at the feet
motor.SetCommand(new CharacterCommand
{
    Move = cameraForwardFlat * input.y + cameraRightFlat * input.x,
    Yaw = cameraYaw,
    Sprint = sprintHeld,
    Jump = jumpPressedThisFrame,
    Crouch = crouchHeld,
});
motor.Landed += impactSpeed => { /* play landing sound */ };
motor.Teleport(spawn.position, spawn.eulerAngles.y);
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-character.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core`.

Requirements:

- Unity 6000.6
- com.unity.modules.physics 1.0.0, resolved by the Package Manager

### 3d-unity-assets

Loads 3d-asset-schema assets by id in Unity: models, materials, textures and sounds, with placeholders.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-assets` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-asset-schema`](#3d-asset-schema) |
| Used by | [`3d-unity-audio`](#3d-unity-audio) |
| Repository | https://github.com/IT-Kamianets/3d-unity-assets |
| Page | https://3d.itkamianets.com/packages/3d-unity-assets |

**Purpose.** Scenes refer to assets by id instead of embedding Unity objects. This package turns those ids into Unity objects: it finds, loads, caches and unloads them. It does not place objects in a scene; 3d-unity-scene does that and asks this package for the content.

**Usage.** Load an asset library with EngineAssets.Default.LoadLibrary or LoadLibraryFromUrl, and optionally add an AssetCatalog of Unity prefabs, materials, textures and AudioClips. Place a model with Instantiate(id, parent), or get any asset with Load<T>(id, done). Pass EngineAssets.Default as the scene loader's AssetResolver, and scene objects show their assets.

**Includes:**

- C# model of the 3d-asset-schema library (AssetLibraryData, AssetData and others), read and written by AssetJson.
- Libraries from disk or a URL, with source files resolved relative to the library.
- For each id it tries a catalog entry first, then the library file: GLB/glTF models, PNG/JPG textures, WAV/OGG/MP3 sounds, and materials built from their values (URP Lit).
- A placed model shows its placeholder (a shape and color sized to its bounds) until the real model replaces it.
- An unknown asset or a model with no placeholder that fails to load shows a magenta stand-in and a warning.
- Model materials listed in the library replace the model's own, in order.
- Loaded assets are cached and shared; Unload, UnloadAll and a LoadFailed event.

**API:**

| Member | What it does |
|---|---|
| `EngineAssets.Default` | The shared asset loader and the scene loader's ISceneAssetResolver. |
| `LoadLibrary(path)` | Reads a library file from disk; its sources are relative to the file's folder. |
| `LoadLibraryFromUrl(url, done)` | Downloads a library over http(s) or a platform path such as StreamingAssets on Android. |
| `AddLibrary(library, baseUri)` | Adds an already parsed AssetLibraryData; a later definition of the same id wins. |
| `AddCatalog(catalog)` | Adds an AssetCatalog, checked before any file is loaded. |
| `Load<T>(id, done)` | Loads an asset as a GameObject prototype, Material, Texture2D or AudioClip; calls done with null when it cannot. |
| `Instantiate(id, parent, ready)` | Places a model right away, showing its placeholder until the model has loaded. |
| `Unload(id) / UnloadAll()` | Frees loaded assets; objects already placed keep their copies. |
| `LoadFailed` | Event raised with the id and the reason when an asset cannot be loaded. |
| `MaterialShader` | Shader for materials and placeholders, URP Lit by default; set it if builds strip that shader. |
| `AssetCatalog (Assets > Create > IT-Kamianets > Asset Catalog)` | Maps asset ids to prefabs, materials, textures and AudioClips made in Unity. |
| `AssetJson.Deserialize(json) / Serialize(library)` | Reads and writes asset libraries in the schema's JSON shape. |

**Example:**

```csharp
var assets = EngineAssets.Default;
assets.LoadLibrary(Path.Combine(Application.streamingAssetsPath, "props.library.json"));
assets.AddCatalog(myCatalog);
assets.LoadFailed += (id, reason) => Debug.LogWarning($"{id}: {reason}");

var level = SceneLoader.Load(json, null, new SceneLoadOptions { AssetResolver = assets });
assets.Instantiate("props/crate-wood", parent);
assets.Load<AudioClip>("sounds/footstep-stone-1", clip => source.PlayOneShot(clip));
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-assets.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene`.

Requirements:

- Unity 6000.6
- com.unity.nuget.newtonsoft-json 3.2.2, resolved by the Package Manager
- com.unity.modules.unitywebrequest 1.0.0, resolved by the Package Manager
- com.unity.modules.unitywebrequesttexture 1.0.0, resolved by the Package Manager
- com.unity.modules.unitywebrequestaudio 1.0.0, resolved by the Package Manager
- com.unity.modules.audio 1.0.0, resolved by the Package Manager
- com.unity.modules.imageconversion 1.0.0, resolved by the Package Manager

Optional:

- glTFast (com.unity.cloud.gltfast) loads GLB and glTF models; without it models show their placeholders and a warning.

### 3d-unity-audio

Positional 3D sound, sound events with variations, footsteps by surface, volume groups and music.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-audio` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-character`](#3d-unity-character) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-audio |
| Page | https://3d.itkamianets.com/packages/3d-unity-audio |

**Purpose.** A game plays a sound event by name, not a file, so changing how something sounds is a data change. Positional sound is part of gameplay: players locate others by footsteps and spell casts, so direction and distance must be reliable. The package knows nothing about game rules or networking; it plays what it is told.

**Usage.** Define SoundEvents in a SoundBank asset or in code, and add the bank to EngineAudio.Default. Play events with Play, PlayAttached or Play2D, set volumes with SetVolume, and play music with PlayMusic. Put a FootstepPlayer next to a CharacterMotor for footsteps and landings, and use AudioSceneResolver when loading a scene so placed audio assets become looping 3D sources.

**Includes:**

- Sound events: clips (AudioClips or audio asset ids), volume and pitch ranges, group, 2D or 3D with min and max distance, loop, voice limit, minimum interval, priority.
- A pool of 32 voices; never the same clip twice in a row; when all voices are busy, the oldest or lowest-priority one is replaced.
- A name with no event plays the audio asset with that id through 3d-unity-assets.
- Master volume and four groups (effects, music, voice, interface), applied without a mixer and saved per player through EngineStorage; playing sounds follow changes at once.
- Music that crossfades between tracks and loops.
- FootstepPlayer: footstep.<surface> every stride (longer when sprinting, quieter when crouching) and land.<surface> after a fall, louder for harder landings.
- AudioSceneResolver turns audio assets placed in a scene into looping 3D sources and passes other assets to EngineAssets.

**API:**

| Member | What it does |
|---|---|
| `EngineAudio.Default` | The shared player for sound events, volume groups and music. |
| `AddBank(bank) / Define(soundEvent)` | Adds the events of a SoundBank, or one SoundEvent defined in code. |
| `Play(name, position, volumeScale)` | Plays an event at a world position and returns a SoundHandle. |
| `PlayAttached(name, target, volumeScale)` | Plays an event that follows a transform, such as a projectile. |
| `Play2D(name, volumeScale)` | Plays an event straight in the ears, for interface sounds. |
| `Stop(handle) / IsPlaying(handle)` | Stops a playing sound or checks whether it still plays. |
| `Preload(name)` | Loads an event's asset clips now, so its first play is not delayed. |
| `SetVolume(group, volume) / SetMasterVolume(volume)` | Sets and saves a volume from 0 to 1; playing sounds follow at once. |
| `PlayMusic(name, fadeSeconds) / StopMusic(fadeSeconds)` | Crossfades to a looping music track, or fades the music out. |
| `SetMixerGroup(group, mixerGroup)` | Routes a volume group through a group of the game's AudioMixer. |
| `FootstepPlayer` | Component next to a CharacterMotor that plays footsteps and landings by surface. |
| `AudioSurface / AudioSceneResolver` | Marks what a collider is made of; resolves audio assets placed in a scene into 3D sources. |

**Example:**

```csharp
var audio = EngineAudio.Default;
audio.AddBank(playerSounds);
audio.Play("spell.fireball.cast", caster.position);
audio.PlayAttached("spell.fireball.fly", projectile.transform);
audio.Play2D("ui.click");
audio.SetVolume(SoundGroup.Music, 0.4f);   // saved for this player
audio.PlayMusic("music/round-start");

var options = new SceneLoadOptions { AssetResolver = new AudioSceneResolver() };
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-audio.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene` → `3d-unity-assets` → `3d-unity-character`.

Requirements:

- Unity 6000.6
- com.unity.modules.audio 1.0.0, resolved by the Package Manager

## Game kit

Building blocks for shipping a game: screens, saves, generated sounds, scene-builder helpers, and the shared start screens, sign-in, self-update and online sessions.

### 3d-unity-ui

Small helpers for building a game's screens in code with plain uGUI: panels, labels, bars, buttons and an event system wired to the engine's input.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-ui` |
| Version | 0.1.1 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input) |
| Used by | [`3d-unity-shell`](#3d-unity-shell) |
| Repository | https://github.com/IT-Kamianets/3d-unity-ui |
| Page | https://3d.itkamianets.com/packages/3d-unity-ui |

**Purpose.** A game's HUD and menus need the same few pieces every time, laid out so they look the same at any resolution. This package makes those pieces from code, placed by anchors, with no prefabs and no project-wide input asset. The game decides what its screens say and when they show; there is no styling system, no layout groups and no game screens here.

**Usage.** Make the canvas with UiBuilder.CreateCanvas and call UiBuilder.EnsureEventSystem once. Then create a UiBuilder and build boxes, labels, bars and buttons between two anchors, each from 0 to 1 of the parent. Show a value with SetFill, change text with SetText, and call Select on a screen so the keyboard or a gamepad can use its first button. UiShapes gives a circle sprite, a rectangle's place on the screen and Quit, and LineDrawer traces a polyline on a panel.

**Includes:**

- CreateCanvas: a full-screen overlay canvas that scales with the screen (1920 by 1080 reference, width and height weighted equally).
- Box, Label, Bar and Button, each placed between two anchors; Label can wrap long text inside its box.
- Bar returns its fill, which starts full; SetFill shows a fraction from 0 to 1.
- Button colours (normal, highlighted, selected, pressed) and its font size are fields on the builder, set before building.
- EnsureEventSystem: an event system whose point, click, scroll, navigate, submit and cancel actions come from EngineInput's UI map, so buttons answer to mouse, keyboard and gamepad.
- SetText writes only when the text changed, Select highlights a screen's first button, and FormatTime gives minutes and seconds with a tenth, such as 1:05.3.
- UiShapes: Circle makes a 128-pixel disc or ring sprite at run time, ScreenRect gives a rectangle's place on the screen in pixels, and Quit leaves the game (stops play mode in the editor).
- LineDrawer: a polyline drawn on a panel from pooled rectangles, in panel units from 0 to 1, with a dot at its start.

**API:**

| Member | What it does |
|---|---|
| `UiBuilder.CreateCanvas(parent, name)` | A full-screen overlay canvas that scales with the screen. |
| `UiBuilder.EnsureEventSystem(parent)` | Adds an event system fed by EngineInput's UI actions, unless the scene already has one. |
| `UiBuilder.Box(name, parent, min, max, colour)` | A coloured rectangle between two anchors. |
| `UiBuilder.Bar(...) / SetFill(fill, fraction)` | A bar with a dark back; Bar returns the fill, and SetFill shows a fraction from 0 to 1. |
| `builder.Label(name, parent, text, size, anchor, min, max, colour, wrap)` | A text label in the builder's font; with wrap, long text wraps inside its box. |
| `builder.Button(text, parent, min, max, onClick)` | A button with a centred label, coloured by the builder's button fields. |
| `UiBuilder.SetText(label, value) / Select(screen) / FormatTime(seconds)` | Sets text only when it changed; highlights a screen's first button; formats seconds as minutes and seconds with a tenth. |
| `UiShapes.Circle(filled) / ScreenRect(rect) / Quit()` | A disc or ring sprite, a rectangle's place on the screen in pixels, and leaving the game. |
| `new LineDrawer(panel, colour, thickness, dot) / Set(points) / Clear()` | Draws a polyline on a panel in 0 to 1 panel units, or hides it. |

**Example:**

```csharp
using ITKamianets.Engine.UI;
using UnityEngine;

var canvas = UiBuilder.CreateCanvas(transform);
UiBuilder.EnsureEventSystem(transform);
var ui = new UiBuilder();

var stamina = UiBuilder.Bar("Stamina", canvas.transform,
    new Vector2(0.02f, 0.05f), new Vector2(0.24f, 0.07f), Color.green);
UiBuilder.SetFill(stamina, 0.6f);

var menu = UiBuilder.Box("Menu", canvas.transform,
    new Vector2(0.3f, 0.2f), new Vector2(0.7f, 0.8f), new Color(0f, 0f, 0f, 0.7f));
ui.Button("Start", menu.transform,
    new Vector2(0.1f, 0.5f), new Vector2(0.9f, 0.8f), () => StartRace());
UiBuilder.Select(menu);                 // keyboard and gamepad reach the button

var trace = new LineDrawer(panel, Color.black, 7f, UiShapes.Circle(true));
trace.Set(new[] { new Vector2(0.1f, 0.1f), new Vector2(0.9f, 0.8f) });
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-ui.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input`.

Requirements:

- Unity 6000.6
- com.unity.ugui 2.6.0, resolved by the Package Manager
- com.unity.inputsystem 1.20.0, resolved by the Package Manager

### 3d-unity-save

Versioned local JSON save files: one slot per file, written safely, with a clear result for a missing, damaged or newer save.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-save` |
| Version | 0.1.1 |
| Depends on | nothing |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-save |
| Page | https://3d.itkamianets.com/packages/3d-unity-save |

**Purpose.** A game's progress has to survive a crash in the middle of a write, and a bad file must never be thrown away silently. This package keeps one JSON file per slot in an envelope that follows 3d-save-schema, and answers every read with a status the game can act on. The payload belongs to the game: this package never looks inside it.

**Usage.** Create one SaveStore per game with its game id, and call Save(slot, payload, payloadVersion). Load<T>(slot, currentPayloadVersion, migrate) returns a SaveResult<T>: check Status, and use Value only when it is Ok. Pass a migrate function to upgrade older payloads. Create the store with keepBackup: true to keep the previous good save, and offer LoadBackup when the main file is damaged.

**Includes:**

- SaveStore(gameId, rootDirectory, keepBackup): one file per slot at <persistent data path>/<gameId>/<slot>.json; rootDirectory replaces the persistent data path, which tests use to write to a temporary folder.
- The file is an envelope with schemaVersion, gameId, slotId, savedAt, payloadVersion and payload, as in 3d-save-schema (SaveStore.SchemaVersion is 1).
- Save writes a .tmp file first and then swaps it in, so a crash cannot leave half a save; it returns Ok or IoError.
- Load<T> returns a SaveResult<T> with a Status (Ok, NotFound, Corrupt, UnsupportedVersion or IoError), a Value and a Message.
- A payload older than currentPayloadVersion goes through your migrate function (the old payload as a JToken, and its version); without one it is UnsupportedVersion. A newer payload or schema is UnsupportedVersion too, and the file is left alone.
- A file that cannot be parsed is renamed to <slot>.corrupt-<time>.json, never deleted, and the result is Corrupt.
- Optional keepBackup: each time a slot is replaced, the previous save is copied to <slot>.backup.json if it was readable; LoadBackup<T> reads it, and a damaged backup is reported as Corrupt and left where it is. Off by default.
- Exists, BackupExists, PathFor, BackupPathFor and Delete; Delete removes the backup too.

**API:**

| Member | What it does |
|---|---|
| `new SaveStore(gameId, rootDirectory, keepBackup)` | The slots of one game; throws if the game id is empty. rootDirectory and keepBackup are optional. |
| `Save<T>(slot, payload, payloadVersion)` | Writes the slot safely and returns Ok or IoError. |
| `Load<T>(slot, currentPayloadVersion, migrate)` | Reads the slot into a SaveResult<T>; migrate upgrades an older payload. |
| `LoadBackup<T>(slot, currentPayloadVersion, migrate)` | Reads the previous good save of a slot; needs keepBackup. |
| `Exists(slot) / BackupExists(slot)` | Whether the slot or its backup file exists. |
| `PathFor(slot) / BackupPathFor(slot)` | The file path of the slot or of its backup. |
| `Delete(slot)` | Removes the slot and its backup. |
| `SaveResult<T> / SaveStatus` | A Status, a Value (set only when Ok) and a Message; Ok is true for a read save. |

**Example:**

```csharp
using ITKamianets.Engine.Save;

[System.Serializable]
public class Records { public int wins; public float bestLap; }

var store = new SaveStore("hippodrome", keepBackup: true);
store.Save("default", new Records { wins = 3, bestLap = 41.2f }, payloadVersion: 2);

var result = store.Load<Records>("default", currentPayloadVersion: 2,
    migrate: (old, version) => new Records { wins = (int?)old["wins"] ?? 0 });

if (result.Ok) Use(result.Value);
else if (result.Status == SaveStatus.Corrupt)
{
    var backup = store.LoadBackup<Records>("default", 2);   // the save before the last one
    if (backup.Ok) Use(backup.Value);
}
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-save.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6
- com.unity.nuget.newtonsoft-json 3.2.2, resolved by the Package Manager

### 3d-unity-synth

Procedural sound: short clips built in code from waves and noise, and a sound board with volumes and a looping ambience, so a game needs no audio files.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-synth` |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-synth |
| Page | https://3d.itkamianets.com/packages/3d-unity-synth |

**Purpose.** A small game can ship without audio files by making its sounds from simple waves and noise when it starts. The clip builder and the sound board are the parts every such game repeats; the game keeps its own list of sounds and its own recipes. A muted game behaves exactly like an unmuted one apart from the sound.

**Usage.** Build each clip with Tone.Build(name, seconds, wave), where wave is a function of time in seconds, and shape it with Tone.Envelope and Tone.Noise. Add a SoundBoard component to a game object, call Init with an ambience clip and the array of one-shots, and play them by index with Play(id, volume). Set the player's volumes with SetVolumes(master, sfx). An enum works well as the list of sounds: cast it to int.

**Includes:**

- Tone.Build(name, seconds, wave): a mono clip at 22,050 Hz (Tone.Rate) whose sample at time t is wave(t), clamped to -1..1.
- Tone.Envelope(t, length, attack): a fast attack (4 ms by default), then a fade-out over the last 70% of the clip.
- Tone.Noise(random): white noise in -1..1 from a System.Random; seed it for a repeatable sound.
- SoundBoard: a component that adds two non-spatial AudioSources, one for the ambience on loop and one for one-shots.
- SoundBoard.Init(ambient, clips, ambientGain): the ambience may be null; ambientGain (0.3 by default) sets how loud it is next to the master volume.
- SetVolumes(master, sfx) clamps both to 0..1 and keeps them in MasterVolume and SfxVolume (0.8 and 0.9 at first); the ambience follows the master volume.
- Play(id, volume) plays clip number id at master x sfx x volume, and does nothing for an unknown id or while that volume is 0, so a muted game plays no one-shots.

**API:**

| Member | What it does |
|---|---|
| `Tone.Build(name, seconds, wave)` | Builds a mono AudioClip whose sample at time t is wave(t), clamped to -1..1. |
| `Tone.Envelope(t, length, attack)` | A 0 to 1 shape: a fast attack, then a fade-out over most of the clip. |
| `Tone.Noise(random)` | One white noise sample in -1..1. |
| `Tone.Rate` | The sample rate of every clip, 22050. |
| `SoundBoard.Init(ambient, clips, ambientGain)` | Sets the ambience and the one-shots and starts the ambience on loop. |
| `SoundBoard.SetVolumes(master, sfx)` | Sets the master and effects volumes, each clamped to 0..1. |
| `SoundBoard.Play(id, volume)` | Plays one-shot number id, scaled by both volumes and by volume. |
| `SoundBoard.MasterVolume / SfxVolume` | The current volumes, read-only. |

**Example:**

```csharp
using ITKamianets.Engine.Synth;
using UnityEngine;

var random = new System.Random(7);   // seeded: the same hiss every run

var click = Tone.Build("click", 0.05f,
    t => Mathf.Sin(t * 2f * Mathf.PI * 1000f) * Tone.Envelope(t, 0.05f) * 0.45f);
var hiss = Tone.Build("hiss", 0.2f,
    t => Tone.Noise(random) * Tone.Envelope(t, 0.2f, 0.01f) * 0.3f);
var hum = Tone.Build("hum", 6f, t => Mathf.Sin(t * 2f * Mathf.PI * 110f) * 0.2f);

var board = gameObject.AddComponent<SoundBoard>();
board.Init(hum, new[] { click, hiss }, ambientGain: 0.25f);
board.SetVolumes(0.8f, 0.9f);
board.Play(0, 0.5f);                 // click
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-synth.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6

### 3d-unity-graybox

Build a game's first playable from Unity primitives: stable asset ids on everything that will get a real model, and Editor helpers for primitives, plain materials and world text.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-graybox` |
| Version | 0.1.1 |
| Depends on | nothing |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-graybox |
| Page | https://3d.itkamianets.com/packages/3d-unity-graybox |

**Purpose.** A first playable made of cubes and cylinders should not need rewriting when real models arrive. This package tags every stand-in with the id of what it stands for, so a model can replace the primitive without touching gameplay, and it keeps scene builders short enough to run again at any time to rebuild a level from scratch.

**Usage.** Add AssetIdTag to anything that will later get a model and set its Id, for example props/chest. In an Editor script that builds a scene, make materials with GrayboxBuilder.Mat, floors and walls with Box, decoration with Prim and signs with Text. Mat saves a material under Assets/Materials (or the folder you pass) and updates it on the next run, and it needs the Universal Render Pipeline. GrayboxBuilder is Editor code; AssetIdTag and the WorldText shader are the runtime part.

**Includes:**

- AssetIdTag (runtime): a component with an Id such as monsters/goblin or props/chest, whatever shape draws the object today.
- GrayboxBuilder.Prim(type, name, parent, position, scale, material, keepCollider): a primitive at a local position and scale, with no collider unless asked.
- GrayboxBuilder.Box: a cube that keeps its collider, for floors, walls and anything to stand on or bump into.
- GrayboxBuilder.Mat(name, colour, directory, smoothness): a plain URP Lit material of one colour, saved as <directory>/<name>.mat (Assets/Materials by default); running again updates the same asset.
- GrayboxBuilder.Text: a line of text in the world (a TextMesh) for a sign or plaque, readable from its own -z side.
- GrayboxBuilder.WorldTextMaterial(font, directory): the material world text is drawn with, saved as WorldText.mat in the material folder.
- The Temnorid/WorldText shader: draws a font texture depth-tested and without writing depth, so walls hide the text; the built-in font shader draws it through walls.

**API:**

| Member | What it does |
|---|---|
| `AssetIdTag.Id` | The stable id of what the object stands for, such as props/chest. |
| `GrayboxBuilder.Prim(...)` | A primitive under a parent at a local position and scale; keepCollider is false by default. |
| `GrayboxBuilder.Box(parent, name, position, scale, material)` | A cube that keeps its collider. |
| `GrayboxBuilder.Mat(name, colour, directory, smoothness)` | A one-colour URP Lit material saved as an asset and updated on later runs; smoothness is 0.12 by default. |
| `GrayboxBuilder.Text(parent, name, text, localPosition, rotation, size, colour)` | A TextMesh line in the world, with the depth-tested material. |
| `GrayboxBuilder.WorldTextMaterial(font, directory)` | The depth-tested material for world text, made once and reused. |
| `GrayboxBuilder.DefaultMaterialDirectory` | Assets/Materials, where materials are saved unless a folder is passed. |

**Example:**

```csharp
using ITKamianets.Engine.Graybox;
using ITKamianets.Engine.Graybox.EditorTools;   // in an Editor script
using UnityEngine;

var stone = GrayboxBuilder.Mat("Stone", new Color(0.45f, 0.45f, 0.5f));
var wood = GrayboxBuilder.Mat("Wood", new Color(0.5f, 0.35f, 0.2f));

GrayboxBuilder.Box(root, "Floor", new Vector3(0f, -0.5f, 0f), new Vector3(20f, 1f, 20f), stone);

var chest = GrayboxBuilder.Prim(PrimitiveType.Cube, "Chest", root,
    new Vector3(2f, 0.4f, 3f), new Vector3(1f, 0.8f, 0.6f), wood, keepCollider: true);
chest.AddComponent<AssetIdTag>().Id = "props/chest";

GrayboxBuilder.Text(root, "Sign", "CELLS", new Vector3(0f, 2f, -5f),
    Quaternion.identity, 0.02f, Color.white);
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-graybox.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6
- The Universal Render Pipeline in the project: Mat makes Universal Render Pipeline/Lit materials

### 3d-unity-shell

The screens every Temnorid game shares: splash, landing, sign-in, onboarding, lobby and in-game top and bottom bars.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-shell` |
| Version | 0.2.2 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-ui`](#3d-unity-ui), [`3d-unity-account`](#3d-unity-account), [`3d-unity-update`](#3d-unity-update), [`3d-unity-net`](#3d-unity-net) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-shell |
| Page | https://3d.itkamianets.com/packages/3d-unity-shell |

**Purpose.** Every Temnorid game follows the structure of the Lords app, so a player who knows one game knows them all. The shell owns those screens and their order. A game describes itself in a ShellConfig and adds its own places; it does not rebuild a menu.

**Usage.** Fill ShellConfig.Current before any scene loads, in a method marked BeforeSceneLoad: title, GameId, Repo, MaxPlayers, GameScene, accent colour and Places. From the game's editor scene builder, call ShellSceneKit.BuildBoot, BuildMenu, SetBuildOrder and ApplyPlatformSettings. In the game scene, create ShellChrome once, handle PlaceSelected to show the content of each place, keep the HUD inside TopFraction and BottomFraction, and point the game's main menu button at ShellFlow.QuitToMenu. On phones, build a TouchButton for each thing the keyboard does.

**Includes:**

- ShellBoot (scene Boot): a splash with a turning ring, shown for at least 1.2 seconds while it restores the saved account and checks for a newer release. On Windows the new installer runs here, before anything else.
- ShellMenu (scene Menu): a landing screen with Play, Play with others, Profile and Quit (no Quit on phones), then sign-in, onboarding and the profile.
- Sign-in, shown once when accounts are on: Google, guest or play offline. A player who signs in with Google skips onboarding, since the name comes from the account.
- Onboarding, once: a name of up to 16 characters and a colour from ShellConfig.PlayerColours (eight by default), saved in ShellProfile.
- Lobby: host on this network or online with a short code, join by address or code, a roster with ready flags, and Start for the host once two or more players are all ready.
- ShellChrome: a top bar with the game, the current place, a status line and who you are; place tabs in the top bar on desktop and in a bottom bar on phones; a Profile place always last, with name, colour, automatic updates, account and Check for updates.
- ShellFlow: Boot to Menu to the game, solo or online, and back with QuitToMenu, which raises BeforeQuit so the game can save, then leaves any session.
- ShellSceneKit, in the editor: builds the Boot and Menu scenes, sets the build order, applies Android and iOS settings, builds an Android apk or aab and exports an Xcode project.

**API:**

| Member | What it does |
|---|---|
| `ShellConfig.Current` | What the game tells the shell: Title, Tagline, GameId, Repo, InstallerSuffix, StoreUrl, MaxPlayers, Accounts, Multiplayer, MenuScene, GameScene, Accent, Places and PlayerColours. |
| `ShellChrome.Create(parent, sortingOrder)` | Creates the top bar and place tabs in the game scene. TopFraction and BottomFraction say how much of the screen height they take. |
| `ShellChrome.PlaceSelected / Select(id) / SetStatus(text)` | Raised when a tab is chosen; Select picks a place from code, and SetStatus writes a short line, such as a score, in the top bar. |
| `ShellFlow.PlaySolo() / LoadGame() / LoadMenu() / QuitToMenu()` | Moves between the Menu and the game scene. QuitToMenu raises BeforeQuit and closes any session. |
| `ShellProfile.Current` | The saved name, colour and automatic-update choice of the player on this device. Save writes it and gives NetSession the name and colour. |
| `TouchButton.Create(ui, parent, label, min, max)` | An on-screen button with Held and ConsumePress, read like a key. IsNeeded is true on phones and tablets. |
| `ShellSceneKit.BuildBoot() / BuildMenu() / SetBuildOrder(...) / ApplyPlatformSettings(...)` | Editor only: writes the Boot and Menu scenes, sets the build order, and applies the company, product, application id, version and Android and iOS settings. |

**Example:**

```csharp
using ITKamianets.Engine.Shell;
using UnityEngine;

public static class MyGameShell
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    static void Configure()
    {
        ShellConfig.Current = new ShellConfig
        {
            Title = "Temnorid Hippodrome",
            Tagline = "Ride. Race. Cross the line first.",
            GameId = "hippodrome",
            Repo = "WebArtWork/hippodrome.temnorid.com",
            MaxPlayers = 4,
            GameScene = "Main",
            Places =
            {
                new ShellPlace("race", "Race", "R"),
                new ShellPlace("records", "Records", "T"),
            },
        };
    }
}

// In the game scene's HUD:
var chrome = ShellChrome.Create(transform);
chrome.PlaceSelected += id => ShowPlace(id);
chrome.SetStatus("Lap 2 of 3");
mainMenuButton.onClick.AddListener(ShellFlow.QuitToMenu);
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-shell.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input` → `3d-unity-ui` → `3d-unity-account` → `3d-unity-update` → `3d-unity-net`.

Requirements:

- Unity 6000.6
- com.unity.ugui 2.6.0, resolved by the Package Manager
- com.unity.inputsystem 1.20.0, resolved by the Package Manager

### 3d-unity-account

The player's Lords account in every game: sign in as a guest or with Google over Firebase's REST API, with no Firebase SDK.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-account` |
| Version | 0.2.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core) |
| Used by | [`3d-unity-shell`](#3d-unity-shell) |
| Repository | https://github.com/IT-Kamianets/3d-unity-account |
| Page | https://3d.itkamianets.com/packages/3d-unity-account |

**Purpose.** A lord should be the same person in every game. GameAccount signs players in to the Firebase project Lords uses, as a guest or with Google, remembers them between runs and gives other calls a valid ID token. Not being signed in is a normal state, and the game plays on.

**Usage.** Call GameAccount.RestoreAsync() at start to bring back the last player. Offer SignInAsGuestAsync() and, where GoogleAvailable is true, SignInWithGoogleAsync(). Read Uid, DisplayName, Email and IsGuest, and listen to Changed. For Firebase calls of your own, await GetIdTokenAsync(). FirestoreClient.ForAccount() reads a document with GetAsync and changes chosen fields of an existing one with PatchAsync. Google sign-in on desktop needs the Desktop OAuth client file at Assets/Resources/account-oauth.json, which each game keeps out of git.

**Includes:**

- GameAccount: static sign-in state (IsSignedIn, Uid, DisplayName, Email, IsGuest, LastError, Busy) and a Changed event.
- Guest: SignInAsGuestAsync() makes an anonymous Firebase user, with nothing to type.
- Google on desktop: the browser opens, Google redirects to a one-shot listener on 127.0.0.1, the code is exchanged with PKCE, and Firebase signs the player in. It gives up after three minutes.
- A guest who signs in with Google keeps the same uid, so progress is not lost.
- Restore and refresh: RestoreAsync() shows the remembered player at once from EngineStorage, and GetIdTokenAsync() refreshes the token when it is about to expire.
- SignOut() forgets this device's session; DeleteAccountAsync() deletes the Firebase user itself.
- FirestoreClient: GetAsync(path) and PatchAsync(path, data, fieldPaths, updateTime) as the signed-in player, over REST.
- FirestoreRest: pure functions for addresses, patch bodies and Firestore's typed values to and from a Newtonsoft JToken.

**API:**

| Member | What it does |
|---|---|
| `GameAccount.RestoreAsync()` | Brings back the last player from saved tokens and refreshes them. Safe to call on every start. |
| `GameAccount.SignInAsGuestAsync() / SignInWithGoogleAsync()` | Signs in as a guest or through the browser with Google, and returns whether it worked. LastError says why not. |
| `GameAccount.IsSignedIn / Uid / DisplayName / Email / IsGuest / Changed` | Who is signed in on this device, and an event for when that changes. |
| `GameAccount.GetIdTokenAsync()` | A valid Firebase ID token for other calls, refreshed when needed. Null when signed out or offline. |
| `GameAccount.SignOut() / DeleteAccountAsync()` | Forgets this device's session, or deletes the Firebase user. |
| `FirestoreClient.ForAccount()` | A client for the signed-in player. GetAsync(path) returns a FirestoreDocument; PatchAsync changes chosen fields of an existing one. |
| `FirebaseConfig` | The Firebase project and the Google Desktop OAuth client. FirebaseConfig.Temnorid is the project Lords uses. |

**Example:**

```csharp
using ITKamianets.Engine.Account;
using Newtonsoft.Json.Linq;

await GameAccount.RestoreAsync();
if (!GameAccount.IsSignedIn) await GameAccount.SignInAsGuestAsync();

// Later, a guest signs in with Google and keeps the same uid.
if (GameAccount.IsGuest && GameAccount.GoogleAvailable)
    await GameAccount.SignInWithGoogleAsync();

var firestore = FirestoreClient.ForAccount();
var path = "users/" + GameAccount.Uid + "/progress/lords";
var result = await firestore.GetAsync(path);
if (result.Ok)
{
    var patch = await firestore.PatchAsync(path, new JObject { ["note"] = "hello" },
        new[] { "note" }, result.Document.UpdateTime);
    if (patch.Status == FirestoreStatus.Conflict) { /* read again and retry */ }
}
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-account.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core`.

Requirements:

- Unity 6000.6
- com.unity.modules.unitywebrequest 1.0.0, resolved by the Package Manager
- com.unity.modules.jsonserialize 1.0.0, resolved by the Package Manager
- com.unity.nuget.newtonsoft-json 3.2.2, resolved by the Package Manager

### 3d-unity-update

Keeps a game on its newest GitHub release: checks for a new version and installs it silently on Windows.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-update` |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | [`3d-unity-shell`](#3d-unity-shell) |
| Repository | https://github.com/IT-Kamianets/3d-unity-update |
| Page | https://3d.itkamianets.com/packages/3d-unity-update |

**Purpose.** Games ship as GitHub releases. AutoUpdater asks the repository for its latest release and compares the tag with the game's version, so a player who opens an old build is moved to the new one without installing by hand. Being offline is normal and never an error for the player.

**Usage.** Add an AutoUpdater to an object, set Repo to the owner and name of the GitHub repository, and call Check(). When State becomes Available, show Latest.Version and call Install(). Progress and the Changed event drive a progress bar while it downloads. On Windows the release needs an asset ending with -Setup.exe; on Android set StoreUrl, or the .apk of the release opens. The game's version is the Unity bundleVersion, and the release tag is v followed by that version.

**Includes:**

- AutoUpdater and its states: Idle, Checking, UpToDate, Available, Downloading, Installing and Failed.
- Check() reads releases/latest from the GitHub API, with an 8 second timeout by default, and compares its tag with Application.version. Drafts and pre-releases are ignored.
- Windows: Install() downloads the asset ending with -Setup.exe to the temporary folder, runs it with /SILENT /SUPPRESSMSGBOXES /NOCANCEL /CLOSEAPPLICATIONS and quits. Without such an asset the release page opens.
- Android opens StoreUrl, or the .apk of the release, or the release page. iOS and other platforms open StoreUrl or the release page.
- ReleaseInfo: the parts of a GitHub release it needs (tag, name, notes, page and assets), read with JsonUtility, and FindAsset(suffix).
- SemVer: reads v1.2.3, 1.2 or 1.2.3-beta and compares the three numbers. A tag that cannot be read is never newer.

**API:**

| Member | What it does |
|---|---|
| `AutoUpdater.Repo / WindowsAssetSuffix / AndroidAssetSuffix / StoreUrl / TimeoutSeconds` | Where the releases are and how to recognise the installer. The suffixes default to -Setup.exe and .apk. |
| `AutoUpdater.Check()` | Asks GitHub for the latest release. Safe to call again; a check or download already running is left alone. |
| `AutoUpdater.Install()` | Moves the player to the new version. Does nothing unless State is Available. |
| `AutoUpdater.State / Latest / Progress / Error / Changed` | Where the update is, the release found, the download progress from 0 to 1, a failure message, and an event for each change. |
| `SemVer.IsNewer(latest, current)` | True when the first version is higher than the second, for tags such as v0.4.0. |
| `ReleaseInfo.FromJson(json) / FindAsset(suffix)` | Reads a GitHub release, or null if it is not one, and finds the first asset whose name ends with the suffix. |

**Example:**

```csharp
using ITKamianets.Engine.Update;
using UnityEngine;

var updater = new GameObject("AutoUpdater").AddComponent<AutoUpdater>();
updater.Repo = "WebArtWork/hippodrome.temnorid.com";
updater.Changed += () =>
{
    if (updater.State == UpdateState.Available) Debug.Log("Update to " + updater.Latest.Version);
    if (updater.State == UpdateState.Downloading) Debug.Log("Downloaded " + updater.Progress);
};
updater.Check();

// When the player agrees:
updater.Install();

bool newer = SemVer.IsNewer("v0.4.0", Application.version);
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-update.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6
- com.unity.modules.unitywebrequest 1.0.0, resolved by the Package Manager
- com.unity.modules.jsonserialize 1.0.0, resolved by the Package Manager

### 3d-unity-net

A small multiplayer layer over Netcode for GameObjects for games that build their scenes in code: host or join by address or online code.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-net` |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | [`3d-unity-shell`](#3d-unity-shell) |
| Repository | https://github.com/IT-Kamianets/3d-unity-net |
| Page | https://3d.itkamianets.com/packages/3d-unity-net |

**Purpose.** A game that builds its scenes in code has no prefabs to spawn over the network. NetSession gives it a host-authoritative session with a roster, named events, player poses and host-published entities, and nothing more. The host decides and clients ask. IsAuthority is true offline and on the host, so single-player code runs as it is.

**Usage.** Get the session with NetSession.Ensure() and set GameId, GameVersion, MaxPlayers and LocalName. Host with HostDirect() or HostOnlineAsync(), and join with JoinDirect(address) or JoinOnlineAsync(code). Watch RosterChanged, call SetReady, and on the host call StartGame(scene) once AllReady. In the game, pass things with Send and On, publish your own pose with PublishPose a few times a second and show the others with TryGetPose and RemoteBody. The host publishes what it simulates with PublishEntities about ten times a second. Run enemies, spawns and score only where IsAuthority is true. Online play needs the Unity project linked to a Unity Cloud project.

**Includes:**

- HostDirect() opens a game on this machine (port 7777) and JoinDirect(address) joins it. LocalAddress() gives the address to share.
- HostOnlineAsync() and JoinOnlineAsync(code) do the same through Unity Relay with a short code, so no port has to be opened. Without a linked Unity Cloud project they fail with a plain message and direct play still works.
- Roster: Players with name, colour and ready flag, SetReady, AllReady and StartGame(scene, seed), which closes the game to newcomers and tells everyone to load the scene with a shared seed.
- Joining is checked on the host: same GameId and same major.minor version, the game not full and not started.
- Events: Send(name, payload) and On(name, handler). A client's event reaches the host, which raises it and passes it on, except names starting with host. SendTo sends to one player from the host.
- Poses: PublishPose(NetPose) with position, yaw, speed, a state and two numbers of the game's own. Others read TryGetPose(id) and show it with RemoteBody.
- Entities: the host calls PublishEntities(list) for what it simulates, in batches of 28. Clients read Entities, EntityUpdated and EntityGone, and RemoveEntity(id) tells everyone one is gone.
- RemoteBody eases an object toward the last pose or entity state, and snaps to it when the jump is more than 12 metres.

**API:**

| Member | What it does |
|---|---|
| `NetSession.Ensure() / Instance` | The one session object a game talks to. Set GameId, GameVersion, MaxPlayers, LocalName and LocalColour on it. |
| `HostDirect(port) / JoinDirect(address)` | Opens a game on this machine, or joins one by address such as 192.168.1.5. The default port is 7777. |
| `HostOnlineAsync() / JoinOnlineAsync(code)` | The same through Unity Relay. After HostOnlineAsync, JoinCode holds the short code to share. |
| `Players / Local / SetReady(ready) / AllReady / StartGame(scene, seed)` | The roster and the start. StartGame is host only and raises GameStarted on every machine. |
| `Send(name, payload) / SendTo(player, name, payload) / On(name, handler) / Off(name, handler)` | Named string events between players, through the host. |
| `PublishPose(pose) / TryGetPose(id, out pose)` | Publishes where this player is, and reads where another player is. |
| `PublishEntities(list) / RemoveEntity(id) / Entities` | Host only: sends what the host simulates, or removes one. Clients read Entities, EntityUpdated and EntityGone. |

**Example:**

```csharp
using ITKamianets.Engine.Net;
using UnityEngine;

var net = NetSession.Ensure();
net.GameId = "hippodrome";
net.GameVersion = Application.version;
net.MaxPlayers = 4;
net.LocalName = "Ada";

net.HostDirect();   // friends join with net.JoinDirect(NetSession.LocalAddress())
net.RosterChanged += () => Debug.Log(net.Players.Count + " players");
net.SetReady(true);
if (net.AllReady) net.StartGame("Main");

net.On("lap", (sender, payload) => Debug.Log(sender + ": lap " + payload));
net.Send("lap", "3");

net.PublishPose(new NetPose { Position = transform.position, Yaw = transform.eulerAngles.y });
ulong other = 1;
if (net.TryGetPose(other, out var pose)) remote.Apply(pose);   // remote is a RemoteBody
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-net.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6
- com.unity.netcode.gameobjects 2.9.2, resolved by the Package Manager
- com.unity.services.multiplayer 2.4.1, resolved by the Package Manager

## Specific

Editing tools, devices, platforms and services that only some games need.

### 3d-unity-interaction

Scene editing: select, move, rotate, scale, duplicate and delete objects, with snapping and undo.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-interaction` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-interaction |
| Page | https://3d.itkamianets.com/packages/3d-unity-interaction |

**Purpose.** Apps that let people change a scene need the same editing tools: level editors, room layouts, track builders. This package gives them once, on top of the objects that 3d-unity-scene loads. It holds no product rules and does not read devices: input comes through 3d-unity-input.

**Usage.** Add a SceneEditor and set its Scene to a LoadedScene from SceneLoader. Add SceneEditorInput for mouse, keyboard and gamepad controls, and SelectionHighlight to draw a box around the selection. Listen to Changed and save the result with SceneSaver.CaptureJson. Tools, tests or VR controllers can call SceneEditor methods directly, without SceneEditorInput.

**Includes:**

- Selection: single, additive and toggle, plus picking the scene object under a ray.
- Move, rotate around the selection's pivot on the vertical axis, and scale around the pivot.
- Duplicate with new ids and the original scene data, one grid step away; delete hides objects so undo can restore them.
- Grid, rotation and surface snapping: a dragged object rests on whatever surface is under it.
- Dragging on a horizontal plane with a ray, recorded as one undo step, and cancellable.
- Undo and redo history of up to 200 steps, with SelectionChanged and Changed events.
- Default controls: click selects, Shift adds, drag moves, R and Shift+R rotate, Delete, Ctrl+D, Ctrl+Z, Ctrl+Y, Escape; gamepad shoulders rotate.

**API:**

| Member | What it does |
|---|---|
| `SceneEditor.Scene` | The LoadedScene being edited; when empty, any SceneObject under the picked collider can be edited. |
| `SceneEditor.Pick(ray, maxDistance)` | Returns the scene object under a ray, or null. |
| `SceneEditor.Select(target, additive)` | Selects an object, replacing the selection or adding to it; Toggle and ClearSelection change it further. |
| `SceneEditor.Move(delta) / Rotate(degrees) / Scale(factor)` | Changes the selection as one undo step, with grid and rotation snapping when they are on. |
| `SceneEditor.Duplicate() / Delete()` | Copies the selection with new ids and selects the copies, or hides the selection so undo can restore it. |
| `SceneEditor.BeginDrag(ray) / UpdateDrag(ray) / EndDrag()` | Moves the selection with a pointer ray and records the whole drag as one undo step; CancelDrag puts it back. |
| `SceneEditor.Undo() / Redo()` | Steps back or forward through the edit history. |
| `SceneEditor.GridSize, RotationStep, SnapToGrid, SnapRotation, SnapToSurface` | Snapping settings: 0.5 m grid and 15 degree steps by default, all on. |
| `SceneEditor.Changed` | Raised after any change, including undo and redo, with the command's name. |
| `SceneEditorInput` | Mouse, keyboard and gamepad controls for a SceneEditor through an Editor map in EngineInput. |
| `SelectionHighlight` | Draws a box around each selected object, sized to its renderers or colliders. |
| `IEditCommand / UndoHistory` | One undoable change, and the history that runs, records, undoes and redoes such changes. |

**Example:**

```csharp
var editor = gameObject.AddComponent<SceneEditor>();
editor.Scene = SceneLoader.Load(json);
editor.GridSize = 0.5f;
editor.RotationStep = 15f;
gameObject.AddComponent<SceneEditorInput>();
gameObject.AddComponent<SelectionHighlight>();

editor.Changed += change =>
{
    EngineLog.Info("Editor", change);
    saved = SceneSaver.CaptureJson(editor.Scene);
};
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-interaction.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene` → `3d-unity-input`.

Requirements:

- Unity 6000.6
- com.unity.modules.physics 1.0.0, resolved by the Package Manager

### 3d-unity-spatial

Turns a Meta Quest room scan into a scene, measures scanned rooms and builds them as solid geometry.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-spatial` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-spatial |
| Page | https://3d.itkamianets.com/packages/3d-unity-spatial |

**Purpose.** It connects the engine to the real room around the user and stores that room as engine-independent scene data in 3d-scene-schema form. XR hardware and controllers belong to 3d-unity-xr; this package only deals with the physical space. It holds no product logic.

**Usage.** Add a RoomScanner, subscribe to ScanCompleted and ScanFailed, and call StartScan on a Quest with MR Utility Kit installed. The resulting SceneData can be saved, uploaded or measured with RoomMetrics.Measure. RoomLoader.Load builds any stored scan in Unity, with or without a headset.

**Includes:**

- RoomScanner: asks for the Quest Scene API permission, loads the current room through MR Utility Kit and converts it into one SceneData.
- Each room anchor becomes a scene object with position, rotation, a plane boundary or a volume, under one ROOM object.
- MrukLabelMap: maps MR Utility Kit labels to schema labels: floor, ceiling, walls, doors, windows, furniture, screens, lamps, plants, wall art.
- RoomMetrics.Measure: floor area, ceiling height, overall bounds, and counts of walls, doors, windows and objects per label.
- RoomLoader.Load: builds a scanned room as visible, solid geometry; invisible walls collide but are not drawn.
- RoomLoader.FloorHeight: the floor's world height, to stand a player on it.

**API:**

| Member | What it does |
|---|---|
| `RoomScanner.StartScan()` | Requests the Scene API permission if needed, then loads the current room through MR Utility Kit. |
| `RoomScanner.ScanCompleted` | Raised with the room as a SceneData when the scan is converted. |
| `RoomScanner.ScanFailed` | Raised with a reason: permission denied, no room found, or MR Utility Kit not installed. |
| `MrukLabelMap.ToSemanticLabel(anchor)` | Maps an MR Utility Kit anchor's label to the schema's SemanticLabel, or OTHER; compiled only with MR Utility Kit. |
| `RoomMetrics.Measure(scene)` | Measures a scanned room from its SceneData. |
| `RoomMetrics.FloorArea, CeilingHeight, Bounds` | Floor area in square meters, floor-to-ceiling height in meters (0 when missing), and a box around everything in Unity world space. |
| `RoomMetrics.Walls, Doors, Windows, Objects` | Counts of walls, doors and windows, and of detected objects per SemanticLabel. |
| `RoomLoader.Load(room, parent, surfaceMaterial, assets)` | Builds a room through SceneLoader with surfaces and colliders and returns the LoadedScene. |
| `RoomLoader.Load(room, out metrics, parent, surfaceMaterial)` | Measures and builds a room in one call. |
| `RoomLoader.FloorHeight(room)` | Returns the world height of a loaded room's floor, or 0 when it has no floor. |

**Example:**

```csharp
var scanner = gameObject.AddComponent<RoomScanner>();
scanner.ScanFailed += reason => EngineLog.Warning("Spatial", reason);
scanner.ScanCompleted += room =>
{
    var loaded = RoomLoader.Load(room, out var metrics);
    EngineLog.Info("Spatial", $"{metrics.FloorArea:0.0} m2, ceiling {metrics.CeilingHeight:0.00} m");
    player.position = new Vector3(0f, RoomLoader.FloorHeight(loaded), 0f);
};
scanner.StartScan();
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-spatial.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene`.

Requirements:

- Unity 6000.6

Optional:

- Meta XR MR Utility Kit (com.meta.xr.mrutilitykit): lets RoomScanner load the current Meta Quest room and convert it into a scene; without it StartScan reports that scanning is unavailable.

### 3d-unity-xr

VR for a character: a headset rig on a character motor, comfort settings, a VR/flat mode switch and world-space status.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-xr` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character) |
| Used by | [`3d-constructor-vr-controls`](#3d-constructor-vr-controls) |
| Repository | https://github.com/IT-Kamianets/3d-unity-xr |
| Page | https://3d.itkamianets.com/packages/3d-unity-xr |

**Purpose.** It handles how people play in a 3D world through an XR headset, with Meta Quest as the first target: the headset camera and hands ride on a CharacterMotor, so the same character, network and bots work in VR. It is vendor-neutral: no Meta SDK and no XR plug-in inside; the project picks the runtime (OpenXR). Understanding the physical room belongs to 3d-unity-spatial, and what the controllers do belongs to the constructor’s controls, for example 3d-constructor-vr-controls. It holds no product logic.

**Usage.** Add an XRCharacterRig to the player next to its CharacterMotor: it builds an XR origin with the headset as the main camera and two hand anchors, and follows the motor. Put XRModeSwitch on the player to turn the VR components on while XRStatus.IsActive and the flat ones otherwise. Read comfort choices from XRComfort.Current, and add a ComfortVignette to darken the view while moving. Use XRHeadDriver for a menu camera without a rig. Put a StatusHud on a world-space canvas for a floating status, and read XRStatus to know whether a headset is active.

**Includes:**

- XRCharacterRig: the VR view of a CharacterMotor. The headset becomes the main camera, two hand anchors give aim poses (TryGetHandRay), and the rig follows the motor.
- Room-scale: the player’s own steps come back as HeadOffset and the controls walk the body after them, so walls still block; the standing height maps to the character’s eyes (Recenter) and real crouching lowers the view.
- Snap turn (30° by default) or smooth turn around the head, a respawn or blink re-faces the rig, and the view follows the body with a 25 ms smoothing that hides a 60 Hz network tick on a 72–120 Hz headset.
- XRComfort: snap or smooth turning, snap angle, turn speed and comfort vignette on or off with its strength, saved per player.
- ComfortVignette: darkens the edges of the view while moving with the stick, with no extra shader in builds.
- XRModeSwitch: enables the VR set of components while a headset runs and the flat set otherwise; as an owner-only component of a networked player it leaves other copies without controls.
- XRHeadDriver: for a scene camera without a rig, such as behind a main menu: the camera follows the headset and both controllers show a pointer ray.
- XRVisuals: controller markers and pointer rays, and the tracking origin for world-space UI so controllers can point at canvases.
- XRStatus: whether a headset (or the XR Interaction Toolkit’s simulated one) is active, the XR plug-in in use and the headset model.
- XRPrimaryButtonAction: fires OnPressed once per press of any EngineInput action, by default Player/Jump, the right controller’s A button.
- StatusHud: world-space text set with SetStatus, optionally following the view, level and eased, instead of being fixed to the head.

**API:**

| Member | What it does |
|---|---|
| `XRCharacterRig` | Component on the player next to its CharacterMotor that builds the XR origin, the headset camera and two hand anchors. |
| `XRCharacterRig.TryGetHandRay(hand, out ray)` | The aim ray of a hand in world space; false when that controller is not tracked. |
| `XRCharacterRig.HeadOffset / Recenter()` | How far the player has stepped in the room, which the controls walk the body after; Recenter maps the standing height to the character’s eyes. |
| `XRComfort.Current` | The player’s saved comfort settings: SnapTurn, SnapAngle, SmoothTurnSpeed, Vignette and VignetteStrength; call Save() after a change. |
| `ComfortVignette` | Darkens the view edges while the player moves with the stick. |
| `XRModeSwitch` | Turns the VR components on while a headset runs and the flat ones otherwise. |
| `XRHeadDriver` | Drives a scene camera from the headset where there is no rig, such as behind a main menu. |
| `XRPrimaryButtonAction.OnPressed` | UnityEvent raised once per press of the chosen action. |
| `XRPrimaryButtonAction.Action` | The action as "Map/Action" in EngineInput, such as Player/Jump (A), Player/Primary (trigger) or UI/Pause (menu). |
| `StatusHud.SetStatus(message)` | Sets the displayed text. |
| `StatusHud.FollowView` | When on, the display eases to a spot 1.5 m in front of the view and slightly below eye height. |
| `XRStatus.IsActive` | True when a headset runs, or a simulated one is connected; game code picks VR or flat layouts from it. |
| `XRStatus.IsHeadsetActive` | True when the game runs in an active headset; false on PC without one. |
| `XRStatus.DeviceName / HeadsetModel` | The XR plug-in in use, such as OpenXR Display, and the headset model when known, such as Oculus Quest 3. |

**Example:**

```csharp
var rig = player.AddComponent<XRCharacterRig>();      // headset camera + hands on the character
player.AddComponent<XRModeSwitch>();                  // VR components in a headset, flat ones otherwise

if (rig.TryGetHandRay(HandSide.Right, out var ray)) { /* world-space aim */ }

XRComfort.Current.SnapTurn = false;                   // smooth turning, saved for this player
XRComfort.Current.Save();

if (XRStatus.IsActive) { /* show the wrist HUD instead of the screen HUD */ }
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-xr.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input` → `3d-unity-character`.

Requirements:

- Unity 6000.6
- com.unity.inputsystem 1.20.0, resolved by the Package Manager
- com.unity.ugui 2.6.0, resolved by the Package Manager
- com.unity.modules.xr 1.0.0, resolved by the Package Manager

### 3d-unity-firebase

Firebase over its REST API: sign-in, player profiles, saved progress and stored scenes.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-firebase` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-firebase |
| Page | https://3d.itkamianets.com/packages/3d-unity-firebase |

**Purpose.** Games use this package instead of writing their own Firebase integration. It talks to Firebase Authentication and Cloud Firestore over HTTPS, so the same code runs on Windows, a dedicated server, Android and iOS with no native SDK. It knows no project: the game passes its config and deploys its own security rules, and this package keeps no config or rules.

**Usage.** Read the project id and API key with FirebaseConfig.FromGoogleServicesJson, then call EngineFirebase.Initialize(config) once. Sign in with Auth.SignInAsync(), which returns the same player on this device every time. Then save and load the profile, progress by key and Scene JSON through EngineFirebase, or work with any document through Firestore.

**Includes:**

- FirebaseConfig.FromGoogleServicesJson: the project id and API key from the game's google-services.json.
- Anonymous sign-in. The refresh token is kept in EngineStorage, so the device signs back in as the same Uid.
- ID tokens that refresh themselves before they expire, plus SignOut and SignedIn and SignedOut events.
- Firestore get, set, merge, delete and list with plain JSON in and out; Firestore's typed values are converted inside.
- The player's profile at users/{uid}, merged field by field and stamped with updatedAt.
- Saved progress at users/{uid}/progress/{key}: any object saved as JSON and loaded back as its type.
- Scenes at scenes/{sceneId}: the whole Scene JSON with its owner, schema version and update time; save, load, list and delete.

**API:**

| Member | What it does |
|---|---|
| `FirebaseConfig.FromGoogleServicesJson(json)` | Reads the project id and API key from a google-services.json file. |
| `EngineFirebase.Initialize(config)` | Creates the Firebase instance and registers it in EngineServices. |
| `EngineFirebase.Current` | The instance made by Initialize, or null. |
| `Auth.SignInAsync()` | Signs back in as this device's player, or creates an anonymous account the first time. |
| `Auth.Uid / Auth.IsSignedIn` | The signed-in player's id, and whether anyone is signed in. |
| `Auth.SignOut()` | Forgets this device's account; its data stays in Firebase. |
| `SaveProfileAsync(fields) / LoadProfileAsync()` | Merges fields into the player's profile, or reads it as JSON. |
| `SaveProgressAsync<T>(key, value) / LoadProgressAsync<T>(key, fallback)` | Saves an object under a key, or loads it back with a fallback when none is saved. |
| `SaveSceneAsync(scene) / LoadSceneAsync(sceneId)` | Stores a SceneData owned by the signed-in player, or loads a stored scene. |
| `ListScenesAsync(limit) / DeleteSceneAsync(sceneId)` | Lists stored scenes with their owners and update times, or deletes one. |
| `Firestore.GetAsync / SetAsync / MergeAsync / DeleteAsync / ListAsync` | Reads and writes any Firestore document by path with plain JSON. |
| `FirebaseException.Status` | The HTTP status of a failed call, such as 403 when the rules deny it. |

**Example:**

```csharp
var config = FirebaseConfig.FromGoogleServicesJson(googleServicesJson.text);
var firebase = EngineFirebase.Initialize(config);
await firebase.Auth.SignInAsync();

await firebase.SaveProfileAsync(new JObject { ["displayName"] = "Ira" });
await firebase.SaveProgressAsync("stats", new { matches = 12, wins = 7 });
var profile = await firebase.LoadProfileAsync();

await firebase.SaveSceneAsync(SceneSaver.Capture(level));
var scenes = await firebase.ListScenesAsync();
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-firebase.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene`.

Requirements:

- Unity 6000.6
- com.unity.nuget.newtonsoft-json 3.2.2, resolved by the Package Manager
- com.unity.modules.unitywebrequest 1.0.0, resolved by the Package Manager

### 3d-unity-network

Real-time multiplayer on Netcode: sessions, server-authoritative characters, schema messages.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-network` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-character`](#3d-unity-character), [`3d-network-schema`](#3d-network-schema) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-network |
| Page | https://3d.itkamianets.com/packages/3d-unity-network |

**Purpose.** The server decides what happened; clients send input and show the result, so editing the client cannot cheat. The package holds no game rules: it syncs players and the session, so a team arena, a co-op game and a shared VR room use the same networking. Accounts and saved data between matches belong to 3d-unity-firebase.

**Usage.** Put one NetworkSession in the first scene with a player prefab (NetworkObject, CharacterMotor and NetworkCharacter, with the controls listed as owner-only). Start it with StartHost, StartServer or StartClient(address), or from the command line. On the server, drive the session through NetworkSession.Messages: SetState, Publish game events, End with a result and CreateReplay.

**Includes:**

- NetworkSession: host, dedicated server and client on Netcode for GameObjects and Unity Transport, set up on its own object.
- Command-line start with -server, -host, -client <address>, -port <port> and -name <name>, so servers and test clients need no UI.
- NetworkCharacter: the owner predicts its CharacterMotor each tick, and the server applies the commands in order without guessing late ones.
- Reconciliation: beyond 5 cm the owner returns to the server's state, jump timers included, and replays its newer commands.
- Other players shown 3 ticks in the past, interpolated between server results; owner-only components switched off on their copies.
- SessionChannel: the session in 3d-network-schema form with gapless seq numbers, joins, leaves, state changes, teams and game events.
- Results and replays: End(result) sends session.ended, and the server records a replay from the moment the session runs.

**API:**

| Member | What it does |
|---|---|
| `NetworkSession.Current` | The session component in the scene. |
| `StartHost() / StartServer() / StartClient(address) / Stop()` | Starts a host, a dedicated server with no local player, or a client, and stops it. |
| `NetworkSession.StartFromCommandLine(args)` | Starts a session from -server, -host, -client, -port and -name flags. |
| `Started / Stopped / PlayerJoined / PlayerLeft` | Events for the session's lifecycle and for clients joining and leaving. |
| `NetworkSession.Role / TickRate` | Whether this side is offline, host, server or client, and the simulation steps per second. |
| `NetworkCharacter` | Runs a CharacterMotor with server authority, client prediction, reconciliation and interpolation. |
| `NetworkSession.Messages (SessionChannel)` | The session in 3d-network-schema form, kept in sync over Netcode named messages. |
| `SessionChannel.SetState(state, sceneId)` | Moves the session through lobby, starting, running and ended, optionally choosing its scene. |
| `SessionChannel.Publish(type, payload, tick)` | Server: sends everyone a numbered message, such as a game event named <game>.<name>. |
| `SessionChannel.Request(type, payload) / RequestReceived` | A client asks for a game event; the server decides in RequestReceived whether to publish it. |
| `SessionChannel.End(result) / CreateReplay()` | Ends the session with a ResultData, and builds the replay document. |
| `SetTeams(teams) / AssignTeam(playerId, teamId)` | Sets the teams or puts a player in one, and sends everyone a fresh snapshot. |

**Example:**

```csharp
var session = NetworkSession.Current;
session.StartHost();

session.Messages.RequestReceived += request => session.Messages.Publish(request.Type, request.Payload);
session.Messages.SetState(SessionState.Running, "arena-01");

session.Messages.End(new ResultData
{
    EndedAt = NetworkJson.Now(),
    Reason = ResultReason.Completed,
    Winners = { SessionChannel.PlayerIdFor(0) },
});
string replay = NetworkJson.Serialize(session.Messages.CreateReplay());
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-network.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-character`.

Requirements:

- Unity 6000.6
- com.unity.netcode.gameobjects 2.13.3, resolved by the Package Manager
- com.unity.nuget.newtonsoft-json 3.2.2, resolved by the Package Manager

### 3d-unity-combat

Generic combat: health with damage and death events, teams, projectiles, and melee cone and area attacks.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-combat` |
| Version | 0.2.0 |
| Depends on | nothing |
| Used by | [`3d-unity-feedback`](#3d-unity-feedback) |
| Repository | https://github.com/IT-Kamianets/3d-unity-combat |
| Page | https://3d.itkamianets.com/packages/3d-unity-combat |

**Purpose.** Games with fights keep rewriting the same small core: hit points, who may hurt whom, a swing in front of you, a blast around a point. This package holds that core once. It has no classes, spells, weapons, loot, experience, UI or networking: what a hit means and how hard it is stays in the game.

**Usage.** Add a Health to every hero, monster or crate that can be hurt and set its MaxHealth and Team. To attack, call CombatQueries.DamageInCone for a melee swing or DamageInRadius for an area, passing your own team and a DamageInfo; for an arrow or a fireball call Projectile.Launch. Listen to Health.Damaged and Health.Died to play animations, sounds and effects.

**Includes:**

- Health: hit points that start full, with MaxHealth, Current, Fraction (0 to 1, for a bar), IsAlive, Heal and Restore.
- ApplyDamage(DamageInfo) answers Damaged, Killed or Ignored; Damaged is raised after a hit that does not kill and Died once, when health reaches zero.
- DamageInfo carries the amount, an optional source object, the hit point and a free-form type label such as melee or fire.
- Teams are plain numbers chosen by the game; attacks skip targets on the attacker's own team and targets that are already dead.
- CombatQueries: DamageInCone is a melee swing judged on the ground plane, DamageInRadius an area attack, and FindInCone and FindInRadius return the targets without hurting them. Each target is hit once per attack.
- Projectile.Launch starts a straight-flying projectile that hurts the first enemy it meets, flies through its own team and the dead, and is destroyed on the world or after its range.
- IDamageable describes the same contract as an interface, for targets that are not a Health.

**API:**

| Member | What it does |
|---|---|
| `Health` | Hit points of anything that can be hurt, with MaxHealth, Team, Current, Fraction and IsAlive. |
| `Health.ApplyDamage(DamageInfo)` | Lowers health and returns Ignored (already dead or no damage), Damaged or Killed. |
| `Health.Heal(amount) / Restore()` | Heal adds health up to the maximum and does nothing to the dead; Restore brings the character back to full health, alive again. |
| `Health.Damaged / Health.Died` | Events raised with the Health and the DamageInfo: Damaged after a hit that does not kill, Died once when health reaches zero. |
| `DamageInfo` | One hit: Amount, Source, Point and a Type label the game can use to tell kinds of damage apart. |
| `CombatQueries.DamageInCone(origin, forward, range, halfAngle, team, info)` | A melee swing that hurts every enemy in range and within the half-angle on the ground plane, and returns how many were hit. |
| `CombatQueries.DamageInRadius(center, radius, team, info)` | An area attack that hurts every enemy in the radius and returns how many were hit. |
| `CombatQueries.FindInCone(...) / FindInRadius(...)` | Return the targets without hurting them, for aiming or a telegraph; the returned list is reused by the next query. |
| `Projectile.Launch(origin, direction, speed, range, radius, team, info, colour, visual)` | Starts a straight-flying projectile; with no visual it is a small sphere of the given colour. The Hit event is raised when it hurts someone. |
| `IDamageable` | Team, IsAlive and ApplyDamage as an interface, for targets that are not a Health. |

**Example:**

```csharp
var health = hero.AddComponent<Health>();
health.MaxHealth = 120f;
health.Team = 1;
health.Died += (h, info) => EngineLog.Info("Combat", "Hero died");

var info = new DamageInfo(18f, hero, type: "melee");
var hit = CombatQueries.DamageInCone(hero.transform.position, hero.transform.forward, 2.2f, 70f, health.Team, info);

Projectile.Launch(muzzle.position, hero.transform.forward, 18f, 25f, 0.25f, health.Team, info, Color.yellow);
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-combat.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6
- com.unity.modules.physics 1.0.0, resolved by the Package Manager

### 3d-unity-feedback

Cheap visual feedback for fights, made from primitives: pulses, rings, floor warnings and a health bar.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-feedback` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-combat`](#3d-unity-combat) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-feedback |
| Page | https://3d.itkamianets.com/packages/3d-unity-feedback |

**Purpose.** A fight needs to be readable before the art exists: where a blow lands, how big a shockwave is, how much health is left. This package draws that from Unity primitives, so it needs no models, textures or particle systems. What an effect means and when it plays is the game's business, and a game with real art replaces these without changing its gameplay.

**Usage.** Call Fx.Pulse where something happens, passing a primitive type, a position, the starting and ending size, a colour and a lifetime. Add HealthBar3D to an object that already has a Health from 3d-unity-combat to show a bar above it. The bar follows Camera.main.

**Includes:**

- Fx.Pulse creates a primitive without a collider that grows from one size to another and is destroyed after its lifetime.
- A flat cylinder growing is a ring on the floor: a shockwave, or a red warning that fills up before a heavy blow.
- A cube growing along one axis is a slash, and a small sphere is a hit spark.
- Fx.Material gives a plain lit material of one colour, made once and reused.
- HealthBar3D draws a bar above a character that faces the camera, shrinks with Health.Fraction and hides when the character dies.

**API:**

| Member | What it does |
|---|---|
| `Fx.Pulse(type, position, rotation, from, to, colour, life)` | Creates a collider-free primitive that scales from one size to another over its life, then destroys itself, and returns it. |
| `Fx.Material(colour)` | A plain lit material of one colour, made once and reused. |
| `FxPulse` | The component behind Fx.Pulse, with From, To and Life; it scales its object over time and then destroys it. |
| `HealthBar3D` | A bar above the character with a Height and a Width, which faces the main camera and hides when the Health is dead. |

**Example:**

```csharp
// A red ring on the floor that fills up over a second: a warning before a heavy blow.
Fx.Pulse(PrimitiveType.Cylinder, boss.position + Vector3.up * 0.05f, Quaternion.identity,
    new Vector3(0.5f, 0.02f, 0.5f), new Vector3(8f, 0.02f, 8f), new Color(0.9f, 0.1f, 0.1f), 1f);

// A health bar above a monster that already has a Health.
var bar = monster.AddComponent<HealthBar3D>();
bar.Height = 2.4f;
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-feedback.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-combat`.

Requirements:

- Unity 6000.6

### 3d-unity-ai

Generic bots: notice a target, chase it over a NavMesh, attack, give up and patrol.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-ai` |
| Version | 0.2.0 |
| Depends on | nothing |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-ai |
| Page | https://3d.itkamianets.com/packages/3d-unity-ai |

**Purpose.** Most action games need monsters that see you, run at you, hit you and eventually lose interest. This package gives that behaviour once, as one component next to a NavMeshAgent. How far a bot sees, how hard it hits and what an attack is stay with the game: the package has no monster types, no health and no loot.

**Usage.** Bake a NavMesh in the scene (for example with com.unity.ai.navigation). Add an AiTarget to whatever bots should hunt and keep its Alive flag up to date. Put an AiAgent on each bot next to its NavMeshAgent, set the senses and attack numbers, and handle AttackRequested to deal damage, play the animation or fire a projectile. Call Stop when the bot dies.

**Includes:**

- AiTarget marks what bots may hunt: a team number, an Alive flag the game keeps up to date and an eye height.
- AiAgent notices the nearest living AiTarget of another team inside SenseRadius, and walls block the view when RequireLineOfSight is on.
- It chases the target over the NavMesh, and inside AttackRange it stops, turns to face the target and raises AttackRequested every AttackCooldown seconds.
- It gives up when the target is dead or further than LoseRadius for LoseSeconds, then goes back home or on to its patrol points.
- Ranged attackers use AttackNeedsSight to close in until they see the target, and MinDistance to step back while still attacking (state Retreat).
- States are Idle, Patrol, Chase, Attack, Retreat and Dead; Stop switches the bot off, and ResetMind forgets the target after a respawn.
- Bots think on a staggered TickInterval (0.2 s by default), not every frame, so many bots stay cheap.

**API:**

| Member | What it does |
|---|---|
| `AiTarget` | Marks something bots may hunt, with Team, Alive and EyeHeight; every enabled AiTarget is listed in AiTarget.All. |
| `AiAgent.Team / SenseRadius / LoseRadius / LoseSeconds` | Who the bot is and how far it notices a target (12 m) and loses it (20 m, after 3 seconds). |
| `AiAgent.RequireLineOfSight / SightBlockers` | When on (the default), walls on the SightBlockers layers stop the bot from noticing a target through them. |
| `AiAgent.AttackRange / AttackCooldown` | The bot stops and asks to attack inside this ground distance (1.8 m), at most once per cooldown (1.2 s). |
| `AiAgent.AttackNeedsSight / MinDistance` | For ranged attackers: attack only a target in sight, and step back while the target is closer than MinDistance. |
| `AiAgent.TickInterval` | How often the bot looks around and replans, in seconds; higher is cheaper. |
| `AiAgent.PatrolPoints / PatrolWait` | Points the bot walks in a loop when nothing is happening, waiting at each. |
| `AiAgent.AttackRequested` | Raised with the agent and its target when the bot is in range and ready; do the damage in the handler. |
| `AiAgent.State / Target / Nav` | The current AiState, the target Transform (or null) and the NavMeshAgent. |
| `AiAgent.Stop() / ResetMind()` | Stop switches the bot off for good; ResetMind forgets the target and returns to Idle. |

**Example:**

```csharp
var agent = monster.GetComponent<AiAgent>();
agent.Team = 2;
agent.SenseRadius = 14f;
agent.AttackRange = 1.8f;
agent.AttackCooldown = 1.2f;

agent.AttackRequested += (bot, target) =>
{
    var health = target.GetComponentInParent<Health>();
    if (health != null) health.ApplyDamage(new DamageInfo(8f, bot.gameObject, target.position, "melee"));
};

monster.GetComponent<Health>().Died += (h, info) => agent.Stop();
player.AddComponent<AiTarget>().Team = 1;
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-ai.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6
- com.unity.modules.ai 1.0.0, resolved by the Package Manager
- com.unity.modules.physics 1.0.0, resolved by the Package Manager

### 3d-unity-inventory

Item containers: stackable items by id, slot and stack limits, transfers, and portable inventory data.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-inventory` |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-inventory |
| Page | https://3d.itkamianets.com/packages/3d-unity-inventory |

**Purpose.** Backpacks, warehouses and loot chests all do the same thing: hold counts of items in a fixed number of slots. This package is that container, and nothing about what an item is. Ids are the game's own strings, so one type serves wood and swords alike. Item definitions, recipes, prices, weights, UI and networking are the game's.

**Usage.** Create an ItemContainer with a slot count and a stack limit, add items by id with TryAdd or AddUpTo, and take them out with TryRemove. Move items between containers with ItemContainer.Transfer or TransferAll. Listen to Changed to redraw a UI. To save, store the result of ToData in your save file and restore it with FromData or Load.

**Includes:**

- ItemContainer has a fixed number of slots, each holding one kind of item up to the stack limit (99 by default).
- TryAdd and TryRemove are all or nothing and answer with an InventoryStatus: Ok, InvalidQuantity, NotEnoughSpace or NotEnoughItems.
- AddUpTo adds what fits and returns how many were added.
- Transfer and TransferAll move items from one container to another, as many as fit, and raise Changed on both.
- Count, SpaceFor, UsedSlots, TotalItems, IsEmpty and Items() read the contents, and Changed tells a UI when to redraw.
- ToData and FromData convert to InventoryData, which has the same fields as 3d-inventory-schema.
- Loading is forgiving: invalid entries are skipped and what does not fit is dropped, so a damaged save cannot break the container.

**API:**

| Member | What it does |
|---|---|
| `ItemContainer(slotCount, stackLimit)` | A container with a fixed number of slots and a stack limit (99 by default); both must be at least 1. |
| `ItemContainer.TryAdd(itemId, quantity) / TryRemove(itemId, quantity)` | Adds or removes all of it or nothing, and returns an InventoryStatus. |
| `ItemContainer.AddUpTo(itemId, quantity)` | Adds as much as fits and returns how many were added, which is 0 when the container is full. |
| `ItemContainer.Transfer(from, to, itemId, quantity)` | Moves up to the quantity from one container to another, as many as fit, and returns how many moved. |
| `ItemContainer.TransferAll(from, to)` | Moves everything that fits and returns how many items moved. |
| `ItemContainer.Count(itemId) / SpaceFor(itemId)` | How many of an item are held in all slots, and how many more would fit right now. |
| `ItemContainer.UsedSlots / TotalItems / IsEmpty / Items()` | Read the contents; Items() gives totals per item in the order they first appear. |
| `ItemContainer.Clear()` | Empties every slot. |
| `ItemContainer.Changed` | Raised after any change to the contents, including loading and clearing. |
| `ItemContainer.ToData() / FromData(data) / Load(data)` | Convert to and from the portable InventoryData; FromData makes a container of the saved size and Load replaces the contents of an existing one. |
| `InventoryData / ItemEntry` | The portable form with schemaVersion, slots, stackLimit and a list of itemId and quantity entries. |

**Example:**

```csharp
var backpack = new ItemContainer(6, 8);
backpack.Changed += () => EngineLog.Info("Inventory", backpack.TotalItems + " items");

var status = backpack.TryAdd("iron-sword", 1);
var gathered = backpack.AddUpTo("wood", 20);

var chest = new ItemContainer(12, 99);
ItemContainer.Transfer(backpack, chest, "wood", 10);

var saved = backpack.ToData();
var restored = ItemContainer.FromData(saved);
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-inventory.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6

## Constructor

The parts of a constructor: its camera, its controls, and a starter project.

### 3d-constructor-character-view-camera

First- and third-person camera that follows a character and owns where the player looks.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-constructor-character-view-camera` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character) |
| Used by | [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Repository | https://github.com/IT-Kamianets/3d-constructor-character-view-camera |
| Page | https://3d.itkamianets.com/packages/3d-constructor-character-view-camera |

**Purpose.** A game built from the Character View constructor gets a working camera without writing one. The camera reads look input from 3d-unity-input and follows a CharacterMotor from 3d-unity-character. It does not move the character: turning and camera-relative movement belong to 3d-constructor-character-view-controls, which reads the camera's Yaw and Pitch.

**Usage.** Add CharacterViewCamera to the camera object and set Target to the player's CharacterMotor. Tune it through CharacterViewCameraSettings: sensitivity, pitch limits, field of view, start view, third-person distance, shoulder offset and collision. Call SetLook on spawn and listen to ViewChanged to react to view switches. Use AimRay to aim from the middle of the screen in either view.

**Includes:**

- First-person camera at the character's eye position, which follows crouching.
- Over-the-shoulder third-person camera with a configurable distance and shoulder offset.
- Smooth switching between views with the ToggleView action, and a ViewChanged event.
- Camera collision: pulls in front of walls at once and eases back out.
- Hides the character's body in first person while it still casts shadows.
- Locks the mouse cursor during gameplay and frees it when a menu turns gameplay input off.
- AimRay through the middle of the screen for aiming in either view.

**API:**

| Member | What it does |
|---|---|
| `CharacterViewCamera` | Component on the camera object that follows a character in first or third person. |
| `CharacterViewCamera.Target` | The CharacterMotor to follow; setting it takes the character's current yaw. |
| `CharacterViewCamera.Yaw / Pitch` | Where the player looks, in degrees; the controls read them to turn and move the character. |
| `CharacterViewCamera.PlanarForward / PlanarRight` | The look direction flattened onto the ground: forward and right for movement. |
| `CharacterViewCamera.AimRay` | The ray through the middle of the screen, for aiming in either view. |
| `CharacterViewCamera.SetView(view)` | Switches to CameraView.FirstPerson or CameraView.ThirdPerson with a smooth move. |
| `CharacterViewCamera.SetLook(yaw, pitch)` | Points the view, for example on spawn; pitch is clamped to the settings. |
| `CharacterViewCamera.ViewChanged` | Event raised with the new CameraView when the view switches. |
| `CharacterViewCamera.LookEnabled` | Turn off to freeze the view, for example during a cutscene. |
| `CharacterViewCameraSettings` | Sensitivity, pitch limits, field of view, start view, distance, shoulder offset, collision and cursor locking. |

**Example:**

```csharp
var view = Camera.main.gameObject.AddComponent<CharacterViewCamera>();
view.Target = playerMotor;
view.Settings.FieldOfView = 80f;
view.SetLook(spawnYaw, 0f);
view.ViewChanged += v => Debug.Log($"View: {v}");

// Aim a spell through the middle of the screen
if (Physics.Raycast(view.AimRay, out var hit, 100f))
{
    Debug.Log($"Aiming at {hit.collider.name}");
}
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-constructor-character-view-camera.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input` → `3d-unity-character`.

Requirements:

- Unity 6000.6
- com.unity.modules.physics 1.0.0, resolved by the Package Manager

### 3d-constructor-character-view-controls

Turns player input into character commands: forward is where the camera looks, looking turns the character.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-constructor-character-view-controls` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera) |
| Used by | [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Repository | https://github.com/IT-Kamianets/3d-constructor-character-view-controls |
| Page | https://3d.itkamianets.com/packages/3d-constructor-character-view-controls |

**Purpose.** 3d-unity-character moves a character but does not decide where forward is. This package does, for first- and third-person games, and stays in sync with the camera when the player switches views. It only drives the local player: other players get the same commands from the network.

**Usage.** Add CharacterViewControls next to the local player's CharacterMotor. It finds the CharacterViewCamera on the main camera and sets itself as its target, or you assign View yourself. Each frame it reads actions from 3d-unity-input and sends a CharacterCommand to the motor; LastCommand holds that command for the network. Gameplay sets FaceCamera, for example while casting, and CharacterViewControlsSettings chooses turn speed, aiming and sprint or crouch toggles.

**Includes:**

- Camera-relative movement: forward is the camera's PlanarForward.
- First person: the character always faces the camera and strafes.
- Third person: the character turns toward where it walks; while aiming with Secondary or with FaceCamera set, it faces the camera and strafes.
- Sprint by holding or toggling (toggle by default on gamepad), forward only while facing the camera, and it stops when the player stops.
- Crouch by holding or toggling.
- With gameplay input off, for example when a menu is open, the character stands still.
- LastCommand: the command sent this frame, for the network to send to the server.

**API:**

| Member | What it does |
|---|---|
| `CharacterViewControls` | Component next to the local player's CharacterMotor that turns input into a CharacterCommand. |
| `CharacterViewControls.View` | The CharacterViewCamera that defines forward; empty means the one on the main camera. |
| `CharacterViewControls.FaceCamera` | Set by gameplay, for example while casting, to make the character face the camera in third person. |
| `CharacterViewControls.IsAiming` | True while the player holds Secondary to aim. |
| `CharacterViewControls.LastCommand` | The command sent to the motor this frame; the network sends the same one to the server. |
| `CharacterViewControlsSettings.TurnSpeed` | How fast the character turns toward where it walks in third person, in degrees per second. |
| `CharacterViewControlsSettings.AimWithSecondary` | Hold Secondary to aim: in third person the character faces the camera and strafes. |
| `CharacterViewControlsSettings.SprintToggle / SprintToggleOnGamepad` | Make sprint a toggle instead of a hold, separately for gamepad. |
| `CharacterViewControlsSettings.SprintForwardOnly` | Sprint only while moving forward, not sideways or backwards. |
| `CharacterViewControlsSettings.CrouchToggle` | Crouch stays on after one press until pressed again. |

**Example:**

```csharp
var controls = player.AddComponent<CharacterViewControls>();
controls.View = Camera.main.GetComponent<CharacterViewCamera>();
controls.Settings.CrouchToggle = true;

// While casting, the mage faces where the camera looks
controls.FaceCamera = true;

// Each frame the network can send what the player did
CharacterCommand command = controls.LastCommand;
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-constructor-character-view-controls.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input` → `3d-unity-character` → `3d-constructor-character-view-camera`.

Requirements:

- Unity 6000.6

### 3d-constructor-vr-controls

Turns XR controllers into character commands: walk where you look, turn with the stick, crouch for real.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-constructor-vr-controls` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-xr`](#3d-unity-xr) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-constructor-vr-controls |
| Page | https://3d.itkamianets.com/packages/3d-constructor-vr-controls |

**Purpose.** 3d-unity-character moves a character but knows nothing about headsets. This package is the VR counterpart of 3d-constructor-character-view-controls: it reads the headset and controllers through 3d-unity-input and 3d-unity-xr and sends the same CharacterCommand, so the motor, the network and bots do not care which device made it, and VR players play with flat-screen players. It holds no game rules.

**Usage.** Add XRCharacterRig, VRControls and HandAim to the player next to its CharacterMotor. VRControls reads the head and the controllers each frame and sends a CharacterCommand to the motor; LastCommand holds it for the network. Gameplay reads HandAim as an IAimSource to aim from the casting hand, and uses OffHand for a wrist menu. VRControlsSettings chooses whether walking follows the head or the off hand, the sprint and crouch toggles and the room-step dead zone.

**Includes:**

- Walking with the left stick relative to the head, or to the off hand.
- Yaw follows the head, so the body faces where you look.
- Stepping in the room walks the body after the head (5 cm dead zone), so walls still block.
- Jump, sprint and crouch; sprint and crouch are toggles, and crouching for real below 75% of standing eye height crouches the character.
- HandAim: the aim ray of the dominant hand as an IAimSource, with OffHand for a wrist menu.
- LastCommand: the command sent this frame, for the network to send to the server.

**API:**

| Member | What it does |
|---|---|
| `VRControls` | Component next to the local player’s CharacterMotor that turns the head and controllers into a CharacterCommand. |
| `VRControls.LastCommand` | The command sent to the motor this frame; the network sends the same one to the server. |
| `VRControlsSettings.MoveRelativeTo` | Whether the stick walks relative to the head or to the off hand. |
| `VRControlsSettings.SprintToggle / CrouchToggle` | Make sprint and crouch toggles instead of holds. |
| `VRControlsSettings.CrouchByHeadBelow` | Crouch the character when the head drops below this share of standing eye height. |
| `VRControlsSettings.FollowDeadZone` | How far the head may step in the room before the body follows, in meters. |
| `HandAim` | Component exposing the aim ray of the dominant hand as an IAimSource. |
| `HandAim.OffHand` | The other hand, for a wrist menu. |

**Example:**

```csharp
player.AddComponent<XRCharacterRig>();
var controls = player.AddComponent<VRControls>();
var aim = player.AddComponent<HandAim>();

controls.Settings.CrouchToggle = true;

// Gameplay aims from the casting hand without knowing about XR
if (aim.TryGetAimRay(out Ray ray)) { /* cast along ray */ }

// Each frame the network can send what the player did
CharacterCommand command = controls.LastCommand;
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-constructor-vr-controls.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input` → `3d-unity-character` → `3d-unity-xr`.

Requirements:

- Unity 6000.6

### 3d-constructor-character-view-template

Starter Unity project for first- and third-person games with a test level and a playable character.

| | |
|---|---|
| Kind | Unity project |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-constructor-character-view-template |
| Page | https://3d.itkamianets.com/packages/3d-constructor-character-view-template |

**Purpose.** A new game starts from this template, not from an empty project. The engine packages, the character, the camera and the controls are already set up, so the team writes only what makes the game unique: rules, levels and art. It holds no game code: everything that moves the player lives in packages, so a game gets fixes by updating package versions.

**Usage.** Copy the repository into a folder named after the game and open it with Unity 6000.6. Press Play in the Playground scene to try the controls in first and third person. Rename the product and package identifier, then build levels and the player's look on top of Player.prefab and add the game's own packages next to the engine ones.

**Includes:**

- Unity 6000.6 project with URP and PC and mobile render settings.
- Packages/manifest.json lists every com.itkamianets package by git URL, including indirect ones.
- Playground scene: steps, a walkable 30° ramp, a 60° ramp that slides, a low tunnel to crouch through, a wall for camera collision, a crate and a platform to jump on.
- Player.prefab: CharacterController, CharacterMotor and CharacterViewControls with a capsule body and a nose that shows the facing.
- The main camera carries CharacterViewCamera.
- Input comes only from 3d-unity-input; there is no project-wide input actions asset.
- Player setting Run In Background is on.

**API:**

| Member | What it does |
|---|---|
| `Assets/Scenes/Playground.unity` | The build scene: a test level for walking, slopes, crouching, jumping and camera collision. |
| `Assets/Prefabs/Player.prefab` | The player: CharacterController, CharacterMotor and CharacterViewControls with a capsule body. |
| `Main Camera (Playground)` | Scene camera with CharacterViewCamera, which the controls find and target at start. |
| `Packages/manifest.json` | Engine packages by git URL plus Input System, URP, uGUI and AI Navigation. |
| `Assets/Settings/` | URP assets and renderers for PC and mobile, and the default volume profile. |
| `ProjectSettings/ProjectSettings.asset` | Product name Character Game, identifier com.itkamianets.charactergame, Run In Background on. |

**Example:**

```json
// Packages/manifest.json: pin engine versions for a stable game
{
  "dependencies": {
    "com.itkamianets.3d-unity-core": "https://github.com/IT-Kamianets/3d-unity-core.git#v0.1.0",
    "com.itkamianets.3d-unity-input": "https://github.com/IT-Kamianets/3d-unity-input.git#v0.1.0",
    "com.itkamianets.3d-unity-character": "https://github.com/IT-Kamianets/3d-unity-character.git#v0.1.0",
    "com.itkamianets.3d-constructor-character-view-camera": "https://github.com/IT-Kamianets/3d-constructor-character-view-camera.git#v0.1.0",
    "com.itkamianets.3d-constructor-character-view-controls": "https://github.com/IT-Kamianets/3d-constructor-character-view-controls.git#v0.1.0",
    "com.unity.inputsystem": "1.20.0",
    "com.unity.render-pipelines.universal": "17.6.0"
  }
}
```

**Install:**

This is a Unity project, not a package. Clone https://github.com/IT-Kamianets/3d-constructor-character-view-template.git into a folder named after the game (or use it as a GitHub template) and remove its .git folder. Open it with Unity 6000.6 through Unity Hub, Add project from disk. Rename Company Name, Product Name and the package identifier in Project Settings, Player, then press Play in Playground.

### 3d-unity-fixed-camera

Fixed cinematic camera shots for third-person games, chosen by the boxes the player walks through.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-fixed-camera` |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-fixed-camera |
| Page | https://3d.itkamianets.com/packages/3d-unity-fixed-camera |

**Purpose.** A game with the classic survival-horror look gets a working fixed camera without writing one. Shots are boxes placed in the level: the camera picks the one the subject stands in and looks at the subject from that shot's anchor. It is game-neutral, with no story, puzzle or character code, and it reads no input. Moving the character relative to the camera is the game's job, and MovementYaw gives it the direction to move by.

**Usage.** Add FixedViewCamera to the camera object and set Subject to the player's transform. Put a CameraShotVolume on a box in each room and set its ShotId, Anchor, Size, Fov, Priority and Cut. Tune Hysteresis, BlendSeconds, LookOffset and Fallback on the camera. Call Snap after a teleport or a load, and PushOverride and PopOverride for a close-up. Move the character relative to MovementYaw, and call HoldBasis every frame with whether a movement input is held.

**Includes:**

- CameraShotVolume: a box with a shot id, an anchor, a field of view, a priority and a choice between cut and glide.
- FixedViewCamera looks at the subject, a little above its position, from the anchor of the volume the subject stands in.
- Hysteresis at the borders: the camera lets go of a shot only when the subject is 0.3 m outside its box, unless a volume with a higher priority contains the subject.
- Cut or glide: a shot with Cut jumps at once, any other shot is reached with a smooth move over 0.3 s by default.
- Close-up overrides: PushOverride and PopOverride put a dedicated shot on top and restore the previous one.
- MovementYaw and HoldBasis keep the direction of movement fixed while a key is held across a cut.
- A fallback view behind and above the subject when no volume contains it.
- CameraShotVolume.Select as a pure function that tests can call without physics.

**API:**

| Member | What it does |
|---|---|
| `CameraShotVolume` | A box in the level that names a fixed shot for the subject standing inside it. |
| `CameraShotVolume.Anchor` | The transform where the camera sits; it looks at the subject from here. |
| `CameraShotVolume.ShotId / Fov / Size` | The id the game reads, the field of view in degrees (50 by default) and the size of the box in metres (4 by default). |
| `CameraShotVolume.Priority` | When volumes overlap, the higher priority wins. |
| `CameraShotVolume.Cut` | Jump to this shot at once instead of gliding. |
| `CameraShotVolume.Select(volumes, point, current, hysteresis)` | The pure choice of a shot for a point; it keeps the current volume while the point is within the hysteresis. |
| `FixedViewCamera` | Component on the camera object that shows the shot for its subject. |
| `FixedViewCamera.Subject` | The transform to look at; with no subject the camera does nothing. |
| `FixedViewCamera.Hysteresis / BlendSeconds / LookOffset / Fallback` | The border margin in metres (0.3), the glide time in seconds (0.3), where on the subject to look (1.1 m up) and the height and distance of the fallback view (7 m). |
| `FixedViewCamera.MovementYaw` | The yaw to move relative to; frozen while HoldBasis is on. |
| `FixedViewCamera.HoldBasis(held)` | Call every frame with whether a movement input is held, so a cut does not turn held input around. |
| `FixedViewCamera.PushOverride(anchor, look, fov) / PopOverride()` | Takes a close-up shot from the anchor, looking at look or at the subject when it is null, and restores the previous shot. |
| `FixedViewCamera.Snap()` | Puts the camera on the shot it should have right now, with no glide, for example after a teleport or a load. |
| `FixedViewCamera.Current / ShotId / CutCount / Overriding` | The current volume, its shot id (inspect during an override), the number of shot changes and whether an override is active. |
| `FixedViewCamera.ShotChanged` | Event raised with the shot id when the shot changes, but not for overrides. |

**Example:**

```csharp
var camera = Camera.main.gameObject.AddComponent<FixedViewCamera>();
camera.Subject = player.transform;
camera.ShotChanged += id => Debug.Log($"Shot: {id}");

// Move relative to the camera, without a cut turning held input around
camera.HoldBasis(move != Vector2.zero);
var direction = Quaternion.Euler(0f, camera.MovementYaw, 0f) * new Vector3(move.x, 0f, move.y);

// A close-up on a puzzle, then back to the room shot
camera.PushOverride(closeUpAnchor, puzzleTarget, 38f);
camera.PopOverride();
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-fixed-camera.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6

### 3d-unity-topdown-camera

Overhead camera for strategy and tower-defense games: pan, zoom and stay inside the map.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-topdown-camera` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-topdown-camera |
| Page | https://3d.itkamianets.com/packages/3d-unity-topdown-camera |

**Purpose.** A game played from above gets a working camera without writing one. It pans, zooms and stays inside the map, and that is all: it is not a strategy constructor and has no selection, building or unit commands. It reads input only through 3d-unity-input, and it turns a screen point into a point on the ground, so the game can pick a spot or a pad.

**Usage.** Add OverheadCamera to the camera object and set Focus, Bounds, Pitch and the distances. The Move action (W A S D or the left stick) pans, and optionally the screen edge does too; the mouse wheel zooms between MinDistance and MaxDistance. Call Snap after changing Focus or Distance in code to jump without easing. Use TryGroundPoint to turn a pointer or touch position into a point on the ground.

**Includes:**

- Pan with the Move action (W A S D or the left stick) and, optionally, when the pointer touches the screen edge.
- Zoom with the mouse wheel, in steps, between a minimum and a maximum distance.
- Panning is faster when zoomed out, so crossing a screen of ground takes the same time at any zoom.
- Bounds: the point the camera looks at stays inside a rectangle on the ground, in x and z.
- A fixed angle: the camera looks down at the ground at Pitch, 58 degrees by default, from the zoom distance.
- Easing of the focus and the distance, and Snap to jump without it.
- TryGroundPoint turns a screen position into a point on the ground.

**API:**

| Member | What it does |
|---|---|
| `OverheadCamera` | Component on the camera object that looks down at the ground and can pan and zoom. |
| `OverheadCamera.Focus` | The ground point in the middle of the screen; set it to move the camera. |
| `OverheadCamera.Bounds` | A Rect on the ground: x and y are the ground x and z of the corner, width and height run along x and z. |
| `OverheadCamera.Pitch / Yaw` | The angle of the view in degrees: Pitch from 20 to 89 (58 by default), Yaw turns the view around the ground (0 by default). |
| `OverheadCamera.Distance / MinDistance / MaxDistance` | The distance from the ground, 32 by default, and the limits the wheel keeps it between, 14 and 48. |
| `OverheadCamera.PanSpeed` | Panning speed in metres per second at the default distance; it grows with the distance. |
| `OverheadCamera.EdgePan / EdgePixels` | Pan when the pointer is within EdgePixels (14) of the screen edge; on by default. |
| `OverheadCamera.ZoomStep / Smoothing` | The change of distance for one wheel step (4) and how fast the camera eases to its target (12). |
| `OverheadCamera.Snap()` | Jumps to Focus and Distance without easing; call it after changing them in code. |
| `OverheadCamera.TryGroundPoint(screenPosition, out point)` | The point on the ground (y = 0) under a screen position; false when the ray points away from the ground. |

**Example:**

```csharp
var view = Camera.main.gameObject.AddComponent<OverheadCamera>();
view.Bounds = new Rect(-70f, -45f, 140f, 100f);
view.MinDistance = 16f;
view.MaxDistance = 58f;
view.Distance = 36f;
view.Focus = new Vector3(-50f, 0f, -26f);
view.Snap();

// Which spot is the pointer on?
var pointer = EngineInput.Default.UI.Point.ReadValue<Vector2>();
if (view.TryGroundPoint(pointer, out var ground))
{
    Debug.Log($"Pointer on the ground at {ground}");
}
```

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-topdown-camera.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input`.

Requirements:

- Unity 6000.6
- com.unity.inputsystem 1.20.0, resolved by the Package Manager
