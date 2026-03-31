/*
############################################################################
# FiledataField		: TmTempMonitorSearch.tsx
# Description		: 차량 온도 모니터링 - 검색 (차량별/온도기록상세) 컴포넌트 
# Author		: Park EunKyung(ekmona.park@cj.net)
# Since			: 2025.10.27
# Updated		: 
############################################################################
*/

// util
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

interface TmTempMonitorSearchProps {
	form: any;
	isDetailTab?: boolean;
	disabledFields?: boolean;
}

const TmTempMonitorSearch = ({ form, isDetailTab = false }: TmTempMonitorSearchProps) => {
	const { t } = useTranslation();
	const dateFormat = 'YYYY-MM-DD';
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const [dcCodeList, setDcCodeList] = useState([]);
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [deliveryDate, setDeliveryDate] = useState(dayjs());
	const base = Form.useWatch('base', form) ?? (isDetailTab ? 'CAR' : 'CUST');

	useEffect(() => {
		const deliveryDtFrom = dayjs();
		const deliveryDtTo = dayjs();
		setDates([deliveryDtFrom, deliveryDtTo]);
		form.setFieldValue('deliveryDt', [deliveryDtFrom, deliveryDtTo]);
	}, []);

	useEffect(() => {
		if (isDetailTab) {
			form.setFieldValue('base', 'CAR');
		}
	}, [isDetailTab]);

	// 물류센터 목록(dcCodeList)이 준비된 후에, 글로벌 변수에 저장된 물류센터를 기본값으로 설정합니다.
	useEffect(() => {
		// dcCodeList가 채워졌고, globalVariable.gDccode에 값이 있을 경우
		if (dcCodeList.length > 0 && globalVariable.gDccode) {
			form.setFieldValue('dcCode', globalVariable.gDccode);
		}
	}, [dcCodeList, globalVariable.gDccode]); // dcCodeList 또는 gDccode가 변경될 때 실행

	if (!isDetailTab) {
		return (
			<>
				{/* 배송일자 */}
				<li>
					<DatePicker
						name="deliveryDate"
						label={t('lbl.DELIVERYDATE')}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
						defaultValue={deliveryDate}
						format={dateFormat}
					/>
				</li>
				{/* 물류센터 */}
				<li>
					<CmGMultiDccodeSelectBox
						name="dccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dcCode' }}
						mode="single"
						label={t('lbl.DCCODE')}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				{/* 차량번호/기사 검색 */}
				<li>
					<CmCarSearch
						form={form}
						name={'carNoText'}
						code={'carno'}
						label={t('lbl.CARNO_DERIVER')}
						selectionMode={'multipleRows'}
						returnValueFormat={'code'}
					/>
				</li>
				{/* 계약유형 */}
				<li>
					<SelectBox
						name="contracttype"
						options={getCommonCodeList('CONTRACTTYPE', t('lbl.ALL'), '')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						label={t('lbl.CONTRACTTYPE')}
					/>
				</li>
			</>
		);
	}

	return (
		<>
			<li>
				{/* 배송일자  */}
				<Rangepicker
					label={t('lbl.DELIVERYDATE')}
					name="deliveryDt"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dcCode' }}
					mode="single"
					label={t('lbl.DCCODE')}
					required
				/>
			</li>
			{base === 'CAR' && (
				<li>
					{/* 차량번호 검색 */}
					<CmCarSearch
						form={form}
						name={'carNoText'}
						code={'carno'}
						label={t('lbl.CARNO_DERIVER')}
						selectionMode={'multipleRows'}
						returnValueFormat={'code'}
					/>
				</li>
			)}
			<li>
				{/* 조회구분 */}
				<SelectBox
					name="base"
					placeholder="선택해주세요"
					initval="CAR"
					options={[
						{ comCd: 'CAR', cdNm: '차량' },
						{ comCd: 'CUST', cdNm: '고객사' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'조회구분'}
				/>
			</li>
			<li>
				{/* 온도상태 */}
				<SelectBox
					name="tempStatus"
					options={getCommonCodeList('TEMPERATURE_STATUS', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.TEMP_STATUS')}
				/>
			</li>
			<li>
				{/* 시간단위 */}
				<SelectBox
					name="timeUnit"
					placeholder="선택해주세요"
					initval="10"
					options={[
						{ comCd: '1', cdNm: '1분' },
						{ comCd: '5', cdNm: '5분' },
						{ comCd: '10', cdNm: '10분' },
						{ comCd: '30', cdNm: '30분' },
						{ comCd: '60', cdNm: '1시간' },
						{ comCd: '120', cdNm: '2시간' },
						{ comCd: '180', cdNm: '3시간' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.TIME_INTERVAL')}
				/>
			</li>
			<li>
				{/* 출/도착건만 보기 */}
				<CheckBox name="depArrYn" label={t('lbl.DEPARTURE_ARRIVAL_ONLY')} checked={false}>
					{t('lbl.DEPARTURE_ARRIVAL_ONLY')}
				</CheckBox>
			</li>
			<li>
				{/* 센터 포함 보기 */}
				<CheckBox name="dcIncYn" label={t('lbl.INCLUDE_CENTER')} checked={true}>
					{t('lbl.INCLUDE_CENTER')}
				</CheckBox>
			</li>
			{base === 'CUST' && (
				<li>
					{/* 거래처코드/명 */}
					<CmCustSearch
						form={form}
						name="custname"
						code="custkey"
						label={t('lbl.CUSTCODENAME')}
						selectionMode="multipleRows"
					/>
				</li>
			)}
			{/* 회차정보 (hidden) */}
			<InputText name="priority" hidden={true} />
		</>
	);
};

export default TmTempMonitorSearch;
