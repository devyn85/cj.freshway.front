// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiPostSaveMasterList } from '@/api/cm/apiCmDcXOrganizeManager';

const CmDcXOrganizeManagerDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const userDccodeList = getUserDccodeList('') ?? [];

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
			// required: true,
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			},
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'),
			// dataType: 'string',
			maxlength: 10,
			// required: true,
			filter: {
				showIcon: true,
			},
			editRenderer: {
				type: 'InputEditRenderer',
				regExp: '^[0-9a-zA-Z]+$',
			},
		},
		{
			dataField: 'description',
			headerText: t('lbl.ORGANIZENAME'),
			dataType: 'string',
			// required: true,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const result = getCommonCodeList('STATUS_CODE')?.find(v => v['comCd'] === value); // editRenderer 리스트에서 key-value 에 맞는 값 찾아 반환.
				if (result === undefined) return '';
				return result['cdNm'];
			},
			editRenderer: {
				type: 'ConditionRenderer', // 조건에 따라 셀의 에디터를 동적으로 지정할 수 있습니다.
				conditionFunction: function () {
					return {
						type: 'DropDownListRenderer',
						keyField: 'comCd',
						valueField: 'cdNm',
						list: getCommonCodeList('STATUS_CODE'),
					};
				},
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			dataType: 'code',
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const result = getCommonCodeList('DEL_YN')?.find(v => v['comCd'] === value); // editRenderer 리스트에서 key-value 에 맞는 값 찾아 반환.
				if (result === undefined) return '';
				return result['cdNm'];
			},
			editRenderer: {
				type: 'ConditionRenderer', // 조건에 따라 셀의 에디터를 동적으로 지정할 수 있습니다.
				conditionFunction: function () {
					return {
						type: 'DropDownListRenderer',
						keyField: 'comCd',
						valueField: 'cdNm',
						list: getCommonCodeList('DEL_YN'),
					};
				},
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
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		isLegacyRemove: true,
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
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});
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
		if (!gridRef.current.validateRequiredGridData()) return;

		// 저장 실행
		gridRef.current.showConfirmSave(() => {
			// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
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

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'plus', // 행추가
			// 	initValues: {
			// 		storerkey: 'FW00',
			// 		status: '90',
			// 		delYn: 'N',
			// 		rowStatus: 'I', // 신규 행 상태로 설정
			// 	},
			// },
			// {
			// 	btnType: 'delete', // 행삭제
			// },
			// {
			// 	btnType: 'save', // 저장
			// 	callBackFn: saveMasterList,
			// },
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

export default CmDcXOrganizeManagerDetail;
