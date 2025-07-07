"use client"
import React, { useState, useContext } from 'react'
import Image from 'next/image'; 
import { Button } from "@/components/ui/button"; 
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ResumeUploadDialog from './ResumeUploadDialog';
import { checkUsageLimits, FREE_TIER_LIMITS } from '@/lib/subscription-utils';
import CoverLetterDialog from './CoverLetterDialog';
import RoadmapGeneratorDialog from './RoadmapGeneratorDialog';
import { UsageContext } from './UsageProvider';

export interface TOOL{
  name:string,
  desc:string,
  icon:string,
  button:string,
  path:string
}

type AIToolProps={
 tool:TOOL
}

function AiToolCard({tool}:AIToolProps) {
  const id = uuidv4(); //Here
  const{user}= useUser();
  const { has } = useAuth();
  const router = useRouter();
  const[openResumeUpload,setOpenResumeUpload]=useState(false);
  const[openCoverLetterDialog, setOpenCoverLetterDialog] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const[openRoadmapDialog, setOpenRoadmapDialog] = useState(false);
  const { refreshUsage } = useContext(UsageContext);

  const onClickButton=async()=>{
    setIsChecking(true);
    
    try {
      // Check subscription status
      if (!has) {
        alert('Unable to verify subscription status. Please try again.');
        return;
      }
      
      const hasSubscriptionEnabled = await has({ plan: 'pro' });
      
      // TEMPORARILY DISABLE LIMITS FOR TESTING - REMOVE THIS COMMENT BLOCK TO RE-ENABLE
      /*
      if (!hasSubscriptionEnabled) {
        // For free tier, check usage limits
        const usageLimits = await checkUsageLimits(tool.path);
        
        if (usageLimits.currentRequests >= usageLimits.maxRequests) {
          alert(`You've reached the free tier limit of ${usageLimits.maxRequests} requests for this tool. Please upgrade to Pro for unlimited access.`);
          router.push('/billing');
          return;
        }
      }
      */

      if(tool.name=='AI Resume Anayzer'){
        setOpenResumeUpload(true);
        setIsChecking(false);
        refreshUsage();
        return;
      }
      if(tool.name==='Cover Letter Generator'){
        setOpenCoverLetterDialog(true);
        setIsChecking(false);
        refreshUsage();
        return;
      }
      if(tool.name==='Career Roadmap Generator'){
        router.push(tool.path);
        setIsChecking(false);
        refreshUsage();
        return;
      }
      // Always create the record before navigating for all tools
      const result = await axios.post('/api/history',{
        recordId:id,
        content:[],
        aiAgentType:tool.path
      });
      console.log(result);
      refreshUsage();
      router.push(tool.path + "/" + id);
    } catch (error) {
      console.error('Error checking permissions:', error);
      alert('Unable to verify subscription status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className='p-3 border rounded-lg'>
     <Image src={tool.icon} width={40} height={40} alt={tool.name}/>
     <h2 className='font-bold mt-2'>{tool.name}</h2>
     <p className='text-gray-400 min-h-[32px]'>{tool.desc}</p>
    
    <Button 
        className='w-full mt-3' 
        onClick={onClickButton}
        disabled={isChecking}
    >
        {isChecking ? 'Checking...' : tool.button}
    </Button>

     <ResumeUploadDialog openResumeUpload={openResumeUpload}
     setOpenResumeDialog={setOpenResumeUpload}/>
     <CoverLetterDialog open={openCoverLetterDialog} setOpen={setOpenCoverLetterDialog} />
     {tool.name==='Career Roadmap Generator' && (
       <RoadmapGeneratorDialog open={openRoadmapDialog} setOpen={setOpenRoadmapDialog} />
     )}
    </div>
  )
}

export default AiToolCard