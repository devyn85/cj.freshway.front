/*
 ############################################################################
 # FiledataField	: SysManualDetail.tsx
 # Description		: ADMIN > 시스템운영 > 매뉴얼 Grid 영역
 # Author			: JangGwangSeok
 # Since			: 26.01.29
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import SysManualUploadPopup from '@/components/sys/manual/SysManualUploadPopup';

// API

const SysManualDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const refModalManual = useRef(null);
	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파라미터

	const systemClList = [
		{ label: t('lbl.WEB'), value: 'LOGISONE' },
		{ label: t('lbl.CENTER_APP'), value: 'WMMOB' },
		{ label: t('lbl.DRIVER_APP'), value: 'DMMOB' },
	];

	// 그리드 초기화
	const gridCol = [
		// {
		// 	dataField: 'systemCl',
		// 	headerText: t('lbl.SYSTEM_CL'),
		// 	dataType: 'code',
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return systemClList.filter((system: any) => system.value === value).map((obj: any) => obj.label);
		// 	},
		// },
		{
			dataField: 'progCd',
			headerText: t('lbl.PROG_CD'),
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.progLvl === 2) {
					return 'bg-green--custom-1';
				} else if (item?.progLvl === 3) {
					return 'bg-yellow--custom-1';
				} else {
					return '';
				}
			},
		},
		{
			dataField: 'progNm',
			headerText: t('lbl.PROG_NM'),
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.progLvl === 2) {
					return 'bg-green--custom-1';
				} else if (item?.progLvl === 3) {
					return 'bg-yellow--custom-1';
				} else {
					return '';
				}
			},
		},
		{
			dataField: 'refDocid',
			headerText: t('매뉴얼 첨부'),
			renderer: {
				type: 'ButtonRenderer',
				labelText: t('파일첨부'),
				visibleFunction: function (rowIndex: number, columnIndex: number, value: any, item: any) {
					// 실제 업무화면만 파일첨부 가능
					if (
						(item.systemCl === 'LOGISONE' && item.progLvl === 4) ||
						((item.systemCl === 'WMMOB' || item.systemCl === 'DMMOB') && item.progLvl === 2)
					) {
						return true;
					}
					return false;
				},
				onClick: (event: any) => {
					setPopUpParams(event.item);
					refModalManual.current.handlerOpen();
				},
			},
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				if (item?.fileCnt === '1') {
					return '1';
				} else {
					return '파일첨부';
				}
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.progLvl === 2) {
					return 'bg-green--custom-1';
				} else if (item?.progLvl === 3) {
					return 'bg-yellow--custom-1';
				} else {
					return '';
				}
			},
		},
		{
			dataField: 'refUpperProgNo',
			visible: false,
		},
		{
			dataField: 'rowId',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		fillColumnSizeMode: true,
		// rowIdField: 'rowId',
		// useCtrlF: false, // 트리 구조일 경우 AUI그리드 searchAll() 검색 method 사용불가

		// // 트리 구조 관련 속성
		// treeColumnIndex: 1, // 계층형 그리드(트리 그리드) 에서 트리 아이콘을 출력시킬 칼럼 인덱스를 지정
		// displayTreeOpen: true, // 최초 보여질 때 모두 열린 상태로 출력 여부
		// flat2tree: true,
		// treeIdField: 'progNo',
		// treeIdRefField: 'refUpperProgNo',
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				callBackFn: () => {
					onClickManualPopup();
				},
			},
		],
	};

	/**
	 * 매뉴얼 파일 팝업
	 * @returns {void}
	 */
	const onClickManualPopup = () => {
		setPopUpParams({
			progCd: 'WM10',
		});
		refModalManual.current.handlerOpen();
	};

	/**
	 * 팝업 콜백
	 * @returns {void}
	 */
	const popupCallBack = () => {
		// 콜백 처리
		if (props.callBackFn && props.callBackFn instanceof Function) {
			props.callBackFn();
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridProps={gridProps} totalCnt={props.totalCnt} gridTitle={t('lbl.LIST')} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* Fax 파일업로드 */}
			<CustomModal ref={refModalManual} width="1084px">
				<SysManualUploadPopup popUpParams={popUpParams} callBack={popupCallBack} />
			</CustomModal>
		</>
	);
});

export default SysManualDetail;
