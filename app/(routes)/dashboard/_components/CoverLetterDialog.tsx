import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function CoverLetterDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [profileType, setProfileType] = useState('linkedin'); // 'linkedin' or 'manual'
  const [manualProfile, setManualProfile] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  const isProfileFilled = profileType === 'linkedin' ? !!linkedin : !!manualProfile;
  const isFormValid = jobTitle && companyName && jobDescription && isProfileFilled;

  const handleGenerate = async () => {
    setTouched(true);
    setError('');
    if (!isFormValid) return;
    setLoading(true);
    setCoverLetter('');
    try {
      let profileText = '';
      if (profileType === 'linkedin') {
        profileText = linkedin;
      } else {
        profileText = manualProfile;
      }
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, companyName, jobDescription, profileText })
      });
      const data = await res.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
        // Save to history
        const recordId = `coverletter-${Date.now()}`;
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recordId,
            aiAgentType: '/ai-tools/cover-letter',
            content: {
              jobTitle,
              companyName,
              jobDescription,
              profileText,
              coverLetter: data.coverLetter
            }
          })
        });
      } else {
        setError(data.error || 'Failed to generate cover letter.');
      }
    } catch (err) {
      setError('Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const generatePdfBlob = async (text: string) => {
    // Simple text to PDF conversion - you can enhance this with a proper PDF library
    const blob = new Blob([text], { type: 'text/plain' });
    return blob;
  };

  const handleDownload = async () => {
    if (!coverLetter) return;
    const pdfBlob = await generatePdfBlob(coverLetter);
    const fileName = 'CoverLetter.pdf';

    // Try to use the File System Access API if available
    // @ts-ignore
    if (window.showSaveFilePicker) {
      try {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'PDF Document',
              accept: { 'application/pdf': ['.pdf'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(pdfBlob);
        await writable.close();
        return;
      } catch (err) {
        // If user cancels or error, fallback to default
      }
    }

    // Fallback: create a link and trigger download
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full h-full max-w-none max-h-none rounded-none flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Generate Cover Letter</DialogTitle>
          <DialogDescription>
            Fill in the details below. <span className="text-red-500">*</span> indicates required fields. You can provide your LinkedIn profile link or paste your profile text.
          </DialogDescription>
        </DialogHeader>
        {!coverLetter ? (
          <div className="space-y-4 overflow-auto flex-1 p-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input type="text" className={`w-full border rounded px-2 py-1 ${touched && !jobTitle ? 'border-red-500' : ''}`} value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input type="text" className={`w-full border rounded px-2 py-1 ${touched && !companyName ? 'border-red-500' : ''}`} value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea className={`w-full border rounded px-2 py-1 ${touched && !jobDescription ? 'border-red-500' : ''}`} rows={3} value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Profile <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-1">
                  <input type="radio" checked={profileType === 'linkedin'} onChange={() => setProfileType('linkedin')} /> LinkedIn Link
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" checked={profileType === 'manual'} onChange={() => setProfileType('manual')} /> Paste Profile Text
                </label>
              </div>
              {profileType === 'linkedin' ? (
                <input type="text" className={`w-full border rounded px-2 py-1 ${touched && !linkedin ? 'border-red-500' : ''}`} placeholder="LinkedIn Profile URL" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              ) : (
                <textarea className={`w-full border rounded px-2 py-1 ${touched && !manualProfile ? 'border-red-500' : ''}`} rows={4} placeholder="Paste your resume/profile text here" value={manualProfile} onChange={e => setManualProfile(e.target.value)} />
              )}
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleGenerate} disabled={!isFormValid || loading}>
                {loading ? <span className="animate-spin mr-2">⏳</span> : null}
                Generate Cover Letter
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 flex-1 flex flex-col p-6">
            <div className="relative flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-inner">
              {/* Sticky action bar at the top */}
              <div className="sticky top-0 z-10 flex gap-2 justify-end bg-gradient-to-r from-blue-100/80 to-purple-100/80 p-2 rounded-t-lg shadow-sm">
                <Button variant="outline" onClick={() => setCoverLetter('')}>Back</Button>
                <Button onClick={handleDownload} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow hover:scale-105 transition">
                  Download as PDF
                </Button>
              </div>
              {/* Scrollable preview area */}
              <div className="pt-2 overflow-y-auto max-h-[70vh]">
                <h3 className="font-semibold text-lg mb-2 text-blue-700 flex items-center gap-2">
                  <span role="img" aria-label="letter">📄</span> Your AI-Generated Cover Letter
                </h3>
                <pre className="whitespace-pre-wrap text-gray-800 text-base font-sans bg-transparent border-0 p-0 m-0 h-full">
                  {coverLetter}
                </pre>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 