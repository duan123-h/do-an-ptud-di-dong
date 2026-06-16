<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;
    protected $table = 'tblstaff';
    protected $primaryKey = 'staffid';
    const CREATED_AT = 'createdat';
    const UPDATED_AT = 'updatedat';
    protected $fillable = [
        'userid',
        'avatar',
        'fullname',
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
        'specialization',
        'departmentid',
        'trainingexperience',
        'strengthexperience',
        'stafftypeid'
    ];

    protected $casts = [
        'dateofbirth' => 'date',
        'gender' => 'boolean'
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

    public function ethnic()
    {
        return $this->belongsTo(EthnicGroup::class, 'ethnicid', 'ethnicid');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'departmentid', 'departmentid');
    }

    public function stafftype()
    {
        return $this->belongsTo(StaffType::class, 'stafftypeid', 'stafftypeid');
    }
}
