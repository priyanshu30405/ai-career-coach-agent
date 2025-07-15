"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Database, 
  Globe, 
  Server, 
  Zap, 
  Clock, 
  BookOpen, 
  Target,
  ArrowRight,
  CheckCircle,
  Play,
  Layers
} from "lucide-react";

interface RoadmapPhase {
  title: string;
  description: string;
  duration: string;
  technologies: {
    name: string;
    description: string;
    icon?: string;
  }[];
  color: string;
}

interface RoadmapData {
  title: string;
  description: string;
  duration: string;
  phases: RoadmapPhase[];
}

function RoadmapPage() {
  const { roadmapid } = useParams();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default Full Stack Developer Roadmap Data
  const defaultRoadmapData: RoadmapData = {
    title: "Full Stack Developer Roadmap",
    description: "A comprehensive learning path to become a proficient Full Stack Developer, covering both frontend and backend technologies, databases, DevOps practices, and modern development workflows. This roadmap is designed for beginners and intermediate developers looking to build complete web applications.",
    duration: "12-24 months",
    phases: [
      {
        title: "Phase 1: Fundamentals & Frontend Foundation",
        description: "Build a solid foundation with web fundamentals and modern frontend technologies",
        duration: "3-4 months",
        color: "bg-blue-500",
        technologies: [
          {
            name: "HTML5 & CSS3",
            description: "Master semantic HTML structure, CSS layouts (Flexbox/Grid), responsive design, and modern CSS features like custom properties and animations."
          },
          {
            name: "JavaScript (ES6+)",
            description: "Learn modern JavaScript including async/await, promises, modules, destructuring, and functional programming concepts."
          },
          {
            name: "React.js",
            description: "Build interactive UIs with React hooks, state management, component lifecycle, and modern React patterns."
          },
          {
            name: "TypeScript",
            description: "Add type safety to your JavaScript code with TypeScript interfaces, generics, and advanced type features."
          },
          {
            name: "Git & GitHub",
            description: "Master version control with Git, branching strategies, collaborative development, and GitHub workflows."
          }
        ]
      },
      {
        title: "Phase 2: Backend Development & APIs",
        description: "Learn server-side programming, database design, and API development",
        duration: "4-5 months",
        color: "bg-green-500",
        technologies: [
          {
            name: "Node.js & Express",
            description: "Build scalable backend services with Node.js, Express framework, middleware, and RESTful API design patterns."
          },
          {
            name: "Database Design",
            description: "Learn SQL fundamentals, database normalization, PostgreSQL/MySQL, and database optimization techniques."
          },
          {
            name: "Authentication & Security",
            description: "Implement JWT authentication, OAuth, password hashing, CORS, and security best practices for web applications."
          },
          {
            name: "API Development",
            description: "Design RESTful APIs, handle HTTP methods, status codes, error handling, and API documentation with Swagger/OpenAPI."
          },
          {
            name: "Testing",
            description: "Write unit tests with Jest, integration tests, API testing with Supertest, and test-driven development practices."
          }
        ]
      },
      {
        title: "Phase 3: Advanced Frontend & State Management",
        description: "Master advanced frontend concepts and state management solutions",
        duration: "3-4 months",
        color: "bg-purple-500",
        technologies: [
          {
            name: "Advanced React",
            description: "Deep dive into React patterns, performance optimization, React.memo, useMemo, useCallback, and custom hooks."
          },
          {
            name: "State Management",
            description: "Learn Redux Toolkit, Zustand, or Context API for global state management and data flow patterns."
          },
          {
            name: "Next.js",
            description: "Build full-stack React applications with Next.js, server-side rendering, static generation, and API routes."
          },
          {
            name: "CSS Frameworks",
            description: "Master Tailwind CSS, styled-components, or Material-UI for rapid UI development and consistent design systems."
          },
          {
            name: "Performance Optimization",
            description: "Implement code splitting, lazy loading, image optimization, bundle analysis, and Core Web Vitals optimization."
          }
        ]
      },
      {
        title: "Phase 4: DevOps & Deployment",
        description: "Learn deployment strategies, cloud services, and DevOps practices",
        duration: "2-3 months",
        color: "bg-orange-500",
        technologies: [
          {
            name: "Docker & Containers",
            description: "Containerize applications with Docker, understand container orchestration, and microservices architecture."
          },
          {
            name: "Cloud Platforms",
            description: "Deploy applications on AWS, Vercel, Netlify, or Heroku. Learn cloud services like S3, Lambda, and CDN."
          },
          {
            name: "CI/CD Pipelines",
            description: "Set up automated testing and deployment with GitHub Actions, GitLab CI, or Jenkins for continuous integration."
          },
          {
            name: "Monitoring & Logging",
            description: "Implement application monitoring, error tracking with Sentry, logging strategies, and performance monitoring."
          },
          {
            name: "Security Best Practices",
            description: "Learn OWASP security guidelines, input validation, XSS/CSRF protection, and security auditing tools."
          }
        ]
      },
      {
        title: "Phase 5: Advanced Topics & Specialization",
        description: "Explore advanced concepts and choose your specialization path",
        duration: "2-4 months",
        color: "bg-red-500",
        technologies: [
          {
            name: "GraphQL",
            description: "Learn GraphQL schema design, resolvers, Apollo Client/Server, and when to use GraphQL vs REST APIs."
          },
          {
            name: "Real-time Applications",
            description: "Build real-time features with WebSockets, Socket.io, or Server-Sent Events for chat and live updates."
          },
          {
            name: "Microservices",
            description: "Design microservices architecture, service communication, API gateways, and distributed systems patterns."
          },
          {
            name: "Advanced Databases",
            description: "Explore NoSQL databases (MongoDB), Redis caching, database scaling, and data modeling strategies."
          },
          {
            name: "Mobile Development",
            description: "Learn React Native for cross-platform mobile development or explore Progressive Web Apps (PWAs)."
          }
        ]
      }
    ]
  };

  useEffect(() => {
    setLoading(true); // Show spinner instantly
    if (roadmapid) {
      fetchRoadmapData();
    } else {
      // Use default data if no roadmap ID
      setRoadmapData(defaultRoadmapData);
      setLoading(false);
    }
  }, [roadmapid]);

  const fetchRoadmapData = async () => {
    try {
      const result = await axios.get('/api/history?recordId=' + roadmapid);
      console.log('Roadmap API result:', result.data);
      if (
        result.data &&
        result.data.content &&
        Array.isArray(result.data.content.phases) &&
        result.data.content.phases.length > 0
      ) {
        setRoadmapData(result.data.content);
      } else {
        // Fallback to default data
        setRoadmapData(defaultRoadmapData);
      }
    } catch (error) {
      console.error('Error fetching roadmap data:', error);
      // Fallback to default data
      setRoadmapData(defaultRoadmapData);
    } finally {
      setLoading(false);
    }
  };

  const createNewRoadmap = () => {
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Loading your roadmap...</div>
        </div>
      </div>
    );
  }

  if (error || !roadmapData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error || "No roadmap data available"}</div>
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4"
          >
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">{roadmapData.title}</h1>
          </div>
          <p className="text-lg text-gray-600 mb-4 max-w-4xl">
            {roadmapData.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Duration: {roadmapData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{Array.isArray(roadmapData?.phases) ? roadmapData.phases.length : 0} Learning Phases</span>
            </div>
          </div>
        </div>

        {/* Roadmap Phases */}
        <div className="space-y-8">
          {roadmapData.phases.map((phase, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Phase Header */}
              <div className={`${phase.color} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white bg-opacity-20 rounded-full p-2">
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>
                      <h2 className="text-2xl font-bold">{phase.title}</h2>
                    </div>
                    <p className="text-white text-opacity-90 mb-3">{phase.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{phase.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white text-opacity-80">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {phase.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className={`${phase.color} text-white rounded-full p-2 flex-shrink-0`}>
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-2">{tech.name}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{tech.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Choose your next step or explore other career paths to find the perfect roadmap for your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={createNewRoadmap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                <Play className="h-4 w-4 mr-2" />
                Create Another Roadmap
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/ai-tools/ai-chat'}
                className="px-6 py-3"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Get Career Advice
              </Button>
            </div>
          </div>

          {/* Alternative Roadmaps */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Explore Other Career Paths</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => window.location.href = '/ai-tools/ai-roadmap-agent'}>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <h5 className="font-semibold">AI Engineer</h5>
                </div>
                <p className="text-sm text-gray-600">Master machine learning, deep learning, and AI development</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => window.location.href = '/ai-tools/ai-roadmap-agent'}>
                <div className="flex items-center gap-3 mb-2">
                  <Server className="h-5 w-5 text-green-500" />
                  <h5 className="font-semibold">DevOps Engineer</h5>
                </div>
                <p className="text-sm text-gray-600">Learn infrastructure, automation, and deployment strategies</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => window.location.href = '/ai-tools/ai-roadmap-agent'}>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <h5 className="font-semibold">Frontend Developer</h5>
                </div>
                <p className="text-sm text-gray-600">Specialize in modern frontend technologies and UX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage; 