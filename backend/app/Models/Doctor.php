<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Doctor extends Authenticatable implements JWTSubject
{
    use HasFactory;
    protected $table="tbldoctor";
    protected $primaryKey="doctorid";
    public $timestamps = false;
    protected $fillable=[
        "doctorid",
        "fullname" ,
        "avartar",
        "specialization" ,
        "phone" ,
        "email" ,
        "createdat" ,
        "departmentid" ,
        "trainingexperience",
        "strengthexperience",
    ];
    protected $hidden=[
        "username" ,
        "password",
    ];
    function department(){
        return $this->belongsTo(Department::class,"departmentid","departmentid");
    }
    public function getJWTIdentifier()
    {
        return $this->getKey(); 
    }

    public function getJWTCustomClaims()
    {
        return []; 
    }
}
