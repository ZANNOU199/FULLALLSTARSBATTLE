<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload un fichier vers Cloudflare R2
     */
    public function upload(Request $request)
    {
        try {
            // Debug: vérifier les credentials
            \Log::info('R2 Credentials Debug', [
                'key' => config('filesystems.disks.r2.key'),
                'secret_length' => strlen(config('filesystems.disks.r2.secret')),
                'bucket' => config('filesystems.disks.r2.bucket'),
                'endpoint' => config('filesystems.disks.r2.endpoint'),
                'url' => config('filesystems.disks.r2.url')
            ]);

            // Validation du fichier - Accepte images et vidéos
            // Images: max 10MB, Vidéos: max 100MB
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:102400|mimes:jpeg,jpg,png,gif,webp,mp4,webm,ogg,mov,quicktime', // 100MB pour les vidéos
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier invalide: ' . implode(', ', $validator->errors()->all())
                ], 400);
            }

            $file = $request->file('file');

            // Générer un nom de fichier unique
            $extension = $file->getClientOriginalExtension();
            $fileName = time() . '-' . Str::random(6) . '.' . $extension;

            // Chemin dans le bucket R2
            $path = 'media/' . $fileName;

            \Log::info('Attempting upload to R2', ['path' => $path]);

            // Upload vers R2 via le disque configuré
            $uploaded = Storage::disk('r2')->put($path, file_get_contents($file->getRealPath()));

            if (!$uploaded) {
                \Log::error('R2 Upload failed - no result from put()');
                return response()->json([
                    'success' => false,
                    'message' => 'Échec de l\'upload vers R2'
                ], 500);
            }

            // URL publique du fichier
            $publicUrl = config('filesystems.disks.r2.url') . '/' . $path;

            \Log::info('Upload successful', ['url' => $publicUrl]);

            return response()->json([
                'success' => true,
                'url' => $publicUrl,
                'fileName' => $fileName,
                'path' => $path
            ]);

        } catch (\Exception $e) {
            \Log::error('Upload error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    }
}