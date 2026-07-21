import { Loader2 } from "lucide-react"

export default function PracticeLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Preparing practice environment...</p>
    </div>
  )
}
