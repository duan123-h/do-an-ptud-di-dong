<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disease extends Model
{
    use HasFactory;
    protected $table="tbldisease";
    protected $primaryKey="diseaseid";
    public $timestamps=false;
    protected $fillable=[
        "diseaseid",
        "diseasename",
        "diseasegroupid"
    ];
    function diseasegroup(){
        return $this->belongsTo(Diseasegroup::class,"diseasegroupid","diseasegroupid");
    }
}
