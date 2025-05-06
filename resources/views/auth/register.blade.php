<x-guest-layout>
    <main class="flex flex-1 items-center justify-center">
            <div class="bg-[#181818] rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center border border-[#222]">
                <form method="POST" action="{{ route('register') }}" class="w-full flex flex-col gap-4">
                    @csrf
            
                    <!-- Name -->
                    {{-- <div>
                        <x-input-label for="name" :value="__('Name')" />
                        <x-text-input id="name" class="block mt-1 w-full" type="text" name="name" :value="old('name')" required autofocus autocomplete="name" />
                        <x-input-error :messages="$errors->get('name')" class="mt-2" />
                    </div> --}}
                    <label
                        class="text-sm text-gray-200 mb-1">
                        <div>
                            Name
                        </div>
                        <input
                            id="email"
                            name="name"
                            type="text"
                            value="{{ old('name') }}" required autofocus autocomplete="name"
                            class="w-full px-3 py-2 rounded-md bg-[#111] border border-[#333] text-gray-100 "
                        >
                        <div>
                            @error('name')
                                <span class="text-red-500 text-xs mt-1">{{ $name }}</span>
                            @enderror
                        </div>
                    </label>
            
                    <!-- Email Address -->
                    {{-- <div class="mt-4">
                        <x-input-label for="email" :value="__('Email')" />
                        <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autocomplete="username" />
                        <x-input-error :messages="$errors->get('email')" class="mt-2" />
                    </div> --}}
                    <label
                        class="text-sm text-gray-200 mb-1">
                        <div>
                            Email
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
                    {{-- <div class="mt-4">
                        <x-input-label for="password" :value="__('Password')" />
            
                        <x-text-input id="password" class="block mt-1 w-full"
                                        type="password"
                                        name="password"
                                        required autocomplete="new-password" />
            
                        <x-input-error :messages="$errors->get('password')" class="mt-2" />
                    </div> --}}
                    <label
                        class="text-sm text-gray-200 mb-1">
                        <div>
                            password
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value="{{ old('password') }}" required autofocus autocomplete="new-password"
                            class="w-full px-3 py-2 rounded-md bg-[#111] border border-[#333] text-gray-100 "
                        >
                        <div>
                            @error('password')
                                <span class="text-red-500 text-xs mt-1">{{ $message }}</span>
                            @enderror
                        </div>
                    </label>
            
                    <!-- Confirm Password -->
                    {{-- <div class="mt-4">
                        <x-input-label for="password_confirmation" :value="__('Confirm Password')" />
            
                        <x-text-input id="password_confirmation" class="block mt-1 w-full"
                                        type="password"
                                        name="password_confirmation" required autocomplete="new-password" />
            
                        <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
                    </div> --}}
                    <label
                        class="text-sm text-gray-200 mb-1">
                        <div>
                            Confirm Password
                        </div>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value="{{ old('password_confirmation') }}" required autofocus autocomplete="new-password"
                            class="w-full px-3 py-2 rounded-md bg-[#111] border border-[#333] text-gray-100 "
                        >
                        <div>
                            @error('password_confirmation')
                                <span class="text-red-500 text-xs mt-1">{{ $message }}</span>
                            @enderror
                        </div>
                    </label>

                   
                    <div class="flex items-center justify-end gap-4 mt-4">
                        <a class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800" href="{{ route('login') }}">
                            {{ __('Already registered?') }}
                        </a>
            
                        {{-- <x-primary-button class="ms-4">
                            {{ __('Register') }}
                        </x-primary-button> --}}
                        <!-- Register Button -->
                        <button
                            type="submit"
                            class="inline-flex items-center px-4 py-2  bg-[#ff4433] hover:bg-[#ff2a1a] text-white font-semibold  rounded-md transition"
                            >
                            {{ __('Register') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</x-guest-layout>
