<?php

namespace App\Enums;

enum TaskStatus: string
{
    case NOT_STARTED = 'not_started';
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case NO_SHOW = 'no_show';


    public function label(): string
    {
        return match ($this) {
            self::NOT_STARTED => 'Not Started',
            self::PENDING => 'Pending',
            self::IN_PROGRESS => 'In Progress',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
            self::NO_SHOW => 'No show',
        };
    }

    public function bgColor(): string
    {
        return match ($this) {
            self::NOT_STARTED => '#6B7280',
            self::PENDING => '#F59E0B',
            self::IN_PROGRESS => '#3B82F6',
            self::COMPLETED => '#10B981',
            self::CANCELLED => '#EF4444',
            self::NO_SHOW => '#4B5563',
        };
    }


    public static function getFullStatusValue($value)
    {

        $label     = method_exists(self::class, 'label') ? self::label() : NULL;
        $bgColor      = method_exists(self::class, 'bgColor') ? self::bgColor() : NULL;

        return [
            'value'     => $value,
            'label'     => $label[$value] ?? 'pindeing',
            'bgColor'   => $bgColor[$value] ?? 'unknown',

        ];
    }
}
