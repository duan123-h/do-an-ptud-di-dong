<?php

namespace App\Http\Controllers;

use App\Models\Outpatientregistration;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query("limit", null);
        $usertype = $request->query("usertype", null);
        $query = User::query()->with(["staffprofile.department", "patientprofile", "role"]);
        if ($usertype) {
            $query->where("usertype", $usertype);
        }
        if ($limit == null) {
            $data = $query->get()->map(function ($item) {
                $t = $item->getAttributes();
                $t["role"] = $item->role;
                unset($t["password"]);
                if ($item?->usertype == 1) {
                    $t["profile"] = $item?->patientprofile;
                } else {
                    $t["profile"] = $item?->staffprofile;
                }
                return $t;
            });
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu user thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastpage(),
                'data'  => $data->items(),
                "message" => "Lấy dữ liệu user thành công"
            ], 200);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:tbluser,username',
            'email'    => 'required|email|unique:tbluser,email',
            'password' => 'required|string|min:6',
            'name'     => 'required|string',
            'phonenumber'     => 'unique:tbluser,phonenumber',
        ], [
            'username.required' => 'Tên đăng nhập không được để trống.',
            'username.string'   => 'Tên đăng nhập phải là chuỗi.',
            'username.unique'   => 'Tên đăng nhập đã tồn tại.',

            'email.required'    => 'Email không được để trống.',
            'email.email'       => 'Email không hợp lệ.',
            'email.unique'      => 'Email đã tồn tại.',

            'password.required' => 'Mật khẩu không được để trống.',
            'password.string'   => 'Mật khẩu phải là chuỗi.',
            'password.min'      => 'Mật khẩu phải có ít nhất 6 ký tự.',

            'name.required'     => 'Tên người dùng không được để trống.',
            'name.string'       => 'Tên người dùng phải là chuỗi.',

            'phonenumber.unique'  => 'Số điện thoại đã tồn tại.',
        ]);

        $user = $request->only([
            "avatar",
            "name",
            "address",
            "phonenumber",
            "username",
            "password",
            "roleid",
            "email",
            "isactive",
        ]);
        try {
            $user["createddate"] = now();
            $user["password"] = bcrypt($user["password"]);
            $newuser = User::create($user);
            return response()->json([
                "success" => true,
                "data" => $newuser,
                "message" => "Thêm mới người dùng thành công"
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Thêm mới người dùng không thành công"
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with(["staffprofile", "patientprofile", "role"])->find($id);
        if ($user == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tồn tại user"
            ], 404);
        } else {
            $data = $user->getAttributes();
            unset($data["password"]);
            if ($user->usertype == 1) {
                $data["profile"] = $user?->patientprofile;
            } else {
                $data["profile"] = $user?->staffprofile;
            }
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu user thành công"
            ], 200);
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
        $request->validate([
            "email" => "required",
            "phone" => "required",
            'fullname'     => 'required',
        ], [
            "phone.required" => "Số điện thoại không được để trống",
            "email.required" => "Email không được để trống",

            "fullname.required" => "Tên không được để trống",
        ]);
        $user = User::find($id);
        if ($user == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "người dùng này không tồn tại"
            ], 404);
        }
        $data = $request->only([
            "avatar",
            "fullname",
            "address",
            "phone",
            "roleid",
            "email",
            "isactive",
        ]);
        try {
            if ($user->usertype == 1) {

                $profile = $user->parentprofile;
                $profile->avatar = $data["avatar"];
                $profile->fullname = $data["fullname"];
                $profile->address = $data["address"];
                $profile->phone = $data["phone"];
                $profile->email = $data["email"];
                $profile->save();
            } else {

                $profile = $user->staffprofile;
                $profile->avatar = $data["avatar"];
                $profile->fullname = $data["fullname"];
                $profile->address = $data["address"];
                $profile->phone = $data["phone"];
                $profile->email = $data["email"];
                $profile->save();
            }

            $user->roleid = $data["roleid"];
            $user->isactive = $data["isactive"];
            $user->save();
            return response()->json([
                "success" => true,
                "data" => $user,
                "message" => "Cập nhật người dùng thành công"
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Cập nhật người dùng không thành công"
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        if ($user == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "người dùng này không tồn tại"
            ], 404);
        }
        try {
            $user->delete();
            return response()->json([
                "success" => true,
                "data" => $user,
                "message" => "Xóa người dùng thành công"
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Xóa người dùng không thành công"
            ], 500);
        }
    }
    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (!$token = Auth::guard('admin')->attempt($credentials)) {
            return response()->json([
                "status" => false,
                'message' => 'Sai tài khoản hoặc mật khẩu',
                "token" => "",
                "data" => []
            ], 401);
        }
        $user = Auth::guard('admin')->user();
        if (!$user->isactive) {
            return response()->json([
                "status" => false,
                'message' => 'Tài khoản của bạn đã bị vô hiệu hóa!',
                "token" => "",
                "data" => []
            ], 403);
        }

        return response()->json([
            "status" => true,
            'message' => 'Đăng nhập thành công',
            "token" => $token,
            "data" => Auth::guard('admin')->user()
        ]);
    }
    public function user()
    {
        return response()->json([
            "success" => true,
            "data" => Auth::guard('admin')->user(),
            "message" => "Lấy thông tin người dùng thành công"
        ], 200);
    }

    public function profile()
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tìm thấy người dùng"
            ], 401);
        };
        if ($user->usertype == 1) {
            $user->load('patientprofile');
        } elseif ($user->usertype == 2) {
            $user->load('staffprofile');
        }
        try {
            $data = [
                'userid' => $user->userid,
                'username' => $user->username,
                'usertype' => $user->usertype,
                'profile' => $user->patientprofile ?? $user->staffprofile ?? null,
            ];

            return response()->json([
                "success" => true,
                "data" => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Không tìm thấy người dùng"
            ], 401);
        }

        try {
            $dataUpdate = $request->all();
            $profile = null;

            if ($user->usertype == 1) {
                $profile = $user->patientprofile;

                if (!$profile) {
                    return response()->json([
                        "success" => false,
                        "message" => "Không tìm thấy hồ sơ bệnh nhân"
                    ], 404);
                }

                $profile->update($dataUpdate);
                $profile->refresh();

                $responseData = [
                    'userid' => $user->userid,
                    'username' => $user->username,
                    'usertype' => $user->usertype,
                    'profile' => $profile,
                ];
            } elseif ($user->usertype == 2) {
                $profile = $user->staffprofile;

                if (!$profile) {
                    return response()->json([
                        "success" => false,
                        "message" => "Không tìm thấy hồ sơ nhân viên"
                    ], 404);
                }

                $profile->update($dataUpdate);
                $profile->refresh();

                $responseData = [
                    'userid' => $user->userid,
                    'username' => $user->username,
                    'usertype' => $user->usertype,
                    'profile' => $profile,
                ];
            } else {
                return response()->json([
                    "success" => false,
                    "message" => "Loại người dùng không hợp lệ"
                ], 400);
            }

            return response()->json([
                "success" => true,
                "message" => "Cập nhật hồ sơ thành công",
                "data" => $responseData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }
    public function changePassword(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tìm thấy người dùng"
            ], 401);
        }

        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ], [
            'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại',
            'new_password.required' => 'Vui lòng nhập mật khẩu mới',
            'new_password.min' => 'Mật khẩu mới phải có ít nhất 6 ký tự',
            'new_password.confirmed' => 'Xác nhận mật khẩu không khớp',
        ]);

        try {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    "success" => false,
                    "data" => [],
                    "message" => "Mật khẩu hiện tại không đúng"
                ], 400);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                "success" => true,
                "data" => [],
                "message" => "Đổi mật khẩu thành công"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Có lỗi xảy ra",
                "error" => $e->getMessage(),
                "line" => $e->getLine(),
            ], 500);
        }
    }
}
