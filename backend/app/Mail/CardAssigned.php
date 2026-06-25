<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CardAssigned extends Mailable {
    use Queueable, SerializesModels;

    public function __construct(
        public string $cardTitle,
        public string $memberName,
        public string $memberEmail
    ) {}

    public function envelope(): Envelope {
        return new Envelope(subject: 'You have been assigned to a card');
    }

    public function content(): Content {
        return new Content(view: 'emails.card-assigned');
    }
}
