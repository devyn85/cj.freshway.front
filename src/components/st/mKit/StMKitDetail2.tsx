/*
 ############################################################################
 # FiledataField	: StMKitDetail2.tsx
 # Description		: 재고 > 재고조정 > 키트처리 결과[이체대상TAB]
 # Author		    	: 고혜미
 # Since			    : 25.11.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { getUserDccodeList } from '@/store/core/userStore';

// Component

import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useEffect } from 'react';
//types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { Form } from 'antd';

const StMKitDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props;
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef2 = useRef();
	const userDccodeList = getUserDccodeList('') ?? [];
	// Declare init value(3/4)

	// 기타(4/4)

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'planDt',
			headerText: t('lbl.PLAN_DATE'),
			editable: false,
			width: 100,
			dataType: 'date',
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		}, // 계획일자
		{
			headerText: t('lbl.KITSKUINFO') /*KIT상품정보*/,
			children: [
				{
					headerText: t('lbl.KIT_SKU'),
					dataField: 'kitSku',
					dataType: 'code',
					editable: false,
					width: 90,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							const params = {
								sku: e.item.kitSku,
								skuDescr: e.item.kitNm,
							};
							ref.current.openPopup(params, 'sku');
						},
					},
				}, // 상품코드
				{
					headerText: t('lbl.KIT_SKUNAME'),
					dataField: 'kitNm',
					dataType: 'string',
					editable: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					width: 380,
				}, // 상품명칭
			],
		},
		// {
		// 	dataField: 'minExpiredt',
		// 	headerText: t('lbl.KITEXPIREDT'),
		// 	editable: false,
		// 	cellMerge: true,
		// 	mergeRef: 'rowDist',
		// 	mergePolicy: 'restrict',
		// 	width: 100,
		// 	dataType: 'date',
		// }, // KIT 소비일자
		{
			dataField: 'openqty',
			headerText: t('lbl.KITPLANQTY'),
			editable: false,
			width: 100,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
			dataType: 'numeric',
		}, // KIT 계획수량
		{
			dataField: 'confirmqty',
			headerText: t('lbl.KITCONFIRMQTY'),
			editable: true,
			width: 100,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
			dataType: 'numeric',
		}, // KIT 생산수량
		{
			headerText: t('lbl.SURPLUSQTY_PROCESSFLAG') /*처리결과*/,
			children: [
				{
					headerText: 'PROCESSFLAG',
					dataField: 'processflag',
					dataType: 'code',
					editable: false,
					width: 120,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
				},
				{
					headerText: 'PROCESSMSG',
					dataField: 'processmsg',
					dataType: 'string',
					editable: false,
					width: 250,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
				},
			],
		},
		{
			headerText: t('lbl.COMPONENTINFO'), // 구성품정보
			children: [
				{
					headerText: t('lbl.SKU'),
					dataField: 'sku',
					dataType: 'code',
					editable: false,
					width: 90,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							const params = {
								sku: e.item.sku,
								skuDescr: e.item.skuNm,
							};
							ref.current.openPopup(params, 'sku');
						},
					},
				}, // 상품코드
				{
					headerText: t('lbl.SKUNAME'),
					dataField: 'skuNm',
					dataType: 'string',
					editable: false,
					width: 380,
				}, // 상품명칭

				// { dataField: 'stockgradeNm', headerText: t('lbl.STOCKGRADE'), editable: false, width: 80, dataType: 'code' }, // 재고속성
				// { dataField: 'expiredt', headerText: t('lbl.EXPIREDT'), editable: false, width: 100, dataType: 'date' }, // 소비일자
				// { dataField: 'stockqty', headerText: t('lbl.QTY_ST'), editable: false, width: 100, dataType: 'numeric' }, // 현재고수량
				{ dataField: 'reqQty', headerText: t('lbl.REQ_QTY'), editable: false, width: 100, dataType: 'numeric' }, // 요청량
			],
		},
		{
			headerText: t('lbl.DECREASEQTY_PROCESSFLAG') /*처리결과*/,
			children: [
				{
					headerText: 'PROCESSFLAG',
					dataField: 'processflagitem',
					dataType: 'code',
					editable: false,
					width: 120,
				},
				{
					headerText: 'PROCESSMSG',
					dataField: 'processmsgitem',
					dataType: 'string',
					editable: false,
					width: 250,
				},
			],
		},
		{ dataField: 'rownum', visible: false }, // 순번(숨김)
		{ dataField: 'rowDist', visible: false }, // 세로병합용(숨김)
	];

	const gridProps = {
		editable: false,
		enableCellMerge: true,
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
		ref?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [],
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
		const gridRef2Cur = ref.current;
		if (gridRef2Cur) {
			gridRef2Cur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.REQ_PROCESSFLAG')} totalCnt={props.totalCnt}>
					<Form form={form} layout="inline"></Form>
				</GridTopBtn>
			</AGrid>
			{/* 요청처리결과 LIST 그리드 */}
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});

export default StMKitDetail2;
