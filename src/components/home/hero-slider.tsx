"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFade, Navigation, Pagination } from "swiper/modules"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { CITIES, STUDIO_CATEGORIES } from "@/lib/constants"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import "swiper/css/pagination"

const SLIDES = [
  {
    image: "/background.jpg",
    eyebrow: "Peer-to-peer creative space",
    title: (
      <>
        Find the room for your next{" "}
        <span className="text-amber-300">big idea.</span>
      </>
    ),
    subtitle:
      "Photo studios, sound stages, podcast rooms, and music suites — booked by the hour from people who actually get it.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=85",
    eyebrow: "Stages, lights, action",
    title: (
      <>
        Lights. Camera.{" "}
        <span className="text-amber-300">Booked.</span>
      </>
    ),
    subtitle:
      "Blackbox stages, cycloramas, and fully rigged rooms for film, commercials, and the shoot you have been storyboarding all year.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=2000&q=85",
    eyebrow: "For the people who make",
    title: (
      <>
        Your best work needs{" "}
        <span className="text-amber-300">the right space.</span>
      </>
    ),
    subtitle:
      "From a quiet podcast room to a full live room with a grand piano — find a space that sounds as good as it looks.",
  },
] as const

export function HeroSlider() {
  const swiperRef = useRef<{ slideNext: () => void } | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => {
      swiperRef.current?.slideNext()
    }, 7000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="relative bg-[#0c0b09]">
      <Swiper
        className="hero-swiper"
        modules={[EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        navigation
        pagination={{ clickable: true }}
        slidesPerView={1}
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.eyebrow}>
            <div className="relative flex min-h-[86svh] items-center overflow-hidden">
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/90 via-transparent to-black/30" />

              <div className="shell relative z-10 py-24 sm:py-28">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/75 uppercase backdrop-blur-md">
                    <Sparkles className="size-3.5 text-amber-300" />
                    {slide.eyebrow}
                  </span>

                  <h1 className="mt-6 text-4xl leading-[0.98] font-semibold tracking-[-0.035em] text-balance text-white sm:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
                    {slide.subtitle}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <Link
                      href="/studios"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-11 gap-2 rounded-xl px-6 text-sm font-semibold shadow-lg shadow-amber-500/20"
                      )}
                    >
                      Explore Studios
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/register?intent=host"
                      className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
                    >
                      Host Your Space
                    </Link>
                  </div>

                  <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-6">
                    <div>
                      <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                        Spaces listed
                      </dt>
                      <dd className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-white">
                        2,400+
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                        Creators booked
                      </dt>
                      <dd className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-white">
                        <Users className="size-4 text-amber-300" />
                        18,000
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                        Average rating
                      </dt>
                      <dd className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-white">
                        <Star className="size-4 fill-amber-300 text-amber-300" />
                        4.9 / 5
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shell relative z-20 -mt-9 pb-4 sm:-mt-10">
        <HeroSearch />
      </div>
    </section>
  )
}

function HeroSearch() {
  const router = useRouter()
  const [category, setCategory] = useState("")
  const [city, setCity] = useState("")
  const [query, setQuery] = useState("")

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const params = new URLSearchParams()
        if (query.trim()) params.set("q", query.trim())
        if (category) params.set("category", category)
        if (city) params.set("city", city)
        router.push(`/studios${params.size ? `?${params.toString()}` : ""}`)
      }}
      className="grid gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-xl shadow-black/5 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end"
    >
      <Field label="Search" icon={<Search className="size-3.5" />}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Studio, neighborhood, or vibe"
          className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </Field>

      <Field label="Space type">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-7 w-full bg-transparent text-sm outline-none"
        >
          <option value="">All studio types</option>
          {STUDIO_CATEGORIES.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Location" icon={<MapPin className="size-3.5" />}>
        <select
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="h-7 w-full bg-transparent text-sm outline-none"
        >
          <option value="">Anywhere</option>
          {CITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-11 w-full rounded-xl px-6 text-sm font-semibold lg:w-auto"
        )}
      >
        <Search className="size-4" />
        Find a space
      </button>
    </form>
  )
}

function Field({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 rounded-xl px-1">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {icon}
        {label}
      </span>
      <span className="border-b border-border/80 pb-2">{children}</span>
    </label>
  )
}
