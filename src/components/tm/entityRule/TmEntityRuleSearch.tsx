/*
 ############################################################################
 # FiledataField	: TmEntityRuleSearch.tsx
 # Description		: 통합수당관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.12
 ############################################################################
*/
// lib
// component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import { CheckBox, Rangepicker, SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
// api

// util

// hook

// type

// asset

const TmEntityRuleSearch = forwardRef((props: any, ref) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [dcCodeList, setDcCodeList] = useState([]);
	const dateFormat = 'YYYY-MM-DD';
	const dcCode = Form.useWatch('dcCode', props.form);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 공통 코드 호출([comCd]cdNm)
	 * @returns
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		props.form.setFieldValue('date', [initialStart, initialEnd]);

		const list = getUserDccodeList('STD') || [];

		const allOption = {};
		// const allOption2 = { comCd: '', cdNm: '전체', display: '전체' };
		const allList = [...list.filter(item => item.dccode !== 'STD')];

		setDcCodeList(allList);
	}, []);
	useEffect(() => {
		// //console.log(getCommonCodeList('TM_CALC_ITEM', t('lbl.ALL'), null));
		if (dcCode !== null && dcCode !== '' && dcCode !== undefined) {
			// apiGeSttlItemCdList(dcCode).then(res => {
			// 	//console.log(res);
			// });
		}
	}, [dcCode]);
	return (
		<>
			<li>
				{/* <CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					options={getCommonCodeList('DC', '전체')}
				/> */}
				<SelectBox
					name="dcCode" //IF Status
					span={24}
					required
					options={dcCodeList}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
				/>
			</li>
			<li>
				<Rangepicker
					name="date"
					label="기준일자"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 운송사조회 팝업 */}
				<CmCarrierSearch
					form={props.form}
					selectionMode="singleRow"
					name="courierName"
					code="courier"
					returnValueFormat="name"
					carrierType="LOCAL"
				/>
			</li>

			<li>
				<SelectBox
					name="sttlItemCd" //IF Status
					span={24}
					options={[
						getCommonCodeList('TM_CALC_ITEM', t('lbl.ALL'), '').find(item => item.comCd === ''),
						...getCommonCodeList('TM_CALC_ITEM', t('lbl.ALL'), '').filter(
							item => (item.data1 === 'P' || item.data1 === 'M') && item.data3 === 'Y',
						),
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'관리항목'}
				/>
			</li>

			{/* <li>
				{' '}
				<CmOrganizeSearch //창고
					form={props.form}
					selectionMode="multipleRows"
					name="areaName"
					code="area"
					returnValueFormat="name"
					dccode={dcCode}
				/>
			</li> */}
			<li>
				<SelectBox
					name="contractType"
					label="계약유형"
					options={getCommonCodeList('CONTRACTTYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					// span={24}
				/>
			</li>

			<li>
				{/* 톤급 */}
				<SelectBox
					name="ton"
					placeholder="선택해주세요"
					options={[
						getCommonCodeList('CARCAPACITY', '전체', '')[0], // 첫 번째(전체)
						{ comCd: '0', cdNm: '공통' }, // 두 번째(공통)
						...getCommonCodeList('CARCAPACITY', '전체', '').slice(1), // 나머지
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CARCAPACITY')}
				/>
			</li>
			<li>
				<SelectBox
					name="closeType"
					placeholder="선택해주세요"
					options={getCommonCodeList('VIHICLE_TYPE_CD', '선택')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'마감유형'}
				/>
			</li>
			{/* <li>
				<InputText
					name="rmk"
					placeholder="검색어를 입력해주세요"
					label={'비고'}
					allowClear
					rules={[{ required: false, validateTrigger: 'none' }]}
				/>
			</li> */}
			<li>
				{' '}
				<CheckBox name={'serialYn'} label="이력조회" value={'N'}></CheckBox>
			</li>
		</>
	);
});
export default TmEntityRuleSearch;
