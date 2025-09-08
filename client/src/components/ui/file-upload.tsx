import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  requestId: number;
  onUploadComplete?: (file: any) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function FileUpload({ requestId, onUploadComplete }: FileUploadProps) {
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
      
      queryClient.invalidateQueries({ queryKey: ["/api/documents/request", requestId] });
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

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
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-muted hover:border-secondary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">גרור ושחרר קבצים כאן או</p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="border-secondary text-secondary hover:bg-secondary/10"
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
        />
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">קבצים בהעלאה:</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="flex items-center space-x-reverse space-x-3 p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-reverse space-x-3 flex-1">
                <span className="text-lg">{getFileIcon(uploadingFile.file)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{uploadingFile.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {uploadingFile.status === 'uploading' && (
                    <Progress value={uploadingFile.progress} className="mt-1 h-1" />
                  )}
                  {uploadingFile.status === 'error' && (
                    <p className="text-xs text-destructive mt-1">{uploadingFile.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-reverse space-x-2">
                {getStatusIcon(uploadingFile.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadingFile.file)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
