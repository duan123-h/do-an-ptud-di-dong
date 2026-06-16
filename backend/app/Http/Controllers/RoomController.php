<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Exception;
use Illuminate\Http\Request;

class RoomController extends Controller
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
                "data"=>Room::with(["roomtype","department"])->get(),
                "message"=>"lấy dữ liệu loại phòng điều trị thành công"
            ],200);
        }else{
            $data=Room::with(["roomtype","department"])->paginate($limit);
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
            "departmentid"=>"required",
            "roomtypeid"=>"required",
            "roomnumber"=>"required|numeric",
            "capacity"=>"required|numeric",
        ],[
            "departmentid.required"=>"Mã khoa không được để trống",
            "roomtypeid.required"=>"Mã loại phòng không được để trống",

            "roomnumber.required"=>"Số phòng không được để trống",
            "roomnumber.numeric"=>"Số phòng phải là chữ số",

            "capacity.required"=>"Số lượng giường bệnh trong phòng không được để trống",
            "capacity.numeric"=>"Số lượng giường bệnh trong phòng phải là chữ số",
        ]);
        $data=$request->only(["departmentid","roomtypeid","roomnumber","capacity","isactive"]);
        try{
            $newroom=Room::create($data);
            return response()->json([
                "status"=>true,
                "data"=>$newroom,
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
        $data=Room::with(["roomtype","department"])->find($id);
        if($data==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại phòng này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$data,
            "message"=>"Lấy dữ liệu phòng điều trị thành công"
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
            "departmentid"=>"required",
            "roomtypeid"=>"required",
            "roomnumber"=>"required|numeric",
            "capacity"=>"required|numeric",
        ],[
            "departmentid.required"=>"Mã khoa không được để trống",
            "roomtypeid.required"=>"Mã loại phòng không được để trống",

            "roomnumber.required"=>"Số phòng không được để trống",
            "roomnumber.numeric"=>"Số phòng phải là chữ số",

            "capacity.required"=>"Số lượng giường bệnh trong phòng không được để trống",
            "capacity.numeric"=>"Số lượng giường bệnh trong phòng phải là chữ số",
        ]);
        $data=$request->only(["departmentid","roomtypeid","roomnumber","capacity","isactive"]);
        $room=Room::find($id);
        if($room==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại phòng này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$room->update($data),
            "message"=>"Cập nhật phòng điều trị thành công"
        ],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $room=Room::find($id);
        if($room==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại phòng này"
            ],404);
        }
        try{
            return response()->json([
                "status"=>true,
                "data"=>$room->delete(),
                "message"=>"Xóa phòng điều trị thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Xóa phòng điều trị thành công"
            ],500);
        }
    }
    public function isactive($id)
    {
        $room = Room::find($id);
        
        if($room==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại phòng này"
            ],404);
        }
        try{
            $room->isactive = !$room->isactive;
            $room->save();
            return response()->json([
                "status"=>true,
                "data"=>$room,
                "message"=>"Cập nhật trạng thái phòng thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Cập nhật trạng thái phòng không thành công"
            ],500);
        }
    }
}
