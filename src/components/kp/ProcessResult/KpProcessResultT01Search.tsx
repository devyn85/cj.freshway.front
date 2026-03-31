/*
 ############################################################################
 # FiledataField	: KpProcessResultSearch.tsx
 # Description		: 공정별생산성 Search
 # Author			: 박요셉
 # Since			: 25.12.26
 ############################################################################
*/

//Component
import { SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import dayjs from 'dayjs';

// API Call Function
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const KpProcessResultT01Search = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, searchBox } = props;
	const { t } = useTranslation();

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
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs().hour(13).minute(0).second(0);
		const initialEnd = dayjs().add(1, 'day').hour(8).minute(0).second(0);
		form.setFieldValue('modifyDt', [initialStart, initialEnd]);
	}, []);

	return (
		<SearchFormResponsive form={form} initialValues={searchBox}>
			<li>
				<Rangepicker
					name="modifyDt"
					allowClear
					showNow={false}
					label={'조회일시'}
					showTime={{ format: 'HH:mm' }}
					format={'YYYY-MM-DD HH:mm'} // 키보드로 12자리 입력할 수 있게 추가
					required
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					allLabel={t('lbl.ALL')}
				/>
			</li>
			<li>
				<SelectBox
					label="공정"
					name="processStep"
					placeholder="선택해주세요"
					options={getCommonCodeList('MOD_PRODUCTIVITY_KPI', '--- 전체---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</SearchFormResponsive>
	);
});

export default KpProcessResultT01Search;
