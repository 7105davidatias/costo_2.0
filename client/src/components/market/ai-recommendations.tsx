
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Star, 
  Users, 
  DollarSign, 
  Shield,
  Target,
  Lightbulb,
  BarChart3,
  Clock,
  Award
} from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  rating: number;
  priceLevel: number; // 1-5 (1 = very expensive, 5 = very cheap)
  reliability: number; // 1-100
  avgDeliveryTime: number;
  costEfficiency: number;
  onTimeDelivery: number;
  defectRate: number;
  responseTime: number;
}

interface AIRecommendation {
  type: 'supplier' | 'savings' | 'risk' | 'negotiation' | 'prediction';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  actionable: boolean;
  icon: React.ComponentType<any>;
  data?: any;
}

interface SupplierScore {
  supplier: Supplier;
  totalScore: number;
  qualityScore: number;
  priceScore: number;
  reliabilityScore: number;
  recommendation: 'strong' | 'moderate' | 'weak' | 'avoid';
  successProbability: number;
}

interface AIRecommendationsProps {
  requestId?: number;
  category: string;
  estimatedCost: number;
  quantity: number;
  suppliers: Supplier[];
  targetDate?: Date;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  requestId,
  category,
  estimatedCost,
  quantity,
  suppliers,
  targetDate
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [supplierScores, setSupplierScores] = useState<SupplierScore[]>([]);
  const [loading, setLoading] = useState(true);

  // חישוב ציון ספק: (איכות × 0.4) + (מחיר × 0.3) + (אמינות × 0.3)
  const calculateSupplierScore = (supplier: Supplier): SupplierScore => {
    // ציון איכות (מבוסס על דירוג, זמן אספקה, שיעור פגמים)
    const qualityScore = (
      (supplier.rating / 5) * 0.5 +
      (Math.max(0, 100 - supplier.avgDeliveryTime) / 100) * 0.3 +
      (Math.max(0, 100 - supplier.defectRate) / 100) * 0.2
    ) * 100;

    // ציון מחיר (כלכליות עלות)
    const priceScore = supplier.costEfficiency * 20; // Convert to 0-100 scale

    // ציון אמינות
    const reliabilityScore = (
      (supplier.reliability) * 0.4 +
      (supplier.onTimeDelivery) * 0.4 +
      (Math.max(0, 100 - supplier.responseTime) / 100 * 100) * 0.2
    );

    // ציון כולל
    const totalScore = (qualityScore * 0.4) + (priceScore * 0.3) + (reliabilityScore * 0.3);

    // קביעת המלצה
    let recommendation: 'strong' | 'moderate' | 'weak' | 'avoid';
    if (totalScore >= 85) recommendation = 'strong';
    else if (totalScore >= 70) recommendation = 'moderate';
    else if (totalScore >= 50) recommendation = 'weak';
    else recommendation = 'avoid';

    // חיזוי הצלחת הזמנה
    const successProbability = Math.min(95, totalScore + (supplier.onTimeDelivery * 0.2));

    return {
      supplier,
      totalScore: Math.round(totalScore),
      qualityScore: Math.round(qualityScore),
      priceScore: Math.round(priceScore),
      reliabilityScore: Math.round(reliabilityScore),
      recommendation,
      successProbability: Math.round(successProbability)
    };
  };

  // זיהוי הזדמנויות חיסכון
  const identifySavingsOpportunities = (scores: SupplierScore[]): AIRecommendation[] => {
    const opportunities: AIRecommendation[] = [];
    
    if (scores.length === 0) return opportunities;

    // מיון ספקים לפי ציון
    const sortedSuppliers = [...scores].sort((a, b) => b.totalScore - a.totalScore);
    const bestSupplier = sortedSuppliers[0];
    const cheapestSupplier = [...scores].sort((a, b) => b.priceScore - a.priceScore)[0];

    // הזדמנות חיסכון - ספק זול יותר עם ציון סביר
    if (cheapestSupplier.supplier.id !== bestSupplier.supplier.id && cheapestSupplier.totalScore >= 65) {
      const potentialSavings = Math.round(estimatedCost * 0.15); // הערכת חיסכון של 15%
      opportunities.push({
        type: 'savings',
        priority: 'high',
        title: 'הזדמנות חיסכון משמעותית',
        description: `${cheapestSupplier.supplier.name} מציע מחיר תחרותי יותר עם ציון איכות סביר`,
        impact: `חיסכון פוטנציאלי: ₪${potentialSavings.toLocaleString()}`,
        confidence: 78,
        actionable: true,
        icon: DollarSign,
        data: { supplier: cheapestSupplier.supplier, savings: potentialSavings }
      });
    }

    // חיסכון בכמויות גדולות
    if (quantity >= 10) {
      opportunities.push({
        type: 'savings',
        priority: 'medium',
        title: 'הנחת כמות זמינה',
        description: 'בכמות זו ניתן לנגוש להנחת כמות של 5-8%',
        impact: `חיסכון צפוי: ₪${Math.round(estimatedCost * 0.065).toLocaleString()}`,
        confidence: 85,
        actionable: true,
        icon: BarChart3
      });
    }

    return opportunities;
  };

  // זיהוי סיכונים
  const identifyRisks = (scores: SupplierScore[]): AIRecommendation[] => {
    const risks: AIRecommendation[] = [];

    scores.forEach(score => {
      const supplier = score.supplier;
      
      // מחיר יוצא דופן (>120% מהממוצע)
      const avgPrice = scores.reduce((sum, s) => sum + (estimatedCost / s.supplier.costEfficiency), 0) / scores.length;
      const supplierPrice = estimatedCost / supplier.costEfficiency;
      
      if (supplierPrice > avgPrice * 1.2) {
        risks.push({
          type: 'risk',
          priority: 'high',
          title: 'מחיר יוצא דופן',
          description: `${supplier.name} - מחיר גבוה ב-${Math.round(((supplierPrice / avgPrice - 1) * 100))}% מהממוצע`,
          impact: 'סיכון לחריגה מתקציב',
          confidence: 90,
          actionable: true,
          icon: AlertTriangle
        });
      }

      // ספק לא אמין
      if (supplier.reliability < 70 || supplier.onTimeDelivery < 75) {
        risks.push({
          type: 'risk',
          priority: 'medium',
          title: 'ספק בעל אמינות נמוכה',
          description: `${supplier.name} - בעיות באמינות או עמידה בלוחות זמנים`,
          impact: 'סיכון לעיכובים ובעיות איכות',
          confidence: 82,
          actionable: true,
          icon: Shield
        });
      }

      // זמן אספקה ארוך
      if (targetDate) {
        const daysToTarget = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (supplier.avgDeliveryTime > daysToTarget - 5) {
          risks.push({
            type: 'risk',
            priority: 'high',
            title: 'לוח זמנים צפוף',
            description: `${supplier.name} - זמן אספקה ארוך יחסית ללוח הזמנים הנדרש`,
            impact: 'סיכון לעיכוב במסירה',
            confidence: 88,
            actionable: true,
            icon: Clock
          });
        }
      }
    });

    return risks;
  };

