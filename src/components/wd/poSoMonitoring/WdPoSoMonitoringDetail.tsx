/*
 ############################################################################
 # FiledataField	: WdPoSoMonitoringDetail.tsx
 # Description		: 출고 > 출고현황 > 일배PO/SO연결모니터링 조회 Grid Header
 # Author			: 공두경
 # Since			: 25.06.23
 ############################################################################
*/

import { forwardRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Type
import { GridBtnPropsType } from '@/types/common';

// Components
import { apiSearchWdPoSoMonitoringGrid1List } from '@/api/wd/apiWdPoSoMonitoring';
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// API

// Store

// Libs

// Utils

const WdPoSoMonitoringDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();

	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);

	const fnMathSum = (columnValues: any) => {
		const sum = columnValues?.reduce((acc: number, currVal: number) => acc + currVal, 0) || 0;
		return sum % 1 === 0 ? sum : sum.toFixed(1);
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const params = {
			magamcode: selectedRow[0].magamcode,
			slipdt: selectedRow[0].slipdt,
			dccode: selectedRow[0].dccode,
		};
		apiSearchWdPoSoMonitoringGrid1List(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			//setTotalCnt(res.data.length);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};
	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 초기화
	const gridCol = useMemo(
		() => [
			{ dataField: 'slipdt', headerText: t('lbl.SLIPDT'), dataType: 'code', visible: false },
			{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code' },
			{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code' },
			{ dataField: 'magamcode', headerText: t('lbl.MAGAMCODE'), dataType: 'code' },
			{ dataField: 'magamname', headerText: t('lbl.MAGAMNAME'), dataType: 'code' },
			{ dataField: 'closetime', headerText: t('lbl.CLOSETIME'), dataType: 'code' },
			{ dataField: 'socnt', headerText: t('lbl.SOCNT'), dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'mapcnt', headerText: t('lbl.MAPCNT'), dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'diffcnt', headerText: t('lbl.DIFFCNT'), dataType: 'numeric', formatString: '#,##0.##' },
			{
				dataField: 'maprate',
				headerText: t('lbl.MAPRATE'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				// style: { background: 'red', 'background-color': 'red' },
				className: 'bg-red',
				styleFunction: (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: any,
					item: any,
					dataField: any,
				) => (value < 20 ? 'bg-red fc-white' : value < 80 ? 'bg-blue fc-white' : 'bg-green fc-white'),
			},
		],
		[t],
	);

	const footerLayout = useMemo(
		() => [
			{
				labelText: '합계',
				positionField: 'dccode',
			},
			{
				dataField: 'socnt',
				positionField: 'socnt',
				expFunction: fnMathSum,
				formatString: '#,##0.###',
				postfix: '',
				dataType: 'numeric',
				style: 'right',
			},
			{
				dataField: 'mapcnt',
				positionField: 'mapcnt',
				expFunction: fnMathSum,
				formatString: '#,##0.###',
				postfix: '',
				dataType: 'numeric',
				style: 'right',
			},
			{
				dataField: 'diffcnt',
				positionField: 'diffcnt',
				expFunction: fnMathSum,
				formatString: '#,##0.###',
				postfix: '',
				dataType: 'numeric',
				style: 'right',
			},
		],
		[],
	);

	// 그리드 속성
	const gridProps = useMemo(
		() => ({
			editable: false,

			showStateColumn: false, // row 편집 여부
			enableColumnResize: true, // 열 사이즈 조정 여부
			showFooter: true,

			fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		}),
		[],
	);

	// 그리드 초기화
	const gridCol2 = useMemo(
		() => [
			{ dataField: 'toCustkey', headerText: t('lbl.TO_CUSTKEY'), dataType: 'code' },
			{ dataField: 'toCustname', headerText: t('lbl.TO_CUSTNAME') },
			{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code' },
			{ dataField: 'docno', headerText: t('lbl.DOCNO'), dataType: 'code' },
			{ dataField: 'docline', headerText: t('lbl.DOCLINE'), dataType: 'code' },
			{
				dataField: 'sku',
				headerText: t('lbl.SKU'),
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						ref.gridRef2.current.openPopup(
							{
								sku: e.item.sku,
							},
							'sku',
						);
					},
				},
			},
			{
				dataField: 'skuname',
				headerText: t('lbl.SKUNAME'),
				filter: {
					showIcon: true,
				},
			},
			{ dataField: 'serialyn', headerText: t('lbl.SERIALYN'), dataType: 'code' },
			{ dataField: 'skunotfixedamountyn', headerText: t('lbl.SKUNOTFIXEDAMOUNTYN'), dataType: 'code' },
			{ dataField: 'serialtypeSn', headerText: t('lbl.SERIALTYPE_SN2') },
			{ dataField: 'cancelqty', headerText: t('lbl.SHORTAGEQTY'), dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'openqty', headerText: t('lbl.ORDERQTY_WD'), dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'confirmqty', headerText: t('lbl.CONFIRMQTY_WD'), dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'mdcodeKp', headerText: t('lbl.MDCODE_KP'), dataType: 'code' },
		],
		[t],
	);

	const footerLayout2 = useMemo(
		() => [
			{ labelText: '', positionField: '#base' },
			{
				labelText: '합계',
				positionField: 'toCustkey',
			},
			{
				dataField: 'storeropenqty',
				positionField: 'storeropenqty',
				expFunction: fnMathSum,
				formatString: '#,##0.###',
				postfix: '',
				dataType: 'numeric',
				style: 'right',
			},
		],
		[],
	);

	// 그리드 속성
	const gridProps2 = useMemo(
		() => ({
			editable: false,

			showStateColumn: false, // row 편집 여부
			enableColumnResize: true, // 열 사이즈 조정 여부
			showFooter: true,

			fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		}),
		[],
	);

	// 그리드 버튼 설정
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

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
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem) return;

			// 이전 행 인덱스 갱신
			prevRowItem = event.primeCell.item;

			// 상세코드 조회
			searchDtl();
		});
	}, []);

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
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCount} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="상세" />
							<GridAutoHeight>
								<AUIGrid
									ref={ref.gridRef2}
									columnLayout={gridCol2}
									gridProps={gridProps2}
									footerLayout={footerLayout2}
								/>
							</GridAutoHeight>
						</AGrid>
					</>,
				]}
			/>
		</>
	);
});

export default WdPoSoMonitoringDetail;
