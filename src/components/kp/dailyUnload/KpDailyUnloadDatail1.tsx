/*
 ############################################################################
 # FiledataField	: KpDailyUnloadDatail1.tsx
 # Description		: 지표 > 생산성 > 데일리 생산성 하역 지표 관리(투입인원)
 # Author					: JiHoPark
 # Since					: 2026.01.19.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import KpDailyUnloadMasterPopup from '@/components/kp/dailyUnload/KpDailyUnloadMasterPopup';

// Util

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';

interface KpDailyUnloadDatail1Props {
	data: any;
	totalCnt: any;
	form: any;
	dailyColumns: any;
	onModifyListHandler: any;
	saveMaster: any;
}

const KpDailyUnloadDatail1 = forwardRef((props: KpDailyUnloadDatail1Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const excelRef = useRef(null);

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'),
			/*물류센터*/ dataField: 'dccodenm',
			dataType: 'code',
			editable: false,
			cellMerge: true,
		},
		{
			headerText: t('lbl.BOG_DV'),
			/*대구분*/ dataField: 'gubun1',
			dataType: 'code',
			editable: false,
			cellMerge: true,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DAILY_U_1', value)?.cdNm;
			},
		},
		{
			headerText: t('lbl.SMALL_DV'),
			/*소구분*/ dataField: 'gubun2',
			dataType: 'code',
			editable: false,
			cellMerge: true,
		},
		{
			headerText: t('lbl.CONTRACT_FROMDATE'),
			/*계약시작일*/ dataField: 'contractFromdate',
			dataType: 'date',
			editable: false,
		},
		{
			headerText: t('lbl.CONTRACT_TODATE'),
			/*계약종료일*/ dataField: 'contractTodate',
			dataType: 'date',
			editable: false,
		},
		{
			headerText: t('lbl.FROM_ENG'),
			/*FROM*/ dataField: 'fromHour',
			dataType: 'code',
			editable: false,
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99',
				textAlign: 'center',
				placeholder: '__:__', // 플레이스홀더
				applyMaskValue: true, // 실제 데이터 적용은 마스크 풀린 값이 적용됨.
			},
		},
		{
			headerText: t('lbl.TO_ENG'),
			/*TO*/ dataField: 'toHour',
			dataType: 'code',
			editable: false,
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99',
				textAlign: 'center',
				placeholder: '__:__', // 플레이스홀더
				applyMaskValue: true, // 실제 데이터 적용은 마스크 풀린 값이 적용됨.
			},
		},
		{
			headerText: t('lbl.WRKHR'),
			/*작업시간*/ dataField: 'worktime',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.#',
		},
		{ headerText: t('lbl.PERSON_TO'), /*인원(T/O)*/ dataField: 'gubun3', dataType: 'numeric', editable: false },
		{ dataField: 'serialkey', dataType: 'numeric', visible: false, editable: false },
		{ dataField: 'yyyymm', dataType: 'string', visible: false, editable: false },
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		enableCellMerge: true,
		cellMergeRowSpan: false,
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showFooter: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 투입인원 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		const chkDataList = ref.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		props.saveMaster(chkDataList);
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});

		/**
		 * 셀 편집 종료 후
		 * @event cellEditEndBefore
		 * @param {object} event 이벤트
		 * @returns {void} 최종 수정값
		 */
		ref.current?.bind('cellEditEnd', (event: any) => {
			const curDataField = event.dataField;
			const curSerialkey = event.item.serialkey;

			// 수정 목록 기록
			props.onModifyListHandler({ [curSerialkey]: curDataField });

			return true;
		});
	};

	/**
	 * 마스터관리 팝업
	 */
	const onKpDailyUnloadMasterPopupClick = () => {
		refModal.current.handlerOpen();
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		refModal2.current.handlerOpen();
	};

	/**
	 * 엑셀 팝업 닫기
	 * @param popupData
	 */
	const closeEvent = () => {
		refModal2.current.handlerClose();
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'btn1', // 엑셀업로드
			// 	callBackFn: onExcelUploadPopupClick,
			// },
			{
				btnType: 'btn2', // 마스터관리
				callBackFn: onKpDailyUnloadMasterPopupClick,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
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

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;

		if (gridRef) {
			ref.current?.changeColumnLayoutData([...gridCol, ...props.dailyColumns], true);

			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} />
			</AGrid>
			<CustomModal ref={refModal} width="1000px">
				<KpDailyUnloadMasterPopup />
			</CustomModal>
			<CustomModal ref={refModal2} width="1000px">
				{/* <KpDailyUnloadDatail1UploadExcelPopup close={closeEvent} ref={excelRef} /> */}
			</CustomModal>
		</>
	);
});

export default KpDailyUnloadDatail1;
