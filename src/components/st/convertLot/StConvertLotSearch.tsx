/*
 ############################################################################
 # FiledataField	: StConvertLotSearch.tsx
 # Description		: 유통기한변경
 # Author			: YangChangHwan
 # Since			: 25.05.20
 ############################################################################
*/

// Components
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuGroup1Search from '@/components/cm/popup/CmSkuGroup1Search';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText, RadioBox, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

// Store

// Libs

// Utils

const StConvertLotSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { form, initialValues } = props;
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const dateFormat = 'YYYY-MM-DD';

	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const [expanded, setExpanded] = useState(false);

	// Declare react Ref(2/4)
	const groupRef = useRef<HTMLUListElement>(null);
	const lottable01Ref = useRef<any>(null);

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *	02. 함수
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
		const dt1 = dayjs();
		const dt2 = dayjs();
		setDates([dt1, dt2]);
		form.setFieldValue('dt', [dt1, dt2]);
		form.setFieldValue('sortkey', 'LOC'); // 정렬순서 기본값
		form.setFieldValue('dtFlag', 'MANUFACTUREDT'); // 기준일구분 기본값을 제조일자로 설정
		//form.setFieldValue('invoiceprinttype', 'WD'); // 초기값 설정

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<UiFilterArea>
			<UiFilterGroup className={!expanded ? 'hide' : ''} ref={groupRef}>
				{/* 물류센터 */}
				<li>
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder={t('lbl.SELECT')}
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')}
						mode={'single'}
						required
					/>
				</li>
				{/* 재고속성 */}
				<li>
					<SelectBox
						name="stockgrade"
						label="재고속성"
						options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				{/* 정렬순서 */}
				<li>
					<SelectBox
						name="sortkey"
						options={[
							{ comCd: 'LOC', cdNm: '로케이션/상품/기준일 순' },
							{ comCd: 'DATE', cdNm: '상품/기준일 순' },
						]}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						label={t('lbl.SORTKEY')}
					/>
				</li>
				{/* 상품코드 */}
				<li>
					<span>
						<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</span>
				</li>
				{/* 로케이션(From~To) */}
				<li>
					<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
				</li>
				{/* 존 */}
				<li>
					<InputRange label={t('존')} fromName="fromzone" toName="tozone" />
				</li>
				{/* 계약업체 */}
				<li>
					<CmCustSearch
						label={t('lbl.CONTRACTCOMPANY')}
						form={form}
						name="contractcompanyName"
						code="contractcompany"
						returnValueFormat="name"
						selectionMode="multipleRows"
					/>
				</li>
				{/* 기준일구분 */}
				<RadioBoxWrap>
					<RadioBox
						label={t('기준일구분')}
						name="dtFlag"
						options={[
							{
								label: t('제조일자'),
								value: 'MANUFACTUREDT',
							},
							{
								label: t('소비일자'),
								value: 'EXPIREDT',
							},
						]}
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</RadioBoxWrap>
				{/* 기준일 */}
				<li>
					<DatePicker
						refs={lottable01Ref}
						label={'기준일'}
						name="lottable01"
						rules={[{ required: true, message: '기준일(소비,제조)을 입력해주세요.' }]}
					/>
				</li>
				{/* B/L 번호 */}
				<li>
					<InputText label={t('lbl.BLNO')} name="blno" onPressEnter={null} />
				</li>
				{/* 이력번호 */}
				<li>
					<InputText label={t('lbl.SERIALNO')} name="serialno" onPressEnter={null} />
				</li>

				{/* 상품분류 */}
				<li>
					<CmSkuGroup1Search form={form} name="skugroupName" code="skugroup" returnValueFormat="name" />
				</li>
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default StConvertLotSearch;

const RadioBoxWrap = styled.li`
	.ant-radio-group {
		display: flex;
		flex-wrap: nowrap;
		.ant-radio-label {
			white-space: nowrap;
		}
	}
`;
