<?php

namespace App\Http\Controllers;

use App\Models\Outpatientregistration;
use App\Models\Patient;
use App\Models\User;
use App\Services\NotificationService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Throwable;

class OutpatientregistrationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', null);
        $departmentid = $request->query('departmentid', null);
        $outpatientClinicId = $request->get('outpatientclinicid', null);

        $status = $request->query('status', null);

        $query = Outpatientregistration::with([
            'patient',
            'outpatientclinic',
            'medicalexamination',
            'department'
        ]);

        if ($departmentid !== null) {
            $query->where('departmentid', $departmentid);
        }

        if ($outpatientClinicId) {
            $query->where('outpatientclinicid', $outpatientClinicId);
        }
        if ($status !== null) {
            $query->where('examinationstatus', $status);
        }

        if ($limit === null) {
            $data = $query->get();

            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu đăng ký khám thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);

            return response()->json([
                "success" => true,
                "totalpage" => $data->lastPage(),
                "data" => $data->items(),
                "message" => "Lấy dữ liệu đăng ký khám thành công"
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
            'personalid' => 'required',
            'fullname' => 'required',
            'gender' => 'required',
            'address' => 'required',
            'dateofbirth' => 'nullable|date',
            'provinceid' => 'required',
            'communeid' => 'required',
            'hamletid' => 'required',
            'ethnicid' => 'required',
            'phone' => 'required',
            'email' => 'nullable|email',
            'outpatientclinicid' => 'required',
            'departmentid' => 'required'
        ], [
            'personalid.required' => 'Vui lòng nhập số CCCD hoặc CMND.',
            'fullname.required' => 'Vui lòng nhập họ và tên.',
            'gender.required' => 'Vui lòng chọn giới tính.',
            'address.required' => 'Vui lòng nhập địa chỉ.',
            'dateofbirth.date' => 'Ngày sinh không đúng định dạng ngày tháng.',
            'provinceid.required' => 'Vui lòng chọn tỉnh/thành phố.',
            'communeid.required' => 'Vui lòng chọn xã/phường.',
            'hamletid.required' => 'Vui lòng chọn thôn/xóm.',
            'ethnicid.required' => 'Vui lòng chọn dân tộc.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'email.email' => 'Email không đúng định dạng.',
            'outpatientclinicid.required' => 'Vui lòng chọn phòng khám ngoại trú.',
            'departmentid.required' => 'Vui lòng chọn khoa/phòng.'
        ]);
        $validatedData = $request->only([
            'personalid',
            'fullname',
            'gender',
            'address',
            'dateofbirth',
            'provinceid',
            'communeid',
            'hamletid',
            'ethnicid',
            'phone',
            'email',
            'outpatientclinicid',
            'departmentid'
        ]);
        try {
            $patient = Patient::where('personalid', $validatedData['personalid'])->first();

            if (!$patient) {
                $user = User::create([
                    'username' => $validatedData['personalid'],
                    'password' => bcrypt($validatedData['password'] ?? '123456'),
                    'roleid'   => null,
                    'usertype' => 1,
                    'createdat' => now(),
                    'isactive' => 1,
                ]);
                $patient = Patient::create([
                    'userid'       => $user->userid,
                    'personalid' => $validatedData['personalid'],
                    'fullname' => $validatedData['fullname'],
                    'gender' => $validatedData['gender'],
                    'address' => $validatedData['address'],
                    'dateofbirth' => $validatedData['dateofbirth'] ?? null,
                    'provinceid' => $validatedData['provinceid'],
                    'communeid' => $validatedData['communeid'],
                    'hamletid' => $validatedData['hamletid'],
                    'ethnicid' => $validatedData['ethnicid'],
                    'phone' => $validatedData['phone'],
                    'email' => $validatedData['email'] ?? null,
                ]);
            } else {

                $exist = Outpatientregistration::where('patientid', $patient->patientid)
                    ->where('outpatientclinicid', $validatedData['outpatientclinicid'])
                    ->whereIn('examinationstatus', [1, 2])
                    ->first();
                if ($exist) {
                    return response()->json([
                        'status' => false,
                        'data' => [],
                        'message' => 'Bệnh nhân này đang chờ khám hoặc đang khám!'
                    ], 400);
                }
                $patient->update([
                    'fullname' => $validatedData['fullname'],
                    'gender' => $validatedData['gender'],
                    'address' => $validatedData['address'],
                    'dateofbirth' => $validatedData['dateofbirth'] ?? null,
                    'provinceid' => $validatedData['provinceid'],
                    'communeid' => $validatedData['communeid'],
                    'hamletid' => $validatedData['hamletid'],
                    'ethnicid' => $validatedData['ethnicid'],
                    'phone' => $validatedData['phone'],
                    'email' => $validatedData['email'] ?? null,
                ]);
            }
            $maxQueue = Outpatientregistration::where('departmentid', $validatedData['departmentid'])
                ->whereDate('registrationtime', now()->toDateString())
                ->max('queueorder') ?? 0;
            /** @var \App\Models\User|null $user */
            $userauth = Auth::user();
            $opr = Outpatientregistration::create([
                "registrarid" => $userauth->userid,
                'patientid' => $patient->patientid,
                'queueorder' => $maxQueue + 1,
                'examinationstatus' => 1,
                'departmentid' => $validatedData['departmentid'],
                'outpatientclinicid' => $validatedData['outpatientclinicid'],
                'registrationtime' => now(),
            ]);

            $data = [
                'userid' => $patient?->userid,

                'title' => 'Đăng ký khám bệnh thành công',
                'content' => 'Bạn đã đăng ký khám bệnh thành công. Vui lòng chờ đến lượt khám.',

                'image_url' => null,
                'linkurl' => "/patient/outpatient-registration/detail?id={$opr->outpatientregistrationid}",

                'data' => null
            ];

            $tb=app(NotificationService::class)->send($data);

            return response()->json([
                'status' => true,
                'data' => $opr,
                'tb'=>$tb,
                'message' => 'Đăng ký khám thành công'
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'data' => $e,
                'message' => 'Lỗi chưa xác định!'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            if (!$id) {
                return response()->json([
                    'status' => false,
                    'data' => null,
                    'message' => 'Không tìm thấy id đăng ký khám!',
                ], 404);
            }
            $outpatientregistration = Outpatientregistration::with(['patient', 'department', 'outpatientclinic', 'registrar'])->where('outpatientregistrationid', $id)->first();
            if (!$outpatientregistration) {
                return response()->json([
                    'status' => false,
                    'data' => null,
                    'message' => 'Không tìm thấy đăng ký khám!',
                ], 404);
            }
            $data = $outpatientregistration->getAttributes();
            $data['patient'] = $outpatientregistration->patient;
            $data['department'] = $outpatientregistration->department;
            $data['outpatientclinic'] = $outpatientregistration->outpatientclinic;
            $registrar = $outpatientregistration->registrar;
            if ($registrar) {
                if ($registrar->usertype == 1) {
                    $data['registrar'] = $registrar->patientprofile;
                } else {
                    $data['registrar'] = $registrar->staffprofile->load('stafftype');
                }
            } else {
                $data['registrar'] = null;
            }
            return response()->json([
                'status' => true,
                'data' => $data,
                'message' => 'Lấy thông tin đăng ký khám thành công',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'data' => $e->getMessage(),
                'message' => 'Lỗi chưa xác định!',
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
        $outpatientregistration = Outpatientregistration::where('outpatientregistrationid', $id)->firstOrFail();
        if ($outpatientregistration == null) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Không tồn tại phiếu đăng ký khám này',
            ], 404);
        }
        $patient = Patient::where('patientid', $outpatientregistration->patientid)->firstOrFail();
        if ($patient == null) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Không tồn tại bệnh nhân này khám này',
            ], 404);
        }
        $validatedData = $request->validate([
            'personalid' => "required|unique:tblpatient,personalid,{$patient->patientid},patientid",
            'fullname' => 'required',
            'gender' => 'required',
            'address' => 'required',
            'dateofbirth' => 'nullable|date',
            'provinceid' => 'required',
            'communeid' => 'required',
            'hamletid' => 'required',
            'ethnicid' => 'required',
            'phone' => 'required',
            'email' => 'nullable|email',
            'outpatientclinicid' => 'required',
            'departmentid' => 'required',
        ], [
            'personalid.required' => 'Vui lòng nhập số CCCD hoặc CMND.',
            'personalid.unique' => 'Số CCCD/CMND đã tồn tại.',
            'fullname.required' => 'Vui lòng nhập họ và tên.',
            'gender.required' => 'Vui lòng chọn giới tính.',
            'address.required' => 'Vui lòng nhập địa chỉ.',
            'dateofbirth.date' => 'Ngày sinh không đúng định dạng ngày tháng.',
            'provinceid.required' => 'Vui lòng chọn tỉnh/thành phố.',
            'communeid.required' => 'Vui lòng chọn xã/phường.',
            'hamletid.required' => 'Vui lòng chọn thôn/xóm.',
            'ethnicid.required' => 'Vui lòng chọn dân tộc.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'email.email' => 'Email không đúng định dạng.',
            'outpatientclinicid.required' => 'Vui lòng chọn phòng khám ngoại trú.',
            'departmentid.required' => 'Vui lòng chọn khoa/phòng.',
        ]);
        try {
            $patient->update([
                'fullname' => $validatedData['fullname'],
                'personalid' => $validatedData['personalid'],
                'gender' => $validatedData['gender'],
                'dateofbirth' => $validatedData['dateofbirth'] ?? null,
                'address' => $validatedData['address'],
                'provinceid' => $validatedData['provinceid'],
                'communeid' => $validatedData['communeid'],
                'hamletid' => $validatedData['hamletid'],
                'ethnicid' => $validatedData['ethnicid'],
                'phone' => $validatedData['phone'],
                'email' => $validatedData['email'] ?? null,
            ]);
            $outpatientregistration->update([
                'outpatientclinicid' => $validatedData['outpatientclinicid'],
                'departmentid' => $validatedData['departmentid'],
            ]);
            return response()->json([
                'status' => true,
                'data' => $outpatientregistration,
                'message' => 'Cập nhật đăng ký khám thành công',
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'data' => $e->getMessage(),
                'message' => 'Lỗi chưa xác định!',
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $outpatientregistration = Outpatientregistration::where('outpatientregistrationid', $id)->first();
            if (!$outpatientregistration) {
                return response()->json([
                    'status' => false,
                    'data' => null,
                    'message' => 'Không tìm thấy đăng ký khám với ID= ' . $id,
                ], 404);
            }
            if (in_array($outpatientregistration->examinationstatus, [2, 3])) {
                return response()->json([
                    'status' => false,
                    'data' => [],
                    'message' => 'Bệnh nhân này đang khám hoặc đã khám xong!'
                ], 400);
            }
            $outpatientregistration->delete();
            return response()->json([
                'status' => true,
                'data' => null,
                'message' => 'Xóa đăng ký khám thành công',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'data' => $e->getMessage(),
                'message' => 'Lỗi chưa xác định!',
            ], 500);
        }
    }


    //user get

    public function getIndexByUser(Request $request)
    {
        $limit = $request->query('limit', null);
        $departmentid = $request->query('departmentid', null);
        $outpatientClinicId = $request->get('outpatientclinicid', null) ;

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
        $status = $request->query('status', null);

        $query = Outpatientregistration::with([
            'patient',
            'outpatientclinic',
            'medicalexamination',
            'department'
        ]);

        if ($departmentid !== null) {
            $query->where('departmentid', $departmentid);
        }

        if ($outpatientClinicId) {
            $query->where('outpatientclinicid', $outpatientClinicId);
        }
        if ($userid !== null) {
            $query->whereHas('patient', function ($q) use ($userid) {
                $q->where('userid', $userid);
            });
        }
        if ($status !== null) {
            $query->where('examinationstatus', $status);
        }

        if ($limit === null) {
            $data = $query->get();

            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu đăng ký khám thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);

            return response()->json([
                "success" => true,
                "totalpage" => $data->lastPage(),
                "data" => $data->items(),
                "message" => "Lấy dữ liệu đăng ký khám thành công"
            ], 200);
        }
    }
    public function showByUser(string $id)
    {
        try {
            if (!$id) {
                return response()->json([
                    'status' => false,
                    'data' => null,
                    'message' => 'Không tìm thấy id đăng ký khám!',
                ], 404);
            }
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
            $outpatientregistration = Outpatientregistration::with(['patient', 'department', 'outpatientclinic', 'registrar'])->whereHas('patient', function ($q) use ($userid) {
                $q->where('userid', $userid);
            })->where('outpatientregistrationid', $id)->first();
            if (!$outpatientregistration) {
                return response()->json([
                    'status' => false,
                    'data' => null,
                    'message' => 'Không tìm thấy đăng ký khám!',
                ], 404);
            }
            $data = $outpatientregistration->getAttributes();
            $data['patient'] = $outpatientregistration->patient;
            $data['department'] = $outpatientregistration->department;
            $data['outpatientclinic'] = $outpatientregistration->outpatientclinic;
            $registrar = $outpatientregistration->registrar;
            if ($registrar) {
                if ($registrar->usertype == 1) {
                    $data['registrar'] = $registrar->patientprofile;
                } else {
                    $data['registrar'] = $registrar->staffprofile->load('stafftype');
                }
            } else {
                $data['registrar'] = null;
            }
            return response()->json([
                'status' => true,
                'data' => $data,
                'message' => 'Lấy thông tin đăng ký khám thành công',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'data' => $e->getMessage(),
                'message' => 'Lỗi chưa xác định!',
            ], 500);
        }
    }
}
