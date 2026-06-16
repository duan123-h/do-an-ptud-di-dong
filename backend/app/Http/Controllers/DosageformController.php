<?php

namespace App\Http\Controllers;

use App\Models\Dosageform;
use Exception;
use Illuminate\Http\Request;

class DosageformController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit =$request->query("limit",null);
        if($limit==null){
            $data=Dosageform::get();
            return response()->json([
                "success" => true,
                "data"=>$data,
                "message"=>"Lấy dữ liệu dạng bào chế thuốc thành công"
            ],200);
        }else{
            $data=Dosageform::paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastpage(),
                'data'  => $data->items(),
                "message"=>"Lấy dữ liệu dạng bào chế thuốc thành công"
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
            'dosageformname' => 'required|unique:tbldosageform,dosageformname',
        ], [
            'dosageformname.required' => 'Tên dạng bào chế không được để trống.',
            'dosageformname.unique' => 'Tên dạng bào chế này đã tồn tại.',
        ]);

        $dosageform = $request->only([
            'dosageformname',
        ]);
        try{
            $newDosageform =Dosageform::create($dosageform);
            return response()->json([
                "success" => true,
                "data"=>$newDosageform,
                "message"=>"Thêm mới dạng bào chế thuốc thành công"
            ],201);
        }catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Thêm mới dạng bào chế thuốc không thành công"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $dosageform=Dosageform::find($id);
        if($dosageform==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Không tồn tại dạng bào chế thuốc"
            ],404);
        }
        else{
            return response()->json([
                "success" => true,
                "data"=>$dosageform,
                "message"=>"Lấy dữ liệu dạng bào chế thuốc thành công"
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
            'dosageformname' => 'required|unique:tbldosageform,dosageformname',
        ], [
            'dosageformname.required' => 'Tên dạng bào chế không được để trống.',
            'dosageformname.unique' => 'Tên dạng bào chế này đã tồn tại.',
        ]);

        $data = $request->only([
            'dosageformname',
        ]);

        $dosageform = Dosageform::find($id); 
        if($dosageform==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"dạng báo chế thuốc này không tồn tại"
            ],404);
        }
        try{
            $dosageform->update($data);
            $dosageform->save();
            return response()->json([
                "success" => true,
                "data"=>$dosageform,
                "message"=>"Cập nhật dạng báo chế thuốc thành công"
            ],201);
        }catch (Exception $e){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Cập nhật dạng báo chế thuốc không thành công"
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $dosageform = Dosageform::find($id); 
        if($dosageform==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"dạng báo chế thuốc này không tồn tại"
            ],404);
        }
        try{
            $dosageform->delete();
            return response()->json([
                "success" => true,
                "data"=>$dosageform,
                "message"=>"Xóa dạng báo chế thuốc thành công"
            ],200);
        }catch (Exception $e){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Xóa dạng báo chế thuốc không thành công"
            ],500);
        }
    }
}
