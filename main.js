// スクロールで各セクションがふわっと現れる
(function () {
  var targets = document.querySelectorAll('.section, .section-gallery');
  if (!('IntersectionObserver' in window)) return;
  targets.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(function (el) { io.observe(el); });
})();

// 追従CTA: ヒーローを過ぎたら表示、申込フォームが見えたら隠す
(function () {
  var bar = document.getElementById('stickyCta');
  var hero = document.querySelector('.hero');
  var apply = document.getElementById('apply');
  if (!bar || !hero) return;
  var applyVisible = false;
  function update() {
    var passedHero = window.scrollY > hero.offsetHeight - 80;
    bar.classList.toggle('show', passedHero && !applyVisible);
  }
  if ('IntersectionObserver' in window && apply) {
    new IntersectionObserver(function (entries) {
      applyVisible = entries[0].isIntersecting;
      update();
    }, { threshold: 0.15 }).observe(apply);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
