// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import GridTopBtn from '@/components/common/GridTopBtn';

import CustomModal from '@/components/common/custom/CustomModal';
import MsSkuDcSetSTOUploadExcelPopup from '@/components/ms/skuDcSetSTO/MsSkuDcSetSTOUploadExcelPopup';

// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiPostSaveMaster } from '@/api/ms/apiMsSkuDcSetSTO';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

const MsSkuDcSetSTODetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 글로벌 센터코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 컴포넌트 접근을 위한 Ref
	const modalRef = useRef(null);
	// const modalRef1 = useRef(null);
	const refModal = useRef(null);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: '광역센터',
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getUserDccodeList(),
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
				// validator: (oldValue: any, newValue: any, item: any) => {
				// 	const fromDc = newValue;
				// 	const toDc = item.toDcCode;
				// 	const isValid = fromDc !== toDc;

				// 	// 리턴값은 Object 이며 validate 의 값이 true 라면 패스, false 라면 message 를 띄움
				// 	return { validate: isValid, message: '경유센터와 실주문센터는 다르게 선택해야 합니다.' };
				// },
			},
			required: true,
		},
		{
			dataField: 'toDcCode',
			headerText: '실주문센터',
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getUserDccodeList(),
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
				// validator: (oldValue: any, newValue: any, item: any) => {
				// 	const toDc = newValue;
				// 	const fromDc = item.dcCode;
				// 	const isValid = fromDc !== toDc;

				// 	// 리턴값은 Object 이며 validate 의 값이 true 라면 패스, false 라면 message 를 띄움
				// 	return { validate: isValid, message: '경유센터와 실주문센터는 다르게 선택해야 합니다.' };
				// },
			},
			required: true,
		},
		{
			dataField: 'storerKey',
			headerText: t('lbl.STORERKEY'),
			dataType: 'code',
			editable: false,
			visible: false,
		},
		// {
		// 	dataField: 'sku',
		// 	headerText: t('lbl.SKU'),
		// 	dataType: 'code',
		// 	commRenderer: {
		// 		type: 'popup',
		// 		onClick: function (e: any) {
		// 			gridRef.current.openPopup(e.item, 'sku');
		// 		},
		// 	},
		// 	required: true,
		// },
		{
			dataField: 'sku',
			headerText: '상품코드',
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuDescr: 'name',
					},
				},
				onClick: (e: any) => {
					refModal.current.handlerOpen();
				},
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			editable: true,
			required: true,
		},
		{
			dataField: 'skuDescr',
			headerText: '상품명',
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'smsYn',
			headerText: '소터여부',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN3', ''),
				keyField: 'comCd',
				valueField: 'comCd',
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('DEL_YN', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DEL_YN', value)?.cdNm;
			},
		},
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}

			if (event.dataField === 'sku') {
				if (commUtil.isEmpty(event.item.skuDescr)) {
					gridRef.current.setCellValue(event.rowIndex, 'sku', '');
				}

				const skuValue = event.item.sku;
				if (!/^\d{6}$/.test(skuValue)) {
					gridRef.current.setCellValue(event.rowIndex, 'sku', '');
					gridRef.current.setCellValue(event.rowIndex, 'skuDescr', '');
				}
			}
		});

		/**
		 * 그리드 셀 클릭 이벤트 조회 팝업 호출
		 * @param {any} event 이벤트
		 */
		// gridRef?.current.bind('cellClick', (event: any) => {
		// 	if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') === 'I') {
		// 		if (event.dataField === 'sku') {
		// 			modalRef1.current.handlerOpen();
		// 		} else {
		// 			// sku가 아닌 경우 팝업 호출하지 않음
		// 			return;
		// 		}
		// 	}
		// });

		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			// if (event.dataField === 'dcCode' || event.dataField === 'sku') {
			// 	// 신규 행이 아니라면
			// 	if (event.item.rowStatus !== 'I') {
			// 		// false를 반환하여 편집 모드 진입을 막는다.
			// 		return false;
			// 	}
			// }

			return true;
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellDoubleClick', (event: any) => {
			// 선택된 셀(행)의 상세 정보를 조회한다.
			//searchDtl(event.item);
		});
	};

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			props.setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: props.totalCnt,
	});

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		for (const item of updatedItems) {
			if (item.dcCode === item.toDcCode) {
				showMessage({
					content: '경유센터와 실주문센터는 다르게 선택해야 합니다.',
					modalType: 'info',
				});
				return;
			}

			if (item.sku.length !== 6 || isNaN(item.sku)) {
				showMessage({
					content: '상품코드가 유효하지 않습니다.',
					modalType: 'info',
				});
				return;
			}
		}

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMaster(updatedItems).then(res => {
				// 전체 체크 해제
				// gridRef.current.setAllCheckedRows(false);
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn?.(); // 콜백 함수 호출
						},
					});
				}
			});
		});
	};

	const getSelectDccodeList = () => {
		const dcCode = props.form.getFieldValue('multiDcCode');
		if (dcCode && dcCode.length > 0) {
			return dcCode.join(',');
		} else {
			return gDccode;
		}
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					storerKey: 'FW00',
					dcCode: getSelectDccodeList(),
					delYn: 'N',
					smsYn: 'N',
					rowStatus: 'I', // 신규 행 상태로 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		modalRef.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.callBackFn?.(); // 콜백 함수 호출
	};

	const confirmPopup = (selectedRow: any) => {
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'sku', selectedRow[0].code);
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'skuDescr', selectedRow[0].name);
		refModal.current.handlerClose();
	};

	const closeEvent1 = () => {
		if (commUtil.isEmpty(gridRef.current.getCellValue(gridRef.current.getSelectedIndex()[0], 'skuDescr'))) {
			gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'sku', '');
		} else {
			gridRef.current.restoreEditedCells([gridRef.current.getSelectedIndex()[0], 'sku']);
			gridRef.current.restoreEditedCells([gridRef.current.getSelectedIndex()[0], 'skuDescr']);
		}
		refModal.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn}>
					<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<CustomModal ref={modalRef} width="1000px">
				<MsSkuDcSetSTOUploadExcelPopup close={closeEvent} />
			</CustomModal>
			{/* <CustomModal ref={modalRef1} width="1000px">
				<CmSearchPopup type={'sku'} callBack={confirmPopup} close={closeEvent1}></CmSearchPopup>
			</CustomModal> */}
			<CustomModal ref={refModal} width="1000px">
				<CmSearchPopup type={'sku'} codeName={''} callBack={confirmPopup} close={closeEvent1}></CmSearchPopup>
			</CustomModal>
		</>
	);
});

export default MsSkuDcSetSTODetail;
