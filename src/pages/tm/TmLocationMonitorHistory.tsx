import { apiTmLocationMonitorPostGetCarTrackQryLogList } from '@/api/tm/apiTmLocationMonitor';
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import TmLocationMonitorHistorySearch from '@/components/tm/LocationMonitor/TmLocationMonitorHistorySearch';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { CarTrackQryLogItem } from '@/types/tm/locationMonitor';
import { Form } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';

const TmLocationMonitorHistory: React.FC = () => {
	const [form] = Form.useForm();
	const gridRef = useRef<any>(null);
	const [gridData, setGridData] = useState<CarTrackQryLogItem[]>([]);

	const onSearch = async () => {
		try {
			await form.validateFields();
			const params = form.getFieldsValue();
			if (params.date) {
				params.fromDate = params.date[0].format('YYYYMMDD');
				params.toDate = params.date[1].format('YYYYMMDD');
			} else {
				const today = dayjs().format('YYYYMMDD');
				params.fromDate = today;
				params.toDate = today;
			}

			// carno를 carnoList로 변환
			if (params.carno) {
				params.carnoList = params.carno.split(',');
			}
			delete params.carno;

			apiTmLocationMonitorPostGetCarTrackQryLogList(params).then(res => {
				if (res.statusCode === 0) {
					setGridData(res.data);
				}
			});
		} catch (errorInfo) {}
	};

	const onReset = () => {
		form.resetFields();
		setGridData([]);
	};

	const gridCol = [
		{ headerText: '이력일시', dataField: 'logTimestamp', dataType: 'date' },
		{ headerText: '물류센터', dataField: 'dcname', width: 150, dataType: 'code' },
		{ headerText: '배송일자', dataField: 'deliverydt', width: 200, dataType: 'date' },
		{
			headerText: '차량번호',
			dataField: 'carno',
			width: 200,
			dataType: 'code',
			labelFunction: (_rowIndex: any, _columnIndex: any, value: any) =>
				value == null || String(value).trim() === '' ? '전체' : value,
		},
		{ headerText: '사용자ID', dataField: 'userId', width: 200, dataType: 'code' },
		{ headerText: '사용자명', dataField: 'username', width: 200, dataType: 'code' },
		{ headerText: '디바이스', dataField: 'device', width: 200, dataType: 'code' },
		{ headerText: 'IP', dataField: 'ipAddress', width: 200, dataType: 'code' },
	];

	useEffect(() => {
		if (gridRef.current) {
			gridRef.current.setGridData(gridData);
		}
	}, [gridData]);

	const titleFunc = {
		searchYn: onSearch,
		reset: onReset,
	};

	return (
		<>
			<MenuTitle name="차량위치 조회 이력" func={titleFunc} authority="searchYn,reset" />
			<Form form={form}>
				<SearchFormResponsive form={form}>
					<TmLocationMonitorHistorySearch form={form} />
				</SearchFormResponsive>
			</Form>

			<div style={{ height: '100%', paddingBottom: '20px' }}>
				<AGrid style={{ flex: 1 }}>
					<GridTopBtn gridTitle={'목록'} />
					<AUIGrid ref={gridRef} columnLayout={gridCol} />
				</AGrid>
			</div>
		</>
	);
};

export default TmLocationMonitorHistory;
