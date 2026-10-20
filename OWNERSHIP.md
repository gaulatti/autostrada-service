# Autostrada backend ownership and disposition audit

Audit date: 2026-09-07

Default branch and audited commit: `main` at
`51298138b11d8f5767fa24e37ba541a5eefe3a51`

## Decision

External API, AWS, DNS, HTTP, TLS, credential-correlation and consumer statements
are unverified September reports: their original command receipts are
unavailable. They do not prove current ownership, resource existence, absence,
credential validity or health. Retaining source avoids treating unknown recovery
dependencies as safely decommissioned. Current source and CI evidence are
recorded separately.

**Disposition: retained recovery and maintenance surface.**

This repository is not a healthy-product claim. It is retained because the
reported API hostname, frontend configuration, historical delivery identity use,
and service log timeline described this source and delivery contract. The
application and database behind nginx could not be proven healthy, the declared
ECR repository was reported absent, and the reported last service-log ingestion
was 2025-10-20.
Archival or a superseded designation would discard the only identified backend
source and migrations while live dependencies remain.

The unsafe automatic delivery path is quarantined by this audit. Recovery and
a controlled release remain blocked work, not an implied authorization to
deploy.

## Ownership and delivery contract

| Responsibility | Contract |
| --- | --- |
| Product and repository owner | GitHub repository owner `gaulatti` |
| Canonical source | [`gaulatti/autostrada-service`](https://github.com/gaulatti/autostrada-service), origin `git@github.com:gaulatti/autostrada-service.git`; intended durable checkout `/Users/gaulatti/source/gaulatti/autostrada-service` |
| Audit checkout | `/Users/gaulatti/source/gaulatti/autostrada-service.worktrees/issue-2-ownership-disposition` |
| Production edge | `https://api.autostrada.gaulatti.com`, an nginx endpoint at the Route 53 A record owned outside AWS compute |
| Historical delivery target | Image `autostrada:latest` in the `autostrada` ECR repository, then an SSH-managed on-premises container on port `3001`; ECR is currently absent and `latest` is not an acceptable recovery identity |
| Infrastructure owner | [`gaulatti/autostrada`](https://github.com/gaulatti/autostrada), CloudFormation stack `Autostrada` |
| Frontend consumer | [`gaulatti/autostrada-frontend`](https://github.com/gaulatti/autostrada-frontend); its Actions variable `VITE_API_FQDN` names the production edge |
| Secrets owner | The `gaulatti` repository owner through GitHub Actions secret metadata plus the Autostrada infrastructure owner; values are not part of this document |
| Build and test | `npm ci`, `npm run build`, `npm test -- --runInBand`, then non-mutating ESLint |
| Release path | None currently approved. The historical automatic deployment is disabled; [`autostrada-service#3`](https://github.com/gaulatti/autostrada-service/issues/3) owns restoration after the infrastructure gate. |
| Historical health report | September notes describe DNS, TLS, and nginx only. Root redirects and application paths return nginx-owned responses; no NestJS or database health response was proven. |
| Recovery and rollback | Preserve Git history and migrations. The last image digest and live container identity are unavailable because ECR is absent; no release or rollback is authorized until issue #3 records both immutable identities and exercises rollback. |

## Evidence

| Surface | Method | Result |
| --- | --- | --- |
| Git source | Fresh remote clone, Git history, and GitHub repository API | Public, unarchived repository; unprotected default branch `main`; audited SHA `51298138b11d8f5767fa24e37ba541a5eefe3a51`; last commit and push 2025-05-27; no tags. No `AGENTS.md` or repository updater exists. The repository description now identifies the retained, nginx-gated recovery state. |
| Repository controls | GitHub Pages, hooks, rulesets, and branch-protection APIs | No Pages site, webhook, ruleset, or branch protection. Issues and Actions are enabled. |
| Security settings | GitHub repository security APIs | Secret scanning and push protection are enabled. Dependabot security updates and vulnerability alerts are disabled. |
| Releases and GitHub delivery records | GitHub releases, deployments, and environments APIs | No release, tag, GitHub deployment record, or GitHub environment exists. GitHub Packages could not be enumerated because the audit token lacks `read:packages`; the package manifest is private and contains no publish script. |
| Actions and schedules | Workflow, run, permissions, variable-name, and secret-name APIs | One active push/PR workflow existed, with no schedule. GitHub retained zero historical run records. Seventeen secret names and four variable names exist; no repository-secret value was requested. The workflow was manually disabled at 2026-09-07T05:38Z so it cannot run before this PR removes the automatic ECR/SSH job and restores CI only. |
| Historical release correlation | Git push time, IAM last-used metadata, and CloudWatch log-stream metadata | The legacy delivery key was last used with ECR at 2025-05-27T14:06Z, immediately after the audited commit was pushed. A new `/services/autostrada` log stream began at 14:07Z. This strongly ties the repository workflow to that deployment but cannot recover the deleted image digest. |
| Live service log | CloudWatch Logs stream metadata only | The stream continued ingesting until 2025-10-20T06:30Z. No message body was needed or recorded. There has been no newer service-log evidence. |
| DNS and TLS | Route 53, `dig`, `curl`, and certificate inspection | `api.autostrada.gaulatti.com` is an A record to the on-premises edge. Its dedicated Let's Encrypt certificate was renewed in July 2026 and was valid at audit time. |
| HTTP behavior | Unauthenticated HTTPS and targeted configured-port probes | nginx returns a 302 from `/` to a non-product URL and 401 for `/health`, `/authorization/health`, and repository-public API routes. The configured direct port `3001` rejects external connections. These results prove the edge and firewall posture, not the application. |
| AWS infrastructure | Read-only CloudFormation, ECR, RDS, and Logs APIs | Stack `Autostrada` is `UPDATE_COMPLETE` but drift was never checked. It declares ECR `autostrada`, which is absent; no RDS instance containing `autostrada` was found in `us-east-1`; the service log group remains. Stack drift and legacy credential outputs are tracked by [`gaulatti/autostrada#2`](https://github.com/gaulatti/autostrada/issues/2). |
| Frontend dependency | `autostrada-frontend` Actions variable metadata and default-branch source | `VITE_API_FQDN` is `https://api.autostrada.gaulatti.com`; the live frontend hostname and its authentication callback still exist. |
| Portfolio references | Exact `rg` under `/Users/gaulatti/source/gaulatti` and `/Users/gaulatti/source/fifthbell`, plus GitHub code search | Milano probes the frontend; Macondo retains its callback/logout URL; Ariston and Alcantara navigation link to it. Searches for `autostrada-service`, `@autostrada/service`, `autostrada:latest`, `Autostrada/Metrics`, and the API hostname found no second backend implementation. |
| Local source health | Clean `npm ci` attempt from the fresh audit checkout | Installation stopped with local `ENOSPC` before build/tests could start. The incomplete generated `node_modules` directory was removed and the Git worktree remained clean. Hosted CI is the verification boundary for this PR. |

## Before and after

Before this audit, the README described a working core backend and instructed
operators to build and run it, while every push to `main` could execute a
mutable-image ECR/SSH deployment with long-lived credentials. It did not warn
that the registry is absent, the edge health is nginx-only, or the live runtime
and database are unverified.

After this audit:

- the README identifies a retained recovery surface rather than a healthy
  product;
- the GitHub repository description identifies the same retained state;
- ownership, live and historical boundaries, verification commands, and
  recovery guardrails are explicit;
- the workflow performs CI only and cannot publish or restart the service; and
- service release proof is isolated in
  [`autostrada-service#3`](https://github.com/gaulatti/autostrada-service/issues/3),
  natively blocked by the infrastructure and credential work in
  [`gaulatti/autostrada#2`](https://github.com/gaulatti/autostrada/issues/2).

No application deployment, AWS mutation, credential use or rotation, DNS
change, package deletion, repository archive action, or history rewrite was
performed. The September notes report credential-valued stack outputs;
the value is not reproduced in this repository, its issues, or the pull request.

## Residual risks and unknowns

- Current edge behavior is unverified; no proven route distinguishes proxy,
  application, and database health.
- The live container image, source SHA, process status, database location,
  backup state, and authenticated behavior remain unverified.
- The historical ECR repository and its immutable image digest are absent.
- The CloudFormation stack has unreviewed source/live drift and exposes a legacy
  long-lived deployment credential through stack outputs. Values must never be
  copied into issues, source, workflow logs, or handoffs. The authorized repair
  and rotation gate is `gaulatti/autostrada#2`.
- Repository `main` is unprotected, security updates are disabled, and the
  Actions secret inventory still contains historical deployment names.
- GitHub Packages were not enumerable with the audit token, and local source
  validation was blocked by host disk exhaustion. Neither gap is treated as
  positive health evidence.

## Recovery guardrails

Do not deploy merely to test this disposition. First complete
`gaulatti/autostrada#2`, then follow `autostrada-service#3` to establish a
short-lived delivery identity, recreate or replace the registry deliberately,
add an application-owned health contract, capture the current host state, and
release a content-addressed image in an approved window. The same checks must
pass after rollback to the previously recorded digest.

Do not archive the repository while the API DNS record, frontend configuration,
or historical database recovery dependency remains. A future retirement plan
must coordinate nginx/DNS, the frontend, Macondo identity callbacks, Milano,
CloudWatch logs, database recovery, secrets, and the Autostrada infrastructure
stack before archival can be considered.
