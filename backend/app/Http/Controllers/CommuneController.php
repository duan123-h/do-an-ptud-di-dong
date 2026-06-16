<?php

namespace App\Http\Controllers;

use App\Models\Commune;
use App\Models\Hamlet;
use Illuminate\Http\Request;

class CommuneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', null);
        $provinceId = $request->query('provinceid', null);
        $query = Commune::query();
        if ($provinceId !== null) {
            $query->where('provinceid', $provinceId);
        }
        if ($limit === null) {
            $data = $query->get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu xã thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "success" => true,
                "totalpage" => $data->lastPage(),
                "data" => $data->items(),
                "message" => "Lấy dữ liệu xã thành công"
            ], 200);
        }
    }

    public function getHamlets($communeid)
    {
        try {
            $data = Hamlet::where('communeid', $communeid)->get();

            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy danh sách khối/xóm theo xã thành công"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], 500);
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
