import { useMemo } from "react";
import { HEADER_HEIGHT } from "../constants";

interface UseStageBoundsProps {
  stageWidth: number;
  stageHeight: number;
  contentWidth: number;
  contentHeight: number;
}

export const useStageBounds = ({
  stageWidth,
  stageHeight,
  contentWidth,
  contentHeight,
}: UseStageBoundsProps) => {
  const bounds = useMemo(() => {
    const minX = Math.min(0, stageWidth - contentWidth);
    const minY = Math.min(
      0,
      stageHeight - HEADER_HEIGHT - contentHeight + HEADER_HEIGHT
    );

    return {
      minX,
      minY,
      maxX: 0,
      maxY: 0,
    };
  }, [stageWidth, stageHeight, contentWidth, contentHeight]);

  const dragBoundFunc = useMemo(
    () => (pos: { x: number; y: number }) => ({
      x: Math.max(bounds.minX, Math.min(bounds.maxX, pos.x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, pos.y)),
    }),
    [bounds]
  );

  return { bounds, dragBoundFunc };
};
