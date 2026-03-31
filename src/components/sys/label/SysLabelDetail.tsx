// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// API
import { apiPostSaveMasterList } from '@/api/sys/apiSysLabel';

const SysLabelDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const systemCl = Form.useWatch('systemCl', props.form);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'useYn',
			headerText: t('lbl.USE_YN'),
			commRenderer: {
				type: 'checkBox',
			},
			width: 50,
		},
		// {
		// 	dataField: 'systemCl',
		// 	headerText: t('lbl.SYSTEM_CL'), // 시스템 구분
		// 	width: 100,
		// 	required: true,
		// 	editable: false,
		// 	// editable: function (rowIndex: any, columnIndex: any, dataField: any, item: any) {
		// 	// 	return item._isAdded === true || item.isNewRow === true;
		// 	// },
		// },
		{
			dataField: 'labelType',
			headerText: t('lbl.LABEL_TP'), // 라벨유형
			required: true,
			width: 100,
			// 기존행 editable 막기위해 사용
			editRenderer: {
				type: 'DropDownListRenderer',
				// list: getCommonCodeList('DIRECTTYPE'),
				list: [
					{
						comCd: 'LBL',
						cdNm: 'LBL',
					},
					{
						comCd: 'MSG',
						cdNm: 'MSG',
					},
				],
				keyField: 'comCd',
				valueField: 'cdNm',
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
		},
		{
			dataField: 'labelCd',
			headerText: t('lbl.LABEL_CD'), // 라벨코드
			width: 190,
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
			dataField: 'labelNm',
			headerText: t('lbl.LABEL_NM'), // 라벨명
			width: 190,
			required: true,
		},
		{
			dataField: 'alignType',
			headerText: '정렬유형', // 정렬유형
			// required: true,
			width: 100,
			// 기존행 editable 막기위해 사용
			commRenderer: {
				type: 'dropDown',
				list: [
					{
						comCd: 'L',
						cdNm: 'LEFT',
					},
					{
						comCd: 'C',
						cdNm: 'CENTER',
					},
					{
						comCd: 'R',
						cdNm: 'RIGHT',
					},
				],
			},
		},
		// {
		// 	dataField: 'attribute1',
		// 	headerText: 'format', // format
		// 	width: 190,
		// 	commRenderer: {
		// 		type: 'text',
		// 		align: 'center',
		// 	},
		// },
		// {
		// 	dataField: 'attribute2',
		// 	headerText: 'visible', // visible
		// 	width: 190,
		// 	commRenderer: {
		// 		type: 'text',
		// 		align: 'center',
		// 	},
		// },
		// {
		// 	dataField: 'attribute3',
		// 	headerText: 'enable', // enable
		// 	width: 190,
		// 	commRenderer: {
		// 		type: 'text',
		// 		align: 'center',
		// 	},
		// },
		// {
		// 	dataField: 'attribute4',
		// 	headerText: 'type', // type
		// 	width: 190,
		// 	commRenderer: {
		// 		type: 'text',
		// 		align: 'center',
		// 	},
		// },
		// {
		// 	dataField: 'attribute5',
		// 	headerText: 'limit', // limit
		// 	width: 190,
		// 	commRenderer: {
		// 		type: 'text',
		// 		align: 'center',
		// 	},
		// },
		// {
		// 	dataField: 'attribute6',
		// 	headerText: 'decimal', // decimal
		// 	width: 190,
		// 	commRenderer: {
		// 		type: 'text',
		// 		align: 'center',
		// 	},
		// },
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		enableFilter: true,
		fillColumnSizeMode: true,
		showStateColumn: false, // row 편집 여부
		// showRowAllCheckBox: false, // 전체 선택 체크박스 표시 여부
		// rowCheckDisabledFunction: (rowIndex: number, item: any) => {
		// 	return true; // true 반환 시 체크박스 비활성화
		// },
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
		gridRef?.current?.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current?.bind('cellEditBegin', (event: any) => {
			if (event.dataField == 'labelType') {
				// dropdown 형태의 신규행 막기
				const rowIdField = gridRef.current.getProp('rowIdField');
				return gridRef.current.isAddedById(event.item[rowIdField]);
			}

			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			if (event.dataField == 'labelCd') {
				// 추가된 행 아이템인지 조사하여 추가된 행인 경우만 에디팅 진입 허용
				if (event.item.rowStatus === 'I') {
					return true;
				} else {
					return false; // false 반환하면 기본 행위 안함(즉, cellEditBegin 의 기본행위는 에디팅 진입임)
				}
			}
			return true; // 다른 필드들은 편집 허용
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveBlankLocList = () => {
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
		if (!gridRef.current.validatePKGridData(['systemCl', 'labelCd'])) {
			return;
		}

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(() => {
				// gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
				// 	gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				// });
				// gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();

				// showMessage({
				// 	content: t('msg.MSG_COM_SUC_003'),
				// 	modalType: 'info',
				// });

				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					props.callBackFn();
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					systemCl: 'LOGISONE',
					useYn: '1',
					rowStatus: 'I', // 신규 행 상태로 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveBlankLocList,
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
			{/* <GridTopBtn gridTitle={'기둥/빈공간 목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} /> */}
			<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default SysLabelDetail;
