<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User;

class GroupController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required'
        ]);
        $user = auth()->user();
        $user->groups()->create([
            'name' => $request->name,
        ]);


        $groups = auth()->user()->groups()->with('tasks')->get();
        return response([
            'message' => "Task successfully created",
            'data' => $groups,

        ], 200);
    }
    public function destroy($id)
    {
        // Find the group by ID
        $group = \App\Models\Group::find($id);

        // Check if group exists
        if (!$group) {
            return response([
                'message' => 'Group not found',
            ], 404);
        }

        // Check if the authenticated user owns this group
        if ($group->user_id !== auth()->id()) {
            return response([
                'message' => 'You are not authorized to delete this group',
            ], 403);
        }

        try {
            // Begin a database transaction
            \Illuminate\Support\Facades\DB::beginTransaction();

            // Delete all tasks associated with this group first
            $group->tasks()->delete();

            // Then delete the group
            $group->delete();

            // Commit the transaction
            \Illuminate\Support\Facades\DB::commit();

            // Return the updated list of groups
            $groups = auth()->user()->groups()->with('tasks')->get();
            $users = User::all();

            return response([
                'message' => 'Group deleted successfully',
                'data' => $groups,
                'users' => $users,
            ], 200);
        } catch (\Exception $e) {
            // If something goes wrong, rollback the transaction
            \Illuminate\Support\Facades\DB::rollBack();

            return response([
                'message' => 'Failed to delete group: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Find the group by ID
        $group = \App\Models\Group::find($id);

        // Check if group exists
        if (!$group) {
            return response([
                'message' => 'Group not found',
            ], 404);
        }

        // Check if the authenticated user owns this group
        if ($group->user_id !== auth()->id()) {
            return response([
                'message' => 'You are not authorized to edit this group',
            ], 403);
        }

        // Update the group name
        $group->name = $request->name;
        $group->save();

        // Return the updated list of groups
        $groups = auth()->user()->groups()->with('tasks')->get();
        $users = User::all();




        return response([
            'message' => "Task successfully created",
            'data' => $groups,
            'users' => $users,
        ], 201); // Use 201 Created status code, 200);
    }
}
