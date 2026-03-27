<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public $recipientName;
    public $subjectText;
    public $bodyMessage;
    public $logoUrl;
    public $siteUrl;

    public function __construct(string $subjectText, string $bodyMessage, ?string $recipientName = null, ?string $logoUrl = null)
    {
        $this->subjectText = $subjectText;
        $this->bodyMessage = $bodyMessage;
        $this->recipientName = $recipientName ?: 'Cher(e) utilisateur';
        $this->logoUrl = $logoUrl ?? 'https://pub-e66e8acef13f47bf90ce3de0d7240052.r2.dev/site-assets/logo.png';
        $this->siteUrl = 'https://all-stars-battle-six.vercel.app';
    }

    public function build()
    {
        return $this->subject($this->subjectText)
                    ->view('emails.admin_contact_message')
                    ->with([
                        'recipientName' => $this->recipientName,
                        'bodyMessage' => $this->bodyMessage,
                        'subjectText' => $this->subjectText,
                        'logoUrl' => $this->logoUrl,
                        'siteUrl' => $this->siteUrl,
                    ]);
    }
}
