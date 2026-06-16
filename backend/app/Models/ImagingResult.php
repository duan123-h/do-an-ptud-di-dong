<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagingResult extends Model
{
    use HasFactory;
    protected $table = "tblimagingresult";

    protected $primaryKey = "imagingresultid";

    public $timestamps = false;

    protected $fillable = [
        "servicerequestdetailid",
        "description",
        "conclusion",
        "resultimage"
    ];

    protected $casts = [
        "description" => "string",
        "conclusion" => "string",
        "resultimage" => "string"
    ];

    public function servicerequestdetail()
    {
        return $this->belongsTo(
            Servicerequestdetail::class,
            "servicerequestdetailid",
            "servicerequestdetailid"
        );
    }
}
