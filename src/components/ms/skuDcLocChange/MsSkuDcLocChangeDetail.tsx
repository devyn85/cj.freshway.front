// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import MsSkuDcLocChangeUploadExcelPopup from '@/components/ms/skuDcLocChange/MsSkuDcLocChangeUploadExcelPopup';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostSaveMasterList, apiPostZoneList } from '@/api/ms/apiMsSkuDcLocChange';

//Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const MsSkuDcLocChangeDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const userDccodeList = getUserDccodeList('') ?? [];
	const modalRef = useRef(null);

	// 그리드 초기화
	const gridCol = [
		// {
		// 	dataField: 'storerKey',
		// 	headerText: t('lbl.STORERKEY'),
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'string',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE'),
			dataType: 'code',
			editable: false,
			// labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
			// 	const zoneList = getMsZoneList(item.dcCode);
			// 	return zoneList.find((item: any) => item.baseCode === value)?.baseDescr || value;
			// },
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'),
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					gridRef.current.openPopup(params, 'sku');
				},
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'),
			dataType: 'string',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'qty',
			headerText: '현재고수량',
			dataType: 'numeric',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'exhaustionStopYn',
			headerText: '소진후중단',
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
				editable: false,
			},
			editable: false,
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
			editable: false,
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
		// fillColumnSizeMode: true,
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
			// 편집이 완료된 후, 해당 행을 수정 상태로 변경한다.
			if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}

			if (event.dataField === 'loc' && event.value) {
				const params = {
					dcCode: event.item.dcCode,
					loc: event.value,
				};

				apiPostZoneList(params).then(res => {
					if (res.data && res.data.zone) {
						gridRef.current.setCellValue(event.rowIndex, 'zone', res.data.zone);
					}
				});
			}
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveSkuDcLocChangeList = () => {
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

		// 저장 실행
		gridRef.current.showConfirmSave(() => {
			const params = { processtype: 'MS_SKUDCLOCCHANGE', locList: updatedItems };

			apiPostSaveMasterList(params).then(res => {
				for (const data of res.data) {
					if (data.processFlag === 'E') {
						showMessage({
							content: data.processMsg,
							modalType: 'error',
						});
						return;
					}
				}

				gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
					gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				});
				gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'excelDownload', // 엑셀 다운로드
			// },
			{
				btnType: 'save', // 저장
				callBackFn: saveSkuDcLocChangeList,
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
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt}>
					<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={modalRef} width="1000px">
				<MsSkuDcLocChangeUploadExcelPopup close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default MsSkuDcLocChangeDetail;
