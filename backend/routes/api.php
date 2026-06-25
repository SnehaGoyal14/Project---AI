<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardListController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\CommentController;

Route::apiResource('boards', BoardController::class);
Route::apiResource('boards.lists', BoardListController::class)->shallow();
Route::apiResource('lists.cards', CardController::class)->shallow();
Route::apiResource('cards.comments', CommentController::class)->shallow();
Route::apiResource('tags', TagController::class);
Route::apiResource('boards.members', MemberController::class)->shallow();

// card actions
Route::post('cards/{card}/move', [CardController::class, 'move']);
Route::post('cards/{card}/tags/{tag}', [CardController::class, 'attachTag']);
Route::delete('cards/{card}/tags/{tag}', [CardController::class, 'detachTag']);
Route::post('cards/{card}/members/{member}', [CardController::class, 'assignMember']);
Route::delete('cards/{card}/members/{member}', [CardController::class, 'unassignMember']);
