<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;
    protected $table = 'tblroute';
    protected $primaryKey = 'routeid';
    public $timestamps = false;
    protected $fillable = [
        'name',
    ];
    public function prescriptionDetails()
    {
        return $this->hasMany(PrescriptionDetail::class, 'routeid', 'routeid');
    }
}
