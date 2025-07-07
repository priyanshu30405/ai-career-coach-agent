import React from 'react';

interface SectionData {
  score: number;
  comment?: string;
}
interface AiReportType {
  overall_score: number;
  overall_feedback: string;
  summary_comment: string;
  sections?: Record<string, SectionData>;
  tips_for_improvement?: string[];
  whats_good?: string[];
  needs_improvement?: string[];
}

interface ReportProps {
  aiReport?: AiReportType;
}

function Report({ aiReport }: ReportProps) {
  // Debug output
  console.log('AI Report:', aiReport);
  console.log('AI Report type:', typeof aiReport);
  console.log('AI Report keys:', aiReport ? Object.keys(aiReport) : 'null');

  if (!aiReport) return <div>Loading analysis...</div>;
  if (typeof aiReport !== 'object') return <div>Invalid analysis data: {typeof aiReport}</div>;

  // Check for missing fields
  const missingFields = [];
  if (!aiReport.sections) missingFields.push('sections');
  if (!aiReport.tips_for_improvement) missingFields.push('tips_for_improvement');
  if (!aiReport.whats_good) missingFields.push('whats_good');
  if (!aiReport.needs_improvement) missingFields.push('needs_improvement');

  return (
    <aside className="w-full h-full no-scrollbar bg-gray-100 border-r border-gray-200 overflow-y-auto pt-6 px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 gradient-component-text">AI Analysis Results</h2>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-blue-200 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
          <i className="fas fa-star text-yellow-500 mr-2"></i> Overall Score
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-6xl font-extrabold text-blue-600">{aiReport.overall_score}<span className="text-2xl">/100</span></span>
          <div className="flex items-center">
            <span className="text-green-500 text-lg font-bold">{aiReport.overall_feedback}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${aiReport.overall_score || 0}%` }}></div>
        </div>
        <p className="text-gray-600 text-sm">{aiReport.summary_comment}</p>
      </div>
      {/* Section Scores */}
      {aiReport.sections && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {Object.entries(aiReport.sections).map(([section, data]: [string, SectionData]) => (
            <div key={section} className={`bg-white rounded-lg shadow-md p-5 border border-green-200 relative overflow-hidden group`}>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">{section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
              <span className="text-4xl font-bold highlight-text">{data.score}%</span>
              {data.comment && <p className="text-sm text-gray-600">{data.comment}</p>}
            </div>
          ))}
        </div>
      )}
      {/* Tips for Improvement */}
      {aiReport.tips_for_improvement && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
            <i className="fas fa-lightbulb text-orange-400 mr-2"></i> Tips for Improvement
          </h3>
          <ol>
            {aiReport.tips_for_improvement.map((tip: string, idx: number) => (
              <li key={idx} className="flex items-start mb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                  <i className="fas fa-check"></i>
                </span>
                <div>
                  <p className="font-semibold text-gray-800">{tip}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
      {/* What's Good */}
      {aiReport.whats_good && (
        <div className="bg-white rounded-lg shadow-md p-5 border border-green-200 mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-hand-thumbs-up text-green-500 mr-2"></i> What's Good
          </h3>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            {aiReport.whats_good.map((good: string, idx: number) => <li key={idx}>{good}</li>)}
          </ul>
        </div>
      )}
      {/* Needs Improvement */}
      {aiReport.needs_improvement && (
        <div className="bg-white rounded-lg shadow-md p-5 border border-red-200 mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-hand-thumbs-down text-red-500 mr-2"></i> Needs Improvement
          </h3>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            {aiReport.needs_improvement.map((bad: string, idx: number) => <li key={idx}>{bad}</li>)}
          </ul>
        </div>
      )}
      {/* Show missing fields warning */}
      {missingFields.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4">
          <p className="font-bold">Warning: Missing analysis fields:</p>
          <ul className="list-disc list-inside">
            {missingFields.map(f => <li key={f}>{f}</li>)}
          </ul>
          <p className="text-xs mt-2">If you want to see more analysis, make sure your backend/AI returns these fields.</p>
        </div>
      )}
    </aside>
  );
}

export default Report;