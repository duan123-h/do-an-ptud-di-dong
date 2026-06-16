<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckJwtActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json(['message' => 'Token không hợp lệ hoặc người dùng không tồn tại.'], 401);
        }
        if (!$user->isactive) {
            return response()->json([
                "status"=>false,
                "data"=>[],
                'message' => 'Tài khoản của bạn đã bị vô hiệu hoá.',
            ], 403);
        }
        return $next($request);
    }
}
