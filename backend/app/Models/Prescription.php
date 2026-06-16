<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;
    protected $table = 'tblprescription';
    protected $primaryKey = 'prescriptionid';
    public $timestamps = false;
    protected $fillable = [
        'medicalexaminationid',
        'userid',
        'prescriptiondate',
        'doctoradvice',
        'isdispensed',
    ];
    public function details()
    {
        return $this->hasMany(PrescriptionDetail::class, 'prescriptionid', 'prescriptionid');
    }
    public function doctor()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }


    public function medicalexamination()
    {
        return $this->belongsTo(MedicalExamination::class, 'medicalexaminationid', 'medicalexaminationid');
    }
}
