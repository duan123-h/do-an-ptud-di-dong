<?php

namespace App\Http\Controllers;

use App\Models\ImagingResult;
use App\Models\Servicerequestdetail;
use Illuminate\Http\Request;

class ImagingResultController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "description" => "required",
            "conclusion"  => "required",
            "resultimage" => "required",
        ], [
            "description.required" => "Mô tả kết quả không được để trống",
            "conclusion.required"  => "Kết luận không được để trống",
            "resultimage.required" => "Hình ảnh kết quả CLS không được để trống",
        ]);

        $servicerequestdetail = Servicerequestdetail::find($id);

        if (!$servicerequestdetail) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Không tồn tại phiếu CLS này"
            ], 404);
        }

        if ($servicerequestdetail->status == 0) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Vui lòng bắt đầu thực hiện CLS trước khi lưu kết quả"
            ], 400);
        }

        if ($servicerequestdetail->status == 2) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Phiếu CLS đã kết thúc, không thể lưu kết quả"
            ], 400);
        }

        $imagingResult = ImagingResult::updateOrCreate(
            [
                "servicerequestdetailid" => $id
            ],
            [
                "description" => $validated["description"],
                "conclusion"  => $validated["conclusion"],
                "resultimage" => $validated["resultimage"]
            ]
        );

        return response()->json([
            "status" => true,
            "data" => $imagingResult,
            "message" => "Cập nhật kết quả chẩn đoán hình ảnh thành công"
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
