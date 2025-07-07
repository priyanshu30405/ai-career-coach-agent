"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useAuth } from '@clerk/nextjs';
import { checkUsageLimits, FREE_TIER_LIMITS } from '@/lib/subscription-utils';
import { 
  Target, 
  Clock, 
  BookOpen, 
  Zap,
  Loader2,
  ArrowRight,
  MessageSquare
} from "lucide-react";

const experienceLevels = [
  "Complete Beginner",
  "Some Programming Experience", 
  "Intermediate Developer",
  "Experienced Developer",
  "Senior Developer"
];

function RoadmapGeneratorPage() {
  const router = useRouter();
  const { has } = useAuth();
  const [formData, setFormData] = useState({
    customPrompt: "",
    experience: "",
    goals: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customPrompt || !formData.experience) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check subscription status
      if (!has) {
        setError('Unable to verify subscription status. Please try again.');
        return;
      }
      
      const hasSubscriptionEnabled = await has({ plan: 'pro' });
      
      if (!hasSubscriptionEnabled) {
        // For free tier, check usage limits
        const usageLimits = await checkUsageLimits('/ai-tools/ai-roadmap-agent');
        
        if (usageLimits.currentRequests >= usageLimits.maxRequests) {
          setError(`You've reached the free tier limit of ${usageLimits.maxRequests} requests for this tool. Please upgrade to Pro for unlimited access.`);
          setTimeout(() => {
            router.push('/billing');
          }, 3000);
          return;
        }
      }

      const recordId = uuidv4();

      const response = await axios.post('/api/ai-roadmap-agent', {
        recordId,
        customPrompt: formData.customPrompt,
        userExperience: formData.experience,
        userGoals: formData.goals || "Career advancement and skill development"
      });

      console.log('Roadmap generated:', response.data);
      
      // Redirect to the roadmap page
      router.push(`/ai-tools/ai-roadmap-agent/${recordId}`);
      
    } catch (err) {
      console.error('Error generating roadmap:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to generate roadmap');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">AI Roadmap Generator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate a personalized learning roadmap based on your custom prompt. 
            Our AI will create a comprehensive step-by-step guide tailored to your specific needs and goals.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Custom Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What roadmap would you like to generate? *
                </label>
                <textarea
                  value={formData.customPrompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                  placeholder="e.g., Create a roadmap for becoming a Full Stack Developer, Generate a learning path for Data Science, Build a roadmap for AI/ML Engineer, Create a path for becoming a DevOps Engineer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Be specific about what you want to learn or achieve
                </p>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your current experience level? *
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your experience level</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are your specific goals? (Optional)
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="e.g., I want to work at a tech startup, I want to specialize in AI, I want to become a team lead, I want to freelance..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !formData.customPrompt || !formData.experience}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Your Roadmap...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Custom Prompts</h3>
              <p className="text-sm text-gray-600">
                Generate roadmaps for any topic or career path you can imagine
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Realistic Timeline</h3>
              <p className="text-sm text-gray-600">
                Learn at your own pace with realistic timeframes and milestones
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Comprehensive Guide</h3>
              <p className="text-sm text-gray-600">
                Step-by-step phases covering all essential skills and technologies
              </p>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Example Prompts to Get You Started
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Create a roadmap for becoming a Full Stack Developer",
                "Generate a learning path for Data Science",
                "Build a roadmap for AI/ML Engineer",
                "Create a path for becoming a DevOps Engineer",
                "Design a roadmap for Mobile App Development",
                "Generate a learning path for Cybersecurity"
              ].map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      customPrompt: prompt,
                      experience: prev.experience || "Complete Beginner"
                    }));
                  }}
                  className="justify-start h-auto p-4 text-left"
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{prompt}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapGeneratorPage; 