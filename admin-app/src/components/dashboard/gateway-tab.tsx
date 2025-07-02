
import { TokenManager } from "@/components/gateway/token-manager";
import { AuditLogs } from "@/components/gateway/audit-logs";

export function GatewayTab() {
  return (
    <div className="space-y-6">
      <TokenManager />
      <AuditLogs />
    </div>
  );
}
