//Component
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import dayjs from 'dayjs';

// API Call Function
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdInplanTotalSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = '1000'; // KX센터 고정

	// const sampleForm = Form.useFormInstance();

	// const [form] = Form.useForm();
	const { t } = useTranslation();

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
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('slipdtRange', [initialStart, initialEnd]);

		const comCode1 = getCommonCodeList('PRODUCT-DRTYN', '--- 전체 ---').filter(
			item => !['1', '2', '3'].includes(item.comCd),
		);

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder={t('lbl.SELECT')} // 선택
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 물류센터
					mode={'single'}
					required
					disabled={true}
					initval={gDccode}
					onChange={async () => {
						//loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
				/>
			</li>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD')} //출고일자
					name="slipdtRange"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					//nChange={handleDateChange}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<MultiInputText
					label={t('lbl.DOCNO_WD')} //주문번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.DELETE_YN')} //삭제여부
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>

			<li>
				<CmCustSearch form={form} name="toCustkeyNm" code="toCustkey" label={t('lbl.TO_CUSTKEY_WD')} /*관리처코드*/ />
			</li>

			<li>
				<CmSkuSearch
					form={form}
					name="skuNm"
					code="sku"
					label={t('lbl.SKU')}
					/*상품코드*/ selectionMode="multipleRows"
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.POTYPE_WD')} //주문사유
					name="sotype"
					placeholder="선택해주세요"
					options={getCommonCodeList('SOTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.ORDERTYPE_WD')} //주문유형
					name="ordertype"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_WD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.FROM_EMPNAME1')} //영업사원
					name="toEmpname1"
					placeholder={t('msg.placeholder1', [t('lbl.FROM_EMPNAME1')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.SALEDEPARTMENT')} //사업장
					name="saledepartment"
					placeholder="선택해주세요"
					options={getCommonCodeList('SALEDEPARTMENT', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STATUS')} //진행상태
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_WD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.CHANNEL_DMD')} //저장유무
					name="channel"
					placeholder="선택해주세요"
					options={getCommonCodeList('PUTAWAYTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')} //저장조건
					name="storagetype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.CLOSEYN')} //마감여부
					name="closeyn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.BEFORESHORTAGEPLANYN')} //사전주문조정의뢰여부
					name="beforeshotage"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<CmCarSearch form={form} name="carnoNm" code="carno" label="차량번호" selectionMode="multipleRows" />
			</li>
			<li>
				<SelectBox
					label="주문그룹" //ASIS 라벨없음
					name="ordergrp"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDR_GROUP', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
});

export default WdInplanTotalSearch;
