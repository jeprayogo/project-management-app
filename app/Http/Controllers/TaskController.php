<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();

        //handling table sorting
        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        // handling query params requests
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        // test enkripsi id sebelum dikirim ke view
        $tasks->getCollection()->transform(function ($task) {
            $task->encrypted_id = Crypt::encryptString($task->id);
            return $task;
        });

        $transformedTasks = TaskResource::collection($tasks);

        return inertia("Task/Index", [
            'tasks' => $transformedTasks,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $project = Project::orderBy('name', 'asc')->get();
        $user = User::orderBy('name', 'asc')->get();
        return inertia("Task/Create", [
            'projects' => ProjectResource::collection($project),
            'users' => UserResource::collection($user)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        /** @var $image \Illuminate\Http\UploadedFile */
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['created_by'] = auth()->id();
        $data['updated_by'] = auth()->id();
        if ($image) {
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }

        Task::create($data);

        return to_route('task.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($encrypted_id)
    {
        try {

            $taskId = Crypt::decryptString($encrypted_id);
            $task = Task::find($taskId);
            return Inertia("Task/Show", [
                'task' => new TaskResource($task),
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task, $encrypted_id)
    {
        $taskId = Crypt::decryptString($encrypted_id);
        $task = Task::find($taskId);
        $project = Project::query()->orderBy('name', 'asc')->get();
        $user = User::query()->orderBy('name', 'asc')->get();
        return inertia("Task/Edit", [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($project),
            'users' => UserResource::collection($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request,  $encrypted_id)
    {
        $taskId = Crypt::decryptString($encrypted_id);
        $task = Task::findOrFail($taskId);
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = auth()->id();
        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory($task->image_path);
            }
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }

        $task->update($data);

        return to_route('task.index')->with('success', "Task \"$task->name\" updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, $encrypted_id)
    {
        $taskId = Crypt::decryptString($encrypted_id);
        $task = Task::find($taskId);
        $name = $task->name;
        $task->delete();
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        return to_route('task.index')->with('success', "Task \"$name\" has been deleted.");
    }
}
