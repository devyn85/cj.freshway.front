/*
 ############################################################################
 # FiledataField    : KpKxCloseT14Detail.tsx
 # Description      : I/F관리
 # Author           : sss
 # Since            : 25.07.04
 ############################################################################
*/
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';

// Component

// Type

// API
import {
	apiGetDataIfStatusDetailList,
	apiPostSaveDuplicateCostCd,
	apiPostSaveDuplicateSRM1300,
	apiPostSaveIFTables,
} from '@/api/kp/apiKpKxClose';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const KpKxCloseT14Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, search } = props; // Antd Form
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);
	const bCheckYnFlag = { current: false }; // 그리드 Props
	const selectedIfFlagRef = useRef<string>('E'); // 선택된 ifFlag 전역변수

	// Declare react Ref(2/4)
	ref.gridRef = useRef<any>(null);
	ref.gridRef1 = useRef<any>(null);
	const masterKey = useRef<string | null>(null); // 마스터키
	const initialDataRef = useRef<any[]>([]); // 초기 데이터 저장

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/*
	 * 상세 조회
	 */
	const searchDetailList = (ifFlag?: string) => {
		const finalIfFlag = ifFlag || selectedIfFlagRef.current;
		ref.gridRef1.current?.clearGridData();

		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		if (!selectedRow || !selectedRow[0]) return;

		const deliveryDateFrom = commUtil.isNull(form.getFieldValue('ifDateRange'))
			? ''
			: form.getFieldValue('ifDateRange')[0].format('YYYYMMDD');
		const deliveryDateTo = commUtil.isNull(form.getFieldValue('ifDateRange'))
			? ''
			: form.getFieldValue('ifDateRange')[1].format('YYYYMMDD');

		const params = {
			...form.getFieldsValue(),
			deliveryDateFrom: deliveryDateFrom,
			deliveryDateTo: deliveryDateTo,
			ifId: selectedRow[0].ifId,
			ifFlag: finalIfFlag,
		};
		apiGetDataIfStatusDetailList(params).then(res => {
			const gridData = res.data;
			const gridRef = ref.gridRef1.current;
			if (gridRef) {
				gridRef?.setGridData(gridData);
				gridRef?.setSelectionByIndex(0, 0);

				if (gridData.length > 0) {
					const colSizeList = gridRef.getFitColumnSizeList(true);
					gridRef.setColumnSizeList(colSizeList);
				}
			}
			setDetailTotalCnt(gridData.length);
		});
	};

	/**
	 * 선택된 마스터 키 저장
	 */
	const captureMaskterKey = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		if (selectedRow && selectedRow[0]?.ifId) {
			masterKey.current = selectedRow[0].ifId;
		}
	};

	/**
	 * 저장 - 코스트센터
	 */
	const saveDuplicateCostCd = async () => {
		const gridRef = ref.gridRef.current;
		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				dummy: 'dummy',
			};

			apiPostSaveDuplicateCostCd(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, `${res.data?.processCnt || 0}건 처리되었습니다`);
					captureMaskterKey(); // 저장 후 재조회 시 선택된 KEY 기준으로 그리드 포커스 이동(1/2)
					props.search();
				}
			});
		});
	};

	/**
	 * SRM1300 저장
	 */
	const saveDuplicateSRM1300 = async () => {
		const gridRef = ref.gridRef.current;
		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				dummy: 'dummy',
			};

			apiPostSaveDuplicateSRM1300(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, `${res.data?.processCnt || 0}건 처리되었습니다`);
					captureMaskterKey();
					props.search();
				}
			});
		});
	};

	/**
	 * 전체 체크
	 */
	const allSelectGridData = () => {
		const gridRef = ref.gridRef1.current;
		if (gridRef) {
			const gridData = gridRef.getGridData();
			for (let i = 0; i < gridData.length; i++) {
				gridRef.setCheckedRowByIndex(i, true);
			}
		}
	};

	/**
	 * 오류 재처리 저장
	 */
	const saveIRe = async () => {
		const gridRef = ref.gridRef1.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				ifFlag: 'N',
				saveList10: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			apiPostSaveIFTables(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, `${res.data?.processCnt || 0}건 처리되었습니다`);
					props.search();
				}
			});
		});
	};

	/**
	 * 예외처리 저장
	 */
	const saveExcp = async () => {
		const gridRef = ref.gridRef1.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				ifFlag: 'K',
				saveList11: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			captureMaskterKey();
			apiPostSaveIFTables(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, `${res.data?.processCnt || 0}건 처리되었습니다`);
					props.search();
				}
			});
		});
	};

	const getGridCol = () => {
		return [
			{ dataField: 'ifId', headerText: t('lbl.IF_ID'), width: 80, dataType: 'text', textAlign: 'left' }, // IF_ID
			{ dataField: 'ifName', headerText: 'IF명', width: 80, dataType: 'text', textAlign: 'left' }, // IF명
			{
				dataField: 'statusE',
				headerText: 'STATUS_E', // STATUS_E
				width: 80,
				dataType: 'numeric',
				textAlign: 'right',
				styleFunction: () => 'color-danger',
			},
			{
				dataField: 'statusP',
				headerText: 'STATUS_P',
				width: 80,
				dataType: 'numeric',
				textAlign: 'right',
				styleFunction: () => 'text-decoration-underline',
			}, // STATUS_P
			{
				dataField: 'statusN',
				headerText: 'STATUS_N',
				width: 80,
				dataType: 'numeric',
				textAlign: 'right',
				styleFunction: () => 'text-decoration-underline',
			}, // STATUS_N
			{
				dataField: 'statusZ',
				headerText: 'STATUS_Z',
				width: 80,
				dataType: 'numeric',
				textAlign: 'right',
				styleFunction: () => 'text-decoration-underline',
			}, // STATUS_Z
			{
				dataField: 'statusK',
				headerText: 'STATUS_K',
				width: 80,
				dataType: 'numeric',
				textAlign: 'right',
				styleFunction: () => 'text-decoration-underline',
			}, // STATUS_K
			{
				dataField: 'statusY',
				headerText: 'STATUS_Y',
				width: 80,
				dataType: 'numeric',
				textAlign: 'right',
				styleFunction: () => 'text-decoration-underline',
			}, // STATUS_Y
			{
				dataField: 'statusS',
				headerText: 'STATUS_S',
				width: 80,
				dataType: 'numeric',
				textAlign: 'right',
				styleFunction: () => 'text-decoration-underline',
			}, // STATUS_S
		];
	};

	const gridProps = {
		fillColumnSizeMode: true,
	};

	const getGridCol1 = () => {
		return [
			{ dataField: 'ifId', headerText: t('lbl.IF_ID'), width: 80 }, // IF_ID
			{ dataField: 'ifDestination', headerText: t('lbl.IF_DESTINATION'), width: 80 }, // 목적지
			{ dataField: 'ifType', headerText: t('IF_TYPE'), width: 80 }, // IF_TYPE
			{ dataField: 'ifFlag', headerText: t('lbl.IF_FLAG'), width: 80 }, // I/F구분
			{ dataField: 'ifMemo', headerText: t('lbl.IF_MEMO'), width: 80 }, // IF 메모
			{ dataField: 'serialkey', headerText: t('lbl.SERIALKEY'), width: 80 }, // 테이블시리얼번호
			{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 80 }, // DCCODE
			{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 80 }, // 창고
			{ dataField: 'docno', headerText: t('lbl.DOCNO'), width: 80 }, // 문서번호
			{ dataField: 'docline', headerText: t('lbl.DOCLINE'), width: 80 }, // 품목번호
			{ dataField: 'slipno', headerText: t('lbl.SLIPNO'), width: 80 }, // 전표번호
			{ dataField: 'slipline', headerText: t('lbl.SLIPLINE'), width: 80 }, // 전표라인
			{ dataField: 'sku', headerText: t('lbl.SKU'), width: 80 }, // 상품코드
			{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), width: 80 }, // ADDDATE
		];
	};

	const gridProps1 = {
		editable: false,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: false, // 성능개선(1/3)
		independentAllCheckBox: false, // 성능개선(2/3)
		fillColumnSizeMode: true,
		// 전체 선택 체크박스가 독립적인 역할을 할지 여부
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger';
			}
			return '';
		},
	};

	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: t('코스트센터'), // 코스트센터
				authType: 'save', // 권한
				callBackFn: saveDuplicateCostCd,
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
				btnLabel: t('SRM1300'), // SRM1300
				authType: 'save', // 권한
				callBackFn: saveDuplicateSRM1300,
			},
			// {
			// 	btnType: 'btn3', // 사용자 정의버튼3
			// 	btnLabel: t('전체체크'), // 전체체크
			// 	authType: 'save', // 권한
			// 	callBackFn: allSelectGridData,
			// },
			{
				btnType: 'btn4', // 사용자 정의버튼4
				btnLabel: t('재처리'), // 재처리
				authType: 'save', // 권한
				callBackFn: saveIRe,
			},
			{
				btnType: 'btn5', // 사용자 정의버튼5
				btnLabel: t('예외처리'), // 예외처리
				authType: 'save', // 권한
				callBackFn: saveExcp,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;

		if (gridRef) {
			gridRef?.setGridData(props.data);
			if (props.data.length > 0) {
				// START.저장 후 재조회 시 선택된 KEY 기준으로 그리드 포커스 이동(2/2)
				let row = 0;
				if (masterKey.current) {
					const foundRow = props.data.findIndex((item: any) => item.ifId === masterKey.current);
					if (foundRow >= 0) row = foundRow;
				}
				gridRef?.setSelectionByIndex(row, 0);
				masterKey.current = props.data[row]?.ifId ?? masterKey.current;
				// END.저장 후 재조회 시 선택된 KEY 기준으로 그리드 포커스 이동(2/2)

				//
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
				// 저장 후 재조회 시 선택된 ifFlag 기준으로 상세 조회
				searchDetailList();
			} else {
				gridRef?.clearGridData();
				setDetailTotalCnt(0);
			}
		}
	}, [props.data]);

	// 성능개선(3/3) - 그리드 이벤트 바인딩(rowCheckClick:필요시, rowAllCheckClick:필수)
	useEffect(() => {
		// 이벤트. 체크박스 클릭 시 - 요건없음
		// ref.gridRef.current?.bind('rowCheckClick', function (event: any) {
		// 	if (bCheckYnFlag.current) return; // 전체 체크 처리 중에는 스킵
		// 	const { rowIndex, item, checked, rowIdValue } = event;
		// 	const gridRef = ref.gridRef.current;
		// 	const rowIdField = gridRef.getProp('rowIdField') || '_$uid';
		// 	const buildUpdatedRow = (rowItem: any) => ({
		// 		...rowItem,
		// 		[rowIdField]: rowItem[rowIdField],
		// 		toOrderqtyBox: rowItem.posbqtyBox ?? 0,
		// 		toOrderqtyEa: rowItem.posbqtyEa ?? 0,
		// 	});

		// 	if (checked) {
		// 		gridRef.updateRowsById([buildUpdatedRow(item)], true);
		// 	} else {
		// 		// 언체크: 편집 내용 복원 (addUncheckedRowsByIds 보다 빠름)
		// 		gridRef.restoreEditedRows(rowIndex);
		// 	}
		// });

		// 이벤트.전체 체크박스 클릭 시
		ref.gridRef.current?.bind('rowAllCheckClick', function (checked: any) {
			const gridRef = ref.gridRef1.current;
			bCheckYnFlag.current = true;

			if (checked) {
				const rows = gridRef.getGridData();
				const updatedRows = rows.map((item: any) => ({
					...item,
					//toOrderqtyBox: item.posbqtyBox ?? 0,
				}));

				if (updatedRows.length) {
					gridRef.updateRowsById(updatedRows, true);
				}
			} else {
				// 전체 언체크 시 초기 데이터 다시 로드
				const initialData = initialDataRef.current;
				gridRef?.setGridData(initialData);
				gridRef?.setSelectionByIndex(0, 0);

				if (initialData.length > 0) {
					const colSizeList = gridRef.getFitColumnSizeList(true);
					gridRef.setColumnSizeList(colSizeList);
				}
			}
			bCheckYnFlag.current = false;
		});
	}, []);

	useEffect(() => {
		ref.gridRef.current?.bind('cellDoubleClick', function (event: any) {
			const { dataField, item } = event;
			let nFlag = '';

			switch (dataField) {
				case 'statusE':
					nFlag = 'E';
					break;
				case 'statusP':
					nFlag = 'P';
					break;
				case 'statusN':
					nFlag = 'N';
					break;
				case 'statusZ':
					nFlag = 'Z';
					break;
				case 'statusK':
					nFlag = 'K';
					break;
				case 'statusY':
					nFlag = 'Y';
					break;
				case 'statusS':
					nFlag = 'S';
					break;
				default:
					nFlag = '';
			}

			selectedIfFlagRef.current = nFlag;
			if (item?.ifId) {
				masterKey.current = item.ifId;
			}
			searchDetailList(nFlag);
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={{ tGridRef: ref.gridRef }} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn1} gridTitle={t('lbl.DETAIL_VIEW')} totalCnt={detailTotalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={getGridCol1()} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default KpKxCloseT14Detail;
