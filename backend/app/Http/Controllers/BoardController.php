<?php
namespace App\Http\Controllers;
use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller {
    public function index() {
        return Board::with('lists.cards')->get();
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        return Board::create($data);
    }

    public function show(Board $board) {
        return $board->load('lists.cards.tags', 'lists.cards.members', 'members');
    }

    public function update(Request $request, Board $board) {
        $board->update($request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]));
        return $board;
    }

    public function destroy(Board $board) {
        $board->delete();
        return response()->noContent();
    }
}
