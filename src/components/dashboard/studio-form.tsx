"use client"

import { useActionState } from "react"
import {
  ImageIcon,
  Info,
  Lightbulb,
  Sparkles,
  TriangleAlert,
  Upload,
} from "lucide-react"

import { createStudioAction, type StudioFormState } from "@/actions/studios"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import {
  AMENITIES,
  CITIES,
  MAX_BOOKING_HOURS,
  STUDIO_CATEGORIES,
} from "@/lib/constants"

const TIPS = [
  "Lead with your best photo — it is the first thing creators see.",
  "Mention the light: north-facing, blackout-ready, or fully controllable.",
  "List the gear that is already in the room so people can pack lighter.",
  "Be specific about load-in, parking, and noise rules to avoid surprises.",
] as const

export function StudioForm() {
  const [state, formAction, pending] = useActionState<StudioFormState, FormData>(
    createStudioAction,
    {}
  )

  const values = state.values ?? {}
  const selectedAmenities = state.amenities ?? []
  const instantBook = state.instantBook ?? true

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      {state.error && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
          <TriangleAlert />
          <AlertDescription className="text-destructive">
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-amber-50 text-amber-700">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">The basics</h2>
            <p className="text-xs text-muted-foreground">
              Give creators a clear first impression.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            label="Listing title"
            htmlFor="title"
            error={state.fieldErrors?.title}
            className="sm:col-span-2"
          >
            <Input
              id="title"
              name="title"
              defaultValue={values.title ?? ""}
              placeholder="Sunlit loft with a 12-foot cyc wall"
              aria-invalid={Boolean(state.fieldErrors?.title)}
              className="h-11 rounded-xl"
              required
            />
          </Field>

          <Field
            label="Category"
            htmlFor="category"
            error={state.fieldErrors?.category}
          >
            <NativeSelect
              id="category"
              name="category"
              defaultValue={values.category ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.category)}
              className="w-full"
              required
            >
              <NativeSelectOption value="">Choose a category</NativeSelectOption>
              {STUDIO_CATEGORIES.map((category) => (
                <NativeSelectOption key={category.slug} value={category.slug}>
                  {category.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <Field
            label="Minimum booking"
            htmlFor="minHours"
            error={state.fieldErrors?.minHours}
            hint="How many hours must a creator book?"
          >
            <NativeSelect
              id="minHours"
              name="minHours"
              defaultValue={values.minHours ?? "2"}
              aria-invalid={Boolean(state.fieldErrors?.minHours)}
              className="w-full"
            >
              {Array.from({ length: MAX_BOOKING_HOURS }).map((_, index) => {
                const hours = index + 1
                return (
                  <NativeSelectOption key={hours} value={String(hours)}>
                    {hours} {hours === 1 ? "hour" : "hours"}
                  </NativeSelectOption>
                )
              })}
            </NativeSelect>
          </Field>

          <Field
            label="City"
            htmlFor="city"
            error={state.fieldErrors?.city}
          >
            <NativeSelect
              id="city"
              name="city"
              defaultValue={values.city ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.city)}
              className="w-full"
              required
            >
              <NativeSelectOption value="">Choose a city</NativeSelectOption>
              {CITIES.map((city) => (
                <NativeSelectOption key={city} value={city}>
                  {city}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <Field
            label="Neighborhood"
            htmlFor="area"
            error={state.fieldErrors?.area}
          >
            <Input
              id="area"
              name="area"
              defaultValue={values.area ?? ""}
              placeholder="Arts District"
              aria-invalid={Boolean(state.fieldErrors?.area)}
              className="h-11 rounded-xl"
              required
            />
          </Field>

          <Field
            label="Hourly rate"
            htmlFor="pricePerHour"
            error={state.fieldErrors?.pricePerHour}
            hint="You keep 100% of your hourly rate."
          >
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="pricePerHour"
                name="pricePerHour"
                type="number"
                min={20}
                max={2000}
                step={5}
                defaultValue={values.pricePerHour ?? ""}
                placeholder="120"
                aria-invalid={Boolean(state.fieldErrors?.pricePerHour)}
                className="h-11 rounded-xl pl-7"
                required
              />
            </div>
          </Field>

          <Field
            label="Capacity"
            htmlFor="capacity"
            error={state.fieldErrors?.capacity}
            hint="People allowed in the space at once."
          >
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              max={500}
              defaultValue={values.capacity ?? ""}
              placeholder="12"
              aria-invalid={Boolean(state.fieldErrors?.capacity)}
              className="h-11 rounded-xl"
              required
            />
          </Field>

          <Field
            label="Size (sq ft)"
            htmlFor="sizeSqft"
            error={state.fieldErrors?.sizeSqft}
          >
            <Input
              id="sizeSqft"
              name="sizeSqft"
              type="number"
              min={100}
              max={100000}
              step={50}
              defaultValue={values.sizeSqft ?? ""}
              placeholder="1800"
              aria-invalid={Boolean(state.fieldErrors?.sizeSqft)}
              className="h-11 rounded-xl"
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-sky-50 text-sky-700">
            <Info className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Describe the space</h2>
            <p className="text-xs text-muted-foreground">
              The details creators need before they book.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5">
          <Field
            label="Description"
            htmlFor="description"
            error={state.fieldErrors?.description}
            hint="At least 60 characters. Mention the light, the vibe, and what the room is best for."
          >
            <Textarea
              id="description"
              name="description"
              defaultValue={values.description ?? ""}
              placeholder="A bright, column-free loft with exposed brick, a 12-foot cyc wall, and a full lighting grid. Ideal for editorial shoots, lookbooks, and small crews."
              aria-invalid={Boolean(state.fieldErrors?.description)}
              className="min-h-32 rounded-xl"
              required
            />
          </Field>

          <Field
            label="Cover image URL"
            htmlFor="imageUrl"
            error={state.fieldErrors?.imageUrl}
            hint="Leave blank to use a category image. Paste any https image URL."
          >
            <div className="relative">
              <ImageIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={values.imageUrl ?? ""}
                placeholder="https://images.example.com/your-space.jpg"
                aria-invalid={Boolean(state.fieldErrors?.imageUrl)}
                className="h-11 rounded-xl pl-9"
              />
            </div>
          </Field>

          <Field
            label="House rules"
            htmlFor="rules"
            error={state.fieldErrors?.rules}
            hint="One rule per line. We will add sensible defaults if you leave this blank."
          >
            <Textarea
              id="rules"
              name="rules"
              defaultValue={values.rules ?? ""}
              placeholder={"No smoking anywhere in the building.\nLoad-out must be finished by the end of your booking.\nPlease keep noise down in the shared hallway."}
              className="min-h-28 rounded-xl"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
            <Upload className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Amenities & booking</h2>
            <p className="text-xs text-muted-foreground">
              Select everything included with the space.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium">Amenities</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Pick at least one. More detail helps your listing get booked.
          </p>
          <div
            className="mt-3 grid max-h-72 gap-x-6 gap-y-2.5 overflow-y-auto rounded-xl border border-border/70 p-4 sm:grid-cols-2"
            aria-invalid={Boolean(state.fieldErrors?.amenities)}
          >
            {AMENITIES.map((amenity) => {
              const id = `amenity-${amenity
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`
              return (
                <div key={amenity} className="flex items-center gap-2.5">
                  <Checkbox
                    id={id}
                    name="amenities"
                    value={amenity}
                    defaultChecked={selectedAmenities.includes(amenity)}
                  />
                  <Label
                    htmlFor={id}
                    className="cursor-pointer text-sm font-normal text-foreground/85"
                  >
                    {amenity}
                  </Label>
                </div>
              )
            })}
          </div>
          {state.fieldErrors?.amenities && (
            <p className="mt-2 text-xs text-destructive">
              {state.fieldErrors.amenities}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/40 p-4">
          <Checkbox
            id="instantBook"
            name="instantBook"
            defaultChecked={instantBook}
            className="mt-0.5"
          />
          <div>
            <Label htmlFor="instantBook" className="cursor-pointer font-semibold">
              Enable instant booking
            </Label>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Let creators confirm available hours immediately. You can still
              cancel or adjust bookings from your dashboard.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 sm:flex-row sm:items-start">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-400/20 text-amber-700">
          <Lightbulb className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-950">
            A few tips from top hosts
          </p>
          <ul className="mt-2 space-y-1.5">
            {TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-xs leading-relaxed text-amber-900/75"
              >
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11 rounded-xl px-6 text-sm font-semibold"
        >
          {pending ? "Publishing…" : "Publish listing"}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
