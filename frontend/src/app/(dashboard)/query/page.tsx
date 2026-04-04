// Owner: Dominic
// QueryInterface — natural language query input with streamed/polled results.
// TODO: call submitQuery() on form submit, store returned queryId
// TODO: poll getQuery(queryId) until status === "COMPLETE"
// TODO: display answer with citations
// TODO: show query history via listQueries()

export default function QueryPage() {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Query Interface</h2>
            <p className="text-muted-foreground">Natural language query input with streamed results and citations.</p>
            {/* TODO: implement query input and results panel */}
        </div>
    );
}
