#!/usr/bin/env bash

PACKAGE="vortexjs"

set -o nounset
set -o errexit

echo "Compiling TypeScript"
tsc

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

echo "Setting version to $VER"

# Update the setup.py
#sed -i "s;^package_version.*=.*;package_version = '${VER}';"  setup.py

# Update the package version
#sed -i "s;.*version.*=.*;__version__ = '${VER}';" ${PACKAGE}/__init__.py
#sed -i "s;.*version.*=.*;__version__ = '${VER}';" docs/conf.py


echo "Updating package version"
npm version $VER --allow-same-version

echo "Pushing to Git"
git push
git push --tags

echo "Publishing to NPM"
npm publish --access=public


echo
echo "Done"
echo
