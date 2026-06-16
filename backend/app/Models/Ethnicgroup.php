<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ethnicgroup extends Model
{
    use HasFactory;
    protected $table = 'tblethnicgroup';
    protected $primaryKey = 'ethnicid';
    public $timestamps = false;
    protected $fillable = ['name'];
}
