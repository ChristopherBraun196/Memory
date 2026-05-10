var e = (e, t) => () => (e && (t = e((e = 0))), t),
  t = (e, t) => () => (
    t || (e((t = { exports: {} }).exports, t), (e = null)),
    t.exports
  );
(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes)
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var n = e(() => {});
t(() => {
  n();
  var e = document.querySelector(`.btn-play`),
    t = document.querySelector(`.home`),
    r = document.querySelector(`.settings`),
    i = document.querySelector(`#selected-theme`),
    a = document.querySelector(`#selected-player`),
    o = document.querySelector(`#selected-size`),
    s = document.querySelectorAll(`input[type="radio"]`),
    c = document.querySelector(`.settings__bar-btn`),
    l = document.querySelector(`.settings__bar-img`),
    u = {
      "Code theme": `/Memory/images/vibes_theme/vibe_theme.png`,
      "Game theme": `/Memory/images/game_theme/game_theme.png`,
      "DA theme": `/Memory/images/da_theme/da_projects_theme.png`,
      "Food theme": `/Memory/images/food_theme/food_theme.png`,
    },
    d = document.querySelectorAll(`input[name="theme"]`);
  function f() {
    (e?.addEventListener(`click`, p), m(), g());
  }
  function p() {
    (t?.classList.remove(`screen--active`), r?.classList.add(`screen--active`));
  }
  function m() {
    s.forEach((e) => {
      e.addEventListener(`change`, () => {
        (e.name === `theme` &&
          ((i.textContent = e.value), (l.src = u[e.value])),
          e.name === `player` && (a.textContent = e.value),
          e.name === `board-size` && (o.textContent = e.value),
          h());
      });
    });
  }
  function h() {
    let e = document.querySelector(`input[name="theme"]:checked`),
      t = document.querySelector(`input[name="player"]:checked`),
      n = document.querySelector(`input[name="board-size"]:checked`);
    e && t && n && c.removeAttribute(`disabled`);
  }
  function g() {
    d.forEach((e) => {
      let t = e.closest(`label`);
      (t?.addEventListener(`mouseenter`, () => {
        l.src = u[e.value];
      }),
        t?.addEventListener(`mouseleave`, () => {
          let e = document.querySelector(`input[name="theme"]:checked`);
          e && (l.src = u[e.value]);
        }));
    });
  }
  f();
})();
