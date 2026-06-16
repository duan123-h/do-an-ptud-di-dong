<?php

namespace App\Http\Controllers;

use App\Models\Hamlet;
use Illuminate\Http\Request;

class HamletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', null);
        $communeId = $request->query('communeid', null);
        $query = Hamlet::query();
        if ($communeId !== null) {
            $query->where('communeid', $communeId);
        }
        if ($limit === null) {
            $data = $query->get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu khối/xóm thành công"
            ], 200);
        } 
        else {
            $data = $query->paginate($limit);
            return response()->json([
                "success" => true,
                "totalpage" => $data->lastPage(),
                "data" => $data->items(),
                "message" => "Lấy dữ liệu khối/xóm thành công"
            ], 200);
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
