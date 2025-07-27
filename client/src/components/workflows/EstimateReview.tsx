import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, ArrowLeft, Calculator, TrendingUp, AlertTriangle, FileText } from "lucide-react";

interface EstimateReviewProps {
  requestData: any;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
  onBack: () => void;
}

export default function EstimateReview({ requestData, onApprove, onReject, onBack }: EstimateReviewProps) {
  const [notes, setNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);

  const handleSubmit = () => {
    if (!notes.trim() && selectedAction === 'reject') {
      alert('יש להוסיף הערות לדחיית האומדן');
      return;
    }

    if (selectedAction === 'approve') {
      onApprove(requestData.id, notes);
    } else if (selectedAction === 'reject') {
      onReject(requestData.id, notes);
    }
  };

  const estimationMethods = [
    { name: 'אומדן פרמטרי', accuracy: '92%', selected: true },
    { name: 'הצעות ספקים', accuracy: '96%', selected: true },
    { name: 'מחיר שוק', accuracy: '90%', selected: false }
  ];

  const riskAnalysis = {
    level: 'בינוני',
    factors: [
      'תלות בספק יחיד',
      'שינויי מחירים צפויים',
      'לוחות זמנים דחוקים'
    ]
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-card shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 ml-2" />
                חזרה
              </Button>
              <div className="bg-green-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">בדיקת אומדן לאישור</h1>
                <p className="text-sm text-muted-foreground">דרישה: {requestData.id}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <TrendingUp className="h-4 w-4 ml-2" />
              כלכלן
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* פרטי האומדן */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>פרטי האומדן</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">כותרת</label>
                  <p className="font-medium">{requestData.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">סכום מוערך</label>
                  <p className="text-2xl font-bold text-primary">{requestData.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">הוגש על ידי</label>
                  <p>{requestData.submittedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">תאריך הגשה</label>
                  <p>{requestData.submittedDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">עדיפות</label>
                  <Badge className={requestData.priority === 'גבוה' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                    {requestData.priority}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>שיטות אומדן</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {estimationMethods.map((method, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${method.selected ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}`}>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">דיוק: {method.accuracy}</p>
                    </div>
                    {method.selected && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ניתוח סיכונים */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              ניתוח סיכונים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">רמת סיכון:</span>
              <Badge className={`${riskAnalysis.level === 'גבוה' ? 'bg-red-100 text-red-800' : riskAnalysis.level === 'בינוני' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {riskAnalysis.level}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {riskAnalysis.factors.map((factor, index) => (
                <Alert key={index}>
                  <AlertDescription>
                    {factor}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* פירוט עלויות */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>פירוט עלויות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span>עלות בסיסית</span>
                <span className="font-medium">₪2,100,000</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>מע"מ (17%)</span>
                <span className="font-medium">₪357,000</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>עלויות נוספות</span>
                <span className="font-medium">₪43,000</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold border-t-2">
                <span>סה"כ</span>
                <span className="text-primary">{requestData.amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* החלטת אישור */}
        <Card>
          <CardHeader>
            <CardTitle>החלטת אישור</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">הערות כלכלן</label>
                <Textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="הוסף הערות לגבי האומדן..."
                />
              </div>
              
              <div className="flex justify-center gap-6">
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setSelectedAction('approve');
                    handleSubmit();
                  }}
                >
                  <CheckCircle className="h-5 w-5 ml-2" />
                  אשר אומדן
                </Button>
                <Button 
                  size="lg"
                  variant="destructive"
                  onClick={() => {
                    setSelectedAction('reject');
                    handleSubmit();
                  }}
                >
                  <XCircle className="h-5 w-5 ml-2" />
                  דחה אומדן
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}