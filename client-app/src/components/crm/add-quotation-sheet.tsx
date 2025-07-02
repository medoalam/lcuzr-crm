
import * as React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger, SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, User, PlusCircle, Trash2, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const quotationItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  discount: z.number().min(0).max(100).optional().default(0),
});

const quotationFormSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  clientEmail: z.string().email().optional().or(z.literal('')),
  currency: z.string().nonempty("Currency is required"),
  applyVat: z.boolean().default(false),
  expiryDate: z.date(),
  terms: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, "At least one item is required"),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

export function AddQuotationSheet({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const { toast } = useToast();
    const form = useForm<QuotationFormValues>({
        resolver: zodResolver(quotationFormSchema),
        defaultValues: {
            clientName: "",
            clientEmail: "",
            currency: "SAR",
            applyVat: true,
            items: [{ productName: "", quantity: 1, price: 0, discount: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const watchedItems = useWatch({ control: form.control, name: "items" });
    const applyVat = useWatch({ control: form.control, name: "applyVat" });

    const totals = React.useMemo(() => {
        const subtotal = watchedItems.reduce((acc, item) => {
            const itemTotal = item.price * item.quantity;
            const discountAmount = itemTotal * (item.discount / 100);
            return acc + (itemTotal - discountAmount);
        }, 0);
        const vatAmount = applyVat ? subtotal * 0.15 : 0;
        const total = subtotal + vatAmount;
        return { subtotal, vatAmount, total };
    }, [watchedItems, applyVat]);


    function onSubmit(data: QuotationFormValues) {
        console.log({ ...data, totals });
        toast({
            title: "Quotation Created!",
            description: `A new quotation for ${data.clientName} has been saved.`,
        });
        form.reset();
        if(onOpenChange) onOpenChange(false);
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Add New Quotation</SheetTitle>
                    <SheetDescription>Create and send a professional quotation.</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6 pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="clientName" render={({ field }) => (
                                <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input placeholder="e.g. Innovate Corp" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="clientEmail" render={({ field }) => (
                                <FormItem><FormLabel>Client Email</FormLabel><FormControl><Input placeholder="contact@innovate.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        
                        <div>
                            <Label>Items</Label>
                            <div className="space-y-4 mt-2">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg">
                                        <FormField control={form.control} name={`items.${index}.productName`} render={({ field }) => (
                                            <FormItem className="col-span-12 md:col-span-4"><FormControl><Input placeholder="Product/Service Name" {...field} /></FormControl><FormMessage/></FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                                            <FormItem className="col-span-4 md:col-span-2"><FormControl><Input type="number" placeholder="Qty" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} /></FormControl><FormMessage/></FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`items.${index}.price`} render={({ field }) => (
                                            <FormItem className="col-span-4 md:col-span-2"><FormControl><Input type="number" placeholder="Price" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage/></FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`items.${index}.discount`} render={({ field }) => (
                                            <FormItem className="col-span-4 md:col-span-2"><FormControl><Input type="number" placeholder="Disc. %" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage/></FormItem>
                                        )}/>
                                        <div className="col-span-12 md:col-span-2 flex items-center justify-end h-10">
                                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ productName: "", quantity: 1, price: 0, discount: 0 })}><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <FormField control={form.control} name="currency" render={({ field }) => (
                                    <FormItem><FormLabel>Currency</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger></FormControl><SelectContent><SelectItem value="SAR">SAR</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="AED">AED</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                    <FormItem><FormLabel>Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                                )}/>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between"><span>Subtotal</span><span>{totals.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center">
                                    <FormField control={form.control} name="applyVat" render={({ field }) => (
                                        <FormItem className="flex items-center gap-2"><Switch id="vat-toggle" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="vat-toggle" className="font-normal">VAT (15%)</Label></FormItem>
                                    )}/>
                                    <span>{totals.vatAmount.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base"><span>Total</span><span>{totals.total.toFixed(2)}</span></div>
                            </div>
                        </div>

                        <FormField control={form.control} name="terms" render={({ field }) => (
                            <FormItem><FormLabel>Terms & Conditions</FormLabel><FormControl><Textarea placeholder="Payment terms, delivery schedule, etc." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>

                        <SheetFooter>
                             <SheetClose asChild><Button type="button" variant="ghost">Cancel</Button></SheetClose>
                             <Button type="submit">Save Quotation</Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
