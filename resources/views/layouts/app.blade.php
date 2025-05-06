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
    <body class="font-sans antialiased bg-[#111] min-h-screen">
        <header class="flex justify-between border-b border-[#333]">
            <div class="flex items-center p-4">
                <span class="text-xl font-semibold">
                    <span class="text-[#ff4433]">Yousef.Task</span>
                    <span class="text-white"> - </span>
                    <span class="text-[#7c3aed] font-bold">Tuwaiq</span>
                    <span class="text-white"> Academy</span>
                </span>
            </div>
            <!-- logout -->
            <form method="POST" action="{{ route('logout') }}">
                @csrf

                <x-dropdown-link :href="route('logout')"
                        onclick="event.preventDefault();
                                    this.closest('form').submit();">
                    {{ __('Log Out') }}
                </x-dropdown-link>
            </form>
        </header>
            <main>
                {{ $slot }}
            </main>
            <script src="{{ asset('js/task-groups.js') }}"></script>
    </body>
</html>
