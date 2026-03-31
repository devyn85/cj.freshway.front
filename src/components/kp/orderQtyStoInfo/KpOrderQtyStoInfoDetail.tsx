/*
 ############################################################################
 # FiledataField	: KpOrderQtyStoInfoDetail.tsx
 # Description		: 지표 > 센터운영지표 > 이체 및 출고현황
 # Author			: JeongHyeongCheol
 # Since			: 25.11.20
 ############################################################################
*/
// CSS
import { apiGetDetailList } from '@/api/kp/apiKpOrderQtyStoInfo';
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
// Components
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { useAppSelector } from '@/store/core/coreHook';
// util

// API Call Function
// types
import { GridBtnPropsType } from '@/types/common';
interface KpOrderQtyStoInfoDetailProps {
	gridRef2?: any;
	gridData?: Array<object>;
	gridData2?: Array<object>;
	search?: any;
	deliverydate?: string;
}
const KpOrderQtyStoInfoDetail = forwardRef((props: KpOrderQtyStoInfoDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { gridRef2, gridData, gridData2, deliverydate } = props;
	const { t } = useTranslation();
	const [isCust, setIsCust] = useState(false);
	const [labelType, setLabelType] = useState('');
	const [popupType, setPopupType] = useState('');
	const [organizeCode, setOrganizeCode] = useState('');
	const [totalCount, setTotalCount] = useState(0);
	const [totalCount2, setTotalCount2] = useState(0);

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'centerGroup',
			headerText: '이체입고센터',
			dataType: 'code',
			cellMerge: true,
		},
		{
			dataField: 'storageType',
			headerText: '저장조건',
			dataType: 'code',
		},
		{
			headerText: '이체입고량',
			children: [
				{
					dataField: 'inTotalQty',
					headerText: '총합',
					dataType: 'code',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'inQtyAvg',
					headerText: '일평균',
					dataType: 'code',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'inQty2600',
					headerText: '이천',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'inQty2620',
					headerText: '수원',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'inQty2630',
					headerText: '수원2',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'inQty2650',
					headerText: '동탄',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'inQty2660',
					headerText: '동탄2',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'inQty2260',
					headerText: '양산',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'inQty2250',
					headerText: '양산직수입',
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			headerText: '이체입고 SKU수',
			children: [
				{
					dataField: 'inTotalSkuCount',
					headerText: '총합',
					dataType: 'code',
				},
				{
					dataField: 'inSkuCountLess1',
					headerText: '1톤미만',
					dataType: 'code',
				},
				{
					dataField: 'inSkuCountLess25',
					headerText: '2.5톤미만',
				},
				{
					dataField: 'inSkuCountLess5',
					headerText: '5톤미만',
				},
				{
					dataField: 'inSkuCountLess10',
					headerText: '10톤미만',
				},
				{
					dataField: 'inSkuCountOver10',
					headerText: '10톤이상',
				},
			],
		},
		{
			headerText: '이체 출고 센터',
			children: [
				{
					headerText: '이천',
					children: [
						{ dataField: 'outTon2600Total', headerText: '총합' },
						{ dataField: 'outTon2600Less1', headerText: '1톤미만' },
						{ dataField: 'outTon2600Less25', headerText: '2.5톤미만' },
						{ dataField: 'outTon2600Less5', headerText: '5톤미만' },
						{ dataField: 'outTon2600Less10', headerText: '10톤미만' },
						{ dataField: 'outTon2600Over10', headerText: '10톤이상' },
					],
				},
				{
					headerText: '수원',
					children: [
						{ dataField: 'outTon2620Total', headerText: '총합' },
						{ dataField: 'outTon2620Less1', headerText: '1톤미만' },
						{ dataField: 'outTon2620Less25', headerText: '2.5톤미만' },
						{ dataField: 'outTon2620Less5', headerText: '5톤미만' },
						{ dataField: 'outTon2620Less10', headerText: '10톤미만' },
						{ dataField: 'outTon2620Over10', headerText: '10톤이상' },
					],
				},
				{
					headerText: '수원2',
					children: [
						{ dataField: 'outTon2630Total', headerText: '총합' },
						{ dataField: 'outTon2630Less1', headerText: '1톤미만' },
						{ dataField: 'outTon2630Less25', headerText: '2.5톤미만' },
						{ dataField: 'outTon2630Less5', headerText: '5톤미만' },
						{ dataField: 'outTon2630Less10', headerText: '10톤미만' },
						{ dataField: 'outTon2630Over10', headerText: '10톤이상' },
					],
				},
				{
					headerText: '동탄',
					children: [
						{ dataField: 'outTon2650Total', headerText: '총합' },
						{ dataField: 'outTon2650Less1', headerText: '1톤미만' },
						{ dataField: 'outTon2650Less25', headerText: '2.5톤미만' },
						{ dataField: 'outTon2650Less5', headerText: '5톤미만' },
						{ dataField: 'outTon2650Less10', headerText: '10톤미만' },
						{ dataField: 'outTon2650Over10', headerText: '10톤이상' },
					],
				},
				{
					headerText: '동탄2',
					children: [
						{ dataField: 'outTon2660Total', headerText: '총합' },
						{ dataField: 'outTon2660Less1', headerText: '1톤미만' },
						{ dataField: 'outTon2660Less25', headerText: '2.5톤미만' },
						{ dataField: 'outTon2660Less5', headerText: '5톤미만' },
						{ dataField: 'outTon2660Less10', headerText: '10톤미만' },
						{ dataField: 'outTon2660Over10', headerText: '10톤이상' },
					],
				},
				{
					headerText: '양산',
					children: [
						{ dataField: 'outTon2260Total', headerText: '총합' },
						{ dataField: 'outTon2260Less1', headerText: '1톤미만' },
						{ dataField: 'outTon2260Less25', headerText: '2.5톤미만' },
						{ dataField: 'outTon2260Less5', headerText: '5톤미만' },
						{ dataField: 'outTon2260Less10', headerText: '10톤미만' },
						{ dataField: 'outTon2260Over10', headerText: '10톤이상' },
					],
				},
				{
					headerText: '양산직수입',
					children: [
						{ dataField: 'outTon2250Total', headerText: '총합' },
						{ dataField: 'outTon2250Less1', headerText: '1톤미만' },
						{ dataField: 'outTon2250Less25', headerText: '2.5톤미만' },
						{ dataField: 'outTon2250Less5', headerText: '5톤미만' },
						{ dataField: 'outTon2250Less10', headerText: '10톤미만' },
						{ dataField: 'outTon2250Over10', headerText: '10톤이상' },
					],
				},
			],
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: false,
		enableFilter: true,
		enableCellMerge: true,
	};

	// 그리드 컬럼
	const gridCol2 = [
		{
			dataField: 'sku',
			headerText: '코드',
			dataType: 'code',
			cellMerge: true,
		},
		{
			dataField: 'skuname',
			headerText: '상품명',
			dataType: 'code',
		},
		{
			dataField: 'storagetype',
			headerText: '저장조건',
			dataType: 'code',
		},
		{
			dataField: 'skuLdesc',
			headerText: '상품대분류',
			dataType: 'code',
		},
		{
			dataField: 'reference15',
			headerText: '전용구분',
			dataType: 'code',
		},
		{
			dataField: 'grossweight',
			headerText: '단위중량',
			dataType: 'code',
		},
		{
			dataField: 'qtyperbox',
			headerText: '박스입수',
			dataType: 'code',
		},
		{
			dataField: 'boxperplt',
			headerText: 'PLT입수',
			dataType: 'code',
		},
		{
			dataField: 'buyerName',
			headerText: '수급담당',
			dataType: 'code',
		},
		{
			headerText: '월출고량',
			children: [
				{
					dataField: 'confirmqty',
					headerText: '전체',
					dataType: 'code',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqtyS',
					headerText: '수도권',
					dataType: 'code',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty2600',
					headerText: '이천',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqtySuwon',
					headerText: '수원단지',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqtyDongtan',
					headerText: '동탄단지',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty2041',
					headerText: '제주',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty2260',
					headerText: '양산',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty2230',
					headerText: '장성',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty1000',
					headerText: 'KX센터',
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			headerText: '이체출고량',
			children: [
				{
					dataField: 'confirmqtySto',
					headerText: '전체',
					dataType: 'code',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqtySSto',
					headerText: '수도권',
					dataType: 'code',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty2600Sto',
					headerText: '이천',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqtySuwonSto',
					headerText: '수원단지',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqtyDongtanSto',
					headerText: '동탄단지',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty2041Sto',
					headerText: '제주',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty2260Sto',
					headerText: '양산',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty2230Sto',
					headerText: '장성',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'confirmqty1000Sto',
					headerText: 'KX센터',
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'ratioQty',
			headerText: '자체출고비중',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'ratioQtySto',
			headerText: '이체출고비중',
			filter: {
				showIcon: true,
			},
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * 그리드 이벤트 설정
	 */
	let selectGroup = '';
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', function (event: any) {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			const selectRowItem = event.primeCell.item;
			if (selectGroup !== selectRowItem.centerGroup && selectGroup !== '') {
				let dccodeList = [];
				if (selectRowItem.centerGroup === '전체') {
					dccodeList = [];
				} else if (selectRowItem.centerGroup === '수도권') {
					dccodeList.push('2600', '2620', '2630', '2650', '2660', '2250', '2260');
				} else {
					dccodeList.push(selectRowItem.centerDccode);
				}
				const params = {
					multiDccode: dccodeList,
					deliverydate: deliverydate,
				};

				apiGetDetailList(params).then(res => {
					// setGridData(res.data);
					gridRef2.current.setGridData(res.data);
					setTotalCount2(res.data.length);
					const colSizeList = gridRef2.current.getFitColumnSizeList(true);
					gridRef2.current.setColumnSizeList(colSizeList);
				});
			}
			selectGroup = selectRowItem.centerGroup;
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
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
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(gridData);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				setTotalCount(gridData.length);
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef2.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(gridData2);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (gridData2.length > 0) {
				setTotalCount2(gridData2.length);
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCount} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={'상세목록'} gridBtn={gridBtn} totalCnt={totalCount2} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default KpOrderQtyStoInfoDetail;
