"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle2, Loader2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PolicyUploadPage() {
    const [uploadState, setUploadState] = useState<"idle" | "uploading" | "extracting" | "complete">("idle");

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        setUploadState("uploading");
        setTimeout(() => setUploadState("extracting"), 1500);
        setTimeout(() => setUploadState("complete"), 4500);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Policy Upload</h2>
                <p className="text-muted-text mt-1">
                    Upload medical benefit drug policies for automated extraction and criteria normalization.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Document Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="payer">Payer Name</Label>
                                <select id="payer" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-primary-text">
                                    <option>UnitedHealthcare</option>
                                    <option>Aetna</option>
                                    <option>Cigna</option>
                                    <option>Anthem</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="planType">Plan Type</Label>
                                <select id="planType" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-primary-text">
                                    <option>Commercial</option>
                                    <option>Medicare Advantage</option>
                                    <option>Medicaid</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Document Title</Label>
                                <Input id="title" placeholder="e.g. Infliximab Medical Benefit Policy" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Effective Date</Label>
                                <Input id="date" type="date" className="font-mono text-sm" />
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={uploadState !== "idle"}>
                                {uploadState === "idle" ? "Upload and Extract" : "Processing..."}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className={`border-dashed border-2 ${uploadState === 'idle' ? 'border-muted-text/30' : 'border-primary/50'}`}>
                        <CardContent className="flex flex-col items-center justify-center h-48 text-center pt-6">
                            <UploadCloud className="h-10 w-10 text-muted-text mb-4" />
                            <p className="text-sm font-medium">Drag & drop PDF here</p>
                            <p className="text-xs text-muted-text mt-1">or browse files</p>
                        </CardContent>
                    </Card>

                    {uploadState !== "idle" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Extraction Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        {uploadState === "uploading" ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <CheckCircle2 className="h-4 w-4 text-success" />}
                                        <span className="text-sm">Uploading document</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {uploadState === "extracting" ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : (uploadState === "complete" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <div className="h-4 w-4 rounded-full border border-muted" />)}
                                        <span className="text-sm">Extracting Text via Textract</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {uploadState === "complete" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <div className="h-4 w-4 rounded-full border border-muted" />}
                                        <span className="text-sm">Normalizing Policy Criteria</span>
                                    </div>
                                </div>
                                {uploadState === "complete" && (
                                    <div className="pt-4 mt-4 border-t border-border">
                                        <div className="rounded-md bg-success/10 border border-success/20 p-3 mb-4">
                                            <p className="text-xs font-semibold text-success flex items-center">
                                                <FileText className="h-4 w-4 mr-2" /> Extracted 12 indications
                                            </p>
                                        </div>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/explorer">
                                                View extracted criteria <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
