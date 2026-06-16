<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $table="tblroom";
    protected $primaryKey="roomid";
    public $timestamps=false;
    protected $fillable=[
        "roomid",
        "departmentid",
        "roomtypeid",
        "roomnumber",
        "capacity",
        "isactive"
    ];
    protected $casts=[
        "isactive"=>"boolean"
    ];
    function department(){
        return $this->belongsTo(Department::class,"departmentid","departmentid");
    }
    function roomtype(){
        return $this->belongsTo(Roomtype::class,"roomtypeid","roomtypeid");
    }
}
