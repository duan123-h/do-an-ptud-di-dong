<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalExamination extends Model
{
    use HasFactory;

    protected $table = 'tblmedicalexamination';
    protected $primaryKey = 'medicalexaminationid';
    public $timestamps = false;

    protected $fillable = [
        'outpatientregistrationid',
        'temperature',
        'bloodpressure',
        'heartrate',
        'height',
        'weight',
        'bmi',
        'generalexam',
        'bodypartexam',
        'labresults',
        'diseaseid',
        'diagnosis',
        'diseasename',
        'userid',
        'dispositionid',
        'examinationstarttime',
        'examinationendtime',
        'secondarydiseasenames',
    ];
    protected $casts = [
        'examinationstarttime' => 'datetime',
        "examinationendtime"=>"datetime"
    ];
    public function disposition()
    {
        return $this->belongsTo(Disposition::class, 'dispositionid', 'dispositionid');
    }
    public function outpatientregistration()
    {
        return $this->belongsTo(Outpatientregistration::class, 'outpatientregistrationid', 'outpatientregistrationid');
    }
    public function disease()
    {
        return $this->belongsTo(Disease::class, 'diseaseid', 'diseaseid');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }
    public function outpatientclinic()
    {
        return $this->hasOneThrough(
            Outpatientclinic::class,        
            Outpatientregistration::class, 
            'outpatientregistrationid', 
            'outpatientclinicid',                   
            'outpatientregistrationid',                   
            'outpatientclinicid'        
        );
    }
    public function patient()
    {
        return $this->hasOneThrough(
            Patient::class,        
            Outpatientregistration::class, 
            'outpatientregistrationid', 
            'patientid',                   
            'outpatientregistrationid',                   
            'patientid'        
        );
    }
    public function secondarydiseases()
    {
        return $this->hasManyThrough(
            Disease::class,            
            SecondaryDisease::class,  
            'medicalexaminationid',  
            'diseaseid',             
            'medicalexaminationid',  
            'diseaseid'              
        );
    }
}
