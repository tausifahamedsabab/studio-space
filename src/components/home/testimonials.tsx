import { Quote, Star } from "lucide-react"

import { SectionHeading } from "@/components/section-heading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TESTIMONIALS = [
  {
    quote:
      "We shot a full lookbook in one afternoon and the light did half the work. Booking took four minutes, and the host had coffee waiting when the crew arrived.",
    name: "Jordan Ellis",
    role: "Photographer · Los Angeles",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "Finding a treated room with the right mics used to eat a whole day of prep. Now I can see exactly what is in the room and lock the hours before lunch.",
    name: "Priya Nair",
    role: "Podcast producer · Austin",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "As a host, the calendar and payout clarity are the whole thing. I know what is booked, I know what I earn, and I never have to chase a confirmation.",
    name: "Maya Chen",
    role: "Host · Quiet Hours Studio",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
] as const

export function Testimonials() {
  return (
    <section className="border-y border-border/70 bg-secondary/50 py-20 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="From the community"
          title="People who book the room, not the hassle"
          description="Photographers, producers, musicians, and hosts on what changes when the space is easy to find and easy to trust."
          align="center"
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm ring-1 ring-foreground/5"
            >
              <div className="flex items-center justify-between">
                <Quote className="size-7 text-amber-500/40" />
                <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>

              <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-pretty text-foreground/80">
                “{item.quote}”
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
                <Avatar>
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
