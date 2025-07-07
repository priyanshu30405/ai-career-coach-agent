"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RoadmapGeneratorDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function RoadmapGeneratorDialog({ open, setOpen }: RoadmapGeneratorDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [experience, setExperience] = useState("");
  const [goals, setGoals] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
    // Redirect with query params
    const params = new URLSearchParams({ prompt, experience, goals });
    router.push(`/ai-tools/ai-roadmap-agent?${params.toString()}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Roadmap Generator</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">What roadmap would you like to generate? *</label>
            <input
              className="w-full border rounded p-2"
              required
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g., Create a roadmap for becoming a Full Stack Developer..."
            />
          </div>
          <div>
            <label className="block font-medium mb-1">What's your current experience level? *</label>
            <select
              className="w-full border rounded p-2"
              required
              value={experience}
              onChange={e => setExperience(e.target.value)}
            >
              <option value="">Select your experience level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">What are your specific goals? (Optional)</label>
            <input
              className="w-full border rounded p-2"
              value={goals}
              onChange={e => setGoals(e.target.value)}
              placeholder="e.g., I want to specialize in AI, become a team lead..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Generate Roadmap</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 