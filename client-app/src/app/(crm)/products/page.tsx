
'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { extractProductFromVoice, ProductFromVoiceInput } from '@/ai/flows/product-from-voice-flow';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


import { 
    PlusCircle, Search, LayoutGrid, List, MoreHorizontal, Upload, Sparkles, Tag, DollarSign, 
    BarChart2, Package, Archive, Edit, Trash2, XCircle, FileUp, Globe, Mic, Camera, ScanLine, Zap
} from 'lucide-react';

// --- MOCK DATA ---
const supportedCurrencies = [
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'ج.م' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.' },
];

const formatCurrency = (amount: number | undefined, currency: string) => {
  if (amount === undefined) return 'N/A';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 2 }).format(amount);
  } catch (e) {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

const initialProducts: Product[] = [
  { id: 'prod-001', name: 'Premium Office Chair', sku: 'CHR-001', category: 'Furniture', description: 'Ergonomic office chair with lumbar support.', prices: { 'SAR': 1312.50, 'USD': 350 }, baseCurrency: 'SAR', stock: 150, status: 'Active', tags: ['Bestseller', 'Ergonomic'], imageUrl: 'https://placehold.co/600x400.png', sales: 120, quotes: 350 },
  { id: 'prod-002', name: 'Electric Standing Desk', sku: 'DSK-001', category: 'Furniture', description: 'Motorized standing desk with memory presets.', prices: { 'SAR': 2250, 'USD': 600 }, baseCurrency: 'SAR', stock: 80, status: 'Active', tags: ['New Arrival', 'Bestseller'], imageUrl: 'https://placehold.co/600x400.png', sales: 85, quotes: 280 },
  { id: 'prod-003', name: '4K Webcam', sku: 'CAM-001', category: 'Electronics', description: 'High-definition 4K webcam with auto-focus.', prices: { 'SAR': 450, 'USD': 120 }, baseCurrency: 'SAR', stock: 300, status: 'Active', tags: [], imageUrl: 'https://placehold.co/600x400.png', sales: 450, quotes: 800 },
  { id: 'prod-004', name: 'Wireless Mechanical Keyboard', sku: 'KBD-001', category: 'Electronics', description: 'Compact 75% wireless mechanical keyboard.', prices: { 'SAR': 675, 'USD': 180 }, baseCurrency: 'SAR', stock: 0, status: 'Inactive', tags: ['Low Stock'], imageUrl: 'https://placehold.co/600x400.png', sales: 210, quotes: 450 },
  { id: 'prod-005', name: 'SEO Consulting Package', sku: 'SVC-001', category: 'Services', description: 'Monthly SEO consulting for small businesses.', prices: { 'SAR': 5625, 'USD': 1500 }, baseCurrency: 'SAR', stock: Infinity, status: 'Active', tags: ['Recurring'], imageUrl: 'https://placehold.co/600x400.png', sales: 25, quotes: 120 },
  { id: 'prod-006', name: 'Branding Design Service', sku: 'SVC-002', category: 'Services', description: 'Complete branding package including logo and style guide.', prices: { 'SAR': 9375, 'USD': 2500 }, baseCurrency: 'SAR', stock: Infinity, status: 'Active', tags: ['High Value'], imageUrl: 'https://placehold.co/600x400.png', sales: 15, quotes: 80 },
  { id: 'prod-007', name: 'Noise-Cancelling Headphones', sku: 'HDP-001', category: 'Electronics', description: 'Over-ear headphones with active noise cancellation.', prices: { 'SAR': 937.50, 'USD': 250 }, baseCurrency: 'SAR', stock: 120, status: 'Active', tags: [], imageUrl: 'https://placehold.co/600x400.png', sales: 300, quotes: 600 },
  { id: 'prod-008', name: 'Guest Wi-Fi Setup', sku: 'SVC-003', category: 'Services', description: 'On-site setup and configuration of guest Wi-Fi network.', prices: { 'SAR': 1875, 'USD': 500 }, baseCurrency: 'SAR', stock: Infinity, status: 'Inactive', tags: [], imageUrl: 'https://placehold.co/600x400.png', sales: 5, quotes: 30 },
];
const categories = ['All', 'Furniture', 'Electronics', 'Services'];

// --- SUB-COMPONENTS ---

const ProductsToolbar = ({ onSearch, onFilterChange, viewMode, setViewMode, onAddProduct, canManage }: any) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Products &amp; Services</h1>
      <p className="text-muted-foreground">Manage your entire product and service catalog.</p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 md:flex-none">
        <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or SKU..." className="ps-8 w-full md:w-64" onChange={e => onSearch(e.target.value)} />
      </div>
      <Select onValueChange={value => onFilterChange('category', value === 'All' ? 'all' : value)} defaultValue="all">
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select onValueChange={value => onFilterChange('status', value)} defaultValue="all">
        <SelectTrigger className="w-full md:w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center rounded-md border p-1">
        <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="h-4 w-4" /></Button>
        <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
      </div>
      {canManage && (
        <ItemImportDialog onSave={onAddProduct} trigger={
          <Button><PlusCircle className="me-2 h-4 w-4" /> Add Item</Button>
        }/>
      )}
    </div>
  </div>
);

const ManualEntryTab = ({ formData, setFormData, onSave, setOpen }: { formData: Partial<Product>; setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>; onSave: (product: Product) => void; setOpen: (open: boolean) => void; }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'stock' ? parseFloat(value) : value }));
    };
    
    const handleSelectChange = (name: keyof Product, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (currencyCode: string, value: string) => {
        setFormData(prev => {
            const newPrices = { ...(prev.prices || {}) };
            if (value === '' || isNaN(parseFloat(value))) {
                delete newPrices[currencyCode];
            } else {
                newPrices[currencyCode] = parseFloat(value);
            }
            return { ...prev, prices: newPrices };
        });
    };

    const handleTagChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value) {
            e.preventDefault();
            const newTags = [...(formData.tags || []), e.currentTarget.value.trim()];
            setFormData(prev => ({...prev, tags: newTags}));
            e.currentTarget.value = '';
        }
    }

    const removeTag = (tagToRemove: string) => {
        const newTags = formData.tags?.filter(tag => tag !== tagToRemove);
        setFormData(prev => ({...prev, tags: newTags}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalProduct: Product = {
            id: formData?.id || `prod-${Date.now()}`,
            sales: formData?.sales || 0,
            quotes: formData?.quotes || 0,
            ...formData,
        } as Product;
        onSave(finalProduct);
        setOpen(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sku">SKU / Code</Label>
                    <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" name="stock" type="number" value={formData.stock === Infinity ? '' : formData.stock} onChange={handleChange} placeholder="Unlimited" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Services">Services</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Multi-Currency Pricing</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 p-1">
                                <div className="space-y-2">
                                    <Label htmlFor="baseCurrency">Base Currency</Label>
                                    <Select name="baseCurrency" value={formData.baseCurrency || ''} onValueChange={(value) => handleSelectChange('baseCurrency', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select base currency" /></SelectTrigger>
                                        <SelectContent>
                                            {supportedCurrencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Prices</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {supportedCurrencies.map(currency => (
                                            <div key={currency.code} className="relative flex items-center">
                                                <span className="absolute start-3 text-sm text-muted-foreground">{currency.symbol}</span>
                                                <Input 
                                                    type="number" 
                                                    name={`price-${currency.code}`}
                                                    placeholder={currency.code}
                                                    value={formData.prices?.[currency.code] || ''}
                                                    onChange={(e) => handlePriceChange(currency.code, e.target.value)}
                                                    className="ps-9"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value as 'Active' | 'Inactive')}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap items-center gap-2 rounded-md border p-2 min-h-[40px]">
                    {formData.tags?.map(tag => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ms-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                <XCircle className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                        <Input id="tags" placeholder="Type tag and press Enter..." onKeyDown={handleTagChange} className="flex-grow border-none shadow-none focus-visible:ring-0 h-auto p-0 m-0"/>
                </div>
            </div>
             <DialogFooter className="pt-4 border-t mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
        </form>
    )
}

const CsvImportTab = () => (
    <div className="pt-4 space-y-4 flex flex-col items-center justify-center text-center p-8 border-dashed rounded-lg mt-4">
        <FileUp className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Upload CSV or Excel File</h3>
        <p className="text-muted-foreground">Drag & drop your file here or click to browse.</p>
        <Input type="file" className="w-auto" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        <p className="text-xs text-muted-foreground">You'll be able to map columns and preview data before importing.</p>
        <Button>Upload & Preview</Button>
    </div>
);

const UrlImportTab = () => (
     <div className="pt-4 space-y-4 flex flex-col items-center justify-center text-center p-8 border-dashed rounded-lg mt-4">
        <Globe className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Import from URL</h3>
        <p className="text-muted-foreground">Paste a link to a Google Sheet or a product feed (JSON/XML).</p>
        <Input placeholder="https://docs.google.com/spreadsheets/..." className="w-full max-w-md" />
        <div className="flex items-center gap-4">
             <Select defaultValue="daily">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sync Frequency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
            </Select>
            <Button>Fetch & Preview</Button>
        </div>
    </div>
);

const VoiceEntryTab = ({ onSave, setOpen }: { onSave: (p: Product) => void, setOpen: (o: boolean) => void }) => {
    const [transcript, setTranscript] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const { toast } = useToast();

    const handleProcessVoice = async () => {
        if (!transcript) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a voice transcript first.' });
            return;
        }
        setIsProcessing(true);
        try {
            const result = await extractProductFromVoice(transcript as ProductFromVoiceInput);
            const newProduct: Product = {
                id: `prod-${Date.now()}`,
                name: result.name,
                description: result.description,
                prices: { 'SAR': result.price }, // Default to SAR
                baseCurrency: 'SAR',
                tags: result.tags,
                category: result.category,
                sku: `SKU-${Date.now()}`,
                stock: Infinity,
                status: 'Active',
                imageUrl: 'https://placehold.co/600x400.png',
                sales: 0,
                quotes: 0,
            }
            onSave(newProduct);
            toast({ title: "Product Created!", description: `Successfully created "${newProduct.name}" from voice.`});
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'AI Error', description: 'Could not process the transcript.' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pt-4 space-y-4 flex flex-col items-center justify-center text-center p-8 border-dashed rounded-lg mt-4">
            <Mic className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Add with your Voice</h3>
            <p className="text-muted-foreground">Click the microphone and describe the product or service. The AI will do the rest.</p>
            <Button size="icon" className="w-16 h-16 rounded-full"><Mic className="h-8 w-8" /></Button>
            <Textarea 
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Or type/paste transcript here. e.g., 'Add a new service called premium SEO consulting for 1500 dollars. It's for small businesses and is a recurring monthly service.'" 
                className="w-full max-w-md text-center"
            />
            <Button onClick={handleProcessVoice} disabled={isProcessing || !transcript}>
                {isProcessing ? 'Processing...' : 'Create from Transcript'}
            </Button>
        </div>
    );
};

const BarcodeScanTab = () => {
    const { toast } = useToast();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };
        getCameraPermission();
      }, [toast]);

    return (
        <div className="pt-4 space-y-4 flex flex-col items-center justify-center text-center p-8 border-dashed rounded-lg mt-4">
            <Camera className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Scan Barcode or QR Code</h3>
            <p className="text-muted-foreground">Point a barcode at your camera to quickly add a product.</p>
            <div className="relative w-full max-w-sm aspect-video bg-muted rounded-lg overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
                <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="w-2/3 h-2/3 text-white/50 animate-pulse" />
                </div>
            </div>
            {hasCameraPermission === false && (
                <Alert variant="destructive" className="max-w-sm">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access in your browser to use this feature.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}

const ItemImportDialog = ({ product, onSave, trigger, children }: { product?: Product | null; onSave: (product: Product) => void; trigger?: React.ReactNode; children?: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState<Partial<Product>>(product || { name: '', sku: '', category: '', description: '', prices: {}, baseCurrency: 'SAR', stock: 0, status: 'Active', tags: [], imageUrl: 'https://placehold.co/600x400.png' });

    React.useEffect(() => {
        if(open && product) {
            setFormData(product);
        } else if (open && !product) {
            // Reset for new entry
             setFormData({ name: '', sku: '', category: '', description: '', prices: {}, baseCurrency: 'SAR', stock: 0, status: 'Active', tags: [], imageUrl: 'https://placehold.co/600x400.png' });
        }
    }, [open, product]);

    const isEditing = !!product;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || children}</DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Item' : 'Add Product or Service'}</DialogTitle>
                    <DialogDescription>{isEditing ? 'Update the details of the existing item.' : 'Select a method to add a new item to your catalog.'}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue={isEditing ? 'manual' : 'manual'} className="mt-2">
                    <TabsList className={cn("grid w-full", isEditing ? "grid-cols-1" : "grid-cols-5")}>
                        <TabsTrigger value="manual" className="gap-2"><Edit />Manual</TabsTrigger>
                        {!isEditing && <TabsTrigger value="csv" className="gap-2"><FileUp />CSV/Excel</TabsTrigger>}
                        {!isEditing && <TabsTrigger value="url" className="gap-2"><Globe />From URL</TabsTrigger>}
                        {!isEditing && <TabsTrigger value="voice" className="gap-2"><Mic />Voice AI</TabsTrigger>}
                        {!isEditing && <TabsTrigger value="scan" className="gap-2"><Camera />Scan</TabsTrigger>}
                    </TabsList>
                    <div className="max-h-[60vh] overflow-y-auto p-1 mt-2">
                       <TabsContent value="manual">
                           <ManualEntryTab formData={formData} setFormData={setFormData} onSave={onSave} setOpen={setOpen} />
                       </TabsContent>
                       {!isEditing && (
                           <>
                            <TabsContent value="csv"><CsvImportTab /></TabsContent>
                            <TabsContent value="url"><UrlImportTab /></TabsContent>
                            <TabsContent value="voice"><VoiceEntryTab onSave={onSave} setOpen={setOpen} /></TabsContent>
                            <TabsContent value="scan"><BarcodeScanTab /></TabsContent>
                           </>
                       )}
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

const ProductCard = ({ product, onEdit, canManage }: { product: Product, onEdit: (p: Product) => void, canManage: boolean }) => (
    <Card className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
            <Badge variant={product.status === 'Active' ? 'default' : 'outline'} className="absolute top-2 end-2 z-10">{product.status}</Badge>
            <Image src={product.imageUrl} alt={product.name} width={600} height={400} className="rounded-t-lg object-cover aspect-video" data-ai-hint="product item" />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <h3 className="text-lg font-semibold mt-1 leading-tight">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-grow">{product.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
                {product.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
            </div>
        </CardContent>
        <CardFooter className="p-4 border-t flex flex-col items-start space-y-3">
            <div className="flex justify-between w-full font-semibold">
                <span>Price</span>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="text-lg text-primary">
                                {formatCurrency(product.prices[product.baseCurrency], product.baseCurrency)}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="flex flex-col gap-1">
                                {Object.entries(product.prices)
                                    .filter(([currencyCode]) => currencyCode !== product.baseCurrency)
                                    .map(([currencyCode, amount]) => (
                                        <p key={currencyCode} className="text-sm">
                                            {formatCurrency(amount, currencyCode)}
                                        </p>
                                    ))
                                }
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex justify-between w-full text-sm text-muted-foreground">
                <span>Stock</span>
                <span>{product.stock === Infinity ? 'Unlimited' : `${product.stock} units`}</span>
            </div>
            {canManage && (
                <div className="w-full pt-2">
                    <ItemImportDialog product={product} onSave={onEdit} trigger={
                        <Button className="w-full" variant="outline"><Edit className="me-2 h-4 w-4"/>Edit</Button>
                    }/>
                </div>
            )}
        </CardFooter>
    </Card>
);

const ProductListItem = ({ product, onEdit, onDelete, canManage }: { product: Product, onEdit: (p: Product) => void, onDelete: (id: string) => void, canManage: boolean }) => (
    <TableRow>
        <TableCell>
            <div className="flex items-center gap-4">
                <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded object-cover" data-ai-hint="product item"/>
                <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                </div>
            </div>
        </TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell>
            <Badge variant={product.status === 'Active' ? 'default' : 'outline'}>{product.status}</Badge>
        </TableCell>
        <TableCell>{product.stock === Infinity ? 'N/A' : product.stock}</TableCell>
        <TableCell className="font-medium text-end">{formatCurrency(product.prices[product.baseCurrency], product.baseCurrency)}</TableCell>
        <TableCell className="text-end">{product.sales}</TableCell>
        {canManage && (
        <TableCell className="text-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ItemImportDialog product={product} onSave={onEdit}>
                        <DropdownMenuItem onSelect={e => e.preventDefault()} className="gap-2"><Edit/>Edit</DropdownMenuItem>
                    </ItemImportDialog>
                    <DropdownMenuItem className="gap-2"><Archive />Archive</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500 gap-2" onClick={() => onDelete(product.id)}><Trash2/>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
        )}
    </TableRow>
);


// --- MAIN PAGE COMPONENT ---
export default function ProductsPage() {
    const { user } = useUser();
    const [products, setProducts] = React.useState<Product[]>(initialProducts);
    const [filteredProducts, setFilteredProducts] = React.useState<Product[]>(initialProducts);
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filters, setFilters] = React.useState({ category: 'all', status: 'all' });

    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    React.useEffect(() => {
        let results = products;
        if (searchTerm) {
            results = results.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filters.status !== 'all') {
            results = results.filter(p => p.status.toLowerCase() === filters.status);
        }
        if (filters.category !== 'all') {
            results = results.filter(p => p.category.toLowerCase() === filters.category);
        }
        setFilteredProducts(results);
    }, [searchTerm, filters, products]);

    const handleSaveProduct = (productToSave: Product) => {
        setProducts(prev => {
            const exists = prev.find(p => p.id === productToSave.id);
            if (exists) {
                return prev.map(p => p.id === productToSave.id ? productToSave : p);
            }
            return [productToSave, ...prev];
        });
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    }
    
    if (!user) return null;
    const canManage = user.role === 'Admin' || user.role === 'Sales Manager';

    return (
        <div className="flex flex-col h-full">
            <ProductsToolbar
                onSearch={setSearchTerm}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onAddProduct={handleSaveProduct}
                canManage={canManage}
            />
            {filteredProducts.length === 0 ? (
                 <div className="flex flex-col items-center justify-center text-center p-8 border-dashed rounded-lg mt-8">
                    <Package className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Products Found</h3>
                    <p className="mt-1 text-muted-foreground">Try adjusting your search or filters.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="flex-grow grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onEdit={handleSaveProduct} canManage={canManage} />
                    ))}
                </div>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-end">Price</TableHead>
                                <TableHead className="text-end">Sales</TableHead>
                                {canManage && <TableHead className="w-[5%] text-end">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map(product => (
                                <ProductListItem key={product.id} product={product} onEdit={handleSaveProduct} onDelete={handleDeleteProduct} canManage={canManage} />
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
