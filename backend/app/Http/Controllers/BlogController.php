<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\FavoriteBlog;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $limit = $request->query("limit", null);
        $status = $request->query("status", null);
        $query = Blog::query()->with(['user']);
        if (!is_null($status)) {
            $query->where("isactive", $status);
        }
        if ($user) {
            $query->withExists([
                'favorites as isfavorite' => function ($q) use ($user) {
                    $q->where('userid', $user->userid);
                }
            ]);
        }
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
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'         => 'required|max:250',
            'alias'         => 'nullable|max:500',
            'description'   => 'nullable|max:255',
            'detail'        => 'nullable',
            'image'         => 'nullable|max:500',
            'createdby'     => 'nullable|max:250',
            'modifiedby'    => 'nullable|max:500',
            'userid'        => 'nullable|integer',
            'isactive'      => 'required|boolean',
        ], [
            'title.required' => 'Tiêu đề không được để trống.',
            'isactive.required' => 'Trạng thái không được để trống.',
        ]);

        $blogData = $request->only([
            'title',
            'alias',
            'description',
            'detail',
            'image',
            'createddate',
            'modifieddate',
            'createdby',
            'modifiedby',
            'isactive',
        ]);

        try {
            $blogData['userid'] = auth()->user()->userid;
            $newBlog = Blog::create($blogData);
            return response()->json([
                "success" => true,
                "data" => $newBlog,
                "message" => "Thêm mới Blog thành công"
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Thêm mới Blog không thành công"
            ], 500);
        }
    }

    /**
     * Display specific resource.
     */
    public function show(string $id)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Không tồn tại Blog"
            ], 404);
        }
        $isFavorite = false;

        if ($user) {
            $isFavorite = FavoriteBlog::where('blogid', $id)
                ->where('userid', $user->userid)
                ->exists();
        }
        $blog->isfavorite = $isFavorite;

        return response()->json([
            "success" => true,
            "data" => $blog,
            "message" => "Lấy dữ liệu Blog thành công"
        ], 200);
    }

    /**
     * Update resource.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title'         => 'required|max:250',
            'alias'         => 'nullable|max:500',
            'description'   => 'nullable|max:255',
            'detail'        => 'nullable',
            'image'         => 'nullable|max:500',
            'createdby'     => 'nullable|max:250',
            'modifiedby'    => 'nullable|max:500',
            'isactive'      => 'required|boolean',
        ], [
            'title.required' => 'Tiêu đề không được để trống.',
        ]);

        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Blog không tồn tại"
            ], 404);
        }

        $data = $request->only([
            'title',
            'alias',
            'description',
            'detail',
            'image',
            'createddate',
            'modifieddate',
            'createdby',
            'modifiedby',
            'isactive',
        ]);

        try {
            $data['userid'] = auth()->user()->userid;
            $blog->update($data);

            return response()->json([
                "success" => true,
                "data" => $blog,
                "message" => "Cập nhật Blog thành công"
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Cập nhật Blog không thành công"
            ], 500);
        }
    }

    /**
     * Remove resource.
     */
    public function destroy(string $id)
    {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Blog không tồn tại"
            ], 404);
        }

        try {
            $blog->delete();
            return response()->json([
                "success" => true,
                "data" => $blog,
                "message" => "Xóa Blog thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "data" => [],
                "message" => "Xóa Blog không thành công"
            ], 500);
        }
    }


    /**
     * Toggle isactive (true/false)
     */
    public function isactive($id)
    {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Blog không tồn tại"
            ], 404);
        }

        try {
            $blog->isactive = !$blog->isactive;
            $blog->save();

            return response()->json([
                "status" => true,
                "data" => $blog,
                "message" => "Cập nhật trạng thái Blog thành công"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "status" => false,
                "data" => [],
                "message" => "Lỗi không xác định"
            ], 500);
        }
    }
}
