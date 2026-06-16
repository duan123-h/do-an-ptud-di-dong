<?php

namespace App\Http\Controllers;

use App\Models\MedicalExamination;
use App\Models\Outpatientregistration;
use App\Models\Prescription;
use App\Models\SecondaryDisease;
use App\Services\NotificationService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MedicalexaminationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $userid = $user->userid;

        $query = MedicalExamination::with([
            'patient',
            'outpatientclinic',
            'outpatientregistration.department',
            'doctor.staffprofile'
        ])
            ->whereHas('patient', function ($q) use ($userid) {
                $q->where('userid', $userid);
            })
            ->orderByDesc('medicalexaminationid')
            ->get();

        $data = $query->map(function ($item) {
            $clean = $item->getAttributes();
            $clean['outpatientclinic'] = $item->outpatientclinic;
            $clean['patient'] = $item->patient;
            $clean['department'] = $item->outpatientregistration->department;
            $clean['doctor'] = $item->doctor->staffprofile;
            return $clean;
        });
        return response()->json([
            'status' => true,
            'data' => $data,
            'message' => 'Lấy danh sách phiếu khám của bệnh nhân thành công'
        ]);
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
        try {
            $item = Outpatientregistration::with(['outpatientclinic', 'patient'])->find($id);
            if (!$item) {
                return response()->json([
                    "status" => true,
                    "data" => [],
                    "message" => "Không tồn tại phiếu đăng ký khám bệnh!"
                ], 404);
            }
            $query = MedicalExamination::with(['patient', 'outpatientclinic', 'outpatientregistration', 'disease', 'doctor.staffprofile.stafftype', 'secondarydiseases', 'disposition'])
                ->where('medicalexaminationid', $id)
                ->first();
            if (!$query) {
                $query['outpatientclinic'] = $item->outpatientclinic;
                $query['patient'] = $item->patient;
                $query['outpatientregistration'] = $item->getAttributes();
                return response()->json([
                    "status" => true,
                    "data" => $query,
                    "message" => "Lấy dữ liệu phiếu khám bệnh thành công!"
                ], 200);
            }
            $data = $query->getAttributes();
            $data['patient'] = $query->patient;
            $data['outpatientclinic'] = $query->outpatientclinic;
            $data['outpatientregistration'] = $query->outpatientregistration;
            $data['disease'] = $query->disease;
            $data['secondarydiseases'] = $query->secondarydiseases;
            $data['doctor'] = $query->doctor->staffprofile;
            $data['disposition'] = $query->disposition;


            return response()->json([
                "status" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu phiếu khám bệnh thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Lưu thông tin khám bệnh thất bại",
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
        $validated = $request->validate([
            'medicalexaminationid' => 'required',
            'heartrate' => 'nullable|numeric|min:0|max:300',
            'temperature' => 'nullable|numeric|min:30|max:45',
            'bloodpressure' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0|max:500',
            'height' => 'nullable|numeric|min:0|max:300',
            'generalexam' => 'nullable|string|max:2000',
            'bodypartexam' => 'nullable|string|max:2000',
            'diagnosis' => 'nullable|string|max:2000',
            'diseaseid' => 'nullable|integer|exists:tbldisease,diseaseid',
            'diseasename' => 'nullable|string|max:255',
            'secondarydisease' => 'nullable',
            'secondarydisease.*.diseaseid' => 'exists:tbldisease,diseaseid',
            'secondarydiseasenames' => 'nullable',
        ], [
            'medicalexaminationid.required' => "Mã phiếu khám không được để trống",
            'heartrate.numeric' => 'Nhịp tim phải là số.',
            'heartrate.min' => 'Nhịp tim không được nhỏ hơn 0.',
            'heartrate.max' => 'Nhịp tim không được vượt quá 300.',

            'temperature.numeric' => 'Nhiệt độ phải là số.',
            'temperature.min' => 'Nhiệt độ không hợp lệ (quá thấp).',
            'temperature.max' => 'Nhiệt độ không hợp lệ (quá cao).',

            'bloodpressure.string' => 'Huyết áp phải là chuỗi ký tự.',
            'bloodpressure.max' => 'Giá trị huyết áp quá dài.',

            'weight.numeric' => 'Cân nặng phải là số.',
            'weight.min' => 'Cân nặng không được nhỏ hơn 0.',
            'weight.max' => 'Cân nặng không được vượt quá 500.',

            'height.numeric' => 'Chiều cao phải là số.',
            'height.min' => 'Chiều cao không được nhỏ hơn 0.',
            'height.max' => 'Chiều cao không được vượt quá 300.',

            'generalexam.string' => 'Khám tổng quát phải là chuỗi ký tự.',
            'generalexam.max' => 'Khám tổng quát không được vượt quá 2000 ký tự.',

            'bodypartexam.string' => 'Khám chi tiết phải là chuỗi ký tự.',
            'bodypartexam.max' => 'Khám chi tiết không được vượt quá 2000 ký tự.',

            'diagnosis.string' => 'Chẩn đoán phải là chuỗi ký tự.',
            'diagnosis.max' => 'Chẩn đoán không được vượt quá 2000 ký tự.',

            'diseaseid.integer' => 'ID bệnh phải là số nguyên.',
            'diseaseid.exists' => 'Bệnh không tồn tại trong cơ sở dữ liệu.',

            'diseasename.string' => 'Tên bệnh phải là chuỗi ký tự.',
            'diseasename.max' => 'Tên bệnh không được vượt quá 255 ký tự.',

            'secondarydisease.*.diseaseid.exists' => 'Mã bệnh không tồn tại',
        ]);
        $secondarydisease = $validated['secondarydisease'];
        $doctorId = Auth()->user()->userid;
        $outpatient = Outpatientregistration::find($id);
        if (!$outpatient) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tìm thấy thông tin phiếu đăng ký khám",
            ], 404);
        }
        $exam = MedicalExamination::with(['doctor', 'disease', 'secondarydiseases'])->find($validated['medicalexaminationid']);
        if (!$exam) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tìm thấy phiếu khám bệnh",
            ], 404);
        }
        $exam->fill($validated);
        if ($exam->weight && $exam->height) {
            $heightInMeters = $exam->height / 100;
            $exam->bmi = $exam->weight / ($heightInMeters * $heightInMeters);
        } else {
            $exam->bmi = null;
        }
        $exam->userid = $doctorId;
        $diseaseid = collect($secondarydisease)->pluck('diseaseid')->toArray();

        SecondaryDisease::where('medicalexaminationid', $exam->medicalexaminationid)
            ->whereNotIn('diseaseid', $diseaseid)
            ->delete();
        foreach ($secondarydisease as $d) {
            $SecondaryDisease = SecondaryDisease::where('medicalexaminationid', $exam->medicalexaminationid)
                ->where('diseaseid', $d['diseaseid'])
                ->first();

            if (!$SecondaryDisease) {
                SecondaryDisease::create([
                    'medicalexaminationid' => $exam->medicalexaminationid,
                    'diseaseid' => $d['diseaseid'],
                ]);
            }
        }
        $exam->save();
        $exam->refresh();
        return response()->json([
            "success" => true,
            "data" => $exam,
            "message" => "Lưu thông tin khám bệnh thành công",
        ], 200);
        // try {

        // } catch (Exception $e) {

        //     return response()->json([
        //         "success" => false,
        //         "data" => $e,
        //         "message" => "Lưu thông tin khám bệnh thất bại",
        //     ], 500);
        // }
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
            $doctorId = Auth()->user()->userid;
            $item = Outpatientregistration::with(['outpatientclinic', 'patient'])->find($id);
            if (!$item) {
                return response()->json([
                    "status" => true,
                    "data" => [],
                    "message" => "Không tồn tại phiếu đăng ký khám bệnh!"
                ], 404);
            }
            $query = MedicalExamination::where('outpatientregistrationid', $id)
                ->first();
            if (!$query && $item->examinationstatus <2) {
                DB::beginTransaction();
                $newExam = new MedicalExamination();
                $newExam->userid = $doctorId;
                $newExam->outpatientregistrationid = $item->outpatientregistrationid;
                $item->examinationstatus = 2;
                $newExam->examinationstarttime = now();
                $newExam->examinationendtime = null;
                $item->save();
                $newExam->save();
                
                $newExam->refresh();
                $newExam->load(['doctor.staffprofile.stafftype']);

                $data = $newExam->getAttributes();
                $data['patient'] = $item->patient;
                $data['outpatientclinic'] = $item->outpatientclinic;
                $data['outpatientregistration'] = $item->getAttributes();
                $data['doctor'] = $newExam->doctor->staffprofile;
                DB::commit();
                return response()->json([
                    "status" => true,
                    "data" => $data,
                    "message" => "Đã ghi nhận bắt đầu khám thành công"
                ], 200);
            }
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Phiên khám đã được ghi nhận trước đó"
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "status" => false,
                "data" => $e,
                "message" => "Lỗi không xác định"
            ], 500);
        }
    }
    public function end(string $id)
    {
        try {
            $item = Outpatientregistration::with('patient')->find($id);
            if (!$item) {
                return response()->json([
                    "status" => true,
                    "data" => [],
                    "message" => "Không tồn tại phiếu đăng ký khám bệnh!"
                ], 404);
            }
            $query = MedicalExamination::where('outpatientregistrationid', $id)
                ->first();
            if (!$query) {
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Chưa ghi nhận bắt đầu khám bệnh!"
                ], 400);
            }
            if ($query->dispositionid == null) {
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Vui lòng xác định hướng xử trí bệnh nhân!"
                ], 400);
            }
            if ($query->dispositionid == null) {
                return response()->json([
                    "status" => false,
                    "data" => [],
                    "message" => "Vui lòng xử trí bệnh nhân trước khi kết thúc khám bệnh!"
                ], 400);
            }
            if ($query && $item->examinationstatus == 2) {
                DB::beginTransaction();
                $query->outpatientregistrationid = $item->outpatientregistrationid;
                $item->examinationstatus = 3;
                $query->examinationendtime = now();
                $item->save();
                $query->save();
                DB::commit();
                $data = [
                    'userid' => $item?->patient?->userid,

                    'title' => 'Hoàn tất khám bệnh',
                    'content' => 'Bạn đã được bác sĩ khám xong',

                    'image_url' => null,
                    'linkurl' => null,

                    'data' => null
                ];

                app(NotificationService::class)->send($data);
                $query['outpatientclinic'] = $item->outpatientclinic;
                $query['patient'] = $item->patient;
                $query['outpatientregistration'] = $item->getAttributes();
                return response()->json([
                    "status" => true,
                    "data" => $query,
                    "message" => "Đã ghi nhận kết thúc khám thành công"
                ], 200);
            }
            return response()->json([
                "status" => true,
                "data" => [],
                "message" => "Phiên khám đã kết thúc trước đó"
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
    public function handleDisposition(Request $request)
    {
        $validated = $request->validate([
            'medicalexaminationid' => 'required',
            'diseaseid' => 'required|integer|exists:tbldisease,diseaseid',
            'diseasename' => 'required|string|max:255',
            'dispositionid' => 'required|exists:tbldisposition,dispositionid',
            'secondarydisease.*.diseaseid' => 'exists:tbldisease,diseaseid',
            'secondarydiseasenames' => 'nullable',
            'diagnosis' => 'nullable',
        ], [
            'medicalexaminationid.required' => "Mã phiếu khám không được để trống",
            'diseaseid.required' => "Mã bệnh chính không được để trống",
            'diseasename.required' => "Tên bệnh chính không được để trống",
            'dispositionid.required' => "Phải chọn loại xử trí",
            'dispositionid.exists' => 'Loại xử trí không tồn tại',
            'secondarydisease.*.diseaseid.exists' => 'Mã bệnh phụ không tồn tại',
        ]);
        try {
            $doctorId = Auth()->user()->userid;
            $exam = MedicalExamination::with(['outpatientregistration', 'disease', 'doctor', 'secondarydiseases'])->find($validated['medicalexaminationid']);
            if (!$exam) {
                return response()->json([
                    "success" => false,
                    "data" => [],
                    "message" => "Không tìm thấy phiếu khám bệnh",
                ], 404);
            }
            if ($validated['dispositionid'] == 1) {
                $check = Prescription::where('medicalexaminationid', $exam->medicalexaminationid)->first();
                if (!$check) {
                    return response()->json([
                        "success" => false,
                        "data" => [],
                        "message" => "Bệnh nhân chưa có đơn thuốc",
                    ], 400);
                }
            }
            DB::beginTransaction();
            $exam->fill($validated);
            $exam->userid = $doctorId;
            $secondarydisease = $validated['secondarydisease'];
            $diseaseid = collect($secondarydisease)->pluck('diseaseid')->toArray();

            SecondaryDisease::where('medicalexaminationid', $exam->medicalexaminationid)
                ->whereNotIn('diseaseid', $diseaseid)
                ->delete();
            foreach ($secondarydisease as $d) {
                $SecondaryDisease = SecondaryDisease::where('medicalexaminationid', $exam->medicalexaminationid)
                    ->where('diseaseid', $d['diseaseid'])
                    ->first();

                if (!$SecondaryDisease) {
                    SecondaryDisease::create([
                        'medicalexaminationid' => $exam->medicalexaminationid,
                        'diseaseid' => $d['diseaseid'],
                    ]);
                }
            }
            $item = Outpatientregistration::where('outpatientregistrationid', $exam->outpatientregistrationid)->first();
            $item->examinationstatus = 3;
            $item->save();
            $exam->examinationendtime = now();
            $exam->save();
            $exam->refresh('outpatientregistration', 'disease', 'doctor', 'secondarydiseases');
            DB::commit();
            return response()->json([
                "success" => true,
                "data" => $exam,
                "message" => "Lưu thông tin xử trí thành công",
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
}
