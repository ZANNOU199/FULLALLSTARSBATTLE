<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Réponse All Star Battle</title>
</head>
<body style="margin:0;padding:0;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#F5F7FA;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F5F7FA; padding:30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 18px 40px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(120deg, #1f2937 0%, #4f46e5 100%); padding:26px 30px; text-align:center;">
                            <!-- Logo -->
                            <a href="{{ $siteUrl }}" style="display:inline-block; margin-bottom:12px; text-decoration:none;">
                                <img src="{{ $logoUrl }}" alt="All Star Battle" style="max-width:160px; height:auto; display:block; border-radius:8px;" />
                            </a>
                            <h1 style="margin:8px 0 0; font-size:24px; letter-spacing:0.02em; color:#fff;">Réponse à votre demande</h1>
                            <p style="margin:8px 0 0; font-size:14px; color:rgba(255,255,255,0.86);">All Star Battle International</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 30px;">
                            <p style="margin:0 0 10px; color:#334155; font-size:16px;">Bonjour <strong>{{ $name }}</strong>,</p>
                            <p style="margin:0 0 18px; color:#475569; font-size:15px;">Merci d'avoir contacté notre équipe. Nous avons bien reçu votre message et voici notre réponse :</p>

                            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; margin-bottom:20px;">
                                <p style="margin:0 0 8px; font-size:14px; font-weight:600; color:#0f172a;">Votre message original</p>
                                <p style="margin:0; color:#334155; font-size:14px; white-space:pre-wrap;">{{ $messageBody }}</p>
                            </div>

                            <div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:10px; padding:14px; margin-bottom:20px;">
                                <p style="margin:0 0 8px; font-size:14px; font-weight:600; color:#92400e;">Notre réponse</p>
                                <p style="margin:0; color:#92400e; font-size:14px; white-space:pre-wrap;">{{ $replyMessage }}</p>
                            </div>

                            <p style="margin:0 0 12px; color:#334155; font-size:14px;">Sujet original : <strong>{{ $originalSubject }}</strong></p>

                            <p style="margin:0; color:#334155; font-size:14px;">Si vous avez besoin de plus d'informations, n'hésitez pas à répondre à ce message. Nous sommes à votre disposition.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#111827; padding:20px 30px; color:#ffffff; text-align:center; font-size:12px;">
                            <p style="margin:0;">All Star Battle International - Performance, Création et Compétition</p>
                            <p style="margin:5px 0 0;">© {{ date('Y') }} All Star Battle International. Tous droits réservés.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
