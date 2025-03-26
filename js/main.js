// one-will-single-page-website/js/main.js
// プリローダーを非表示にする
(function() {
  'use strict';
  
  // フォールバック関数
  function safeAddEventListener(element, event, callback) {
    if (element && typeof element.addEventListener === 'function') {
      element.addEventListener(event, callback);
      return true;
    }
    return false;
  }
  
  // DOMContentLoaded
  function onDOMContentLoaded() {
    // プリローダーを非表示
    var preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(function() {
        preloader.style.display = 'none';
      }, 500);
    }
    
    // サイトのコンテンツを表示
    if (document.body) {
      document.body.style.visibility = 'visible';
    }
    
    // ハンバーガーメニュー
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger && mobileMenu) {
      safeAddEventListener(hamburger, 'click', function(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        
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
      var mobileLinks = document.querySelectorAll('.mobile-menu a');
      for (var i = 0; i < mobileLinks.length; i++) {
        safeAddEventListener(mobileLinks[i], 'click', function() {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
    }
    
    // スクロール検出とヘッダー変更
    function handleScroll() {
      var currentScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      var header = document.querySelector('header');
      var headerProgressBar = document.querySelector('.header-progress-bar');
      
      // ヘッダー変更
      if (header) {
        if (currentScrollTop > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // スクロールプログレスバー
      if (headerProgressBar) {
        var docHeight = document.body.offsetHeight - window.innerHeight;
        var scrollPercent = (docHeight > 0) ? (currentScrollTop / docHeight) * 100 : 0;
        headerProgressBar.style.width = scrollPercent + '%';
      }
      
      // アクティブなナビゲーションリンクの更新
      var sections = document.querySelectorAll('section[id]');
      var navLinks = document.querySelectorAll('.nav-link');
      var currentSection = '';
      
      for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var sectionTop = section.getBoundingClientRect().top + window.pageYOffset - 150;
        var sectionHeight = section.offsetHeight;
        
        if (currentScrollTop >= sectionTop && currentScrollTop < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      }
      
      for (var j = 0; j < navLinks.length; j++) {
        var link = navLinks[j];
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + currentSection) {
          link.classList.add('active-link');
        }
      }

      // セクションのフェードイン
      var fadeElements = document.querySelectorAll('.section-block, .shaped-section');
      for (var k = 0; k < fadeElements.length; k++) {
        var element = fadeElements[k];
        var elementTop = element.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.75) {
          element.classList.add('visible');
        }
      }
    }
    
    // 初回実行とスクロール時のイベント
    handleScroll();
    safeAddEventListener(window, 'scroll', handleScroll);
    
    // サービスセクションとアイテムを強制的に表示
    var servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.style.display = 'block';
      servicesSection.style.visibility = 'visible';
      servicesSection.style.opacity = '1';
    }
    
    // サービスアイテムを強制的に表示
    var serviceItems = document.querySelectorAll('.service-item');
    for (var l = 0; l < serviceItems.length; l++) {
      var item = serviceItems[l];
      item.style.display = 'block';
      item.style.visibility = 'visible';
      item.style.opacity = '1';
      item.style.transform = 'none';
    }
    
    // AOS初期化
    if (typeof window.AOS !== 'undefined') {
      try {
        window.AOS.init({
          duration: 800,
          once: false,
          offset: 50,
          delay: 0,
          startEvent: 'DOMContentLoaded'
        });
        
        setTimeout(function(){
          window.AOS.refresh();
        }, 500);
      } catch (e) {
        // エラー処理
      }
    }
    
    // パーティクル効果の初期化
    if (typeof window.particlesJS !== 'undefined') {
      try {
        var particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
          window.particlesJS('particles-js', {
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
    
    // タイピングアニメーション用の変数と関数
    var typingTextEl = document.getElementById('typingText');
    if (typingTextEl) {
      var sloganTexts = [
        "建設×ITで未来を拓く",
        "外国人材の力で社会を変える",
        "Global to Local Success",
        "多様性が生み出す新しい価値"
      ];
      var typingIndex = 0;
      var charIndex = 0;
      var typingSpeed = 100;
      var erasingSpeed = 50;
      var delayBetween = 1500;

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
    }
  }
  
  // DOMContentLoadedイベントリスナーの追加
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  } else {
    // DOMがすでに読み込まれている場合は直接実行
    onDOMContentLoaded();
  }
})();
