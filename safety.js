(function () {
  'use strict';

  document.addEventListener('contextmenu', e => e.preventDefault());

  document.addEventListener('keydown', e => {
    const c = e.ctrlKey || e.metaKey;
    const s = e.shiftKey;

    if (
      e.key === 'F12' ||
      (c && s && ['I','i','J','j','C','c'].includes(e.key)) ||
      (c && ['U','u'].includes(e.key)) ||
      (c && s && e.key === 'K')
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  });


  const THRESHOLD = 160;
  let warned = false;
  function checkDevTools() {
    const open = window.outerWidth  - window.innerWidth  > THRESHOLD ||
                 window.outerHeight - window.innerHeight > THRESHOLD;
    if (open && !warned) {
      warned = true;
      console.clear();
      console.log('%cWOW.', 'color:#c43c3c;font-size:28px;font-weight:bold;');
      console.log('%cYou have no life? Go back.', 'color:#aaa;font-size:14px;');
    }
    if (!open) warned = false;
  }
  setInterval(checkDevTools, 1000);
})();
