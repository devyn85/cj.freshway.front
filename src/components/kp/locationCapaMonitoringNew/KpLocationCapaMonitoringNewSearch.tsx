// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Lib
import { Form } from 'antd';

//Store
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';

const KpLocationCapaMonitoringNewSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, activeKey } = props;
	// 다국어
	const { t } = useTranslation();

	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	// 물류센터 감시
	const fixdccode = Form.useWatch('fixdccode2', form);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 	센터에 해당되는 zone 정보 조회 (mode="multiple" 대응)
	 * 	@description 선택된 모든 물류센터의 존을 합쳐서 표시
	 */
	const loadZone = async () => {
		await fetchMsZone();

		// fixdccode가 없으면 빈 배열로 초기화

		if (commUtil.isEmpty(fixdccode)) {
			setZoneOptions([{ comCd: '', cdNm: t('lbl.ALL') }]);
			form.setFieldValue('zone', '');
			return;
		}

		// CmGMultiDccodeSelectBox의 mode="multiple"일 때
		// onChange에서 배열을 문자열로 변환함 (예: 'DC01,DC02')
		// 따라서 문자열을 배열로 변환 처리
		let dccodeArray: string[] = [];
		if (typeof fixdccode === 'string') {
			// 쉼표로 구분된 문자열을 배열로 변환 (예: 'DC01,DC02' → ['DC01', 'DC02'])
			dccodeArray = fixdccode.split(',').filter(Boolean);
		} else if (Array.isArray(fixdccode)) {
			// 이미 배열인 경우 그대로 사용
			dccodeArray = fixdccode;
		} else {
			// 단일 값인 경우 배열로 변환
			dccodeArray = [fixdccode];
		}

		// 선택된 모든 물류센터의 존 리스트를 수집
		const allZones: any[] = [];
		for (const dc of dccodeArray) {
			const zones = getMsZoneList(dc) || [];
			allZones.push(...zones);
		}

		// 중복 제거 (baseCode 기준으로 고유한 존만 추출)
		const uniqueZones = allZones.filter(
			(zone, index, self) => index === self.findIndex(z => z.baseCode === zone.baseCode),
		);

		// zones 객체의 필드 네이밍은 여러 형태(baseCode/basecode/BASECODE 등)일 수 있으므로 안전하게 추출
		const zoneMap = uniqueZones.map((item: any) => ({
			comCd: item.baseCode,
			cdNm: item.baseDescr,
		}));

		// SelectBox 옵션 설정 (맨 앞에 "전체" 항목 추가)
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
		if (activeKey === '2') {
			loadZone(); // 센터에 해당되는 zone 정보 조회
		}
	}, [activeKey]);

	// 물류센터 변경 시 zone 재조회
	useEffect(() => {
		if (activeKey === '2' && fixdccode) {
			loadZone();
		}
	}, [fixdccode]);

	return (
		<>
			{activeKey === '1' && ( // 탭1: 멀티 선택 - 필이 따로따로 해야 함
				<>
					<li>
						{/* 물류센터 */}
						<CmGMultiDccodeSelectBox
							name="fixdccode"
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.DCCODE')])}
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							mode="multiple"
							label={t('lbl.DCCODE')}
							onChange={async () => {
								loadZone(); // 센터에 해당되는 zone 정보 조회
							}}
						/>
					</li>
				</>
			)}

			{activeKey === '2' && ( // 탭2: 단일 선택
				<>
					<li>
						{/* 물류센터 */}
						<CmGMultiDccodeSelectBox
							name="fixdccode2" // 컨포넌트 간섭을 받아서 fixdccode2로 변경(tab1은 멀티가능)
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.DCCODE')])}
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							mode="single"
							label={t('lbl.DCCODE')}
							onChange={async () => {
								loadZone(); // 센터에 해당되는 zone 정보 조회
							}}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
				</>
			)}

			<li>
				{/* 저장조건(공통코드: STORAGETYPE) */}
				<SelectBox
					name="storagetype"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.STORAGETYPE')])}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			{activeKey === '2' && (
				<>
					<li>
						<SelectBox name="zone" label="존" options={zoneOptions} fieldNames={{ label: 'cdNm', value: 'comCd' }} />
					</li>
				</>
			)}
		</>
	);
};

export default KpLocationCapaMonitoringNewSearch;
