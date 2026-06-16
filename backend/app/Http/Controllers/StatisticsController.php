<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\{
    Patient,
    OutpatientRegistration,
    MedicalExamination
};

class StatisticsController extends Controller
{
    public function patient(Request $request)
    {
        $startDate = $request->startDate;
        $endDate   = $request->endDate;

        try {
            $data['startDate'] = $startDate;
            $data['endDate'] = $endDate;

            $query = Patient::query();

            if ($startDate && $endDate) {
                $query->whereBetween('createdat', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay()
                ]);
            }

            $data['totalPatients'] = $query->count();

            $data['patientByGender'] = $query->clone()
                ->select('gender')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('gender')
                ->get()
                ->map(function ($item) {
                    return [
                        'gender' => $item->gender == 1 ? 'Nam' : 'Nữ',
                        'total'  => $item->total
                    ];
                });

            $data['patientByAge'] = $query->clone()
                ->selectRaw("
                    CASE
                        WHEN TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 6 THEN '0 - 6'
                        WHEN TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 17 THEN '7 - 17'
                        WHEN TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 45 THEN '18 - 45'
                        WHEN TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 60 THEN '46 - 60'
                        ELSE '60+'
                    END as age_group,
                    COUNT(*) as total
                ")
                ->groupBy('age_group')
                ->get();

            $data['patientByProvince'] = $query->clone()
                ->with('province')
                ->selectRaw('provinceid, COUNT(*) as total')
                ->groupBy('provinceid')
                ->get()
                ->map(fn($item) => [
                    'province' => optional($item->province)->name,
                    'total' => $item->total
                ]);

            $data['patientByEthnic'] = $query->clone()
                ->with('ethnicgroup')
                ->selectRaw('ethnicid, COUNT(*) as total')
                ->groupBy('ethnicid')
                ->get()
                ->map(fn($item) => [
                    'ethnic' => optional($item->ethnicgroup)->name,
                    'total' => $item->total
                ]);

            $data['newPatientByDate'] = $query->clone()
                ->whereNotNull('createdat')
                ->selectRaw('MONTH(createdat) as month, COUNT(*) as total')
                ->groupByRaw('MONTH(createdat)')
                ->orderBy('month')
                ->get();

            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu thống kê bệnh nhân thành công"
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Lỗi khi lấy dữ liệu: " . $e->getMessage()
            ], 500);
        }
    }

    public function outpatient(Request $request)
    {
        $startDate = $request->startDate;
        $endDate   = $request->endDate;

        try {
            $query = OutpatientRegistration::query();

            if ($startDate && $endDate) {
                $query->whereBetween('registrationtime', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay()
                ]);
            }

            $data['totalVisits'] = $query->count();

            $data['visitByDepartment'] = $query->clone()
                ->with('department')
                ->selectRaw('departmentid, COUNT(*) as total')
                ->groupBy('departmentid')
                ->get()
                ->map(fn($i) => [
                    'department' => optional($i->department)->name,
                    'total' => $i->total
                ]);

            $data['visitByClinic'] = $query->clone()
                ->with('outpatientclinic')
                ->selectRaw('outpatientclinicid, COUNT(*) as total')
                ->groupBy('outpatientclinicid')
                ->get()
                ->map(fn($i) => [
                    'clinic' => optional($i->outpatientclinic)->name,
                    'total' => $i->total
                ]);

            $data['visitByMonth'] = $query->clone()
                ->selectRaw('MONTH(registrationtime) as month, COUNT(*) as total')
                ->groupByRaw('MONTH(registrationtime)')
                ->orderBy('month')
                ->get();

            $data['visitByStatus'] = $query->clone()
                ->selectRaw("
                    CASE
                        WHEN examinationstatus = 1 THEN 'Đang chờ khám'
                        WHEN examinationstatus = 2 THEN 'Đang khám'
                        WHEN examinationstatus = 3 THEN 'Kết thúc khám'
                        ELSE 'Không xác định'
                    END as status,
                    COUNT(*) as total
                ")
                ->groupBy('examinationstatus')
                ->get();

            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu thống kê khám ngoại trú thành công"
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Lỗi khi lấy dữ liệu: " . $e->getMessage()
            ], 500);
        }
    }

    public function examination(Request $request)
    {
        $startDate = $request->startDate;
        $endDate   = $request->endDate;

        try {
            $query = MedicalExamination::query();

            if ($startDate && $endDate) {
                $query->whereBetween('examinationstarttime', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay()
                ]);
            }

            $data['examByDisease'] = $query->clone()
                ->with('disease')
                ->selectRaw('diseaseid, COUNT(*) as total')
                ->groupBy('diseaseid')
                ->get()
                ->map(fn($i) => [
                    'disease' => optional($i->disease)->diseasename ?? 'Không xác định',
                    'total' => $i->total
                ]);

            $data['examByTreatment'] = $query->clone()
                ->with('disposition')
                ->selectRaw('dispositionid, COUNT(*) as total')
                ->groupBy('dispositionid')
                ->get()
                ->map(fn($i) => [
                    'treatment' => optional($i->disposition)->name ?? 'Không xác định',
                    'total' => $i->total
                ]);

            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu thống kê khám bệnh thành công"
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Lỗi khi lấy dữ liệu: " . $e->getMessage()
            ], 500);
        }
    }
}
