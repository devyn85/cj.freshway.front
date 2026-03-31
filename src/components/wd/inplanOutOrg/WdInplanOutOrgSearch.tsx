/*
 ############################################################################
 # FiledataField	: WdInplanOutOrgSearch.tsx
 # Description		: 정산 > 외부창고정산 > 운송비 세부내역 조회 Search
 # Author			: ParkJinWoo
 # Since			: 25.07.10
 ############################################################################
*/

//Component
import { InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
//Hook
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmMngPlcSearch from '@/components/cm/popup/CmMngPlcSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useSelector } from 'react-redux';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdInplanOutOrgSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form, activeKey } = props; // Antd Form
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const [zoneOptions, setZoneOptions] = useState([]); // 피킹존 옵션 상태
	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

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
	 * Set current date
	 */
	useEffect(() => {
		const dt1 = dayjs();
		const dt2 = dayjs();
		setDates([dt1, dt2]);
		form.setFieldValue('date', [dt1, dt2]);
	}, []);

	if (activeKey === '1') {
		// activeKey가 '1'일 때는 일부만 표시
		// Display only some items when activeKey is '1'
		return (
			<>
				<li>
					<Rangepicker
						label={t('lbl.DOCDT_WD')}
						name="date"
						defaultValue={dates} // 초기값 설정
						format={dateFormat} // 화면에 표시될 형식
						// onChange={onChange}
						// span={16}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<SelectBox
						name="fixdccode" //물류센터
						span={24}
						options={getCommonCodeList('SUPPLY_DC').map(item => ({
							...item,
							cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
						}))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						label={t('lbl.DCCODENAME')}
						required
						disabled
					/>
				</li>
				<li>
					<CmMngPlcSearch
						form={form}
						label={t('lbl.TO_CUSTKEY_WD')} //관리처코드
						name="custNm"
						code="custKey"
					/>
				</li>
				<li>
					{/* 창고 */}
					<CmOrganizeSearch
						form={form}
						selectionMode="multipleRows"
						name="organizenm"
						code="organize"
						returnValueFormat="name"
						dccode={dccode}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.ORDER_NO')} //오더번호
						name="slipNo"
						placeholder={t('msg.placeholder1', [t('lbl.ORDER_NO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					{/* 상품 */}
					<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
				</li>
				<li>
					<InputText
						label={t('lbl.BLNO')} //BL번호
						name="convSerialNo"
						placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.SERIALNO')} //이력번호
						name="serialNo"
						placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmCustSearch
						form={form}
						name="contractcompanyNm"
						code="contractCustKey"
						label={t('lbl.CONTRACTCOMPANY')} //계약업체
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.CONTRACTTYPE')} //계약유형
						name="contractType"
						placeholder="선택해주세요"
						options={getCommonCodeList('CONTRACTTYPE_SN', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
			</>
		);
	} else {
		return (
			<>
				<li>
					<Rangepicker
						label={t('lbl.DOCDT_WD')}
						name="date"
						defaultValue={dates} // 초기값 설정
						format={dateFormat} // 화면에 표시될 형식
						// onChange={onChange}
						// span={16}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<SelectBox
						name="fixdccode" //물류센터
						span={24}
						options={getCommonCodeList('SUPPLY_DC').map(item => ({
							...item,
							cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
						}))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						label={t('lbl.DCCODE')}
						required
						disabled
					/>
				</li>
				<li>
					<CmMngPlcSearch
						form={form}
						label={t('lbl.TO_CUSTKEY_WD')} //관리처코드
						name="custNm"
						code="custKey"
					/>
				</li>
				<li>
					{/* 창고 */}
					<CmOrganizeSearch
						form={form}
						selectionMode="multipleRows"
						name="organizenm"
						code="organize"
						returnValueFormat="name"
						dccode={dccode}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.ORDER_NO')} //오더번호
						name="slipNo"
						placeholder={t('msg.placeholder1', [t('lbl.ORDER_NO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					{/* 상품 */}
					<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
				</li>
				<li>
					<InputText
						label={t('lbl.BLNO')} //BL번호
						name="convSerialNo"
						placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.SERIALNO')} //BL번호
						name="serialNo"
						placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmCustSearch
						form={form}
						name="contractcompanyNm"
						code="contractCustKey"
						label={t('lbl.CONTRACTCOMPANY')} /*계약업체*/
					/>
				</li>
				<li>
					<SelectBox
						label={'계약유형'} //진행상태
						name="contractType"
						placeholder="선택해주세요"
						options={getCommonCodeList('CONTRACTTYPE_SN', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.STORAGETYPE')} //저장조건
						name="storagetype"
						placeholder="선택해주세요"
						options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					{/* 톤급 */}
					<SelectBox
						name="carcapacity"
						placeholder="선택해주세요"
						options={getCommonCodeList('CARCAPACITY', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						label={t('lbl.CARCAPACITY')}
					/>
				</li>
			</>
		);
	}
});

export default WdInplanOutOrgSearch;
