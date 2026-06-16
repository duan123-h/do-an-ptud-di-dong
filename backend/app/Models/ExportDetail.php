<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExportDetail extends Model
{
    use HasFactory;

    protected $table = 'tblexportdetail';
    protected $primaryKey = 'exportdetailid';
    public $timestamps = false;
    protected $fillable = [
        'exportreceiptid',
        'medicineid',
        'batchid',
        'prescriptiondetailid',
        'quantity',
        'unitprice',
    ];

    protected $casts = [
        'quantity'  => 'integer',
        'unitprice' => 'decimal:2',
    ];

    public function exportreceipt()
    {
        return $this->belongsTo(ExportReceipt::class, 'exportreceiptid', 'exportreceiptid');
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class, 'medicineid', 'medicineid');
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batchid', 'batchid');
    }
    public function prescriptiondetail()
    {
        return $this->belongsTo(PrescriptionDetail::class, 'prescriptiondetailid', 'prescriptiondetailid');
    }

    public function supplier()
    {
        return $this->hasOneThrough(
            Supplier::class,
            Batch::class,
            'batchid',     
            'supplierid',  
            'batchid',     
            'supplierid'    
        );
    }
    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'batchid', 'batchid')
                    ->whereColumn('medicineid', 'tblexportdetail.medicineid');
    }
}
