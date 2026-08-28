// Legacy contract marker: Spotlight 5–6
// ============================================================
// CLEAN v24 SHELL · Spotlight 5–7 · GOLDEN methodology
// UI/navigation layer. Grade 6 payload remains frozen; grades 5 and 7 are isolated data floors.
// ============================================================
(function(){
  const CLEAN_UI_VERSION='24.2.3';
  'use strict';

  let installed=false;
  let homeShown=false;
  let fileInput=null;

  const $=(s,r=document)=>r.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function gradeOf(l=typeof lesson!=='undefined'?lesson:null){const g=Number(l?.grade);if(g)return g;const m=String(l?.course_id||'').match(/(5|6|7)/);return m?Number(m[1]):Number(window.KA_ACTIVE_GRADE||6)}
  function courseLabel(l=typeof lesson!=='undefined'?lesson:null){return `Spotlight ${gradeOf(l)}`}
  function draftKey(l=typeof lesson!=='undefined'?lesson:null){return `ka_spotlight${gradeOf(l)}_clean_v24_draft`}
  function allLessons(){return Array.isArray(window.ALL_LESSONS)?window.ALL_LESSONS:(Array.isArray(window.LESSONS)?window.LESSONS:[])}

  function pluralBlocks(n){
    const x=Math.abs(Number(n))%100, y=x%10;
    return x>10&&x<20?'блоков':y===1?'блок':y>=2&&y<=4?'блока':'блоков';
  }

  function state(){
    return {
      version:24,
      saved_at:new Date().toISOString(),
      lesson_id:lesson?.id,
      grade:gradeOf(),
      course_id:lesson?.course_id,
      type,
      form,
      active,
      stages:JSON.parse(JSON.stringify(stages||[]))
    };
  }

  function saveLocal(silent=false){
    localStorage.setItem(draftKey(),JSON.stringify(state()));
    if(!silent) toast('Черновик урока сохранён');
  }

  function downloadDraft(){
    const blob=new Blob([JSON.stringify(state(),null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;
    a.download=`Spotlight_${gradeOf()}_${String(lesson?.legacy_id||'lesson').replace(/[^a-z0-9а-я]+/gi,'_')}.lesson`;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast('Файл урока сохранён');
  }

  function applyState(saved){
    if(!saved?.lesson_id||!Array.isArray(saved.stages))throw new Error('Файл урока не распознан.');
    const target=allLessons().find(x=>x.id===saved.lesson_id);
    if(!target)throw new Error('Урок из файла не найден в базе Spotlight 5–7.');
    const targetGrade=gradeOf(target);
    if(window.KA_COURSE_ROUTER?.currentGrade?.()!==targetGrade)window.KA_COURSE_ROUTER?.activateGrade?.(targetGrade);
    lesson=target;
    type=saved.type||type;
    form=saved.form||form;
    active=saved.active||'P1';
    stages=saved.stages;
    render();
    hideHome();
    toast('Урок восстановлен');
  }

  function toast(message){
    $('.v24-toast')?.remove();
    const t=document.createElement('div');
    t.className='v24-toast';t.textContent=message;document.body.appendChild(t);
    setTimeout(()=>t.remove(),2600);
  }

  function modal(title,body,actions=''){
    $('.v24-modal')?.remove();
    const m=document.createElement('div');m.className='v24-modal';
    m.innerHTML=`<section class="v24-dialog"><div class="v24-dialog-head"><div><small>CLEAN v24 · SPOTLIGHT 5–7</small><h2>${esc(title)}</h2></div><button data-v24-close>×</button></div><div class="v24-dialog-body">${body}${actions?`<div class="v24-dialog-actions">${actions}</div>`:''}</div></section>`;
    m.querySelector('[data-v24-close]').onclick=()=>m.remove();
    m.onclick=e=>{if(e.target===m)m.remove()};
    document.body.appendChild(m);return m;
  }

  function showSaveDialog(){
    const m=modal('Сохранить урок',`<p><b>Сохраните проект урока, чтобы продолжить позже.</b> Конструктор восстановит тему, тип, форму, этапы, Activities и ваши правки.</p><div class="v24-help-steps"><div><b>На этом компьютере</b><span>Черновик сохраняется в браузере автоматически.</span></div><div><b>Для переноса</b><span>Скачайте файл урока и откройте его через главную страницу конструктора.</span></div></div>`,`<button id="v24-save-local">Сохранить черновик</button><button class="gold" id="v24-download-draft">Скачать файл урока</button>`);
    m.querySelector('#v24-save-local').onclick=()=>{saveLocal();m.remove()};
    m.querySelector('#v24-download-draft').onclick=()=>{downloadDraft();m.remove()};
  }

  function ensureFileInput(){
    if(fileInput)return;
    fileInput=document.createElement('input');fileInput.type='file';fileInput.accept='.lesson,.json,application/json';fileInput.hidden=true;
    fileInput.onchange=async()=>{
      const f=fileInput.files?.[0];fileInput.value='';if(!f)return;
      try{applyState(JSON.parse(await f.text()))}catch(e){modal('Файл не открылся',`<p>${esc(e.message||'Неизвестная ошибка')}</p>`)}
    };
    document.body.appendChild(fileInput);
  }

  function showHome(force=false){
    ensureFileInput();
    let h=$('#v24-home');
    if(!h){
      h=document.createElement('section');h.id='v24-home';h.className='v24-home';
      h.innerHTML=`<div class="v24-home-inner"><div class="v24-home-kicker">GOLD STANDARD · SPOTLIGHT 5–7</div><h1>С чего начнём?</h1><p class="v24-home-lead">Соберите урок по этапам ФГОС, сохраните свой сценарий и подготовьте единый комплект документов с помощью выбранного вами внешнего ИИ.</p><div class="v24-home-grid"><article class="primary"><i>＋</i><h2>Создать новый урок</h2><p>Выберите модуль, тему по КТП, тип и форму урока. Затем работайте с каждым этапом отдельно.</p><button data-v24-new>Перейти в конструктор</button></article><article><i>↻</i><h2>Продолжить черновик</h2><p>Вернитесь к последнему уроку, сохранённому в этом браузере.</p><button data-v24-resume>Продолжить</button></article><article><i>⇧</i><h2>Открыть сохранённый урок</h2><p>Выберите файл урока. Технический формат понимать не требуется.</p><button data-v24-open>Выбрать файл</button></article></div></div>`;
      $('#app-shell').appendChild(h);
      h.querySelector('[data-v24-new]').onclick=()=>{reset();hideHome()};
      h.querySelector('[data-v24-resume]').onclick=()=>{
        const raw=localStorage.getItem(draftKey());
        if(!raw){modal('Черновик пока не найден','<p>Сохранённого черновика в этом браузере пока нет.</p>');return}
        try{applyState(JSON.parse(raw))}catch(e){modal('Черновик не открылся',`<p>${esc(e.message)}</p>`)}
      };
      h.querySelector('[data-v24-open]').onclick=()=>fileInput.click();
    }
    h.hidden=false;
    homeShown=true;
    document.body.classList.add('v24-home-mode');
    document.body.classList.remove('v24-builder-mode');
    document.documentElement.classList.add('v24-home-lock');
    window.scrollTo(0,0);
  }

  function hideHome(){
    const h=$('#v24-home');
    if(h)h.hidden=true;
    homeShown=false;
    document.body.classList.remove('v24-home-mode');
    document.body.classList.add('v24-builder-mode');
    document.documentElement.classList.remove('v24-home-lock');
    window.scrollTo(0,0);
  }

  function setupTop(){
    const setup=$('#setup');if(!setup)return;

    // Только параметры выбора. Время и восстановление сценария —
    // отдельной компактной строкой ниже.
    setup.querySelector('.v24-reset-scenario')?.remove();

    if(!setup.querySelector('.v24-grade-field')){
      const label=document.createElement('label');
      label.className='v24-grade-field';
      label.innerHTML='<span>Класс</span><select><option value="5">5</option><option value="6">6</option><option value="7">7</option></select>'; // Spotlight 5–7 compatibility: grade 7 added without changing grade-6 default
      setup.prepend(label);
      const gradeSelect=label.querySelector('select');
      gradeSelect.value=String(gradeOf());
      gradeSelect.onchange=()=>{
        const targetGrade=Number(gradeSelect.value);
        const first=window.KA_COURSE_ROUTER&&typeof window.KA_COURSE_ROUTER.activateGrade==='function'
          ?window.KA_COURSE_ROUTER.activateGrade(targetGrade):null;
        if(!first){toast(`База Spotlight ${targetGrade} пока недоступна`);return}
        lesson=first;
        [type,form]=defs(lesson);
        reset();
        toast(`Открыт ${courseLabel(lesson)}`);
      };
    }

    setup.querySelectorAll('label').forEach(label=>{
      const text=(label.childNodes[0]?.textContent||'').trim();
      if(text==='Урок и тема по КТП')label.childNodes[0].textContent='Урок по КТП';
    });
  }

  function compactBanner(){
    const banner=$('#banner');
    if(!banner || typeof lesson==='undefined' || typeof stages==='undefined')return;

    const total=stages
      .flatMap(s=>s.blocks)
      .reduce((n,b)=>n+Number(b.min||0),0);

    banner.className='banner v24-compact-banner';
    banner.innerHTML=`
      <div class="v24-topic">
        <h1>${esc(lesson.ktp_topic)}</h1>
        <p>${esc(lesson.section_title)} · речевой продукт: <b>${esc(lesson.product)}</b></p>
      </div>
      <div class="v24-topic-tools">
        <span class="v24-total-time"><b>${total}</b> минут</span>
        <button class="v24-reset-scenario" type="button">↻ Рекомендуемый сценарий</button>
      </div>`;
    const resetBtn=banner.querySelector('.v24-reset-scenario');
    if(resetBtn)resetBtn.onclick=()=>reset();
  }

  function tunePhases(){
    const ph=$('#phases');if(!ph)return;
    const h=ph.querySelector('h3');if(h)h.textContent='Этапы урока по ФГОС';
  }

  function tuneBuilder(){
    const b=$('#builder');if(!b||typeof stages==='undefined')return;
    const s=stages.find(x=>x.id===active);if(!s)return;
    const eyebrow=b.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent=`ВЫБРАННЫЙ ЭТАП · ${active}`;
    const h=b.querySelector(':scope > h2');if(h)h.textContent=s.title;
    const p=b.querySelector(':scope > p');if(p)p.textContent=s.purpose;
    b.querySelector('.v24-stage-meta')?.remove();
    const meta=document.createElement('div');meta.className='v24-stage-meta';
    const minutes=s.blocks.reduce((n,x)=>n+Number(x.min||0),0);
    meta.innerHTML=`<b>${minutes} мин</b><span>${s.blocks.length} ${pluralBlocks(s.blocks.length)}</span><span>Изменения автоматически учитываются в документах</span>`;
    (p||h)?.after(meta);
    b.querySelectorAll('.stage .add').forEach(x=>x.textContent='＋ Добавить свой блок в этот этап');
  }

  function resourceCards(){
    const kit=typeof buildLessonKit==='function'?buildLessonKit(lesson):null;
    const canDo=kit?.canDo||`I can create ${lesson.product}.`;
    const success=kit?.success||[];
    const bank=(lesson.lexical_bank||[]).join(' · ');
    const frames=(lesson.functional_frames||[]).join(' · ');
    const common={
      P1:[['Ситуация урока',lesson.micro_situation,'Помогает включить тему через смысл, а не через готовый ответ.'],['Ключевая лексика',bank,'Используйте как подсказку после первой самостоятельной попытки.']],
      P2:[['Can-do цель',canDo,'Подходит для формулирования наблюдаемого результата урока.'],['Критерии успеха',success.join(' · '),'Выберите 2–4 критерия, которые ученики смогут проверить сами.'],['Итоговый продукт',lesson.product,'Свяжите цель с тем, что ученик реально создаст к концу урока.']],
      P3:[['Тематический банк',bank,'Лексическая опора для подготовки к центральной задаче.'],['Грамматический фокус',lesson.grammar_focus,'Используйте только в контексте речевой задачи урока.'],['Речевые модели',frames,'Опоры можно постепенно убирать от попытки к попытке.']],
      P4:[
        ['Коммуникативная ситуация',lesson.micro_situation,'Сохраняйте адресата, мотив и понятную цель общения.'],
        ['Итоговый продукт',`«${lesson.product}». Результат должен быть завершённым, понятным адресату и проверяемым по критериям.`,'Главная задача этапа — получить наблюдаемый речевой продукт, а не просто выполнить упражнение.'],
        ['Речевые модели',frames,'Дайте как поддержку, а не как текст для механического чтения.'],
        ['Тематический банк',bank,'Используйте как адресную поддержку, если ученику не хватает языковых средств для решения задачи.']
      ],
      P5:[
        ['Критерии успеха',success.map(x=>`□ ${x}`).join(' · '),'Сначала ученик сверяет собственный результат с критериями, затем получает адресную обратную связь.'],
        ['Чек-лист самопроверки',`□ Задача выполнена по смыслу · □ Использована лексика урока · □ Проверен языковой фокус: ${lesson.grammar_focus} · □ Результат понятен другому человеку`,'Самопроверка должна предшествовать учительской коррекции: найти и исправить хотя бы одну неточность самостоятельно.'],
        ['Алгоритм коррекции','1. Смысл и задача → 2. Лексика → 3. Грамматическая форма → 4. Понятность для адресата → 5. Повторная проверка','Исправляйте не всё сразу: сначала то, что мешает смыслу, затем точность формы.']
      ],
      P6:[
        ['Рефлексия по Can-do',`Today I can… · My evidence is… · The part I can do without support is… · I still need help with…`,'Возвращаемся к цели не формально: ученик приводит конкретное языковое или содержательное доказательство.'],
        ['Следующий шаг',`Next time I will… · использовать точнее лексику темы · проверить ${lesson.grammar_focus} · сделать «${lesson.product}» понятнее адресату`,'Следующий шаг должен быть конкретным, выполнимым и связанным с выявленной трудностью.'],
        ['Мост к домашнему заданию',`Продолжить или перенести продукт «${lesson.product}» в новую ситуацию, сохранив цель и критерии урока.`,'Домашняя работа продолжает учебную траекторию урока, а не начинается с новой случайной задачи.']
      ]
    };
    return common[active]||common.P3;
  }

  async function copyText(text){try{await navigator.clipboard.writeText(text);toast('Материал скопирован')}catch(_){}}

  function tuneLibrary(){
    const lib=$('#library');if(!lib||lib.querySelector('.v24-lib-tabs'))return;
    const original=lib.innerHTML;
    const cards=resourceCards();
    lib.innerHTML=`<div class="v24-lib-tabs"><button class="on" data-v24-tab="activities">Activities</button><button data-v24-tab="resources">Доп. материалы</button></div><div class="v24-lib-pane" data-v24-pane="activities">${original}<button class="v24-full-library" type="button">▦ Открыть всю библиотеку Activities</button></div><div class="v24-lib-pane" data-v24-pane="resources" hidden><small class="eyebrow">РЕКОМЕНДАЦИИ ${active}</small><h3>Дополнительные материалы</h3><p>Опоры подобраны под функцию выбранного этапа.</p>${cards.map((x,i)=>`<article class="v24-resource ${i===0?'priority':''}"><em>${i===0?'ПРИОРИТЕТ':'ПОДДЕРЖКА'}</em><b>${esc(x[0])}</b><p>${esc(x[1]||'—')}</p><small>${esc(x[2])}</small><button type="button" data-v24-copy="${i}">Скопировать</button></article>`).join('')}</div>`;
    lib.querySelectorAll('[data-v24-tab]').forEach(btn=>btn.onclick=()=>{
      lib.querySelectorAll('[data-v24-tab]').forEach(x=>x.classList.toggle('on',x===btn));
      lib.querySelectorAll('[data-v24-pane]').forEach(p=>p.hidden=p.dataset.v24Pane!==btn.dataset.v24Tab);
    });
    lib.querySelectorAll('[data-v24-copy]').forEach(btn=>btn.onclick=()=>copyText(cards[Number(btn.dataset.v24Copy)]?.[1]||''));
    const fullLibrary=lib.querySelector('.v24-full-library');
    if(window.KA_ACCESS_MODE==='DEMO'){
      fullLibrary.textContent='▦ Расширенная библиотека · FULL';
      fullLibrary.onclick=()=>toast('Расширенная библиотека Activities доступна в FULL');
    }else{
      fullLibrary.onclick=()=>{
        if(window.KA_AI?.openCatalog)window.KA_AI.openCatalog();
        else toast('Расширенная библиотека загружается');
      };
    }
  }

  function tuneHeader(){
    const save=$('#save');if(save){save.textContent='Сохранить урок';save.onclick=showSaveDialog}
    const docs=$('#docs');if(docs)docs.textContent='Предпросмотр';
    const home=$('#v24-home-button');if(home)home.onclick=()=>showHome(true);
    const ai=$('#v24-ai-button');if(ai)ai.onclick=()=>window.KA_V24_AI?.open?.();
    const oldAi=$('#ai-generate');if(oldAi)oldAi.style.display='none';
    const oldLib=$('#ai-library');if(oldLib)oldLib.style.display='none';
    const cleanHome=$('#clean-home');if(cleanHome)cleanHome.textContent='← К экрану входа';
    const subtitle=document.querySelector('#app-shell header .brand small');
    if(subtitle)subtitle.textContent=`Методический конструктор · ${courseLabel()} · GOLD STANDARD v${CLEAN_UI_VERSION}`;
  }

  function tune(){
    setupTop();compactBanner();tunePhases();tuneBuilder();tuneLibrary();tuneHeader();
  }

  let bootError='';
  let autosaveStarted=false;

  function appIsVisible(){
    const shell=$('#app-shell');
    return !!shell && !shell.hidden;
  }

  function goldenReady(){
    return (
      typeof window.render==='function' &&
      Array.isArray(window.LESSONS) &&
      window.LESSONS.length>0 &&
      typeof window.reset==='function' &&
      !!$('#builder')
    );
  }

  function install(){
    if(installed || !goldenReady())return false;

    installed=true;
    const baseRender=window.render;

    window.render=function(){
      baseRender();
      requestAnimationFrame(()=> {
        try{ tune(); }
        catch(e){
          bootError=`v24 tune: ${e?.message||e}`;
          console.error('[CLEAN v24]',e);
        }
      });
    };

    try{ tune(); }
    catch(e){
      bootError=`v24 tune: ${e?.message||e}`;
      console.error('[CLEAN v24]',e);
    }

    if(!autosaveStarted){
      autosaveStarted=true;
      setInterval(()=>{try{if(!homeShown)saveLocal(true)}catch(_){}},30000);
    }
    return true;
  }

  function showHomeSafely(){
    if(!appIsVisible())return;

    // Главная v24 — самостоятельный слой и НЕ должна ждать Golden engine.
    if(!$('#v24-home')){
      try{ showHome(); }
      catch(e){
        bootError=`v24 home: ${e?.message||e}`;
        console.error('[CLEAN v24]',e);
      }
    }
  }

  // Если какой-либо динамически загружаемый GOLDEN-скрипт упадёт,
  // сохраняем точную ошибку. Пользователю DevTools для диагностики не нужен.
  window.addEventListener('error',e=>{
    if(!appIsVisible())return;
    const file=(e.filename||'').split('/').pop();
    bootError=[file,e.lineno?`строка ${e.lineno}`:'',e.message||'Ошибка JavaScript']
      .filter(Boolean).join(' · ');
  });

  window.addEventListener('unhandledrejection',e=>{
    if(!appIsVisible())return;
    bootError=`Promise: ${e.reason?.message||e.reason||'неизвестная ошибка'}`;
  });

  // Новый принцип:
  // 1) как только gate открыл app-shell — сразу показываем Главную;
  // 2) параллельно ждём GOLDEN engine;
  // 3) после его появления подключаем только UI-настройку.
  const timer=setInterval(()=>{
    showHomeSafely();
    install();

    // Останавливаем частый опрос, когда оба слоя готовы.
    if(installed && $('#v24-home'))clearInterval(timer);
  },80);

  // Защитный таймер: если движок не появился, Главная всё равно остаётся рабочей.
  setTimeout(()=>{
    showHomeSafely();
    if(!installed && appIsVisible()){
      console.warn('[CLEAN v24] GOLDEN engine пока не подключён',bootError);
    }
  },3000);

  // Подменяем действия Главной безопасными проверками.
  const actionGuard=setInterval(()=>{
    const h=$('#v24-home');
    if(!h)return;

    const newBtn=h.querySelector('[data-v24-new]');
    if(newBtn && !newBtn.dataset.guard){
      newBtn.dataset.guard='1';
      newBtn.onclick=()=>{
        if(!goldenReady()){
          modal(
            'Рабочая часть ещё загружается',
            `<p>Главная уже открыта, но GOLD STANDARD ещё не готов к работе.</p>
             ${bootError?`<p><b>Диагностика:</b> ${esc(bootError)}</p>`:''}
             <p>Нажмите «Попробовать ещё раз» через несколько секунд.</p>`,
            `<button id="v24-retry-engine">Попробовать ещё раз</button>`
          );
          setTimeout(()=>{
            const b=$('#v24-retry-engine');
            if(b)b.onclick=()=>location.reload();
          },0);
          return;
        }
        reset();
        hideHome();
      };
    }

    if(installed)clearInterval(actionGuard);
  },120);
})();
