import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Database, Play, AlertTriangle, Table as TableIcon, Search, Plus, Edit, Trash2, Eye, RefreshCw, Upload } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DatabaseAdmin() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any>({});
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [loadingTables, setLoadingTables] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [connectionStatus, setConnectionStatus] = useState<string>('checking...');
  const [isSeeding, setIsSeeding] = useState(false);

  // טעינת סקירת הטבלאות
  useEffect(() => {
    loadDatabaseOverview();
  }, []);

  const loadDatabaseOverview = async () => {
    setLoadingTables(true);
    try {
      // קבלת רשימת טבלאות מ-storage
      const [procurementRequests, suppliers, costEstimations, documents] = await Promise.all([
        fetch('/api/procurement-requests').then(r => r.json()),
        fetch('/api/suppliers').then(r => r.json()),
        fetch('/api/cost-estimations').then(r => r.json()),
        fetch('/api/documents/request/1').then(r => r.json()).catch(() => [])
      ]);

      const tablesInfo = [
        { name: 'procurement_requests', count: procurementRequests.length, description: 'דרישות רכש' },
        { name: 'suppliers', count: suppliers.length, description: 'ספקים' },
        { name: 'cost_estimations', count: costEstimations.length, description: 'אומדני עלויות' },
        { name: 'documents', count: Array.isArray(documents) ? documents.length : 0, description: 'מסמכים' }
      ];

      setTables(tablesInfo);

      // שמירת הנתונים לתצוגה מפורטת
      setTableData({
        procurement_requests: procurementRequests,
        suppliers: suppliers,
        cost_estimations: costEstimations,
        documents: documents
      });
      setConnectionStatus('Production database connected');
    } catch (error) {
      console.error('Error loading database overview:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת נתוני מסד הנתונים",
        variant: "destructive"
      });
      setConnectionStatus('Failed to connect to Production database');
    } finally {
      setLoadingTables(false);
    }
  };

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

  const viewTableData = (tableName: string) => {
    setSelectedTable(tableName);
    setActiveTab('table-view');
  };

  const formatTableData = (data: any[], tableName: string) => {
    if (!data || data.length === 0) return null;

    const sample = data[0];
    const columns = Object.keys(sample);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {tableName} ({data.length} רשומות)
          </h3>
          <Button size="sm" onClick={() => loadDatabaseOverview()}>
            <RefreshCw className="h-4 w-4 ml-2" />
            רענן
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden bg-gray-900">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800">
                {columns.map(column => (
                  <TableHead key={column} className="text-gray-300 font-medium">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 10).map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-800 border-gray-700">
                  {columns.map(column => (
                    <TableCell key={column} className="text-gray-200">
                      {typeof row[column] === 'object' ? 
                        JSON.stringify(row[column]).substring(0, 100) + '...' :
                        String(row[column] || '-')
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length > 10 && (
          <p className="text-sm text-gray-400">
            מוצגות 10 רשומות ראשונות מתוך {data.length} סה״כ
          </p>
        )}
      </div>
    );
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

  const seedDemoData = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/admin/seed-production-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        alert(`✅ ${result.message}\n\nנטענו:\n• ${result.seeded.users} משתמשים\n• ${result.seeded.suppliers} ספקים\n• ${result.seeded.requests} דרישות רכש`);
        // Refresh the data
        await loadDatabaseOverview();
      } else {
        alert(`❌ שגיאה: ${result.message}`);
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert(`❌ שגיאה בטעינת נתוני הדמו: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Helper function to reload all table data, used after seeding
  const loadTableData = async () => {
    setLoadingTables(true);
    try {
      const [procurementRequests, suppliers, costEstimations, documents] = await Promise.all([
        fetch('/api/procurement-requests').then(r => r.json()),
        fetch('/api/suppliers').then(r => r.json()),
        fetch('/api/cost-estimations').then(r => r.json()),
        fetch('/api/documents/request/1').then(r => r.json()).catch(() => [])
      ]);
      
      setTableData({
        procurement_requests: procurementRequests,
        suppliers: suppliers,
        cost_estimations: costEstimations,
        documents: documents
      });

      const tablesInfo = [
        { name: 'procurement_requests', count: procurementRequests.length, description: 'דרישות רכש' },
        { name: 'suppliers', count: suppliers.length, description: 'ספקים' },
        { name: 'cost_estimations', count: costEstimations.length, description: 'אומדני עלויות' },
        { name: 'documents', count: Array.isArray(documents) ? documents.length : 0, description: 'מסמכים' }
      ];
      setTables(tablesInfo);

    } catch (error) {
      console.error('Error reloading database overview:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת נתוני מסד הנתונים לאחר פעולת הוספה",
        variant: "destructive"
      });
    } finally {
      setLoadingTables(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            חזרה
          </Button>
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">ניהול מסד נתונים - Production</h1>
              <p className="text-gray-400">ניהול וביצוע שאילתות על מסד הנתונים הפעיל</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={seedDemoData}
              disabled={isSeeding || connectionStatus !== 'Production database connected'}
              variant="outline"
              size="sm"
            >
              {isSeeding ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  טוען נתונים...
                </div>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-1" />
                  טען נתוני דמו
                </>
              )}
            </Button>
            <div className={`px-2 py-1 rounded text-sm ${
              connectionStatus === 'Production database connected' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {connectionStatus}
            </div>
          </div>
        </div>

        <Alert className="border-yellow-600 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            זהירות! אתה עובד על מסד הנתונים הפעיל (Production). שינויים יכולים להשפיע על המערכת.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              סקירה כללית
            </TabsTrigger>
            <TabsTrigger value="table-view" className="data-[state=active]:bg-gray-700">
              תצוגת טבלאות
            </TabsTrigger>
            <TabsTrigger value="sql-runner" className="data-[state=active]:bg-gray-700">
              ביצוע שאילתות
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Database Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TableIcon className="h-5 w-5" />
                  סקירת מסד הנתונים
                  {loadingTables && <RefreshCw className="h-4 w-4 animate-spin" />}
                </CardTitle>
                <CardDescription>
                  מבט כללי על הטבלאות והנתונים במערכת
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tables.map((table) => (
                    <Card key={table.name} className="bg-gray-900 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white">{table.description}</h3>
                          <Badge variant="secondary">{table.count}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          טבלה: {table.name}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => viewTableData(table.name)}
                        >
                          <Eye className="h-4 w-4 ml-2" />
                          צפה בנתונים
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table-view" className="space-y-6">
            {selectedTable && tableData[selectedTable] ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>נתוני טבלה: {selectedTable}</CardTitle>
                </CardHeader>
                <CardContent>
                  {formatTableData(tableData[selectedTable], selectedTable)}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <TableIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    בחר טבלה לצפייה
                  </h3>
                  <p className="text-gray-500">
                    עבור לטאב "סקירה כללית" ובחר טבלה לצפייה בנתונים
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sql-runner" className="space-y-6">

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
                    onClick={() => executeQuery()}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}