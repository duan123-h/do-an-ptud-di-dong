<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;
    protected $table = 'tblblog';
    protected $primaryKey = 'blogid';
    const CREATED_AT = 'createddate';
    const UPDATED_AT = 'modifieddate';

    protected $fillable = [
        'title',
        'alias',
        'description',
        'detail',
        'image',
        'createddate',
        'modifieddate',
        'createdby',
        'modifiedby',
        'userid',
        'isactive',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }
    public function favorites()
    {
        return $this->hasMany(FavoriteBlog::class, 'blogid', 'blogid');
    }
}