  // טיפים למשא ומתן
  const generateNegotiationTips = (scores: SupplierScore[]): AIRecommendation[] => {
    const tips: AIRecommendation[] = [];

    if (scores.length > 1) {
      const bestSuppliers = scores.filter(s => s.totalScore >= 70).slice(0, 3);
      
      if (bestSuppliers.length >= 2) {
        tips.push({
          type: 'negotiation',
          priority: 'high',
          title: 'נצל תחרותיות בין ספקים',
          description: `יש לך ${bestSuppliers.length} ספקים איכותיים - השתמש בכך לשיפור תנאים`,
          impact: 'פוטנציאל לשיפור מחיר ותנאים',
          confidence: 85,
          actionable: true,
          icon: Target
        });
      }
    }

    // טיפ לפי עונתיות
    const currentMonth = new Date().getMonth();
    if ([2, 5, 8, 11].includes(currentMonth)) { // סוף רבעון
      tips.push({
        type: 'negotiation',
        priority: 'medium',
        title: 'עיתוי אידיאלי למשא ומתן',
        description: 'סוף רבעון - ספקים מעוניינים יותר לסגור עסקאות',
        impact: 'הזדמנות להנחות נוספות',
        confidence: 75,
        actionable: true,
        icon: Lightbulb
      });
    }

    return tips;
  };

  // אלגוריתם התאמת ספקים
  const generateSupplierRecommendations = (scores: SupplierScore[]): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    
    const strongSuppliers = scores.filter(s => s.recommendation === 'strong');
    const moderateSuppliers = scores.filter(s => s.recommendation === 'moderate');

    if (strongSuppliers.length > 0) {
      const bestSupplier = strongSuppliers[0];
      recommendations.push({
        type: 'supplier',
        priority: 'high',
        title: `ספק מומלץ: ${bestSupplier.supplier.name}`,
        description: `ציון כולל: ${bestSupplier.totalScore}/100, הצלחה צפויה: ${bestSupplier.successProbability}%`,
        impact: 'בחירה מיטבית למיזם',
        confidence: 92,
        actionable: true,
        icon: Award,
        data: bestSupplier
      });
    }

    if (moderateSuppliers.length > 0 && strongSuppliers.length === 0) {
      const bestModerate = moderateSuppliers[0];
      recommendations.push({
        type: 'supplier',
        priority: 'medium',
        title: `ספק מתאים: ${bestModerate.supplier.name}`,
        description: `ציון כולל: ${bestModerate.totalScore}/100 - מתאים עם שמירה על זהירות`,
        impact: 'אופציה סבירה עם מעקב הדוק',
        confidence: 75,
        actionable: true,
        icon: CheckCircle,
        data: bestModerate
      });
    }

