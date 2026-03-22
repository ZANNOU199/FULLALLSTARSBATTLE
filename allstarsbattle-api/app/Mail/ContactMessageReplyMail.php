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

    public function __construct(ContactMessage $contactMessage, string $replyMessage, ?string $replySubject = null)
    {
        $this->contactMessage = $contactMessage;
        $this->replyMessage = $replyMessage;
        $this->replySubject = $replySubject ?: 'Réponse de All Stars Battle International';
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
                    ]);
    }
}
