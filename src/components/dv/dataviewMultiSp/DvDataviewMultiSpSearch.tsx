/*
 ############################################################################
 # FiledataField	: DvDataviewMultiSpSearch.tsx
 # Description		: 출고 > 출고현황 > 일배입출차이현황 조회 입출고 Grid
 # Author			: YangChangHwan
 # Since			: 25.06.13
 ############################################################################
*/
import { Form } from 'antd';

// Components
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { showAlert } from '@/util/MessageUtil';

// Store

// Libs
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useSelector } from 'react-redux';

// Utils

const DvDataviewMultiSpSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, dates, setDates, search } = props;

	const dateFormat = 'YYYY-MM-DD';
	const deliverydateRef = useRef();

	const { t } = useTranslation();

	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const fixdccode = Form.useWatch('fixdccode', props.form);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const dccodeList: any[] = getUserDccodeList('');
	/*
	dccodeList.unshift({
		dccode: null,
		dcname: '--- 전체 ---',
	});*/

	/**
	 * data onChange Event Handler
	 * @param  {string} value 변경 후 data
	 */
	const deliverydateChangeEvent = useCallback(
		(value: any[], dateStrings: string[]) => {
			const [deliverydateFrom, deliverydateTo] = value;

			//validateDateRange(null, value);

			form.setFieldValue('deliverydateFrom', deliverydateFrom);
			form.setFieldValue('deliverydateTo', deliverydateTo);

			setDates(() => {
				form.setFieldValue('deliverydateFrom', deliverydateFrom);
				form.setFieldValue('deliverydateTo', deliverydateTo);
			});
		},
		// [form],
		[],
	);

	// 1달 초과 검증 함수
	const validateDateRange = (_: any, value: any) => {
		if (!value || !value[0] || !value[1]) {
			return Promise.resolve();
		}

		const [startDate, endDate] = value;
		const diffInDays = endDate.diff(startDate, 'day');
		const oneMonthInDays = 31; // 1달을 31일로 계산

		if (diffInDays > oneMonthInDays) {
			const msg = '기간은 1개월만 가능합니다.';
			showAlert(null, msg);
			value[1] = startDate;
			return Promise.reject(new Error(msg));
		}

		return Promise.resolve();
	};

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
		<UiFilterArea>
			<UiFilterGroup className={!expanded ? 'hide' : ''} ref={groupRef}>
				<li>
					<Rangepicker
						ref={deliverydateRef}
						label={t('lbl.DOCDT_WD')} // "출고일자"
						name="deliverydate"
						defaultValue={dates}
						format={dateFormat}
						span={24}
						allowClear
						showNow={true}
						onChange={deliverydateChangeEvent}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
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
					<InputText
						label={t('lbl.PLANT')} //플랜트
						name="plant"
						placeholder={t('msg.placeholder1', [t('lbl.PLANT')])}
						onPressEnter={search}
					/>
				</li>
				<li></li>
				<li>
					<CmOrganizeSearch
						form={form}
						name="organizeNm"
						code="organize"
						label={t('lbl.ORGANIZE')}
						dccode={fixdccode}
						/*창고*/ selectionMode="multipleRows"
					/>
				</li>
				<li>
					<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
				</li>
				<li>
					<CmPartnerSearch
						form={form}
						name="fromcustkeyNm"
						code="fromcustkey"
						label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					{/* 일배구분 */}
					<SelectBox
						label={t('lbl.PUTAWAYTYPE_WD')}
						name="putawaytype"
						options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL')).filter(
							v => v.comCd == null || v.comCd === '2' || v.comCd === '3',
						)}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default DvDataviewMultiSpSearch;
