"use client"

import { useState } from "react"
import { Check, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  if (subscribed) {
    return (
      <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-3 text-sm text-amber-100">
        <Check className="mt-0.5 size-4 shrink-0" />
        <p>You&apos;re on the list. Look out for the next call sheet.</p>
      </div>
    )
  }

  return (
    <form
      className="mt-5 flex flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault()
        if (!email.trim()) return
        setSubscribed(true)
        setEmail("")
      }}
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@studio.com"
        aria-label="Email address"
        className="h-9 border-white/15 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-amber-300/50 dark:bg-white/5"
      />
      <Button
        type="submit"
        className="h-9 shrink-0 bg-amber-400 text-[#17120a] hover:bg-amber-300"
      >
        <Send className="size-3.5" />
        Subscribe
      </Button>
    </form>
  )
}
