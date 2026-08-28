// ============================================================
// Spotlight 5–7 course router
// Keeps the frozen Spotlight 6 floor as the startup default.
// ============================================================
(function(){
  'use strict';
  let activeGrade=6;
  const floors={
    5:()=>window.SPOTLIGHT5_LESSONS||[],
    6:()=>window.SPOTLIGHT6_LESSONS||[],
    7:()=>window.SPOTLIGHT7_LESSONS||[]
  };
  function normalizeGrade(value){
    const grade=Number(value);
    if(!floors[grade])throw new Error(`Unsupported Spotlight grade: ${value}`);
    return grade;
  }
  function lessonsForGrade(value){return floors[normalizeGrade(value)]().slice();}
  function activateGrade(value){
    const grade=normalizeGrade(value);
    const lessons=floors[grade]();
    if(!lessons.length)throw new Error(`Spotlight ${grade} lesson floor is empty`);
    activeGrade=grade;
    window.KA_ACTIVE_GRADE=grade;
    window.LESSONS=lessons;
    return lessons[0];
  }
  function currentGrade(){return activeGrade;}
  function courseLabel(value=activeGrade){return `Spotlight ${normalizeGrade(value)}`;}
  window.KA_ACTIVE_GRADE=6;
  window.KA_COURSE_ROUTER={activateGrade,currentGrade,lessonsForGrade,courseLabel};
})();
