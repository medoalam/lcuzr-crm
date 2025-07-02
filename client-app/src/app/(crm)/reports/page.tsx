
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, PlusCircle, Search, Download, Share2, MoreHorizontal, FileSignature, Filter, BarChart3, Columns, Eye, Send, ArrowLeft, X, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, BarChart, LineChart, PieChart, Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// --- MOCK DATA ---

const mockReports = [
    { id: 'rep-001', name: 'Q2 Sales Summary', type: 'Sales', createdBy: 'Admin User', date: '2024-07-15', status: 'Completed' },
    { id: 'rep-002', name: 'Weekly Lead Performance', type: 'Leads', createdBy: 'S. Manager', date: '2024-07-22', status: 'Scheduled' },
    { id: 'rep-003', name: 'Riyadh Branch Analytics', type: 'Branches', createdBy: 'Admin User', date: '2024-07-20', status: 'Completed' },
    { id: 'rep-004', name: 'Monthly Product Insights', type: 'Products', createdBy: 'Admin User', date: '2024-08-01', status: 'Scheduled' },
];

const mockFilterData = {
    branches: [{id: 'b1', label: 'Riyadh Main'}, {id: 'b2', label: 'Jeddah Corniche'}, {id: 'b3', label: 'Dammam Warehouse'}],
    reps: [{id: 'r1', label: 'S. Manager'}, {id: 'r2', label: 'F. Rep'}, {id: 'r3', label: 'S. Rep'}],
    productCategories: [{id: 'pc1', label: 'Furniture'}, {id: 'pc2', label: 'Electronics'}, {id: 'pc3', label: 'Services'}],
    leadSources: [{id: 'ls1', label: 'Website'}, {id: 'ls2', label: 'Referral'}, {id: 'ls3', label: 'Exhibition'}],
    currencies: ['SAR', 'USD', 'AED', 'EUR', 'EGP']
};

const mockSalesData = [
  { date: '2024-07-01', revenue: 4000, rep: 'S. Rep', branch: 'Riyadh Main', category: 'Furniture' },
  { date: '2024-07-02', revenue: 3000, rep: 'F. Rep', branch: 'Jeddah Corniche', category: 'Services' },
  { date: '2024-07-03', revenue: 5000, rep: 'S. Rep', branch: 'Riyadh Main', category: 'Electronics' },
  { date: '2024-07-04', revenue: 2780, rep: 'S. Manager', branch: 'Dammam Warehouse', category: 'Furniture' },
  { date: '2024-07-05', revenue: 1890, rep: 'S. Rep', branch: 'Jeddah Corniche', category: 'Services' },
];

// --- REPORT BUILDER COMPONENTS ---

type ReportConfig = {
    name: string;
    type: string;
    isShared: boolean;
    dateRange: DateRange | undefined;
    filters: Record<string, string[]>;
    visualization: string;
    columns: string[];
    groupBy: string;
    sortBy: string;
    exportFormat: string;
    schedule: string;
    recipients: string;
};

const initialReportConfig: ReportConfig = {
    name: '',
    type: 'Sales Summary',
    isShared: false,
    dateRange: { from: addDays(new Date(), -7), to: new Date() },
    filters: {},
    visualization: 'Table',
    columns: ['Date', 'Revenue', 'Rep', 'Branch'],
    groupBy: 'None',
    sortBy: 'Date',
    exportFormat: 'PDF',
    schedule: 'One-time',
    recipients: '',
};

const reportTypes = ['Sales Summary', 'Product Performance', 'Lead Conversion', 'Employee Activity', 'Branch Comparison', 'AI Insights Summary'];
const visualizations = ['Table', 'Line Chart', 'Bar Chart', 'Pie Chart', 'KPI Blocks'];
const availableColumns: Record<string, string[]> = {
    'Sales Summary': ['Date', 'Revenue', 'Rep', 'Branch', 'Product Category'],
    'Product Performance': ['Product', 'SKU', 'Category', 'Sales Count', 'Total Revenue'],
    'Lead Conversion': ['Source', 'Total Leads', 'Converted Leads', 'Conversion Rate'],
};

