/*
 ############################################################################
 # FiledataField	: TmDeliveryIndicatorDetail.tsx
 # Description		: 일별임시차현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.06
 # issues 			  : 추후 단가,운행 횟수 수정(운송비정산 완료후)
 ############################################################################
*/
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';

//type
import { GridBtnPropsType } from '@/types/common';

//store
import InputText from '@/components/common/custom/form/InputText';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';

const TmDeliveryIndicatorDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();

	const { t } = useTranslation();

	const gridId = useMemo(() => uuidv4() + '_gridWrap', []);
	const gridId1 = useMemo(() => uuidv4() + '_gridWrap', []);

	const rateStdWatch = Form.useWatch('rateStd', props.form1);

	const resizeAllGridsRaf = useCallback(() => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				ref.gridRef?.current?.resize?.('100%', '100%');
				ref.gridRef1?.current?.resize?.('100%', '100%');
			});
		});
	}, [ref]);

	const carTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_DELIVERYTYPE', value)?.cdNm;
	};

	const gridCol = [
		{
			dataField: 'gubun',
			headerText: '구분',
			cellMerge: true,
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

				if (item.gubun === '대상(실비제외)') {
					//console.log((1);
					//console.log((item);
					return { backgroundColor: '#e5e5e5' };
				}
			},
		},
		{
			headerText: '차량기준',
			children: [
				{
					dataField: 'totalCarCnt',
					headerText: '총대수',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
				{
					dataField: 'underCarCnt',
					headerText: '100%미만차량',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
				{
					dataField: 'underCarRate',
					headerText: '비율(%)',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.00',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
			],
		},
		{
			headerText: '거래처기준',
			children: [
				{
					dataField: 'arrivalCount',
					headerText: '착지수',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
				{
					dataField: 'reportCount',
					headerText: '보고',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
				{
					dataField: 'reportRate',
					headerText: '보고율(%)',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.00',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
			],
		},
	];

	// 하단(당일) 컬럼
	const gridCol1 = [
		{
			dataField: 'gubun',
			headerText: '구분',
			cellMerge: true,
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

				if (item.gubun === '대상(실비제외)') {
					//console.log((1);
					//console.log((item);
					return { backgroundColor: '#e5e5e5' };
				}
			},
		},
		{
			headerText: '차량기준',
			children: [
				{
					dataField: 'totalCarCnt',
					headerText: '총대수',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
				{
					dataField: 'underCarCnt',
					headerText: '100%미만차량',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
				{
					dataField: 'underCarRate',
					headerText: '비율(%)',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.00',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
			],
		},
		{
			headerText: '거래처기준',
			children: [
				{
					dataField: 'arrivalCount',
					headerText: '착지수',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
				{
					dataField: 'reportCount',
					headerText: '보고',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
				{
					dataField: 'reportRate',
					headerText: '보고율(%)',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.00',
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');

						if (item.gubun === '대상(실비제외)') {
							//console.log((1);
							//console.log((item);
							return { backgroundColor: '#e5e5e5' };
						}
					},
				},
			],
		},
	];

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1,
		btnArr: [],
	};

	// 그리드 설정
	const gridProps = {
		editable: false,
	};
	const gridProps1 = {
		editable: false,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 월 누계 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (!gridRefCur) return;

		gridRefCur.setColumnProp(2, {
			headerText: `${!props.form1.getFieldValue('rateStd') ? 100 : props.form1.getFieldValue('rateStd')}%미만차량`,
		});

		gridRefCur?.setGridData(props.data);
		gridRefCur?.setSelectionByIndex(0, 0);

		if (props.data?.length > 0) {
			const colSizeList = gridRefCur.getFitColumnSizeList(true);
			gridRefCur.setColumnSizeList(colSizeList);
		}

		resizeAllGridsRaf();
	}, [props.data, resizeAllGridsRaf]);

	// 당일 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef1.current;
		if (!gridRefCur) return;

		gridRefCur.setColumnProp(2, {
			headerText: `${!props.form1.getFieldValue('rateStd') ? 100 : props.form1.getFieldValue('rateStd')}%미만차량`,
		});

		gridRefCur?.setGridData(props.data1);
		gridRefCur?.setSelectionByIndex(0, 0);

		if (props.data1?.length > 0) {
			const colSizeList = gridRefCur.getFitColumnSizeList(true);
			gridRefCur.setColumnSizeList(colSizeList);
		}

		resizeAllGridsRaf();
	}, [props.data1, resizeAllGridsRaf]);

	// rateStd 변경 시 headerText 갱신 + resize 보강
	useEffect(() => {
		const v = !rateStdWatch ? 100 : rateStdWatch;

		const g0 = ref.gridRef.current;
		if (g0) {
			g0.setColumnProp(2, { headerText: `${v}%미만차량` });
		}

		const g1 = ref.gridRef1.current;
		if (g1) {
			g1.setColumnProp(2, { headerText: `${v}%미만차량` });
		}

		resizeAllGridsRaf();
	}, [rateStdWatch, resizeAllGridsRaf]);

	// 화면 밖/복귀(탭 전환/최소화 등) 시 레이아웃 재계산 보강
	useEffect(() => {
		const onVisibility = () => {
			if (document.visibilityState === 'visible') resizeAllGridsRaf();
		};
		document.addEventListener('visibilitychange', onVisibility);
		return () => document.removeEventListener('visibilitychange', onVisibility);
	}, [resizeAllGridsRaf]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid className="contain-wrap">
							<GridTopBtn
								gridTitle={`월 누계실적(기준일 : ${dayjs(props.form.getFieldValue('deliverydt')).format(
									'YYYY/MM/DD',
								)})`}
								totalCnt={props.totalCnt}
								gridBtn={gridBtn}
							>
								<Form form={props.form1} layout="inline" className="sect">
									<InputText
										placeholder="변경 사유를 입력해주세요"
										name="rateStd"
										defaultValue={'100'}
										label="%미만차량(차량별착지율)"
									/>
								</Form>
							</GridTopBtn>
							<GridAutoHeight id="monthly-cumulative-performance">
								<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
							</GridAutoHeight>
						</AGrid>
					</>,
					<>
						<AGrid className="contain-wrap">
							<GridTopBtn gridTitle="당일실적" totalCnt={props.totalCnt1} gridBtn={gridBtn1} />
						</AGrid>
						<GridAutoHeight id="daily-performance">
							<AUIGrid ref={ref.gridRef1} name={gridId1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default TmDeliveryIndicatorDetail;
