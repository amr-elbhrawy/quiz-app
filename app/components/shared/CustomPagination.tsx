"use client";

import { Pagination, PaginationItemType } from "@heroui/react";
import { cn } from "@heroui/react";

export const ChevronIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M15.5 19l-7-7 7-7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

interface CustomPaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export default function CustomPagination({
  totalPages,
  page,
  setPage,
}: CustomPaginationProps) {
  // حساب عدد الصفحات المناسب حسب عرض الشاشة
  const getSiblingsAndBoundaries = () => {
    if (typeof window === 'undefined') return { siblings: 1, boundaries: 1 };
    
    const width = window.innerWidth;
    if (width < 400) return { siblings: 0, boundaries: 1 }; // عرض محدود جداً
    if (width < 640) return { siblings: 1, boundaries: 1 }; // موبايل
    return { siblings: 2, boundaries: 2 }; // شاشات كبيرة
  };

  const { siblings, boundaries } = getSiblingsAndBoundaries();
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage: setInnerPage,
  }) => {
    // تحديد حجم الأزرار حسب نوع الشاشة
    const baseBtn =
      "min-w-6 w-6 h-6 xs:min-w-8 xs:w-8 xs:h-8 sm:min-w-10 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transform transition-all duration-300 ease-in-out cursor-pointer active:scale-95 touch-manipulation select-none";

    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(
            baseBtn,
            "bg-gray-200 hover:bg-[#C5D86D]/50 hover:scale-110"
          )}
          onClick={onNext}
          aria-label="Next page"
        >
          <ChevronIcon className="rotate-180 text-xs xs:text-sm sm:text-base" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(
            baseBtn,
            "bg-gray-200 hover:bg-[#C5D86D]/50 hover:scale-110"
          )}
          onClick={onPrevious}
          aria-label="Previous page"
        >
          <ChevronIcon className="text-xs xs:text-sm sm:text-base" />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <span
          key={key}
          className="px-1 xs:px-2 text-gray-500 select-none transition-opacity duration-300 text-xs xs:text-sm sm:text-base"
        >
          ...
        </span>
      );
    }

    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          baseBtn,
          isActive
            ? "bg-[#C5D86D] text-white font-bold border border-[#C5D86D] scale-110 shadow-md text-xs xs:text-sm sm:text-base"
            : "bg-[#C5D86D]/30 text-black hover:bg-[#C5D86D]/50 hover:scale-105 text-xs xs:text-sm sm:text-base"
        )}
        onClick={() => setInnerPage(value)}
        aria-label={`Go to page ${value}`}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="flex justify-center py-2 sm:py-4 px-2">
      <Pagination
        disableCursorAnimation
        showControls
        className="gap-1 xs:gap-2 sm:gap-3"
        total={totalPages}
        page={page}
        onChange={setPage}
        renderItem={renderItem}
        variant="light"
        siblings={siblings}
        boundaries={boundaries}
      />
    </div>
  );
}