<?php

namespace App\Http\Controllers;

use App\Models\MedicalExamination;
use App\Models\Outpatientregistration;
use App\Models\Servicerequest;
use App\Models\Servicerequestdetail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ServicerequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->get("limit");
        $medicalExamId = $request->get("medicalexaminationid");

        $query = Servicerequest::with(["requester.patientprofile", "requester.staffprofile.stafftype", "patient"]);
        if ($medicalExamId) {
            $query->where('medicalexaminationid', $medicalExamId);
        }
        if ($limit == null) {
            $data = $query->get()->map(function ($item) {
                $t = $item->getAttributes();
                $t["patient"] = $item->patient;
                $r = $item->requester;
                if (!$r) {
                    $t["requester"] = null;
                } else {

                    if ($r->usertype == 1) {
                        $t["requester"] = $r->patientprofile;
                    } else {
                        $t["requester"] = $r->staffprofile;
                    }
                }

                return $t;
            });
            return response()->json([
                "status" => true,
                "data" => $data,
                "message" => "lấy dữ liệu bệnh thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "status" => true,
                "data" => $data->items(),
                "totalpage" => $data->lastPage(),
                "message" => "lấy dữ liệu bệnh thành công"
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
        $validate = $request->validate([
            'medicalexaminationid' => 'required',
            'patientid' => 'required|exists:tblpatient,patientid',
            'details' => 'required|array|min:1',
            'details.*.serviceid' => 'required|exists:tblservice,serviceid',
            'details.*.outpatientclinicid' => 'required|exists:tbloutpatientclinic,outpatientclinicid',
        ], [
            'medicalexaminationid.required' => 'Mã phiếu khám không được bỏ trống',
            'patientid.required' => 'Mã bệnh nhân không được bỏ trống',
            'patientid.exists' => 'Bệnh nhân không tồn tại',
            'details.required' => 'Vui lòng chọn dịch vụ',
            'details.array' => 'Danh sách dịch vụ phải là một mảng',
            'details.*.serviceid.required' => 'Mã dịch vụ không được bỏ trống',
            'details.*.serviceid.exists' => 'Dịch vụ không tồn tại',
            'details.*.outpatientclinicid.required' => 'Mã phòng không được bỏ trống',
            'details.*.outpatientclinicid.exists' => 'Phòng khám không tồn tại',
        ]);
        $data = [];
        $details = $validate['details'];
        // try {

        // } catch (Exception $e) {
        //     return response()->json([
        //         "status" => false,
        //         "data" => [],
        //         "message" => "Lỗi không xác định"
        //     ], 500);
        // }
        $medicalExamination = MedicalExamination::find($request->medicalexaminationid);
        if (!$medicalExamination) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Phiếu khám không tồn tại'
            ], 404);
        }
        $registrationId = $medicalExamination->outpatientregistrationid;
        $registration = Outpatientregistration::find($registrationId);
        if (!$registration || $registration->examinationstatus != 2) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Phiếu khám chưa trong trạng thái đang khám'
            ], 400);
        }

        $medicalExaminationId = $medicalExamination->medicalexaminationid;
        $doctorId = auth()->user()->userid;
        $patientId = $validate['patientid'];
        $serviceRequest = Servicerequest::create([
            'medicalexaminationid' => $medicalExaminationId,
            'userid' => $doctorId,
            'patientid' => $patientId,
            "requesttime" => now()
        ]);
        foreach ($details  as $d) {
            $today = now()->toDateString();
            $maxQueue = Servicerequestdetail::where('outpatientclinicid', $d['outpatientclinicid'])
                ->where('serviceid', $d['serviceid'])->whereHas('servicerequest', function ($q) use ($today) {
                    $q->whereDate('requesttime', $today);
                })
                ->max('queueorder');
            $nextQueue = ($maxQueue ?? 0) + 1;

            Servicerequestdetail::create([
                'servicerequestid' => $serviceRequest->servicerequestid,
                'serviceid' => $d['serviceid'],
                'outpatientclinicid' => $d['outpatientclinicid'] ?? null,
                'status' => 0,
                'queueorder' => $nextQueue
            ]);
        }
        $data = Servicerequestdetail::with('service.outpatientclinic')->where('servicerequestid', $serviceRequest->servicerequestid)->get();
        return response()->json([
            "status" => false,
            "data" => $data,
            "servicerequestid" => $serviceRequest->servicerequestid,
            "message" => "Tạo phiếu chỉ định cận lâm sàn thành công!"
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $data = Servicerequest::with([
                'patient',
                'doctor',
                'medicalexamination',
            ])->find($id);

            return response()->json([
                "success" => true,
                "data"    => $data,
                "message" => "Lấy dữ liệu thành công"
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                "success" => false,
                "data"    => null,
                "message" => "Lỗi không xác định"
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
        $serviceIds = collect($request->details)->pluck('serviceid')->toArray();

        Servicerequestdetail::where('servicerequestid', $id)
            ->where('status', 0)
            ->whereNotIn('serviceid', $serviceIds)
            ->delete();

        foreach ($request->details as $d) {
            $detail = Servicerequestdetail::where('servicerequestid', $id)
                ->where('serviceid', $d['serviceid'])
                ->first();

            if ($detail) {
                if ($detail->status == 0) {
                    $detail->update([
                        'outpatientclinicid' => $d['outpatientclinicid'],
                    ]);
                    $detail->load('service.outpatientclinic');
                }
            } else {
                $today = now()->toDateString();
                $maxQueue = Servicerequestdetail::where('outpatientclinicid', $d['outpatientclinicid'])
                    ->where('serviceid', $d['serviceid'])
                    ->where('serviceid', $d['serviceid'])->whereHas('servicerequest', function ($q) use ($today) {
                        $q->whereDate('requesttime', $today);
                    })
                    ->max('queueorder');
                $nextQueue = ($maxQueue ?? 0) + 1;
                Servicerequestdetail::create([
                    'servicerequestid' => $id,
                    'serviceid' => $d['serviceid'],
                    'outpatientclinicid' => $d['outpatientclinicid'] ?? null,
                    'status' =>  0,
                    'queueorder' => $nextQueue
                ]);
            }
        }
        $data = Servicerequestdetail::with('service.outpatientclinic')->where('servicerequestid', $id)->get();
        return response()->json([
            "status" => true,
            "data" => $data,
            "message" => "Cập nhật phiếu chỉ định CLS thành công!"
        ], 200);
        try {
        } catch (Exception $e) {
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
        //
    }
    public function details(string $id)
    {
        $data = Servicerequestdetail::with('service.outpatientclinic')->where('servicerequestid', $id)->get();
        if (!$data) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Không tồn tại dữ liệu"
            ], 404);
        }
        return response()->json([
            "status" => true,
            "data" => $data,
            "message" => "lấy dữ liệu chi tiết phiếu CLS thành công"
        ], 200);
    }
    public function getIndexByUser(Request $request)
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
        $userid = $user->userid;
        $limit = $request->get("limit");
        $medicalExamId = $request->get("medicalexaminationid");

        $query = Servicerequest::with(["requester.patientprofile", "requester.staffprofile.stafftype", "patient"])->whereHas('patient', function ($q) use ($userid) {
            $q->where('userid', $userid);
        });
        if ($medicalExamId) {
            $query->where('medicalexaminationid', $medicalExamId);
        }
        if ($limit == null) {
            $data = $query->get()->map(function ($item) {
                $t = $item->getAttributes();
                $t["patient"] = $item->patient;
                $r = $item->requester;
                if (!$r) {
                    $t["requester"] = null;
                } else {

                    if ($r->usertype == 1) {
                        $t["requester"] = $r->patientprofile;
                    } else {
                        $t["requester"] = $r->staffprofile;
                    }
                }

                return $t;
            });
            return response()->json([
                "status" => true,
                "data" => $data,
                "message" => "lấy dữ liệu bệnh thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "status" => true,
                "data" => $data->items(),
                "totalpage" => $data->lastPage(),
                "message" => "lấy dữ liệu bệnh thành công"
            ], 200);
        }
    }
    public function showDetailsByUser(string $id)
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
        $userid = $user->userid;
        $data = Servicerequestdetail::with('service.outpatientclinic')->whereHas('patient', function ($query) use ($userid) {
            $query->where('tblpatient.userid', $userid);
        })->where('servicerequestid', $id)->get();
        if (!$data) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Không tồn tại dữ liệu"
            ], 404);
        }
        return response()->json([
            "status" => true,
            "data" => $data,
            "message" => "lấy dữ liệu chi tiết phiếu CLS thành công"
        ], 200);
    }
}
