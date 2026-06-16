<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model
{
    use HasFactory;
    protected $table = 'tblmanufacturer';
    protected $primaryKey = 'manufacturerid';
    public $incrementing = true;
    public $timestamps = false;
    protected $fillable = [
        'name',
        'address',
        'email',
        'phone',
    ];
    public function medicines()
    {
        return $this->hasMany(Medicine::class, 'manufacturerid', 'manufacturerid');
    }
}
