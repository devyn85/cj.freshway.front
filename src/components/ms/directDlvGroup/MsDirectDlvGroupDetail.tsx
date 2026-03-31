/*
 ############################################################################
 # FiledataField	: MsDirectDlvGroupDetail.tsx
 # Description		: 기준정보 > 상품기준정보 > 발주직송그룹관리
 # Author			: JeongHyeongCheol
 # Since			: 25.06.27
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
// Components
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList, getUserOrganizeList } from '@/store/core/userStore';
// util

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsDirectDlvGroup';

// types
import { GridBtnPropsType } from '@/types/common';
interface MsDirectDlvGroupDetailProps {
	gridData?: Array<object>;
	search?: any;
}
const MsDirectDlvGroupDetail = forwardRef((props: MsDirectDlvGroupDetailProps, refs: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const refModal = useRef(null);
	refs.gridRef = useRef();
	const [isCust, setIsCust] = useState(false);
	const [labelType, setLabelType] = useState('');
	const [popupType, setPopupType] = useState('');
	const [organizeCode, setOrganizeCode] = useState('');
	const [totalCount, setTotalCount] = useState(0);

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'directdlvgroup',
			headerText: '직송그룹',
			dataType: 'code',
			editRenderer: {
				type: 'ComboBoxRenderer',
				autoCompleteMode: true,
				autoEasyMode: true,
				showEditorBtnOver: true,
				keyField: 'comCd',
				valueField: 'cdNm',
				list: getCommonCodeList('DIRECTTYPE', ''),
				validator: function (oldValue: any, newValue: any, item: any, dataField: any, fromClipboard: any, which: any) {
					const valueField = this.valueField;
					const isValid = getCommonCodeList('DIRECTTYPE', '').some(v => v[valueField] === newValue);
					if (isValid) {
						item['directdlvgroup'] = getCommonCodeList('DIRECTTYPE', '').find(v => v[valueField] === newValue).comCd;
					}
					return { validate: isValid };
				},
				// disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
				// 	return item.rowStatus !== 'I';
				// },
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					refs.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			filter: {
				showIcon: true,
			},
			required: true,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DIRECTTYPE', value)?.cdNm || value;
			},
		},
		{
			headerText: '발주센터',
			children: [
				{
					dataField: 'dccode',
					headerText: '물류센터',
					commRenderer: {
						type: 'dropDown',
						keyField: 'dccode',
						valueField: 'dcname',
						list: getUserDccodeList(),
						disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
							return item.rowStatus !== 'I';
						},
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item.rowStatus !== 'I') {
							// 편집 가능 class 삭제
							refs.gridRef.current.removeEditClass(columnIndex);
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
					dataField: 'organize',
					headerText: '창고',
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'search',
						iconPosition: 'right',
						popupType: 'directDlv',
						searchDropdownProps: {
							dataFieldMap: {
								organize: 'code',
								organizename: 'name',
							},
							isSearch: (values: any) => {
								const dccode = refs.gridRef.current.getCellValue(refs.gridRef.current.getSelectedIndex()[0], 'dccode');
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
							const dccode = refs.gridRef.current.getCellValue(refs.gridRef.current.getSelectedIndex()[0], 'dccode');
							if (e.item.rowStatus === 'I') {
								setOrganizeCode(dccode);
								setLabelType('발주센터 조회');
								setPopupType('directDlv');
								setIsCust(false);
								refModal.current.handlerOpen();
							}
						},
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item.rowStatus !== 'I') {
							// 편집 가능 class 삭제
							refs.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
					required: true,
				},
				{
					dataField: 'organizename',
					headerText: '창고명',
					filter: {
						showIcon: true,
					},
					editable: false,
				},
			],
		},
		{
			headerText: '직송센터',
			children: [
				{
					dataField: 'custkey',
					headerText: '창고',
					dataType: 'code',
					commRenderer: {
						type: 'search',
						iconPosition: 'right',
						popupType: 'directDlv',
						searchDropdownProps: {
							dataFieldMap: {
								custkey: 'code',
								custname: 'name',
							},
							isSearch: (values: any) => {
								const isOk = values.some((item: any) => {
									if (!item.code || !item.code.startsWith('1000')) {
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
								setOrganizeCode('1000');
								setLabelType('직송센터 조회');
								setPopupType('directDlv');
								setIsCust(true);
								refModal.current.handlerOpen();
							}
						},
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item.rowStatus !== 'I') {
							// 편집 가능 class 삭제
							refs.gridRef.current.removeEditClass(columnIndex);
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
					headerText: '창고명',
					filter: {
						showIcon: true,
					},
					editable: false,
				},
			],
		},
		{
			dataField: 'orderqty',
			headerText: '총발주량',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			editable: true,
		},
		{
			dataField: 'uom',
			headerText: '단위',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('UOM'),
			},
			required: true,
		},
		{
			dataField: 'memo',
			headerText: '비고',
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
	 * 창고팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		if (isCust) {
			refs.gridRef.current.setCellValue(refs.gridRef.current.getSelectedIndex()[0], 'custkey', selectedRow[0].code);
			refs.gridRef.current.setCellValue(refs.gridRef.current.getSelectedIndex()[0], 'custname', selectedRow[0].name);
		} else {
			refs.gridRef.current.setCellValue(refs.gridRef.current.getSelectedIndex()[0], 'organize', selectedRow[0].code);
			refs.gridRef.current.setCellValue(
				refs.gridRef.current.getSelectedIndex()[0],
				'organizename',
				selectedRow[0].name,
			);
		}
		refModal.current.handlerClose();
	};

	/**
	 * 발주직송그룹 정보 변경사항 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		const params = refs.gridRef.current.getChangedData();
		// validation
		if (params.length > 0 && !refs.gridRef.current.validateRequiredGridData()) {
			return;
		}
		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		// PK validation
		if (!refs.gridRef.current.validatePKGridData(['directdlvgroup', 'organize', 'custkey'])) {
			return;
		}

		// 저장하시겠습니까?
		refs.gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(params).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						props.search();
					},
				});
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: refs.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					storerkey: globalVariable.gStorerkey,
					custtype: 'D',
					uom: 'KG',
					orderqty: '0',
					rowStatus: 'I',
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
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		refs.gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			refs.gridRef?.current.setSelectionByIndex(0);
		});

		// 에디팅 시작 이벤트 바인딩
		refs.gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = refs.gridRef.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField === 'organize' && (event.item?.dccode ?? '').length === 0) {
				showMessage({
					content: '물류센터를 먼저 선택하시기 바랍니다.',
					modalType: 'info',
				});
				return false;
			}
			if (event.dataField !== 'orderqty' && event.dataField !== 'uom' && event.dataField !== 'memo') {
				return refs.gridRef.current.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});

		/**
		 * 셀 편집 종료 직전 이벤트 바인딩 - 입력 값 validation 혹은 후처리 시 사용
		 * @event cellEditEndBefore
		 * @param {object} event 이벤트
		 * @returns {void} 최종 수정값
		 */
		refs.gridRef.current?.bind('cellEditEndBefore', function (event: any) {
			if (event.dataField === 'dccode') {
				const params = getUserOrganizeList('', event.value, globalVariable.gStorerkey);
				const organizename = params[0].organizeName.replace(/\[\d+\]\s*/g, '');

				if (params.length === 1) {
					refs.gridRef.current.setCellValue(event.rowIndex, 'organize', params[0].organize);
					refs.gridRef.current.setCellValue(event.rowIndex, 'organizename', organizename);
				} else {
					refs.gridRef.current.setCellValue(event.rowIndex, 'organize', '');
					refs.gridRef.current.setCellValue(event.rowIndex, 'organizename', '');
				}
			}
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModal.current.handlerClose();
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
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
		const gridRefCur = refs.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.gridData.length > 0) {
				setTotalCount(props.gridData.length);
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
			<div className="contain-wrap">
				<AGrid>
					<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCount} />
					<AUIGrid ref={refs.gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</div>
			<CustomModal ref={refModal} width="1000px">
				<CmSearchPopup
					label={labelType}
					type={popupType}
					codeName={organizeCode}
					callBack={confirmPopup}
					close={closeEvent}
				></CmSearchPopup>
			</CustomModal>
		</>
	);
});

export default MsDirectDlvGroupDetail;
