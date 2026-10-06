import {firebaseConfig} from './firebase-config.js';
const status=document.querySelector('#firebase-status'),button=document.querySelector('#sign-in');
try{
const [{initializeApp},{getAuth,setPersistence,inMemoryPersistence,signInWithEmailAndPassword,signOut,onAuthStateChanged}]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')]);
const auth=getAuth(initializeApp(firebaseConfig));await setPersistence(auth,inMemoryPersistence);button.disabled=false;button.textContent='登录';
document.querySelector('#firebase-login').addEventListener('submit',async e=>{e.preventDefault();button.disabled=true;status.textContent='正在验证账号…';try{await signInWithEmailAndPassword(auth,document.querySelector('#email').value.trim(),document.querySelector('#password').value);document.querySelector('#password').value='';}catch(err){const messages={'auth/operation-not-allowed':'项目尚未启用 Email / Password 登录。','auth/invalid-credential':'账号或密码不正确。','auth/too-many-requests':'请求过于频繁，请稍后重试。','auth/network-request-failed':'无法连接登录服务，请检查网络。','auth/invalid-api-key':'Firebase 配置无效。','auth/user-disabled':'账号已停用。','auth/configuration-not-found':'项目尚未配置 Authentication。'};status.textContent=messages[err.code]||'登录失败，请检查账号及项目设置。'}finally{button.disabled=false}});
document.querySelector('#firebase-signout').addEventListener('click',()=>signOut(auth));
onAuthStateChanged(auth,user=>{document.querySelector('#firebase-login').hidden=!!user;document.querySelector('#firebase-signout').hidden=!user;if(user)status.textContent='账号已通过 Firebase 验证。后台权限、登录审计和云端资料接口尚未部署，暂不开放真实客户资料。';});
}catch{button.textContent='登录组件加载失败';status.textContent='无法加载 Firebase 登录组件，请检查网络后刷新。'}
