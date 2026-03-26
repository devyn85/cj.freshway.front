/*
 ############################################################################
 # FiledataField	: StInoutResultSearch.tsx
 # Description		: 재고 > 재고현황 > 재고폐기요청/처리 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, Datepicker, InputRange, InputText, RadioBox, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useAppSelector } from '@/store/core/coreHook';
import styled from 'styled-components';

const StDisuseRequestCenterSearch = forwardRef((props: any) => {
	const { t } = useTranslation(); // 다국어 처리
	const { search, form, activeKey } = props; // Antd Form
	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const [zoneOptions, setZoneOptions] = useState([]); // 피킹존 옵션 상태
	const user = useAppSelector(state => state.user.userInfo);
	const userRoleArr = user.roles.split('|');
	const isUnder400 = userRoleArr.some(role => Number(role) < 400);

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([{ baseDescr: t('lbl.ALL'), baseCode: '' }, ...getMsZoneList(form.getFieldValue('fixdccode'))]);
		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	};

	// * 초기 값 세팅
	useEffect(() => {
		loadZone();
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
		form.setFieldValue('requestMm', dayjs());
		form.setFieldValue('disuseDiv', '1');
		form.setFieldValue('dttype', 'APPRREQDT');
		form.setFieldValue('basedtFromTo', [dayjs(), dayjs()]);
	}, []);

	// * activeKey 변경 시 2번째 탭이면 물류센터를 "전체"로 설정
	useEffect(() => {
		if (activeKey === '2') {
			form.setFieldValue('fixdccode', '');
		} else if (activeKey !== '2' && gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, [activeKey, gDccode]);

	// * 폐기등록, 폐기요청 탭
	return (
		<>
			{['1', '2'].includes(activeKey) && (
				<>
					{/* 기준월 */}
					<li>
						<Datepicker
							label={t('lbl.BASEMONTH')}
							name="requestMm"
							format="YYYY-MM"
							picker="month"
							span={24}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
							onChange={() => {
								if (props.clearAllGridData) {
									props.clearAllGridData();
								}
							}}
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
							required={activeKey !== '2'}
							allLabel={activeKey === '2' ? t('lbl.ALL') : ''}
							onChange={async () => {
								loadZone();
							}}
						/>
					</li>

					{/* 창고 */}
					<li>
						<CmOrganizeSearch
							form={form}
							selectionMode="multipleRows"
							name="organizenm"
							code="organize"
							returnValueFormat="name"
							dccode={dccode}
							label={t('lbl.WAREHOUSE')}
						/>
					</li>

					{/* 저장조건 */}
					<li>
						<SelectBox
							label={t('lbl.STORAGETYPE')}
							name="storagetype"
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>

					{/* 상품코드/명 */}
					<li>
						<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>

					{/* 피킹존 */}
					<li>
						<SelectBox
							name="zone"
							label={t('lbl.ZONE')}
							options={zoneOptions}
							fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						/>
					</li>

					{/* 재고위치 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKTYPE')}
							name="stocktype"
							options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>

					{/* 재고속성 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKGRADE')}
							name="stockgrade"
							options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>

					{/* 로케이션(From~To) */}
					<li>
						<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
					</li>

					{/* B/L 번호 */}
					<li>
						<InputText
							label={t('lbl.BLNO')}
							name="blno"
							placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
							onPressEnter={search}
						/>
					</li>

					{/* 이력번호 */}
					<li style={{ gridColumn: ' / span 0' }}>
						<InputText label={t('lbl.SERIALNO')} name="serialno" />
					</li>

					{/* 폐기구분 */}
					<li>
						<RadioBox
							label={t('lbl.DISUSE_DIV')}
							name="disuseDiv"
							options={[
								{ label: t('lbl.GENERAL'), value: '1' },
								{ label: t('lbl.RETURN'), value: '2' },
							]}
						/>
					</li>

					{/* 처리방안 */}
					<li>
						<SelectBox
							name="disusemethodcd"
							span={24}
							options={getCommonCodeList('DISUSE_METHOD_CD', t('lbl.SELECT'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder={t('lbl.SELECT')}
							label={t('lbl.ACTION_PLAN')}
							defaultValue=""
							disabled={activeKey === '2' ? false : true}
						/>
					</li>
				</>
			)}
			{/*전자결재 탭*/}
			{['4'].includes(activeKey) && (
				<>
					{/* 기준일 */}
					<li>
						<Rangepicker
							label={t('lbl.BASEDT')}
							name="basedtFromTo"
							format={'YYYY-MM-DD'}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>

					{/* 물류센터 */}
					<li>
						<SelectBox
							name="fixdccode"
							span={24}
							options={getCommonCodeList('SUPPLY_DC').map(item => ({
								...item,
								cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
							}))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							label={t('lbl.DCCODE')}
							required
						/>
					</li>

					{/* 창고 */}
					<li>
						<CmOrganizeSearch
							label={t('lbl.STORE')}
							form={form}
							name="oranizeName2"
							dccode={'2170'}
							selectionMode={'multipleRows'}
							code="organize2"
							returnValueFormat="name"
						/>
					</li>

					{/* 상품 */}
					<li>
						<CmSkuSearch
							label={t('lbl.SKU2')}
							form={form}
							name="skuNm2"
							code="sku2"
							returnValueFormat="name"
							selectionMode="multipleRows"
						/>
					</li>
				</>
			)}
			{/*폐기처리 탭*/}
			{['5'].includes(activeKey) && (
				<>
					{/* 기준일 */}
					<li>
						<Rangepicker
							label={t('lbl.BASEDT')}
							name="basedtFromTo"
							format={'YYYY-MM-DD'}
							span={24}
							allowClear
							showNow={false}
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
								loadZone();
							}}
						/>
					</li>

					{/* 창고 */}
					<li>
						<CmOrganizeSearch
							form={form}
							selectionMode="multipleRows"
							name="organizenm"
							code="organize"
							returnValueFormat="name"
							dccode={dccode}
							label={t('lbl.WAREHOUSE')}
						/>
					</li>

					{/* 저장조건 */}
					<li>
						<SelectBox
							label={t('lbl.STORAGETYPE')}
							name="storagetype"
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>

					{/* 상품 */}
					<li>
						<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>

					{/* 피킹존 */}
					<li>
						<SelectBox
							name="zone"
							label={t('lbl.ZONE')}
							options={zoneOptions}
							fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						/>
					</li>

					{/* 재고위치 */}
					<li>
						<SelectBox
							label={t('lbl.TO_STOCKTYPE')}
							name="stocktype"
							options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>

					{/* 재고속성 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKGRADE')}
							name="stockgrade"
							options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>

					{/* 진행상태 */}
					<li>
						<SelectBox
							label={t('lbl.STATUS')}
							name="apprstatus"
							options={getCommonCodeList('APPROVALSTATUS', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							defaultValue={''}
						/>
					</li>

					{/* B/L 번호 */}
					<li>
						<InputText
							label={t('lbl.BLNO')}
							name="blno"
							placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
							onPressEnter={search}
						/>
					</li>

					{/* 이력번호 */}
					<li style={{ gridColumn: ' / span 0' }}>
						<InputText label={t('lbl.SERIALNO')} name="serialno" />
					</li>

					{/* 폐기일자 유형 */}
					<li>
						<SelectBox
							name="dttype"
							span={24}
							options={getCommonCodeList('DATETYPE_DISUSE')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder={t('lbl.PLEASE_SELECT')}
							label={t('lbl.DISUSE_DATE_TYPE')}
						/>
					</li>
				</>
			)}
			{/* 재고금액 roles 400 이하 한개라도 있으면 표시 */}
			{isUnder400 && ['1', '2', '4', '5'].includes(activeKey) && (
				<InventoryAmountWrap>
					<CheckBox label={t('lbl.STOCK_AMOUNT')} name="viewPriceYn" trueValue={'Y'} falseValue={'N'}>
						{t('lbl.AMOUNT_DISP')}
					</CheckBox>
				</InventoryAmountWrap>
			)}
		</>
	);
});

export default StDisuseRequestCenterSearch;

const InventoryAmountWrap = styled.li`
	.ant-checkbox + span {
		padding-inline-start: 4px;
		padding-inline-end: 4px;
	}
`;
