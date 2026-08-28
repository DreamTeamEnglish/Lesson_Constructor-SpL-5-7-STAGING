(function(){
  'use strict';
  const CHAT='https://vk.ru/im?sel=-229391051';
  function currentLesson(){
    try{return typeof lesson!=='undefined'?lesson:null}catch(_){return null}
  }
  function buildMessage(note){
    const l=currentLesson();
    const grade=Number(l?.grade)||Number(String(l?.course_id||'').match(/(5|6|7)/)?.[1])||Number(window.KA_ACTIVE_GRADE||6);
    const lessonName=l?`${l.legacy_id} · ${l.section_title}`:'не определён';
    return [
      'Здравствуйте!',
      '',
      'Тестирую DEMO конструктора уроков Spotlight 5–7.',
      `Класс: ${grade}`,
      `Урок: ${lessonName}`,
      'Версия: GOLD STANDARD v24.2.3 · DEMO 9',
      '',
      'Замечание / предложение:',
      note||'(добавлю в сообщении)'
    ].join('\n');
  }
  async function send(){
    const note=window.prompt('Что хотелось бы исправить, добавить или сделать удобнее?','');
    if(note===null)return;
    const text=buildMessage(note.trim());
    try{await navigator.clipboard.writeText(text)}catch(_){window.alert(text)}
    window.open(CHAT,'_blank','noopener');
  }
  function install(){
    if(String(window.KA_ACCESS_MODE||'').toUpperCase()!=='DEMO')return false;
    const actions=document.querySelector('#clean-accessbar .clean-bar-actions');
    if(!actions||actions.querySelector('[data-demo-feedback]'))return Boolean(actions);
    const button=document.createElement('button');
    button.type='button';
    button.dataset.demoFeedback='1';
    button.className='clean-btn';
    button.textContent='💬 Обратная связь';
    button.title='Сообщить о проблеме или предложить улучшение';
    button.addEventListener('click',send);
    actions.prepend(button);
    return true;
  }
  window.KA_DEMO_FEEDBACK={install,buildMessage};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0));
  else setTimeout(install,0);
})();
