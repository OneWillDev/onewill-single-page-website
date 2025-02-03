<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';      
    $mail->SMTPAuth   = true;
    $mail->Username   = 'sales@one-will.net';      
    //===============================
    //ここの入力が必要
    $mail->Password   = 'Gmailのアプリパスワード'; // アプリパスワード　
    //===============================
    $mail->SMTPSecure = 'tls';                  // SSLの場合は 'ssl'
    $mail->Port       = 587;                    // SSLの場合は465

    $mail->setFrom('info@one-will.net', 'ONE WILL');  
    $mail->addAddress('sales@one-will.net', 'Sales Team'); 

    $mail->Subject = 'テストメール';
    $mail->isHTML(true);
    $mail->Body    = '<h1>メールテスト</h1><p>PHPMailer + Gmail SMTP での送信テストです。</p>';

    $mail->send();
    echo 'メールが送信されました！';

} catch (Exception $e) {
    echo "送信エラー: " . $mail->ErrorInfo;
}
