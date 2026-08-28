// ============================================================
// GOLDEN ARCH v0.6 · FULL content loader
// Supabase = customs only. Yandex = private content warehouse.
// The browser receives short-lived signed Object Storage URLs only
// after the Yandex gateway has re-checked FULL access at Supabase.
// ============================================================
(function(){
  'use strict';

  let privateScripts=null;
  let loadedBuild='';

  function hex(bytes){
    return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  async function sha256(buffer){
    if(!globalThis.crypto?.subtle?.digest)throw new Error('Web Crypto SHA-256 недоступен.');
    return hex(await crypto.subtle.digest('SHA-256',buffer));
  }

  async function fetchVerified(entry,name){
    if(!entry?.url||!entry?.sha256)throw new Error(`FULL manifest: нет URL/SHA-256 для ${name}`);
    const response=await fetch(entry.url,{method:'GET',mode:'cors',cache:'no-store',credentials:'omit'});
    if(!response.ok)throw new Error(`Yandex Object Storage: ${name} · HTTP ${response.status}`);
    const buffer=await response.arrayBuffer();
    const actual=await sha256(buffer);
    if(actual.toLowerCase()!==String(entry.sha256).toLowerCase()){
      throw new Error(`Контроль целостности не пройден: ${name}`);
    }
    return new TextDecoder('utf-8').decode(buffer);
  }

  function ensureArray(value,name,expected){
    if(!Array.isArray(value))throw new Error(`${name}: ожидался массив.`);
    if(Number.isFinite(expected)&&value.length!==expected){
      throw new Error(`${name}: ожидалось ${expected}, получено ${value.length}.`);
    }
    return value;
  }

  async function requestManifest(gatewayUrl,accessToken){
    const url=String(gatewayUrl||'').trim();
    if(!/^https:\/\//i.test(url))throw new Error('Не настроен Yandex FULL Content Gateway URL.');
    if(!accessToken)throw new Error('Нет действующего Supabase access token для FULL.');
    const response=await fetch(url,{
      method:'POST',
      mode:'cors',
      cache:'no-store',
      credentials:'omit',
      headers:{
        'Content-Type':'application/json',
        'X-Lesson-Token':accessToken
      },
      body:JSON.stringify({action:'manifest'})
    });
    const raw=await response.text();
    let body=null;try{body=raw?JSON.parse(raw):null}catch(_){/* ignore */}
    if(!response.ok){
      const message=body?.message||body?.error||raw||`HTTP ${response.status}`;
      throw new Error(`FULL Content Gateway: ${message}`);
    }
    if(!body?.files||!body?.build)throw new Error('FULL Content Gateway вернул неполный manifest.');
    return body;
  }

  async function load({gatewayUrl,accessToken}={}){
    const manifest=await requestManifest(gatewayUrl,accessToken);
    const files=manifest.files||{};
    const required=['lessons-5.json','lessons-6.json','lessons-7.json','activities.json','v24-method.js','v24-ai.js'];
    for(const name of required)if(!files[name])throw new Error(`FULL manifest: отсутствует ${name}`);

    const [g5Text,g6Text,g7Text,activitiesText,methodText,aiText]=await Promise.all(required.map(name=>fetchVerified(files[name],name)));
    const counts=manifest.lesson_counts||{};
    const g5=ensureArray(JSON.parse(g5Text),'lessons-5.json',Number(counts['5']||70));
    const g6=ensureArray(JSON.parse(g6Text),'lessons-6.json',Number(counts['6']||70));
    const g7=ensureArray(JSON.parse(g7Text),'lessons-7.json',Number(counts['7']||70));
    const activities=ensureArray(JSON.parse(activitiesText),'activities.json',Number(manifest.activity_count||232));

    window.SPOTLIGHT5_LESSONS=g5;
    window.SPOTLIGHT6_LESSONS=g6;
    window.SPOTLIGHT7_LESSONS=g7;
    window.ALL_LESSONS=[...g5,...g6,...g7];
    window.LESSONS=g6;
    // Compatibility contract with app.js/enhance-all.js:
    // app.js renders immediately and expects the lesson-scoped ACTIVITIES array
    // to exist before enhance-all replaces its contents from buildLessonKit().
    window.ACTIVITIES=[];
    // The full 232-item library is a separate catalogue used by activity-library.js.
    window.AI_ACTIVITY_CATALOG=activities;
    window.KA_ACTIVE_GRADE=6;

    privateScripts={methodText,aiText};
    loadedBuild=String(manifest.build||'');
    window.KA_FULL_CONTENT_STATE={
      loaded:true,
      build:loadedBuild,
      lessonCounts:{5:g5.length,6:g6.length,7:g7.length},
      activityCount:activities.length,
      source:'yandex-object-storage-private'
    };
    return window.KA_FULL_CONTENT_STATE;
  }

  function runPrivateScript(text,label){
    const script=document.createElement('script');
    script.dataset.kaPrivateRuntime=label;
    script.textContent=`/* ${label} · loaded after FULL customs check */\n${text}\n//# sourceURL=${label}`;
    document.body.appendChild(script);
  }

  function installPrivateScripts(){
    if(!privateScripts)throw new Error('FULL private runtime ещё не загружен.');
    if(window.__KA_PRIVATE_GOLD_INSTALLED)return loadedBuild;
    runPrivateScript(privateScripts.methodText,'yandex-private/v24-method.js');
    runPrivateScript(privateScripts.aiText,'yandex-private/v24-ai.js');
    privateScripts=null;
    window.__KA_PRIVATE_GOLD_INSTALLED=true;
    return loadedBuild;
  }

  window.KA_FULL_CONTENT_LOADER={load,installPrivateScripts};
})();
