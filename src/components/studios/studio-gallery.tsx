"use client"

import Image from "next/image"
import { useState } from "react"
import { Images } from "lucide-react"
import { cn } from "cn"

export function StudioGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [active, setActive] = useState(0)
  const gallery = images.length > 0 ? images : ["/background.jpg"]
  const visible = gallery.slice(0, 5)

  return (
    <div className="grid gap-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5 sm:aspect-[16/9]">
        <Image
          key={visible[active] ?? visible[0]}
          src={visible[active] ?? visible[0]}
          alt={`${title} — photo ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="image-fade object-cover"
        />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Images className="size-3.5" />
          {active + 1} / {gallery.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
        {visible.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`View photo ${index + 1} of ${gallery.length}`}
            aria-pressed={active === index}
            className={cn(
              "relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/5 outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50 lg:aspect-[4/3]",
              active === index
                ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background"
                : "opacity-80 hover:opacity-100"
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1024px) 25vw, 20vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
