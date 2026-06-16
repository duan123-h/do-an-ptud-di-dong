<?php

namespace App\Http\Controllers;

use App\Models\ExportDetail;
use App\Models\ExportReceipt;
use App\Models\Inventory;
use App\Models\Prescription;
use App\Models\PrescriptionDetail;
use App\Models\WarehouseManager;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExportController extends Controller
{
    public function exportPrescription(Request $request)
    {
        $request->validate([
            'prescriptionid' => 'required|exists:tblprescription,prescriptionid',
            'items'          => 'required|array|min:1',
            'items.*.batchid' => 'required',
            'items.*.prescriptiondetailid' => 'required',
        ], [
            'prescriptionid.required' => 'Mã đơn thuốc không được để trống',
            'items.required' => 'Danh sách thuốc/vật tư không được để trống',
            'items.*.batchid.required' => 'Mã số lô nhập không được để trống',
            'items.*.prescriptiondetailid.required' => 'Mã chi tiết phiếu thuốc không được để trống',
        ]);
        try {
            DB::beginTransaction();
            $Prescription = Prescription::where('prescriptionid', $request->prescriptionid)
                ->lockForUpdate()
                ->first();
            $Prescription->update(['isdispensed' => 1]);
            $userid = auth()->user()->userid;
            $warehousemanager = WarehouseManager::where("userid", $userid)->first();
            if (!$warehousemanager) {
                DB::rollBack();
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Tài khoản chưa được chỉ định quản lý kho nhất định!!!"
                ], 400);
            }
            $exportReceipt = ExportReceipt::create([
                'warehouseid' => $warehousemanager->warehouseid,
                'userid'      => $userid,
                'exportdate'  => now(),
                'totalamount' => 0,
                'note'        => $request->note ?? 'Xuất dược theo đơn thuốc',
                'status'      => 1,
            ]);
            $totalAmount = 0;
            foreach ($request->items as $item) {
                $detail = PrescriptionDetail::with(['medicine'])->find($item['prescriptiondetailid']);
                if (!$detail) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'data' => [],
                        'message' => "Chi tiết phiếu thuốc {$item['prescriptiondetailid']} không tồn tại"
                    ], 422);
                }
                $inventory = Inventory::with(['batch'])->where('batchid', $item['batchid'])->lockForUpdate()->first();
                if (!$inventory) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'data' => [],
                        'message' => "Mã tồn kho không hợp lệ"
                    ], 422);
                }
                $alreadyExported = ExportDetail::where('prescriptiondetailid', $item['prescriptiondetailid'])->exists();
                if ($alreadyExported) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'data' => [],
                        'message' => "Thuốc {$detail->medicine->name} đã được xuất trước đó"
                    ], 422);
                }
                if ($inventory->stockquantity < $detail->quantity) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'data' => [],
                        'message' => "Tồn kho của thuốc {$inventory->medicine->name} không đủ (còn {$inventory->stockquantity}, yêu cầu {$detail->quantity})"
                    ], 422);
                }
                $totalPrice = $detail->quantity * $inventory->batch->unitprice;
                ExportDetail::create([
                    'exportreceiptid' => $exportReceipt->exportreceiptid,
                    'medicineid'      => $detail->medicineid,
                    'batchid'     => $item['batchid'],
                    'prescriptiondetailid' => $item['prescriptiondetailid'],
                    'quantity'        => $detail->quantity,
                    'unitprice'       => $inventory->batch->unitprice,
                ]);
                $inventory->stockquantity -= $detail->quantity;
                $inventory->lastupdate = now();
                $inventory->save();
                $totalAmount += $totalPrice;
            }
            $exportReceipt->update(['totalamount' => $totalAmount]);
            DB::commit();
            return response()->json([
                'status'  => true,
                'data'    => ['exportreceiptid' => $exportReceipt->exportreceiptid],
                'message' => 'Xuất thuốc theo đơn thành công'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => false,
                'data'    => [],
                'message' => 'Lỗi khi xuất thuốc: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroyExportPrescription(Request $request)
    {
        $request->validate([
            'prescriptionid' => 'required|exists:tblprescription,prescriptionid',
            'items' => 'required|array|min:1',
            'items.*.prescriptiondetailid' => 'required',
        ], [
            'prescriptionid.required' => 'Mã đơn thuốc không được để trống',
            'items.required' => 'Danh sách thuốc cần hủy không được để trống',
            'items.*.prescriptiondetailid.required' => 'Mã chi tiết phiếu thuốc không được để trống',
        ]);

        try {
            DB::beginTransaction();
            $prescription = Prescription::where('prescriptionid', $request->prescriptionid)
                ->lockForUpdate()
                ->first();
            foreach ($request->items as $item) {
                $detail = PrescriptionDetail::with(['medicine'])->find($item['prescriptiondetailid']);
                if (!$detail) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'data' => [],
                        'message' => "Chi tiết phiếu thuốc {$item['prescriptiondetailid']} không tồn tại"
                    ], 422);
                }
                $exportDetail = ExportDetail::where('prescriptiondetailid', $item['prescriptiondetailid'])
                    ->lockForUpdate()
                    ->first();

                if (!$exportDetail) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'data' => [],
                        'message' => "Thuốc {$detail->medicine->name} chưa được xuất trước đó"
                    ], 422);
                }

                $inventory = Inventory::where('batchid', $exportDetail->batchid)
                    ->lockForUpdate()
                    ->first();

                if (!$inventory) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'data' => [],
                        'message' => "Không tìm thấy tồn kho"
                    ], 422);
                }

                $inventory->stockquantity += $exportDetail->quantity;
                $inventory->lastupdate = now();
                $inventory->save();
                $exportReceiptId = $exportDetail->exportreceiptid;
                $exportDetail->delete();
                $remainDetail = ExportDetail::where('exportreceiptid', $exportReceiptId)->exists();
                if (!$remainDetail) {
                    ExportReceipt::where('exportreceiptid', $exportReceiptId)
                        ->delete();
                }
            }
            $stillExported = ExportDetail::whereHas('prescriptiondetail', function ($q) use ($prescription) {
                $q->where('prescriptionid', $prescription->prescriptionid);
            })->exists();

            if (!$stillExported) {
                $prescription->update(['isdispensed' => 0]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'data' => [],
                'message' => 'Hủy xuất dược theo đơn thành công'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Lỗi khi hủy xuất: ' . $e->getMessage()
            ], 500);
        }
    }
}
