<?php

namespace App\Http\Controllers;

use App\Models\LabResultDetail;
use App\Models\Servicerequestdetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LabResultDetailController extends Controller
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "results" => "required|array",
            "results.*.labparameterid" => "required|integer",
            "results.*.resultvalue" => "nullable|string",
            "results.*.flag" => "nullable|string",
        ], [
            "results.required" => "Kết quả CLS không được để trống",
            "results.array" => "Dữ liệu kết quả không hợp lệ",
        ]);

        $servicerequestdetail = Servicerequestdetail::find($id);

        if ($servicerequestdetail == null) {
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

        DB::beginTransaction();

        try {
            LabResultDetail::where('servicerequestdetailid', $id)->delete();

            foreach ($validated['results'] as $item) {
                LabResultDetail::create([
                    'servicerequestdetailid' => $id,
                    'labparameterid' => $item['labparameterid'],
                    'resultvalue' => $item['resultvalue'] ?? null,
                    'flag' => $item['flag'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                "status" => true,
                "data" => true,
                "message" => "Cập nhật kết quả CLS thành công"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Có lỗi xảy ra: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
