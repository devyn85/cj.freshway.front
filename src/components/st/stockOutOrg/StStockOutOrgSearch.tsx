/*
 ############################################################################
 # FiledataField	: StStockOutOrgSearch.tsx
 # Description		: 외부비축재고조회
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

// CSS

// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';

// Lib
import { Button, Form } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

// Utils
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API Call Function
import { apiGetgetSkuSpecForMsExDcRate } from '@/api/ms/apiMsExDcRate';
import { apiGetExDCStatusDtl } from '@/api/ms/apiMsExDCStatus';
const StStockOutOrgSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const form = props.form;
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixDcCode', form);
	const [skuL, setSkuL] = useState([]);
	const [skuM, setSkuM] = useState([]);
	const [skuS, setSkuS] = useState([]);
	const [skuD, setSkuD] = useState([]);

	const [skuLVal, setSkuLVal] = useState('');
	const [skuMVal, setSkuMVal] = useState('');
	const [skuSVal, setSkuSVal] = useState('');
	const [skuDVal, setSkuDVal] = useState('');

	// 옵션 필터링용
	const [filteredSkuM, setFilteredSkuM] = useState([]);
	const [filteredSkuS, setFilteredSkuS] = useState([]);
	const [filteredSkuD, setFilteredSkuD] = useState([]);

	const [cbxBasic2State, setCbxBasic2State] = useState('0');
	const user = useAppSelector(state => state.user.userInfo);
	const organize = Form.useWatch('organize', props.form);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 상품 코드 대 중 소 세 세팅
	 * @param {any} p_storerkey
	 * @param {any} p_speccategory
	 * @param {any} p_specclass
	 * @param {any} r_dataset
	 */
	const searchSku = (p_storerkey: any, p_speccategory: any, p_specclass: any, r_dataset: any) => {
		const params = {
			storerkey: p_storerkey,
			specCategory: p_speccategory,
			specClass: p_specclass,
		};
		apiGetgetSkuSpecForMsExDcRate(params).then(res => {
			const firstRow = {
				specDescr: '선택',
				specCode: '',
			};
			res.data.unshift(firstRow);

			r_dataset(res.data);
		});
	};

	/**
	 * 창고 URL 팝업
	 */
	const openUrl = () => {
		if (organize == null || organize == '') {
			showAlert('', '선택된 창고가 없습니다.');
			return;
		}
		const searchParam = {
			plant: dccode,
			organize: organize,
			storageloc: organize.replace(/^[^-]+-/, ''),
		};
		// const width = 1200;
		// const height = 900;
		// const left = window.screenX + (window.outerWidth - width) / 2;
		// const top = window.screenY + (window.outerHeight - height) / 2;
		// const windowFeatures = `width=${width},height=${height},left=${left},top=${top},popup=yes`;

		apiGetExDCStatusDtl(searchParam).then(res => {
			if (!res.data.siteaddr) {
				showAlert('', '사이트 정보가 존재 하지 않습니다');
			} else {
				const fileLink = document.createElement('a');
				fileLink.href = res.data.siteaddr;

				fileLink.setAttribute('target', '_blank');
				document.body.appendChild(fileLink);
				fileLink.click();
				fileLink.remove();
			}
		});
	};
	/**
	 * 상품코드 변경시  콤보박스 세팅
	 * @param value
	 */
	const onChangeSkuL = (value: string) => {
		setFilteredSkuS(skuS);
		setFilteredSkuD(skuD);
		setFilteredSkuM(skuM);
		if (value == '') {
		} else {
			setFilteredSkuM([skuM[0], ...skuM.slice(1).filter(item => item.specCode.startsWith(value))]);
		}
		form.setFieldValue('SKU_L', value);
		form.setFieldValue('SKU_M', '');
		form.setFieldValue('SKU_S', '');
		form.setFieldValue('SKU_D', '');

		// 중분류 옵션 필터: 대분류코드로 시작하는 것만
	};

	// 중분류 변경 시: 대분류, 소분류 옵션 필터링
	const onChangeSkuM = (value: string) => {
		setFilteredSkuS(skuS);
		setFilteredSkuD(skuD);
		if (value == '') {
			form.setFieldValue('SKU_L', '');

			setFilteredSkuM(skuM);
		} else {
			form.setFieldValue('SKU_L', value.slice(0, 2));
			form.setFieldValue('SKU_M', value);
			setFilteredSkuS([skuS[0], ...skuS.slice(1).filter(item => item.specCode.startsWith(value))]);
		}
		form.setFieldValue('SKU_S', '');
		form.setFieldValue('SKU_D', '');

		// 소분류 옵션 필터: 중분류코드로 시작하는 것만
	};

	// 소분류 변경 시: 대/중분류, 세분류 옵션 필터링
	const onChangeSkuS = (value: string) => {
		setFilteredSkuM(skuM);
		setFilteredSkuD(skuD);
		if (value == '') {
			form.setFieldValue('SKU_L', '');
			form.setFieldValue('SKU_M', '');
			setFilteredSkuS(skuS);
		} else {
			form.setFieldValue('SKU_L', value.slice(0, 2));
			form.setFieldValue('SKU_M', value.slice(0, 4));
			form.setFieldValue('SKU_S', value);
			setFilteredSkuD([skuD[0], ...skuD.slice(1).filter(item => item.specCode.startsWith(value))]);
		}
		form.setFieldValue('SKU_D', '');
	};

	// 세분류 변경 시: 상위 분류 값 자동 세팅
	const onChangeSkuD = (value: string) => {
		setFilteredSkuM(skuM);
		setFilteredSkuS(skuS);
		if (value == '') {
			form.setFieldValue('SKU_L', '');
			form.setFieldValue('SKU_M', '');
			form.setFieldValue('SKU_S', '');
			form.setFieldValue('SKU_D', '');
			setFilteredSkuD(skuD);
		} else {
			form.setFieldValue('SKU_L', value.slice(0, 2));
			form.setFieldValue('SKU_M', value.slice(0, 4));
			form.setFieldValue('SKU_S', value.slice(0, 6));
			form.setFieldValue('SKU_D', value);
		}
	};

	//
	const onChangeCbxBasic2 = (e: CheckboxChangeEvent) => {
		setCbxBasic2State(e.target.checked ? e.target.value.trueValue : e.target.value.falseValue);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const p_storerkey = user.defStorerkey;

		searchSku(p_storerkey, 'SKUGROUP', 'MC3', setSkuL);
		searchSku(p_storerkey, 'SKUGROUP', 'MC2', setSkuM);
		searchSku(p_storerkey, 'SKUGROUP', 'MC1', setSkuS);
		searchSku(p_storerkey, 'SKUGROUP', 'MC', setSkuD);
		form.setFieldValue('fixDcCode', '2170');
	}, []);
	useEffect(() => {
		setFilteredSkuM(skuM);
	}, [skuM]);
	useEffect(() => {
		setFilteredSkuS(skuS);
	}, [skuS]);
	useEffect(() => {
		setFilteredSkuD(skuD);
	}, [skuD]);

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					data-type={''}
					name={'fixDcCode'}
					label={t('lbl.DCCODE')}
					required // 원래 유저 권한을 통해서 true false를 하지만 없으므로
					disabled={
						user.roles?.includes('05') ||
						user.roles?.includes('20') ||
						user.roles?.includes('010') ||
						user.roles?.includes('200')
					}
				/>
			</li>
			<li className="flex-wrap">
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="organizeNm"
					code="organize"
					returnValueFormat="name"
					dccode={dccode}
					label={t('lbl.ORGANIZE')}
				/>
				<span>
					<Button onClick={openUrl} size="small">
						{t('lbl.LINK')}
					</Button>
				</span>
			</li>
			<li>
				<span>
					<CheckBox label={t('lbl.SKUPART')} name="stockStatus20" trueValue={'1'} falseValue={'0'}>
						{t('lbl.SKU2')}
					</CheckBox>
					<CheckBox name="stockStatus30" trueValue={'1'} falseValue={'0'}>
						{t('lbl.ENTRUST')}
					</CheckBox>
					<CheckBox name="stockStatus40" trueValue={'1'} falseValue={'0'}>
						{t('lbl.NOT_DELIVERED')}
					</CheckBox>
				</span>
			</li>
			<li>
				<SelectBox
					name="stockGrade"
					label={t('lbl.STOCKGRADE')} //재고속성
					options={getCommonCodeList('STOCKGRADE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<CmSkuSearch form={form} name="skuNm" code="sku" selectionMode="multipleRows" />
			</li>
			<li>
				<MultiInputText
					label={t('lbl.CONVSERIALNO')} // B/L번호
					name="blNo"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.SERIALNO')} //이력번호
					name="serialNo"
				/>
			</li>
			<li>
				<CmCustSearch
					form={form}
					name="contractcompanyNm"
					code="contractCompany"
					label={t('lbl.CONTRACTCOMPANY')} /*계약업체*/
				/>
			</li>
			<li>
				<SelectBox
					name="storageType"
					label={t('lbl.STORAGETYPE')}
					options={getCommonCodeList('STORAGETYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.DURATION_RATE')} //소비기한잔여(%)
					name="duratuinTerm"
				/>
			</li>
			<li>
				<CheckBox
					label={t('lbl.ZERO_QTY')} //0수량
					name="chkQty"
					trueValue={'1'}
					falseValue={'0'}
					onChange={onChangeCbxBasic2}
				/>
			</li>
			<li>
				<CheckBox
					label={t('lbl.ZERO_BOX')} //0박스
					name="chkQty1"
					trueValue={'1'}
					falseValue={'0'}
					onChange={onChangeCbxBasic2}
				/>
			</li>
			<li>
				<SelectBox
					name="SKU_L"
					label={t('lbl.SKU_CLASS_BIG')}
					options={skuL}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
					value={skuLVal}
					onChange={onChangeSkuL}
				/>
			</li>
			<li>
				<SelectBox
					name="SKU_M"
					label={t('lbl.SKU_CLASS_MIDDLE')}
					options={filteredSkuM}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
					value={skuMVal}
					onChange={onChangeSkuM}
				/>
			</li>
			<li>
				<SelectBox
					name="SKU_S"
					label={t('lbl.SKU_CLASS_SMALL')}
					options={filteredSkuS}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
					value={skuSVal}
					onChange={onChangeSkuS}
				/>
			</li>
			<li>
				<SelectBox
					name="SKU_D"
					label={t('lbl.SKU_CLASS_DETAIL')}
					options={filteredSkuD}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
					value={skuDVal}
					onChange={onChangeSkuD}
				/>
			</li>
			<li className="flex-wrap">
				<span>
					<CheckBox label={t('lbl.STOCK_AMOUNT')} name="stockAmount" trueValue={'1'} falseValue={'0'}>
						{t('lbl.AMOUNT_DISP')}
					</CheckBox>
				</span>
			</li>
		</>
	);
};

export default StStockOutOrgSearch;
