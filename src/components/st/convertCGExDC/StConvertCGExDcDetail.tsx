/*
 ############################################################################
 # FiledataField	: StConvertCGExDcDetail.tsx
 # Description		: 외부비축재고속성변경 페이징 및 상세영역
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.05.25
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { round } from 'lodash';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Util
import commUtil from '@/util/commUtil';
import constants from '@/util/constants';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import CmSkuInfoPopup from '@/components/cm/popup/CmSkuInfoPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { useThrottle } from '@/hooks/useThrottle';

//API
import { getStConvertCgExDcDetailList } from '@/api/st/apiStConvertCGExDc';

//store
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import { InputText, SelectBox } from '@/components/common/custom/form';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import styled from 'styled-components';
const StConvertCGExDcDetail = forwardRef((props: any, refs: any) => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================

	const { t } = useTranslation();
	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);
	const [form] = Form.useForm();
	const [totalCntDtl, setTotalCntDtl] = useState(0);
	const [reasonCode, setReasonCode] = useState('');
	const [stockGrade, setStockGrade] = useState('');
	const [reasonMsg, setReasonMsg] = useState('');
	const [detailGridData, setDetailGridData] = useState([]);
	const [currentPageSrc, setCurrentPageSrc] = useState(1); // 현재 페이지 번호
	const [pageSize] = useState(constants.PAGE_INFO.PAGE_SIZE); // 페이지당 행 수

	refs.gridRef = useRef();
	refs.gridRef1 = useRef();
	const throttle = useThrottle(); // throttle 함수
	const refModal = useRef(null);
	const [apiParams, setApiParams] = useState({});

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// =====================================================================
	//  02. 함수
	// =====================================================================

	//조회 버튼 클릭시
	const searchDetail = () => {
		const gridRefCur = refs.gridRef.current;
		const gridRefCur1 = refs.gridRef1.current;
		const selectRow = gridRefCur?.getSelectedIndex()[0];
		const gridData = gridRefCur?.getGridData()[selectRow];
		// //console.log('selectionChange', gridData);
		// //console.log(props.searchForm.getFieldsValue());
		const params = props.searchForm.getFieldsValue();
		const searchParams = {
			stockGrade: gridData?.stockGrade,
			sku: params?.sku,
			blNo: params?.blNo,
			organize: params?.organize,
			...(params.blNo ? { searchBl: 'Y' } : {}),
		};

		// 초기화
		setCurrentPageSrc(1);
		gridRefCur1.clearGridData();
		searchScroll(1);
	};

	//페이징 처리
	const searchScroll = throttle((pageNo: number) => {
		// 조회 조건 설정
		const gridRefCur = refs.gridRef.current;
		const selectRow = gridRefCur?.getSelectedIndex()[0];
		const gridData = gridRefCur?.getGridData()[selectRow];
		const params = props.searchForm.getFieldsValue();

		const tt = pageNo || currentPageSrc;
		// // //console.log(pageSize);
		const searchParams = {
			stockGrade: gridData?.stockGrade,
			sku: params?.sku,
			blNo: params?.blNo,
			organize: params?.organize,
			dcCode: params?.dcCode,
			...(params.blNo ? { searchBl: 'Y' } : {}),
			startRow: 0 + (tt - 1) * pageSize,
			listCount: pageSize,
		};
		// // //console.log(searchParams);
		// 상세 영역 초기화
		setDetailGridData([]);

		// API 호출
		getStConvertCgExDcDetailList(searchParams).then(res => {
			// //console.log(res.data.list);
			setDetailGridData(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCntDtl(res.data.totalCount);
			}
			if (res.data.pageNum > -1) {
				setCurrentPageSrc(res.data.pageNum);
			}
		});
	}, 500);

	useScrollPagingAUIGrid({
		gridRef: refs.gridRef1,
		callbackWhenScrollToEnd: () => {
			setCurrentPageSrc((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: totalCntDtl,
	});

	//그리드 초기 세팅
	const gridInit = () => {
		const gridRefCur = refs.gridRef.current;
		const gridRefDtlCur = refs.gridRef1.current;

		if (gridRefCur) {
			gridRefCur.bind('selectionChange', function (event: any) {
				if (gridRefDtlCur.getChangedData().length > 0) {
					showConfirm(
						null,
						t('msg.MSG_COM_CFM_009'),
						() => {
							// //console.log('ok');
							searchDetail();
						},
						() => {
							// //console.log('cancle');
							return false;
						},
					);
				} else {
					searchDetail();
				}
			});
		}

		// 셀 편집시 로우 데이터 세팅
		if (gridRefDtlCur) {
			gridRefDtlCur.bind('cellEditBegin', function (event: any) {
				if (event.dataField === 'tranBox' && event.item.boxFlag === 'N') {
					return false;
				}
			});

			gridRefDtlCur.bind('cellEditEnd', function (event: any) {
				const gridData = gridRefDtlCur.getGridData()[event.rowIndex];
				// //console.log(gridData);

				if (event.dataField === 'tranQty') {
					if (event.value === '' || Number(event.value === '0')) {
						gridRefDtlCur.setCellValue(event.rowIndex, 'tranQty', 0);
						gridRefDtlCur.setCellValue(event.rowIndex, 'tranBox', 0);
					} else if (event.value > gridData.openQty) {
						showAlert('', '작업수량은 재고수량보다 클 수 없습니다.');
						gridRefDtlCur.setCellValue(event.rowIndex, 'tranQty', event.oldValue);
						return;
					} else {
						if (gridData.boxFlag === 'Y' && Number(gridData.avgWeight) > 0) {
							gridRefDtlCur.setCellValue(
								event.rowIndex,
								'tranBox',
								round(Number(event.value) / Number(gridData.avgWeight)) + '',
							);
						}
						if (Number(event.value) > 0 && Number(event.value) / Number(gridData.avgWeight) < 1) {
							gridRefDtlCur.setCellValue(event.rowIndex, 'tranBox', 1);
						}
						if (Number(event.value) < 0 && Number(event.value) / Number(gridData.avgWeight) > -1) {
							gridRefDtlCur.setCellValue(event.rowIndex, 'tranBox', -1);
						}
					}
				}
				if (event.dataField === 'tranBox') {
					if (event.value == '') {
						gridRefDtlCur.setCellValue(event.rowIndex, 'tranBox', '0');
					}
				}
			});
		}
		if (gridRefDtlCur) {
			gridRefDtlCur.bind('cellClick', function (event: any) {
				// //console.log(event.dataField);
				if (event.dataField === 'lotTable01') {
					// gridRefDtlCur.setSelectionByIndex(-1, -1);
					return false;
				}
			});
		}
		//상품 상세 조회 팝업 호출
		if (gridRefDtlCur) {
			gridRefDtlCur.bind('cellDoubleClick', handleCellDoubleClick);
		}
	};

	// 소비기한 color 세팅
	const durationCheck = (row: any) => {
		const gridRefDtlCur = refs.gridRef1.current;

		const gridData = gridRefDtlCur.getGridData()[row];

		return commUtil.gfnDurationColor(gridData.lotTable01, gridData.duration, gridData.durationType, 'default');
	};
	const optApl = () => {
		const gridRefDtl = refs.gridRef1.current;
		const checkedRows = gridRefDtl.getCheckedRowItems?.();
		if (checkedRows < 0) {
			return false;
		}
		checkedRows.forEach((row: any) => {
			const rowIndex = row.rowIndex;
			if (reasonCode) gridRefDtl.setCellValue(rowIndex, 'reasonCode', reasonCode);
			if (stockGrade) gridRefDtl.setCellValue(rowIndex, 'toStockGrade', stockGrade);
			if (reasonMsg) gridRefDtl.setCellValue(rowIndex, 'reasonMsg', reasonMsg);
		});
	};

	//저장 로직(저장 데이터 확인)
	const saveConfirm = () => {
		const gridRef = refs.gridRef1.current;
		if (!gridRef) return;

		// 1. 체크된 행들 가져오기
		const checkedRows = gridRef.getCheckedRowItems?.();
		// 2. 전체 row의 상태 정보 가져오기
		const gridDataWithState = gridRef.getGridDataWithState?.('state');
		const result = checkedRows
			.map((r: any) => gridDataWithState[r.rowIndex])
			.filter((row: any) => row.state === 'edited' || row.state === 'added');
		// //console.log(result);
		if (result.length === 0 || result === null) {
			showAlert('error', '수정된 데이터가 없습니다.');
			return;
		}
		for (const row of result) {
			// //console.log(row);
			if (row.tranQty === undefined || row.tranQty === '') {
				showAlert('error', '작업수량을 입력해주세요.');
				return;
			}
			if (row.toStockGrade === undefined || row.toStockGrade === '') {
				showAlert('error', 'TO재고속성을 입력해주세요.');
				return;
			}
			if (row.reasonCode === undefined || row.reasonCode === '') {
				showAlert('error', '사유코드를 입력해주세요.');
				return;
			}
			if (row.boxFlag === 'Y' && Number(row.tranQty) > 0 && Number(row.tranBox) === 0) {
				showAlert('error', '작업박스수량은 0보다 커야합니다.');
				return;
			}
		}
		// saveStConvertCgExDc(result).then(res => {
		// 	// showAlert('', res.statusMessage);
		// 	// searchDetail();
		// 	if (res.statusCode === 0) {
		// 		props.search();
		// 	}
		// });
		// loop transaction
		const saveParams = {
			apiUrl: '/api/st/convertCgExDc/v1.0/saveStConvertCgExDc',
			// avc_DCCODE: props.dccode,
			// avc_COMMAND: 'DELETE',
			fixdccode: props.dccode,
			saveDataList: result,
		};

		setLoopTrParams(saveParams);
		refTranModal.current.handlerOpen();
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		refTranModal.current.handlerClose();
		searchDetail();
		if (trProcessCnt) {
			if (trProcessCnt?.total === trProcessCnt?.success) {
				searchDetail();
			}
		}
	};

	//상품 조회 팝업 호출
	const handleCellDoubleClick = useCallback((event: any) => {
		if (event.dataField === 'sku') {
			const params = { sku: event.value };

			setApiParams(params);
			refModal.current.handlerOpen();
			return;
		}
	}, []);

	const closeEvent = useCallback((e: any) => {
		refModal.current.handlerClose();
	}, []);

	// 그리드 마스터 컬럼 설정
	const getGridHeaderCol = [
		{
			dataField: 'stockGrade',
			headerText: '재고속성',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STOCKGRADE', value)?.cdNm;
			},
		},
		{
			dataField: 'lotCnt',
			headerText: 'Line수',
		},
	];

	//상세 그리드 컬럼 설정
	const getGridDetailCol = [
		{ headerText: 'duration', dataField: 'duration', editable: false, visible: false },
		{ headerText: 'boxFlag', dataField: 'boxFlag', editable: false, visible: false },
		{ headerText: 'durationType', dataField: 'durationType', editable: false, visible: false },
		{ headerText: '물류센터', dataField: 'dcCode', editable: false },
		{ headerText: '창고', dataField: 'organize', editable: false },
		{ headerText: '창고명', dataField: 'organizeNm', editable: false },
		{ headerText: '로케이션', dataField: 'fromLoc', editable: false },
		{ headerText: '상품코드', dataField: 'sku', editable: false },
		{ headerText: '상품명칭', dataField: 'skuName', editable: false },
		{ headerText: '상품분류', dataField: 'mcName', editable: false },
		{ headerText: '단위', dataField: 'uom', editable: false, dataType: 'code' },

		/* ── 재고 수량 ───────────────────────────────────────────── */
		{ headerText: '현재고수량', dataField: 'qty', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{
			headerText: '가용재고수량',
			dataField: 'openQty',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{ headerText: '재고할당수량', dataField: 'qtyAllocated', dataType: 'numeric', editable: false },
		{ headerText: '피킹재고', dataField: 'qtyPicked', dataType: 'numeric', editable: false },

		{
			headerText: '작업수량',
			dataField: 'tranQty',
			dataType: 'numeric',
			editable: true,
			formatString: '#,##0.###',
			editRenderer: {
				type: 'InputEditRenderer',
				// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				// onlyNumeric: true, // 0~9만 입력가능
				onlyNumeric: false,
				allowPoint: true, // 소수점( . ) 도 허용할지 여부
				allowNegative: true, // 마이너스 부호(-) 허용 여부
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
				autoThousandSeparator: true, // 천단위 구분자 삽입 여부
				// decimalPrecision: 2, // 소숫점 2자리까지 허용
				// regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
			},
			require: true,
		},

		/* ── CALSTOCK 그룹 ──────────────────────────────────────── */
		{
			headerText: '환산재고',
			children: [
				{
					headerText: '평균중량',
					dataField: 'avgWeight',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.####',
				},
				{ headerText: '환산박스', dataField: 'calBox', editable: false, dataType: 'numeric' },
				{ headerText: '실박스', dataField: 'realCfmBox', editable: false, dataType: 'numeric' },
				{
					headerText: '작업박스수량',
					dataField: 'tranBox',
					dataType: 'numeric',
					// editable: false,
					editRenderer: {
						type: 'InputEditRenderer',
						// onlyNumeric: true,
						allowPoint: false, // 소수점 입력 불가
						allowNegative: false, // 음수 입력 불가
						// maxlength: 2,
						//2자리 제약
						// regExp: '^(?:[1-9]\\d?)$',
						//자릿수 제약은 없으
						regExp: '^[1-9]\\d*$',
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						// //console.log(item.rowStatus);
						if (!item || item.boxFlag == null) {
							// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
							return;
						}
						if (item?.boxFlag === 'Y') {
							// 편집 가능 class 삭제
							return 'isEdit';
						} else {
							// 편집 가능 class 추가
							// //console.log(item);
							refs.gridRef1.current.removeEditClass(columnIndex);
						}
					},
					// },
				},
			],
		},

		/* ── 재고 속성/사유 ──────────────────────────────────────── */
		{ headerText: 'FROM재고속성', dataField: 'stockGradeName', editable: false, dataType: 'code' },

		{
			headerText: 'TO재고속성',
			dataField: 'toStockGrade',
			// renderer: { type: 'list' }, // ds_stockGrade 바인딩
			editable: true,
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STOCKGRADE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},

		{
			headerText: '사유코드',
			dataField: 'reasonCode',
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('REASONCODE_CG', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: true,
		},

		{ headerText: '처리결과', dataField: 'reasonMsg', editable: true },

		/* ── 기간/LOTTABLE ──────────────────────────────────────── */
		{
			headerText: '기준일(유통,제조)',
			dataField: 'lotTable01',
			dataType: 'date',
			styleFunction(rowIdx: number, colIdx: number, value: any, rowItem: any, dataField: string) {
				const color = durationCheck(rowIdx);
				// //console.log(color + '  ' + rowIdx);
				return {
					background: color,
				};
			},
			editable: false,
		},
		{
			headerText: '소비기한(잔여/전체)',
			dataField: 'durationTerm',
			editable: false,
			dataType: 'code',
			styleFunction(rowIdx: number, colIdx: number, value: any, rowItem: any, dataField: string) {
				const color = durationCheck(rowIdx);
				// // //console.log(color + '  ' + rowIdx);
				return {
					background: color,
				};
			},
		},

		/* ── SERIALINFO 그룹 ────────────────────────────────────── */
		{
			headerText: '상품이력정보',
			children: [
				{ headerText: '이력번호', dataField: 'serialNo', editable: false },
				{ headerText: 'B/L번호', dataField: 'convSerialNo', editable: false },
			],
		},

		/* ── 기타 ──────────────────────────────────────────────── */
		{
			headerText: '재고ID',
			dataField: 'fromStockId',
			editable: false,
			styleFunction(rowIdx: number, colIdx: number, value: any, rowItem: any, dataField: string) {
				const color = durationCheck(rowIdx);
				// // //console.log(color + '  ' + rowIdx);
				return {
					background: color,
				};
			},
		},
		{ headerText: '구매전표', dataField: 'poKey', editable: false },
		{ headerText: '구매라인', dataField: 'poLine', editable: false },
	];

	//상세그리드 Props 설정
	const detailGridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableFilter: true,
	};

	//마스터 그리드 Props 설정
	const gridProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
	};

	//상세그리드 버튼 설정
	const gridDetailBtn: GridBtnPropsType = {
		tGridRef: refs.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: saveConfirm,
			},
		],
	};

	//마스터그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: refs.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// =====================================================================
	//  03. react hook event
	//  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	// =====================================================================

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = refs.gridRef.current;
		const gridRefDtlCur = refs.gridRef1.current;
		if (gridRefCur) {
			gridRefDtlCur?.clearGridData();
			gridRefCur?.setGridData(props.headerData);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
	}, [props.headerData]);

	// 페이징 처리
	useEffect(() => {
		const gridRefDtlCur = refs.gridRef1.current;
		if (gridRefDtlCur) {
			// //console.log('appenData');

			gridRefDtlCur.appendData(detailGridData);
			// //console.log(detailGridData);
			if (detailGridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefDtlCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefDtlCur.setColumnSizeList(colSizeList);
			}
			// //console.log(detailGridData);
		}
	}, [detailGridData]);

	//그리드 바인드 세팅
	useEffect(() => {
		gridInit();
	}, []);

	//페이징 처리
	useEffect(() => {
		if (currentPageSrc > 1) {
			searchScroll();
		}
	}, [currentPageSrc]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		refs.gridRef?.current?.resize?.('100%', '100%');
		refs.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				sizes={[15, 85]}
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.headerTotalCnt}></GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid columnLayout={getGridHeaderCol} gridProps={gridProps} ref={refs.gridRef} />
						</GridAutoHeight>
					</>,
					<>
						<CustomAGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL_VIEW')} gridBtn={gridDetailBtn} totalCnt={totalCntDtl}>
								<Form form={form} layout="inline" className="sect">
									<SelectBox
										name="reasonCode"
										label={t('lbl.REASONCODE')} // 사유코드
										options={getCommonCodeList('REASONCODE_CG')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										value={reasonCode}
										onChange={setReasonCode}
										className="bg-white"
									/>
									<InputText
										// label={'재고속성'}
										placeholder="변경 사유를 입력해주세요"
										name="resaonMsg"
										value={reasonMsg}
										onChange={(e: any) => setReasonMsg(e.target.value)}
									/>
									<SelectBox
										name="stockGrade"
										label="재고속성"
										options={getCommonCodeList('STOCKGRADE')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										value={stockGrade}
										onChange={setStockGrade}
										className="bg-white"
										style={{ width: 100 }}
									/>
									<Button type={'default'} onClick={optApl}>
										선택적용
									</Button>
								</Form>
							</GridTopBtn>
						</CustomAGrid>
						{/* 원래 디테일 그리드에 들어가야할 코드 */}
						<GridAutoHeight>
							<AUIGrid columnLayout={getGridDetailCol} gridProps={detailGridProps} ref={refs.gridRef1} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<CustomModal ref={refModal} width="1000px">
				<CmSkuInfoPopup titleName="상품상세" refModal={refModal} apiParams={apiParams} close={closeEvent} />
			</CustomModal>
			{/* 트랜잭션 팝업 영역 정의 */}
			<CustomModal ref={refTranModal} width="1000px">
				<CmLoopTranPopup
					popupParams={loopTrParams}
					close={closeEventTranPopup}
					onResultChange={(success: number, fail: number, total: number) => {
						const tr = { total: total, success: success, fail: fail };
						setTrProcessCnt(tr);
					}}
				/>
			</CustomModal>
		</>
	);
});

export default StConvertCGExDcDetail;

const CustomAGrid = styled(AGrid)`
	form {
		flex-wrap: nowrap;
	}
	.title-area {
		.ant-btn {
			min-width: fit-content;
		}
		> .grid-flex-wrap {
			flex: none;
			.ant-form {
				.ant-col {
					flex: none !important;
				}
			}
		}
	}
`;
