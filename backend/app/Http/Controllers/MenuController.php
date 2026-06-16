<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Exception;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query("limit", null);
        $status = $request->query("status", null);
        $query = Menu::query();
        if (!is_null($status)) {
            $query->where("isactive", $status);
        }

        if ($limit == null) {
            $data = $query->get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu Menu thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastPage(),
                'data' => $data->items(),
                "message" => "Lấy dữ liệu Menu thành công"
            ], 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|max:150',
            'isactive'     => 'required|boolean',
            'link'         => 'nullable|max:250',
            'levels'       => 'nullable|integer',
            'parentid'     => 'nullable|integer',
            'position'     => 'nullable|integer',
        ], [
            'title.required' => 'Tên menu không được để trống.',
            'isactive.required' => 'Trạng thái menu không được để trống.',
            'isactive.boolean' => 'Trạng thái menu phải là kiểu boolean.',
        ]);

        $menuData = $request->only([
            'title',
            'isactive',
            'link',
            'levels',
            'parentid',
            'position',
            'createddate'
        ]);

        try {
            $newMenu = Menu::create($menuData);
            return response()->json([
                "success" => true,
                "data" => $newMenu,
                "message" => "Thêm mới Menu thành công"
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Thêm mới Menu không thành công"
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $menu = Menu::find($id);

        if ($menu == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tồn tại Menu"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $menu,
            "message" => "Lấy dữ liệu Menu thành công"
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title'        => 'required|max:150',
            'isactive'     => 'required|boolean',
            'link'         => 'nullable|max:250',
            'levels'       => 'nullable|integer',
            'parentid'     => 'nullable|integer',
            'position'     => 'nullable|integer',
        ], [
            'title.required' => 'Tên menu không được để trống.',
            'isactive.required' => 'Trạng thái menu không được để trống.',
        ]);

        $menu = Menu::find($id);

        if ($menu == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Menu này không tồn tại"
            ], 404);
        }

        $data = $request->only([
            'title',
            'isactive',
            'link',
            'levels',
            'parentid',
            'position',
            'modifieddate'
        ]);

        try {
            $menu->update($data);
            return response()->json([
                "success" => true,
                "data" => $menu,
                "message" => "Cập nhật Menu thành công"
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Cập nhật Menu không thành công"
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $menu = Menu::find($id);

        if ($menu == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Menu này không tồn tại"
            ], 404);
        }

        try {
            $menu->delete();
            return response()->json([
                "success" => true,
                "data" => $menu,
                "message" => "Xóa Menu thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Xóa Menu không thành công"
            ], 500);
        }
    }
    public function isactive($id)
    {
        $Menu = Menu::find($id);
        
        if($Menu==null){
            return response()->json([
                "status"=>true,
                "data"=>[],
                "message"=>"Không tồn tại menu này"
            ],404);
        }
        try{
            $Menu->isactive = !$Menu->isactive;
            $Menu->save();
            return response()->json([
                "status"=>true,
                "data"=>$Menu,
                "message"=>"Cập nhật trạng thái menu thành công"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "status"=>false,
                "data"=>[],
                "message"=>"Lỗi không xác định"
            ],500);
        }
    }
}
