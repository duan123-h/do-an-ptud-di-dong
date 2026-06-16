<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrescriptionDetail extends Model
{
    use HasFactory;
    protected $table = 'tblprescriptiondetail';
    protected $primaryKey = 'prescriptiondetailid';
    public $timestamps = false;

    protected $fillable = [
        'prescriptionid',
        'medicineid',
        'quantity',
        'usageinstructions',
        'warehouseid',
        'routeid'
    ];
    public function prescription()
    {
        return $this->belongsTo(Prescription::class, 'prescriptionid', 'prescriptionid');
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class, 'medicineid', 'medicineid');
    }
    public function route()
    {
        return $this->belongsTo(Route::class, 'routeid', 'routeid');
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouseid', 'warehouseid');
    }
    public function exportdetail()
    {
        return $this->hasOne(ExportDetail::class, 'prescriptiondetailid', 'prescriptiondetailid');
    }
}
