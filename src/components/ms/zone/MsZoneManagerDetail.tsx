/*
 ############################################################################
 # FiledataField	: MsZoneManagerDetail.tsx
 # Description		: 기준정보 > 센터기준정보 > 존정보
 # Author			: JeongHyeongCheol
 # Since			: 25.05.27
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// util

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsZoneManager';

// types
import { GridBtnPropsType } from '@/types/common';
interface MsZoneManagerDetailProps {
	gridData?: Array<object>;
	search?: any;
	dccode?: any[];
}
const MsZoneManagerDetail = forwardRef((props: MsZoneManagerDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { dccode } = props;
	const { t } = useTranslation();
	const [totalCount, setTotalCount] = useState(0);
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			dataType: 'code',
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
			dataField: 'zone',
			headerText: '피킹존',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			required: true,
		},
		{
			dataField: 'description',
			headerText: '내역',
		},
		// {
		// 	dataField: 'instrategy',
		// 	headerText: '입고 전략',
		// },
		// {
		// 	dataField: 'outstrategy',
		// 	headerText: '출고 전략',
		// },
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('STORAGETYPE_ZONE'),
			},
		},
		{
			dataField: 'zoneGugan',
			headerText: '존 구간',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('ZONE_GUGAN'),
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN').filter((item: any) => {
					return item.comCd === 'Y' || item.comCd === 'N';
				}),
			},
		},
		{
			dataField: 'status',
			headerText: '진행상태',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('STATUS_ZONE'),
			},
			visible: false,
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
		isLegacyRemove: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 존 정보 변경사항 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 중복 체크
		if (!gridRef.current.checkDuplicateValue(['dccode', 'zone'])) {
			return false;
		}

		const params = gridRef.current.getChangedData();
		// validation
		if (params.length > 0 && !gridRef.current.validateRequiredGridData()) {
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

		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
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
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					instrategy: 'STD',
					outstrategy: 'STD',
					delYn: 'N',
					dccode:
						dccode.length === 1 && !(dccode.includes('0000') || dccode.includes('0001') || dccode.includes('0002'))
							? dccode[0]
							: null,
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
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 에디팅 시작 이벤트
	useEffect(() => {
		// 에디팅 시작 이벤트 바인딩
		gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField === 'zone') {
				return gridRef.current.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;

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
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCount} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default MsZoneManagerDetail;
