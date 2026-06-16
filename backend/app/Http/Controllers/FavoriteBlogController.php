<?php

namespace App\Http\Controllers;

use App\Models\FavoriteBlog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class FavoriteBlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $limit = $request->query("limit", null);
        $query = FavoriteBlog::query()->with(['blog'])->where("userid", $user->userid);
        if ($limit == null) {
            $data = $query->get();
            return response()->json([
                "success" => true,
                "data" => $data,
                "message" => "Lấy dữ liệu Blog thành công"
            ], 200);
        } else {
            $data = $query->paginate($limit);
            return response()->json([
                "success" => true,
                'totalpage' => $data->lastPage(),
                'data' => $data->items(),
                "message" => "Lấy dữ liệu Blog thành công"
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
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $blogid = $request->blogid;
        if (!$blogid) {
            return response()->json([
                "success" => false,
                "message" => "Truyền thiếu thông tin mã bài viết",
                "data" => null
            ], 400);
        }
        $data = FavoriteBlog::create([
            "blogid" => $blogid,
            "userid" => $user->userid,
        ]);
        return response()->json([
            "success" => true,
            "data" => $data,
            "message" => ""
        ], 200);
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
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $favorite = FavoriteBlog::where('blogid', $id)
            ->where('userid', $user->userid)
            ->first();

        if (!$favorite) {
            return response()->json([
                "success" => false,
                "message" => "Favorite not found",
                "data" => null
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            "success" => true,
            "message" => "Xoá bài viết quan tâm thành công",
            "data" => $favorite
        ], 200);
    }

    public function addFavorite(Request $request) {}
}
