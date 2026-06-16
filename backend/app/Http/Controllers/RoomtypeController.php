<?php

namespace App\Http\Controllers;

use App\Models\Roomtype;
use Exception;
use Illuminate\Http\Request;

class RoomtypeController extends Controller
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
                "data"=>Roomtype::get(),
                "message"=>"lấy dữ liệu loại phòng điều trị thành công"
            ],200);
        }else{
            $data=Roomtype::paginate($limit);
            return response()->json([
                "status"=>true,
                "data"=>$data->items(),
                "totalpage"=>$data->lastpage(),
                "message"=>"lấy dữ liệu loại phòng điều trị thành công"
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
            "name"=>"required|unique:tblroomtype,name",
            "price"=>"required|numeric",
        ],[
            "name.required"=>"Tên loại phòng không được để trống",
            "name.unique"=>"Tên loại phòng đã tồn tại",
            "price.required"=>"Giá loại phòng không được để trống",
            "price.numeric"=>"Giá loại phòng phải là chữ số",
        ]);
        $data=$request->only(["name","price"]);
        try{
            $newroomtype=Roomtype::create($data);
            return response()->json([
                "status"=>true,
                "data"=>$newroomtype,
                "message"=>"Thêm mới loại phòng điều trị thành công"
            ],201);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Thêm mới loại phòng điều trị không thành công"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data=Roomtype::find($id);
        if($data==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại loại phòng này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$data,
            "message"=>"Lấy dữ liệu loại phòng điều trị thành công"
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
            "name"=>"required|unique:tblroomtype,name,{$id},roomtypeid",
            "price"=>"required|numeric",
        ],[
            "name.required"=>"Tên loại phòng không được để trống",
            "price.required"=>"Giá loại phòng không được để trống",
            "price.numeric"=>"Giá loại phòng phải là chữ số",
        ]);
        $data=$request->only(["name","price"]);
        $roomtype=Roomtype::find($id);
        if($roomtype==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại loại phòng này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$roomtype->update($data),
            "message"=>"Cập nhật loại phòng điều trị thành công"
        ],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $roomtype=Roomtype::find($id);
        if($roomtype==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại loại phòng này"
            ],404);
        }
        try{
            return response()->json([
                "status"=>true,
                "data"=>$roomtype->delete(),
                "message"=>"Xóa loại phòng điều trị thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Xóa loại phòng điều trị thành công"
            ],500);
        }
    }
}
