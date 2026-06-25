<?php
namespace App\Http\Controllers;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller {
    public function index() {
        return Tag::all();
    }

    public function store(Request $request) {
        return Tag::create($request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',
        ]));
    }

    public function show(Tag $tag) {
        return $tag;
    }

    public function update(Request $request, Tag $tag) {
        $tag->update($request->validate([
            'name' => 'sometimes|required|string',
            'color' => 'nullable|string',
        ]));
        return $tag;
    }

    public function destroy(Tag $tag) {
        $tag->delete();
        return response()->noContent();
    }
}
