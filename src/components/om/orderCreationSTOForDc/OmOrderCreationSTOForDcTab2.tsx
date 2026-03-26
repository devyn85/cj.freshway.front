// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

const OmOrderCreationSTOForDcTab2 = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 그리드 초기화
	const gridCol = [
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
				},
			],
		},
		{
			dataField: 'toSku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNM'), // 상품명
		},
		{
			dataField: 'fromUom',
			headerText: t('lbl.UOM'), // 단위
			dataType: 'code',
		},
		{
			dataField: 'toStockgrade',
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			dataType: 'code',

			// 공통코드 STOCKGRADE로 라벨펑션 적용
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STOCKGRADE', value)?.cdNm || '';
			},
		},
		{
			dataField: 'toOrderqty',
			headerText: t('lbl.TRANQTY'), // 작업수량
			dataType: 'numeric',
		},
		{
			// 처리결과
			dataField: 'processflag',
			headerText: t('lbl.PROCESSFLAG'),
			dataType: 'code',
		},
		{
			headerText: t('lbl.PROCESSMSG'), // 처리메시지
			children: [
				{
					dataField: 'docNo',
					headerText: '문서번호', // 문서번호
					dataType: 'code',
				},
				{
					dataField: 'itemNo',
					headerText: '품목번호', // 품목번호
					dataType: 'code',
				},
			],
		},
	];

	// 그리드 속성
	const gridPropsTab2 = {
		editable: false,
		fillColumnSizeMode: false,
		showRowCheckColumn: false,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		props.gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			props.gridRef?.current.setSelectionByIndex(0);
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: props.gridRef, // 타겟 그리드 Ref
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

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = props.gridRef.current;
		if (gridRefCur) {
			const setData = props.data.map((item: any) => {
				const msgObj: { [key: string]: string } = {};
				item?.processmsg.split(',').forEach((message: any) => {
					const [key, value] = message.split(':');
					if (key && value) {
						msgObj[key.trim()] = value.trim();
					}
				});
				return {
					...item,
					docNo: msgObj['문서번호'],
					itemNo: msgObj['품목번호'],
				};
			});

			gridRefCur?.setGridData(setData);
			gridRefCur?.setSelectionByIndex(0, 0);

			// 데이터 설정 후 컬럼 크기 자동 조정
			setTimeout(() => {
				const colSizeList = gridRefCur?.getFitColumnSizeList(true);
				gridRefCur?.setColumnSizeList(colSizeList);
				gridRefCur?.resize('100%', '100%');
			}, 50);
		}
	}, [props.data]);

	return (
		<AGrid>
			<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn} />
			<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridPropsTab2} />
		</AGrid>
	);
});

export default OmOrderCreationSTOForDcTab2;
