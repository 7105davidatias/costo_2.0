import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Calendar, User, Building, Zap, Clock, DollarSign, Eye, TrendingUp, FileText } from "lucide-react";
import { ProcurementRequest } from "@shared/schema";

export default function ProcurementRequestsList() {
  const { data: requests, isLoading, error } = useQuery<ProcurementRequest[]>({
    queryKey: ["/api/procurement-requests"],
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'new': { label: 'חדש', className: 'bg-info/20 text-info' },
      'processing': { label: 'בעיבוד', className: 'bg-warning/20 text-warning' },
      'completed': { label: 'הושלם', className: 'bg-success/20 text-success' },
      'pending': { label: 'ממתין', className: 'bg-muted/20 text-muted-foreground' },
      'cancelled': { label: 'בוטל', className: 'bg-destructive/20 text-destructive' },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.new;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      'high': { label: 'גבוהה', className: 'bg-destructive/20 text-destructive' },
      'medium': { label: 'בינונית', className: 'bg-warning/20 text-warning' },
      'low': { label: 'נמוכה', className: 'bg-success/20 text-success' },
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
  };

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return '₪0';
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא מוגדר';
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען דרישות רכש...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold">שגיאה בטעינת הנתונים</h3>
          <p className="text-muted-foreground">לא ניתן לטעון את דרישות הרכש</p>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">אין דרישות רכש</h3>
        <p className="text-muted-foreground mb-6">עדיין לא נוצרו דרישות רכש במערכת</p>
        <Link href="/procurement-request">
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            צור דרישת רכש חדשה
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">דרישות רכש</h1>
          <p className="text-muted-foreground">
            ניהול וצפייה בכל דרישות הרכש במערכת ({requests.length} דרישות)
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/procurement-request">
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              דרישת רכש חדשה
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="procurement-kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-info" />
              <div className="mr-4">
                <p className="text-sm font-medium text-muted-foreground">סה"כ דרישות</p>
                <p className="text-2xl font-bold text-foreground">{requests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="procurement-kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-warning" />
              <div className="mr-4">
                <p className="text-sm font-medium text-muted-foreground">בעיבוד</p>
                <p className="text-2xl font-bold text-foreground">
                  {requests.filter(r => r.status === 'processing' || r.status === 'new').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="procurement-kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-success" />
              <div className="mr-4">
                <p className="text-sm font-medium text-muted-foreground">הושלמו</p>
                <p className="text-2xl font-bold text-foreground">
                  {requests.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="procurement-kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary" />
              <div className="mr-4">
                <p className="text-sm font-medium text-muted-foreground">ערך כולל</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(requests.reduce((sum, r) => sum + (parseFloat(r.estimatedCost) || 0), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{request.requestNumber}</p>
                  <CardTitle className="text-lg leading-tight">{request.itemName}</CardTitle>
                </div>
                <Badge variant="outline" className={getStatusBadge(request.status).className}>
                  {getStatusBadge(request.status).label}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {request.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Building className="h-4 w-4 ml-1" />
                  <span>{request.department || 'לא מוגדר'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="h-4 w-4 ml-1" />
                  <span>{request.requestedBy || 'לא מוגדר'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 ml-1" />
                  <span>{formatDate(request.targetDate)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Badge variant="outline" className={getPriorityBadge(request.priority).className}>
                    {getPriorityBadge(request.priority).label}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">עלות מוערכת</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(request.estimatedCost)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/procurement-request/${request.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="ml-2 h-4 w-4" />
                      צפייה
                    </Button>
                  </Link>
                  <Link href={`/cost-estimation/${request.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <TrendingUp className="ml-2 h-4 w-4" />
                      אומדן
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}