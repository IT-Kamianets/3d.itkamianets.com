# IT Kamianets 3D Engine: packages

Every public package of the IT Kamianets 3D Engine: what it does, what it depends on, and how to install it. Use this file to choose packages for a new constructor or game.

- Website: https://3d.itkamianets.com
- Source: https://github.com/IT-Kamianets
- This file: https://3d.itkamianets.com/packages.md (generated from the website catalog on every build)

17 packages: 3 schemas, 6 core, 5 specific, 3 constructor. 6 constructors.

## How the engine is built

```text
schemas            3d-*-schema                JSON, no engine
Unity packages     3d-unity-*                 core systems + specific ones
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
| [`3d-scene-schema`](#3d-scene-schema) | Where things are: an engine-independent scene as plain JSON, with objects, transforms and hierarchy. | - |
| [`3d-asset-schema`](#3d-asset-schema) | What things are: an engine-independent description of models, materials and textures. | - |
| [`3d-network-schema`](#3d-network-schema) | What happens between players: multiplayer sessions, messages, results and replays as JSON. | - |

### Core

Unity systems every 3D game needs.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-unity-core`](#3d-unity-core) | The shared base for every Unity package: configuration, services, events, logging and startup. | - |
| [`3d-unity-scene`](#3d-unity-scene) | Loads Scene JSON into live Unity scenes and saves changes back to the shared format. | `3d-unity-core`, `3d-scene-schema` |
| [`3d-unity-input`](#3d-unity-input) | One set of actions for mouse, keyboard, touch, gamepad and VR controllers. | `3d-unity-core` |
| [`3d-unity-character`](#3d-unity-character) | A reusable player character: walking, running, jumping, ground, slopes and steps. | `3d-unity-core` |
| [`3d-unity-assets`](#3d-unity-assets) | Loads models, materials and textures by id, locally or from a server, with caching. | `3d-unity-core`, `3d-unity-scene`, `3d-asset-schema` |
| [`3d-unity-audio`](#3d-unity-audio) | Positional 3D sound, sound events with variations, footsteps by surface, volume groups and music. | `3d-unity-core`, `3d-unity-scene`, `3d-unity-assets` |

### Specific

Editing tools, devices, platforms and services that only some games need.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-unity-interaction`](#3d-unity-interaction) | Object editing: select, move, rotate, scale, snap, duplicate and delete, with undo. | `3d-unity-core`, `3d-unity-scene`, `3d-unity-input` |
| [`3d-unity-spatial`](#3d-unity-spatial) | Turns a Meta Quest room scan into a scene: walls, floor, doors, windows and furniture. | `3d-unity-core`, `3d-unity-scene` |
| [`3d-unity-xr`](#3d-unity-xr) | Meta Quest and VR: controllers, hand tracking, grabbing, teleport, locomotion and in-VR UI. | `3d-unity-core` |
| [`3d-unity-firebase`](#3d-unity-firebase) | Sign-in, player profiles, saved progress and stored scenes in Firebase. | `3d-unity-core`, `3d-unity-scene` |
| [`3d-unity-network`](#3d-unity-network) | Real-time multiplayer: the server decides, players stay in sync, lag is compensated. | `3d-unity-core`, `3d-unity-character`, `3d-network-schema` |

### Constructor

The parts of a constructor: its camera, its controls, and a starter project.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera) | First- and third-person camera for the Character View constructor. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character` |
| [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls) | Connects input to the character: forward is where the camera looks, looking turns the character. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character`, `3d-constructor-character-view-camera` |
| [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) | Starter Unity project for first- and third-person games: packages, scene, character and camera ready. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character`, `3d-constructor-character-view-camera`, `3d-constructor-character-view-controls` |

## Constructors

A constructor is a ready start for one camera style: it adds a camera, controls and a starter project on top of the engine packages.

### Character View

For games where the player directly controls a character from first-person or third-person perspective.

| | |
|---|---|
| Camera | 1st + 3rd Person |
| Games like | GTA V, Cyberpunk 2077, Elden Ring |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-xr`](#3d-unity-xr) |
| Constructor packages | [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-character-view |
| Page | https://3d.itkamianets.com/constructors/character-view |

### Top-Down

For games viewed primarily from above, with direct player movement and action-focused gameplay.

| | |
|---|---|
| Camera | Viewed from above |
| Games like | Hades, Vampire Survivors, Hotline Miami |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio) |
| Constructor packages | not built yet |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-top-down |
| Page | https://3d.itkamianets.com/constructors/top-down |

### Isometric

For games using an angled isometric-style camera, commonly used for RPGs, strategy games, and action RPGs.

| | |
|---|---|
| Camera | Angled camera |
| Games like | Baldur's Gate 3, Diablo IV, Path of Exile 2 |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio) |
| Constructor packages | not built yet |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-isometric |
| Page | https://3d.itkamianets.com/constructors/isometric |

### Side View

For games viewed from the side, including platformers, metroidvanias, action games, and sandbox games.

| | |
|---|---|
| Camera | Viewed from the side |
| Games like | Hollow Knight, Dead Cells, Terraria |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio) |
| Constructor packages | not built yet |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-side-view |
| Page | https://3d.itkamianets.com/constructors/side-view |

### Fixed Camera

For games where camera positions are predefined or controlled by the scene rather than directly by the player.

| | |
|---|---|
| Camera | Scene-controlled camera |
| Games like | Resident Evil, INSIDE, Little Nightmares |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio) |
| Constructor packages | not built yet |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-fixed-view |
| Page | https://3d.itkamianets.com/constructors/fixed-view |

### God / Free Camera

For games where the user controls the world from a free, strategic, or god-like camera.

| | |
|---|---|
| Camera | Strategic, free camera |
| Games like | Civilization, Cities: Skylines, Total War |
| Engine packages | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-interaction`](#3d-unity-interaction) |
| Constructor packages | not built yet |
| Starter repository | https://github.com/IT-Kamianets/3d-constructor-free-view |
| Page | https://3d.itkamianets.com/constructors/free-view |

## Schemas

JSON formats with no engine. Not Unity packages: read them, validate against them, or use the Unity package that implements them.

### 3d-scene-schema

Where things are: an engine-independent scene as plain JSON, with objects, transforms and hierarchy.

| | |
|---|---|
| Kind | JSON Schema (2020-12) |
| Version | 1.0.0 |
| Depends on | nothing |
| Used by | [`3d-unity-scene`](#3d-unity-scene) |
| Repository | https://github.com/IT-Kamianets/3d-scene-schema |
| Page | https://3d.itkamianets.com/packages/3d-scene-schema |

**Purpose.** The source of truth for a 3D scene. Unity reads and writes it but never owns it, so the same scene can feed Unity, other engines, AI tools and services without rewriting the format.

**Usage.** Every document carries a schemaVersion (semver). Units are meters in a right-handed, Y-up system; engine adapters such as 3d-unity-scene convert to and from their own conventions. Breaking changes get a new schema/v{n}/ directory instead of changing v1.

**Includes:**

- scene.schema.json: root document with schemaVersion, sceneId, timestamps, units, origin and a flat list of objects
- scene-object.schema.json: a semantic label, a transform, an optional boundary or volume, and a parentId
- transform.schema.json and common.schema.json: position, rotation, scale and shared primitives
- Example scenes that validate against v1

**Install:**

Nothing to install: the repository holds JSON Schema (2020-12) files. Read schema/v1/ and the examples/ folder at https://github.com/IT-Kamianets/3d-scene-schema, validate documents with any JSON Schema validator, or use the Unity package that reads it.

### 3d-asset-schema

What things are: an engine-independent description of models, materials and textures.

| | |
|---|---|
| Kind | JSON Schema (2020-12) |
| Version | 1.0.0 |
| Depends on | nothing |
| Used by | [`3d-unity-assets`](#3d-unity-assets) |
| Repository | https://github.com/IT-Kamianets/3d-asset-schema |
| Page | https://3d.itkamianets.com/packages/3d-asset-schema |

**Purpose.** A scene object references an asset by id; this schema is what that id resolves to. Engine packages such as 3d-unity-assets read these definitions and decide how to load them, so one asset definition serves every runtime.

**Usage.** Describe each asset once: its id, a model reference (GLB/glTF), materials, textures, bounds and tags. Scenes keep only the id, and 3d-unity-assets resolves it at runtime.

**Includes:**

- Asset definitions with ids, model references (GLB/glTF), materials and textures
- Metadata, tags and categories
- Bounds and pivot conventions
- Example asset documents that validate against v1

**Install:**

Nothing to install: the repository holds JSON Schema (2020-12) files. Read schema/v1/ and the examples/ folder at https://github.com/IT-Kamianets/3d-asset-schema, validate documents with any JSON Schema validator, or use the Unity package that reads it.

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

**Purpose.** The shared contract for multiplayer between the Unity game, a dedicated server in any language, spectators, stats storage, bots and AI tools. It covers the messages that matter after the fact, not the per-tick stream of positions and inputs, which stays in the networking backend.

**Usage.** A session document lists players, teams, the scene and the lifecycle state. Every message has an envelope (messageId, sessionId, seq, sentAt, from, type) and a payload typed by type. session.* types are defined by the schema; game events use names namespaced by the game, such as temnorid-arena.round-ended.

**Includes:**

- session.schema.json: players, teams, scene and the lobby → starting → running → ended lifecycle
- message.schema.json: join, joined, left, snapshot, state-changed and ended, plus game events
- result.schema.json: reason, winners, and team or player scores with game-defined stats
- replay.schema.json: a finished session as one document
- Example replay and join request that validate against v1

**Install:**

Nothing to install: the repository holds JSON Schema (2020-12) files. Read schema/v1/ and the examples/ folder at https://github.com/IT-Kamianets/3d-network-schema, validate documents with any JSON Schema validator, or use the Unity package that reads it.

## Core

Unity systems every 3D game needs.

### 3d-unity-core

The shared base for every Unity package: configuration, services, events, logging and startup.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-core` |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-interaction`](#3d-unity-interaction), [`3d-unity-spatial`](#3d-unity-spatial), [`3d-unity-xr`](#3d-unity-xr), [`3d-unity-firebase`](#3d-unity-firebase), [`3d-unity-network`](#3d-unity-network), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Repository | https://github.com/IT-Kamianets/3d-unity-core |
| Page | https://3d.itkamianets.com/packages/3d-unity-core |

**Purpose.** The foundation of the engine in Unity. Every other Unity package builds on it, so configuration, lifecycle and logging work the same way everywhere. It stays product-independent, with no game-specific code.

**Usage.** Install it first. Packages register their services at startup and talk through its events instead of referencing each other directly.

**Includes:**

- Engine configuration and runtime services
- Event system shared by all packages
- Logging and debugging
- Package initialization lifecycle and error handling

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-core.git
```

No engine packages to add first.

Requirements:

- Unity 6000.6

### 3d-unity-scene

Loads Scene JSON into live Unity scenes and saves changes back to the shared format.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-scene` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-scene-schema`](#3d-scene-schema) |
| Used by | [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-interaction`](#3d-unity-interaction), [`3d-unity-spatial`](#3d-unity-spatial), [`3d-unity-firebase`](#3d-unity-firebase) |
| Repository | https://github.com/IT-Kamianets/3d-unity-scene |
| Page | https://3d.itkamianets.com/packages/3d-unity-scene |

**Purpose.** It sits between Unity and 3d-scene-schema: Scene Schema → Unity Scene → Scene Changes → Scene Schema. Unity is never the permanent source of truth, so scenes outlive the engine.

**Usage.** Load a scene document to build it in Unity, edit it at runtime, and save it back as JSON. SceneJson converts the C# model to and from the schema; coordinates are converted between the schema and Unity automatically.

**Includes:**

- C# model of 3d-scene-schema with JSON conversion (SceneJson)
- Scene loader: builds a live Unity scene from a scene document
- Scene saver: writes Unity changes back to Scene JSON
- Coordinate conversion between the schema and Unity
- Hierarchy, object creation and removal, transform sync

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-scene.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core`.

Requirements:

- Unity 6000.6
- com.unity.nuget.newtonsoft-json 3.2.2, resolved by the Package Manager

### 3d-unity-input

One set of actions for mouse, keyboard, touch, gamepad and VR controllers.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-input` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core) |
| Used by | [`3d-unity-interaction`](#3d-unity-interaction), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Repository | https://github.com/IT-Kamianets/3d-unity-input |
| Page | https://3d.itkamianets.com/packages/3d-unity-input |

**Purpose.** Other packages react to actions (move, look, jump, select) instead of devices, so supporting a new device means adding a binding here, not changing every package that reads input.

**Usage.** Read actions from EngineInput. The active scheme (keyboard and mouse, gamepad, touch, VR) switches automatically with the last device used, and players can rebind keys.

**Includes:**

- EngineInput: the shared action map every package reads
- Bindings for keyboard and mouse, gamepad, touch and VR controllers
- Automatic device switching (InputScheme)
- Rebinding and input events

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-input.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core`.

Requirements:

- Unity 6000.6
- com.unity.inputsystem 1.20.0, resolved by the Package Manager

### 3d-unity-character

A reusable player character: walking, running, jumping, ground, slopes and steps.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-character` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core) |
| Used by | [`3d-unity-network`](#3d-unity-network), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Repository | https://github.com/IT-Kamianets/3d-unity-character |
| Page | https://3d.itkamianets.com/packages/3d-unity-character |

**Purpose.** One tested character for every constructor. It has no camera of its own: each constructor adds the camera and decides where forward is, so first person, top-down and side view all share this movement.

**Usage.** Add CharacterMotor (on a CharacterController) to a prefab and give it a CharacterCommand each frame: a move direction, yaw, sprint, jump and crouch. It handles speed, jumping, gravity, ground, slopes and steps, and raises events such as Landed. It reads no input and owns no camera: a constructor’s controls turn input into commands.

**Includes:**

- Walking, running and jumping
- Ground detection, slopes and steps
- Crouching
- Movement settings and events
- Coyote time, jump buffering and limited air control
- State snapshots and fixed-tick stepping for network prediction

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-character.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core`.

Requirements:

- Unity 6000.6
- com.unity.modules.physics 1.0.0, resolved by the Package Manager

### 3d-unity-assets

Loads models, materials and textures by id, locally or from a server, with caching.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-assets` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-asset-schema`](#3d-asset-schema) |
| Used by | [`3d-unity-audio`](#3d-unity-audio) |
| Repository | https://github.com/IT-Kamianets/3d-unity-assets |
| Page | https://3d.itkamianets.com/packages/3d-unity-assets |

**Purpose.** Scenes reference assets by id instead of embedding Unity objects. This package resolves those ids, defined by 3d-asset-schema, into real Unity objects.

**Usage.** Ask for an asset by id and get the loaded object back asynchronously. Loaded assets are cached and unloaded when no longer used; a placeholder shows while loading or when an asset is missing.

**Includes:**

- Local and remote asset loading
- GLB/glTF models and Unity prefabs
- Materials and textures
- Caching, async loading and unloading
- Placeholders and missing-asset handling

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-assets.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene`.

Requirements:

- Unity 6000.6

### 3d-unity-audio

Positional 3D sound, sound events with variations, footsteps by surface, volume groups and music.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-audio` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-assets`](#3d-unity-assets) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-audio |
| Page | https://3d.itkamianets.com/packages/3d-unity-audio |

**Purpose.** Games play a sound event by name, not a file, so changing a sound is a data change. Positional sound is gameplay, not decoration: in a competitive game players locate others by footsteps and spells, so direction and distance must be reliable.

**Usage.** Play an event such as footstep.stone at a position: it picks one of several clips and varies pitch and volume. Every sound plays through a volume group (master, music, effects, voice, interface), so a settings screen changes one value per group.

**Includes:**

- Sound events by name with random clip, pitch and volume
- Positional 3D sound with distance falloff and direction
- Volume groups and mixer
- Footsteps by surface
- Music with crossfades

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-audio.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene` → `3d-unity-assets`.

Requirements:

- Unity 6000.6

## Specific

Editing tools, devices, platforms and services that only some games need.

### 3d-unity-interaction

Object editing: select, move, rotate, scale, snap, duplicate and delete, with undo.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-interaction` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-interaction |
| Page | https://3d.itkamianets.com/packages/3d-unity-interaction |

**Purpose.** Reusable editing tools for apps that let people change their scenes: interiors, level editors, track builders, simulations. Not every game needs it, so it is a specific package rather than core.

**Usage.** It edits objects managed by 3d-unity-scene and keeps the scene in sync, so every edit can be saved as Scene JSON. Input comes through 3d-unity-input, so mouse, touch and VR all work.

**Includes:**

- Selection and multi-selection
- Move, rotate, scale, duplicate and delete with gizmos
- Grid, object, surface and rotation snapping
- Undo, redo and copy/paste

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-interaction.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene` → `3d-unity-input`.

Requirements:

- Unity 6000.6

### 3d-unity-spatial

Turns a Meta Quest room scan into a scene: walls, floor, doors, windows and furniture.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-spatial` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-spatial |
| Page | https://3d.itkamianets.com/packages/3d-unity-spatial |

**Purpose.** It connects the engine to the real room around the user. Where 3d-unity-xr handles XR hardware, this package understands the physical space and converts it into engine-independent scene data.

**Usage.** RoomScanner requests the Quest Scene API permission, loads the room through MR Utility Kit and converts it into a scene from 3d-unity-scene. Scanned rooms can be saved, loaded, rescanned and aligned with virtual content.

**Includes:**

- RoomScanner: Quest Scene API permission, MRUK room loading and conversion to a scene
- Floor, wall, ceiling, door, window and furniture detection
- Room boundaries, dimensions and spatial anchors
- Save, load and rescan scanned rooms

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-spatial.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene`.

Requirements:

- Unity 6000.6
- Optional: Meta XR MR Utility Kit (com.meta.xr.mrutilitykit) for room scanning; without it the package compiles and reports that scanning is unavailable

### 3d-unity-xr

Meta Quest and VR: controllers, hand tracking, grabbing, teleport, locomotion and in-VR UI.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-xr` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-xr |
| Page | https://3d.itkamianets.com/packages/3d-unity-xr |

**Purpose.** It brings the engine into VR and MR, handling how people interact with a 3D world through XR. Meta Quest comes first; the design suits other XR platforms later. Room understanding belongs to 3d-unity-spatial.

**Usage.** Add it to a Quest project. Controller and hand input arrive as engine actions, objects become grabbable, and StatusHud shows world-space text. Movement uses teleport or smooth locomotion.

**Includes:**

- Controller input and button actions (XRPrimaryButtonAction)
- Hand tracking and hand interactions
- Grabbing, ray and direct interaction
- Teleportation and smooth locomotion
- World-space UI and status HUD (StatusHud)

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-xr.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core`.

Requirements:

- Unity 6000.6
- com.unity.ugui 2.6.0, resolved by the Package Manager

### 3d-unity-firebase

Sign-in, player profiles, saved progress and stored scenes in Firebase.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-firebase` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-scene`](#3d-unity-scene) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-firebase |
| Page | https://3d.itkamianets.com/packages/3d-unity-firebase |

**Purpose.** Games use this package instead of writing their own Firebase integration. Scenes are stored as Scene JSON, so anything saved from Unity can be read by other tools.

**Usage.** Sign a player in, then save and load their progress and scenes. Changes queue while offline and sync when the connection returns.

**Includes:**

- Firebase setup and sign-in
- User profiles and saved progress
- Scene storage and loading as Scene JSON
- Asset storage
- Offline support and sync events

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-firebase.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-scene`.

Requirements:

- Unity 6000.6
- Optional: Firebase Unity SDK in your project; without it the package compiles and reports that Firebase is unavailable

### 3d-unity-network

Real-time multiplayer: the server decides, players stay in sync, lag is compensated.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-network` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-character`](#3d-unity-character), [`3d-network-schema`](#3d-network-schema) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-unity-network |
| Page | https://3d.itkamianets.com/packages/3d-unity-network |

**Purpose.** The server decides what happened; clients send input and show the result. A game never trusts a client about hits, health or score, so editing the client cannot cheat. It holds no game rules, so a team arena, a co-op game and a shared VR room use the same networking.

**Usage.** Put a NetworkSession in the first scene with the player prefab (NetworkObject + CharacterMotor + NetworkCharacter). Start it with StartHost, StartServer or StartClient, or from the command line with -server, -host or -client <address>. NetworkCharacter predicts the owner’s movement, lets the server apply commands in order, corrects mispredictions and interpolates other players. Built on Unity Netcode for GameObjects; session messages follow 3d-network-schema.

**Includes:**

- Host and dedicated server modes
- Player spawn and sync
- Synced game state
- Server-side hit checks with lag compensation
- Client prediction for movement
- Lobbies, matchmaking and reconnect
- Command-line start for dedicated servers and test clients
- Owner-only components, so controls and cameras run only for the local player

**Install:**

```text
https://github.com/IT-Kamianets/3d-unity-network.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-character`.

Requirements:

- Unity 6000.6
- com.unity.netcode.gameobjects 2.13.3 (with Unity Transport), resolved by the Package Manager

## Constructor

The parts of a constructor: its camera, its controls, and a starter project.

### 3d-constructor-character-view-camera

First- and third-person camera for the Character View constructor.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-constructor-character-view-camera` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character) |
| Used by | [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Repository | https://github.com/IT-Kamianets/3d-constructor-character-view-camera |
| Page | https://3d.itkamianets.com/packages/3d-constructor-character-view-camera |

**Purpose.** A game built from the Character View constructor gets a working camera without writing one. The camera follows a character from 3d-unity-character and reads look input from 3d-unity-input.

**Usage.** Point the camera at a character and pick first or third person; players can switch between them at runtime. Field of view, smoothing and look sensitivity are settings.

**Includes:**

- First-person and third-person cameras
- Switching between views
- Camera collision, so walls never hide the character
- Smoothing, field of view and look sensitivity settings

**Install:**

```text
https://github.com/IT-Kamianets/3d-constructor-character-view-camera.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input` → `3d-unity-character`.

Requirements:

- Unity 6000.6
- com.unity.modules.physics 1.0.0, resolved by the Package Manager

### 3d-constructor-character-view-controls

Connects input to the character: forward is where the camera looks, looking turns the character.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-constructor-character-view-controls` |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera) |
| Used by | [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
| Repository | https://github.com/IT-Kamianets/3d-constructor-character-view-controls |
| Page | https://3d.itkamianets.com/packages/3d-constructor-character-view-controls |

**Purpose.** 3d-unity-character moves a character but does not decide where forward is. This package does, for first- and third-person games, and stays in sync with the camera when the player switches views.

**Usage.** Add it next to the character and the camera. It reads move and look actions from 3d-unity-input and drives 3d-unity-character, including strafing, sprint and crouch toggles, and aim mode.

**Includes:**

- Camera-relative movement and look to turn
- Strafing, sprint and crouch toggles
- First- and third-person control differences
- Aim mode and control settings

**Install:**

```text
https://github.com/IT-Kamianets/3d-constructor-character-view-controls.git
```

Unity does not resolve git dependencies of a git package, so add these first, in this order: `3d-unity-core` → `3d-unity-input` → `3d-unity-character` → `3d-constructor-character-view-camera`.

Requirements:

- Unity 6000.6

### 3d-constructor-character-view-template

Starter Unity project for first- and third-person games: packages, scene, character and camera ready.

| | |
|---|---|
| Kind | Unity project |
| Version | 0.1.0 |
| Depends on | [`3d-unity-core`](#3d-unity-core), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls) |
| Used by | nothing in the engine |
| Repository | https://github.com/IT-Kamianets/3d-constructor-character-view-template |
| Page | https://3d.itkamianets.com/packages/3d-constructor-character-view-template |

**Purpose.** A new game starts from this template, not from an empty project. The engine packages, the character, the camera and the controls are already set up, so the team writes only what makes the game unique.

**Usage.** Open the project and press Play: a character walks around the starter scene in first person. Rename the project, then add the game’s own packages, for example <game>-core and <game>-menus.

**Includes:**

- Unity 6000.6 project with URP
- Package list with every engine package by git URL
- Starter scene with a character prefab
- Camera, controls and input already set up
- Project settings and a setup guide

**Install:**

This is a Unity project, not a package. Clone https://github.com/IT-Kamianets/3d-constructor-character-view-template.git or use it as a GitHub template, then open it in Unity 6000.6. Its Packages/manifest.json already lists every engine package it needs by git URL.
