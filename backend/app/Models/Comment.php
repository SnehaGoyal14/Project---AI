<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model {
    protected $fillable = ['card_id', 'author', 'body'];

    public function card() {
        return $this->belongsTo(Card::class);
    }
}
