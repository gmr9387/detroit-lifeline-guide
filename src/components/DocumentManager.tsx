import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Download, 
  Trash2, 
  Eye, 
  Edit, 
  Folder,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'other';
  category: 'identification' | 'income' | 'housing' | 'employment' | 'medical' | 'other';
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
  tags: string[];
  applicationId?: string;
  programId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'review';
  notes?: string;
  url?: string;
}

interface DocumentManagerProps {
  applicationId?: string;
  programId?: string;
  onDocumentUpload?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentUpdate?: (document: Document) => void;
}

const documentTypes = [
  { value: 'identification', label: 'Identification', icon: '🆔' },
  { value: 'income', label: 'Income Verification', icon: '💰' },
  { value: 'housing', label: 'Housing Documents', icon: '🏠' },
  { value: 'employment', label: 'Employment Records', icon: '💼' },
  { value: 'medical', label: 'Medical Documents', icon: '🏥' },
  { value: 'other', label: 'Other Documents', icon: '📄' },
];

const fileTypeIcons = {
  pdf: <FileText className="h-4 w-4 text-red-500" />,
  image: <Image className="h-4 w-4 text-green-500" />,
  document: <FileText className="h-4 w-4 text-blue-500" />,
  other: <File className="h-4 w-4 text-gray-500" />,
};

const statusConfig = {
  pending: { label: 'Pending Review', color: 'bg-yellow-500', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500', icon: AlertCircle },
  review: { label: 'Under Review', color: 'bg-blue-500', icon: Clock },
};

export default function DocumentManager({ 
  applicationId, 
  programId, 
  onDocumentUpload, 
  onDocumentDelete, 
  onDocumentUpdate 
}: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: '',
    description: '',
    tags: '',
  });
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileName: string): Document['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension || '')) return 'image';
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return 'document';
    return 'other';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadForm(prev => ({
        ...prev,
        name: file.name,
      }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate file upload
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      const newDocument: Document = {
        id: crypto.randomUUID(),
        name: uploadForm.name || selectedFile.name,
        type: getFileType(selectedFile.name),
        category: uploadForm.category as Document['category'],
        size: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Current User', // In real app, get from auth context
        description: uploadForm.description,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        applicationId,
        programId,
        status: 'pending',
        url: URL.createObjectURL(selectedFile), // In real app, upload to cloud storage
      };

      setDocuments(prev => [newDocument, ...prev]);
      onDocumentUpload?.(newDocument);

      // Reset form
      setSelectedFile(null);
      setUploadForm({
        name: '',
        category: '',
        description: '',
        tags: '',
      });
      setUploadProgress(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    onDocumentDelete?.(documentId);
  };

  const handleUpdateDocument = (document: Document) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === document.id ? document : doc)
    );
    onDocumentUpdate?.(document);
    setIsEditDialogOpen(false);
  };

  const filteredDocuments = documents
    .filter(doc => {
      if (filter !== 'all' && doc.category !== filter) return false;
      if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'date':
        default:
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const pendingCount = documents.filter(doc => doc.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                Document Manager
              </CardTitle>
              <CardDescription>
                Upload and manage your application documents
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {documents.length} documents
              </Badge>
              <Badge variant="secondary">
                {formatFileSize(totalSize)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Add documents to support your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="document-category">Category</Label>
              <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              value={uploadForm.name}
              onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter document name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="document-description">Description (Optional)</Label>
            <Textarea
              id="document-description"
              value={uploadForm.description}
              onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the document"
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="document-tags">Tags (Optional)</Label>
            <Input
              id="document-tags"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Enter tags separated by commas"
              className="mt-1"
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading || !uploadForm.category}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardContent className="p-0">
          {filteredDocuments.length === 0 ? (
            <div className="p-8 text-center">
              <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                {documents.length === 0 
                  ? "Upload your first document to get started."
                  : "No documents match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredDocuments.map((document) => {
                const StatusIcon = statusConfig[document.status].icon;
                return (
                  <div key={document.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {fileTypeIcons[document.type]}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{document.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {documentTypes.find(t => t.value === document.category)?.label}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${statusConfig[document.status].color}`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[document.status].label}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatFileSize(document.size)}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}</span>
                            {document.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{document.tags.join(', ')}</span>
                              </>
                            )}
                          </div>
                          
                          {document.description && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {document.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(document.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(document.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{documents.length}</div>
              <div className="text-sm text-muted-foreground">Total Documents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'approved').length}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{formatFileSize(totalSize)}</div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document information and status
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div>
                <Label>Document Name</Label>
                <Input
                  value={selectedDocument.name}
                  onChange={(e) => setSelectedDocument(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              
              <div>
                <Label>Category</Label>
                <Select 
                  value={selectedDocument.category} 
                  onValueChange={(value) => setSelectedDocument(prev => prev ? { ...prev, category: value as Document['category'] } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Status</Label>
                <Select 
                  value={selectedDocument.status} 
                  onValueChange={(value) => setSelectedDocument(prev => prev ? { ...prev, status: value as Document['status'] } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={selectedDocument.description || ''}
                  onChange={(e) => setSelectedDocument(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={selectedDocument.notes || ''}
                  onChange={(e) => setSelectedDocument(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => handleUpdateDocument(selectedDocument)} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}