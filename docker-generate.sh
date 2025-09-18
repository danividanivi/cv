#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME=cv-resume:latest
CONTAINER_NAME=cv-build-$$

echo "[Docker] Building image ${IMAGE_NAME}..." >&2
docker build -t "${IMAGE_NAME}" .

echo "[Docker] Running generation inside container..." >&2
docker run --name "${CONTAINER_NAME}" "${IMAGE_NAME}" >/dev/null

echo "[Docker] Copying artifacts out..." >&2
docker cp "${CONTAINER_NAME}:/app/resume.pdf" ./resume.pdf
docker cp "${CONTAINER_NAME}:/app/resume.txt" ./resume.txt

echo "[Docker] Computing checksum..." >&2
sha256sum resume.pdf | tee resume.pdf.sha256

docker rm "${CONTAINER_NAME}" >/dev/null
echo "Done. Artifacts: resume.pdf, resume.txt, resume.pdf.sha256" >&2
