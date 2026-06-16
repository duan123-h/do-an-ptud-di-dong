<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Exception;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit=$request->get("limit",null);
        if($limit==null){
            return response()->json([
                "status"=>true,
                "data"=>Doctor::with("department")->get(),
                "message"=>"Lấy dữ liệu bác sĩ thành công"
            ]);
        }else{
            $data=Doctor::with("department")->paginate($limit);
            return response()->json([
                "status"=>true,
                "data"=>$data->items(),
                "totalpage"=>$data->lastpage(),
                "message"=>"Lấy dữ liệu bác sĩ thành công"
            ]);
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
            "fullname"=>"required",
            "phone"=>"required|unique:tbldoctor,phone",
            "email"=>"required|unique:tbldoctor,email",
            "fullname"=>"required",
            "departmentid"=>"required",
            "username"=>"required|unique:tbldoctor,username",
            "password"=>"required",
        ],[
            "fullname.required"=>"Tên không được để trống",
            "phone.required"=>"Số điện thoại không được để trống",
            "phone.unique"=>"Số điện thoại đã tồn tại",

            "email.required"=>"Email không được để trống",
            "email.unique"=>"Email đã tồn tại",

            "fullname.required"=>"Tên không được để trống",

            "departmentid.required"=>"Mã khoa không được để trống",

            "username.required"=>"Tài khoản người dùng không được để trống",
            "username.unique"=>"Tài khoản người dùng đã tồn tại",

            "password.required"=>"Tên không được để trống",
        ]);
        $doctor=$request->only([
        "fullname" ,
        "avartar",
        "specialization" ,
        "phone" ,
        "email" ,
        "departmentid" ,
        "username" ,
        "password",
        "trainingexperience",
        "strengthexperience"]);
        $doctor["createdat"]=now();
        try{
            $newdoctor=Doctor::create($doctor);
            return response()->json([
                "status"=>true,
                "data"=> $newdoctor,
                "message"=>"Thêm bác sĩ thành công"
            ],201);
        }catch (Exception $e){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Thêm bác sĩ không thành công"
            ],500);
        };
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $doctor=Doctor::with("department")->find($id);
        if($doctor==null){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Không tồn tại bác sĩ này"
            ],404);
        }
        return response()->json([
            "status"=>true,
            "data"=> $doctor,
            "message"=>"Thêm bác sĩ thành công"
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
            "fullname"=>"required",
            "phone"=>"required|unique:tbldoctor,phone,{$id},doctorid",
            "email"=>"required|unique:tbldoctor,email,{$id},doctorid",
            "fullname"=>"required",
            "departmentid"=>"required",
        ],[
            "fullname.required"=>"Tên không được để trống",
            "phone.required"=>"Số điện thoại không được để trống",
            "phone.unique"=>"Số điện thoại đã tồn tại",

            "email.required"=>"Email không được để trống",
            "email.unique"=>"Email đã tồn tại",

            "fullname.required"=>"Tên không được để trống",

            "departmentid.required"=>"Mã khoa không được để trống",
        ]);
        $doctor = Doctor::find($id); 
        $data=$request->only([
        "fullname" ,
        "avartar",
        "specialization" ,
        "phone" ,
        "email" ,
        "departmentid" ,
        "trainingexperience",
        "strengthexperience"]);
        try{
            $newdoctor=$doctor->update($data);
            return response()->json([
                "status"=>true,
                "data"=> $newdoctor,
                "message"=>"Cập nhật bác sĩ thành công"
            ],201);
        }catch (Exception $e){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Cập nhật bác sĩ không thành công"
            ],500);
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $doctor=Doctor::find($id);
        if($doctor==null){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Không tồn tại bác sĩ này"
            ],404);
        }
        try{
            $doctor->delete();
            return response()->json([
                "status"=>true,
                "data"=> $doctor,
                "message"=>"Xóa bác sĩ thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=> [],
                "message"=>"Xóa bác sĩ không thành công"
            ],500);
        }
    }
}
