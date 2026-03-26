import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Antd
import { Form } from 'antd';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// Type
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { GridBtnPropsType } from '@/types/common';
import commUtil from '@/util/commUtil';
import dayjs from 'dayjs';

const DpInspectTotal = forwardRef((props: any, ref: any) => {
	ref.gridRef1 = useRef();
	const { t } = useTranslation();

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	// 미검수사유
	const inspectCodeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('REASONCODE_DPINSPECT', value)?.cdNm;
	};

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef1.current.openPopup(e.item, 'sku');
				},
			},
			editable: false,
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'),
			dataType: 'string',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			editable: false,
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderQty',
			headerText: t('lbl.POQTY'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'inspectQty',
			headerText: t('lbl.INSPECTQTY_DP'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'shortageQty',
			headerText: t('lbl.UNINSPECTQTY_DP'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'qtyPerBox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'statusName',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tranQty',
			headerText: t('lbl.INSPECTEDQTY_DP'),
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item?.uom === 'KG') {
						return {
							type: 'InputEditRenderer',
							onlyNumeric: true,
							allowPoint: true,
							allowNegative: true,
						};
					}
					return {
						type: 'InputEditRenderer',
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
					};
				},
			},
		},
		{
			dataField: 'lotManufacture',
			headerText: '기준일(제조)',
			align: 'center',
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lotTable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'lotExpire',
			headerText: '기준일(소비)',
			align: 'center',
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lotTable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION'),
			dataType: 'numeric',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lotTable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationRate',
			headerText: t('lbl.DURATION_RATE'),
			dataType: 'code',
			editable: false,
		},
		// {
		// 	dataField: 'inspectReason',
		// 	headerText: t('lbl.REASON_NONDPINSPECT'),
		// 	dataType: 'code',
		// 	editable: true,
		// 	commRenderer: {
		// 		type: 'dropDown',
		// 		list: getCommonCodeList('REASONCODE_DPINSPECT'),
		// 	},
		// },
		// {
		// 	dataField: 'inspectMsg',
		// 	headerText: t('lbl.OTHER'),
		// 	editable: true,
		// },
		{
			dataField: 'editwhoName',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
		},
		{
			dataField: 'editwho',
			visible: false,
		},
	];

	// 그리드 Props
	const gridProps = {
		showFooter: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		editable: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'sku',
			// colSpan: 2, // 셀 가로 병합 대상은 2개로 설정
		},
		{
			dataField: 'orderQty',
			positionField: 'orderQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'inspectQty',
			positionField: 'inspectQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'shortageQty',
			positionField: 'shortageQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'tranQty',
			positionField: 'tranQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
	];

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: props.clickSave,
			},
		],
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		ref.gridRef1.current?.bind('cellEditBegin', (e: any) => {
			// 검수확정수량 컬럼. 저장유무가 일배나 광역일배면 수정 못하게 한다.
			// 2026-01-23 롤백 FWNEXTWMS-6564
			// if (e.dataField === 'tranQty') {
			// 	if (e.item.channel === '2' || e.item.channel === '3') {
			// 		return false;
			// 	} else {
			// 		return true;
			// 	}
			// }

			if (['lotManufacture', 'lotExpire'].includes(e.dataField)) {
				//if (e.value == 'STD') {
				if (e.value === 'STD' || e.item.crossLoc === 'CROSS' || e.item.channel !== '1') {
					return false;
				}
			}
			// if (['inspectQty'].includes(e.dataField)) {
			// 	//if (e.value == 'STD') {
			// 	//console.log('####################', e.channel.value);
			// 	if (e.channel.value === '2' || e.channel.value === '3') {
			// 		return false;
			// 	}
			// }

			// if (['lotManufacture', 'lotExpire'].includes(e.dataField)) {
			// 	if (e.item.crossLoc == 'CROSS' || e.item.channel != '1') {
			// 		return false;
			// 	}
			// }
		});

		ref.gridRef1.current.bind('cellEditEnd', (e: any) => {
			//제조변경
			if (['lotManufacture'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotManufacture, duration, durationType } = ref.gridRef1.current.getGridData()[rowIndex];

				const lotExpire =
					lotManufacture == 'STD'
						? 'STD'
						: dayjs(lotManufacture, 'YYYYMMDD')
								.add(duration - 1, 'day')
								.format('YYYYMMDD');

				ref.gridRef1.current.setCellValue(rowIndex, 'lotExpire', lotExpire);
				ref.gridRef1.current.setCellValue(rowIndex, 'lotTable01', durationType == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				ref.gridRef1.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				ref.gridRef1.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}

			//유통변경
			if (['lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotExpire, duration, durationType } = ref.gridRef1.current.getGridData()[rowIndex];

				const lotManufacture =
					lotExpire == 'STD'
						? 'STD'
						: dayjs(lotExpire, 'YYYYMMDD')
								.add(-(duration - 1), 'day')
								.format('YYYYMMDD');

				ref.gridRef1.current.setCellValue(rowIndex, 'lotManufacture', lotManufacture);
				ref.gridRef1.current.setCellValue(rowIndex, 'lotTable01', durationType == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				ref.gridRef1.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				ref.gridRef1.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}
		});

		// ref.gridRef1.current.bind('cellEditBegin', (e: any) => {
		// 	if (['lotManufacture', 'lotExpire'].includes(e.dataField)) {
		// 		if (e.item.crossLoc == 'CROSS' || e.item.channel != '1') {
		// 			return false;
		// 		}
		// 	}
		// });
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef1.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(
				props.data.map((item: any) => ({
					...item,
					durationRate: commUtil.calcDurationRate(item.lotExpire, item.duration),
					durationTerm: commUtil.calcDurationTerm(item.lotExpire, item.duration),
				})),
			);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
				ref.gridRef.current.setFocus();
			}
		}
	}, [props.data]);

	useEffect(() => {
		initEvent();
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Form form={props.form} className="h100" style={{ marginTop: '15px' }}>
				<AGrid>
					<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn} totalCnt={props.data.length}>
						{/*<Form layout="inline" form={props.form}>
							<SelectBox
								name="reasonCode"
								placeholder="선택해주세요"
								options={getCommonCodeList('REASONCODE_DPINSPECT', t('lbl.ALL'))}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								label={t('lbl.REASON_NONDPINSPECT')}
								className="bg-white"
								style={{ width: 150 }}
							/>
							<InputText
								name="reasonMsg"
								placeholder={t('msg.placeholder1', [t('lbl.REASONMSG_DPINSPECT')])}
								label={t('lbl.REASONMSG_DPINSPECT')}
								className="bg-white"
							/>
							<Button size={'small'} onClick={props.clickApplySelect}>
								선택적용
							</Button>
						</Form>*/}
					</GridTopBtn>
					<GridAutoHeight id="dpInspect-total-grid">
						<AUIGrid ref={ref.gridRef1} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
					</GridAutoHeight>
				</AGrid>
			</Form>
		</>
	);
});

export default DpInspectTotal;
