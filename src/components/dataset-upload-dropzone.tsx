// src/components/dataset-upload-dropzone.tsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DatasetUploadDropzoneProps {
  onFilesUploaded: (files: File[]) => void;
  maxFiles?: number;
  maxFileSizeMB?: number; // Max file size in MB
  acceptedFileTypes?: string[]; // e.g., ['text/csv', 'application/json']
}

export default function DatasetUploadDropzone({
  onFilesUploaded,
  maxFiles = 5,
  maxFileSizeMB = 100,
  acceptedFileTypes = ['text/csv', 'application/json', 'application/x-jsonlines', '.jsonl', 'application/pdf', 'text/plain'],
}: DatasetUploadDropzoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = (files: FileList | null) => {
    if (!files) return;

    setError(null);
    const newFiles = Array.from(files);
    let currentFiles = [...selectedFiles];

    for (const file of newFiles) {
      if (currentFiles.length >= maxFiles) {
        setError(`You can upload a maximum of ${maxFiles} files.`);
        break;
      }
      if (file.size > maxFileSizeBytes) {
        setError(`File "${file.name}" exceeds the ${maxFileSizeMB}MB size limit.`);
        continue;
      }
      
      const fileType = file.type || '';
      const fileName = file.name.toLowerCase();
      // Check for .jsonl extension specifically, as its MIME type can be inconsistent (application/jsonlines, application/x-jsonlines, or even application/octet-stream)
      const isJsonl = fileName.endsWith('.jsonl');
      
      const isAccepted = acceptedFileTypes.some(type => {
        if (type.startsWith('.')) return fileName.endsWith(type);
        return fileType === type;
      });

      if (!isAccepted && !isJsonl) { // If not directly accepted by MIME and not a .jsonl file (when .jsonl is in accepted types)
         setError(`File type for "${file.name}" is not supported. Accepted types/extensions: ${acceptedFileTypes.join(', ')}`);
         continue;
      }
      
      if (!currentFiles.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) {
        currentFiles.push(file);
      }
    }
    setSelectedFiles(currentFiles.slice(0, maxFiles));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
      processFiles(e.dataTransfer.files);
    },
    [selectedFiles, maxFiles, maxFileSizeBytes, acceptedFileTypes]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    if (selectedFiles.length -1 === 0) setError(null); // Clear error if all files causing it are removed
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setError(null);
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0 && !error) { // Ensure no error before submitting
      onFilesUploaded(selectedFiles);
      setSelectedFiles([]); 
      setError(null);
    } else if (error) {
        // Optionally, remind user to fix error
    }
  };
  
  const getDisplayAcceptedFileTypes = () => {
    return acceptedFileTypes.map(type => {
      if (type.startsWith('.')) return type.toUpperCase();
      if (type === 'application/x-jsonlines') return '.JSONL';
      return type.split('/')[1]?.toUpperCase() || type;
    }).filter(Boolean).join(', ');
  };


  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          isDraggingOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/70",
          error ? "border-destructive bg-destructive/10" : ""
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="File upload dropzone"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileInputChange}
          accept={acceptedFileTypes.join(',')}
        />
        <UploadCloud className={cn("w-12 h-12 mb-3", isDraggingOver ? "text-primary" : "text-muted-foreground", error ? "text-destructive" : "")} />
        <p className="mb-2 text-sm text-center">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Max {maxFiles} files, up to {maxFileSizeMB}MB each.
          Supported: {getDisplayAcceptedFileTypes()}
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center" role="alert">{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length}/{maxFiles}):</h4>
            <Button variant="link" onClick={handleClearAll} size="sm" className="text-xs h-auto p-0">Clear All</Button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-2 border rounded-md p-2">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs truncate" title={file.name}>{file.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }} aria-label={`Remove ${file.name}`}>
                  <XCircle className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={selectedFiles.length === 0 || !!error} className="w-full mt-2">
        Upload {selectedFiles.length > 0 ? selectedFiles.length : ''} File{selectedFiles.length !== 1 ? 's' : ''}
      </Button>
    </div>
  );
}
