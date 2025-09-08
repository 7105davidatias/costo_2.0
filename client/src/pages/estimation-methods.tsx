
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Users, Target, Brain, Clock, DollarSign, BarChart } from 'lucide-react';
import { Link } from 'wouter';

export default function EstimationMethods() {
  const methods = [
    {
      id: 1,
      name: "אומדן מבוסס מחיר שוק",
      description: "שימוש במחירי שוק נוכחיים, הצעות ספקים ונתוני תמחור בזמן אמת",
      accuracy: 95,
      timeRequired: "5-10 דקות",
      complexity: "נמוך",
      icon: TrendingUp,
      advantages: ["דיוק גבוה ביותר", "מבוסס נתונים עדכניים", "התאמה לתנודות שוק"],
      useCase: "מתאים לפריטים סטנדרטיים עם שוק פעיל",
      methodId: "market-based"
    },
    {
      id: 2,
      name: "אומדן מלמטה למעלה",
      description: "פירוק מפורט של כל רכיבי העלות ואומדן כל רכיב בנפרד",
      accuracy: 90,
      timeRequired: "30-60 דקות",
      complexity: "גבוה",
      icon: BarChart,
      advantages: ["דיוק גבוה לפריטים מורכבים", "שקיפות מלאה", "זיהוי חיסכונים פוטנציאליים"],
      useCase: "מתאים לפריטים מורכבים הניתנים לפירוק",
      methodId: "bottom-up"
    },
    {
      id: 3,
      name: "אומדן אנלוגי",
      description: "השוואה לרכישות דומות מהעבר עם התאמות לתנאים נוכחיים",
      accuracy: 85,
      timeRequired: "15-30 דקות",
      complexity: "בינוני",
      icon: Calculator,
      advantages: ["מבוסס על נתונים ריאליים", "קל להבנה", "מהיר יחסית"],
      useCase: "מתאים לפריטים עם היסטוריה קיימת במערכת",
      methodId: "analogous"
    },
    {
      id: 4,
      name: "אומדן פרמטרי",
      description: "שימוש במודלים מתמטיים ופרמטרים טכניים ליצירת אומדן מדויק",
      accuracy: 80,
      timeRequired: "20-40 דקות",
      complexity: "בינוני",
      icon: Brain,
      advantages: ["מבוסס מודלים סטטיסטיים", "התאמה לפרמטרים ספציפיים", "עקביות בתוצאות"],
      useCase: "מתאים לפריטים עם פרמטרים מדידים וקשר סטטיסטי ידוע",
      methodId: "parametric"
    },
    {
      id: 5,
      name: "אומדן ממומחים",
      description: "התייעצות עם מומחי תחום ושימוש בבנצ'מרקים תעשייתיים",
      accuracy: 75,
      timeRequired: "2-5 ימים",
      complexity: "גבוה",
      icon: Users,
      advantages: ["ניסיון מעשי", "הבנה עמוקה של התחום", "גמישות בהערכה"],
      useCase: "מתאים לפריטים חדשים, ייחודיים או מורכבים במיוחד",
      methodId: "expert-judgment"
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'נמוך': return 'bg-green-500/20 text-green-400';
      case 'בינוני': return 'bg-yellow-500/20 text-yellow-400';
      case 'גבוה': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="text-center glass-panel p-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          שיטות אומדן עלויות
        </h1>
        <p className="text-lg text-slate-300">
          5 שיטות מתקדמות לאומדן עלויות מדויק - בחירת השיטה המתאימה ביותר לכל סוג רכש
        </p>
      </div>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {methods.map((method) => (
          <Card key={method.id} className="glass-card hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-4">
                <method.icon className="w-6 h-6 text-primary" />
                <span className="text-slate-200">{method.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-400">{method.description}</p>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-200">{method.accuracy}%</div>
                  <div className="text-sm text-slate-400">דיוק ממוצע</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-200">{method.timeRequired}</div>
                  <div className="text-sm text-slate-400">זמן נדרש</div>
                </div>
              </div>

              {/* Complexity Badge */}
              <div className="flex justify-center">
                <Badge className={getComplexityColor(method.complexity)}>
                  רמת מורכבות: {method.complexity}
                </Badge>
              </div>

              {/* Advantages */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">יתרונות:</h4>
                <ul className="space-y-1">
                  {method.advantages.map((advantage, index) => (
                    <li key={index} className="text-sm text-slate-400 flex items-center">
                      <ArrowRight className="w-3 h-3 ml-2 text-primary" />
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Case */}
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-slate-300 mb-1">מתי להשתמש:</h4>
                <p className="text-sm text-slate-400">{method.useCase}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Target className="w-5 h-5 text-secondary" />
            <span className="text-slate-200">המלצות לבחירת שיטה אופטימלית</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-200">לפי סוג הפריט:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-slate-400">
                  <TrendingUp className="w-4 h-4 ml-2 text-green-400" />
                  ציוד סטנדרטי (מחשבים, ריהוט) → אומדן מבוסס מחיר שוק
                </li>
                <li className="flex items-center text-slate-400">
                  <BarChart className="w-4 h-4 ml-2 text-blue-400" />
                  פרויקטים מורכבים (בנייה, פיתוח) → אומדן מלמטה למעלה
                </li>
                <li className="flex items-center text-slate-400">
                  <Calculator className="w-4 h-4 ml-2 text-purple-400" />
                  פריטים חוזרים → אומדן אנלוגי
                </li>
                <li className="flex items-center text-slate-400">
                  <Brain className="w-4 h-4 ml-2 text-orange-400" />
                  פריטים עם מפרטים מדידים → אומדן פרמטרי
                </li>
                <li className="flex items-center text-slate-400">
                  <Users className="w-4 h-4 ml-2 text-red-400" />
                  פריטים חדשים/ייחודיים → אומדן ממומחים
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-200">לפי דחיפות ותקציב:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-slate-400">
                  <Clock className="w-4 h-4 ml-2 text-red-400" />
                  דחוף (עד שבוע) → אומדן מבוסס מחיר שוק
                </li>
                <li className="flex items-center text-slate-400">
                  <DollarSign className="w-4 h-4 ml-2 text-yellow-400" />
                  תקציב גבוה (מעל ₪500K) → אומדן מלמטה למעלה
                </li>
                <li className="flex items-center text-slate-400">
                  <Target className="w-4 h-4 ml-2 text-green-400" />
                  ללא לחץ זמן → שילוב מספר שיטות
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
            <h4 className="text-blue-300 font-medium mb-2">💡 עצה מקצועית</h4>
            <p className="text-slate-300 text-sm">
              לרכישות בסכום גבוה (מעל ₪200K) מומלץ להשתמש ב-2-3 שיטות במקביל ולהשוות את התוצאות.
              זה מגביר את דירוג הביטחון ומזהה הזדמנויות חיסכון.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-reverse space-x-4">
        <Link href="/dashboard">
          <Button variant="outline">
            חזרה לדשבורד
          </Button>
        </Link>
        <Link href="/procurement-request/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            יצירת דרישת רכש חדשה
          </Button>
        </Link>
      </div>
    </div>
  );
}
