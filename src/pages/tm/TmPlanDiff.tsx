/*
############################################################################
# Screen: TmPlanDiff (배차결과 비교)
# 목적: 가배차와 배차확정 간의 결과를 비교하여 GAP 분석
#
# [주요 기능]
# - 가배차/배차확정 결과 비교 조회
# - 전체/지입/고정 유형별 물량, 체적, 착지 비교
# - 차량별 상세 비교 (물량, 체적, 착지)
# - 착지리스트 상세 조회
#
# [검색 조건]
# - 물류센터: CmGMultiDccodeSelectBox를 통한 단일 선택
# - 배송일자: Datepicker 컴포넌트
# - 차량번호/기사: CmCarPopSearch를 통한 검색
#
# [화면 구성]
# - 좌측: 전체 요약 그리드 (전체/지입/고정별 가배차, 배차확정, GAP)
# - 우측 상단: 차량별 상세 그리드 (물량, 체적, 착지)
# - 우측 하단: 착지리스트 그리드 (가배차, 최종)
############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker, SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

// API import
import {
	CustSummaryDiffItem,
	getPlanSummaryDiffMasterCarList,
	getPlanSummaryDiffMasterList,
} from '@/api/tm/apiTmDispatch';

// 그리드 컬럼 및 속성 import
import {
	destGridProps,
	destinationGridCol,
	diffGridCol,
	diffGridProps,
	vehicleGridCol,
	vehicleGridProps,
} from '@/components/tm/planDiff/TmPlanDiffGridProps';

// 타입 정의
type diffRowData = {
	contractnm: string;
	item: string;
	tempDispatch: string;
	confirmed: string;
	gap: string;
};

type VehicleRowData = {
	item: string;
	tempDispatch: number;
	confirmed: number;
	gap: number;
};

type DestinationRowData = {
	code: string;
	name: string;
};

const TmPlanDiff = () => {
	const { t } = useTranslation();
	const location = useLocation();

	// TmPlan에서 전달받은 params
	const { dccode: initialDccode, deliveryDate: initialDeliveryDate } =
		(location.state as { dccode?: string; deliveryDate?: string }) || {};

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();

	// 그리드 참조
	const diffGridRef = useRef<any>(null);
	const vehicleGridRef = useRef<any>(null);
	const tempDestGridRef = useRef<any>(null);
	const confirmedDestGridRef = useRef<any>(null);

	// 그리드 데이터
	const [diffData, setDiffData] = useState<diffRowData[]>([]);
	const [vehicleData, setVehicleData] = useState<VehicleRowData[]>([]);
	const [tempDestinations, setTempDestinations] = useState<DestinationRowData[]>([]);
	const [confirmedDestinations, setConfirmedDestinations] = useState<DestinationRowData[]>([]);

	// 선택된 차량번호
	const [selectedCarNo, setSelectedCarNo] = useState<string>('');

	/**
	 * =====================================================================
	 *  02. 함수 선언부
	 * =====================================================================
	 */

	// 검색 함수
	const onSearch = async () => {
		const values = form.getFieldsValue();
		const deliveryDate = dayjs(values?.shipDt || dayjs().add(1, 'day')).format('YYYYMMDD');
		const dccode = values?.dccode;
		const carNo = values?.carNo;

		if (!dccode) {
			return;
		}

		const params = {
			dccode,
			deliveryDate,
			tmDeliveryType: '1',
			carno: carNo || undefined,
		};

		try {
			// 마스터 목록 조회 (좌측 써머리 그리드)
			const masterRes = await getPlanSummaryDiffMasterList(params);

			if (masterRes && Array.isArray(masterRes)) {
				setDiffData(masterRes);
			} else {
				setDiffData([]);
			}

			// 차량 선택 시 우측 그리드 데이터 조회
			if (carNo) {
				if (carNo.split(',').length > 1) {
					setSelectedCarNo('');
					setVehicleData([]);
					setTempDestinations([]);
					setConfirmedDestinations([]);
					showMessage({
						content: '차량번호/운전자는 단건만 조회 가능합니다.',
						modalType: 'info',
					});
					return;
				}

				setSelectedCarNo(carNo);

				const carRes = await getPlanSummaryDiffMasterCarList(params);

				if (carRes) {
					setVehicleData(carRes.carSummaryDiff);

					// 착지리스트 데이터 변환 (custSummaryDiff 사용)
					const custList: CustSummaryDiffItem[] = carRes.custSummaryDiff || [];

					// 가배차 착지리스트 (preDispatchYn === 'Y')
					const tempDestData = custList
						.filter(item => item.preDispatchYn === 'Y')
						.map(item => ({
							code: item.truthcustkey,
							name: item.custname,
						}));

					// 배차확정 착지리스트 (dispatchYn === 'Y')
					const confirmedDestData = custList
						.filter(item => item.dispatchYn === 'Y')
						.map(item => ({
							code: item.truthcustkey,
							name: item.custname,
						}));

					setTempDestinations(tempDestData);
					setConfirmedDestinations(confirmedDestData);
				}
			} else {
				setSelectedCarNo('');
				setVehicleData([]);
				setTempDestinations([]);
				setConfirmedDestinations([]);
			}
		} catch (error) {
			setDiffData([]);
		}
	};

	// MenuTitle 컴포넌트에 전달할 함수 객체
	const titleFunc = useMemo(
		() => ({
			searchYn: onSearch,
		}),
		[],
	);

	// 총 건수 계산 (useMemo)
	const tempDestTotalCnt = useMemo(() => tempDestinations.length, [tempDestinations]);
	const confirmedDestTotalCnt = useMemo(() => confirmedDestinations.length, [confirmedDestinations]);

	/**
	 * =====================================================================
	 *  03. React Hook Event 및 렌더링
	 * =====================================================================
	 */

	// TmPlan에서 전달받은 params로 초기값 설정 및 자동 조회
	useEffect(() => {
		if (initialDccode && initialDeliveryDate) {
			form.setFieldsValue({
				dccode: initialDccode,
				shipDt: dayjs(initialDeliveryDate, 'YYYYMMDD'),
			});
			// 폼 값 설정 후 조회 실행
			setTimeout(() => {
				onSearch();
			}, 100);
		}
	}, [initialDccode, initialDeliveryDate]);

	// 그리드 데이터 바인딩
	useEffect(() => {
		if (diffGridRef.current && Array.isArray(diffData)) {
			diffGridRef.current.setGridData(diffData);
		}
	}, [diffData]);

	useEffect(() => {
		if (vehicleGridRef.current && Array.isArray(vehicleData)) {
			vehicleGridRef.current.setGridData(vehicleData);
		}
	}, [vehicleData]);

	useEffect(() => {
		if (tempDestGridRef.current && Array.isArray(tempDestinations)) {
			tempDestGridRef.current.setGridData(tempDestinations);
		}
	}, [tempDestinations]);

	useEffect(() => {
		if (confirmedDestGridRef.current && Array.isArray(confirmedDestinations)) {
			confirmedDestGridRef.current.setGridData(confirmedDestinations);
		}
	}, [confirmedDestinations]);

	return (
		<>
			{/* 상단 타이틀 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 */}
			<SearchFormResponsive form={form} initialValues={{ shipDt: dayjs().add(1, 'day') }} groupClass={'grid-column-4'}>
				{/* 배송일자 선택 */}
				<li>
					<Datepicker label={t('lbl.DELIVERYDATE') || '배송일자'} name={'shipDt'} />
				</li>
				{/* 물류센터 선택 */}
				<li>
					<CmGMultiDccodeSelectBox mode={'single'} name={'dccode'} rules={[{ required: true }]} />
				</li>
				{/* 차량번호/기사 검색 */}
				<li>
					<CmCarSearch
						form={form}
						name={'carNoText'}
						code={'carNo'}
						label={(t('lbl.CARNO') || '차량번호') + '/' + (t('lbl.DRIVER') || '기사')}
						customDccode={form.getFieldValue('dccode') || undefined}
						selectionMode="singleRow"
					/>
				</li>
			</SearchFormResponsive>
			{/* 그리드 영역 */}
			<AGridWrap className="contain-wrap">
				<Row gutter={16}>
					{/* 좌측: 전체 요약 그리드 */}
					<Col span={10}>
						<AGrid>
							<GridTopBtn gridTitle={'배차결과 비교'} totalCnt={0} gridBtn={{ tGridRef: diffGridRef }} />
							<AUIGrid ref={diffGridRef} columnLayout={diffGridCol} gridProps={diffGridProps} />
						</AGrid>
					</Col>
					{/* 우측: 차량별 상세 및 착지리스트 */}
					<Col span={14} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
						{/* 차량별 상세 그리드 */}
						<AGrid style={{ flexShrink: 0 }}>
							<GridTopBtn gridTitle={selectedCarNo || '차량번호'} totalCnt={0} gridBtn={{ tGridRef: vehicleGridRef }} />
							<AUIGrid ref={vehicleGridRef} columnLayout={vehicleGridCol} gridProps={vehicleGridProps} />
						</AGrid>
						{/* 착지리스트 2단 그리드 */}
						<Row gutter={16} style={{ marginTop: 16, flex: 1 }}>
							{/* 가배차 착지리스트 */}
							<Col span={12}>
								<AGrid>
									<GridTopBtn
										gridTitle={'가배차 - 착지리스트'}
										totalCnt={tempDestTotalCnt}
										gridBtn={{ tGridRef: tempDestGridRef }}
									/>
									<AUIGrid ref={tempDestGridRef} columnLayout={destinationGridCol} gridProps={destGridProps} />
								</AGrid>
							</Col>
							{/* 최종 착지리스트 */}
							<Col span={12}>
								<AGrid>
									<GridTopBtn
										gridTitle={'최종 - 착지리스트'}
										totalCnt={confirmedDestTotalCnt}
										gridBtn={{ tGridRef: confirmedDestGridRef }}
									/>
									<AUIGrid ref={confirmedDestGridRef} columnLayout={destinationGridCol} gridProps={destGridProps} />
								</AGrid>
							</Col>
						</Row>
					</Col>
				</Row>
			</AGridWrap>
		</>
	);
};

export default TmPlanDiff;
