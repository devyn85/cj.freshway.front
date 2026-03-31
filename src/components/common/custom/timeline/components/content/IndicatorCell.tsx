import Konva from "konva";
import { useEffect, useRef } from "react";
import { Group, Rect, RegularPolygon } from "react-konva";
import { ROW_HEIGHT, TICK_SIZE } from "../../constants";
import { TimelineConfig, TimelineRow } from "../../types";

interface IndicatorCellProps {
  row: TimelineRow;
  config: TimelineConfig;
}

const Indicator = ({ x, y }: { x: number; y: number }) => {
  const groupRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.cache({
      x: -1,
      y: -13,
      width: 8,
      height: 38,
    });
  }, []);

  return (
    <Group ref={groupRef} x={x} y={y} width={5.7} height={24} offsetX={-0.3}>
      <RegularPolygon
        x={2.5}
        y={-8}
        sides={3}
        radius={4.5}
        fill={"#2E66F6"}
        cornerRadius={1}
        rotation={180}
      />
      <Rect
        x={0}
        y={0}
        width={5.7}
        height={24}
        fill={"#2E66F6"}
        stroke="#FFFFFF"
        strokeWidth={1}
        cornerRadius={4}
      />
    </Group>
  );
};

export const IndicatorCell = ({ row, config }: IndicatorCellProps) => {
  const tickSize = TICK_SIZE[config.timeUnit];
  const rowIndex = config.rows.indexOf(row);

  const startX =
    row.startWorkAt.diff(config.timeRange.startAt, "minute") * tickSize - 6;
  const endX =
    row.endWorkAt.diff(config.timeRange.startAt, "minute") * tickSize + 6;

  const y = ROW_HEIGHT * rowIndex + ROW_HEIGHT / 2 - 12;

  return (
    <>
      <Indicator x={24 + startX} y={y} />
      <Indicator x={24 + endX} y={y} />
    </>
  );
};
