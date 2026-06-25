<?php
namespace App\Http\Controllers;
use App\Models\Board;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller {
    public function index(Board $board) {
        return $board->members;
    }

    public function store(Request $request, Board $board) {
        return $board->members()->create($request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
        ]));
    }

    public function show(Member $member) {
        return $member;
    }

    public function update(Request $request, Member $member) {
        $member->update($request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|email',
        ]));
        return $member;
    }

    public function destroy(Member $member) {
        $member->delete();
        return response()->noContent();
    }
}
