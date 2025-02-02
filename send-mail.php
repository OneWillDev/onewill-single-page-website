<?php
// 1. POSTデータを受け取る
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = isset($_POST['name'])     ? trim($_POST['name'])     : '';
    $email    = isset($_POST['email'])    ? trim($_POST['email'])    : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';
    $message  = isset($_POST['message'])  ? trim($_POST['message'])  : '';

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

    // 4. Slack への通知 (メールが送信成功したら実行)
    if ($isSent) {
        // SlackのIncoming Webhook URLを設定（必ず自分のURLに置き換えてください）
        $slackWebhookUrl = 'https://hooks.slack.com/services/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';

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

        // Slack送信結果をログに残すなどしたい場合はここで処理
        // 例: error_log($slackResponse);

        // メール＆Slack成功時は thankyou.html に移動
        header('Location: thankyou.html');
        exit;
    } else {
        // メール送信に失敗した場合
        echo 'メール送信に失敗しました。しばらくしてから再度お試しください。';
    }
} else {
    // POSTでアクセスされていない場合
    echo '直接アクセスは許可されていません。';
}
?>