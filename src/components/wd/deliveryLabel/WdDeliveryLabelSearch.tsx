/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelSearch.tsx
 # Description		: 배송라벨출력 Search
 # Author			: 공두경
 # Since			: 25.10.15
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import { apiGetCenterPickGroupList } from '@/api/wd/apiWdDeliveryLabel';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdDeliveryLabelSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey, printOrderList } = props;
	const [zoneOptions, setZoneOptions] = useState([]);
	const [distancetypeOptions, setDistancetypeOptions] = useState([]);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dccode = Form.useWatch('fixdccode', props.form);
	const userAuthList = getCommonCodeList('WMS_MNG_DC') ?? [];
	const integrationLabelYn = Form.useWatch('integrationLabelYn', form);

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
		props.setDates(initialDate);
		form.setFieldValue('searchDate', initialDate);

		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}

		const params = {};
		apiGetCenterPickGroupList(params).then(res => {
			setDistancetypeOptions([
				//{ commCd: null, commNm: '전체', dccode: null }, // 첫 행 추가
				...res.data,
			]);
		});

		// 모든 옵션을 선택하기 위해 필터링된 코드 리스트와 '전체('')' 값을 배열로 합쳐서 세팅합니다.
		const allCodes = userAuthList.filter(v => v.convcode === '1').map(v => v.comCd);
		const initialValue = ['', ...allCodes];
		form.setFieldValue('checkDccode', initialValue);
		prevCheckDccode.current = initialValue;

		//props.form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	}, []);

	if (activeKey === '3') {
		// 조회생성
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
	} else {
		// 진행현황
		return (
			<>
				<li>
					<DatePicker
						label={t('lbl.DOCDT_WD')} //출고일자
						name="searchDate"
						defaultValue={props.dates} // 초기값 설정
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
						label={t('lbl.ZONE')} //피킹존
						name="zone"
						span={24}
						mode={'multiple'}
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.PICKINGMETHOD')} //피킹방법
						name="tasksystem"
						placeholder="선택해주세요"
						options={getCommonCodeList('TASKSYSTEM_WD', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.PICK_BATCH_NO')} //대배치키
						name="pickBatchNo"
						placeholder={t('msg.placeholder1', [t('lbl.PICK_BATCH_NO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.PICK_NO')} //피킹번호
						name="pickNo"
						placeholder={t('msg.placeholder1', [t('lbl.PICK_NO')])}
						onPressEnter={search}
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
				<li style={{ gridColumn: ' span 2' }} className="flex-wrap">
					<SelectBox
						label={t('lbl.SKUGROUP')} //SKU그룹
						name="skugroup"
						placeholder="선택해주세요"
						options={getCommonCodeList('SKUGROUP', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
					<CheckBox name={'labelPrintYn'} value={'Y'}>
						{' '}
						배송라벨엑셀출력
					</CheckBox>
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
						label={'CROSS센터'} //CROSS센터
						name="crossDc"
						placeholder="선택해주세요"
						options={getCommonCodeList('DELIVERY_CROSS', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.PRINTORDER')} //출력순서
						name="printorder"
						placeholder="선택해주세요"
						options={printOrderList}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.PICKINGTYPE')}
						name="distancetype"
						options={distancetypeOptions?.filter(code => [dccode, null].includes(code.dccode)) || []}
						fieldNames={{ label: 'commNm', value: 'commCd' }}
						mode={'multiple'}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.CROSSDOCKTYPE')} //C/D 타입
						name="crossdocktype"
						placeholder="선택해주세요"
						options={getCommonCodeList('CROSSDOCKTYPE', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.REPORTTYPE')} //리스트 양식
						name="reporttype"
						placeholder="선택해주세요"
						options={[
							{ cdNm: '일반 리스트', comCd: '0' },
							{ cdNm: 'CROSS 리스트', comCd: '1' },
						]}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
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
					{/* FO센터 */}
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
		);
	}
});

export default WdDeliveryLabelSearch;
