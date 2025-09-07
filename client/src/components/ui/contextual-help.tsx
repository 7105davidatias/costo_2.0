
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Lightbulb, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ContextualHelpProps {
  step: 'create' | 'upload' | 'analyze' | 'estimate' | 'research';
  className?: string;
}

const helpContent = {
  create: {
    title: "יצירת דרישת רכש",
    tips: [
      "השתמש בתבניות קיימות לחיסכון בזמן",
      "פרט היטב את הדרישות למיטוב הניתוח",
      "ציין תקציב משוער לחיזוי מדויק יותר"
    ],
    nextStep: "לאחר השמירה, העלה מסמכים רלוונטיים"
  },
  upload: {
    title: "העלאת מסמכים",
    tips: [
      "העלה מפרטים טכניים מפורטים",
      "כלול הצעות מחיר קיימות אם יש",
      "הוסף תרשימים או תמונות רלוונטיות"
    ],
    nextStep: "המערכת תנתח את המסמכים אוטומטית"
  },
  analyze: {
    title: "ניתוח AI",
    tips: [
      "הניתוח זוהה מפרטים ודרישות אוטומטית",
      "בדוק את רמת הביטחון בתוצאות",
      "ערוך מפרטים במידת הצורך"
    ],
    nextStep: "עבור למחקר שוק להשוואת מחירים"
  },
  research: {
    title: "מחקר שוק",
    tips: [
      "השווה ספקים שונים לפי מחיר ואיכות",
      "בחן מגמות מחירים לעיתוי מיטבי",
      "קרא המלצות AI לאופטימיזציה"
    ],
    nextStep: "בחר שיטות אומדן מותאמות"
  },
  estimate: {
    title: "יצירת אומדן",
    tips: [
      "בחר שיטות אומדן מרובות לדיוק גבוה",
      "השווה תוצאות שיטות שונות",
      "שמור את האומדן לאישור"
    ],
    nextStep: "האומדן מוכן לבדיקה ואישור"
  }
};

export function ContextualHelp({ step, className }: ContextualHelpProps) {
  const content = helpContent[step];

  return (
    <Card className={cn("bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Lightbulb className="w-5 h-5" />
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {content.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-blue-800 dark:text-blue-200">{tip}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <ArrowRight className="w-4 h-4" />
            <span className="font-medium">השלב הבא:</span>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{content.nextStep}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProcessGuide({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, name: "יצירת דרישה", status: currentStep >= 1 ? 'completed' : 'pending' },
    { id: 2, name: "העלאת מסמכים", status: currentStep >= 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending' },
    { id: 3, name: "ניתוח AI", status: currentStep >= 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending' },
    { id: 4, name: "מחקר שוק", status: currentStep >= 4 ? 'completed' : currentStep === 4 ? 'current' : 'pending' },
    { id: 5, name: "יצירת אומדן", status: currentStep >= 5 ? 'completed' : currentStep === 5 ? 'current' : 'pending' }
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step.status === 'completed' ? 'bg-success text-white' :
            step.status === 'current' ? 'bg-primary text-white' :
            'bg-muted text-muted-foreground'
          )}>
            {step.status === 'completed' ? '✓' : step.id}
          </div>
          <span className={cn(
            "mr-2 text-sm",
            step.status === 'current' ? 'font-medium text-foreground' : 'text-muted-foreground'
          )}>
            {step.name}
          </span>
          {index < steps.length - 1 && (
            <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}
