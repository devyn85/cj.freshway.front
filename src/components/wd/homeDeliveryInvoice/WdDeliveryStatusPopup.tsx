import { Button, Form } from 'antd';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
//Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
//API
import { apiGetDeliveryStatus, apiGetDocumentModify } from '@/api/wd/apiWdHomeDeliveryInvoic';
// Utils
// API Call Function
interface PropsType {
	popupParams: any;
	close?: any;
	refModal?: any;
}
const WdDeliveryStatusPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { popupParams, close, refModal } = props;
	const [form] = Form.useForm();
	const [activeKey, setActiveKey] = useState('1');
	const [data, setData] = useState({});

	// 다국어
	const { t } = useTranslation();

	refModal.gridRef = useRef(null);
	refModal.gridRef2 = useRef(null);

	let bFlag = false;

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveKey('1');
			refModal.gridRef.current?.resize('100%', '100%');
			callApi(apiGetDeliveryStatus, popupParams, resCallback1);
		} else {
			setActiveKey('2');
			refModal.gridRef2.current?.resize('100%', '100%');
			callApi(apiGetDocumentModify, popupParams, resCallback2);
		}
		return;
	};

	// Response Callback
	const resCallback1 = useCallback((res: any) => {
		refModal.gridRef.current?.setGridData(res.data);
	}, []);

	const resCallback2 = useCallback((res: any) => {
		refModal.gridRef2.current?.setGridData(res.data);
	}, []);

	const callApi = useCallback(async (apiFunc: any, params: any, callback?: any) => {
		const res = await apiFunc(popupParams);
		callback?.(res);
	}, []);

	const callRefresh = useCallback(() => {
		if (bFlag) return; // 이미 호출된 경우 중복 호출 방지
		// 출고진행현황과 변경이력 API 호출
		callApi(apiGetDeliveryStatus, popupParams, resCallback1);
		bFlag = true;
	}, []);

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			// 지사 (Branch Office)
			headerText: '지사',
			dataField: 'dealtBranNm',
		},
		{
			// 처리점소명 (Processing Branch Name)
			headerText: '처리점소',
			dataField: 'processBranNm',
		},
		{
			// 스켄구분 (접수구분) (Scan Type / Receipt Type)
			headerText: '스켄구분',
			dataField: 'rcptDv',
		},
		{
			// 스켄일자 (Scan Date)
			headerText: '스켄일자',
			dataField: 'scanYmd',
		},
		{
			// 스켄시간 (Scan Time)
			headerText: '스켄시간',
			dataField: 'scanHour',
		},
		{
			// 상대점소 (처리점소명) (Counterpart Branch / Processing Branch Name)
			headerText: '상대점소',
			dataField: 'counterpartBranNm',
		},
		{
			// 인수자명 (처리사원명) (Acquirer Name / Processing Employee Name)
			headerText: '처리자',
			dataField: 'dealtEmpNm',
		},
		{
			// 기타 (Other Details)
			headerText: '기타',
			dataField: 'detailRsn',
		},
		{
			// 등록일시 (Registration Date)
			headerText: '등록일시',
			dataField: 'addYmd',
		},
		{
			// 등록시간 (Registration Time)
			headerText: '등록시간',
			dataField: 'addHour',
		},
		{
			// 스캔장비 (Scan Device)
			headerText: '스캔장비',
			dataField: 'scanDvc',
		},
		{
			// 콘솔스캔 (Console Scan)
			headerText: '콘솔스캔',
			dataField: 'cslDvc',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		// autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		//independentAllCheckBox: true,
		// fixedColumnCount: 2,
		fillColumnSizeMode: false,
		showFooter: false,
		// 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
		showDragKnobColumn: false,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		enableDrag: false,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		enableMultipleDrag: false,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		enableDrop: false,
		minHeight: 400,
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: refModal.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 컬럼
	const gridCol2 = [
		{ headerText: '품목번호', /*품목번호*/ dataField: 'docline', dataType: 'code' },
		{ headerText: '판매단위', /*판매단위*/ dataField: 'uom', dataType: 'code' },
		{ headerText: '주문수량', /*주문수량*/ dataField: 'orderqty', dataType: 'numeric' },
		{ headerText: '고객요청주문수정량', /*고객요청주문수정량*/ dataField: 'orderadjustqty', dataType: 'numeric' },
		{ headerText: '삭제여부', /*삭제여부*/ dataField: 'delYn', dataType: 'code' },
		{ headerText: '최종변경시간', /*최종변경시간*/ dataField: 'editdate', dataType: 'date' },
		{ headerText: '최종변경자', /*최종변경자*/ dataField: 'editwho', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps2 = {
		editable: false,
		// autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		//independentAllCheckBox: true,
		// fixedColumnCount: 2,
		fillColumnSizeMode: false,
		showFooter: false,
		// 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
		showDragKnobColumn: false,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		enableDrag: false,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		enableMultipleDrag: false,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		enableDrop: false,
		minHeight: 400,
	};

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: refModal.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	useEffect(() => {
		callRefresh();
	});

	return (
		<>
			{/* 그리드 영역 */}

			<Tabs activeKey={activeKey} onTabClick={tabClick}>
				<TabPane tab="출고진행현황" key="1">
					<AGrid>
						<AUIGrid ref={refModal.gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</AGrid>
				</TabPane>
				<TabPane tab="변경이력" key="2">
					<AGrid>
						<AUIGrid ref={refModal.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
					</AGrid>
				</TabPane>
			</Tabs>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
				<Button type="primary" onClick={close}>
					확인
				</Button>
			</ButtonWrap>
		</>
	);
});

export default WdDeliveryStatusPopup;
