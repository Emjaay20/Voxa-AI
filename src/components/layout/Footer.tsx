import * as React from "react"
import { Container } from "@/components/layout/Container"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for OpenAI Build Week 2026. Code available on{" "}
            <a
              href="https://github.com/Emjaay20/Voxa-AI"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
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
