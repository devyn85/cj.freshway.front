/*
############################################################################
# FiledataField		: TmTempMonitorDetailList.tsx
# Description		: 온도기록모니터링 - 온도기록상세 목록
# Author		: Park EunKyung(ekmona.park@cj.net)
# Since			: 2025.10.27
# Updated		: 
############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';

import TmTempHistoryPopup from '@/components/tm/temperature/TmTempHistoryPopup';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { TemperatureRecordData, VehicleData } from '@/types/tm/tmTempMonitor';
import { useTranslation } from 'react-i18next';

interface TmTempMonitorDetailListProps {
	form: any;
	gridData: TemperatureRecordData[];
	detailTotalCnt: number;
	freeze: {
		naCnt: number;
		outCnt: number;
		nomlCnt: number;
	};
	refrig: {
		naCnt: number;
		outCnt: number;
		nomlCnt: number;
	};
	selectedVehicle: VehicleData | null;
	onTabChange: (key: string) => void;
	onLoadMore: () => void;
	reqTempReport: any;
}

const TmTempMonitorDetailList = ({
	form,
	gridData,
	detailTotalCnt,
	freeze,
	refrig,
	selectedVehicle,
	onTabChange,
	onLoadMore,
	reqTempReport,
}: TmTempMonitorDetailListProps) => {
	const gridRef = useRef<any>(null);
	const { t } = useTranslation();

	const timeUnit = form.getFieldsValue().timeUnit;
	const tempStatus = form.getFieldsValue().tempStatus;
	const [summary, setSummary] = useState<{
		refrigeratedNormalCount: number;
		refrigeratedOutCount: number;
		refrigeratedNaCount: number;
		freezingNormalCount: number;
		freezingOutCount: number;
		freezingNaCount: number;
	}>({
		refrigeratedNormalCount: 0,
		refrigeratedOutCount: 0,
		refrigeratedNaCount: 0,
		freezingNormalCount: 0,
		freezingOutCount: 0,
		freezingNaCount: 0,
	});

	const [summaryContent, setSummaryContent] = useState<string>('');
	const [tempHistoryPopup, setTempHistoryPopup] = useState(false);

	const getColor4TemperatureStatus = (value: string) =>
		(({ NOML: { color: 'black' }, OUT: { color: 'red' }, NA: { color: 'orange' } } as const)[value] ??
		({ color: 'black' } as const));

	const labelFn = (value: any) =>
		value == null || value === '' ? '' : getCommonCodebyCd('TEMPERATURE_STATUS', value)?.cdNm ?? '';

	// Temperature Record Detail columns
	const detailGridCol = [
		{
			dataField: 'carno',
			headerText: t('lbl.VHCNUM'), // '차량번호',
			width: 150,
			dataType: 'code',
			cellMerge: true,
		},
		{
			dataField: 'recordTime',
			headerText: t('lbl.TEMP_COLLECT_DATE_TIME'), // '온도 수집일시',
			width: 180,
			dataType: 'date',
		},
		{
			dataField: 'refrig',
			headerText: t('lbl.REFRIGERATION_TEMP'), // '냉장',
			width: 100,
			formatString: '#,##0.0',
			dataType: 'numeric',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.refrigerationStatus === 'OUT') {
					return { color: 'red' };
				}
				return { color: 'black' };
			},
		},
		{
			dataField: 'freeze',
			headerText: t('lbl.FREEZING_TEMP'), // '냉동',
			width: 100,
			formatString: '#,##0.0',
			dataType: 'numeric',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.freezingStatus === 'OUT') {
					return { color: 'red' };
				}
				return { color: 'black' };
			},
		},
		{
			dataField: 'refrigStatus',
			headerText: t('lbl.REFRIGERATION_STATUS'), // '냉장상태',
			width: 110,
			dataType: 'code',
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				return labelFn(value);
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				return getColor4TemperatureStatus(value);
			},
		},
		{
			dataField: 'freezeStatus',
			headerText: t('lbl.FREEZING_STATUS'), // '냉동상태',
			width: 110,
			dataType: 'code',
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				return labelFn(value);
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				return getColor4TemperatureStatus(value);
			},
		},
		{
			dataField: 'custkey',
			headerText: '고객코드', // '거래처코드',
			dataType: 'code',
		},
		{
			dataField: 'custname',
			headerText: t('lbl.CUST_NAME'), // '거래처명',
			dataType: 'text',
		},
	];

	// 온도기록상세 그리드 Props
	const detailGridProps = {
		editable: false,
		showStateColumn: true,
		showRowCheckColumn: true,
		fillColumnSizeMode: false,
		enableCellMerge: true, // 셀 병합 기능 활성화 (같은 값의 연속된 행 병합)
		// cellMergeRowSpan: true, // 실제 rowspan 적용 (선택사항, 기본값은 false)
	};

	// 스크롤 페이징 훅 적용
	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			if (gridData.length < detailTotalCnt && onLoadMore) onLoadMore();
		},
		totalCount: detailTotalCnt,
	});

	// 온도기록상세 그리드에 데이터 설정 시 선택한 행 초기화
	useEffect(() => {
		const gridInstance = gridRef.current;
		if (!gridInstance) return;
		if (gridData?.length > 0) {
			// Grid가 준비되었는지 확인 후 데이터 설정
			// AUIGrid는 ready 이벤트를 통해 초기화되므로, 약간의 지연을 두거나 ready 체크
			const setData = () => {
				if (gridInstance.setGridData) {
					// 셀 병합을 위해 carno로 정렬된 데이터 사용
					const sortedData = [...gridData].sort((a, b) => {
						if (a.carno < b.carno) return -1;
						if (a.carno > b.carno) return 1;
						return 0;
					});

					gridInstance.setGridData(sortedData);

					if (gridData.length > 0) {
						// 컬럼 크기 자동 조정
						const colSizeList = gridInstance.getFitColumnSizeList(true);
						if (colSizeList) {
							gridInstance.setColumnSizeList(colSizeList);
						}
					}

					// 스크롤로 데이터 마지막 행에 추가되면 그리드 첫번째 행으로 스크롤되는 현상 방지를 위해 추가
					if (detailTotalCnt > gridData?.length) {
						gridInstance.setSelectionByIndex(gridData.length - 5, 0);
					}
					gridInstance.resize('100%', '100%');
				}
			};
			// Grid가 아직 준비되지 않았을 수 있으므로 ready 이벤트 확인 또는 지연
			if (gridInstance.getGridData) {
				// Grid가 이미 초기화된 경우
				setData();
			} else {
				// Grid가 아직 초기화 중인 경우, ready 이벤트 대기
				gridInstance.bind(
					'ready',
					() => {
						setData();
					},
					true,
				); // 한 번만 실행
			}
		} else {
			gridInstance.setGridData([]);
			gridInstance.resize('100%', '100%');
		}

		// 써머리 정보 설정
		setSummary({
			refrigeratedNormalCount: gridData.filter(item => item.refrigStatus === 'NOML').length,
			refrigeratedOutCount: gridData.filter(item => item.refrigStatus === 'OUT').length,
			refrigeratedNaCount: gridData.filter(item => item.refrigStatus === 'NA').length,
			freezingNormalCount: gridData.filter(item => item.freezeStatus === 'NOML').length,
			freezingOutCount: gridData.filter(item => item.freezeStatus === 'OUT').length,
			freezingNaCount: gridData.filter(item => item.freezeStatus === 'NA').length,
		});
	}, [gridData]);

	// 써머리 : 리스트에 조회된 기준으로 표시. 정상n건, 이탈n건, 확인불가 n건, | 온도상태, n분 단위(시간단위 간격)
	useEffect(() => {
		const tempStatusNm = getCommonCodebyCd('TEMPERATURE_STATUS', tempStatus)?.cdNm ?? '전체';
		const summaryContent = `냉장(정상: ${refrig.nomlCnt}건, 이탈: ${refrig.outCnt}건, 확인불가: ${refrig.naCnt}건),
													  냉동(정상: ${freeze.nomlCnt}건, 이탈: ${freeze.outCnt}건, 확인불가: ${freeze.naCnt}건)
													  | ${tempStatusNm}, ${timeUnit}분 단위`;
		setSummaryContent(summaryContent);
	}, [refrig, freeze, tempStatus, timeUnit]);

	// 그리드 크기 조정
	useEffect(() => {
		if (gridRef.current) gridRef.current?.resize('100%', '100%');
	}, []);

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [],
	};

	return (
		<>
			<AGrid>
				<GridTopBtn
					gridTitle={t('lbl.LIST')}
					gridBtn={gridBtn}
					totalCnt={detailTotalCnt}
					extraContentLeft={<em className="summary-content">{summaryContent}</em>}
				>
					{/* <Button onClick={onReportPopup}>{t('lbl.TEMP_REPORT')}</Button> */}
					<Button
						onClick={() => {
							setTempHistoryPopup(true);
						}}
						disabled={gridData.length === 0}
					>
						{t('lbl.TEMP_REPORT')}
					</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={detailGridCol} gridProps={detailGridProps} />
			</AGrid>
			{/* 온도기록지 팝업 임시 */}
			{tempHistoryPopup && (
				<TmTempHistoryPopup
					title={''}
					open={tempHistoryPopup}
					onClose={() => {
						setTempHistoryPopup(false);
					}}
					pForm={form}
					reqTempReport={reqTempReport}
					setTempHistoryPopup={setTempHistoryPopup}
					gridRef={gridRef}
				/>
			)}
		</>
	);
};
export default TmTempMonitorDetailList;
