import { useQuery } from "@tanstack/react-query";

export interface VersionInfo {
  buildNumber: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  buildDate: string;
  gitCommit: string;
  deploymentDate: string | null;
  sapDataVersion: string | null;
}

export function useVersionInfo() {
  return useQuery<VersionInfo>({
    queryKey: ['/api/version'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}