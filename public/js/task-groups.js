// const { start } = require("alpinejs");

// Color palette for groups
const groupColors = [
    "#00ff00", "#ff4433", "#7c3aed", "#00e0ff", "#ffb300",
    "#ff00c8", "#ffd600", "#00ffb3", "#ff6f00", "#00bfae"
];

let groups = [

    {
        id: 1,
        name: "New Group",
        color: groupColors[0],
        tasks: [],
        editingIdx: null,
        editCache: {},
        renaming: false,
        renameCache: ""

    }
];

function setGroupData(data) {
    groups = data.map((group, idx) => ({
        id: group.id,
        name: group.name,
        color: groupColors[idx % groupColors.length],
        tasks: group.tasks.map(task => ({
            id: task.id,
            task: task.title,
            owner: task.assigned_to,
            status: task.status,
            start: task.start,
            end: task.end,
        })),
        editingIdx: null,
        editCache: {},
        renaming: false,
        renameCache: ""
    }));
    console.log(groups);
    renderGroups();
}
function renderGroups() {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = '';
    groups.forEach((group, groupIdx) => {
        container.innerHTML += `
            <div class="group-section mb-8">
                <div class="flex items-center mb-6 gap-2">
                    ${
                        group.renaming
                        ? `
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
                        `
                        : `
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
                        `
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
                                <th class="w-[15%] py-3 px-4 text-left font-semibold text-white">Start date</th>
                                <th class="w-[15%] py-3 px-4 text-left font-semibold text-white">End date</th>
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
        `;
        // Close all status menus
        function closeAllStatusMenus() {
            document.querySelectorAll('.status-menu').forEach(menu => menu.classList.add('hidden'));
        }

        // Open status menu on button click
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                closeAllStatusMenus();
                const menu = btn.parentElement.querySelector('.status-menu');
                if (menu) menu.classList.toggle('hidden');
            };
        });

        // Handle status selection
        document.querySelectorAll('.status-menu button').forEach(option => {
            option.onclick = (e) => {
                e.stopPropagation();
                const groupIdx = parseInt(option.closest('td').querySelector('.status-btn').getAttribute('data-group'));
                const taskIdx = parseInt(option.closest('td').querySelector('.status-btn').getAttribute('data-task'));
                const newStatus = option.getAttribute('data-status');
                groups[groupIdx].tasks[taskIdx].status = newStatus;
                // renderGroups();
                showToast("Status updated", "success");
            };
        });

        // Close menu when clicking outside
        document.addEventListener('click', closeAllStatusMenus);
    });

    // Attach event listeners for all groups
    groups.forEach((group, groupIdx) => {
        // Add Task (Enter key) - This seems okay
        const input = document.getElementById(`newTaskInput-${groupIdx}`);
        if (input) {
            input.onkeydown = (e) => {
                if (e.key === 'Enter') addTask(groupIdx);
            };
        }
        // Save All - This seems okay
        const saveAllBtn = document.getElementById(`saveAllBtn-${groupIdx}`);
        if (saveAllBtn) {
            saveAllBtn.onclick = () => saveAll(groupIdx); // Changed from addTask to saveAll
        }
    
        // --- Conditional Button Listeners ---
        if (group.renaming) {
            // Only attach listeners for Save/Cancel when renaming
            const saveRenameBtn = document.getElementById(`saveRenameGroup-${groupIdx}`);
            if (saveRenameBtn) {
                saveRenameBtn.onclick = () => saveRenameGroup(groupIdx);
            } else {
                 console.warn(`Could not find saveRenameGroup button for index: ${groupIdx}`);
            }
    
            const cancelRenameBtn = document.getElementById(`cancelRenameGroup-${groupIdx}`);
            if (cancelRenameBtn) {
                cancelRenameBtn.onclick = () => cancelRenameGroup(groupIdx);
            } else {
                 console.warn(`Could not find cancelRenameGroup button for index: ${groupIdx}`);
            }
        } else {
            // Only attach listeners for Start Rename/Delete when NOT renaming
            const startRenameBtn = document.getElementById(`startRenameGroup-${groupIdx}`);
            if (startRenameBtn) {
                // console.log(`Attaching rename listener to button for index: ${groupIdx}`); // Keep for debugging if needed
                startRenameBtn.onclick = () => startRenameGroup(groupIdx);
            } else {
                // This warning should now only appear if there's a real issue
                 console.warn(`Could not find startRenameGroup button for index: ${groupIdx}`);
            }
    
            const deleteGroupBtn = document.getElementById(`deleteGroup-${groupIdx}`);
            if (deleteGroupBtn) {
                deleteGroupBtn.onclick = () => deleteGroup(groupIdx);
            } else {
                 console.warn(`Could not find deleteGroup button for index: ${groupIdx}`);
            }
        }
    });

    // Attach event listeners for edit, delete, save, and cancel task buttons
    document.querySelectorAll('.edit-task-btn').forEach(btn => {
        btn.onclick = () => {
            const groupIdx = parseInt(btn.getAttribute('data-group'));
            const taskIdx = parseInt(btn.getAttribute('data-task'));
            startEdit(groupIdx, taskIdx);
        };
    });
    document.querySelectorAll('.delete-task-btn').forEach(btn => {
        btn.onclick = () => {
            const groupIdx = parseInt(btn.getAttribute('data-group'));
            const taskIdx = parseInt(btn.getAttribute('data-task'));
            deleteTask(groupIdx, taskIdx);
        };
    });
    document.querySelectorAll('.save-task-btn').forEach(btn => {
        btn.onclick = () => {
            const groupIdx = parseInt(btn.getAttribute('data-group'));
            const taskIdx = parseInt(btn.getAttribute('data-task'));
            saveEdit(groupIdx, taskIdx);
        };
    });
    document.querySelectorAll('.cancel-task-btn').forEach(btn => {
        btn.onclick = () => {
            const groupIdx = parseInt(btn.getAttribute('data-group'));
            cancelEdit(groupIdx);
        };
    });
}

