<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;
    protected $table = 'tblslider';
    protected $primaryKey = 'sliderid';
    const CREATED_AT = 'createdat';
    const UPDATED_AT = 'updatedat';
    protected $fillable = [
        'imagepath',
        'linkurl',
        'title',
        'description',
        'isactive',
        'displayorder',
        'createdat',
        'updatedat'
    ];
    protected $casts = [
        'isactive' => 'boolean',
        'createdat' => 'datetime',
        'updatedat' => 'datetime',
    ];
}
