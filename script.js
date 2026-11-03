// ── 상장 · 슬라이드 크게 보기 (무엇을 보는지 캡션으로 표시, 닫으면 원래 자리로 포커스 복귀)
const box = document.querySelector('.lightbox');
const boxImg = box.querySelector('img');
const boxCap = box.querySelector('figcaption');
const closeBtn = box.querySelector('.lightbox-close');
let lastTrigger = null;

document.querySelectorAll('[data-img]').forEach((el) => {
  el.addEventListener('click', () => {
    const label = el.querySelector('img')?.alt
      || el.querySelector('span:nth-of-type(2)')?.textContent
      || '원본';
    lastTrigger = el;
    boxImg.src = el.dataset.img;
    boxImg.alt = label;
    boxCap.textContent = label;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  });
});

function closeBox() {
  box.hidden = true;
  document.body.style.overflow = '';
  lastTrigger?.focus();
}
box.addEventListener('click', (e) => { if (e.target !== boxImg) closeBox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden) closeBox(); });

// ── 지금 보고 있는 섹션을 메뉴에 표시
const links = [...document.querySelectorAll('.nav nav a')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((sec) => navIO.observe(sec));

// ── 맨 위로 버튼: 첫 화면을 지나면 나타남
const toTop = document.querySelector('.to-top');
const hero = document.querySelector('.hero');
new IntersectionObserver(([en]) => toTop.classList.toggle('show', !en.isIntersecting)).observe(hero);

// ── 메일 주소 복사 (메일 앱이 열리지 않는 환경 대비)
const copyBtn = document.getElementById('copy-mail');
copyBtn?.addEventListener('click', () => {
  const addr = document.getElementById('mail').textContent.trim();
  const done = () => { copyBtn.textContent = '복사됨'; setTimeout(() => { copyBtn.textContent = '주소 복사'; }, 1500); };
  const select = () => {
    const r = document.createRange();
    r.selectNodeContents(document.getElementById('mail'));
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
  };
  try { navigator.clipboard.writeText(addr).then(done, select); } catch (e) { select(); }
});

// ── 스크롤하면 하나씩 나타나기 (자바스크립트가 없으면 처음부터 보임)
document.documentElement.classList.add('js');
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
