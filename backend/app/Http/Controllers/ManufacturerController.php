<?php

namespace App\Http\Controllers;

use App\Models\Manufacturer;
use Exception;
use Illuminate\Http\Request;

class ManufacturerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query("limit", null);
        if ($limit == null) {
            $data = Manufacturer::get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu nhà sản xuất thuốc thuốc thành công"
            ], 200);
        } else {
            $data = Manufacturer::paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastpage(),
                'data'  => $data->items(),
                "message" => "Lấy dữ liệu nhà sản xuất thuốc thuốc thành công"
            ], 200);
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
        $Manufacturer=$request->validate([
            'name' => 'required|unique:tblmanufacturer,name',
            'email' => 'nullable|email|unique:tblmanufacturer,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ], [
            'name.required' => 'Tên nhà sản xuất không được để trống.',
            'name.unique' => 'Tên nhà sản xuất này đã tồn tại.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email này đã tồn tại.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
        ]);

        try {
            $newManufacturer = Manufacturer::create($Manufacturer);
            return response()->json([
                "success" => true,
                "data" => $newManufacturer,
                "message" => "Thêm mới nhà sản xuất thuốc thành công"
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Thêm mới nhà sản xuất thuốc không thành công"
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $Manufacturer=Manufacturer::find($id);
        if($Manufacturer==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Không tồn tại nhà sản xuất thuốc"
            ],404);
        }
        else{
            return response()->json([
                "success" => true,
                "data"=>$Manufacturer,
                "message"=>"Lấy dữ liệu nhà sản xuất thuốc thành công"
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
        $data=$request->validate([
            'name' => `required|unique:tblmanufacturer,name,{$id},manufacturerid`,
            'email' => 'nullable|email|unique:tblmanufacturer,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ], [
            'name.required' => 'Tên nhà sản xuất không được để trống.',
            'name.unique' => 'Tên nhà sản xuất này đã tồn tại.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email này đã tồn tại.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
        ]);
        $Manufacturer = Manufacturer::find($id); 
        if($Manufacturer==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Nhà sản xuất thuốc này không tồn tại"
            ],404);
        }
        try{
            $Manufacturer->update($data);
            $Manufacturer->save();
            return response()->json([
                "success" => true,
                "data"=>$Manufacturer,
                "message"=>"Cập nhật nhà sản xuất thuốc thành công"
            ],201);
        }catch (Exception $e){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Lỗi không xác định"
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $Manufacturer = Manufacturer::find($id); 
        if($Manufacturer==null){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Nhà sản xuất thuốc này không tồn tại"
            ],404);
        }
        try{
            $Manufacturer->delete();
            return response()->json([
                "success" => true,
                "data"=>$Manufacturer,
                "message"=>"Xóa nhà sản xuất thuốc thành công"
            ],200);
        }catch (Exception $e){
            return response()->json([
                "success" => false,
                "data"=>[],
                "message"=>"Xóa nhà sản xuất thuốc không thành công"
            ],500);
        }
    }
}
