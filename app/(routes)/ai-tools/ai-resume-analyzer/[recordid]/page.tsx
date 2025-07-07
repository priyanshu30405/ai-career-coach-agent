"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Report from "./_components/Report";

interface ResumeAnalysisData {
  overall_score: number;
  overall_feedback: string;
  summary_comment: string;
  sections?: Record<string, { score: number; comment?: string }>;
  tips_for_improvement?: string[];
  whats_good?: string[];
  needs_improvement?: string[];
}

function ResumeAnalyzerPage() {
  const { recordid } = useParams();
  const [analysisData, setAnalysisData] = useState<ResumeAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recordid) {
      fetchResumeAnalysis();
    }
  }, [recordid]);

  const fetchResumeAnalysis = async () => {
    try {
      setLoading(true);
      console.log('Fetching resume analysis for recordId:', recordid);
      const result = await axios.get('/api/history?recordId=' + recordid);
      console.log('API response:', result.data);
      
      if (result.data && result.data.content) {
        setAnalysisData(result.data.content);
      } else {
        console.log('No content found in response');
        setError('Resume analysis data not found');
      }
    } catch (error) {
      console.error('Error fetching resume analysis:', error);
      if (axios.isAxiosError(error)) {
        setError(`Failed to load resume analysis: ${error.response?.data?.error || error.message}`);
      } else {
        setError('Failed to load resume analysis data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Loading your resume analysis...</div>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error || "No resume analysis data available"}</div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Analysis Results</h1>
          <p className="text-gray-600">Your AI-powered resume analysis is ready</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analysis Report */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Report aiReport={analysisData} />
            </div>
          </div>
          
          {/* Sidebar with resume insights */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-violet-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl shadow-xl p-6 flex flex-col gap-6 border border-blue-100 dark:border-blue-900 backdrop-blur-lg">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Resume Insights
              </h3>
              {/* Strengths */}
              {analysisData.whats_good && analysisData.whats_good.length > 0 && (
                <div>
                  <div className="font-semibold text-green-700 mb-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    Strengths
                  </div>
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {analysisData.whats_good.map((tip, idx) => (
                      <li key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Areas to Improve */}
              {analysisData.needs_improvement && analysisData.needs_improvement.length > 0 && (
                <div>
                  <div className="font-semibold text-yellow-700 mb-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                    Areas to Improve
                  </div>
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {analysisData.needs_improvement.map((tip, idx) => (
                      <li key={idx} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Tips for Improvement */}
              {analysisData.tips_for_improvement && analysisData.tips_for_improvement.length > 0 && (
                <div>
                  <div className="font-semibold text-blue-700 mb-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01"/></svg>
                    AI Tips
                  </div>
                  <ul className="list-disc list-inside text-sm text-blue-900 dark:text-blue-200 space-y-1 pl-2">
                    {analysisData.tips_for_improvement.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Quick Actions */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzerPage;