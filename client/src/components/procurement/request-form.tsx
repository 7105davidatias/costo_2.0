import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { insertProcurementRequestSchema } from '@shared/schema';
import { z } from 'zod';
import { ShoppingCart, Save, X } from 'lucide-react';

const formSchema = insertProcurementRequestSchema.extend({
  targetDate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RequestForm({ onSuccess, onCancel }: RequestFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestNumber: `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      itemName: '',
      description: '',
      category: '',
      quantity: 1,
      priority: 'medium',
      targetDate: '',
      requestedBy: '',
      department: '',
      status: 'new',
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate).toISOString() : undefined,
        userId: 1, // Mock user ID
      };
      
      const response = await fetch('/api/procurement-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create request');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "בקשת רכש נוצרה בהצלחה",
        description: `בקשה ${data.requestNumber} נוצרה ונשלחה לעיבוד`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["procurement-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard/stats"] });
      
      onSuccess?.();
      setLocation(`/procurement-request/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "שגיאה ביצירת בקשת רכש",
        description: "נסה שוב או פנה לתמיכה טכנית",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createRequestMutation.mutate(data);
  };

  const categories = [
    "חומרה - מחשבים",
    "חומרה - שרתים",
    "חומרה - רשת",
    "תוכנה - מערכות הפעלה",
    "תוכנה - יישומים",
    "ריהוט משרדי",
    "ציוד משרדי",
    "שירותים מקצועיים",
  ];

  const departments = [
    "IT",
    "משאבי אנוש",
    "כספים",
    "שיווק",
    "מכירות",
    "תפעול",
    "מחקר ופיתוח",
    "רכש",
  ];

  const priorities = [
    { value: 'low', label: 'נמוכה', color: 'bg-success/20 text-success' },
    { value: 'medium', label: 'בינונית', color: 'bg-warning/20 text-warning' },
    { value: 'high', label: 'גבוהה', color: 'bg-destructive/20 text-destructive' },
  ];

  return (
    <Card className="bg-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-reverse space-x-2">
          <ShoppingCart className="text-primary w-5 h-5" />
          <span>בקשת רכש חדשה</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Number */}
              <FormField
                control={form.control}
                name="requestNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מספר בקשה</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted/20" />
                    </FormControl>
                    <FormDescription>
                      מספר הבקשה יוצר אוטומטית
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Item Name */}
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם הפריט *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="הזן שם פריט או שירות" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>קטגוריה *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר קטגוריה" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כמות *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>עדיפות</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר עדיפות" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Badge className={priority.color} variant="outline">
                                {priority.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Date */}
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תאריך יעד</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      תאריך רצוי לקבלת הפריט
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requested By */}
              <FormField
                control={form.control}
                name="requestedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מבקש *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="שם המבקש" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מחלקה *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר מחלקה" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תיאור</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="תיאור מפורט של הפריט או השירות הנדרש"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    תיאור מפורט יעזור לקבל הערכת מחיר מדויקת יותר
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-reverse space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                <X className="w-4 h-4 ml-2" />
                ביטול
              </Button>
              <Button
                type="submit"
                disabled={createRequestMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="w-4 h-4 ml-2" />
                {createRequestMutation.isPending ? 'שומר...' : 'שמור בקשה'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
