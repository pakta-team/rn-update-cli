#!/usr/bin/env bun

/**
 * [INPUT]: 依赖 Bun shell、Git tag、npm 发布环境与 package.json
 * [OUTPUT]: 对外提供 CLI 发布前版本写入和 dry-run 守门流程
 * [POS]: scripts 发版编排入口，只在包发布阶段修改版本元数据
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { $ } from 'bun';

async function modifyPackageJson({
  version,
}: {
  version: string;
}): Promise<void> {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');

  try {
    await access(packageJsonPath);
  } catch {
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }

  console.log('Reading package.json...');
  const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);

  packageJson.version = version;

  console.log('Writing modified package.json...');

  await writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8',
  );

  console.log('package.json has been modified for publishing');
}

async function main(): Promise<void> {
  const isDryRun =
    process.env.PUBLISH_DRY_RUN === 'true' ||
    process.env.npm_config_dry_run === 'true';

  const rawVersion =
    process.env.PUBLISH_VERSION ??
    (await $`git describe --tags --always`.text());
  const version = rawVersion.trim().replace(/^v/, '');

  if (!/^\d+\.\d+\.\d+/.test(version)) {
    console.error(
      `❌ Refusing to publish with non-semver version "${version}" (from ${
        process.env.PUBLISH_VERSION ? 'PUBLISH_VERSION' : 'git describe'
      })`,
    );
    process.exit(1);
  }

  if (isDryRun) {
    console.log(`Dry run publish detected; using version ${version}`);
  }
  try {
    await modifyPackageJson({ version });
    console.log('✅ Prepublish script completed successfully');
  } catch (error) {
    console.error('❌ Prepublish script failed:', error);
    process.exit(1);
  }
}

main();
