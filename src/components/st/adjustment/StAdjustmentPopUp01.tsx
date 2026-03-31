/*
 ############################################################################
 # FiledataField	: StAdjustmentPopUp01.tsx
 # Description		: ZERO 재고 생성 팝업
 # Author			: sss
 # Since			: 22.11.02
 ############################################################################
*/
//Api
//Api
import { apiPostsaveZeroStock } from '@/api/st/apiStAdjustment';

// lib
import { Button, Form } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// utils
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dateUtil from '@/util/dateUtil';
import { showConfirm } from '@/util/MessageUtil';
// component
import FormWrap from '@/assets/styled/FormWrap/FormWrap';
import { InputText, SelectBox } from '@/components/common/custom/form';
// API Call Function
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CmDcXOrganizeSelectBox from '@/components/cm/dcXOrganize/CmDcXOrganizeSelectBox';
import CmLocationSearch from '@/components/cm/popup/CmLocationSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { useSelector } from 'react-redux';

// 넘겨받은 Props 타입 정의
type modalProps = {
	popupParams: any;
	//
	close?: any;
};

const StAdjustmentPopUp01 = (props: modalProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { close } = props; // props

	const today = dateUtil.getToDay('YYYYMMDD');
	const [form] = Form.useForm();
	const [formParam, setFormParam] = useState({
		regrDtm: today,
		stockid: 'STD',
		lottable01: 'STD',
	});
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const gStorerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);

	// Declare react Ref(2/4)
	//const refModal = useRef(null);

	// Declare init value(3/4)

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장
	 */
	async function saveMasterList() {
		if (commUtil.isNull(form.getFieldValue('organize'))) {
			showAlert(null, t('msg.selectPlease1', [t('lbl.ORGANIZE')])); // {창고}을/를 선택해주세요
			return;
		}

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// XML 형태의 요청 메시지 생성
		let avc_REQUESTMSG = '';
		avc_REQUESTMSG += '<DCCODE>' + gDccode + '</DCCODE>';
		avc_REQUESTMSG += '<STORERKEY>' + gStorerkey + '</STORERKEY>';
		avc_REQUESTMSG += '<ORGANIZE>' + commUtil.nvl(form.getFieldValue('organize'), '') + '</ORGANIZE>';
		avc_REQUESTMSG += '<SKU>' + commUtil.nvl(form.getFieldValue('sku'), '') + '</SKU>';
		avc_REQUESTMSG += '<LOC>' + commUtil.nvl(form.getFieldValue('locCode'), '') + '</LOC>';
		avc_REQUESTMSG += '<STOCKID>' + (commUtil.nvl(form.getFieldValue('stockid'), '') || '').trim() + '</STOCKID>';
		avc_REQUESTMSG += '<STOCKGRADE>' + commUtil.nvl(form.getFieldValue('stockgrade'), '') + '</STOCKGRADE>';
		avc_REQUESTMSG += '<LOTTABLE01>' + commUtil.nvl(form.getFieldValue('lottable01'), '') + '</LOTTABLE01>';

		const param = {
			avc_COMMAND: 'CREATEZERO',
			avc_REQUESTMSG: avc_REQUESTMSG,
		};

		//저장하시겠습니까
		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostsaveZeroStock(param).then(() => {
				close('1');
			});
		});
	}

	const onChangeEvent = (value: string, allValues: any) => {
		setFormParam(formParam => {
			formParam = Object.assign(formParam, allValues);
			return formParam;
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="ZERO 재고" />
			{/* 입력부 */}
			<Form form={form} className="lab-auto">
				<FormWrap form={form} preserve={false} initialValues={formParam} onValuesChange={onChangeEvent}>
					<li>
						{/* 창고.selectBox */}
						<CmDcXOrganizeSelectBox
							form={form}
							name="organizenm"
							code="organize"
							required={true}
							dccode={props.popupParams.dccode}
						/>
					</li>
					<li>
						{/* 상품코드 */}
						<CmSkuSearch
							label={t('lbl.SKUCD')}
							form={form}
							name="skuName"
							code="sku"
							selectionMode="multipleRows"
							required
						/>
					</li>
					<li>
						{/* 로케이션 */}
						<CmLocationSearch
							form={form}
							name="locName"
							code="locCode"
							returnValueFormat="code"
							required
							dccode={props.popupParams.dccode}
						/>
					</li>
					<li>
						{/* 재고ID 입력 */}
						<InputText label={t('lbl.STOCKID')} name="stockid" />
					</li>
					<li>
						{/* 재고속성 */}
						<SelectBox
							name="stockgrade"
							label={t('lbl.STOCKGRADE')}
							options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							style={{ width: '100%' }}
						/>
						{/* 기준일(유통,제조) */}
						<InputText label={t('lbl.LOTTABLE01')} name="lottable01" />
					</li>
				</FormWrap>
			</Form>
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button> {/* 취소 */}
				<Button type="primary" onClick={saveMasterList}>
					{t('lbl.BTN_CONFIRM')} {/* 확인 */}
				</Button>
			</ButtonWrap>
		</>
	);
};
export default StAdjustmentPopUp01;
