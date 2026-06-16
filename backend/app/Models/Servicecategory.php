<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicecategory extends Model
{
    use HasFactory;
    protected $table="tblservicecategory";
    protected $primaryKey="servicecategoryid";
    public $timestamps=false;
    protected $fillable=[
        "servicecategoryid",
        "name",
        "description",
        "isactive"
    ];
    protected $casts=[
        "isactive"=>"boolean"
    ];
    public function services(){
        return $this->hasMany(Service::class,"servicecategoryid","servicecategoryid");
    }
}
