/*
 ############################################################################
 # FiledataField	: StStockLotMonitoringDetail.tsx
 # Description		: 재고 > 재고현황 > 유통기한점검(Detail)
 # Author			: JeongHyeongCheol
 # Since			: 25.11.10
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Button, Form } from 'antd';
import FileSaver from 'file-saver';
// Utils
//types
// API Call Function
import { apiPostLargeDataExcel } from '@/api/st/apiStStockLotMonitoring';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import TabsArray from '@/components/common/TabsArray';

interface StStockLotMonitoringDetailProps {
	form?: any;
	gridRef2?: any;
	gridRef3?: any;
	gridData?: Array<object>;
	totalCnt?: number;
	gridData2?: Array<object>;
	totalCnt2?: number;
	gridData3?: Array<object>;
	totalCnt3?: number;
	activeTabKey?: string;
	setActiveTabKey?: any;
}

const StStockLotMonitoringDetail = forwardRef((props: StStockLotMonitoringDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const {
		form,
		gridData,
		totalCnt,
		gridData2,
		totalCnt2,
		gridData3,
		totalCnt3,
		activeTabKey,
		setActiveTabKey,
		gridRef2,
		gridRef3,
	} = props;
	const { t } = useTranslation();

	// 합계
	const [isSkuSum, setIsSkuSum] = useState(true);
	const [isLocSkuSum, setIsLocSkuSum] = useState(true);

	// 그리드 헤더 세팅
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'organize',
			headerText: '창고',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'stocktype',
			headerText: '재고위치',
		},
		{
			dataField: 'stockgrade',
			headerText: '재고속성',
		},
		{
			dataField: 'zone',
			headerText: '피킹존',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'loc',
			headerText: '로케이션',
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
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
			headerText: '상품명칭',
		},
		{
			dataField: 'storagetype',
			headerText: '저장조건',
		},
		{
			dataField: 'qtyperbox',
			headerText: '박스입수',
			dataType: 'numeric',
		},
		{
			headerText: '재고정보',
			children: [
				{
					dataField: 'uom',
					headerText: '단위',
				},
				{
					dataField: 'qty',
					headerText: '현재고수량',
					dataType: 'numeric',
					allowPoint: true, // 소수점 허용
					allowNegative: true,
					formatString: '#,##0.##',
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'), // 소비기한임박여부
		},
		// {
		// 	dataField: 'lottable01',
		// 	headerText: t('lbl.LOTTABLE01'), // 기준일(소비,제조)
		// 	dataType: 'string',
		// 	labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
		// 		if (!value) return '';
		// 		if (typeof value === 'string' && value.length === 8) {
		// 			return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
		// 		}
		// 		return value;
		// 	},
		// },
		// {
		// 	dataField: 'durationtypeName',
		// 	headerText: '기준일(구분)',
		// 	dataType: 'default',
		// },
		{
			dataField: 'manufacturedt',
			headerText: '제조일자', // 제조일자
			dataType: 'string',
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				if (!value) return '';
				if (typeof value === 'string' && value.length === 8) {
					return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
				}
				return value;
			},
		},
		{
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataType: 'string',
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				if (!value) return '';
				if (typeof value === 'string' && value.length === 8) {
					return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
				}
				return value;
			},
		},
		{
			dataField: 'durationTerm',
			headerText: '소비기한(잔여/전체)', // DURATIONTERM
			dataType: 'numeric',
		},
		{
			dataField: 'persent',
			headerText: t('lbl.DURATION_RATE'), // '소비기한 잔여(%)'
			dataType: 'numeric',
		},
		{
			dataField: 'percentDiv',
			headerText: '소비기한 잔여(구분)',
			dataType: 'numeric',
		},
		{
			dataField: 'buyername',
			headerText: t('lbl.POMDCODE'), //  수급담당
		},
		{
			headerText: '주문일수' + '(' + t('lbl.MM') + ')', // 주문량(월)
			children: [
				{
					dataField: 'shipday1w',
					headerText: 'D-1' + t('lbl.MM'), // D-1월
					dataType: 'numeric',
					allowPoint: true, // 소수점 허용
					allowNegative: true,
					formatString: '#,##0.##',
				},
				{
					dataField: 'shipday2w',
					headerText: 'D-2' + t('lbl.MM'), // D-2월
					dataType: 'numeric',
					allowPoint: true, // 소수점 허용
					allowNegative: true,
					formatString: '#,##0.##',
				},
				{
					dataField: 'shipday3w',
					headerText: 'D-3' + t('lbl.MM'), // D-3월
					dataType: 'numeric',
					allowPoint: true, // 소수점 허용
					allowNegative: true,
					formatString: '#,##0.##',
				},
			],
		},
		{
			headerText: t('lbl.SOCNT') + '(' + t('lbl.MM') + ')', // 주문건수(월)
			children: [
				{
					dataField: 'ordcnt1w',
					headerText: 'D-1' + t('lbl.MM'), // D-1월
					dataType: 'numeric',
				},
				{
					dataField: 'ordcnt2w',
					headerText: 'D-2' + t('lbl.MM'), // D-2월
					dataType: 'numeric',
				},
				{
					dataField: 'ordcnt3w',
					headerText: 'D-3' + t('lbl.MM'), // D-3월
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: '출고량',
			children: [
				{
					dataField: 'shipqty1w',
					headerText: 'D-1' + t('lbl.MM'), // D-1월
					dataType: 'numeric',
					allowPoint: true, // 소수점 허용
					allowNegative: true,
					formatString: '#,##0.##',
				},
				{
					dataField: 'shipqty2w',
					headerText: 'D-2' + t('lbl.MM'), // D-2월
					dataType: 'numeric',
					allowPoint: true, // 소수점 허용
					allowNegative: true,
					formatString: '#,##0.##',
				},
				{
					dataField: 'shipqty3w',
					headerText: 'D-3' + t('lbl.MM'), // D-3월
					dataType: 'numeric',
					allowPoint: true, // 소수점 허용
					allowNegative: true,
					formatString: '#,##0.##',
				},
			],
		},

		{
			dataField: 'avg30',
			headerText: t('lbl.DAYAVG'), //   일평균
			dataType: 'numeric',
			allowPoint: true, // 소수점 허용
			allowNegative: true,
			formatString: '#,##0.##',
		},
		{
			dataField: 'exhaustiondt',
			headerText: '소진예상시점',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'exhaustionchk',
			headerText: '소진가능여부',
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				if (item.exhaustionchk === '소진불가') {
					return { fontWeight: 'bold' };
				} else {
					return { fontWeight: null };
				}
			},
		},
	];

	// 요약 그리드 헤더 세팅
	const gridCol2 = [
		{
			dataField: 'gubun',
			headerText: '구분',
			dataType: 'code',
		},
		{
			dataField: 'percent',
			headerText: '잔여 소비기한',
			dataType: 'code',
		},
		{
			dataField: 'type',
			headerText: '전용/범용',
			dataType: 'code',
		},
		{
			dataField: 'colM0',
			headerText: '1',
			dataType: 'numeric',
		},
		{
			dataField: 'colM1',
			headerText: '2',
			dataType: 'numeric',
		},
		{
			dataField: 'colM2',
			headerText: '3',
			dataType: 'numeric',
		},
		{
			dataField: 'colM3',
			headerText: '4',
			dataType: 'numeric',
		},
		{
			dataField: 'colM4',
			headerText: '5',
			dataType: 'numeric',
		},
		{
			dataField: 'colTotal',
			headerText: '6',
			dataType: 'numeric',
		},
	];

	// 요약 그리드 헤더 세팅
	const gridCol3 = [
		{
			dataField: 'gubun',
			headerText: '구분',
			dataType: 'code',
		},
		{
			dataField: 'type',
			headerText: '전용/범용',
			dataType: 'code',
		},
		{
			dataField: 'storagetype',
			headerText: '저장조건',
			dataType: 'code',
		},
		{
			dataField: 'colM0',
			headerText: '1',
			dataType: 'numeric',
		},
		{
			dataField: 'colM1',
			headerText: '2',
			dataType: 'numeric',
		},
		{
			dataField: 'colM2',
			headerText: '3',
			dataType: 'numeric',
		},
		{
			dataField: 'colM3',
			headerText: '4',
			dataType: 'numeric',
		},
		{
			dataField: 'colM4',
			headerText: '5',
			dataType: 'numeric',
		},
		{
			dataField: 'colTotal',
			headerText: '6',
			dataType: 'numeric',
		},
	];

	// footerLayout: 그리드 하단 합계(footer) 행 정의
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'qty', // 현재고수량 합계
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: false,
		enableFilter: true,
		showFooter: true,
		groupingFields: ['loc', 'sku'] as string[], // 로케이션/상품별 합계 표시 여부
		// 합계(소계) 설정
		groupingSummary: {
			dataFields: [
				'qtyperbox',
				'qty',
				'shipday1w',
				'shipday2w',
				'shipday3w',
				'ordcnt1w',
				'ordcnt2w',
				'ordcnt3w',
				'shipqty1w',
				'shipqty2w',
				'shipqty3w',
				'avg30',
			],
			rows: [
				{
					// 소계 행 텍스트 설정
					text: {
						sku: '$value', // 상품코드는 원래 값만 표시
						skuname: '소계', // 상품명칭에 "소계" 표시
					},
				},
			],
		},
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: false,
		// 그룹핑 후 셀 병합 실행
		enableCellMerge: true,
		// enableCellMerge 할 때 실제로 rowspan 적용 시킬지 여부
		// 만약 false 설정하면 실제 병합은 하지 않고(rowspan 적용 시키지 않고) 최상단에 값만 출력 시킵니다.
		cellMergeRowSpan: false,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false,
		// 그룹핑 시 그룹핑 필드들이 첫 열로 옮겨지는 것을 막고
		// 원래 칼럼 레이아웃 순서를 유지할지 여부를 지정합니다.(기본값 : false);
		keepColumnOrderOnGrouping: true,
		keepOrderingOnGrouping: true,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: function (rowIndex: any, item: any) {
			// 그룹핑
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)
				switch (
					item._$depth // 계층형의 depth 비교 연산
				) {
					case 2:
						return 'gc-user23';
					case 3:
						return 'aui-grid-row-depth2-style';
					case 4:
						return 'aui-grid-row-depth3-style';
					default:
						return 'aui-grid-row-depth-default-style';
				}
			}
			// 유통기한 backgroundColor: setDurationColor(item),
			if (item.persent) {
				const percentage = parseFloat(item.persent.replace('%', '')); // 값을 숫자로 변환
				if (percentage < 15) return 'aui-grid-row-background-red';
				else if (percentage < 30) return 'aui-grid-row-background-yellow';
				else return null;
			}
		},
	};

	const gridProps2 = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: false,
		enableFilter: true,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.gubun === '전체') return;
			if (item.percent === '합계') {
				return 'gc-user23';
			}
			if (item.type === '소계') {
				return 'aui-grid-row-depth2-style';
			}
		},
	};

	const gridProps3 = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: false,
		enableFilter: true,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.gubun === '전체') return;
			if (item.type === '합계') {
				return 'gc-user23';
			}
			if (item.storagetype === '소계') {
				return 'aui-grid-row-depth2-style';
			}
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const skuSum = () => {
		if (isSkuSum) {
			gridRef.current.setGroupBy(['sku'], {
				dataFields: [
					'qtyperbox',
					'qty',
					'shipday1w',
					'shipday2w',
					'shipday3w',
					'ordcnt1w',
					'ordcnt2w',
					'ordcnt3w',
					'shipqty1w',
					'shipqty2w',
					'shipqty3w',
					'avg30',
				],
				labelTexts: ['소계'],
				rows: [
					{
						text: {
							sku: '$value',
							skuname: '소계',
						},
					},
				],
			});
			// gridRef.current.setSorting([{ dataField: 'loc', sortType: 1 }]);
		} else {
			gridRef.current.setGroupBy([]);
		}
		setIsSkuSum(prevState => !prevState);
	};
	const locSkuSum = () => {
		if (isLocSkuSum) {
			gridRef.current.setGroupBy(['loc', 'sku']);
		} else {
			gridRef.current.setGroupBy([]);
		}
		setIsLocSkuSum(prevState => !prevState);
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	const onExcelDownloadClick = () => {
		const params = form.getFieldsValue();
		const searchZone = form.getFieldValue('zone');
		params.zone = searchZone ? String(searchZone) : null;

		apiPostLargeDataExcel(params).then(res => {
			FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
		});
	};

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '유통기한점검',
			children: (
				<AGrid className="contain-wrap" style={{ marginTop: '15px' }}>
					<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={totalCnt}>
						<Form className="flex-wrap">
							<Button htmlType="submit" onClick={skuSum}>
								상품별 합계
							</Button>
							<Button htmlType="submit" className="ml5" onClick={locSkuSum}>
								로케이션/상품별 합계
							</Button>
							<Button className="ml5" onClick={onExcelDownloadClick}>
								{t('lbl.EXCELDOWNLOAD')}
							</Button>
						</Form>
					</GridTopBtn>
					<GridAutoHeight id="check-expiration-date">
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
					</GridAutoHeight>
				</AGrid>
			),
		},
		{
			key: '2',
			label: '요약장표(소비기한)',
			children: (
				<AGrid className="h100" style={{ marginTop: '15px' }}>
					<GridTopBtn gridTitle={'목록'} totalCnt={totalCnt2} />
					<GridAutoHeight id="summary-table-expiration-date">
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
					</GridAutoHeight>
				</AGrid>
			),
		},
		{
			key: '3',
			label: '요약장표(저장조건)',
			children: (
				<AGrid className="h100" style={{ marginTop: '15px' }}>
					<GridTopBtn gridTitle={'목록'} totalCnt={totalCnt3} />
					<GridAutoHeight id="storage-conditions">
						<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
					</GridAutoHeight>
				</AGrid>
			),
		},
	];

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		setActiveTabKey(key);
		if (key === '1') {
			if (gridRef.current) {
				gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			if (gridRef2.current) {
				gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '3') {
			if (gridRef3.current) {
				gridRef3.current?.resize('100%', '100%');
			}
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setSelectionByIndex(0, 0);

			// setTotalCount(props.gridData.length);
			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			if (gridData.length > 0) {
				gridRefCur.setGridData(gridData);
				gridRefCur.setGroupBy([]);
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);
	// grid data 변경 감지
	useEffect(() => {
		if (gridRef2.current) {
			// 첫 번째 행을 헤더용으로 분리
			const headerRow: any = gridData2[0];

			// 실제 그리드에 들어갈 데이터 (첫 행 제거)
			const bodyData = gridData2.slice(1);

			// 헤더 텍스트 변경
			const headerMap = [
				{ field: 'colM0', key: 'colM0' },
				{ field: 'colM1', key: 'colM1' },
				{ field: 'colM2', key: 'colM2' },
				{ field: 'colM3', key: 'colM3' },
				{ field: 'colM4', key: 'colM4' },
				{ field: 'colTotal', key: 'colTotal' },
			];

			headerMap.forEach((col: any) => {
				gridRef2.current.setColumnPropByDataField(col.field, {
					headerText: headerRow[col.key] ?? '',
				});
			});
			// 데이터 세팅 (첫 행 제외)
			gridRef2.current.setGridData(bodyData);
			const colSizeList = gridRef2.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef2.current.setColumnSizeList(colSizeList);
		}
	}, [gridData2]);

	// grid data 변경 감지
	useEffect(() => {
		if (gridRef3.current) {
			// 첫 번째 행을 헤더용으로 분리
			const headerRow: any = gridData3[0];

			// 실제 그리드에 들어갈 데이터 (첫 행 제거)
			const bodyData = gridData3.slice(1);

			// 헤더 텍스트 변경
			const headerMap = [
				{ field: 'colM0', key: 'colM0' },
				{ field: 'colM1', key: 'colM1' },
				{ field: 'colM2', key: 'colM2' },
				{ field: 'colM3', key: 'colM3' },
				{ field: 'colM4', key: 'colM4' },
				{ field: 'colTotal', key: 'colTotal' },
			];

			headerMap.forEach((col: any) => {
				gridRef3.current.setColumnPropByDataField(col.field, {
					headerText: headerRow[col.key] ?? '',
				});
			});
			// 데이터 세팅 (첫 행 제외)
			gridRef3.current.setGridData(bodyData);
			const colSizeList = gridRef3.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef3.current.setColumnSizeList(colSizeList);
		}
	}, [gridData3]);

	return (
		<TabsArray
			activeKey={activeTabKey}
			onChange={key => {
				tabClick(key, null);
			}}
			items={tabs}
			destroyInactiveTabPane={false}
		/>
	);
});
export default StStockLotMonitoringDetail;
