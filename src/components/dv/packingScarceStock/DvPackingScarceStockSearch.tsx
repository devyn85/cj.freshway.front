/*
 ############################################################################
 # FiledataField	: DvPackingScarceStockSearch.tsx
 # Description		: 출고 > 출고현황 > 부족분리스트(RDC검증) 조회 조건 화면
 # Author			: YangChangHwan
 # Since			: 25.06.10
 ############################################################################
*/
import { Form } from 'antd';
// Components
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { Button, CheckBox, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { showAlert } from '@/util/MessageUtil';

// Store

// Libs
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { useSelector } from 'react-redux';

// Utils

const DvPackingScarceStockSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, slipdt } = props;

	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);
	const chkStockynRef = useRef<HTMLInputElement>(null);
	const chkOpenynRef = useRef<HTMLInputElement>(null);
	const chkRealityynRef = useRef<HTMLInputElement>(null);
	const chkAllocatedynRef = useRef<HTMLInputElement>(null);
	const chkPickedynRef = useRef<HTMLInputElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dccode = Form.useWatch('fixdccode', props.form);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 재고기준/작업기준 체크박스 onChange Event Handler (공통)
	 * @param target
	 * @param reset 체크박스 그룹 초기화 객체
	 * @param refs 체크박스 ref 배열
	 */
	function handleSingleCheck(target: any, reset: any, refs: any[]) {
		const { name, checked } = target;

		// 체크 해제 시 모두 false가 되면 다시 체크 유지 및 alert
		if (!checked) {
			const isAnyChecked = refs.some(ref => ref.current?.checked);
			if (!isAnyChecked) {
				showAlert(null, '하나 이상 선택해야 합니다.');
				form.setFieldsValue({ ...reset, [name]: true });
				return;
			}
		}
		form.setFieldsValue({ ...reset, [name]: checked });
	}

	/**
	 * 재고기준 체크박스 onChange Event Handler
	 * @param target
	 */
	function doStockBaseCheckOne(target: any) {
		handleSingleCheck(target, { stockyn: false, openyn: false, realityyn: false }, [
			chkStockynRef,
			chkOpenynRef,
			chkRealityynRef,
		]);
	}

	/**
	 * 작업기준 체크박스 onChange Event Handler
	 * @param target
	 */
	function doTaskBaseCheckOne(target: any) {
		handleSingleCheck(target, { allocatedyn: false, pickedyn: false }, [chkAllocatedynRef, chkPickedynRef]);
	}

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	//검색영역 줄 높이
	useEffect(() => {
		setExpanded(true);

		setTimeout(() => {
			const el = groupRef.current;
			if (!el) return;

			const liElements = el.querySelectorAll('li');
			if (liElements.length === 0) return;

			const firstLiHeight = liElements[0].offsetHeight;
			const totalHeight = el.offsetHeight;
			const lineCount = totalHeight / firstLiHeight;

			setShowToggleBtn(lineCount > 3);
			setExpanded(false); // 다시 닫기
		}, 100);

		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			<UiFilterArea>
				<UiFilterGroup className={!expanded ? 'hide' : ''} ref={groupRef}>
					<li>
						<DatePicker
							label={t('lbl.DOCDT_WD')}
							name="slipdt"
							format={dateFormat}
							placeholder={`${t('lbl.DOCDT_WD')}를 입력해 주세요.`}
							required
							autoFocus
							defaultValue={slipdt}
							// preserveInvalidOnBlur
							colon={false}
							allowClear
							showNow
							minLength={10}
							maxLength={10}
							rules={[
								{
									required: true,
									validateTrigger: 'none',
								},
							]}
						/>
					</li>
					<li>
						{/* 물류센터 */}
						<CmGMultiDccodeSelectBox
							name="fixdccode"
							placeholder="선택해주세요"
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							label={t('lbl.DCCODE')} //물류센터(에러)
							mode={'single'}
							disabled={form.getFieldValue('fixdccodeDisabled')}
							required
						/>
					</li>
					<li>
						<CmOrganizeSearch
							form={form}
							name="organizeNm"
							code="organize"
							label={t('lbl.ORGANIZE')}
							dccode={dccode}
							/*창고*/ selectionMode="multipleRows"
						/>
					</li>
					<li></li>
					<li>
						<span>
							<CheckBox
								ref={chkStockynRef}
								label="재고기준"
								name="stockyn"
								checked={true}
								defaultChecked={true}
								onChange={(e: any) => {
									doStockBaseCheckOne(e.target);
								}}
							>
								현재고
							</CheckBox>
							<CheckBox
								ref={chkOpenynRef}
								name="openyn"
								onChange={(e: any) => {
									doStockBaseCheckOne(e.target);
								}}
							>
								가용재고
							</CheckBox>
							<CheckBox
								ref={chkRealityynRef}
								name="realityyn"
								onChange={(e: any) => {
									doStockBaseCheckOne(e.target);
								}}
							>
								실가용재고
							</CheckBox>
						</span>
					</li>
					<li>
						{/* 상품코드 */}
						<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>
					<li>
						<SelectBox
							label={t('lbl.STORAGETYPE')}
							name="storagetype"
							// required
							defaultValue={t('lbl.ALL')} //"전체"
							placeholder={t('msg.selectBox')} //"선택해주세요"
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))} // "전체"
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							onChange={null}
						/>
					</li>
					<li>
						<span>
							<CheckBox
								ref={chkAllocatedynRef}
								label="작업기준"
								name="allocatedyn"
								checked={true}
								defaultChecked={true}
								onChange={(e: any) => {
									doTaskBaseCheckOne(e.target);
								}}
							>
								분배수량
							</CheckBox>
							<CheckBox
								ref={chkPickedynRef}
								name="pickedyn"
								onChange={(e: any) => {
									doTaskBaseCheckOne(e.target);
								}}
							>
								피킹수량
							</CheckBox>
						</span>
					</li>
				</UiFilterGroup>
				{showToggleBtn && (
					<div className="btn-group align-center">
						<Button
							type="secondary"
							icon={<IcoSvg data={expanded ? icoSvgData.icoArrowUp : icoSvgData.icoArrowDown} />}
							onClick={() => setExpanded(prev => !prev)}
						/>
					</div>
				)}
			</UiFilterArea>
		</>
	);
};

export default DvPackingScarceStockSearch;
