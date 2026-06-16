<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Medicine;
use App\Models\WarehouseManager;
use Illuminate\Http\Request;

class InventoryController extends Controller
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
            $data = Medicine::select("tblmedicine.medicineid", "tblmedicine.name")->whereHas('inventories')->with(['inventories' => function ($query) use ($warehouseid) {
                $query->where('warehouseid', $warehouseid)
                    ->select('inventoryid', 'medicineid','stockquantity', 'warehouseid','batchid');
            }, 'inventories.batch','inventories.supplier'])->withSum(
                ['inventories as totalstockquantity' => function ($query) use ($warehouseid) {
                    $query->where('warehouseid', $warehouseid);
                }],
                'stockquantity'
            )->get();

            return response()->json([
                "status" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu thuốc tồn kho thành công"
            ], 200);
        }
        $data = Medicine::select("tblmedicine.medicineid", "tblmedicine.name")->whereHas('inventories')->with(['inventories' => function ($query) use ($warehouseid) {
            $query->where('warehouseid', $warehouseid)
                ->select('inventoryid', 'medicineid', 'lotnumber', 'expirationdate', 'stockquantity', 'warehouseid');
        }])->withSum(
            ['inventories as totalstockquantity' => function ($query) use ($warehouseid) {
                $query->where('warehouseid', $warehouseid);
            }],
            'stockquantity'
        )
            ->paginate($limit);

        return response()->json([
            "status" => true,
            "data" => $data->items(),
            "totalpage" => $data->lastPage(),
            "message" => "Lấy dữ liệu thuốc tồn kho thành công"
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function medicines(Request $request, string $id)
    {
        if ($id == null) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi khi truyền tham số"
            ], 400);
        }

        $limit = $request->get('limit', null);
        $search = $request->get('search', null);
        $query = Medicine::select(
            "tblmedicine.medicineid",
            "tblmedicine.name",
            "tblmedicine.activeingredients"
        )
            ->whereHas('inventories', function ($q) use ($id) {
                $q->where('warehouseid', $id);
            })
            ->withSum(
                ['inventories as totalstockquantity' => function ($q) use ($id) {
                    $q->where('warehouseid', $id);
                }],
                'stockquantity'
            )
            ->with(['inventories' => function ($q) use ($id) {
                $q->where('warehouseid', $id)
                    ->with('warehouse:warehouseid,name');
            }]);
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('tblmedicine.name', 'LIKE', "%$search%")
                    ->orWhere('tblmedicine.activeingredients', 'LIKE', "%$search%");
            });
        }
        if ($limit === null) {
            $data = $query->get();
            $data->transform(function ($medicine) {
                $warehouseData = null;

                if ($medicine->inventories->isNotEmpty()) {
                    $firstInventory = $medicine->inventories->first();
                    $warehouseData = [
                        'warehouseid' => $firstInventory->warehouse->warehouseid,
                        'warehousename' => $firstInventory->warehouse->name
                    ];
                }
                $medicine->setAttribute('warehouse', $warehouseData);
                unset($medicine->inventories);

                return $medicine;
            });

            return response()->json([
                "status" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu thuốc tồn kho thành công"
            ], 200);
        }
        $data = $query->paginate($limit);
        $data->getCollection()->transform(function ($medicine) {
            $warehouseData = null;

            if ($medicine->inventories->isNotEmpty()) {
                $firstInventory = $medicine->inventories->first();
                $warehouseData = [
                    'warehouseid' => $firstInventory->warehouse->warehouseid,
                    'warehousename' => $firstInventory->warehouse->name
                ];
            }

            $medicine->setAttribute('warehouse', $warehouseData);
            unset($medicine->inventories);

            return $medicine;
        });
        return response()->json([
            "status"    => true,
            "data"      => $data->items(),
            "totalpage" => $data->lastPage(),
            "message"   => "Lấy dữ liệu thuốc tồn kho thành công"
        ], 200);
    }
}
