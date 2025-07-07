import React from 'react'
import AiToolCard from './AiToolCard'; 
import ResumeUploadDialog from './ResumeUploadDialog'; // ✅ adjust if path differs



const aiToolsList=[
 //1
 {
  name:'AI Career Q&A Chat',
  desc:'Ask career questions',
  icon:'/chatbot.png',
  button:'Ask Now',
  path:'/ai-tools/ai-chat'
 },
 
 //2
  {
  name:'AI Resume Anayzer',
  desc:'Improve your resume',
  icon:'/resume.png',
  button:'Analyze Now',
  path:'/ai-tools/ai-resume-analyzer'
 },

 //3
  {
  name:'Career Roadmap Generator',
  desc:'Build your Roadmap',
  icon:'/roadmap.png',
  button:'Generate Now',
  path:'/ai-tools/ai-roadmap-agent'
 },

 //4
  {
  name:'Cover Letter Generator',
  desc:'Write a cover letter',
  icon:'/cover.png',
  button:'Create Now',
  path:'/cover-letter-generator'
 },
];

function AiToolsList() {
  return (
    <div className='mt-7 p-5 bg-white border rounded-xl'>
     <h2 className='font-bold text-lg'>Available AI Tools</h2>
     <p>Start Building and Shape Your Career with this exclusive AI Tools </p>
     


     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4'>
          {aiToolsList.map((tool,index)=>(
           <AiToolCard tool={tool} key={index}/>
          ))}
     </div>
  </div>
  )
}

export default AiToolsList