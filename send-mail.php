<?php
/**
 * Composer & Dotenv を使って、.env にあるSlack URLを読み込み
 * メール送信部分はコメントアウトして温存
 */

// -- Composer & Dotenvの読み込み --
//require __DIR__ . '/vendor/autoload.php';
//use Dotenv\Dotenv;

// .env を読み込む設定
//$dotenv = Dotenv::createImmutable(__DIR__);
//$dotenv->load();

// .env に書いた Slack Webhook URL を取得
$slackWebhookUrl = getenv('SLACK_WEBHOOK_URL');

// 1. POSTデータを受け取る
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = isset($_POST['name'])     ? trim($_POST['name'])     : '';
    $email    = isset($_POST['email'])    ? trim($_POST['email'])    : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';
    $message  = isset($_POST['message'])  ? trim($_POST['message'])  : '';

    // バリデーション - 必須項目チェック
    $errors = [];
    if (empty($name)) {
        $errors[] = 'お名前が入力されていません。';
    }
    if (empty($email)) {
        $errors[] = 'メールアドレスが入力されていません。';
    }
    if (empty($category)) {
        $errors[] = 'ご希望のサービスが選択されていません。';
    }
    if (empty($message)) {
        $errors[] = 'お問い合わせ内容が入力されていません。';
    }

    // エラーがある場合は処理を中止
    if (!empty($errors)) {
        echo "
        <html lang='ja'>
        <head>
          <meta charset='UTF-8'>
          <title>入力エラー</title>
          <style>
            body { font-family: sans-serif; margin: 20px; }
            .error-msg { border: 1px solid #ccc; padding: 1rem; margin: 1rem 0; background: #fff3f3; }
            .back-btn { margin-top:1rem; padding:0.5rem 1rem; background:#203A43; color:#fff; border-radius:4px; cursor:pointer; }
          </style>
        </head>
        <body>
          <div class='error-msg'>
            <h2>入力エラー</h2>
            <p>以下の項目を確認してください：</p>
            <ul>
        ";
        
        foreach ($errors as $error) {
            echo "<li>{$error}</li>";
        }
        
        echo "
            </ul>
            <button class='back-btn' onclick='history.back()'>前のページに戻る</button>
          </div>
        </body>
        </html>
        ";
        exit; // 処理を終了
    }

    /***************************************
     * メール送信用のコードはコメントアウト
     ***************************************/
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

    // 送信元などのヘッダ
    $headers  = "From: no-reply@one-will.net\n"
              . "Reply-To: {$email}\n";

    mb_language('ja');
    mb_internal_encoding('UTF-8');
    $subject  = mb_encode_mimeheader($subject, 'UTF-8');
    $isSent   = mb_send_mail($to, $subject, $body, $headers);
    */

    // -- 今はSlack通知だけ行う → メール送信結果を無視して $isSent = true;
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

        // JSONにエンコード
        $payloadJson = json_encode($slackMessage);

        // cURLでPOST
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
            // = Slack送信失敗時 =
            // コピー用テキスト
            $copyText = "以下をコピーして sales@one-will.net 宛にメールをお願いします。\n\n"
                      . "=== お問い合わせ内容 ===\n"
                      . "お名前: {$name}\n"
                      . "メール: {$email}\n"
                      . "サービス・形態: {$category}\n"
                      . "内容:\n{$message}\n";

            echo "
            <html lang='ja'>
            <head>
              <meta charset='UTF-8'>
              <title>送信失敗</title>
              <style>
                body { font-family: sans-serif; margin: 20px; }
                .fail-msg { border: 1px solid #ccc; padding: 1rem; margin: 1rem 0; background: #fff3f3; }
                .copy-btn { margin-top:1rem; padding:0.5rem 1rem; background:#203A43; color:#fff; border-radius:4px; cursor:pointer; }
                textarea { width:100%; height:150px; }
              </style>
            </head>
            <body>
              <div class='fail-msg'>
                <h2>送信に失敗しました</h2>
                <p>お手数をおかけしますが、以下の内容をコピーしてメールでお送りください。</p>
                <p>宛先: <a href='mailto:sales@one-will.net'>sales@one-will.net</a></p>
                <textarea id='copyText' readonly>{$copyText}</textarea><br>
                <button class='copy-btn' onclick='copyToClipboard()'>内容をコピー</button>
              </div>
              <script>
                function copyToClipboard() {
                  const textArea = document.getElementById('copyText');
                  textArea.select();
                  document.execCommand('copy');
                  alert('入力内容をコピーしました。メールに貼り付けてください。');
                }
              </script>
            </body>
            </html>
            ";
        } else {
            // = Slack送信成功時 =
            // ここを「トップページへリダイレクト」に変更
            header("Location: index.html");
            exit;  // 処理を終了させる
        }
    } else {
        // (メール送信がfalseならここに来るが、今は常にtrue扱い)
        echo '送信に失敗しました。<br>大変お手数ですが、sales@one-will.net までメールをお願いします。';
    }
} else {
    // POSTでない (直接URLアクセス等)
    echo '直接アクセスは許可されていません。';
}
?>
