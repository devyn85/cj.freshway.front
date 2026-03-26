/*
 ############################################################################
 # FiledataField	: OmTnsfMissingToSTODetail.tsx
 # Description		: 주문 > 주문등록 > 누락분STO이체
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiGetMaster1PrintList, apiPostConfirmMasterList, apiPostSaveMasterList1 } from '@/api/om/apiOmTnsfMissingSTO';

// util

// types
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
interface OmTnsfMissingToSTODetailProps {
	gridData?: any;
	search?: any;
	searchVal?: any;
	searchParams?: any;
}

const OmTnsfMissingToSTODetail = forwardRef((props: OmTnsfMissingToSTODetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { gridData, search, searchVal, searchParams } = props;
	const [totalCnt, setTotalCnt] = useState(0);
	const { t } = useTranslation();
	gridRef.gridRef1 = useRef(null);
	/**
	 * 사용자 권한에 따른 물류센터 코드 리스트
	 */
	const userDccodeList = getUserDccodeList();
	//Antd Form 사용
	console.log('>>>>>>> gridData:', gridData);
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 자동발주내역 그리드 초기화
	const gridCol = [
		{
			dataField: 'toDccode',
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toDcname',
			headerText: t('lbl.FROM_DCCODE') + '명', // 공급센터명
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dcname',
			headerText: t('lbl.TO_DCCODE') + '명', // 공급받는센터명
			dataType: 'code',
			editable: false,
		},

		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',

			editable: false,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), // 상품명
			editable: false,
		},

		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
		},

		{
			dataField: 'uom',
			headerText: t('lbl.UOM_STO'), //이체단위
			dataType: 'code',
			editable: false,
		},

		{
			dataField: 'openqty',
			headerText: t('lbl.CURRENT_STOCK'), //현재고
			dataType: 'numeric',
			editable: false,
		},

		{
			dataField: 'supplyqty',
			headerText: '요청받은 수량', //요청받은 수량
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'stoStatus',
			headerText: t('진행상태'), // 대응여부
			editable: false,
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STO_STATUS', value)?.cdNm;
			},
		},
		{
			dataField: 'missMoveRespYn',
			headerText: t('lbl.RESPONSE_YN'), // 대응여부
			editable: true,
			renderer: {
				type: 'CheckBoxEditRenderer',
				showLabel: false, // 참, 거짓 텍스트 출력여부( 기본값 false )
				editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				checkValue: 'Y', // true, false 인 경우가 기본
				unCheckValue: 'N',
				// 체크박스 disabled 함수
			},
		},
		{
			dataField: 'respNm',
			headerText: '대응담당자(받는센터)',
			dataType: 'manager',
			editable: false,
		},
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'), // 등록자
			dataType: 'manager',
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'), //등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'), // 수정자
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];

	const gridCol1 = [
		{
			dataField: 'toDcname',
			headerText: t('lbl.FROM_DCCODE') + '명', // 공급센터명
			dataType: 'code',
			editable: false,
		},

		{
			dataField: 'dcname',
			headerText: t('lbl.TO_DCCODE') + '명', // 공급받는센터명
			dataType: 'code',
			editable: false,
		},

		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',

			editable: false,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), // 상품명
			editable: false,
		},

		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
		},

		{
			dataField: 'uom',
			headerText: t('lbl.UOM_STO'), //이체단위
			dataType: 'code',
			editable: false,
		},

		{
			dataField: 'supplyqty',
			headerText: '요청받은 수량', //요청받은 수량
			dataType: 'numeric',
			editable: false,
		},
	];

	// 자동발주내역 그리드 속성
	const gridProps = {
		editable: true,
		enableFilter: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		// showCustomRowCheckColumn: true,

		// // useGroupingPanel: true,
		// // 차례로 country, product, name 순으로 그룹핑을 합니다.
		// // 즉, 각 나라별, 각 제품을 구매한 사용자로 그룹핑
		// groupingFields: [
		// 	'toDccode',
		// 	'toDcname',
		// 	'dccode',
		// 	'dcname',
		// 	'sku',
		// 	'skuname',
		// 	'loc',
		// 	'uom',
		// 	'orderqty',
		// 	'missOrderqty',
		// 	'openqty',
		// 	'openqty1',
		// 	'openqty2',
		// 	'openqty3',
		// 	'respYn',
		// 	'respNm',
		// ], // 로케이션/상품별 합계 표시 여부
		// groupingSummary: {
		// 	dataFields: ['supplyqty'],
		// 	labelTexts: [''], // 소계 행 라벨 텍스트
		// 	excepts: [
		// 		'toDccode',
		// 		'toDcname',
		// 		'dccode',
		// 		'dcname',
		// 		'sku',
		// 		'skuname',
		// 		'loc',
		// 		'uom',
		// 		'orderqty',
		// 		'missOrderqty',
		// 		'openqty',
		// 		'openqty1',
		// 		'openqty2',
		// 		'orderDccode',
		// 		'respYn',
		// 		'respNm',
		// 	],
		// 	rows: [
		// 		{
		// 			operation: 'SUM',
		// 			// 썸머리 필드에 임의의 텍스트 설정
		// 			text: t('lbl.TOTAL'), // 합계
		// 		},
		// 	],
		// },
		showStateColumn: false, // row 편집 여부
		// enableCellMerge: true, // 그리드 머지에 필요한 속성

		//showFooter: true,           // 불필요한 경우 삭제 해도 됨
		displayTreeOpen: true,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false, // 여백 윗줄 지우기.
		// 그룹핑 시 그룹핑 필드들이 첫 열로 옮겨지는 것을 막고
		// 원래 칼럼 레이아웃 순서를 유지할지 여부를 지정합니다.(기본값 : false);
		keepColumnOrderOnGrouping: true,
		enableMovingColumn: true,
		editableMergedCellsAll: true,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: function (rowIndex: any, item: any) {
			// 그룹핑
			if (item._$isGroupSumField && item?.openqty3 === '합계') {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)

				return 'aui-grid-row-depth2-style';
			}
		},
		editableOnGroupFields: true,
	};
	const gridProps1 = {
		editable: true,
		enableFilter: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인
		const params = gridRef.current.getChangedData({ validationYn: false });
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}
		// //console.log(params);
		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList1(params).then((res: any) => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							search();
						},
					});
				}
			});
		});
	};

	/**
	 * 확정
	 * @returns {void}
	 */
	const confirmMasterList = () => {
		// 변경 데이터 확인
		const params = gridRef.current.getCustomCheckedRowItems();

		const isConfirm = params.some((item: any) => item.respYn === 'Y');
		if (isConfirm || params.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}

		const updateLength = params.filter((item: any) => item.respYn === 'N').length;
		const newLength = params.length - updateLength;
		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${newLength}건
				수정 : ${updateLength}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostConfirmMasterList(params).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							search();
						},
					});
				}
			});
		});
	};
	const downloadExcel = (colSizeList: any) => {
		// const result: any = {};
		// gridCol 배열을 순회하면서 dataField와 colsize를 매칭
		/*
		for (let i = 0; i < gridCol.length; i++) {
			const dataField = gridCol[i].dataField;
			const size = colSizeList[i];
			if (dataField) {
				result[dataField] = size;
			}
		}*/
		// collectColumnSizes(gridCol3, colSizeList, result);

		// //console.log('result', result);
		apiGetMaster1PrintList(searchParams).then(res => {
			if (res.data) {
				// setGridData1(res.data);
				// setSearchParams(params);
				gridRef.gridRef1.current?.setGridData(res.data);
				const colSizeList = gridRef.gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.gridRef1.current.setColumnSizeList(colSizeList);
				const params = {
					fileName: '물류센터간 C/D 누락분 요청(공급센터)',
					//columnSizeOfDataField: result,
					exportWithStyle: true, // 스타일 적용 여부
					progressBar: true,
					// exceptColumnFields: ['lottable01', 'duration', 'durationtype'],
				};

				gridRef.gridRef1.current?.exportToXlsxGrid(params);
			}
		});
		// 구해진 칼럼 사이즈를 적용 시킴.
		// gridRef.gridRef1.current.setColumnSizeList(colSizeList);
		// const params = {
		// 	fileName: '이력상품입고현황',
		// 	//columnSizeOfDataField: result,
		// 	exportWithStyle: true, // 스타일 적용 여부
		// 	progressBar: true,
		// 	exceptColumnFields: ['lottable01', 'duration', 'durationtype'],
		// };

		// gridRef.gridRef1.current?.exportToXlsxGrid(params);
	};
	/**
	 * =====================================================================
	 *	grid button set
	 * =====================================================================
	 */

	/**
	 * 행삽입
	 * @returns {void}
	 */
	const insertRow = () => {
		const selectedRowCurTmp = gridRef.current.getCheckedRowItems()[0];
		if (!selectedRowCurTmp || selectedRowCurTmp?.item?.respYn === 'Y') return; // 선택된 행이 없거나 이미 확정처리인경우 return 처리
		const initValue = {
			...selectedRowCurTmp?.item,
			orderDccode: null,
			supplyqty: null,
			status: 'I',
		};
		const addedRowIndex = selectedRowCurTmp['rowIndex'] + 1;

		// 신규행 추가
		gridRef.current.addRow(initValue, addedRowIndex);
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // excelDownload
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: downloadExcel,
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	const initEvent = () => {
		/**
		 * 에디팅 시작 이벤트 바인딩
		 * @param {any} event 이벤트
		 */
		gridRef.current.bind('cellEditBegin', function (event: any) {
			// 대응여부 Y 아닐때만 수정 가능
			if (event.item.respYn === 'Y') {
				return false;
			} else {
				return true;
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		gridRef?.current.setGridData(gridData);
		if (gridData.length > 0) {
			gridRef?.current.setColumnPropByDataField('openqty1', { headerText: (gridData[0]?.dcname1 || '') + '(1순위)' });
			gridRef?.current.setColumnPropByDataField('openqty2', { headerText: (gridData[0]?.dcname2 || '') + '(2순위)' });
			gridRef?.current.setColumnPropByDataField('openqty3', { headerText: (gridData[0]?.dcname3 || '') + '(3순위)' });

			setTotalCnt(gridData.length);
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList1 = gridRef?.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef?.current.setColumnSizeList(colSizeList1);
			gridRef?.current.setSelectionByIndex(0);
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<AGrid className={'dp-none'}>
				<AUIGrid ref={gridRef.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
			</AGrid>
		</>
	);
});

export default OmTnsfMissingToSTODetail;
