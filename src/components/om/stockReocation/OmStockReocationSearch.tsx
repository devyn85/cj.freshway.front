/*
 ############################################################################
 # FiledataField	: OmStockReocationSearch.tsx
 # Description		: 주문 > 주문등록 > 재고재배치조회
 # Author			: JeongHyeongCheol
 # Since			: 25.12.22
 ############################################################################
*/
// component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import {
	Button,
	CheckboxGroup,
	Datepicker,
	InputNumber,
	InputRange,
	RadioBox,
	SelectBox,
} from '@/components/common/custom/form';
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// lib
import { Form } from 'antd';

interface OmStockReocationSearchProps {
	form?: any;
	groupRef?: any;
	setRequest?: any;
}

const OmStockReocationSearch = (props: OmStockReocationSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { form, groupRef, setRequest } = props;
	const { t } = useTranslation();

	const dccodeList = getUserDccodeList();

	const cbxGrpopts1 = [
		{ label: '1원화', value: '1원화' },
		{
			label: '2원화',
			value: '2원화',
		},
		{
			label: '3원화',
			value: '3원화',
		},
		{
			label: '4원화',
			value: '4원화',
		},
		{
			label: '5원화',
			value: '5원화',
		},
		{
			label: '(양산제외)',
			value: 'yangsan',
		},
	];

	const cbxGrpopts2 = [
		{ label: '1원화', value: '1원화' },
		{
			label: '2원화',
			value: '2원화',
		},
		{
			label: '3원화',
			value: '3원화',
		},
		{
			label: '4원화',
			value: '4원화',
		},
		{
			label: '5원화',
			value: '5원화',
		},
		{
			label: '(양산제외)',
			value: 'yangsan',
		},
	];

	const radioOptions1 = [{ label: '제한없음', value: 'NONE' }];
	const radioOptions2 = [{ label: '제한없음', value: 'NONE' }];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 *
	 */

	const setRequestFn = () => {
		setRequest(true);
	};

	const onValuesChange = (changedValues: any, values: any) => {
		// 1. 체크할 필드 키 추출 (flowLow 또는 flowHigh)
		const fieldKey = Object.keys(changedValues)[0];

		if (fieldKey === 'flowLow' || fieldKey === 'flowHigh') {
			const rawValue = changedValues[fieldKey];

			// 1. null이나 undefined 체크
			if (rawValue === null || rawValue === undefined) return;

			// 2. 숫자가 아닌 모든 문자(한글, 영어, 특수문자 등) 제거
			// replace(/[^\d]/g, '')와 동일하지만 더 명시적입니다.
			const numericString = String(rawValue).replace(/\D/g, '');

			// 3. 범위 제한 (0 ~ 10000)
			let finalValue: number | undefined;

			if (numericString === '') {
				finalValue = undefined; // 백스페이스로 다 지웠을 때
			} else {
				const num = Number(numericString);
				finalValue = num > 10000 ? 10000 : num;
			}

			// 4. UI 강제 업데이트
			// 사용자가 한글을 입력하더라도 이 함수가 실행되며 숫자가 아닌 문자가 제거된 값으로 덮어씌워집니다.
			form.setFieldsValue({ [fieldKey]: finalValue });
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 날짜 set
	 */
	useEffect(() => {
		// 이체일자 초기 세팅
		// form.setFieldValue('deliverydate', dayjs());
		form.setFieldValue('currentLimit', 'NONE');
		form.setFieldValue('targetLimit', 'NONE');
	}, []);

	return (
		<Form form={form} onValuesChange={onValuesChange}>
			<AGrid className="h100">
				<h3>1단계 재고기준일 설정</h3>
				<UiDetailViewGroup ref={groupRef}>
					<li style={{ gridColumn: 'span 3' }} className="flex-wrap">
						<Datepicker label="재고기준일자" span={6} name="dateStr" format="YYYY-MM" picker="month" required />
						<span className="ml10">데이터 전처리를 위한 작업입니다. 가능한 재고배치안을 생성요청 합니다.</span>
					</li>
				</UiDetailViewGroup>
				<h3>2단계 배치안 설정</h3>
				<UiDetailViewGroup className="grid-column-4" ref={groupRef}>
					<li>
						<CmSkuSearch form={form} name="skuName" code="selectItems" selectionMode="multipleRows" />
					</li>
					<li>
						<InputRange
							label="이체량(Kg)"
							fromName="flowLow"
							toName="flowHigh"
							onKeyPress={(e: any) => {
								// 숫자가 아닌 키가 눌리면 입력을 무효화
								if (!/\d/.test(e.key)) {
									e.preventDefault();
								}
							}}
							// 모바일 환경 및 붙여넣기 대응
							onChange={(e: any) => {
								const { value } = e.target;
								e.target.value = value.replace(/\D/g, '');
							}}
							required
						/>
					</li>
					<li>
						<InputNumber
							label="수송비가중치"
							placeholder="숫자를 입력해주세요."
							name="transportWeight"
							min={0}
							max={1.0}
							step={0.1}
							showCount
							required
						/>
					</li>
					<li>
						<InputNumber
							label="PLT 확보"
							placeholder="숫자를 입력해주세요."
							name="inventoryWeight"
							min={0}
							max={1.0}
							step={0.1}
							showCount
							required
						/>
					</li>
					<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
						<RadioBox
							label="현재배치현황"
							name="currentLimit"
							options={radioOptions1}
							span={7}
							onChange={() => {
								form.setFieldValue('currentPosition', []);
							}}
						/>
						<div>
							<CheckboxGroup
								options={cbxGrpopts1}
								name="currentPosition"
								onChange={(e: any) => {
									const values = e?.target ? e.target.value : e;
									if (values && values.length > 0) {
										// Form 값 초기화
										form.setFieldValue('currentLimit', '');
									}
								}}
							/>
						</div>
					</li>
					<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
						<RadioBox
							label="배치요건설정"
							name="targetLimit"
							options={radioOptions2}
							span={7}
							onChange={() => {
								form.setFieldValue('targetPosition', []);
							}}
						/>
						<div>
							<CheckboxGroup
								options={cbxGrpopts2}
								name="targetPosition"
								onChange={(e: any) => {
									const values = e?.target ? e.target.value : e;
									if (values && values.length > 0) {
										// Form 값 초기화
										form.setFieldValue('targetLimit', '');
									}
								}}
							/>
						</div>
					</li>
					<li className="flex-wrap" style={{ gridColumn: 'span 3' }}>
						<SelectBox
							label="목표 캐파 설정"
							name="dccode"
							options={dccodeList}
							fieldNames={{ label: 'dcnameOnlyNm', value: 'dcnameOnlyNm' }}
							span={8}
						/>
						<SelectBox
							name="storagetype"
							options={getCommonCodeList('STORAGETYPE')}
							fieldNames={{ label: 'cdNm', value: 'cdNm' }}
							span={8}
						/>
						<span>
							<InputNumber min={0} max={99999} step={100} showCount name="capacity" />
						</span>
					</li>
				</UiDetailViewGroup>
				<ul className="ntc-list">
					<li>
						상품 필터조건 : <strong>재배치 대상 상품코드, 이체량, 현재 배치현황</strong>을 통해 상품을 필터해서 필터
						되는 상품은 고정분이되고, 선택 되는 상품이 재배치 대상
					</li>
					<li>최적화 수행 조건</li>
					<li className="sub">
						<strong>배치요건 설정</strong>이 "제한없음"의 경우만 최적화를 수행, 수송비 확보, PLT확보 가중치는 이 경우에
						활용
					</li>
					<li className="sub">
						<strong>배치요건 설정</strong>이 "제한없음"이 아닌 경우는 배치요건 설정에서 설정된 것으로 강제 선택
					</li>
					<li>
						캐파 조건: <strong>목표 캐파 설정</strong>이 되는 경우, 해당 캐파만큼 캐파에서 제외 함
					</li>
				</ul>
				<ButtonWrap data-props="single" className="flex-just-cen">
					<Button type="primary" size="middle" onClick={setRequestFn}>
						요청
					</Button>
				</ButtonWrap>
			</AGrid>
		</Form>
	);
};

export default OmStockReocationSearch;
