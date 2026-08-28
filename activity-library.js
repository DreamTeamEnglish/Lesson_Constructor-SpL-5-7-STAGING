// ============================================================
// CLEAN v24 · FULL Activity Library
// Catalogue UI only. No embedded AI generation and no paid API calls.
// ============================================================
(function(){
  'use strict';
  const catalog=window.AI_ACTIVITY_CATALOG||[];
  const selected=new Set();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function close(){document.querySelector('.ai-modal')?.remove()}
  function compatible(a){
    return a.compatible_phase_ids?.includes(active)
      &&(a.compatible_type_ids?.includes(type)||!a.compatible_type_ids?.length)
      &&(a.compatible_form_ids?.includes(form)||!a.compatible_form_ids?.length);
  }
  function addActivity(a){
    const s=stages.find(x=>x.id===active);if(!s)return;
    s.blocks.push({
      id:uid(),sourceId:a.id,title:a.title,min:a.minutes||7,
      teacher:'Механика выбрана учителем; тематическое наполнение будет раскрыто в итоговых документах.',
      students:'Выполняют тематическую версию выбранной механики в рамках цели этапа.',
      instruction:`Подготовить тематическую реализацию механики «${a.title}».`,
      example:'Итоговый тематический пример формируется по паспорту текущего урока.',
      materials:a.materials_hint||'материалы текущего урока',
      support:'Опора подбирается по уровню и задаче текущего урока.',
      challenge:'Усложнение увеличивает самостоятельность или сложность речевого действия.',
      criterion:'Критерий связывается с наблюдаемым результатом выбранного этапа.',
      mode:a.mode||'определяет учитель',aiPending:true
    });
    selected.add(a.id);render();openCatalog();
  }
  function openCatalog(){
    close();
    const families=[...new Map(catalog.map(a=>[a.family_id,a.family_label||a.family_id]))];
    const m=document.createElement('div');m.className='ai-modal';
    m.innerHTML=`<section class="ai-panel"><div class="ai-panel-head"><div><small>${catalog.length} МЕТОДИЧЕСКИХ МЕХАНИК</small><h2>Расширенная библиотека Activities</h2></div><button>×</button></div><div class="ai-filters"><input id="ai-search" placeholder="Найти игру, проект, диалог, коррекцию…"><select id="ai-family"><option value="">Все семейства</option>${families.map(x=>`<option value="${esc(x[0])}">${esc(x[1])}</option>`).join('')}</select></div><div class="ai-list"></div><div class="ai-footer"><span>Активный этап: <b>${esc(active)}</b> · выбрано дополнительно: <b>${selected.size}</b></span><button class="gold" id="ai-finish">Вернуться к уроку</button></div></section>`;
    m.querySelector('.ai-panel-head button').onclick=close;
    m.querySelector('#ai-finish').onclick=close;
    document.body.append(m);
    const draw=()=>{
      const q=m.querySelector('#ai-search').value.toLowerCase(),fam=m.querySelector('#ai-family').value;
      const list=catalog.filter(a=>(!fam||a.family_id===fam)&&(!q||(a.title+' '+a.purpose+' '+a.mechanic).toLowerCase().includes(q)))
        .sort((a,b)=>Number(compatible(b))-Number(compatible(a))).slice(0,120);
      m.querySelector('.ai-list').innerHTML=list.map(a=>`<article class="ai-card ${compatible(a)?'recommended':''}"><small>${esc(a.family_label||a.family_id)} · ${a.minutes||'?'} мин ${compatible(a)?'· РЕКОМЕНДОВАНО':''}</small><h3>${esc(a.title)}</h3><p>${esc(a.purpose)}</p><button data-id="${esc(a.id)}" class="${selected.has(a.id)?'added':''}">${selected.has(a.id)?'✓ Добавлено':`＋ Добавить в ${esc(active)}`}</button></article>`).join('');
      m.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{if(!selected.has(b.dataset.id))addActivity(catalog.find(a=>a.id===b.dataset.id))});
    };
    m.querySelector('#ai-search').oninput=draw;m.querySelector('#ai-family').onchange=draw;draw();
  }
  window.KA_AI={openCatalog};
})();
