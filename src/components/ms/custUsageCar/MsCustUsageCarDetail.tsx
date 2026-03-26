/*
 ############################################################################
 # FiledataField	: MsCustUsageCarDetail.tsx
 # Description		: 기준정보 > 거래처기준정보 > 거래처별전용차량정보
 # Author			: JeongHyeongCheol
 # Since			: 25.08.29
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// util

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsCustUsageCar';

// types
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import MsCustUsageCarUploadExcelPopup from '@/components/ms/custUsageCar/MsCustUsageCarUploadExcelPopup';
import { GridBtnPropsType } from '@/types/common';
import { Button } from 'antd';
interface MsCustUsageCarDetailProps {
	gridData?: Array<object>;
	search?: any;
	dccode?: string;
}
const MsCustUsageCarDetail = forwardRef((props: MsCustUsageCarDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, gridData, dccode } = props;
	const { t } = useTranslation();
	const refModalPop = useRef(null);
	const refModalExcel = useRef(null);
	const [popupType, setPopupType] = useState('');
	const [totalCount, setTotalCount] = useState(0);

	const dccodeRef = useRef(dccode);
	useEffect(() => {
		dccodeRef.current = dccode;
	}, [dccode]);
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 거래처 차량유형
	const custcartypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUST_CAR_TYPE', value)?.cdNm;
	};
	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.CUST_CODE'),
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				align: 'center',
				popupType: 'cust',
				searchDropdownProps: {
					dataFieldMap: {
						custkey: 'code',
						custname: 'name',
					},
				},
				onClick: function (event: any) {
					if (event.item?.rowStatus === 'I') {
						setPopupType('cust');
						refModalPop.current.handlerOpen();
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

			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.CUST_NAME'),
			editable: false,
		},
		// {
		// 	dataField: 'custcartype',
		// 	headerText: '거래처차량유형',
		// 	commRenderer: {
		// 		type: 'dropDown',
		// 		list: getCommonCodeList('CUST_CAR_TYPE'),
		// 		keyField: 'comCd',
		// 		valueField: 'cdNm',
		// 		disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
		// 			return item.rowStatus !== 'I';
		// 		},
		// 	},
		// 	labelFunction: custcartypeLabelFunc,
		// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
		// 		if (item.rowStatus !== 'I') {
		// 			// 편집 가능 class 삭제
		// 			gridRef.current.removeEditClass(columnIndex);
		// 		} else {
		// 			// 편집 가능 class 추가
		// 			return 'isEdit';
		// 		}
		// 	},

		// 	required: true,
		// },
		{
			dataField: 'custcartype10',
			headerText: '전용',
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
		{
			dataField: 'custcartype99',
			headerText: '제외',
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				align: 'center',
				popupType: 'car',
				searchDropdownProps: {
					dataFieldMap: {
						carno: 'code',
						carname: 'name',
					},
				},
				onClick: function (event: any) {
					if (event.item?.rowStatus === 'I') {
						setPopupType('car');
						refModalPop.current.handlerOpen();
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
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'carname',
			headerText: '차량명',
			visible: false,
		},
		{
			dataField: 'applyYn',
			headerText: '적용여부',
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
		{
			dataField: 'addwho',
			headerText: '등록자',
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
			headerText: '등록일시',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: '수정자',
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
			headerText: '수정일시',
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
	 * 변경사항 저장
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

		const validateParams = (params: any[]) => {
			for (const item of params) {
				if ((item.custname ?? '') === '') {
					return '고객코드를 선택해주세요.';
				}

				if ((item.carname ?? '') === '' && item.rowStatus === 'I') {
					return '차량번호를 선택해주세요.';
				}
				if ((item.custcartype10 ?? '') === '' && (item.custcartype99 ?? '') === '') {
					return '전용여부 혹은 제외여부를 선택해주세요.';
				}
			}
			return null;
		};

		const message = validateParams(params);

		if (message) {
			showMessage({
				content: message,
				modalType: 'info',
			});
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveMasterList(params).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						search();
					},
				});
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
					instrategy: 'STD',
					outstrategy: 'STD',
					applyYn: 'Y',
					rowStatus: 'I',
					dccode: dccode,
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
	 * 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		setTimeout(() => {
			if (popupType === 'cust') {
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'custkey', selectedRow[0].code);
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'custname', selectedRow[0].name);
			}
			if (popupType === 'car') {
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'carno', selectedRow[0].code);
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'carname', selectedRow[0].name);
			}
			refModalPop.current.handlerClose();
		}, 0);
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
		refModalPop.current.handlerClose();
		refModalExcel?.current.handlerClose();
	};

	/**
	 * 그리드 초기 이벤트 세팅
	 */
	const initEvent = () => {
		// 에디팅 시작 이벤트 바인딩
		gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');

			if ((event.dataField === 'custkey' || event.dataField === 'carno') && !event.isClipboard) {
				return gridRef.current.isAddedById(event.item[rowIdField]);
			}
		});

		gridRef?.current.bind('addRow', (event: any) => {
			event.items.forEach((element: any) => {
				const rowIndex = gridRef.current.rowIdToIndex(element._$uid);
				gridRef.current.setCellValue(rowIndex, 'dccode', dccodeRef.current);
			});
		});

		gridRef.current.bind('cellEditEnd', function (event: any) {
			const { dataField, value, rowIndex } = event;
			if (dataField === 'custcartype10') {
				gridRef.current.setCellValue(rowIndex, 'custcartype99', value === 'Y' ? 'N' : 'Y');
				gridRef.current.setCellValue(rowIndex, 'custcartype', value === 'Y' ? '10' : '99');
			} else if (dataField === 'custcartype99') {
				gridRef.current.setCellValue(rowIndex, 'custcartype10', value === 'Y' ? 'N' : 'Y');
				gridRef.current.setCellValue(rowIndex, 'custcartype', value === 'Y' ? '99' : '10');
			}
		});
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
			setTotalCount(gridData.length);
			gridRefCur?.setGridData(gridData);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (gridData?.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCount}>
					<Button onClick={excelUpload}>엑셀업로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
			<CustomModal ref={refModalExcel} width="1000px">
				<MsCustUsageCarUploadExcelPopup close={closeEvent} search={search}></MsCustUsageCarUploadExcelPopup>
			</CustomModal>
		</>
	);
});

export default MsCustUsageCarDetail;
