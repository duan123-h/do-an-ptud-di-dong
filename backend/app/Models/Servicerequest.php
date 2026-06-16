<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicerequest extends Model
{
    use HasFactory;
    protected $table = 'tblservicerequest';
    protected $primaryKey = 'servicerequestid';
    public $timestamps = false;

    protected $fillable = [
        'medicalexaminationid',
        'userid',
        'patientid',
        'requesttime'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patientid');
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }

    public function medicalExamination()
    {
        return $this->belongsTo(MedicalExamination::class, 'medicalexaminationid');
    }

    public function details()
    {
        return $this->hasMany(ServiceRequestDetail::class, 'servicerequestid');
    }
}
