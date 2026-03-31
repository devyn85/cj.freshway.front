// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useSelector } from 'react-redux';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getMsPlantList } from '@/store/biz/msPlantStore';
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsPickBatchGroup';

const MsPickBatchGroupDetail = forwardRef((props: any, gridRef: any) => {
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
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
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
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'string',
			filter: {
				showIcon: true,
			},
			editRenderer: {
				type: 'ComboBoxRenderer',
				autoCompleteMode: true, // 자동완성 모드 설정
				autoEasyMode: true, // 자동완성 모드일 때 자동 선택할지 여부 (기본값 : false)
				showEditorBtnOver: true, // 마우스 오버 시 에디터버튼 보이기
				matchFromFirst: false, // 설정 시 앞에서 부터 일치가 아닌 단순 포함으로 리스트에 출력
				listFunction: (rowIndex: number, colIndex: number, item: any) => {
					// 물류센터 코드에 따라 플랜트 리스트를 가져온다.
					return getMsPlantList(item.dcCode);
				},
				keyField: 'plantName', // key 에 해당되는 필드명
				valueField: 'plantName', // value 에 해당되는 필드명
				// 에디팅 유효성 검사
				validator: function (oldValue: any, newValue: any, item: any, dataField: any, fromClipboard: any, which: any) {
					const valueField = this.valueField;
					const isValid = getMsPlantList(item.dcCode).some(v => v[valueField] === newValue);
					return { validate: isValid };
				},
			},
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'storageType',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('STORAGETYPE', ''),
				disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					if (item.rowStatus !== 'I') {
						return true;
					}
					return false;
				},
			},
			required: true,
			editable: false,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'distanceType',
			headerText: '피킹유형',
			dataType: 'code',
			editRenderer: {
				type: 'ComboBoxRenderer',
				autoCompleteMode: true, // 자동완성 모드 설정
				autoEasyMode: true, // 자동완성 모드일 때 자동 선택할지 여부 (기본값 : false)
				showEditorBtnOver: true, // 마우스 오버 시 에디터버튼 보이기
				matchFromFirst: false, // 설정 시 앞에서 부터 일치가 아닌 단순 포함으로 리스트에 출력
				list: getCommonCodeList('DISTANCETYPE', ''),
				keyField: 'comCd',
				valueField: 'comCd',
				// 에디팅 유효성 검사
				validator: function (oldValue: any, newValue: any, item: any, dataField: any, fromClipboard: any, which: any) {
					const isValid = commUtil.isNotEmpty(getCommonCodebyCd('DISTANCETYPE', newValue));
					return { validate: isValid };
				},
			},
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		// {
		// 	dataField: 'distanceTypeDesc',
		// 	headerText: '피킹유형설명',
		// 	dataType: 'code',
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		// 		//distanceTypeDesc 값도 함께 넣어주기 위해 labelFunction에서 처리
		// 		item.distanceTypeDesc = getCommonCodebyCd('DISTANCETYPE', item.distanceType)?.cdNm || '';
		// 		return item.distanceTypeDesc;
		// 	},
		// 	editable: false,
		// },
		{
			dataField: 'distanceTypeNm',
			headerText: '피킹유형설명',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				//distanceTypeDesc 값도 함께 넣어주기 위해 labelFunction에서 처리
				item.distanceTypeDesc = getCommonCodebyCd('DISTANCETYPE', item.distanceType)?.cdNm || '';
				return item.distanceTypeDesc;
			},
			editable: false,
		},
		{
			dataField: 'alloUom',
			headerText: '분배단위',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: [
					{ comCd: 'PLT', cdNm: 'PLT' },
					{ comCd: 'BOX', cdNm: 'BOX' },
					{ comCd: 'EA', cdNm: 'EA' },
				],
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'usebyDateFreeRt',
			headerText: '소비기한(%)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9 까지만 허용
				validator: (oldValue: any, newValue: any, item: any, dataField: any, fromClipboard: any, which: any) => {
					let isValid = false;
					const numVal = Number(newValue);
					if (!isNaN(numVal) && numVal >= 0 && numVal <= 100) {
						isValid = true;
					}
					return { validate: isValid, message: '소비기한은 0 ~ 100 까지 입력이 가능합니다.' };
				},
			},
		},
		{
			dataField: 'batchGroup',
			headerText: t('lbl.BATCHGROUP'),
			dataType: 'code',
			maxlength: 20,
			filter: {
				showIcon: true,
			},
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				regExp: '[^ㄱ-힣]+$',
			},
		},
		{
			dataField: 'description',
			headerText: t('lbl.DESCRIPTION'),
			dataType: 'string',
			required: true,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'etcCode1',
			headerText: t('lbl.ETC1'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'etcCode2',
			headerText: t('lbl.ETC2'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'etcCode3',
			headerText: t('lbl.ETC3'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'etcCode4',
			headerText: t('lbl.ETC4'),
			dataType: 'string',
			editable: false,
		},
		// {
		// 	dataField: 'status',
		// 	headerText: t('lbl.STATUS'),
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('STATUS_PICKGROUP', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return getCommonCodebyCd('STATUS_PICKGROUP', value)?.cdNm;
		// 	},
		// },
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
		// fillColumnSizeMode: true,
		isLegacyRemove: true,
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
		gridRef?.current.bind('addRow', (event: any) => {
			const code = getSelectDccodeList();
			event.items.forEach((element: any) => {
				const rowIndex = gridRef.current.rowIdToIndex(element._$uid);
				gridRef.current.setCellValue(rowIndex, 'rowStatus', 'I');

				setTimeout(() => {
					gridRef.current.setCellValue(rowIndex, 'dcCode', code);
				}, 200);
			});
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
		});

		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			if (event.dataField === 'dcCode' || event.dataField === 'plant' || event.dataField === 'storageType') {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}
			if (
				event.item.rowStatus !== 'I' &&
				event.dataField === 'distanceType' &&
				(event.isClipboard === false || event.isClipboard === undefined)
			) {
				return false;
			}
			if (event.item.rowStatus === 'I') return true;
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

		// PK validation
		if (!gridRef.current.validatePKGridData(['dcCode', 'plant', 'storageType', 'distanceType'])) {
			return;
		}

		for (const item of updatedItems) {
			item.plant = item.plant.substring(1, 5);
		}

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				if (res.statusCode > -1) {
					gridRef.current.setAllCheckedRows(false);
					gridRef.current.resetUpdatedItems();
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
		if (dcCode && dcCode.length === 1) {
			return dcCode[0];
		} else if (dcCode && dcCode.length > 1) {
			return '';
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
					dcCode: getSelectDccodeList(),
					status: '90',
					delYn: 'N',
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

export default MsPickBatchGroupDetail;
