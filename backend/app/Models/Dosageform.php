<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dosageform extends Model
{
    use HasFactory;

    protected $table = 'tbldosageform';
    protected $primaryKey = 'dosageformid';
    public $timestamps = false;

    protected $fillable = [
        'dosageformname',
    ];
    public function medicines()
    {
        return $this->hasMany(Medicine::class, 'dosageformid', 'dosageformid');
    }
}
