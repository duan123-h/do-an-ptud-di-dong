<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $table = 'tblmedicine';
    protected $primaryKey = 'medicineid';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'activeingredients',
        'dosageformid',
        'indications',
        'dosage',
        'contraindications',
        'precautions',
        'pregnancybreastfeeding',
        'drivingmachineuse',
        'interactions',
        'sideeffects',
        'overdosetreatment',
        'packaging',
        'storageconditions',
        'qualitystandards',
        'manufacturerid',
    ];
    public function dosageform()
    {
        return $this->belongsTo(Dosageform::class, 'dosageformid', 'dosageformid');
    }
    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class, 'manufacturerid', 'manufacturerid');
    }
    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'medicineid', 'medicineid');
    }
    public function batches()
    {
        return $this->hasManyThrough(
            Batch::class,     
            Inventory::class,  
            'medicineid',     
            'batchid',       
            'medicineid',     
            'batchid'       
        );
    }
}
