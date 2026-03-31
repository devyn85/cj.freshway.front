/*
 ############################################################################
 # FiledataField	: CmPickingPopup.tsx
 # Description		: 피킹그룹설정팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.11.05
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Form } from 'antd';

// utils

// component
import CmPickingPopup from '@/components/cm/popup/CmPickingPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsPickBatchGroup';
import commUtil from '@/util/commUtil';

// hooks
import _ from 'lodash';

interface SearchPickingProps {
	form: any;
	label?: any;
	searchMode?: string;
	name: string;
	required?: any;
	disabled?: any;
	className?: string;
	dccode?: string;
}

const CmPickingSearch = (props: SearchPickingProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, label, searchMode, name, className, dccode } = props;
	const [popupForm] = Form.useForm();

	const refModal = useRef(null);
	const gridRef = useRef(null);

	const [popupList, setPopupList] = useState([]);

	const [totalCount, setTotalCount] = useState(0);

	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * API 조회
	 * @returns {void}
	 */
	const getSearchApi = () => {
		const params = {
			multiDcCode: [dccode],
		};
		apiGetMasterList(params).then((res: any) => {
			let popData = res.data;
			refModal.current?.handlerOpen();
			// 조회만 할 경우 피킹유형 중복값 제거
			if (searchMode === 'search') {
				popData = _.uniqBy(popData, 'distanceType');
			}
			setPopupList(popData);
			// 팝업 발생 후 데이터 적용
			if (popData.length > -1) {
				setTotalCount(popData.length);
			}
		});
	};

	/**
	 * 버튼 클릭 검색
	 * @param {object} param 조회 param
	 * @param  {any} event 이벤트
	 * @param  {any} source clear, input
	 * @returns {void}
	 */
	const onClickSearchButton = (param: string, event: any, source: any) => {
		if (source.source === 'clear') return;
		setPopupList([]);
		setTotalCount(0);
		getSearchApi();
	};

	/**
	 * 조회 결과 저장
	 * @param {object} val 선택된 임직원 객체
	 * @returns {void}
	 */
	const settingSelectData = (val: any) => {
		let searchDistanceType = val[0].distanceType;
		for (let i = 1; i < val.length; i++) {
			searchDistanceType += ',' + val[i].distanceType;
		}
		form.setFieldsValue({ [name]: searchDistanceType });
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		setTotalCount(0);
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인
	 * @param {object} params Request Params
	 */
	const confirmEvent = (params: any) => {
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<InputSearch
				// label="상품코드/명"
				placeholder={t('msg.placeholder1', ['피킹유형'])}
				form={form}
				name={name}
				hidden={true}
				onSearch={onClickSearchButton}
				allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
				//onBlur={onBlurEvent}
				label={label ?? '피킹유형'}
				required={props.required ?? props.required}
				rules={[{ required: props.required, validateTrigger: 'none' }]}
				disabled={props.disabled ?? props.disabled}
				readOnly={true}
				suffix={
					!props.disabled && commUtil.isNotEmpty(form.getFieldValue(name)) ? (
						<CloseCircleFilled
							style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.25)' }}
							onClick={() => {
								form.setFieldValue(name, '');
							}}
						/>
					) : null
				}
				// disabled={isDisabled ?? isDisabled}
				className={`${className} `}
				autoComplete="off"
			/>
			{/* 팝업 */}
			<CustomModal ref={refModal} width="1280px">
				<CmPickingPopup
					callBack={confirmEvent}
					close={closeEvent}
					gridData={popupList}
					searchMode={searchMode || 'save'}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
					dccode={dccode}
				></CmPickingPopup>
			</CustomModal>
		</>
	);
};

export default CmPickingSearch;
