/*
 ############################################################################
 # File name    : KpSyncOrdDtlMonitoring.tsx
 # Description  : 주문동기화 상세 모니터링 (DP/RT/WD/AJ/ST INPLAN 탭)
 # Author       :
 # Since        :
 ############################################################################
*/
import { useEffect, useRef, useState } from 'react';

// lib
import { Form, Tabs } from 'antd';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import KpSyncOrdDtlMonitoringDetail from '@/components/kp/syncOrdMonitoring/KpSyncOrdDtlMonitoringDetail';
import KpSyncOrdDtlMonitoringSearch from '@/components/kp/syncOrdMonitoring/KpSyncOrdDtlMonitoringSearch';

// store
import { useAppSelector } from '@/store/core/coreHook';

// API
import {
	apiGetAJInplanList,
	apiGetDPInplanList,
	apiGetRTInplanList,
	apiGetSTInplanList,
	apiGetWDInplanList,
} from '@/api/kp/apiKpSyncOrdDtlMonitoring';

// util
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

import type { KpSyncOrdDtlTabType } from '@/components/kp/syncOrdMonitoring/KpSyncOrdDtlMonitoringDetail';

const API_MAP = {
	DP: apiGetDPInplanList,
	RT: apiGetRTInplanList,
	WD: apiGetWDInplanList,
	AJ: apiGetAJInplanList,
	ST: apiGetSTInplanList,
};

