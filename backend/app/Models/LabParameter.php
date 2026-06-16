<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabParameter extends Model
{
    protected $table = "tbllabparameter";

    protected $primaryKey = "labparameterid";

    public $timestamps = false;

    protected $fillable = [
        "code",
        "name",
        "unit",
        "datatype",
        "isactive"
    ];

    protected $casts = [
        "isactive" => "boolean"
    ];

    public function services()
    {
        return $this->belongsToMany(
            Service::class,
            "tblservicelabparameter",
            "labparameterid",
            "serviceid"
        );
    }
    public function labparameterranges()
    {
        return $this->hasMany(
            LabParameteRange::class,
            'labparameterid',
            'labparameterid'
        );
    }
}
