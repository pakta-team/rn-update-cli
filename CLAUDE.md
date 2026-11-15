# rn-update-cli - React Native OTA 发布与原生基线差分工具

TypeScript 7 + Bun + Node.js >=18.17.0 + Biome 2 + yauzl/yazl + Hermes

<directory>
src/ - CLI 命令、公共 API、账号与服务端适配（2 子目录: locales、utils）
scripts/ - 跨平台构建、版本准备、离线烟雾与 Hermes 回归编排
tests/ - 按文件串行隔离的命令、上传、原生格式和差分回归（1 子目录: fixtures）
proto/ - AAB 原生资源与配置的 protobuf 解码模式
docs/ - Hermes 校验边界与历史审查说明
.github/ - 独立公开仓库的 CI、tag 发布与失败通知配置（1 子目录: workflows）
</directory>

<config>
package.json - rn-update-cli 1.2.0 的公开入口、Node 引擎、构建命令与发布清单；只分发 lib、proto 模式和产品文档
bun.lock - 运行与开发依赖冻结树；安装使用 bun install --frozen-lockfile
bunfig.toml - Bun 测试根目录及兼容路由隔离预加载
biome.json - TypeScript/JavaScript 格式和静态检查规范
tsconfig.json - TypeScript 开发检查边界
tsconfig.build.json - src 到 CommonJS lib 与声明文件的构建边界
cli.json - 命令及参数白名单，包含 channel、targets 与精确 Deployment ID
.gitignore - 构建产物、依赖、凭据与本地自动化隔离规则
LICENSE - MIT 许可与公司署名，随 npm 包分发
README.md - 英文产品入口、三步发布与公开 API 用法
README.zh-CN.md - 中文发布指南，与英文入口保持功能一致
RELEASE_SYNC.md - 1.2.0 同步取舍、候选 SHA256、验证证据和未执行的远端发布边界
readme-banner.svg - 自包含 README 产品横幅，随 npm 包分发
</config>

架构约束

- api.ts 是 HTTP 与上传边界；命令层组合业务，utils 只提供格式解析和基础设施。
- 原生包内 channel 是身份来源，--channel 只做严格断言；buildTime 作为不透明字符串透传。
- parseApp/Apk/Ipa/Aab 的 stdout 只有 JSON；账号、版本提示与后台刷新不进入解析管道。
- Hermes base 先比较二进制字面量，再审计 pretty/raw 指令语义，未知结构和失败均回退 plain。
- 版本由本仓库 package.json 和 scripts/prepublish.ts 管理；手推 v* tag 或显式选择已有 tag 触发发布，不依赖父仓脚本。
- 发布保留 Node18.17 smoke、npm 内容检查与 OIDC，npm 成功后才创建 GitHub Release；CI 名称 ci 和发布名称共同约束通知监听，codex/verify-* 分支不发送通知。
- CI 与通知统一使用 GitHub 托管 ubuntu-latest；发布期间发现旧 Blacksmith 标签历史多次排队 24 小时未获机器，不再沿用该外部 runner 依赖。
- 测试使用 --parallel=1 隔离环境变量和模块替身；缺少真实编译器或差分工具的 skip 单独记录。

同步来源：冻结提交 69aac6a8f4f1c7a4b5b910b49940f0203f29699d 的 rn-update-cli 子树。
公开仓库原有 tag 发布、main 分支 CI、通知和历史 Hermes 审查文档保留；旧 Parser 类、plugin-config 与重复 buildTime 测试由源架构替代。

法则: 极简·稳定·导航·版本精确

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
