<?php

namespace App\Http\Controllers;

use App\Models\MedicalExamination;
use App\Models\Prescription;
use App\Models\PrescriptionDetail;
use App\Models\WarehouseManager;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrescriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $userid = auth()->user()->userid;
            $query = Prescription::with([
                'doctor.staffprofile.stafftype',
                'medicalexamination.patient',
            ])->whereHas('medicalexamination.patient', function ($q) use ($userid) {
                $q->where('tblpatient.userid', $userid);
            })->get();
            $data = $query->map(function ($item) {
                $clean = $item->getAttributes();
                $clean['doctor'] = $item->doctor->staffprofile;
                $clean['patient'] = $item->medicalexamination->patient;
                $clean['medicalexamination'] = $item->medicalexamination->makeHidden('patient');
                return $clean;
            });



            return response()->json([
                'success' => true,
                'data'    => $data,
                'message' => 'Lấy danh sách đơn thuốc thành công'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'data'    => [],
                'message' => 'Không thể lấy danh sách đơn thuốc',
                'error'   => $e->getMessage()
            ], 500);
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
        $validator = $request->validate([
            'medicalexaminationid' => 'required',
            'patientid' => 'required|exists:tblpatient,patientid',
            'prescriptiondate' => 'nullable|date',
            'doctoradvice' => 'nullable|string',
            'prescriptionid' => 'nullable',

            'details' => 'required|array|min:1',
            'details.*.medicineid' => 'required|exists:tblmedicine,medicineid',
            'details.*.quantity' => 'required|integer|min:1',
            'details.*.usageinstructions' => 'nullable|string',
            'details.*.warehouseid' => 'required|exists:tblwarehouse,warehouseid',
            'details.*.routeid' => 'nullable|exists:tblroute,routeid',
        ], [
            'medicalexaminationid.required' => 'Mã phiếu khám không được bỏ trống.',
            'patientid.required' => 'Bệnh nhân là bắt buộc.',
            'patientid.exists' => 'Bệnh nhân không tồn tại.',
            'prescriptiondate.date' => 'Ngày kê đơn không hợp lệ.',
            'doctoradvice.string' => 'Lời khuyên của bác sĩ phải là chuỗi.',

            'details.required' => 'Danh sách chi tiết thuốc không được để trống.',
            'details.array' => 'Chi tiết thuốc phải ở dạng mảng.',
            'details.min' => 'Cần ít nhất một chi tiết thuốc.',

            'details.*.medicineid.required' => 'Mã thuốc là bắt buộc.',
            'details.*.medicineid.exists' => 'Thuốc không tồn tại.',
            'details.*.quantity.required' => 'Số lượng là bắt buộc.',
            'details.*.quantity.integer' => 'Số lượng phải là số nguyên.',
            'details.*.quantity.min' => 'Số lượng phải lớn hơn 0.',
            'details.*.usageinstructions.string' => 'Hướng dẫn sử dụng phải là chuỗi.',
            'details.*.warehouseid.required' => 'Kho thuốc là bắt buộc.',
            'details.*.warehouseid.exists' => 'Kho thuốc không tồn tại.',
            'details.*.routeid.exists' => 'Đường dùng thuốc không tồn tại.',
        ]);

        $validator['userid'] = auth()->user()->userid;
        $medicalExam = MedicalExamination::with('outpatientregistration')->find($validator['medicalexaminationid']);
        if ($medicalExam) {
            $checkstatus = $medicalExam->outpatientregistration->examinationstatus;
            if ($checkstatus != 2) {
                return response()->json([
                    'success' => false,
                    'data' => [],
                    'message' => 'Không thể lưu đơn thuóc vì bệnh nhân không ở trạng thái khám bệnh'
                ], 400);
            }
        } else {
            return response()->json([
                'success' => false,
                'data' => [],
                'message' => 'Không tồn tại phiếu khám bệnh'
            ], 404);
        }
        DB::beginTransaction();
        try {
            if ($validator['prescriptionid']) {
                $prescription = Prescription::find($validator['prescriptionid']);
                if (!$prescription) {
                    return response()->json([
                        'success' => false,
                        'data' => [],
                        'message' => 'Đơn thuốc này không tồn tại'
                    ], 404);
                }
                $prescription->update([
                    'userid' => auth()->user()->userid,
                    'patientid' => $validator['patientid'],
                    'prescriptiondate' => $validator['prescriptiondate'] ?? $prescription->prescriptiondate,
                    'doctoradvice' => $validator['doctoradvice'],
                ]);
            } else {
                $prescription = Prescription::create([
                    'medicalexaminationid' => $validator['medicalexaminationid'],
                    'userid' => auth()->user()->userid,
                    'patientid' => $validator['patientid'],
                    'prescriptiondate' => $request->prescriptiondate ?? now(),
                    'doctoradvice' => $validator['doctoradvice'],
                ]);
            }
            $detailIdsFromRequest = collect($request->details)
                ->filter(fn($d) => isset($d['prescriptiondetailid']))
                ->pluck('prescriptiondetailid')
                ->toArray();
            PrescriptionDetail::where('prescriptionid', $prescription->prescriptionid)
                ->whereNotIn('prescriptiondetailid', $detailIdsFromRequest)
                ->delete();

            foreach ($request->details as $detail) {

                $existingDetail = PrescriptionDetail::where('prescriptionid', $prescription->prescriptionid)
                    ->where('medicineid', $detail['medicineid'])
                    ->first();

                if ($existingDetail) {
                    $existingDetail->update([
                        'quantity' => $detail['quantity'],
                        'usageinstructions' => $detail['usageinstructions'] ?? null,
                        'routeid' => $detail['routeid'],
                        'warehouseid' => $detail['warehouseid']
                    ]);
                } else {
                    PrescriptionDetail::create([
                        'prescriptionid' => $prescription->prescriptionid,
                        'medicineid' => $detail['medicineid'],
                        'quantity' => $detail['quantity'],
                        'usageinstructions' => $detail['usageinstructions'] ?? null,
                        'warehouseid' => $detail['warehouseid'],
                        'routeid' => $detail['routeid'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đơn thuốc đã được lưu thành công',
                'data' => $prescription->load(['details', 'details.medicine'])
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lưu đơn thuốc thất bại',
                'data' =>  $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $userid = auth()->user()->userid;
            $prescription = Prescription::with([
                'doctor.staffprofile.stafftype',
                'medicalexamination.patient',
                'details.medicine',
            ])->where('prescriptionid', $id)->whereHas('medicalexamination.patient', function ($q) use ($userid) {
                $q->where('tblpatient.userid', $userid);
            })->first();;

            if (!$prescription) {
                return response()->json([
                    "success" => false,
                    "data"    => null,
                    "message" => "Không tìm thấy đơn thuốc"
                ], 404);
            }

            $data =  $prescription->getAttributes();
            $data['doctor'] = $prescription->doctor->staffprofile;
            $data['patient'] = $prescription->medicalexamination->patient;
            $data['medicalexamination'] = $prescription->medicalexamination->makeHidden('patient');
            $data['details'] = $prescription->details;
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function details(string $id, Request $request)
    {
        try {
            $prescription = Prescription::find($id);

            if (!$prescription) {
                return response()->json([
                    "success" => false,
                    "data"    => null,
                    "message" => "Không tìm thấy đơn thuốc"
                ], 404);
            }
            $query = PrescriptionDetail::with(['warehouse', 'medicine'])
                ->where('prescriptionid', $prescription->prescriptionid);
            if ($request->has('isdispensed')) {
                if ($request->isdispensed) {
                    $query->with(['exportdetail', 'exportdetail.medicine'])->whereHas('exportdetail');
                } else {
                    $query->with(['medicine.batches'])->whereDoesntHave('exportdetail');
                }
            }

            $prescriptiondetail = $query->get();

            return response()->json([
                "success" => true,
                "data"    => $prescriptiondetail,
                "message" => "Lấy dữ liệu chi tiết phiếu khám thành công"
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                "success" => false,
                "data"    => $ex->getMessage(),
                "message" => "Lỗi không xác định"
            ], 500);
        }
    }
}
