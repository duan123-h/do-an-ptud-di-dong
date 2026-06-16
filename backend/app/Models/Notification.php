<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
     use HasFactory;

    protected $table = 'tblnotification';
    protected $primaryKey = 'notificationid';

    const CREATED_AT = 'createdat';
    const UPDATED_AT = 'updatedat';

    protected $fillable = [
        'title',
        'content',
        'image_url',
        'linkurl',
        'createdat',
        'updatedat'
    ];

    public function notificationrecipients()
    {
        return $this->hasMany(NotificationRecipient::class, 'notificationid', 'notificationid');
    }
}
