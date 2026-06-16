<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExportReceipt extends Model
{
    use HasFactory;

    protected $table = 'tblexportreceipt';
    protected $primaryKey = 'exportreceiptid';

    public $timestamps = false; 

    protected $fillable = [
        'warehouseid',
        'userid',
        'exportdate',
        'totalamount',
        'note',
        'status',
        'createdat',
        'updatedat',
    ];

    protected $casts = [
        'exportdate' => 'datetime',
        'createdat'  => 'datetime',
        'updatedat'  => 'datetime',
        'totalamount'=> 'decimal:2',
    ];
    public function exportdetails()
    {
        return $this->hasMany(
            ExportDetail::class,
            'exportreceiptid',
            'exportreceiptid'
        );
    }
    public function warehouse()
    {
        return $this->belongsTo(
            Warehouse::class,
            'warehouseid',
            'warehouseid'
        );
    }
    public function user()
    {
        return $this->belongsTo(
            User::class,
            'userid',
            'userid'
        );
    }
}
