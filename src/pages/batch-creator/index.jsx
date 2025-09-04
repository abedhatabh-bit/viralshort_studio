import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import { errorHandler } from '../../utils/errorHandling';

const BatchCreator = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [batchJobs, setBatchJobs] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(-1);
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [failedJobs, setFailedJobs] = useState([]);

  // Mock templates data
  useEffect(() => {
    const mockTemplates = [
      {
        id: 1,
        title: "TikTok Story Template",
        niche: "storytelling",
        duration: "30-60s",
        format: "tiktok",
        thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop"
      },
      {
        id: 2,
        title: "Funny Reaction Template",
        niche: "comedy",
        duration: "15-30s",
        format: "tiktok",
        thumbnail: "https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?w=400&h=300&fit=crop"
      },
      {
        id: 3,
        title: "Educational Explainer",
        niche: "education",
        duration: "60-90s",
        format: "youtube",
        thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"
      },
      {
        id: 4,
        title: "Product Review Template",
        niche: "review",
        duration: "45-60s",
        format: "youtube",
        thumbnail: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?w=400&h=300&fit=crop"
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplates(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Process each file
    const newJobs = Array.from(files).map(file => ({
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'queued',
      progress: 0,
      template: selectedTemplates.length > 0 ? selectedTemplates[0] : null,
      createdAt: new Date().toISOString()
    }));

    setBatchJobs(prev => [...prev, ...newJobs]);
  };

  // Start batch processing
  const startBatchProcessing = () => {
    if (batchJobs.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setCurrentJobIndex(0);
    setOverallProgress(0);
    
    // Reset job statuses
    setBatchJobs(prev => prev.map(job => ({
      ...job,
      status: 'queued',
      progress: 0
    })));
    
    processNextJob(0);
  };

  // Process next job in queue
  const processNextJob = (index) => {
    if (index >= batchJobs.length) {
      // All jobs completed
      setIsProcessing(false);
      setCurrentJobIndex(-1);
      return;
    }

    setCurrentJobIndex(index);
    
    // Update current job status
    setBatchJobs(prev => {
      const updatedJobs = [...prev];
      updatedJobs[index] = {
        ...updatedJobs[index],
        status: 'processing',
        progress: 0
      };
      return updatedJobs;
    });

    // Simulate processing with progress updates
    simulateJobProcessing(index);
  };

  // Simulate job processing (in a real app, this would use actual processing logic)
  const simulateJobProcessing = (jobIndex) => {
    let progress = 0;
    const currentJob = batchJobs[jobIndex];
    if (!currentJob) return;
    
    const templateId = currentJob.template || (selectedTemplates.length > 0 ? selectedTemplates[0] : null);
    const template = templates.find(t => t.id === templateId) || templates[0];
    
    // Get random success/failure (90% success rate for simulation)
    const willSucceed = Math.random() > 0.1;
    
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100 || (!willSucceed && progress >= 60)) {
        clearInterval(interval);
        
        if (willSucceed) {
          // Job completed successfully
          progress = 100;
          const durationParts = template.duration.split('-');
          const duration = parseInt(durationParts[1]) || 60;
          
          setBatchJobs(prev => {
            const updatedJobs = [...prev];
            if (updatedJobs[jobIndex]) {
              updatedJobs[jobIndex] = {
                ...updatedJobs[jobIndex],
                status: 'completed',
                progress: 100,
                result: {
                  url: URL.createObjectURL(new Blob(['mock video data'], { type: 'video/mp4' })),
                  format: template.format,
                  duration: duration,
                  size: Math.round(Math.random() * 10000000 + 1000000),
                  width: 1080,
                  height: 1920,
                  createdAt: new Date().toISOString()
                }
              };
            }
            return updatedJobs;
          });
          
          setCompletedJobs(prev => [...prev, jobIndex]);
        } else {
          // Job failed
          const errorTypes = ['RENDER_ERROR', 'EXPORT_ERROR', 'RESOURCE_ERROR', 'TIMEOUT_ERROR'];
          const randomErrorIndex = Math.floor(Math.random() * errorTypes.length);
          const randomError = errorTypes[randomErrorIndex];
          
          setBatchJobs(prev => {
            const updatedJobs = [...prev];
            if (updatedJobs[jobIndex]) {
              updatedJobs[jobIndex] = {
                ...updatedJobs[jobIndex],
                status: 'failed',
                progress: Math.round(progress),
                error: {
                  type: randomError,
                  message: 'Failed to process video: ' + randomError,
                  timestamp: new Date().toISOString()
                }
              };
            }
            return updatedJobs;
          });
          
          setFailedJobs(prev => [...prev, jobIndex]);
          
          // Log error for recovery with sanitized data
          if (errorHandler && errorHandler.logError) {
            errorHandler.logError({
              type: randomError,
              context: {
                jobId: encodeURIComponent(currentJob.id || 'unknown'),
                fileName: encodeURIComponent(currentJob.name || 'unknown'),
                templateId: templateId ? String(templateId) : 'none'
              },
              message: 'Batch processing failed for job ' + encodeURIComponent(currentJob.id || 'unknown')
            });
          }
        }
        
        // Update overall progress
        const newOverallProgress = Math.round(((jobIndex + 1) / batchJobs.length) * 100);
        setOverallProgress(newOverallProgress);
        
        // Process next job
        setTimeout(() => {
          processNextJob(jobIndex + 1);
        }, 500);
      } else {
        // Update progress
        setBatchJobs(prev => {
          const updatedJobs = [...prev];
          if (updatedJobs[jobIndex]) {
            updatedJobs[jobIndex] = {
              ...updatedJobs[jobIndex],
              progress: Math.round(progress)
            };
          }
          return updatedJobs;
        });
      }
    }, 300);
  };

  // Cancel batch processing
  const cancelBatchProcessing = () => {
    setIsProcessing(false);
    setCurrentJobIndex(-1);
    
    // Mark all in-progress jobs as cancelled
    setBatchJobs(prev => prev.map(job => 
      job.status === 'processing' ? { ...job, status: 'cancelled', progress: 0 } : job
    ));
  };

  // Remove job from queue
  const removeJob = (jobIndex) => {
    setBatchJobs(prev => prev.filter((_, index) => index !== jobIndex));
  };

  // Retry failed job
  const retryJob = (jobIndex) => {
    setBatchJobs(prev => {
      const updatedJobs = [...prev];
      updatedJobs[jobIndex] = {
        ...updatedJobs[jobIndex],
        status: 'queued',
        progress: 0,
        error: null
      };
      return updatedJobs;
    });
    
    setFailedJobs(prev => prev.filter(index => index !== jobIndex));
  };

  // Download completed video
  const downloadVideo = (jobIndex) => {
    const job = batchJobs[jobIndex];
    if (!job || job.status !== 'completed' || !job.result?.url) return;
    
    // Create download link
    const a = document.createElement('a');
    a.href = job.result.url;
    a.download = `${job.name.split('.')[0]}_processed.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-[60px] pb-[80px] md:pb-4">
        <div className="container mx-auto px-4 py-6">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                  <span className="text-primary">Batch</span> Video Creator
                </h1>
                <p className="text-muted-foreground">
                  Process multiple videos at once using templates and custom settings
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  iconName="ArrowLeft"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>

            {/* Technology Badge */}
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-full text-xs">
                <Icon name="Zap" size={12} className="text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Parallel Processing with Web Workers
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-12 gap-6">
            
            {/* Left Panel - Templates & Upload */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Templates */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-body font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="LayoutTemplate" size={16} />
                  <span>Video Templates</span>
                </h3>
                
                <div className="space-y-3">
                  {templates.map(template => (
                    <div 
                      key={template.id}
                      className={`
                        p-3 rounded-md border cursor-pointer transition-all
                        ${selectedTemplates.includes(template.id) 
                          ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                          : 'border-border bg-card hover:border-primary/50'}
                      `}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                          <img 
                            src={template.thumbnail} 
                            alt={template.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{template.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                              {template.niche}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                              {template.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-6 h-6">
                          {selectedTemplates.includes(template.id) && (
                            <Icon name="Check" size={16} className="text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* File Upload */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-body font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="Upload" size={16} />
                  <span>Upload Files</span>
                </h3>
                
                <div className="space-y-4">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Upload" size={20} className="text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        MP4, MOV, or image files (JPG, PNG)
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept=".mp4,.mov,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                  </div>
                  
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    iconName="Play"
                    onClick={startBatchProcessing}
                    disabled={isProcessing || batchJobs.length === 0 || selectedTemplates.length === 0}
                  >
                    {isProcessing ? 'Processing...' : 'Start Batch Processing'}
                  </Button>
                  
                  {isProcessing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      iconName="StopCircle"
                      onClick={cancelBatchProcessing}
                    >
                      Cancel Processing
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Panel - Job Queue & Progress */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Overall Progress */}
              {isProcessing && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-body font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="Activity" size={16} />
                    <span>Batch Progress</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Processing job {currentJobIndex + 1} of {batchJobs.length}
                      </span>
                      <span className="font-medium text-foreground">
                        {overallProgress}%
                      </span>
                    </div>
                    
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${overallProgress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Completed: {completedJobs.length}</span>
                      <span>Failed: {failedJobs.length}</span>
                      <span>Remaining: {batchJobs.length - completedJobs.length - failedJobs.length}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Job Queue */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-body font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="List" size={16} />
                  <span>Job Queue</span>
                  {batchJobs.length > 0 && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      {batchJobs.length} {batchJobs.length === 1 ? 'job' : 'jobs'}
                    </span>
                  )}
                </h3>
                
                {batchJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="Inbox" size={24} className="text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      No jobs in queue. Upload files to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batchJobs.map((job, index) => (
                      <div 
                        key={job.id}
                        className={`
                          p-4 rounded-lg border
                          ${job.status === 'completed' ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 
                            job.status === 'failed' ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : 
                            job.status === 'processing' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 
                            'border-border bg-card'}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon 
                              name={
                                job.status === 'completed' ? 'CheckCircle' : 
                                job.status === 'failed' ? 'XCircle' : 
                                job.status === 'processing' ? 'Loader' : 
                                'File'
                              } 
                              size={16} 
                              className={
                                job.status === 'completed' ? 'text-green-600' : 
                                job.status === 'failed' ? 'text-red-600' : 
                                job.status === 'processing' ? 'text-primary animate-spin' : 
                                'text-muted-foreground'
                              }
                            />
                            <span className="font-medium text-sm text-foreground truncate max-w-[200px]">
                              {job.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {job.status === 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                iconName="Download"
                                onClick={() => downloadVideo(index)}
                              >
                                Download
                              </Button>
                            )}
                            
                            {job.status === 'failed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                iconName="RefreshCw"
                                onClick={() => retryJob(index)}
                                disabled={isProcessing}
                              >
                                Retry
                              </Button>
                            )}
                            
                            {!isProcessing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                iconName="X"
                                onClick={() => removeJob(index)}
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        {(job.status === 'processing' || job.progress > 0) && (
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                            <div 
                              className={`h-full transition-all ${
                                job.status === 'completed' ? 'bg-green-500' : 
                                job.status === 'failed' ? 'bg-red-500' : 
                                'bg-primary'
                              }`}
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                        )}
                        
                        {/* Status info */}
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className={`
                            px-2 py-0.5 rounded-full
                            ${job.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 
                              job.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 
                              job.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 
                              'bg-muted text-muted-foreground'}
                          `}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                          
                          <span className="text-muted-foreground">
                            {job.status === 'completed' && job.result ? 
                              `${(job.result.size / 1024 / 1024).toFixed(1)} MB` : 
                              `${(job.size / 1024 / 1024).toFixed(1)} MB`}
                          </span>
                        </div>
                        
                        {/* Error message */}
                        {job.status === 'failed' && job.error && (
                          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-300">
                            {job.error.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Completed Jobs */}
              {completedJobs.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-body font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <span>Completed Jobs</span>
                    <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300">
                      {completedJobs.length}
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {completedJobs.map(jobIndex => {
                      const job = batchJobs[jobIndex];
                      if (!job || job.status !== 'completed') return null;
                      
                      return (
                        <div key={job.id} className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                              <Icon name="Video" size={16} className="text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{job.name}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {job.result?.format === 'tiktok' ? 'TikTok' : 'YouTube'} • {job.result?.duration}s
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {(job.result?.size / 1024 / 1024).toFixed(1)} MB
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              iconName="Download"
                              onClick={() => downloadVideo(jobIndex)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCreator;