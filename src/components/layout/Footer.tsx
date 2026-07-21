import * as React from "react"
import { Container } from "@/components/layout/Container"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <span className="font-medium text-foreground">GPT-5.6</span>,{" "}
            <span className="font-medium text-foreground">Codex</span>,{" "}
            <span className="font-medium text-foreground">Next.js</span>,{" "}
            <span className="font-medium text-foreground">Supabase</span>, and{" "}
            <span className="font-medium text-foreground">shadcn/ui</span>. Code available on{" "}
            <a
              href="https://github.com/Emjaay20/Voxa-AI"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  )
}
