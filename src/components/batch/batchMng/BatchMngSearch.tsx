/*
 ############################################################################
 # FiledataField	: BatchMngSearch.tsx
 # Description		: 배치 > 배치관리 > 배치 등록/수정 > 검색
 # Author			: yewon.kim
 # Since			: 25.07.04
 ############################################################################
*/
// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import {DateRange, InputText, SelectBox} from '@/components/common/custom/form';
import MsZoneListSelectBox from '@/components/ms/zone/MsZoneListSelectBox';

// CSS

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from "dayjs";

// lib

const BatchMngSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();		// 다국어

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<li>
				{/* JOB 이름/설명 */}
				<InputText label={t('lbl.JOB_NAME_DESC')} name="jobNameDesc" placeholder={t('msg.MSG_COM_VAL_054', ['JOB 이름 또는 설명'])} />
			</li>
			<li>
				{/* 작업 구분 */}
				<SelectBox
					label={'작업구분'}
					name="jobGubun"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('JOB_GUBUN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* 작업주기 */}
				<SelectBox
					label={t('lbl.JOB_INTERVAL')}
					name="jobInterval"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('JOB_INTERVAL_CD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* 사용여부 */}
				<SelectBox
					name="useYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.USE_YN')}
				/>
			</li>
		</>
	);
};

export default BatchMngSearch;
