/*
 ############################################################################
 # FiledataField	: WdAllocationBatchGroupSearch.tsx
 # Description		: 출고재고분배 Search
 # Author			: 공두경
 # Since			: 25.07.08
 ############################################################################
*/

//Component
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdAllocationBatchGroupSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [zoneOptions, setZoneOptions] = useState([]);
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

	/**
	 * 	센터에 해당되는 zone 정보 조회
	 */
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([
			{ baseDescr: '--- 전체 ---', baseCode: '' },
			...getMsZoneList(props.form.getFieldValue('fixdccode')),
		]);
		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
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
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('slipdtRange', [initialStart, initialEnd]);

		loadZone(); // 센터에 해당되는 zone 정보 조회

		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}
		props.form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정c
	}, []);

	if (activeKey === '3') {
		// activeKey가 '1'일 때는 일부만 표시
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
					<InputText
						label={t('lbl.DOCNO_WD')} //주문번호
						name="docno"
						placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
			</>
		);
	} else if (activeKey === '5') {
		// activeKey가 '5'일 때(거래처별 상미율)는 표시
		return (
			<>
				<li>
					<CmCustSearch
						form={form}
						name="custkeyNm"
						code="custkey"
						label={t('lbl.TO_CUSTKEY_WD')}
						/*관리처코드*/ selectionMode="multipleRows"
					/>
				</li>
				<li>
					<CmSkuSearch
						form={form}
						label={t('lbl.SKU')} //상품코드
						name="skuNm"
						code="sku"
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					<InputText
						label={t('소비기한율')} //소비기한율
						name="usebydateFreeRt"
						placeholder={t('msg.placeholder1', [t('소비기한율')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.USE_YN')} //사용여부
						name="useYn"
						placeholder="선택해주세요"
						options={getCommonCodeList('YN', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
			</>
		);
	} else if (activeKey === '6') {
		// activeKey가 '6'일 때(분배예외처리거래처)는 표시
		return (
			<>
				<li>
					<CmCustSearch
						form={form}
						name="custkeyNm"
						code="custkey"
						label={t('lbl.TO_CUSTKEY_WD')}
						/*관리처코드*/ selectionMode="multipleRows"
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.USE_YN')} //사용여부
						name="useYn"
						placeholder="선택해주세요"
						options={getCommonCodeList('YN', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.REMARK')} //비고
						name="rmk1"
						placeholder={t('msg.placeholder1', [t('lbl.REMARK')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
			</>
		);
	} else if (activeKey === '7') {
		// activeKey가 '7'일 때(분배예외처리상품)는 표시
		return (
			<>
				<li>
					<CmSkuSearch
						form={form}
						label={t('lbl.SKU')} //상품코드
						name="skuNm"
						code="sku"
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.USE_YN')} //사용여부
						name="useYn"
						placeholder="선택해주세요"
						options={getCommonCodeList('YN', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.REMARK')} //비고
						name="rmk1"
						placeholder={t('msg.placeholder1', [t('lbl.REMARK')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
			</>
		);
	} else {
		return (
			<>
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
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.STATUS_WD')} //진행상태
						name="status"
						placeholder="선택해주세요"
						options={getCommonCodeList('STATUS_WD', '--- 전체 ---')}
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
					<CmCustSearch
						form={form}
						name="toCustkeyNm"
						code="toCustkey"
						label={t('lbl.TO_CUSTKEY_WD')}
						/*관리처코드*/ selectionMode="multipleRows"
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
						label={t('lbl.ORDERTYPE_IF')} //I/F오더유형
						name="workprocesscode"
						placeholder="선택해주세요"
						options={getCommonCodeList('WORKPROCESSCODE', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.ALLOCFIXTYPE')} //선피킹조건
						name="allocfixtype"
						placeholder="선택해주세요"
						options={getCommonCodeList('ALLOCFIXTYPE', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<CmSkuSearch
						form={form}
						label={t('lbl.SKU')} //상품코드
						name="skuNm"
						code="sku"
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.SERIALYN')} //식별번호유무
						name="serialyn"
						placeholder="선택해주세요"
						options={getCommonCodeList('SERIALYN', '')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.ZONE')} //피킹존
						name="zone"
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
				</li>
			</>
		);
	}
});

export default WdAllocationBatchGroupSearch;
