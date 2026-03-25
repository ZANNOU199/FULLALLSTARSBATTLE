// Service pour l'upload vers Cloudflare R2 via API Laravel
export class UploadService {
  private static API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fullallstarsbattle.onrender.com';

  /**
   * Valide un fichier image
   */
  static validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Valide un fichier vidéo
   */
  static validateVideoFile(file: File): boolean {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const maxSize = 100 * 1024 * 1024; // 100MB pour les vidéos

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
   * Compresse une image avant upload
   */
  static async compressImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number; // 0-1
      format?: 'image/jpeg' | 'image/webp' | 'image/png';
    } = {}
  ): Promise<File> {
    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 0.85,
      format = 'image/webp'
    } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          // Calculer les nouvelles dimensions
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height / width) * maxWidth;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (width / height) * maxHeight;
            height = maxHeight;
          }

          // Créer un canvas et compresser
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }

              // Créer un nouveau File avec le blob compressé
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '') + '.webp',
                { type: format, lastModified: Date.now() }
              );

              console.log(
                `Compression: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`
              );

              resolve(compressedFile);
            },
            format,
            quality
          );
        };

        img.onerror = () => {
          reject(new Error('Could not load image'));
        };

        img.src = event.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('Could not read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload un fichier vers Cloudflare R2 via l'API Laravel (avec compression automatique pour les images)
   */
  static async uploadFile(file: File, fileName?: string): Promise<string> {
    try {
      // Compresser l'image si c'est une image
      let fileToUpload = file;
      if (this.validateImageFile(file)) {
        fileToUpload = await this.compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          format: 'image/webp'
        });
      }

      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('file', fileToUpload);
      if (fileName) {
        formData.append('fileName', fileName);
      }

      // Upload via l'API Laravel
      const response = await fetch(`${this.API_BASE_URL}/api/upload/r2`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json().catch(() => {
        throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
      });

      if (!response.ok) {
        console.error('Upload error response:', data);
        throw new Error(data.message || data.error || `Upload échoué: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || data.error || 'Upload failed');
      }

      if (!data.url) {
        throw new Error('Pas d\'URL retournée par le serveur');
      }

      return data.url;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Upload error:', errorMessage);
      throw error;
    }
  }
}