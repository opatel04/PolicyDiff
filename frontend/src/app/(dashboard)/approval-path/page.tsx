"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, ArrowRight, ShieldCheck, FileSignature, AlertTriangle, AlertCircle } from "lucide-react";

export default function ApprovalPathPage() {
    const [generating, setGenerating] = useState(false);
    const [memoOpen, setMemoOpen] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setMemoOpen(true);
        }, 1500);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
            <div className="shrink-0">
                <h2 className="text-3xl font-bold tracking-tight mb-1">Approval Path Generator</h2>
                <p className="text-muted-text">
                    Prior authorization intelligence. Score clinical profiles against extracted criteria and generate PA memos.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Left Panel - Profile Form */}
                <div className="lg:w-[400px] shrink-0 overflow-y-auto pr-2 pb-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Patient Clinical Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label>Select Drug</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-primary-text">
                                    <option>Infliximab</option>
                                    <option>Adalimumab</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Indication</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-primary-text">
                                    <option>Rheumatoid Arthritis</option>
                                    <option>Crohn's Disease</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>ICD-10 Code</Label>
                                <Input defaultValue="M05.79" className="font-mono bg-background" />
                            </div>

                            <div className="pt-2 border-t border-border">
                                <Label className="text-muted-text">Prior Drugs Tried</Label>
                                <div className="mt-2 space-y-3">
                                    <div className="p-3 bg-background border border-border rounded-md text-sm space-y-2">
                                        <Input defaultValue="Methotrexate" className="h-8 font-mono" />
                                        <div className="flex gap-2">
                                            <Input defaultValue="16" type="number" placeholder="Weeks" className="h-8 w-24 text-right font-mono" />
                                            <select className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-xs">
                                                <option>Inadequate Response</option>
                                                <option>Intolerance</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-background border border-border rounded-md text-sm space-y-2">
                                        <Input defaultValue="Inflectra" className="h-8 font-mono" />
                                        <div className="flex gap-2">
                                            <Input defaultValue="14" type="number" placeholder="Weeks" className="h-8 w-24 text-right font-mono" />
                                            <select className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-xs">
                                                <option>Inadequate Response</option>
                                                <option>Intolerance</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-card border-dashed">
                                        + Add Trial
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border space-y-3">
                                <div className="space-y-2">
                                    <Label>Prescriber Specialty</Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-primary-text">
                                        <option>Rheumatologist</option>
                                        <option>Gastroenterologist</option>
                                        <option>Dermatologist</option>
                                        <option>Primary Care</option>
                                        <option>Other / Not Specified</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="c1" defaultChecked />
                                    <Label htmlFor="c1" className="font-normal">Diagnosis documented</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="c2" defaultChecked />
                                    <Label htmlFor="c2" className="font-normal">High disease activity documented</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel - Results */}
                <div className="flex-1 overflow-y-auto space-y-6 pb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Coverage Likelihood Scores</h3>
                        <Button onClick={handleGenerate} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={generating}>
                            {generating ? "Evaluating..." : "Evaluate Patient Profile"}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Aetna */}
                        <Card className="border-success bg-background shadow-lg shadow-success/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-success"></div>
                            <CardContent className="p-5 pt-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg">Aetna</h4>
                                    <div className="flex flex-col items-end">
                                        <span className="text-3xl font-mono font-bold text-success">92</span>
                                        <span className="text-xs text-muted-text font-mono">/100</span>
                                    </div>
                                </div>
                                <Badge variant="success" className="px-3 bg-success/20 text-success border border-success/30">
                                    Likely Approved
                                </Badge>
                                <ul className="text-sm space-y-2 text-muted-text">
                                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" /> All step therapy met (12+ wks)</li>
                                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" /> Prescriber match</li>
                                </ul>
                                <Button className="w-full mt-2" variant="outline" onClick={() => setMemoOpen(true)}>
                                    <FileSignature className="mr-2 h-4 w-4" /> Generate PA Memo
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Cigna */}
                        <Card className="border-warning bg-background shadow-lg shadow-warning/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-warning"></div>
                            <CardContent className="p-5 pt-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg">Cigna</h4>
                                    <div className="flex flex-col items-end">
                                        <span className="text-3xl font-mono font-bold text-warning">88</span>
                                        <span className="text-xs text-muted-text font-mono">/100</span>
                                    </div>
                                </div>
                                <Badge variant="warning" className="px-3 bg-warning/20 text-warning border border-warning/30">
                                    Likely Approved
                                </Badge>
                                <ul className="text-sm space-y-2 text-muted-text">
                                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" /> Step therapy met</li>
                                    <li className="flex gap-2 text-warning"><AlertTriangle className="h-4 w-4 shrink-0" /> Minor gap: disease activity doc</li>
                                </ul>
                                <Button className="w-full mt-2" variant="outline" onClick={() => setMemoOpen(true)}>
                                    <FileSignature className="mr-2 h-4 w-4" /> Generate PA Memo
                                </Button>
                            </CardContent>
                        </Card>

                        {/* UHC */}
                        <Card className="border-destructive bg-background shadow-lg shadow-destructive/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-destructive"></div>
                            <CardContent className="p-5 pt-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg">UHC</h4>
                                    <div className="flex flex-col items-end">
                                        <span className="text-3xl font-mono font-bold text-destructive">61</span>
                                        <span className="text-xs text-muted-text font-mono">/100</span>
                                    </div>
                                </div>
                                <Badge variant="destructive" className="px-3 bg-destructive/20 text-destructive border border-destructive/30">
                                    Gap Detected
                                </Badge>
                                <ul className="text-sm space-y-2 text-muted-text">
                                    <li className="flex gap-2 text-destructive"><AlertCircle className="h-4 w-4 shrink-0" /> Two DMARDs required</li>
                                    <li className="flex gap-2 text-destructive"><AlertCircle className="h-4 w-4 shrink-0" /> Must try Amjevita first</li>
                                </ul>
                                <Button className="w-full mt-2 opacity-50" variant="outline" disabled>
                                    Criteria Not Met
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {memoOpen && (
                        <Card className="border-primary mt-6">
                            <CardHeader className="bg-primary/5 border-b border-border">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">Prior Authorization Justification Memo</CardTitle>
                                        <p className="text-sm text-muted-text mt-1 font-mono">Target: Aetna Clinical Policy Bulletin 0321 (Feb 12, 2026)</p>
                                    </div>
                                    <Button size="sm">Copy to Clipboard</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="prose prose-invert max-w-none text-sm text-primary-text leading-relaxed font-serif">
                                    <p><strong>To:</strong> Aetna Prior Authorization Department</p>
                                    <p><strong>Subject:</strong> Prior Authorization Request for Infliximab</p>
                                    <br />
                                    <p>To Whom It May Concern,</p>
                                    <p>Per Aetna's Clinical Policy Bulletin 0321 for Infliximab Products (Effective February 12, 2026), this patient meets the initial authorization criteria for coverage as follows:</p>
                                    <p><strong>1. Diagnosis:</strong> The patient has a confirmed diagnosis of severely active Rheumatoid Arthritis (ICD-10: M05.79) with documented high disease activity present in the clinical notes.</p>
                                    <p><strong>2. Step Therapy Requirements:</strong> In accordance with Section II.B of CPB 0321, the patient has completed a documented inadequate response to a conventional disease-modifying antirheumatic drug (DMARD). Specifically, the patient completed a 16-week trial of Methotrexate with an inadequate response documented. Furthermore, the patient subsequently completed a 14-week trial of Inflectra (a preferred biosimilar) indicating that the patient has exhausted standard first-line therapies.</p>
                                    <p><strong>3. Prescriber Requirements:</strong> The prescribing physician is a board-certified Rheumatologist, satisfying the specialist requirement.</p>
                                    <p>Given that all criteria detailed in the aforementioned policy have been met with explicit documentation available upon request, we request immediate prior authorization for Infliximab therapy to prevent further disease progression.</p>
                                    <p>Sincerely,</p>
                                    <p>[Consultant / Provider Name]</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
