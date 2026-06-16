<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;
    protected $table = 'tblbatch';
    protected $primaryKey = 'batchid';
    public $timestamps = false; 
    protected $fillable = [
        'lotnumber',
        'medicineid',
        'supplierid',
        'expirationdate',
        'quantity',
        'unitprice',
        'createdat',
    ];
    protected $dates = [
        'expirationdate',
        'createdat',
    ];
    public function medicine()
    {
        return $this->belongsTo(Medicine::class, 'medicineid', 'medicineid');
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplierid', 'supplierid');
    }
}
