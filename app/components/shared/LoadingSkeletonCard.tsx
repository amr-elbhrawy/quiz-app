// LoadingSkeletonCard.tsx - النسخة المحسنة
import { memo } from "react";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

interface Props {
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  variant?: 'card' | 'list' | 'table' | 'grid';
}

const LoadingSkeletonCard = memo(function LoadingSkeletonCard({
  width = "100%",
  height = "60px",
  count = 5,
  className = "",
  variant = 'card'
}: Props) {
  
  // Convert width/height to proper CSS values
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;

  const renderVariant = () => {
    switch (variant) {
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                <Skeleton className="rounded-lg">
                  <div className="w-16 h-16 bg-default-300 rounded-lg" />
                </Skeleton>
                <div className="flex-1 space-y-2">
                  <Skeleton className="rounded-lg">
                    <div className="h-4 w-3/4 bg-default-300 rounded-lg" />
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <div className="h-3 w-1/2 bg-default-200 rounded-lg" />
                  </Skeleton>
                </div>
                <Skeleton className="rounded-lg">
                  <div className="w-16 h-8 bg-default-200 rounded-lg" />
                </Skeleton>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="space-y-2">
            {/* Table Header */}
            <div className="flex gap-4 p-2 bg-gray-100 rounded-lg">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="flex-1">
                  <div className="h-4 bg-default-300 rounded" />
                </Skeleton>
              ))}
            </div>
            {/* Table Rows */}
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex gap-4 p-2 border-b">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="flex-1">
                    <div className="h-3 bg-default-200 rounded" />
                  </Skeleton>
                ))}
              </div>
            ))}
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <Skeleton className="mb-4">
                  <div className="h-32 w-full bg-default-300 rounded-lg" />
                </Skeleton>
                <div className="space-y-2">
                  <Skeleton>
                    <div className="h-4 w-3/4 bg-default-300 rounded" />
                  </Skeleton>
                  <Skeleton>
                    <div className="h-3 w-1/2 bg-default-200 rounded" />
                  </Skeleton>
                </div>
              </div>
            ))}
          </div>
        );

      default: // 'card'
        return (
          <div className="space-y-4 p-4">
            <Skeleton className="rounded-lg w-full">
              <div 
                className="rounded-lg bg-default-300 w-full" 
                style={{ height: heightValue }} 
              />
            </Skeleton>
            <div className="space-y-3 w-full">
              {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className="rounded-lg w-full">
                  <div className="h-3 w-full rounded-lg bg-default-200" />
                </Skeleton>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <Card 
      className={`${className}`} 
      style={{ width: widthValue }}
      radius="lg"
    >
      {renderVariant()}
    </Card>
  );
});

export default LoadingSkeletonCard;

// Hook للاستخدام المتقدم
export const useOptimizedLoading = (isLoading: boolean, delay: number = 200) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      timer = setTimeout(() => setShowLoading(true), delay);
    } else {
      setShowLoading(false);
    }

    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showLoading;
};