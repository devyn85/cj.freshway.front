/*
 ############################################################################
 # FiledataField	: StStockForCJLSearch.tsx
 # Description		: 저장품재고조회(CJ대한통운)
 # Author			: JeongHyeongCheol
 # Since			: 25.11.10
 ############################################################################
*/

// CSS

// Component

// Lib

// Utils

// API Call Function
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';

const StStockForCJLSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const form = props.form;
	// const { t } = useTranslation();

	// 상태
	// const statusOptions = [
	// 	{ cdNm: '전체', comCd: '' },
	// 	{ cdNm: '정상', comCd: '1' },
	// 	{ cdNm: '불량', comCd: '2' },
	// 	{ cdNm: '체류', comCd: '3' },
	// 	{ cdNm: '대기', comCd: '4' },
	// 	{ cdNm: '스탑', comCd: '5' },
	// ];

	// const statusOptions = [
	// 	{ cdNm: '전체', comCd: '' },
	// 	{ cdNm: '가용', comCd: 'NONE' },
	// 	{ cdNm: '제한', comCd: 'HOLD' },
	// 	{ cdNm: '불량', comCd: 'DAMAGE' },
	// ];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<CmOrganizeSearch
					form={form}
					label={'물류센터'}
					name="slName"
					code="sl"
					dccode="1000"
					dccodeDisabled={true}
					placeholder="선택해주세요"
					// mode="multiple"
					required
				/>
			</li>
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" />
				{/* selectionMode="multipleRows"  */}
			</li>

			{/* <li>
				<SelectBox
					name="status"
					label={'상태'}
					options={statusOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li> */}
		</>
	);
};

export default StStockForCJLSearch;
