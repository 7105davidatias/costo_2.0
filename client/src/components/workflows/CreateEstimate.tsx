import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Save, Send, Calculator, Search, Brain, CheckCircle, Clock } from "lucide-react";

interface EstimateData {
  requestId: string;
  title: string;
  description: string;
  estimatedValue: string;
  selectedMethods: string[];
  aiAnalysisCompleted: boolean;
  marketResearchCompleted: boolean;
  notes: string;
  assumptions: string;
  riskFactors: string;
  aiAnalysisData?: any;
  marketResearchData?: any;
}

interface EstimationMethod {
  id: string;
  name: string;
  suitable: boolean;
  accuracy: string;
  description: string;
}

interface CreateEstimateProps {
  requestData: any;
  onSave?: (data: EstimateData) => void;
  onSubmit?: (data: any) => void;
  onCancel: () => void;
  setCurrentView: (view: string) => void;
}

export default function CreateEstimate({ requestData, onSave, onSubmit, onCancel, setCurrentView }: CreateEstimateProps) {
  const [estimateData, setEstimateData] = useState<EstimateData>({
    requestId: requestData?.id || '',
    title: requestData?.title || '',
    description: requestData?.description || '',
    estimatedValue: requestData?.estimatedValue || '',
    selectedMethods: [],
    aiAnalysisCompleted: false,
    marketResearchCompleted: false,
    notes: '',
    assumptions: '',
    riskFactors: ''
  });

  const [availableMethods, setAvailableMethods] = useState<EstimationMethod[]>([
    { id: 'parametric', name: 'אומדן פרמטרי', suitable: true, accuracy: '92%', description: 'על בסיס פרמטרים סטטיסטיים' },
    { id: 'analogous', name: 'אומדן אנלוגי', suitable: true, accuracy: '88%', description: 'השוואה לפרויקטים דומים' },
    { id: 'bottom_up', name: 'אומדן מלמטה למעלה', suitable: false, accuracy: '95%', description: 'פירוט מפורט של כל רכיב' },
    { id: 'three_point', name: 'אומדן שלוש נקודות', suitable: true, accuracy: '85%', description: 'אומדן אופטימי, פסימי וריאליסטי' },
    { id: 'expert_judgment', name: 'שיקול דעת מומחה', suitable: true, accuracy: '80%', description: 'על בסיס ניסיון מומחים' },
    { id: 'vendor_quotes', name: 'הצעות ספקים', suitable: true, accuracy: '96%', description: 'מחירים ממשיים מספקים' },
    { id: 'market_price', name: 'מחיר שוק', suitable: true, accuracy: '90%', description: 'מחירי שוק נוכחיים' },
    { id: 'historical_data', name: 'נתונים היסטוריים', suitable: false, accuracy: '87%', description: 'על בסיס רכישות קודמות' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleMethodToggle = (methodId: string) => {
    setEstimateData(prev => ({
      ...prev,
      selectedMethods: prev.selectedMethods.includes(methodId)
        ? prev.selectedMethods.filter(id => id !== methodId)
        : [...prev.selectedMethods, methodId]
    }));
  };

  const handleAIAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          requestId: estimateData.requestId,
          title: estimateData.title,
          description: estimateData.description
        })
      });

      if (response.ok) {
        const analysisResult = await response.json();
        setEstimateData(prev => ({
          ...prev,
          aiAnalysisCompleted: true,
          aiAnalysisData: analysisResult
        }));
      }
    } catch (error) {
      console.error('שגיאה בניתוח AI:', error);
      alert('שגיאה בביצוע ניתוח AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketResearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/market-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          requestId: estimateData.requestId,
          title: estimateData.title,
          description: estimateData.description,
          category: requestData.category
        })
      });

      if (response.ok) {
        const researchResult = await response.json();
        setEstimateData(prev => ({
          ...prev,
          marketResearchCompleted: true,
          marketResearchData: researchResult
        }));
      }
    } catch (error) {
      console.error('שגיאה במחקר שוק:', error);
      alert('שגיאה בביצוע מחקר שוק');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/estimates/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...estimateData,
          status: 'draft',
          lastModified: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('הטיוטה נשמרה בהצלחה');
        onSave && onSave(estimateData);
      }
    } catch (error) {
      console.error('שגיאה בשמירת טיוטה:', error);
      alert('שגיאה בשמירת הטיוטה');
    }
  };

  const handleSubmitForApproval = async () => {
    if (estimateData.selectedMethods.length === 0) {
      alert('יש לבחור לפחות שיטת אומדן אחת');
      return;
    }

    if (!estimateData.aiAnalysisCompleted) {
      alert('יש לבצע ניתוח AI לפני הגשה לאישור');
      return;
    }

    try {
      const response = await fetch('/api/estimates/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...estimateData,
          status: 'pending_approval',
          submittedAt: new Date().toISOString(),
          submittedBy: JSON.parse(localStorage.getItem('user') || '{}').id
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('האומדן הוגש לאישור הכלכלן בהצלחה');
        onSubmit && onSubmit(result);
        setCurrentView('procurement_dashboard');
      }
    } catch (error) {
      console.error('שגיאה בהגשת אומדן:', error);
      alert('שגיאה בהגשת האומדן לאישור');
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-card shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">יצירת אומדן חדש</h1>
                <p className="text-sm text-muted-foreground">דרישה: {estimateData.requestId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onCancel}>
                ביטול
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 ml-2" />
                שמור טיוטה
              </Button>
              <Button 
                size="sm" 
                onClick={handleSubmitForApproval}
                disabled={estimateData.selectedMethods.length === 0 || !estimateData.aiAnalysisCompleted}
              >
                <Send className="h-4 w-4 ml-2" />
                הגש לאישור
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* פרטי הדרישה */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>פרטי דרישת הרכש</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">מספר דרישה</label>
                <Input value={estimateData.requestId} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ערך מוערך</label>
                <Input value={estimateData.estimatedValue} disabled />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">כותרת</label>
                <Input 
                  value={estimateData.title} 
                  onChange={(e) => setEstimateData(prev => ({...prev, title: e.target.value}))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">תיאור</label>
                <Textarea 
                  value={estimateData.description}
                  onChange={(e) => setEstimateData(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* כלי ניתוח */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                ניתוח AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {estimateData.aiAnalysisCompleted ? (
                  <div className="text-green-600">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                    <p className="font-medium">ניתוח AI הושלם</p>
                    <p className="text-sm text-muted-foreground">דיוק צפוי: 92%</p>
                  </div>
                ) : (
                  <div>
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-4">לא בוצע ניתוח AI</p>
                    <Button onClick={handleAIAnalysis} disabled={isLoading}>
                      {isLoading ? 'מבצע ניתוח...' : 'בצע ניתוח AI'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                מחקר שוק
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {estimateData.marketResearchCompleted ? (
                  <div className="text-green-600">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                    <p className="font-medium">מחקר שוק הושלם</p>
                    <p className="text-sm text-muted-foreground">3 ספקים נמצאו</p>
                  </div>
                ) : (
                  <div>
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-4">לא בוצע מחקר שוק</p>
                    <Button onClick={handleMarketResearch} disabled={isLoading}>
                      {isLoading ? 'מבצע מחקר...' : 'בצע מחקר שוק'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* שיטות אומדן */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>בחירת שיטות אומדן</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    estimateData.selectedMethods.includes(method.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  } ${!method.suitable ? 'opacity-50' : ''}`}
                  onClick={() => method.suitable && handleMethodToggle(method.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={estimateData.selectedMethods.includes(method.id)}
                      disabled={!method.suitable}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{method.name}</h4>
                        <Badge variant={method.suitable ? "default" : "secondary"}>
                          {method.accuracy}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      {!method.suitable && (
                        <p className="text-xs text-orange-600 mt-1">לא מתאים לדרישה זו</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* הערות נוספות */}
        <Card>
          <CardHeader>
            <CardTitle>הערות והנחות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">הערות</label>
                <Textarea 
                  value={estimateData.notes}
                  onChange={(e) => setEstimateData(prev => ({...prev, notes: e.target.value}))}
                  rows={4}
                  placeholder="הערות כלליות..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">הנחות</label>
                <Textarea 
                  value={estimateData.assumptions}
                  onChange={(e) => setEstimateData(prev => ({...prev, assumptions: e.target.value}))}
                  rows={4}
                  placeholder="הנחות בסיסיות..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">גורמי סיכון</label>
                <Textarea 
                  value={estimateData.riskFactors}
                  onChange={(e) => setEstimateData(prev => ({...prev, riskFactors: e.target.value}))}
                  rows={4}
                  placeholder="סיכונים זוהו..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}