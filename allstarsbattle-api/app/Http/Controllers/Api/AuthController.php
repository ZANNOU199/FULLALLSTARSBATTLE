<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->addCorsHeaders(response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401));
        }

        if (!$user->is_admin) {
            return $this->addCorsHeaders(response()->json([
                'status' => 'error',
                'message' => 'Only administrators can access this area',
            ], 403));
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->addCorsHeaders(response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ], 200));
    }

    /**
     * Get current user
     */
    public function me(Request $request)
    {
        return $this->addCorsHeaders(response()->json([
            'status' => 'success',
            'user' => $request->user(),
        ], 200));
    }

    /**
     * Get all administrators (admin only)
     */
    public function getAdmins(Request $request)
    {
        if (!$request->user()->is_admin) {
            return $this->addCorsHeaders(response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403));
        }

        $admins = User::where('is_admin', true)->get();

        return $this->addCorsHeaders(response()->json([
            'status' => 'success',
            'admins' => $admins,
        ], 200));
    }

    /**
     * Create new administrator (admin only)
     */
    public function createAdmin(Request $request)
    {
        if (!$request->user()->is_admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        return $this->addCorsHeaders(response()->json([
            'status' => 'success',
            'message' => 'Administrator created successfully',
            'admin' => $admin,
        ], 201));
    }

    /**
     * Update administrator (admin only)
     */
    public function updateAdmin(Request $request, $id)
    {
        if (!$request->user()->is_admin) {
            return $this->addCorsHeaders(response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403));
        }

        $admin = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|min:6',
        ]);

        $admin->name = $request->name;
        $admin->email = $request->email;
        if ($request->password) {
            $admin->password = bcrypt($request->password);
        }
        $admin->save();

        return $this->addCorsHeaders(response()->json([
            'status' => 'success',
            'message' => 'Administrator updated successfully',
            'admin' => $admin,
        ], 200));
    }

    /**
     * Delete administrator (admin only)
     */
    public function deleteAdmin(Request $request, $id)
    {
        if (!$request->user()->is_admin) {
            return $this->addCorsHeaders(response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403));
        }

        // Prevent deleting the last admin
        if (User::where('is_admin', true)->count() <= 1) {
            return $this->addCorsHeaders(response()->json([
                'status' => 'error',
                'message' => 'Cannot delete the last administrator',
            ], 400));
        }

        $admin = User::findOrFail($id);
        $admin->delete();

        return $this->addCorsHeaders(response()->json([
            'status' => 'success',
            'message' => 'Administrator deleted successfully',
        ], 200));
    }

    /**
     * Update current user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'current_password' => 'required_with:password|nullable',
            'password' => 'nullable|min:6|confirmed',
        ]);

        // Verify current password if changing password
        if ($request->password) {
            if (!Hash::check($request->current_password, $user->password)) {
                return $this->addCorsHeaders(response()->json([
                    'status' => 'error',
                    'message' => 'Current password is incorrect',
                ], 400));
            }
        }

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) {
            $user->password = bcrypt($request->password);
        }
        $user->save();

        return $this->addCorsHeaders(response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $user,
        ], 200));
    }

    /**
     * Toggle admin status for a user (admin only)
     */
    public function toggleAdminStatus(Request $request, $id)
    {
        if (!$request->user()->is_admin) {
            return $this->addCorsHeaders(response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403));
        }

        $user = User::findOrFail($id);

        // Prevent demoting the last admin
        if ($user->is_admin && User::where('is_admin', true)->count() <= 1) {
            return $this->addCorsHeaders(response()->json([
                'status' => 'error',
                'message' => 'Cannot demote the last administrator',
            ], 400));
        }

        $user->is_admin = !$user->is_admin;
        $user->save();

        return $this->addCorsHeaders(response()->json([
            'status' => 'success',
            'message' => 'Admin status updated successfully',
            'user' => $user,
        ], 200));
    }
}

