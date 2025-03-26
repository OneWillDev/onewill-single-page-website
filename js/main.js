// one-will-single-page-website/js/main.js
// プリローダーを非表示にする
document.addEventListener('DOMContentLoaded', function() {
  // プリローダーを非表示
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
  
  // サイトのコンテンツを表示
  document.body.style.visibility = 'visible';
  
  // ハンバーガーメニュー
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
  }
  
  // スクロール検出とヘッダー変更
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
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
    if (headerProgressBar) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      headerProgressBar.style.width = scrollPercent + '%';
    }
    
    // アクティブなナビゲーションリンクの更新
    let currentSection = '';
    
    sections.forEach(section => {
      // オフセット値を調整して、より正確に現在のセクションを検出
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - 150;
      const sectionHeight = section.offsetHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
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
  
  // サービスセクションとアイテムを強制的に表示
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    servicesSection.style.display = 'block';
    servicesSection.style.visibility = 'visible';
    servicesSection.style.opacity = '1';
  }
  
  // サービスアイテムを強制的に表示
  document.querySelectorAll('.service-item').forEach(function(item) {
    item.style.display = 'block';
    item.style.visibility = 'visible';
    item.style.opacity = '1';
    item.style.transform = 'none';
  });
  
  // タイピングアニメーション用の変数と関数
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

  function type() {
    if (!typingTextEl) return;
    
    if (charIndex < sloganTexts[typingIndex].length) {
      typingTextEl.textContent += sloganTexts[typingIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, delayBetween);
    }
  }
  
  function erase() {
    if (!typingTextEl) return;
    
    if (charIndex > 0) {
      typingTextEl.textContent = sloganTexts[typingIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      typingIndex = (typingIndex + 1) % sloganTexts.length;
      setTimeout(type, 500);
    }
  }
  
  // タイピングアニメーションの開始
  setTimeout(type, 1200);
  
  // AOS初期化
  if (typeof AOS !== 'undefined') {
    try {
      AOS.init({
        duration: 800,
        once: false,
        offset: 50,
        delay: 0,
        startEvent: 'DOMContentLoaded'
      });
      
      setTimeout(function(){
        AOS.refresh();
      }, 500);
    } catch (e) {
      // エラー処理
    }
  }
  
  // パーティクル効果の初期化
  if (typeof particlesJS !== 'undefined') {
    try {
      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        particlesJS('particles-js', {
          particles: {
            number: { value: 80 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4
            },
            move: {
              enable: true,
              speed: 1,
              random: true
            }
          }
        });
      }
    } catch (e) {
      // エラー処理
    }
  }
});
