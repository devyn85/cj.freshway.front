// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

//Util
import { showConfirm, showMessage } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';

// API Call Function

const MsPickBatchGroupDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storageType',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STORAGETYPE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'distanceType',
			headerText: t('lbl.DISTANCETYPE'),
			dataType: 'code',
			editable: false,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('DISTANCETYPE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DISTANCETYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'batchGroup',
			headerText: t('lbl.BATCHGROUP'),
			dataType: 'code',
		},
		{
			dataField: 'description',
			headerText: t('lbl.DESCRIPTION'),
			dataType: 'string',
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
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STATUS_PICKGROUP', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STATUS_PICKGROUP', value)?.cdNm;
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
			headerText: t('lbl.ADDWHO'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'string',
			editable: false,
		},

		{
			dataField: 'editWho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'string',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
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
			if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
		});

		gridRef?.current.bind('cellClick', (event: any) => {
			const editableOnlyInNewRowFields = ['dcCode', 'plant', 'storageType', 'distanceType']; // 신규 행에서 편집을 허용할 컬럼 목록

			// 1. 현재 행이 신규 행인지 확인 (_isNewRow 플래그로 판단)
			const isNewRow = event.item && (event.item.rowStatus === 'I') === true;

			// 2. 현재 클릭된 컬럼이 'editableOnlyInNewRowFields' 목록에 포함되는지 확인
			const isTargetColumn = editableOnlyInNewRowFields.includes(event.dataField);

			// 디버깅을 위한 로그
			//console.log(
				`클릭 시도: [${event.rowIndex}] ${event.dataField} / isNewRow: ${isNewRow} / isTargetColumn: ${isTargetColumn}`,
			);

			// 조건: 신규 행이면서, 편집 허용할 특정 컬럼인 경우
			if (isNewRow && isTargetColumn) {
				// openEdit() 함수로 강제로 편집 모드를 엽니다.
				gridRef?.current.openEditDownListLayer(event.rowIndex, event.dataField);

				// 옵션: 한 번 편집 모드를 열고 나면 더 이상 신규 행으로 간주하지 않으려면
				// event.item._isNewRow = false; // 이렇게 직접 변경해도 됩니다.
				// 또는 특정 값이 채워지면 _isNewRow를 false로 변경하는 로직을 cellEditEnd 등에서 구현
			} else {
			}
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const savePickBatchGroupList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		} else {
			for (const item of updatedItems) {
				item.plant = item.plant.substring(1, 5);
			}
		}

		// 저장 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveMsPickBatchGroup(updatedItems).then(() => {
				gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
					gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				});
				gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();

				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
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
					storerkey: 'FW00',
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
				callBackFn: savePickBatchGroupList,
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
	});

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<AGrid dataProps={'row-single'}>
			<GridTopBtn gridTitle={'피킹그룹목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default MsPickBatchGroupDetail;
/**
 *
 * @param updatedItems
 */
async function apiPostSaveMsPickBatchGroup(updatedItems: any): Promise<void> {
	throw new Error('Function not implemented.');
}
