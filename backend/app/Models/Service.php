<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $table = "tblservice";
    protected $primaryKey = "serviceid";
    public $timestamps = false;
    protected $fillable = [
        "servicecategoryid",
        "code",
        "name",
        "description",
        "price",
        "isactive",
        "outpatientclinicid"
    ];
    protected $casts = [
        "isactive" => "boolean",
        "price" => "decimal:2"
    ];
    public function servicecategory()
    {
        return $this->belongsTo(Servicecategory::class, "servicecategoryid", "servicecategoryid");
    }
    public function outpatientclinic()
    {
        return $this->belongsTo(Outpatientclinic::class, "outpatientclinicid", "outpatientclinicid");
    }

    public function labparameters()
    {
        return $this->belongsToMany(
            LabParameter::class,
            "tblservicelabparameter",
            "serviceid",
            "labparameterid"
        );
    }
}
