<?php
namespace App\Http\Controllers;
use App\Models\Card;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller {
    public function index(Card $card) {
        return $card->comments;
    }

    public function store(Request $request, Card $card) {
        return $card->comments()->create($request->validate([
            'author' => 'required|string|max:255',
            'body' => 'required|string',
        ]));
    }

    public function show(Comment $comment) {
        return $comment;
    }

    public function update(Request $request, Comment $comment) {
        $comment->update($request->validate(['body' => 'required|string']));
        return $comment;
    }

    public function destroy(Comment $comment) {
        $comment->delete();
        return response()->noContent();
    }
}
