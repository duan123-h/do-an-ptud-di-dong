<?php

namespace App\Http\Controllers;

use App\Models\Route;
use Illuminate\Http\Request;
use LDAP\Result;

class RouteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit =$request->query("limit",null);
        if($limit==null){
            $data=Route::get();
            return response()->json([
                "success" => true,
                "data"=>$data,
                "message"=>"Lấy dữ liệu đường dùng thuốc/vật tư thành công"
            ],200);
        }else{
            $data=Route::paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastpage(),
                'data'  => $data->items(),
                "message"=>"Lấy dữ liệu đường dùng thuốc/vật tư thành công"
            ],200);
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
