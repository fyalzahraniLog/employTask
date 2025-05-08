
<x-guest-layout>
    <!-- Centered Login Card -->
    <main class="flex flex-1 items-center justify-center">
        <div class="bg-[#181818] rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center border border-[#222]">
            <h1 class="text-2xl font-semibold text-[#ff4433] mb-1">Employ.Task</h1>
            <p class="text-xs text-gray-300 mb-6">Get started now.</p>
            <!-- Session Status -->
            <form method="POST" action="{{ route('login') }}" class="w-full flex flex-col gap-4">
                @csrf
                <!-- Email Address -->
                <label
                        class="text-sm text-gray-200 mb-1">
                        <div>
                            Emile
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value="{{ old('email') }}" required autofocus autocomplete="username"
                            class="w-full px-3 py-2 rounded-md bg-[#111] border border-[#333] text-gray-100 "
                        >
                        <div>
                            @error('email')
                                <span class="text-red-500 text-xs mt-1">{{ $message }}</span>
                            @enderror
                        </div>
                </label>
                 <!-- Password -->
                <label
                    class="text-sm text-gray-200 mb-1">
                    <div>
                        password
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required autocomplete="current-password"
                
                        class="w-full px-3 py-2 rounded-md bg-[#111] border border-[#333] text-gray-100 "
                    >
                    <div>
                        @error('password')
                            <span class="text-red-500 text-xs mt-1">{{ $message }}</span>
                        @enderror
                    </div>
                </label>
                
                <!-- Login Button -->
                <div class="flex mt-4 flex-col gap-4">
                    <button
                    type="submit"
                    class="w-full  bg-[#ff4433] hover:bg-[#ff2a1a] text-white font-semibold py-2 rounded-md transition"
                    >
                    {{ __('Log in') }}
                </button>
                <!-- Remember Me -->
                <label for="remember_me" class="inline-flex items-center">
                    <input id="remember_me" type="checkbox" class="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800" name="remember">
                    <span class="ms-2 text-sm text-gray-600 dark:text-gray-400">{{ __('Remember me') }}</span>
                </label>
                </div>
                
                <!-- Register -->
                <div class="flex  gap-4 mt-4">               
                    <span class="text-sm text-gray-200">Don't have an account?
                    <a href="{{ route('register') }}" class="text-[#ff4433] hover:underline">Register</a>
                    </span>
                </div>
            </form>
             <!-- Text -->
            <div class="mt-8 text-center text-xs text-gray-400">
                Made by
                <a href="https://github.com/FerasAlzahrani" class="text-[#ff4433] hover:underline">Feras Alzahrani</a>
                &amp;
                <a href="https://tuwaiq.edu.sa" class="text-[#ff4433] hover:underline">Tuwaiq Academy</a>
            </div>
        </div>
    </main>
</x-guest-layout>

