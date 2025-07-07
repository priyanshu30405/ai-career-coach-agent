"use client"
import React, { useContext, useEffect, useState, type JSX } from 'react';
import { useAuth } from '@clerk/nextjs';
import { checkUsageLimits, FREE_TIER_LIMITS } from '@/lib/subscription-utils';
import { FaRobot, FaFileAlt, FaMapSigns, FaEnvelopeOpenText } from 'react-icons/fa';
import { UsageContext } from './UsageProvider';

const toolIcons: Record<string, JSX.Element> = {
  'AI Career Q&A Chat': <FaRobot className="text-blue-500" />,
  'AI Resume Analyzer': <FaFileAlt className="text-green-500" />,
  'Career Roadmap Generator': <FaMapSigns className="text-purple-500" />,
  'Cover Letter Generator': <FaEnvelopeOpenText className="text-pink-500" />,
};

interface UsageBarProps {
  label: string;
  value: number;
  max: number;
}

function UsageBar({ label, value, max }: UsageBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  const overLimit = value > max;
  const icon = toolIcons[label] ?? <FaRobot className="text-gray-400" />;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <span className={`font-semibold ${overLimit ? "text-red-500" : "text-gray-700"}`}>
          {value}/{max}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-300 ${overLimit ? "bg-red-400" : "bg-gradient-to-r from-blue-400 to-blue-600"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {overLimit && (
        <div className="text-xs text-red-500 mt-1">Limit exceeded! Upgrade to Pro.</div>
      )}
    </div>
  );
}

export default function UsageIndicator() {
  const { has } = useAuth();
  const { usageRefreshToken } = useContext(UsageContext);
  const [isPro, setIsPro] = useState(false);
  const [usage, setUsage] = useState({ chat: 0, resume: 0, roadmap: 0, cover: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!has) return;
        const hasSubscriptionEnabled = await has({ plan: 'pro' });
        setIsPro(hasSubscriptionEnabled);
        if (!hasSubscriptionEnabled) {
          const [chat, resume, roadmap, cover] = await Promise.all([
            checkUsageLimits('chat'),
            checkUsageLimits('resume'),
            checkUsageLimits('roadmap'),
            checkUsageLimits('cover-letter'),
          ]);
          setUsage({
            chat: chat.currentRequests,
            resume: resume.currentRequests,
            roadmap: roadmap.currentRequests,
            cover: cover.currentRequests,
          });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };
    checkSubscription();
  }, [has, usageRefreshToken]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-blue-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (isPro) {
    return (
      <div className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl shadow-lg">
        <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
          Pro Plan Active <span className="ml-2">🚀</span>
        </h3>
        <p className="text-sm opacity-90 mb-2">Unlimited access to all AI tools</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-blue-100">
      <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
        Free Tier Usage
        <span className="ml-2 text-blue-400 cursor-pointer" title="You have 10 free requests per tool. Upgrade to Pro for unlimited access.">ℹ️</span>
      </h3>
      <p className="text-gray-500 mb-6 text-sm">
        You have <span className="font-semibold text-blue-600">10</span> free requests per tool.{' '}
        <span className="text-blue-500 font-medium">Upgrade to Pro</span> for unlimited access.
      </p>
      <UsageBar label="AI Career Q&A Chat" value={usage.chat} max={FREE_TIER_LIMITS.maxRequests} />
      <UsageBar label="AI Resume Analyzer" value={usage.resume} max={FREE_TIER_LIMITS.maxRequests} />
      <UsageBar label="Career Roadmap Generator" value={usage.roadmap} max={FREE_TIER_LIMITS.maxRequests} />
      <UsageBar label="Cover Letter Generator" value={usage.cover} max={FREE_TIER_LIMITS.maxRequests} />
      <button
        className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow hover:scale-105 transition"
        onClick={() => window.location.href = '/billing'}
      >
        Upgrade to Pro 🚀
      </button>
    </div>
  );
} 