/*
 ############################################################################
 # FiledataField	: IbExpenseStatusDetail.tsx
 # Description		: 원가관리리포트
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.02
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';

// API

interface IbExpenseStatusDetailProps {
	gridData: any;
	totalCount: any;
	gridData2: any;
	totalCount2: any;
	callBackFn: any;
	searchForm: any;
}

const IbExpenseStatusDetail = forwardRef((props: IbExpenseStatusDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRef2 = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 문서정보 팝업용 Ref
	const refDocumentModal = useRef(null);

	// ITEM 팝업용 Ref
	const refItemModal = useRef(null);

	// 파일 팝업용 Ref
	const refUploadfileModal = useRef(null);

	// 일괄 파일 팝업용 Ref
	const refUploadfileMultiModal = useRef(null);

	// IF Status 팝업용 Ref
	const refIfstatusModal = useRef(null);

	// 결재 팝업용 Ref
	const refApprovalModal = useRef(null);

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// 선택한 행의 데이터 번호
	const [selectedSerialKey, setSelectedSerialKey] = useState<string | null>(null);

	// 선택한 행들의 데이터 번호
	const [selectedItems, setSelectedItems] = useState<[] | null>(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// 작업 결과 코드
	const statusApprLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STATUS_APPR', value)?.cdNm;
	};

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'code',
			visible: false,
		},
		{
			dataField: 'name',
			headerText: t('제비용 구분'), //제비용 구분
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'baseDate',
			headerText: t('기준일자'), //기준일자
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{
			dataField: 'quantity',
			headerText: t('Quantity'), //Quantity
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'quantityUnit',
			headerText: t('Unit'), //Unit
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'amount',
			headerText: t('Amount'), //Amount
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'amountUnit',
			headerText: t('Curr.'), //Curr.
			dataType: 'code',
			editable: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		showRowCheckColumn: false,
		enableFilter: true,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'amount',
			positionField: 'amount',
			operation: 'SUM',
			formatString: '#,##0',
		},
	];

	// 그리드 컬럼 설정
	const gridCol2 = [
		{
			dataField: 'code',
			visible: false,
		},
		{
			dataField: 'documentTypeCode',
			headerText: t('Doc.Type'), //Doc.Type
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'documentNumber',
			headerText: t('Document No'), //Document No
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'poNo',
			headerText: t('P/O No'), //P/O No
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'accountDetailCode',
			headerText: t('Cost Code'), //Cost Code
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'accountDetailName',
			headerText: t('Cost Name'), //Cost Name
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'quantity',
			headerText: t('Quantity'), //Quantity
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'quantityUnit',
			headerText: t('Unit'), //Unit
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'amount',
			headerText: t('Amount'), //Amount
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'amountUnit',
			headerText: t('Curr.'), //Curr.
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'baseDate',
			headerText: t('Posting Date'), //Posting Date
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps2 = {
		editable: false,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		showRowCheckColumn: false,
		enableFilter: true,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout2 = [
		{
			dataField: 'amount',
			positionField: 'amount',
			operation: 'SUM',
			formatString: '#,##0',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 체크박스 클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('rowCheckClick', (event: any) => {
			// // 전체 체크 항목
			// const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();
			// // 삭제 체크된 항목
			// const deleteItems = ref.gridRef.current.getRemovedItems();
			// // deleteItems의 serialkey만 추출
			// const removedSerialKeys = deleteItems.map((item: any) => item.serialkey);
			// // checkedItems에서 deleteItems에 없는 데이터만 필터링
			// const filteredItems = checkedItems.filter((item: any) => !removedSerialKeys.includes(item.serialkey));
			// // serialkey 컬럼 값만 추출해서 리스트 생성
			// const serialkeyList = filteredItems.map((item: any) => item.serialkey);
			// setSelectedItems(serialkeyList);
		});

		/**
		 * 그리드 체크박스 전체 클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('rowAllChkClick', (event: any) => {
			// // 전체 체크 항목
			// const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();
			// // 삭제 체크된 항목
			// const deleteItems = ref.gridRef.current.getRemovedItems();
			// // deleteItems의 serialkey만 추출
			// const removedSerialKeys = deleteItems.map((item: any) => item.serialkey);
			// // checkedItems에서 deleteItems에 없는 데이터만 필터링
			// const filteredItems = checkedItems.filter((item: any) => !removedSerialKeys.includes(item.serialkey));
			// // serialkey 컬럼 값만 추출해서 리스트 생성
			// const serialkeyList = filteredItems.map((item: any) => item.serialkey);
			// setSelectedItems(serialkeyList);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 바인딩
	 */
	useEffect(() => {
		initEvent();
	}, []);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef?.current && props.gridData) {
			ref.gridRef.current.setGridData(props.gridData);
			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData, ref.gridRef]);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef2?.current && props.gridData2) {
			ref.gridRef2.current.setGridData(props.gridData2);
			if (props.gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef2.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef2.current.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData2, ref.gridRef2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}></GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<GridAutoHeight key="IbExpenseStatus-gridRef2">
						<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
					</GridAutoHeight>,
				]}
			/>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});

export default IbExpenseStatusDetail;
