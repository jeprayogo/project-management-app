<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
{
    /**
     * 
     * Disable Wrapping data with key "data"
     * 
     */
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'due_date' => (new Carbon($this->due_date))->format('Y-m-d'),
            'status' => $this->status,
            //jika ada image_path maka akan diset ke url jika tidak maka akan di set empty string
            'image_path' => $this->image_path ? Storage::url($this->image_path) : '',
            'created_by' => new UserResource($this->createdBy),
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_by' => new UserResource($this->updatedBy),
            'update_at' => (new Carbon($this->update_at))->format('Y-m-d H:i:s'),
        ];
    }
}
