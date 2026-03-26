// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsLocationSearchProps {
	form: any;
	dccode: string[];
}

const MsLocationSearch = (props: MsLocationSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { dccode, form } = props;

	// 다국어
	const { t } = useTranslation();

	return (
		<>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={t('lbl.DCCODE')}
					required
				/>
			</li>
			{/* 피킹존 */}
			{/* <MsZoneListSelectBox dccode={dccode} form={form} /> */}
			<li>
				{/* 로케이션 */}
				<InputText label={t('lbl.LBL_LOC')} name="loc" placeholder={t('msg.MSG_COM_VAL_054', ['로케이션'])} />
			</li>
			<li>
				{/* 창고층 */}
				<SelectBox
					name="whAreaFloor"
					placeholder="선택해주세요"
					options={getCommonCodeList('WHAREAFLOOR', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.WHAREAFLOOR')}
				></SelectBox>
			</li>
			<li>
				{/* 로케이션 유형 */}
				<SelectBox
					name="locType"
					placeholder="선택해주세요"
					options={getCommonCodeList('LOCTYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.LOCTYPE')}
				/>
			</li>
			<li>
				{/* 로케이션 종류 */}
				<SelectBox
					name="locCategory"
					placeholder="선택해주세요"
					options={getCommonCodeList('LOCCATEGORY', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.LOCCATEGORY')}
				/>
			</li>
			{/* 로케이션 레벨 */}
			{/* <li>
				<SelectBox
					name="locLevel"
					placeholder="선택해주세요"
					options={getCommonCodeList('LOCLEVEL', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.LOCLEVEL')}
				/>
			</li> */}
			{/* 로케이션 구분 */}
			{/* <li>
				<SelectBox
					name="locFlag"
					placeholder="선택해주세요"
					options={getCommonCodeList('LOCFLAG', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.LOCFLAG')}
				/>
			</li> */}
			<li>
				{/* 삭제여부  */}
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
				/>
			</li>
		</>
	);
};

export default MsLocationSearch;
