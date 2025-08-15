import { Card, Skeleton } from "@heroui/react";

interface Props {
  width?: string;
  height?: string;
  count?: number;
  className?: string; // أضفنا className كـ prop اختياري
}

export default function LoadingSkeletonCard({
  width = "100%", // تغيير القيمة الافتراضية
  height = "60px", // تغيير القيمة الافتراضية
  count = 5,
  className = ""
}: Props) {
  return (
    <Card className={`w-[${width}] ${className}`} radius="lg">
      <div className="space-y-4 p-4">
        <Skeleton className="rounded-lg w-full">
          <div className={`rounded-lg bg-default-300 w-full`} style={{ height }} />
        </Skeleton>
        <div className="space-y-3 w-full">
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className="rounded-lg w-full">
              <div className="h-3 w-full rounded-lg bg-default-200" />
            </Skeleton>
          ))}
        </div>
      </div>
    </Card>
  );
}