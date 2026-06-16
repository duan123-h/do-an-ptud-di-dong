<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;
    protected $table = 'tblprovince';
    protected $primaryKey = 'provinceid';
    public $timestamps = false;
    protected $fillable = ['name'];
    public function communes()
    {
        return $this->hasMany(Commune::class, 'provinceid', 'provinceid');
    }
}
