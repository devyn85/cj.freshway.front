// CSS

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsDCxCust';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import styled from 'styled-components';

const MsDCxCustDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	const user = useAppSelector(state => state.user.userInfo);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'serialKey',
			headerText: t('lbl.SERIALKEY'),
			dataType: 'string',
			visible: false,
		},
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
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
		},
		// {
		// 	dataField: 'storerKey',
		// 	headerText: t('lbl.STORERKEY'),
		// 	dataType: 'string',
		// },
		{
			dataField: 'custKey',
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.custkey = e.item.custKey;
					e.item.storekey = e.item.storeKey;
					gridRef.current.openPopup(e.item, 'cust');
				},
			},
		},
		{
			dataField: 'custName',
			headerText: t('lbl.FROM_CUSTNAME_RT'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'custType',
			headerText: t('lbl.CUSTTYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'partnerKey',
			headerText: t('lbl.PARTNERKEY'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('PARTNERKEY', ''),
			},
		},
		{
			dataField: 'distanceType',
			headerText: t('lbl.DISTANCETYPE'),
			dataType: 'string',
			visible: false,
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			editable: false,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STATUS_DC', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STATUS_DC', value)?.cdNm;
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN', ''),
			},
		},
		// {
		// 	dataField: 'custTypeCd',
		// 	headerText: t('lbl.CUSTTYPECD'),
		// 	dataType: 'string',
		// },
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
		fillColumnSizeMode: false,
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

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
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
		<>
			<StyledTopBtnWrap>
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} />
			</StyledTopBtnWrap>
			<GridAutoHeight id="msDCxCust-grid">
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});

export default MsDCxCustDetail;

const StyledTopBtnWrap = styled.div`
	width: 100%;
	display: flex;
	margin-bottom: 10px;
	.title-area {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title {
			display: flex;
			align-items: center;
		}
	}
`;
