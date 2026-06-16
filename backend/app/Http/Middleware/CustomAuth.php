<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CustomAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $roles = null): Response
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                "status" => false,
                "data" => [],
                'message' => 'Bạn chưa đăng nhập'
            ], 401);
        }
        if (!$user->isactive) {
            return response()->json([
                "status" => false,
                "data" => [],
                'message' => 'Tài khoản của bạn đã bị vô hiệu hoá.',
            ], 403);
        }
        if ($roles) {
            $roleArray = explode('|', $roles);
            if (!in_array($user?->role?->name, $roleArray)) {
                return response()->json([
                    "status" => false,
                    "data" => $roles,
                    'message' => 'Forbidden.',
                ], 403);
            }
        }
        return $next($request);
    }
}
