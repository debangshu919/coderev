import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MoveRight,
  GitCommitHorizontal,
  FileCode2,
  MessagesSquare,
  Bot,
  Zap,
  ShieldCheck,
  Code2,
  GitPullRequest,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/coderevlogo.png"
              alt="CodeRev Logo"
              width={32}
              height={32}
              className="rounded-lg bg-primary/10"
            />
            <span className="font-bold text-lg hidden sm:inline-block font-jetbrains-mono">CodeRev</span>
          </Link>
          <nav className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">Get Started</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-24 border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 -z-10" />
          <div className="container px-4 flex flex-col items-center text-center gap-8 max-w-5xl mx-auto">
            <Badge variant="secondary" className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
              <span className="mr-2">✨</span> New: AI Architecture Engine
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Code Reviews that <br className="hidden sm:inline" />
                <span className="text-primary">Actually Understand Context</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Stop verifying syntax. Start reviewing logic. CodeRev analyzes your entire codebase to provide context-aware feedback, spot architectural issues, and enforce best practices instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-8">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20">
                    Start Reviewing Free
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </SignedIn>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5" asChild>
                <Link href="#how-it-works">How it Works</Link>
              </Button>
            </div>

            <div className="mt-16 w-full max-w-5xl rounded-xl border border-white/10 bg-card/50 shadow-2xl overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-background/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="ml-4 text-xs text-muted-foreground font-mono">coderev-analysis.tsx</div>
              </div>
              <div className="p-8 font-mono text-sm text-left grid md:grid-cols-2 gap-8">
                <div className="space-y-4 opacity-50 blur-[1px]">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-1/2 bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-white/10 rounded" />
                  <div className="h-4 w-2/3 bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                </div>
                <div className="relative border-l-2 border-primary pl-6 py-2 space-y-3">
                  <div className="absolute -left-[9px] top-6 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                  <p className="text-primary font-bold mb-2 flex items-center gap-2">
                    <Bot className="w-4 h-4" /> AI Insight
                  </p>
                  <p className="text-muted-foreground">
                    This function re-implements auth logic found in <span className="text-foreground bg-white/10 px-1 rounded">auth/utils.ts</span>.
                  </p>
                  <p className="text-muted-foreground">
                    Consider importing <span className="text-blue-400">validateSession</span> to ensure security consistency across modules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container px-4 py-24 mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Built for Modern Engineering Teams</h2>
            <p className="text-muted-foreground text-lg">Stop checking styles. Start checking architecture.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<FileCode2 className="w-10 h-10 text-blue-500" />}
              title="Context Aware"
              description="CodeRev reads your file structure and dependencies. It knows a 'User' model in one file relates to the 'Auth' service in another."
            />
            <FeatureCard
              icon={<GitCommitHorizontal className="w-10 h-10 text-purple-500" />}
              title="Diff Analysis"
              description="Analyzes changes in isolation but evaluates them in context. It understands how a 5-line change affects the whole system."
            />
            <FeatureCard
              icon={<MessagesSquare className="w-10 h-10 text-green-500" />}
              title="Constructive Feedback"
              description="Forget 'fix this'. CodeRev explains *why* a change is risky and suggests safe, refactored alternatives."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10 text-yellow-500" />}
              title="Instant feedback"
              description="Get reviews in seconds, not hours. Unblock your team and keep the momentum going."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-red-500" />}
              title="Security First"
              description="Proactively spots common vulnerabilities like SQL injection or exposed secrets before they commit."
            />
            <FeatureCard
              icon={<Code2 className="w-10 h-10 text-cyan-500" />}
              title="Language Agnostic"
              description="Supports TypeScript, Python, Go, Rust, and more. If it's code, we can review it."
            />
          </div>
        </section>

        {/* AI Architect Section */}
        <section id="how-it-works" className="border-y border-white/5 bg-white/[0.02]">
          <div className="container px-4 py-32 mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl">The AI Agent Architecture</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  CodeRev isn't just a wrapper around an LLM. It uses a multi-stage agentic workflow to understand, critique, and improve your code.
                </p>

                <div className="space-y-6">
                  <Step
                    number="01"
                    title="Ingestion & Mapping"
                    desc="We parse your entire repository to build a dependency graph, understanding how modules interact."
                  />
                  <Step
                    number="02"
                    title="Diff Contextualization"
                    desc="We map the specific changes in your PR to the broader graph to identify ripple effects."
                  />
                  <Step
                    number="03"
                    title="Review Generation"
                    desc="Our specialized agents critique the code for logic, security, and performance, not just style."
                  />
                </div>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-20" />
                <div className="relative grid gap-4">
                  <div className="p-6 bg-card border border-white/10 rounded-xl relative z-10 transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                        <GitPullRequest className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg">Input: Pull Request</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Raw diffs + file tree structure</p>
                  </div>

                  <div className="mx-auto w-0.5 h-8 bg-white/10" />

                  <div className="p-6 bg-card border border-white/10 rounded-xl relative z-10 transition-transform hover:-translate-y-1 duration-300 ring-1 ring-primary/50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-primary/20 text-primary rounded-lg">
                        <Bot className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg">Agent Core</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Knowledge Graph Analysis • Security Scan • Style Check</p>
                  </div>

                  <div className="mx-auto w-0.5 h-8 bg-white/10" />

                  <div className="p-6 bg-card border border-white/10 rounded-xl relative z-10 transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-green-500/20 text-green-500 rounded-lg">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg">Output: Actionable Review</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Line-specific comments & code suggestions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-24 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8 p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
            <h2 className="text-4xl font-bold tracking-tight">Ready to streamline your code reviews?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of developers who trust CodeRev to keep their codebase clean and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="h-12 px-8 text-base">Get Started for Free</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background py-12">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/coderevlogo.png"
              alt="CodeRev Logo"
              width={32}
              height={32}
              className="rounded-lg bg-primary/10"
            />
            <span className="font-bold font-jetbrains-mono">CodeRev</span>
          </Link>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeRev Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/30 border-white/5 hover:bg-card/50 transition-colors">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-6">
      <span className="text-4xl font-mono font-bold text-white/10">{number}</span>
      <div className="space-y-2 pt-2">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
