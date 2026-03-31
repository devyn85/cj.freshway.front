// CSS

// Lib
import { Form } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// API state

// Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// Type

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TabsArray from '@/components/common/TabsArray';
import KpLocationCapaMonitoringNewSearch from '@/components/kp/locationCapaMonitoringNew/KpLocationCapaMonitoringNewSearch';
import KpLocationCapaMonitoringNewTab1 from '@/components/kp/locationCapaMonitoringNew/KpLocationCapaMonitoringNewTab1';
import KpLocationCapaMonitoringNewTab2 from '@/components/kp/locationCapaMonitoringNew/KpLocationCapaMonitoringNewTab2';

// Store

// API
import {
	getDataStatusCount,
	getDataTotalCount,
	getDetailRead,
	getMasterListTab1,
	getMasterListTab2,
} from '@/api/kp/apiKpLocationCapaMonitoringNew';
import styled from 'styled-components';

const KpLocationCapaMonitoringNew = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const searchBox = useMemo<{
		dccode: any[];
		storagetype: any | null;
		zone: any | null;
	}>(
		() => ({
			dccode: [gDccode],
			storagetype: null,
			zone: null,

			// As-Is의 조회일자를 To-Be에서는 조회 당일로 하드코딩하여 전달
		}),
		[gDccode],
	);

	// 그리드 접근을 위한 Ref Tab 순서대로
	const gridRef2 = useRef<any>(null);

	// 테이블 데이터 (탭1)
	const [tableData, setTableData] = useState<any[]>([]);

	// 테이블 데이터 (탭2)
	const [tableData2, setTableData2] = useState<any[]>([]);

	// 잔여, 전체 Capa 수 (탭2)
	const [capaData2, setCapaData2] = useState<any>(null);

	// 렉별 재고상태 (유통기한임박, 빈로케이션, 보관로케이션)
	const [statusData2, setStatusData2] = useState<any>(null);

	// 그리드 데이터 (탭2)
	const [gridData2, setGridData2] = useState<any[]>([]);

	// 활성탭
	const [activeTabKey, setActiveTabKey] = useState('1');

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 요약 탭 조회
	 * @param params
	 */
	const loadTab1 = useCallback(
		async (params?: any) => {
			try {
				const requestParams = params || form.getFieldsValue();
				const res = await getMasterListTab1(requestParams);
				const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

				if (commUtil.isNotEmpty(data)) {
					const totalList = data.find((row: any) => row?.DCCODE === 'total');
					const otherList = data.filter((row: any) => row?.DCCODE !== 'total');

					setTableData(totalList ? [totalList, ...otherList] : otherList);
					return;
				}

				setTableData([]);
			} catch (e) {
				setTableData([]);
			}
		},
		[form],
	);

	/**
	 * 랙별상세(탭2) 목록 조회
	 * @param params
	 */
	const loadTab2 = useCallback(async (params: any) => {
		try {
			const res = await getMasterListTab2(params);
			const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
			setTableData2(data);
		} catch (e) {
			setTableData2([]);
		}
	}, []);

	/**
	 * 	조회
	 */
	const searchMasterList = useCallback(async () => {
		let params = form.getFieldsValue();
		let fixdccode = commUtil.nvl(form.getFieldValue('fixdccode'), []);
		let fixdccode2 = commUtil.nvl(form.getFieldValue('fixdccode2'), []);

		fixdccode = Array.isArray(fixdccode) ? fixdccode.toString() : `${fixdccode || ''}`;
		fixdccode2 = Array.isArray(fixdccode2) ? fixdccode2.toString() : `${fixdccode2 || ''}`;

		if (activeTabKey === '1') {
			if (!fixdccode || fixdccode.length === 0) {
				showAlert(null, t('물류센터를 선택해주세요.'));
				return;
			}

			params = { ...params, fixdccode };
			await loadTab1(params);
			return;
		}

		if (activeTabKey === '2') {
			if (!fixdccode2 || fixdccode2.length === 0) {
				showAlert(null, t('물류센터를 선택해주세요.'));
				return;
			}

			params = { ...params, fixdccode: fixdccode2 };
			await loadTab2(params);

			setCapaData2({
				empLoc: 0,
				totLoc: 0,
			});
			setStatusData2([]);
			setGridData2([]);
		}
	}, [activeTabKey, form, loadTab1, loadTab2, t]);

	const handleRackClick = useCallback(
		async (dccode: string, zone: string, rack: string) => {
			const params = form.getFieldsValue();

			try {
				// API 호출
				const [statusRes, totalRes] = await Promise.all([
					getDataStatusCount({ ...params, dccode, zone, rack, fixdccode: params.fixdccode2 }),
					getDataTotalCount({ ...params, dccode, zone, rack, fixdccode: params.fixdccode2 }),
				]);

				const statusValue = statusRes?.data?.[0] || statusRes || [];
				const capaValue = totalRes?.data || totalRes || { empLoc: 0, totLoc: 0 };

				// 화면 업데이트
				setCapaData2(capaValue);
				setStatusData2(statusValue);
			} catch (e) {
				setCapaData2({
					empLoc: 0,
					totLoc: 0,
				});
				setStatusData2([]);
			}
		},
		[form],
	);

	/**
	 * DELETED - loadTab1 moved above
	 * @param params
	 */
	const loadTab1_DELETED = async (params: any) => {
		try {
			const res = await getMasterListTab1(params);
			setTableData(res?.data || res || []);
		} catch (e) {
			setTableData([]);
		}
	};

	/**
	 * 유통기한 상태 조회
	 */
	const loadTab2Status = async () => {
		try {
			const params = form.getFieldsValue();

			await getDataStatusCount({ ...params, fixdccode: params.fixdccode2 });
		} catch (e) {}
	};

	/**
	 * 잔여, 전체 CAPA 조회
	 */
	const loadTab2TotalCount = async () => {
		try {
			const params = form.getFieldsValue();

			const res = await getDataTotalCount({ ...params, fixdccode: params.fixdccode2 });

			setCapaData2({
				empLoc: res?.data?.empLoc || 0,
				totLoc: res?.data?.totLoc || 0,
			});
		} catch (e) {}
	};

	/**
	 * 탭2 테이블(랙) 셀 클릭 시 상세조회
	 * @param zone
	 * @param rack
	 * @param loc
	 */
	const loadTab2Detail = useCallback(
		async (zone: string, rack: string, loc: string) => {
			try {
				const params = form.getFieldsValue();
				if (Array.isArray(params.dccode)) {
					params.dccode = params.dccode[0];
				}

				const res = await getDetailRead({ ...params, zone, rack, loc, fixdccode: params.fixdccode2 });
				setGridData2(Array.isArray(res?.data) ? res.data : []);
			} catch (e) {
				setGridData2([]);
			}
		},
		[form],
	);

	const titleFunc = useMemo(
		() => ({
			searchYn: searchMasterList,
		}),
		[searchMasterList],
	);

	const tabClick = useCallback((key: string) => {
		setActiveTabKey(key);

		if (key === '2') {
			requestAnimationFrame(() => {
				gridRef2.current?.resize?.('100%', '100%');
			});
		}
	}, []);

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 초기 진입 시 자동 조회
	 */
	useEffect(() => {
		const initialValues = form.getFieldsValue();

		if (!initialValues?.dccode || initialValues?.dccode?.length === 0) {
			form.setFieldsValue(searchBox);
			loadTab1(searchBox);
			return;
		}

		loadTab1(initialValues);
	}, [form, loadTab1, searchBox]);

	const tabItems = useMemo(
		() => [
			{
				key: '1',
				label: '요약',
				children: (
					<Wrap>
						<KpLocationCapaMonitoringNewTab1 data={tableData} form={form} />
					</Wrap>
				),
			},
			{
				key: '2',
				label: '렉별 상세',
				children: (
					<Wrap>
						{/* <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
							<div className="cp-label">
								<div className="box">빈공간</div>
								<div className="gc-user51">보관중</div>
								<div className="gc-user39">유통기한임박</div>
							</div>
						</div> */}
						<KpLocationCapaMonitoringNewTab2
							data={tableData2}
							gridRef2={gridRef2}
							capaData={capaData2}
							statusData={statusData2}
							onRackClick={handleRackClick}
							onCellClick={loadTab2Detail}
							gridData2={gridData2}
						/>
					</Wrap>
				),
			},
		],
		[tableData, form, tableData2, capaData2, statusData2, handleRackClick, loadTab2Detail, gridData2],
	);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<KpLocationCapaMonitoringNewSearch form={form} activeKey={activeTabKey} />
			</SearchFormResponsive>
			<TabsArray activeKey={activeTabKey} onChange={tabClick} items={tabItems} />
		</>
	);
};

const Wrap = styled.div`
	width: 100%;
	height: 100%;
	padding-top: 15px;
	padding-bottom: 15px;
`;

export default KpLocationCapaMonitoringNew;
