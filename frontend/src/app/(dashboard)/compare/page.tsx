// Owner: Om
// ComparisonMatrix — HERO SCREEN — cross-payer drug policy comparison grid.
// TODO: call getComparison({ drug, policyIds }) to fetch matrix data
// TODO: render AG Grid with payers as columns, criteria rows as rows
// TODO: color-code cells: restrictive/moderate/relaxed
// TODO: add export button calling exportComparison()

export default function ComparePage() {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Comparison Matrix</h2>
            <p className="text-muted-foreground">Cross-payer drug policy comparison grid.</p>
            {/* TODO: implement comparison matrix grid */}
        </div>
    );
}
