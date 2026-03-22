<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $subjectText }}</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;background-color:#f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f5f7fa;padding:30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.12);border:2px solid #d3a87a;">
                    <tr>
                        <td style="background:#111827;padding:20px 30px;text-align:center;">
                            <img src="https://yourdomain.com/logo.png" alt="All Stars Battle" width="140" style="display:block;margin:0 auto 10px;" />
                            <p style="margin:0;color:#f8e6c2;font-size:14px;letter-spacing:1px;text-transform:uppercase;">All Stars Battle International</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:linear-gradient(120deg,#d35f17 0%,#4f46e5 100%);padding:26px 30px;color:#fff;text-align:center;">
                            <h1 style="margin:0;font-size:24px;">{{ $subjectText }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 30px;">
                            <p style="margin:0 0 12px;color:#334155;font-size:16px;">Bonjour {{ $recipientName }},</p>
                            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:20px;">
                                <p style="margin:0;color:#334155;font-size:14px;white-space:pre-wrap;">{{ $bodyMessage }}</p>
                            </div>
                            <p style="margin:0;color:#334155;font-size:14px;">Cordialement,<br>L'équipe All Stars Battle International</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#111827;padding:20px 30px;color:#ffffff;text-align:center;font-size:12px;">
                            <p style="margin:0;">All Stars Battle International</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>