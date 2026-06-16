<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'tblinventory';
    protected $primaryKey = 'inventoryid';
    public $timestamps = false;
    protected $fillable = [
        'warehouseid',
        'medicineid',
        'batchid',
        'stockquantity',
        'lastupdate',
    ];
    protected $dates = [
        'lastupdate',
    ];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class, 'medicineid', 'medicineid');
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouseid', 'warehouseid');
    }
    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batchid', 'batchid');
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
    public function expirationDate()
    {
        return $this->hasOneThrough(
            Batch::class,
            Batch::class,   
            'batchid',      
            'batchid',    
            'batchid',
            'expirationdate'
        );
    }
}
