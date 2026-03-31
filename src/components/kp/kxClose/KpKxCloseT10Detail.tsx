// Lib
import { Button } from 'antd';

// API Call Function
import { apiSaveStockIdInit } from '@/api/kp/apiKpKxClose';

// component
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import styled from 'styled-components';

const KpKxCloseT10Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	const { t } = useTranslation();

	const getGridCol = () => {
		return [
			{
				headerText: '물류센터',
				dataField: 'dccode',
			},
			{
				headerText: '창고',
				dataField: 'organize',
			},
			{
				headerText: '상품코드',
				dataField: 'sku',
			},
			{
				headerText: '저장위치',
				dataField: 'stockType',
			},
			{
				headerText: '작업구역',
				dataField: 'area',
			},
			{
				headerText: '로케이션',
				dataField: 'loc',
			},
			{
				headerText: '단위',
				dataField: 'uom',
			},
			{
				headerText: '수량',
				dataField: 'qty',
				dataType: 'numeric',
			},
			{
				headerText: '진행예정수량',
				dataField: 'openQty',
				dataType: 'numeric',
			},
			{
				headerText: '입고예약량',
				dataField: 'qtyexpected',
				dataType: 'numeric',
			},
			{
				headerText: '출고예약',
				dataField: 'qtyReserve',
				dataType: 'numeric',
			},
			{
				headerText: '분배량',
				dataField: 'qtyAllocated',
				dataType: 'numeric',
			},
			{
				headerText: '피킹재고수량',
				dataField: 'qtyPicked',
				dataType: 'numeric',
			},
			{
				headerText: '보류량',
				dataField: 'qtyHold',
				dataType: 'numeric',
			},
			{
				headerText: '개체식별/유통이력',
				dataField: 'stockId',
			},
			{
				headerText: '이력상품여부',
				dataField: 'serialYn',
			},
			{
				headerText: '비정량여부',
				dataField: 'line01',
			},
			{
				headerText: '표준중량',
				dataField: 'line02',
				dataType: 'numeric',
			},
		];
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 그리드 속성 설정
	const gridProps = {};

	/**
	 * STOCKID 초기화처리 버튼
	 */
	const onClickStockIdInit = () => {
		showConfirm(null, t('msg.MSG_COM_CFM_020', ['바코드초기화']), () => {
			apiSaveStockIdInit({}).then(() => {
				// 콜백 처리
				if (props.search && props.search instanceof Function) {
					props.search();
				}
			});
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
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

	return (
		<>
			<CustomAGrid>
				<GridTopBtn
					gridBtn={{ tGridRef: ref.gridRef }}
					gridTitle={t('lbl.LIST')}
					totalCnt={props.totalCnt}
					extraContentLeft={<span className="msg">* 식자재직송(1000-1600) 재고 없어야 함 - 마감시 확인</span>}
				>
					<Button onClick={onClickStockIdInit}>바코드초기화</Button>
				</GridTopBtn>
			</CustomAGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});

export default KpKxCloseT10Detail;

const CustomAGrid = styled(AGrid)`
	height: auto;
	padding: 10px 0;
	margin-bottom: 0;
`;
