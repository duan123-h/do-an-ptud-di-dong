<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class ServiceController extends Controller
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
                "data"=>Service::with(["servicecategory","outpatientclinic"])->get(),
                "message"=>"lấy dữ liệu dịch vụ thành công"
            ],200);
        }else{
            $data=Service::with(["servicecategory","outpatientclinic"])->paginate($limit);
            return response()->json([
                "status"=>true,
                "data"=>$data->items(),
                "totalpage"=>$data->lastpage(),
                "message"=>"lấy dữ liệu dịch vụ thành công"
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
            "servicecategoryid"=>"required",
            "name"=>"required",
            "price"=>"required",
        ],[
            "servicecategoryid.required"=>"Mã loại dịch vụ không được để trống",
            "name.required"=>"Tên dịch vụ không được để trống",
            "price.required"=>"Giá dịch vụ không được để trống",
        ]);

        $data=$request->only(["name","description","isactive"]);
        try{
            $newService=Service::create($data);
            return response()->json([
                "status"=>true,
                "data"=>$newService,
                "message"=>"Thêm mới dịch vụ thành công"
            ],201);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Thêm mới dịch vụ không thành công"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data=Service::find($id);
        if($data==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại dịch vụ này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=>$data,
            "message"=>"Lấy dữ liệu dịch vụ thành công"
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
            "servicecategoryid"=>"required",
            "name"=>"required",
            "price"=>"required",
            "outpatientclinicid"=>"required",
            "servicecategoryid"=>"required",
        ],[
            "servicecategoryid.required"=>"Mã loại dịch vụ không được để trống",
            "name.required"=>"Tên dịch vụ không được để trống",
            "price.required"=>"Giá dịch vụ không được để trống",
            "outpatientclinicid.required"=>"Phòng thực hiện dịch vụ không được để trống",
            "servicecategoryid.required"=>"Mã loại dịch vụ không được để trống",
        ]);
        $data=$request->only(["name","description","isactive","servicecategoryid","outpatientclinicid"]);
        $Service=Service::find($id);
        if($Service==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại dịch vụ này"
            ],404);
        }
         return response()->json([
            "status"=>true,
            "data"=>$Service->update($data),
            "message"=>"Cập nhật dịch vụ thành công"
        ],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $Service=Service::find($id);
        if($Service==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại dịch vụ này"
            ],404);
        }
        try{
            return response()->json([
                "status"=>true,
                "data"=>$Service->delete(),
                "message"=>"Xóa dịch vụ thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Xóa dịch vụ không thành công"
            ],500);
        }
    }
    public function isactive($id)
    {
        $Service = Service::find($id);
        
        if($Service==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại dịch vụ này"
            ],404);
        }
        try{
            $Service->isactive = !$Service->isactive;
            $Service->save();
            return response()->json([
                "status"=>true,
                "data"=>$Service,
                "message"=>"Cập nhật trạng thái dịch vụ thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Cập nhật trạng thái dịch vụ không thành công"
            ],500);
        }
    }
}
