<?php

namespace App\Http\Controllers;

use App\Models\UserDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserDeviceController extends Controller
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function saveUserDevice(Request $request)
    {
        $request->validate([
            'deviceid' => 'required|string',
        ]);
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tìm thấy người dùng"
            ], 401);
        }

        $userid = $user->userid;

        $device = UserDevice::where('userid', $userid)
            ->where('deviceid', $request->deviceid)
            ->first();

        if ($device) {

            $device->devicename = $request->devicename ?? $device->devicename;
            $device->platform    = $request->platform ? strtolower($request->platform) : $device->platform;
            $device->pushtoken   = $request->pushtoken ?? $device->pushtoken;
            $device->isactive    = $request->isactive ?? $device->isactive;
            $device->lastseen    = now();

            $device->save();

            $message = "Cập nhật thiết bị thành công";
        } else {

            $device = UserDevice::create([
                'userid'     => $userid,
                'deviceid'   => $request->deviceid,
                'devicename' => $request->devicename,
                'platform'   => strtolower($request->platform ?? ''),
                'pushtoken'  => $request->pushtoken,
                'isactive'   => $request->isactive ?? 1,
                'lastseen'   => now(),
            ]);

            $message = "Tạo thiết bị thành công";
        }

        return response()->json([
            "success" => true,
            "data" => $device,
            "message" => $message
        ], 200);
    }
}
