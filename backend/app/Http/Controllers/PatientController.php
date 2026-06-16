<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
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
        if ($id === null || $id === '') {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy mã bệnh nhân hợp lệ'
            ], 404);
        }
        $patient = Patient::where('personalid', $id)->first();
        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bệnh nhân'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $patient,
            'message' => 'Lấy thông tin bệnh nhân thành công'
        ], 200);
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
}
