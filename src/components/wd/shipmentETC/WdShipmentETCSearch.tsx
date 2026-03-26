/*
 ############################################################################
 # FiledataField	: WdShipmentETCSearch.tsx
 # Description		: 출고 > 기타출고 > 매각출고처리 (조회)
 # Author			    : 고혜미
 # Since		    	: 25.10.15
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { useSelector } from 'react-redux';

//Lib

// API Call Function
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';

//Util

const WdShipmentETCSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

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
		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	if (activeKey === '1') {
		// activeKey가 '1'일 때는 일부만 표시
		return (
			<>
				{/* <li>
					<Rangepicker
						label={t('lbl.SEARCHDT')} // 조회일자
						name="slipdt"
						format={'YYYY-MM-DD'} // 화면에 표시될 형식
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li> */}
				<li>
					<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODE')} required disabled />
				</li>
				<li>
					{/* 창고 */}
					<CmOrganizeSearch
						form={form}
						selectionMode="singleRows"
						name="organizenm"
						code="organize"
						returnValueFormat="name"
						dccode={gDccode}
						label={t('lbl.ORGANIZE')}
					/>
				</li>
				<li>
					{/* 로케이션 */}
					<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
				</li>
				<li>
					{/* 재고속성 */}
					<SelectBox
						label={t('lbl.STOCKGRADE')}
						name="stockgrade"
						options={getCommonCodeList('STOCKGRADE', '전체', '')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					{/* 상품 */}
					<CmSkuSearch form={form} label={t('lbl.SKU')} name="skuNm" code="sku" selectionMode="multipleRows" />
				</li>
			</>
		);
	} else if (activeKey === '3') {
		return (
			<>
				<li>
					<Rangepicker name="docDt" allowClear label={'매각기간'} required />
				</li>
				<li>
					<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODE')} required />
				</li>
				<li>
					{/* 로케이션 */}
					<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
				</li>
				<li>
					{/* 상품 */}
					<CmSkuSearch form={form} label={t('lbl.SKU')} name="skuNm" code="sku" selectionMode="multipleRows" />
				</li>
			</>
		);
	} else {
		return <></>;
	}
});

export default WdShipmentETCSearch;