function renderTasks(group, groupIdx) {
    let html = '';
    group.tasks.forEach((t, idx) => {
           // Status color logic
        let statusClass = '';
        if (t.status === 'Done') statusClass = 'bg-green-400 text-white';
        else if (t.status === 'Working on it') statusClass = 'bg-yellow-300 text-gray-800';
        else if (t.status === 'Stuck') statusClass = 'bg-red-400 text-white';
        else statusClass = 'bg-gray-400 text-white';
        if (group.editingIdx === idx) {
            const startDateValue = t.start ?? "";
            console.log(startDateValue);
             // Check if due date exists
            const endDateValue = t.end ?? "";
            html += `
               <tr class="border-b border-[#222]">
                    <td class="w-[3px]">
                        <input type="checkbox" class="ml-4 accent-[${group.color}]" disabled />
                    </td>
                    <td class="py-2 px-4">
                        <input type="text" id="edit-task-${groupIdx}-${idx}" value="${escapeHtml(group.editCache.task)}"
                            class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none" />
                    </td>
                    <td class="py-2 px-4">
                        <select id="edit-owner-${groupIdx}-${idx}" class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none border border-transparent focus:border-[#555]">
                            ${
                                users.map(user => `<option value="${user.id}" ${t.owner === user.id ? 'selected' : ''}>${user.name}</option>`).join('\n')
                            }
                        </select>
                    </td>
                    <td class="py-2 px-4">
                        <div class="bg-[#222] text-white border border-[#222] rounded px-2 py-1 w-full ${statusClass} ">
                        ${t.status}
                        </div>
                    </td>
                    <td class="py-2 px-4">
                        <input class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none"  type="date" id="edit-start-${groupIdx}-${idx}" value="${startDateValue}" <!-- USE THE CORRECTED VALUE -->                            
                    </td>
                    <td class="py-2 px-4">
                        <input class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none"  type="date" id="edit-end-${groupIdx}-${idx}" value="${endDateValue}" <!-- USE THE CORRECTED VALUE -->                            
                    </td>
                    <td class="py-2 px-4 text-right">
                        <!-- Save/Cancel Buttons -->
                         <div class="flex justify-end items-center gap-2">
                            <button
                                class="save-task-btn flex items-center gap-1 px-4 py-1.5 rounded-md font-medium text-white"
                                style="background:${group.color};"
                                data-group="${groupIdx}" data-task="${idx}">
                                <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span class="pointer-events-none">Save</span>
                            </button>
                            <button
                                class="cancel-task-btn flex items-center gap-1 px-4 py-1.5 rounded-md font-medium text-white bg-[#333] hover:bg-[#444] transition-colors"
                                data-group="${groupIdx}">
                                <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span class="pointer-events-none">Cancel</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            const taskOwner =  users.find(u => u.id === t.owner)?.name ? users.find(u => u.id === t.owner)?.name : 'Unassigned';

            console.log(taskOwner,t);
            
            html += `

                <tr class="border-b border-[#222] group">
                    <td class="w-[3px]">
                        <input type="checkbox" class="ml-4 accent-[${group.color}]" />
                    </td>
                    <td class="py-2 px-4">${escapeHtml(t.task)}</td>
                    <td class="py-2 px-4">

                    ${ taskOwner}
                    </td> <!-- Handle potentially missing owner -->
                    <td class="py-2 px-4 relative">
                        <button
                            class=" px-3 py-1 rounded font-semibold w-full text-left transition ${statusClass}"
                            data-group="${groupIdx}" data-task="${idx}"
                        >
                            ${escapeHtml(t.status)}
                        </button>
                    </td>
                    <td class="py-2 px-4">${escapeHtml(t.start || 'No date')}</td> <!-- Display 'No date' if due is null/undefined -->
                    <td class="py-2 px-4">${escapeHtml(t.end || 'No date')}</td> <!-- Display 'No date' if due is null/undefined -->
                    <td class="py-2 px-4 text-right">
                        <div class="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                class="edit-task-btn w-7 h-7 flex items-center justify-center rounded border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                data-group="${groupIdx}" data-task="${idx}" title="Edit task">
                                <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" />
                                </svg>
                            </button>
                            <button
                                class="delete-task-btn w-7 h-7 flex items-center justify-center rounded border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                data-group="${groupIdx}" data-task="${idx}" title="Delete task">
                                <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    });
    return html;
}


function addTask(groupIdx) {
    const input = document.getElementById(`newTaskInput-${groupIdx}`);
    if (!input) return;

    const taskName = input.value.trim();
    if (taskName === '') return;
    console.log( groups[groupIdx]);
    
    axios.post('task/create', {
        groupId: groups[groupIdx].id,
        task: taskName

    }).then(function (response) {
        // handle success
        console.log(response);
        setGroupData(response.data.data);
    });
          
    input.value = '';
    // renderGroups();
    showToast("Task added", "success");
}

function saveAll(groupIdx) {
    addTask(groupIdx); // Save the current input if any
}

function startEdit(groupIdx, idx) {
    groups[groupIdx].editingIdx = idx;
    groups[groupIdx].editCache = { ...groups[groupIdx].tasks[idx] };
    renderGroups();
}

// function saveEdit(groupIdx, idx) {
//     const task = document.getElementById(`edit-task-${groupIdx}-${idx}`).value.trim();
//     const owner = document.getElementById(`edit-owner-${groupIdx}-${idx}`).value.trim();
//     const status = document.getElementById(`edit-status-${groupIdx}-${idx}`).value;
//     const due = document.getElementById(`edit-due-${groupIdx}-${idx}`).value || 'No date';
//     if (!task) return;

//     renderGroups();
//     showToast("Task updated", "success");
// }

/**
 * Saves the edited task data to the server.
 * @param {number} groupIdx - The index of the group in the `groups` array.
 * @param {number} taskIdx - The index of the task within the group's `tasks` array.
 */
function saveEdit(groupIdx, taskIdx) {
    // --- 1. Validate Indices & Get Task ID (Keep as before) ---
    if (
        groups[groupIdx] === undefined ||
        groups[groupIdx].tasks[taskIdx] === undefined
    ) {
        console.error('Invalid indices provided to saveEdit:', groupIdx, taskIdx);
        showToast('Error saving task: Invalid data reference.', 'error');
        return;
    }
    const taskId = groups[groupIdx].tasks[taskIdx].id;
    if (!taskId) {
        console.error('Task ID missing for task being edited:', groupIdx, taskIdx);
        showToast('Error saving task: Cannot identify task.', 'error');
        return;
    }

    // --- 2. Read Values from Form Inputs (Keep as before) ---
    const taskInput = document.getElementById(`edit-task-${groupIdx}-${taskIdx}`);
    const ownerInput = document.getElementById(`edit-owner-${groupIdx}-${taskIdx}`);
    const startDateInput = document.getElementById(`edit-start-${groupIdx}-${taskIdx}`);
    const endDateInput = document.getElementById(`edit-end-${groupIdx}-${taskIdx}`);
    // const statusSelect = document.getElementById(`edit-status-${groupIdx}-${taskIdx}`);
    const dueInput = document.getElementById(`edit-due-${groupIdx}-${taskIdx}`);

    if (!taskInput || !ownerInput  || !startDateInput || !endDateInput) {
        console.error('Could not find all edit input fields for task:', groupIdx, taskIdx);
        showToast('Error saving task: UI elements missing.', 'error');
        return;
    }

    const updatedTaskName = taskInput.value.trim();
    const ownerInputValue = ownerInput.value.trim(); // Get raw input value
    const startDate = startDateInput.value.trim();
    const endDate = endDateInput.value.trim();

 

    if (!updatedTaskName) {
        showToast('Task name cannot be empty.', 'error');
        taskInput.focus();
        return;
    }

    // --- 3. Process Owner ID ---
    // let finalOwnerIdToSend = null; // Default to null (unassigned)

    // Check if the input is not empty AND not the placeholder text
    if (ownerInputValue && ownerInputValue.toLowerCase() !== 'unassigned') {
        // Attempt to parse the input value as an integer
        const parsedId = 'user_id'; // Replace with actual variable o
        if ('user_id' == NaN) {
            console.warn("Owner ID couldn't be parsed into a number:", ownerInputValue);
            showToast("Please enter a valid user ID number or leave blank/Unassigned.", "error");
            ownerInput.focus(); // Focus the problematic field
            return; // Stop the save process
        }

        // Check if parsing resulted in a valid positive integer
        // if (!isNaN(parsedId) && parsedId > 0 && String(parsedId) === ownerInputValue) { // Ensure it was purely numeric
        //     finalOwnerIdToSend = parsedId; // Use the valid integer ID
        // } else {
        //     // Input contained text that wasn't "Unassigned" and wasn't a valid integer ID
        //     console.warn("Invalid owner ID entered:", ownerInputValue);
        //     showToast("Invalid Owner ID. Please enter a valid user ID number or leave blank/Unassigned.", "error");
        //     ownerInput.focus(); // Focus the problematic field
        //     return; // Stop the save process
        // }
    } // If input was empty or "Unassigned", finalOwnerIdToSend remains null.

    // --- 4. Construct Data Payload ---
    const payload = {
        taskId: taskId,
        task: updatedTaskName,
        owner: ownerInput.value,
        startDate : startDate,
        endDate : endDate,

     
   
    };

    console.log('Attempting to save task with payload:', payload); // Check payload before sending

    // --- 5. Make the AJAX Call (Keep as before) ---
    axios.post('/task/edit', payload, { /* headers */ })
        .then(function (response) {setGroupData(response.data.data)})
        .catch(function (error) { /* error handling */ });

}

  
  // Helper function (ensure you have this or similar)
  function getCsrfToken() {
    return document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content');
  }

function cancelEdit(groupIdx) {
    groups[groupIdx].editingIdx = null;
    groups[groupIdx].editCache = {};
    renderGroups();
}

function deleteTask(groupIdx, idx) {
    if (groups[groupIdx].editingIdx === idx) {
        groups[groupIdx].editingIdx = null;
        groups[groupIdx].editCache = {};
    }
    
    // Get the task ID from the task object
    const taskId = groups[groupIdx].tasks[idx].id;
    
    // Make an AJAX call to the server to delete the task
    fetch(`/task/delete/${taskId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        // Update the groups data with the response from the server
        setGroupData(data.data);
        showToast(data.message, "success");
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Failed to delete task", "error");
    });
}

// --- Group Rename/Delete ---
function startRenameGroup(groupIdx) {
    groups[groupIdx].renaming = true;
    groups[groupIdx].renameCache = groups[groupIdx].name;
    renderGroups();
    setTimeout(() => {
        const input = document.getElementById(`renameGroupInput-${groupIdx}`);
        if (input) input.focus();
    }, 0);
}

function saveRenameGroup(groupIdx) {
    const input = document.getElementById(`renameGroupInput-${groupIdx}`);
    const newName = input.value.trim();
    
    if (newName) {
        const groupId = groups[groupIdx].id;
        
        // Send AJAX request to update the group name
        axios.post(`/group/update/${groupId}`, {
            name: newName
        })
        .then(function(response) {
            // Update the groups data with the response from the server
            setGroupData(response.data.data);
            showToast(response.data.message, "success");
        })
        .catch(function(error) {
            console.error('Error:', error);
            showToast("Failed to update group name", "error");
            
            // Reset to original state
            groups[groupIdx].renaming = false;
            groups[groupIdx].renameCache = "";
            renderGroups();
        });
    } else {
        // If name is empty, just cancel the rename
        groups[groupIdx].renaming = false;
        groups[groupIdx].renameCache = "";
        renderGroups();
        showToast("Group name cannot be empty", "error");
    }
}

function cancelRenameGroup(groupIdx) {
    groups[groupIdx].renaming = false;
    groups[groupIdx].renameCache = "";
    renderGroups();
}

function deleteGroup(groupIdx) {
    if (confirm('Are you sure you want to delete this group?')) {
        const groupId = groups[groupIdx].id;
        
        // Send AJAX request to delete the group
        axios.get(`/group/delete/${groupId}`)
            .then(function(response) {
                // Update the groups data with the response from the server
                setGroupData(response.data.data);
                showToast(response.data.message, "success");
            })
            .catch(function(error) {
                console.error('Error:', error);
                showToast("Failed to delete group", "error");
            });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Add Group
document.addEventListener('DOMContentLoaded', () => {
    console.log(groupsData);
    setGroupData(groupsData);
    
    // renderGroups();
    const addGroupBtn = document.getElementById('addGroupBtn');
    if (addGroupBtn) {
        addGroupBtn.onclick = () => {
            const groupName = prompt('Enter group name:', 'New Group');
            if (groupName && groupName.trim() !== '') {

                axios.post('group/create', {
                            name: groupName.trim()
                    })
                    .then(function (response) {
                        // handle success
                        console.log(response);
                        setGroupData(response.data.data);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .finally(function () {
                        // always executed
                    });
                
                    
           
               
                renderGroups();
                showToast("Group added", "success");
            }
        };
    }
});

// Toast notification
function showToast(message, type = "info") {
    const colors = {
        info: "bg-[#222] text-white",
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
    };
    const icon = {
        info: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke-width="2"></circle>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"></path>
               </svg>`,
        success: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>`,
        error: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>`,
    };
    const toast = document.createElement("div");
    toast.className = `flex items-center px-4 py-3 rounded shadow-lg ${colors[type]} animate-fade-in-up`;
    toast.innerHTML = `${icon[type] || ""}<span>${message}</span>`;
    document.getElementById("toast-container").appendChild(toast);
    setTimeout(() => {
        toast.classList.add("animate-fade-out");
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}
