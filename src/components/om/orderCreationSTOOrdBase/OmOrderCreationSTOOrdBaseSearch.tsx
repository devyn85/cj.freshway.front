/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOOrdBaseSearch.tsx
 # Description		: 주문 > 주문등록 > 당일광역보충발주
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/

import CmPickingSearch from '@/components/cm/popup/CmPickingSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Col } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface OmOrderCreationSTOOrdBaseSearchProps {
	form?: any;
	activeTabKey: string;
}

const OmOrderCreationSTOOrdBaseSearch = (props: OmOrderCreationSTOOrdBaseSearchProps) => {
	const { form, activeTabKey } = props;
	const { t } = useTranslation();
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const [dccode, setDccode] = useState(globalVariable.gDccode);
	const [isHovered, setIsHovered] = useState(false);
	const toastMessage =
		'선택시 공급센터의 재고량 내에서만 발주가 이루어집니다.(발주예정량 보다 총발주량이 적을 수 있습니다.)';

	const editDccodeList = getCommonCodeList('WMS_MNG_DC')
		.filter((item: any) => {
			return item.comCd !== '1000' && item.comCd !== '2170';
		})
		.map((item: any) => {
			return {
				...item,
				editNm: '[' + item.comCd + ']' + item.cdNm,
			};
		});

	const onChange = (e: any) => {
		setDccode(e);
	};

	const enableFields = ['deliverydate', 'dccode', 'skuName']; // 탭3일때 활성화할 조건 3개

	const isDisabled = (name: string) => activeTabKey === '3' && !enableFields.includes(name);

	useEffect(() => {
		if (activeTabKey === '3') {
			const allFields = Object.keys(form.getFieldsValue());
			const resetTargets = allFields.filter(field => !enableFields.includes(field));
			form.resetFields(resetTargets);
		}
	}, [activeTabKey]);

	/**
	 * 날짜 set
	 */
	useEffect(() => {
		// 이체일자 초기 세팅
		form.setFieldValue('deliverydate', dayjs());
	}, []);

	return (
		<>
			{/* 이체일자 */}
			<li>
				<DatePicker
					label={t('lbl.DOCDT_STO')}
					name="deliverydate"
					disabled={isDisabled('deliverydate')}
					allowClear
					showNow={false}
					format="YYYY-MM-DD"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					onChange={(date: any) => {
						date = commUtil.isEmpty(date) ? dayjs() : date;
						if (date) {
							const twoYearsLater = dayjs().add(2, 'year');
							if (date.isAfter(twoYearsLater, 'day')) {
								showMessage({
									content: '이체일자는 오늘로부터 2년 이내로 선택 가능합니다.',
									modalType: 'info',
								});
								setTimeout(() => {
									form.setFieldValue('deliverydate', twoYearsLater);
								}, 0);
							}
						}
					}}
				/>
			</li>
			{/* 공급받는센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					disabled={isDisabled('dccode')}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.TO_DCCODE')}
					onChange={onChange}
				/>
			</li>
			<StyledLi>
				{/* 재고량발주 */}
				<li onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
					<CheckBox name="stordyn" disabled={isDisabled('stordyn')}>
						재고량발주
					</CheckBox>

					{isHovered && (
						<div
							style={{
								position: 'absolute',
								top: '32px',
								left: '0%',
								transform: 'translateX(-0%)',
								padding: '5px 10px',
								backgroundColor: '#333',
								color: 'white',
								borderRadius: '4px',
								zIndex: 10,
								whiteSpace: 'nowrap',
							}}
						>
							{toastMessage}
						</div>
					)}
				</li>
				{/* 재고량산정조건 */}
				<li>
					<Col>
						<CheckBox name="stqtyyn" disabled={isDisabled('stqtyyn')}>
							재고량산정조건
						</CheckBox>
					</Col>
				</li>
			</StyledLi>
			{/* 입고량산정조건 */}
			<ConditionsQuantity>
				<CheckBox name="poyn" label="입고량산정조건" disabled={isDisabled('poyn')}>
					PO제외
				</CheckBox>
				<CheckBox name="stoyn" disabled={isDisabled('stoyn')}>
					STO제외
				</CheckBox>
				<CheckBox name="kxyn" disabled={isDisabled('kxyn')}>
					KX STO제외
				</CheckBox>
			</ConditionsQuantity>

			{/* 공급센터 */}
			<SupplyCenter>
				<SelectBox
					label={t('lbl.FROM_DCCODE')}
					placeholder="1순위"
					span={10}
					name="dcA"
					disabled={isDisabled('dcA')}
					options={editDccodeList}
					fieldNames={{ label: 'editNm', value: 'comCd' }}
					allowClear
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
				<SelectBox
					placeholder="2순위"
					name="dcB"
					span={7}
					disabled={isDisabled('dcB')}
					options={editDccodeList}
					fieldNames={{ label: 'editNm', value: 'comCd' }}
					allowClear
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
				<SelectBox
					placeholder="3순위"
					name="dcC"
					span={7}
					disabled={isDisabled('dcC')}
					options={editDccodeList}
					fieldNames={{ label: 'editNm', value: 'comCd' }}
					allowClear
				/>
				<SelectBox
					label={t('lbl.FROM_DCCODE')}
					placeholder="4순위"
					name="dcD"
					span={10}
					disabled={isDisabled('dcD')}
					options={editDccodeList}
					fieldNames={{ label: 'editNm', value: 'comCd' }}
					allowClear
				/>
				<SelectBox
					placeholder="5순위"
					name="dcE"
					span={7}
					disabled={isDisabled('dcE')}
					options={editDccodeList}
					fieldNames={{ label: 'editNm', value: 'comCd' }}
					allowClear
				/>
				<SelectBox
					placeholder="6순위"
					name="dcF"
					span={7}
					disabled={isDisabled('dcF')}
					options={editDccodeList}
					fieldNames={{ label: 'editNm', value: 'comCd' }}
					allowClear
				/>
			</SupplyCenter>
			{/* 마감유형 */}
			<li>
				<SelectBox
					label={t('lbl.CLOSETYPE')}
					name="custorderclosetype"
					disabled={isDisabled('custorderclosetype')}
					options={getCommonCodeList('DAILY_DEADLINE_STO')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKU')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')}
					name="storagetype"
					disabled={isDisabled('storagetype')}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<StyledLi>
				{/* 축육상품제외 */}
				<li>
					<CheckBox name="serialyn" disabled={isDisabled('serialyn')}>
						축육상품제외
					</CheckBox>
				</li>
				{/* 주문량강제발주 */}
				<li>
					<CheckBox name="onlyOrdqty" disabled={isDisabled('onlyOrdqty')}>
						주문량강제발주
					</CheckBox>
				</li>
			</StyledLi>
			{/* 제외피킹유형 */}
			<li>
				<CmPickingSearch
					label={'제외피킹유형'}
					form={form}
					name="setDistancetype"
					disabled={isDisabled('setDistancetype')}
					searchMode="search"
					dccode={dccode}
				/>
			</li>
			{/* 제외상품 */}
			<ExcludedProducts>
				<CmSkuSearch
					label={'제외상품'}
					form={form}
					name="skuExceptName"
					disabled={isDisabled('skuExceptName')}
					code="skuExcept"
					selectionMode="multipleRows"
				/>
				<CheckBox name="crossyn" disabled={isDisabled('crossyn')}>
					CROSS 재고포함
				</CheckBox>
			</ExcludedProducts>
			{/* 저장피킹유형 */}
			<li>
				<CmPickingSearch
					label={'저장피킹유형'}
					form={form}
					name="distancetype"
					searchMode="search"
					dccode={dccode}
					disabled={isDisabled('distancetype')}
				/>
			</li>
		</>
	);
};

const StyledLi = styled.li`
	display: flex;
	align-items: center;
	border: 0;
	justify-content: space-around;
	> li {
		border: 0;
	}
`;

const SupplyCenter = styled.li`
	display: flex;
	grid-column: span 4;
	> .ant-col-10:nth-of-type(4) {
		.ant-col.ant-form-item-label {
			display: none;
		}
	}
	.ant-col {
		flex: auto;
	}
`;

const ExcludedProducts = styled.li`
	display: flex;
	.ant-col {
		flex: auto;
		.ant-checkbox-label {
			white-space: nowrap;
		}
	}
`;

const ConditionsQuantity = styled.li`
	display: flex;
	grid-column: span 1;
	.ant-col {
		flex: auto;
		.ant-checkbox-label {
			white-space: nowrap;
		}
	}
`;

export default OmOrderCreationSTOOrdBaseSearch;
