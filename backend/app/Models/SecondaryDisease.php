<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecondaryDisease extends Model
{
    use HasFactory;
    protected $table = 'tblsecondarydisease';
    protected $primaryKey = 'secondarydiseaseid';
    public $timestamps = false;

    protected $fillable = [
        'medicalexaminationid',
        'diseaseid',
    ];

    public function medicalExamination()
    {
        return $this->belongsTo(MedicalExamination::class, 'medicalexaminationid', 'medicalexaminationid');
    }

    public function disease()
    {
        return $this->belongsTo(Disease::class, 'diseaseid', 'diseaseid');
    }
}
