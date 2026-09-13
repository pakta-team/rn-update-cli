/**
 * [INPUT]: 依赖文件系统、路径、yazl ZIP 写入器、本地化文案与 ZIP 条目压缩策略
 * [OUTPUT]: 对外提供 packBundle，将 bundle 目录打包为 CLI 发布制品
 * [POS]: CLI PPK 制品打包器，只决定条目边界和压缩方式，不负责 bundle 生成与上传
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import * as fs from 'fs-extra';
import path from 'path';
import { ZipFile as YazlZipFile } from 'yazl';
import { t } from './utils/i18n';
import { zipOptionsForPayloadFile } from './utils/zip-options';

const ignorePackingExtensions = ['DS_Store', 'txt.map'];

export async function packBundle(
  dir: string,
  output: string,
  bundleName?: string,
): Promise<void> {
  const ignorePackingFileNames = [
    'index.bundlejs.map',
    'bundle.harmony.js.map',
  ];
  if (bundleName) {
    ignorePackingFileNames.push(`${bundleName}.map`);
  }
  console.log(t('packing'));
  fs.ensureDirSync(path.dirname(output));
  await new Promise<void>((resolve, reject) => {
    const zipfile = new YazlZipFile();

    function addDirectory(root: string, rel: string) {
      if (rel) {
        zipfile.addEmptyDirectory(rel);
      }
      const children = fs.readdirSync(root);
      for (const name of children) {
        if (
          ignorePackingFileNames.includes(name) ||
          ignorePackingExtensions.some((ext) => name.endsWith(`.${ext}`))
        ) {
          continue;
        }
        const fullPath = path.join(root, name);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          zipfile.addFile(
            fullPath,
            rel + name,
            zipOptionsForPayloadFile(fullPath, rel + name),
          );
        } else if (stat.isDirectory()) {
          addDirectory(fullPath, `${rel}${name}/`);
        }
      }
    }

    addDirectory(dir, '');

    zipfile.outputStream.on('error', (err: unknown) => reject(err));
    zipfile.outputStream.pipe(fs.createWriteStream(output)).on('close', () => {
      resolve();
    });
    zipfile.end();
  });
  console.log(t('fileGenerated', { file: output }));
}
