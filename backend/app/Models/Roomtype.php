<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roomtype extends Model
{
    use HasFactory;
    protected $table="tblroomtype";
    protected $primaryKey="roomtypeid";
    public $timestamps=false;
    protected $fillable=[
        "roomtypeid",
        "name",
        "price"
    ];
    public function rooms(){
        return $this->hasMany(Room::class,"roomtypeid","roomtypeid");
    }
}
