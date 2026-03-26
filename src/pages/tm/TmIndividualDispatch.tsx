/*
############################################################################
# FiledataField		: TmIndividualDispatch.tsx
# Description		: 개별배차 (Individual Dispatch) - 페이지 컴포넌트
# Since			: 2026.03.04
############################################################################
*/

// util
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

// api
import { apiGetIndividualDispatchList } from '@/api/tm/apiTmIndividualDispatch';

// components
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmIndividualDispatchList from '@/components/tm/individualDispatch/TmIndividualDispatchList';
import TmIndividualDispatchSearch from '@/components/tm/individualDispatch/TmIndividualDispatchSearch';

// util
import { showAlert } from '@/util/MessageUtil';

const TmIndividualDispatch = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState<any[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [vehicleFetchTrigger, setVehicleFetchTrigger] = useState(0);
	// 검색 초기값
	const initialSearchBox = useMemo(
		() => ({
			deliveryDate: [dayjs().add(1, 'day'), dayjs().hour() < 12 ? dayjs().add(2, 'day') : dayjs().add(1, 'day')],
			tmDeliverytype: '1',
			dispatchStatus: '',
			custkey: '',
			custname: '',
			carno: '',
			carname: '',
			docno: '',
		}),
		[],
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 초기화
	const onInit = useCallback(() => {
		form.resetFields();
		form.setFieldsValue(initialSearchBox);
		setGridData([]);
		setTotalCnt(0);
		setTimeout(() => {
			setVehicleFetchTrigger(prev => prev + 1);
		}, 300);
	}, [form, initialSearchBox]);

	// 조회
	const onSearch = useCallback(
		async () => {
			const isValid = await form
				.validateFields()
				.then(() => true)
				.catch(() => false);
			if (!isValid) return showAlert('', '필수 조회조건을 입력해주세요.');

			const values = form.getFieldsValue();
			const [deliveryDtFrom, deliveryDtTo] = values.deliveryDate || [];

			const params = {
				dccode: Array.isArray(values.gDccode) ? values.gDccode[0] : values.gDccode,
				deliverydtFrom: deliveryDtFrom ? dayjs(deliveryDtFrom).format('YYYYMMDD') : '',
				deliverydtTo: deliveryDtTo ? dayjs(deliveryDtTo).format('YYYYMMDD') : '',
				deliveryType: values.tmDeliverytype ?? '',
				dispatchStatus: values.dispatchStatus ?? '',
				custCode: values.custkey ?? '',
				carNo: values.carno ?? '',
				docNo: values.docno ?? '',
			};

			try {
				const responseData = await apiGetIndividualDispatchList(params);
				const list = responseData?.data ?? [];
				setGridData(list);
				setTotalCnt(list.length);
				setVehicleFetchTrigger(prev => prev + 1);
			} catch (error) {
				//console.warn('[TmIndividualDispatch] search error:', error);
				setGridData([]);
				setTotalCnt(0);
			}
		},
		[form],
	);

	const titleFunc = useMemo(
		() => ({
			searchYn: onSearch,
			initYn: onInit,
		}),
		[onSearch, onInit],
	);

	/**
	 * =====================================================================
	 *	03. render
	 * =====================================================================
	 */
	return (
		<>
			<MenuTitle func={titleFunc} />

			<SearchFormResponsive form={form} initialValues={initialSearchBox}>
				<TmIndividualDispatchSearch form={form} />
			</SearchFormResponsive>

			<div style={{ height: 12 }} />

			<TmIndividualDispatchList
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				onSearch={onSearch}
				vehicleFetchTrigger={vehicleFetchTrigger}
			/>
		</>
	);
};

export default TmIndividualDispatch;
