/**
 * [INPUT]: 依赖文件系统与 CLI 插件配置文件格式
 * [OUTPUT]: 对外提供 plugins，声明可参与 bundle 的插件及其参数映射
 * [POS]: CLI 插件注册配置，只描述已支持的集成，不执行插件逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import * as fs from 'fs-extra';

interface PluginConfig {
  name: string;
  bundleParams?: {
    [key: string]: any;
  };
  detect: () => Promise<boolean>;
}

export const plugins: PluginConfig[] = [
  {
    name: 'sentry',
    bundleParams: {
      sentry: true,
      sourcemap: true,
    },
    detect: async () => {
      try {
        await fs.access('ios/sentry.properties');
        return true;
      } catch {
        try {
          await fs.access('android/sentry.properties');
          return true;
        } catch {
          return false;
        }
      }
    },
  },
];
