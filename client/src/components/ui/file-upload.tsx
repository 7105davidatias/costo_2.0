
import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X, CheckCircle, AlertCircle, Eye, Cloud, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  requestId: number;
  onUploadComplete?: (file: any) => void;
  onFileView?: (file: any) => void;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  id: string;
  uploadSpeed?: number;
  remainingTime?: number;
}

export default function FileUpload({ requestId, onUploadComplete, onFileView, className }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [dragDepth, setDragDepth] = useState(0);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-save state
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`/api/documents/upload/${requestId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: (data, file) => {
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      );

      setLastSaved(new Date());
      
      toast({
        title: "✨ קובץ הועלה בהצלחה",
        description: `${file.name} הועלה ונשלח לניתוח AI`,
        className: "border-success/50 bg-success/10",
      });

      queryClient.invalidateQueries({ queryKey: ["documents/request", requestId] });
      onUploadComplete?.(data);

      // Remove from uploading files after success animation
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
      }, 3000);
    },
    onError: (error, file) => {
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      );

      toast({
        title: "⚠️ שגיאה בהעלאת קובץ",
        description: `נכשלה העלאת ${file.name}: ${error.message}`,
        variant: "destructive",
        className: "border-destructive/50 bg-destructive/10",
      });
    },
  });

  // Enhanced drag handlers with depth tracking
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth(prev => prev + 1);
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth(prev => {
      const newDepth = prev - 1;
      if (newDepth === 0) setDragActive(false);
      return newDepth;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setDragDepth(0);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  // Enhanced file validation with real-time feedback
  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: { file: File; reason: string }[] = [];

    files.forEach(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png'
      ];

      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      const isValidName = !/[<>:"/\\|?*]/.test(file.name);

      if (!isValidType) {
        invalidFiles.push({ file, reason: 'סוג קובץ לא נתמך' });
      } else if (!isValidSize) {
        invalidFiles.push({ file, reason: 'קובץ גדול מדי (מעל 10MB)' });
      } else if (!isValidName) {
        invalidFiles.push({ file, reason: 'שם קובץ לא תקין' });
      } else {
        validFiles.push(file);
      }
    });

    // Show validation errors with enhanced feedback
    invalidFiles.forEach(({ file, reason }) => {
      toast({
        title: `❌ ${file.name}`,
        description: reason,
        variant: "destructive",
        className: "border-destructive/50 bg-destructive/10",
      });
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    validFiles.forEach(file => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setUploadingFiles(prev => [...prev, {
        file,
        progress: 0,
        status: 'uploading',
        id: fileId,
        uploadSpeed: 0,
        remainingTime: 0
      }]);

      // Simulate real-time progress with speed calculation
      simulateUploadProgress(file, fileId);
      uploadMutation.mutate(file);
    });
  };

  const simulateUploadProgress = (file: File, fileId: string) => {
    const startTime = Date.now();
    const fileSize = file.size;
    let lastProgress = 0;

    const interval = setInterval(() => {
      setUploadingFiles(prev => prev.map(f => {
        if (f.id === fileId && f.status === 'uploading') {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(95, (elapsed / 3000) * 100); // 3 seconds to 95%
          
          const speed = (progress - lastProgress) * fileSize / 100 / (100); // bytes per ms
          const remaining = fileSize * (100 - progress) / 100;
          const remainingTime = speed > 0 ? remaining / speed : 0;
          
          lastProgress = progress;
          
          return {
            ...f,
            progress,
            uploadSpeed: speed * 1000, // bytes per second
            remainingTime: remainingTime / 1000 // seconds
          };
        }
        return f;
      }));

      if (lastProgress >= 95) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 100);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return { icon: '📄', color: 'text-red-400' };
    if (file.type.includes('word')) return { icon: '📝', color: 'text-blue-400' };
    if (file.type.includes('excel') || file.type.includes('sheet')) return { icon: '📊', color: 'text-green-400' };
    if (file.type.includes('image')) return { icon: '🖼️', color: 'text-purple-400' };
    return { icon: '📎', color: 'text-gray-400' };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUploadSpeed = (bytesPerSecond: number) => {
    if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`;
    if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toFixed(0).padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive animate-bounce" />;
      default:
        return <Upload className="w-4 h-4 text-primary animate-pulse" />;
    }
  };

  const getProgressColor = (progress: number, status: string) => {
    if (status === 'success') return 'bg-gradient-to-r from-success to-success/80';
    if (status === 'error') return 'bg-gradient-to-r from-destructive to-destructive/80';
    if (progress < 30) return 'bg-gradient-to-r from-cyan-500 to-blue-500';
    if (progress < 70) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    return 'bg-gradient-to-r from-purple-500 to-pink-500';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Enhanced Upload Zone */}
      <div
        className={cn(
          'relative overflow-hidden border-2 border-dashed rounded-glass p-8 text-center transition-all duration-500 cursor-pointer group',
          'backdrop-blur-md bg-gradient-to-br',
          dragActive 
            ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.3)] scale-105' 
            : 'border-muted/50 bg-muted/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="העלה קבצים"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className={cn(
            'absolute inset-0 bg-gradient-to-r transition-all duration-1000',
            dragActive 
              ? 'from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-pulse' 
              : 'from-transparent via-cyan-500/5 to-transparent'
          )} />
        </div>

        {/* Upload Icon with Animation */}
        <div className="relative z-10">
          <div className={cn(
            'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500',
            dragActive 
              ? 'bg-cyan-500/20 border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.4)]' 
              : 'bg-muted/20 border border-muted/30 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/50'
          )}>
            {dragActive ? (
              <Cloud className="w-8 h-8 text-cyan-400 animate-bounce" />
            ) : (
              <Upload className={cn(
                'w-8 h-8 transition-all duration-300',
                'text-muted-foreground group-hover:text-cyan-400 group-hover:scale-110'
              )} />
            )}
          </div>

          <div className="space-y-2">
            <p className={cn(
              'text-lg font-medium transition-colors duration-300',
              dragActive ? 'text-cyan-400' : 'text-foreground group-hover:text-cyan-400'
            )}>
              {dragActive ? '🚀 שחרר כדי להעלות' : '📁 גרור ושחרר קבצים כאן'}
            </p>
            
            <p className="text-sm text-muted-foreground">או</p>
            
            <Button 
              variant="outline" 
              size="lg"
              className={cn(
                'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400',
                'hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300',
                dragActive && 'animate-pulse'
              )}
            >
              <Sparkles className="w-4 h-4 ml-2" />
              בחר קבצים
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>PDF • DOC • XLS • TXT • IMG</span>
            <span>•</span>
            <span>עד 10MB</span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Auto-save Indicator */}
      {autoSaveEnabled && lastSaved && (
        <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-glass">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-success animate-pulse" />
            <span className="text-sm text-success">שמירה אוטומטית פעילה</span>
          </div>
          <span className="text-xs text-success/80">
            נשמר לאחרונה: {lastSaved.toLocaleTimeString('he-IL')}
          </span>
        </div>
      )}

      {/* Enhanced Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-foreground text-sm font-semibold flex items-center">
              <FileText className="w-4 h-4 ml-2 text-primary" />
              קבצים שהועלו ({uploadingFiles.length})
            </h4>
            {isUploading && (
              <Badge variant="outline" className="animate-pulse border-cyan-500/50 text-cyan-400">
                <Cloud className="w-3 h-3 ml-1" />
                מעלה...
              </Badge>
            )}
          </div>

          {uploadingFiles.map((uploadingFile) => {
            const fileIconData = getFileIcon(uploadingFile.file);
            
            return (
              <div
                key={uploadingFile.id}
                className={cn(
                  'bg-card/80 backdrop-blur-sm border rounded-glass p-4 transition-all duration-500',
                  'hover:bg-card/90 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]',
                  uploadingFile.status === 'success' && 'border-success/50 bg-success/5',
                  uploadingFile.status === 'error' && 'border-destructive/50 bg-destructive/5'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={cn('text-2xl transition-all duration-300', fileIconData.color)}>
                      {fileIconData.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground font-medium truncate">
                        {uploadingFile.file.name}
                      </h4>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(uploadingFile.file.size)}
                        </span>
                        
                        {uploadingFile.status === 'uploading' && uploadingFile.uploadSpeed && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-cyan-400">
                              {formatUploadSpeed(uploadingFile.uploadSpeed)}
                            </span>
                            {uploadingFile.remainingTime && uploadingFile.remainingTime > 0 && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(uploadingFile.remainingTime)} נותר
                                </span>
                              </>
                            )}
                          </>
                        )}

                        {uploadingFile.status === 'success' && (
                          <Badge className="text-xs bg-success/20 text-success border-success/40">
                            <CheckCircle className="w-3 h-3 ml-1" />
                            הועלה בהצלחה
                          </Badge>
                        )}
                      </div>

                      {/* Enhanced Progress Bar */}
                      {uploadingFile.status === 'uploading' && (
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">התקדמות</span>
                            <span className="text-xs font-medium text-cyan-400">
                              {Math.round(uploadingFile.progress)}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-muted/20 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                'h-full transition-all duration-300 relative overflow-hidden',
                                getProgressColor(uploadingFile.progress, uploadingFile.status)
                              )}
                              style={{ width: `${uploadingFile.progress}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      )}

                      {uploadingFile.status === 'error' && (
                        <p className="text-xs text-destructive mt-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                          ❌ {uploadingFile.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(uploadingFile.status)}

                    {uploadingFile.status === 'success' && onFileView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFileView(uploadingFile.file)}
                        className="text-primary hover:text-primary/90 hover:bg-primary/10 transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadingFile.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
