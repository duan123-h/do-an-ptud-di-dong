<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationRecipient extends Model
{
    use HasFactory;

    protected $table = 'tblnotificationrecipient';
    protected $primaryKey = 'notificationrecipientid';

    const CREATED_AT = 'createdat';
    const UPDATED_AT = null; 

    protected $fillable = [
        'notificationid',
        'userid',
        'isread',
        'isdeleted',
        'createdat'
    ];

    protected $casts = [
        'isread' => 'boolean',
        'isdeleted' => 'boolean',
    ];
    public function notification()
    {
        return $this->belongsTo(Notification::class, 'notificationid', 'notificationid');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }
}
