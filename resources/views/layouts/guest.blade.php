<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>

    {{-- <body class="font-sans text-gray-900 antialiased">
        <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
            <div>
                <a href="/">
                    <x-application-logo class="w-20 h-20 fill-current text-gray-500" />
                </a>
            </div>

            <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {{ $slot }}
            </div>
        </div>
    </body> --}}
    <body class="bg-[#111] min-h-screen flex flex-col">
        <!-- Header -->
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
