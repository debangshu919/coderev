"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Play, Code, GitBranch, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react"

interface Issue {
    id: string;
    type: 'bug' | 'security' | 'style' | 'performance' | 'best_practice';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    explanation: string;
    technical_explanation: string;
    file?: string;
    line?: number;
    code_snippet?: string;
}

interface ReviewResult {
    summary: string;
    scoring: {
        bug_risk: number;
        security: number;
        code_quality: number;
        maintainability: number;
    };
    issues: Issue[];
    error?: string;
}

const getSeverityStyles = (severity: string) => {
    switch (severity) {
        case 'critical': return { border: 'border-l-red-600', badge: 'bg-red-600 hover:bg-red-700' };
        case 'high': return { border: 'border-l-orange-500', badge: 'bg-orange-500 hover:bg-orange-600' };
        case 'medium': return { border: 'border-l-yellow-500', badge: 'bg-yellow-500 hover:bg-yellow-600' };
        case 'low': return { border: 'border-l-blue-500', badge: 'bg-blue-500 hover:bg-blue-600' };
        case 'best_practice': return { border: 'border-l-green-500', badge: 'bg-green-500 hover:bg-green-600' };
        default: return { border: 'border-l-gray-500', badge: 'bg-gray-500 hover:bg-gray-600' };
    }
};

const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage <= 30) return "bg-red-500";
    return "bg-yellow-500";
};

const getBeginnerLabel = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage > 80) return { label: "Great", color: "text-green-500", icon: CheckCircle };
    if (percentage < 30) return { label: "High Risk", color: "text-red-500", icon: AlertTriangle };
    return { label: "Needs Attention", color: "text-yellow-500", icon: Info };
};

