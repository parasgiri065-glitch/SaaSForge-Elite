# SaaSForge Elite — Enterprise Asset Bundle

This directory is the **Enterprise / Agency** add-on. It is not MIT. It ships
only with a paid Enterprise / Agency license (USD $349). See
[`ENTERPRISE-LICENSE.md`](./ENTERPRISE-LICENSE.md) and the root
[`LICENSE.md`](../LICENSE.md).

## Contents

| Path | What it is |
| --- | --- |
| `cursorrules/` | Ten production Cursor rule files. Drop any file into a project as `.cursorrules`, or concatenate them into `.cursor/rules`. |
| `whitepapers/Multi-Tenant-Caching-Architecture.md` | Cache invalidation, edge tags, and RLS data-boundary isolation. |
| `ENTERPRISE-LICENSE.md` | Unlimited commercial / client deployment. Public source redistribution is prohibited. |

## Pack the zip

From the repository root:

```bash
pnpm pack:enterprise
```

or

```bash
bash scripts/pack-enterprise-assets.sh
```

This writes `enterprise-assets.zip` at the **repository root** (gitignored).

## How to apply the Cursor rules

1. Copy one topic file to the app root as `.cursorrules` for a focused session.
2. Or copy all ten into `.cursor/rules/*.mdc` (Cursor 1.0+ project rules).
3. Keep the root `.cursorrules` in this repo as the kit’s own contract; these
   files are the **enterprise expansion pack** for client projects you generate
   from the kit.

Do not publish this folder, the zip, or any rule file to a public template
marketplace. That is redistribution of the Software, which this license forbids.
