<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commune extends Model
{
    use HasFactory;
    protected $table = 'tblcommune';
    protected $primaryKey = 'communeid';
    public $timestamps = false;
    protected $fillable = ['name', 'provinceid'];
    public function province()
    {
        return $this->belongsTo(Province::class, 'provinceid', 'provinceid');
    }
    public function hamlets()
    {
        return $this->hasMany(Hamlet::class, 'communeid', 'communeid');
    }
}
