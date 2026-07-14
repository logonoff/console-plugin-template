#!/usr/bin/env bash

set -euo pipefail

# https://ci-operator-configresolver-ui-ci.apps.ci.l2s4.p1.openshiftapps.com/help#env
OPENSHIFT_CI=${OPENSHIFT_CI:=false}
ARTIFACT_DIR=${ARTIFACT_DIR:=/tmp/artifacts}

if [ ! -d node_modules ]; then
  yarn install --immutable
fi

yarn i18n
GIT_STATUS="$(git status --short --untracked-files -- locales)"
if [ -n "$GIT_STATUS" ]; then
  echo "i18n files are not up to date. Run 'yarn i18n' then commit changes."
  git --no-pager diff
  exit 1
fi

if ! yarn dedupe --strategy highest --check ; then
  echo "You have duplicate version resolutions of some packages in yarn.lock. Run 'yarn dedupe' and commit the updated yarn.lock."
  yarn dedupe --strategy highest
  git --no-pager diff
  exit 1
fi

if [ "$OPENSHIFT_CI" = true ]; then
  RSTEST_JUNIT_OUTPUT="$ARTIFACT_DIR/junit.xml" yarn run test --pool.maxWorkers=2
else
  yarn run test
fi
