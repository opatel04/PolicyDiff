"use client";

import { ReactNode } from "react";
import { ArrowRight, FileText, RefreshCw, Search, CheckCircle2 } from "lucide-react";

// --- Components ---

const Button = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    href
}: {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary';
    className?: string;
    onClick?: () => void;
    href?: string;
}) => {
    const baseStyles = "px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-terracotta text-white hover:opacity-90",
        secondary: "bg-charcoal text-white hover:opacity-90",
        tertiary: "text-charcoal hover:translate-x-1",
    };

    const classes = `${baseStyles} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button
            onClick={onClick}
            className={classes}
        >
            {children}
        </button>
    );
};

const Navbar = () => {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navItemStyles = "relative transition-all duration-300 hover:text-charcoal hover:scale-110 hover:font-bold cursor-pointer group pb-1";
    const underlineStyles = "absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta/40 transition-all duration-300 group-hover:w-full";

    return (
        <nav className="glass-header sticky top-0 z-50 border-b border-charcoal/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <span
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="font-serif text-2xl italic font-medium text-terracotta cursor-pointer"
                    >
                        PolicyDiff
                    </span>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal/60">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className={navItemStyles}
                        >
                            Platform
                            <div className={underlineStyles} />
                        </button>
                        <button
                            onClick={() => scrollTo('insights')}
                            className={navItemStyles}
                        >
                            Insights
                            <div className={underlineStyles} />
                        </button>
                        <button
                            onClick={() => scrollTo('methodology')}
                            className={navItemStyles}
                        >
                            Methodology
                            <div className={underlineStyles} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="tertiary" className="text-sm py-2 px-4" href="/auth/login?returnTo=/">Sign In</Button>
                    <Button variant="primary" className="text-sm py-2 px-6" href="/auth/login?screen_hint=signup&returnTo=/">Get Started</Button>
                </div>
            </div>
        </nav>
    );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="flex flex-col gap-4">
        <div className="w-10 h-10 rounded-full bg-[#E8E7E4] flex items-center justify-center text-terracotta/60">
            <Icon size={20} />
        </div>
        <h3 className="text-2xl font-medium">{title}</h3>
        <p className="text-charcoal/60 leading-relaxed text-lg">
            {description}
        </p>
    </div>
);

const Separator = () => (
    <div className="w-full px-6">
        <div className="max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-charcoal/10 to-transparent" />
    </div>
);

const SectionLabel = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
    <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold mb-4 ${className}`}>
        {children}
    </span>
);

