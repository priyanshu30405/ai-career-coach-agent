"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Document, Page } from "react-pdf";
import Dropzone from "react-dropzone";
import { useUser } from "@clerk/nextjs";

export default function ResumeUploadDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const router = useRouter();
  const { user } = useUser();

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setProgressMsg("Uploading and analyzing resume...");

    const formData = new FormData();
    formData.append("resumeFile", file);
    formData.append("userId", user?.id || "");

    const res = await fetch("/api/analyze-resume", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setLoading(false);
      setProgressMsg("Error analyzing resume.");
      return;
    }

    setProgressMsg("Analysis complete! Redirecting...");
    const { analysis, recordId } = await res.json();

    // Optionally cache for fast revisit
    localStorage.setItem("lastResumeAnalysis", JSON.stringify(analysis));

    // Redirect to the resume analyzer page with the record ID
    router.push(`/ai-tools/ai-resume-analyzer/${recordId}`);
  };

  return (
    <div className="flex gap-8 items-start">
      {/* Upload Area */}
      <div className="w-1/2">
        <Dropzone accept={{ "application/pdf": [".pdf"] }} onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-gray-50"
            >
              <input {...getInputProps()} />
              <p>
                {file
                  ? `Selected: ${file.name}`
                  : "Drag & drop a PDF here, or click to select"}
              </p>
            </div>
          )}
        </Dropzone>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          disabled={!file || loading}
          onClick={handleAnalyze}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
        {progressMsg && <div className="mt-2 text-sm text-gray-600">{progressMsg}</div>}
      </div>

      {/* PDF Preview */}
      <div className="w-1/2 border rounded-lg p-4 bg-white min-h-[400px]">
        {file ? (
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from(new Array(numPages), (el, idx) => (
              <Page key={`page_${idx + 1}`} pageNumber={idx + 1} width={350} />
            ))}
          </Document>
        ) : (
          <div className="text-gray-400 text-center mt-20">PDF preview will appear here</div>
        )}
      </div>
    </div>
  );
} 