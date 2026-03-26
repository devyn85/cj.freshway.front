/*
 ############################################################################
 # FiledataField	: MsLocationPrintSearch.tsx
 # Description		: 기기준정보 > 물류센터 정보 > 로케이션 라벨 출력 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.24
 ############################################################################
*/

// Components
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Store
import { SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
// Libs

// Utils

const MsLocationPrintSearch = ({ form }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const dccode = Form.useWatch('dccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 	센터에 해당되는 zone 정보 조회
	 */
	const loadZone = async () => {
		await fetchMsZone();

		// 현재 선택된 물류센터(dccode)에 해당하는 zone 리스트를 안전하게 읽기
		const zones = getMsZoneList(form.getFieldValue('dccode')) || [];

		// zones 객체의 필드 네이밍은 여러 형태(baseCode/basecode/BASECODE 등)일 수 있으므로 안전하게 추출
		const zoneMap = zones.map((item: any) => ({
			comCd: item.baseCode,
			cdNm: item.baseDescr,
		}));

		// SelectBox에서 사용할 comCd/cdNm 형태로 설정 (맨 앞에 전체 항목 추가)
		setZoneOptions([{ comCd: '', cdNm: t('lbl.ALL') }, ...zoneMap]);

		// 존을 "전체"로 초기화
		form.setFieldValue('zone', '');
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		loadZone(); // 센터에 해당되는 zone 정보 조회

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('dccode', gDccode);
		}
	}, []);
	return (
		<>
			<li>
				{/* 물류센터 */}
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					onChange={async () => {
						loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 피킹존 */}
				<SelectBox
					label={t('lbl.ZONE')}
					name="zone"
					options={zoneOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					rules={[{ required: false, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 창고층 */}
				<SelectBox
					label={t('lbl.WHAREAFLOOR')}
					name="whareafloor"
					options={getCommonCodeList('WHAREAFLOOR', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 로케이션 유형 */}
			<li>
				<SelectBox
					label={t('lbl.LOC_TYPE')}
					name="loctype"
					options={getCommonCodeList('LOCTYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 로케이션 종류 */}
			<li>
				<SelectBox
					label={t('lbl.LOC_CATEGORY')}
					name="loccategory"
					options={getCommonCodeList('LOCCATEGORY', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 로케이션 레벨 */}
			<li>
				<SelectBox
					label={t('lbl.LOC_LEVEL')}
					name="loclevel"
					options={getCommonCodeList('LOCLEVEL', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 로케이션 구분 */}
			<li>
				<SelectBox
					label={t('lbl.LOC_FLAG')}
					name="locflag"
					options={getCommonCodeList('LOCFLAG', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default MsLocationPrintSearch;
