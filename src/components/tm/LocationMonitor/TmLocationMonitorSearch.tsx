/* eslint-disable react/jsx-no-undef */
/*
 ############################################################################
 # FiledataField	: TmLocationMonitorSearch.tsx
 # Description		: 지표모니터링 > 차량관제 > 차량위치모니터링 Search
 # Author			: BS.kim
 # Since			: 2025.09.08
 ############################################################################
*/
// Lib
import DatePicker from '@/components/common/custom/form/Datepicker';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Component
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';

// css

// API

// Util

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Const

// Types
import { CommonCodeItem, FormOptionItem, LocationMonitorSearchForm } from '@/types/tm/locationMonitor';
import { FormInstance } from 'antd';

// 파일 정의
const dateFormat = 'YYYY-MM-DD';

interface TmLocationMonitorSearchProps {
	form: FormInstance<LocationMonitorSearchForm>;
}

const TmLocationMonitorSearch = forwardRef(({ form }: TmLocationMonitorSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 변수 정의(1/4)
	const { t } = useTranslation(); // 다국어 처리
	/**
	 * 	props
	 * @param {string} deliverydt - 배송일자
	 * @param {string} dccode - 센터
			return row.storerkey === "STD" && row.comCd === "DELIVERY" || row.comCd === "FIX" || row.comCd === "FIXTEMPORARY" || row.comCd === "TEMPORARY"
	 * @param {string} contracttype - 계약유형(FIX: 고정, FIXTEMPORARY: 임시, TEMPORARY: 실비)
	 * @param {string} tmDeliverytype - 배송유형(: 배송, : 조달, : 수송)
	 * @param {string} carno - 키워드검색(차량번호, 기사)
	 */

	const [date] = useState(dayjs().add(1, 'day'));
	const [commCdContracttype, setCommCdContracttype] = useState<FormOptionItem[]>([]);
	const [commDeliverytypeTm, setcommDeliverytypeTm] = useState<CommonCodeItem[]>([]);

	// React Ref 정의(2/4)

	// 초기값 정의(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 배송일자 change event
	const onDatePickerChange = () => {
		// 날짜 변경 시 처리 로직 (필요시 추가)
	};

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
		form.setFieldValue('deliverydt', date);
		form.setFieldValue('tmDeliverytype', '1');

		// 공통코드 : 계약유형
		const tempCommCdContracttype: FormOptionItem[] = [];
		const tempCommCdContracttypeValues: string[] = [];
		const filterCommCdContracttype = getCommonCodeList('CONTRACTTYPE', null, null, { storerkey: 'FW00' }).filter(
			(row: CommonCodeItem) => {
				// 지입차, 고정용차, 임시용차, 수송차

				return (
					row.comCd === 'DELIVERY' ||
					row.comCd === 'MONTHLY' ||
					row.comCd === 'FIX' ||
					row.comCd === 'FIXTEMPORARY' ||
					row.comCd === 'TEMPORARY'
				);
			},
		);

		filterCommCdContracttype.forEach((item: CommonCodeItem, idx: number) => {
			// getCommonCodeList 공통코드 조회 시 FW00 만 필터링이 불가능한 구조라서 별도로 변환 처리
			const rawLabel = item.convdescr || item.cdNm;
			const convLabel = rawLabel.length >= 3 ? rawLabel.substring(0, 2) : rawLabel;
			tempCommCdContracttype.push({ label: convLabel, value: item.comCd });
			tempCommCdContracttypeValues.push(item.comCd);

			if (idx === filterCommCdContracttype.length - 1) {
				setCommCdContracttype(tempCommCdContracttype);
				form.setFieldValue('contracttype', tempCommCdContracttypeValues); // 전체선택 set
			}
		});

		// 공통코드 : 배송유형
		const filterCommDeliverytypeTm = getCommonCodeList('TM_DELIVERYTYPE').filter((row: CommonCodeItem) => {
			// 배송, 조달, 수송, 직송, 픽업, 수송(직송)
			return row.comCd === '1' || row.comCd === '3' || row.comCd === '4' || row.comCd === '7';
		});
		setcommDeliverytypeTm(filterCommDeliverytypeTm);
	}, [form, date]);

	/**
	 * =====================================================================
	 *  04. jsx
	 * =====================================================================
	 */
	return (
		<>
			<li>
				{/* 배송일자 */}
				<DatePicker
					name="deliverydt"
					label={t('lbl.DELIVERYDATE')}
					// span={50}
					onChange={onDatePickerChange}
					allowClear
					defaultValue={date} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 센터 */}
				<CmGMultiDccodeSelectBox
					name="dccode"
					label={'물류센터'}
					span={24}
					placeholder="선택해주세요"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 배송유형 */}
				<SelectBox
					name="tmDeliverytype"
					span={24}
					label={t('lbl.DELIVERYTYPE_2')}
					options={commDeliverytypeTm}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					showSearch
					allowClear
					placeholder="선택해주세요"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 계약유형 */}
				<SelectBox
					mode="multiple"
					name="contracttype"
					span={24}
					label={t('lbl.CONTRACTTYPE')}
					options={commCdContracttype}
					fieldNames={{ label: 'label', value: 'value' }}
					showSearch
					allowClear
					placeholder="선택해주세요"
					required
					rules={[{ required: true }]}
				/>
			</li>
			<li>
				{/* 키워드 검색 */}
				<CmCarSearch form={form} code="carno" name="carnoListName" label={'차량번호'} selectionMode="multipleRows" />
			</li>
			<li className={'hidden'}>
				{/* 키워드 검색 */}
				<InputText type={'hidden'} name="type" />
			</li>
		</>
	);
});

export default TmLocationMonitorSearch;
