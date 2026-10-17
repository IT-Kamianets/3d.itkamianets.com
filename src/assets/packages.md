# IT Kamianets 3D Engine: packages

Every public package of the IT Kamianets 3D Engine: what it does, what it depends on, and how to install it. Use this file to choose packages for a new constructor or game.

- Website: https://3d.itkamianets.com
- Source: https://github.com/IT-Kamianets
- This file: https://3d.itkamianets.com/packages.md (generated from the website catalog on every build)

18 packages: 3 schemas, 6 core, 5 specific, 4 constructor. 6 constructors.

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
| [`3d-scene-schema`](#3d-scene-schema) | Where things are: a scene as plain JSON, with objects, transforms, hierarchy, tags and asset ids. | - |
| [`3d-asset-schema`](#3d-asset-schema) | What things are: models, materials, textures and sounds described as JSON asset libraries. | - |
| [`3d-network-schema`](#3d-network-schema) | What happens between players: multiplayer sessions, messages, results and replays as JSON. | - |

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

### Specific

Editing tools, devices, platforms and services that only some games need.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-unity-interaction`](#3d-unity-interaction) | Scene editing: select, move, rotate, scale, duplicate and delete objects, with snapping and undo. | `3d-unity-core`, `3d-unity-scene`, `3d-unity-input` |
| [`3d-unity-spatial`](#3d-unity-spatial) | Turns a Meta Quest room scan into a scene, measures scanned rooms and builds them as solid geometry. | `3d-unity-core`, `3d-unity-scene` |
| [`3d-unity-xr`](#3d-unity-xr) | VR for a character: a headset rig on a character motor, comfort settings, a VR/flat mode switch and world-space status. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character` |
| [`3d-unity-firebase`](#3d-unity-firebase) | Firebase over its REST API: sign-in, player profiles, saved progress and stored scenes. | `3d-unity-core`, `3d-unity-scene` |
| [`3d-unity-network`](#3d-unity-network) | Real-time multiplayer on Netcode: sessions, server-authoritative characters, schema messages. | `3d-unity-core`, `3d-unity-character`, `3d-network-schema` |

### Constructor

The parts of a constructor: its camera, its controls, and a starter project.

| Package | What it does | Depends on |
|---|---|---|
| [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera) | First- and third-person camera that follows a character and owns where the player looks. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character` |
| [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls) | Turns player input into character commands: forward is where the camera looks, looking turns the character. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character`, `3d-constructor-character-view-camera` |
| [`3d-constructor-vr-controls`](#3d-constructor-vr-controls) | Turns XR controllers into character commands: walk where you look, turn with the stick, crouch for real. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character`, `3d-unity-xr` |
| [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) | Starter Unity project for first- and third-person games with a test level and a playable character. | `3d-unity-core`, `3d-unity-input`, `3d-unity-character`, `3d-constructor-character-view-camera`, `3d-constructor-character-view-controls` |

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
| Constructor packages | - |
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
| Constructor packages | - |
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

## Core

Unity systems every 3D game needs.

### 3d-unity-core

Shared base for the engine's Unity packages: logging, player settings, typed events and services.

| | |
|---|---|
| Kind | Unity package `com.itkamianets.3d-unity-core` |
| Version | 0.1.0 |
| Depends on | nothing |
| Used by | [`3d-unity-scene`](#3d-unity-scene), [`3d-unity-input`](#3d-unity-input), [`3d-unity-character`](#3d-unity-character), [`3d-unity-assets`](#3d-unity-assets), [`3d-unity-audio`](#3d-unity-audio), [`3d-unity-interaction`](#3d-unity-interaction), [`3d-unity-spatial`](#3d-unity-spatial), [`3d-unity-xr`](#3d-unity-xr), [`3d-unity-firebase`](#3d-unity-firebase), [`3d-unity-network`](#3d-unity-network), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-vr-controls`](#3d-constructor-vr-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
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
| Used by | [`3d-unity-interaction`](#3d-unity-interaction), [`3d-unity-xr`](#3d-unity-xr), [`3d-constructor-character-view-camera`](#3d-constructor-character-view-camera), [`3d-constructor-character-view-controls`](#3d-constructor-character-view-controls), [`3d-constructor-vr-controls`](#3d-constructor-vr-controls), [`3d-constructor-character-view-template`](#3d-constructor-character-view-template) |
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
