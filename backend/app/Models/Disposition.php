<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disposition extends Model
{
    use HasFactory;

    protected $table = 'tbldisposition';
    protected $primaryKey = 'dispositionid';
    public $timestamps = false;

    protected $fillable = [
        'name',
    ];
}
