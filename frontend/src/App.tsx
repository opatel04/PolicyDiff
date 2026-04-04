// Owner: Om / Dominic
// App — React Router setup for all 9 screens.

import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PolicyUpload from "./pages/PolicyUpload";
import PolicyList from "./pages/PolicyList";
import PolicyDetail from "./pages/PolicyDetail";
import ComparisonMatrix from "./pages/ComparisonMatrix";
import QueryInterface from "./pages/QueryInterface";
import DiffFeed from "./pages/DiffFeed";
import DiscordanceView from "./pages/DiscordanceView";
import ApprovalPathGenerator from "./pages/ApprovalPathGenerator";

// TODO: add a shared Layout component (nav, sidebar) wrapping the routes

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<PolicyUpload />} />
      <Route path="/policies" element={<PolicyList />} />
      <Route path="/policies/:id" element={<PolicyDetail />} />
      <Route path="/compare" element={<ComparisonMatrix />} />
      <Route path="/query" element={<QueryInterface />} />
      <Route path="/diffs" element={<DiffFeed />} />
      <Route path="/discordance" element={<DiscordanceView />} />
      <Route path="/approval-path" element={<ApprovalPathGenerator />} />
    </Routes>
  );
}
