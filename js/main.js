// one-will-single-page-website/js/main.js
// ハンバーガーメニュー
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
      
      // 開いたときにスクロールを防止
      if (mobileMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // モバイルメニューでのリンクをクリックしたら閉じる
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // モバイルメニュー外をクリックしても閉じる
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});

// ナビゲーションリンクのアクティブ状態
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

// スクロール検出とヘッダー変更
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const headerProgressBar = document.querySelector('.header-progress-bar');
  
  // ヘッダー変更
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // スクロールプログレスバー
  const scrollTop = window.scrollY;
  const docHeight = document.body.offsetHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  headerProgressBar.style.width = scrollPercent + '%';
  
  // アクティブなナビゲーションリンクの更新
  let currentSection = '';
  
  sections.forEach(section => {
    // オフセット値を調整して、より正確に現在のセクションを検出
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - 150;
    const sectionHeight = section.offsetHeight;
    if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active-link');
    }
  });

  // セクションのフェードイン
  document.querySelectorAll('.section-block, .shaped-section').forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (sectionTop < windowHeight * 0.75) {
      section.classList.add('visible');
    }
  });
});

// タイピングアニメーション
const sloganTexts = [
  "建設×ITで未来を拓く",
  "外国人材の力で社会を変える",
  "Global to Local Success",
  "多様性が生み出す新しい価値"
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

// スクロールダウンボタンのクリックイベント
document.addEventListener('DOMContentLoaded', () => {
  const scrollDownBtn = document.querySelector('.scroll-down');
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      const servicesSection = document.getElementById('services');
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// プリローダーを非表示にする
document.addEventListener('DOMContentLoaded', function() {
  // フォントの読み込みエラーを無視してプリローダーを非表示にする
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
  
  // サイトのコンテンツを表示
  document.body.style.visibility = 'visible';
});

// パーティクル効果
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1
            }
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  }
}

// AOS初期化
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    once: false,
    offset: 50,
    delay: 0,
    disable: 'mobile',
    startEvent: 'DOMContentLoaded'
  });
  
  // サービスセクションが表示されない問題を修正
  document.querySelectorAll('.service-item').forEach(function(item) {
    item.style.opacity = '1';
    item.style.transform = 'none';
    item.style.visibility = 'visible';
    item.style.display = 'block';
  });
  
  // 念のため、遅延してもう一度初期化
  setTimeout(function(){
    AOS.refresh();
  }, 500);
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

// サービスアイテムのアニメーション
// GSAPとAOSのアニメーション競合を解消
// gsap.utils.toArray('.service-item').forEach((item, i) => {
//   gsap.from(item, {
//     scrollTrigger: {
//       trigger: item,
//       start: "top 85%",
//     },
//     y: 50,
//     opacity: 0,
//     duration: 0.8,
//     delay: i * 0.15
//   });
// });

// DOMContentLoaded イベントでサービスセクションの表示を確実にする
document.addEventListener('DOMContentLoaded', function() {
  // サービスセクションとアイテムを強制的に表示
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    servicesSection.style.display = 'block';
    servicesSection.style.visibility = 'visible';
    servicesSection.style.opacity = '1';
    
    // サービスアイテムを強制的に表示
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(function(item) {
      item.style.display = 'block';
      item.style.visibility = 'visible';
      item.style.opacity = '1';
      item.style.transform = 'none';
      
      // サービスアイコンコンテナと画像も確実に表示
      const iconContainer = item.querySelector('.service-icon-container');
      const icon = item.querySelector('.service-icon');
      if (iconContainer) {
        iconContainer.style.display = 'flex';
        iconContainer.style.visibility = 'visible';
        iconContainer.style.opacity = '1';
      }
      if (icon) {
        icon.style.display = 'block';
        icon.style.visibility = 'visible';
        icon.style.opacity = '1';
      }
    });
  }
  
  // AOSをサービスセクションに対しては無効化
  document.querySelectorAll('#services [data-aos]').forEach(function(el) {
    el.removeAttribute('data-aos');
    el.removeAttribute('data-aos-delay');
  });
});

// ブログ記事のアニメーション
gsap.utils.toArray('.blog-news-item').forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 85%",
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.7,
    delay: i * 0.2
  });
});

// Clarityの初期化
// import Clarity from '@microsoft/clarity';

// プロジェクトIDの設定
const projectId = "qto7ndar5b";

// Clarityの初期化（モジュールを使わないバージョン）
if (typeof clarity !== 'undefined') {
  clarity('set', projectId);
}

// ページ読み込み時のイベント
document.addEventListener('DOMContentLoaded', () => {
  // ページ識別子の設定
  if (typeof clarity !== 'undefined') {
    clarity('identify', "page-" + window.location.pathname);
  }
  
  // カスタムタグの設定
  if (typeof clarity !== 'undefined') {
    clarity('set', "page_type", "landing");
    clarity('set', "language", "ja");
  }
  
  // コンタクトフォームの送信イベント
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      if (typeof clarity !== 'undefined') {
        clarity('event', "contact_form_submit");
      }
    });
  }
  
  // サービスセクションのクリックイベント
  const serviceLinks = document.querySelectorAll('.service-link');
  serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const serviceName = link.closest('.service-item').querySelector('.service-title').textContent;
      if (typeof clarity !== 'undefined') {
        clarity('event', "service_click");
      }
    });
  });
  
  // お問い合わせボタンのクリックイベント
  const contactButtons = document.querySelectorAll('.contact-button, .mobile-cta');
  contactButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (typeof clarity !== 'undefined') {
        clarity('event', "contact_button_click");
      }
    });
  });
  
  // スクロールイベント
  let lastScrollPosition = 0;
  window.addEventListener('scroll', () => {
    const currentScrollPosition = window.pageYOffset;
    const scrollPercentage = Math.round((currentScrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    // 25%、50%、75%、100%のスクロールポイントでイベントを記録
    if (scrollPercentage >= 25 && lastScrollPosition < 25) {
      if (typeof clarity !== 'undefined') {
        clarity('event', "scroll_25_percent");
      }
    } else if (scrollPercentage >= 50 && lastScrollPosition < 50) {
      if (typeof clarity !== 'undefined') {
        clarity('event', "scroll_50_percent");
      }
    } else if (scrollPercentage >= 75 && lastScrollPosition < 75) {
      if (typeof clarity !== 'undefined') {
        clarity('event', "scroll_75_percent");
      }
    } else if (scrollPercentage >= 100 && lastScrollPosition < 100) {
      if (typeof clarity !== 'undefined') {
        clarity('event', "scroll_100_percent");
      }
    }
    
    lastScrollPosition = scrollPercentage;
  });
  
  // モバイルメニューの開閉イベント
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (typeof clarity !== 'undefined') {
        clarity('event', isOpen ? "mobile_menu_close" : "mobile_menu_open");
      }
    });
  }
  
  // 電話番号のクリックイベント
  const phoneLinks = document.querySelectorAll('.header-phone, .mobile-phone');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (typeof clarity !== 'undefined') {
        clarity('event', "phone_number_click");
      }
    });
  });
});

// Google Analytics イベントトラッキング
document.addEventListener('DOMContentLoaded', () => {
  // コンタクトフォームの送信イベント
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
          'event_category': 'form',
          'event_label': 'contact_form'
        });
      }
    });
  }
  
  // サービスセクションのクリックイベント
  const serviceLinks = document.querySelectorAll('.service-link');
  serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const serviceName = link.closest('.service-item').querySelector('.service-title').textContent;
      if (typeof gtag !== 'undefined') {
        gtag('event', 'service_click', {
          'event_category': 'service',
          'event_label': serviceName
        });
      }
    });
  });
  
  // お問い合わせボタンのクリックイベント
  const contactButtons = document.querySelectorAll('.contact-button, .mobile-cta');
  contactButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_button_click', {
          'event_category': 'cta',
          'event_label': 'contact_button'
        });
      }
    });
  });
  
  // スクロールイベント
  let lastScrollPosition = 0;
  window.addEventListener('scroll', () => {
    const currentScrollPosition = window.pageYOffset;
    const scrollPercentage = Math.round((currentScrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    // 25%、50%、75%、100%のスクロールポイントでイベントを記録
    if (scrollPercentage >= 25 && lastScrollPosition < 25) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          'event_category': 'engagement',
          'event_label': '25_percent'
        });
      }
    } else if (scrollPercentage >= 50 && lastScrollPosition < 50) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          'event_category': 'engagement',
          'event_label': '50_percent'
        });
      }
    } else if (scrollPercentage >= 75 && lastScrollPosition < 75) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          'event_category': 'engagement',
          'event_label': '75_percent'
        });
      }
    } else if (scrollPercentage >= 100 && lastScrollPosition < 100) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          'event_category': 'engagement',
          'event_label': '100_percent'
        });
      }
    }
    
    lastScrollPosition = scrollPercentage;
  });
  
  // モバイルメニューの開閉イベント
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (typeof gtag !== 'undefined') {
        gtag('event', 'mobile_menu', {
          'event_category': 'navigation',
          'event_label': isOpen ? 'close' : 'open'
        });
      }
    });
  }
  
  // 電話番号のクリックイベント
  const phoneLinks = document.querySelectorAll('.header-phone, .mobile-phone');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_click', {
          'event_category': 'contact',
          'event_label': 'phone_number'
        });
      }
    });
  });
});
