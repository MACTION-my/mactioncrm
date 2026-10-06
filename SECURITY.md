# Security status

Implemented locally: loopback-only preview server, public asset allowlist (prevents exposing configs, tests and secrets), no-cache, anti-framing, MIME-sniffing and browser resource restrictions. Firestore/Storage deny-all bootstrap rules are prepared but not deployed.

Not yet active: real Authentication, server roles and assignment checks, server audit/login logs, protected uploads, App Check, request quotas, backup schedules, restore drills, monitoring and private GitHub configuration. The project has no Firebase configuration or deployment identity. Browser roles/storage/logs remain demonstrations and must not hold real customer data.

Deployment work: validate Firebase ID tokens and active employee records on each backend request; authorize roles and explicit service-order assignments; validate payloads; record server-generated actor/time and before/after audit in update transactions. Deny all client writes to audit/role/assignment documents. Keep IC/TIN separately authorized, mask list fields, never log tokens/passwords. Protect attachment reads, validate file types/sizes and inspect content; avoid permanent public URLs. Configure App Check and transactional rate limits. Use restricted IAM for backend and encrypted backups. Separate dev/prod, enable dependency/secret scanning, protect GitHub branches, verify restore in a separate test project and route suspicious access alerts to an approved destination.

User preference: no MFA or additional sensitive-operation approval steps. Normal backend permission checks remain required.

References: https://firebase.google.com/docs/rules/basics ; https://firebase.google.com/docs/auth/admin/custom-claims ; https://firebase.google.com/docs/app-check/cloud-functions
`n2026-10-06: Web config and project alias maction-crm saved. Separate firebase-login.html uses official SDK for Email/Password authentication with memory-only sessions; it does not open production CRM data or claim audit logging is deployed. No credentials were tested. Official CLI initialization failed due to its downloaded dependency resolution; project admin authorization and rule deployment remain unverified.
2026-10-06: Firestore deny-all client rules deployed successfully to maction-crm. Anonymous document request must return 403. Storage deployment blocked because Firebase Storage is not provisioned; storage.rules remains local only. This does not implement production roles or protect privileged Admin SDK/IAM access.
