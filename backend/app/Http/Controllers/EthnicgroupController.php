<?php

namespace App\Http\Controllers;

use App\Models\Ethnicgroup;
use Illuminate\Http\Request;

class EthnicgroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $limit =$request->query("limit",null);
        if($limit==null){
            $data=Ethnicgroup::get();
            return response()->json([
                "success" => true,
                "data"=>$data,
                "message"=>"Lấy dữ liệu Khoa thành công"
            ],200);
        }else{
            $data=Ethnicgroup::paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastpage(),
                'data'  => $data->items(),
                "message"=>"Lấy dữ liệu Khoa thành công"
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
