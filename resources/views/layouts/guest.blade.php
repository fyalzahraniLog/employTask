<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>

    <body class="bg-[#111] min-h-screen flex flex-col">
        <header class="flex justify-between items-center p-6">
            <span class="text-2xl font-semibold text-[#ff4433]">Employ.Task</span>
            <div class="bg-white rounded-lg shadow p-2 flex items-center" style="max-width: 220px;">
                <img src="{{ asset('images/tuwaiq.png') }}"
                     alt="Tuwaiq Academy"
                     class="h-10 max-w-[180px] object-contain"
                >
            </div>
        </header>
        <!-- Centered Login Card -->
        {{ $slot }}
        <footer class="w-full text-center py-4 mt-8">
            <span class="text-[#ff4433] text-sm font-medium">
                Copyright © 2025 Employ.Task
            </span>
        </footer>
    </body> 
</html>
