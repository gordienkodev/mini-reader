<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreCommentRequest;
use Illuminate\Http\Response;

class CommentController extends Controller
{
    public function store(
    StoreCommentRequest $request,
    Book $book
    ): JsonResponse {
        $data = $request->validated();

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