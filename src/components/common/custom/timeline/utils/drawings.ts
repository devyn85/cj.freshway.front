import { CELL_SIZE, ROW_HEIGHT } from "../constants";
import { TimelineConfig } from "../types";
import { sequenceLength } from "./measureSize";

// 유효 셀 개수 계산 (minVisibleCells 적용)
const getEffectiveCells = (config: TimelineConfig) => {
  const seq = sequenceLength({
    timeRange: config.timeRange,
    timeUnit: config.timeUnit,
  });
  const minCells = config.minVisibleCells ?? seq;
  return Math.max(seq, minCells);
};

export const drawRowsLine = ({ config }: { config: TimelineConfig }) => {
  const lines = [];
  const effectiveCells = getEffectiveCells(config);
  const totalWidth = effectiveCells * CELL_SIZE;

  for (let i = 1; i < config.rows.length + 1; i++)
    lines.push({
      points: [0, i * ROW_HEIGHT, totalWidth, i * ROW_HEIGHT],
      size: 1,
      color: "#DADDE5",
    });

  for (let i = 1; i < config.rows.length + 1; i++)
    lines.push({
      points: [
        0,
        i * ROW_HEIGHT - ROW_HEIGHT / 2,
        totalWidth,
        i * ROW_HEIGHT - ROW_HEIGHT / 2,
      ],
      color: "#D5D8E1",
      size: 2,
    });
  return lines;
};

export const drawTimeHeadersText = ({ config }: { config: TimelineConfig }) => {
  const intervalMinutes = parseInt(config.timeUnit);
  const effectiveCells = getEffectiveCells(config);

  const headers = [];
  let currentTime = config.timeRange.startAt;

  // effectiveCells 개수만큼 헤더 생성
  for (let i = 0; i < effectiveCells; i++) {
    const x = i * CELL_SIZE;

    headers.push({
      time: currentTime.format("HH : mm"),
      x,
    });

    currentTime = currentTime.add(intervalMinutes, "minute");
  }

  return headers;
};
