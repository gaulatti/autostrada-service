# Autostrada backend service

> **Disposition: retained recovery and maintenance surface.** This repository is
> the historical source and delivery owner for the API edge at
> [`api.autostrada.gaulatti.com`](https://api.autostrada.gaulatti.com). The edge
> was reported reachable in September; current edge, application and database
> health remain unverified. Do not
> deploy from this repository until the blocked recovery work is complete. See
> [OWNERSHIP.md](OWNERSHIP.md) for the evidence, ownership, and rollback contract.

This is the NestJS backend for the Autostrada web-performance application. Its
source, migrations, and tests are retained because the frontend still names the
API and historical delivery evidence ties this repository to the service log.
That evidence does not establish that the current nginx-gated endpoint is
serving a healthy application.

Original external audit receipts were not retained. September cloud, HTTP,
consumer and operational reports below are historical and unverified; the
retention decision preserves source without asserting current live state.

## Current source delivery state

Automatic deployment has been removed from the repository workflow. The old
push-to-`main` job names a registry reported absent in September and a
legacy long-lived AWS identity. Its server-side workflow was also disabled
manually so it cannot run before this pull request is merged. Re-enabling
delivery is blocked by:

- [`gaulatti/autostrada#2`](https://github.com/gaulatti/autostrada/issues/2),
  which owns infrastructure drift, credential-output removal, and migration to
  short-lived deployment credentials; and
- [`gaulatti/autostrada-service#3`](https://github.com/gaulatti/autostrada-service/issues/3),
  which owns an immutable release, application health proof, and rollback drill.

Merging a pull request runs CI only. It must not build, publish, restart, or
replace the live service.

## Local verification

Local development still uses the historical Node/NestJS toolchain:

```bash
npm ci
npm run build
npm test -- --runInBand
npx eslint '{src,apps,libs,test}/**/*.ts'
```

Environment names are listed in [`.env.template`](.env.template). Never commit
values, copy the retired deployment identity, or treat the template as a
production secret-distribution contract.

## Safe change boundary

- Preserve migrations and history until a database recovery owner proves they
  are no longer needed.
- Do not infer backend health from DNS, TLS, or nginx responses.
- Do not archive this repository while the API hostname and frontend dependency
  remain.
- Do not restore automatic deployment without the acceptance evidence in issue
  #3.
