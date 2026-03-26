/*
 ############################################################################
 # FiledataField	: TmClaimCarSearch.tsx
 # Description		: 클레임정보(RDC검증중)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.07
 ############################################################################
*/

import { getClaimDtlList } from '@/api/tm/apiTmClaimCar';
import CmCarPopSearch from '@/components/cm/popup/CmCarPopSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

const TmClaimCarSearch = forwardRef((props: any, ref) => {
	const dateFormat = 'YYYY-MM-DD';
	const form = props.form;
	const initDate = [dayjs(), dayjs()];
	const [claimDtlList, setClaimDtlList] = useState([]);

	const claimtypeLVal = Form.useWatch('claimtypeL', form) || '';
	const claimtypeMVal = Form.useWatch('claimtypeM', form) || '';
	const claimtypeSVal = Form.useWatch('claimtypeS', form) || '';
	const ALLOW_L = [
		'일반 클레임',
		'문의/요청',
		'배송',
		'주문/서비스',
		'상품 인도',
		'배송 서비스',
		'불친절',
		'포장 상태',
		'서류',
		'기타 배송 불만',
		'배송 지연',
		'적온/적재 미준수',
		'불친절',
		'포장/내용물 파손',
		'서류 누락/요청',
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 * @param value
	 */
	const onChangeL = (value: string) => {
		if (value == '') {
			form.setFieldValue('claimtypeL', '');
			form.setFieldValue('claimtypeM', '');
			form.setFieldValue('claimtypeS', '');
			form.setFieldValue('claimtypeD', '');
		} else {
			form.setFieldValue('claimtypeL', value);
			form.setFieldValue('claimtypeM', '');
			form.setFieldValue('claimtypeS', '');
			form.setFieldValue('claimtypeD', '');
		}
	};
	const onChangeM = (value: string) => {
		if (isEmpty(value)) {
			form.setFieldValue('claimtypeM', '');
			form.setFieldValue('claimtypeS', '');
			form.setFieldValue('claimtypeD', '');
		} else {
			const val = claimDtlList.filter(item => item.baseCode == 'M' && item.specCode == value)[0]?.speccategory;
			form.setFieldValue(
				'claimtypeL',
				claimDtlList.filter(item => item.baseCode == 'L' && item.specCode == val)[0].specCode,
			);
			form.setFieldValue('claimtypeM', value);
			form.setFieldValue('claimtypeS', '');
			form.setFieldValue('claimtypeD', '');
		}
	};
	const onChangeS = (value: string) => {
		if (isEmpty(value)) {
			form.setFieldValue('claimtypeS', '');
			form.setFieldValue('claimtypeD', '');
		} else {
			const valM = claimDtlList.filter(item => item.baseCode == 'S' && item.specCode == value)[0]?.speccategory;
			const valMCd = claimDtlList.filter(item => item.baseCode == 'M' && item.specCode == valM)[0]?.specCode;

			const valL = claimDtlList.filter(item => item.baseCode == 'M' && item.specCode == valMCd)[0]?.speccategory;

			form.setFieldValue(
				'claimtypeL',
				claimDtlList.filter(item => item.baseCode == 'L' && item.specCode == valL)[0].specCode,
			);
			form.setFieldValue(
				'claimtypeM',
				claimDtlList.filter(item => item.baseCode == 'M' && item.specCode == valM)[0].specCode,
			);

			form.setFieldValue('claimtypeD', '');
		}
	};
	const onChangeD = (value: string) => {
		if (isEmpty(value)) {
			form.setFieldValue('claimtypeS', '');
		} else {
			const valS = claimDtlList.filter(item => item.baseCode == 'D' && item.specCode == value)[0]?.speccategory;
			const valSCd = claimDtlList.filter(item => item.baseCode == 'S' && item.specCode == valS)[0]?.specCode;

			const valM = claimDtlList.filter(item => item.baseCode == 'S' && item.specCode == valSCd)[0]?.speccategory;
			const valMCd = claimDtlList.filter(item => item.baseCode == 'M' && item.specCode == valM)[0]?.specCode;

			const valL = claimDtlList.filter(item => item.baseCode == 'M' && item.specCode == valMCd)[0]?.speccategory;

			form.setFieldValue(
				'claimtypeL',
				claimDtlList.filter(item => item.baseCode == 'L' && item.specCode == valL)[0].specCode,
			);
			form.setFieldValue(
				'claimtypeM',
				claimDtlList.filter(item => item.baseCode == 'M' && item.specCode == valM)[0].specCode,
			);
			form.setFieldValue(
				'claimtypeS',
				claimDtlList.filter(item => item.baseCode == 'S' && item.specCode == valS)[0].specCode,
			);
			form.setFieldValue('claimtypeD', value);
		}
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		form.setFieldValue('date', initDate);
		const params = {};
		getClaimDtlList(params).then(res => {
			setClaimDtlList([
				{ specCode: '', specDescr: '전체', baseCode: 'L' }, // 첫 행 추가
				{ specCode: '', specDescr: '전체', baseCode: 'M' }, // 첫 행 추가
				{ specCode: '', specDescr: '전체', baseCode: 'S' }, // 첫 행 추가
				{ specCode: '', specDescr: '전체', baseCode: 'D' }, // 첫 행 추가
				...res.data.filter(item => ALLOW_L.includes(item.specDescr)),
			]);
			// console.log(res.data.filter(item => ALLOW_L.includes(item.specDescr)));
		});
	}, []);

	return (
		<>
			{/* 배송일자 */}
			<li>
				<Rangepicker
					label="배송일자"
					name="date"
					defaultValue={initDate}
					format={dateFormat}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox mode={'single'} name={'fixDcCode'} rules={[{ required: true }]} />
			</li>
			{/* 고객코드/명 */}
			<li>
				<CmCustSearch
					form={form}
					name="multiToCustkeyName"
					code="multiToCustkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
			{/* 차량/POP 번호 조회 */}
			<li>
				<CmCarPopSearch form={form} name="multiCarnoName" code="multiCarno" selectionMode="multipleRows" />
			</li>
			{/* 클레임구분 대 */}
			<li>
				<SelectBox
					name="claimtypeL"
					label="클레임구분 대"
					options={claimDtlList.filter(item => item.baseCode === 'L')}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
					onChange={onChangeL}
				/>
			</li>
			{/* 클레임구분 중 : 전체는 항상, 선택 없으면 추가필터 X, 선택 있으면 speccategory로 필터*/}
			<li>
				<SelectBox
					name="claimtypeM"
					label="클레임구분 중"
					options={claimDtlList.filter(
						item =>
							item.baseCode === 'M' &&
							(item.specCode === '001' ||
								item.specCode === '005' ||
								item.specCode === '006' ||
								item.specCode === '007' ||
								item.specCode === '') &&
							(item.specCode === '' || !claimtypeLVal || item.speccategory === claimtypeLVal),
					)}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
					onChange={onChangeM}
				/>
			</li>
			{/* 클레임세분류 소 : 전체는 항상,  M 선택 없으면 추가필터 X, 선택 있으면 speccategory로 필터*/}
			<li>
				<SelectBox
					name="claimtypeS"
					label="클레임세분류 소 "
					options={claimDtlList.filter(
						item =>
							item.baseCode === 'S' &&
							(item.specCode === '' ||
								item.specCode === '002' ||
								item.specCode === '009' ||
								item.specCode === '015' ||
								item.specCode === '016') &&
							!(item.specCode === '015' && item.specDescr === '서류') &&
							(item.specCode === '' || !claimtypeMVal || item.speccategory === claimtypeMVal),
					)}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
					onChange={onChangeS}
				/>
			</li>
			{/* 클레임구분 세 : 전체는 항상,  S 선택 없으면 추가필터 X, S 선택 있으면 speccategory로 필터*/}
			<li>
				<SelectBox
					name="claimtypeD"
					label="클레임구분 세"
					options={claimDtlList.filter(
						item =>
							item.baseCode === 'D' &&
							(item.specCode === '056' ||
								item.specCode === '055' ||
								item.specCode === '032' ||
								item.specCode === '031' ||
								item.specCode === '030' ||
								item.specCode === '005' ||
								item.specCode === '') &&
							(item.specCode === '' || !claimtypeSVal || item.speccategory === claimtypeSVal),
					)}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
					onChange={onChangeD}
				/>
			</li>
			<li>
				<Rangepicker
					label="접수일자"
					name="date1"
					// defaultValue={initDate}
					format={dateFormat}
					allowClear
					showNow={false}
					// required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
		</>
	);
});
export default TmClaimCarSearch;
