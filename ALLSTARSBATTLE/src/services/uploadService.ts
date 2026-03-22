// Service pour l'upload vers Cloudflare R2 via API Laravel
export class UploadService {
  private static API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  /**
   * Valide un fichier image
   */
  static validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Génère un nom de fichier unique
   */
  static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
  }

  /**
   * Upload un fichier vers Cloudflare R2 via l'API Laravel
   */
  static async uploadFile(file: File, fileName?: string): Promise<string> {
    try {
      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload via l'API Laravel
      const response = await fetch(`${this.API_BASE_URL}/api/upload/r2`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      return data.url;

    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Erreur lors de l\'upload du fichier');
    }
  }
}