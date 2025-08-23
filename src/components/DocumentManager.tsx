import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Document } from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface DocumentManagerProps {
  applicationId?: string;
  programId?: string;
  showUploadButton?: boolean;
  maxDocuments?: number;
}

export function DocumentManager({ applicationId, programId, showUploadButton = true, maxDocuments }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, [applicationId, programId]);

  const loadDocuments = () => {
    let allDocuments = storageUtils.getDocuments();
    
    // Filter by application or program if specified
    if (applicationId) {
      allDocuments = allDocuments.filter(doc => doc.applicationId === applicationId);
    }
    if (programId) {
      allDocuments = allDocuments.filter(doc => doc.programId === programId);
    }
    
    // Sort by upload date (newest first)
    allDocuments.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    if (maxDocuments) {
      allDocuments = allDocuments.slice(0, maxDocuments);
    }
    
    setDocuments(allDocuments);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingFile(file);
      setDocumentName(file.name);
    }
  };

  const handleUpload = () => {
    if (!uploadingFile || !documentName.trim()) return;

    const documentType = getDocumentType(uploadingFile.name);
    const document: Document = {
      id: Date.now().toString(),
      name: documentName.trim(),
      type: documentType,
      size: uploadingFile.size,
      uploadedAt: new Date().toISOString(),
      applicationId,
      programId,
      status: 'pending',
      fileUrl: URL.createObjectURL(uploadingFile), // In real app, this would be uploaded to server
      thumbnailUrl: documentType === 'image' ? URL.createObjectURL(uploadingFile) : undefined
    };

    storageUtils.saveDocument(document);
    setUploadingFile(null);
    setDocumentName('');
    setIsUploadDialogOpen(false);
    loadDocuments();
  };

  const getDocumentType = (fileName: string): Document['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    } else {
      return 'document';
    }
  };

  const deleteDocument = (documentId: string) => {
    storageUtils.deleteDocument(documentId);
    loadDocuments();
  };

  const updateDocumentStatus = (documentId: string, status: Document['status']) => {
    const updatedDocuments = documents.map(doc => {
      if (doc.id === documentId) {
        return { ...doc, status };
      }
      return doc;
    });
    
    updatedDocuments.forEach(doc => storageUtils.saveDocument(doc));
    loadDocuments();
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'image':
        return <Image className="h-5 w-5 text-blue-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents</h3>
        {showUploadButton && (
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select File</label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Document Name</label>
                  <Input
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Enter document name"
                    className="mt-1"
                  />
                </div>
                {uploadingFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(getDocumentType(uploadingFile.name))}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{uploadingFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(uploadingFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleUpload} className="flex-1" disabled={!uploadingFile || !documentName.trim()}>
                    Upload
                  </Button>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No documents uploaded yet</p>
            {showUploadButton && (
              <p className="text-sm mt-1">Click "Upload Document" to get started</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map((document) => (
            <Card key={document.id} className="transition-all hover:shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getDocumentIcon(document.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{document.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(document.status)} className="text-xs">
                            {getStatusIcon(document.status)}
                            {document.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(document.size)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(document.uploadedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {document.fileUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(document.fileUrl, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDocument(document.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Document Status Legend */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Document Status Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-yellow-600" />
              <span>Pending - Under review</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Verified - Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-3 w-3 text-red-600" />
              <span>Rejected - Needs attention</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}