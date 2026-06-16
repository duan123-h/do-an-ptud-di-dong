<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteBlog extends Model
{
    use HasFactory;
    protected $table = 'tblfavoriteblog';
    protected $primaryKey = 'favoriteblogid';
    const CREATED_AT = 'createddate';
    const UPDATED_AT = null;

    protected $fillable = [
        'blogid',
        'userid',
        'createddate',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }
    public function blog()
    {
        return $this->belongsTo(Blog::class, 'blogid', 'blogid');
    }
}
