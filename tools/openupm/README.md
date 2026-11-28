# OpenUPM listings (prepared, not submitted)

OpenUPM is the chosen registry for the engine packages. Each file here is the listing OpenUPM expects at
`data/packages/<package-name>.yml` in [openupm/openupm](https://github.com/openupm/openupm), one per Unity
package of the IT-Kamianets organization. The format follows
[Adding a UPM package](https://openupm.com/docs/adding-upm-package.html).

Not included: `com.itkamianets.3d-unity-network`, which is deprecated (use `3d-unity-net`).

## Before submitting

- Fill `hunter` with the GitHub username of whoever submits the listings.
- A package needs at least one `vX.Y.Z` tag matching its `package.json` version. These have none yet:
  `3d-unity-interaction`, `3d-unity-spatial`, `3d-unity-xr`, `3d-unity-firebase` and
  `3d-constructor-vr-controls`. Tag them first, or leave their files out.
- Submit the packages a package depends on in the same batch (every package declares its engine
  dependencies in `package.json`), starting with `3d-unity-core`.
- Descriptions are the catalog summaries (`src/data/catalog/packages.json`); keep them in step.

## After the packages are listed

Games add the scoped registry once to `Packages/manifest.json` and list packages by version:

```json
{
  "scopedRegistries": [
    { "name": "OpenUPM", "url": "https://package.openupm.com", "scopes": ["com.itkamianets"] }
  ],
  "dependencies": {
    "com.itkamianets.3d-constructor-character-view-controls": "0.3.0"
  }
}
```

Then update the Installation page (the "Package registry (coming soon)" section and its Ukrainian text)
and the manifest blocks in the docs and the starters' AGENTS.md.
