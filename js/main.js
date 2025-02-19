// one-will-single-page-website/js/main.js
// ハンバーガーメニュー
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// タイピングアニメーション
const sloganTexts = [
  "建設×ITで未来を拓く",
  "外国人材の力で社会を変える",
  "Global Talent, Local Impact"
];
let typingIndex = 0;
let charIndex = 0;
const typingSpeed = 100;
const erasingSpeed = 50;
const delayBetween = 1500;
const typingTextEl = document.getElementById('typingText');
const cursorEl = document.getElementById('typingCursor');

function type() {
  if (charIndex < sloganTexts[typingIndex].length) {
    typingTextEl.textContent += sloganTexts[typingIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingSpeed);
  } else {
    setTimeout(erase, delayBetween);
  }
}
function erase() {
  if (charIndex > 0) {
    typingTextEl.textContent = sloganTexts[typingIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingSpeed);
  } else {
    typingIndex = (typingIndex + 1) % sloganTexts.length;
    setTimeout(type, 500);
  }
}
window.addEventListener('load', () => {
  setTimeout(type, 1200);
});

// プリローダー制御
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.classList.add('fade-out');
});

// AOS初期化
AOS.init({
  duration: 800,
  once: true
});

// GSAP + ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

gsap.from("#aboutText", {
  scrollTrigger: {
    trigger: "#aboutText",
    start: "top 80%",
    toggleActions: "play none none reverse"
  },
  x: -50,
  opacity: 0,
  duration: 1
});
gsap.from("#aboutImage", {
  scrollTrigger: {
    trigger: "#aboutImage",
    start: "top 80%",
    toggleActions: "play none none reverse"
  },
  x: 50,
  opacity: 0,
  duration: 1
});
