"use client"
import Image from 'next/image';
import { Button } from "@/components/ui/button"; 
import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

function History() {
  const [userHistory,setUserHistory] = useState<any[]>([]);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState<any>(null);
  const router = useRouter();

  useEffect(()=>{
    GetHistory();
  },[])

  const GetHistory=async ()=>{
    const result=await axios.get('/api/history');
    // Sort by createdAt descending (latest first)
    const sorted = [...result.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setUserHistory(sorted);
  }

  // Clear all history for the user
  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) return;
    try {
      await axios.delete('/api/history?clearAll=true');
      setUserHistory([]);
    } catch (e) {
      alert('Failed to clear history.');
    }
  };

  const handleDelete = async (recordId: string) => {
    try {
      await axios.delete(`/api/history?recordId=${recordId}`);
      setUserHistory(prev => prev.filter((item: any) => item.recordId !== recordId));
    } catch (e) {
      alert('Failed to delete history.');
    }
  };

  const handleCoverLetterClick = (history: any) => {
    setCoverLetterData(history.content);
    setShowCoverLetter(true);
  };

  return (
    <div className ='mt-5 p-5 border rounded-xl'>
     <h2 className='font-bold text-lg'>Previous History</h2>
     <p>What Your previously work on, You can find here</p>

     {userHistory.length > 0 && (
       <button
         className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
         onClick={handleClearHistory}
       >
         Clear History
       </button>
     )}

     {userHistory?.length==0 ?
    <div className='flex items-center justify-center mt-5 flex-col mt-6'>
      <img src={'/bulb.png'} alt='bulb'
      width={50}
      height={50}
      />
      <h2>You do not have any history</h2>
      <Button className='mt-5'>Explore AI Tools</Button>
      </div>

    :
    <div>
        {userHistory?.map((history:any,index:number)=>(
          <div
            key={index}
            className="flex items-center gap-3 p-3 border-b hover:bg-gray-100 cursor-pointer group"
            onClick={() => {
              if (history?.aiAgentType?.toLowerCase().includes('roadmap')) {
                router.push(`/ai-tools/ai-roadmap-agent/${history.recordId}`);
              } else if (history?.aiAgentType?.toLowerCase().includes('resume')) {
                router.push(`/ai-tools/ai-resume-analyzer/${history.recordId}`);
              } else if (history?.aiAgentType?.toLowerCase().includes('chat')) {
                router.push(`/ai-tools/ai-chat/${history.recordId}`);
              } else if (history?.aiAgentType?.toLowerCase().includes('cover-letter')) {
                handleCoverLetterClick(history);
              }
            }}
          >
            <img
              src={
                history?.aiAgentType?.toLowerCase().includes('roadmap') ? '/roadmap.png' :
                history?.aiAgentType?.toLowerCase().includes('resume') ? '/resume.png' :
                history?.aiAgentType?.toLowerCase().includes('cover-letter') ? '/cover.png' :
                '/chatbot.png'
              }
              alt="icon"
              width={32}
              height={32}
            />
            <div className="flex-1">
              <div className="font-semibold">
                {history?.aiAgentType?.toLowerCase().includes('roadmap') ? 'Career Roadmap Generator' :
                 history?.aiAgentType?.toLowerCase().includes('resume') ? 'AI Resume Analyzer' :
                 history?.aiAgentType?.toLowerCase().includes('cover-letter') ? 'Cover Letter Generator' :
                 'AI Career Q&A Chat'}
              </div>
            </div>
            <div className="text-xs text-gray-500 ml-auto font-semibold">
              {history?.createdAt ? new Date(history.createdAt).toString() : ''}
            </div>
          </div>
        ))}
    </div>  
}

    {/* Cover Letter Modal */}
    {showCoverLetter && coverLetterData && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-0 relative flex flex-col max-h-[90vh]">
          <button
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl z-10"
            onClick={() => setShowCoverLetter(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="overflow-y-auto p-6 flex-1">
            <h2 className="text-2xl font-bold mb-4 text-pink-600">Cover Letter Generator</h2>
            <div className="mb-4">
              <div className="mb-2 flex flex-col sm:flex-row sm:gap-8">
                <div><span className="font-semibold">Job Title:</span> {coverLetterData.jobTitle}</div>
                <div><span className="font-semibold">Company Name:</span> {coverLetterData.companyName}</div>
              </div>
              <div className="mb-2"><span className="font-semibold">Job Description:</span>
                <div className="bg-gray-50 border rounded p-2 mt-1 text-sm text-gray-700 max-h-32 overflow-y-auto">{coverLetterData.jobDescription}</div>
              </div>
              <div className="mb-2"><span className="font-semibold">Profile:</span>
                <div className="bg-gray-50 border rounded p-2 mt-1 text-sm text-gray-700 max-h-32 overflow-y-auto">{coverLetterData.profileText}</div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-blue-700">Generated Cover Letter:</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-gray-800 max-h-64 overflow-y-auto border">
{coverLetterData.coverLetter}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default History