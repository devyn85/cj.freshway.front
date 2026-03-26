/*
 ############################################################################
 # FiledataField	: StLocMoveRPAllSearch.tsx
 # Description		: 자동창고보충 Search
 # Author			: 공두경
 # Since			: 25.09.16
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';

//Util
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import DatePicker from '@/components/common/custom/form/Datepicker';

const dateFormat = 'YYYY-MM-DD';

const StLocMoveRPAllSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const { t } = useTranslation();

	const [dates, setDates] = useState(dayjs());

	const [zoneOptions, setZoneOptions] = useState([]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dccode = Form.useWatch('fixdccode', props.form);

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
		form.setFieldValue('fromZone', ''); // 피킹존을 "전체"가 선택되도록 설정
		form.setFieldValue('toZone', ''); // 피킹존을 "전체"가 선택되도록 설정
	};

	useEffect(() => {
		const initialDate = dayjs();
		setDates(initialDate);
		form.setFieldValue('searchDate', initialDate);

		loadZone(); // 센터에 해당되는 zone 정보 조회

		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}
		props.form.setFieldValue('fromZone', ''); // 피킹존을 "전체"가 선택되도록 설정c
		props.form.setFieldValue('toZone', ''); // 피킹존을 "전체"가 선택되도록 설정c
	}, []);
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
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
					dccodeDisabled={true}
				/>
			</li>
			<li>
				<CmSkuSearch form={form} label={t('lbl.SKU')} name="skuNm" code="sku" selectionMode="multipleRows" />
			</li>
			<li>
				<span>
					<SelectBox
						label={'ZONE'}
						name="fromZone"
						span={24}
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
					<span> ~&nbsp;&nbsp; </span>
					<SelectBox
						name="toZone"
						span={24}
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
				</span>
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
				<MultiInputText
					label={t('lbl.SUPLIMENTNO')} //보충번호
					name="supplno"
					placeholder={t('msg.placeholder1', [t('lbl.SUPLIMENTNO')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<SelectBox
					label={t('처리여부')} //처리여부
					name="procyn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
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
			<li style={{ gridColumn: '2 / span 2' }}>
				<InputText
					label={t('출력메모')} //출력메모
					name="printmemo"
					placeholder={t('msg.placeholder1', [t('출력메모')])}
				/>
			</li>
			<li>
				<SelectBox
					label={t('지시여부')} //지시여부
					name="ifflagyn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/*
			<li>
				<MultiInputText
					label={t('lbl.DISTANCETYPE')} //원거리유형
					name="distancetype"
					placeholder={t('msg.placeholder1', [t('lbl.DISTANCETYPE')])}
					onPressEnter={search}
				/>
			</li>
			*/}
		</>
	);
});

export default StLocMoveRPAllSearch;
