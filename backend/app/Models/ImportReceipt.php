<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportReceipt extends Model
{
    use HasFactory;
    protected $table = 'tblimportreceipt';
    protected $primaryKey = 'importreceiptid';
    public $timestamps = false;
    protected $fillable = [
        'warehouseid',
        'userid',
        'importdate',
        'totalamount',
        'note',
        'status',
    ];
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouseid', 'warehouseid');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }
    public function details(){
        return $this->hasMany(ImportDetail::class,'importreceiptid','importreceiptid');
    }
}
