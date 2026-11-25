<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        Book::firstOrCreate(
            ['title' => 'Crime and Punishment'],
            [
                'author' => 'Fyodor Dostoevsky',
                'content' => 'Example book content.',
            ]
        );
    }
}