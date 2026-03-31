/*
 ############################################################################
 # File name    : KpSyncStockMonitoring.tsx
 # Description  : 재고동기화 모니터링 (단일 그리드, 물류센터 단일 / 상품 멀티 선택)
 # Author       :
 # Since        :
 ############################################################################
*/
import { useEffect, useRef, useState } from 'react';
import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import KpSyncStockMonitoringDetail from '@/components/kp/syncStockMonitoring/KpSyncStockMonitoringDetail';
import KpSyncStockMonitoringSearch from '@/components/kp/syncStockMonitoring/KpSyncStockMonitoringSearch';

// store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiGetStockMonitoringList } from '@/api/kp/apiKpSyncStockMonitoring';

// util
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';

const KpSyncStockMonitoring = () => {
	const [form] = Form.useForm();
	const refs: any = useRef(null);

	const [gridData, setGridData] = useState<any[]>([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const [searchBox] = useState(() => ({
		dcCode: undefined as string | string[] | undefined,
		skuCode: undefined as string | string[] | undefined,
		skuName: undefined as string | string[] | undefined,
	}));

	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 물류센터 단일 선택 시 디폴트 반영
	useEffect(() => {
		if (!form || !globalVariable?.gDccode) return;
		const currentDcCode = form.getFieldValue('dcCode');
		if (currentDcCode == null || currentDcCode === '' || (Array.isArray(currentDcCode) && currentDcCode.length === 0)) {
			form.setFieldsValue({ dcCode: globalVariable.gDccode });
		}
	}, [globalVariable?.gDccode]);

	const searchList = async () => {
		const raw = form.getFieldsValue();
		// 물류센터: 단일 선택 → dccode 문자열
		const dcCode = raw.dcCode;
		const dccode =
			dcCode == null || dcCode === ''
				? globalVariable?.gDccode ?? ''
				: Array.isArray(dcCode)
					? dcCode[0] ?? dcCode
					: String(dcCode);

		if (commUtil.isEmpty(dccode)) {
			form.setFieldsValue({ dcCode: globalVariable?.gDccode ?? '' });
		}

		await new Promise<void>(r => setTimeout(r, 0));
		const isValid = await validateForm(form);
		if (!isValid) return;

		// 상품: 멀티 선택 → skuList 배열 (없으면 미전달 또는 빈 배열)
		const skuCode = raw.skuCode;
		let skuList: string[] = [];
		if (skuCode != null && skuCode !== '') {
			if (Array.isArray(skuCode)) {
				skuList = skuCode.filter((s: any) => s != null && s !== '');
			} else {
				skuList = [String(skuCode)];
			}
		}

		const params: any = { dccode };
		if (skuList.length > 0) {
			params.skuList = skuList;
			// DTO/SQL에서 sku(단일) 조건을 사용하는 경우를 위해 sku에도 값 전달
			params.sku = skuList[0];
		}

		refs?.gridRef?.current?.clearGridData?.();

		apiGetStockMonitoringList(params).then((res: any) => {
			const list = Array.isArray(res?.data) ? res.data : res?.data?.list ?? res?.list ?? [];
			setGridData(list);
			setTotalCnt(list.length);
		});
	};

	const titleFunc = {
		searchYn: searchList,
	};

	return (
		<>
			<MenuTitle func={titleFunc} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<KpSyncStockMonitoringSearch form={form} />
			</SearchFormResponsive>
			<KpSyncStockMonitoringDetail ref={refs} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default KpSyncStockMonitoring;
