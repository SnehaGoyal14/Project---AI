<?php
namespace App\Http\Controllers;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\Tag;
use App\Models\Member;
use Illuminate\Http\Request;

class CardController extends Controller {
    public function index(BoardList $list) {
        return $list->cards()->with('tags', 'members', 'comments')->get();
    }

    public function store(Request $request, BoardList $list) {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);
        $data['position'] = $list->cards()->count();
        return $list->cards()->create($data);
    }

    public function show(Card $card) {
        return $card->load('tags', 'members', 'comments');
    }

    public function update(Request $request, Card $card) {
        $card->update($request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'position' => 'sometimes|integer',
        ]));
        return $card->load('tags', 'members');
    }

    public function destroy(Card $card) {
        $card->delete();
        return response()->noContent();
    }

    public function move(Request $request, Card $card) {
        $data = $request->validate([
            'list_id' => 'required|exists:lists,id',
            'position' => 'required|integer',
        ]);
        $card->update($data);
        return $card->load('tags', 'members');
    }

    public function attachTag(Card $card, Tag $tag) {
        $card->tags()->syncWithoutDetaching([$tag->id]);
        return $card->load('tags');
    }

    public function detachTag(Card $card, Tag $tag) {
        $card->tags()->detach($tag->id);
        return $card->load('tags');
    }

    public function assignMember(Card $card, Member $member) {
        $card->members()->syncWithoutDetaching([$member->id]);
        return $card->load('members');
    }

    public function unassignMember(Card $card, Member $member) {
        $card->members()->detach($member->id);
        return $card->load('members');
    }
}
