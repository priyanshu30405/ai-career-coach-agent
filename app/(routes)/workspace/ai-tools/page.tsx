"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function AiToolsPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (recordId) {
      fetch(`/api/history?recordId=${recordId}`)
        .then(res => res.json())
        .then(data => setAnalysis(data.content));
    }
  }, [recordId]);

  // Optionally, fetch all history for the user and show a table

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">AI Resume Analysis</h1>
      {analysis ? (
        <div>
          {/* Render your analysis results here, e.g. scores, suggestions */}
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      ) : (
        <div>Loading analysis...</div>
      )}
    </div>
  );
} 