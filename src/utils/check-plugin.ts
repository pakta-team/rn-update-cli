/**
 * [INPUT]: 依赖本地化文案与已登记的 CLI 插件配置
 * [OUTPUT]: 对外提供 checkPlugins，校验插件组合并返回 bundle 参数
 * [POS]: CLI 插件兼容性检查边界，连接配置声明与 bundle 编排，不执行插件安装
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { t } from './i18n';
import { plugins } from './plugin-config';

interface BundleParams {
  sentry: boolean;
  sourcemap: boolean;
  [key: string]: any;
}

export async function checkPlugins(): Promise<BundleParams> {
  const params: BundleParams = {
    sentry: false,
    sourcemap: false,
  };

  const results = await Promise.all(
    plugins.map(async (plugin) => {
      try {
        const isEnabled = await plugin.detect();
        return { isEnabled, error: null };
      } catch (error) {
        return { isEnabled: false, error };
      }
    }),
  );

  results.forEach(({ isEnabled, error }, index) => {
    const plugin = plugins[index];
    if (error) {
      console.warn(t('pluginDetectionError', { name: plugin.name, error }));
    } else if (isEnabled && plugin.bundleParams) {
      Object.assign(params, plugin.bundleParams);
      console.log(t('pluginDetected', { name: plugin.name }));
    }
  });

  return params;
}
