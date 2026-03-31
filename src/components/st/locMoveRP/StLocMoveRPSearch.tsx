/*
 ############################################################################
 # FiledataField	: StLocMoveRPSearch.tsx
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
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const StLocMoveRPSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const [dates, setDates] = useState(dayjs());
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
		props.form.setFieldValue('fromzone', ''); // 피킹존을 "전체"가 선택되도록 설정
		props.form.setFieldValue('tozone', ''); // 피킹존을 "전체"가 선택되도록 설정
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
			<li>
				<span>
					<SelectBox
						label={'ZONE'}
						name="fromzone"
						span={24}
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
					<span>~</span>
					<SelectBox
						name="tozone"
						span={24}
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
				</span>
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
});

export default StLocMoveRPSearch;
