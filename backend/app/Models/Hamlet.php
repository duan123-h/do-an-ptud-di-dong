<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hamlet extends Model
{
    use HasFactory;
    protected $table = 'tblhamlet';
    protected $primaryKey = 'hamletid';
    public $timestamps = false;
    protected $fillable = ['name', 'communeid'];
    public function commune()
    {
        return $this->belongsTo(Commune::class, 'communeid', 'communeid');
    }
}
