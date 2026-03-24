import { useState, useCallback, useRef } from 'react';

interface VirtualScrollOptions {
  totalCount: number;
  itemHeight: number;
  containerHeight: number;
  buffer?: number;
}

interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  totalHeight: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useVirtualScroll({
  totalCount,
  itemHeight,
  containerHeight,
  buffer = 5,
}: VirtualScrollOptions): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + buffer * 2);
  const offsetY = startIndex * itemHeight;
  const totalHeight = totalCount * itemHeight;

  return {
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    onScroll,
    scrollContainerRef,
  };
}