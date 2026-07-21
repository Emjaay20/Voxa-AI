import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 -ml-4 btn-ghost w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral max-w-none space-y-6 text-ink-muted">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-serif text-2xl text-ink">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, 
            use our practice scenarios, and interact with the AI coaches. This includes audio 
            recordings, transcripts of your speech, and the resulting analytics.
          </p>

          <h2 className="font-serif text-2xl text-ink">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services. 
            Specifically, your voice input is processed to generate transcriptions and AI-driven 
            feedback to help you improve your communication skills.
          </p>

          <h2 className="font-serif text-2xl text-ink">3. AI Processing</h2>
          <p>
            We utilize third-party AI providers (such as OpenAI and Groq) to process transcripts 
            and generate coaching feedback. By using Voxa, you consent to your transcribed text 
            being securely transmitted to these providers for processing.
          </p>

          <h2 className="font-serif text-2xl text-ink">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures designed to 
            protect the security of any personal information we process. However, please also 
            remember that we cannot guarantee that the internet itself is 100% secure.
          </p>

          <h2 className="font-serif text-2xl text-ink">5. Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may email us at 
            privacy@voxa.example.com.
          </p>
        </div>
      </div>
    </div>
  );
}
