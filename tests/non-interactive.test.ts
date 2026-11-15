/**
 * [INPUT]: 依赖 Bun 测试运行时与 ../src/utils
 * [OUTPUT]: 验证 CI 非交互模式
 * [POS]: tests 的行为回归边界，通过隔离夹具约束对应生产模块
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { describe, expect, test } from 'bun:test';
import { isNonInteractive } from '../src/utils';

describe('isNonInteractive', () => {
  test('treats non-TTY stdin as non-interactive without an explicit flag', () => {
    expect(isNonInteractive({}, false, false)).toBe(true);
  });

  test('allows prompts only with a TTY and no non-interactive flag', () => {
    expect(isNonInteractive({}, true, false)).toBe(false);
  });

  test('honors the environment and global flags', () => {
    expect(isNonInteractive({ NO_INTERACTIVE: '1' }, true, false)).toBe(true);
    expect(isNonInteractive({}, true, true)).toBe(true);
  });
});
