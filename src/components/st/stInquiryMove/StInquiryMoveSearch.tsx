/*
 ############################################################################
 # FiledataField	: StInquiryMoveSearch.tsx
 # Description		: 재고 > 재고조사 > 재고조사결과처리 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText, RadioBox, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

/**
 * 재고조사지시현황 검색 컴포넌트
 * @param {object} props - 컴포넌트 속성
 * @param {Function} props.search - 검색 실행 함수
 * @param {object} props.form - Antd Form 인스턴스
 * @param {Function} props.clearGridData - 그리드 데이터 초기화 함수
 * @returns {React.ReactElement} 검색 컴포넌트 JSX
 */
const StInquiryMoveSearch = (props: any) => {
	const { t } = useTranslation(); // 다국어 처리
	const { form, clearGridData } = props; // Antd Form
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [zoneOptions, setZoneOptions] = useState([]); // 피킹존 옵션 상태
	const dateFormat = 'YYYY-MM-DD';
	const fixdccode = Form.useWatch('fixdccode', form);

	/**
	 * 센터에 해당되는 zone 정보 조회
	 * @description 선택된 물류센터에 해당하는 피킹존 정보를 조회하고 폼 필드를 초기화합니다
	 * @returns {Promise<void>}
	 */
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([{ baseDescr: t('lbl.ALL'), baseCode: '' }, ...getMsZoneList(form.getFieldValue('fixdccode'))]);
		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정 / Set picking zone to be selected as "All"
	};

	/**
	 * 컴포넌트 초기화
	 * @description 현재날짜 설정, 기본값 세팅, 물류센터 정보 조회를 수행합니다
	 */
	useEffect(() => {
		const dt1 = dayjs();
		const dt2 = dayjs().add(1, 'day');
		setDates([dt1, dt2]);
		form.setFieldValue('docdt', [dt1, dt2]);

		loadZone(); // 센터에 해당되는 zone 정보 조회

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}

		form.setFieldValue('lottype', '0'); // 실사구분 기본값 세팅 (0: 재고실사)
	}, []);

	return (
		<>
			{/* 조사일자 */}
			<li>
				<Rangepicker
					label={t('lbl.INQUIRYDT')}
					name="docdt"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder={t('lbl.SELECT')}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
					mode={'single'}
					required
					onChange={async () => {
						//loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
				/>
			</li>
			{/* 창고 */}
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="single"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccode}
					label="창고"
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						if (Array.isArray(fixdccode)) {
							if (fixdccode.length < 1) {
								return true;
							}
							return fixdccode.some((row: any) => row !== '2170' && row !== '1000');
						} else {
							return fixdccode !== '2170' && fixdccode !== '1000';
						}
					})()}
				/>
			</li>
			{/* 조사번호 */}
			<li>
				<InputText
					label={t('lbl.INQUIRYNO')}
					name="inquiryno"
					placeholder={t('msg.placeholder2', [t('lbl.INQUIRYNO')])}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKU')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 피킹존(From~To) */}
			<li>
				<InputRange label={t('lbl.ZONE')} fromName="fromZone" toName="toZone" />
			</li>
			{/* 진행상태 */}
			<li>
				<SelectBox
					label={t('lbl.INQUIRYSTATUS')}
					name="status"
					options={getCommonCodeList('STATUS_INQUIRY', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					defaultValue={t('lbl.ALL')}
				/>
			</li>
			{/* 재고조사 별칭 */}
			<li>
				<InputText
					label={t('lbl.INQUIRY_ALIAS')}
					name="inquiryAlias"
					placeholder={t('msg.placeholder1', [t('lbl.INQUIRY_ALIAS')])}
				/>
			</li>
			{/* 로케이션(From~To) */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromLoc" toName="toLoc" />
			</li>
			{/* 실사구분 */}
			<li>
				<RadioBox
					name="lottype"
					label={t('lbl.INV_CHECK_TYPE')} // 실사구분
					options={[
						{
							label: t('lbl.USEBYDATE'), // 소비기한
							value: '0',
						},
						{
							label: t('lbl.STOCK_TAKE'), // 재고실사
							value: '1',
						},
					]}
					defaultValue={'0'}
					required
					onChange={() => {
						// 실사구분 변경 시 그리드 데이터 초기화
						if (clearGridData) {
							clearGridData();
						}
					}}
				/>
			</li>
			{/* 창고구분 */}
			<li>
				<SelectBox
					label={t('lbl.WHAREA')}
					name="wharea"
					options={getCommonCodeList('WHAREA', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					defaultValue={t('lbl.ALL')}
				/>
			</li>
		</>
	);
};

export default StInquiryMoveSearch;
