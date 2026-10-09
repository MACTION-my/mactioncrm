# 正式安全状态（2026-10-09）

已部署：真实 Firebase 登录、关闭自助注册、邮箱枚举保护、App Check 强制校验、服务器角色及员工停用检查、每用户每分钟120次接口限流、事务式更新和不可由客户端更改的审计、版本冲突保护、团队和服务订单隔离、收款与客户删除权限限制、输出转义、CSV公式防护、CSP/防框架/MIME保护、数据库和附件直接访问拒绝。

不再提供角色选择预览或读取旧本机客户资料。登入后删除当前域名旧Demo缓存。其他域名尚未访问的浏览器缓存会在其下一次登入时清除；不会自动上传旧资料。

数据库已启用防误删、PITR七天版本恢复及每天一次保留七天的备份。恢复演练未完成；不能声称已经验证灾难恢复。Auth账号不包含在Firestore备份中，需另外管理账号生命周期。

后台通过 Admin SDK 访问数据库，绕过客户端 Firestore rules；真实数据授权由 functions/policy.js 执行。服务器读取员工文档，前端修改角色不能提升服务器权限。MFA、敏感操作二次确认和附件仍按用户要求不启用。没有系统能保证永不被攻击。

当前后台运行身份仍是项目默认计算服务账号。用户选择暂时保留现有后台身份，专用身份及最小权限 IAM 切换不执行。GitHub仓库原有可见性及分支保护设置未更改。

每个业务修改的审计含服务器生成的操作人／时间及修改前后资料；因此审计含客户隐私，仅老板／Account可读取。业务转交历史仅老板／Account／获授权经理可读取。上限150条一次提交、40KB每条业务记录，避免异常大请求。

官方依据：[Callable函数认证](https://firebase.google.com/docs/functions/callable)、[App Check](https://firebase.google.com/docs/app-check/cloud-functions)、[Admin SDK与Rules边界](https://firebase.google.com/docs/firestore/security/rules-fields)、[七天恢复](https://firebase.google.com/docs/firestore/use-pitr)、[自动备份](https://firebase.google.com/docs/firestore/backups)。
