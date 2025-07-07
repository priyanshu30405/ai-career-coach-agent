"use client"
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <div>
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-3 sm:py-0 dark:bg-neutral-800 dark:border-neutral-700">
        <nav className="relative p-4 max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8" aria-label="Global">
          <div className="flex items-center justify-between">
            <div>
              <Image src={'/logo.svg'} alt="logo" width={150} height={150} />
            </div>
          </div>
          <div id="navbar-collapse-with-animation" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7 cursor-pointer">
              {!user ? (
                <SignInButton mode='modal' signUpForceRedirectUrl={'/dashboard'}>
                  <div className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 sm:border-s sm:border-gray-300 py-2 sm:py-0 sm:ms-4 sm:my-6 sm:ps-6 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500" >
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                    </svg>
                    Get Started
                  </div>
                </SignInButton>
              ) : (
                <UserButton />
              )}
            </div>
          </div>
        </nav>
      </header>
      <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-x-2 bg-blue-50 border border-blue-200 text-sm text-blue-800 p-1 px-4 rounded-full font-semibold dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200">
              🚀 Your AI-powered career partner
            </span>
          </div>
          <div className="mt-5 max-w-2xl text-center mx-auto">
            <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200">
              Land Your Dream Job with the
              <span className="bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent"> AI Career Coach</span>
            </h1>
          </div>
          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              Personalized job search, resume tips, mock interviews, and AI guidance for every career level.
            </p>
          </div>
          <div className="mt-8 gap-3 flex justify-center">
            <a className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent cursor-pointer text-white text-lg font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 py-4 px-8 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-110 hover:shadow-2xl"
              href="/dashboard">
              Start Coaching
              <svg className="flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </a>
          </div>
        </div>
      </div>
      {/* Feature cards updated */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-8">
          {/* AI Career Q&A Chat */}
          <div className="flex flex-col items-center bg-white/80 dark:bg-neutral-800/80 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105 border border-blue-100 dark:border-blue-900 backdrop-blur-lg">
            <div className="mb-4">
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 mb-4 mx-auto" />
              <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl shadow-lg">
                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4-4.03 7-9 7-1.18 0-2.31-.13-3.35-.38-.37-.09-.56-.14-.7-.22-.13-.07-.24-.17-.32-.3-.08-.13-.11-.29-.18-.61-.19-.93-.28-1.4-.28-1.49 0-.09.01-.18.04-.27.03-.09.08-.17.15-.24.07-.07.16-.12.25-.15.09-.03.18-.04.27-.04.09 0 .56.09 1.49.28.32.07.48.1.61.18.13.08.23.19.3.32.08.14.13.33.22.7.25 1.04.38 2.17.38 3.35 0 4.97-3 9-7 9z" /></svg>
              </div>
            </div>
            <h3 className="font-semibold text-xl text-gray-800 dark:text-white mb-2 text-center">AI Career Q&amp;A Chat</h3>
            <p className="text-gray-600 dark:text-neutral-400 text-center text-base">Get instant answers to your career questions with our smart AI chat assistant.</p>
          </div>
          {/* AI Resume Analyzer */}
          <div className="flex flex-col items-center bg-white/80 dark:bg-neutral-800/80 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105 border border-blue-100 dark:border-blue-900 backdrop-blur-lg">
            <div className="mb-4">
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 mb-4 mx-auto" />
              <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl shadow-lg">
                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h6M8 17h4" /></svg>
              </div>
            </div>
            <h3 className="font-semibold text-xl text-gray-800 dark:text-white mb-2 text-center">AI Resume Analyzer</h3>
            <p className="text-gray-600 dark:text-neutral-400 text-center text-base">Upload your resume and receive instant, actionable feedback to improve it.</p>
          </div>
          {/* Career Roadmap Generator */}
          <div className="flex flex-col items-center bg-white/80 dark:bg-neutral-800/80 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105 border border-blue-100 dark:border-blue-900 backdrop-blur-lg">
            <div className="mb-4">
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 mb-4 mx-auto" />
              <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl shadow-lg">
                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20V10M12 10l-6 6M12 10l6 6" /></svg>
              </div>
            </div>
            <h3 className="font-semibold text-xl text-gray-800 dark:text-white mb-2 text-center">Career Roadmap Generator</h3>
            <p className="text-gray-600 dark:text-neutral-400 text-center text-base">Get a personalized step-by-step roadmap to reach your career goals.</p>
          </div>
          {/* Cover Letter Generator */}
          <div className="flex flex-col items-center bg-white/80 dark:bg-neutral-800/80 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105 border border-blue-100 dark:border-blue-900 backdrop-blur-lg">
            <div className="mb-4">
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 mb-4 mx-auto" />
              <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl shadow-lg">
                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M4 8h16" /><path d="M8 4v4" /></svg>
              </div>
            </div>
            <h3 className="font-semibold text-xl text-gray-800 dark:text-white mb-2 text-center">Cover Letter Generator</h3>
            <p className="text-gray-600 dark:text-neutral-400 text-center text-base">Generate a professional, tailored cover letter for any job application.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
