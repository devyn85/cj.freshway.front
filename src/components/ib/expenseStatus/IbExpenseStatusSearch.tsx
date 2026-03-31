/*
 ############################################################################
 # FiledataField	: IbExpenseStatusSearch.tsx
 # Description		: 원가관리리포트
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.02
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

// Utils

// Store

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch, InputText } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import IbExpenseStatusErpPoNoPopup from '@/components/ib/expenseStatus/IbExpenseStatusErpPoNoPopup';
import IbExpenseStatusHouseBLNoPopup from '@/components/ib/expenseStatus/IbExpenseStatusHouseBLNoPopup';
import IbExpenseStatusItemCodePopup from '@/components/ib/expenseStatus/IbExpenseStatusItemCodePopup';

// API

interface IbExpenseStatusSearchhProps {
	form: any;
}

const IbExpenseStatusSearch = (props: IbExpenseStatusSearchhProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//const [form] = Form.useForm();

	// ERP PO 팝업용 Ref
	const refErpPoNoModal = useRef(null);
	// ITEM CODE 팝업용 Ref
	const refItemCodeModal = useRef(null);
	// House BL No 팝업용 Ref
	const refHouseBlnoModal = useRef(null);

	// ERP PO 입력값
	//const [erpponoValue, setErpponoValue] = useState();
	const erpponoValue = Form.useWatch('erppono', props.form);
	// Item Code 입력값
	//const [itemcodeValue, setItemcodeValue] = useState();
	const itemcodeValue = Form.useWatch('itemcode', props.form);
	// House Bl no 입력값
	//const [houseblnoValue, setHouseblnoValue] = useState();
	const houseblnoValue = Form.useWatch('houseblno', props.form);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * ERP PO 팝업 오픈
	 */
	const openErpPoNoPopup = () => {
		//setErpponoValue(props.form.getFieldValue('erppono'));
		refErpPoNoModal.current.handlerOpen();
	};

	/**
	 * ERP PO 팝업 실행 후 콜백
	 * @param {any} param 팝업에서 선택한 행
	 */
	const callBackErpPoNoPopup = (param: any) => {
		props.form.setFieldValue('erppono', param.erpPoId);
		refErpPoNoModal.current.handlerClose();
	};

	/**
	 * ERP PO 팝업 닫기 이벤트
	 */
	const closeEventErpPoNoPopup = () => {
		refErpPoNoModal.current.handlerClose();
	};

	/**
	 * ITEM CODE 팝업 오픈
	 */
	const openItemCodePopup = () => {
		// setItemcodeValue(props.form.getFieldValue('itemcode'));
		refItemCodeModal.current.handlerOpen();
	};

	/**
	 * ITEM CODE 팝업 실행 후 콜백
	 * @param {any} param 팝업에서 선택한 행
	 */
	const callBackItemCodePopup = (param: any) => {
		props.form.setFieldValue('erppono', param.erpPoId);
		props.form.setFieldValue('itemcode', param.itemCode);
		props.form.setFieldValue('houseblno', param.houseBlNo);
		props.form.setFieldValue('customercode', param.saleCustomerCode);
		props.form.setFieldValue('polineno', param.lineNo);

		refItemCodeModal.current.handlerClose();
	};

	/**
	 * ITEM CODE 팝업 닫기 이벤트
	 */
	const closeEventItemCodePopup = () => {
		refItemCodeModal.current.handlerClose();
	};

	//
	/**
	 * House BL No 팝업 오픈
	 */
	const openHouseBlnoPopup = () => {
		// setHouseblnoValue(props.form.getFieldValue('houseblno'));
		refHouseBlnoModal.current.handlerOpen();
	};

	/**
	 * House BL No 팝업 실행 후 콜백
	 * @param {any} param 팝업에서 선택한 행
	 */
	const callBackHouseBlnoPopup = (param: any) => {
		props.form.setFieldValue('houseblno', param.houseBlNo);
		props.form.setFieldValue('erppono', param.erpPoId);
		refHouseBlnoModal.current.handlerClose();
	};

	/**
	 * House BL No 팝업 닫기 이벤트
	 */
	const closeEventHouseBlnoPopup = () => {
		refHouseBlnoModal.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	return (
		<>
			<>
				<li>
					<DatePicker //기준일자
						label={t('lbl.BASEDT')}
						name="postingdate"
						format="YYYY-MM-DD"
						showSearch
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<InputSearch
						label={t('ERP P/O No')}
						name="erppono"
						onSearch={openErpPoNoPopup}
						onPressEnter={openErpPoNoPopup}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
						hidden
					/>
				</li>
				<li>
					<InputSearch
						label={t('Item Code')}
						name="itemcode"
						onSearch={openItemCodePopup}
						onPressEnter={openItemCodePopup}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
						hidden
					/>
				</li>
				<li>
					<InputSearch
						label={t('House B/L No')}
						name="houseblno"
						onSearch={openHouseBlnoPopup}
						onPressEnter={openHouseBlnoPopup}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
						hidden
					/>
				</li>
				<li>
					<InputText
						name="customercode" //Customer Code
						span={24}
						label={'Customer Code'}
					/>
				</li>
				<li>
					<InputText
						name="polineno" //PO Line No
						span={24}
						label={'PO Line No'}
					/>
				</li>

				{/* ERP PO 팝업 영역 정의 */}
				<CustomModal ref={refErpPoNoModal} width="1000px">
					<IbExpenseStatusErpPoNoPopup
						callBack={callBackErpPoNoPopup}
						close={closeEventErpPoNoPopup}
						erppono={erpponoValue}
					/>
				</CustomModal>

				{/* ITEM CODE 팝업 영역 정의 */}
				<CustomModal ref={refItemCodeModal} width="1000px">
					<IbExpenseStatusItemCodePopup
						callBack={callBackItemCodePopup}
						close={closeEventItemCodePopup}
						itemcode={itemcodeValue}
						erppono={erpponoValue}
					/>
				</CustomModal>

				{/* BL 팝업 영역 정의 */}
				<CustomModal ref={refHouseBlnoModal} width="1000px">
					<IbExpenseStatusHouseBLNoPopup
						callBack={callBackHouseBlnoPopup}
						close={closeEventHouseBlnoPopup}
						houseblno={houseblnoValue}
					/>
				</CustomModal>
			</>
		</>
	);
};

export default IbExpenseStatusSearch;
