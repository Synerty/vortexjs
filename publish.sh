#!/usr/bin/env bash

PACKAGE="vortexjs"

set -o nounset
set -o errexit

echo "Compiling TypeScript"
tsc || true

if [ -n "$(git status --porcelain)" ]; then
    echo "There are uncomitted changes, please make sure all changes are comitted" >&2
    exit 1
fi

if ! [ -f "package.json" ]; then
    echo "publish.sh must be run in the directory where package.json is" >&2
    exit 1
fi

VER="${1:?You must pass a version of the format 0.0.0 as the only argument}"

if git tag | grep -q "${VER}"; then
    echo "Git tag for version ${VER} already exists." >&2
    exit 1
fi

echo "Updating package version"
npm version $VER --allow-same-version

echo "Pushing to Git"
git push
git push --tags

# Build the angular package
NG_VER="~10.2.0"
TS_VER="~4.0.0"
npm install -g ng-packagr
npm install -g @angular/compiler-cli@${NG_VER}
npm install -g @angular/compiler@${NG_VER}
npm install -g typescript@${TS_VER}
npm run packagr

echo "Publishing to NPM"
(cd dist && npm publish --access=public)


echo
echo "Done"
echo
