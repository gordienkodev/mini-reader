<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    public function show(Book $book): JsonResponse
    {
        $book->load('comments.user');

        return response()->json($book);
    }
}