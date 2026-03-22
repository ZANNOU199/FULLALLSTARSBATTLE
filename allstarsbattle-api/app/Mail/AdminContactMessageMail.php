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

    public function __construct(string $subjectText, string $bodyMessage, ?string $recipientName = null)
    {
        $this->subjectText = $subjectText;
        $this->bodyMessage = $bodyMessage;
        $this->recipientName = $recipientName ?: 'Cher(ère) utilisateur';
    }

    public function build()
    {
        return $this->subject($this->subjectText)
                    ->view('emails.admin_contact_message')
                    ->with([
                        'recipientName' => $this->recipientName,
                        'bodyMessage' => $this->bodyMessage,
                        'subjectText' => $this->subjectText,
                    ]);
    }
}
