/*
############################################################################
# FiledataField   : TmPlanCustomerDispatchHistoryPopup.tsx
# Description     : 배차이력 팝업 (고객사 기준)
# Author          : hyeonhobyun
# Since           : 25.09.23
############################################################################
*/

// styled/containers
import AGrid from '@/assets/styled/AGrid/AGrid';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';

// components
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText, SearchForm } from '@/components/common/custom/form';

// utils
import { apiTmGetPlanCustomerDispatchHistoryPopup } from '@/api/tm/apiTmDispatch';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import commUtil from '@/util/commUtil';
import { DatePickerProps } from 'antd/lib';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

/**
 * 정책 요약
 * - 검색 조건: 고객사(착지명, 착지코드), 배송일자 FROM~TO
 * - 조회 기본값: 당일 포함 이전 14일까지 (총 14일) 예) 2025-09-03 ~ 2025-09-16
 * - 조회 기간은 최대 2주로 제한, 날짜 미설정시 조회 불가(AS-IS 정책 유지)
 */
export type TmPlanCustomerDispatchHistoryPopupProps = {
	close: () => void;
	params: any;
	pForm: any;
};

const TmPlanCustomerDispatchHistoryPopup = ({ close, params, pForm }: TmPlanCustomerDispatchHistoryPopupProps) => {
	const [form] = Form.useForm();
	const gridRef = useRef<any>(null);
	const [totalCount, setTotalCount] = useState(0);

	const gridCols = useMemo(
		() => [
			{ headerText: '배송일자', dataField: 'deliverydt', dataType: 'date', width: 120 },
			{ headerText: '차량번호', dataField: 'carno', dataType: 'code', width: 140 },
			{
				headerText: '차량톤수',
				dataField: 'carcapacity',
				dataType: 'code',
				width: 110,
				labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
				},
			},
			{
				headerText: '계약유형',
				dataField: 'contracttype',
				dataType: 'code',
				width: 110,
				labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
				},
			},
			{ headerText: '운송사', dataField: 'couriername', dataType: 'code', width: 110 },
			{ headerText: '2차운송사', dataField: 'carriername', dataType: 'code', width: 110 },

			{ headerText: '기사명', dataField: 'drivername', dataType: 'code', width: 110 },
			{
				dataField: 'custarrivaldt',
				dataType: 'code',
				headerText: '도착시간',
				editable: false,
			},
			{
				headerText: '중량(kg)',
				dataField: 'weight',
				dataType: 'numeric',
				formatString: '#,##0.00',
				width: 90,
				labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
					return formatNumberTwoDecimals(value);
				},
			},
			{
				headerText: '체적(㎥)',
				dataField: 'cube',
				dataType: 'numeric',
				formatString: '#,##0.00',
				width: 90,
				labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
					return formatNumberTwoDecimals(value);
				},
			},
		],
		[],
	);

	const gridProps = useMemo(
		() => ({
			editable: false,
			showRowNumColumn: true,
			showRowCheckColumn: false,
			enableFilter: true,
			height: 460,
			fillColumnSizeMode: true,
			copyDisplayValue: true,
		}),
		[],
	);

	const formatNumberTwoDecimals = (value: any) => {
		if (value == null || value === '') {
			return '';
		}
		const numValue = Number(value);
		if (Number.isNaN(numValue)) {
			return value;
		}
		return numValue.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	};

	const handleSearch = async () => {
		try {
			await form.validateFields();
			const requestParams = {
				...form.getFieldsValue(),
				deliverydtFrom: form.getFieldsValue().deliveryDt[0].format('YYYYMMDD'),
				deliverydtTo: form.getFieldsValue().deliveryDt[1].format('YYYYMMDD'),
				tmDeliverytype: pForm?.getFieldValue?.('tmDeliverytype') ?? '',
				listCount: 1000,
			};

			apiTmGetPlanCustomerDispatchHistoryPopup(requestParams).then(res => {
				if (res.statusCode === 0) {
					setTotalCount(res.data.totalCount);
					gridRef.current?.setGridData?.(res.data.list);

					if (res.data.list.length > 0) {
						const colSizeList = gridRef.current?.getFitColumnSizeList(true);
						gridRef.current?.setColumnSizeList(colSizeList);
					}
				}
			});
		} catch (e: any) {
			//console.warn('WM API failed', e);
			showAlert(null, e?.errorFields?.[0]?.errors?.[0]);
		}
	};

	const handleReset = () => {
		form.resetFields();
		form.setFieldsValue({
			custkey: params?.custkey,
			custnm: params?.custname,
			dccode: params?.dccode,
			tmDeliverytype: pForm?.getFieldValue?.('tmDeliverytype') ?? '',
			deliveryDt: [
				dayjs(pForm?.getFieldsValue().deliverydtFrom).subtract(31, 'day') ||
					dayjs(params?.deliveryDt).subtract(31, 'day') ||
					dayjs().subtract(31, 'day'),
				pForm?.getFieldsValue().deliverydtFrom || params?.deliveryDt || dayjs(),
			],
		});
		gridRef.current?.clearGridData?.();
		setTotalCount(0);
	};

	useEffect(() => {
		form.setFieldsValue({
			custkey: params?.custkey,
			custnm: params?.custname,
			dccode: params?.dccode,
			tmDeliverytype: pForm?.getFieldValue?.('tmDeliverytype') ?? '',
			deliveryDt: [
				dayjs(pForm?.getFieldsValue().deliverydtFrom).subtract(31, 'day') ||
					dayjs(params?.deliveryDt).subtract(31, 'day') ||
					dayjs().subtract(31, 'day'),
				pForm?.getFieldsValue().deliverydtFrom || params?.deliveryDt || dayjs(),
			],
		});
		setTimeout(() => handleSearch(), 500);
	}, []);

	const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
	const disabledDaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
		if (from) {
			const minDate = from.add(-31, 'days');
			const maxDate = from.add(0, 'days');

			switch (type) {
				case 'year':
					return current.year() < minDate.year() || current.year() > maxDate.year();
				case 'month':
					return getYearMonth(current) < getYearMonth(minDate) || getYearMonth(current) > getYearMonth(maxDate);
				default:
					return Math.abs(current.diff(from, 'days')) >= 31;
			}
		}
		return false;
	};

	if (!open) return null;
	const dateFormat = 'YYYY-MM-DD';
	return (
		<div style={{ margin: '24px 0' }}>
			<PopupMenuTitle name="배차이력" func={{ searchYn: handleSearch, refresh: handleReset }} />
			<SearchForm form={form} initialValues={{}} isAlwaysVisible>
				<Form.Item name="dccode" hidden={true}></Form.Item>
				<Form.Item name="tmDeliverytype" hidden={true}></Form.Item>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-3">
						<li>
							<InputText label="착지코드" name="custkey" width={120} disabled placeholder="착지코드" />
						</li>
						<li>
							<InputText label="착지명" name="custnm" width={140} disabled placeholder="착지명" />
						</li>
						<li>
							<Rangepicker
								label={'배송일자'}
								name="deliveryDt"
								format={dateFormat}
								span={24}
								allowClear
								showNow={false}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
								disabledDate={disabledDaysDate}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>
			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCols} gridProps={gridProps} />
			</AGrid>
			<div style={{ textAlign: 'right', marginTop: 12 }}>
				<Button onClick={close}>닫기</Button>
			</div>
		</div>
	);
};

export default TmPlanCustomerDispatchHistoryPopup;
