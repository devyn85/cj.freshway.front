/*
 ############################################################################
 # FiledataField	: KpKxClosePopupChangeInfo.tsx
 # Description		: 문서정보(변경이력)
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

const KpKxClosePopupChangeInfo = forwardRef((props: any, ref: any) => {
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
		// 	dataField: 'command',
		// 	headerText: '명령구분',
		// 	width: 100,
		// },
		// {
		// 	dataField: 'storerkey',
		// 	headerText: '화주코드',
		// 	width: 100,
		// },
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
		},
		{
			dataField: 'uom',
			headerText: '단위',
			width: 80,
		},
		{
			dataField: 'orderqty',
			headerText: '주문수량',
			dataType: 'numeric',
			style: 'aui-right',
			width: 90,
		},
		{
			dataField: 'orderadjustqty',
			headerText: '고객요청주문수정량',
			dataType: 'numeric',
			style: 'aui-right',
			width: 100,
		},
		{
			dataField: 'delYn',
			headerText: '삭제여부',
			width: 80,
		},
		// {
		// 	dataField: 'procpossYn',
		// 	headerText: '처리가능여부',
		// 	width: 100,
		// },
		// {
		// 	dataField: 'procpossMsg',
		// 	headerText: '처리가능메시지',
		// 	width: 220,
		// },
		{
			dataField: 'editdate',
			headerText: '수정일시',
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
			<AGrid className="h-auto" style={{ minHeight: '710px' }}>
				<GridTopBtn gridBtn={gridBtn1} gridTitle={'내역'} totalCnt={props.totalCnt}></GridTopBtn>
				<AUIGrid ref={ref.gridRef1} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default KpKxClosePopupChangeInfo;
