<?php

namespace App\Http\Controllers;

use App\Models\Outpatientclinic;
use Exception;
use Illuminate\Http\Request;

class OutpatientclinicController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', null);
        $departmentId = $request->get('departmentid', null);
        $query = Outpatientclinic::with('department');
        if ($departmentId) {
            $query->where('departmentid', $departmentId);
        }
        if ($limit === null) {
            $data = $query->get();

            return response()->json([
                "status" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu phòng khám thành công"
            ]);
        }
        $data = $query->paginate($limit);
        return response()->json([
            "status" => true,
            "data" => $data->items(),
            "totalpage" => $data->lastPage(),
            "message" => "Lấy dữ liệu phòng khám thành công"
        ]);
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
            "name"=>"required",
        ],[
            "departmentid.required"=>"Mã khoa không được để trống",
            "name.required"=>"Tên phòng khám không được để trống",
        ]);
        $Outpatientclinic=$request->only([
            "departmentid",
            "name",
            "isactive",
        ]);
        try{
            $newOutpatientclinic=Outpatientclinic::create($Outpatientclinic);
            return response()->json([
                "status"=>true,
                "data"=> $newOutpatientclinic,
                "message"=>"Thêm phòng khám thành công"
            ],201);
        }catch (Exception $e){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Thêm phòng khám không thành công"
            ],500);
        };
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $Outpatientclinic=Outpatientclinic::with("department")->find($id);
        if($Outpatientclinic==null){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Không tồn tại phòng khám này"
            ],404);
        }
        return response()->json([
            "status"=>True,
            "data"=> $Outpatientclinic,
            "message"=>"Thêm phòng khám thành công"
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
            "name"=>"required",
        ],[
            "departmentid.required"=>"Mã khoa không được để trống",
            "name.required"=>"Tên phòng khám không được để trống",
        ]);
        $data=$request->only([
            "departmentid",
            "name",
            "isactive",
        ]);
        $Outpatientclinic = Outpatientclinic::find($id); 
        try{
            $newOutpatientclinic=$Outpatientclinic->update($data);
            return response()->json([
                "status"=>true,
                "data"=> $newOutpatientclinic,
                "message"=>"Cập nhật phòng khám thành công"
            ],201);
        }catch (Exception $e){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Cập nhật phòng khám không thành công"
            ],500);
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $Outpatientclinic=Outpatientclinic::find($id);
        if($Outpatientclinic==null){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Không tồn tại phòng khám này"
            ],404);
        }
        try{
            $Outpatientclinic->delete();
            return response()->json([
                "status"=>true,
                "data"=> $Outpatientclinic,
                "message"=>"Xóa phòng khám thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Xóa phòng khám không thành công"
            ],500);
        }
    }
}
