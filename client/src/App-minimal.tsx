import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function MinimalApp() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            מערכת ניהול אומדני עלויות רכש
          </h1>
          <p className="text-center text-slate-300">
            לוח בקרה מרכזי לניהול אומדנים ודרישות רכש
          </p>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* KPI Cards */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-2">סך עלויות מוערכות</h3>
            <div className="text-3xl font-bold text-blue-400">₪7,966,000</div>
            <p className="text-sm text-slate-400 mt-1">+12% מהחודש הקודם</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-2">חיסכון כולל</h3>
            <div className="text-3xl font-bold text-green-400">₪1,200,000</div>
            <p className="text-sm text-slate-400 mt-1">+8.2% מהחודש הקודם</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-2">דרישות הושלמו</h3>
            <div className="text-3xl font-bold text-yellow-400">145</div>
            <p className="text-sm text-slate-400 mt-1">+23 החודש</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-2">דיוק ממוצע</h3>
            <div className="text-3xl font-bold text-purple-400">94.5%</div>
            <p className="text-sm text-slate-400 mt-1">+2.1% מהחודש הקודם</p>
          </div>
        </main>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">פעולות מהירות</h3>
            <div className="space-y-3">
              <button className="w-full text-right p-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                צור דרישת רכש חדשה
              </button>
              <button className="w-full text-right p-3 bg-green-600 hover:bg-green-700 rounded transition-colors">
                הפק דוח אומדנים
              </button>
              <button className="w-full text-right p-3 bg-purple-600 hover:bg-purple-700 rounded transition-colors">
                בדוק סטטוס דרישות
              </button>
              <button className="w-full text-right p-3 bg-orange-600 hover:bg-orange-700 rounded transition-colors">
                נתח מגמות שוק
              </button>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">התראות מערכת</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-900/50 border border-green-700 rounded">
                <span className="text-green-400">✓ המערכת פועלת תקין</span>
              </div>
              <div className="p-3 bg-blue-900/50 border border-blue-700 rounded">
                <span className="text-blue-400">ℹ 3 דרישות ממתינות לאישור</span>
              </div>
              <div className="p-3 bg-yellow-900/50 border border-yellow-700 rounded">
                <span className="text-yellow-400">⚠ עדכון מחירון דרוש</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500">
          <p>מערכת ניהול אומדני עלויות רכש - גרסה 1.0</p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MinimalApp />
    </QueryClientProvider>
  );
}