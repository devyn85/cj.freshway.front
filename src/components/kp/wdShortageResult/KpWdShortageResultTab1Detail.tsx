/*
 ############################################################################
 # FiledataField	: KpWdShortageResultTab1Detail.tsx
 # Description		: 지표/모니터링 > 센터운영지표 > 출고결품실적 조회 Grid Header
 # Author			: 공두경
 # Since			: 2026.03.23
 ############################################################################
*/

import { apiPostDetailT1List } from '@/api/kp/apiKpWdShortageResult';
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const KpWdShortageResultTab1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);

	const [totalCnt1, setTotalCnt1] = useState(0);

	const { t } = useTranslation();

	const reasonList = getCommonCodeList('REASONCODE_WD');

	/////////////////////////// 월요약 상단 그리드 ///////////////////////////
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, // 체크박스
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	const baseCols = useMemo(
		() => [
			{
				// 상품구분
				dataField: 'skupartname',
				headerText: t('lbl.SKUPART'),
				dataType: 'code',
				editable: false,
				width: 100,
			},
			{
				// 누계
				dataField: 'total',
				headerText: t('lbl.TOTAL_WD'),
				dataType: 'numeric',
				formatString: '#,##0.##',
				editable: false,
				width: 100,
			},
			{
				// 평균
				dataField: 'average',
				headerText: t('lbl.AVERAGE'),
				dataType: 'numeric',
				formatString: '#,##0.##',
				editable: false,
				width: 100,
			},
			{
				// 목표
				dataField: 'goal',
				headerText: t('lbl.GOAL'),
				dataType: 'numeric',
				formatString: '#,##0.##',
				editable: false,
				width: 100,
			},
		],
		[],
	);

	/////////////////////////// 월요약 하단 그리드 ///////////////////////////
	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성
	const gridProps1 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, // 체크박스
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	const baseCols1 = useMemo(
		() => [
			{
				// 결품사유
				dataField: 'reasoncodename',
				headerText: t('lbl.REASONCODE_WD'),
				dataType: 'code',
				editable: false,
				width: 100,
			},
			{
				// 누계
				dataField: 'total',
				headerText: t('lbl.TOTAL_WD'),
				dataType: 'numeric',
				formatString: '#,##0.##',
				editable: false,
				width: 100,
			},
			{
				// 평균
				dataField: 'average',
				headerText: t('lbl.AVERAGE'),
				dataType: 'numeric',
				formatString: '#,##0.##',
				editable: false,
				width: 100,
			},
			{
				// 목표
				dataField: 'goal',
				headerText: t('lbl.GOAL'),
				dataType: 'numeric',
				formatString: '#,##0.##',
				editable: false,
				width: 100,
			},
		],
		[],
	);

	// 일짜 컬럼(다이나믹)
	const dynamicDayCols = useMemo(() => {
		// 우선 colList를 사용 (각 항목에 colnm, day 필드 존재)
		if (Array.isArray(props.colList) && props.colList.length > 0) {
			return props.colList.map((it: any) => ({
				dataField: it.colField,
				headerText: it.colHeader,
				dataType: 'numeric',
				formatString: '#,##0.##',
				editable: false,
				width: 90,
			}));
		}
		// 반드시 배열 반환
		return [];
	}, [props.colList]);

	// 최종 그리드
	const gridCol = useMemo(() => [...baseCols, ...dynamicDayCols], [baseCols, dynamicDayCols]);
	const gridCol1 = useMemo(() => [...baseCols1, ...dynamicDayCols], [baseCols1, dynamicDayCols]);
	const colKey = useMemo(() => gridCol.map(c => String(c.dataField)).join('|') || 'base', [gridCol]);
	const colKey1 = useMemo(() => gridCol1.map(c => String(c.dataField)).join('|') || 'base', [gridCol1]);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		console.log('selectedRow[0].skupart', selectedRow[0].skupart);

		if (selectedRow[0].skupart === '06' || selectedRow[0].skupart === '07') {
			return;
		}

		const formParams = props.form.getFieldsValue();

		formParams.docdt = formParams.docdt.format('YYYYMM');

		const rowParams = {
			skupart: selectedRow[0].skupart,
			colList: Array.isArray(props.colList)
				? props.colList.map((c: any) => c.colValue).filter((v: any) => v !== undefined && v !== null)
				: [],
		};

		const params = { ...formParams, ...rowParams };

		apiPostDetailT1List(params).then(res => {
			const gridData = res.data;
			const newData = (gridData || []).map((item: any) => ({
				...item,
				reasoncodename: reasonList.find(s => s.comCd === String(item.reasoncode))?.cdNm ?? item.reasoncode,
			}));
			ref.gridRef2.current?.setGridData(newData);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);

			setTotalCnt1(newData.length);
		});
	};
	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * ==========================================================================
	 -  AUI Grid Event Initailize
	 - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */

	useEffect(() => {
		if (ref.gridRef.current) {
			// 그리드 초기화
			ref.gridRef.current?.setGridData(props.data);
			ref.gridRef.current?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
			} else {
				ref.gridRef2.current.clearGridData();
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (!gridRefCur) return;
		// 기존 이벤트 해제(중복 방지)
		ref.gridRef?.current.unbind && ref.gridRef?.current.unbind('selectionChange');

		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem || event.primeCell.dataField === 'customRowCheckYn') return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			searchDtl();
		});
	}, [colKey]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				sizes={[40, 60]}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.data?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid key={colKey} ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridTitle={t('lbl.DETAIL')} gridBtn={gridBtn1} totalCnt={totalCnt1} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid key={colKey1} ref={ref.gridRef2} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default KpWdShortageResultTab1Detail;
