#!/usr/bin/env bash

PACKAGE="peek"

set -o nounset
set -o errexit
#set -x

if [ -n "$(git status --porcelain)" ]; then
    echo "There are uncomitted changes, please make sure all changes are comitted" >&2
    exit 1
fi

if ! [ -f "setup.py" ]; then
    echo "setver.sh must be run in the directory where setup.py is" >&2
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

echo "Compiling TypeScript"
tsc


echo "Updating package version"
npm version $VER

echo "Pushing to Git"
git push
git push --tags

echo "Publishing to NPM"
npm publish --access=public


echo
echo "Done"
echo