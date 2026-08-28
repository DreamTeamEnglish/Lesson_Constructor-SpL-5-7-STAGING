(function(){
  const oldDoc=documentHTML;
  let kit;
  function sync(){
    kit=window.buildLessonKit(lesson);
    const normalized=kit.activities.map(a=>({id:a.id,title:a.title,minutes:a.minutes,mode:a.mode,purpose:a.students,mechanic:a.instruction,example:a.example,materials:a.materials,support_default:a.support,challenge_default:a.challenge,criterion:a.criterion,compatible_phase_ids:[a.phase],compatible_type_ids:a.types,compatible_form_ids:a.forms,teacher:a.teacher,students:a.students}));
    window.ACTIVITIES.splice(0,window.ACTIVITIES.length,...normalized);
  }
  function byId(id,min){const a=kit.activities.find(x=>x.id===id);return{id:uid(),sourceId:a.id,title:a.title,min:min||a.minutes,teacher:a.teacher,students:a.students,instruction:a.instruction,example:a.example,materials:a.materials,support:a.support,challenge:a.challenge,criterion:a.criterion,mode:a.mode}}
  function find(phase,pattern){return kit.activities.find(a=>a.phase===phase&&pattern.test(a.id+' '+a.title))||kit.activities.find(a=>a.phase===phase)}
  function central(){let a;if(type==='T09'||['F07','F08','F12'].includes(form))a=find('P4',/P4-04|P4-03|проект/i);else if(['F02','F03','F10'].includes(form))a=find('P4',/P4-03|P4-04|игр|квест/i);else if(form==='F04')a=find('P4',/P4-02|information/i);else if(form==='F06'||type==='T05')a=find('P4',/P4-01|ролев|диалог/i);else a=find('P4',/P4-01|P4-02/);return byId(a.id,14)}
  makeStages=function(){sync();const p1=find('P1',form==='F02'?/P1-02/:/P1-01/),p2=find('P2',/P2-01/),p31=find('P3',/P3-01/),p32=find('P3',type==='T05'||form==='F06'?/P3-03/:/P3-02/),p5=find('P5',type==='T08'?/P5-02/:/P5-01/),p6=find('P6',/P6-01/);return[
    {id:'P1',title:PHASES[0][1],purpose:PHASES[0][2],blocks:[byId(p1.id,4)]},{id:'P2',title:PHASES[1][1],purpose:PHASES[1][2],blocks:[byId(p2.id,4)]},{id:'P3',title:PHASES[2][1],purpose:PHASES[2][2],blocks:[byId(p31.id,7),byId(p32.id,6)]},{id:'P4',title:PHASES[3][1],purpose:PHASES[3][2],blocks:[central()]},{id:'P5',title:PHASES[4][1],purpose:PHASES[4][2],blocks:[byId(p5.id,7)]},{id:'P6',title:PHASES[5][1],purpose:PHASES[5][2],blocks:[byId(p6.id,3)]}
  ]};
  reset=function(){sync();stages=makeStages();active='P1';render()};
  addActivity=function(id){sync();const a=kit.activities.find(x=>x.id===id);if(!a)return;stages.find(s=>s.id===active).blocks.push(byId(id));render()};
  function homeworkHTML(){sync();return`<div class="document">${head(`Домашнее задание: ${lesson.ktp_topic}`)}<div class="docblock"><p><b>Can-do цель:</b> ${esc(kit.canDo)}</p><p><b>Для ученика:</b> выбери один вариант. В каждом указаны ситуация, шаги, языковые опоры, полный пример и самопроверка.</p><p><b>Общие критерии:</b> ${kit.success.map(esc).join(' · ')}</p></div>${kit.homework.map(h=>`<section class="homework-option"><h2>${esc(h.level)} · ${esc(h.title)} <small>${esc(h.time)}</small></h2><p class="situation"><b>Ситуация:</b> ${esc(h.situation)}</p><h3>Делай по шагам</h3><ol>${h.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><div class="bank"><b>Банк слов и идей:</b><br>${esc(h.bank)}</div><p><b>Полезные фразы:</b> ${esc(h.frames)}</p><div class="example"><b>Полный пример:</b><br>${esc(h.example)}</div><p><b>Что сдать:</b> ${esc(h.deliver)}</p><div class="selfcheck"><b>Проверь себя</b>${h.check.map(x=>`<span>□ ${esc(x)}</span>`).join('')}</div></section>`).join('')}<section><h2>Как объявить домашнее задание</h2><div class="docblock"><b>Готовая реплика учителя:</b><p>Выберите только один вариант. Сначала прочитайте ситуацию и шаги. Для большей опоры подойдёт вариант 1; для самостоятельного переноса — вариант 2; для общения — варианты 3 и 4; для игровой разминки — вариант 5. В конце проверьте работу по четырём пунктам.</p></div></section></div>`}
  documentHTML=function(){if(tab==='learner')return homeworkHTML();return oldDoc()};
  [type,form]=defs(lesson);reset(false);
})();
