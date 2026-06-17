<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Warehouse;
use App\Models\WarehouseManager;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->get("limit");
        if ($limit == null) {
            $query=Warehouse::with(["usermanagers.staffprofile"])->get();
            $data = $query->map(function ($item) {
                $t = $item->getAttributes();
                if($item->usermanagers){
                    $t["usermanagers"]=$item->usermanagers->map(function ($item1){
                        return $item1?->staffprofile;
                    });
                }else{
                    $t["usermanagers"]=[];
                }
                return $t;
            });
            return response()->json([
                "status" => true,
                "data" =>$data,
                "message" => "lấy dữ liệu kho thành công"
            ], 200);
        } else {
            $data = Warehouse::with(["usermanagers.staffprofile"])->paginate($limit);
            return response()->json([
                "status" => true,
                "data" => $data->items(),
                "totalpage" => $data->lastpage(),
                "message" => "lấy dữ liệu kho thành công"
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
        $validate = $request->validate([
            'name' => 'required|unique:tblwarehouse,name',
            'location' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:255',
            'isactive' => 'nullable|boolean',
            'users' => 'nullable|array',
            'users.*.userid' => [
                'required',
                'integer',
                'exists:tbluser,userid',
                function ($attribute, $value, $fail) {
                    $WarehouseManager = WarehouseManager::with('user')->where("userid", $value)->first();
                    if ($WarehouseManager) {
                        $fail("Người dùng [{$WarehouseManager->user->userid}]-{$WarehouseManager->user->name} đã được phân công ở một kho khác.");
                    }
                }
            ],
        ], [
            'name.required' => 'Tên kho không được để trống.',
            'name.unique' => 'Tên kho này đã tồn tại.',
            'location.max' => 'Vị trí kho không được vượt quá 255 ký tự.',
            'note.max' => 'Ghi chú không được vượt quá 255 ký tự.',
            'isactive.boolean' => 'Trạng thái kho phải là true hoặc false.',
            'users.array' => 'Danh sách người quản lý phải là một mảng.',
            'users.*.userid.required' => 'Mỗi người quản lý phải có userid.',
            'users.*.userid.integer' => 'Userid phải là số nguyên.',
            'users.*.userid.exists' => 'Người quản lý này không tồn tại trong hệ thống.',
        ]);
        $users = $validate['users'];
        $warehouse = Warehouse::create([
            'name' => $validate['name'],
            'location' => $validate['location'] ?? null,
            'note' => $validate['note'] ?? null,
            'isactive' => $validate['isactive'] ?? true,
            'createdat' => now(),
            'updatedat' => now(),
        ]);
        foreach ($users as $u) {
            WarehouseManager::create([
                'warehouseid' => $warehouse->warehouseid,
                'userid' => $u['userid'],
            ]);
        }
        $warehouse->load('usermanagers');
        return response()->json([
            "status" => false,
            "data" => $warehouse,
            "message" => "Tạo kho quản lý được thành công!"
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $warehouse = Warehouse::with(["usermanagers" => function ($q) {
                $q->Select('tbluser.userid');
            }])->find($id);
            if (!$warehouse) {
                return response()->json([
                    "status" => true,
                    "data" => [],
                    "message" => "Không tồn tại kho này!"
                ], 404);
            }
            return response()->json([
                "status" => true,
                "data" => $warehouse,
                "message" => "Lấy dữ liệu kho thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Lỗi không xác định",
            ], 500);
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
        $warehouse = Warehouse::with(["usermanagers"])->find($id);
        if (!$warehouse) {
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Không tồn tại kho này!"
            ], 404);
        }
        $validate = $request->validate([
            'name' => "required|unique:tblwarehouse,name,{$id},warehouseid",
            'location' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:255',
            'isactive' => 'nullable|boolean',
            'users' => 'nullable|array',
            'users.*.userid' => [
                'required',
                'integer',
                'exists:tbluser,userid',
                function ($attribute, $value, $fail) use ($warehouse) {
                    $WarehouseManager = WarehouseManager::with('user')->where("userid", $value)->whereNot('warehouseid', $warehouse->warehouseid)->first();
                    if ($WarehouseManager) {
                        $fail("Người dùng [{$WarehouseManager->user->userid}]-{$WarehouseManager->user->name} đã được phân công ở một kho khác.");
                    }
                }
            ],
        ], [
            'name.required' => 'Tên kho không được để trống.',
            'name.unique' => 'Tên kho này đã tồn tại.',
            'location.max' => 'Vị trí kho không được vượt quá 255 ký tự.',
            'note.max' => 'Ghi chú không được vượt quá 255 ký tự.',
            'isactive.boolean' => 'Trạng thái kho phải là true hoặc false.',
            'users.array' => 'Danh sách người quản lý phải là một mảng.',
            'users.*.userid.required' => 'Mỗi người quản lý phải có userid.',
            'users.*.userid.integer' => 'Userid phải là số nguyên.',
            'users.*.userid.exists' => 'Người quản lý này không tồn tại trong hệ thống.',
        ]);
        try {
            DB::beginTransaction();
            $warehouse->updatedat = now();
            $warehouse->isactive = $validate['isactive'];
            $warehouse->note = $validate['note'];
            $warehouse->save();
            $users = $validate['users'] ?? [];
            $userids = collect($users)->pluck('userid')->toArray();

            WarehouseManager::where('warehouseid', $id)
                ->whereNotIn('userid', $userids)
                ->delete();
            foreach ($users as $u) {
                $detail = WarehouseManager::where('warehouseid', $warehouse->warehouseid)
                    ->where('userid', $u['userid'])
                    ->first();

                if (!$detail) {
                    WarehouseManager::create([
                        'warehouseid' => $warehouse->warehouseid,
                        'userid' => $u['userid'],
                    ]);
                }
            }
            $warehouse = $warehouse->fresh('usermanagers');
            DB::commit();
            return response()->json([
                "status" => true,
                "data" => $warehouse,
                "message" => "Cập nhật danh sách người quản lý kho thành công!"
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi không xác định"
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $warehouse = Warehouse::find($id);
            if (!$warehouse) {
                return response()->json([
                    "status" => true,
                    "data" => [],
                    "message" => "Không tồn tại kho này!"
                ], 404);
            }
            DB::beginTransaction();
            WarehouseManager::where('warehouseid', $id)
                ->delete();
            $warehouse->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi không xác định"
            ], 500);
        }
    }
    public function isactive($id)
    {
        $warehouse = warehouse::find($id);

        if ($warehouse == null) {
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Không tồn tại kho này"
            ], 404);
        }
        try {
            $warehouse->isactive = !$warehouse->isactive;
            $warehouse->save();
            return response()->json([
                "status" => true,
                "data" => $warehouse,
                "message" => "Cập nhật trạng thái kho thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Cập nhật trạng thái kho không thành công"
            ], 500);
        }
    }
}
