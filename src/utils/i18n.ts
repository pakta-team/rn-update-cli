/**
 * [INPUT]: 依赖 i18next、CLI en/zh 文案资源与 RNU_LANG 环境覆盖
 * [OUTPUT]: 对外提供 resolveLanguage 与 t，初始化 Pakta CLI 本地化资源
 * [POS]: CLI 文案适配层，统一语言选择和模板翻译，不包含命令业务逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import i18next from 'i18next';
import en from '../locales/en';
import zh from '../locales/zh';

/**
 * UI language: `RNU_LANG=en|zh` (a locale such as `zh_CN` counts by its
 * prefix) overrides the Pakta default.
 */
export function resolveLanguage(
  env: NodeJS.ProcessEnv = process.env,
  defaultLanguage: 'en' | 'zh' = 'zh',
): 'en' | 'zh' {
  const override = env.RNU_LANG?.trim().toLowerCase();
  if (override?.startsWith('zh')) return 'zh';
  if (override?.startsWith('en')) return 'en';
  return defaultLanguage;
}

i18next.init({
  lng: resolveLanguage(),
  // debug: process.env.NODE_ENV !== 'production',
  // debug: true,
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'en';
    // custom resources type
    resources: {
      en: typeof en;
      zh: typeof zh;
    };
    // other
  }
}

export function t(key: string, options?: any): string {
  return i18next.t(key as any, options);
}
