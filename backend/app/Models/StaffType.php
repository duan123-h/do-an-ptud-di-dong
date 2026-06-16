<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffType extends Model
{
    use HasFactory;
    protected $table = 'tblstafftype';
    protected $primaryKey = 'stafftypeid';

    const CREATED_AT = 'createdat';
    const UPDATED_AT = null;

    protected $fillable = [
        'stafftypename',
        'description',
        'code'
    ];


    public function staffs()
    {
        return $this->hasMany(Staff::class, 'stafftypeid', 'stafftypeid');
    }
}
