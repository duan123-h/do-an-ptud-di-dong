<?php

namespace App\Http\Controllers;

use App\Models\NotificationRecipient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::user()->userid;

        $notifications = NotificationRecipient::with('notification')
            ->where('userid', $userId)
            ->where('isdeleted', false)
            ->orderByDesc('createdat')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $notifications,
            "message" => "Lấy danh sách thông báo thành công"
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

    public function markAsRead(string $id)
    {
        $userId = Auth::user()->userid;

        $notification = NotificationRecipient::where('notificationid', $id)
            ->where('userid', $userId)
            ->first();

        if (!$notification) {
            return response()->json([
                'status' => false,
                'data' => $userId,
                'message' => 'Không tồn tại thông báo này'
            ], 404);
        }

        $notification->isread = true;
        $notification->save();

        return response()->json([
            'status' => true,
            'data' => $notification,
            'message' => 'Thông báo đã được đọc'
        ]);
    }

    public function markAllAsRead()
    {
        $userId = Auth::user()->userid;

        NotificationRecipient::where('userid', $userId)
            ->where('isread', false)
            ->update([
                'isread' => true
            ]);

        return response()->json([
            'status' => true,
            'data' => [],
            'message' => 'Tất cả thông báo đã được đọc'
        ]);
    }

    public function getCountNotReadByUser()
    {
        $userId = Auth::user()->userid;

        $query = NotificationRecipient::where('userid', $userId)
            ->where('isread', false);

        $unreadCount = $query->count();

        return response()->json([
            'status' => true,
            'data' => [
                'count' => $unreadCount
            ],
            'message' => 'Lấy dữ liệu thành công'
        ]);
    }
}
