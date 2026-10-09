const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname,publicFiles=new Set(['favicon.svg','index.html','style.css','polish.css','mobile.css','app.js','features.js','dashboard.js','management.js','clients.js','permissions.js','service-ownership.js','audit-login.js','lifecycle.js','filters.js','bulk-import.js','filter-toggle.js','enrollment-fixes.js','role-options.js','client-learners.js','display-dates.js','logo.png','login-brand.png','firebase-login.html','firebase-session.js','firebase-config.js']);
http.createServer((req,res)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.gstatic.com; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end()}let name;try{name=decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'')||'index.html'}catch{res.writeHead(400);return res.end()}if(!publicFiles.has(name)){res.writeHead(404);return res.end('Not found')}fs.readFile(path.join(root,name),(err,data)=>{if(err){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(name)]||'application/octet-stream');res.end(req.method==='HEAD'?undefined:data)});}).listen(4173,'127.0.0.1',()=>console.log('MACTION CRM: http://127.0.0.1:4173'));









