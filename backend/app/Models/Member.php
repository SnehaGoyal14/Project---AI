<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Member extends Model {
    protected $fillable = ['board_id', 'name', 'email'];

    public function board() {
        return $this->belongsTo(Board::class);
    }

    public function cards() {
        return $this->belongsToMany(Card::class);
    }
}
