<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Exception;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit =$request->query("limit",null);
        if($limit==null){
            $data=Department::get();
            return response()->json([
                "success" => true,
                "data"=>$data,
                "message"=>"Lấy dữ liệu Khoa thành công"
            ],200);
        }else{
            $data=Department::paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastpage(),
                'data'  => $data->items(),
                "message"=>"Lấy dữ liệu Khoa thành công"
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
            'name' => 'required',
            'description'    => 'required',
        ], [
            'name.required' => 'Tên khoa không được để trống.',
            'description.required'    => 'Mô tả khoa không được để trống.',
        ]);

        $department=$request->only([
            'name',
            'description',
        ]);
        try{
            $newdepartment =Department::create($department);
            return response()->json([
                "success" => true,
                "data"=>$newdepartment,
                "message"=>"Thêm mới khoa thành công"
            ],201);
        }catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Thêm mới khoa không thành công"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $department=Department::find($id);
        if($department==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Không tồn tại khoa"
            ],404);
        }
        else{
            return response()->json([
                "success" => true,
                "data"=>$department,
                "message"=>"Lấy dữ liệu khoa thành công"
            ],200);
        }
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
            'name' => 'required',
            'description'    => 'required',
        ], [
            'name.required' => 'Tên khoa không được để trống.',
            'description.required'    => 'Mô tả khoa không được để trống.',
        ]);

        $department = Department::find($id); 
        if($department==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Khoa này không tồn tại"
            ],404);
        }
        $data=$request->only([
            'name',
            'description',
        ]);
        try{
            $department->update($data);
            $department->save();
            return response()->json([
                "success" => true,
                "data"=>$department,
                "message"=>"Cập nhật Khoa thành công"
            ],201);
        }catch (Exception $e){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Cập nhật Khoa không thành công"
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $department = Department::find($id); 
        if($department==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Khoa này không tồn tại"
            ],404);
        }
        try{
            $department->delete();
            return response()->json([
                "success" => true,
                "data"=>$department,
                "message"=>"Xóa Khoa thành công"
            ],200);
        }catch (Exception $e){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Xóa Khoa không thành công"
            ],500);
        }
    }
}
