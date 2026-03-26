/*
 ############################################################################
 # FiledataField	: KpKxClosePopupSkuInfo.tsx
 # Description		: 문서정보(품목정보탭)
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 26.03.12
 ############################################################################
*/

// lib

// component
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';

// store

// API Call Function

// util

// hook

// type

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';

const KpKxClosePopupSkuInfo = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid Ref
	ref.gridRef1 = useRef();
	const [form] = Form.useForm();
	const [totalCntDocDtl, setTotalCntDocDtl] = useState(0);

	//마스터 그리드 생성시 필요한 변수들
	const gridCol = [
		// {
		// 	dataField: 'docdt',
		// 	headerText: '문서일자',
		// 	width: 100,
		// },
		// {
		// 	dataField: 'doctype',
		// 	headerText: '문서구분',
		// 	width: 100,
		// },
		// {
		// 	dataField: 'docno',
		// 	headerText: '문서번호',
		// 	width: 140,
		// },
		{
			dataField: 'docline',
			headerText: '품목번호',
			width: 80,
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			width: 120,
			dataType: 'code',
		},
		{
			dataField: 'skuname',
			headerText: '상품명',
			width: 200,
		},
		// {
		// 	dataField: 'channel',
		// 	headerText: '채널',
		// 	width: 100,
		// },
		{
			dataField: 'storagetype',
			headerText: '보관유형',
			width: 100,
			dataType: 'code',
		},
		{
			dataField: 'uom',
			headerText: '판매단위',
			width: 80,
			dataType: 'code',
		},
		{
			dataField: 'orderqty',
			headerText: '주문수량',
			dataType: 'numeric',
			style: 'aui-right',
			width: 90,
		},
		{
			dataField: 'processqty',
			headerText: '분배량',
			dataType: 'numeric',
			style: 'aui-right',
			width: 90,
		},
		{
			dataField: 'workqty',
			headerText: '현장작업량',
			dataType: 'numeric',
			style: 'aui-right',
			width: 90,
		},
		{
			dataField: 'inspectqty',
			headerText: '검수량',
			dataType: 'numeric',
			style: 'aui-right',
			width: 90,
		},
		{
			dataField: 'confirmqty',
			headerText: '확정수량',
			dataType: 'numeric',
			style: 'aui-right',
			width: 90,
		},
		{
			dataField: 'cancelqty',
			headerText: '취소수량',
			dataType: 'numeric',
			style: 'aui-right',
			width: 90,
		},
		{
			dataField: 'closeyn',
			headerText: '마감여부',
			width: 90,
			dataType: 'code',
		},
		{
			dataField: 'status',
			headerText: '진행상태',
			width: 100,
			dataType: 'code',
		},
		{
			dataField: 'serialyn',
			headerText: '이력관리대상',
			width: 100,
			dataType: 'code',
		},
		{
			dataField: 'line01',
			headerText: '비정량여부',
			width: 80,
			dataType: 'code',
		},
		{
			dataField: 'plantDescr',
			headerText: '플랜트',
			width: 140,
			dataType: 'code',
		},
		// {
		// 	dataField: 'lot',
		// 	headerText: '기준일',
		// 	width: 120,
		// },
		{
			dataField: 'lottable01',
			headerText: '기준일',
			width: 120,
			dataType: 'code',
		},
		{
			dataField: 'memo1',
			headerText: '비고',
			width: 150,
		},
		{
			dataField: 'delYn',
			headerText: '삭제여부',
			width: 80,
			dataType: 'code',
		},
		{
			dataField: 'editdate',
			headerText: '최종변경자',
			width: 150,
		},
		{
			dataField: 'editwho',
			headerText: '수정자',
			width: 100,
		},
	];

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
	};

	// AUIGrid 옵션
	const gridProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 초기화
	 */
	// const initEvent = () => {};

	useEffect(() => {
		// 상세 초기화

		const gridRefCur1 = ref.gridRef1.current;

		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="h-auto" style={{ minHeight: '600px' }}>
				<GridTopBtn gridBtn={gridBtn1} gridTitle={'내역'} totalCnt={props.totalCnt}></GridTopBtn>
				<AUIGrid ref={ref.gridRef1} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default KpKxClosePopupSkuInfo;
