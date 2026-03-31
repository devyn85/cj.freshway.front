/*
 ############################################################################
 # FiledataField	: TmTrxCalculationReportSearch.tsx
 # Description		: 운송비정산서
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.10.20
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// API
import { apiGetCmUserDetail } from '@/api/cm/apiCmUser';

interface TmTrxCalculationReportSearchProps {
	form: any;
}

const TmTrxCalculationReportSearch = (props: TmTrxCalculationReportSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	// 물류센터
	const fixdccode = Form.useWatch('fixdccode', props.form);
	// 달력 표시 형식
	const [dateFormat] = useState('YYYY-MM-DD');
	// 사용자정보
	const user = useAppSelector(state => state.user.userInfo);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 마감유형 공통코드에서 필요한 정보만 조회 - 급식/외식
	 * @returns {any[]} result
	 */
	const getVehicleType = () => {
		const codeList = getCommonCodeList('VIHICLE_TYPE_CD', t('lbl.ALL'), null);
		return codeList;
		//const result = codeList.filter((v: any) => v.comCd != '10');
		//return result;
	};

	/**
	 * 차량유형 공통코드에서 필요한 정보만 조회 - 지입 / 고정 / 임시 / 실비
	 * @returns {any[]} result
	 */
	const getContractType = () => {
		const codeList = getCommonCodeList('CONTRACTTYPE', t('lbl.ALL'), null);
		const result = codeList.filter(
			(v: any) =>
				v.comCd === null ||
				v.data4 === 'DELIVERY' ||
				v.data4 === 'FIX' ||
				v.data4 === 'FIXTEMPORARY' ||
				v.data4 === 'TEMPORARY' ||
				v.data4 === 'MONTHLY',
		);
		return result;
	};

	/**
	 * 정산구분 공통 정보 조회
	 * @returns {any[]} result
	 */
	const getDeliveryType = () => {
		const result = [
			{ comCd: null, cdNm: '전체' },
			{ comCd: '10', cdNm: '배송' },
			{ comCd: '20', cdNm: '수송' },
			{ comCd: '30', cdNm: '조달' },
		];
		return result;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		// 컴포넌트 마운트 시 배송업체 사용자라면 기본 운송사 정보로 초기값 설정
		if (user.emptype === 'C01' && user.authority === 'WAYLO_400') {
			const params = {
				userId: user.userId,
			};
			apiGetCmUserDetail(params).then(res => {
				if (res.data) {
					const userInfo = res.data;
					props.form.setFieldValue('courier', userInfo.custkey);
					props.form.setFieldValue('courierName', userInfo.custkeyNm);
				}
			});
		}
	}, []);

	return (
		<>
			<li>
				<Rangepicker //기준일자
					label={t('lbl.BASEDT')}
					name="slipdtRange"
					//defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode" //물류센터
					label={t('lbl.DCCODENAME')}
					mode="single"
					required
				/>
			</li>
			<li>
				<SelectBox //정산구분-배송,수송,조달...
					name="deliveryType"
					span={24}
					options={getCommonCodeList('TM_CALC_OP', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STTL_TYPE')}
				/>
			</li>
			<li>
				<SelectBox //마감유형
					name="closeType"
					span={24}
					options={getVehicleType()}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CLOSETYPE')}
				/>
			</li>
			<li>
				<SelectBox //차량유형(계약유형)
					name="contractType"
					span={24}
					options={getContractType()}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CONTRACTTYPE')}
				/>
			</li>
			<li>
				<CmCarrierSearch //운송사
					form={props.form}
					selectionMode="multipleRows"
					name="courierName"
					code="courier"
					returnValueFormat="name"
					carrierType="LOCAL"
					disabled={user.emptype !== '01' ? true : false}
				/>
			</li>
			<li>
				<CmCarSearch //차량번호
					form={props.form}
					selectionMode="multipleRows"
					name="carnoName"
					code="carno"
					returnValueFormat="name"
					customDccode={fixdccode} // 조회하시려는 물류센터 코드 입력해주세요
				/>
			</li>
			<li>
				<SelectBox //톤급
					name="carcapacity"
					span={24}
					options={getCommonCodeList('CARCAPACITY', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CARCAPACITY')}
				/>
			</li>
		</>
	);
};

export default TmTrxCalculationReportSearch;
