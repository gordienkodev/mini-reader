<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

Route::get('/books/{book}', [BookController::class, 'show']);

Route::post('/books/{book}/comments', [CommentController::class, 'store']);

Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);