<?php

namespace App\Http\Controllers;

use App\Models\Diseasegroup;
use Exception;
use Illuminate\Http\Request;

class DiseasegroupController extends Controller
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
                "data"=>Diseasegroup::get(),
                "message"=>"lấy dữ liệu nhóm bệnh thành công"
            ],200);
        }else{
            $data=Diseasegroup::paginate($limit);
            return response()->json([
                "status"=>true,
                "data"=>$data->items(),
                "totalpage"=>$data->lastpage(),
                "message"=>"lấy dữ liệu nhóm bệnh thành công"
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
            "name"=>"required",
        ],[
            "name.required"=>"Tên nhóm bệnh không được để trống",
        ]);
        $data=$request->only(["name","description"]);
        try{
            $newDiseasegroup=Diseasegroup::create($data);
            return response()->json([
                "status"=>true,
                "data"=>$newDiseasegroup,
                "message"=>"Thêm mới nhóm bệnh thành công"
            ],201);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Thêm mới nhóm bệnh không thành công"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data=Diseasegroup::find($id);
        if($data==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại nhóm bệnh này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$data,
            "message"=>"Lấy dữ liệu nhóm bệnh thành công"
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
            "name"=>"required",
        ],[
            "name.required"=>"Tên nhóm bệnh không được để trống",
        ]);
        $data=$request->only(["name","description"]);
        $Diseasegroup=Diseasegroup::find($id);
        if($Diseasegroup==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại nhóm bệnh này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$Diseasegroup->update($data),
            "message"=>"Cập nhật nhóm bệnh thành công"
        ],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $Diseasegroup=Diseasegroup::find($id);
        if($Diseasegroup==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại nhóm bệnh này"
            ],404);
        }
        try{
            return response()->json([
                "status"=>true,
                "data"=>$Diseasegroup->delete(),
                "message"=>"Xóa nhóm bệnh thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Xóa nhóm bệnh thành công"
            ],500);
        }
    }
}
