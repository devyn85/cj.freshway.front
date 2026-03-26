// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { InputText, SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const emptypeList = getCommonCodeList('EMPTYPE2', '전체', '');

const statusUserList = getCommonCodeList('STATUS_SY_USER', '전체', '');

const CmUserSearch = ({ search, form }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [selEmpType, setSelEmpType] = useState(''); // 선택된 "사원유형"

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * "사원유형" 변경시
	 * @param {any} value 사원유형 변경 값
	 */
	const onChangeEmpType = (value: any) => {
		setSelEmpType(value);

		// 검색 영역 3줄로 변경되면서 Splitter 스크롤 생기는 이슈 해결
		window.dispatchEvent(new Event('resize'));
	};

	return (
		<>
			<li>
				<SelectBox
					name="empType"
					label={t('lbl.EMPTYPE')}
					initval={''}
					options={emptypeList}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					onChange={onChangeEmpType}
				/>
			</li>
			{/* <li>
				<InputText name="custkey" label="업체코드" onPressEnter={search} />
			</li> */}
			<li>
				<InputText name="userId" label={t('lbl.USERID')} onPressEnter={search} />
			</li>
			<li>
				<InputText name="empNo" label={t('lbl.EMPNO')} onPressEnter={search} />
			</li>
			<li>
				<InputText name="userNm" label={t('lbl.USERNAME')} onPressEnter={search} />
			</li>
			<li>
				<SelectBox
					name="status"
					label={t('lbl.STATUS_1')}
					initval={''}
					options={statusUserList}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					name="delYn"
					label={t('lbl.DEL_YN')}
					initval={''}
					options={getCommonCodeList('DEL_YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					name="repUserIdYn"
					label={t('lbl.REP_USER_ID_YN')}
					initval={''}
					options={[
						{ comCd: '', cdNm: '전체' },
						{ comCd: 'Y', cdNm: 'Y' },
						{ comCd: 'N', cdNm: 'N' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					name="userStsCd"
					label={t('계정잠김여부')}
					initval={''}
					options={[
						{ comCd: '', cdNm: '전체' },
						{ comCd: '01', cdNm: '정상' },
						{ comCd: '02', cdNm: '잠김' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{(selEmpType === 'A01' || selEmpType === 'C01' || selEmpType === 'D01') && (
				<li>
					<CmCustSearch form={form} name="custkeyNm" code="custkey" label={t('lbl.LBL_FROM_CUSTNAME')} />
				</li>
			)}
			{selEmpType === 'B01' && (
				<li>
					<CmPartnerSearch form={form} name="custkeyNm" code="custkey" label={t('lbl.LBL_FROM_CUSTNAME')} />
				</li>
			)}
		</>
	);
};

export default CmUserSearch;
