<?php

namespace App\Models;

use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'assigned_to',
        'group_id',
        'status',
        'start',
        'end',

    ];

    protected $casts = [
        'start' => 'date:Y-m-d',
        'end' => 'date:Y-m-d',
        'status' => TaskStatus::class,
    ];


    public function group()
    {
        return $this->belongsTo(Group::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
