<x-app-layout>
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
    <div hidden>
        <div class="group-section mb-8">
            <div class="flex items-center mb-6 gap-2">
                        <div class="flex items-center">
                            <span style="background:${group.color};" class="w-2 h-7 rounded-l"></span>
                            <input
                                id="renameGroupInput-${groupIdx}"
                                type="text"
                                value="${escapeHtml(group.renameCache)}"
                                class="bg-[#222] text-white rounded-r px-3 py-1.5 text-lg font-semibold focus:outline-none"
                                style="width: 220px"
                            />
                        </div>
                        <button id="saveRenameGroup-${groupIdx}"
                            class="flex items-center gap-1 px-4 py-1.5 rounded-md font-medium text-white"
                            style="background:${group.color};">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save</span>
                        </button>
                        <button id="cancelRenameGroup-${groupIdx}"
                            class="flex items-center gap-1 px-4 py-1.5 rounded-md font-medium text-white bg-[#333] hover:bg-[#444] transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel</span>
                        </button>
                
                        <h2 class="text-2xl font-semibold" style="color: ${group.color};">${escapeHtml(group.name)}</h2>
                        <button id="startRenameGroup-${groupIdx}" class="ml-2 text-gray-400 hover:text-[${group.color}] transition" title="Rename group">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" />
                            </svg>
                        </button>
                        <button id="deleteGroup-${groupIdx}" class="ml-1 text-red-400 hover:text-red-600 transition" title="Delete group">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    
                }
            </div>
            <div class="bg-[#181818] rounded-lg shadow-lg relative w-full">
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="w-[3px]" style="background:${group.color}"></th>
                            <th class="w-[35%] py-3 px-4 text-left font-semibold text-white">Task</th>
                            <th class="w-[25%] py-3 px-4 text-left font-semibold text-white">Owner</th>
                            <th class="w-[20%] py-3 px-4 text-left font-semibold text-white">Status</th>
                            <th class="w-[15%] py-3 px-4 text-left font-semibold text-white">Due date</th>
                            <th class="w-[5%] py-3 px-4 text-right font-semibold text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="taskTableBody-${groupIdx}" class="text-white">
                        ${renderTasks(group, groupIdx)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td class="w-[3px]"></td>
                            <td colspan="5" class="py-2 px-4">
                                <input
                                    id="newTaskInput-${groupIdx}"
                                    type="text"
                                    placeholder="+ add task"
                                    class="bg-transparent text-gray-400 w-full focus:outline-none placeholder-gray-600"
                                />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="flex justify-end mt-4">
                <button
                    id="saveAllBtn-${groupIdx}"
                    class="px-6 py-2 bg-[#ff4433] text-white text-sm rounded hover:bg-[#ff6655] transition-colors"
                    type="button"
                >
                    Save all
                </button>
            </div>
        </div>

       // Task Edit Row
        <tr class="border-b border-[#222]">
            <td class="w-[3px]">
                <input type="checkbox" class="ml-4 accent-[${group.color}]" disabled />
            </td>
            <td class="py-2 px-4">
                <input type="text" id="edit-task-${groupIdx}-${idx}" value="${escapeHtml(group.editCache.task)}"
                    class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none" />
            </td>
            <td class="py-2 px-4">
                <input type="text" id="edit-owner-${groupIdx}-${idx}" value="${escapeHtml(group.editCache.owner)}"
                    class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none" />
            </td>
            <td class="py-2 px-4">
                <select id="edit-status-${groupIdx}-${idx}" class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none">
                    <option value="Pending" ${group.editCache.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${group.editCache.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Done" ${group.editCache.status === 'Done' ? 'selected' : ''}>Done</option>
                    <option value="Working on it" ${group.editCache.status === 'Working on it' ? 'selected' : ''}>Working on it</option>
                    <option value="Stuck" ${group.editCache.status === 'Stuck' ? 'selected' : ''}>Stuck</option>
                    <option value="Not Started" ${group.editCache.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                </select>
            </td>
            <td class="py-2 px-4">
                <input type="date" id="edit-due-${groupIdx}-${idx}" value="${group.editCache.due}"
                    class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none" />
            </td>
            <td class="py-2 px-4 text-right">
                <div class="flex justify-end items-center gap-2">
                    <button
                        class="save-task-btn flex items-center gap-1 px-4 py-1.5 rounded-md font-medium text-white"
                        style="background:${group.color};"
                        data-group="${groupIdx}" data-task="${idx}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save</span>
                    </button>
                    <button
                        class="cancel-task-btn flex items-center gap-1 px-4 py-1.5 rounded-md font-medium text-white bg-[#333] hover:bg-[#444] transition-colors"
                        data-group="${groupIdx}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancel</span>
                    </button>
                </div>
            </td>
        </tr>

        // Task Row
        <tr class="border-b border-[#222] group">
            <td class="w-[3px]">
                <input type="checkbox" class="ml-4 accent-[${group.color}]" />
            </td>
            <td class="py-2 px-4">${escapeHtml(t.task)}</td>
            <td class="py-2 px-4">${escapeHtml(t.owner)}</td>
            <td class="py-2 px-4 relative">
                <button
                    class="status-btn px-3 py-1 rounded font-semibold w-full text-left transition ${statusClass}"
                    data-group="${groupIdx}" data-task="${idx}"
                >
                    ${escapeHtml(t.status)}
                </button>
                <div class="status-menu absolute left-0 top-10 z-50 hidden w-40">
                    <button class="block w-full text-left px-4 py-2 rounded-t bg-green-400 text-white font-semibold hover:bg-green-500" data-status="Done">Done</button>
                    <button class="block w-full text-left px-4 py-2 bg-yellow-300 text-gray-800 font-semibold hover:bg-yellow-400" data-status="Working on it">Working on it</button>
                    <button class="block w-full text-left px-4 py-2 bg-red-400 text-white font-semibold hover:bg-red-500" data-status="Stuck">Stuck</button>
                    <button class="block w-full text-left px-4 py-2 rounded-b bg-gray-400 text-white font-semibold hover:bg-gray-500" data-status="Not Started">Not Started</button>
                </div>
            </td>
            <td class="py-2 px-4">${escapeHtml(t.due)}</td>
            <td class="py-2 px-4 text-right">
                <div class="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        class="edit-task-btn w-7 h-7 flex items-center justify-center rounded border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                        data-group="${groupIdx}" data-task="${idx}" title="Edit task">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" />
                        </svg>
                    </button>
                    <button
                        class="delete-task-btn w-7 h-7 flex items-center justify-center rounded border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                        data-group="${groupIdx}" data-task="${idx}" title="Delete task">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>

    </div>
        <script>
            const groupsData = {!! json_encode($groups) !!};

            let users = {!! json_encode($users) !!};
        </script>
</x-app-layout>

