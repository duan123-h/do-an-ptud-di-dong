<?php

namespace App\Http\Controllers\auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (!$token = Auth::attempt($credentials)) {
            return response()->json([
                "status"=>true,
                'message' => 'Sai tài khoản hoặc mật khẩu',
                "token" =>"",
                "data" => []
            ], 401);
        }
        /** @var \App\Models\User|null $user */
        $user=Auth::user();
        if ($user->usertype == 1) {
            $user->load('patientprofile');
        } elseif ($user->usertype == 2) {
            $user->load('staffprofile');
        }
        $data = [
            'userid'        => $user->userid,
            'username'     => $user->username,
            'usertype'  => $user->usertype,
            'profile'   => $user->patientprofile??$user->staffprofile  ?? null,
        ];
        // $data["rolename"]=$user->role->name;
        return response()->json([
            "status"=>true,
            'message' => 'Đăng nhập thành công',
            "token" => $token,
            "data" => $data
        ]);
    }
    public function user()
    {
        $data=Auth::user();
        $data["rolename"]=Auth::user()?->role?->name;
        return response()->json([
            "success" => true,
            "data"=>$data,
            "message"=>"Lấy thông tin người dùng thành công"
        ],200);
    }
}
