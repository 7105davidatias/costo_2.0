
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

function SQLRunner() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "שגיאה",
        description: "נא להכניס שאילתת SQL",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/sql-runner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'שגיאה בביצוע השאילתה');
      }

      setResults(data);
      toast({
        title: "הצלחה",
        description: "השאילתה בוצעה בהצלחה",
      });
    } catch (error) {
      console.error('SQL execution error:', error);
      toast({
        title: "שגיאה",
        description: error instanceof Error ? error.message : "שגיאה בביצוע השאילתה",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setQuery('');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SQL Runner - כלי פיתוח</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearResults}>
            נקה תוצאות
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ביצוע שאילתות SQL</CardTitle>
          <CardDescription>
            כלי זה מיועד לסביבת פיתוח בלבד. ניתן לבצע שאילתות על מסד הנתונים הפיקטיבי.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">שאילתת SQL:</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SELECT * FROM procurement_requests;"
              className="mt-2 h-32 font-mono"
              dir="ltr"
            />
          </div>
          
          <Button onClick={executeQuery} disabled={loading}>
            {loading ? 'מבצע...' : 'הרץ שאילתה'}
          </Button>

          {results && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">תוצאות:</h3>
              <Card>
                <CardContent className="p-4">
                  <pre className="text-sm overflow-auto bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>שאילתות לדוגמה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="text-right w-full justify-start"
              onClick={() => setQuery('SELECT * FROM procurement_requests ORDER BY createdAt DESC;')}
            >
              הצג את כל דרישות הרכש
            </Button>
            <Button 
              variant="ghost" 
              className="text-right w-full justify-start"
              onClick={() => setQuery('SELECT * FROM cost_estimations WHERE confidenceLevel > 90;')}
            >
              הצג אומדנים ברמת ביטחון גבוהה
            </Button>
            <Button 
              variant="ghost" 
              className="text-right w-full justify-start"
              onClick={() => setQuery('SELECT category, COUNT(*) as count FROM procurement_requests GROUP BY category;')}
            >
              ספירת דרישות לפי קטגוריה
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SQLRunner;
