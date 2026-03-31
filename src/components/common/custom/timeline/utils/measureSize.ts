import { CELL_SIZE, HEADER_HEIGHT, ROW_HEIGHT } from "../constants";
import { TimelineConfig, TimeRange, TimeUnit } from "../types";

export const sequenceLength = ({ timeRange, timeUnit }: { timeRange: TimeRange; timeUnit: TimeUnit }) => {
	return timeRange.endAt.diff(timeRange.startAt, 'minute') / parseInt(timeUnit) + 2;
};

export const measureSize = ({ config }: { config: TimelineConfig }) => {
  const seq = sequenceLength({
    timeRange: config.timeRange,
    timeUnit: config.timeUnit,
  });

  // 최소 셀 개수 적용
  const minCells = config.minVisibleCells ?? seq;
  const effectiveCells = Math.max(seq, minCells);

  return {
    width: effectiveCells * CELL_SIZE,
    height: HEADER_HEIGHT + config.rows.length * ROW_HEIGHT,
  };
};
