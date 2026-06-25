<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Card extends Model {
    protected $fillable = ['list_id', 'title', 'description', 'position', 'due_date'];

    protected $casts = ['due_date' => 'date'];

    public function list() {
        return $this->belongsTo(BoardList::class, 'list_id');
    }

    public function tags() {
        return $this->belongsToMany(Tag::class);
    }

    public function members() {
        return $this->belongsToMany(Member::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class)->orderBy('created_at', 'desc');
    }

    public function isOverdue() {
        return $this->due_date && $this->due_date->isPast();
    }
}
