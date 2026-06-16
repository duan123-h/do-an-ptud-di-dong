<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use Exception;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query("limit", null);
        $status = $request->query("status", null);
        $query = Slider::query()->orderBy('displayorder', 'asc');;
        if (!is_null($status)) {
            $query->where("isactive", $status);
        }
        if ($limit == null) {
            $data = $query->get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu Slider thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastPage(),
                'data' => $data->items(),
                "message" => "Lấy dữ liệu Slider thành công"
            ], 200);
        }
    }
    public function store(Request $request)
    {
        $request->validate([
            'imagepath'     => 'nullable|max:255',
            'title'         => 'nullable|max:255',
            'description'   => 'nullable',
            'isactive'      => 'required|boolean',
            'displayorder'  => 'nullable|integer|min:0',
        ], [
            'isactive.required' => 'Trạng thái không được để trống.',
        ]);

        $data = $request->only([
            'imagepath',
            'title',
            'description',
            'isactive',
            'displayorder',
        ]);

        try {
            $data['createddate']=now();
            $newSlider = Slider::create($data);

            return response()->json([
                "success" => true,
                "data" => $newSlider,
                "message" => "Thêm Slider thành công"
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Thêm Slider không thành công"
            ], 500);
        }
    }

    /**
     * Display a specific slider.
     */
    public function show(string $id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Slider không tồn tại"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $slider,
            "message" => "Lấy dữ liệu Slider thành công"
        ], 200);
    }

    /**
     * Update slider.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'imagepath'     => 'nullable|max:255',
            'title'         => 'nullable|max:255',
            'description'   => 'nullable',
            'isactive'      => 'required|boolean',
            'displayorder'  => 'nullable|integer|min:0',
        ]);

        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Slider không tồn tại"
            ], 404);
        }

        $data = $request->only([
            'imagepath',
            'title',
            'description',
            'isactive',
            'displayorder',
        ]);

        try {
            $slider->update($data);

            return response()->json([
                "success" => true,
                "data" => $slider,
                "message" => "Cập nhật Slider thành công"
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Cập nhật Slider không thành công"
            ], 500);
        }
    }

    /**
     * Remove slider.
     */
    public function destroy(string $id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Slider không tồn tại"
            ], 404);
        }

        try {
            $slider->delete();
            return response()->json([
                "success" => true,
                "data" => $slider,
                "message" => "Xóa Slider thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Xóa Slider không thành công"
            ], 500);
        }
    }

    /**
     * Toggle isactive.
     */
    public function isactive($id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Slider không tồn tại"
            ], 404);
        }

        try {
            $slider->isactive = !$slider->isactive;
            $slider->save();

            return response()->json([
                "status" => true,
                "data" => $slider,
                "message" => "Cập nhật trạng thái Slider thành công"
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi không xác định"
            ], 500);
        }
    }
}
