/* eslint-disable react/jsx-no-undef */
/*
 ############################################################################
 # FiledataField	: StInquiryResultSearch.tsx
 # Description		: 재고 > 재고현황 > 조사지시현황 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputNumber, InputRange, InputText, RadioBox, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '@/store/core/coreHook';

//Util

const dateFormat = 'YYYY-MM-DD';

const StInquiryResultSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const fixdccode = Form.useWatch('fixdccode', form);
	const user = useAppSelector(state => state.user.userInfo);
	const userRoleArr = user.roles.split('|');
	const isUnder400 = userRoleArr.some(role => Number(role) < 400);

	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	const options = [
		{ label: '>', value: '1' },
		{ label: '>=', value: '2' },
		{ label: '=', value: '3' },
		{ label: '<=', value: '4' },
		{ label: '<', value: '5' },
	];
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	센터에 해당되는 zone 정보 조회
	 */
	const loadZone = async () => {
		await fetchMsZone();

		// 현재 선택된 물류센터(dccode)에 해당하는 zone 리스트를 안전하게 읽기
		const zones = getMsZoneList(form.getFieldValue('fixdccode')) || [];

		// zones 객체의 필드 네이밍은 여러 형태(baseCode/basecode/BASECODE 등)일 수 있으므로 안전하게 추출
		const zoneMap = zones.map((item: any) => ({
			comCd: item.baseCode,
			cdNm: item.baseDescr,
		}));

		setZoneOptions([{ comCd: '', cdNm: t('lbl.ALL') }, ...zoneMap]);
	};

	// SKU 검색 핸들러
	const handleSkuSearch = () => {
		// SKU 검색 팝업 로직
	};

	// SKU 입력 변경 핸들러
	const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// SKU 입력 변경 로직
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
		const dt1 = dayjs();
		const dt2 = dayjs().add(1, 'day');
		setDates([dt1, dt2]);
		form.setFieldValue('docdt', [dt1, dt2]);

		// 실사구분 기본값 세팅
		form.setFieldValue('lottype', '0');

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, [form]);

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
						loadZone();
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
					onKeyDown={(e: React.KeyboardEvent) => {
						if (e.key === 'Enter') {
							props.search();
						}
					}}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKU')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 피킹존 */}
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
					onKeyDown={(e: React.KeyboardEvent) => {
						if (e.key === 'Enter') {
							props.search();
						}
					}}
				/>
			</li>
			{/* 로케이션(FROM ~ TO) */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromLoc" toName="toLoc" />
			</li>
			{/* 실사구분 */}
			<li>
				<RadioBox
					name="lottype"
					label={t('lbl.INV_CHECK_TYPE')}
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
			{/* 차이금액 */}
			<DifferenceAmount>
				<SelectBox
					label={t('lbl.DIFF_AMOUNT')}
					name="compareAmt1"
					options={options}
					fieldNames={{ label: 'label', value: 'value' }}
				/>
				<InputNumber
					name="amt1"
					placeholder="숫자를 입력해주세요."
					formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={(value: string) => value.replace(/\$\s?|(,*)/g, '')}
				/>
				<SelectBox name="compareAmt2" options={options} fieldNames={{ label: 'label', value: 'value' }} span={3} />
				<InputNumber
					name="amt2"
					placeholder="숫자를 입력해주세요."
					formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={(value: string) => value.replace(/\$\s?|(,*)/g, '')}
				/>
			</DifferenceAmount>
			{isUnder400 && (
				<InventoryAmountWrap>
					<CheckBox label={t('lbl.STOCK_AMOUNT')} name="viewPriceYn" trueValue={'Y'} falseValue={'N'}>
						{t('lbl.AMOUNT_DISP')}
					</CheckBox>
				</InventoryAmountWrap>
			)}
		</>
	);
});
export default StInquiryResultSearch;

const DifferenceAmount = styled.li`
	display: flex;
	gap: 4px;
	> .ant-col:first-of-type {
		.ant-form-item-control {
			padding-left: 4px !important;
		}
	}

	> .ant-col:last-of-type {
		.ant-form-item-control {
			padding-right: 4px !important;
		}
	}

	.ant-col {
		flex: auto;

		.ant-row.ant-form-item-row {
			.ant-form-item-control {
				padding: 2px 0px;
			}
		}
		.ant-select-single.ant-select-sm {
			&:not(.ant-select-customize-input) {
				.ant-select-selector {
					padding: 0 5px;
				}
			}
		}
	}
`;

const InventoryAmountWrap = styled.li`
	.ant-checkbox + span {
		padding-inline-start: 4px;
		padding-inline-end: 4px;
	}
`;
