<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessageReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactMessage;
    public $replySubject;
    public $replyMessage;
    public $logoUrl;
    public $siteUrl;

    public function __construct(ContactMessage $contactMessage, string $replyMessage, ?string $replySubject = null, ?string $logoUrl = null)
    {
        $this->contactMessage = $contactMessage;
        $this->replyMessage = $replyMessage;
        $this->replySubject = $replySubject ?: 'Réponse de All Star Battle International';
        $this->logoUrl = $logoUrl ?? 'https://pub-e66e8acef13f47bf90ce3de0d7240052.r2.dev/site-assets/logo.png';
        $this->siteUrl = 'https://all-stars-battle-six.vercel.app';
    }

    public function build()
    {
        return $this->subject($this->replySubject)
                    ->view('emails.contact_message_reply')
                    ->with([
                        'name' => $this->contactMessage->name,
                        'originalSubject' => $this->contactMessage->subject ?: 'Aucun sujet',
                        'messageBody' => $this->contactMessage->message,
                        'replyMessage' => $this->replyMessage,
                        'logoUrl' => $this->logoUrl,
                        'siteUrl' => $this->siteUrl,
                    ]);
    }
}
