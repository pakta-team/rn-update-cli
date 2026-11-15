# workflows/
> L2 | 父级: ../CLAUDE.md

成员清单

test.yml: 名称 ci，执行类型/格式、串行单测与覆盖率、Node18.17 smoke、四组固定 Hermes 编译器回归/fuzz及发布 dry-run，不实际发布。
publish.yml: 手推 v* tag 或手动选择已有 tag，以 refs/tags 明确检出后校验版本、构建、执行完整 Node18.17 smoke、检查 npm 清单，再以 OIDC 发布；只有 npm 成功后才创建 GitHub Release。
ci-failure-email.yml: 监听 ci 与 Publish Package to npmjs 的完成事件，常规分支失败创建或更新 issue、恢复后关闭；codex/verify-* 分支不产生通知，不提及上游个人账号，无外部邮件凭据。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
