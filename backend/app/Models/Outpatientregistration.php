<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Outpatientregistration extends Model
{
    use HasFactory;
    protected $table = 'tbloutpatientregistration';
    protected $primaryKey = 'outpatientregistrationid';
    public $timestamps = false;
    protected $fillable = [
        'patientid',
        'userid',
        'registrationtime',
        'departmentid',
        'outpatientclinicid',
        'queueorder',
        'examinationstatus',
        'registrarid',
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patientid', 'patientid');
    }
    public function department()
    {
        return $this->belongsTo(Department::class, 'departmentid', 'departmentid');
    }
    public function outpatientclinic()
    {
        return $this->belongsTo(Outpatientclinic::class, 'outpatientclinicid', 'outpatientclinicid');
    }
    public function medicalexamination()
    {
        return $this->hasOne(MedicalExamination::class, 'outpatientregistrationid', 'outpatientregistrationid');
    }
    public function disease()
    {
        return $this->hasOneThrough(
            Disease::class,        
            MedicalExamination::class, 
            'outpatientregistrationid', 
            'diseaseid',                   
            'outpatientregistrationid',                   
            'diseaseid'        
        );
    }
    public function disposition()
    {
        return $this->hasOneThrough(
            Disposition::class,        
            MedicalExamination::class, 
            'outpatientregistrationid', 
            'dispositionid',                   
            'outpatientregistrationid',                   
            'dispositionid'        
        );
    }
    public function registrar()
    {
        return $this->belongsTo(User::class, 'registrarid', 'userid');
    }
}
