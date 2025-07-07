"use client"
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react';
import React,{useState} from 'react'
import EmptyState from '../_components/EmptyState';
import axios from 'axios';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
// import { useParams } from 'next/navigation';
import { useParams, useRouter } from 'next/navigation'; 
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@clerk/nextjs';
import { checkUsageLimits, FREE_TIER_LIMITS } from '@/lib/subscription-utils';
// import { useRouter } from 'next/router';


type messages={
  content:string,
  role:string,
  type:string,
}

function AiChat() {

 const[userInput,setUserInput]=useState<string>('');
 const [loading,setLoading]=useState(false);
 const[messageList,setMessageList] =useState<messages[]>([]);
 const{chatid}: any =useParams();
 const router =useRouter();
 const { has } = useAuth();
 console.log(chatid);



 useEffect(()=>{
        chatid && GetMessageList();
 },[chatid])

 const GetMessageList=async()=>{
  const result= await axios.get('/api/history?recordId='+chatid);
  console.log(result.data);
  setMessageList(Array.isArray(result?.data?.content) ? result.data.content : []);
 }
 const onSend = async()=>{
  setLoading(true);
  setMessageList(prev=>[...prev,{
    content:userInput,
    role:'user',
    type:'text'
  }])
       setUserInput('');
      const result =await axios.post('/api/ai-career-chat-agent',{
        userInput:userInput
 });
 console.log(result.data);
 setMessageList(prev=>[...prev,result.data])
 setLoading(false);
}


console.log(messageList);

useEffect(()=>{
  //Save message into Database
  Array.isArray(messageList) && messageList.length>0 && updateMessageList();
},[messageList])


const updateMessageList=async()=>{
  const result = await axios.put('/api/history',{
    content:messageList,
    recordId:chatid
  });
  console.log(result);
}


//HERE
 const onNewChat=async()=>{
  try {
    // Check subscription status
    if (!has) {
      alert('Unable to verify subscription status. Please try again.');
      return;
    }
    
    const hasSubscriptionEnabled = await has({ plan: 'pro' });
    
    if (!hasSubscriptionEnabled) {
      // For free tier, check usage limits
      const usageLimits = await checkUsageLimits('/ai-tools/ai-chat');
      
      if (usageLimits.currentRequests >= usageLimits.maxRequests) {
        alert(`You've reached the free tier limit of ${usageLimits.maxRequests} requests for this tool. Please upgrade to Pro for unlimited access.`);
        router.push('/billing');
        return;
      }
    }

    const id = uuidv4();
    //Create new record to history table
    const result = await axios.post('/api/history',{
      recordId:id,
      content:[],
      aiAgentType: '/ai-tools/ai-chat'
    });
    console.log(result);
    router.replace( "/ai-tools/ai-chat/" + id);
  } catch (error) {
    console.error('Error creating new chat:', error);
    alert('Unable to create new chat. Please try again.');
  }
  }




  return (
    <div className='px-10 md:px-24 lg:px-36 xl:px-48 h-[75vh] overflow-auto'>
     <div className='flex items-center justify-between gap-8'> 
      <div>
     <h2 className='font-bold text-lg'>AI Career Q/AChat</h2>
     <p>Smarter career decisions start here- get tailored advice, real-time market insights</p>
     </div>
     <Button onClick={onNewChat}>+New Chat</Button>
        </div>
        <div className='flex flex-col h-[75vh]'>
          {messageList?.length<=0&& <div className='mt-5'>
         {/* Empty state Options */}
         <EmptyState selectedQuestions={(question:string)=>setUserInput(question)}/>
        </div>}

     <div className='flex-1'>
      {/* Message List */}
      {messageList?.map((mesaage,index)=>(
        <div key={index}>
        <div className={`flex mb-2 ${mesaage.role=='user'? 'justify-end':'justify-start'}`}>
           <div className={`p-3 rounded-lg gap-2 ${mesaage.role== 'user' ?
                 'bg-gray-200 text-black rounded-lg' :
                 "bg-gray-50 text-black"
          }`}>
              <ReactMarkdown>
            {mesaage.content}
            </ReactMarkdown>
            </div>
            </div>
            {loading && messageList?.length-1 == index && <div className='flex justify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2'>  
               <LoaderCircle className='animate-spin'/> Thinking...
               </div>}
               </div>
      ))}
      </div>

      <div className='flex justify-between items-center gap-6 absolute bottom-5 w-[50%]'>
       {/* Input Field */}
       <Input placeholder ='Type here' value={userInput}
       onChange={(event)=>setUserInput(event.target.value)}
       />
       <Button onClick={onSend} disabled={loading}><Send /> </Button>
          </div>
         </div>
       </div>
  )
}
export default AiChat