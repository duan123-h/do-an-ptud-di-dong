<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;
    protected $table = 'tblmenu';
    protected $primaryKey = 'menuid';

    protected $fillable = [
        'title',
        'isactive',
        'link',
        'levels',
        'parentid',
        'position',
        'createddate',
        'modifieddate',
    ];
    const CREATED_AT = 'createddate';
    const UPDATED_AT = 'modifieddate';
}
