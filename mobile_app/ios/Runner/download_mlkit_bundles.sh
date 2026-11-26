#!/bin/bash
set -euo pipefail

RESOURCE_DIR="${1:?Pass the built app resources directory}"
BUNDLE_DIR="$(cd "$(dirname "$0")" && pwd)/mlkit_bundles"
VERSION="9.0.3"
BUNDLES=(
  "MLKitSegmentationSelfieResources.bundle"
  "MLKitSegmentationCommonResources.bundle"
  "MLKitXenoResources.bundle"
)

mkdir -p "$BUNDLE_DIR" "$RESOURCE_DIR"

for BUNDLE in "${BUNDLES[@]}"; do
  CACHED_BUNDLE="$BUNDLE_DIR/$BUNDLE"
  if [[ ! -d "$CACHED_BUNDLE" ]]; then
    TEMP_DIR="$(mktemp -d)"
    if ! curl --fail --location --silent --show-error \
      --output "$TEMP_DIR/$BUNDLE.zip" \
      "https://github.com/d-date/google-mlkit-swiftpm/releases/download/$VERSION/$BUNDLE.zip"; then
      rm -rf "$TEMP_DIR"
      exit 1
    fi
    if ! unzip -q "$TEMP_DIR/$BUNDLE.zip" -d "$TEMP_DIR"; then
      rm -rf "$TEMP_DIR"
      exit 1
    fi
    if [[ ! -d "$TEMP_DIR/$BUNDLE" ]]; then
      rm -rf "$TEMP_DIR"
      echo "Expected $BUNDLE in the ML Kit resource archive." >&2
      exit 1
    fi
    ditto "$TEMP_DIR/$BUNDLE" "$CACHED_BUNDLE"
    rm -rf "$TEMP_DIR"
  fi

  rm -rf "$RESOURCE_DIR/$BUNDLE"
  ditto "$CACHED_BUNDLE" "$RESOURCE_DIR/$BUNDLE"
done
