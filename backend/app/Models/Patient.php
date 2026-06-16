<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;
    protected $table = 'tblpatient';
    protected $primaryKey = 'patientid';
    const CREATED_AT = 'createdat';
    const UPDATED_AT = 'updatedat';
    protected $fillable = [
        'fullname',
        'userid',
        'dateofbirth',
        'gender',
        'address',
        'phone',
        'email',
        'personalid',
        'provinceid',
        'communeid',
        'hamletid',
        'ethnicid',
    ];
    public function province()
    {
        return $this->belongsTo(Province::class, 'provinceid', 'provinceid');
    }
    public function commune()
    {
        return $this->belongsTo(Commune::class, 'communeid', 'communeid');
    }
    public function hamlet()
    {
        return $this->belongsTo(Hamlet::class, 'hamletid', 'hamletid');
    }
    public function ethnicgroup()
    {
        return $this->belongsTo(EthnicGroup::class, 'ethnicid', 'ethnicid');
    }
}
