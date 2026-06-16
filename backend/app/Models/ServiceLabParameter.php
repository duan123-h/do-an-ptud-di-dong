<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceLabParameter extends Model
{
    use HasFactory;
    protected $table = "tblservicelabparameter";

    protected $primaryKey = "servicelabparameterid";

    public $timestamps = false;

    protected $fillable = [
        "serviceid",
        "labparameterid",
        "displayorder"
    ];

    protected $casts = [
        "displayorder" => "integer"
    ];
    public function service()
    {
        return $this->belongsTo(
            Service::class,
            "serviceid",
            "serviceid"
        );
    }
    public function labparameter()
    {
        return $this->belongsTo(
            LabParameter::class,
            "labparameterid",
            "labparameterid"
        );
    }
}
