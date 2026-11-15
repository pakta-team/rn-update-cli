# .github/
> L2 | 父级: ../CLAUDE.md

独立公开仓库的自动化边界。验证与发布只消费本仓库根目录，不能依赖相邻 SDK 或 monorepo 工作目录。

成员清单

workflows/: CI、tag 发布与失败恢复通知的 GitHub Actions 入口，工作流名称是通知监听契约；统一使用 GitHub 托管 Ubuntu，避免外部 runner 未获分配阻塞验证与通知。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
