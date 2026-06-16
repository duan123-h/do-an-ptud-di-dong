<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable  implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table="tbluser";
    protected $primaryKey="userid";
    protected $fillable = [
        "userid",
        "username" ,
        "password" ,
        "roleid" ,
        "usertype",
        "createdat" ,
        "isactive",
    ];
    public $timestamps = false;
    protected $hidden = [
        'password',
    ];
    protected $casts = [
        "isactive"=>"boolean"
    ];
     public function getJWTIdentifier()
    {
        return $this->getKey(); 
    }

    public function getJWTCustomClaims()
    {
        return []; 
    }
    public function role(){
        return $this->belongsTo(Role::class,"roleid","roleid");
    }
    public function patientprofile()
    {
        return $this->hasOne(Patient::class, 'userid', 'userid');
    }

    public function staffprofile()
    {
        return $this->hasOne(Staff::class, 'userid', 'userid');
    }
}
