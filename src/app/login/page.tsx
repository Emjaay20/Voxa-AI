import { AuthForm } from "@/features/auth/components/AuthForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col p-6 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-50 w-full max-w-7xl mx-auto flex items-center mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-full hover:bg-muted/50"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 w-full flex-1 flex items-center justify-center -mt-16">
        <AuthForm />
      </div>
    </div>
  )
}
