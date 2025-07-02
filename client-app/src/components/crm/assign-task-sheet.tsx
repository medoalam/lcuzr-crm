
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Link, Bell, Repeat, Paperclip, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

const taskTypes = ['Follow-up', 'Call', 'Meeting', 'Delivery', 'Quotation Prep'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];
const relatedEntities = [{id: 'lead-1', name: 'Lead: Alice Johnson'}, {id: 'quote-1', name: 'Quote: Innovate Corp'}];
const assignedUsers = [{id: 'user-1', name: 'S. Rep'}, {id: 'user-2', name: 'F. Rep'}, {id: 'user-3', name: 'S. Manager'}];

const taskFormSchema = z.object({
  taskTitle: z.string().min(3, "Title must be at least 3 characters."),
  taskType: z.string().nonempty("Please select a task type."),
  relatedTo: z.string().optional(),
  priority: z.string().nonempty("Please select a priority level."),
  dueDate: z.date(),
  assignTo: z.string().nonempty("Please assign the task."),
  recurrence: z.string().default('none'),
  notes: z.string().optional(),
  attachment: z.any().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export function AssignTaskSheet({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const { toast } = useToast();
    const { user } = useUser();

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            taskTitle: "",
            assignTo: "",
            priority: "Medium",
            recurrence: "none",
        },
    });

    const assignToMe = () => {
        if (user) {
            const currentUser = assignedUsers.find(u => u.name === user.name);
            if(currentUser) form.setValue('assignTo', currentUser.id);
        }
    };

    function onSubmit(data: TaskFormValues) {
        console.log(data);
        toast({
            title: "Task Assigned!",
            description: `"${data.taskTitle}" has been assigned.`,
        });
        form.reset();
        if(onOpenChange) onOpenChange(false);
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Assign New Task</SheetTitle>
                    <SheetDescription>Organize your team's workload by assigning a new task.</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6 pr-2">
                        <FormField control={form.control} name="taskTitle" render={({ field }) => (
                            <FormItem><FormLabel>Task Title</FormLabel><FormControl><Input placeholder="e.g. Follow up call with Innovate Corp" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField control={form.control} name="taskType" render={({ field }) => (
                                <FormItem><FormLabel>Task Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent>{taskTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="relatedTo" render={({ field }) => (
                                <FormItem><FormLabel>Related To (Lead, Quote)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Link to an entity" /></SelectTrigger></FormControl><SelectContent>{relatedEntities.map(entity => <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="priority" render={({ field }) => (
                                <FormItem><FormLabel>Priority</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl><SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="dueDate" render={({ field }) => (
                                <FormItem><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="assignTo" render={({ field }) => (
                            <FormItem><FormLabel>Assign To</FormLabel><div className="flex items-center gap-2"><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a team member" /></SelectTrigger></FormControl><SelectContent>{assignedUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select><Button type="button" variant="outline" size="sm" onClick={assignToMe}><UserCheck className="mr-2 h-4 w-4" />Me</Button></div><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="recurrence" render={({ field }) => (
                            <FormItem><FormLabel>Recurrence</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Set recurrence" /></SelectTrigger></FormControl><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem><FormLabel>Internal Notes</FormLabel><FormControl><Textarea placeholder="Add details or instructions for the task..." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="attachment" render={({ field }) => (
                            <FormItem><FormLabel>Attachment</FormLabel><FormControl><Input type="file" {...form.register('attachment')} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <SheetFooter>
                             <SheetClose asChild><Button type="button" variant="ghost">Cancel</Button></SheetClose>
                             <Button type="submit">Assign Task</Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
