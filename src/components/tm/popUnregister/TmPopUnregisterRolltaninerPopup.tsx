/*
 ############################################################################
 # FiledataField	: TmPopUnregisterRolltaninerPopup.tsx
 # Description		: 거래처별POP미등록현황 - 롤테이너별 배송 조회 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.08
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import TotalCount from '@/assets/styled/Container/TotalCount';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { forwardRef, useEffect } from 'react';

// Type

// Utils

// Store

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CustomModal from '@/components/common/custom/CustomModal';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiPostCarRolltainerList } from '@/api/tm/apiTmPopUnregister';

interface PopupParams {
	srcGridRef: any;
	rowIndex: number;
	dccode: any;
	carno: any;
	popno: any;
	dataFieldMap: Record<string, string>; // 예: { custcd: "code", custnm: "name" }
	onConfirm?: (selectedRows: any[]) => void; // 추가 콜백 함수
}

const TmPopUnregisterRolltaninerPopup = forwardRef((_, ref) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [totalCnt, setTotalCnt] = useState(0);

	// 컴포넌트 접근을 위한 Ref
	const gridRef: any = useRef(null);

	const modalRef = useRef<any>(null);
	const [popupParams, setPopupParams] = useState<PopupParams | null>(null);

	// 그룹코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			// 롤테이너번호
			headerText: t('lbl.ROLLTAINER_NO'),
			dataField: 'rolltainerNo',
			dataType: 'code',
		},
		{
			// 일평균 중량(KG)
			headerText: t('lbl.DAYAVG_DELIVERYWEIGHT_KG'),
			dataField: 'avgWeight',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			// 중량 비율
			headerText: t('lbl.WEIGHT_RATE'),
			dataField: 'rateWeight',
			dataType: 'numeric',
			formatString: '#,##0.#',
		},
		{
			// 일평균 체적(m3)
			headerText: t('lbl.DAYAVG_DELIVERYWEIGHT_CBM'),
			dataField: 'avgCube',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			// 기준 체적 대비 일평균 체적(m3) 비율
			headerText: t('lbl.CUBE_RATE'),
			dataField: 'rateCube',
			dataType: 'numeric',
			formatString: '#,##0.#',
		},
		{
			// 일평균 고객(건)
			headerText: t('lbl.DAYAVG_CUST_CNT'),
			dataField: 'avgDeliveryCnt',
			dataType: 'numeric',
			formatString: '#,##0.#',
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		//selectionMode: 'singleRow',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 외부에서 호출할 수 있는 open 메서드
	useImperativeHandle(ref, () => ({
		open: (params: PopupParams) => {
			setPopupParams(params);
			// 다음 tick에 modal open

			// setTimeout(() => {
			// 	modalRef.current?.handlerOpen();
			// 	searchMasterList(); // 팝업이 열릴 때 바로 조회 실행
			// }, 0);

			setTimeout(() => modalRef.current?.handlerOpen(), 0);
		},
		handlerClose: () => {
			modalRef.current?.handlerClose();
		},
	}));

	// 팝업 확인 시 실행될 콜백
	const selectRowData = (selectedRows: any[]) => {
		if (!popupParams || !selectedRows || selectedRows.length === 0) return;

		// 외부에서 전달받은 콜백 함수가 있으면 실행
		if (popupParams?.onConfirm) {
			popupParams.onConfirm(selectedRows);
		} else {
			// 기존 로직 (콜백이 없는 경우)
			const { srcGridRef, rowIndex, dataFieldMap } = popupParams;
			const rowData = selectedRows[0];

			// 업데이트할 필드 구성
			const updateObj: Record<string, any> = {};
			Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
				updateObj[targetField] = rowData[sourceField];
			});

			// 안전한 업데이트를 위해 next tick으로 밀기
			setTimeout(() => {
				srcGridRef?.current?.updateRow(updateObj, rowIndex);
				modalRef.current?.handlerClose();
			}, 0);
		}

		// rowIndex 값으로 rowId 조회 후 체크박스 추가
		popupParams?.srcGridRef?.current?.addCheckedRowsByIds(
			popupParams?.srcGridRef?.current?.indexToRowId(popupParams?.rowIndex),
		);
	};

	const handleClose = () => {
		modalRef.current?.handlerClose();
	};

	/**
	 * 조회
	 */
	const searchMasterList = () => {
		if (!popupParams.dccode) {
			return;
		}

		// 그리드 초기화
		gridRef.current?.clearGridData();
		// 조회 조건 설정
		const params = {
			dccode: popupParams.dccode,
			carno: popupParams.carno,
			popno: popupParams.popno,
		};

		apiPostCarRolltainerList(params).then((res: any) => {
			const gridRefCur = gridRef.current;
			if (gridRefCur) {
				gridRefCur?.setGridData(res.data);
				gridRefCur?.setSelectionByIndex(0, 0);
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
				// 총건수 초기화
				if (res.data?.length > 0) {
					setTotalCnt(res.data.length);
				}
			}
		});
	};

	/**
	 * 확인 버튼 클릭 이벤트
	 */
	const onClickConfirm = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		selectRowData(selectedRow);
	};

	/**
	 * 그리드 이벤트 설정
	 */
	// const initEvent = useCallback(() => {
	// 	// 기존 이벤트 해제(중복 방지)
	// 	gridRef.current?.unbind && gridRef.current?.unbind('cellDoubleClick');

	// 	/**
	// 	 * 마스터 그리드 바인딩 완료
	// 	 * @param {any} cellDoubleClick 이벤트
	// 	 */
	// 	gridRef.current?.bind('cellDoubleClick', (event: any) => {
	// 		selectRowData([event.item]);
	// 	});
	// }, []);

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 그리드 더블클릭시 이벤트 바인딩
	 */
	useEffect(() => {
		gridRef.current?.bind('cellDoubleClick', (event: any) => {
			selectRowData([event.item]);
		});
	});

	// 로딩 시 자동 조회 실행
	useEffect(() => {
		if (modalRef.current && popupParams) {
			searchMasterList();
		}
	}, [popupParams]);

	return (
		<CustomModal ref={modalRef} width="1000px">
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="" func={titleFunc} />

			{/* 검색 영역 정의 */}
			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCnt)}건</span>
			</TotalCount>

			{/* 화면 상세 영역 정의 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 버튼 영역 정의 */}
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={handleClose}>
					취소
				</Button>
				<Button size={'middle'} onClick={onClickConfirm} type="primary">
					확인
				</Button>
			</ButtonWrap>
		</CustomModal>
	);
});

export default TmPopUnregisterRolltaninerPopup;
