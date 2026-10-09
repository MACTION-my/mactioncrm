// Shared Firebase SDK setup. Session stored in this browser tab, CRM data never persisted locally.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {getAuth,setPersistence,browserSessionPersistence} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import {getFunctions,httpsCallable} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js';
import {initializeAppCheck,ReCaptchaEnterpriseProvider} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js';
import {appCheckSiteKey} from './appcheck-config.js';
import {firebaseConfig} from './firebase-config.js';
export const firebaseApp=initializeApp(firebaseConfig);initializeAppCheck(firebaseApp,{provider:new ReCaptchaEnterpriseProvider(appCheckSiteKey),isTokenAutoRefreshEnabled:true});export const auth=getAuth(firebaseApp);await setPersistence(auth,browserSessionPersistence);
const functions=getFunctions(firebaseApp,'asia-southeast1');const callable=httpsCallable(functions,'crmApi',{timeout:60000});
export async function crmRequest(data){const result=await callable(data);return result.data}
