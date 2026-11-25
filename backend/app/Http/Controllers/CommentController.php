<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CommentController extends Controller
{
    public function store(Request $request, Book $book): JsonResponse
    {
        $data = $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        $user = User::where('email', 'reader@example.com')
            ->firstOrFail();

        $comment = $book->comments()->create([
            'user_id' => $user->id,
            'text' => $data['text'],
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function destroy(Comment $comment): Response
    {
        $comment->delete();

        return response()->noContent();
    }
}