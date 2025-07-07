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
          
          {/* Sidebar with actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Analyze Another Resume
              </button>
              <button 
                onClick={() => window.location.href = '/ai-tools/ai-chat'}
                className="w-full mb-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Get Career Advice
              </button>
              <button 
                onClick={() => window.location.href = '/ai-tools/ai-roadmap-agent'}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Generate Career Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzerPage;