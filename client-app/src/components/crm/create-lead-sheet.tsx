
import * as React from "react";
import { useForm } from "react-hook-form";
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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, User, Phone, Mail, Building, Tag, Users, DollarSign, Paperclip, Clock, Sparkles, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const leadSources = ['Google Ads', 'Instagram', 'Referral', 'LinkedIn', 'Walk-in', 'Event'];
const assignedUsers = [{id: 'user-1', name: 'S. Rep'}, {id: 'user-2', name: 'F. Rep'}, {id: 'user-3', name: 'S. Manager'}];

const leadFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  leadSource: z.string().nonempty({ message: "Please select a lead source." }),
  tags: z.array(z.string()).optional(),
  assignedTo: z.string().nonempty({ message: "Please assign this lead." }),
  expectedBudget: z.array(z.number()).default([5000]),
  notes: z.string().optional(),
  followUpDate: z.date().optional(),
  attachment: z.any().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

export function CreateLeadSheet({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const { toast } = useToast();
    const [tags, setTags] = React.useState<string[]>([]);
    const [tagInput, setTagInput] = React.useState('');

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: { fullName: "", phone: "", email: "", assignedTo: "", expectedBudget: [5000] },
    });

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
                form.setValue('tags', [...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        form.setValue('tags', newTags);
    };

    function onSubmit(data: LeadFormValues) {
        // In a real app, you'd send this to your backend.
        console.log({ ...data, tags });
        toast({
            title: "Lead Created!",
            description: `${data.fullName} has been added to your leads.`,
        });
        form.reset();
        setTags([]);
        if(onOpenChange) onOpenChange(false);
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Create New Lead</SheetTitle>
                    <SheetDescription>Fill out the form to add a new lead to the pipeline. Click save when you're done.</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6 pr-2">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g. Ali Ahmed" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+966 50 123 4567" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email (Optional)</FormLabel><FormControl><Input placeholder="a.ahmed@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="leadSource" render={({ field }) => (
                            <FormItem><FormLabel>Lead Source</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a source" /></SelectTrigger></FormControl><SelectContent>{leadSources.map(source => <SelectItem key={source} value={source}>{source}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="assignedTo" render={({ field }) => (
                            <FormItem><FormLabel>Assign To</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a team member" /></SelectTrigger></FormControl><SelectContent>{assignedUsers.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <div className="flex flex-wrap items-center gap-2 rounded-md border p-2 min-h-[40px]">
                                {tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag} <button type="button" onClick={() => removeTag(tag)} className="ml-1"><XCircle className="h-3 w-3" /></button></Badge>
                                ))}
                                <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Add tags (VIP, Hot...)" className="flex-grow border-none shadow-none focus-visible:ring-0 h-auto p-0 m-0"/>
                            </div>
                        </FormItem>
                        <FormField control={form.control} name="expectedBudget" render={({ field }) => (
                            <FormItem><FormLabel>Expected Budget: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(field.value[0])}</FormLabel><FormControl><Slider onValueChange={field.onChange} defaultValue={field.value} max={50000} step={1000} /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea placeholder="Client requirements, first contact details, etc." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="followUpDate" render={({ field }) => (
                            <FormItem><FormLabel>Follow-up Reminder</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="attachment" render={({ field }) => (
                            <FormItem><FormLabel>Attach File</FormLabel><FormControl><Input type="file" {...form.register('attachment')} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary"/>
                                <span className="font-semibold">AI Lead Score</span>
                            </div>
                            <span className="text-xl font-bold text-green-500">82 (Hot)</span>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild><Button type="button" variant="ghost">Cancel</Button></SheetClose>
                            <Button type="submit">Save Lead</Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
