<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicerequestdetail extends Model
{
    use HasFactory;
    protected $table = 'tblservicerequestdetail';
    protected $primaryKey = 'servicerequestdetailid';
    public $timestamps = false;

    protected $fillable = [
        'servicerequestid',
        'serviceid',
        'outpatientclinicid',
        'starttime',
        'endtime',
        'status',
        'queueorder',
        'note'
    ];

    public function servicerequest()
    {
        return $this->belongsTo(Servicerequest::class, 'servicerequestid');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'serviceid');
    }

    public function outpatientclinic()
    {
        return $this->belongsTo(Outpatientclinic::class, 'outpatientclinicid');
    }
    
    public function requester()
    {
        return $this->hasOneThrough(
            User::class,        
            Servicerequest::class, 
            'servicerequestid', 
            'userid',                   
            'servicerequestid',                   
            'userid'        
        );
    }
    public function patient()
    {
        return $this->hasOneThrough(
            Patient::class,        
            Servicerequest::class, 
            'servicerequestid', 
            'patientid',                   
            'servicerequestid',                   
            'patientid'        
        );
    }
    public function medicalexamination()
    {
        return $this->hasOneThrough(
            MedicalExamination::class,        
            Servicerequest::class, 
            'servicerequestid', 
            'medicalExaminationid',                   
            'servicerequestid',                   
            'medicalExaminationid'        
        );
    }

    public function labresults()
    {
        return $this->hasMany(
            Labresultdetail::class,
            "servicerequestdetailid",
            "servicerequestdetailid"
        );
    }

    public function imagingresult()
    {
        return $this->hasOne(
            Imagingresult::class,
            "servicerequestdetailid",
            "servicerequestdetailid"
        );
    }
}
