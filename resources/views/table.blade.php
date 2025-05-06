@extends('layouts.app')

@section('content')
<div class="flex flex-col items-center min-h-screen bg-[#111] py-8">
    
    <div id="groupsContainer" class="w-full max-w-4xl flex flex-col gap-12"></div>


    <div class="w-full max-w-4xl flex justify-start mt-6">
        <button
            id="addGroupBtn"
            class="flex items-center gap-1 text-white hover:text-[#ff4433] transition-colors text-base px-4 py-2 border border-[#222] rounded"
            type="button"
        >
            <span class="text-xl leading-none">+</span>
            <span>Add new group</span>
        </button>
    </div>
    <!-- Toast Container -->
    <div id="toast-container" class="fixed bottom-6 right-6 z-50 flex flex-col gap-3"></div>
    
</div>
@endsection

@push('scripts')
    @vite('resources/js/task-groups.js')
@endpush
