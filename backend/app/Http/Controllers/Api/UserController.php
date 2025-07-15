<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 20);
        return response()->json([
            'data' => User::select('id', 'name')->paginate($limit)->items(),
            'total' => User::count(),
            'currentPage' => 1,
        ]);
    }
}
