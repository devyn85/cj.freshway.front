/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelSNSearch.tsx
 # Description		: 이력배송라벨출력 Search
 # Author			: 공두경
 # Since			: 25.10.15
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmCustBrandSearch from '@/components/cm/popup/CmCustBrandSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdDeliveryLabelSNSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey, printOrderList } = props;
	const [dates, setDates] = useState(dayjs());
	const [zoneOptions, setZoneOptions] = useState([]);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dccode = Form.useWatch('fixdccode', props.form);

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
		setZoneOptions([...getMsZoneList(props.form.getFieldValue('fixdccode'))]);
		//form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
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
		loadZone(); // 센터에 해당되는 zone 정보 조회
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialDate = dayjs();
		setDates(initialDate);
		form.setFieldValue('searchDate', initialDate);

		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}

		//props.form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	}, []);

	if (activeKey === '4') {
		//기준정보
		return (
			<>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
						required
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
			</>
		);
	} else if (activeKey === '3') {
		// 회수리스트
		return (
			<>
				<li>
					<DatePicker
						label={t('lbl.DOCDT_WD')} //출고일자
						name="searchDate"
						defaultValue={dates} // 초기값 설정
						format={dateFormat} // 화면에 표시될 형식
						span={24}
						required
						allowClear
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
						required
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
				<li>
					{/* 본점코드 */}
					<CmCustBrandSearch form={form} selectionMode="multipleRows" name="custname" code="custkey" label="본점코드" />
				</li>
			</>
		);
	} else {
		// 진행현황
		return (
			<>
				<li>
					<DatePicker
						label={t('lbl.DOCDT_WD')} //출고일자
						name="searchDate"
						defaultValue={dates} // 초기값 설정
						format={dateFormat} // 화면에 표시될 형식
						span={24}
						required
						allowClear
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
						required
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
				<li>
					<CmOrganizeSearch
						form={form}
						name="organizeNm"
						code="organize"
						label={t('lbl.ORGANIZE')}
						dccode={dccode}
						/*창고*/ selectionMode="multipleRows"
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
					<MultiInputText
						label={t('lbl.DOCNO_WD')} //주문번호
						name="docno"
						placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.SKUGROUP')} //SKU그룹
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
					{/* 본점코드 */}
					<CmCustBrandSearch form={form} selectionMode="multipleRows" name="custname" code="custkey" label="본점코드" />
				</li>
				<li>
					<SelectBox
						label={'CROSS센터'} //CROSS센터
						name="crossDc"
						placeholder="선택해주세요"
						options={[
							{ cdNm: '--- 전체 ---', comCd: '' },
							{ cdNm: '이천센터', comCd: '2600' },
						]}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						disabled={activeKey === '2' ? false : true}
					/>
				</li>
				<li>
					<SelectBox
						label={'출력방법'} //출력방법
						name="printmethod"
						placeholder="선택해주세요"
						options={[
							{ cdNm: '신규', comCd: 'NEW' },
							{ cdNm: '재발행', comCd: 'OLD' },
						]}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						disabled={activeKey === '2' ? false : true}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.PRINTORDER')} //출력순서
						name="printOrder"
						placeholder="선택해주세요"
						options={printOrderList}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						disabled={activeKey === '2' ? false : true}
					/>
				</li>
				<li style={{ gridColumn: ' span 2' }} className="flex-wrap">
					<SelectBox
						label={t('lbl.ZONE')} //피킹존
						name="zone"
						span={24}
						mode={'multiple'}
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
						disabled={activeKey === '2' ? false : true}
					/>
					<CheckBox name={'exceptLoc'} trueValue="1" falseValue="0" disabled={activeKey === '2' ? false : true}>
						{' '}
						STD/중단빈 제외
					</CheckBox>
				</li>
				<li style={{ gridColumn: ' span 2' }} className="flex-wrap">
					<InputText
						label={t('출력메모')} //출력메모
						name="printmemo"
						placeholder={t('msg.placeholder1', [t('출력메모')])}
						disabled={activeKey === '2' ? false : true}
					/>
				</li>
			</>
		);
	}
});

export default WdDeliveryLabelSNSearch;
