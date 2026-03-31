// Component
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmTcSearch from '@/components/cm/popup/CmTcSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// Lib
import { InputText, SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const MsCarDriverSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form } = props;
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			<li>
				{/* 차량번호 */}
				<CmCarSearch
					form={form}
					label={t('lbl.CARNO')}
					name="carName"
					code="carNo"
					returnValueFormat="code"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmCarrierSearch
					form={form}
					name="custName"
					code="custKey"
					returnValueFormat="carDriver"
					label="운송사"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				{/* 운전자이름 */}
				<InputText name="driver1" placeholder="입력해주세요" label={t('lbl.DRIVER1')} />
			</li>
			<li>
				{/* 삭제여부 */}
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
				/>
			</li>
			<li>
				{/* 계약유형 */}
				<SelectBox
					name="contractType"
					placeholder="선택해주세요"
					options={getCommonCodeList('CONTRACTTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CONTRACTTYPE')}
				/>
			</li>
			<li>
				{/* 유효기간 만료여부 */}
				<SelectBox
					name="isExpirationDateExpired"
					placeholder="선택해주세요"
					options={[
						...getCommonCodeList('YN', '--- 전체 ---'),
						{ cdNm: '유효기간 임박', comCd: 'I' }, // 원하는 옵션의 이름(cdNm)과 값(comCd)을 지정해 주세요
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'유효기간 만료여부'}
				/>
			</li>
			<li>
				<CmTcSearch
					form={form}
					name="tcName"
					code="tcDcCode"
					// returnValueFormat="carDriver"
					label="TC센터"
					selectionMode="singleRow"
				/>
			</li>
		</>
	);
};

export default MsCarDriverSearch;
