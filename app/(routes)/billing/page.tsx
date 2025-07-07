import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing() {
  return (
    <div className="p-6"> 
     <h2 className='font-bold text-3xl text-center mb-4'>Choose Your Plan</h2>
     <p className='text-lg text-center mb-8'>Select a subscription bundle to get unlimited access to all AI Tools</p>
     
     <div className="max-w-4xl mx-auto mb-8">
       <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
         <h3 className="text-lg font-semibold text-blue-800 mb-2">Free Tier Limits</h3>
         <p className="text-blue-700 mb-4">
           Free users can create up to 10 requests per AI tool. Upgrade to Pro for unlimited access!
         </p>
         <ul className="text-blue-700 space-y-1">
           <li>• AI Career Q&A Chat: 10 conversations</li>
           <li>• AI Resume Analyzer: 10 resume analyses</li>
           <li>• Career Roadmap Generator: 10 roadmaps</li>
           <li>• Cover Letter Generator: 10 cover letters</li>
         </ul>
       </div>
     </div>
     
     <div className='mt-6'>
     <PricingTable/>
     </div>
     </div>
  )
}

export default Billing