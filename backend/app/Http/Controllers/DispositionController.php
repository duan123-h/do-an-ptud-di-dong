<?php

namespace App\Http\Controllers;

use App\Models\Disposition;
use Illuminate\Http\Request;

class DispositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit=$request->get("limit");
        if($limit==null){
            return response()->json([
                "status"=>true,
                "data"=>Disposition::get(),
                "message"=>"lấy dữ liệu xử trí thành công"
            ],200);
        }else{
            $data=Disposition::paginate($limit);
            return response()->json([
                "status"=>true,
                "data"=>$data->items(),
                "totalpage"=>$data->lastpage(),
                "message"=>"lấy dữ liệu xử trí thành công"
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
