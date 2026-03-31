// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostSaveIFManager } from '@/api/sys/apiSysIFManager';

const SysIFManagerDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	const { t } = useTranslation();

	const getGridCol = () => {
		return [
			{
				headerText: 'TARGETSYSTEM',
				dataField: 'targetSystem',
				// cellMerge: true, // 셀 병합
			},
			{
				headerText: 'IF_ID',
				dataField: 'ifId',
			},
			{
				headerText: 'IF_NAME',
				dataField: 'ifName',
			},
			{
				headerText: 'DEL_YN',
				dataField: 'delYn',
				commRenderer: {
					type: 'dropDown',
					disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
						// 행 아이템이 EAI송신대상자가 아니면 비활성화 처리
						if (item.eaiMngYn !== 'Y') {
							return true;
						}
						return false;
					},
					list: [
						{
							comCd: 'N',
							cdNm: '정상가동(N)',
						},
						{
							comCd: 'Y',
							cdNm: '삭제(Y)',
						},
						{
							comCd: 'S',
							cdNm: '일시정지(S)',
						},
					],
				},
			},
			{
				headerText: 'ORG_DEL_YN',
				dataField: 'orgDelYn',
				visible: false, // 숨김 처리
			},
			{
				headerText: 'STATUS',
				dataField: 'status',
				styleFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					// 상태에 따른 스타일 적용 - CLASS명 반환
					if (value === 'START') {
						return 'fc-blue';
					} else if (value === 'END') {
						return '';
					} else if (value === 'FAIL') {
						return 'fc-red';
					}
				},
				commRenderer: {
					type: 'dropDown',
					list: [
						{
							comCd: 'START',
							cdNm: 'START',
						},
						{
							comCd: 'END',
							cdNm: 'END',
						},
						{
							comCd: 'FAIL',
							cdNm: 'FAIL',
						},
					],
				},
			},
			{
				headerText: 'ORG_STATUS',
				dataField: 'orgStatus',
				visible: false, // 숨김 처리
			},
			{
				headerText: 'STARTDATE',
				dataField: 'startDate',
			},
			{
				headerText: 'ENDDATE',
				dataField: 'endDate',
			},
			{
				headerText: 'LASTRUN',
				dataField: 'lastRun',
			},
			{
				headerText: 'REALTYPE',
				dataField: 'realType',
			},
			{
				headerText: 'SYNCTYPE',
				dataField: 'syncType',
			},
			{
				headerText: 'METHOD',
				dataField: 'method',
			},
		];
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	const initEvent = () => {
		ref.gridRef.current?.bind('cellEditBegin', function (event: any) {
			// delYn 필드가 편집되는 경우, 상태가 'END'인 행은 편집 불가
			if (event.dataField === 'delYn') {
				if (event.item.status === 'END') {
					return false; // false 반환. 기본 행위인 편집 불가
				}
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellEditEnd', (event: any) => {
			// delYn 필드가 편집되는 경우, 상태가 'END'인 행은 'U' 상태로 변경
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			if (event.dataField === 'delYn') {
				ref.gridRef?.current.refresh();
			}
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveFunc = () => {
		// 변경 데이터 확인
		const menus = ref.gridRef.current.getChangedData();
		if (!menus || menus.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		// validation
		if (menus.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		}

		ref.gridRef.current.showConfirmSave(() => {
			apiPostSaveIFManager(menus).then(() => {
				// 콜백 처리
				props.callBackFn && props.callBackFn instanceof Function ? props.callBackFn() : null;
			});
		});
	};

	// 그리드 속성 설정
	const gridProps = {
		enableCellMerge: true, // 셀 병합 기능 활성화
		showRowCheckColumn: true, // 체크박스 컬럼 표시
		// showRowAllCheckBox: false, // 전체 선택 체크박스 표시
		// extraColumnOrders: ['showRowCheckColumn', 'showRowNumColumn'], // 체크박스 컬럼과 행 번호 컬럼을 항상 첫번째와 두번째로 표시
		rowStyleFunction: function (rowIndex: any, item: any) {
			const delYn = item?.delYn;
			switch (delYn) {
				case 'S':
					return 'bg-warning'; // bg-warning
				case 'Y':
					return 'bg-light'; // bg-light
				default:
					return 'row-base'; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
			}
		},
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveFunc,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 최초 마운트시 초기화
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<style>{` .row-base { background-color: white !important; } `}</style>
				<GridTopBtn gridTitle={''} gridBtn={gridBtn}></GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default SysIFManagerDetail;
