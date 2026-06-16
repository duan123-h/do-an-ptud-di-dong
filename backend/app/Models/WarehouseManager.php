<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseManager extends Model
{
    use HasFactory;
    protected $table = 'tblwarehousemanager';
    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $fillable = [
        'warehouseid',
        'userid',
    ];
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouseid', 'warehouseid');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }
}
