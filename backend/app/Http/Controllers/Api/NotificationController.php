<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->notifications();

        if ($request->has('unread') && $request->unread) {
            $query->unread();
        }

        if ($request->has('type')) {
            $query->byType($request->type);
        }

        $notifications = $query->latest()->paginate(20);

        return response()->json($notifications);
    }

    public function markAsRead(Notification $notification)
    {
        $notification->markAsRead();
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->notifications()->unread()->update(['read_at' => now()]);
        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response()->json(['message' => 'Notification deleted']);
    }

    public function getUnreadCount(Request $request)
    {
        $count = $request->user()->notifications()->unread()->count();
        return response()->json(['count' => $count]);
    }
}
