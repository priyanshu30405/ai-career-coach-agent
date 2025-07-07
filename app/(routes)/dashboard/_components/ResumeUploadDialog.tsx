import { File, Loader2Icon, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { checkUsageLimits, FREE_TIER_LIMITS } from '@/lib/subscription-utils';

function ResumeUploadDialog({ openResumeUpload, setOpenResumeDialog }: any) {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {has} =useAuth();

  useEffect(() => {
    setFile(null); // Clear file on open/close
  }, [openResumeUpload]);

  const onFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file.name);
      setFile(file);
    }
  };

  const onUploadAndAnalyze = async () => {
    setLoading(true);
    const recordId = uuidv4(); // ✅ Moved here to fix the error

    try {
      // Check subscription status
      if (!has) {
        alert('Unable to verify subscription status. Please try again.');
        return;
      }
      
      const hasSubscriptionEnabled = await has({ plan: 'pro' });
      
      if (!hasSubscriptionEnabled) {
        // For free tier, check usage limits
        const usageLimits = await checkUsageLimits('/ai-tools/ai-resume-analyzer');
        
        if (usageLimits.currentRequests >= usageLimits.maxRequests) {
          alert(`You've reached the free tier limit of ${usageLimits.maxRequests} requests for this tool. Please upgrade to Pro for unlimited access.`);
          router.push('/billing');
          return;
        }
      }

      const formData = new FormData();
      formData.append('recordId', recordId);
      formData.append('resumeFile', file);

      // Send FormData to backend
      const result = await axios.post('/api/ai-resume-agent', formData);
      console.log(result.data);

      // Only redirect if successful
      router.push('/ai-tools/ai-resume-analyzer/' + recordId);
      setOpenResumeDialog(false);

    } catch (err) {
      console.error("Error uploading file", err);
      // Show error to user (you can add a toast notification here)
      alert('Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload resume PDF file</DialogTitle>
          <DialogDescription>
            <div>
              <label
                htmlFor='resumeUpload'
                className='flex items-center flex-col justify-center p-7 border border-dashed rounded-xl hover:bg-slate-100 cursor-pointer'
              >
                <File className='h-10 w-10' />
                {file ? (
                  <h2 className='mt-3 text-blue-600'>{file?.name}</h2>
                ) : (
                  <h2 className='mt-3'>Click here to Upload PDF file</h2>
                )}
              </label>
              <input
                type='file'
                id='resumeUpload'
                accept="application/pdf"
                className='hidden'
                onChange={onFileChange}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpenResumeDialog(false)}>Cancel</Button>
          <Button disabled={!file || loading} onClick={onUploadAndAnalyze}>
            {loading ? <Loader2Icon className='animate-spin mr-2' /> : <Sparkles className='mr-2' />}
            Upload & Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeUploadDialog;