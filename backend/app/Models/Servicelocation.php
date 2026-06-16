<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicelocation extends Model
{
    use HasFactory;
    protected $table="tblservicelocation";
    protected $primaryKey="servicelocationid";
    public $timestamps=false;
    protected $fillable=[
        "servicelocationid",
        "serviceid",
        "outpatientclinicid"
    ];
}
