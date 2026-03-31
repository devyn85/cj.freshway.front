/*
 ############################################################################
 # FiledataField	: MsPboxDetail.tsx
 # Description		: 재고 > 공용기 관리 > P-BOX 관리/사용 현황 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.18
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { InputNumber } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import { Form, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MsPboxDetail = ({
	activeKey,
	gridRef,
	gridRef1,
	gridData,
	gridData1,
	saveMasterList,
	savePrintList,
	form,
	setActiveKey,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const refModal = useRef(null);

	const [rowCountToAdd, setRowCountToAdd] = useState(1);

	const gDccode = Form.useWatch('dccode', form);

	const gDcname = useMemo(
		() => getUserDccodeList().find((o: any) => o.dccode == gDccode)?.dcnameOnlyNm || '',
		[gDccode],
	);

	// 2025.09.19 배찬님이 조회조건 물류센터명을 가져오는 방법을 해주심
	// [0000] 물류센터명 으로 가지고 와서 일단 보류.
	// const userDccodeList = getUserDccodeList('');
	// const dcname = userDccodeList.find((item: any) => item.dccode === dccode)?.dcnameOnlyNm ?? '';

	/////////////////////////////////////////// 1. PBOX등록_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		// 타겟 그리드 Ref
		tGridRef: gridRef,
		btnArr: [
			{
				// 행추가
				btnType: 'plus' as const,
				initValues: {
					dccode: gDccode,
					dcname: gDcname,
					//carAllocateDt: dayjs().format('YYYYMMDD'),
					//dcname: dcname,
					printCnt: 0,
					useYn: 'Y',
					addCount: rowCountToAdd,
					rowStatus: 'I',
				},
			},
			{
				// 행삭제
				btnType: 'delete',
			},
			{
				// 출력
				btnType: 'print',
				callBackFn: () => {
					savePrintList();
				},
			},
			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
				},
			},
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		isLegacyRemove: true,
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 80,
		},
		{
			// 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 100,
		},
		{
			/* 02. P_BOX 번호*/
			dataField: 'pboxNo',
			headerText: t('lbl.PBOX_NO'),
			dataType: 'code',
			editable: false,
			width: 200,
		},
		{
			/* 03. 기사명 */
			dataField: 'drivername',
			headerText: t('lbl.DRIVERNAME'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			/* 03. 차량번호 */
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'search',
				popupType: 'car',
				searchDropdownProps: {
					dataFieldMap: {
						carno: 'code',
						drivername: 'name',
					},
					callbackBeforeUpdateRow: async (e: any) => {
						// 신규행일 경우에만 "차량할당일" 오늘 일자로 변경
						gridRef.current?.setCellValue(e.rowIndex, 'carAllocateDt', dayjs().format('YYYYMMDD'));
						// if (gridRef.current?.isAddedByRowIndex(e.rowIndex)) {
						// 	gridRef.current.setCellValue(e.rowIndex, 'carAllocateDt', dayjs().format('YYYYMMDD'));
						// }
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					refModal.current?.open({
						gridRef: gridRef,
						codeName: e.text,
						rowIndex,
						dataFieldMap: {
							carno: 'code',
							drivername: 'name',
						},
						popupType: 'car',
						onCallBack: () => {
							gridRef.current?.setCellValue(e.rowIndex, 'carAllocateDt', dayjs().format('YYYYMMDD'));
							// 신규행일 경우에만 "차량할당일" 오늘 일자로 변경
							// if (gridRef.current?.isAddedByRowIndex(e.rowIndex)) {
							// 	gridRef.current.setCellValue(e.rowIndex, 'carAllocateDt', dayjs().format('YYYYMMDD'));
							// }
						},
					});
				},
			},
			width: 120,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (commUtil.isNotEmpty(item.custkey)) {
			// 		// 편집 가능 class 삭제
			// 		gridRef.current?.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
			// filter: {
			// 	showIcon: true,
			// },
			//required: true,
		},
		// {
		// 	/* 03. 차량번호 */
		// 	dataField: 'carno',
		// 	headerText: t('lbl.CARNO'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	commRenderer: {
		// 		type: 'search',
		// 		iconPosition: 'right',
		// 		align: 'center',
		// 		onClick: function (event: any) {
		// 			setPopupType('car');
		// 			refModalPop.current?.handlerOpen();
		// 		},
		// 	},
		// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
		// 		if (commUtil.isNotEmpty(item.custkey)) {
		// 			// 편집 가능 class 삭제
		// 			gridRef.current?.removeEditClass(columnIndex);
		// 		} else {
		// 			// 편집 가능 class 추가
		// 			return 'isEdit';
		// 		}
		// 	},
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// 	//required: true,
		// },
		{
			/* 04. 차량할당일 */
			dataField: 'carAllocateDt',
			headerText: t('lbl.CAR_ALLOCATE_DT'),
			dataType: 'date',
			editable: true,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			commRenderer: {
				type: 'calender',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				align: 'center',
				nullable: true, // 빈값 허용 2025.12.03 장광석님이 만들어주심.
			},
			//styleFunction: 'isEdit',
			width: 100,
			//required: true,
		},

		{
			/* 05. 출력 횟수*/
			dataField: 'printCnt',
			headerText: t('lbl.PRINT_CNT'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			/* 06. 사용여부 */
			dataField: 'useYn',
			headerText: t('lbl.USE_YN'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				keyField: 'comCd',
				valueField: 'cdNm',
				list: [
					{ cdNm: t('Y'), comCd: 'Y' },
					{ cdNm: t('N'), comCd: 'N' },
				],
			},
			required: true,
			width: 100,
		},
		{
			/* 07. 비고 */
			dataField: 'rmk',
			headerText: t('lbl.REMARK'),
			dataType: 'text',
			editable: true,
			width: 210,
			//required: true,
		},
		{
			/* 08. 등록자 */
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addId',
			editable: false,
			width: 80,
		},
		{
			dataField: 'addId',
			visible: false,
		},
		{
			/* 09. 등록일시 */
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'code',
			editable: false,
			width: 190,
		},
		{
			/* 10. 수정자 */
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 80,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			/* 11. 수정일시 */
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'code',
			editable: false,
			width: 190,
		},
	];

	/////////////////////////////////////////// 2. PBOX사용현황_탭 ///////////////////////////////////////////
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	const gridProps1 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	const gridCol1 = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			/* 01. 물류센터 */
			dataField: 'dcname',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			/* 02. 출고일자 */
			dataField: 'deliverydt',
			headerText: t('lbl.DOCDT_WD'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			/* 02. P_BOX 번호*/
			dataField: 'pboxNo',
			headerText: t('lbl.PBOX_NO'),
			dataType: 'code',
			editable: false,
			width: 180,
		},
		{
			/* 03. 기사명 */
			dataField: 'drivername',
			headerText: t('lbl.DRIVERNAME'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			/* 03. 차량번호 */
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			dataType: 'code',
			editable: false,
			width: 120,
		},
		{
			/* 04. 관리처코드 */
			dataField: 'toCustkey',
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current?.openPopup(
						{
							custkey: e.item.toCustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
			width: 100,
		},
		{
			/* 05. 관리처명 */
			dataField: 'toCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'),
			dataType: 'text',
			editable: false,
			width: 200,
		},
		{
			/* 06. 상품코드 */
			dataField: 'sku',
			headerText: t('lbl.LBL_SKU'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuname,
					};
					gridRef1.current?.openPopup(params, 'sku');
				},
			},
			width: 100,
		},
		{
			/* 07. 상품명칭 */
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			dataType: 'text',
			editable: false,
			filter: {
				showIcon: true,
			},
			width: 300,
		},
		{
			/* 08. 판매단위 */
			dataField: 'baseuom',
			headerText: t('lbl.UOM_SO'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			/* 09. 주문수량 */
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			/* 10. 출고수량 */
			dataField: 'inspectqty',
			headerText: t('lbl.QTY_WD'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		if (commUtil.nvl(item?.status, '00') == '00') {
			// 00:등록 상태일 때만 편집 가능
			return false;
		}
		return true;
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
	const initEvent = () => {
		// 셀 편집 시작 이벤트 바인딩
		// gridRef.current?.bind('cellEditBegin', function (event: any) {
		// 	// // 상태인 경우에만 편집 허용
		// 	// if (isDisabled(event?.item)) {
		// 	// 	return false;
		// 	// } else {
		// 	// 	return true;
		// 	// }
		// 	//return true;
		// });

		// 셀 편집 완료 이벤트 바인딩
		gridRef.current?.bind('cellEditEnd', (e: any) => {
			// 가능한 원본 이벤트 후보들을 모두 시도해서 얻음
			const { value, item, oldValue } = e;

			// 차량번호 - 차량할당일 클리어
			if (e.dataField === 'carno') {
				const updatedRow = {
					...item,
					carno: value,
					carAllocateDt: commUtil.nvl(value, '') == '' ? '' : item.carAllocateDt, // 차량할당일 클리어
					rowStatus: 'U',
				};
				gridRef.current.updateRowsById([updatedRow], true);
				return;
			}
		});

		// gridRef.current?.bind('cellEditEnd', (event: any) => {
		// 	//console.log('event:', event);
		// 	//
		// 	if (event.dataField === 'carno') {
		// 		gridRef.current.setCellValue(event.rowIndex, 'carAllocateDt', dayjs().format('YYYYMMDD'));
		// 	}
		// });
		// 그리드 이벤트 설정
		// 2025.12.03 박의병님의 간절한 눈빛 때문에 로직 추가함.
		// 그리드 차량번호 칸에 엔터 입력시 차량번호 검색을 하므로
		// 엔터 없이 그냥 입력한 경우 차량번호 유효성 검사를 한다.(복사 붙여넣기 시에도 작동됨.)
		// 입력 후 돋보기 누를때 팝업 대신 유효성 검사를 해서 일단 주석처리함.
		/*
		gridRef.current?.bind('cellEditEnd', (e: any) => {
			// 가능한 원본 이벤트 후보들을 모두 시도해서 얻음
			const orig = e?.originalEvent || e?.orgEvent || e?.event || e?.nativeEvent || null;

			// 우선 문자열 key를 확인, 없으면 숫자 keyCode/which를 확인
			const keyStr = orig?.key;
			const keyNum = orig?.keyCode ?? orig?.which ?? e?.which ?? e?.keyCode ?? null;

			const isEnter = keyStr === 'Enter' || keyNum === 13;
			if (isEnter) {
				// Enter로 편집 종료된 경우 처리 중단 (원하시면 return 대신 다른 동작)
				return;
			}

			if (!isEnter) {
				const { rowIndex } = e;
				if (['carno'].includes(e.dataField)) {
					const { carno } = gridRef.current?.getGridData()[rowIndex];

					if (commUtil.isNotEmpty(carno)) {
						const params = { carno };
						apiPostGetCheckCarNo(params).then(res => {
							const count = res.data[0].cnt;
							if (count === '0') {
								// 차량번호[{{0}}]\r\n잘못된 차량번호 입니다.
								showAlert(null, t('msg.MSG_MS_P_BOX_001', [carno]));
								gridRef.current?.setCellValue(rowIndex, 'carno', '');
								gridRef.current?.setCellValue(rowIndex, 'drivername', '');
							}
						});
					} else {
						gridRef.current?.setCellValue(rowIndex, 'carno', '');
						gridRef.current?.setCellValue(rowIndex, 'drivername', '');
					}
				}
			}
		});
		*/
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridData1);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridData1.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//	gridRef1.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData1]);

	// const confirmPopup = (selectedRow: any) => {
	// 	if (popupType === 'car') {
	// 		gridRef.current?.setCellValue(gridRef.current?.getSelectedIndex()[0], 'carno', selectedRow[0].code);
	// 	}

	// 	closeEvent();
	// };

	// const closeEvent = () => {
	// 	refModalPop.current?.handlerClose();
	// };

	return (
		<>
			<>
				<Tabs activeKey={activeKey} onChange={key => setActiveKey(key)} className="contain-wrap">
					{/* 분석 */}
					<TabPane tab={t('lbl.MS_P_BOX_T1')} key="1" className="h100">
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={gridData?.length} gridBtn={gridBtn}>
								<InputNumber
									label={t('lbl.PBOX_ROW')}
									value={rowCountToAdd}
									defaultValue={rowCountToAdd}
									onChange={(value: any) => setRowCountToAdd(value)}
									onKeyDown={(e: any) => {
										if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
											e.preventDefault();
										}
									}}
									min={0}
									precision={0}
									step={1}
									name="pboxRow"
									className="bg-white"
									placeholder={t('msg.placeholder1', [t('lbl.PBOX_ROW')])}
								/>
							</GridTopBtn>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</AGrid>
					</TabPane>
					{/* 기준 */}
					<TabPane tab={t('lbl.MS_P_BOX_T2')} key="2">
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn1} totalCnt={gridData1?.length} />
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</AGrid>
					</TabPane>
				</Tabs>
			</>
			{/* 
			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal> */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
};

export default MsPboxDetail;
