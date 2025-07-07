"use client";
import React, { useState } from "react";
import axios from "axios";

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [inngestStatus, setInngestStatus] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const checkEnvironment = async () => {
    setLoading('env');
    try {
      const response = await axios.get('/api/env-check');
      setEnvStatus(response.data);
    } catch (error) {
      setEnvStatus({ error: 'Failed to check environment' });
    } finally {
      setLoading(null);
    }
  };

  const checkDatabase = async () => {
    setLoading('db');
    try {
      const response = await axios.get('/api/db-test');
      setDbStatus(response.data);
    } catch (error) {
      setDbStatus({ error: 'Failed to check database' });
    } finally {
      setLoading(null);
    }
  };

  const checkInngest = async () => {
    setLoading('inngest');
    try {
      const response = await axios.get('/api/inngest-test');
      setInngestStatus(response.data);
    } catch (error) {
      setInngestStatus({ error: 'Failed to check Inngest' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">System Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Environment Check */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <button
            onClick={checkEnvironment}
            disabled={loading === 'env'}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-4"
          >
            {loading === 'env' ? 'Checking...' : 'Check Environment'}
          </button>
          
          {envStatus && (
            <div className="text-sm">
              <div className={`font-bold ${envStatus.allSet ? 'text-green-600' : 'text-red-600'}`}>
                Status: {envStatus.allSet ? 'All Set' : 'Missing Variables'}
              </div>
              <div className="mt-2">
                {envStatus.variables?.map((v: any) => (
                  <div key={v.name} className={`${v.set ? 'text-green-600' : 'text-red-600'}`}>
                    {v.name}: {v.set ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Database Check */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          <button
            onClick={checkDatabase}
            disabled={loading === 'db'}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-4"
          >
            {loading === 'db' ? 'Checking...' : 'Check Database'}
          </button>
          
          {dbStatus && (
            <div className="text-sm">
              <div className={`font-bold ${dbStatus.tableExists ? 'text-green-600' : 'text-red-600'}`}>
                Status: {dbStatus.status}
              </div>
              {dbStatus.error && (
                <div className="text-red-600 mt-2">
                  Error: {dbStatus.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inngest Check */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Inngest Connection</h2>
          <button
            onClick={checkInngest}
            disabled={loading === 'inngest'}
            className="bg-purple-600 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-4"
          >
            {loading === 'inngest' ? 'Checking...' : 'Check Inngest'}
          </button>
          
          {inngestStatus && (
            <div className="text-sm">
              <div className={`font-bold ${inngestStatus.eventId ? 'text-green-600' : 'text-red-600'}`}>
                Status: {inngestStatus.status}
              </div>
              {inngestStatus.eventId && (
                <div className="text-green-600 mt-2">
                  Event ID: {inngestStatus.eventId}
                </div>
              )}
              {inngestStatus.error && (
                <div className="text-red-600 mt-2">
                  Error: {inngestStatus.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="space-y-2">
          <a href="/ai-tools/ai-resume-analyzer/test" className="block text-blue-600 hover:underline">
            → Resume Analyzer Test Page
          </a>
          <a href="/dashboard" className="block text-blue-600 hover:underline">
            → Dashboard
          </a>
        </div>
      </div>
    </div>
  );
} 