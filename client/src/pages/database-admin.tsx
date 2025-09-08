
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Database, Play, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DatabaseAdmin() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const response = await fetch('/api/admin/execute-sql', {
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

  const commonQueries = [
    {
      title: "הצגת כל דרישות הרכש",
      query: "SELECT * FROM procurement_requests ORDER BY created_at DESC LIMIT 10"
    },
    {
      title: "עדכון סטטוס דרישה",
      query: "UPDATE procurement_requests SET status = 'completed' WHERE id = 1"
    },
    {
      title: "הצגת ספקים",
      query: "SELECT * FROM suppliers"
    },
    {
      title: "הצגת אומדני עלויות",
      query: "SELECT * FROM cost_estimations ORDER BY created_at DESC LIMIT 10"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            חזרה
          </Button>
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">ניהול מסד נתונים</h1>
              <p className="text-gray-400">ביצוע שאילתות SQL ישירות על מסד הנתונים</p>
            </div>
          </div>
        </div>

        <Alert className="border-yellow-600 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            זהירות! שינויים בבסיס הנתונים יכולים להשפיע על המערכת. השתמש בזהירות.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Query Input */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                ביצוע שאילתה
              </CardTitle>
              <CardDescription>
                הכנס שאילתת SQL (SELECT, INSERT, UPDATE, DELETE)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="SELECT * FROM procurement_requests WHERE status = 'new'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-32 bg-gray-900 border-gray-600 text-white font-mono"
                dir="ltr"
              />
              <Button 
                onClick={executeQuery}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'מבצע...' : 'הרץ שאילתה'}
              </Button>
            </CardContent>
          </Card>

          {/* Common Queries */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>שאילתות נפוצות</CardTitle>
              <CardDescription>
                לחץ על שאילתה להעתקה לעורך
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {commonQueries.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => setQuery(item.query)}
                >
                  <div className="font-medium text-sm mb-1">{item.title}</div>
                  <code className="text-xs text-gray-400 block" dir="ltr">
                    {item.query}
                  </code>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {results && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                תוצאות
                <Badge variant="secondary">
                  {results.timestamp}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 p-4 rounded-lg overflow-auto">
                <pre className="text-sm text-green-400" dir="ltr">
                  {JSON.stringify(results.data, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
