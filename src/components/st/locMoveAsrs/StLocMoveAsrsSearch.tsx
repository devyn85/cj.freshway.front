/*
 ############################################################################
 # FiledataField	: StLocMoveAsrsSearch.tsx
 # Description		: 저장품 재고 적치 지시(자동창고) Search
 # Author			: 공두경
 # Since			: 25.09.16
 ############################################################################
*/

//Component
import { useAppSelector } from '@/store/core/coreHook';
import { useSelector } from 'react-redux';
//Lib
import { Form } from 'antd';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const StLocMoveAsrsSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const { t } = useTranslation();

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dccode = Form.useWatch('dccode', props.form);
	const user = useAppSelector(state => state.user.userInfo);

	const [zoneOptions, setZoneOptions] = useState([]);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	센터에 해당되는 zone 정보 조회
	 */
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([{ baseDescr: '전체', baseCode: '' }, ...getMsZoneList(props.form.getFieldValue('fixdccode'))]);
		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	};

	useEffect(() => {
		loadZone(); // 센터에 해당되는 zone 정보 조회

		if (gDccode) {
			props.form.setFieldValue('dccode', gDccode);
		}

		// 권한에 따라 DC 선택박스 활성화/비활성화
		if (
			user.roles?.includes('00') ||
			user.roles?.includes('20') ||
			user.roles?.includes('000') ||
			user.roles?.includes('200')
		) {
			props.form.setFieldValue('fixdccodeDisabled', false); // 사용가능
		} else {
			props.form.setFieldValue('fixdccodeDisabled', true);
		}

		props.form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	}, []);
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	if (activeKey === '1') {
		// activeKey가 '1'일 때는 일부만 표시
		return (
			<>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={true}
						onChange={async () => {
							loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
				<li>
					{/* 창고 */}
					<CmOrganizeSearch
						form={form}
						selectionMode="multipleRows"
						name="organizenm"
						code="organize"
						returnValueFormat="name"
						dccode={dccode}
						label="창고"
					/>
				</li>
				<li>
					<CmSkuSearch form={form} label={t('lbl.SKU')} name="skuNm" code="sku" />
				</li>
				<li>
					<SelectBox
						label={t('lbl.STORAGETYPE')} //저장조건
						name="storagetype"
						placeholder="선택해주세요"
						options={getCommonCodeList('STORAGETYPE', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.LOTTABLE01YN')} //유통기한여부
						name="lottable01yn"
						placeholder="선택해주세요"
						options={getCommonCodeList('YN', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.STOCKTYPE')} //재고위치
						name="stocktype"
						options={getCommonCodeList('STOCKTYPE', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.STOCKGRADE')} //재고속성
						name="stockGrade"
						options={getCommonCodeList('STOCKGRADE', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
					/>
				</li>
				<li>
					<SelectBox
						label={'ZONE'}
						name="zone"
						span={24}
						placeholder="선택해주세요"
						options={zoneOptions}
						fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						rules={[{ required: false, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.BLNO')} //B/L 번호
						name="blno"
						placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.SERIALNO')} //이력번호
						name="serialno"
						placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmCustSearch
						form={form}
						name="contractcompanyNm"
						code="contractcompany"
						label={t('lbl.CONTRACTCOMPANY')} /*계약업체*/
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.FROMLOC')} //FROM로케이션
						name="fromloc"
						placeholder={t('msg.placeholder1', [t('lbl.FROMLOC')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.TOLOC')} //TO로케이션
						name="toloc"
						placeholder={t('msg.placeholder1', [t('lbl.TOLOC')])}
						onPressEnter={search}
					/>
				</li>
			</>
		);
	} else {
		// activeKey가 '1'일 때는 일부만 표시
		return <></>;
	}
});

export default StLocMoveAsrsSearch;
