'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const displayImages = images.length > 0 ? images : ['/placeholder-product.svg'];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-100">
        <Image
          src={displayImages[selected]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {displayImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === selected ? 'border-primary-500' : 'border-surface-200 hover:border-surface-400'
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
