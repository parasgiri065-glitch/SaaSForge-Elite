#!/usr/bin/env bash
# Pack enterprise-bundle/ into enterprise-assets.zip at the repository root.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUNDLE="${ROOT}/enterprise-bundle"
OUTPUT="${ROOT}/enterprise-assets.zip"

if [[ ! -d "${BUNDLE}" ]]; then
  echo "error: ${BUNDLE} does not exist" >&2
  exit 1
fi

if [[ ! -f "${BUNDLE}/ENTERPRISE-LICENSE.md" ]]; then
  echo "error: ENTERPRISE-LICENSE.md missing from the bundle" >&2
  exit 1
fi

rm -f "${OUTPUT}"

if command -v zip >/dev/null 2>&1; then
  (
    cd "${ROOT}"
    zip -r -q "${OUTPUT}" enterprise-bundle \
      -x "enterprise-bundle/.DS_Store" \
      -x "enterprise-bundle/**/.DS_Store"
  )
else
  ROOT="${ROOT}" python3 - <<'PY'
import os
import pathlib
import zipfile

root = pathlib.Path(os.environ["ROOT"])
bundle = root / "enterprise-bundle"
output = root / "enterprise-assets.zip"
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as zf:
    for path in bundle.rglob("*"):
        if path.name == ".DS_Store":
            continue
        zf.write(path, path.relative_to(root).as_posix())
PY
fi

echo "wrote ${OUTPUT}"
ls -lh "${OUTPUT}"
