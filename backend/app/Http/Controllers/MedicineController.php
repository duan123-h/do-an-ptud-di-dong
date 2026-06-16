<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Exception;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query("limit", null);

        if ($limit == null) {
            $data = Medicine::with(['dosageform','manufacturer'])->get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy danh sách thuốc thành công"
            ], 200);
        } else {
            $data = Medicine::with(['dosageform','manufacturer'])->paginate($limit);
            return response()->json([
                "success" => true,
                "totalpage" => $data->lastPage(),
                "data" => $data->items(),
                "message" => "Lấy danh sách thuốc thành công"
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
        $request->validate([
            'name' => 'required|unique:tblmedicine,name',
            'activeingredients' => 'required',
            'dosageformid' => 'required|exists:tbldosageform,dosageformid',
            'indications' => 'required',
            'dosage' => 'required',
            'expirationdate' => 'required|date',
            'manufacturername' => 'required',
            'manufactureraddress' => 'required',
        ], [
            'name.required' => 'Tên thuốc không được để trống.',
            'name.unique' => 'Tên thuốc đã tồn tại.',
            'activeingredients.required' => 'Thành phần hoạt chất không được để trống.',
            'dosageformid.required' => 'Dạng bào chế không được để trống.',
            'dosageformid.exists' => 'Dạng bào chế không hợp lệ.',
            'indications.required' => 'Chỉ định không được để trống.',
            'dosage.required' => 'Liều dùng không được để trống.',
            'expirationdate.required' => 'Ngày hết hạn không được để trống.',
            'expirationdate.date' => 'Ngày hết hạn không đúng định dạng.',
            'manufacturername.required' => 'Tên nhà sản xuất không được để trống.',
            'manufactureraddress.required' => 'Địa chỉ nhà sản xuất không được để trống.',
        ]);

        $medicine = $request->only([
            'name',
            'activeingredients',
            'dosageformid',
            'indications',
            'dosage',
            'contraindications',
            'precautions',
            'pregnancybreastfeeding',
            'drivingmachineuse',
            'interactions',
            'sideeffects',
            'overdosetreatment',
            'packaging',
            'storageconditions',
            'expirationdate',
            'qualitystandards',
            'manufacturername',
            'manufactureraddress',
        ]);
        try {
            $newMedicine = Medicine::create($medicine);
            return response()->json([
                "success" => true,
                "data" => $newMedicine,
                "message" => "Thêm mới thuốc thành công"
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Thêm mới thuốc không thành công"
            ], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $medicine = Medicine::with('dosageform')->find($id);

        if ($medicine == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tồn tại thuốc có ID này"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $medicine,
            "message" => "Lấy dữ liệu thuốc thành công"
        ], 200);
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
        $medicine = Medicine::find($id);
        if ($medicine == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Thuốc này không tồn tại"
            ], 404);
        }

        $request->validate([
            'name' => "required|unique:tblmedicine,name,{$id},medicineid",
            'activeingredients' => 'required',
            'dosageformid' => 'required|exists:tbldosageform,dosageformid',
            'indications' => 'required',
            'dosage' => 'required',
            'manufacturerid' => 'required',
        ], [
            'name.required' => 'Tên thuốc không được để trống.',
            'name.unique' => 'Tên thuốc đã tồn tại.',
            'activeingredients.required' => 'Thành phần hoạt chất không được để trống.',
            'dosageformid.required' => 'Dạng bào chế không được để trống.',
            'dosageformid.exists' => 'Dạng bào chế không hợp lệ.',
            'indications.required' => 'Chỉ định không được để trống.',
            'dosage.required' => 'Liều dùng không được để trống.',
            'manufacturerid.required' => 'Mã nhà sản xuất không được để trống.',
        ]);

        $data = $request->only([
            'name',
            'activeingredients',
            'dosageformid',
            'indications',
            'dosage',
            'contraindications',
            'precautions',
            'pregnancybreastfeeding',
            'drivingmachineuse',
            'interactions',
            'sideeffects',
            'overdosetreatment',
            'packaging',
            'storageconditions',
            'qualitystandards',
            'manufacturerid',
        ]);

        try {
            $medicine->update($data);
            return response()->json([
                "success" => true,
                "data" => $medicine,
                "message" => "Cập nhật thuốc thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Cập nhật thuốc không thành công"
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $medicine = Medicine::find($id);
        if ($medicine == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Thuốc này không tồn tại"
            ], 404);
        }

        try {
            $medicine->delete();
            return response()->json([
                "success" => true,
                "data" => $medicine,
                "message" => "Xóa thuốc thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Xóa thuốc không thành công"
            ], 500);
        }
    }
}
