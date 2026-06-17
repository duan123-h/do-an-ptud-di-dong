<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\NotificationRecipient;
use App\Models\UserDevice;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    public function sends(array $items)
    {
        DB::beginTransaction();

        try {
            $expoMessages = [];

            foreach ($items as $item) {

                $notification = Notification::create([
                    'title' => $item['title'],
                    'content' => $item['content'],
                    'image_url' => $item['image_url'] ?? null,
                    'linkurl' => $item['linkurl'] ?? null,
                    'createdat' => now(),
                    'updatedat' => now(),
                ]);

                $devices = UserDevice::where('userid', $item['userid'])
                    ->where('isactive', 1)
                    ->whereNotNull('pushtoken')
                    ->get();

                if ($devices->isEmpty()) {
                    continue;
                }

                foreach ((array) $item['userid'] as $userId) {
                    NotificationRecipient::create([
                        'notificationid' => $notification->notificationid,
                        'userid' => $userId,
                        'isread' => 0,
                        'isdeleted' => 0,
                        'createdat' => now(),
                    ]);
                }

                foreach ($devices as $device) {
                    $expoMessages[] = [
                        'to' => $device->pushtoken,
                        'title' => $notification->title,
                        'body' => $notification->content,
                        'data' => $item['data'] ?? []
                    ];
                }
            }

            DB::commit();

            if (!empty($expoMessages)) {
                $this->sendPushBatch($expoMessages);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    public function send(array $data)
    {
        DB::beginTransaction();

        try {
            $notification = Notification::create([
                'title' => $data['title'],
                'content' => $data['content'],
                'image_url' => $data['image_url'] ?? null,
                'linkurl' => $data['linkurl'] ?? null,
                'createdat' => now(),
                'updatedat' => now(),
            ]);
            $devices = UserDevice::where('userid', $data['userid'])
                ->where('isactive', 1)
                ->whereNotNull('pushtoken')
                ->get();

            
            $userIds = (array) $data['userid'];
            $userIds = array_filter($userIds);
            foreach ($userIds as $userId) {
                NotificationRecipient::create([
                    'notificationid' => $notification->notificationid,
                    'userid' => $userId,
                    'isread' => 0,
                    'isdeleted' => 0,
                    'createdat' => now(),
                ]);
            }
            if ($devices->isEmpty()) {
                DB::commit();
                return;
            }

            $expoMessages = [];

            foreach ($devices as $device) {

                $expoMessages[] = [
                    'to' => $device->pushtoken,
                    'title' => $notification->title,
                    'channelId' => 'default',
                    'body' => $notification->content,
                    'data' => $data['data'] ?? (object)[]
                ];
            }

            DB::commit();
            return $this->sendPushBatch($expoMessages);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    private function sendPushBatch(array $messages)
    {
        if (empty($messages)) return;

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post(
            'https://exp.host/--/api/v2/push/send',
            $messages
        );

        return $response->json();
    }
}
