/*
 ############################################################################
 # FiledataField	: TmManageEntitySearch.tsx
 # Description		: ​​정산항목관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.04
 ############################################################################
*/
// lib
// component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// store

// api

// util

// hook

// type

// asset

const TmManageEntitySearch = forwardRef((props: any, ref) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const form = props.form;
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					required
				/>
			</li>
			<li>
				{/* 운송사조회 팝업 */}
				<CmCarrierSearch
					form={form}
					selectionMode="multipleRows"
					name="courierName"
					code="courier"
					returnValueFormat="name"
					carrierType="LOCAL"
				/>
			</li>
		</>
	);
});
export default TmManageEntitySearch;
