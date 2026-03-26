/*
 ############################################################################
 # FiledataField	: TmMngplcIDUndoneDetail.tsx
 # Description		: 배송 > 배차작업 > 분할 미적용 관리처 (목록)
 # Author					: JiHoPark
 # Since					: 2025.11.20.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util

// Store

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';

interface TmMngplcIDUndoneDetailProps {
	data: any;
	totalCnt: any;
}

const TmMngplcIDUndoneDetail = forwardRef((props: TmMngplcIDUndoneDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DOCDT_WD'), /*출고일자*/ dataField: 'deliverydate', dataType: 'date' },
		{ headerText: t('lbl.DOCNO_WD'), /*주문번호*/ dataField: 'docno', dataType: 'code' },
		{
			headerText: t('lbl.NO_APPLY_MNGPLC') /*분할 미적용 관리처*/,
			children: [
				{
					headerText: t('lbl.FROM_VATNO'),
					/*고객코드*/ dataField: 'toCustkey',
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							e.item.custkey = e.item.toCustkey;
							ref.current.openPopup(e.item, 'cust');
						},
					},
				},
				{
					headerText: t('lbl.TO_VATADDRESS'),
					/*고객명*/ dataField: 'toCustname',
					dataType: 'string',
				},
				{
					headerText: t('lbl.BASE_POP'),
					/*기본POP*/ dataField: 'toCustpop',
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.ALLAPPLY_PRINTINFO') /*적용시 출력 정보*/,
			children: [
				{
					headerText: t('lbl.FROM_VATNO'),
					/*고객코드*/ dataField: 'mngplcId',
					dataType: 'code',
				},
				{
					headerText: t('lbl.TO_VATADDRESS'),
					/*고객명*/ dataField: 'mngplcname',
					dataType: 'string',
				},
				{
					headerText: t('lbl.BASE_POP'),
					/*기본POP*/ dataField: 'mngplcpop',
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			headerText: t('lbl.SKUNM'),
			/*상품명*/ dataField: 'skuname',
			dataType: 'string',
		},
		{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'storeruom', dataType: 'code' },
		{
			headerText: t('lbl.STOREROPENQTY'),
			/*주문량*/ dataField: 'storeropenqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
	];

	// FooterLayout Props
	const footerCol = [
		{
			dataField: 'storeropenqty',
			positionField: 'storeropenqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		// autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showFooter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

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
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [],
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
			const dataList = props.data;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			if (dataList.length > 0) {
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
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</AGrid>
		</>
	);
});

export default TmMngplcIDUndoneDetail;
