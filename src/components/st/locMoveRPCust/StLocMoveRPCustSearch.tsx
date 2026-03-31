/*
 ############################################################################
 # FiledataField	: StLocMoveRPCustSearch.tsx
 # Description		: 출고재고보충(수원3층) Search
 # Author			: 공두경
 # Since			: 25.07.16
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

//Lib
import axios from '@/api/Axios';
import { Col, Form } from 'antd';
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

const StLocMoveRPCustSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const [dates, setDates] = useState(dayjs());
	const [zoneOptions, setZoneOptions] = useState([]);
	const [distancetypeOptions, setDistancetypeOptions] = useState([]);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dccode = Form.useWatch('fixdccode', props.form);

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
		props.form.setFieldValue('fromzone', ''); // 피킹존을 "전체"가 선택되도록 설정
		props.form.setFieldValue('tozone', ''); // 피킹존을 "전체"가 선택되도록 설정
	};
	/**
	 * 존리스트 조회
	 * @param {any} params 등록 파라미터
	 * @returns {object} 성공여부 결과값
	 */
	const apiGetZoneList = (params: any) => {
		return axios.get('/api/st/stock/v1.0/getDataCodeList', { params }).then(res => res.data);
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
		const initialDate = dayjs();
		setDates(initialDate);
		form.setFieldValue('secrchDate', initialDate);

		loadZone();

		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}

		props.form.setFieldValue('fromzone', ''); // 피킹존을 "전체"가 선택되도록 설정
		props.form.setFieldValue('tozone', ''); // 피킹존을 "전체"가 선택되도록 설정

		const params = {};
		apiGetCenterPickGroupList(params).then(res => {
			setDistancetypeOptions([
				//{ commCd: null, commNm: '전체', dccode: null }, // 첫 행 추가
				...res.data,
			]);
		});
	}, []);

	return (
		<>
			<li>
				<DatePicker
					label={t('lbl.DOCDT_WD')} //출고일자
					name="secrchDate"
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
					onChange={async () => {
						loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
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
					label={t('lbl.WORKSTATUS')} //작업상태
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_ASRS', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
					label={t('lbl.PUBLISHYN')} //발행여부
					name="printyn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li className="range-align">
				<Col span={24}>
					<SelectBox
						label={'ZONE'}
						name="fromzone"
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
				</Col>
				<span>~</span>
				<Col span={24}>
					<SelectBox
						name="tozone"
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
				</Col>
			</li>
			<li>
				<InputText
					label={t('lbl.SUPLIMENTNO')} //보충번호
					name="supplno"
					placeholder={t('msg.placeholder1', [t('lbl.SUPLIMENTNO')])}
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
		</>
	);
});

export default StLocMoveRPCustSearch;
