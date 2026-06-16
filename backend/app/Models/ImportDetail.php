<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportDetail extends Model
{
    use HasFactory;

    protected $table = 'tblimportdetail';
    protected $primaryKey = 'importdetailid';
    public $timestamps = false;
    protected $fillable = [
        'importreceiptid',
        'batchid',
        'totalprice'
    ];
    public function importReceipt()
    {
        return $this->belongsTo(ImportReceipt::class, 'importreceiptid', 'importreceiptid');
    }
    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batchid', 'batchid');
    }
    public function medicine()
    {
        return $this->hasOneThrough(
            Medicine::class,
            Batch::class,
            'batchid',       
            'medicineid',   
            'batchid',        
            'medicineid'    
        );
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
}
