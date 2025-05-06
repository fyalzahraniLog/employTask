<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus; // Import the enum
use App\Models\User;
use App\Models\Group;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Import Log facade for logging warnings
use Illuminate\Support\Str; // Import Str facade (though basic string functions are used here)

class TaskController extends Controller
{
    /**
     * Display the dashboard with groups and tasks for the authenticated user.
     */
    public function index()
    {
        $user = Auth::user();
        $users = User::all();
        $groups = $user->groups()->with(['tasks.user'])->get();
        // dd($groups->toArray());
        return view('dashboard', compact('groups'), compact('users'));
    }

    /**
     * Create a new task for a specific group.
     */
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'task' => 'required|string|max:255',
            'groupId' => 'required|exists:groups,id',
        ]);

        // Find the group and check ownership (optional but recommended)
        $group = Group::find($validatedData['groupId']);
        if (!$group || $group->user_id !== auth()->id()) {
            return response(['message' => 'Group not found or unauthorized.'], 404);
        }

        $group->tasks()->create([
            'title' => $validatedData['task'],
            'status' => TaskStatus::PENDING, // Use Enum case directly
            // 'assigned_to' => auth()->id(), // Optionally assign to creator by default
        ]);

        // Fetch updated data to return
        $user = Auth::user();
        $groups = $user->groups()->with(['tasks.user'])->get();





        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 201); // Use 201 Created status code
    }

    /**
     * Edit an existing task.
     */
    public function edit(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'taskId' => 'required|exists:tasks,id',
            'task' => 'required|string|max:255',
            'owner' => 'nullable|exists:users,id',
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date',
        ]);

        // Find the task using validated ID
        $task = Task::find($validatedData['taskId']);

        // Check if task exists and belongs to a group owned by the user (Authorization)
        if (!$task || $task->group->user_id !== auth()->id()) {
            return response(['message' => 'Task not found or unauthorized.'], 404);
        }

        // Prepare update data using validated title
        $updateData = [
            'title' => $validatedData['task'],
            'assigned_to' => $validatedData['owner'],
            'start' => $validatedData['startDate'],
            'end' => $validatedData['endDate'],

        ];

        // --- Convert Status to Enum Backing Value ---
        // if (isset($validatedData['status'])) {
        //     // Convert the display string (e.g., "In Progress") to the backing value (e.g., "in_progress")
        //     $statusBackingValue = strtolower($validatedData['status']); // "in progress"
        //     $statusBackingValue = str_replace(' ', '_', $statusBackingValue); // "in_progress"

        //     // Check if the converted value is a valid backing value for the Enum
        //     if (TaskStatus::tryFrom($statusBackingValue) !== null) {
        //         // Use the correct backing value that matches the Enum definition
        //         $updateData['status'] = $statusBackingValue;
        //     } else {
        //         // Log a warning if conversion failed (shouldn't happen if validation 'in' rule is correct)
        //         Log::warning("Could not convert status '{$validatedData['status']}' to a valid TaskStatus backing value for task ID {$task->id}.");
        //         // Decide how to handle: skip status update, return error? Skipping for now.
        //     }
        // }
        // --- End Status Conversion ---

        // Handle assigned_to (using validated data)
        // array_key_exists is safer than isset for checking null values from validation
        // if (array_key_exists('assigned_to', $validatedData)) {
        //     // Assign the value (which will be null if nullable validation passed on empty input)
        //     $updateData['assigned_to'] = $validatedData['assigned_to'];
        // }

        // // Handle start date (using validated data)
        // if (array_key_exists('start', $validatedData)) {
        //     $updateData['start'] = $validatedData['start'];
        // }

        // // Handle end date (using validated data)
        // if (array_key_exists('end', $validatedData)) {
        //     $updateData['end'] = $validatedData['end'];
        // }

        // Update the task with converted/validated data
        $task->update($updateData);

        // Retrieve the updated groups data to send back
        $user = Auth::user();
        $groups = $user->groups()->with(['tasks.user'])->get(); // Eager load user for tasks





        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 201); // Use 201 Created status code 200); // OK
    }


    /**
     * Delete a specific task.
     * Note: Route model binding could simplify finding the task.
     */
    public function delete($id)
    {
        $task = Task::find($id);

        // Check if task exists and belongs to a group owned by the user (Authorization)
        if (!$task || $task->group->user_id !== auth()->id()) {
            return response(['message' => 'Task not found or unauthorized.'], 404);
        }

        $task->delete();

        // Fetch updated data to return
        $user = Auth::user();
        $groups = $user->groups()->with(['tasks.user'])->get();





        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 201); // Use 201 Created status code 200); // OK (or 204 No Content if not returning data)
    }

    /**
     * Mark a specific task as completed.
     * Note: Route model binding could simplify finding the task.
     */
    public function complete($id)
    {
        $task = Task::find($id);

        // Check if task exists and belongs to a group owned by the user (Authorization)
        if (!$task || $task->group->user_id !== auth()->id()) {
            return response(['message' => 'Task not found or unauthorized.'], 404);
        }

        // Update the task status using the Enum case directly
        $task->update([
            'status' => TaskStatus::COMPLETED, // Use Enum case
        ]);

        // Retrieve the updated groups data
        $user = Auth::user();
        $groups = $user->groups()->with(['tasks.user'])->get();


        // Return a success response



        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 201); // Use 201 Created status code 200); // OK
    }

    /**
     * Update only the status of a task.
     * (Example of a more specific update method if needed)
     */
    public function updateStatus(Request $request, $id)
    {
        $validatedData = $request->validate([
            'status' => 'required|string|in:Pending,In Progress,Done,Working on it,Stuck,Not Started,completed,cancelled',
        ]);

        $task = Task::find($id);

        if (!$task || $task->group->user_id !== auth()->id()) {
            return response(['message' => 'Task not found or unauthorized.'], 404);
        }

        // Convert status to backing value
        $statusBackingValue = strtolower($validatedData['status']);
        $statusBackingValue = str_replace(' ', '_', $statusBackingValue);

        if (TaskStatus::tryFrom($statusBackingValue) !== null) {
            $task->update(['status' => $statusBackingValue]);
        } else {
            Log::warning("Invalid status '{$validatedData['status']}' provided for task ID {$task->id}.");
            return response(['message' => 'Invalid status provided.'], 422);
        }

        $user = Auth::user();
        $groups = $user->groups()->with(['tasks.user'])->get();





        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 201); // Use 201 Created status code, 200);
    }
}
