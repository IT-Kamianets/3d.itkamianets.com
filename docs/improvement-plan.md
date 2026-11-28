# ITKP 3D Engine: improvement plan

Plan from the code review of the framework packages, the docs and the games built on them (November 2026). The findings come from reading the code; none was reproduced in Unity yet, so each fix starts by writing a failing test for it.

The plan is laid out like the shared backlog on the [Development page](https://3d.itkamianets.com/development): each section is a **roadmap** (category `unity`, status `planned`) with its **tasks** and the **packages** and **projects** it touches. When it moves into the backlog, every section becomes one roadmap and every checkbox one task; the severity tag stays in the task title.

Status (28 November 2026): the bugs of roadmaps 1 and 6 are fixed in the package repositories, with tests where the package has them. The 24 released packages are tagged and declare their engine dependencies (roadmap 2), game code is out of the engine (roadmap 4) and the schema checks of roadmap 5 are in. The boxes say what is still open.

Order matters: roadmaps 1 and 2 come first because they protect players and make every later fix reach the games safely.

Math Runner, the game closest to production, has its own plan in its repository: `math-runner.itkamianets.com/PLAN.md`. It is roadmap 7 here.

## Roadmap 1: Security and data-loss bugs

Packages: `3d-unity-update`, `3d-unity-account`, `3d-unity-net`, `3d-unity-save`, `3d-unity-scene`, `3d-unity-assets`, `3d-unity-shell`. Projects: every Temnorid game, Math Runner.

- [x] **[high] update: verify the installer before running it** (`Runtime/AutoUpdater.cs` 100-158). Allow only github.com release URLs, take the file name with `Path.GetFileName`, compare the size with `asset.size` and the SHA-256 with the asset `digest`, and check the Authenticode signature and publisher. Keep the file locked or in a private folder until launch. Math Runner's `UpdateChecker` already checks the URL and digest: start from it.
- [x] **[medium] update: download timeout and cancel** (`AutoUpdater.cs` 128-138). Stall watchdog, public `Cancel()`, abort and dispose in `OnDisable`/`OnDestroy`.
- [x] **[medium] update: IL2CPP fallback** (`AutoUpdater.cs` 158). If `Process.Start` throws, open the release page; state the Mono requirement in the README (confirm IL2CPP behaviour first).
- [x] **[low] update: no update loop** (`AutoUpdater.cs` 88, `SemVer.cs` 16-17). Remember the last attempted tag; treat `1.0.0-beta` as older than `1.0.0`.
- [x] **[high] account: guest to existing Google account** (`Runtime/GameAccount.cs` 130-134, 247). On `FEDERATED_USER_ID_ALREADY_LINKED` / `EMAIL_EXISTS` sign in to the existing account without the link token. If the guest token cannot be refreshed, fail instead of signing in unlinked. Test it with a throwaway account.
- [x] **[medium] account: protect the refresh token** (`GameAccount.cs` 195-199). Store it through a protected store (DPAPI, Android Keystore, iOS Keychain) behind `IEngineStorage`. Done on Windows (DPAPI); Android Keystore and iOS Keychain still open.
- [x] **[medium] account: stale refresh after sign-out** (`GameAccount.cs` 86-99, 144-148). Session generation counter; single-flight refresh.
- [x] **[medium] account: cancellable Google sign-in** (`GameAccount.cs` 162, 292-294). `CancelSignIn()`; Guest and Back cancel a pending attempt; the listener ignores requests without the matching `state`.
- [x] **[low] account: any HTTP 400 from securetoken ends the session** (`GameAccount.cs` 94), raise `Changed`.
- [x] **[low] account: JToken shape guards** (`LordProfile.cs` 37, `FirestoreRest.cs` 246).
- [x] **[high] net: clients cannot send reserved events** (`Runtime/NetSession.cs` 616-623, 722-731). The host drops client events with the `net.` prefix; `net.gone` is accepted only from the host.
- [x] **[high] scene: duplicate or missing ids** (`Runtime/SceneLoader.cs` 40-80). Apply transform, content and asset to every created object; re-id duplicates or reject the document.
- [x] **[medium-high] save: Load never throws, payload errors keep the file** (`Runtime/SaveStore.cs` 108-126). Catch everything and return a status; a payload that does not fit `T` is its own status and is not moved aside.
- [x] **[medium] save: flush before replace** (`SaveStore.cs` 63-66). FileStream with `Flush(true)`; pass the backup path to `File.Replace`.
- [x] **[medium] save: no date parsing of payload strings** (`SaveStore.cs` 93, 107). `DateParseHandling.None`.
- [x] **[medium] assets: untrusted URIs** (`Runtime/EngineAssets.cs` 626-644). Only relative paths that stay under the library folder, and https.
- [x] **[medium] shell: OAuth file copy** (`Editor/ShellSceneKit.cs` 22-50). Separate explicit call, no silent overwrite, check the ignore rule; prompt before replacing an unsaved scene. Copy is safe (gitignore check, no silent overwrite, save prompt); still called from BuildBoot.
- [x] **[low] account: README** says the OAuth secret is never published; it ships in every build. Reword, and leave it out of phone builds. Reworded; leaving it out of phone builds is still open.

## Roadmap 2: Versions, tags and dependencies

Packages: all `3d-*`. Projects: all games, the constructor starters, this site.

- [x] Tag every package repository at its current `package.json` version (`v0.1.0` and so on). Done for the 24 released packages; `3d-unity-interaction`, `3d-unity-spatial`, `3d-unity-xr`, `3d-unity-firebase` and `3d-constructor-vr-controls` still have no tag.
- [ ] Pin every game manifest to `...git#vX.Y.Z` and commit `packages-lock.json`. Pin `com.coplaydev.unity-mcp` too (Math Runner uses `#main`). Script ready, games pending.
- [x] A small script that bumps one package's pin across every game in the workspace: `tools/engine/pin-packages.mjs` (`npm run pin`), which also fills `packages-lock.json` and adds missing engine dependencies.
- [x] Declare the engine packages each package uses in its `package.json`: shell (core, input, ui, net, update, account), account (core), ui (`3d-unity-input`), camera and controls (`com.unity.inputsystem`). Drop the shell's unused input references.
- [x] Decide on a package registry (OpenUPM or GitHub Packages) so Unity resolves the whole tree; then shorten the manifest blocks in the starters' AGENTS.md and in the docs. Decided: OpenUPM (scope `com.itkamianets`); the listings are prepared in `tools/openupm/` but not submitted, and the manifest blocks stay until they are live.
- [x] Add a "Releasing a package" section to Start a game: bump the version, tag, update the catalog here.

## Roadmap 3: Tests and CI

Packages: all `3d-*`. Projects: all games, this site.

- [ ] A host Unity project (or a GameCI matrix) that runs each package's EditMode and PlayMode tests on every pull request.
- [ ] Fill the empty `Tests/` folders: core, input, character, camera, controls. Save first: corrupt envelope, wrong field types, a migrate that throws, date-like strings.
- [ ] Per game: tests on push; on a tag, the Windows build, the Inno Setup installer and the release upload. The build script takes the version from the tag, so `bundleVersion` cannot drift.
- [ ] Extend `tools/catalog/validate-catalog.mjs`:
  - `package.json` dependencies against asmdef references;
  - `Temnorid`, `Lords` or other game names inside `3d-*` packages;
  - device input (`Keyboard.`, `Mouse.`, `Touchscreen.`, `Input.Get`) outside `3d-unity-input`;
  - games whose manifest has an unpinned engine URL.
- [ ] Run `itkp-models check` on each game's `assetra.json` in CI.

## Roadmap 4: Game code out of the engine

Packages: `3d-unity-account`, `3d-unity-shell`, `3d-unity-graybox`; new `temnorid-*` packages in the WebArtWork organization. Projects: all Temnorid games.

- [x] account: the default `Config` becomes empty with a clean "not configured" state; the Temnorid Firebase config moves to the games (or a `temnorid-account` package). Also removes the `Resources.Load` in a static initializer.
- [x] account: `LordProfile` moves to a `temnorid-*` package.
- [x] shell: `ShellLord` behind a "profile name provider" delegate; the Lords wording, the `Temnorid` title default and the Lords gold accent move into each game's `ShellConfig`; bar colours come from `ShellConfig`.
- [x] shell: a text table or callback for every user-facing string (localization hook): `ShellText`.
- [x] shell: `ShellSceneKit` reads the OAuth file path from configuration, not `~/.temnorid/`: `ShellSceneKit.OauthSourcePath`.
- [x] graybox: rename the shader `Temnorid/WorldText` to `ITKP/WorldText`.

## Roadmap 5: Schemas are the source of truth

Packages: `3d-unity-scene`, `3d-unity-assets`, `3d-unity-save`, `3d-unity-inventory`, `3d-unity-graybox`; the five schemas.

- [x] scene and assets: `[JsonExtensionData]` on every model, copied through on save, so unknown fields survive a round trip.
- [x] scene, assets, save, inventory: read `schemaVersion`; refuse or warn on an unknown major version; keep the source version when writing.
- [ ] assets: add the 3d-asset-schema 1.1.0 `production` blocks (asset and library) to the C# models.
- [x] save: validate `gameId` and slot against the schema pattern (no `../`), compare them on read, require `schemaVersion`, refuse a non-object payload.
- [ ] graybox: `ModelSlots` validates ids against the AssetId pattern and writes the real placeholder shape.
- [x] inventory: null-guard `FromData`, check `schemaVersion`.
- [ ] Schema round-trip tests: every example document loads and saves back unchanged.
- [ ] Check model orientation across engines with one asymmetric asset (glTFast flips X, the scene loader flips Z).

## Roadmap 6: Remaining bugs and lifetimes

Packages: as listed per task. Projects: all games.

**net**
- [x] [medium] Leave during "Connecting" or a double Host leaks the Relay session (`NetOnline.cs` 39-85): attempt counter or CancellationToken; reject calls while connecting.
- [x] [medium] The host notices its session dying: `OnServerStopped`, `OnTransportFailure`, app pause.
- [x] [medium] Clients get `PlayerLeft` and drop stale poses (`NetSession.cs` 520-535).
- [x] [medium-low] Removed entities do not come back (`NetSession.cs` 702-720): tombstones or tick stamps.
- [x] [low-medium] Writers sized from the data; clean the host name; set `Started` after the send (`NetSession.cs` 260, 479, 491, 593).
- [x] [low] `UnityServices.State` instead of a static flag; `OnDestroy` leaves and destroys its NetworkManager; `[ipv6]:port` parsing; README test count.

**input**
- [x] [high] Re-apply saved overrides in `AddMap` (`EngineInput.cs` 242, 305-334).
- [x] [medium] Reset bindings re-applies the dominant hand (`EngineInput.cs` 392-397).
- [x] [medium] XR pose actions do not switch the scheme (`EngineInput.cs` 431-450).
- [x] [medium] Quest starts in the XR scheme, not Touch (`EngineInput.cs` 41).
- [x] [low-medium] Rebind disables the UI map and stays in its binding group (`EngineInput.cs` 346-373).

**character, camera, controls**
- [x] [high] Slope speed independent of frame rate (`CharacterMotor.cs` 158-181, 269-270).
- [x] [medium-high] Disabling the controls clears the command (`CharacterViewControls.cs` 65-70); lazy camera lookup.
- [x] [medium] No events while replaying commands (`CharacterMotor.cs` 183-195, 289).
- [x] [medium] Camera reads the starting yaw from the target transform (`CharacterViewCamera.cs` 87-90).
- [x] [medium] An XR path for Character View (head yaw, `Player.Turn`, no transform or FOV writes), or say in the docs that it is flat-screen only.
- [x] [low] Animator reads the motor in LateUpdate; first-person hiding re-collects renderers.

**scene, assets, audio**
- [x] [high] assets: a failing load always ends in `Fail` (`EngineAssets.cs` 261-313, 102); validate kind and source in `AddLibrary`.
- [x] [medium] assets: glTFast versionDefine `[5.0.0,)`; `LoadLibrary` routes jar/URL paths to `LoadLibraryFromUrl`; decide whether glTFast is a hard dependency.
- [x] [medium] assets: reference counting or per-scene scopes; redefining an id clears its cache entry. Redefining an id now clears its cache entry; reference counting of placed models followed in 3d-unity-assets 0.2.0.
- [x] [medium] scene: transforms relative to the parent SceneObject; skip SceneObjects inside asset content (`SceneSaver.cs` 45-55).
- [x] [medium] scene: destroy surface meshes on unload (`SceneLoader.cs` 184, `LoadedScene.cs` 72-75).
- [x] [low] scene: invariant culture for `updatedAt`, keep the origin scale, identity for a missing rotation.
- [x] [medium] audio: `Stop` bumps the voice generation (`EngineAudio.cs` 121-127); music requests use a generation too.
- [x] [medium] audio: stop looping voices whose follow target died; scene ambience goes through volume groups.
- [x] [design] audio: `FootstepPlayer` out of the core audio package (constructor package or optional asmdef), so audio no longer depends on character.

**combat, ai, ui, cameras, graybox**
- [x] [high] ai: a dead target is dropped at once (`AiAgent.cs` 117-162, 251).
- [x] [medium] ai: `AttackNeedsSight` works on its own (`AiAgent.cs` 145); patrol waits on arrival (`AiAgent.cs` 198-203).
- [x] [medium] combat: cache projectile materials (`Projectile.cs` 39); `SetMax(value, refill)` and clamp max health (`Health.cs` 57-60, 94).
- [x] [low] combat: non-alloc sphere cast and a hit point fallback; look up `IDamageable` or drop the README claim.
- [x] [design] combat and ai: one bridge so `AiTarget.Alive` follows `Health`.
- [x] [medium] topdown camera: no edge pan from a lifted touch (`OverheadCamera.cs` 55-65).
- [x] [low] ui: `FormatTime` invariant and rounded; `UiShapes.Circle` caches its texture.
- [x] [low] graybox: world text cache per font, folders created through the AssetDatabase.

**shell**
- [x] [medium] Sign-out resets the lord class, the synced name and `accountAsked` (subscribe to `GameAccount.Changed`).
- [x] [medium] Account button: show `LastError`, disable while busy, bail out after a scene change (`ShellProfilePanel.cs` 121-132).
- [x] [low-medium] Android version code with 1,000,000 / 1,000 multipliers; orientation and architectures as parameters; `SetBuildOrder` uses the given paths.
- [x] [low] Reset statics on SubsystemRegistration; `OnGameStarted` goes through `ShellFlow.LoadGame`; keep the NetSession reference from Awake.
- [x] [low] Synced name is read-only and cleaned; hide Google when unavailable; save the profile on end edit, not every keystroke.

**core**
- [x] [low] Reset `EngineLog.MinimumLevel` on play start; avoid the invocation array in `EngineEvents.Publish`; README says `3d-unity-net`.

## Roadmap 7: Math Runner as the reference game

Project: Math Runner. Details in `math-runner.itkamianets.com/PLAN.md`.

- [x] Merge `master` into `dev`, keep releasing from `master`.
- [ ] Use the `assetra.json` ids, add glTFast, remove the duplicate model sets. glTFast added (dev); repointing the prefabs to the ids and removing the old model sets needs the Unity editor, see the game's PLAN.md.
- [x] Pin and trim its packages; move to `3d-unity-update` once roadmap 1 lands.
- [ ] CI with tests and the Windows release.
- [ ] Copy the result into the constructor starters.

## Roadmap 8: Docs that agree with the code

Packages: this site. Projects: the constructor starters.

- [x] README: four layers and five groups, as in the docs (it still says three layers and four groups).
- [x] Architecture: when to use `3d-unity-net` or `3d-unity-network`, and whether both stay.
- [x] Character View pages: VR claims only once the XR path exists.
- [x] Per-package docs list the known limits found here until they are fixed (save atomicity, IL2CPP updater, unpinned installs).
- [x] Update `packages.json`, `ua.json`, `llms.txt` and `packages.md` with each package release from roadmap 2.
