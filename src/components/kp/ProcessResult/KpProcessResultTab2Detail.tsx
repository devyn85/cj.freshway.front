/*
 ############################################################################
 # FiledataField	: KpProcessResultTab2Detail.tsx
 # Description		: 공정별생산성(Detail)
 # Author			: 박요셉
 # Since			: 25.12.17 
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const KpProcessResultTab2Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();

	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const getGridCol2 = [
		{
			dataField: 'id',
			headerText: 'ID',
			dataType: 'code',
		},
		{
			dataField: 'dccode',
			headerText: '소속센터',
			dataType: 'code',
		},
		{
			dataField: 'wddccode',
			headerText: t('lbl.WD_DCCODE'),
			dataType: 'code',
		},
		{
			headerText: '공정',
			dataField: 'proc',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CHANNEL_DMD'), // 저장유무
			dataField: 'channel',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STORAGETYPE'), //기존 - > 온도대  / 저장조건으로 수정
			dataField: 'storagetype',
			dataType: 'code',
		},
		{
			headerText: '인시생산성(라벨)',
			dataField: 'hcnt1',
			dataType: 'numeric',
		},
		{
			headerText: '인시생산성(물량)',
			dataField: 'hqty',
			dataType: 'numeric',
		},
		{
			headerText: '업무시간',
			dataField: 'difftm',
			dataType: 'code',
		},
		{
			headerText: '이동횟수',
			dataField: 'cnt4',
			dataType: 'numeric',
		},
		{
			headerText: '라벨건수',
			dataField: 'cnt1',
			dataType: 'numeric',
		},
	];

	// 그리드 Props
	const gridProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		// showRowCheckColumn: true,
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

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

	// useEffect(() => {

	// }, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={getGridCol2} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default KpProcessResultTab2Detail;