const KpSyncOrdDtlMonitoring = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const locationState = (location.state || {}) as {
		fromSyncOrdMonitoring?: boolean;
		dccode?: string;
		docno?: string;
		docline?: number | string;
		doctype?: string;
	};

	const isFromSyncOrdMonitoring =
		!!locationState?.fromSyncOrdMonitoring &&
		locationState?.dccode != null &&
		locationState?.docno != null &&
		locationState?.docline != null;
	const lockedTabKey =
		isFromSyncOrdMonitoring && locationState?.doctype
			? ['DP', 'RT', 'WD', 'AJ', 'ST'].includes(locationState.doctype)
				? (locationState.doctype as KpSyncOrdDtlTabType)
				: 'DP'
			: null;

	const [form] = Form.useForm();
	const [activeTabKey, setActiveTabKey] = useState<KpSyncOrdDtlTabType>(lockedTabKey ?? 'DP');
	const [searchDisabled, setSearchDisabled] = useState(false);
	const [tabLocked, setTabLocked] = useState(false);
	const refs: any = useRef(null);

	const [gridDataDp, setGridDataDp] = useState<any[]>([]);
	const [gridDataRt, setGridDataRt] = useState<any[]>([]);
	const [gridDataWd, setGridDataWd] = useState<any[]>([]);
	const [gridDataAj, setGridDataAj] = useState<any[]>([]);
	const [gridDataSt, setGridDataSt] = useState<any[]>([]);
	const [totalCntDp, setTotalCntDp] = useState(0);
	const [totalCntRt, setTotalCntRt] = useState(0);
	const [totalCntWd, setTotalCntWd] = useState(0);
	const [totalCntAj, setTotalCntAj] = useState(0);
	const [totalCntSt, setTotalCntSt] = useState(0);

	const [searchBox] = useState(() => ({
		docno: '',
		docline: '' as string | number,
		dcCode: [] as string[],
		pvcSlipdt: [dayjs(), dayjs()] as [dayjs.Dayjs, dayjs.Dayjs],
	}));

	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// KpSyncOrdMonitoring에서 진입 시 조회 조건 세팅 및 조회 실행 (같은 화면이 이미 열려 있어도 location.key 변경 시 재실행)
	useEffect(() => {
		if (!isFromSyncOrdMonitoring || !locationState?.dccode || !locationState?.docno || locationState?.docline == null)
			return;
		form.setFieldsValue({
			dcCode: [locationState.dccode],
			docno: locationState.docno,
			docline: locationState.docline,
		});
		//setSearchDisabled(true);
		//setTabLocked(true);
		if (lockedTabKey) setActiveTabKey(lockedTabKey);
		// 폼 반영 후 해당 탭 API로 자동 조회 (state 기준으로 직접 호출)
		const tabKey = lockedTabKey ?? 'DP';
		const apiFn = API_MAP[tabKey];
		const timer = setTimeout(() => {
			const params = buildParams(tabKey);
			apiFn(params).then((res: any) => {
				const list = Array.isArray(res?.data) ? res.data : res?.data?.list ?? res?.list ?? [];
				switch (tabKey) {
					case 'DP':
						setGridDataDp(list);
						setTotalCntDp(list.length);
						break;
					case 'RT':
						setGridDataRt(list);
						setTotalCntRt(list.length);
						break;
					case 'WD':
						setGridDataWd(list);
						setTotalCntWd(list.length);
						break;
					case 'AJ':
						setGridDataAj(list);
						setTotalCntAj(list.length);
						break;
					case 'ST':
						setGridDataSt(list);
						setTotalCntSt(list.length);
						break;
				}
			});
		}, 100);
		return () => clearTimeout(timer);
	}, [location.key]);

	// 최초/글로벌 물류센터 반영: initialValues 갱신 및 폼 동기화 (직접 진입 시에만)
	const initialValues =
		isFromSyncOrdMonitoring && locationState?.dccode != null
			? {
					docno: locationState.docno ?? '',
					docline: locationState.docline ?? '',
					dcCode: [locationState.dccode],
					tasktype: '',
					pvcSlipdt: undefined as [dayjs.Dayjs, dayjs.Dayjs] | undefined,
			  }
			: {
					docno: searchBox.docno,
					docline: searchBox.docline,
					dcCode: globalVariable?.gDccode ? [globalVariable.gDccode] : searchBox.dcCode,
					tasktype: '',
					pvcSlipdt: searchBox.pvcSlipdt, // 기본값: [오늘, 오늘]
			  };

	useEffect(() => {
		if (isFromSyncOrdMonitoring) return;
		if (!form || !globalVariable?.gDccode) return;
		const currentDcCode = form.getFieldValue('dcCode');
		if (currentDcCode == null || (Array.isArray(currentDcCode) && currentDcCode.length === 0)) {
			form.setFieldsValue({ dcCode: [globalVariable.gDccode] });
		}
	}, [globalVariable?.gDccode, isFromSyncOrdMonitoring]);

	const buildParams = (tabKeyOverride?: KpSyncOrdDtlTabType) => {
		const tabKey = tabKeyOverride ?? activeTabKey;
		const gDccode = globalVariable?.gDccode;
		const currentDcCode = form.getFieldValue('dcCode');
		const isEmpty =
			currentDcCode == null || currentDcCode === '' || (Array.isArray(currentDcCode) && currentDcCode.length === 0);
		const isString = typeof currentDcCode === 'string' && currentDcCode !== '';

		// setFieldsValue는 비동기이므로, 정규화한 값은 여기서 바로 dccodeList에 반영
		let dccodeList: string[] = [];
		if (isEmpty && commUtil.isNotEmpty(gDccode)) {
			form.setFieldsValue({ dcCode: [gDccode] });
			dccodeList = [gDccode];
		} else if (isString) {
			form.setFieldsValue({ dcCode: [currentDcCode] });
			dccodeList = [currentDcCode];
		} else {
			const params = form.getFieldsValue();
			dccodeList = Array.isArray(params.dcCode) ? params.dcCode : params.dcCode ? [params.dcCode] : [];
		}

		const params = form.getFieldsValue();
		const range = params.pvcSlipdt;
		const slipdtFrom = Array.isArray(range) && range[0] ? range[0].format('YYYYMMDD') : '';
		const slipdtTo = Array.isArray(range) && range[1] ? range[1].format('YYYYMMDD') : '';
		const baseParams = {
			docno: params.docno != null ? String(params.docno).trim() : '',
			docline: params.docline != null && params.docline !== '' ? params.docline : undefined,
			dcCode: dccodeList.length > 0 ? dccodeList.join(',') : null,
			dccodeList,
			slipdtFrom: slipdtFrom || undefined,
			slipdtTo: slipdtTo || undefined,
		};
		// 재고(ST) 탭일 때 tasktype 파라미터 포함 (전체 선택 시 빈 문자열)
		if (tabKey === 'ST') {
			return { ...baseParams, tasktype: params.tasktype != null && params.tasktype !== '' ? params.tasktype : '' };
		}
		return baseParams;
	};

	const searchList = async (tabKeyOverride?: KpSyncOrdDtlTabType) => {
		// 조회 전 dcCode 정규화(디폴트/문자열→배열) 후 한 틱 대기해 폼 상태 반영 후 검증
		const gDccode = globalVariable?.gDccode;
		const currentDcCode = form.getFieldValue('dcCode');
		const isEmpty =
			currentDcCode == null || currentDcCode === '' || (Array.isArray(currentDcCode) && currentDcCode.length === 0);
		const isString = typeof currentDcCode === 'string' && currentDcCode !== '';
		if (isEmpty && commUtil.isNotEmpty(gDccode)) {
			form.setFieldsValue({ dcCode: [gDccode] });
		} else if (isString) {
			form.setFieldsValue({ dcCode: [currentDcCode] });
		}
		await new Promise<void>(r => setTimeout(r, 0));

		const keyToUse = tabKeyOverride ?? activeTabKey;
		const isValid = await validateForm(form);
		if (!isValid) return;

		const params = buildParams(keyToUse);
		const hasDocno = params.docno != null && String(params.docno).trim() !== '';
		const hasSlipdtRange = params.slipdtFrom != null && params.slipdtTo != null && params.slipdtFrom !== '' && params.slipdtTo !== '';
		if (!hasDocno && !hasSlipdtRange) {
			form.setFields([{ name: 'docno', errors: ['문서번호 또는 전표일자(기간)를 입력해주세요.'] }]);
			return;
		}

		//const apiFn = API_MAP[activeTabKey];
		const apiFn = API_MAP[keyToUse];
		if (!apiFn) return;

		refs?.gridRef?.current?.clearGridData?.();

		apiFn(params).then((res: any) => {
			const list = Array.isArray(res?.data) ? res.data : res?.data?.list ?? res?.list ?? [];
			switch (keyToUse) {
				case 'DP':
					setGridDataDp(list);
					setTotalCntDp(list.length);
					break;
				case 'RT':
					setGridDataRt(list);
					setTotalCntRt(list.length);
					break;
				case 'WD':
					setGridDataWd(list);
					setTotalCntWd(list.length);
					break;
				case 'AJ':
					setGridDataAj(list);
					setTotalCntAj(list.length);
					break;
				case 'ST':
					setGridDataSt(list);
					setTotalCntSt(list.length);
					break;
			}
		});
	};

	const titleFunc = {
		searchYn: searchList,
	};

	const tabClick = (key: string) => {
		if (tabLocked) return;
		setActiveTabKey(key as KpSyncOrdDtlTabType);
		setTimeout(() => refs?.gridRef?.current?.resize?.('100%', '100%'), 0);
		searchList(key as KpSyncOrdDtlTabType);
	};

	const gridDataByTab = {
		DP: gridDataDp,
		RT: gridDataRt,
		WD: gridDataWd,
		AJ: gridDataAj,
		ST: gridDataSt,
	};
	const totalCntByTab = {
		DP: totalCntDp,
		RT: totalCntRt,
		WD: totalCntWd,
		AJ: totalCntAj,
		ST: totalCntSt,
	};

	return (
		<>
			<MenuTitle func={titleFunc} />
			<SearchFormResponsive form={form} initialValues={initialValues}>
				<KpSyncOrdDtlMonitoringSearch form={form} disabled={searchDisabled} activeTabKey={activeTabKey} />
			</SearchFormResponsive>
			<Tabs activeKey={activeTabKey} onChange={tabClick} className="contain-wrap">
				<TabPane tab={t('lbl.DP')} key="DP" disabled={tabLocked && activeTabKey !== 'DP'}>
					{activeTabKey === 'DP' && (
						<KpSyncOrdDtlMonitoringDetail ref={refs} tabType="DP" data={gridDataByTab.DP} totalCnt={totalCntByTab.DP} />
					)}
				</TabPane>
				<TabPane tab={t('lbl.RT')} key="RT" disabled={tabLocked && activeTabKey !== 'RT'}>
					{activeTabKey === 'RT' && (
						<KpSyncOrdDtlMonitoringDetail ref={refs} tabType="RT" data={gridDataByTab.RT} totalCnt={totalCntByTab.RT} />
					)}
				</TabPane>
				<TabPane tab={t('lbl.WD')} key="WD" disabled={tabLocked && activeTabKey !== 'WD'}>
					{activeTabKey === 'WD' && (
						<KpSyncOrdDtlMonitoringDetail ref={refs} tabType="WD" data={gridDataByTab.WD} totalCnt={totalCntByTab.WD} />
					)}
				</TabPane>
				<TabPane tab={t('lbl.AJ')} key="AJ" disabled={tabLocked && activeTabKey !== 'AJ'}>
					{activeTabKey === 'AJ' && (
						<KpSyncOrdDtlMonitoringDetail ref={refs} tabType="AJ" data={gridDataByTab.AJ} totalCnt={totalCntByTab.AJ} />
					)}
				</TabPane>
				<TabPane tab={t('lbl.ST')} key="ST" disabled={tabLocked && activeTabKey !== 'ST'}>
					{activeTabKey === 'ST' && (
						<KpSyncOrdDtlMonitoringDetail ref={refs} tabType="ST" data={gridDataByTab.ST} totalCnt={totalCntByTab.ST} />
					)}
				</TabPane>
			</Tabs>
		</>
	);
};

export default KpSyncOrdDtlMonitoring;
