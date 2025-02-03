<?php
require __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
$slackWebhookUrl = getenv('SLACK_WEBHOOK_URL');
// 1. POSTデータを受け取る
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = isset($_POST['name'])     ? trim($_POST['name'])     : '';
    $email    = isset($_POST['email'])    ? trim($_POST['email'])    : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';
    $message  = isset($_POST['message'])  ? trim($_POST['message'])  : '';

    // -- 以下、メール送信の処理をコメントアウト --
    /*
    // 2. メール送信用の情報を整形する
    $to       = 'sales@one-will.net'; // 実際の受信用メールアドレス
    $subject  = 'お問い合わせがありました'; // 件名

    // メール本文
    $body = "以下の内容でお問い合わせがありました。\n\n"
          . "【お名前】\n{$name}\n\n"
          . "【メールアドレス】\n{$email}\n\n"
          . "【ご希望のサービス・形態】\n{$category}\n\n"
          . "【お問い合わせ内容】\n{$message}\n\n";

    // 送信元などのヘッダ（送信元アドレスを適切に設定）
    $headers  = "From: no-reply@one-will.net\n"
              . "Reply-To: {$email}\n";

    // 3. メール送信実行
    mb_language('ja');
    mb_internal_encoding('UTF-8');
    $subject  = mb_encode_mimeheader($subject, 'UTF-8');
    $isSent   = mb_send_mail($to, $subject, $body, $headers);
    */

    // -- ここではメール送信をスキップしてSlack通知だけ行う --
    // 強制的に $isSent = true にしておく
    $isSent = true;

    // 4. Slack への通知
    if ($isSent) {
        // Slackに送るメッセージ
        $slackMessage = [
            'text' => "新しいお問い合わせを受信しました。\n\n"
                    . "*お名前:* {$name}\n"
                    . "*メール:* {$email}\n"
                    . "*サービス・形態:* {$category}\n"
                    . "*内容:* {$message}"
        ];

        // JSON形式にエンコード
        $payloadJson = json_encode($slackMessage);

        // cURLでPOSTリクエストを送信
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $slackWebhookUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payloadJson);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $slackResponse = curl_exec($ch);
        $slackErr      = curl_error($ch);
        curl_close($ch);

        if ($slackErr) {
            // --- Slack送信失敗時 ---

            // コピー用にまとめる
            // （メール本文として流用できるよう、文字列として整形）
            $copyText = "以下をコピーし、sales@one-will.net 宛てにメールをお願いします。\n\n"
                      . "=== お問い合わせ内容 ===\n"
                      . "お名前: {$name}\n"
                      . "メールアドレス: {$email}\n"
                      . "ご希望のサービス・形態: {$category}\n"
                      . "お問い合わせ内容:\n{$message}\n";

            echo "
            <html lang='ja'>
            <head>
              <meta charset='UTF-8'>
              <title>送信失敗</title>
              <style>
                body {
                  font-family: sans-serif;
                  margin: 20px;
                }
                .fail-msg {
                  border: 1px solid #ccc;
                  padding: 1rem;
                  margin: 1rem 0;
                  background: #fff3f3;
                }
                .copy-btn {
                  display: inline-block;
                  margin-top: 1rem;
                  padding: 0.5rem 1rem;
                  background: #203A43;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 4px;
                  cursor: pointer;
                }
                textarea {
                  width: 100%;
                  height: 150px;
                }
              </style>
            </head>
            <body>
              <div class='fail-msg'>
                <h2>送信に失敗しました</h2>
                <p>お手数をおかけしますが、<strong>以下の内容をメールで</strong>再送いただけますでしょうか。</p>
                <p>宛先：<a href='mailto:sales@one-will.net'>sales@one-will.net</a></p>
                
                <!-- コピー用のテキストエリア -->
                <textarea id='copyText' readonly>{$copyText}</textarea>
                <br>
                <!-- ワンクリックでコピーさせるボタン -->
                <button class='copy-btn' onclick='copyToClipboard()'>内容をコピー</button>

                <script>
                  function copyToClipboard() {
                    const textArea = document.getElementById('copyText');
                    textArea.select();
                    document.execCommand('copy');
                    alert('入力内容をコピーしました。メールに貼り付けてください。');
                  }
                </script>

              </div>
            </body>
            </html>
            ";
        } else {
            // --- Slack送信成功時 ---
            echo "
            <html lang='ja'>
            <head>
              <meta charset='UTF-8'>
              <title>送信完了</title>
              <style>
                body {
                  font-family: sans-serif;
                  margin: 20px;
                }
                .success-msg {
                  border: 1px solid #ccc;
                  padding: 1rem;
                  margin: 1rem 0;
                  background: #f0f9ff;
                }
                .btn-top {
                  display: inline-block;
                  margin-top: 1rem;
                  padding: 0.5rem 1rem;
                  background: #203A43;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 4px;
                }
              </style>
            </head>
            <body>
              <div class='success-msg'>
                <h2>お問い合わせを受け付けました</h2>
                <p>ありがとうございます。ページトップへ移動します。</p>
                <a href='#' class='btn-top'>トップへ</a>
              </div>
              <script>
                window.onload = function() {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              </script>
            </body>
            </html>
            ";
        }
    } else {
        // (今回 $isSent = true なのでここには来ないが)
        echo '送信に失敗しました。<br>大変お手数ですが、sales@one-will.net までメールをお願いします。';
    }
} else {
    echo '直接アクセスは許可されていません。';
}
?>