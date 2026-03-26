/*
############################################################################
# FiledataField		: TmTempMonitor.tsx
# Description		: 차량 온도 모니터링 (Temperature Record Monitoring)
# Author		: Park EunKyung(ekmona.park@cj.net)
# Since			: 2025.10.27
# Updated		: 
############################################################################
*/

// util
import { Form, message, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

// api
import {
	apiGetTemperatureMonitoring,
	apiGetTemperatureRecords,
	apiGetVehicleTemperatureData,
} from '@/api/tm/apiTmTempMonitor';
import {
	TemperatureRecordData,
	TemperatureRecordDataDto,
	VehicleChartData,
	VehicleData,
	VehicleDataDto,
} from '@/types/tm/tmTempMonitor';

// components
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import TmTempMonitorDetailList from '@/components/tm/temperature/TmTempMonitorDetailList';
import TmTempMonitorList from '@/components/tm/temperature/TmTempMonitorList';
import TmTempMonitorSearch from '@/components/tm/temperature/TmTempMonitorSearch';

// hooks
import { useReqTempReport } from '@/hooks/tm/useReqTempReport';
import { usePersistedTabStateOnPage } from '@/hooks/usePersistedTabStateOnPage';
import { useThrottle } from '@/hooks/useThrottle';

// util
import commUtil from '@/util/commUtil';

// 전역변수
export type tabKeyUnion = 'vehicle' | 'detail';

const TmTempMonitor = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();

	// 센터서류에서 온도기록지 조회 이동 시 요청 정보 저장 및 조회
	const { reqTempReport, clearReqTempReport } = useReqTempReport();
	const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);

	const [activeTabKey, setActiveTabKey] = usePersistedTabStateOnPage<tabKeyUnion>(
		'tm-temp-monitor-active-tab',
		'vehicle',
		['vehicle', 'detail'],
	);

	const [tabData, setTabData] = useState<
		Record<
			tabKeyUnion,
			{
				gridData: any[];
				totalCnt: number;
				currentPage: number;
				hasSearched: boolean;
				formData: any; // 각 탭의 검색 조건 저장
				chartData: any[] | null;
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
			}
		>
	>(() => {
		const initialData: Record<tabKeyUnion, any> = {} as any;
		const tabs: tabKeyUnion[] = ['vehicle', 'detail'];

		tabs.forEach(tab => {
			initialData[tab] = {
				gridData: [],
				totalCnt: 0,
				freeze: {
					naCnt: 0,
					outCnt: 0,
					nomlCnt: 0,
				},
				refrig: {
					naCnt: 0,
					outCnt: 0,
					nomlCnt: 0,
				},
				currentPage: 1,
				hasSearched: false,
				formData: null, // 처음에는 null, 검색 시 설정
				chartData: null,
			};
		});

		return initialData;
	});

	const currentTabData = tabData[activeTabKey];
	const anyGridData = currentTabData.gridData;
	const totalCnt = currentTabData.totalCnt;
	const freeze = currentTabData.freeze;
	const refrig = currentTabData.refrig;
	const currentPage = currentTabData.currentPage;
	const chartData = currentTabData.chartData;

	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	const [detailSearchBox] = useState({
		deliveryDt: dates,
		timeUnit: '10',
		tempStatus: '',
		base: 'CAR',
		depArrYn: false,
		dcIncYn: true,
		contracttype: '',
	});

	// 무한스크롤 페이징 관련
	// 페이지당 아이템 수 (고정값)
	const LIST_COUNT = 5000;

	// 페이징 조회 제한 함수
	const throttle = useThrottle();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const onTabChange = (key: string) => {
		const newTabKey = key as tabKeyUnion;

		const currentFormValues = form.getFieldsValue();
		//   현재 탭의 폼 데이터 저장 (검색했던 경우에만)
		if (currentTabData.hasSearched) {
			setTabData(prev => ({
				...prev,
				[activeTabKey]: {
					...prev[activeTabKey],
					formData: { ...currentFormValues },
				},
			}));
		}

		setActiveTabKey(newTabKey);

		const newTabData = tabData[newTabKey];
		const formDataToRestore = newTabData.formData;
		setTimeout(() => {
			form.setFieldsValue(formDataToRestore);
		}, 50);
	};

	// 스크롤 페이징을 위한 추가 데이터 로드 함수
	const loadMore = useCallback(
		throttle(async () => {
			let latestTabData: any;
			let nextPage: number;
			let savedFormData: any;

			setTabData(prev => {
				latestTabData = prev[activeTabKey];
				savedFormData = latestTabData.formData || form.getFieldsValue();
				nextPage = latestTabData.currentPage + 1;

				return prev; // 상태 변경 없이 반환
			});

			const [gridData, totalCnt] = await sendRequest(nextPage);

			setTabData(prev => {
				const existingData = prev[activeTabKey].gridData || [];
				const newData = gridData || [];

				// 페이지 번호가 1이면 새 데이터로 교체, 아니면 기존 데이터에 추가 (무한스크롤)
				const mergedData = nextPage === 1 ? newData : [...existingData, ...newData];

				return {
					...prev,
					[activeTabKey]: {
						...prev[activeTabKey],
						gridData: mergedData,
						currentPage: nextPage,
						formData: form.getFieldsValue(),
					},
				};
			});
		}, 500),
		[activeTabKey],
	);

	const sendRequest = async (pageNum: number) => {
		const requestParams = form.getFieldsValue();

		requestParams.pageNum = pageNum ?? 1;
		requestParams.listCount = LIST_COUNT;

		let responseData = null;
		let gridData: any[] = [];
		if (activeTabKey === 'vehicle') {
			const deliveryDate = requestParams.deliveryDate;
			requestParams.deliverydt = deliveryDate.format('YYYYMMDD');
			requestParams.carnoList = requestParams.carno ? requestParams.carno.trim().split(',') : [];
			delete requestParams.carno;
			delete requestParams.deliveryDate;

			try {
				responseData = await apiGetTemperatureMonitoring(requestParams);
			} catch (error) {
				message.error('온도기록모니터링 차량별 데이터 조회 중 오류가 발생했습니다.');
				return;
			}

			const list = responseData?.data?.list ?? [];
			gridData = list.map(
				(item: VehicleDataDto): VehicleData => ({
					carno: item.carno,
					priority: item.priority,
					drivername: item.drivername,
					contracttype: item.contracttype,
					temperature1NomlRate: item.temperature1NomlRate != null ? Number(item.temperature1NomlRate.toFixed(1)) : null,
					temperature2NomlRate: item.temperature2NomlRate != null ? Number(item.temperature2NomlRate.toFixed(1)) : null,
					temperature1OutRate: item.temperature1OutRate != null ? Number(item.temperature1OutRate.toFixed(1)) : null,
					temperature2OutRate: item.temperature2OutRate != null ? Number(item.temperature2OutRate.toFixed(1)) : null,
					temperature1Avg: item.temperature1Avg != null ? Number(item.temperature1Avg.toFixed(1)) : null,
					temperature2Avg: item.temperature2Avg != null ? Number(item.temperature2Avg.toFixed(1)) : null,
					temperature1MinMax: item.temperature1MinMax,
					temperature2MinMax: item.temperature2MinMax,
					timeRange: item.timeRange,
				}),
			);
		} else if (activeTabKey === 'detail') {
			const [fromDeliverydt, toDeliverydt] = requestParams.deliveryDt;
			const custkeyList = requestParams.custkey
				? requestParams.custkey
						.split(',')
						.map((item: string) => item.trim())
						.filter(Boolean)
				: [];
			Object.assign(requestParams, {
				fromDeliverydt: fromDeliverydt.format('YYYYMMDD'),
				toDeliverydt: toDeliverydt.format('YYYYMMDD'),
				depArrYn: requestParams.depArrYn ? 'Y' : 'N',
				dcIncYn: requestParams.dcIncYn ? 'Y' : 'N',
				carnoList: requestParams.carno ? requestParams.carno.trim().split(',') : [],
				custkeyList,
			});
			delete requestParams.carno;
			delete requestParams.custkey;
			delete requestParams.custname;
			delete requestParams.deliveryDt;

			try {
				responseData = await apiGetTemperatureRecords(requestParams);

				const list = responseData?.data?.list ?? [];
				gridData = list.map(
					(item: TemperatureRecordDataDto): TemperatureRecordData => ({
						...item,
						carno: item.carno,
						custname: item.custname,
						recordTime: item.recordTime ? dayjs(item.recordTime).format('YYYY-MM-DD HH:mm') : '',
						refrig: item.refrig ? Number(item.refrig) : null,
						freeze: item.freeze ? Number(item.freeze) : null,
						refrigStatus: item.refrigStatus as TemperatureRecordData['refrigStatus'],
						freezeStatus: item.freezeStatus as TemperatureRecordData['freezeStatus'],
					}),
				);
			} catch (error) {
				message.error('온도기록모니터링 온도기록상세 데이터 조회 중 오류가 발생했습니다.');
				return;
			}
		}

		return [gridData, responseData?.data?.totalCount, responseData?.data?.freeze, responseData?.data?.refrig];
	};

	const validateDeliveryDate = (deliveryDt: any) => {
		if (deliveryDt[0].isAfter(deliveryDt[1])) {
			message.error('배송일자 시작일자는 종료일자보다 이전일 수 없습니다.');
			return false;
		}
		return true;
	};

	// 조회
	const onSearch = async () => {
		const isValid = await form
			.validateFields()
			.then(() => true)
			.catch(() => false);
		if (!isValid) return showAlert('', '필수 조회조건을 입력해주세요.');

		const isValidDate = validateDeliveryDate(form.getFieldValue('deliveryDt'));
		if (!isValidDate) return;

		const pageNum = 1;
		const [gridData, totalCnt, freeze, refrig] = await sendRequest(pageNum);

		setTabData(prev => {
			return {
				...prev,
				[activeTabKey]: {
					...prev[activeTabKey],
					gridData: gridData ?? [],
					totalCnt: totalCnt ?? 0,
					freeze: {
						naCnt: freeze?.naCnt ?? 0,
						outCnt: freeze?.outCnt ?? 0,
						nomlCnt: freeze?.nomlCnt ?? 0,
					},
					refrig: {
						naCnt: refrig?.naCnt ?? 0,
						outCnt: refrig?.outCnt ?? 0,
						nomlCnt: refrig?.nomlCnt ?? 0,
					},
					currentPage: pageNum,
					hasSearched: true,
					formData: form.getFieldsValue(),
					chartData: null,
				},
			};
		});
		setRunSearch(false);
	};

	/**
	 * 지표/모니터링>차량관제>온도기록모니터링 차량별 탭 => 온도기록 상세 탭 이동이동하거나
	 * 기준정보>센터기준정보>센터서류 => 온도기록 상세 탭 이동 시
	 * 주어진 검색 조걼로 온도기록 상세 데이터 조회 필요
	 * 조회 버튼 클릭과 동일한 조회 처리를 위해 사용
	 */
	const [runSearch, setRunSearch] = useState(false);

	/**
	 * 상세내역 버튼 클릭. 차량별 탭 챠트에서 버튼 클릭 시 온도기록상세 탭으로 이동
	 * 선택 차량 조건으로 검색조건 설정
	 * @param {VehicleData} vehicle - 선택된 차량 데이터
	 * @param {any} formData - 차량별 탭 검색 조건
	 */
	const handleDetailClick = (vehicle: VehicleData, formData: any) => {
		const key = 'detail';
		const newTabKey = key as tabKeyUnion;

		const currentFormValues = form.getFieldsValue();
		if (currentTabData.hasSearched) {
			setTabData(prev => ({
				...prev,
				[activeTabKey]: {
					...prev[activeTabKey],
					formData: { ...currentFormValues },
				},
			}));
		}

		const nextFormData = {
			...(tabData.detail.formData ?? form.getFieldsValue()),
			dccode: formData.dccode,
			deliveryDt: [formData.deliveryDate, formData.deliveryDate],
			base: 'CAR',
			carno: vehicle.carno,
			carNoText: vehicle.carno,
			priority: vehicle.priority,
			custkey: '',
			custname: '',
		};

		setTabData(prev => ({
			...prev,
			detail: {
				...prev.detail,
				formData: nextFormData,
			},
		}));

		setActiveTabKey(newTabKey);

		setTimeout(() => {
			setDates([formData.deliveryDate, formData.deliveryDate]);
			// 해당 차량의 출/도착건 보기, 센터 포함 체크박스 선택된 상태로 설정
			form.setFieldsValue({
				...nextFormData,
			});
		}, 5);

		setRunSearch(true);
	};

	const handleVehicleSelect = (vehicle: VehicleData) => {
		setSelectedVehicle(vehicle);

		const selectedRowData = vehicle;
		if (commUtil.isEmpty(selectedRowData)) return;

		const requestParams = form.getFieldsValue();
		const deliveryDate = requestParams.deliveryDate;
		requestParams.deliverdt = deliveryDate.format('YYYYMMDD');

		const params = {
			dccode: requestParams.dccode,
			deliverydt: deliveryDate.format('YYYYMMDD'),
			carno: selectedRowData.carno,
			priority: selectedRowData.priority,
			contracttype: selectedRowData.contracttype,
		};

		apiGetVehicleTemperatureData(params).then(res => {
			const chartData = res.data;
			const vehicleChartData: VehicleChartData[] = chartData.map((record: any) => {
				return {
					time: record.recordTime,
					refrig: record.refrig,
					freeze: record.freeze,
					carno: record.carno,
					drivername: record.drivername,
					cust: record.custname,
				};
			});

			setTabData(prev => {
				return {
					...prev,
					[activeTabKey]: {
						...prev[activeTabKey],
						chartData: vehicleChartData,
					},
				};
			});
		});
	};

	/**
	 * 온도기록지 팝업 열기
	 */
	const titleFunc = {
		searchYn: onSearch,
		reset: () => {
			clearReqTempReport();
			form.resetFields();
			setRunSearch(false);
		},
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 센터서류 => 온도기록지 출력을 위해 이동 시 온도기록지 정보 설정
	useEffect(() => {
		if (reqTempReport?.reqNo) {
			const nextFormData = {
				...(tabData.detail.formData ?? form.getFieldsValue()),
				deliveryDt: [dayjs(reqTempReport.deliveryDt), dayjs(reqTempReport.deliveryDt)],
				base: 'CUST',
				custkey: reqTempReport.custKey,
				custname: commUtil.convertCodeWithName(reqTempReport.custKey, reqTempReport.custNm),
				dccode: reqTempReport.dcCode,
				carno: '',
				carNoText: '',
			};

			setTabData(prev => ({
				...prev,
				detail: {
					...prev.detail,
					formData: nextFormData,
				},
			}));

			setDates([dayjs(reqTempReport.deliveryDt), dayjs(reqTempReport.deliveryDt)]);
			form.setFieldsValue({
				...nextFormData,
			});
			// 센터서류에서 넘어온 조건 변경 불가한 항목에 대해 disable 처리 필요
			// 검색 영역 변경 불가 : 물류센터, 배송일자, 기준(거래처), 거래처코드/명

			// targetTab이 지정된 경우 해당 탭으로 이동
			if (reqTempReport.targetTab && reqTempReport.targetTab !== activeTabKey) {
				setActiveTabKey(reqTempReport.targetTab);
			}

			setRunSearch(true);

			// TODO: 초기화 시점은 추후 검토 필요
			// 온도기록지 발급 또는 저장 등의 "완료" 액션이 이루어진 시점 에 처리하거나
			// 화면기준으로 조건 변경 시 처리 필요
			// store 요청 정보 초기화
			// [테스트] 센터 서류에서 완료처리하면서 reqTempReport 초기화 시 온도기록상세 조회 조건 초기화 되는것 확인 함
		}
	}, [reqTempReport]);

	useEffect(() => {
		if (!runSearch) return;
		const timer = setTimeout(() => {
			onSearch();
		}, 5);
		return () => clearTimeout(timer);
	}, [runSearch]);

	useEffect(() => {
		const currentTabData = tabData[activeTabKey];
		if (!currentTabData.formData && !currentTabData.hasSearched) return;
		form.setFieldsValue(currentTabData.formData);
	}, [activeTabKey, tabData]);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive form={form} initialValues={detailSearchBox}>
				<TmTempMonitorSearch form={form} isDetailTab={activeTabKey === 'detail'} />
			</SearchFormResponsive>

			<Tabs
				activeKey={activeTabKey}
				onChange={onTabChange}
				destroyOnHidden
				className="contain-wrap"
				items={[
					{
						key: 'vehicle',
						label: '차량별',
						children: (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
									minHeight: 0,
								}}
							>
								<TmTempMonitorList
									form={form}
									data={anyGridData}
									totalCnt={totalCnt}
									onVehicleSelect={handleVehicleSelect}
									onDetailClick={handleDetailClick}
									selectedVehicle={selectedVehicle}
									onTabChange={onTabChange}
									onLoadMore={loadMore}
									vehicleChartData={chartData ?? []}
								/>
							</div>
						),
					},
					{
						key: 'detail',
						label: '온도기록상세',
						children: (
							<TmTempMonitorDetailList
								form={form}
								gridData={anyGridData}
								detailTotalCnt={totalCnt}
								freeze={freeze}
								refrig={refrig}
								selectedVehicle={selectedVehicle}
								onTabChange={onTabChange}
								onLoadMore={loadMore}
								reqTempReport={reqTempReport}
							/>
						),
					},
				]}
			/>
		</>
	);
};

export default TmTempMonitor;
