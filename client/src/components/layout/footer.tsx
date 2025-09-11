import { useVersionInfo } from "@/hooks/use-version-info";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, GitBranch } from "lucide-react";

export default function Footer() {
  const { data: versionInfo, isLoading } = useVersionInfo();

  if (isLoading) {
    return (
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="animate-pulse h-6 bg-muted rounded w-32"></div>
          </div>
        </div>
      </footer>
    );
  }

  if (!versionInfo) return null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-success/20 text-success border-success/30';
      case 'staging':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'development':
        return 'bg-info/20 text-info border-info/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getEnvironmentLabel = (env: string) => {
    switch (env) {
      case 'production':
        return 'יצור';
      case 'staging':
        return 'בדיקות';
      case 'development':
        return 'פיתוח';
      default:
        return env;
    }
  };

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="footer-version-info">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          {/* Version & Build Number */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span data-testid="text-version">גרסה {versionInfo.version}</span>
            <Separator orientation="vertical" className="h-4" />
            <span data-testid="text-build-number">Build {versionInfo.buildNumber}</span>
          </div>

          <Separator orientation="vertical" className="h-4" />

          {/* Environment Badge */}
          <Badge 
            variant="outline" 
            className={getEnvironmentColor(versionInfo.environment)}
            data-testid="badge-environment"
          >
            {getEnvironmentLabel(versionInfo.environment)}
          </Badge>

          <Separator orientation="vertical" className="h-4" />

          {/* Build Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span data-testid="text-build-date">{formatDate(versionInfo.buildDate)}</span>
          </div>

          {/* Git Commit (only if not 'unknown') */}
          {versionInfo.gitCommit && versionInfo.gitCommit !== 'unknown' && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <code 
                  className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded"
                  data-testid="text-git-commit"
                >
                  {versionInfo.gitCommit.slice(0, 8)}
                </code>
              </div>
            </>
          )}
        </div>

        {/* System Title */}
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground" data-testid="text-system-title">
            מערכת ניהול אומדני עלויות רכש
          </p>
        </div>
      </div>
    </footer>
  );
}