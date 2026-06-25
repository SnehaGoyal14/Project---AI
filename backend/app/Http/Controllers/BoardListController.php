<?php
namespace App\Http\Controllers;
use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\Request;

class BoardListController extends Controller {
    public function index(Board $board) {
        return $board->lists()->with('cards')->get();
    }

    public function store(Request $request, Board $board) {
        $data = $request->validate(['name' => 'required|string|max:255']);
        $data['position'] = $board->lists()->count();
        return $board->lists()->create($data);
    }

    public function show(BoardList $list) {
        return $list->load('cards');
    }

    public function update(Request $request, BoardList $list) {
        $list->update($request->validate([
            'name' => 'sometimes|required|string',
            'position' => 'sometimes|integer',
        ]));
        return $list;
    }

    public function destroy(BoardList $list) {
        $list->delete();
        return response()->noContent();
    }
}