export default function App() {
    return (
        <div className="min-h-screen bg-alabaster text-charcoal font-sans selection:bg-terracotta/10 selection:text-terracotta">
            <Navbar />

            {/* Hero Section */}
            <section className="relative isolate z-0 pt-24 pb-32 px-6 overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto text-center mb-20">
                    <h1 className="font-serif text-6xl md:text-8xl font-medium leading-[1.1] mb-8">
                        Stop reading policy PDFs. <br />
                        <span className="italic">Start acting on data.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-charcoal/60 max-w-2xl mx-auto leading-relaxed mb-12">
                        PolicyDiff is a purpose-built medical benefit drug intelligence engine.
                        We turn 30-page payer PDFs into structured, comparable, and actionable insights in seconds.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button variant="secondary" href="/auth/login?returnTo=/">See the Demo</Button>
                        <Button
                            variant="tertiary"
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            How it Works <ArrowRight size={18} />
                        </Button>
                    </div>
                </div>

                {/* Hero Image Container */}
                <div className="pointer-events-none relative z-10 max-w-6xl mx-auto">
                    <div className="aspect-[16/10] bg-[#e89a74] rounded-2xl md:rounded-2xl overflow-hidden p-8 md:p-16 flex items-center justify-center">
                        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden editorial-shadow">
                            {/* Mock App UI */}
                            <div className="w-full h-12 bg-surface-low border-b border-charcoal/5 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-terracotta/20" />
                                <div className="w-3 h-3 rounded-full bg-terracotta/20" />
                                <div className="w-3 h-3 rounded-full bg-terracotta/20" />
                            </div>
                            <div className="h-[calc(100%-3rem)] bg-white">
                                <img
                                    src="/dashboard.webp"
                                    alt="PolicyDiff landing page dashboard preview"
                                    className="h-full w-full object-cover object-top"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Features Grid */}
            <section id="how-it-works" className="py-32 px-6 bg-surface-low/30 scroll-mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <SectionLabel className="bg-terracotta/10 text-terracotta">The Problem</SectionLabel>
                        <h2 className="font-serif text-5xl md:text-6xl font-medium leading-tight">
                            Why policy research <br /> is broken today.
                        </h2>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 md:gap-24">
                    <FeatureCard
                        icon={FileText}
                        title="Manual PDF Parsing"
                        description="Consultants spend hours reading complex medical benefit PDFs. We automate the extraction of clinical criteria and prior authorization rules."
                    />
                    <FeatureCard
                        icon={RefreshCw}
                        title="Missed Updates"
                        description="Policies change mid-quarter without notice. Patients lose coverage while you're still working from last month's manual spreadsheet."
                    />
                    <FeatureCard
                        icon={Search}
                        title="No Cross-Payer Visibility"
                        description="Knowing what one payer requires isn't enough. PolicyDiff maps coverage criteria across every payer in your portfolio so you can spot differences at a glance."
                    />
                </div>
            </section>


            <Separator />

            {/* Alternating Sections */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col gap-48">

                    {/* Section 1 */}
                    <div id="insights" className="grid items-center gap-16 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20 scroll-mt-25">
                        <div className="max-w-lg">
                            <SectionLabel className="bg-[#D8E2CF] text-[#4A5D45]">Efficiency</SectionLabel>
                            <h2 className="font-serif text-5xl md:text-6xl font-medium mb-8 leading-tight">
                                Cross-Payer <br /> Comparison
                            </h2>
                            <p className="text-xl text-charcoal/60 leading-relaxed mb-10">
                                Visualize coverage landscapes across multiple payers in a single view. No more side-by-side browser tabs or manual data entry into Excel.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm font-medium text-charcoal/80">
                                    <CheckCircle2 size={18} style={{ color: '#BAE3A1' }} /> Compare step therapy and prior auth rules across payers
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium text-charcoal/80">
                                    <CheckCircle2 size={18} style={{ color: '#BAE3A1' }} /> Filter by drug, payer, or policy type in seconds
                                </li>
                            </ul>
                        </div>
                        <div className="w-full justify-self-end rounded-2xl aspect-[1812/1204] bg-[#f7f4ef] p-3 md:p-4">
                            <div className="h-full w-full overflow-hidden rounded-[1.45rem] border-2 border-charcoal/90 bg-white shadow-[0_24px_50px_rgba(28,28,26,0.12)]">
                                <img
                                    src="/comparsion.webp"
                                    alt="Cross-payer comparison dashboard preview"
                                    className="h-full w-full object-contain object-center"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="grid items-center gap-16 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
                        <div className="order-2 md:order-1 w-full rounded-2xl aspect-[1792/1208] bg-[#4a807a] p-4 md:p-6">
                            <div className="h-full w-full overflow-hidden rounded-[1.45rem] border-2 border-charcoal/25 bg-white shadow-[0_24px_50px_rgba(28,28,26,0.16)]">
                                <img
                                    src="/approval_path.webp"
                                    alt="Approval path generator dashboard preview"
                                    className="h-full w-full object-contain object-center"
                                />
                            </div>
                        </div>
                        <div className="order-1 md:order-2 max-w-lg">
                            <SectionLabel className="bg-[#FFDBD3] text-[#4D261A]">Clinical Insight</SectionLabel>
                            <h2 className="font-serif text-5xl md:text-6xl font-medium mb-8 leading-tight">
                                The Approval <br /> Path Generator
                            </h2>
                            <p className="text-xl text-charcoal/60 leading-relaxed mb-10">
                                Input a patient profile and see exactly which payers will approve the therapy—and what clinical evidence is required to secure the prior authorization.
                            </p>
                            <Button variant="primary" className="bg-[#4d261a]" href="/auth/login?returnTo=/approval-path">Explore Clinical Paths</Button>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="grid items-center gap-16 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-20">
                        <div className="order-1 md:order-2 w-full justify-self-end rounded-2xl bg-[#F5F2ED] p-4 md:p-6">
                            <div className="mx-auto w-full max-w-[34rem] overflow-hidden rounded-[1.45rem] border-2 border-charcoal/85 bg-white shadow-[0_24px_50px_rgba(28,28,26,0.12)]">
                                <img
                                    src="/ai_screenshot.webp"
                                    alt="AI search cited answers dashboard preview"
                                    className="h-auto w-full object-contain"
                                />
                            </div>
                        </div>
                        <div className="order-2 md:order-1 max-w-lg">
                            <SectionLabel className="bg-[#F3EFE0] text-[#8B7E66]">AI Search</SectionLabel>
                            <h2 className="font-serif text-5xl md:text-6xl font-medium mb-8 leading-tight">
                                Ask anything. <br /> Get cited answers.
                            </h2>
                            <p className="text-xl text-charcoal/60 leading-relaxed mb-10">
                                Stop <code className="text-sm bg-surface-low px-1 rounded">Ctrl+F</code>ing through 30-page PDFs. Ask plain English questions like "What are the step therapy rules for Infliximab under Aetna?" and get instant, accurate answers with direct citations back to the source document.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <Separator />

            {/* Testimonial Section */}
            <section className="py-32 px-6 bg-surface-low/50">
                <div id="methodology" className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center scroll-mt-38">
                    <div>
                        <h2 className="font-serif text-6xl md:text-7xl font-medium mb-12 leading-tight">
                            Built for Pharmacy <br /> Consultants.
                        </h2>
                        <p className="text-2xl text-charcoal/80 leading-relaxed max-w-md">
                            For firms like Anton RX, accuracy is the only currency. We've helped their clinical teams turn <span className="italic">three days of manual research</span> into a <span className="font-bold text-terracotta">three-second query</span>.
                        </p>
                    </div>
                    <div className="bg-white p-12 md:p-16 rounded-2xl editorial-shadow relative">
                        <p className="text-3xl md:text-4xl font-serif leading-tight mb-12">
                            "The competitive advantage PolicyDiff provides is immeasurable. It's the difference between guessing and knowing."
                        </p>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
                                alt="Director of Clinical Strategy"
                                className="w-14 h-14 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <div>
                                <p className="font-bold text-sm">Director of Clinical Strategy</p>
                                <p className="text-charcoal/40 text-xs">Anton RX Solutions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-charcoal/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
                    <div className="max-w-xs">
                        <span className="font-serif text-xl italic font-medium text-terracotta mb-4 block">PolicyDiff</span>
                        <p className="text-xs text-charcoal/40 leading-relaxed">
                            © 2026 PolicyDiff. Curated Healthcare Policy Intelligence.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-x-12 gap-y-4 text-[10px] uppercase tracking-widest font-bold text-charcoal/60">
                        <a href="#" className="hover:text-terracotta transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-terracotta transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-terracotta transition-colors">Security</a>
                        <a href="#" className="hover:text-terracotta transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
