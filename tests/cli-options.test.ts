/**
 * [INPUT]: 依赖 Bun 测试运行时与 CLI 命令配置和隔离夹具
 * [OUTPUT]: 验证 参数白名单与解析
 * [POS]: tests 的行为回归边界，通过隔离夹具约束对应生产模块
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { describe, expect, test } from 'bun:test';
import cliConfig from '../cli.json';

const cliArguments: {
  parse: (
    config: Record<string, unknown>,
    argv: string[],
  ) => { command: string; options: Record<string, unknown>; args: string[] };
} = require('cli-arguments');

describe('cli.json options', () => {
  test('bundle accepts Sentry source map upload options', () => {
    const parsed = cliArguments.parse(cliConfig, [
      'bundle',
      '--sentry-release',
      'com.example@1.0.0+1+pakta:hash',
      '--sentry-dist',
      'pakta:hash',
    ]);

    expect(parsed.command).toBe('bundle');
    expect(parsed.options).toEqual(
      expect.objectContaining({
        'sentry-release': 'com.example@1.0.0+1+pakta:hash',
        'sentry-dist': 'pakta:hash',
      }),
    );
  });
});
