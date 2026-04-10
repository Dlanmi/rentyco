'use client';

import { useCallback, useState, useTransition } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, arrayMove, rectSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { requestUploadUrl, confirmUpload } from '@/app/actions/upload';
import { reorderImages, deleteImage as deleteImageAction } from '@/app/actions/listings';
import { MAX_IMAGE_BYTES, ALLOWED_IMAGE_TYPES } from '@/lib/r2/keys';

export interface UploaderImage {
  id: string;
  url: string;
  altText: string | null;
}

const MAX_IMAGES = 12;

export function ImageUploader({
  listingId,
  initialImages,
}: { listingId: string; initialImages: UploaderImage[] }) {
  const [images, setImages] = useState<UploaderImage[]>(initialImages);
  const [uploads, setUploads] = useState<{ name: string; progress: number }[]>([]);
  const [, start] = useTransition();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDrop = useCallback(async (accepted: File[]) => {
    const available = MAX_IMAGES - images.length;
    if (accepted.length > available) {
      toast.error(`Solo puedes subir ${available} imagen(es) más`);
      accepted = accepted.slice(0, available);
    }
    for (const file of accepted) {
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`${file.name}: excede 5MB`);
        continue;
      }
      setUploads((u) => [...u, { name: file.name, progress: 0 }]);
      try {
        const req = await requestUploadUrl({
          listingId,
          filename: file.name,
          contentType: file.type,
          size: file.size,
        });
        if (!req.ok) {
          toast.error(req.message);
          setUploads((u) => u.filter((x) => x.name !== file.name));
          continue;
        }
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', req.data.uploadUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const p = Math.round((e.loaded / e.total) * 100);
              setUploads((u) => u.map((x) => x.name === file.name ? { ...x, progress: p } : x));
            }
          };
          xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`${xhr.status}`)));
          xhr.onerror = () => reject(new Error('network'));
          xhr.send(file);
        });
        const confirm = await confirmUpload({ listingId, r2Key: req.data.r2Key });
        if (!confirm.ok) {
          toast.error(confirm.message);
        } else {
          // Optimistically append (URL will be resolved from CDN via r2Key)
          const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE ?? '';
          setImages((prev) => [
            ...prev,
            { id: confirm.data.imageId, url: `${cdnBase}/${req.data.r2Key}`, altText: null },
          ]);
          toast.success('Imagen subida');
        }
      } catch (e) {
        console.error(e);
        toast.error(`Error subiendo ${file.name}`);
      } finally {
        setUploads((u) => u.filter((x) => x.name !== file.name));
      }
    }
  }, [images.length, listingId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: MAX_IMAGE_BYTES,
    multiple: true,
    disabled: images.length >= MAX_IMAGES,
  });

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = images.findIndex((i) => i.id === active.id);
    const newIdx = images.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(images, oldIdx, newIdx);
    setImages(next);
    start(async () => {
      const res = await reorderImages({ listingId, order: next.map((i) => i.id) });
      if (!res.ok) toast.error(res.message);
    });
  }

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta imagen?')) return;
    const prev = images;
    setImages((p) => p.filter((i) => i.id !== id));
    start(async () => {
      const res = await deleteImageAction(id);
      if (!res.ok) {
        toast.error(res.message);
        setImages(prev);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={
          'rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ' +
          (isDragActive
            ? 'border-teal bg-teal-lighter/40'
            : images.length >= MAX_IMAGES
              ? 'border-border bg-sand-dark/30 opacity-60'
              : 'border-border bg-white hover:border-teal cursor-pointer')
        }
      >
        <input {...getInputProps()} />
        <p className="font-heading text-[14px] text-ink">
          {images.length >= MAX_IMAGES
            ? 'Máximo 12 imágenes alcanzado'
            : isDragActive
              ? 'Suelta los archivos aquí'
              : 'Arrastra imágenes o haz clic para seleccionar'}
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-muted">
          JPEG, PNG o WebP · max 5MB · {images.length}/{MAX_IMAGES}
        </p>
      </div>

      {uploads.length > 0 && (
        <div className="flex flex-col gap-2">
          {uploads.map((u) => (
            <div key={u.name} className="rounded-lg border border-border bg-white px-3 py-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-ink-muted">
                <span className="truncate">{u.name}</span>
                <span>{u.progress}%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sand-dark">
                <div className="h-full bg-teal transition-all" style={{ width: `${u.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((img, idx) => (
                <SortableTile
                  key={img.id}
                  image={img}
                  isFirst={idx === 0}
                  onDelete={() => handleDelete(img.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableTile({
  image, isFirst, onDelete,
}: { image: UploaderImage; isFirst: boolean; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-dark ring-1 ring-border">
      <Image src={image.url} alt={image.altText ?? ''} fill sizes="200px" className="object-cover" unoptimized />
      {isFirst && (
        <div className="absolute left-2 top-2 rounded-full bg-ink/85 px-2 py-0.5 font-mono text-2xs uppercase tracking-wide text-white">
          Portada
        </div>
      )}
      <button
        type="button"
        aria-label="Eliminar imagen"
        onClick={onDelete}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow ring-1 ring-border hover:bg-red-50 hover:text-red-700"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
        className="absolute bottom-2 right-2 flex h-9 w-9 cursor-grab items-center justify-center rounded-full bg-white/90 text-ink-muted shadow ring-1 ring-border active:cursor-grabbing"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
      </button>
    </div>
  );
}

export { ALLOWED_IMAGE_TYPES };
