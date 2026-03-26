import * as auIGridUtil from '@/lib/AUIGrid/auIGridUtil';
import { useEffect } from 'react';

interface UseScrollPagingAUIGridProps {
	gridRef: React.MutableRefObject<any>;
	callbackWhenScrollToEnd: () => void;
	totalCount?: number;
}

/**
 * 스크롤 페이징 훅
 * @param {any} gridRef - 그리드 참조
 * @param {any} callbackWhenScrollToEnd - 스크롤이 바닥에 도달했을 때 호출될 콜백 함수
 * @param {any} totalCount - 총 건수
 * @example
 * useScrollPagingAUIGrid({
 * 	gridRef,
 * 	callbackWhenScrollToEnd: () => {
 * 		setCurrentPage((currentPageScr: any) => currentPageScr + 1);
 * 	},
 * });
 *
 * // 만약 totalCount가 존재할 때 totalCount를 전달해주시면, 마지막 페이지인 경우 재요청하지 않습니다. ( 현재는 마지막 페이지여도 재요청합니다. )
 *
 * useScrollPagingAUIGrid({
 * 	gridRef,
 * 	callbackWhenScrollToEnd: () => {
 * 		setCurrentPage((currentPageScr: any) => currentPageScr + 1);
 * 	},
 * 	totalCount: props.totalCount,
 * });
 */
export const useScrollPagingAUIGrid = ({
	gridRef,
	callbackWhenScrollToEnd,
	totalCount,
}: UseScrollPagingAUIGridProps) => {
	useEffect(() => {
		if (!gridRef?.current) return;

		const handleVScrollChange = (event: any) => {
			// 마지막 행이 추가된 행이면 페이징 하지 않음
			if (isLastRowIsAddedRow(gridRef)) return;

			// 스크롤이 바닥에 도달했을 때
			if (event.position === event.maxPosition) {
				// totalCount를 못받아오거나, 받아왔다면  현재 그리드의 행수가 총 건수보다 작을 경우에만 페이징 처리
				if (!totalCount || (totalCount && gridRef.current.getRowCount() < totalCount)) {
					callbackWhenScrollToEnd();
				}
			}
		};

		gridRef.current.bind('vScrollChange', handleVScrollChange);

		return () => {
			if (gridRef.current) {
				gridRef.current.unbind('vScrollChange', handleVScrollChange);
			}
		};
	}, [gridRef, totalCount]);
};

/**
 * 마지막 행이 추가된 행인지 확인
 * @param gridRef
 * @returns
 */
const isLastRowIsAddedRow = (gridRef: React.MutableRefObject<any>) => {
	const lastRowData = auIGridUtil.getLastRowData(gridRef.current);

	if (lastRowData?.rowStatus === 'I') {
		return true;
	}

	return false;
};
