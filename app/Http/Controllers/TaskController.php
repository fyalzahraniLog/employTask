<?php

namespace App\Http\Controllers;


use App\Models\Task;
use App\Models\User;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\TaskStatus; // Import the enum



class TaskController extends Controller
{
    /**
     * Display the dashboard with groups and tasks for the authenticated user.
     */
    public function index()
    {
        $this->updateTaskStatus();
        $user = Auth::user();
        $users = User::all();
        $groups = $user->groups()->with(['tasks.user'])->get();
        // dd($groups->toArray());
        return view('newGroup', compact('groups'), compact('users'));
    }

    /**
     * Store a new task in the database.
     */
    public function store(Request $request)
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

        ]);

        // Fetch updated data to return
        $this->updateTaskStatus();
        $user = Auth::user();
        $groups = $user->groups()->with(['tasks.user'])->get();


        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 201); // Use 201 Created status code
    }

    /**
     * Update a specific task.
     * Note: Route model binding could simplify finding the task.
     */
    public function update(Request $request)
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

        if ($validatedData['startDate'] && $validatedData['endDate']) {
            $updateData['status'] = TaskStatus::NOT_STARTED; // []
        };

        // Update the task with converted/validated data
        $task->update($updateData);

        // Retrieve the updated groups data to send back
        $this->updateTaskStatus();
        $user = Auth::user();
        $groups = $user->groups()->with(['tasks.user'])->get(); // Eager load user for tasks

        // Return a success response
        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 201); // Use 201 Created status code 200); // OK
    }


    /**
     * Delete a specific task.
     * Note: Route model binding could simplify finding the task.
     */
    public function destroy($id)
    {
        $task = Task::find($id);

        // Check if task exists and belongs to a group owned by the user (Authorization)
        if (!$task || $task->group->user_id !== auth()->id()) {
            return response(['message' => 'Task not found or unauthorized.'], 404);
        }

        $task->delete();


        // Fetch updated data to return
        $this->updateTaskStatus();
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
    public function complete(Request $request)
    {
        $request->validate([
            'taskId' => 'required|integer|exists:tasks,id'
        ]);


        $task = Task::find(request('taskId'));
        // Check if task exists and belongs to a group owned by the user (Authorization)
        if (!$task || $task->group->user_id !== auth()->id()) {
            return response(['message' => 'Task not found or unauthorized.'], 404);
        }
        // dd($task->status, TaskStatus::IN_PROGRESS, $task->status != TaskStatus::IN_PROGRESS);
        if ($task->status != TaskStatus::IN_PROGRESS) {

            return response(['message' => 'can not mark this task as Completed because its status is not InProgressTask.'], 404);
        }
        // Update the task status using the Enum case directly
        $task->update([
            'status' => TaskStatus::COMPLETED,
        ]);


        // Retrieve the updated groups data
        $this->updateTaskStatus();
        $user = Auth::user();
        $groups = $user->groups()->with(['tasks.user'])->get();

        // Return a success response
        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 201); // Use 201 Created status code 200); // OK
    }


    /**
     * Update the status of tasks based on their start and end times.
     * This method is called in the index method to ensure task statuses are up-to-date.
     */
    public function updateTaskStatus()
    {
        $now = now();

        // Update tasks that should be in progress (for authenticated user only)
        Task::whereHas('group.user', function ($query) {
            $query->where('id', Auth::id());
        })
            ->where('status', TaskStatus::NOT_STARTED)
            ->whereNotNull('start')
            ->whereNotNull('end')
            ->where('start', '<=', $now)
            ->where('end', '>=', $now)
            ->update(['status' => TaskStatus::IN_PROGRESS]);

        // Update tasks that should be marked as no show (for authenticated user only)
        Task::whereHas('group.user', function ($query) {
            $query->where('id', Auth::id());
        })

            ->where('end', '<', $now)
            ->where('status', TaskStatus::IN_PROGRESS)
            ->whereNotNull('end')
            ->update(['status' => 'no show']);
    }
}
