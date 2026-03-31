/*
 ############################################################################
 # FiledataField	: WdKxDeliveryInvoiceSearch.tsx
 # Description		: 출고 > 출고작업 > 택배송장발행(온라인) (조회)
 # Author					: JiHoPark
 # Since					: 2025.09.22.
 ############################################################################
*/

// Lib

// Component
import { InputText, MultiInputText, RadioBox, SelectBox } from '@/components/common/custom/form';

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';

// Util

// Store
import { apiPostMasterT2List } from '@/api/wd/apiWdDeliveryLabelForce';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API

// Hooks

// lib

// hook

// type

// asset

const WdKxDeliveryInvoiceSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// Declare variable(1/4)
	const { t } = useTranslation();

	const { form, activeKey } = props;
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const [printOrderList, setPrintOrderList] = useState([]);

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 출력순서 조회
	const searchPrintOrder = async () => {
		const params = {
			dccode: form.getFieldValue('fixdccode'),
			usePgm: storeUtil.getMenuInfo().progCd,
		};

		const printOrderList = await apiPostMasterT2List(params);

		const printOrderMap = printOrderList.data.map((item: any) => ({
			comCd: item.prtNm,
			cdNm: item.prtNm,
		}));

		// SelectBox에서 사용할 comCd/cdNm 형태로 설정 (맨 앞에 전체 항목 추가)
		if (printOrderMap.length > 0) {
			setPrintOrderList([{ comCd: '', cdNm: t('lbl.SELECT') }, ...printOrderMap]);
		} else {
			// If nothing returned, keep only the default option
			setPrintOrderList([{ comCd: '', cdNm: t('lbl.SELECT') }]);
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 조회조건 focus
	 */
	useEffect(() => {
		let searchId = '';

		if (activeKey === '1') {
			searchId = 'oranizeName';
		} else if (activeKey === '2') {
			searchId = 'basedtFromTo';
		} else if (activeKey === '3') {
			searchId = 'oranizeName3';
		} else if (activeKey === '4') {
			searchId = 'oranizeName3';
		} else if (activeKey === '5') {
			searchId = 'oranizeName3';
		} else if (activeKey === '6') {
			searchId = 'oranizeName3';
		}

		if (commUtil.isNotEmpty(searchId)) {
			const input = document.querySelector('input[id=' + searchId + ']') as HTMLInputElement;
			input?.focus();
		}
	}, [activeKey]);

	useEffect(() => {
		//loadZone(); // 센터에 해당되는 zone 정보 조회

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}

		form.setFieldValue('fixdccode', '2900'); // TODO임시용

		form.setFieldValue('reqDate', dayjs('2024-11-27'));
		form.setFieldValue('status', ''); // status 전체 선택
		// 출력순서
		searchPrintOrder();
	}, []);
	return (
		<>
			{(activeKey === '1' || activeKey === '2' || activeKey === '3' || activeKey === '4') && (
				<>
					<li>
						<CmGMultiDccodeSelectBox
							name="fixdccode"
							placeholder={t('lbl.SELECT')} // 선택
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							label={t('lbl.DCCODE')} // 물류센터
							mode={'single'}
							required
							onChange={async () => {
								//loadZone(); // 센터에 해당되는 zone 정보 조회
							}}
						/>
					</li>
					<li>
						<DatePicker
							name="reqDate"
							label={t('lbl.REQ_DATE')} // 요청일자
							format={'YYYY-MM-DD'} // 화면에 표시될 형식
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						<SelectBox
							label={t('lbl.EXCLUDE_RSN')} // 제외사유
							name="exceptReasonCd"
							options={getCommonCodeList('EXCLUDE_REASON', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>

					<li>
						<MultiInputText
							label={t('판매사이트주문번호')} // 판매사이트주문번호
							name="empCustDocno"
							onPressEnter={() => props.search()}
						/>
					</li>
					<li>
						<MultiInputText
							label={t('판매사이트코드')} // 판매사이트코드
							name="empCustkey"
							onPressEnter={() => props.search()}
						/>
					</li>
					<li>
						<MultiInputText
							label={t('lbl.TRSPBILLNUM')} // 운송장번호
							name="invoiceno"
							onPressEnter={() => props.search()}
						/>
					</li>

					{activeKey === '1' && (
						<li>
							<RadioBox
								label={t('lbl.DELIVERY_SVC_TYPE')} // 배송서비스구분
								name="deliverySvcType"
								options={[
									{ comCd: '', cdNm: t('lbl.ALL') }, // 전체
									{ comCd: '01', cdNm: t('lbl.STD') }, // 일반
									{ comCd: '03', cdNm: t('lbl.DLV_DV_NEXT') }, // N배송
								]}
								optionValue="comCd"
								optionLabel="cdNm"
								defaultValue=""
								required
							/>
						</li>
					)}
					<li>
						<SelectBox
							label={t('lbl.RECEIPT_TIME')} // 접수시간대
							name="rcptHourType"
							options={getCommonCodeList('RECEIPT_TIME_SLOT', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						<CmSkuSearch form={form} name="skuNm" code="sku" returnValueFormat="name" selectionMode="multipleRows" />
					</li>
					{activeKey === '1' && (
						<li>
							<SelectBox
								label={t('lbl.PRINTORDER')} //출력순서
								name="prtNm"
								placeholder="선택해주세요"
								options={printOrderList}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
							/>
						</li>
					)}
					<li>
						<SelectBox
							label={t('lbl.STATUS')} // 진행상태status
							name="status"
							options={getCommonCodeList('STATUS_INVOICENO', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}

			{activeKey === '5' && (
				<>
					<li>
						<SelectBox
							label={t('lbl.STORAGETYPE')} // 저장조건
							name="storagetype5"
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						<InputText
							label={t('lbl.BOX_NM')} // 박스명
							name="boxnm5"
						/>
					</li>
					<li>
						<SelectBox
							label={t('lbl.USE_YN')} // 사용여부
							name="useYn5"
							options={getCommonCodeList('YN', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{activeKey === '6' && (
				<>
					<li>
						<CmGMultiDccodeSelectBox
							name="fixdccode"
							placeholder={t('lbl.SELECT')} // 선택
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							label={t('lbl.DCCODE')} // 물류센터
							mode={'single'}
							required
							onChange={async () => {
								//loadZone(); // 센터에 해당되는 zone 정보 조회
							}}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default WdKxDeliveryInvoiceSearch;
