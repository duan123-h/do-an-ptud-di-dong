<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabResultDetail extends Model
{
    use HasFactory;
    protected $table = "tbllabresultdetail";

    protected $primaryKey = "labresultdetailid";

    public $timestamps = false;

    protected $fillable = [
        "servicerequestdetailid",
        "labparameterid",
        "resultvalue",
        "flag"
    ];

    protected $casts = [
        "resultvalue" => "string",
        "flag" => "string"
    ];
    public function servicerequestdetail()
    {
        return $this->belongsTo(
            Servicerequestdetail::class,
            "servicerequestdetailid",
            "servicerequestdetailid"
        );
    }

    public function labparameter()
    {
        return $this->belongsTo(
            Labparameter::class,
            "labparameterid",
            "labparameterid"
        );
    }
}
