<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;
    protected $table = 'tblwarehouse';
    protected $primaryKey = 'warehouseid';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'location',
        'note',
        'isactive',
    ];
    public function warehousemanagers()
    {
        return $this->hasMany(WarehouseManager::class, 'warehouseid', 'warehouseid');
    }
    public function usermanagers()
    {
        return $this->hasManyThrough(
            User::class,           
            WarehouseManager::class, 
            'warehouseid',         
            'userid',              
            'warehouseid',          
            'userid'            
        );
    }
}
