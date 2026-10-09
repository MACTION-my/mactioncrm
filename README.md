# MACTION CRM — 正式环境

入口：https://maction-crm.web.app/ ，GitHub Pages 自定义域名：https://www.mustaction.my/ 。

正式版使用 Firebase Authentication、App Check 和新加坡 Cloud Functions。客户与业务资料保存于 Firestore，每次写入由服务器检查员工状态、角色、客户／订单分配及修改前版本；更新与审计在同一事务中提交。浏览器不保存 CRM 业务资料，不迁移旧 Demo 数据。

老板账号：marketing@maction.com.my。老板及 Account 在「权限与分配 → 添加员工」填写姓名、Email、至少12位密码及角色，即可创建 Firebase 登录账号。密码仅传给账号创建接口，不保存于 Firestore、GitHub 或审计日志。公开自助注册已关闭。员工停用会拒绝后台访问并停用 Firebase 账号。

团队只读取已分配的客户／课程订单。服务订单必须明确分配。经理／团队不能登记收款或删除客户；经理可以转交客户，但停用员工账号仅限老板／Account。日志由服务器记录，客户端不能修改。列表、保存状态与每分钟更新读取的是云端资料。

Firestore 和 Storage 客户端规则拒绝所有直接读写。附件尚未启用。客户资料不属于公开网站内容，未登录只显示登录页。按用户要求不启用 MFA 或敏感操作二次确认。

验证：`node verify.cjs`、`node verify-features.cjs`、`node verify-production.cjs`、`node functions/policy.test.cjs`。后台真实测试已验证账号创建、云端事务、冲突拒绝、App Check、直接数据库访问拒绝、团队／服务隔离、收款限制及停用账号。测试资料、账号和 App Check debug token已删除。

部署：`node build-hosting.cjs`，然后使用 Firebase CLI 部署 hosting/functions/rules。Node.js 22 为后台运行版本。后台依赖锁定于 functions/package-lock.json；2026-10-09 安全依赖审计为0个已知漏洞。

限制：单次保存最多150条记录，较大历史导入需分批；日志页面显示最近200条登录和500条审计，较早记录继续保存在服务器。当前 API 每次加载会读取业务集合，数据量增大时需改为分页／按需查询。每日备份保留7天，PITR保留7天；已配置恢复能力但尚未进行完整恢复演练。Google Cloud按实际使用收取费用。
