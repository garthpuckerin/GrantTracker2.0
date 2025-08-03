'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Download,
  Trash2,
  Upload,
  Calendar,
  User,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { usePermissions } from '@/hooks/use-permissions';
import { PermissionGuard } from '@/components/auth/permission-guard';

interface Document {
  id: string;
  name: string;
  type: 'proposal' | 'report' | 'budget' | 'correspondence' | 'other';
  url?: string;
  uploadDate: Date;
  uploadedBy?: string;
  size?: number;
  grantId: string;
  yearNumber?: number;
}

interface SimpleDocumentManagerProps {
  grantId: string;
  currentYear?: number;
  documents?: Document[];
  onDocumentUploaded?: (document: Document) => void;
  onDocumentDeleted?: (documentId: string) => void;
}

const documentTypeColors = {
  proposal: 'default',
  report: 'secondary',
  budget: 'outline',
  correspondence: 'outline',
  other: 'outline',
} as const;

const documentTypeLabels = {
  proposal: 'Proposal',
  report: 'Report',
  budget: 'Budget',
  correspondence: 'Correspondence',
  other: 'Other',
};

// Mock documents for demonstration
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Original Grant Proposal.pdf',
    type: 'proposal',
    url: '#',
    uploadDate: new Date('2023-12-01'),
    uploadedBy: 'Dr. Jane Smith',
    size: 2500000,
    grantId: '1',
  },
  {
    id: '2',
    name: 'Year 1 Progress Report.pdf',
    type: 'report',
    url: '#',
    uploadDate: new Date('2024-12-15'),
    uploadedBy: 'Dr. Jane Smith',
    size: 1800000,
    grantId: '1',
    yearNumber: 1,
  },
  {
    id: '3',
    name: 'Budget Modification Request.pdf',
    type: 'budget',
    url: '#',
    uploadDate: new Date('2024-06-01'),
    uploadedBy: 'Finance Office',
    size: 450000,
    grantId: '1',
    yearNumber: 2,
  },
  {
    id: '4',
    name: 'Equipment Purchase Justification.docx',
    type: 'correspondence',
    url: '#',
    uploadDate: new Date('2024-08-15'),
    uploadedBy: 'Dr. Jane Smith',
    size: 125000,
    grantId: '1',
    yearNumber: 2,
  },
  {
    id: '5',
    name: 'Year 2 Budget Spreadsheet.xlsx',
    type: 'budget',
    url: '#',
    uploadDate: new Date('2025-01-10'),
    uploadedBy: 'Finance Office',
    size: 85000,
    grantId: '1',
    yearNumber: 2,
  },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function SimpleDocumentManager({
  grantId,
  currentYear,
  documents = mockDocuments,
  onDocumentUploaded,
  onDocumentDeleted,
}: SimpleDocumentManagerProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');

  const { hasPermission } = usePermissions();

  // Filter documents for current grant
  const grantDocuments = documents.filter(doc => doc.grantId === grantId);

  // Separate documents by category
  const generalDocuments = grantDocuments.filter(doc => !doc.yearNumber);
  const yearDocuments = currentYear
    ? grantDocuments.filter(doc => doc.yearNumber === currentYear)
    : [];

  const handleSimulateUpload = () => {
    if (!uploadFileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      name: uploadFileName,
      type: 'other',
      url: '#',
      uploadDate: new Date(),
      uploadedBy: 'Demo User',
      size: Math.floor(Math.random() * 1000000) + 100000, // Random size
      grantId,
      yearNumber: currentYear,
    };

    if (onDocumentUploaded) {
      onDocumentUploaded(newDocument);
    }

    setUploadFileName('');
    setShowUpload(false);
    alert(
      `Document "${uploadFileName}" uploaded successfully! (This is a demo - no actual file was uploaded)`
    );
  };

  const handleDelete = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      if (onDocumentDeleted) {
        onDocumentDeleted(documentId);
      }
      alert('Document deleted successfully! (This is a demo)');
    }
  };

  const handleDownload = (documentName: string) => {
    alert(
      `Downloading "${documentName}"... (This is a demo - no actual download)`
    );
  };

  return (
    <div className='space-y-6'>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center'>
              <Upload className='mr-2 h-5 w-5' />
              Document Management
            </CardTitle>
            <Button
              onClick={() => setShowUpload(!showUpload)}
              variant={showUpload ? 'outline' : 'default'}
            >
              {showUpload ? 'Cancel' : 'Upload New'}
            </Button>
          </div>
        </CardHeader>
        {showUpload && (
          <CardContent>
            <div className='space-y-4'>
              <div className='flex gap-4'>
                <Input
                  placeholder="Enter document name (e.g., 'Budget Report Q1.pdf')"
                  value={uploadFileName}
                  onChange={e => setUploadFileName(e.target.value)}
                  className='flex-1'
                />
                <Button onClick={handleSimulateUpload}>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Document
                </Button>
              </div>
              <p className='text-sm text-gray-600'>
                This is a demo version. In production, this would integrate with
                UploadThing for real file uploads.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* General Grant Documents */}
      {generalDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <FolderOpen className='mr-2 h-5 w-5' />
              Grant Documents ({generalDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {generalDocuments.map(document => (
                <div
                  key={document.id}
                  className='flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50'
                >
                  <div className='flex items-center space-x-3'>
                    <FileText className='h-5 w-5 text-gray-500' />
                    <div>
                      <p className='font-medium'>{document.name}</p>
                      <div className='flex items-center space-x-4 text-sm text-gray-600'>
                        <span className='flex items-center'>
                          <Calendar className='mr-1 h-3 w-3' />
                          {formatDate(document.uploadDate)}
                        </span>
                        {document.uploadedBy && (
                          <span className='flex items-center'>
                            <User className='mr-1 h-3 w-3' />
                            {document.uploadedBy}
                          </span>
                        )}
                        {document.size && (
                          <span>{formatFileSize(document.size)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge
                      variant={documentTypeColors[document.type]}
                      className={
                        document.type === 'proposal'
                          ? 'border-blue-200 bg-blue-100 text-blue-800'
                          : document.type === 'budget'
                            ? 'border-green-200 bg-green-100 text-green-800'
                            : document.type === 'correspondence'
                              ? 'border-purple-200 bg-purple-100 text-purple-800'
                              : ''
                      }
                    >
                      {documentTypeLabels[document.type]}
                    </Badge>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleDownload(document.name)}
                    >
                      <Download className='h-4 w-4' />
                    </Button>
                    <PermissionGuard
                      permission='documents:delete'
                      showFallback={false}
                    >
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleDelete(document.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Year-Specific Documents */}
      {currentYear && yearDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <FolderOpen className='mr-2 h-5 w-5' />
              Year {currentYear} Documents ({yearDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {yearDocuments.map(document => (
                <div
                  key={document.id}
                  className='flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50'
                >
                  <div className='flex items-center space-x-3'>
                    <FileText className='h-5 w-5 text-gray-500' />
                    <div>
                      <p className='font-medium'>{document.name}</p>
                      <div className='flex items-center space-x-4 text-sm text-gray-600'>
                        <span className='flex items-center'>
                          <Calendar className='mr-1 h-3 w-3' />
                          {formatDate(document.uploadDate)}
                        </span>
                        {document.uploadedBy && (
                          <span className='flex items-center'>
                            <User className='mr-1 h-3 w-3' />
                            {document.uploadedBy}
                          </span>
                        )}
                        {document.size && (
                          <span>{formatFileSize(document.size)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge
                      variant={documentTypeColors[document.type]}
                      className={
                        document.type === 'proposal'
                          ? 'border-blue-200 bg-blue-100 text-blue-800'
                          : document.type === 'budget'
                            ? 'border-green-200 bg-green-100 text-green-800'
                            : document.type === 'correspondence'
                              ? 'border-purple-200 bg-purple-100 text-purple-800'
                              : ''
                      }
                    >
                      {documentTypeLabels[document.type]}
                    </Badge>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleDownload(document.name)}
                    >
                      <Download className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleDelete(document.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {generalDocuments.length === 0 && yearDocuments.length === 0 && (
        <Card>
          <CardContent className='py-12 text-center'>
            <FileText className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <h3 className='mb-2 text-lg font-medium text-gray-900'>
              No documents uploaded
            </h3>
            <p className='mb-4 text-gray-600'>
              Upload grant documents, reports, budgets, and correspondence to
              keep everything organized.
            </p>
            <Button onClick={() => setShowUpload(true)}>
              <Upload className='mr-2 h-4 w-4' />
              Upload First Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
