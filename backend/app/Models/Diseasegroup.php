<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diseasegroup extends Model
{
    use HasFactory;
    protected $table="tbldiseasegroup";
    protected $primaryKey="diseasegroupid";
    public $timestamps=false;
    protected $fillable=[
        "diseasegroupid",
        "name",
        "description"
    ];
    function diseases(){
        return $this->hasMany(Disease::class,"diseasegroupid","diseasegroupid");
    }

}
