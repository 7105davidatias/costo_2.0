import { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X, CheckCircle, AlertCircle, Eye } from 'lucide-react';
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
}

export default function FileUpload({ requestId, onUploadComplete, onFileView, className }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      toast({
        title: "קובץ הועלה בהצלחה",
        description: `${file.name} הועלה ונשלח לניתוח AI`,
      });

      queryClient.invalidateQueries({ queryKey: ["documents/request", requestId] });
      onUploadComplete?.(data);

      // Remove from uploading files after success
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
      }, 2000);
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
        title: "שגיאה בהעלאת קובץ",
        description: `נכשלה העלאת ${file.name}: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        toast({
          title: "סוג קובץ לא נתמך",
          description: `${file.name} - נתמכים רק קבצי PDF, DOC, XLS`,
          variant: "destructive",
        });
        return false;
      }

      if (!isValidSize) {
        toast({
          title: "קובץ גדול מדי",
          description: `${file.name} - גודל מקסימלי 10MB`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    validFiles.forEach(file => {
      setUploadingFiles(prev => [...prev, {
        file,
        progress: 0,
        status: 'uploading'
      }]);

      uploadMutation.mutate(file);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== file));
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('excel') || file.type.includes('sheet')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Upload className="w-4 h-4 text-primary animate-pulse" />;
    }
  };

  return (
    <Card className={cn('bg-card border-secondary/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg">
            מסמכים
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            {uploadingFiles.length} קבצים
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* אזור העלאה */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer',
            dragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-muted/50 hover:border-primary/50 hover:bg-primary/5'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="העלה קבצים">
          <Upload className={cn(
            'w-8 h-8 mx-auto mb-2 transition-colors',
            dragActive ? 'text-primary' : 'text-muted-foreground'
          )} />
          <p className="text-foreground mb-2">
            {dragActive ? 'שחרר כדי להעלות' : 'גרור ושחרר קבצים כאן או'}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="text-primary border-primary hover:bg-primary/10"
          >
            בחר קבצים
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PDF, DOC, XLS עד 10MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileInput}
            className="hidden"
            aria-hidden="true" />
        </div>

        {/* קבצים שהועלו */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-foreground text-sm font-semibold">
              קבצים שהועלו
            </h4>

            {uploadingFiles.map((uploadingFile, index) => (
              <div
                key={index}
                className="bg-muted/20 rounded-lg p-4 transition-all duration-200 hover:bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-2xl">
                      {getFileIcon(uploadingFile.file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground font-medium truncate">
                        {uploadingFile.file.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(uploadingFile.file.size)} • {uploadingFile.file.type.split('/')[1]?.toUpperCase()}
                        </span>
                        {uploadingFile.status === 'success' && (
                          <Badge 
                            variant="outline" 
                            className="text-green-400 border-green-400"
                          >
                            הועלה
                          </Badge>
                        )}
                      </div>

                      {/* פס התקדמות העלאה */}
                      {uploadingFile.status === 'uploading' && (
                        <Progress 
                          value={uploadingFile.progress} 
                          className="mt-2 h-1" />
                      )}

                      {uploadingFile.status === 'error' && (
                        <p className="text-xs text-destructive mt-1">{uploadingFile.error}</p>
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
                        className="text-primary hover:text-primary/90 hover:bg-primary/10"
                        aria-label={`צפה בקובץ ${uploadingFile.file.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadingFile.file)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      aria-label={`הסר קובץ ${uploadingFile.file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}