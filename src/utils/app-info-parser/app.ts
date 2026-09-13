/**
 * [INPUT]: 依赖通用 Zip 容器读取能力
 * [OUTPUT]: 对外提供 AppParser，处理 macOS .app 包的通用归档边界
 * [POS]: 应用包解析子域的轻量 fallback，实现与平台特定解析器一致的 parse 接口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Zip } from './zip';

export class AppParser extends Zip {
  async parse(): Promise<Record<string, never>> {
    return {};
  }
}
