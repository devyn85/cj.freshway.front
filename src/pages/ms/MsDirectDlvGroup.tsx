/*
 ############################################################################
 # FiledataField	: MsDirectDlvGroup.tsx
 # Description		: 기준정보 > 상품기준정보 > 발주직송그룹관리
 # Author			: JeongHyeongCheol
 # Since			: 25.06.27
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Util

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsDirectDlvGroupDetail from '@/components/ms/directDlvGroup/MsDirectDlvGroupDetail';
import MsDirectDlvGroupSearch from '@/components/ms/directDlvGroup/MsDirectDlvGroupSearch';

import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsDirectDlvGroup';
// store
import { fetchGrpCommCode, getCommonCodeList } from '@/store/core/comCodeStore';

// hooks

const MsDirectDlvGroup = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const refModal = useRef(null);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);
	// const gridRef: any = useRef(null);

	const [comboList, setComboList] = useState(getCommonCodeList('DIRECTTYPE', t('lbl.ALL'), 'all'));

	const [selectedCodeType, setSelectedCodeType] = useState<
		'CARAGENTKEY' | 'PARTNERKEY' | 'DIRECTTYPE' | 'BUYERKEY' | 'IBCARRIERCUST'
	>('CARAGENTKEY');

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		if (changedValues.directdlvgroup && allValues.directdlvgroup.includes('')) {
			form.setFieldValue('directdlvgroup', '');
		}
	};

	/**
	 * 조회버튼 이벤트
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (refs.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};
	/**
	 * API 조회
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		const params = form.getFieldsValue();
		refs.gridRef.current.clearGridData();
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
		});
	};

	const handleOpenPopup = (codeType: 'CARAGENTKEY' | 'PARTNERKEY' | 'DIRECTTYPE' | 'BUYERKEY' | 'IBCARRIERCUST') => {
		setSelectedCodeType(codeType);
		refModal.current?.handlerOpen();
	};

	const handleCallBackCdCfgPopup = async () => {
		await fetchGrpCommCode();
		setComboList(getCommonCodeList('DIRECTTYPE', t('lbl.ALL'), 'all'));
	};

	const handleClosePopup = async () => {
		await fetchGrpCommCode();
		setComboList(getCommonCodeList('DIRECTTYPE', t('lbl.ALL'), 'all'));
		// await handleCallBackCdCfgPopup(); // 팝업 닫을때 직송 그룹 정보 재 로딩 처리.

		refs.gridRef.current.setColumnPropByDataField('directdlvgroup', {
			headerText: '직송그룹',
			dataType: 'code',
			editRenderer: {
				type: 'ComboBoxRenderer',
				autoCompleteMode: true,
				autoEasyMode: true,
				showEditorBtnOver: true,
				keyField: 'comCd',
				valueField: 'cdNm',
				list: getCommonCodeList('DIRECTTYPE', ''),
				validator: function (oldValue: any, newValue: any, item: any, dataField: any, fromClipboard: any, which: any) {
					const valueField = this.valueField;
					const isValid = getCommonCodeList('DIRECTTYPE', '').some(v => v[valueField] === newValue);
					if (isValid) {
						item['directdlvgroup'] = getCommonCodeList('DIRECTTYPE', '').find(v => v[valueField] === newValue).comCd;
					}
					return { validate: isValid };
				},
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return item.rowStatus !== 'I';
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					refs.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			filter: {
				showIcon: true,
			},
			required: true,
		});

		refModal.current?.handlerClose();
		// setTimeout(function () {
		// onClickRefreshButton();
		// }, 2000);
	};
	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.resetFields();
		refs.gridRef.current.clearGridData();
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = useMemo(
		() => ({
			searchYn: searchMasterList, // 조회
			setting: () => {
				handleOpenPopup('DIRECTTYPE');
			},
			refresh: onClickRefreshButton,
		}),
		[searchMasterList, onClickRefreshButton],
	);

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} onValuesChange={onValuesChange}>
				<MsDirectDlvGroupSearch codeList={comboList} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsDirectDlvGroupDetail ref={refs} gridData={gridData} search={searchMasterListRun} />
			{/* 사용자코드설정팝업(테스트용) */}
			<CustomModal ref={refModal} width="800px">
				<CmUserCdCfgPopup codeType={selectedCodeType} close={handleClosePopup} />
			</CustomModal>
		</>
	);
};
export default MsDirectDlvGroup;
