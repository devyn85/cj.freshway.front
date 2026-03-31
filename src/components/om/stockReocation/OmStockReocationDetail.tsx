/*
 ############################################################################
 # FiledataField	: OmStockReocationDetail.tsx
 # Description		: 주문 > 주문등록 > 재고재배치조회
 # Author			: JeongHyeongCheol
 # Since			: 25.12.22
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import { SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';

// Components

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store

// API Call Function
import { apiGetDataList, apiGetDetailList, apiGetSkuCompareList } from '@/api/om/apiOmStockReocation';

// util

// types
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
interface OmStockReocationDetailProps {
	groupRef?: any;
	gridRef1?: any;
	gridRef2?: any;
	gridRef3?: any;
	gridRef4?: any;
	gridRef5?: any;
	gridRef6?: any;
	gridRef7?: any;
}

const OmStockReocationDetail = forwardRef((props: OmStockReocationDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { groupRef, gridRef1, gridRef2, gridRef3, gridRef4, gridRef5, gridRef6, gridRef7 } = props;
	const [totalCnt, setTotalCnt] = useState(0);
	const [resultOption, setResultOption] = useState([]);
	const [compareCnt, setCompareCnt] = useState('0');
	const [capaCnt, setCapaCnt] = useState('0');
	const [remainCnt, setRemainCnt] = useState('0');
	const [totalWeight, setTotalWeight] = useState('0');
	const { t } = useTranslation();
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	// 기본대상 capa항목조회
	const getGridCol1 = () => {
		return [
			{
				dataField: 'dcname',
				headerText: t('lbl.DCNAME'),
			},
			{
				headerText: 'CAPA',
				children: [
					{ headerText: '냉동', dataField: 'frozen', dataType: 'numeric', formatString: '#,##0.##' },
					{ headerText: '냉장', dataField: 'refrigeration', dataType: 'numeric', formatString: '#,##0.##' },
					{ headerText: '실온', dataField: 'roomTemp', dataType: 'numeric', formatString: '#,##0.##' },
				],
			},
		];
	};

	// 기본대상 최적화제외사유
	const getGridCol2 = () => {
		return [
			{
				dataField: 'optExceptReason',
				headerText: '최적화제외사유',
			},
			{ dataField: 'sku', headerText: t('lbl.SKU') },
		];
	};

	// 현재고 배치안 요약
	const getGridCol3 = () => {
		return [
			{ dataField: 'asIsConversionCount', headerText: 'AS-IS 다원화', dataType: 'numeric' },
			{ dataField: 'toBeConversionCount', headerText: 'TO-BE 다원화', dataType: 'numeric' },
			{ dataField: 'countOfSkus', headerText: '상품수', dataType: 'numeric' },
		];
	};

	// 사용 plt, 남은 plt, 이체량(kg)
	const getGridCol4 = () => {
		return [
			{ dataField: 'dcname', headerText: t('lbl.DCNAME') },
			{
				dataField: 'frozen',
				headerText: '냉동',
				dataType: 'numeric',
				formatString: '#,##0.##',
			},
			{
				dataField: 'refrigeration',
				headerText: '냉장',
				dataType: 'numeric',
				formatString: '#,##0.##',
			},
			{
				dataField: 'roomTemp',
				headerText: '실온',
				dataType: 'numeric',
				formatString: '#,##0.##',
			},
		];
	};

	// 상세 결과
	const getGridCol5 = () => {
		return [
			{ dataField: 'custkey', headerText: t('lbl.PARTNER_CD'), dataType: 'code' },
			{ dataField: 'custname', headerText: t('lbl.PARTNER_NAME') },
			{ dataField: 'sku', headerText: t('lbl.SKU'), dataType: 'code' },
			{ dataField: 'skuname', headerText: t('lbl.SKUNM') },
			{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), dataType: 'code' },
			{ dataField: 'wdDccode', headerText: t('lbl.WD_CENTER'), dataType: 'code' },
			{ dataField: 'befDccode', headerText: 'AS-IS 배치센터', dataType: 'code' },
			{ dataField: 'aftDccode', headerText: 'TO-BE 배치센터', dataType: 'code' },
			{ dataField: 'editCntt', headerText: '변경내용' },
			{ dataField: 'optExceptReason', headerText: '최적화제외이유' },
			{ dataField: 'befQty', headerText: 'AS-IS 재고수량', dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'aftQty', headerText: 'TO-BE 재고수량', dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'befPltQty', headerText: 'AS-IS PLT수량', dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'aftPltQty', headerText: 'TO-BE PLT수량', dataType: 'numeric', formatString: '#,##0.##' },
			{
				dataField: 'wdWgt30Sum',
				headerText: '이체무게(KG)_최근30일합계',
				dataType: 'numeric',
				formatString: '#,##0.##',
			}, //출고중량(KG)_최근30일합계
			{ dataField: 'befMoveQty', headerText: 'AS-IS 이체량', dataType: 'numeric', formatString: '#,##0.##' },
			{ dataField: 'aftMoveQty', headerText: 'TO-BE 이체량', dataType: 'numeric', formatString: '#,##0.##' },
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps1 = () => {
		return {
			editable: false,
			fillColumnSizeMode: true,
			enableColumnResize: true,
			// showRowCheckColumn: true,
		};
	};
	const getGridProps2 = () => {
		return {
			editable: false,
			fillColumnSizeMode: false,
			enableColumnResize: true,
		};
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 상세정보 조회
	 * @param value
	 * @returns {void}
	 */
	const aiResultSearch = (value: string) => {
		apiGetDetailList().then(res => {
			// res.data가 리스트라고 가정 (위의 질문 맥락상 res.data 내의 특정 리스트일 수 있으니 확인 필요)
			const data = res.data || [];
			// 수행결과 select option
			const uniqueList = [
				...new Map(
					data.map((item: any) => {
						const formattedDate = dayjs(item.reqNo, 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm');
						return [item.reqNo, { cdNm: formattedDate, comCd: item.reqNo }];
					}),
				).values(),
			];
			// select option set
			setResultOption(uniqueList);

			// 수행결과 일자 선택 내역만 세팅
			if (value !== '') {
				// 최적화 제외사유 그리드
				const exceptData = data.filter((item: any) => item.optExceptReason && item.reqNo === value);
				gridRef2.current.setGridData(exceptData);
				fitGridColumn(gridRef2);

				// 현재고 배차안 요약 상품 다원화 그리드
				const uniqueSkuString = (
					[...new Set(data.map((item: any) => String(item.sku || '')).filter(Boolean))] as string[]
				).join(',');
				const param = { sku: uniqueSkuString };
				apiGetSkuCompareList(param).then(res => {
					gridRef3.current.setGridData(res.data);
					// 1. countOfSkus 값들의 총합 계산
					// 숫자가 아닌 경우를 대비해 Number() 처리를 추가하는 것이 안전합니다.
					const totalCount = res.data.reduce((acc: number, cur: any) => {
						return acc + (Number(cur.countOfSkus) || 0);
					}, 0);

					setCompareCnt(totalCount.toLocaleString(undefined));
					fitGridColumn(gridRef3);
				});

				// 상세결과 그리드 set
				const detailGrid = data.filter((item: any) => item.reqNo === value);
				gridRef7.current.setGridData(detailGrid);
				setTotalCnt(detailGrid.length);
				fitGridColumn(gridRef7);
			}
		});
	};

	/**
	 * =====================================================================
	 *	grid button set
	 * =====================================================================
	 */

	const fitGridColumn = (ref: any) => {
		const size = ref?.current?.getFitColumnSizeList(true);
		if (size) ref.current.setColumnSizeList(size);
	};

	const initEvent = () => {
		// 테이블 조회
		aiResultSearch('');

		apiGetDataList().then(res => {
			const pltList = res.data.pltList || [];
			const capaList = res.data.capaList || [];
			const weightList = res.data.weightList || [];

			// 1. capaList를 dccode(또는 dcname)를 키로 하는 Map으로 변환
			const capaMap = new Map(capaList.map((item: any) => [item.dccode, item]));

			// 2. 차이값 계산 리스트 생성
			const diffList = pltList.map((plt: any) => {
				const capa: any = capaMap.get(plt.dccode);

				// 매칭되는 capa가 없으면 capa의 모든 수치를 0으로 간주하고 계산
				const cRoom = capa ? Number(capa.roomTemp) || 0 : 0;
				const cFrozen = capa ? Number(capa.frozen) || 0 : 0;
				const cRefrig = capa ? Number(capa.refrigeration) || 0 : 0;
				const cTotal = capa ? Number(capa.totalCapa) || 0 : 0;

				return {
					dccode: plt.dccode,
					dcname: plt.dcname,
					roomTemp: (Number(plt.roomTemp) || 0) - cRoom,
					frozen: (Number(plt.frozen) || 0) - cFrozen,
					refrigeration: (Number(plt.refrigeration) || 0) - cRefrig,
					totalCapa: (Number(plt.totalCapa) || 0) - cTotal,
				};
			});

			// 3. 그리드 데이터 세팅
			gridRef1.current.setGridData(pltList);
			gridRef4.current.setGridData(capaList);
			gridRef5.current.setGridData(diffList);
			gridRef6.current.setGridData(weightList);

			// 호출할 때
			fitGridColumn(gridRef1);
			fitGridColumn(gridRef4);
			fitGridColumn(gridRef5);
			fitGridColumn(gridRef6);

			// 4. 상단 카운트(Cnt) 세팅
			// 리스트가 비어있을 경우를 대비해 기본값 0 설정
			const totalPlt = pltList.length > 0 ? Number(pltList[0].totalCapa) || 0 : 0;
			const totalCapa = capaList.length > 0 ? Number(capaList[0].totalCapa) || 0 : 0;
			const totalWeight =
				weightList.length > 0
					? (Number(weightList[0].totalWeight) || 0).toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
					  }) || '0'
					: '0';

			// setPltCnt(totalPlt.toLocaleString(undefined));
			setCapaCnt(totalCapa.toLocaleString(undefined));
			setRemainCnt((totalPlt - totalCapa).toLocaleString(undefined));
			setTotalWeight(totalWeight);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		initEvent();
	}, []);

	return (
		<AGridWrap className="h100">
			<AGrid className="h100">
				<li>
					<SelectBox
						label="수행결과"
						name="resultList"
						options={resultOption}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						span={8}
						required
						onChange={(value: any) => {
							aiResultSearch(value);
						}}
					/>
				</li>

				<GridTopBtn gridTitle={'기본대상'} />
				<Row gutter={6}>
					<Col span={12}>
						<AUIGrid ref={gridRef1} columnLayout={getGridCol1()} gridProps={getGridProps1()} />
					</Col>
					<Col span={12}>
						<AUIGrid ref={gridRef2} columnLayout={getGridCol2()} gridProps={getGridProps1()} />
					</Col>
				</Row>
			</AGrid>
			<AGrid className="h100">
				<GridTopBtn gridTitle={'현재고 배치안 요약'} />
				<Row gutter={6}>
					<Col span={6}>
						<GridTopBtn gridTitle={`상품수:${compareCnt}`} />
						<AUIGrid ref={gridRef3} columnLayout={getGridCol3()} gridProps={getGridProps2()} />
					</Col>
					<Col span={6}>
						<GridTopBtn gridTitle={`사용 PLT|${capaCnt}`} />
						<AUIGrid ref={gridRef4} columnLayout={getGridCol4()} gridProps={getGridProps2()} />
					</Col>
					<Col span={6}>
						<GridTopBtn gridTitle={`남은 PLT|${remainCnt}`} />
						<AUIGrid ref={gridRef5} columnLayout={getGridCol4()} gridProps={getGridProps2()} />
					</Col>
					<Col span={6}>
						<GridTopBtn gridTitle={`이체량(KG)|${totalWeight}`} />
						<AUIGrid ref={gridRef6} columnLayout={getGridCol4()} gridProps={getGridProps2()} />
					</Col>
				</Row>
			</AGrid>
			<AGrid className="h100">
				<GridTopBtn gridTitle={'상세결과'} totalCnt={totalCnt} />
				<AUIGrid ref={gridRef7} columnLayout={getGridCol5()} gridProps={getGridProps2()} />
			</AGrid>
		</AGridWrap>
	);
});

export default OmStockReocationDetail;
