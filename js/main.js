// =========================
// ONE WILL ウェブサイト用JavaScript
// =========================

(function() {
  'use strict';
  
  // デバッグ用のログ関数
  function debug(message) {
    if (window.console && window.console.log) {
      console.log('[OneWill Debug]:', message);
    }
  }

  // エラーログ関数
  function logError(context, error) {
    if (window.console && window.console.error) {
      console.error('[OneWill Error]:', context, error);
    }
  }

  debug('main.jsが読み込まれました');
  
  // Clarityスクリプトのロード状態を確認
  function checkClarityStatus() {
    try {
      debug('Clarityスクリプトのステータスを確認');
      if (typeof window.clarity === 'function') {
        debug('Clarityは正常に読み込まれています');
        return true;
      } else {
        debug('Clarityが見つかりません - グローバルオブジェクトに存在しません');
        return false;
      }
    } catch (e) {
      logError('Clarity確認エラー', e);
      return false;
    }
  }
  
  // CSPエラーのモニタリング
  function monitorCSPErrors() {
    try {
      debug('CSPエラーのモニタリングを開始');
      document.addEventListener('securitypolicyviolation', function(e) {
        logError('CSPエラー検出', {
          'blockedURI': e.blockedURI,
          'violatedDirective': e.violatedDirective,
          'originalPolicy': e.originalPolicy,
          'disposition': e.disposition,
          'documentURI': e.documentURI
        });
      });
    } catch (e) {
      logError('CSPモニタリングエラー', e);
    }
  }
  
  // 安全なセレクタ関数
  function $(selector) {
    debug('セレクタ検索: ' + selector);
    return document.querySelector(selector);
  }
  
  function $$(selector) {
    debug('複数セレクタ検索: ' + selector);
    return document.querySelectorAll(selector);
  }
  
  // DOM要素が存在するか確認する関数
  function elementExists(selector) {
    var exists = document.querySelector(selector) !== null;
    debug('要素チェック: ' + selector + ' - ' + (exists ? '存在します' : '存在しません'));
    return exists;
  }
  
  // イベント登録の安全なラッパー
  function safeAddEventListener(element, event, callback) {
    if (element && typeof element.addEventListener === 'function') {
      debug('イベントリスナー追加: ' + event);
      element.addEventListener(event, callback);
      return true;
    }
    logError('イベントリスナー追加失敗', event);
    return false;
  }
  
  // ライブラリチェックと代替実装
  function isLibraryAvailable(libraryName) {
    var available = typeof window[libraryName] !== 'undefined';
    debug('ライブラリチェック: ' + libraryName + ' - ' + (available ? '利用可能' : '利用不可'));
    return available;
  }
  
  // メイン関数 - ページの準備完了後に実行
  function initializePage() {
    debug('==== ページ初期化開始 ====');
    try {
      // CSPエラーのモニタリングを開始
      monitorCSPErrors();
      
      // Clarityのステータスを確認
      checkClarityStatus();
      
      // プリローダーを非表示
      var preloader = document.getElementById('preloader');
      if (preloader) {
        debug('プリローダーを非表示にします');
        preloader.classList.add('fade-out');
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 500);
      } else {
        debug('プリローダー要素が見つかりません');
      }
      
      // サイトのコンテンツを表示
      if (document.body) {
        debug('ボディを表示します');
        document.body.style.visibility = 'visible';
      }
      
      // ハンバーガーメニューの設定
      debug('ハンバーガーメニュー初期化開始');
      setupHamburgerMenu();
      
      // スクロール検出の設定
      debug('スクロール検出初期化開始');
      setupScroll();
      
      // サービスセクションとアイテムを表示
      debug('サービスセクション初期化開始');
      showServices();
      
      // ライブラリ依存の機能を初期化
      debug('ライブラリ依存機能の初期化を遅延実行します');
      setTimeout(initializeLibraries, 100);
      
      debug('==== ページ初期化完了 ====');
    } catch (error) {
      // エラーを記録するだけで続行
      logError('ページ初期化エラー', error);
    }
  }
  
  // ハンバーガーメニューの設定
  function setupHamburgerMenu() {
    try {
      debug('ハンバーガーメニュー要素を検索');
      var hamburger = document.getElementById('hamburger');
      var mobileMenu = document.getElementById('mobileMenu');
      
      if (hamburger && mobileMenu) {
        debug('ハンバーガーメニュー要素が見つかりました');
        
        safeAddEventListener(hamburger, 'click', function(e) {
          debug('ハンバーガーボタンがクリックされました');
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
        debug('モバイルメニューリンクを設定');
        var mobileLinks = document.querySelectorAll('.mobile-menu a');
        debug('モバイルメニューリンク数: ' + mobileLinks.length);
        for (var i = 0; i < mobileLinks.length; i++) {
          safeAddEventListener(mobileLinks[i], 'click', function() {
            debug('モバイルメニューリンクがクリックされました');
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
          });
        }
      } else {
        debug('ハンバーガーメニュー要素が見つかりません');
      }
    } catch (error) {
      // エラーを記録するだけで続行
      logError('ハンバーガーメニュー設定エラー', error);
    }
  }
  
  // スクロール検出とヘッダー変更の設定
  function setupScroll() {
    try {
      debug('スクロール検出セットアップ開始');
      
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
        debug('アクティブなナビリンク更新');
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
        
        debug('現在のセクション: ' + currentSection);
        
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
        debug('スクロールイベントリスナーを設定');
        // 初回実行
        handleScroll();
        // イベントリスナーを追加
        window.addEventListener('scroll', handleScroll);
      } else {
        debug('window.addEventListenerが利用できません');
      }
    } catch (error) {
      // エラーを記録するだけで続行
      logError('スクロール設定エラー', error);
    }
  }
  
  // サービスセクションの表示
  function showServices() {
    try {
      debug('サービスセクション表示処理開始');
      var servicesSection = document.getElementById('services');
      if (servicesSection) {
        debug('サービスセクションを表示');
        servicesSection.style.display = 'block';
        servicesSection.style.visibility = 'visible';
        servicesSection.style.opacity = '1';
      } else {
        debug('サービスセクションが見つかりません');
      }
      
      // サービスアイテムを強制的に表示
      debug('サービスアイテムを表示');
      var serviceItems = document.querySelectorAll('.service-item');
      debug('サービスアイテム数: ' + serviceItems.length);
      for (var l = 0; l < serviceItems.length; l++) {
        var item = serviceItems[l];
        item.style.display = 'block';
        item.style.visibility = 'visible';
        item.style.opacity = '1';
        item.style.transform = 'none';
      }
    } catch (error) {
      // エラーを記録するだけで続行
      logError('サービスセクション表示エラー', error);
    }
  }
  
  // ライブラリ依存機能の初期化
  function initializeLibraries() {
    try {
      debug('===== ライブラリ初期化開始 =====');
      // AOS初期化
      debug('AOS初期化開始');
      initAOS();
      
      // パーティクル効果の初期化
      debug('particles.js初期化開始');
      initParticles();
      
      // タイピングアニメーション開始
      debug('タイピングアニメーション初期化開始');
      initTypingAnimation();
      
      debug('===== ライブラリ初期化完了 =====');
    } catch (error) {
      // エラーを記録するだけで続行
      logError('ライブラリ初期化エラー', error);
    }
  }
  
  // AOS初期化関数
  function initAOS() {
    if (isLibraryAvailable('AOS')) {
      try {
        debug('AOS.initを呼び出し');
        window.AOS.init({
          duration: 800,
          once: false,
          offset: 50,
          delay: 0,
          startEvent: 'DOMContentLoaded'
        });
        
        setTimeout(function(){
          debug('AOS.refreshを呼び出し');
          window.AOS.refresh();
        }, 500);
      } catch (e) {
        // エラー処理
        logError('AOS初期化エラー', e);
      }
    } else {
      debug('AOSライブラリが見つからないため代替アニメーションを使用');
      // AOSがない場合の代替処理
      setBasicAnimations();
    }
  }
  
  // 基本的なアニメーション設定
  function setBasicAnimations() {
    try {
      debug('基本的なアニメーションを設定');
      var fadeElements = document.querySelectorAll('[data-aos]');
      debug('data-aos要素数: ' + fadeElements.length);
      for (var i = 0; i < fadeElements.length; i++) {
        fadeElements[i].classList.add('animated');
      }
    } catch (error) {
      // エラーを記録するだけで続行
      logError('基本アニメーション設定エラー', error);
    }
  }
  
  // particles.js初期化関数
  function initParticles() {
    if (isLibraryAvailable('particlesJS')) {
      try {
        debug('particles.js初期化');
        var particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
          debug('particles-js要素が見つかりました');
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
        } else {
          debug('particles-js要素が見つかりません');
        }
      } catch (e) {
        // エラー処理
        logError('particles.js初期化エラー', e);
      }
    } else {
      debug('particlesJSライブラリが見つかりません');
    }
  }
  
  // タイピングアニメーション初期化関数
  function initTypingAnimation() {
    var typingTextEl = document.getElementById('typingText');
    if (typingTextEl) {
      try {
        debug('タイピングアニメーション初期化');
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
            debug('タイピング実行: ' + charIndex + '/' + sloganTexts[typingIndex].length);
            if (!typingTextEl) {
              debug('typingTextElement が消失');
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
            logError('タイピング処理エラー', e);
          }
        }
        
        function erase() {
          try {
            debug('消去実行: ' + charIndex);
            if (!typingTextEl) {
              debug('typingTextElement が消失');
              return;
            }
            
            if (charIndex > 0) {
              typingTextEl.textContent = sloganTexts[typingIndex].substring(0, charIndex - 1);
              charIndex--;
              setTimeout(erase, erasingSpeed);
            } else {
              typingIndex = (typingIndex + 1) % sloganTexts.length;
              debug('次のスローガンへ: ' + typingIndex + ' - ' + sloganTexts[typingIndex]);
              setTimeout(type, 500);
            }
          } catch (e) {
            logError('消去処理エラー', e);
          }
        }
        
        // タイピングアニメーションの開始
        debug('タイピングアニメーション開始');
        setTimeout(type, 1200);
      } catch (error) {
        // エラーを記録するだけで続行
        logError('タイピングアニメーションエラー', error);
      }
    } else {
      debug('typingText要素が見つかりません');
    }
  }
  
  // 初期化処理のスケジュール設定
  function scheduleInitialization() {
    try {
      debug('初期化処理のスケジューリング開始');
      
      // アプリケーション初期化
      var initApp = function() {
        try {
          debug('initAppが呼び出されました');
          initializePage();
        } catch (e) {
          // エラーが発生しても続行
          logError('アプリケーション初期化エラー', e);
        }
      };
      
      // 既にロード済みの場合の処理
      if (document.readyState === 'complete') {
        debug('document.readyStateはcompleteです - 即時初期化');
        // setTimeout を使って非同期実行
        setTimeout(initApp, 0);
        return;
      }
      
      // DOM読み込み完了時と、ページ読み込み完了時の両方をハンドリング
      var loaded = false;
      var domReady = function() {
        if (loaded) return;
        debug('DOM読み込み完了イベント発火');
        loaded = true;
        initApp();
      };
      
      // ブラウザによっては DOMContentLoaded が発火しないことがあるので、
      // 複数のイベントをリッスン
      debug('DOMContentLoaded/loadイベントリスナーを設定');
      document.addEventListener('DOMContentLoaded', domReady, false);
      window.addEventListener('load', domReady, false);
      
      // fallback として setTimeout も使用
      debug('フォールバックタイマーを設定: 1500ms');
      setTimeout(function() {
        if (!loaded) {
          debug('フォールバックタイマーによる初期化');
          domReady();
        }
      }, 1500);
    } catch (error) {
      // 最終的なエラーハンドリング
      logError('スケジュール設定エラー', error);
      
      // 何があっても初期化を試みる
      try {
        debug('最終手段の初期化を実行');
        initializePage();
      } catch (e) {
        // もはや何もできない
        logError('最終手段の初期化も失敗', e);
      }
    }
  }
  
  // 初期化処理を開始
  debug('スクリプト実行開始 - 初期化をスケジュール');
  scheduleInitialization();
})();
