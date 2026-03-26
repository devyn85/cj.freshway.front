// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import dayjs from 'dayjs';

//Store

interface WdBeforeOrderAdjustRequestSearchProps {
	form: any;
	search: any;
}

const WdBeforeOrderAdjustRequestSearch = ({ form, search }: WdBeforeOrderAdjustRequestSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [dates, setDates] = useState([]);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 다중선택 붙여넣기
	 * @param  {any} event 이벤트
	 */
	const handlePaste = (event: any) => {
		event.preventDefault(); // 기본 붙여넣기 동작 방지

		const pastedText = event.clipboardData.getData('text/plain');
		let transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

		//transformedText 제일 끝 문자가 ','로 끝나면 제거
		if (transformedText.endsWith(',')) {
			transformedText = transformedText.slice(0, -1);
		}
		const multiCnt = transformedText.split(',').length;

		if (multiCnt > 5000) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		form.setFieldsValue({ multiDocno: transformedText });
	};

	/**
	 * 당일 + 1일 을 셋팅한다.
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs().add(1, 'day');
		const initialEnd = dayjs().add(1, 'day');
		setDates([initialStart, initialEnd]);
		form.setFieldValue('rangeSlipDt', [initialStart, initialEnd]);
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					name="rangeSlipDt"
					allowClear
					showNow={false}
					label={t('lbl.DOCDT_WD')}
					defaultValue={dates}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
					required
				/>
			</li>
			{/* <li>
				창고
				<CmOrganizeSearch
					form={form}
					name="organizeNm"
					code="organize"
					label={t('lbl.ORGANIZE')}
					dccode={dccode}
					selectionMode="multipleRows"
				/>
			</li> */}
			<li>
				<InputText
					name="multiDocno"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.ORDRNUM')])}
					onPressEnter={search}
					label={t('lbl.ORDRNUM')}
					onPaste={handlePaste}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					label={t('lbl.SKU')} //상품코드
					name="skuNm"
					code="skuCd"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmCustSearch
					form={form}
					label={t('lbl.TO_CUSTKEY_WD')} //관리처코드
					name="custNm"
					code="custKey"
				/>
			</li>
			<li>
				<SelectBox
					name="beforeorderYn"
					placeholder="선택해주세요"
					options={[
						{ cdNm: '전체', comCd: '' },
						{ cdNm: '의뢰 전', comCd: 'N' },
						{ cdNm: '의뢰 후', comCd: 'Y' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'주문조정구분'}
				/>
			</li>
			<li>
				<CheckBox
					name="stockYn"
					// placeholder="선택해주세요"
					// options={getCommonCodeList('YN', '--- 선택 ---')}
					// fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'재고무관의뢰'}
				/>
			</li>
		</>
	);
};

export default WdBeforeOrderAdjustRequestSearch;
