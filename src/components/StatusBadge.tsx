import { RequestStatus, STATUS_LABELS } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const statusStyles: Record<RequestStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  in_review: 'bg-accent/10 text-accent',
  pending_clarification: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold', statusStyles[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
