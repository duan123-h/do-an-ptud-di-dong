<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\ImportDetail;
use App\Models\ImportReceipt;
use App\Models\Inventory;
use App\Models\WarehouseManager;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImportReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit', null);
        $userid = auth()->user()->userid;
        $warehouse = WarehouseManager::where('userid', $userid)->first();
        if (!$warehouse) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Ban chưa được chỉ định quản lý một kho cụ thể"
            ], 403);
        }
        $warehouseid = $warehouse->warehouseid;
        if ($limit === null) {
            $data = ImportReceipt::where('warehouseid', $warehouseid)->select("importreceiptid", "importdate", "totalamount", "note", "status", "warehouseid", "userid")->with(['warehouse' => function ($q) {
                $q->select("tblwarehouse.warehouseid", "tblwarehouse.name");
            }, 'user' => function ($q) {
                $q->select("tbluser.userid", "tbluser.name");
            }, 'details', 'details.medicine' => function ($q) {
                $q->select("tblmedicine.medicineid", "name");
            }, 'details.batch', 'details.supplier'])->get();

            return response()->json([
                "status" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu phiếu nhập dược thành công"
            ], 200);
        }
        $data = ImportReceipt::where('warehouseid', $warehouseid)->select("importreceiptid", "importdate", "totalamount", "note", "status", "warehouseid", "userid")->with(['warehouse' => function ($q) {
            $q->select("tblwarehouse.warehouseid", "tblwarehouse.name");
        }, 'user' => function ($q) {
            $q->select("tbluser.userid", "tbluser.name");
        }, 'details', 'details.medicine' => function ($q) {
            $q->select("tblmedicine.medicineid", "name");
        }, 'details.batch'])->paginate($limit);

        return response()->json([
            "status" => true,
            "data" => $data->items(),
            "totalpage" => $data->lastPage(),
            "message" => "Lấy dữ liệu phiếu nhập dược thành công"
        ], 200);
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
        $userid = auth()->user()->userid;
        $warehousemanager = WarehouseManager::where("userid", $userid)->first();
        if (!$warehousemanager) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Tài khoản chưa được chỉ định quản lý kho nhất định!!!"
            ], 400);
        }
        $validate = $request->validate([
            'details' => 'required|array|min:1',
            'details.*.lotnumber' => 'required|string|max:20',
            'details.*.medicineid' => 'required|exists:tblmedicine,medicineid',
            'details.*.quantity' => 'required|integer|min:1',
            'details.*.unitprice' => 'required|numeric|min:0',
            'details.*.expirationdate' => 'nullable|date',
            'details.*.supplierid' => 'required|exists:tblsupplier,supplierid',
        ], [
            'details.required' => 'Vui lòng nhập chi tiết phiếu',
            'details.array' => 'Chi tiết phiếu phải là một mảng',
            'details.*.lotnumber.required' => 'Số lô không được bỏ trống',
            'details.*.medicineid.exists' => 'Thuốc không tồn tại',
            'details.*.medicineid.required' => 'Thuốc không được để trống',
            'details.*.quantity.required' => 'Số lượng không được bỏ trống',
            'details.*.unitprice.required' => 'Đơn giá không được bỏ trống',
            'details.*.expirationdate.date' => 'Ngày hết hạn không hợp lệ',
            'details.*.supplierid.required' => 'Nhà cung cấp không được bỏ trống',
            'details.*.supplierid.exists' => 'Nhà cung cấp không tồn tại',
        ]);

        try {
            DB::beginTransaction();
            $details = $validate['details'];
            $importReceipt = ImportReceipt::create([
                'warehouseid' => $warehousemanager->warehouseid,
                'userid' => $userid,
                'importdate' => now(),
                'totalamount' => 0,
                'note' => $request->note ?? null,
                'status' => 0
            ]);
            $totalAmount = 0;
            foreach ($details as $d) {
                $batch = Batch::create(
                    [
                        'lotnumber' => $d['lotnumber'],
                        'medicineid' => $d['medicineid'],
                        'quantity' => $d['quantity'],
                        'unitprice' => $d['unitprice'],
                        'expirationdate' => $d['expirationdate'] ?? null,
                        'supplierid' => $d['supplierid']
                    ]
                );
                $importDetail = ImportDetail::create([
                    'importreceiptid' => $importReceipt->importreceiptid,
                    'batchid' => $batch->batchid,
                    'totalprice' => $batch->quantity * $batch->unitprice,
                ]);
                $totalAmount += $importDetail->totalprice;
            }
            $importReceipt->update(['totalamount' => $totalAmount]);
            $data = ImportDetail::with('medicine')->where('importreceiptid', $importReceipt->importreceiptid)->get();
            DB::commit();
            return response()->json([
                "status" => true,
                "data" => $data,
                "importreceiptid" => $importReceipt->importreceiptid,
                "message" => "Tạo phiếu nhập kho thành công!"
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi máy chủ"
            ], 500);
        }
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            $importReceipt = ImportReceipt::find($id);
            if (!$importReceipt) {
                DB::rollBack();
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Không tồn tại phiếu nhập kho!"
                ], 404);
            }
            if ($importReceipt->status==1) {
                DB::rollBack();
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Phiếu đã nhập kho không thể xóa!"
                ], 400);
            }
            $data=ImportDetail::with('batch')->where('importreceiptid', $importReceipt->importreceiptid)->get();
            foreach ($data as $idetail) {
                if($idetail->batch){
                    $idetail->batch->delete();
                }
                 $idetail->delete();
            }
            $importReceipt->delete();
            DB::commit();
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Xóa phiếu nhập kho thành công!"
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi máy chủ: {$e->getMessage()}"
            ], 500);
        }
    }
    public function process(string $id)
    {
        try {
            DB::beginTransaction();
            $userid = auth()->user()->userid;
            $warehousemanager = WarehouseManager::where("userid", $userid)->first();
            if (!$warehousemanager) {
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Tài khoản chưa được chỉ định quản lý kho nhất định!!!"
                ], 400);
            }
            $importReceipt = ImportReceipt::where("importreceiptid", $id)->first();
            if (!$importReceipt) {
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Không tồn tại phiếu nhập này!!!"
                ], 404);
            }
            if ($importReceipt->status) {
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Phiếu này đã được xác nhận nhập từ trước!!!"
                ], 404);
            }
            if ($warehousemanager->warehouseid != $importReceipt->warehouseid) {
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Tài khoản của bạn chưa được chỉ định để xử lý phiếu nhập này!!!"
                ], 403);
            }
            $importDetail = ImportDetail::where("importreceiptid", $id)->with(['batch'])->get();
            foreach ($importDetail as $importd) {
                // $inventory = Inventory::where("lotnumber", $importd->lotnumber)->where('supplierid', $importd->supplierid)->where("warehouseid", $importReceipt->warehouseid)->where('medicineid', $importd->medicineid)->first();
                // if ($inventory) {
                //     $inventory->stockquantity = $inventory->stockquantity + $importd->quantity;
                //     $inventory->lastupdate = now();
                //     $inventory->expirationdate = $importd->expirationdate;
                //     $inventory->save();
                // } else {
                //     Inventory::create([
                //         "warehouseid" => $importReceipt->warehouseid,
                //         "medicineid" => $importd->medicineid,
                //         "supplierid" => $importd->supplierid,
                //         "lotnumber" => $importd->lotnumber,
                //         "stockquantity" => $importd->quantity,
                //         "lastupdate" => now(),
                //         "expirationdate" => $importd->expirationdate
                //     ]);
                // }
                Inventory::create([
                    "warehouseid" => $importReceipt->warehouseid,
                    "medicineid" => $importd->batch->medicineid,
                    'batchid' => $importd->batchid,
                    "stockquantity" => $importd->batch->quantity,
                    "lastupdate" => now(),
                ]);
            }
            $importReceipt->status = 1;
            $importReceipt->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "data" => $importDetail,
                "message" => "Xác nhận nhập kho thành công!!!"
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi máy chủ: {$e->getMessage()}"
            ], 500);
        }
    }
}
