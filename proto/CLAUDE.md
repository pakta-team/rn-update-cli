# proto/
> L2 | 父级: ../CLAUDE.md

AAB 资源解析的 protobuf 模式边界，由 src/utils/index.ts 和原生包夹具加载；不承担业务身份选择。

成员清单

Configuration.proto: Android 资源配置模式，供 Resources.proto 引用。
Resources.proto: Android AAB 资源表与 XML 模式，供 bundleConfig 和 manifest 解码消费。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
