<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;
    protected $table = 'tblsupplier';
    protected $primaryKey = 'supplierid';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'phone',
        'address',
        'email',
    ];
    public function importreceipts()
    {
        return $this->hasMany(ImportReceipt::class, 'supplierid', 'supplierid');
    }
}
