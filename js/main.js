// =========================
// ONE WILL ウェブサイト用JavaScript
// =========================

(function() {
  'use strict';
  
  // Clarityスクリプトのロード状態を確認
  function checkClarityStatus() {
    try {
      if (typeof window.clarity === 'function') {
        // イベントリスナーを追加してClarityの接続エラーをトラップ
        var originalXHROpen = window.XMLHttpRequest.prototype.open;
        var originalXHRSend = window.XMLHttpRequest.prototype.send;
        
        // XMLHttpRequestをモニタリング
        window.XMLHttpRequest.prototype.open = function() {
          var url = arguments[1] || '';
          if (typeof url === 'string' && url.indexOf('clarity.ms') > -1) {
            this._isClarityRequest = true;
            this._clarityUrl = url;
          }
          return originalXHROpen.apply(this, arguments);
        };
        
        window.XMLHttpRequest.prototype.send = function() {
          if (this._isClarityRequest) {
            var xhr = this;
            xhr.addEventListener('error', function() {
              // Fallbackトラッキングまたはエラー修復処理をここに追加可能
            });
          }
          return originalXHRSend.apply(this, arguments);
        };
        
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  
  // CSPエラーのモニタリング
  function monitorCSPErrors() {
    try {
      document.addEventListener('securitypolicyviolation', function(e) {
        // エラー情報を記録
      });
    } catch (e) {
      // エラー処理
    }
  }
  
  // 安全なセレクタ関数
  function $(selector) {
    return document.querySelector(selector);
  }
  
  function $$(selector) {
    return document.querySelectorAll(selector);
  }
  
  // DOM要素が存在するか確認する関数
  function elementExists(selector) {
    return document.querySelector(selector) !== null;
  }
  
  // イベント登録の安全なラッパー
  function safeAddEventListener(element, event, callback) {
    if (element && typeof element.addEventListener === 'function') {
      element.addEventListener(event, callback);
      return true;
    }
    return false;
  }
  
  // ライブラリチェックと代替実装
  function isLibraryAvailable(libraryName) {
    return typeof window[libraryName] !== 'undefined';
  }
  
  // メイン関数 - ページの準備完了後に実行
  function initializePage() {
    try {
      // CSPエラーのモニタリングを開始
      monitorCSPErrors();
      
      // Clarityのステータスを確認
      checkClarityStatus();
      
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
      
      // ハンバーガーメニューの設定
      setupHamburgerMenu();
      
      // スクロール検出の設定
      setupScroll();
      
      // サービスセクションとアイテムを表示
      showServices();
      
      // ライブラリ依存の機能を初期化
      setTimeout(initializeLibraries, 100);
    } catch (error) {
      // エラー処理
    }
  }
  
  // ハンバーガーメニューの設定
  function setupHamburgerMenu() {
    try {
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
    } catch (error) {
      // エラー処理
    }
  }
  
  // スクロール検出とヘッダー変更の設定
  function setupScroll() {
    try {
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
        updateActiveNavLinks(currentScrollTop);

        // セクションのフェードイン
        animateSections();
      }
      
      // アクティブなナビリンクを更新
      function updateActiveNavLinks(scrollPos) {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link');
        var currentSection = '';
        
        for (var i = 0; i < sections.length; i++) {
          var section = sections[i];
          var sectionTop = section.getBoundingClientRect().top + window.pageYOffset - 150;
          var sectionHeight = section.offsetHeight;
          
          if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
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
      }
      
      // セクションのアニメーション
      function animateSections() {
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
      
      // スクロールイベントを設定
      if (window.addEventListener) {
        // 初回実行
        handleScroll();
        // イベントリスナーを追加
        window.addEventListener('scroll', handleScroll);
      }
    } catch (error) {
      // エラー処理
    }
  }
  
  // サービスセクションの表示
  function showServices() {
    try {
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
    } catch (error) {
      // エラー処理
    }
  }
  
  // ライブラリ依存機能の初期化
  function initializeLibraries() {
    try {
      // AOS初期化
      initAOS();
      
      // パーティクル効果の初期化
      initParticles();
      
      // タイピングアニメーション開始
      initTypingAnimation();
    } catch (error) {
      // エラー処理
    }
  }
  
  // AOS初期化関数
  function initAOS() {
    if (isLibraryAvailable('AOS')) {
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
    } else {
      // AOSがない場合の代替処理
      setBasicAnimations();
    }
  }
  
  // 基本的なアニメーション設定
  function setBasicAnimations() {
    try {
      var fadeElements = document.querySelectorAll('[data-aos]');
      for (var i = 0; i < fadeElements.length; i++) {
        fadeElements[i].classList.add('animated');
      }
    } catch (error) {
      // エラー処理
    }
  }
  
  // particles.js初期化関数
  function initParticles() {
    if (isLibraryAvailable('particlesJS')) {
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
  }
  
  // タイピングアニメーション初期化関数
  function initTypingAnimation() {
    var typingTextEl = document.getElementById('typingText');
    if (typingTextEl) {
      try {
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
          try {
            if (!typingTextEl) {
              return;
            }
            
            if (charIndex < sloganTexts[typingIndex].length) {
              typingTextEl.textContent += sloganTexts[typingIndex].charAt(charIndex);
              charIndex++;
              setTimeout(type, typingSpeed);
            } else {
              setTimeout(erase, delayBetween);
            }
          } catch (e) {
            // エラー処理
          }
        }
        
        function erase() {
          try {
            if (!typingTextEl) {
              return;
            }
            
            if (charIndex > 0) {
              typingTextEl.textContent = sloganTexts[typingIndex].substring(0, charIndex - 1);
              charIndex--;
              setTimeout(erase, erasingSpeed);
            } else {
              typingIndex = (typingIndex + 1) % sloganTexts.length;
              setTimeout(type, 500);
            }
          } catch (e) {
            // エラー処理
          }
        }
        
        // タイピングアニメーションの開始
        setTimeout(type, 1200);
      } catch (error) {
        // エラー処理
      }
    }
  }
  
  // 初期化処理のスケジュール設定
  function scheduleInitialization() {
    try {
      // アプリケーション初期化
      var initApp = function() {
        try {
          initializePage();
        } catch (e) {
          // エラー処理
        }
      };
      
      // 既にロード済みの場合の処理
      if (document.readyState === 'complete') {
        // setTimeout を使って非同期実行
        setTimeout(initApp, 0);
        return;
      }
      
      // DOM読み込み完了時と、ページ読み込み完了時の両方をハンドリング
      var loaded = false;
      var domReady = function() {
        if (loaded) return;
        loaded = true;
        initApp();
      };
      
      // ブラウザによっては DOMContentLoaded が発火しないことがあるので、
      // 複数のイベントをリッスン
      document.addEventListener('DOMContentLoaded', domReady, false);
      window.addEventListener('load', domReady, false);
      
      // fallback として setTimeout も使用
      setTimeout(function() {
        if (!loaded) {
          domReady();
        }
      }, 1500);
    } catch (error) {
      // 最終的なエラーハンドリング
      
      // 何があっても初期化を試みる
      try {
        initializePage();
      } catch (e) {
        // エラー処理
      }
    }
  }
  
  // 初期化処理を開始
  scheduleInitialization();
})();
