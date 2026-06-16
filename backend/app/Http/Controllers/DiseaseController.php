<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use Exception;
use Illuminate\Http\Request;

class DiseaseController extends Controller
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
                "data"=>Disease::with("diseasegroup")->get(),
                "message"=>"lấy dữ liệu bệnh thành công"
            ],200);
        }else{
            $data=Disease::with("diseasegroup")->paginate($limit);
            return response()->json([
                "status"=>true,
                "data"=>$data->items(),
                "totalpage"=>$data->lastpage(),
                "message"=>"lấy dữ liệu bệnh thành công"
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
        $request->validate([
            "diseasegroupid"=>"required",
            "diseasename"=>"required",
        ],[
            "diseasegroupid.required"=>"Mã nhóm bệnh không được để trống",

            "diseasename.required"=>"Tên nhóm bệnh không được để trống",
        ]);
        $data=$request->only(["diseasegroupid","diseasename"]);
        try{
            $newDisease=Disease::create($data);
            return response()->json([
                "status"=>true,
                "data"=>$newDisease,
                "message"=>"Thêm mới bệnh thành công"
            ],201);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Thêm mới bệnh không thành công"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data=Disease::with("diseasegroup")->find($id);
        if($data==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại bệnh này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$data,
            "message"=>"Lấy dữ liệu bệnh thành công"
        ],200);
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
        $request->validate([
            "diseasegroupid"=>"required",
            "diseasename"=>"required",
        ],[
            "diseasegroupid.required"=>"Mã nhóm bệnh không được để trống",

            "diseasename.required"=>"Tên nhóm bệnh không được để trống",
        ]);
        $data=$request->only(["diseasegroupid","diseasename"]);
        $disease=Disease::find($id);
        if($disease==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại bệnh này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$disease->update($data),
            "message"=>"Cập nhật bệnh thành công"
        ],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $disease=Disease::find($id);
        if($disease==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại bệnh này"
            ],404);
        }
        try{
            return response()->json([
                "status"=>true,
                "data"=>$disease->delete(),
                "message"=>"Xóa bệnh thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Xóa bệnh thành công"
            ],500);
        }
    }
}
