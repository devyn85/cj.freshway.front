// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import { CheckBox, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// Store
import { useFormDiff } from '@/hooks/cm/useFormDiff';
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList, getUserOrganizeList } from '@/store/core/userStore';

// API
import {
	apiGetCmAuthorityGroupList,
	apiGetCmUserAuthorityList,
	apiGetCmUserConnectList,
	apiGetCmUserDetail,
	apiPostSaveCmUser,
	apiPostSaveCmUserAuthority,
	apiPostSaveCmUserConnect,
	apiPostSaveUnlockUser,
	apiPostSaveUserApprv,
	apiPostSaveUserTmpPwd,
	apiPostSendSmsVerification,
} from '@/api/cm/apiCmUser';

// CSS
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Util
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';
import styled from 'styled-components';

const CmUserDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const location = useLocation();

	// 사용자 정보 가져오기
	const userInfo: any = useAppSelector(state => state.user.userInfo);

	// 사용자 상세 입력 폼
	const [formUserDtl] = Form.useForm();
	const [formInitValues] = useState({
		repUserIdYn: false,
		webUseYn: false,
		dcAppUserYn: false,
		dlvAppUserYn: false,
		ssoUseYn: false,
		rowStatus: 'I',
	});

	// DATA 초기화
	const [totalCntConnect, setTotalCntConnect] = useState(0);
	const [totalCntAuthority, setTotalCntAuthority] = useState(0);
	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파마리터
	const [selEmpType, setSelEmpType] = useState('A01'); // 선택된 "사원유형"
	const [selDefDccode, setSelDefDccode] = useState(''); // 선택된 "기본센터"
	const [selDefStorerkey, setSelDefStorerkey] = useState('FW00'); // 선택된 "기본고객"
	const [selItem, setSelItem] = useState<any>({});
	const [formDisabled, setFormDisabled] = useState(true); // 입력 FORM 비활성화 컨트롤
	const { isFormChanged, setInitialValues, onFormValuesChange, resetForm, changedFields } = useFormDiff(formUserDtl); // Ant Design Form 변경 감지 훅
	const emptypeList = getCommonCodeList('EMPTYPE2');
	const emptypeAddList = [
		{ comCd: 'A01', cdNm: '화주' },
		{ comCd: 'B01', cdNm: '물류협력사' },
		{ comCd: 'C01', cdNm: '배송업체' },
		{ comCd: 'D01', cdNm: '공용기기' },
	];
	const statusUserList = getCommonCodeList('STATUS_SY_USER');

	// Ref
	ref.gridRefUser = useRef();
	ref.gridRefConnect = useRef();
	ref.gridRefAuthority = useRef();
	const refModal = useRef<any>(null); // 개인정보 팝업
	const authGrpRef = useRef<any>([]); // 권한그룹 dropDown 전체 목록
	const isFormChangedRef = useRef(isFormChanged ?? false); // Form 변경여부 Ref
	const changedFieldsRef = useRef<any>(changedFields ?? []); // Form 변경 칼럼 Ref
	const isShowChangeAlertRef = useRef(true); // 변경 여부 경고창 노출 여부
	const formInitDataRef = useRef<any>({}); // Form 초기값
	const isChangePhone = useRef<any>(false); // "핸드폰번호" 변경 여부
	const isChangeEmail = useRef<any>(false); // "이메일" 변경 여부

	// 사용자 목록 그리드 속성 설정
	const gridPropsUser = {
		editable: false,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		exportToXlsxGridCustom: () => {
			// 엑셀 저장 방지
		},
	};

	// 사용자 목록 그리드 칼럼 레이아웃 설정
	const gridColUser = [
		{
			headerText: t('lbl.USER_ID'),
			dataField: 'userIdDisp',
			editable: false,
			primaryFilter: true,
		},
		{
			headerText: t('lbl.EMPNO'),
			dataField: 'empNo',
			editable: false,
		},
		{
			headerText: t('lbl.USER_NM'),
			dataField: 'userNmDisp',
			editable: false,
		},
		{
			headerText: t('lbl.EMPLOYEE_TP'),
			dataField: 'empType',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return emptypeList.filter((empType: any) => empType.comCd === value).map((obj: any) => obj.cdNm);
			},
			// commRenderer: {
			// 	type: 'dropDown',
			// 	// list: getCommonCodeList('EMPTYPE'),
			// 	list: emptypeList,
			// 	listFunction: (rowIndex: number, columnIndex: number, item: any, dataField: string) => {
			// 		if (item[dataField] === '01') {
			// 			// "01(정직원)" 일 경우 수정 불가
			// 			// return getCommonCodeList('EMPTYPE')?.filter((value: any) => value.comCd === '01');
			// 			return emptypeList.filter((value: any) => value.comCd === '01');
			// 		} else {
			// 			// "01(정직원)" 외 다른 유형만 가능
			// 			// return getCommonCodeList('EMPTYPE')?.filter((value: any) => value.comCd !== '01');
			// 			return emptypeList.filter((value: any) => value.comCd !== '01');
			// 		}
			// 	},
			// },
		},
		{
			headerText: t('lbl.DEPARTMENT'),
			dataField: 'depthrNm',
			editable: false,
		},
		{
			headerText: t('lbl.REP_USER_ID_YN'),
			dataField: 'repUserIdYn',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.STATUS_1'),
			dataField: 'status',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return statusUserList.filter((item: any) => item.comCd === value).map((obj: any) => obj.cdNm);
			},
		},
		{
			headerText: t('lbl.DEL_YN'),
			dataField: 'delYn',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DEL_YN', value)?.cdNm;
			},
			// commRenderer: {
			// 	type: 'dropDown',
			// 	list: getCommonCodeList('DEL_YN'),
			// },
		},
		{
			headerText: t('계정잠김여부'),
			dataField: 'userStsCd',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === '02') {
					return '잠김';
				}
				return '정상';
			},
		},
		{
			dataField: 'userId',
			visible: false,
		},
		{
			dataField: 'tempYn',
			visible: false,
		},
		{
			dataField: 'rowStatus',
			visible: false,
		},
	];

	// 센터 권한 그리드 속성 설정
	const gridPropsConnect = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		enableClipboard: false,
	};

	// 센터 권한 그리드 칼럼 레이아웃 설정
	const gridColConnect = [
		{
			headerText: t('lbl.CENTER_CODE'),
			dataField: 'dccode',
			required: true,
			commRenderer: {
				type: 'dropDown',
				keyField: 'dccode',
				valueField: 'dcname',
				list: getUserDccodeList(userInfo.emptype == '01' ? 'STD_HQ' : ''), // "01(정직원)" 일 경우에만 "STD" 선택 가능
				descendants: ['organize'], // "센터코드" 변경시 [ "창고" ] 값 초기화
				descendantDefaultValues: [''], // "센터코드" 변경시 [ "창고" ] 값 초기화
			},
		},
		{
			headerText: t('lbl.STORE'),
			dataField: 'organize',
			required: true,
			commRenderer: {
				type: 'dropDown',
				keyField: 'organize',
				valueField: 'organizeName',
				listFunction: (rowIndex: number, columnIndex: number, item: any) => {
					// "센터코드" 변경시 해당 "창고" 목록 노출
					return getUserOrganizeList(userInfo.emptype == '01' ? 'STD' : '', item['dccode'], ''); // "01(정직원)" 일 경우에만 "STD" 선택 가능
				},
			},
		},
		{
			headerText: t('lbl.DEL_YN'),
			dataField: 'delYn',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN'),
			},
		},
		{
			dataField: 'userId',
			visible: false,
		},
	];

	// 그룹권한 그리드 속성 설정
	const gridPropsAuthority = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		enableClipboard: false,
	};

	// 그룹권한 그리드 칼럼 레이아웃 설정
	const gridColAuthority = [
		{
			headerText: t('lbl.AUTH_CD'),
			dataField: 'authCd',
			required: true,
			usePrimaryKey: true,
			commRenderer: {
				type: 'dropDown',
				keyField: 'authCd',
				valueField: 'authNm',
				listFunction: () => {
					return authGrpRef?.current;
				},
				disabledFunction: () => {
					// 정직원 사용자는 권한 변경 불가
					return !emptypeAddList.some(item => item.comCd === formInitDataRef.current.empType);
					// 로그인 한 사용자가 정규직일 경우 권한 변경 불가
					// || userInfo.repUserIdYn !== 'Y'
				},
			},
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			dataField: 'updDtm',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'userId',
			visible: false,
		},
		{
			dataField: 'authCdOld',
			visible: false,
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 사용자 상세 정보 조회
	 * @returns {void}
	 */
	const searchUserDtl = () => {
		const selectedRow = ref.gridRefUser.current.getSelectedRows();
		if (selectedRow?.length > 0 && !ref.gridRefUser.current.isAddedById(selectedRow[0]?._$uid)) {
			setSelItem(selectedRow[0]);

			const params = {
				userId: selectedRow[0].userId,
			};
			apiGetCmUserDetail(params).then(res => {
				const dataFromDB = {
					...res.data,
					passwdvaliddate: res.data.passwdvaliddate ? dayjs(res.data.passwdvaliddate) : '',
					usevaliddate: res.data.usevaliddate ? dayjs(res.data.usevaliddate) : '',
					repUserIdYn: res.data.repUserIdYn === 'Y',
					webUseYn: res.data.webUseYn === 'Y',
					dcAppUserYn: res.data.dcAppUserYn === 'Y',
					dlvAppUserYn: res.data.dlvAppUserYn === 'Y',
					ssoUseYn: res.data.ssoUseYn === 'Y',
					rowStatus: 'R',
				};
				setSelEmpType(res.data?.empType);
				setSelDefDccode(res.data?.defDccode);
				setSelDefStorerkey(res.data?.defStorerkey);
				setInitialValues(dataFromDB);
				formInitDataRef.current = dataFromDB;
				formUserDtl.setFieldsValue(dataFromDB);
			});
		} else {
			resetUserData();
		}
	};

	/**
	 * 사용자 센터 권한 목록 조회
	 * @returns {void}
	 */
	const searchUserConnectList = () => {
		ref.gridRefConnect.current.clearGridData();
		const selectedRow = ref.gridRefUser.current.getSelectedRows();
		if (selectedRow?.length > 0 && !ref.gridRefUser.current.isAddedById(selectedRow[0]?._$uid)) {
			const params = {
				userId: selectedRow[0].userId,
			};
			apiGetCmUserConnectList(params).then(res => {
				ref.gridRefConnect.current.setGridData(res.data);
				setTotalCntConnect(res.data?.length);
			});
		} else {
			return;
		}
	};

	/**
	 * 사용자 그룹권한 목록 조회
	 * @returns {void}
	 */
	const searchUserAuthorityList = () => {
		ref.gridRefAuthority.current.clearGridData();
		const selectedRow = ref.gridRefUser.current.getSelectedRows();
		if (selectedRow?.length > 0 && !ref.gridRefUser.current.isAddedById(selectedRow[0]?._$uid)) {
			const params = {
				userId: selectedRow[0].userId,
			};
			apiGetCmUserAuthorityList(params).then(res => {
				ref.gridRefAuthority.current.setGridData(res.data);
				setTotalCntAuthority(res.data?.length);
			});
		} else {
			return;
		}
	};

	/**
	 * 사용자 저장
	 */
	const saveUser = async () => {
		// 변경 데이터 확인
		if (!checkChangeData()) {
			showAlert(null, t('msg.MSG_COM_VAL_020')); // 변경사항이 없습니다.
			return;
		}

		const isValid = await validateForm(formUserDtl);
		if (!isValid) return;

		// 센터 권한
		const connectList = ref.gridRefConnect.current.getChangedData({ validationYn: false });
		if (connectList?.length > 0) {
			// validation
			if (!ref.gridRefConnect.current.validateRequiredGridData()) {
				return;
			}

			// PK validation
			if (!ref.gridRefConnect.current.validatePKGridData(['dccode', 'organize'])) {
				return;
			}

			const authDccodeList = getUserDccodeList(userInfo.emptype == '01' ? 'STD_HQ' : '');
			const authSet = new Set(authDccodeList.map((v: any) => v.dccode));
			const hasAuth = connectList.every((v: any) => authSet.has(v.dccode));
			if (!hasAuth) {
				showAlert(null, t('권한이 없는 코드입니다.'));
				return;
			}
		}

		// 권한
		const authorityList = ref.gridRefAuthority.current.getChangedData({ validationYn: false });
		if (authorityList?.length > 0) {
			// validation
			if (!ref.gridRefAuthority.current.validateRequiredGridData()) {
				return;
			}

			const authSet = new Set(authGrpRef.current.map((v: any) => v.authCd));
			const hasAuth = authorityList.every((v: any) => authSet.has(v.authCd));
			if (!hasAuth) {
				showAlert(null, t('권한이 없는 코드입니다.'));
				return;
			}
		}

		// "기본센터" 값 검증 (센터 목록에 있는 값이여야 함)
		// 추후 센터 권한 없이 사용하는 사용자ID가 있을 경우 아래 내용 주석 처리
		const gridDataConnect = ref.gridRefConnect.current.getGridData();
		const defDccode = formUserDtl.getFieldValue('defDccode');
		const exists = gridDataConnect.some((data: any) => data.dccode === defDccode || data.dccode === 'STD');
		if (!exists) {
			showAlert(null, t('기본센터는 센터 목록 중 1개를 선택해야 합니다.'));
			return;
		}

		// "대표권한" 값 검증 (권한그룹 목록에 있는 값이여야 함)
		// 신규 등록이 아니며 && 협력사 일 경우
		if (
			formInitDataRef.current.rowStatus !== 'I' &&
			emptypeAddList.some(item => item.comCd === formInitDataRef.current.empType)
		) {
			const gridData = ref.gridRefAuthority.current.getGridData();
			const defAuth = formUserDtl.getFieldValue('authority');
			const exists = gridData.some((data: any) => data.authCd === defAuth);
			if (!exists) {
				showAlert(null, t('대표권한은 권한그룹 목록 중 1개를 선택해야 합니다.'));
				return;
			}
		}

		// 사용자 상세 전체 DATA
		const userDtlAllData = {
			...formUserDtl.getFieldsValue(true),
			authority: formUserDtl.getFieldValue('authority')?.replace(/LOGISONE_|WAYLO_/g, ''),
			passwdvaliddate: formUserDtl.getFieldValue('passwdvaliddate')
				? formUserDtl.getFieldValue('passwdvaliddate')?.format('YYYYMMDD')
				: '',
			usevaliddate: formUserDtl.getFieldValue('usevaliddate')
				? formUserDtl.getFieldValue('usevaliddate')?.format('YYYYMMDD')
				: '',
			repUserIdYn: formUserDtl.getFieldValue('repUserIdYn') ? 'Y' : 'N',
			webUseYn: formUserDtl.getFieldValue('webUseYn') ? 'Y' : 'N',
			dcAppUserYn: formUserDtl.getFieldValue('dcAppUserYn') ? 'Y' : 'N',
			dlvAppUserYn: formUserDtl.getFieldValue('dlvAppUserYn') ? 'Y' : 'N',
			handphoneNo: isChangePhone.current ? formUserDtl.getFieldValue('handphoneNo') : '', // "핸드폰번호" 변경 됐을 경우에만 값 전달
			mailId: isChangeEmail.current ? formUserDtl.getFieldValue('mailId') : '', // "이메일" 변경 됐을 경우에만 값 전달
			defStorerkey: selDefStorerkey, // "FW00" 값으로 고정
			defArea: 'STD', // "STD" 값으로 고정
			ssoUseYn: formUserDtl.getFieldValue('ssoUseYn') ? 'Y' : 'N',
			custkey: selEmpType === 'D01' ? '114601000' : formUserDtl.getFieldValue('custkey'), // 공용기기 일 경우 custkey 값 "[114601000]씨제이프레시웨이주식회사" 고정
		};

		const params = {
			userDtl: userDtlAllData,
			connectList: connectList,
			authorityList: authorityList,
		};

		ref.gridRefUser.current.showConfirmSave(() => {
			apiPostSaveCmUser(params).then((res: any) => {
				if (res.data.statusCode === 0) {
					// 콜백 처리
					if (props.callBackFn && props.callBackFn instanceof Function) {
						resetUserData();
						props.callBackFn();
					}
				}
			});
		});
	};

	/**
	 * SMS 인증 문자 전송
	 */
	const sendSmsVerification = () => {
		// 선택 항목
		const userList = ref.gridRefUser.current.getCheckedRowItems()?.map((item: any) => item['item']);

		if (userList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010')); // 체크된 항목이 없습니다. 최소한 1건 이상 체크되어야 합니다.
			return;
		}

		// "80(임시저장)" 상태가 아닐 경우
		let isValid = true;
		userList.forEach((user: any) => {
			if (user['status'] !== '80') {
				isValid = false;
			}
		});
		if (!isValid) {
			showAlert(null, t('msg.MSG_COM_VAL_222', [t('lbl.TMP_SAVE')])); // 임시저장 항목만 선택해 주십시오.
			return;
		}

		const params = {
			userList: userList,
		};

		// SMS 인증 문자 전송하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_VAL_223'), () => {
			apiPostSendSmsVerification(params).then((res: any) => {
				if (res.data.statusCode === 0) {
					// 콜백 처리
					if (props.callBackFn && props.callBackFn instanceof Function) {
						resetUserData();
						props.callBackFn();
					}
				}
			});
		});
	};

	/**
	 * 임시비밀번호 생성 및 발송
	 */
	const saveUserTmpPwd = () => {
		// 선택 항목
		const userList = ref.gridRefUser.current.getCheckedRowItems()?.map((item: any) => item['item']);

		if (userList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010')); // 체크된 항목이 없습니다. 최소한 1건 이상 체크되어야 합니다.
			return;
		}

		// 대표ID가 아닐 경우
		let isValid = true;
		userList.forEach((user: any) => {
			if (user['repUserIdYn'] !== 'Y') {
				isValid = false;
			}
		});
		if (!isValid) {
			showAlert(null, t('msg.MSG_COM_VAL_222', [t('lbl.REP_USER_ID_YN')])); // 대표ID 항목만 선택해 주십시오.
			return;
		}

		const params = {
			userList: userList,
		};

		// 임시 비밀번호 생성 및 SMS 문자 전송하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_VAL_224'), () => {
			apiPostSaveUserTmpPwd(params).then((res: any) => {
				if (res.data.statusCode === 0) {
					// 콜백 처리
					if (props.callBackFn && props.callBackFn instanceof Function) {
						resetUserData();
						props.callBackFn();
					}
				}
			});
		});
	};

	/**
	 * 사용자 잠김 계정 해제
	 */
	const saveUnlockUser = () => {
		// 선택 항목
		const userList = ref.gridRefUser.current.getCheckedRowItems()?.map((item: any) => item['item']);

		if (userList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010')); // 체크된 항목이 없습니다. 최소한 1건 이상 체크되어야 합니다.
			return;
		}

		// 임시 사용자일 경우
		let isValid = true;
		userList.forEach((user: any) => {
			if (user['tempYn'] === 'Y') {
				isValid = false;
			}
		});
		if (!isValid) {
			showAlert(null, t('msg.MSG_COM_VAL_232')); // 임시 사용자ID는 선택할 수 없습니다.
			return;
		}

		const params = {
			userList: userList,
		};

		// 잠긴 사용자 계정을 해제하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_VAL_233'), () => {
			apiPostSaveUnlockUser(params).then((res: any) => {
				if (res.data.statusCode === 0) {
					// 콜백 처리
					if (props.callBackFn && props.callBackFn instanceof Function) {
						resetUserData();
						props.callBackFn();
					}
				}
			});
		});
	};

	/**
	 * 사용자승인
	 */
	const apprvUser = () => {
		// 선택 항목
		const userList = ref.gridRefUser.current.getCheckedRowItems()?.map((item: any) => item['item']);

		if (userList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010')); // 체크된 항목이 없습니다. 최소한 1건 이상 체크되어야 합니다.
			return;
		}

		let isValid = true;
		if (userInfo['repUserIdYn'] === 'Y') {
			// "82(대표승인대기)" 상태가 아닐 경우
			userList.forEach((user: any) => {
				if (user['status'] !== '82') {
					isValid = false;
				}
			});
			if (!isValid) {
				showAlert(null, t('msg.MSG_COM_VAL_222', [t('lbl.REP_APPR_STAND')])); // 대표승인대기 항목만 선택해 주십시오.
				return;
			}
		} else if (userInfo['emptype'] === '01') {
			// "83(정직원승인대기)" 상태가 아닐 경우
			userList.forEach((user: any) => {
				if (user['status'] !== '83') {
					isValid = false;
				}
			});
			if (!isValid) {
				showAlert(null, t('msg.MSG_COM_VAL_222', [t('lbl.REGULAR_APPR_STAND')])); // 정직원승인대기 항목만 선택해 주십시오.
				return;
			}
		} else {
			return;
		}

		const params = {
			userList: userList,
		};

		// 사용자를 승인하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_VAL_225'), () => {
			apiPostSaveUserApprv(params).then((res: any) => {
				if (res.data.statusCode === 0) {
					// 콜백 처리
					if (props.callBackFn && props.callBackFn instanceof Function) {
						resetUserData();
						props.callBackFn();
					}
				}
			});
		});
	};

	/**
	 * 사용자 센터 권한 저장
	 */
	const saveUserConnect = () => {
		// 변경 데이터 확인
		const connectList = ref.gridRefConnect.current.getChangedData({ validationYn: false });
		if (!connectList || connectList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!ref.gridRefConnect.current.validateRequiredGridData()) {
			return;
		}

		// PK validation
		if (!ref.gridRefConnect.current.validatePKGridData(['dccode', 'organize'])) {
			return;
		}

		const authDccodeList = getUserDccodeList(userInfo.emptype == '01' ? 'STD_HQ' : '');
		const authSet = new Set(authDccodeList.map(v => v.dccode));
		const hasAuth = connectList.every((v: any) => authSet.has(v.dccode));
		if (!hasAuth) {
			showAlert(null, t('권한이 없는 코드입니다.'));
			return;
		}

		ref.gridRefConnect.current.showConfirmSave(() => {
			const params = {
				userDtl: { userId: formUserDtl.getFieldValue('userId') },
				connectList: connectList,
			};
			apiPostSaveCmUserConnect(params).then((res: any) => {
				if (res.data.statusCode === 0) {
					// 콜백 처리
					if (props.callBackFn && props.callBackFn instanceof Function) {
						resetUserData();
						props.callBackFn();
					}
				}
			});
		});
	};

	/**
	 * 사용자 권한 저장
	 */
	const saveUserAuthority = () => {
		// 변경 데이터 확인
		const authorityList = ref.gridRefAuthority.current.getChangedData({ validationYn: false });
		if (!authorityList || authorityList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!ref.gridRefAuthority.current.validateRequiredGridData()) {
			return;
		}

		const authSet = new Set(authGrpRef.current.map((v: any) => v.authCd));
		const hasAuth = authorityList.every((v: any) => authSet.has(v.authCd));
		if (!hasAuth) {
			showAlert(null, t('권한이 없는 코드입니다.'));
			return;
		}

		ref.gridRefAuthority.current.showConfirmSave(() => {
			const params = {
				userDtl: { userId: formUserDtl.getFieldValue('userId') },
				authorityList: authorityList,
			};
			apiPostSaveCmUserAuthority(params).then((res: any) => {
				if (res.data.statusCode === 0) {
					// 콜백 처리
					if (props.callBackFn && props.callBackFn instanceof Function) {
						resetUserData();
						props.callBackFn();
					}
				}
			});
		});
	};

	// 사용자 목록 그리드 버튼 설정
	const gridBtnUser: GridBtnPropsType = {
		tGridRef: ref.gridRefUser, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2', // 사용자승인
				callBackFn: apprvUser,
			},
			{
				btnType: 'btn3', // SMS인증전송
				callBackFn: sendSmsVerification,
			},
			{
				btnType: 'btn4', // 임시비밀전송
				callBackFn: saveUserTmpPwd,
			},
			{
				btnType: 'btn5', // 잠김해제
				callBackFn: saveUnlockUser,
			},
			{
				btnType: 'plus', // 행추가
				isActionEvent: false,
				callBackFn: () => {
					if (ref.gridRefUser?.current?.getAddedRowItems()?.length > 0) {
						showAlert(null, t('msg.MSG_COM_ERR_054')); // 이미 신규 입력 중입니다.
					} else {
						resetUserDataConfirm(() => {
							resetUserData();
							setTimeout(() => {
								if (userInfo['repUserIdYn'] === 'Y') {
									setSelEmpType(userInfo['emptype']);
								} else {
									setSelEmpType('A01');
								}
								setInitialValues(formInitValues);
								formInitDataRef.current = formInitValues;
								formUserDtl.setFieldsValue(formInitValues);
								ref.gridRefUser?.current.addRow({ ...formInitValues, repUserIdYn: '' });

								// 업체대표ID 일 경우 초기값 설정
								if (userInfo['repUserIdYn'] === 'Y') {
									// 상세 정보 기본값
									const repFormInitValues = {
										...formInitValues,
										empType: userInfo['emptype'],
										defDccode: userInfo['defDccode'],
										defStorerkey: userInfo['defStorerkey'],
										defOrganize: userInfo['defOrganize'],
										custkey: userInfo['custkey'],
										custkeyNm: userInfo['custkeyNm'],
									};
									formUserDtl.setFieldsValue(repFormInitValues);

									// 센터 기본값
									ref.gridRefConnect.current.addRow([
										{ dccode: userInfo['defDccode'], organize: userInfo['defOrganize'] },
									]);
								} else {
									// 상세 정보 기본값
									const repFormInitValues = {
										...formInitValues,
										repUserIdYn: true,
									};
									formUserDtl.setFieldsValue(repFormInitValues);
								}
							});
						});
					}
				},
			},
			{
				btnType: 'delete', // 행삭제
				isActionEvent: false,
				callBackFn: () => {
					resetUserDataConfirm(() => {
						isShowChangeAlertRef.current = false; // 변경여부 경고창 중복 노출 방지
						if (ref.gridRefUser?.current?.deleteRowItems()) {
							resetUserData();
						}
						isShowChangeAlertRef.current = true;
					});
				},
			},
			// {
			// 	btnType: 'save', // 저장
			// 	callBackFn: saveUser,
			// },
		],
	};

	// 사용자 상세 버튼 설정
	const tableBtnUserDtl: TableBtnPropsType = {
		tGridRef: ref.gridRefUser, // 사용자 목록 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveUser,
			},
		],
	};

	// 센터 권한 그리드 버튼 설정
	const gridBtnConnect: GridBtnPropsType = {
		tGridRef: ref.gridRefConnect, // 타겟 그리드 Ref
		btnArr:
			formInitDataRef.current.rowStatus === 'I'
				? [
						{
							btnType: 'plus', // 행추가
							initValues: {
								userId: selItem.userId,
							},
						},
						{
							btnType: 'delete', // 행삭제
						},
				  ]
				: [
						{
							btnType: 'plus', // 행추가
							initValues: {
								userId: selItem.userId,
							},
						},
						{
							btnType: 'delete', // 행삭제
						},
						// {
						// 	btnType: 'save', // 저장
						// 	callBackFn: saveUserConnect,
						// },
				  ],
	};

	// 그룹권한 그리드 버튼 설정
	const gridBtnAuthority: GridBtnPropsType = {
		tGridRef: ref.gridRefAuthority, // 타겟 그리드 Ref
		btnArr:
			formInitDataRef.current.rowStatus === 'I'
				? []
				: [
						{
							btnType: 'plus', // 행추가
							initValues: {
								userId: selItem.userId,
							},
						},
						{
							btnType: 'delete', // 행삭제
						},
						// {
						// 	btnType: 'save', // 저장
						// 	callBackFn: saveUserAuthority,
						// },
				  ],
	};

	/**
	 * 개인정보 팝업 열기
	 * @param {any} params 파라미터
	 */
	const openIndividualPopup = (params: any) => {
		if (params.dataField === 'userIdDisp') {
			params.individualKey = 'userIdDisp'; // 개인정보 키 설정 - 사용자ID
		} else if (params.dataField === 'userNmDisp') {
			params.individualKey = 'userNm'; // 개인정보 키 설정 - 이름
		} else if (params.dataField === 'handphoneNo') {
			params.individualKey = 'handphoneNo'; // 개인정보 키 설정 - 핸드폰번호
		} else if (params.dataField === 'mailId') {
			params.individualKey = 'mailId'; // 개인정보 키 설정 - 이메일
		}

		if (commUtil.isNotEmpty(params.individualKey)) {
			fnCmIndividualPopup(params);
		}
	};

	/**
	 * 팝업 열기 이벤트
	 * @param {any} params 파라미터
	 */
	const fnCmIndividualPopup = (params: any) => {
		setPopUpParams(params);
		refModal.current.handlerOpen();
	};

	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent = () => {
		refModal.current.handlerClose();
	};

	/**
	 * 사용자 상세 개인정보 더블 클릭시
	 * @param {string} dataField dataField
	 */
	const onDoubleClickUserDtl = (dataField: string) => {
		const params = { url: '', dataField: '', userId: '' }; // 팝업 파라미터 초기화
		params.url = '/api/cm/user/v1.0/getUserDetail'; // 팝업 URL 설정
		params.userId = formUserDtl.getFieldValue('userId'); // userId 설정
		params.dataField = dataField;
		openIndividualPopup(params);
	};

	/**
	 * "사원유형" 변경시
	 * @param {any} value 사원유형 변경 값
	 */
	const onChangeEmpType = (value: any) => {
		setSelEmpType(value);

		// "업체명" 값 초기화
		formUserDtl.setFieldsValue({ custkey: '', custkeyNm: '' });
	};

	/**
	 * "기본센터" 변경시
	 * @param {any} value 기본센터 변경 값
	 */
	const onChangeDefDccode = (value: any) => {
		setSelDefDccode(value);

		// "기본센터" 변경시 "기본조직" 값 설정
		if (value === '1000' || value === '2170') {
			formUserDtl.setFieldsValue({ defOrganize: '' });
		} else {
			formUserDtl.setFieldsValue({ defOrganize: value });
		}

		// 사용자 등록할때 "기본센터" 선택시 센터 권한 자동 추가
		if (formInitDataRef.current.rowStatus === 'I') {
			const allData = ref.gridRefConnect?.current?.getOrgGridData();
			const filterData = allData?.filter((data: any) => {
				return data.dccode === value;
			});
			if (filterData.length < 1) {
				ref.gridRefConnect?.current.addRow({
					dccode: value,
					organize: value === '1000' || value === '2170' ? '' : value,
				});
			}
		}
	};

	/**
	 * 사용자 상세 FORM 변경시
	 */
	const onChangeForm = () => {
		onFormValuesChange();

		setTimeout(() => {
			setRowStatus();

			// 상세 FORM 상태값 변경
			if (isFormChangedRef.current) {
				formUserDtl.setFieldsValue({ rowStatus: getRowStatusByIndex(ref.gridRefUser.current, prevRowIndex.current) });

				// 개인정보 마스킹 처리된 필드 변경여부 판단
				if (changedFieldsRef.current.includes('handphoneNo')) {
					isChangePhone.current = true;
				} else {
					isChangePhone.current = false;
				}
				if (changedFieldsRef.current.includes('mailId')) {
					isChangeEmail.current = true;
				} else {
					isChangeEmail.current = false;
				}
			} else {
				formUserDtl.setFieldsValue({ rowStatus: 'R' });
			}
		}, 100);
	};

	/**
	 * 사용자 그리드 'rowStatus' 값 설정
	 */
	const setRowStatus = () => {
		const rowIdx = ref.gridRefUser.current.getSelectedIndex()[0];
		if (checkChangeData()) {
			ref.gridRefUser.current.setCellValue(rowIdx, 'rowStatus', 'U');
		} else {
			ref.gridRefUser.current.setCellValue(rowIdx, 'rowStatus', 'R');
		}
	};

	/**
	 * 사용자상세 / 센터 / 권합그룹 변경 여부 체크
	 * @returns {boolean} 변경여부
	 */
	const checkChangeData = (): boolean => {
		const connectList = ref.gridRefConnect.current.getChangedData({ validationYn: false, andCheckedYn: false });
		const authorityList = ref.gridRefAuthority.current.getChangedData({ validationYn: false, andCheckedYn: false });
		return connectList?.length > 0 || authorityList?.length > 0 || isFormChangedRef.current;
	};

	/**
	 * Form Data 리셋
	 */
	const resetUserData = () => {
		ref.gridRefUser.current.setCellValue(prevRowIndex.current, 'rowStatus', 'R');
		formUserDtl.resetFields();
		resetForm();
		setInitialValues({});
		ref.gridRefConnect.current.clearGridData();
		ref.gridRefAuthority.current.clearGridData();
		setTotalCntConnect(0);
		setTotalCntAuthority(0);
	};

	/**
	 * Form User Data 컨펌
	 * @param {any} callBackFn 성공 콜백 function
	 * @param {any} cancelCallBackFn 취소 콜백 function
	 */
	const resetUserDataConfirm = (callBackFn: any, cancelCallBackFn?: any) => {
		if (isShowChangeAlertRef.current && checkChangeData()) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'), // 변경사항이 있습니다. 계속 진행하시겠습니까?
				() => {
					if (callBackFn && callBackFn instanceof Function) callBackFn();
				},
				() => {
					if (cancelCallBackFn && cancelCallBackFn instanceof Function) cancelCallBackFn();
				},
			);
		} else if (callBackFn && callBackFn instanceof Function) {
			callBackFn();
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 권한 그룹 목록 조회
		apiGetCmAuthorityGroupList(null).then(res => {
			if (res.statusCode === 0) {
				authGrpRef.current = res.data;
			}
		});
	}, [location]); // "권한그룹 관리" 화면에서 신규 권한 생성 후 TAB으로 "사용자 정보 관리" 화면으로 이동시 신규 권한이 바로 보이게 location 추가

	const prevRowIndex = useRef<any>(null);
	useEffect(() => {
		// 사용자 목록 그리드 행 변경 시
		const gridRefUSerCur = ref.gridRefUser.current;
		gridRefUSerCur?.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex.current) return;

			const searchDtl = () => {
				// 이전 행 인덱스 갱신
				prevRowIndex.current = event.primeCell.rowIndex;
				// 사용자 상세 정보 조회
				searchUserDtl();
				// 사용자 센터 목록 조회
				searchUserConnectList();
				// 사용자 그룹권한 목록 조회
				searchUserAuthorityList();
				// FROM 편집 활성화
				setFormDisabled(false);
			};

			resetUserDataConfirm(
				() => {
					if (ref.gridRefUser.current.isAddedByRowIndex(prevRowIndex.current)) {
						// 신규행일 경우 삭제
						ref.gridRefUser.current.removeRow(prevRowIndex.current);
					} else {
						ref.gridRefUser.current.setCellValue(prevRowIndex.current, 'rowStatus', 'R');
					}
					searchDtl();
				},
				() => {
					// 이전 ROW로 되돌리기
					gridRefUSerCur?.setSelectionByIndex(prevRowIndex.current);
				},
			);
		});

		// 사용자 목록이 없을 경우 FORM 비활성화 처리
		gridRefUSerCur?.bind('undoRedoChange', function () {
			if (gridRefUSerCur?.getRowCount() < 1) {
				setFormDisabled(true);
			} else {
				setFormDisabled(false);
			}
		});

		// 센터 그리드 목록 변경시
		ref.gridRefConnect.current?.bind('undoRedoChange', function () {
			setRowStatus();
		});

		// 권한그룹 그리드 목록 변경시
		ref.gridRefAuthority.current?.bind('undoRedoChange', function () {
			setRowStatus();
		});

		// 개인정보 조회 더블 클릭 시
		gridRefUSerCur?.bind('cellDoubleClick', (event: { dataField: string; value: any; rowIndex: number }) => {
			const params = { url: '', dataField: '', userId: '' }; // 팝업 파라미터 초기화
			params.url = '/api/cm/user/v1.0/getUserDetail'; // 팝업 URL 설정
			params.userId = gridRefUSerCur.getCellValue(event.rowIndex, 'userId'); // 사번 설정
			params.dataField = event.dataField;
			openIndividualPopup(params);
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		prevRowIndex.current = null;
		const gridRefUserCur = ref.gridRefUser.current;
		if (gridRefUserCur) {
			gridRefUserCur?.setGridData(props.data.map((item: any) => ({ ...item, rowStatus: 'R' })));
			gridRefUserCur?.setSelectionByIndex(0, 0);

			// 총건수 초기화
			if (props.data?.length < 1) {
				resetUserData();
				setTotalCntConnect(0);
				setTotalCntAuthority(0);

				// FROM 편집 비활성화
				setFormDisabled(true);
			}
		}
	}, [props.data]);

	// FORM 상태 변경 시 ref 동기화
	useEffect(() => {
		isFormChangedRef.current = isFormChanged;
	}, [isFormChanged]);

	// FORM 변경 칼럼 ref 동기화
	useEffect(() => {
		changedFieldsRef.current = changedFields;
	}, [changedFields]);

	// 업체명 변경시 캐치하기 위해 추가
	const custkeyWatch = Form.useWatch('custkey', formUserDtl);
	useEffect(() => {
		if (isShowChangeAlertRef.current) {
			onChangeForm();
		}
	}, [custkeyWatch]);

	// 부모에서 호출 가능하게 설정
	useImperativeHandle(ref, () => ({
		checkChangeData,
		resetUserData,
	}));

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRefUser?.current?.resize?.('100%', '100%');
		ref.gridRefConnect?.current?.resize?.('100%', '100%');
		ref.gridRefAuthority?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<Splitter
						key="cmUserDetail-top-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid>
									<GridTopBtn gridBtn={gridBtnUser} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefUser} columnLayout={gridColUser} gridProps={gridPropsUser} />
								</GridAutoHeight>
							</>,
							<CustomForm
								key="cmUserDetail-form"
								form={formUserDtl}
								onValuesChange={onChangeForm}
								disabled={formDisabled}
							>
								<AGrid style={{ height: 'auto' }}>
									<TableTopBtn tableTitle={t('lbl.DETAIL')} tableBtn={tableBtnUserDtl} />
								</AGrid>
								<ScrollBox>
									<div>
										<AGrid>
											<UiDetailViewArea>
												<UiDetailViewGroup className="grid-column-2">
													{(userInfo.emptype === '01' || userInfo.repUserIdYn === 'Y') &&
														formInitDataRef.current.rowStatus === 'I' && (
															<>
																<li>
																	<InputText
																		name={'userId'}
																		label={t('lbl.USER_ID')}
																		required={userInfo.emptype === '01'}
																		disabled={userInfo.repUserIdYn === 'Y'}
																		rules={[
																			{ required: userInfo.emptype === '01' },
																			{ pattern: /^.{4,20}$/, message: t('msg.MSG_COM_VAL_226') }, // 사용자ID는 4~18자리여야 합니다.
																			{
																				validator: (_, value) => {
																					if (!value) return Promise.resolve();
																					if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)) {
																						return Promise.reject(new Error('한글은 입력할 수 없습니다.'));
																					}
																					return Promise.resolve();
																				},
																			},
																		]}
																		preserve={'false'}
																	/>
																</li>
																<li>
																	<InputText
																		name={'userNm'}
																		label={t('lbl.USER_NM')}
																		required
																		rules={[{ required: true }]}
																		preserve={'false'}
																	/>
																</li>
															</>
														)}
													{((userInfo.emptype !== '01' && userInfo.repUserIdYn !== 'Y') ||
														formInitDataRef.current.rowStatus !== 'I') && (
														<>
															<li
															// onDoubleClick={() => {
															// 	onDoubleClickUserDtl('userIdDisp');
															// }}
															>
																<InputText name={'userIdDisp'} label={t('lbl.USER_ID')} required readOnly />
															</li>
															<li
															// onDoubleClick={() => {
															// 	onDoubleClickUserDtl('userNmDisp');
															// }}
															>
																<InputText name={'userNmDisp'} label={t('lbl.USER_NM')} required readOnly />
															</li>
														</>
													)}
													<li>
														<InputText name={'empNo'} label={t('lbl.EMPNO')} readOnly />
													</li>
													<li>
														<SelectBox
															name={'empType'}
															label={t('lbl.EMPTYPE')}
															placeholder="선택해주세요"
															// options={getCommonCodeList('EMPTYPE')}
															options={formInitDataRef.current.rowStatus === 'I' ? emptypeAddList : emptypeList}
															onChange={onChangeEmpType}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
															disabled={userInfo.repUserIdYn === 'Y' ? true : formInitDataRef.current.rowStatus !== 'I'}
															rules={userInfo.emptype == '01' ? [{ required: true, validateTrigger: 'none' }] : []}
														/>
													</li>
													<li>
														<InputText name={'depthrNm'} label={'부서'} readOnly />
													</li>
													<li>
														<SelectBox
															name={'authority'}
															label={t('lbl.RPST_AUTH')}
															placeholder="선택해주세요"
															// options={authGridData}
															options={
																// 신규 등록 && 로그인 한 사용자가 대표ID 일 경우
																formInitDataRef.current.rowStatus === 'I' && userInfo.repUserIdYn !== 'Y'
																	? authGrpRef.current?.filter((auth: any) => commUtil.isEmpty(auth.custKey))
																	: authGrpRef.current
															}
															fieldNames={{ label: 'authNm', value: 'authCd' }}
															disabled={
																formDisabled ||
																// 정규직 사용자들은 권한 변경 불가
																(formInitDataRef.current.rowStatus !== 'I' &&
																	!emptypeAddList.some(item => item.comCd === formInitDataRef.current.empType))
																// 로그인 한 사용자가 정규직일 경우 권한 변경 불가
																// || (formInitDataRef.current.rowStatus !== 'I' && userInfo.repUserIdYn !== 'Y')
															}
															rules={
																userInfo.emptype == '01' || userInfo.repUserIdYn === 'Y'
																	? [{ required: true, validateTrigger: 'none' }]
																	: []
															}
														/>
													</li>
													<li>
														<SelectBox
															name={'defDccode'}
															label={t('lbl.DEF_DCCODE')}
															options={getUserDccodeList('HQ')}
															fieldNames={{ label: 'dcname', value: 'dccode' }}
															disabled={formDisabled}
															onChange={onChangeDefDccode}
															rules={
																userInfo.emptype == '01' || userInfo.repUserIdYn === 'Y'
																	? [{ required: true, validateTrigger: 'none' }]
																	: []
															}
														/>
													</li>
													{/* <li>
									<SelectBox
										name={'defStorerkey'}
										label={t('lbl.DEF_STORERKEY')}
										options={getUserStorerkeyList('', selDefDccode)}
										fieldNames={{ label: 'storerName', value: 'storerkey' }}
										disabled={formDisabled}
										rules={
											userInfo.emptype == '01' || userInfo.repUserIdYn === 'Y'
												? [{ required: true, validateTrigger: 'none' }]
												: []
										}
									/>
								</li> */}
													<li>
														<SelectBox
															name={'defOrganize'}
															label={t('lbl.DEF_ORGANIZE')}
															options={getUserOrganizeList('', selDefDccode, selDefStorerkey)}
															fieldNames={{ label: 'organizeName', value: 'organize' }}
															disabled={formDisabled}
															rules={
																userInfo.emptype == '01' || userInfo.repUserIdYn === 'Y'
																	? [{ required: true, validateTrigger: 'none' }]
																	: []
															}
														/>
													</li>
													{selEmpType === 'A01' && (
														<li className="col-2">
															<CmCustSearch
																form={formUserDtl}
																name="custkeyNm"
																code="custkey"
																owner="userNm"
																label={t('lbl.LBL_FROM_CUSTNAME')}
																disabled={
																	formDisabled ||
																	(userInfo.repUserIdYn === 'Y' ? true : formInitDataRef.current.rowStatus !== 'I')
																}
																required={formInitDataRef.current.rowStatus === 'I'}
															/>
														</li>
													)}
													{selEmpType === 'B01' && (
														<li className="col-2">
															<CmPartnerSearch
																form={formUserDtl}
																name="custkeyNm"
																code="custkey"
																label={t('lbl.LBL_FROM_CUSTNAME')}
																disabled={
																	formDisabled ||
																	(userInfo.repUserIdYn === 'Y' ? true : formInitDataRef.current.rowStatus !== 'I')
																}
																required={formInitDataRef.current.rowStatus === 'I'}
															/>
															{/* <SelectBox
											name={'custkey'}
											label={t('lbl.LBL_FROM_CUSTNAME')}
											options={getCommonCodeList('PARTNERKEY')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											disabled={
												formDisabled ||
												(userInfo.repUserIdYn === 'Y' ? true : formInitDataRef.current.rowStatus !== 'I')
											}
											rules={
												formInitDataRef.current.rowStatus === 'I' ? [{ required: true, validateTrigger: 'none' }] : []
											}
										/> */}
														</li>
													)}
													{selEmpType === 'C01' && (
														<li className="col-2">
															<CmCarrierSearch
																form={formUserDtl}
																name="custkeyNm"
																code="custkey"
																label={t('lbl.LBL_FROM_CUSTNAME')}
																disabled={
																	formDisabled ||
																	(userInfo.repUserIdYn === 'Y' ? true : formInitDataRef.current.rowStatus !== 'I')
																}
																required={formInitDataRef.current.rowStatus === 'I'}
															/>
															{/* <SelectBox
											name={'custkey'}
											label={t('lbl.LBL_FROM_CUSTNAME')}
											options={getCommonCodeList('CARAGENTKEY')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											disabled={
												formDisabled ||
												(userInfo.repUserIdYn === 'Y' ? true : formInitDataRef.current.rowStatus !== 'I')
											}
											rules={
												formInitDataRef.current.rowStatus === 'I' ? [{ required: true, validateTrigger: 'none' }] : []
											}
										/> */}
														</li>
													)}
													<li
													// onDoubleClick={() => {
													// 	onDoubleClickUserDtl('handphoneNo');
													// }}
													>
														<InputText
															name="handphoneNo"
															label={t('lbl.HANDPHONE_NO')}
															required={formInitDataRef.current.rowStatus === 'I'}
															rules={
																isChangePhone.current
																	? [
																			{
																				required: formInitDataRef.current.rowStatus === 'I',
																			},
																			{
																				pattern: /^01[016789]-\d{3,4}-\d{4}$/,
																				message: t('msg.MSG_COM_VAL_227'), // 올바른 휴대폰 번호 형식이 아닙니다.
																			},
																	  ]
																	: [
																			{
																				required: formInitDataRef.current.rowStatus === 'I',
																			},
																	  ]
															}
															onBlur={(e: any) => {
																const formatted = dataRegex.formatPhone(e.target.value);
																if (commUtil.isNotEmpty(formatted)) {
																	formUserDtl.setFieldsValue({ handphoneNo: formatted });
																}
															}}
														/>
													</li>
													<li
													// onDoubleClick={() => {
													// 	onDoubleClickUserDtl('mailId');
													// }}
													>
														<InputText
															name="mailId"
															label={t('lbl.EMAIL')}
															// readOnly={userInfo.repUserIdYn === 'Y'}
															required={formInitDataRef.current.rowStatus === 'I'}
															rules={
																isChangeEmail.current
																	? [
																			{
																				required: formInitDataRef.current.rowStatus === 'I',
																			},
																			{
																				type: 'email',
																				message: t('msg.MSG_COM_VAL_228'), // 올바른 이메일 형식이 아닙니다.
																			},
																	  ]
																	: [
																			{
																				required: formInitDataRef.current.rowStatus === 'I',
																			},
																	  ]
															}
														/>
													</li>
													<li className="col-2">
														<CheckBox name={'repUserIdYn'} label={t('lbl.REP_USER_ID_YN')} disabled={true} />
													</li>
													{/* <li>
									<CheckBox
										name={'webUseYn'}
										label={t('lbl.WEB_USE_YN')}
										disabled={formDisabled || userInfo.repUserIdYn === 'Y'}
									/>
								</li> */}
													<li>
														<CheckBox
															name={'dcAppUserYn'}
															label={t('lbl.DC_APP_USER_YN')}
															disabled={formDisabled || (userInfo.repUserIdYn === 'Y' && userInfo.dcAppUserYn === 'N')}
														/>
													</li>
													<li>
														<CheckBox
															name={'dlvAppUserYn'}
															label={t('lbl.DLV_APP_USER_YN')}
															disabled={formDisabled || (userInfo.repUserIdYn === 'Y' && userInfo.dlvAppUserYn === 'N')}
														/>
													</li>
													<li>
														<DatePicker
															name="passwdvaliddate"
															label={t('lbl.PASSWDVALIDDATE')}
															required={
																formInitDataRef.current.rowStatus !== 'I' && formInitDataRef.current.tempYn !== 'Y'
															}
															rules={[{ required: true, validateTrigger: 'none' }]}
															disabled={
																formDisabled ||
																formInitDataRef.current.rowStatus === 'I' ||
																userInfo.repUserIdYn === 'Y'
															}
															onChange={() => {
																onChangeForm();
															}}
														/>
													</li>
													<li>
														<DatePicker
															name="usevaliddate"
															label={t('lbl.USEVALIDDATE')}
															required={
																formInitDataRef.current.rowStatus !== 'I' && formInitDataRef.current.tempYn !== 'Y'
															}
															rules={[{ required: true, validateTrigger: 'none' }]}
															disabled={
																formDisabled ||
																formInitDataRef.current.rowStatus === 'I' ||
																userInfo.repUserIdYn === 'Y'
															}
															onChange={() => {
																onChangeForm();
															}}
														/>
													</li>
													<li>
														<SelectBox
															name={'status'}
															label={t('lbl.STATUS')}
															// initval={userInfo.repUserIdYn === 'Y' ? '00' : '90'}
															placeholder="선택해주세요"
															options={statusUserList}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
															disabled={
																formDisabled ||
																formInitDataRef.current.rowStatus === 'I' ||
																userInfo.repUserIdYn === 'Y'
															}
														/>
													</li>
													<li>
														<SelectBox
															name={'delYn'}
															label={t('lbl.DEL_YN')}
															// initval={'N'}
															placeholder="선택해주세요"
															options={getCommonCodeList('DEL_YN')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
															disabled={
																formDisabled ||
																formInitDataRef.current.rowStatus === 'I' ||
																userInfo.repUserIdYn === 'Y'
															}
														/>
													</li>
													{formInitDataRef.current.nonRegularYn === 'Y' && (
														<li>
															<CheckBox name={'ssoUseYn'} label={t('SSO 사용여부')} disabled={formDisabled} />
														</li>
													)}
												</UiDetailViewGroup>
											</UiDetailViewArea>
										</AGrid>
									</div>
								</ScrollBox>
							</CustomForm>,
						]}
					/>,
					<Splitter
						key="cmUserDetail-bottom-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid>
									<Form disabled={formDisabled}>
										<GridTopBtn gridBtn={gridBtnConnect} gridTitle={t('lbl.CENTER')} totalCnt={totalCntConnect} />
									</Form>
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefConnect} columnLayout={gridColConnect} gridProps={gridPropsConnect} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid>
									<Form
										disabled={
											formDisabled ||
											formInitDataRef.current.rowStatus === 'I' ||
											!emptypeAddList.some(item => item.comCd === formInitDataRef.current.empType)
											// 로그인 한 사용자가 정규직일 경우 권한 변경 불가
											// || userInfo.repUserIdYn !== 'Y'
										}
									>
										<GridTopBtn
											gridBtn={gridBtnAuthority}
											gridTitle={t('lbl.AUTHORITYGRP')}
											totalCnt={totalCntAuthority}
										/>
									</Form>
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefAuthority} columnLayout={gridColAuthority} gridProps={gridPropsAuthority} />
								</GridAutoHeight>
							</>,
						]}
					/>,
				]}
				style={{ paddingBottom: 15 }}
			/>

			<CustomModal ref={refModal} width="700px">
				<CmIndividualPopup popUpParams={popUpParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default CmUserDetail;

const CustomForm = styled(Form)`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;
