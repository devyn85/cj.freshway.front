/*
 ############################################################################
 # FiledataField	: MsSkuChainDetail.tsx
 # Description		: 기준정보 > 상품기준정보 > PLT변환값 마스터
 # Author			: JeongHyeongCheol
 # Since			: 25.06.26
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// util

// API Call Function
import { apiGetSkuInfo, apiPostSaveMasterList } from '@/api/ms/apiMsSkuChain';

// types
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import { Button } from '@/components/common/custom/form';
import MsSkuChainUploadExcelPopup from '@/components/ms/skuChain/MsSkuChainUploadExcelPopup';
import { GridBtnPropsType } from '@/types/common';
interface MsSkuChainDetailProps {
	gridData?: Array<object>;
	searchDccode?: any;
	search?: any;
}
const MsSkuChainDetail = forwardRef((props: MsSkuChainDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { searchDccode, search } = props;
	const { t } = useTranslation();
	const refModal = useRef(null);
	const refModalExcel = useRef(null);
	const [popupType, setPopupType] = useState('');
	const [codeName, setCodeName] = useState('');
	const [totalCount, setTotalCount] = useState(0);
	const searchDccodeRef = useRef(searchDccode);
	searchDccodeRef.current = searchDccode;

	// 저장조건
	const storagetypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
	};
	const getSkuSelectData = (value: any, selectRow: number) => {
		apiGetSkuInfo({ sku: value }).then(res => {
			if (res.data) {
				gridRef.current.setCellValue(selectRow, 'grossweight', res.data.grossweight || '');
				gridRef.current.setCellValue(selectRow, 'boxperplt', res.data.boxperplt || '');
				gridRef.current.setCellValue(selectRow, 'baseuom', res.data.baseuom || '');
				gridRef.current.setCellValue(selectRow, 'line01', res.data.line01 || '');
				gridRef.current.setCellValue(selectRow, 'line02', res.data.line02 || '');
				gridRef.current.setCellValue(selectRow, 'gpc', res.data.gpc || '');
				gridRef.current.setCellValue(selectRow, 'storagetype', res.data.storagetype || '');
			}
		});
	};
	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE1'), // 물류센터코드
			commRenderer: {
				type: 'dropDown',
				keyField: 'dccode',
				valueField: 'dccode',
				//20260319 물류센터 전체 제거
				list: getUserDccodeList('ONLYALL').filter((item: any) => item.dccode !== '전체'),
				// list: getUserDccodeList('ONLYALL'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return item.rowStatus !== 'I';
				},
			},
			filter: {
				showIcon: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'), // 물류센터명
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'plant',
			headerText: t('lbl.ORGANIZE'), // 창고
			dataType: 'code',
			required: true,
			filter: {
				showIcon: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'directDlv',
				searchDropdownProps: {
					dataFieldMap: {
						plant: 'code',
						plantname: 'name',
					},
					isSearch: (values: any) => {
						const dccode = gridRef.current.getCellValue(gridRef.current.getSelectedIndex()[0], 'dccode');
						const isOk = values.some((item: any) => {
							if (!item.code || !item.code.startsWith(dccode)) {
								return true;
							}
							return false;
						});
						if (isOk) {
							return true;
						}
						return false;
					},
				},
				onClick: (e: any) => {
					if (e.item.rowStatus === 'I') {
						setPopupType('directDlv');
						setCodeName(e.item.dccode);
						refModal.current.handlerOpen();
					}
				},
			},
		},
		{
			dataField: 'plantname',
			headerText: t('lbl.ORGANIZENAME'), // 창고명
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						description: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						// const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
						getSkuSelectData(e.code, e.rowIndex);
					},
				},
				onClick: (e: any) => {
					if (e.item.rowStatus === 'I') {
						setCodeName('');
						setPopupType('sku');
						refModal.current.handlerOpen();
					}
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'description',
			headerText: t('lbl.SKUNM'), // 상품명
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), // 저장조건
			labelFunction: storagetypeLabelFunc,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'gpc',
			headerText: t('lbl.SKUGROUP'), // 상품분류
			editable: false,
		},
		{
			dataField: 'baseuom',
			headerText: t('lbl.UOM'), // 단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'boxperlayer',
			headerText: '방(BOX)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			required: true,
		},
		{
			dataField: 'layerperplt',
			headerText: '단(BOX)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			required: true,
		},
		{
			dataField: 'boxperplt',
			headerText: 'PLT변환값(BOX)',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'plttrans',
			headerText: 'PLT변환값(KG)',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN').filter((item: any) => item.comCd === 'Y' || item.comCd === 'N'),
			},
			dataType: 'code',
		},
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'), // 등록자
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'), // 수정자
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
	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * PLT변환값 마스터 정보 변경사항 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		const params = gridRef.current.getChangedData({ validationYn: false });

		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		// validation
		if (params.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}
		if (!gridRef.current.validatePKGridData(['dccode', 'plant', 'sku'], '1')) {
			return;
		}

		const boxperplt = params.some((item: any) => item.boxperplt == 0);
		if (boxperplt) {
			showMessage({
				content: 'plt 변환값은 0으로 지정할 수 없습니다',
				modalType: 'info',
			});
			return;
		}

		const description = params.some((item: any) => item.description);
		if (!description) {
			showMessage({
				content: '상품코드를 확인해주세요',
				modalType: 'info',
			});
			return;
		}
		const editParams = params.map((item: any) => {
			return {
				sku: item.sku,
				boxperplt: item.boxperplt,
				rowStatus: item.rowStatus,
				dccode: item.dccode === '전체' ? '' : item.dccode,
				plant: item.plant === '전체' ? '' : item.plant,
				boxperlayer: item.boxperlayer,
				layerperplt: item.layerperplt,
				delYn: item.delYn,
			};
		});
		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(editParams).then(res => {
				if (res.data.statusCode > -1) {
					// gridRef.current.setSelectedRowValue({ ...editParams, rowStatus: 'R' });
					// gridRef.current.setAllCheckedRows(false);
					// gridRef.current.resetUpdatedItems();
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

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I',

					delYn: 'N',
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
	 * 창고팝업조회
	 * @param selectedRow
	 * @param event
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		if (popupType === 'sku') {
			apiGetSkuInfo({ sku: selectedRow[0].code }).then(res => {
				if (res.data) {
					gridRef.current.setCellValue(
						gridRef.current.getSelectedIndex()[0],
						'grossweight',
						res.data.grossweight || '',
					);
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'boxperplt', res.data.boxperplt || '');
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'baseuom', res.data.baseuom || '');
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'sku', res.data.sku || '');
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'gpc', res.data.gpc || '');
					gridRef.current.setCellValue(
						gridRef.current.getSelectedIndex()[0],
						'storagetype',
						res.data.storagetype || '',
					);
					gridRef.current.setCellValue(
						gridRef.current.getSelectedIndex()[0],
						'description',
						res.data.description || '',
					);
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'line01', res.data.line01 || '');
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'line02', res.data.line02 || '');
				}
			});
			// gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'sku', selectedRow[0].code);
			// gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'description', selectedRow[0].name);
			// gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'baseuom', selectedRow[0].baseuom);
			// gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'storagetype', selectedRow[0].storagetype);
		} else if (popupType === 'directDlv') {
			gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'plant', selectedRow[0].code);
			gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'plantname', selectedRow[0].name);
		}
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		gridRef.current.setColumnSizeList(colSizeList);
		refModal.current.handlerClose();
	};

	/**
	 * 엑셀 upload popup
	 */
	const excelUpload = () => {
		refModalExcel.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModal.current.handlerClose();
		refModalExcel.current.handlerClose();
	};

	const initEvent = () => {
		// 에디팅 시작 이벤트 바인딩

		gridRef.current.bind('addRow', (event: any) => {
			event.items.forEach((element: any) => {
				const currentSearchDccode = searchDccodeRef.current;
				const rowIndex = gridRef.current.rowIdToIndex(element._$uid);
				if (currentSearchDccode && currentSearchDccode.length === 1) {
					const selectOne = getUserDccodeList('ONLYALL').find((item: any) => item.dccode === currentSearchDccode[0]);
					if (selectOne) {
						gridRef.current.setCellValue(rowIndex, 'dccode', currentSearchDccode[0]);
						gridRef.current.setCellValue(rowIndex, 'dcname', selectOne.dcnameOnlyNm);
						if (currentSearchDccode[0] !== '1000' && currentSearchDccode[0] !== '2170') {
							gridRef.current.setCellValue(rowIndex, 'plant', currentSearchDccode[0]);
						}
					}
				}
			});
		});

		gridRef.current?.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');
			const dccode = gridRef.current.getCellValue(gridRef.current.getSelectedIndex()[0], 'dccode');
			// 신규행만 수정 가능
			if (event.dataField === 'sku' && event.isClipboard === false) {
				return gridRef.current.isAddedById(event.item[rowIdField]);
			} else if (
				(event.dataField === 'plant' && event.item.dccode === '전체') ||
				(event.dataField === 'plant' && dccode !== '2170' && dccode !== '1000')
			) {
				return false;
			}
		});

		gridRef.current?.bind('cellEditEnd', function (event: any) {
			if (event.dataField === 'dccode') {
				const selectOne = getUserDccodeList('ONLYALL').filter((item: any) => item.dccode === event.item.dccode)[0];
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'dcname', selectOne.dcnameOnlyNm);
				// 초기화
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'plant', '');
				if (event.item.dccode === '전체' || (event.item.dccode !== '1000' && event.item.dccode !== '2170')) {
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'plant', selectOne.dccode);
				}
			}
			// boxperlayer: 방(BOX) / layerperplt : 단(BOX)
			if (event.dataField === 'boxperlayer' || event.dataField === 'layerperplt') {
				const boxperlayer = Number(event.item.boxperlayer || 0);
				const layerperplt = Number(event.item.layerperplt || 0);
				// const grossweight = event.item.grossweight;
				const pltconversion = Number(boxperlayer * layerperplt);
				// const plttrans = boxperlayer * layerperplt * grossweight || pltconversion;
				gridRef.current.setCellValue(event.rowIndex, 'boxperplt', pltconversion); // PLT변환값(BOX);
				// gridRef.current.setCellValue(event.rowIndex, 'plttrans', plttrans);

				const grossweight = Number(event.item.grossweight);
				const baseuom = event.item.baseuom;
				const line01 = event.item.line01;
				const line02 = Number(event.item.line02);
				let plttrans = 0;

				if (baseuom === 'KG' && line01 === 'Y') {
					plttrans = line02 * boxperlayer * layerperplt;
				} else if (baseuom === 'KG' && line01 !== 'Y') {
					plttrans = grossweight * boxperlayer * layerperplt;
				} else if (baseuom === 'EA') {
					plttrans = boxperlayer * layerperplt * grossweight; // 상품 baseUom 값이 상품 팝업에서도 EA 일 경우가 분리 되서 혹시 몰라 화면도 분리 시킴.
				} else {
					plttrans = boxperlayer * layerperplt * grossweight;
				}

				gridRef.current.setCellValue(event.rowIndex, 'plttrans', plttrans); // PLT 변화값(KG)
			}
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			gridRef.current.setColumnSizeList(colSizeList);
		});

		// 	if (event.item.rowStatus === 'I' && event.dataField === 'sku') {
		// 		const dccode = gridRef.current.getCellValue(gridRef.current.getSelectedIndex()[0], 'dccode');
		// 		const popupType = event.dataField;
		// 		setCodeName('');

		// 		if (dccode !== '전체' || event.dataField === 'sku') {
		// 			setPopupType(popupType);
		// 			refModal.current.handlerOpen();
		// 		}
		// 	}
		// });
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 에디팅 시작 이벤트
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);
			setTotalCount(props.gridData.length);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCount}>
					<Button onClick={excelUpload}>엑셀업로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={refModal} width="1000px">
				<CmSearchPopup type={popupType} codeName={codeName} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
			<CustomModal ref={refModalExcel} width="1000px">
				<MsSkuChainUploadExcelPopup close={closeEvent}></MsSkuChainUploadExcelPopup>
			</CustomModal>
		</>
	);
});

export default MsSkuChainDetail;
