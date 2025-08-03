'use client';

import React from 'react';
import { CreateGrantForm } from '@/components/forms/create-grant-form';
import { BudgetLineItemForm } from '@/components/forms/budget-line-item-form';
import { SearchGrantsForm } from '@/components/forms/search-grants-form';
import { useFormValidation } from '@/hooks/use-form-validation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Search,
  DollarSign,
} from 'lucide-react';

export default function FormsDemo() {
  const [activeTab, setActiveTab] = React.useState('grant');
  const [validationResults, setValidationResults] = React.useState<any[]>([]);
  const validation = useFormValidation();

  const handleGrantSuccess = (grant: any) => {
    console.log('Grant created:', grant);
    setValidationResults(prev => [
      ...prev,
      {
        type: 'success',
        message: `Grant "${grant.grantTitle}" created successfully`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleBudgetSuccess = (item: any) => {
    console.log('Budget item created:', item);
    setValidationResults(prev => [
      ...prev,
      {
        type: 'success',
        message: `Budget line item for ${item.category} created successfully`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    const result = validation.validateSearchGrants(filters);

    setValidationResults(prev => [
      ...prev,
      {
        type: result.success ? 'success' : 'error',
        message: result.success
          ? `Search executed with ${Object.keys(filters).length} filters`
          : `Search validation failed: ${result.message}`,
        timestamp: new Date(),
        details: result.success ? filters : result.errors,
      },
    ]);
  };

  const clearResults = () => {
    setValidationResults([]);
  };

  return (
    <div className='container mx-auto space-y-8 py-8'>
      {/* Header */}
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold'>Form Validation Demo</h1>
        <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
          Comprehensive form validation system with Zod schemas, React Hook Form
          integration, and real-time validation feedback for Grant Tracker 2.0.
        </p>
      </div>

      {/* Validation Results */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <AlertCircle className='h-5 w-5' />
                Validation Results
              </CardTitle>
              <CardDescription>
                Real-time validation feedback from form submissions
              </CardDescription>
            </div>
            <button
              onClick={clearResults}
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Clear Results
            </button>
          </CardHeader>
          <CardContent>
            <div className='max-h-40 space-y-3 overflow-y-auto'>
              {validationResults.map((result, index) => (
                <div
                  key={index}
                  className='flex items-start gap-3 rounded-lg border p-3'
                >
                  {result.type === 'success' ? (
                    <CheckCircle className='mt-0.5 h-5 w-5 text-green-500' />
                  ) : (
                    <AlertCircle className='mt-0.5 h-5 w-5 text-red-500' />
                  )}
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{result.message}</p>
                    <p className='text-xs text-muted-foreground'>
                      {result.timestamp.toLocaleTimeString()}
                    </p>
                    {result.details && (
                      <pre className='mt-2 overflow-x-auto rounded bg-muted p-2 text-xs'>
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='grant' className='flex items-center gap-2'>
            <FileText className='h-4 w-4' />
            Create Grant
          </TabsTrigger>
          <TabsTrigger value='budget' className='flex items-center gap-2'>
            <DollarSign className='h-4 w-4' />
            Budget Item
          </TabsTrigger>
          <TabsTrigger value='search' className='flex items-center gap-2'>
            <Search className='h-4 w-4' />
            Search & Filter
          </TabsTrigger>
        </TabsList>

        {/* Grant Creation Form */}
        <TabsContent value='grant' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                Grant Creation Form
              </CardTitle>
              <CardDescription>
                Demonstrates comprehensive form validation with Zod schemas
                including:
                <div className='mt-2 flex flex-wrap gap-2'>
                  <Badge variant='secondary'>Required Fields</Badge>
                  <Badge variant='secondary'>Date Validation</Badge>
                  <Badge variant='secondary'>Regex Patterns</Badge>
                  <Badge variant='secondary'>Cross-field Validation</Badge>
                  <Badge variant='secondary'>Custom Error Messages</Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateGrantForm onSuccess={handleGrantSuccess} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Line Item Form */}
        <TabsContent value='budget' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <DollarSign className='h-5 w-5' />
                Budget Line Item Form
              </CardTitle>
              <CardDescription>
                Demonstrates financial validation with features including:
                <div className='mt-2 flex flex-wrap gap-2'>
                  <Badge variant='secondary'>Currency Validation</Badge>
                  <Badge variant='secondary'>Real-time Calculations</Badge>
                  <Badge variant='secondary'>Budget Constraints</Badge>
                  <Badge variant='secondary'>Category Selection</Badge>
                  <Badge variant='secondary'>Live Preview</Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetLineItemForm
                grantYearId='demo-grant-year-id'
                onSuccess={handleBudgetSuccess}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search and Filter Form */}
        <TabsContent value='search' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Search className='h-5 w-5' />
                Search & Filter Form
              </CardTitle>
              <CardDescription>
                Demonstrates advanced search validation with features including:
                <div className='mt-2 flex flex-wrap gap-2'>
                  <Badge variant='secondary'>Optional Fields</Badge>
                  <Badge variant='secondary'>Date Range Validation</Badge>
                  <Badge variant='secondary'>Dynamic Filters</Badge>
                  <Badge variant='secondary'>Advanced/Basic Toggle</Badge>
                  <Badge variant='secondary'>Filter State Management</Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchGrantsForm onSearch={handleSearch} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validation Features */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Features</CardTitle>
          <CardDescription>
            Comprehensive validation system built with industry best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='space-y-2'>
              <h4 className='flex items-center gap-2 font-semibold'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                Schema Validation
              </h4>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                <li>• Zod schema definitions</li>
                <li>• Type-safe validation</li>
                <li>• Custom error messages</li>
                <li>• Nested object validation</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h4 className='flex items-center gap-2 font-semibold'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                Form Integration
              </h4>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                <li>• React Hook Form integration</li>
                <li>• Real-time validation</li>
                <li>• Field-level error display</li>
                <li>• Form state management</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h4 className='flex items-center gap-2 font-semibold'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                Business Logic
              </h4>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                <li>• Grant number patterns</li>
                <li>• Date range validation</li>
                <li>• Currency formatting</li>
                <li>• File type/size limits</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h4 className='flex items-center gap-2 font-semibold'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                User Experience
              </h4>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                <li>• Inline error messages</li>
                <li>• Loading states</li>
                <li>• Success feedback</li>
                <li>• Accessible forms</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h4 className='flex items-center gap-2 font-semibold'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                Data Integrity
              </h4>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                <li>• Required field enforcement</li>
                <li>• Data type validation</li>
                <li>• Range constraints</li>
                <li>• Cross-field dependencies</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h4 className='flex items-center gap-2 font-semibold'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                Developer Tools
              </h4>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                <li>• TypeScript integration</li>
                <li>• Reusable components</li>
                <li>• Validation hooks</li>
                <li>• Error handling utilities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
