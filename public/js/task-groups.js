// const { default: axios } = require("axios");

// Color palette for groups
const groupColors = [
    "#00ff00", "#ff4433", "#7c3aed", "#00e0ff", "#ffb300",
    "#ff00c8", "#ffd600", "#00ffb3", "#ff6f00", "#00bfae",
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
      renameCache: "",
    },
  ];
  
  function setGroupData(data) {
    groups = data.map((group, idx) => ({
      id: group.id,
      name: group.name,
      color: groupColors[idx % groupColors.length],
      tasks: group.tasks.map((task) => ({
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
      renameCache: "",
    }));
    console.log(groups);
    renderGroups();
  }
  
  function renderGroups() {
    const container = document.getElementById("groupsContainer");
    container.innerHTML = ""; // Clear previous content
  
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
          <div class="bg-[#181818] rounded-lg w-full">
            <table class="w-full">
              <thead>
                <tr class="text-white border-[#222] border-b">
                  <th class="w-[3px] rounded-tl-lg" style="background:${group.color};"></th>
                  <th class="w-[35%] py-3 px-4 text-center border-[#222] border-l font-semibold text-white">Task</th>
                  <th class="w-[25%] py-3 px-4 text-center border-[#222] border-l font-semibold text-white">Owner</th>
                  <th class="w-[10%] py-3 px-4 text-center border-[#222] border-l font-semibold text-white">Status</th>
                  <th class="w-[15%] py-3 px-4 text-center border-[#222] border-l font-semibold text-white">Start date</th>
                  <th class="w-[15%] py-3 px-4 text-center border-[#222] border-l font-semibold text-white">End date</th>
                  <th class="w-[5%] py-3 px-4 text-center border-[#222] border-l font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody id="taskTableBody-${groupIdx}" class="text-white">
                ${renderTasks(group, groupIdx)}
              </tbody>
              <tfoot>
                <tr>
                  <td class="w-[3px]"></td>
                  <td colspan="5" class="py-4 pb-4 px-4">
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
    });
  
    // --- Re-attach global event listeners after re-rendering ---
  
    // Task completion checkboxes
    document.querySelectorAll(".task_complete").forEach((element) => {
      element.addEventListener("change", (event) => {
        const checkbox = event.target;
        const taskId = checkbox.value;
        updateTaskCompletion(taskId);
      });
    });
  
    // Close all status menus
    function closeAllStatusMenus() {
      document
        .querySelectorAll(".status-menu")
        .forEach((menu) => menu.classList.add("hidden"));
    }
  
    // Open status menu on button click
    document.querySelectorAll(".status-btn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        closeAllStatusMenus();
        const menu = btn.parentElement.querySelector(".status-menu");
        if (menu) menu.classList.toggle("hidden");
      };
    });
  
    // Handle status selection
    document.querySelectorAll(".status-menu button").forEach((option) => {
      option.onclick = (e) => {
        e.stopPropagation();
        const groupIdx = parseInt(
          option.closest("td").querySelector(".status-btn").getAttribute("data-group")
        );
        const taskIdx = parseInt(
          option.closest("td").querySelector(".status-btn").getAttribute("data-task")
        );
        const newStatus = option.getAttribute("data-status");
        groups[groupIdx].tasks[taskIdx].status = newStatus;
        // renderGroups(); // Avoid re-rendering everything for a status change if possible
        showToast("Status updated", "success");
      };
    });
  
    // Close menu when clicking outside (global listener)
    // Ensure this is only added once or managed carefully if renderGroups is called often
    // For simplicity here, it's re-added, but consider a flag or removing old listener.
    document.removeEventListener("click", closeAllStatusMenus); // Remove previous if any
    document.addEventListener("click", closeAllStatusMenus);
  
    // Attach event listeners for group-specific actions
    groups.forEach((group, groupIdx) => {
      const newTaskInput = document.getElementById(`newTaskInput-${groupIdx}`);
      if (newTaskInput) {
        newTaskInput.onkeydown = (e) => {
          if (e.key === "Enter") addTask(groupIdx);
        };
      }
  
      const saveAllBtn = document.getElementById(`saveAllBtn-${groupIdx}`);
      if (saveAllBtn) {
        saveAllBtn.onclick = () => saveAll(groupIdx);
      }
  
      if (group.renaming) {
        const saveRenameBtn = document.getElementById(`saveRenameGroup-${groupIdx}`);
        if (saveRenameBtn) saveRenameBtn.onclick = () => saveRenameGroup(groupIdx);
  
        const cancelRenameBtn = document.getElementById(`cancelRenameGroup-${groupIdx}`);
        if (cancelRenameBtn) cancelRenameBtn.onclick = () => cancelRenameGroup(groupIdx);
      } else {
        const startRenameBtn = document.getElementById(`startRenameGroup-${groupIdx}`);
        if (startRenameBtn) startRenameBtn.onclick = () => startRenameGroup(groupIdx);
  
        const deleteGroupBtn = document.getElementById(`deleteGroup-${groupIdx}`);
        if (deleteGroupBtn) deleteGroupBtn.onclick = () => deleteGroup(groupIdx);
      }
    });
  
    // Attach event listeners for task actions (edit, delete, save, cancel)
    document.querySelectorAll(".edit-task-btn").forEach((btn) => {
      btn.onclick = () => {
        const groupIdx = parseInt(btn.getAttribute("data-group"));
        const taskIdx = parseInt(btn.getAttribute("data-task"));
        startEdit(groupIdx, taskIdx);
      };
    });
  
    document.querySelectorAll(".delete-task-btn").forEach((btn) => {
      btn.onclick = () => {
        const groupIdx = parseInt(btn.getAttribute("data-group"));
        const taskIdx = parseInt(btn.getAttribute("data-task"));
        deleteTask(groupIdx, taskIdx);
      };
    });
  
    document.querySelectorAll(".save-task-btn").forEach((btn) => {
      btn.onclick = () => {
        const groupIdx = parseInt(btn.getAttribute("data-group"));
        const taskIdx = parseInt(btn.getAttribute("data-task"));
        saveEdit(groupIdx, taskIdx);
      };
    });
  
    document.querySelectorAll(".cancel-task-btn").forEach((btn) => {
      btn.onclick = () => {
        const groupIdx = parseInt(btn.getAttribute("data-group"));
        cancelEdit(groupIdx); // Note: taskIdx might be needed if cancelling specific edit
      };
    });
  }
  
  function renderTasks(group, groupIdx) {
    let html = "";
    group.tasks.forEach((t, idx) => {
      let statusClass = "";
      if (t.status === "Done") statusClass = "bg-green-400 text-white";
      else if (t.status === "Working on it") statusClass = "bg-yellow-300 text-gray-800";
      else if (t.status === "Stuck") statusClass = "bg-red-400 text-white";
      else statusClass = "bg-gray-400 text-white"; // Default or 'To Do'
  
      if (group.editingIdx === idx) {
        const startDateValue = t.start ?? "";
        const endDateValue = t.end ?? "";
        html += `
          <tr class="border-b border-[#222]">
            <td class="w-[3px]">
              <input type="checkbox" class="m-4 accent-[${group.color}]" disabled />
            </td>
            <td class="py-2 px-4 border-[#222] border-l">
              <input type="text" id="edit-task-${groupIdx}-${idx}" value="${escapeHtml(group.editCache.task)}"
                class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none" />
            </td>
            <td class="py-2 px-4 border-[#222] border-l">
              <select id="edit-owner-${groupIdx}-${idx}" class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none border border-transparent focus:border-[#555]">
                ${users.map((user) => `<option value="${user.id}" ${t.owner === user.id ? "selected" : ""}>${user.name}</option>`).join("\n")}
              </select>
            </td>
            <td class="py-2 px-4 border-[#222] border-l">
              <div class="bg-[#222] text-white border border-[#222] rounded px-2 py-1 w-full ${statusClass}">
                ${escapeHtml(t.status)}
              </div>
            </td>
            <td class="py-2 px-4 border-[#222] border-l">
              <input class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none" type="date" id="edit-start-${groupIdx}-${idx}" value="${startDateValue}" />
            </td>
            <td class="py-2 px-4 border-[#222] border-l">
              <input class="bg-[#222] text-white rounded px-2 py-1 w-full focus:outline-none" type="date" id="edit-end-${groupIdx}-${idx}" value="${endDateValue}" />
            </td>
            <td class="py-2 px-4 text-right">
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
        const taskOwner = users.find((u) => u.id === t.owner)?.name || "Unassigned";
        html += `
          <tr class="border-b border-[#222] group">
            <td class="w-[3px]">
              <input type="checkbox" ${t.status === "in_progress" ? "" : "disabled"} name="" ${t.status === "completed" ? "checked" : ""} value="${t.id}" class="task_complete m-4 accent-[${group.color}]" />
            </td>
            <td class="py-2 px-4 border-[#222] border-l">${escapeHtml(t.task)}</td>
            <td class="py-2 px-4 border-[#222] border-l">${escapeHtml(taskOwner)}</td>
            <td class="py-2 px-4 border-[#222] border-l relative">
              <button
                class="status-btn px-3 py-1 rounded font-semibold w-full text-left transition ${statusClass}"
                data-group="${groupIdx}" data-task="${idx}"
              >
                ${escapeHtml(t.status)}
              </button>
            
               
                  
            </td>
            <td class="py-2 px-4 border-[#222] border-l">${escapeHtml(t.start || "No date")}</td>
            <td class="py-2 px-4 border-[#222] border-l">${escapeHtml(t.end || "No date")}</td>
            <td class="py-2 px-4 border-[#222] border-l text-right">
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
    if (taskName === "") return;
  
    axios.post("/task", {
        groupId: groups[groupIdx].id,
        task: taskName,
      })
      .then(function (response) {
        setGroupData(response.data.data);
      });
  
    input.value = "";
    showToast("Task added", "success");
  }
  
  function saveAll(groupIdx) {
    // This function currently just calls addTask.
    // If "Save All" is meant to do more (e.g., save all pending changes across tasks),
    // that logic needs to be implemented here.
    addTask(groupIdx);
  }
  
  function startEdit(groupIdx, idx) {
    groups[groupIdx].editingIdx = idx;
    groups[groupIdx].editCache = { ...groups[groupIdx].tasks[idx] };
    renderGroups();
  }
  
  function saveEdit(groupIdx, taskIdx) {
    if (
      groups[groupIdx] === undefined ||
      groups[groupIdx].tasks[taskIdx] === undefined
    ) {
      console.error("Invalid indices provided to saveEdit:", groupIdx, taskIdx);
      showToast("Error saving task: Invalid data reference.", "error");
      return;
    }
    const taskId = groups[groupIdx].tasks[taskIdx].id;
    if (!taskId) {
      console.error("Task ID missing for task being edited:", groupIdx, taskIdx);
      showToast("Error saving task: Cannot identify task.", "error");
      return;
    }
  
    const taskInput = document.getElementById(`edit-task-${groupIdx}-${taskIdx}`);
    const ownerInput = document.getElementById(`edit-owner-${groupIdx}-${taskIdx}`);
    const startDateInput = document.getElementById(`edit-start-${groupIdx}-${taskIdx}`);
    const endDateInput = document.getElementById(`edit-end-${groupIdx}-${taskIdx}`);
  
    if (!taskInput || !ownerInput || !startDateInput || !endDateInput) {
      console.error("Could not find all edit input fields for task:", groupIdx, taskIdx);
      showToast("Error saving task: UI elements missing.", "error");
      return;
    }
  
    const updatedTaskName = taskInput.value.trim();
    const ownerId = ownerInput.value; // This is the user ID from the select
    const startDate = startDateInput.value.trim();
    const endDate = endDateInput.value.trim();
  
    if (!updatedTaskName) {
      showToast("Task name cannot be empty.", "error");
      taskInput.focus();
      return;
    }
  
    const payload = {
      taskId: taskId,
      task: updatedTaskName,
      owner: ownerId, // Send the selected user ID
      startDate: startDate,
      endDate: endDate,
    };
  
    axios.put(`/task/${taskId}`, payload)
      .then(function (response) {
        setGroupData(response.data.data);
        showToast("Task updated", "success"); // Show success after data is set and re-rendered
      })
      .catch(function (error) {
        console.error("Error saving task:", error.response?.data || error.message);
        showToast(error.response?.data?.message || "Failed to save task.", "error");
      });
  }
  
  function cancelEdit(groupIdx) {
    groups[groupIdx].editingIdx = null;
    groups[groupIdx].editCache = {};
    renderGroups();
  }
  
  function deleteTask(groupIdx, idx) {
    if (groups[groupIdx].editingIdx === idx) {
      // If deleting the task currently being edited, cancel edit mode
      groups[groupIdx].editingIdx = null;
      groups[groupIdx].editCache = {};
    }
  
    const taskId = groups[groupIdx].tasks[idx].id;
  
    axios.delete(`/task/${taskId}`)
       .then(function (response) {
          setGroupData(response.data.data);
          showToast(response.data.message || "Task deleted", "success");
        })
        .catch(function (error) {
          console.error("Error deleting Task:", error.response?.data || error.message);
          showToast(error.response?.data?.message || "Failed to delete Task", "error");
        });
  }
  
  // --- Group Rename/Delete Functions ---
  function startRenameGroup(groupIdx) {
    groups[groupIdx].renaming = true;
    groups[groupIdx].renameCache = groups[groupIdx].name;
    renderGroups();
    setTimeout(() => {
      const input = document.getElementById(`renameGroupInput-${groupIdx}`);
      if (input) input.focus();
    }, 0); // Timeout ensures element exists before focus
  }
  
  function saveRenameGroup(groupIdx) {
    const input = document.getElementById(`renameGroupInput-${groupIdx}`);
    if (!input) return;
    const newName = input.value.trim();
  
    if (newName) {
      const groupId = groups[groupIdx].id;
      axios.put(`/group/${groupId}`, { name: newName })
        .then(function (response) {
          setGroupData(response.data.data);
          showToast(response.data.message || "Group name updated", "success");
        })
        .catch(function (error) {
          console.error("Error updating group name:", error.response?.data || error.message);
          showToast(error.response?.data?.message || "Failed to update group name", "error");
          // Optionally revert UI if save fails
          groups[groupIdx].renaming = false;
          renderGroups();
        });
    } else {
      cancelRenameGroup(groupIdx); // Cancel if name is empty
      showToast("Group name cannot be empty", "error");
    }
  }
  
  function cancelRenameGroup(groupIdx) {
    groups[groupIdx].renaming = false;
    groups[groupIdx].renameCache = "";
    renderGroups();
  }
  
  function deleteGroup(groupIdx) {
    if (confirm("Are you sure you want to delete this group and all its tasks?")) {
      const groupId = groups[groupIdx].id;
      axios.delete(`/group/${groupId}`) // Or DELETE, ensure route matches
        .then(function (response) {
          setGroupData(response.data.data);
          showToast(response.data.message || "Group deleted", "success");
        })
        .catch(function (error) {
          console.error("Error deleting group:", error.response?.data || error.message);
          showToast(error.response?.data?.message || "Failed to delete group", "error");
        });
    }
  }
  
  function escapeHtml(text) {
    if (typeof text !== "string") return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // --- Initial Load and Add Group Button ---
  document.addEventListener("DOMContentLoaded", () => {
    // Assuming groupsData is globally available from the Blade template
    if (typeof groupsData !== "undefined") {
      setGroupData(groupsData);
    } else {
      console.warn("groupsData not found. Initial groups will not be loaded from server.");
      renderGroups(); // Render with default or empty groups
    }
  
    const addGroupBtn = document.getElementById("addGroupBtn");
    if (addGroupBtn) {
      addGroupBtn.onclick = () => {
        const groupName = prompt("Enter group name:", "New Group");
        if (groupName && groupName.trim() !== "") {
          axios.post("/group", { name: groupName.trim() })
            .then(function (response) {
              setGroupData(response.data.data);
              showToast("Group added", "success");
            })
            .catch(function (error) {
              console.error("Error adding group:", error.response?.data || error.message);
              showToast(error.response?.data?.message || "Failed to add group.", "error");
            });
        }
      };
    }
  });
  
  // --- Toast Notification ---
  function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      console.error("Toast container not found!");
      return;
    }
  
    const colors = {
      info: "bg-[#222] text-white",
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
    };
    const iconHTML = {
      info: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"></circle><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"></path></svg>`,
      success: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
      error: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`,
    };
  
    const toast = document.createElement("div");
    toast.className = `flex items-center px-4 py-3 rounded shadow-lg ${colors[type]} animate-fade-in-up`;
    toast.innerHTML = `${iconHTML[type] || ""}<span>${escapeHtml(message)}</span>`;
  
    toastContainer.appendChild(toast);
  
    setTimeout(() => {
      toast.classList.add("animate-fade-out");
      setTimeout(() => toast.remove(), 500); // Remove after fade out animation
    }, 2500);
  }
  
  // --- Task Completion ---
  function updateTaskCompletion(taskId) {
    axios.post(`/task/completion`, { taskId: taskId })
      .then(function (response) {
        setGroupData(response.data.data);
        showToast("Task status updated", "success");
      })
      .catch(function (error) {
        console.error("Error updating task completion:", error.response?.data || error.message);
        showToast(error.response?.data?.message || "Failed to update task status.", "error");
      });
  }
  
  function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
  }