    return recommendations;
  };

  useEffect(() => {
    const generateAllRecommendations = () => {
      setLoading(true);
      
      // חישוב ציוני ספקים
      const scores = suppliers.map(calculateSupplierScore);
      setSupplierScores(scores);

      // יצירת המלצות מכל הקטגוריות
      const allRecommendations = [
        ...generateSupplierRecommendations(scores),
        ...identifySavingsOpportunities(scores),
        ...identifyRisks(scores),
        ...generateNegotiationTips(scores)
      ];

      // מיון לפי עדיפות
      const sortedRecommendations = allRecommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      setRecommendations(sortedRecommendations);
      setLoading(false);
    };

    if (suppliers && suppliers.length > 0) {
      // Simulate AI processing time
      setTimeout(generateAllRecommendations, 1500);
    }
  }, [suppliers, estimatedCost, quantity, targetDate]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-blue-600 bg-blue-50';
      case 'weak': return 'text-yellow-600 bg-yellow-50';
      case 'avoid': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            מערכת המלצות AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">מנתח נתונים ויוצר המלצות מותאמות...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            מערכת המלצות AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommendations">המלצות</TabsTrigger>
              <TabsTrigger value="suppliers">ציוני ספקים</TabsTrigger>
              <TabsTrigger value="analysis">ניתוח מפורט</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    לא נמצאו המלצות מיוחדות עבור דרישה זו
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec, index) => {
                    const IconComponent = rec.icon;
                    return (
                      <Alert key={index} className="border-r-4" style={{ borderRightColor: rec.priority === 'high' ? '#ef4444' : rec.priority === 'medium' ? '#f59e0b' : '#10b981' }}>
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-5 w-5 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{rec.title}</h4>
                              <Badge variant="outline" className={getPriorityColor(rec.priority) + ' text-white'}>
                                {rec.priority === 'high' ? 'דחוף' : rec.priority === 'medium' ? 'בינוני' : 'נמוך'}
                              </Badge>
                              <Badge variant="secondary">
                                {rec.confidence}% ביטחון
                              </Badge>
                            </div>
                            <AlertDescription className="mb-2">
                              {rec.description}
                            </AlertDescription>
                            <div className="text-sm font-medium text-primary">
                              {rec.impact}
                            </div>
                          </div>
                        </div>
                      </Alert>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-4">
              <div className="space-y-4">
                {supplierScores.map((score, index) => (
                  <Card key={index} className="border-r-4" style={{ borderRightColor: score.recommendation === 'strong' ? '#10b981' : score.recommendation === 'moderate' ? '#3b82f6' : score.recommendation === 'weak' ? '#f59e0b' : '#ef4444' }}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{score.supplier.name}</h3>
                          <Badge className={getRecommendationColor(score.recommendation)}>
                            {score.recommendation === 'strong' ? 'מומלץ מאוד' : 
                             score.recommendation === 'moderate' ? 'מתאים' :
                             score.recommendation === 'weak' ? 'חלש' : 'להימנע'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{score.totalScore}/100</div>
                          <div className="text-sm text-muted-foreground">ציון כולל</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">איכות</div>
                          <Progress value={score.qualityScore} className="h-2" />
                          <div className="text-xs text-right mt-1">{score.qualityScore}/100</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">מחיר</div>
                          <Progress value={score.priceScore} className="h-2" />
                          <div className="text-xs text-right mt-1">{score.priceScore}/100</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">אמינות</div>
                          <Progress value={score.reliabilityScore} className="h-2" />
                          <div className="text-xs text-right mt-1">{score.reliabilityScore}/100</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span>הצלחה צפויה: <strong>{score.successProbability}%</strong></span>
                          <span>דירוג: <strong>{score.supplier.rating}/5</strong></span>
                        </div>
                        <div className="text-muted-foreground">
                          אספקה: {score.supplier.avgDeliveryTime} ימים
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ניתוח התפלגות ציונים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['strong', 'moderate', 'weak', 'avoid'].map(type => {
                        const count = supplierScores.filter(s => s.recommendation === type).length;
                        const percentage = supplierScores.length > 0 ? (count / supplierScores.length * 100) : 0;
                        
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <span className="capitalize">
                              {type === 'strong' ? 'מומלץ מאוד' : 
                               type === 'moderate' ? 'מתאים' :
                               type === 'weak' ? 'חלש' : 'להימנע'}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${type === 'strong' ? 'bg-green-500' : type === 'moderate' ? 'bg-blue-500' : type === 'weak' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">מטריצת סיכונים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>סיכונים גבוהים:</span>
                        <Badge variant="destructive">
                          {recommendations.filter(r => r.type === 'risk' && r.priority === 'high').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>סיכונים בינוניים:</span>
                        <Badge variant="secondary">
                          {recommendations.filter(r => r.type === 'risk' && r.priority === 'medium').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>הזדמנויות חיסכון:</span>
                        <Badge variant="default">
                          {recommendations.filter(r => r.type === 'savings').length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">סיכום ביצועים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p>
                      <strong>ממוצע ציונים:</strong> {(supplierScores.reduce((sum, s) => sum + s.totalScore, 0) / supplierScores.length).toFixed(1)}/100
                    </p>
                    <p>
                      <strong>ספק מוביל:</strong> {supplierScores.length > 0 ? supplierScores.sort((a, b) => b.totalScore - a.totalScore)[0].supplier.name : 'לא זמין'}
                    </p>
                    <p>
                      <strong>רמת תחרותיות:</strong> {supplierScores.filter(s => s.totalScore >= 70).length >= 2 ? 'גבוהה' : 'בינונית'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendations;
