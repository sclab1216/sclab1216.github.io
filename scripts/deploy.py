#!/usr/bin/env python3
"""Deploy the SCLab static site while preserving /var/www/html/bigdefense."""

from __future__ import annotations

import argparse
import shlex
import shutil
import subprocess
import tempfile
import uuid
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_KEY = PROJECT_ROOT / "secret" / "sclab_bigdefense.pem"
SITE_ITEMS = (
    "index.html",
    "app.js",
    "style.css",
    "compact.css",
    "sticky.css",
    "data",
    "shared",
    "resource",
)


def run(command: list[str], input_text: str | None = None) -> None:
    print("+", " ".join(shlex.quote(part) for part in command))
    subprocess.run(command, check=True, input=input_text, text=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="13.209.12.211")
    parser.add_argument("--user", default="ubuntu")
    parser.add_argument("--key", type=Path, default=DEFAULT_KEY)
    args = parser.parse_args()

    key = args.key.expanduser().resolve()
    if not key.is_file():
        raise SystemExit(f"SSH key not found: {key}")
    key.chmod(0o600)

    missing = [item for item in SITE_ITEMS if not (PROJECT_ROOT / item).exists()]
    if missing:
        raise SystemExit(f"Missing site files: {', '.join(missing)}")

    target = f"{args.user}@{args.host}"
    remote_stage = f"/tmp/sclab-deploy-{uuid.uuid4().hex}"
    ssh_base = [
        "ssh",
        "-i",
        str(key),
        "-o",
        "BatchMode=yes",
        "-o",
        "StrictHostKeyChecking=accept-new",
    ]

    with tempfile.TemporaryDirectory(prefix="sclab-site-") as temp_dir:
        stage = Path(temp_dir)
        for item in SITE_ITEMS:
            source = PROJECT_ROOT / item
            destination = stage / item
            if source.is_dir():
                shutil.copytree(source, destination)
            else:
                shutil.copy2(source, destination)

        run(ssh_base + [target, f"mkdir -p {shlex.quote(remote_stage)}"])
        try:
            run(
                [
                    "scp",
                    "-i",
                    str(key),
                    "-o",
                    "BatchMode=yes",
                    "-o",
                    "StrictHostKeyChecking=accept-new",
                    "-r",
                    *[str(stage / item) for item in SITE_ITEMS],
                    f"{target}:{remote_stage}/",
                ]
            )

            remote_script = f"""
set -euo pipefail
stage={shlex.quote(remote_stage)}
webroot=/var/www/html
backup=/var/backups/sclab-site/$(date +%Y%m%d-%H%M%S)

test -d "$webroot/bigdefense"
test -f "$stage/index.html"
sudo mkdir -p "$backup"

rollback() {{
  sudo find "$webroot" -mindepth 1 -maxdepth 1 ! -name bigdefense -exec rm -rf -- {{}} +
  sudo find "$backup" -mindepth 1 -maxdepth 1 -exec mv -- {{}} "$webroot"/ \;
}}
trap rollback ERR

sudo find "$webroot" -mindepth 1 -maxdepth 1 ! -name bigdefense -exec mv -- {{}} "$backup"/ \;
sudo cp -a "$stage"/. "$webroot"/
sudo find "$webroot" -mindepth 1 -maxdepth 1 ! -name bigdefense -exec chown -R www-data:www-data -- {{}} +
sudo nginx -t
trap - ERR
rm -rf "$stage"

printf 'DEPLOYED=%s\n' "$webroot"
printf 'PRESERVED=%s\n' "$webroot/bigdefense"
printf 'BACKUP=%s\n' "$backup"
"""
            run(ssh_base + [target, "bash -s"], input_text=remote_script)
        finally:
            subprocess.run(ssh_base + [target, f"rm -rf {shlex.quote(remote_stage)}"], check=False)


if __name__ == "__main__":
    main()
