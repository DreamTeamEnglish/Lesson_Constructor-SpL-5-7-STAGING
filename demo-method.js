// ============================================================
// PUBLIC DEMO method layer · 9 lessons only.
// Keeps GOLD rules needed by the demo without shipping the full course registry.
// ============================================================
(function(){
  'use strict';
  const key=l=>`${String(l?.course_id||'').toUpperCase()}:${String(l?.legacy_id||'').toLowerCase()}`;
  const section=l=>String(l?.section_title||'');
  const isEiu=l=>/^English in Use/i.test(section(l));
  const isAcross=l=>/^Across the Curriculum/i.test(section(l));
  const isCulture=l=>/^Culture Corner/i.test(section(l))||/^Spotlight on Russia/i.test(section(l));
  const frames=l=>(l?.functional_frames||[]).filter(Boolean);
  const words=l=>(l?.lexical_bank||[]).filter(Boolean);
  const canDo=l=>l?.verified_can_do||({
    'SPOTLIGHT-6:1a':'I can describe a family member and explain how people in a family are related.',
    'SPOTLIGHT-6:4f':'I can choose a suitable graph, ask a short survey question and explain the results.',
    'SPOTLIGHT-6:8e':'I can book theatre tickets, choose seats and give the details needed.'
  })[key(l)]||`I can create ${l?.product||'a lesson product'} clearly.`;
  const success=l=>[
    'I use information from the lesson source, not invented details.',
    'I use useful lesson words and phrases accurately.',
    `My ${l?.product||'final result'} is clear to another person.`,
    'I check my work before I finish.'
  ];
  const sourceName=l=>l?.coursebook_source||`Spotlight ${String(l?.course_id||'').match(/(5|6|7)/)?.[1]||''} · ${l?.legacy_id||''}`;
  const sourceFlow=l=>(l?.source_sequence||[]).join(' → ');
  const sourceStimuli=l=>(l?.source_stimuli||[]).join('; ')||l?.micro_situation||'';
  const sourceProduct=l=>(l?.source_products||[])[0]||l?.product||'lesson product';

  function tuneActivity(l,a,goal){
    const out={...a};
    const code=String(a.id||'').replace(/^.*?(P[1-6]-\d\d)$/,'$1');
    const ff=frames(l).join(' · ');
    const bank=words(l).slice(0,10).join(', ');
    if(code==='P1-01'){
      out.teacher=`Предъявляет только реальный стимул текущего DEMO-урока: ${sourceStimuli(l)}. Не добавляет соседний материал.`;
      out.students='Называют две детали, действительно присутствующие в стимуле, и на их основе формулируют гипотезу.';
      out.instruction=`Look at / read the lesson source. Name two details you can really see or read. What may the lesson be about?`;
      out.materials=sourceName(l);
      out.criterion='Гипотеза подтверждена двумя деталями реального источника.';
    }
    if(code==='P2-01'){
      out.instruction=`The final task is “${sourceProduct(l)}”. Finish: Today I will learn to… Choose two signs of success.`;
      out.example=goal;
      out.criterion='Цель названа через действие ученика и совпадает с итоговым продуктом.';
    }
    if(code==='P3-01'){
      out.instruction=`Use the lesson words (${bank}). Organise them by meaning and explain one connection. Then return to the source task.`;
      out.materials=`${sourceName(l)}; тематические карточки`;
    }
    if(code==='P3-02'){
      out.teacher='Ведёт учащихся по языковому действию текущей страницы и не заменяет его соседней грамматикой.';
      out.instruction=`Follow the source task. Notice how the lesson language works, make one source-linked example and check it with a partner.`;
      out.example=`Source route: ${sourceFlow(l)||l?.grammar_focus}. Useful language: ${ff}`;
      out.materials=sourceName(l);
    }
    if(code==='P3-03' && isEiu(l)){
      out.teacher='Сначала возвращает модельный диалог/реплики текущей страницы, затем постепенно снимает опору.';
      out.students='Определяют функции реплик, читают/слушают модель и проводят параллельный обмен с новыми данными.';
      out.instruction=`Use the model dialogue first. Identify the two roles and the information they exchange. Then make a parallel dialogue without copying the full model.`;
      out.materials=`${sourceName(l)}; модельный диалог; карточки ролей`;
      out.criterion='Роли и последовательность действий соответствуют модели текущей страницы.';
    }
    if(code==='P4-01'){
      if(isEiu(l)){
        out.teacher='Организует source-linked role-play по данным текущей страницы; партнёры не показывают карточки друг другу.';
        out.students='Запрашивают недостающую информацию, реагируют на ответ и завершают практический диалог.';
        out.instruction=`Use the source model and role data. Complete the dialogue for a new customer/situation. Ask for the information you really need. Do not show your role card.`;
        out.materials=`${sourceName(l)}; source-linked role cards`;
        out.criterion='Диалог завершён; роли не перепутаны; данные не придуманы вместо данных карточки.';
      }else if(isAcross(l)){
        out.teacher='Сохраняет предметную задачу текущего Across the Curriculum и проверяет факты/числа по источнику.';
        out.students='Извлекают нужные данные из источника, создают продукт и сверяют его с исходным материалом.';
        out.instruction=`Use the cross-curricular source first. Create ${sourceProduct(l)} and check every fact, number or safety rule against the source.`;
        out.materials=sourceName(l);
        out.criterion='Предметная логика и исходные данные сохранены; продукт связан с текущей страницей.';
      }else if(isCulture(l)){
        out.teacher='Разрешает использовать только факты из выданного источника текущего урока.';
        out.students='Извлекают подтверждённые сведения, организуют их для адресата и создают итоговый продукт.';
        out.instruction=`Use only the source information. Create ${sourceProduct(l)} for another visitor/student. Do not invent cultural facts.`;
        out.materials=sourceName(l);
        out.criterion='Каждый культурный факт подтверждён источником.';
      }else{
        out.instruction=`Follow the source route: ${sourceFlow(l)}. Create ${sourceProduct(l)} for a clear audience.`;
        out.materials=sourceName(l);
      }
    }
    if(code==='P5-01'){
      out.teacher='Даёт новую структурно сходную задачу. После самостоятельного выполнения открывает чек-лист; работа остаётся у ученика до самопроверки. Собирает её только после коррекции или отметки сильного места.';
      out.students='Работают самостоятельно, затем проверяют результат по чек-листу. Исправляют конкретную неточность или отмечают сильное доказательство; только после этого передают работу.';
      out.instruction=`Individually make a new short version of ${sourceProduct(l)}. Keep your work in front of you. When the checklist appears, self-check it before you hand it in.`;
      out.criterion='Самостоятельный продукт завершён; самопроверка проведена до передачи работы.';
    }
    if(code==='P6-01'){
      out.instruction='Complete: Now I can… My evidence is… Next time I need to…';
      out.example=`${goal} My evidence is: … Next time I need to…`;
    }

    // Exact locks for the three especially sensitive demo lessons.
    if(key(l)==='SPOTLIGHT-6:4f' && code==='P4-01'){
      out.teacher='Организует короткий опрос, фиксацию ровно 10 ответов, tally, bar chart и проценты; использует параллельную/галерейную проверку вместо длинных презентаций.';
      out.students='Собирают 10 ответов, строят bar chart, после проверки переводят результаты в проценты и кратко объясняют данные.';
      out.instruction='Ask one clear survey question. Collect exactly 10 answers. Make a tally and a bar chart. Check the numbers, then add percentages and one conclusion.';
      out.example='4 / 3 / 2 / 1 answers = 40% / 30% / 20% / 10%.';
      out.criterion='Ровно 10 ответов; tally, graph and percentages совпадают; вывод подтверждён данными.';
    }
    if(key(l)==='SPOTLIGHT-6:8e'){
      if(code==='P3-03'){
        out.teacher='Сохраняет цепочку страницы: receptionist/customer phrases → Hamlet model dialogue → уменьшение опоры.';
        out.students='Распределяют реплики по ролям, читают/слушают Hamlet model и репетируют параллельный booking.';
        out.instruction='Sort the phrases into Customer / Receptionist. Listen to and read the Hamlet booking dialogue. Find play/date/seats/price/payment details, then repeat the exchange with reduced support.';
        out.example='R: How can I help you? C: I’d like to book some theatre tickets, please.';
      }
      if(code==='P4-01'){
        out.teacher='Первый полный role-play строит по Romeo and Juliet poster; затем проводит краткий /əʊ/ vs /aʊ/ focus и второй booking как перенос.';
        out.students='Бронируют билеты по source-linked данным, меняются ролями и проводят второй диалог с новым набором данных.';
        out.instruction='Use the Romeo and Juliet poster for the first booking. Ask for play/date/seats/price/payment. Then change roles and complete a new booking.';
        out.criterion='Первый booking связан с poster; роли согласованы; второй диалог является переносом.';
      }
    }
    if(key(l)==='SPOTLIGHT-7:1b' && code==='P4-01'){
      out.instruction='Use the home/street-safety source and should/shouldn’t. Create a short street-safety leaflet with advice another teenager can actually use.';
    }
    if(key(l)==='SPOTLIGHT-7:7e' && code==='P4-01'){
      out.instruction='Use the cinema model dialogue. Student A is the customer; Student B is the ticket seller. Ask for the film/showing, number of tickets and price. React if a showing is sold out.';
    }
    if(key(l)==='SPOTLIGHT-7:8r' && code==='P4-01'){
      out.instruction='Use only the Eco-camping source text. Select source-supported eco-camping facts and create a short presentation. Do not add cultural facts from memory.';
    }
    return out;
  }

  function tuneHomework(l,items){
    const out=(items||[]).map(x=>({...x,steps:[...(x.steps||[])],check:[...(x.check||[])]}));
    if(out[2]){
      out[2].situation='Подготовь устную часть самостоятельно дома. Реальный разговор/представление состоится на следующем уроке.';
      out[2].deliver='Ключевые слова/карточка и готовность говорить на следующем уроке; домашний партнёр не требуется.';
      out[2].check=['Я подготовил материал самостоятельно','Мне не нужен партнёр дома','Я могу говорить по ключевым словам','Взаимодействие начнётся на следующем уроке'];
    }
    if(out[3]){
      out[3].situation='Самостоятельно подготовь обе части information gap и ключ. На следующем уроке учитель распределит роли.';
      out[3].deliver='Card A + Card B + Key; взаимодействие выполняется на следующем уроке.';
      out[3].check=['Обе карточки подготовлены дома самостоятельно','На карточках разная информация','Есть отдельный ключ','Партнёр понадобится только на следующем уроке'];
    }
    return out;
  }

  function recommendedDefaults(l){
    if(isEiu(l))return ['T05','F06'];
    if(isAcross(l))return ['T11','F07'];
    if(isCulture(l))return ['T10','F05'];
    return ['T01','F01'];
  }
  function install(){
    if(window.__KA_DEMO_METHOD)return true;
    if(!Array.isArray(window.LESSONS)||typeof window.buildLessonKit!=='function')return false;
    const base=window.buildLessonKit;
    window.buildLessonKit=function(l){
      const kit=base(l);
      if(key(l)==='SPOTLIGHT-6:1a')return kit;
      const goal=canDo(l);
      return {...kit,canDo:goal,success:success(l),activities:(kit.activities||[]).map(a=>tuneActivity(l,a,goal)),homework:tuneHomework(l,kit.homework||[])};
    };
    window.defs=recommendedDefaults;
    window.KA_METHOD_V24={version:'24.2.3-DEMO',canDo,success,recommendedDefaults};
    window.__KA_DEMO_METHOD=true;
    try{if(typeof reset==='function')setTimeout(()=>reset(),0)}catch(_){}
    return true;
  }
  if(!install()){
    const timer=setInterval(()=>{if(install())clearInterval(timer)},25);
  }
})();
