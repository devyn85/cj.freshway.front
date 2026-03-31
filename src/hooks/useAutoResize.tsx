import { RefObject } from 'react';

/**
 * 리사이즈 처리 hook
 * @param {any} param0
 * @param {any} param0.ref
 * @param {any} param0.searchConditonLiCnt
 * @param {any} param0.moreHeight
 */
export const useAutoResize = ({
	ref,
	searchConditonLiCnt = 0,
	moreHeight = 0,
}: {
	ref: RefObject<any>;
	searchConditonLiCnt?: number;
	moreHeight?: number;
}) => {
	const isFirst = useRef(true);

	useEffect(() => {
		/**
		 * 리사이즈 처리 함수
		 */
		function handleResize() {
			const wrap = (document.querySelector('.keep-alive-content') as HTMLElement)?.offsetHeight || 800; // 전체 높이
			const tabHeaderHeight = (document.querySelector('.ant-tabs-nav') as HTMLElement)?.offsetHeight || 0; // 탭 헤더 높이
			const tabPane = document.querySelector('.ant-tabs-tabpane') as HTMLElement; // 탭
			let headerHeight = 0; // 조회조건 및 기타 고정 높이

			if (searchConditonLiCnt == 0) {
				headerHeight = 160;
			} else if (searchConditonLiCnt == 1) {
				headerHeight = 200;
			} else if (searchConditonLiCnt == 2) {
				headerHeight = 230;
			} else if (searchConditonLiCnt == 3) {
				headerHeight = 250;
			}

			// 최초 호출 여부 확인
			if (isFirst.current) {
				isFirst.current = false;
				//moreHeight += 30; // 최초일때는 30px 추가 여유 공간 확보
			}

			const newHeight = Number(wrap) - tabHeaderHeight - headerHeight + moreHeight;

			// TabPane 높이 먼저 조정
			if (tabPane) {
				tabPane.style.height = `${newHeight}px`;
			}

			// 그리드 높이 조정
			try {
				ref?.current?.resize?.('100%', newHeight);
			} catch (e) {}
		}

		window.addEventListener('resize', handleResize);
		handleResize(); // 최초 1회 실행

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [ref, moreHeight]); // ref나 moreHeight가 바뀔 때마다 실행
};