const MultiSelectPopover = ({ title, options, selected, onSelectionChange }: { title: string; options: {id: string, label: string}[], selected: string[]; onSelectionChange: (selected: string[]) => void; }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                    <PlusCircle /> {title} ({selected.length} selected)
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <div key={option.id} className="flex items-center gap-2">
                            <Checkbox 
                                id={option.id}
                                checked={selected.includes(option.id)} 
                                onCheckedChange={(checked) => {
                                    const newSelection = checked 
                                        ? [...selected, option.id] 
                                        : selected.filter(id => id !== option.id);
                                    onSelectionChange(newSelection);
                                }}
                            />
                            <Label htmlFor={option.id}>{option.label}</Label>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

const ReportBuilder = ({ onSave, onCancel }: { onSave: (config: ReportConfig) => void; onCancel: () => void; }) => {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState(1);
    const [config, setConfig] = React.useState<ReportConfig>(initialReportConfig);
    const totalSteps = 6;

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const handleSave = () => {
        onSave(config);
        toast({ title: "Report Saved!", description: `"${config.name}" has been successfully saved.` });
    };

    const updateConfig = <K extends keyof ReportConfig>(key: K, value: ReportConfig[K]) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };
    
    const updateFilter = (key: string, value: string[]) => {
        setConfig(prev => ({ ...prev, filters: { ...prev.filters, [key]: value } }));
    };

    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Report Builder</CardTitle>
                    <CardDescription>Create a new custom report step-by-step.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
                    <p className="text-center text-sm text-muted-foreground mt-2">Step {currentStep} of {totalSteps}</p>
                </div>
                
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><FileSignature/> Report Setup</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="report-name">Report Name</Label>
                            <Input id="report-name" value={config.name} onChange={e => updateConfig('name', e.target.value)} placeholder="e.g., Q3 Sales Performance"/>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="report-type">Report Type</Label>
                            <Select value={config.type} onValueChange={v => updateConfig('type', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {reportTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="shared-report" checked={config.isShared} onCheckedChange={c => updateConfig('isShared', c)}/>
                            <Label htmlFor="shared-report">Make this a shared report</Label>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Filter/> Filters & Scope</h3>
                        <DatePickerWithRange date={config.dateRange} setDate={d => updateConfig('dateRange', d)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MultiSelectPopover title="Branches" options={mockFilterData.branches} selected={config.filters.branches || []} onSelectionChange={ids => updateFilter('branches', ids)} />
                            <MultiSelectPopover title="Sales Reps" options={mockFilterData.reps} selected={config.filters.reps || []} onSelectionChange={ids => updateFilter('reps', ids)} />
                            <MultiSelectPopover title="Product Categories" options={mockFilterData.productCategories} selected={config.filters.productCategories || []} onSelectionChange={ids => updateFilter('productCategories', ids)} />
                            <MultiSelectPopover title="Lead Sources" options={mockFilterData.leadSources} selected={config.filters.leadSources || []} onSelectionChange={ids => updateFilter('leadSources', ids)} />
                        </div>
                    </div>
                )}
                
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><BarChart3/> Visualization</h3>
                        <Select value={config.visualization} onValueChange={v => updateConfig('visualization', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {visualizations.map(vis => <SelectItem key={vis} value={vis}>{vis}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Columns/> Columns & Layout</h3>
                        <div className="grid gap-2">
                           <Label>Select Columns</Label>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-md">
                                {(availableColumns[config.type] || []).map(col => (
                                    <div key={col} className="flex items-center gap-2">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <Checkbox 
                                            id={`col-${col}`} 
                                            checked={config.columns.includes(col)}
                                            onCheckedChange={checked => {
                                                const newCols = checked ? [...config.columns, col] : config.columns.filter(c => c !== col);
                                                updateConfig('columns', newCols);
                                            }}
                                        />
                                        <Label htmlFor={`col-${col}`}>{col}</Label>
                                    </div>
                                ))}
                           </div>
                        </div>
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="space-y-4">
                         <h3 className="font-semibold text-lg flex items-center gap-2"><Eye/> Live Preview</h3>
                         <div className="p-4 border rounded-md min-h-[300px]">
                            {config.visualization === 'Table' && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>{config.columns.map(c => <TableHead key={c}>{c}</TableHead>)}</TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockSalesData.slice(0, 3).map((row, i) => (
                                            <TableRow key={i}>
                                                {config.columns.map(col => <TableCell key={col}>{row[col.toLowerCase().replace(' ', '') as keyof typeof row] || `Sample ${col}`}</TableCell>)}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                             {(config.visualization === 'Bar Chart' || config.visualization === 'Line Chart') && (
                                <ResponsiveContainer width="100%" height={300}>
                                    {config.visualization === 'Bar Chart' ? (
                                        <BarChart data={mockSalesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tickFormatter={d => format(new Date(d), 'MMM d')} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                                        </BarChart>
                                    ) : (
                                        <LineChart data={mockSalesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tickFormatter={d => format(new Date(d), 'MMM d')} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                             )}
                             {config.visualization === 'Pie Chart' && (
                                 <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={mockSalesData} dataKey="revenue" nameKey="branch" cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--primary))" label>
                                            {mockSalesData.map((entry, index) => <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                             )}
                         </div>
                    </div>
                )}

                {currentStep === 6 && (
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Send/> Export & Automate</h3>
                         <div className="grid gap-2">
                            <Label htmlFor="export-format">Export Format</Label>
                            <Select value={config.exportFormat} onValueChange={v => updateConfig('exportFormat', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PDF">PDF</SelectItem>
                                    <SelectItem value="Excel">Excel (XLSX)</SelectItem>
                                    <SelectItem value="CSV">CSV</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="schedule">Schedule Delivery</Label>
                             <Select value={config.schedule} onValueChange={v => updateConfig('schedule', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="One-time">One-time</SelectItem>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="recipients">Email Recipients</Label>
                            <Input id="recipients" value={config.recipients} onChange={e => updateConfig('recipients', e.target.value)} placeholder="e.g., manager@example.com, ceo@example.com"/>
                        </div>
                    </div>
                )}

            </CardContent>
            <CardFooter className="flex justify-between">
                <div>
                     {currentStep > 1 && <Button variant="outline" onClick={handleBack} className="gap-2"><ArrowLeft className="rtl:rotate-180"/>Back</Button>}
                </div>
                <div>
                    {currentStep < totalSteps ? (
                        <Button onClick={handleNext}>Next</Button>
                    ) : (
                        <Button onClick={handleSave}>Save Report</Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}


export default function ReportsPage() {
    const [isBuilderOpen, setIsBuilderOpen] = React.useState(false);
    const [reports, setReports] = React.useState(mockReports);

    const handleSaveReport = (config: ReportConfig) => {
        const newReport = {
            id: `rep-${Date.now()}`,
            name: config.name,
            type: config.type,
            createdBy: 'Current User',
            date: new Date().toISOString().split('T')[0],
            status: config.schedule === 'One-time' ? 'Completed' : 'Scheduled',
        };
        setReports(prev => [newReport, ...prev]);
        setIsBuilderOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground">Create, manage, and schedule all your business reports.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search reports..." className="ps-8 w-full md:w-64" />
                    </div>
                    <Button onClick={() => setIsBuilderOpen(true)} className="gap-2"><PlusCircle /> New Report</Button>
                </div>
            </div>

            {isBuilderOpen && <ReportBuilder onSave={handleSaveReport} onCancel={() => setIsBuilderOpen(false)} />}

            <Card>
                <CardHeader>
                    <CardTitle>Reports Dashboard</CardTitle>
                    <CardDescription>
                        A list of all generated and scheduled reports.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Created By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-end">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">{report.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{report.type}</Badge>
                                    </TableCell>
                                    <TableCell>{report.createdBy}</TableCell>
                                    <TableCell>{report.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={report.status === 'Completed' ? 'default' : 'secondary'}>
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2"><Download /> Download</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2"><Share2 /> Share</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}
