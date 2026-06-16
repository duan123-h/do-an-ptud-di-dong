<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDevice extends Model
{
    use HasFactory;
    protected $table = 'tbluserdevice';
    protected $primaryKey = 'userdevice';

    const CREATED_AT = 'createdat';
    const UPDATED_AT = null;

    protected $fillable = [
        'userid',
        'deviceid',
        'devicename',
        'platform',
        'pushtoken',
        'isactive',
        'lastseen',
        'createdat',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }
}
