
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  Truck,
  MapPin,
  Calendar,
  Filter,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'order' | 'delivery' | 'approval' | 'payment' | 'issue';
  status: 'completed' | 'pending' | 'in-progress' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata?: {
    orderId?: string;
    supplier?: string;
    amount?: number;
    estimatedTime?: string;
    location?: string;
  };
}

const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'הזמנה חדשה התקבלה',
    description: 'ציוד מחשוב - 15 מחשבים ניידים',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'order',
    status: 'pending',
    priority: 'high',
    metadata: {
      orderId: 'ORD-2025-001',
      supplier: 'Dell Technologies',
      amount: 75000,
      estimatedTime: '3-5 ימי עסקים'
    }
  },
  {
    id: '2',
    title: 'אישור תקציבי התקבל',
    description: 'תקציב אושר עבור רכישת ציוד משרדי',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'approval',
    status: 'completed',
    priority: 'medium',
    metadata: {
      orderId: 'ORD-2025-002',
      amount: 25000
    }
  },
  {
    id: '3',
    title: 'משלוח יצא מהמחסן',
    description: 'ריהוט משרדי בדרך ליעד',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'delivery',
    status: 'in-progress',
    priority: 'medium',
    metadata: {
      orderId: 'ORD-2025-003',
      supplier: 'ריהוט ישראלי',
      location: 'רמת גן',
      estimatedTime: '2 שעות'
    }
  },
  {
    id: '4',
    title: 'עיכוב במשלוח',
    description: 'משלוח ציוד טכני מתעכב בגלל תנועה',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: 'issue',
    status: 'delayed',
    priority: 'critical',
    metadata: {
      orderId: 'ORD-2025-004',
      supplier: 'TechSource',
      location: 'תל אביב',
      estimatedTime: 'עיכוב של שעה'
    }
  }
];

export function RealTimeTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(mockEvents);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const shouldAddEvent = Math.random() > 0.7;
      
      if (shouldAddEvent) {
        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          title: 'עדכון אוטומטי',
          description: 'עדכון סטטוס הזמנה',
          timestamp: new Date(),
          type: 'order',
          status: 'in-progress',
          priority: 'low',
          metadata: {
            orderId: `AUTO-${Date.now()}`,
            estimatedTime: '1-2 שעות'
          }
        };
        
        setEvents(prev => [newEvent, ...prev].slice(0, 20));
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'order': return Package;
      case 'delivery': return Truck;
      case 'approval': return CheckCircle;
      case 'payment': return Clock;
      case 'issue': return AlertTriangle;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-500/40';
      case 'pending': return 'text-yellow-400 border-yellow-500/40';
      case 'in-progress': return 'text-cyan-400 border-cyan-500/40';
      case 'delayed': return 'text-red-400 border-red-500/40';
      case 'cancelled': return 'text-gray-400 border-gray-500/40';
      default: return 'text-slate-400 border-slate-500/40';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return { color: 'bg-red-500/20 text-red-400', label: 'קריטי' };
      case 'high': return { color: 'bg-orange-500/20 text-orange-400', label: 'גבוה' };
      case 'medium': return { color: 'bg-yellow-500/20 text-yellow-400', label: 'בינוני' };
      case 'low': return { color: 'bg-green-500/20 text-green-400', label: 'נמוך' };
      default: return { color: 'bg-slate-500/20 text-slate-400', label: 'רגיל' };
    }
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);

  return (
    <Card className="timeline-container h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-reverse space-x-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"
            )} />
            <span className="text-cyan-400">ציר זמן בזמן אמת</span>
            <Badge variant="outline" className="text-xs border-cyan-500/30">
              {filteredEvents.length} אירועים
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-reverse space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={cn(
                "text-xs",
                isLive ? "text-green-400" : "text-gray-400"
              )}
            >
              {isLive ? <Pause className="w-3 h-3 ml-1" /> : <Play className="w-3 h-3 ml-1" />}
              {isLive ? 'השהה' : 'המשך'}
            </Button>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-800/50 border border-cyan-500/30 rounded px-2 py-1 text-xs text-cyan-400"
            >
              <option value="all">כל האירועים</option>
              <option value="order">הזמנות</option>
              <option value="delivery">משלוחים</option>
              <option value="approval">אישורים</option>
              <option value="issue">בעיות</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-full overflow-y-auto p-0">
        <div className="timeline-track relative">
          {/* Central Timeline Line */}
          <div className="absolute right-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/60 via-cyan-500/30 to-transparent" />
          
          <div className="space-y-0">
            {filteredEvents.map((event, index) => {
              const Icon = getEventIcon(event.type);
              const priority = getPriorityBadge(event.priority);
              
              return (
                <div
                  key={event.id}
                  className={cn(
                    "timeline-event relative flex items-start p-4 transition-all duration-300",
                    "hover:bg-slate-800/30 border-b border-slate-700/30"
                  )}
                >
                  {/* Timeline Dot */}
                  <div className={cn(
                    "timeline-dot absolute right-6 w-4 h-4 rounded-full border-2 bg-slate-900 z-10",
                    getStatusColor(event.status)
                  )}>
                    <Icon className="w-2 h-2 absolute inset-1" />
                  </div>

                  {/* Event Content */}
                  <div className="mr-12 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-200 text-sm">
                        {event.title}
                      </h4>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Badge className={cn("text-xs", priority.color)}>
                          {priority.label}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Intl.RelativeTimeFormat('he').format(
                            Math.round((event.timestamp.getTime() - Date.now()) / (1000 * 60)),
                            'minute'
                          )}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-3">
                      {event.description}
                    </p>

                    {/* Metadata */}
                    {event.metadata && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {event.metadata.orderId && (
                          <div className="flex items-center text-slate-500">
                            <Package className="w-3 h-3 ml-1" />
                            {event.metadata.orderId}
                          </div>
                        )}
                        {event.metadata.supplier && (
                          <div className="flex items-center text-slate-500">
                            <MapPin className="w-3 h-3 ml-1" />
                            {event.metadata.supplier}
                          </div>
                        )}
                        {event.metadata.amount && (
                          <div className="flex items-center text-slate-500">
                            <span className="ml-1">₪</span>
                            {event.metadata.amount.toLocaleString()}
                          </div>
                        )}
                        {event.metadata.estimatedTime && (
                          <div className="flex items-center text-slate-500">
                            <Clock className="w-3 h-3 ml-1" />
                            {event.metadata.estimatedTime}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
