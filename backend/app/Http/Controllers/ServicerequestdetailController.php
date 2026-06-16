<?php

namespace App\Http\Controllers;

use App\Models\Servicerequest;
use App\Models\Servicerequestdetail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ServicerequestdetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->get("limit");
        $outpatientClinicId = $request->get('outpatientclinicid', null);
        $query = Servicerequestdetail::with(["service", "outpatientclinic", "requester", "servicerequest", "patient"]);
        if ($outpatientClinicId) {
            $query->where('outpatientclinicid', $outpatientClinicId);
        }
        if ($limit === null) {
            $data = $query->get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu danh sách chỉ định CLS thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "success" => true,
                "totalpage" => $data->lastPage(),
                "data" => $data->items(),
                "message" => "Lấy dữ liệu danh sách chỉ định CLS thành công"
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
    public function store(Request $request) {}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $Servicerequestdetail = Servicerequestdetail::with([
            'patient',
            'requester',
            'medicalexamination',
            'service.labparameters.labparameterranges'
        ])->find($id);
        if ($Servicerequestdetail == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tồn tại phiếu CLS"
            ], 404);
        } else {
            $data = $Servicerequestdetail->getAttributes();
            $data['patient'] = $Servicerequestdetail->patient;
            $data['medicalexamination'] = $Servicerequestdetail->medicalexamination;
            $data['service'] = $Servicerequestdetail->service;
            $requester = $Servicerequestdetail->registrar;
            if ($requester) {
                if ($requester->usertype == 1) {
                    $data['requester'] = $requester->patientprofile;
                } else {
                    $data['requester'] = $requester->staffprofile->load('stafftype');
                }
            } else {
                $data['registrar'] = null;
            }
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu phiếu CLS thành công"
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
        $validated = $request->validate([
            "result" => "required",
            "resultimage" => "required",
        ], [
            "result.required" => "Kết quả CLS không được để trống",

            "resultimage.required" => "Hình ảnh kết quả CLS không được để trống",
        ]);
        $Servicerequestdetail = Servicerequestdetail::find($id);
        if ($Servicerequestdetail == null) {
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Không tồn tại phiếu CLS này"
            ], 404);
        }
        if ($Servicerequestdetail->status == 0) {
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Vui lòng thực hiện bắt đầu thực hiện CLS trước khi lưu kết quả"
            ], 404);
        }
        if ($Servicerequestdetail->status == 2) {
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Phiếu CLS này đã ghi nhận kết thúc phiên không thể lưu kết quả"
            ], 404);
        }
        return response()->json([
            "status" => true,
            "data" => $Servicerequestdetail->update($validated),
            "message" => "Cập nhật phiếu CLS thành công"
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function start(string $id)
    {
        try {
            $Servicerequestdetail = Servicerequestdetail::find($id);
            if ($Servicerequestdetail == null) {
                return response()->json([
                    "status" => true,
                    "data" => [],
                    "message" => "Không tồn tại phiếu CLS này"
                ], 404);
            }
            if ($Servicerequestdetail->status == 0) {
                $Servicerequestdetail->status = 1;
                $Servicerequestdetail->starttime = now();
                $Servicerequestdetail->save();
                $Servicerequestdetail->refresh();
                return response()->json([
                    "status" => true,
                    "data" => $Servicerequestdetail,
                    "message" => "Đã ghi nhận bắt đầu thực hiện CLS thành công!!!"
                ], 200);
            }
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Phiếu CLS này đã được ghi nhận bắt đầu thực hiện hoặc đã kết thúc thực hiện!!!"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi không xác định"
            ], 500);
        }
    }
    public function end(string $id)
    {
        try {
            $Servicerequestdetail = Servicerequestdetail::find($id);
            if ($Servicerequestdetail == null) {
                return response()->json([
                    "status" => true,
                    "data" => [],
                    "message" => "Không tồn tại phiếu CLS này"
                ], 404);
            }
            if ($Servicerequestdetail->status == 1) {
                $Servicerequestdetail->status = 2;
                $Servicerequestdetail->endtime = now();
                $Servicerequestdetail->save();
                $Servicerequestdetail->refresh();
                return response()->json([
                    "status" => true,
                    "data" => $Servicerequestdetail,
                    "message" => "Đã ghi kết thúc thực hiện CLS thành công!!!"
                ], 200);
            }
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Phiếu CLS này chưa được ghi nhận bắt đầu thực hiện CLS hoặc đã kết thúc thực hiện CLS!!!"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi không xác định"
            ], 500);
        }
    }
    public function getIndexByUser(Request $request)
    {
        $limit = $request->query('limit', null);


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

        $query = Servicerequestdetail::with(["service", "outpatientclinic", "doctor", "servicerequest", "patient"])->whereHas("patient", function ($q) use ($userid) {
            $q->where("userid", $userid);
        });
        if ($limit === null) {
            $data = $query->get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu danh sách chỉ định CLS thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "success" => true,
                "totalpage" => $data->lastPage(),
                "data" => $data->items(),
                "message" => "Lấy dữ liệu danh sách chỉ định CLS thành công"
            ], 200);
        }
    }

    public function result(string $id)
    {
        try {
            $detail = Servicerequestdetail::with([
                'service',
                'execution.labResult.details.parameter',
                'execution.clinicalResult.files'
            ])->find($id);

            if (!$detail) {
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Không tồn tại phiếu CLS này"
                ], 404);
            }

            $result = null;

            // CASE 1: LAB (xét nghiệm)
            if ($detail->service->servicecategoryid == 2) {
                $lab = $detail->execution->labResult ?? null;

                if ($lab) {
                    $result = [
                        "type" => "LAB",
                        "verified_time" => $lab->verifiedtime,
                        "items" => $lab->details->map(function ($d) {
                            return [
                                "code" => $d->parameter->code,
                                "name" => $d->parameter->name,
                                "value" => $d->resultvalue,
                                "unit" => $d->parameter->unit,
                            ];
                        })
                    ];
                }
            }

            // CASE 2: IMAGING / ECG / FUNCTIONAL
            else {
                $clinical = $detail->execution->clinicalResult ?? null;

                if ($clinical) {
                    $result = [
                        "type" => "CLINICAL",
                        "description" => $clinical->description,
                        "conclusion" => $clinical->conclusion,
                        "files" => $clinical->files->map(function ($f) {
                            return [
                                "url" => $f->fileurl,
                                "type" => $f->filetype
                            ];
                        })
                    ];
                }
            }

            return response()->json([
                "status" => true,
                "data" => $result,
                "message" => "Lấy kết quả thành công"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => $e->getMessage()
            ], 500);
        }
    }
}
