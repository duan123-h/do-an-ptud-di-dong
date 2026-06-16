<?php

namespace App\Http\Controllers;

use App\Models\Servicecategory;
use Exception;
use Illuminate\Http\Request;

class ServicecategoryController extends Controller
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
                "data"=>Servicecategory::get(),
                "message"=>"lấy dữ liệu loại dịch vụ thành công"
            ],200);
        }else{
            $data=Servicecategory::paginate($limit);
            return response()->json([
                "status"=>true,
                "data"=>$data->items(),
                "totalpage"=>$data->lastpage(),
                "message"=>"lấy dữ liệu loại dịch vụ thành công"
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
            "name.required"=>"Tên loại dịch vụ không được để trống",
        ]);
        $data=$request->only(["name","description","isactive"]);
        try{
            $newServicecategory=Servicecategory::create($data);
            return response()->json([
                "status"=>true,
                "data"=>$newServicecategory,
                "message"=>"Thêm mới loại dịch vụ thành công"
            ],201);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Thêm mới loại dịch vụ không thành công"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data=Servicecategory::find($id);
        if($data==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại loại dịch vụ này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$data,
            "message"=>"Lấy dữ liệu loại dịch vụ thành công"
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
            "name.required"=>"Tên loại dịch vụ không được để trống",
        ]);
        $data=$request->only(["name","description","isactive"]);
        $Servicecategory=Servicecategory::find($id);
        if($Servicecategory==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại loại dịch vụ này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$Servicecategory->update($data),
            "message"=>"Cập nhật loại dịch vụ thành công"
        ],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $Servicecategory=Servicecategory::find($id);
        if($Servicecategory==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại loại dịch vụ này"
            ],404);
        }
        try{
            return response()->json([
                "status"=>true,
                "data"=>$Servicecategory->delete(),
                "message"=>"Xóa loại dịch vụ thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Xóa loại dịch vụ không thành công"
            ],500);
        }
    }
    public function isactive($id)
    {
        $Servicecategory = Servicecategory::find($id);
        
        if($Servicecategory==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại loại dịch vụ này"
            ],404);
        }
        try{
            $Servicecategory->isactive = !$Servicecategory->isactive;
            $Servicecategory->save();
            return response()->json([
                "status"=>true,
                "data"=>$Servicecategory,
                "message"=>"Cập nhật trạng thái loại dịch vụ thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Cập nhật trạng thái loại dịch vụ không thành công"
            ],500);
        }
    }
}
