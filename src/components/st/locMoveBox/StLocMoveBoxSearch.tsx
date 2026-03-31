/*
 ############################################################################
 # FiledataField	: StLocMoveBoxSearch.tsx
 # Description		: 재고 > 재고현황 > 재고일괄이동(수원3층) Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const StLocMoveBoxSearch = forwardRef((props: any) => {
	const { t } = useTranslation(); // 다국어 처리
	const { search, form, activeKey } = props; // Antd Form

	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const [zoneOptions, setZoneOptions] = useState([]); // 피킹존 옵션 상태
	const formValuesRef = useRef({}); // 폼 값 저장용 ref

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();

		setZoneOptions([{ baseDescr: '전체', baseCode: '' }, ...getMsZoneList(form.getFieldValue('fixdccode'))]);

		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	};

	// * 초기 값 세팅
	useEffect(() => {
		const dt1 = dayjs();
		const dt2 = dayjs();

		form.setFieldValue('docdt', [dt1, dt2]);

		loadZone();

		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	// * 탭 변경 시 폼 값 유지 및 재렌더링 방지
	useEffect(() => {
		const saveFormValues = () => {
			try {
				const currentValues = form.getFieldsValue();
				formValuesRef.current = { ...formValuesRef.current, ...currentValues };
			} catch (e) {}
		};

		// 100ms마다 폼 값 저장
		const interval = setInterval(saveFormValues, 100);

		return () => clearInterval(interval);
	}, [form]);

	// * activeKey 변경 시 값 복원
	useEffect(() => {
		if (activeKey && Object.keys(formValuesRef.current).length > 0) {
			const restoreValues = () => {
				try {
					form.setFieldsValue(formValuesRef.current);
				} catch (e) {
					setTimeout(restoreValues, 50);
				}
			};

			restoreValues();
		}
	}, [activeKey, form]);

	return (
		<>
			{/* 이동대상 탭 화면만 노출 */}
			{activeKey === '1' && (
				<>
					{/* 물류센터 */}
					<li>
						<CmGMultiDccodeSelectBox
							name="fixdccode"
							placeholder="선택해주세요"
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							label={'물류센터'}
							mode={'single'}
							disabled
							required
							onChange={async () => {
								loadZone();
							}}
						/>
					</li>
					{/* 창고 */}
					<li>
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
					{/* 소비기한임박여부 */}
					<li>
						<SelectBox
							label={t('lbl.NEARDURATIONYN')}
							name="lottable01yn"
							options={getCommonCodeList('YN', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 피킹존 */}
					<li>
						<SelectBox
							name="zone"
							label={t('lbl.ZONE')}
							options={zoneOptions}
							fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
						/>
					</li>
					{/* 상품코드/명 */}
					<li>
						<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>
					{/* 재고위치 */}
					<li>
						<SelectBox
							label="재고위치"
							name="stocktype"
							options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 재고속성 */}
					<li>
						<SelectBox
							label="재고속성"
							name="stockgrade"
							options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 저장조건 */}
					<li>
						<SelectBox
							label="저장조건"
							name="storagetype"
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 로케이션 */}
					<li>
						<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
					</li>
					{/* B/L 번호 */}
					<li>
						<InputText
							label={t('lbl.BLNO')}
							name="blno"
							placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
							onPressEnter={search}
						/>
					</li>
					{/* 이력번호 */}
					<li style={{ gridColumn: ' / span 0' }}>
						<InputText label="이력번호" name="serialno" />
					</li>
					{/* 계약업체 */}
					<li>
						<CmCustSearch
							form={form}
							name="contractcompanyNm"
							code="contractcompany"
							label={t('lbl.CONTRACTCOMPANY')}
						/>
					</li>
				</>
			)}
		</>
	);
});

export default StLocMoveBoxSearch;
