<!--
[INPUT]: 冻结源提交、公开仓库原始 HEAD、1.2.0 构建与仓库外验证证据、远端 runner 排队诊断
[OUTPUT]: 提供本次公开 CLI 同步的取舍、候选身份、验证结果与发版边界
[POS]: 独立仓库的同步回执，不进入 npm 制品，不代替远端 Actions 或真实设备验收
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# CLI 1.2.0 同步回执

2026-11-15，本仓库由冻结提交 `69aac6a8f4f1c7a4b5b910b49940f0203f29699d` 的 `rn-update-cli` 子树同步。
公开仓库原始 HEAD 为 `9c67933423e5f9a8197aca750c647b790c9ac26c`，提交时间 `2026-09-28T00:09:40+08:00`。
版本按用户选择统一升至 **1.2.0**；重新生成 Bun 锁并完成冻结安装。Bun 根 workspace 不记录版本字段，依赖解析未因版本变更升级。

## 核心实现

- `src/**/*.ts` 的生产实现逐字节对应冻结源，包含纯 JSON parse 入口、ZIP 显式写偏移、流式上传、渠道身份与包解析精简。
- 移除已被源实现替代的通用 Parser 类、旧 latest-version 目录、plugin-config 及两份重复旧测试；保留公开仓库的历史 Hermes 审查记录。
- 保留 `ci` 名称、main 分支、覆盖率和发布 dry-run；CI 与通知统一使用 GitHub 托管 `ubuntu-latest`，吸收固定 HBC96、HBC98 两修订版、HBC99 的四组真实编译器矩阵与 Node18.17 完整烟雾。
- 保留手推 tag 与手动选择已有 tag 的 OIDC 发布入口，显式检出 `refs/tags/...`；npm 成功后才创建 GitHub Release。
- 通知监听名称保持一致，`codex/verify-*` 分支不产生 issue 通知，移除上游个人账号提及。
- GEB 根地图改为独立 L1，补齐模块地图及缺失文件契约；Hermes 自动发现只检查本仓库依赖，跨仓编译器由 `HERMESC` 显式传入。
- 保留本地凭据和自动化隔离规则；不复制源 `.agents`、`.pakta`、依赖或构建缓存。隔离验证脚本只复制 Git 可见源码并明确排除凭据。

## 品味自检

本轮 **1.2.0** 源码与候选制品分别验证：

| 检查对象 | 结果 |
| --- | --- |
| Bun 1.3.14 冻结安装 | 228 个锁定包，成功，无依赖升级 |
| lint / typecheck / build | 通过，Biome 检查 143 文件 |
| 全量单测 | **661 pass / 69 skip / 0 fail**，66 文件、2055 断言 |
| Node22.16.0 完整 smoke | 58 个模块、help/version、ZIP 偏移、API/registry/代理上传通过 |
| Node18.17.0 完整 smoke | 官方 SHA256 校验的 Windows 二进制，同项全部通过 |
| Node18 blockers | 5 pass / 4 skip / 0 fail；Windows 跳过 Unix 进程生命周期夹具 |
| Actions 静态检查 | actionlint 1.7.12 检查三份 workflow 通过；未启用 shellcheck/pyflakes |
| 发布准备 dry-run | TEMP 沙箱接受 v1.2.0 并写为 1.2.0，未执行 npm publish |
| npm dry-run 与真实 tgz | 126 文件，无源码、测试、GEB 地图、私有配置或依赖目录 |
| 独立消费者 | 仅安装真实 tgz 的生产依赖，公开入口/声明路径及完整 Node18 smoke 通过 |

候选：`rn-update-cli-1.2.0.tgz`。

SHA256：`af9143ce29bee5638c205c0d5ca636c649d974b8165305d1185469af451885bb`。

首轮单测的四格式 JSON 子进程用例超过默认 5 秒；定向复验 5/5 通过。第二轮出现一次 Bun 子进程 `ETIMEDOUT`，异步错误负控定向复验 3 pass / 4 skip。相同代码最终全量 13.29 秒通过，未调整超时、删除断言或跳过失败用例；保留两轮原始失败日志。

69 个 skip 属于真实 Hermes 编译器、原生差分工具或 Unix 进程夹具的环境边界，**不计为通过**。上述本地验收不代表远端四组 Linux Hermes 矩阵或设备验收通过。

发布阶段 main 已推送 `6c51f322d89ea2a72aae82478468fe0234de3779`，远端 CI `43687121870` 的 8 个 job 均未获得机器（`runner_id=0`、零步骤）。进一步核实 2026-09-14、09-18、09-27 三轮历史 CI：相同 `blacksmith-4vcpu-ubuntu-2404` 标签均零步骤、零 runner，并在排队 24 小时后取消。因此仅把 CI 五处和通知两处 runner 改为 `ubuntu-latest`，不改变测试、package、lib 或候选 tgz；远端验证结果仍须以新提交的 Actions 为准。

证据、原始 tracked 文件备份、下载校验、真实 tgz 和独立消费者位于仓库外 `%TEMP%/pakta-public-cli-sync-20261115-o24mv912/`，最终机器回执为 `final-verification.json`。

## 改进建议

runner 修复提交推送后先观察本仓库 Actions 的固定编译器矩阵，再按用户已选择的 `v1.2.0` tag 发版。当前回执只证明本地候选，不把未运行的远端和设备验证记为完成。

源仓库 HEAD 与 CLI 子树保持不改。初次本地验收时目标 HEAD、暂存区保持原状，未执行提交、推送或发布；其后用户授权发布，main 已提交推送，runner 修复等待统一提交。此回执更新时尚未创建本次 tag、发布 npm/GitHub Release 或发送 issue 通知。