export default function Dashboard() {
    const [code, setCode] = useState("")
    const [repoUrl, setRepoUrl] = useState("")

    const [isBeginnerMode, setIsBeginnerMode] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [results, setResults] = useState<ReviewResult | null>(null)
    const [activeTab, setActiveTab] = useState("paste")
    const [error, setError] = useState<string | null>(null)


    const handleAnalyze = async () => {
        setIsAnalyzing(true)
        setResults(null)
        setError(null)

        try {
            const body = JSON.stringify({
                type: activeTab === 'repo' ? 'url' : activeTab,
                code: activeTab === 'paste' ? code : undefined,
                repoUrl: activeTab === 'repo' ? repoUrl : undefined,
            });

            const response = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });

            const data = await response.json();

            // ... existing error handling and sorting logic ...

            if (!response.ok) {
                throw new Error(data.error || "Review failed");
            }

            // Sort issues by severity
            if (data.issues && Array.isArray(data.issues)) {
                const severityPriority: Record<string, number> = {
                    'critical': 0,
                    'high': 1,
                    'medium': 2,
                    'low': 3,
                    'best_practice': 4
                };

                data.issues.sort((a: Issue, b: Issue) => {
                    const priorityA = severityPriority[a.severity] ?? 99;
                    const priorityB = severityPriority[b.severity] ?? 99;
                    return priorityA - priorityB;
                });
            }

            setResults(data);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    }

    // Helper component for Score Display
    const ScoreItem = ({ label, score, max, description }: { label: string, score: number, max: number, description: string }) => {
        const { label: beginnerLabel, color, icon: Icon } = getBeginnerLabel(score, max);

        return (
            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">{label}</span>
                    {isBeginnerMode ? (
                        <span className={`flex items-center gap-1 font-bold ${color}`}>
                            <Icon className="w-3 h-3" /> {beginnerLabel}
                        </span>
                    ) : (
                        <span className={`font-mono font-bold ${color}`}>{score}/{max}</span>
                    )}
                </div>
                {isBeginnerMode ? (
                    <p className="text-xs text-muted-foreground">{description}</p>
                ) : (
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getScoreColor(score, max)} transition-all duration-500`}
                            style={{ width: `${Math.max((score / max) * 100, 5)}%` }}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            <header className="border-b px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/coderevlogo.png"
                        alt="CodeRev Logo"
                        width={32}
                        height={32}
                        className="rounded-lg bg-primary/10"
                    />
                    <span className="font-bold text-xl font-jetbrains-mono">CodeRev</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="beginner-mode"
                            checked={isBeginnerMode}
                            onCheckedChange={setIsBeginnerMode}
                        />
                        <Label htmlFor="beginner-mode" className="cursor-pointer">Beginner Explanation Mode</Label>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-hidden">
                {/* Left Column: Input */}
                <div className="flex flex-col gap-4 h-full overflow-hidden">
                    <Card className="flex flex-col h-full border-0 shadow-none md:border md:shadow-sm">
                        <CardHeader>
                            <CardTitle>Code Input</CardTitle>
                            <CardDescription>Submit code or provide a repository for review.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden flex flex-col">
                            <Tabs defaultValue="paste" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="paste"><Code className="w-4 h-4 mr-2" /> Paste Code</TabsTrigger>
                                    <TabsTrigger value="repo"><GitBranch className="w-4 h-4 mr-2" /> GitHub URL</TabsTrigger>
                                </TabsList>
                                <TabsContent value="paste" className="flex-1 mt-4">
                                    <Textarea
                                        placeholder="Paste your code here..."
                                        className="h-full min-h-[300px] font-mono resize-none"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </TabsContent>
                                <TabsContent value="repo" className="flex-1 mt-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="repo-url">Repository URL</Label>
                                            <Input
                                                id="repo-url"
                                                placeholder="https://github.com/username/repo"
                                                value={repoUrl}
                                                onChange={(e) => setRepoUrl(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                CodeRev will clone the latest commit from this public repository.
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            {error && (
                                <div className="w-full p-2 text-sm text-destructive bg-destructive/10 rounded mb-2">
                                    Error: {error}
                                </div>
                            )}
                            <Button className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing with Gemini...
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-2 h-4 w-4" />
                                        Start AI Review
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column: Output */}
                <div className="flex flex-col gap-4 h-full overflow-hidden">
                    <Card className="flex flex-col h-full border-0 shadow-none md:border md:shadow-sm bg-muted/30">
                        <CardHeader>
                            <CardTitle>Review Results</CardTitle>
                            <CardDescription>
                                {results ? "Analysis complete." : "Waiting for input..."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden relative">
                            {!results && !isAnalyzing && (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                                    <div className="bg-muted p-4 rounded-full">
                                        <Play className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p>Enter code and click Start AI Review</p>
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p>Gemini is thinking...</p>
                                </div>
                            )}

                            {results && (
                                <ScrollArea className="h-full pr-4">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <Card className="bg-card/50 border-0 shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Analysis Scores</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {results.scoring && (
                                                        <>
                                                            <ScoreItem
                                                                label="Bug Risk"
                                                                score={results.scoring.bug_risk}
                                                                max={30}
                                                                description="How likely the code is to break."
                                                            />
                                                            <ScoreItem
                                                                label="Security"
                                                                score={results.scoring.security}
                                                                max={30}
                                                                description="How safe the code is from hackers."
                                                            />
                                                            <ScoreItem
                                                                label="Code Quality"
                                                                score={results.scoring.code_quality}
                                                                max={25}
                                                                description="How easy it is to read and understand."
                                                            />
                                                            <ScoreItem
                                                                label="Maintainability"
                                                                score={results.scoring.maintainability}
                                                                max={15}
                                                                description="How easy it is to change in the future."
                                                            />
                                                        </>
                                                    )}
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-card/50 border-0 shadow-sm flex flex-col justify-center">
                                                <CardHeader>
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                        Summary
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {results.summary}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {results.issues.length === 0 && (
                                            <div className="text-center p-8 text-muted-foreground">
                                                No issues found! Great job. 🎉
                                            </div>
                                        )}

                                        {results.issues.map((issue: Issue) => {
                                            const styles = getSeverityStyles(issue.severity);
                                            return (
                                                <Card key={issue.id} className={`border-l-4 ${styles.border}`}>
                                                    <CardHeader className="pb-2">
                                                        <div className="flex justify-between items-start">
                                                            <CardTitle className="text-base flex items-center gap-2">
                                                                {issue.type === 'security' ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Code className="w-4 h-4" />}
                                                                {issue.title}
                                                            </CardTitle>
                                                            <Badge className={`${styles.badge} text-white hover:text-white`}>
                                                                {issue.severity}
                                                            </Badge>
                                                        </div>
                                                        <CardDescription className="font-mono text-xs mt-1">
                                                            {issue.file ? `${issue.file}:${issue.line || '?'}` : 'Snippet'}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-foreground mb-2">{issue.description}</p>
                                                        <div className="bg-muted/50 p-3 rounded-md text-sm transition-all duration-300">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                                    {isBeginnerMode ? "🤖 Simple Explanation" : "💡 Technical Detail"}
                                                                </p>
                                                            </div>

                                                            <div className="animate-in fade-in slide-in-from-top-1 prose dark:prose-invert prose-sm max-w-none">
                                                                <ReactMarkdown
                                                                    components={{
                                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                        code: ({ className, children, ...props }: { className?: string, children?: React.ReactNode, [key: string]: any }) => {
                                                                            const match = /language-(\w+)/.exec(className || '')
                                                                            return !match ? (
                                                                                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
                                                                                    {children}
                                                                                </code>
                                                                            ) : (
                                                                                <code className={className} {...props}>
                                                                                    {children}
                                                                                </code>
                                                                            )
                                                                        }
                                                                    }}
                                                                >
                                                                    {isBeginnerMode ? issue.explanation : issue.technical_explanation}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </ScrollArea>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
