'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { requestVerificationUploadUrl, submitDocumentVerification } from '@/app/actions/verifications';
import { Upload, FileText, AlertTriangle, Lock, ShieldCheck } from 'lucide-react';

const ACCEPT = '.jpg,.jpeg,.png,.webp,.pdf';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface Props {
  type: 'identity' | 'income_proof' | 'property_proof';
  existingStatus: string;
  rejectionNote?: string;
  context?: 'tenant' | 'landlord';
}

export function VerificationUpload({ type, existingStatus, rejectionNote, context = 'tenant' }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setProgress(0);

    if (file.size > MAX_SIZE) {
      setError('El archivo debe ser menor a 10MB.');
      return;
    }

    setUploading(true);

    try {
      // 1. Get presigned URL
      const urlResult = await requestVerificationUploadUrl({
        type,
        filename: file.name,
        contentType: file.type,
        size: file.size,
        context,
      });

      if (!urlResult.ok) {
        setError(urlResult.message);
        setUploading(false);
        return;
      }

      const { uploadUrl, r2Key } = urlResult.data;

      // 2. Upload to R2
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
        xhr.onerror = () => reject(new Error('Error de red'));
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // 3. Confirm in DB
      const confirmResult = await submitDocumentVerification({ type, r2Key, context });
      if (!confirmResult.ok) {
        setError(confirmResult.message);
        setUploading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Error subiendo el archivo. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  }

  if (success || existingStatus === 'uploaded') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-teal-lighter/30 px-3 py-2 text-[13px] text-teal-dark">
        <FileText className="h-4 w-4" />
        {success ? 'Documento subido correctamente. Está en revisión.' : 'Tu documento está en revisión.'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {existingStatus === 'rejected' && (
        <div className="flex items-start gap-2 rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-[13px] text-error">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <span className="font-600">Documento rechazado.</span>
            {rejectionNote && <span className="ml-1 text-ink-secondary">{rejectionNote}</span>}
            <span className="ml-1">Sube un nuevo documento.</span>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {uploading ? (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-sand-dark">
            <div
              className="h-full rounded-full bg-teal transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-[12px] text-ink-muted">Subiendo... {progress}%</p>
        </div>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileRef.current?.click()}
          leftIcon={<Upload className="h-3.5 w-3.5" />}
        >
          {type === 'identity' ? 'Subir foto de cédula' : type === 'property_proof' ? 'Subir soporte de propiedad' : 'Subir soporte de ingresos'}
        </Button>
      )}

      {error && (
        <p className="text-[12px] text-error">{error}</p>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-teal/20 bg-teal-lighter/30 px-3 py-2.5">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
        <div className="text-[12px] leading-relaxed text-ink-secondary">
          <span className="font-600 text-teal-dark">Tus documentos están encriptados (AES-256)</span> y solo son
          revisados por el equipo de Renty. Tiempo de revisión: 24-48 horas hábiles.
        </div>
      </div>

      <p className="text-[11px] text-ink-muted">
        Formatos aceptados: JPG, PNG, WebP, PDF. Máximo 10MB.
      </p>
    </div>
  );
}
