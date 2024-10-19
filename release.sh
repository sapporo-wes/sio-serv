#!/usr/bin/env bash
set -euxo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <new_version>"
  exit 1
fi

PREV_VERSION=$(git describe --abbrev=0 --tags)
NEW_VERSION=$1

read -p "Update version from $PREV_VERSION to $NEW_VERSION? (y/n): " YN

if [[ "$YN" != "y" ]]; then
  echo "Aborted."
  exit 1
fi

NOW_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$NOW_BRANCH" != "main" ]]; then
  echo "You must be on the main branch."
  git checkout main
fi

echo "Rewrite version in files."
sed -i "s/version=\"$PREV_VERSION\"/version=\"$NEW_VERSION\"/g" Dockerfile
# sed -i "s/sio-serv:$PREV_VERSION/sio-serv:$NEW_VERSION/g" compose.yml
sed -i "s/\"version\": \"$PREV_VERSION\"/\"version\": \"$NEW_VERSION\"/g" package.json

echo "Commit and push changes."
# git add Dockerfile compose.yml package.json
git add Dockerfile package.json
git commit -m "Update version to $NEW_VERSION"
git push origin main

echo "Tag and push."
git tag $NEW_VERSION
git push origin $NEW_VERSION

echo "Done."

echo "Summary of changes:"
git log --oneline --pretty=tformat:"%h %s" "$PREV_VERSION..$NEW_VERSION"

exit 0
