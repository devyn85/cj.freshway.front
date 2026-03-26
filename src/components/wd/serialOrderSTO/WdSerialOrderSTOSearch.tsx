/*
 ############################################################################
 # FiledataField	: WdSerialOrderSTOSearch.tsx
 # Description		: 이력STO출고처리 Search
 # Author			: 공두경
 # Since			: 25.09.29
 ############################################################################
*/
//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdSerialOrderSTOSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const fixdccode = Form.useWatch('fixdccode', props.form);

	// const sampleForm = Form.useFormInstance();

	// const [form] = Form.useForm();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 상태콤보값 세팅
	const stausOption = [
		{ label: '--- 전체 ---', value: null },
		{ label: '피킹완료', value: '50' },
		{ label: '부분확정', value: '85' },
		{ label: '출고확정', value: '90' },
	];
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
		form.setFieldValue('slipdtRange2', [initialStart, initialEnd]);

		form.setFieldValue('fromDccode', '2600');
		form.setFieldValue('toDccode', gDccode);
	}, []);

	if (activeKey === '1') {
		// 조회생성
		return (
			<>
				<li>
					<Rangepicker
						label={t('lbl.DOCDT_WD')}
						name="slipdtRange"
						defaultValue={dates}
						format={dateFormat}
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
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
						label={t('lbl.PLANT')} //플랜트
						name="plant"
						placeholder={t('msg.placeholder1', [t('lbl.PLANT')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmCustSearch
						form={form}
						name="toCustkeyNm"
						code="toCustkey"
						label={t('lbl.TO_CUSTKEY_WD')} /*관리처코드*/
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					{/* 공급센터 */}
					<CmGMultiDccodeSelectBox
						name="fromDccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.FROM_DCCODE')} //공급센터
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						allLabel={t('lbl.ALL')}
					/>
				</li>
				<li>
					{/* 공급받는센터 */}
					<CmGMultiDccodeSelectBox
						name="toDccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.TO_DCCODE')} //공급받는센터
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						allLabel={t('lbl.ALL')}
					/>
				</li>
				<li>
					<MultiInputText
						label={t('lbl.DOCNO_WD')} //구매번호
						name="docno"
						placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmSkuSearch
						form={form}
						name="skuNm"
						code="sku"
						label={t('lbl.SKU')} /*상품코드*/
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.SKUGROUP')} //상품분류
						name="skugroup"
						placeholder="선택해주세요"
						options={getCommonCodeList('SKUGROUP', '--- 전체 ---')}
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
			</>
		);
	} else if (activeKey === '2') {
		// 진행현황
		return (
			<>
				<li>
					<Rangepicker
						label={t('lbl.DOCDT_WD')}
						name="slipdtRange"
						defaultValue={dates}
						format={dateFormat}
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
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
						label={t('lbl.PLANT')} //플랜트
						name="plant"
						placeholder={t('msg.placeholder1', [t('lbl.PLANT')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmCustSearch
						form={form}
						name="toCustkeyNm"
						code="toCustkey"
						label={t('lbl.TO_CUSTKEY_WD')} /*관리처코드*/
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					{/* 공급센터 */}
					<CmGMultiDccodeSelectBox
						name="fromDccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.FROM_DCCODE')} //공급센터
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						allLabel={t('lbl.ALL')}
					/>
				</li>
				<li>
					{/* 공급받는센터 */}
					<CmGMultiDccodeSelectBox
						name="toDccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.TO_DCCODE')} //공급받는센터
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						allLabel={t('lbl.ALL')}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.DOCNO_WD')} //구매번호
						name="docno"
						placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmSkuSearch
						form={form}
						name="skuNm"
						code="sku"
						label={t('lbl.SKU')} /*상품코드*/
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.SKUGROUP')} //상품분류
						name="skugroup"
						placeholder="선택해주세요"
						options={getCommonCodeList('SKUGROUP', '--- 전체 ---')}
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
						label={t('lbl.STATUS')} //진행상태
						name="status"
						placeholder="선택해주세요"
						options={stausOption}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.DOCNO_WD_STO')} //광역주문번호
						name="fromcustkey"
						placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD_STO')])}
						onPressEnter={search}
					/>
				</li>
			</>
		);
	}
});

export default WdSerialOrderSTOSearch;
