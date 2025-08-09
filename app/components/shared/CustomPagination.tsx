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
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage: setInnerPage,
  }) => {
    const baseBtn =
      "min-w-8 w-8 h-8 flex items-center justify-center rounded-full transform transition-all duration-300 ease-in-out cursor-pointer active:scale-95";

    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(
            baseBtn,
            "bg-gray-200 hover:bg-[#C5D86D]/50 hover:scale-110"
          )}
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" />
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
        >
          <ChevronIcon />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <span
          key={key}
          className="px-2 text-gray-500 select-none transition-opacity duration-300"
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
            ? "bg-[#C5D86D] text-white font-bold border border-[#C5D86D] scale-110 shadow-md"
            : "bg-[#C5D86D]/30 text-black hover:bg-[#C5D86D]/50 hover:scale-105"
        )}
        onClick={() => setInnerPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="flex justify-center py-4">
      <Pagination
        disableCursorAnimation
        showControls
        className="gap-2"
        total={totalPages}
        page={page}
        onChange={setPage}
        renderItem={renderItem}
        variant="light"
      />
    </div>
  );
}
