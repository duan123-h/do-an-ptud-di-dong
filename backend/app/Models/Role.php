<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $table="tblrole";
    protected $primaryKey = 'roleid';
    public $timestamps = false;
    protected $fillable = ['name','description'];
}
