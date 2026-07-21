import * as React from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { cn } from "@/lib/cn"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight">Voxa</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex text-muted-foreground hover:text-foreground")}>
              Sign In
            </Link>
            <Link href="/practice" className={cn(buttonVariants({ variant: "default" }), "rounded-full shadow-sm")}>
              Start Practicing
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
