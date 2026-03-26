/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelDailySearch.tsx
 # Description		: 일배분류서출력 Search
 # Author			: 공두경
 # Since			: 26.02.19
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, RadioBox, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// API Call Function
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdDeliveryLabelSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dccode = Form.useWatch('fixdccode', props.form);
	const searchtype = Form.useWatch('searchtype', form);

	// const [form] = Form.useForm();
	const { t } = useTranslation();

	/**
	 * 출력기준(searchtype)에 따른 출력순서(orderbyPick) 옵션 필터링
	 */
	const orderbyPickOptions = useMemo(() => {
		const allOptions = getCommonCodeList('PRINTORDER_DAILY', null);
		if (!searchtype) return allOptions;

		const filterMap: { [key: string]: string } = {
			'0': 'POP',
			'1': 'CUSTKEY',
			'2': 'CARNO',
		};

		const filterStr = filterMap[searchtype];
		if (!filterStr) return allOptions;

		return allOptions.filter((opt: any, index: number) => {
			return opt.data4?.toUpperCase().includes(filterStr);
		});
	}, [searchtype]);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialDate = dayjs();
		props.setDates(initialDate);
		form.setFieldValue('searchDate', initialDate);

		form.setFieldValue('fromDccode', '');
		form.setFieldValue('toDccode', gDccode);
	}, []);

	/**
	 * 출력기준 변경 시 출력순서 자동 선택
	 */
	useEffect(() => {
		if (searchtype === '0') {
			form.setFieldValue('orderbyPick', orderbyPickOptions[0]?.comCd);
		} else if (searchtype === '1') {
			form.setFieldValue('orderbyPick', orderbyPickOptions[1]?.comCd);
		} else if (searchtype === '2') {
			form.setFieldValue('orderbyPick', orderbyPickOptions[0]?.comCd);
		}
	}, [searchtype, orderbyPickOptions, form]);

	// 광역일배
	return (
		<>
			<li>
				<DatePicker
					label={t('lbl.INVOICEDT_WD')} //납품일자
					name="searchDate"
					defaultValue={props.dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					required
					allowClear
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmPartnerSearch
					form={form}
					selectionMode={'multipleRows'}
					name="toCustkeyNm"
					code="toCustkey"
					label={t('lbl.CUSTKEY_PO')} /*구매처*/
				/>
			</li>
			<li>
				<CmCarSearch
					label={t('lbl.VHCNUM')} // 차량번호
					form={form}
					code="carno"
					name="carnoNm"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<InputText
					label="POP" // POP
					name="deliverygroup"
					placeholder={t('msg.placeholder1', ['POP'])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<RadioBox
					label="출력기준"
					name="searchtype"
					options={[
						{ label: 'POP', value: '0' },
						{ label: '구매처', value: '1' },
						{ label: '차량번호', value: '2' },
					]}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.PRINTORDER')} //출력순서
					name="orderbyPick"
					placeholder="선택해주세요"
					options={orderbyPickOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* 공급센터 */}
				<CmGMultiDccodeSelectBox
					name="fromDccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.FROM_DCCODE')} //공급센터
					mode={'single'}
					disabled={activeKey === '2' ? false : true}
					allLabel={t('lbl.ALL')}
				/>
			</li>
			<li>
				{/* 공급받는센터 */}
				<CmGMultiDccodeSelectBox
					name="toDccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.TO_DCCODE')} //공급받는센터
					mode={'single'}
					disabled={activeKey === '2' ? false : true}
					allLabel={t('lbl.ALL')}
				/>
			</li>
		</>
	);
});

export default WdDeliveryLabelSearch;
