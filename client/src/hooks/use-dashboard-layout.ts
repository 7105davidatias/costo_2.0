
import { useState, useCallback, useEffect } from 'react';

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  isVisible: boolean;
  canResize: boolean;
  canDrag: boolean;
}

export interface LayoutState {
  widgets: DashboardWidget[];
  sidebarCollapsed: boolean;
  activeTheme: 'dark' | 'light';
  viewMode: 'grid' | 'list' | 'compact';
}

export function useDashboardLayout() {
  const [layout, setLayout] = useState<LayoutState>({
    widgets: [
      {
        id: 'kpi-overview',
        title: 'KPI Overview',
        component: () => null,
        position: { x: 0, y: 0 },
        size: { width: 4, height: 2 },
        minSize: { width: 2, height: 1 },
        isVisible: true,
        canResize: true,
        canDrag: true
      },
      {
        id: 'cost-trends',
        title: 'Cost Trends',
        component: () => null,
        position: { x: 0, y: 2 },
        size: { width: 6, height: 3 },
        minSize: { width: 4, height: 2 },
        isVisible: true,
        canResize: true,
        canDrag: true
      },
      {
        id: 'accuracy-chart',
        title: 'Accuracy Analysis',
        component: () => null,
        position: { x: 6, y: 2 },
        size: { width: 6, height: 3 },
        minSize: { width: 4, height: 2 },
        isVisible: true,
        canResize: true,
        canDrag: true
      },
      {
        id: 'real-time-timeline',
        title: 'Real-time Timeline',
        component: () => null,
        position: { x: 4, y: 0 },
        size: { width: 8, height: 2 },
        minSize: { width: 4, height: 2 },
        isVisible: true,
        canResize: true,
        canDrag: true
      }
    ],
    sidebarCollapsed: false,
    activeTheme: 'dark',
    viewMode: 'grid'
  });

  // Save layout to localStorage
  useEffect(() => {
    localStorage.setItem('dashboard-layout', JSON.stringify(layout));
  }, [layout]);

  // Load layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      try {
        setLayout(JSON.parse(savedLayout));
      } catch (error) {
        console.error('Error loading layout:', error);
      }
    }
  }, []);

  const updateWidgetPosition = useCallback((widgetId: string, position: { x: number; y: number }) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, position } : widget
      )
    }));
  }, []);

  const updateWidgetSize = useCallback((widgetId: string, size: { width: number; height: number }) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, size } : widget
      )
    }));
  }, []);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, isVisible: !widget.isVisible } : widget
      )
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      activeTheme: prev.activeTheme === 'dark' ? 'light' : 'dark'
    }));
  }, []);

  const changeViewMode = useCallback((mode: 'grid' | 'list' | 'compact') => {
    setLayout(prev => ({
      ...prev,
      viewMode: mode
    }));
  }, []);

  const resetLayout = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => ({
        ...widget,
        position: { x: 0, y: 0 },
        size: widget.minSize,
        isVisible: true
      }))
    }));
  }, []);

  return {
    layout,
    updateWidgetPosition,
    updateWidgetSize,
    toggleWidgetVisibility,
    toggleSidebar,
    toggleTheme,
    changeViewMode,
    resetLayout
  };
}
