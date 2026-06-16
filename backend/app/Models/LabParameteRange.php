<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabParameteRange extends Model
{
    use HasFactory;

    protected $table = "tbllabparameterrange";

    protected $primaryKey = "labparameterrangeid";

    public $timestamps = false;

    protected $fillable = [
        "labparameterid",
        "gender",
        "agefrom",
        "ageto",
        "min",
        "max"
    ];

    protected $casts = [
        "gender" => "integer",
        "agefrom" => "integer",
        "ageto" => "integer",
        "min" => "decimal:2",
        "max" => "decimal:2"
    ];

    public function labparameter()
    {
        return $this->belongsTo(
            Labparameter::class,
            "labparameterid",
            "labparameterid"
        );
    }
}
