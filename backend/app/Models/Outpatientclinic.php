<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Outpatientclinic extends Model
{
    use HasFactory;
    protected $table= "tbloutpatientclinic";
    protected $primaryKey="outpatientclinicid";
    public $timestamps = false;
    protected $fillable=[
        "outpatientclinicid",
        "departmentid" ,
        "name" ,
        "isactive"
    ];
    protected $casts = [
        "isactive"=>"boolean"
    ];
    function department(){
        return $this->belongsTo(Department::class,"departmentid","departmentid");
    }


}
