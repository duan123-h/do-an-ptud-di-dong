<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Exception;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->input('limit');
        $keyword = $request->input('keyword');
        $departmentid = $request->input('departmentid');

        $query = Staff::with([
            'department',
            'stafftype',
        ]);
        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->where('fullname', 'like', "%$keyword%")
                    ->orWhere('email', 'like', "%$keyword%")
                    ->orWhere('phone', 'like', "%$keyword%")
                    ->orWhere('personalid', 'like', "%$keyword%");
            });
        }

        if (!empty($departmentid)) {
            $query->where('departmentid', $departmentid);
        }

        if (empty($limit)) {
            $data = $query->get();

            return response()->json([
                "status" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu nhân viên thành công"
            ]);
        }

        $data = $query->paginate($limit);

        return response()->json([
            "status" => true,
            "data" => $data->items(),
            "totalpage" => $data->lastPage(),
            "message" => "Lấy dữ liệu nhân viên thành công"
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $staff = Staff::with([
            'department',
            'stafftype',
        ])->find($id);

        if (!$staff) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Không tìm thấy nhân viên"
            ], 404);
        }

        return response()->json([
            "status" => true,
            "data" => $staff,
            "message" => "Lấy thông tin nhân viên thành công"
        ]);
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
            "phone"=>"required",
            "email"=>"required",
            "departmentid"=>"required",
        ],[
            "fullname.required"=>"Tên không được để trống",
            "phone.required"=>"Số điện thoại không được để trống",

            "email.required"=>"Email không được để trống",

            "departmentid.required"=>"Mã khoa không được để trống",
        ]);
        $doctor = Staff::find($id); 
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
        //
    }
}
