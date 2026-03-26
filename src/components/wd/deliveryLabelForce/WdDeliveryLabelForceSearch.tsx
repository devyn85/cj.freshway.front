/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelForceSearch.tsx
 # Description		: 출고 > 출고 > 배송 라벨 출력(예외 기준 적용) 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.10.17
 ############################################################################
*/

// Components
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { CheckBox, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { Form } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// Store

// Libs

// Utils

const WdDeliveryLabelForceSearch = ({
	form,
	//initialValues,
	//dates,
	//setDates,
	activeKey,
	//searchPrintOrder,
	printOrderList,
}: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	//const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	// const rangeRef = useRef(null);

	// const [expanded, setExpanded] = useState(false);
	// const [showToggleBtn, setShowToggleBtn] = useState(false);
	// const groupRef = useRef<HTMLUListElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const integrationLabelYn = Form.useWatch('integrationLabelYn', form);

	const userAuthList = getCommonCodeList('WMS_MNG_DC') ?? [];
	//const gDcname = useSelector((state: any) => state.global.globalVariable.gDccodeNm);

	// const printmethodList = [
	// 	{
	// 		// 월별
	// 		label: t('lbl.MONTH_BY'),
	// 		value: '0',
	// 	},
	// 	{
	// 		// 일별
	// 		label: t('lbl.DAY_BY'),
	// 		value: '1',
	// 	},
	// ];

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
	const prevCheckDccode = useRef<string[]>([]);

	const handleCheckDccodeChange = (value: string[]) => {
		const allOptionValues = [{ cdNm: t('lbl.ALL'), comCd: '' }, ...userAuthList.filter(v => v.convcode === '1')].map(
			v => v.comCd,
		);

		const hasAllPrev = prevCheckDccode.current.includes('');
		const hasAllNext = value.includes('');

		let finalValue = value;

		if (!hasAllPrev && hasAllNext) {
			// 1. '전체'('')를 새로 선택한 경우 -> 모든 옵션 선택
			finalValue = allOptionValues;
		} else if (hasAllPrev && !hasAllNext) {
			// 2. '전체'('')가 선택된 상태에서 '전체'를 해제한 경우 -> 모든 옵션 해제
			finalValue = [];
		} else if (hasAllPrev && hasAllNext && value.length < allOptionValues.length) {
			// 3. '전체'('')가 포함된 상태에서 다른 개별 옵션을 해제한 경우 -> '전체'도 같이 해제
			finalValue = value.filter(v => v !== '');
		} else if (!hasAllNext && value.length === allOptionValues.length - 1) {
			// 4. '전체'('')를 제외한 모든 개별 옵션이 선택된 경우 -> '전체'도 자동으로 선택
			finalValue = allOptionValues;
		}

		prevCheckDccode.current = finalValue;
		form.setFieldValue('checkDccode', finalValue);
	};

	useEffect(() => {
		//searchPrintOrder();
		form.setFieldValue('dccode', gDccode);

		// 모든 옵션을 선택하기 위해 필터링된 코드 리스트와 '전체('')' 값을 배열로 합쳐서 세팅합니다.
		const allCodes = userAuthList.filter(v => v.convcode === '1').map(v => v.comCd);
		const initialValue = ['', ...allCodes];
		form.setFieldValue('checkDccode', initialValue);
		prevCheckDccode.current = initialValue;
	}, []);
	return (
		<>
			<li>
				{/* 물류센터 */}
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{activeKey === '1' && (
				<>
					<li>
						{/* 출고일자 */}
						<DatePicker
							label={t('lbl.DOCDT_WD')}
							name="taskdt"
							allowClear
							showNow={true}
							format="YYYY-MM-DD"
							required={true}
						/>
					</li>
					{/* C/D타입 */}
					<li>
						<SelectBox
							label={t('lbl.CROSSDOCKTYPE')}
							name="crossdocktype"
							options={getCommonCodeList('CROSSDOCKTYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 대배치키 */}
						<InputText
							label={t('lbl.PICK_BATCH_NO')}
							name="pickBatchNo"
							placeholder={t('msg.placeholder2', [t('lbl.PICK_BATCH_NO')])}
						/>
					</li>
					<li>
						{/* 피킹번호 */}
						<InputText label={t('lbl.PICK_NO')} name="pickNo" placeholder={t('msg.placeholder2', [t('lbl.PICK_NO')])} />
					</li>
					{/* 주문유형 */}
					<li>
						<SelectBox
							label={t('lbl.ORDERTYPE')}
							name="ordertype"
							options={getCommonCodeList('ORDERTYPE_WD', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* CROSS 센터 */}
					<li>
						<SelectBox
							label={t('lbl.CROSS_CENTER')}
							name="crossDc"
							options={getCommonCodeList('DELIVERY_CROSS', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 출력방법 */}
					<li>
						<SelectBox
							label={t('lbl.PRINT_METHOD')}
							name="printmethod"
							options={[
								{ cdNm: t('lbl.NEW'), comCd: 'NEW' }, // 신규
								{ cdNm: t('lbl.REPRINT'), comCd: 'OLD' }, // 재발행
							]}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 피킹방법 */}
					<li>
						<SelectBox
							label={t('lbl.PICKINGMETHOD')}
							name="tasksystem"
							options={getCommonCodeList('TASKSYSTEM_WD', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 관리처코드 */}
						<CmCustSearch
							form={form}
							selectionMode={'multipleRows'}
							name="toCustkeyNm"
							code="toCustkey"
							label={t('lbl.TO_CUSTKEY_WD')}
						/>
					</li>
					{/* 출력순서 */}
					<li>
						<SelectBox
							label={t('lbl.PRINTORDER')}
							name="printOrder"
							//options={getCommonCodeList('PRINTORDER', t('lbl.ALL'), '')}
							options={printOrderList}
							//fieldNames={{ label: 'cdNm', value: 'comCd' }}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 상품코드 */}
					<li>
						<CmSkuSearch form={form} name="skuName" code="sku" selectionMode={'multipleRows'} label={t('lbl.SKU')} />
					</li>
					{/* 상품분류 */}
					<li>
						<SelectBox
							label={t('lbl.SKUGROUP')}
							name="skugroup"
							options={getCommonCodeList('SKUGROUP', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 저장조건 */}
					<li>
						<SelectBox
							label={t('lbl.STORAGETYPE')}
							name="storagetype"
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 지정원거리유형 */}
					<li>
						<SelectBox
							label={t('lbl.DISTANCETYPE_2')}
							name="distancetype"
							options={getCommonCodeList('DISTANCETYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* CROSS 재고 제외 */}
					<li>
						<CheckBox label={t('lbl.CROSS_STOCK_EXCEPT')} name="crossYn" trueValue={'1'} falseValue={'0'} />
					</li>
					{/* 통합라벨출력여부 */}
					<li>
						<CheckBox
							label={t('lbl.INTEGRATION_LABEL_YN')}
							name={'integrationLabelYn'}
							trueValue={'1'}
							falseValue={'0'}
						/>
					</li>
					<li>
						{/* 물류센터 */}
						<SelectBox
							label={t('lbl.FO_CENTER')} //FO센터
							name="checkDccode"
							mode={'multiple'}
							placeholder="선택해주세요"
							options={[{ cdNm: t('lbl.ALL'), comCd: '' }, ...userAuthList.filter(v => v.convcode === '1')]}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							disabled={integrationLabelYn === '1' ? false : true}
							onChange={handleCheckDccodeChange}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default WdDeliveryLabelForceSearch;
