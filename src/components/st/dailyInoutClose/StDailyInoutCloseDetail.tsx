// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiPostSaveBatchClose, apiPostSaveMasterList } from '@/api/st/apiStDailyInoutClose';

const StDailyInoutCloseDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
			},
			filter: {
				showIcon: true,
			},
			required: true,
			editable: false,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		// 편집 가능 class 삭제
			// 		gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
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
			dataField: 'inoutDt',
			headerText: t('lbl.INOUTDT'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
			},
			editable: false,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.CLOSEYN'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: [
					{ cdNm: '마감전', comCd: 'Y' },
					{ cdNm: '마감완료', comCd: 'N' },
				],
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === 'N') {
					return '마감완료';
				} else {
					return '마감전';
				}
			},
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STATUS_CAR', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STATUS_CAR', value)?.cdNm;
			},
		},
		{
			dataField: 'sapInoutCloseYn',
			headerText: 'SAP마감여부',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === 'S') {
					return '마감전';
				} else if (value === 'F') {
					return '마감완료';
				} else {
					return '';
				}
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
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
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
			// 편집이 완료된 후, 해당 행을 수정 상태로 변경한다.
			if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
			// if(event.dataField === 'etcqty2'){

			// }
		});

		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			if (event.dataField === 'dcCode' || event.dataField === 'inoutDt') {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}

			return true;
		});
	};

	const hasDuplicateItems = (arr: any) => {
		const seen = new Set();

		for (const item of arr) {
			const key = `${item.dcCode}-${item.inoutDt}`;
			if (seen.has(key)) {
				return true;
			}
			seen.add(key);
		}

		return false;
	};

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

		for (const item of updatedItems) {
			if (item.delYn === 'Y' && item.sapInoutCloseYn === 'F') {
				showMessage({
					content: 'SAP마감완료된 건은 마감전으로 변경할 수 없습니다.',
					modalType: 'info',
				});
				return;
			}
		}

		// updatedItems 중에 물류센터와 수불일자가 2개 이상 중복된 데이터 찾기
		if (hasDuplicateItems(gridRef.current.getGridData())) {
			showMessage({
				content: '물류센터와 수불일자가 중복된 행이 있습니다.',
				modalType: 'info',
			});
			return;
		}

		if (!gridRef.current.validateRequiredGridData()) return;

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
					gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				});
				gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: props.callBackFn,
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
					storerkey: 'FW00',
					dcCode: gDccode,
					status: '90',
					delYn: 'N',
					inoutDt: props.form.getFieldValue('inoutDt').endOf('month').format('YYYYMMDD'), // 현재월의 마지막 날짜로 설정
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
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '일괄마감',
				// authType: 'new',
				callBackFn: () => {
					const inoutDt = props.form.getFieldValue('inoutDt').format('YYYYMM');

					if (inoutDt === dayjs().format('YYYYMM')) {
						showMessage({
							content:
								'당월에 대해서는 일괄마감을 수행하실 수 없습니다.\n(수불마감시 해당월 포함 이전의 수불에 관련된 처리가 불가합니다.\n[입고,출고,반품,재고 등])',
							modalType: 'info',
						});
						return;
					}

					const param = {
						inoutDt: inoutDt,
					};
					showConfirm(null, inoutDt + '월에 대해 일괄로 수불마감을 진행하시겠습니까?', () => {
						apiPostSaveBatchClose(param).then(() => {
							props.callBackFn();
						});
					});
				},
			},
		],
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
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default StDailyInoutCloseDetail;
