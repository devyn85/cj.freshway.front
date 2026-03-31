/*
 ############################################################################
 # FiledataField	: WdDistributePlanNewSearch.tsx
 # Description		: 미출예정확인(New) 조회영역
 # Author			: YeoSeungCheol
 # Since			: 25.11.06
 ############################################################################
*/

// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { MultiInputText, RadioBox, Rangepicker, SelectBox } from '@/components/common/custom/form';

// Lib

//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
// API

const WdDistributePlanNewSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, activeKey } = props;
	// 다국어
	const { t } = useTranslation();

	// 선택한 수급담당 관리
	const [preSelectedBuyerkeyList, setPreSelectedBuyerkeyList] = useState<any[]>([]);

	// 상단 라디오 (radChk, 파라미터 값은 chkyn)
	const radChk = [
		{
			// 입고예정
			label: t('lbl.DPINPLAN'),
			value: '1',
		},
		{
			// 입고예정(출고전일)
			label: t('lbl.DPINPLAN_PREDAY'),
			value: '2',
		},
		{
			// 없음
			label: t('lbl.WD_NO'),
			value: '4',
		},
	];

	// 중단 라디오 (radStoChk, 파라미터 값은 stochkyn)
	const radStoChk = [
		{
			// 이동중재고(수급센터)
			label: t('lbl.MOVEQTY_KP_TO'),
			value: '1',
		},
		{
			// 이동중재고(출고센터)
			label: t('lbl.MOVEQTY_KP_FROM'),
			value: '2',
		},
		{
			// 없음
			label: t('lbl.WD_NO'),
			value: '4',
		},
	];

	// 하단 라디오 (radquick, 파라미터 값은 quick)
	const radquick = [
		{
			// 전체
			label: t('lbl.ALL'),
			value: '1',
		},
		{
			// 양산
			label: t('lbl.QTY2260'),
			value: '2',
		},
		{
			// 수도권
			label: t('lbl.QTY_SUDOGWON'),
			value: '3',
		},
		{
			// 장성
			label: t('lbl.QTY2230'),
			value: '4',
		},
		{
			// 제주
			label: t('lbl.WD_JEJU'),
			value: '5',
		},
		{
			// CJL
			label: t('lbl.WD_CJL'),
			value: '6',
		},
		{
			// 선마감
			label: t('lbl.PRE_CLOSE'),
			value: '7',
		},
		{
			// 본마감
			label: t('lbl.REAL_CLOSE'),
			value: '8',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param value
	 */
	/**
	 * 전체 선택 시, 모든 수급담당 코드를 선택 (다시 누르면 토글)
	 * @param {any[]} value 선택된 값 리스트
	 */
	const handleBuyerkeyMultiSelection = (value: any) => {
		const selected: any[] = Array.isArray(value) ? value : [];
		const ALL_TOKEN = 'ALL';
		const allBuyerList = (getCommonCodeList('BUYERKEY') ?? [])
			.map((v: any) => v.comCd)
			.filter((v: any) => v !== null && v !== undefined && v !== '');

		const wasAllSelected =
			preSelectedBuyerkeyList?.length > 0 && preSelectedBuyerkeyList.length === allBuyerList.length;

		const added = selected.filter(v => !preSelectedBuyerkeyList.includes(v));
		const removed = preSelectedBuyerkeyList.filter(v => !selected.includes(v));

		let next: any[] = [];

		if (added.includes(ALL_TOKEN) || added.includes(null)) {
			next = wasAllSelected ? [] : [...allBuyerList];
		} else if (removed.includes(ALL_TOKEN) || removed.includes(null)) {
			next = [];
		} else {
			next = selected.filter(v => v !== ALL_TOKEN && v !== null);
		}

		setPreSelectedBuyerkeyList(next);
		form.setFieldValue('buyerkey', next);
	};

	return (
		<>
			<li>
				{/* 출고일자 */}
				<Rangepicker name="slipdtWd" label={t('lbl.DOCDT_WD')} />
			</li>
			<li>
				{/* 주문번호 */}
				<MultiInputText name="docnoWd" label={t('lbl.DOCNO_WD')} placeholder="주문번호 입력" />
			</li>
			<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
				{/* 상품코드 */}
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
				{/* 상단 라디오 */}
				<RadioBox name="chkyn" options={radChk} />
			</li>
			<li>
				{/* 관리처코드 */}
				<CmCustSearch
					form={form}
					name="toCustkeyWdName"
					code="custkey"
					label={t('lbl.TO_CUSTKEY_WD')}
					returnValueFormat="code"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				{/* 조정사유 */}
				<SelectBox
					name="reason"
					options={getCommonCodeList('REASONCODE_WD', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.MEMO_RT')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.MEMO_RT')])}
				/>
			</li>
			<li>
				{/* 수급센터 */}
				<CmGMultiDccodeSelectBox
					name="poDccode"
					label={t('lbl.PODCCODE')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.FROM_DCCODE')])}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
				/>
			</li>
			<li>
				{/* 출고센터 */}
				<CmGMultiDccodeSelectBox
					name="soDccode"
					label={t('lbl.WD_CENTER')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.WD_CENTER')])}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
				/>
			</li>
			<li>
				{/* 상품유형-1 */}
				<SelectBox
					name="skutype"
					mode="multiple"
					placeholder="선택해주세요"
					options={getCommonCodeList('SKUTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.SKUTYPE')}
				/>
			</li>
			<li>
				{/* 외식전용구분 */}
				<SelectBox
					name="reference15"
					placholder="선택해주세요"
					options={getCommonCodeList('YN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.REFERENCE15')}
				/>
			</li>
			<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
				{/* 수급담당 */}
				<SelectBox
					// multiBuyerkey? pomdcode?
					name="buyerkey"
					placeholder="선택해주세요"
					mode="multiple"
					options={getCommonCodeList('BUYERKEY', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.POMDCODE')}
					onChange={handleBuyerkeyMultiSelection}
				/>
				<RadioBox name="stochkyn" options={radStoChk} />
			</li>
			<li style={{ gridColumn: 'span 4' }}>
				{/* 
					- quick이 2,3,4,5(양산, 수도권, 장성, 제주)
				*/}
				<RadioBox
					name="quick"
					label={'센터설정'}
					options={radquick}
					onChange={(e: any) => {
						const q = e?.target?.value ?? e;
						const toSet: any = {};
						switch (q) {
							case '1':
								toSet.poDccode = ['2600', '2650', '2660', '2620', '2630', '2690'];
								toSet.soDccode = ['2600', '2650', '2660', '2620', '2630', '2260', '2230', '2041'];
								// 2026-03-10 KSH CJL외: tab1에서만 SKUTYPE 강제 초기화처리 FWNEXTWMS-7980
								if (activeKey === '1') {
									toSet.skutype = [];
								}
								break;
							case '2':
								toSet.poDccode = '2260';
								toSet.soDccode = ['2260', '2250'];
								// 2026-03-10 KSH CJL외: tab1에서만 SKUTYPE 강제 초기화처리 FWNEXTWMS-7980
								if (activeKey === '1') {
									toSet.skutype = [];
								}
								break;
							case '3':
								toSet.poDccode = ['2600', '2650', '2660', '2620', '2630', '2690'];
								toSet.soDccode = ['2600', '2650', '2660', '2620', '2630', '2230'];
								// 2026-03-10 KSH CJL외: tab1에서만 SKUTYPE 강제 초기화처리 FWNEXTWMS-7980
								if (activeKey === '1') {
									toSet.skutype = [];
								}
								break;
							case '4':
								toSet.poDccode = '2230';
								toSet.soDccode = ['2230', '2270'];
								// 2026-03-10 KSH CJL외: tab1에서만 SKUTYPE 강제 초기화처리 FWNEXTWMS-7980
								if (activeKey === '1') {
									toSet.skutype = [];
								}
								break;
							case '5':
								toSet.poDccode = '2041';
								toSet.soDccode = '2041';
								// 2026-03-10 KSH CJL외: tab1에서만 SKUTYPE 강제 초기화처리 FWNEXTWMS-7980
								if (activeKey === '1') {
									toSet.skutype = [];
								}
								break;
							case '6':
								toSet.poDccode = ['2620', '2690', '1000'];
								toSet.soDccode = ['2600', '2650', '2660', '2620', '2630', '2230', '1000'];
								// CJL: tab1에서만 SKUTYPE 강제
								if (activeKey === '1') {
									toSet.skutype = ['10', '40'];
								}
								break;
							case '7': {
								// 선마감: 양산(2) + 수도권(3)
								const po2 = ['2260'];
								const so2 = ['2260', '2250'];
								const po3 = ['2600', '2650', '2660', '2620', '2630', '2690'];
								const so3 = ['2600', '2650', '2660', '2620', '2630', '2230'];
								toSet.poDccode = Array.from(new Set([...po2, ...po3]));
								toSet.soDccode = Array.from(new Set([...so2, ...so3]));
								// 2026-03-10 KSH CJL외: tab1에서만 SKUTYPE 강제 초기화처리 FWNEXTWMS-7980
								if (activeKey === '1') {
									toSet.skutype = [];
								}
								break;
							}
							case '8': {
								// 본마감: 전체(1)+양산(2)+수도권(3)+장성(4)+제주(5)+CJL(6)
								const po1 = ['2600', '2650', '2660', '2620', '2630', '2690'];
								const so1 = ['2600', '2650', '2660', '2620', '2630', '2260', '2230', '2041'];
								const po4 = ['2230'];
								const so4 = ['2230', '2270'];
								const po5 = ['2041'];
								const so5 = ['2041'];
								const po6 = ['2620', '2690', '1000'];
								const so6 = ['2600', '2650', '2660', '2620', '2630', '2230', '1000'];
								toSet.poDccode = Array.from(new Set([...po1, ...po4, ...po5, ...po6, '2260']));
								toSet.soDccode = Array.from(new Set([...so1, ...so4, ...so5, ...so6, '2250']));
								// 2026-03-10 KSH CJL외: tab1에서만 SKUTYPE 강제 초기화처리 FWNEXTWMS-7980
								if (activeKey === '1') {
									toSet.skutype = [];
								}
								break;
							}
							default:
								break;
						}
						form.setFieldsValue(toSet);
					}}
				/>
			</li>
		</>
	);
};

export default WdDistributePlanNewSearch;
