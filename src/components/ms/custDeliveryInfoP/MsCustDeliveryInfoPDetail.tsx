/*
 ############################################################################
 # FiledataField	: MsCustDeliveryInfoPDetail.tsx
 # Description		: 기준정보 > 거래처기준정보 > 협력사집하조건 
 # Author			: JeongHyeongCheol
 # Since			: 25.08.22
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Components
import CmMapPopup from '@/components/cm/popup/CmMapPopup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button, InputNumber, InputSearch, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import MsCustDeliveryInfoFileUploadPopup from '@/components/ms/custDeliveryInfo/MsCustDeliveryInfoFileUploadPopup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Input } from 'antd';
import dayjs from 'dayjs';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// API Call Function
import { apiGetMaster, apiPostSaveMaster } from '@/api/ms/apiMsCustDeliveryInfoP';

// util
import { showConfirm, showMessage } from '@/util/MessageUtil';

// types
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// hooks
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import Accordion, { AccordionItem } from '@/components/common/Accordion';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import styled from 'styled-components';
interface MsCustDeliveryInfoPDetailProps {
	form?: any;
	gridData?: Array<object>;
	setCurrentPage?: any;
	totalCount?: number;
	gridRef2?: any;
	gridRef3?: any;
	locationParam?: any;
}
const MsCustDeliveryInfoPDetail = forwardRef((props: MsCustDeliveryInfoPDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, setCurrentPage, totalCount, gridData, gridRef2, gridRef3, locationParam } = props;
	const { t } = useTranslation();

	const modalExcelRef = useRef(null);
	const mapModalRef = useRef(null);
	const carnoRef = useRef(null);
	const tableRef = useRef(null);
	const [carno, setCarno] = useState('');
	const [carType, setCarType] = useState('');
	const [totalCnt, setTotalCnt] = useState(0);
	// 기존정보
	const beforeData = useRef(null);

	// 이미지 업로드
	const [custkey, setCustkey] = useState('');
	const [code, setCode] = useState('');
	const [customPopupTitle, setCustomPopupTitle] = useState('');
	const imageRef = useRef(null);

	const [formDisabled, setFormDisabled] = useState(true);

	// 지도 관련 상태
	const [searchAddr, setSearchAddr] = useState('');
	const NUMBER_PATTERN = /^\d+$/;
	const [radius, setRadius] = useState('');
	const [stytime, setStytime] = useState('');

	// 개인정보 팝업
	const refModalIndividualPop = useRef(null);
	const [popUpParams, setPopUpParams] = useState({});
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	// 거래처 유형명
	const custtypedescrLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	};
	// 검수 유형
	const inspecttypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('INSPECTTYPE_WD', value)?.cdNm;
	};
	// 상태명
	const statusLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STATUS_CUST', value)?.cdNm;
	};
	// 상태명
	const loadconditionFunc = (rowIndex: any, columnIndex: any, value: any) => {
		if (value?.length === 4) {
			// 숫자를 문자열로 변환하고, 앞 두 자리와 뒤 두 자리를 분리합니다.
			const hour = value.substring(0, 2);
			const minute = value.substring(2, 4);
			// 시와 분을 콜론(:)으로 연결하여 반환합니다.
			return `${hour}:${minute}`;
		}
		return value;
	};
	// // 업장키여부
	// const keytypeFunc = (rowIndex: any, columnIndex: any, value: any) => {
	// 	return getCommonCodebyCd('STATUS_CUST', value)?.cdNm;
	// };

	// 그리드 초기화 - 목록 그리드
	const gridCol1 = [
		{
			dataField: 'custkey',
			headerText: t('lbl.PARTNER_CD'), // 협력사코드
			width: 80,
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		{
			dataField: 'custname',
			headerText: t('lbl.PARTNER_NAME'), // 협력사명
			width: 140,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'vatNo',
			headerText: t('lbl.VATNO_1'), // 사업자등록번호
			width: 110,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (value && value.length === 10) {
					return value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
				}
				return value;
			},
		},
		{
			dataField: 'empname1',
			headerText: '협력사 납품 담당자', // 협력사 납품 담당자
			width: 110,
		},
		{
			dataField: 'email',
			headerText: '담당자 e-mail',
			width: 180,
		},
		{
			dataField: 'cust3pl',
			headerText: '3PL업체명', // 3PL 업체명
			width: 100,
		},
		{
			dataField: 'name3pl',
			headerText: '3PL담당자', // 3PL 담당자
			width: 100,
		},
		{
			dataField: 'procLogiYn',
			headerText: '조달여부', // 조달여부
			width: 80,
			dataType: 'code',
		},
		{
			dataField: 'loadcondition1',
			headerText: '입차시작시간',
			width: 80,
			labelFunction: loadconditionFunc,
		},
		{
			dataField: 'loadcondition2',
			headerText: '입차종료시간',
			width: 80,
			labelFunction: loadconditionFunc,
		},
		{
			dataField: 'status',
			labelFunction: statusLabelFunc,
			width: 60,
			headerText: t('lbl.STATUS'), // 진행상태
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			width: 100,
			dataType: 'manager',
			managerDataField: 'addwho',
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.CREATEDATE'),
			width: 160,
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			width: 100,
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.MODIFYDATE'),
			width: 160,
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		// {
		// 	dataField: 'dlvcustkey',
		// 	headerText: t('lbl.TO_CUSTKEY'), // 배송인도처코드
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'dlvcustname',
		// 	headerText: t('lbl.TO_CUSTNAME'), // 배송인도처명
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// },
		// {
		// 	dataField: 'empphone1',
		// 	headerText: '담당자 연락처',
		// },
		// {
		// 	dataField: 'address1',
		// 	headerText: t('lbl.ADDRESS1'), // 기본주소
		// },
		// {
		// 	dataField: 'dropcustkey',
		// 	headerText: t('lbl.DROPCUSTKEY'), // 영업인도처
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'custtype',
		// 	headerText: t('lbl.CUSTTYPE'), // 고객유형
		// 	labelFunction: custtypedescrLabelFunc,
		// },
		// {
		// 	dataField: 'dropcustname',
		// 	headerText: t('lbl.DROPCUSTNAME'), // 영업인도처명
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// },
		// {
		// 	dataField: 'inspecttype',
		// 	headerText: t('lbl.INSPECTTYPE'), // 검수유형
		// 	labelFunction: inspecttypeLabelFunc,
		// },
		// // {
		// // 	dataField: 'keytype',
		// // 	headerText: '업장key여부',
		// // 	labelFunction: keytypeFunc,
		// // },

		// // 	dataField: 'addwho',
		// // 	headerText: t('lbl.ADDWHO'),
		// // 	visible: false,
		// // },
		// {
		// 	dataField: 'dlvDccode',
		// 	headerText: t('lbl.DLV_DCCODE'), // 주출고처
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'adddate',
		// 	headerText: t('lbl.CREATEDATE'),
		// 	dataType: 'date',
		// 	formatString: 'yyyy-mm-dd hh:MM:ss',
		// },
		// {
		// 	dataField: 'editwho',
		// 	headerText: t('lbl.EDITWHO'),
		// 	visible: false,
		// },
	];
	// 그리드 속성- 목록 그리드
	const gridProps1 = {
		editable: false,
		enableFilter: true,
	};
	// 그리드 초기화 - 협력사 추가정보 그리드
	const gridCol2 = [
		{
			dataField: 'gubun',
			headerText: t('lbl.GUBUN_2'),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('VENDOR-RCV-GUBUN'),
			},
			required: true,
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.PARTNER_CD'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.PARTNER_NAME'),
			filter: {
				showIcon: true,
			},
			required: true,
			width: 100,
		},
		{
			dataField: 'smsYn',
			headerText: 'SMS 수신유무',
			width: 120,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN2'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return item.gubun !== '1001';
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.gubun !== '1001') {
					// 편집 가능 class 삭제
					gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'mailYn',
			headerText: '메일 수신유무',
			width: 120,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN2'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return item.gubun !== '1001';
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.gubun !== '1001') {
					// 편집 가능 class 삭제
					gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'name',
			headerText: t('lbl.NAME'),
			required: true,
		},
		{
			dataField: 'phone',
			headerText: t('lbl.PHONE'),
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			required: true,
		},
		{
			dataField: 'email',
			headerText: t('lbl.EMAIL'),
			width: 100,
			required: true,
		},
		{
			dataField: 'etc',
			headerText: t('lbl.ETC'),
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN').filter((item: any) => {
					return item.comCd === 'Y' || item.comCd === 'N';
				}),
			},
		},
	];
	// 그리드 초기화 - 협력사 담당자 정보 그리드
	const gridCol3 = [
		{
			dataField: 'custkey',
			headerText: t('협력사코드'),
		},
		{
			dataField: 'persontype',
			headerText: t('구분'),
		},
		{
			dataField: 'persontypeNm',
			headerText: t('구분명'),
		},
		{
			dataField: 'empname',
			headerText: t('이름'),
		},
		{
			dataField: 'empphone',
			headerText: t('전화번호'),
		},
	];
	// 그리드 속성 - 협력사 추가정보 그리드
	const gridProps2 = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		autoGridHeight: false,
		showCustomRowCheckColumn: true,
	};
	// 그리드 속성 - 협력사 담당자 정보 그리드
	const gridProps3 = {
		editable: false,
		autoGridHeight: false,
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 상세정보 호출
	 * @param {any} values 조회 데이터
	 * @returns {void}
	 */
	const searchMaster = (values: any) => {
		const params = {
			...values,
			toCustkey: values?.custkey,
		};

		apiGetMaster(params).then(res => {
			const masterData = res.data.masterDto;
			const detailData = res.data.masterDetailDto;
			const personData = res.data.masterPersonDto;

			form.resetFields();
			gridRef2.current.clearGridData();
			gridRef3.current.clearGridData();
			if (masterData) {
				const padTime = (timeStr: string) => {
					// 4자리로 만들고 앞에 '0'을 채움 (예: '95' -> '0095')
					return String(timeStr).padStart(4, '0').slice(-4);
				};

				let formattedVatno = masterData.vatno;
				if (formattedVatno && formattedVatno.length === 10) {
					formattedVatno = formattedVatno.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
				}

				form.setFieldsValue({
					...masterData,
					procLogiYn: masterData.procLogiYn || 'N',
					vatno: formattedVatno,
					tplOperDt: masterData.tplOperDt ? dayjs(masterData.tplOperDt, 'YYYYMMDD') : null,
					loadcondition1: masterData.loadcondition1 ? dayjs(masterData.loadcondition1, 'HHmm') : '',
					loadcondition2: masterData.loadcondition2 ? dayjs(masterData.loadcondition2, 'HHmm') : '',
					stytime: masterData.stytime ? dayjs(padTime(masterData.stytime), 'HHmm') : '',

					// 상세 API 응답(masterData) 대신 그리드 행 데이터(values)에서 이름을 가져옵니다.
					addwhoDisplay: values?.regNm ? `${values.regNm}` : masterData.addwho,
					editwhoDisplay: values?.updNm ? `${values.updNm}` : masterData.editwho,

					rowStatus: 'R',
				});
				setFormDisabled(false);

				beforeData.current = masterData;

				if (masterData?.procLogiStartDt && masterData?.procLogiEndDt) {
					form.setFieldValue('procLogiDate', [dayjs(masterData.procLogiStartDt), dayjs(masterData.procLogiEndDt)]);
				}
			}

			if (detailData.length > 0) {
				gridRef2.current.setGridData(detailData);
				// setTotalCnt(detailData.length);
				const colSizeList2 = gridRef2.current.getFitColumnSizeList(true);
				gridRef2.current.setColumnSizeList(colSizeList2);
			}

			if (personData.length > 0) {
				gridRef3.current.setGridData(personData);
				// setTotalCnt(personData.length);
				const colSizeList3 = gridRef3.current.getFitColumnSizeList(true);
				gridRef3.current.setColumnSizeList(colSizeList3);
			}
		});
	};

	/**
	 * 상세정보 수정사항 저장
	 * @returns {void}
	 */
	const saveMaster = async () => {
		// 변경 데이터 확인
		const detailParams = gridRef2.current.getChangedData({ validationYn: false });
		// const detailParams = gridRef3.current.getChangedData({ validationYn: false }); // 3번 그리드에 대한 정보 어떻게 가져갈지 생각필요
		const masterParams = form.getFieldsValue(true);
		const isFormChange = form.getFieldValue('rowStatus') === 'U';
		// api전송용 객체
		const apiMasterParams = { ...masterParams };

		if (!isFormChange && (!detailParams || detailParams.length < 1)) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		// 상세내역 유효성
		if (isFormChange) {
			const isValid = await validateForm(form);
			if (!isValid) {
				return;
			}

			if (apiMasterParams.procLogiYn === 'Y' && !(apiMasterParams?.loadcondition1 || apiMasterParams?.loadcondition2)) {
				showMessage({
					content: '입차시간 값을 입력해주세요.',
					modalType: 'info',
				});
				return;
			}
			// 조달계약기간 data 정제
			const [procLogiStartDt, procLogiEndDt] = apiMasterParams?.procLogiDate || [null, null];

			if (procLogiStartDt && procLogiEndDt) {
				apiMasterParams.procLogiStartDt = procLogiStartDt.format('YYYYMMDD');
				apiMasterParams.procLogiEndDt = procLogiEndDt.format('YYYYMMDD');
			}

			// 입차시간 data 정제
			if (apiMasterParams?.loadcondition1 && apiMasterParams?.loadcondition2) {
				apiMasterParams.loadcondition1 = apiMasterParams.loadcondition1.format('HHmm');
				apiMasterParams.loadcondition2 = apiMasterParams.loadcondition2.format('HHmm');
			}

			// 체류시간
			if (apiMasterParams?.stytime) {
				apiMasterParams.stytime = apiMasterParams.stytime.format('HHmm');
			}

			// 사업자등록번호 하이픈 제거
			if (apiMasterParams?.vatno) {
				apiMasterParams.vatno = apiMasterParams.vatno.replace(/-/g, '');
			}

			// 3PL운영시작일 format 변경
			if (apiMasterParams?.tplOperDt) {
				apiMasterParams.tplOperDt = apiMasterParams.tplOperDt.format('YYYYMMDD');
			}
		}
		// detail grid
		if (detailParams.length > 0) {
			// detailGrid 유효성
			if (!gridRef2.current.validateRequiredGridData()) {
				return;
			}
			// PK validation
			if (
				!gridRef2.current.validatePKGridData([
					'gubun',
					'custkey',
					'custname',
					'smsYn',
					'mailYn',
					'name',
					'phone',
					'email',
				])
			) {
				return;
			}
			const isValidEmail = (email: string) => {
				// 이메일 유효성 검사
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return emailRegex.test(email);
			};

			// email 유효성 검사 수행
			const emailCheck = detailParams.some((item: any) => {
				return !isValidEmail(item.email);
			});

			if (emailCheck) {
				showMessage({
					content: '올바른 이메일 형식이 아닙니다.',
					modalType: 'info',
				});
				return; // 함수 실행을 여기서 중단
			}
		}
		const params = {
			master: isFormChange ? apiMasterParams : null,
			excelList: detailParams.length > 0 ? detailParams : null,
			toCustkey: custkey,
			beforeData: beforeData.current,
		};

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveMaster(params).then(() => {
				gridRef.current.setSelectedRowValue(params.master);
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						const selectedRow = gridRef.current.getSelectedRows()[0];
						searchMaster(selectedRow);
					},
				});
			});
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
		};

		return gridBtn;
	};

	const setGridBtn2 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef2, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'plus', // 행추가
					initValues: {
						rowStatus: 'I',
					},
				},
				{
					btnType: 'delete', // 행삭제
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 상세 표 버튼 설정
	 * @returns {TableBtnPropsType} 표 버튼 설정 객체
	 */
	const setTableBtn = () => {
		const tableBtn: TableBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'pre', // 이전
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						// TO-DO : 각자 업무화면에서 Form 변경 감지 체크
						if (form.getFieldValue('rowStatus') === 'U') {
							showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
								// 그리드 이전 Row 선택 Function
								gridRef.current.setPrevRowSelected();
							});
						} else {
							gridRef.current.setPrevRowSelected();
						}
					},
				},
				{
					btnType: 'post', // 다음
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						// TO-DO : 각자 업무화면에서 Form 변경 감지 체크
						if (form.getFieldValue('rowStatus') === 'U') {
							showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
								// 그리드 다음 Row 선택 Function
								gridRef.current.setNextRowSelected();
							});
						} else {
							gridRef.current.setNextRowSelected();
						}
					},
				},
				{
					btnType: 'save', // 저장
					callBackFn: saveMaster,
				},
			],
		};

		return tableBtn;
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		const key = Object.keys(changedValues);
		const value = Object.values(changedValues);
		if (Object.keys(changedValues).length > 0) {
			// 변경된 값이 있을 때만 처리
			form.setFieldValue('rowStatus', 'U');
		} else {
			form.setFieldValue('rowStatus', 'R');
		}

		if (key.includes('address1') && value.includes('')) {
			form.setFieldsValue({
				address1: '',
				address2: '',
				latitude: '',
				longitude: '',
			});
		}

		if (changedValues.radius) {
			setRadius(changedValues.radius);
		}
		if (changedValues.stytime) {
			setStytime(changedValues.stytime.format('HHmm'));
		}
	};

	/**
	 * =====================================================================
	 *  popup 관련 함수
	 * =====================================================================
	 */
	/**
	 * 엑셀 업로드 팝업
	 */
	const excelUpload = () => {
		modalExcelRef.current.handlerOpen();
	};

	/**
	 * 이미지 업로드 팝업
	 * @param type
	 * @param title
	 */
	const imageUpload = (type: any, title?: string) => {
		const custkey = form.getFieldValue('custkey');
		setCustkey(custkey);
		setCode(type);
		setCustomPopupTitle(title || '');
		imageRef.current.handlerOpen();
	};

	/**
	 * 위/경도 조회 지도
	 */
	const searchMap = () => {
		const address = form.getFieldValue('address1');
		setSearchAddr(address || '');
		mapModalRef.current.handlerOpen();
	};

	/**
	 * 지도 팝업 콜백 함수 (좌표)
	 * @param num
	 * @returns {string} 소수점 절삭
	 */
	const fixValue = (num: number): string => {
		// Math.trunc(num * 10000)을 이용해 버림 처리 후, 10000으로 나눔
		const truncatedNum = Math.trunc(num * 10000) / 10000;

		// toFixed(4)를 이용해 4자리 문자열 형식으로 변환
		return truncatedNum.toFixed(4);
	};

	/**
	 * 지도 팝업 콜백 함수 (좌표)
	 * @param {Array} searchLatLng 검색된 좌표 [경도, 위도]
	 */
	const handleMapCallback = (searchLatLng: [number, number]) => {
		if (searchLatLng && searchLatLng?.length === 2 && gridRef.current) {
			const [latitude, longitude] = searchLatLng;
			form.setFieldValue('rowStatus', 'U');
			// 선택된 행의 경도, 위도 업데이트
			form.setFieldValue('longitude', fixValue(longitude));
			form.setFieldValue('latitude', fixValue(latitude));

			mapModalRef.current?.handlerClose();
		}
	};

	/**
	 * 지도 팝업 콜백 함수 (주소)
	 * @param {object} addressInfo 주소 정보
	 */
	const handleAddressCallback = (addressInfo: any) => {
		if (addressInfo?.fullAddress && gridRef.current) {
			form.setFieldValue('address1', addressInfo.fullAddress3);
		}
	};

	/**
	 * 차량번호 팝업조회
	 * @returns {void}
	 */
	const samedayCarno = () => {
		const carno = form.getFieldValue('procSamedayCarno');
		if (carno) {
			setCarno(carno);
		}
		setCarType('sameday');
		carnoRef.current.handlerOpen();
	};

	/**
	 * 차량번호 팝업조회
	 * @returns {void}
	 */
	const storagCarno = () => {
		const carno = form.getFieldValue('procStorageCarno');
		if (carno) {
			setCarno(carno);
		}
		setCarType('storag');
		carnoRef.current.handlerOpen();
	};

	/**
	 * 차량번호 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		if (carType === 'sameday') {
			form.setFieldValue('procSamedayCarno', selectedRow[0].code);
		}
		if (carType === 'storag') {
			form.setFieldValue('procStorageCarno', selectedRow[0].code);
		}
		form.setFieldValue('rowStatus', 'U');
		carnoRef.current.handlerClose();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		mapModalRef.current?.handlerClose();
		carnoRef.current?.handlerClose();
		modalExcelRef.current?.handlerClose();
		// imageRef.current?.handlerClose();
	};

	/**
	 * =====================================================================
	 *  그리드 이벤트 설정
	 * =====================================================================
	 */
	let prevRowIndex: any = null;
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 선택전에 실행
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionConstraint', function (event: any) {
			const { toRowIndex } = event;
			if (form.getFieldValue('rowStatus') === 'U') {
				// selectionConstraint에서는 즉시 false를 반환하여 선택을 일단 막음
				// 그 후 별도의 함수에서 confirm을 띄우고 수동으로 선택 처리
				handleBlockedSelection(toRowIndex);
				return false;
			}
		});

		// selectionConstraint에서 호출될 함수
		const handleBlockedSelection = (rowIndex: any) => {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				gridRef?.current.setSelectionByIndex(rowIndex);
			});
		};

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.item?._$uid;

			const primeCell = event.primeCell;
			setCustkey(primeCell.item?.custkey);
			searchMaster(primeCell.item);
		});

		gridRef2.current?.bind('cellDoubleClick', async (event: { dataField: string; value: any; rowIndex: number }) => {
			const params = {
				url: 'api/ms/custDeliveryInfoP/v1.0/getDetailList', // 팝업 URL 설정
				individualKey: '',
				individualColId: event.dataField, // 개인정보 복호화 컬럼값
				serialkey: gridRef2.current?.getCellValue(event.rowIndex, 'serialkey'), // 1건 조회하는 key 설정
				// custkey: gridRef2.current?.getCellValue(event.rowIndex, 'custkey'), // 1건 조회하는 key 설정
				// gubun: gridRef2.current?.getCellValue(event.rowIndex, 'gubun'), // 1건 조회하는 key 설정
				method: 'post',
			}; // 팝업 파라미터 초기화

			// 수신자
			if (event.dataField === 'name') {
				params.individualKey = 'userNm'; // 개인정보 키 설정(userNm: 수령자명)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'phone') {
				params.individualKey = 'handphoneNo'; // 개인정보 키 설정(userNm: 주문자명)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'email') {
				params.individualKey = 'email'; // 개인정보 키 설정(handphoneNo: 휴대폰번호)
				fnCmIndividualPopup(params);
			}
		});
		/**
		 * 에디팅 시작 이벤트 바인딩
		 * @param {any} event 이벤트
		 */
		gridRef2.current?.bind('cellEditBegin', function (event: any) {
			// sms, 메일 수신여부 구분이 상품일 경우에만 수정가능
			if (event.dataField === 'smsYn' || event.dataField === 'mailYn') {
				if (event.item.gubun === '1001') {
					return true;
				} else {
					return false;
				}
			}

			// name, phone, email 필드는 신규 행('I')이 아닌 기존 데이터일 때 마우스 더블클릭으로 편집 모드 진입 방지
			// event.which === 'doubleClick' 일 때 막음으로써, F2키나 바로 타이핑을 통한 기존 데이터 수정은 허용함
			if (['name', 'phone', 'email'].includes(event.dataField)) {
				if (event.item.rowStatus !== 'I' && event.which === 'doubleClick') {
					return false;
				}
			}
			return true;
		});
		// 더블 클릭 시
		gridRef3.current?.unbind('cellDoubleClick');
		gridRef3.current?.bind('cellDoubleClick', async (event: { dataField: string; value: any; rowIndex: number }) => {
			const params = {
				url: 'api/ms/custDeliveryInfoP/v1.0/getMasterPersonDetail', // 팝업 URL 설정
				individualKey: '',
				individualColId: event.dataField, // 개인정보 복호화 컬럼값
				serialkey: gridRef3.current?.getCellValue(event.rowIndex, 'serialkey'), // 1건 조회하는 key 설정
				method: 'post',
			}; // 팝업 파라미터 초기화
			// 수신자
			if (event.dataField === 'empname') {
				params.individualKey = 'userNm'; // 개인정보 키 설정(userNm: 수령자명)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'empphone') {
				params.individualKey = 'handphoneNo'; // 개인정보 키 설정(userNm: 주문자명)
				fnCmIndividualPopup(params);
			}
		});
		/**
		 * 에디팅 종료 이벤트 바인딩
		 * @param {any} event 이벤트
		 */
		gridRef2.current?.bind('cellEditEnd', function (event: any) {
			// 구분이 상품이 아닌경우 sms,메일 수신여부 Y
			if (event.dataField === 'gubun') {
				const updateParam = {
					smsYn: '',
					mailYn: '',
				};
				if (event.value !== '1001' && event.value !== null) {
					updateParam.smsYn = 'Y';
					updateParam.mailYn = 'Y';
				}
				gridRef2.current.updateRow(updateParam, event.rowIndex);
			}
			if (event.dataField === 'phone') {
				const phoneNumber = event.value; // 사용자가 입력한 값

				let formattedNumber = '';

				// 전화번호 길이에 따라 하이픈 추가
				if (phoneNumber.length === 10) {
					formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
				} else if (phoneNumber.length === 11) {
					formattedNumber = phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
				} else {
					// 10자리 또는 11자리가 아닌 경우, 원본 값을 유지하거나 사용자에게 알릴 수 있습니다.
					formattedNumber = phoneNumber;
				}

				// 그리드 셀의 값을 변경된 형식으로 업데이트
				gridRef2.current?.setCellValue(event.rowIndex, 'phone', formattedNumber);
			}
		});
	};

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount,
	});

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	/**
	 * 팝업 열기 이벤트
	 * @param params
	 */
	const fnCmIndividualPopup = (params: any) => {
		setPopUpParams(params);
		refModalIndividualPop.current.handlerOpen();
	};
	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent01 = () => {
		refModalIndividualPop.current.handlerClose();
	};
	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		if (gridData.length > 0) {
			gridRef.current.appendData(gridData);
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			// const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			// gridRef.current.setColumnSizeList(colSizeList);
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef2.current) {
			gridRef2.current.clearGridData();
		}
		if (gridRef3.current) {
			gridRef3.current.clearGridData();
		}
	}, [totalCount]);

	// 바로가기로 접근시 바로 상세조회
	useEffect(() => {
		if (locationParam.custkey) {
			searchMaster(locationParam);
		}
	}, [locationParam]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	// * 추가정보 테이블 아코디언 요소
	const addGridAccItems: AccordionItem[] = [
		{
			key: 'add-grid-panel',
			children: (
				<>
					<AGrid style={{ height: 'auto' }}>
						<GridTopBtn gridBtn={setGridBtn2()} />
					</AGrid>
					<GridAutoHeight height={300}>
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
					</GridAutoHeight>
				</>
			),
		},
	];

	// * 조달정보 그리드 아코디언 요소
	const procurementAccItems: AccordionItem[] = [
		{
			key: 'procurement-panel',
			label: (
				<>
					<AGrid style={{ height: 'auto', marginBottom: 0, paddingBottom: 5 }}>
						<GridTopBtn gridTitle="조달정보">
							<Button onClick={() => imageUpload('12', '협력사입구 첨부파일 업로드')}>협력사입구</Button>
							<Button onClick={() => imageUpload('13', '상품상차냉동 첨부파일 업로드')}>상품상차냉동</Button>
							<Button onClick={() => imageUpload('14', '상품상차냉장 첨부파일 업로드')}>상품상차냉장</Button>
							<Button onClick={() => imageUpload('15', '상품상차상온 첨부파일 업로드')}>상품상차상온</Button>
						</GridTopBtn>
					</AGrid>
					<AGrid style={{ height: 'auto', marginBottom: 0 }}>
						<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
							<li>
								<SelectBox
									label={'조달여부'}
									name="procLogiYn"
									initval="N"
									options={getCommonCodeList('YN2')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li>
							<li>
								<Rangepicker
									label={t('조달계약기간')}
									name="procLogiDate"
									format="YYYY-MM-DD"
									allowClear
									showNow={false}
									disabled={formDisabled}
								/>
							</li>
						</UiDetailViewGroup>
					</AGrid>
				</>
			),
			children: (
				<UiDetailViewGroupWrap>
					<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
						<li>
							<InputSearch
								label={'조달일배차량번호'}
								name="procSamedayCarno"
								disabled={formDisabled}
								onSearch={samedayCarno}
							/>
						</li>
						<li>
							<InputSearch
								label={'조달저장차량번호'}
								name="procStorageCarno"
								disabled={formDisabled}
								onSearch={storagCarno}
							/>
						</li>
						<li>
							<InputText label={'입차요청요일'} name="reqdlvweek" />
						</li>
						<li className="range-align">
							<Col span={15} className="pd0">
								{/* <InputText label={t('입차시간')} name="loadcondition1" type="number" required /> */}
								<DatePicker
									label={t('lbl.UNLOADTIME')}
									name="loadcondition1"
									format="HH:mm"
									picker="time"
									placeholder={'시분 선택'}
									showNow={false}
									// onChange={onChange}
									allowClear
									disabled={formDisabled}
									// required
									// rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</Col>
							<span>~</span>
							<Col span={8} className="pd0">
								{/* <InputText name="loadcondition2" type="number" required /> */}
								<DatePicker
									name="loadcondition2"
									format="HH:mm"
									picker="time"
									placeholder={'시분 선택'}
									showNow={false}
									// onChange={onChange}
									allowClear
									disabled={formDisabled}
									// required
									// rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</Col>
						</li>
						<li style={{ gridColumn: 'span 2' }}>
							<InputText label={'하역조건'} name="unloadcondition1" />
						</li>
						<li>
							<InputText label={t('lbl.ENTRYCONDITION')} name="entrycondition1" />
						</li>
						<li>
							<InputNumber label={t('lbl.DELIVERYPRIORITY')} name="priority" />
						</li>
						<li>
							<InputText label={t('lbl.KEYPLACE')} name="keyplace" />
						</li>
						<li>
							<SelectBox
								label={'KEYTYPE'}
								name="keytype"
								options={getCommonCodeList('STATUS_CUST')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
							/>
						</li>
					</UiDetailViewGroup>
				</UiDetailViewGroupWrap>
			),
		},
	];

	// * 조달여부 값 감시
	const procLogiYn = Form.useWatch('procLogiYn', form);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						{/* 목록영역 */}
						<AGrid style={{ height: 'auto', marginBottom: 0, paddingBottom: 5 }}>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={setGridBtn()} totalCnt={totalCount} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
					<>
						<CustomForm form={form} onValuesChange={onValuesChange} disabled={formDisabled}>
							<AGrid style={{ height: 'auto', marginBottom: 0, paddingTop: 10, paddingBottom: 5 }}>
								<TableTopBtn tableTitle={t('협력사 기본정보')} tableBtn={setTableBtn()} className="fix-title" />
							</AGrid>
							<ScrollBox>
								<div>
									<>
										{/* 협력사 기본정보 영역 */}

										<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
											<Form.Item name="rowStatus" hidden>
												<Input />
											</Form.Item>
											<li>
												<InputText label={t('lbl.PARTNER_CD')} name="custkey" required disabled />
											</li>
											<li>
												{/* 협력사유형 */}
												<SelectBox
													label={t('lbl.SUPPLIER') + t('lbl.TYPE')}
													name="custtype"
													options={getCommonCodeList('CUSTTYPE')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													disabled
													required
												/>
											</li>
											<li>
												{/* 배송인도처코드*/}
												<InputText label={t('lbl.TO_CUSTKEY')} name="dlvcustkey" required disabled />
											</li>
											<li>
												{/*영업인도처*/}
												<InputText label={t('lbl.DROPCUSTKEY')} name="dropcustkey" required disabled />
											</li>
											<li>
												{/* 협력사명*/}
												<InputText label={t('lbl.PARTNER_NAME')} name="custname" disabled />
											</li>
											<li>
												{/* 물류센터 */}
												<InputText label={t('lbl.DCCODE')} name="dlvDccode" disabled />
											</li>
											<li>
												{/* 사업자등록번호 */}
												<InputText label={t('사업자등록번호')} name="vatno" disabled />
											</li>
											<li>
												{/* 대표자명 */}
												<InputText label={t('대표자명')} name="vatowner" disabled />
											</li>
											<li>
												{/* 사업자등록우편번호 */}
												<InputText label={t('사업자등록우편번호')} name="zipcode" disabled />
											</li>
											<li>
												{/* 대표 전화번호 */}
												<InputText label={t('대표 전화번호')} name="phone1" disabled />
											</li>
											<li>
												{/* 사업자등록기본주소 */}
												<InputText label={t('사업자등록 기본주소')} name="address1" disabled />
											</li>
											<li>
												{/* 상세주소 */}
												<InputText label={t('상세주소')} name="address2" disabled />
											</li>
											<li>
												{/* 진행상태 */}
												<SelectBox
													label={t('진행상태')}
													name="status"
													options={getCommonCodeList('STATUS_CUST')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													disabled
												/>
											</li>
											<li></li>
											<li>
												<InputText label={t('lbl.ADDWHO')} name="addwhoDisplay" disabled />
											</li>
											<li>
												<InputText label={t('lbl.ADDDATE')} name="adddate" disabled />
											</li>
											<li>
												<InputText label={t('lbl.EDITWHO')} name="editwhoDisplay" disabled />
											</li>
											<li>
												<InputText label={t('lbl.EDITDATE')} name="editdate" disabled />
											</li>
											{/* <li>
								<SelectBox
									label={t('lbl.DISTRICTTYPE')} // 권역 구분
									name="districttype"
									options={getCommonCodeList('COURIER')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									required
								/>
							</li>
							<li>
								<SelectBox
									label={t('lbl.DISTRICTGROUP')} // 권역그룹
									name="districtgroup"
									options={getCommonCodeList('DISTRICTGROUP')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									required
								/>
							</li>
							<li>
								<InputText label={t('lbl.DISTRICTCODE')} name="districtcode" />
							</li>
							<li>
								<SelectBox
									label={t('lbl.DEL_YN')}
									name="delYn"
									options={getCommonCodeList('DEL_YN', t('lbl.ALL'))}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li>
							<li>
								<InputText label={t('lbl.ADDWHO')} name="addwho" disabled />
							</li>
							<li>
								<InputText label={t('lbl.ADDDATE')} name="adddate" disabled />
							</li>
							<li>
								<InputText label={t('lbl.EDITWHO')} name="editwho" disabled />
							</li>
							<li>
								<InputText label={t('lbl.EDITDATE')} name="editdate" disabled />
							</li> */}
										</UiDetailViewGroup>
									</>
									<>
										{/* 협력사담당자 정보(알림톡 발송대상) 영역 */}
										<AGrid style={{ height: 'auto', marginBottom: 0, flex: 'none', paddingTop: 10 }}>
											<GridTopBtn gridTitle={'협력사담당자 정보(알림톡 발송대상)'} />
										</AGrid>
										<GridAutoHeight height={150}>
											<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
										</GridAutoHeight>
									</>
									<>
										{/* 추가정보 영역 */}
										<GridTopBtn gridTitle="추가정보" style={{ marginBottom: 0, paddingTop: 10 }} />
										<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
											{/* <li style={{ gridColumn: 'span 2' }} className="flex-wrap">
								<InputText label={t('lbl.ADDRESS1')} name="address1" />
								<span>
									<Button name="map" onClick={searchMap}>
										지도찾기
									</Button>
								</span>
							</li>
							<li style={{ gridColumn: 'span 2' }}>
								<InputText label={t('lbl.ADDRESS2')} name="address2" />
							</li>
							<li>
								<InputNumber name="latitude" label={t('lbl.LATITUDE')} readOnly />
							</li>
							<li>
								<InputNumber name="longitude" label={t('lbl.LONGITUDE')} readOnly />
							</li>
							<li>
								<InputText
									label={t('lbl.RADIUS')}
									name="radius"
									rules={[
										{
											pattern: NUMBER_PATTERN,
											message: '숫자만 입력 가능합니다.',
										},
									]}
								/>
							</li>
							<li>
								<DatePicker
									label={t('lbl.STYTIME')}
									name="stytime"
									format="HH:mm"
									picker="time"
									placeholder={'시분 선택'}
									showNow={false}
									allowClear
									// required
								/>
							</li> */}
											<li>
												<InputText label={'협력사 납품 담당자'} name="empname1" />
											</li>
											<li>
												<InputText
													label={'담당자 연락처'}
													name="empphone1"
													rules={[{ pattern: /^01[016789]\d{7,8}$/, message: '올바른 휴대폰 번호 형식이 아닙니다.' }]}
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText
													label={'담당자 e-mail'}
													name="email"
													rules={[{ type: 'email', message: '올바른 이메일 형식이 아닙니다.' }]}
												/>
											</li>
											<li>
												<SelectBox
													label={t('SMS 수신여부')}
													name="dlvRespSmsNotiyn"
													options={getCommonCodeList('YN2')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
											</li>
											<li>
												<SelectBox
													label={t('메일 수신여부')}
													name="dlvRespEmailNotiyn"
													options={getCommonCodeList('YN2')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
											</li>
											<li>
												<SelectBox
													label={t('3PL사용유무')}
													name="tplUseYn"
													options={getCommonCodeList('YN2')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
											</li>
											<li>
												<DatePicker
													label={'3PL운영시작일'}
													name="tplOperDt"
													format="YYYY-MM-DD"
													allowClear
													disabled={formDisabled}
												/>
											</li>
										</UiDetailViewGroup>
										<Accordion expandIconPlacement="center" items={addGridAccItems} style={{ marginTop: 5 }} />
									</>
									{/* 조달정보 영역 */}
									<Accordion
										showExpandIcon={false}
										items={procurementAccItems}
										expandedKeys={procLogiYn === 'Y' ? ['procurement-panel'] : []}
										style={{ marginTop: 10 }}
									/>
								</div>
							</ScrollBox>
						</CustomForm>
					</>,
				]}
			/>

			{/* 엑셀 팝업 */}
			{/* <CustomModal ref={modalExcelRef} width="1000px">
				<MsCustDeliveryInfoPUploadExcelPopup close={closeEvent} />
			</CustomModal> */}
			{/* 지도 팝업 */}
			<CustomModal ref={mapModalRef} width="1280px">
				<CmMapPopup
					showRadius={true}
					radius={radius}
					stytime={stytime}
					setSearchLatLng={handleMapCallback}
					setAddressInfo={handleAddressCallback}
					searchText={searchAddr}
					callBackFn={(result: any) => {
						setRadius(result.radius);
						setStytime(result.stytime);
						const padTime = (timeStr: string) => {
							return String(timeStr).padStart(4, '0').slice(-4);
						};
						form.setFieldsValue({
							stytime: result.stytime ? dayjs(padTime(result.stytime), 'HHmm') : '',
							radius: result.radius,
						});
					}}
					close={closeEvent}
				/>
			</CustomModal>
			{/* 공통 팝업(차량번호) */}
			<CustomModal ref={carnoRef} width="1000px">
				<CmSearchPopup type={'car'} codeName={carno} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>

			{/* 이미지 팝업 */}
			<CustomModal ref={imageRef} width="1084px">
				<MsCustDeliveryInfoFileUploadPopup
					ref={imageRef}
					issueno={custkey}
					code={code}
					callBack={closeEvent}
					customPopupTitle={customPopupTitle}
				/>
			</CustomModal>
			{/* 개인정보 팝업 */}
			<CustomModal ref={refModalIndividualPop} width="700px" draggable={true}>
				<CmIndividualPopup popUpParams={popUpParams} close={closeEvent01} />
			</CustomModal>
		</>
	);
});

export default MsCustDeliveryInfoPDetail;

const CustomForm = styled(Form)`
	display: flex;
	flex-direction: column;
	height: 100%;
`;

const UiDetailViewGroupWrap = styled.div`
	> ul {
		border-top: 0;
	}
`;
