<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;
    protected $table="tbldepartment";
    protected $primaryKey="departmentid";
    protected $fillable = [
        "departmentid",
        "name" ,
        "description" 
    ];
    public $timestamps = false;
    function doctors(){
        return $this->hasMany(Doctor::class,"departmentid","departmentid");
    }
    function outpatientclinics(){
        return $this->hasMany(Outpatientclinic::class,"outpatientclinicid","outpatientclinicid");
    }
}
