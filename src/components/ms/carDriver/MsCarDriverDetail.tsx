// React
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { InputNumber, InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Col, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmDriverSearch from '@/components/cm/popup/CmDriverSearch';
import CmMapPopup from '@/components/cm/popup/CmMapPopup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import MsCarDriverFileUploadPopup from '@/components/comfunc/func/filePage/MsCarDriverFileUploadPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import DatePicker from '@/components/common/custom/form/Datepicker';
import MsCarDriverUploadExcelPopup from '@/components/ms/carDriver/MsCarDriverUploadExcelPopup';
import MsTcCodeCfgPopup from '@/components/ms/popup/MsTcCodeCfgPopup';

// API Call Function

import {
	apiGetCmDriverList,
	apiGetEntryInfoList,
	apiGetMaster,
	apiPostSaveMaster,
	apiPostSaveMasterList,
} from '@/api/ms/apiMsCarDriver';

// Store
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { getCarGroupList } from '@/store/biz/msCarGroupStore';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';

// Util
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import { showConfirm, showMessage } from '@/util/MessageUtil';
import styled from 'styled-components';

const MsCarDriverDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 컴포넌트 접근을 위한 Ref
	const gridRef1 = props.gridRef1;
	const modalRef = useRef(null);
	const detailForm = props.detailForm;
	const [gridForm] = Form.useForm();
	const refModal = useRef(null); // CustomModal 제어용 ref
	const tcCodeCfgModal = useRef(null);
	const vehicleExitGroupCfgModal = useRef(null);
	const dcPopModal = useRef(null);
	const fileUploadModal = useRef(null);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const [formDisabled, setFormDisabled] = useState(true);
	const [formDriverDisabled, setFormDriverDisabled] = useState(true);
	const [carNoDisabled, setCarNoDisabled] = useState(true);
	const [formDriverNew, setFormDriverNew] = useState(true);
	const [formHistory, setFormHistory] = useState(null);
	const [searchAddr, setSearchAddr] = useState('');
	const [searchLatLng, setSearchLatLng] = useState([0, 0]);
	const [addressInfo, setAddressInfo] = useState({ fullAddress1: '', fullAddress2: '', fullAddress3: '' });
	const [attchFileGrpNo, setAttchFileGrpNo] = useState(null);
	const [latLng, setLatLng] = useState(['0', '0']);
	const [radius, setRadius] = useState('');
	const [stytime, setStytime] = useState('');

	//출차그룹
	const [vehicleExitGroupOptions, setVehicleExitGroupOptions] = useState([]);

	const userDccodeList = getUserDccodeList('') ?? [];

	const user = useAppSelector(state => state.user.userInfo);

	const openModal = () => {
		refModal.current?.handlerOpen();
	};

	// maxWeight 필드 값을 실시간으로 감시합니다.
	const maxWeightValue = Form.useWatch('maxWeight', detailForm);
	const maxLandingValue = Form.useWatch('maxLanding', detailForm);
	const maxWeight2Value = Form.useWatch('maxWeight2nd', detailForm);
	const maxLanding2Value = Form.useWatch('maxLanding2nd', detailForm);

	const reuseYnValue = Form.useWatch('reuseYn', detailForm);
	const selectDcCode = Form.useWatch('multiDcCode', props.form);

	/**
	 * 전화번호 및 팩스번호 정규식 패턴
	 * 기존: 010, 011, 016, 017, 018, 019
	 * 추가: 02, 031, 032, 033, 041, 042, 051, 052, 053, 054, 055, 061, 062, 063, 064, 070, 000, 080
	 * 비고1: 하이픈 포험, 미포함 커버 (기존방식에서 변경)
	 * 비고2: 3자리-4자리, 4자리-3자리 커버
	 * 비고3: 하이픈 없이 입력시 자동으로 하이픈 붙여주는 기능O (공통 개발 사항)
	 */
	const PHONE_PATTERN = /^(?:01[016-9])(?:-?\d{4})-?\d{4}$/;

	// 하이픈이 있어도 되고 없어도 되는 전화번호 패턴 (기존 정책 유지하되 하이픈 선택적)
	// const PHONE_PATTERN_WITHOUT_HYPHEN =
	// 	/^(?:01[016-9]|02|031|032|033|041|042|051|052|053|054|055|061|062|063|064|070|080|000)(?:-?\d{3,4})-?\d{4}$|^(?:01[016-9]|02|031|032|033|041|042|051|052|053|054|055|061|062|063|064|070|080|000)\d{7,8}$/;

	/**
	 * 입력 받은 날이 오늘보다 작은지 여부를 확인한다.
	 * @param {any} oldValue 예전 date
	 * @param {any} newValue 신규 선택 date
	 * @returns
	 */
	const validateToDateByToDay = (oldValue: any, newValue: any) => {
		// 오늘 이전 날짜 선택 불가
		const selectedDate = dayjs(newValue);
		const today = dayjs().startOf('day');
		const isValid = !selectedDate.isBefore(today);

		// 리턴값은 Object 이며 validate 의 값이 true 라면 패스, false 라면 message 를 띄움
		return { validate: isValid, message: '오늘 이후의 날짜를 입력해주세요.' };
	};

	// 차량 정보 의 목록 grid 컬럼 정보.
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'), // 물류센터
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
			},
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'), // 물류센터 명
			dataType: 'code',
			editable: false,
			// labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
			// 	const dcCode = item.dcCode;
			// 	return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			// },
		},
		// {
		// 	dataField: 'tcDcCode',
		// 	visible: false,
		// },
		{
			dataField: 'tcName',
			headerText: '출발지TC',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'contractType',
			headerText: t('lbl.CONTRACTTYPE'), // 계약유형
			dataType: 'code',
			editable: false,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('CONTRACTTYPE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
			},
		},
		// {
		// 	dataField: 'carId',
		// 	headerText: t('lbl.CARID'), //차량 id
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			dataField: 'carNo',
			headerText: t('lbl.CARNO'), //차량번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'driverFile',
			headerText: '파일첨부',
			dataType: 'code',
			editable: false,
			renderer: {
				type: 'ButtonRenderer',
				labelText: '파일첨부',
				onClick: (event: any) => {
					onClickEdmsFileOpen(event.item);
				},
			},
		},
		{
			dataField: 'fromDate',
			headerText: '차량소독증유효기간TO',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// commRenderer: {
			// 	type: 'calender',
			// 	showExtraDays: true,
			// },
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				validator: validateToDateByToDay,
			},
		},
		{
			dataField: 'toDate',
			headerText: '보건증유효기간TO',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// commRenderer: {
			// 	type: 'calender',
			// 	showExtraDays: true,
			// },
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				validator: validateToDateByToDay,
			},
		},
		{
			dataField: 'toDate2',
			headerText: '차량등록증유효기간TO',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// commRenderer: {
			// 	type: 'calender',
			// 	showExtraDays: true,
			// },
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				validator: validateToDateByToDay,
			},
		},
		{
			dataField: 'carCapacity',
			headerText: t('lbl.CARCAPACITY'), //차량톤수
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('CARCAPACITY', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value ? value + '톤' : '';
			},
		},
		{
			dataField: 'optLoadWeight',
			headerText: '기본적재량(Kg)',
			dataType: 'numeric',
		},
		{
			dataField: 'maxWeight',
			headerText: '최대적재량(Kg)',
			dataType: 'numeric',
		},
		// {
		// 	headerText: '탑규격(cm)',
		// 	children: [
		// 		{
		// 			dataField: 'carWidth',
		// 			headerText: '가로',
		// 			dataType: 'numeric',
		// 		},
		// 		{
		// 			dataField: 'carLength',
		// 			headerText: '세로',
		// 			dataType: 'numeric',
		// 		},
		// 		{
		// 			dataField: 'vehicleHeight',
		// 			headerText: '높이',
		// 			dataType: 'numeric',
		// 		},
		// 	],
		// },
		// {
		// 	dataField: 'vehicleYear',
		// 	headerText: '차량연식',
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => {
		// 			const year = 2000 + i;
		// 			return { cdNm: `${year}년`, comCd: `${year}` };
		// 		}),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// },
		{
			dataField: 'carOther03',
			headerText: '기본착지수',
			dataType: 'numeric',
		},
		{
			dataField: 'maxLanding',
			headerText: '최대착지수',
			dataType: 'numeric',
		},
		// {
		// 	dataField: 'btScannerGive',
		// 	headerText: '블루투스스캐너지급유무',
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('YN', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// },
		// {
		// 	dataField: 'pdaPhone2',
		// 	headerText: '블루투스스캐너시리얼번호',
		// 	dataType: 'string',
		// 	editable: false,
		// },
		// {
		// 	dataField: 'smpGive',
		// 	headerText: '스마트폰지급유무',
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('YN', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// },
		// {
		// 	headerText: '운전자이름',
		// 	children: [
		// 		{
		// 			dataField: 'driver1',
		// 			visible: false,
		// 		},
		// 		{
		// 			dataField: 'driverName',
		// 			headerText: t('lbl.DRIVERNAME'), //기사명
		// 			editable: false,
		// 			dataType: 'manager',
		// 			managerDataField: 'driver1',
		// 		},
		// 		{
		// 			dataField: 'phone1',
		// 			headerText: t('lbl.PHONE'), //전화번호
		// 			dataType: 'string',
		// 			editable: false,
		// 		},
		// 	],
		// },
		// {
		// 	headerText: '동승자',
		// 	children: [
		// 		{
		// 			dataField: 'driver2',
		// 			headerText: t('lbl.DRIVERNAME'), //기사명
		// 			dataType: 'user',
		// 			editable: false,
		// 		},
		// 		{
		// 			dataField: 'phone2',
		// 			headerText: t('lbl.PHONE'), //전화번호
		// 			dataType: 'string',
		// 			editable: false,
		// 		},
		// 	],
		// },
		// {
		// 	dataField: 'delYn',
		// 	headerText: '사용여부',
		// 	dataType: 'code',
		// 	commRenderer: {
		// 		type: 'dropDown',
		// 		list: getCommonCodeList('DEL_YN', ''),
		// 	},
		// },
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
	};

	const inoutGridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		isLegacyRemove: true,
		autoGridHeight: false,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param fieldName
	 * @param maxBytes
	 */
	//  input text 의 제한 을 체크 하고 문자열을 자른다.
	const checkValidTextLenth =
		(fieldName: string, maxBytes: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { value } = e.target;
			const truncated = commUtil.truncateByBytes(value, maxBytes);

			if (value !== truncated) {
				detailForm.setFieldsValue({ [fieldName]: truncated });
			}
		};
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = async () => {
		/**
		 * 그리드 바인딩 완료
		 */
		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});

		gridRef1?.current.bind('cellEditEnd', (event: any) => {
			if (event.dataField === 'tcName' && commUtil.isEmpty(event.value)) {
				gridRef1.current.setCellValue(event.rowIndex, 'tcDcCode', '');
			}

			if (event.columnIndex !== 5 && event.columnIndex !== 6 && event.columnIndex !== 7) {
				return;
			}

			const gridRefCur = gridRef1.current;
			if (gridRefCur) {
				const rowData = gridRefCur.getItemByRowIndex(event.rowIndex);
				const length = rowData.length ?? 0;
				const width = rowData.width ?? 0;
				const height = rowData.height ?? 0;

				// cubeDescr 셀 입력
				const cube = length + '-' + width + '-' + height;
				gridRefCur.setCellValue(event.rowIndex, 'cubeDescr', cube);
				gridRefCur.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
		});

		/**
		 * 그리드 셀 더블클릭
		 */
		gridRef?.current.bind('cellDoubleClick', () => {
			// 선택된 셀(행)의 상세 정보를 조회한다.
			//searchDtl(event.item);
		});

		/**
		 * 그리드 셀 선택전에 실행
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionConstraint', (event: any) => {
			const { toRowIndex } = event;

			if (detailForm.getFieldValue('rowStatus') === 'U') {
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
		 */
		gridRef?.current.bind('selectionChange', () => {
			const selectedRow = gridRef?.current.getSelectedRows();
			const params = selectedRow[0];

			// serialKey 같으면 상세조회 하지 않음
			if (selectedRow[0].serialKey === detailForm.getFieldValue('serialKey')) {
				return false;
			}

			const searchParams = {
				serialKey: params.serialKey,
				dcCode: params.dcCode,
				carNo: params.carNo,
			};

			apiGetMaster(searchParams).then(res => {
				detailForm.resetFields();
				setCarNoDisabled(true);

				const deliveryType = [];
				if (commUtil.isNotEmpty(res.data.deliveryYn) && res.data.deliveryYn === 'Y') deliveryType.push('01');
				if (commUtil.isNotEmpty(res.data.carryYn) && res.data.carryYn === 'Y') deliveryType.push('02');
				if (commUtil.isNotEmpty(res.data.procSamedayYn) && res.data.procSamedayYn === 'Y') deliveryType.push('03');
				if (commUtil.isNotEmpty(res.data.procStorageYn) && res.data.procStorageYn === 'Y') deliveryType.push('04');
				if (commUtil.isNotEmpty(res.data.ownCarYn) && res.data.ownCarYn === 'Y') deliveryType.push('05');
				if (commUtil.isNotEmpty(res.data.returnYn) && res.data.returnYn === 'Y') deliveryType.push('06');

				const carWidth = res.data.carWidth ?? 0;
				const carLength = res.data.carLength ?? 0;
				const vehicleHeight = res.data.vehicleHeight ?? 0;

				const dataFromDB = {
					...res.data,
					toDate: res.data.toDate ? dayjs(res.data.toDate, 'YYYYMMDD') : '',
					toDate2: res.data.toDate2 ? dayjs(res.data.toDate2, 'YYYYMMDD') : '',
					fromDate: res.data.fromDate ? dayjs(res.data.fromDate, 'YYYYMMDD') : '',
					workTime: res.data.workFromHour
						? [dayjs(res.data.workFromHour, 'HH:mm'), dayjs(res.data.workToHour, 'HH:mm')]
						: [],
					deliveryType: deliveryType,
					cube: carWidth * carLength * vehicleHeight,
					driver1: res.data.driverId,
					carName: res.data.carNo,
					carCode: res.data.carId,
					driverName: res.data.driverName,
					driverCode: res.data.driverId,
					custKey: res.data.custKey,
					carAgentKey: res.data.carAgentKey,
					custName: res.data.custName ? `[${res.data.custKey}] ${res.data.custName}` : '',
					carAgentName: res.data.carAgentName ? `[${res.data.carAgentKey}] ${res.data.carAgentName}` : '',
					stytime: res.data.stytime ? dayjs(padTime(res.data.stytime), 'HHmm') : '',
				};
				setLatLng([res.data.latitude?.toString() || '', res.data.longitude?.toString() || '']);
				setRadius(res.data.radius);
				setStytime(res.data.stytime);
				setFormDisabled(false);
				detailForm.setFieldsValue(dataFromDB);
			});

			setFormHistory(null);
			//조회할때 기사정보의 취소 버튼을 신규 버튼으로 변경
			setFormDriverNew(true);

			apiGetEntryInfoList(params).then(res => {
				const resData = res.data;
				resData.forEach((item: any) => {
					item.stytime = '';
				});
				gridRef1.current?.setGridData(res.data);
			});
		});
	};

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			props.setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: props.totalCnt,
	});

	const initDetailForm = () => {
		detailForm.resetFields();
		gridRef1.current?.setGridData([]);
		detailForm.setFieldsValue({
			rowStatus: 'I',
			sttlYn: 'Y',
			subDriverYn: 'N',
			delYn: 'N',
		});
		setFormDisabled(false); // 신규일 때 입력 가능하게 변경
		setCarNoDisabled(false);
	};

	/**
	 * 상세저장
	 * @returns {void}
	 */
	const saveMaster = async () => {
		if (
			commUtil.isNotEmpty(detailForm.getFieldValue('contractType')) &&
			detailForm.getFieldValue('contractType') !== 'TEMPORARY' &&
			detailForm.getFieldValue('contractType') !== 'SELF'
		) {
			// 입력 값 검증
			const isValid = await validateForm(detailForm);
			if (!isValid) {
				return;
			}
		}

		// 변경된 data
		const updatedItems = gridRef1.current.getChangedData({ validationYn: false })?.map((row: any) => ({
			...row,
			dcCode: commUtil.isEmpty(row.dcCode) ? '' : row.dcCode,
			tcDcCode: commUtil.isEmpty(row.tcDcCode) ? '' : row.tcDcCode,
		}));
		// rowStatus가 'D'가 아닌 데이터만 추출 (물류센터,출발지TC 중복 체크 하기 위해서)
		// const filteredRows = updatedItems.filter((item: any) => item.rowStatus !== 'D');

		// 모든 데이터
		const allItems = gridRef1.current.getGridData()?.map((row: any) => ({
			...row,
			dcCode: commUtil.isEmpty(row.dcCode) ? '' : row.dcCode,
			tcDcCode: commUtil.isEmpty(row.tcDcCode) ? '' : row.tcDcCode,
		}));

		allItems.forEach((item: any) => {
			const tUid = item._$uid;
			updatedItems.forEach((row: any) => {
				if (row._$uid === tUid) {
					item.rowStatus = row.rowStatus;
				}
			});
		});

		if (
			commUtil.isNotEmpty(detailForm.getFieldValue('contractType')) &&
			detailForm.getFieldValue('contractType') !== 'TEMPORARY' &&
			detailForm.getFieldValue('contractType') !== 'SELF'
		) {
			if (detailForm.getFieldValue('deliveryType').length < 1) {
				showMessage({
					content: '배송유형 값을 입력해 주세요.',
					modalType: 'info',
				});
				return;
			}

			if (gridRef1.current.getGridData().length < 1) {
				showMessage({
					content: '센터 입출차정보 값을 입력해 주세요.',
					modalType: 'info',
				});
				return;
			}

			if (detailForm.getFieldValue('driverName').length < 1) {
				showMessage({
					content: '기사명을 입력해 주세요.',
					modalType: 'info',
				});
				return;
			}
		} else {
			if (commUtil.isEmpty(detailForm.getFieldValue('carName'))) {
				showMessage({
					content: '차량번호를 입력해 주세요.',
					modalType: 'info',
				});
				return;
			}
		}

		// 센터 입출차 정보 grid 물류센터, 출발지TC 중복 체크. tcName
		const isDuplicate = updatedItems
			.filter((item: any) => item.rowStatus !== 'D')
			.some((item: any) => {
				const duplicates = allItems.filter((row: any) => {
					const isMatch =
						row.dcCode === item.dcCode && // 물류센터 체크
						row.tcDcCode === item.tcDcCode && // 출발지TC 체크
						row.rowStatus !== 'D'; // 삭제 제외

					return isMatch;
				});
				return duplicates.length > 1;
			});

		if (isDuplicate) {
			showMessage({
				content: '중복된 [물류센터], [출발지TC]가 존재합니다.',
				modalType: 'info',
			});
			return;
		}

		updatedItems?.forEach((item: any) => {
			item.carNo = commUtil.isNotEmpty(detailForm.getFieldValue('carNo'))
				? detailForm.getFieldValue('carNo')
				: detailForm.getFieldValue('carName');
		});

		const params = detailForm.getFieldsValue(true);

		const dcCode = getSelectDccodeList();

		const reqParams = {
			...params,
			dcCode: dcCode,
			carId: params.carName,
			carNo: params.carName,
			toDate: params.toDate ? dayjs(params.toDate).format('YYYYMMDD') : '',
			toDate2: params.toDate2 ? dayjs(params.toDate2).format('YYYYMMDD') : '19000101', // 19000101 삭제 처리.
			fromDate: params.fromDate ? dayjs(params.fromDate).format('YYYYMMDD') : '',
			deliveryYn: params.deliveryType && params.deliveryType.includes('01') ? 'Y' : 'N',
			carryYn: params.deliveryType && params.deliveryType.includes('02') ? 'Y' : 'N',
			procSamedayYn: params.deliveryType && params.deliveryType.includes('03') ? 'Y' : 'N',
			procStorageYn: params.deliveryType && params.deliveryType.includes('04') ? 'Y' : 'N',
			ownCarYn: params.deliveryType && params.deliveryType.includes('05') ? 'Y' : 'N',
			returnYn: params.deliveryType && params.deliveryType.includes('06') ? 'Y' : 'N',
			workFromHour: params.workTime ? dayjs(params.workTime[0]).format('HHmm') : '',
			workToHour: params.workTime ? dayjs(params.workTime[1]).format('HHmm') : '',
			driverId: params.driver1,
			driverName: params.driverName ? params.driverName.replace(/^\[.*?\]\s*/, '') : '',
			custName: params.custName ? params.custName.replace(/^\[.*?\]\s*/, '') : '',
			carAgentName: params.carAgentName ? params.carAgentName.replace(/^\[.*?\]\s*/, '') : '',
			carDriverList: updatedItems,
			entryInfoList: allItems,
			stytime: params.stytime === '' || params.stytime === null ? '' : dayjs(params.stytime).format('HHmm'),
		};

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveMaster(reqParams).then(res => {
				if (res.statusCode > -1) {
					detailForm.setFieldValue('rowStatus', 'R');
					gridRef.current.setSelectedRowValue({
						...params,
						toDate: params.toDate ? dayjs(params.toDate).format('YYYYMMDD') : '',
						toDate2: params.toDate2 ? dayjs(params.toDate2).format('YYYYMMDD') : '',
						fromDate: params.fromDate ? dayjs(params.fromDate).format('YYYYMMDD') : '',
						// phone1: params.phone1?.replace(/-(\d+)-/g, (_: any, p1: any) => `-${'*'.repeat(p1.length)}-`),
						// phone2: params.phone2?.replace(/-(\d+)-/g, (_: any, p1: any) => `-${'*'.repeat(p1.length)}-`),
						// driverName: params.driverName?.replace(/^(.)(.)/, '$1*'),
						// driver2: params.driver2?.replace(/^(.)(.)/, '$1*'),
					});
					// AUIGrid 변경이력 Cache 삭제
					gridRef.current.resetUpdatedItems();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							//params.rowStatus === 'I' 이면 callBackFn 호출
							if (params.rowStatus === 'I') {
								props.callBackFn?.();
							}

							const searchParams = {
								dcCode: reqParams.dcCode,
								carNo: reqParams.carNo,
							};

							apiGetMaster(searchParams).then(res => {
								detailForm.resetFields();
								setCarNoDisabled(true);

								const deliveryType = [];
								if (commUtil.isNotEmpty(res.data.deliveryYn) && res.data.deliveryYn === 'Y') deliveryType.push('01');
								if (commUtil.isNotEmpty(res.data.carryYn) && res.data.carryYn === 'Y') deliveryType.push('02');
								if (commUtil.isNotEmpty(res.data.procSamedayYn) && res.data.procSamedayYn === 'Y')
									deliveryType.push('03');
								if (commUtil.isNotEmpty(res.data.procStorageYn) && res.data.procStorageYn === 'Y')
									deliveryType.push('04');
								if (commUtil.isNotEmpty(res.data.ownCarYn) && res.data.ownCarYn === 'Y') deliveryType.push('05');
								if (commUtil.isNotEmpty(res.data.returnYn) && res.data.returnYn === 'Y') deliveryType.push('06');

								const carWidth = res.data.carWidth ?? 0;
								const carLength = res.data.carLength ?? 0;
								const vehicleHeight = res.data.vehicleHeight ?? 0;

								const dataFromDB = {
									...res.data,
									toDate: res.data.toDate ? dayjs(res.data.toDate, 'YYYYMMDD') : '',
									toDate2: res.data.toDate2 ? dayjs(res.data.toDate2, 'YYYYMMDD') : '',
									fromDate: res.data.fromDate ? dayjs(res.data.fromDate, 'YYYYMMDD') : '',
									workTime: res.data.workFromHour
										? [dayjs(res.data.workFromHour, 'HH:mm'), dayjs(res.data.workToHour, 'HH:mm')]
										: [],
									deliveryType: deliveryType,
									cube: carWidth * carLength * vehicleHeight,
									driver1: res.data.driverId,
									carName: res.data.carNo,
									carCode: res.data.carId,
									driverName: res.data.driverName,
									driverCode: res.data.driverId,
									custKey: res.data.custKey,
									custName: res.data.custName,
									carAgentKey: res.data.carAgentKey,
									carAgentName: res.data.carAgentName,
									stytime: res.data.stytime ? dayjs(padTime(res.data.stytime), 'HHmm') : '',
								};
								setLatLng([res.data.latitude?.toString() || '', res.data.longitude?.toString() || '']);
								setRadius(res.data.radius);
								setStytime(res.data.stytime);
								setFormDisabled(false);
								detailForm.setFieldsValue(dataFromDB);
							});

							setFormHistory(null);
							//조회할때 기사정보의 취소 버튼을 신규 버튼으로 변경
							setFormDriverNew(true);

							params.stytime = '';
							apiGetEntryInfoList(params).then(res => {
								gridRef1.current?.setGridData(
									res?.data.map((row: any) => ({
										...row,
										rowStatus: 'R',
									})),
								);
							});
						},
					});
				}
			});
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				// 전체 체크 해제
				gridRef.current.setAllCheckedRows(false);
				// AUIGrid 변경이력 Cache 삭제
				gridRef.current.resetUpdatedItems();
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn?.();
						},
					});
				}
			});
		});
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		if (
			Object.keys(changedValues).indexOf('carWidth') > -1 ||
			Object.keys(changedValues).indexOf('carLength') > -1 ||
			Object.keys(changedValues).indexOf('vehicleHeight') > -1
		) {
			const carWidth = allValues.carWidth ?? 0;
			const carLength = allValues.carLength ?? 0;
			const vehicleHeight = allValues.vehicleHeight ?? 0;

			if (carWidth && carLength && vehicleHeight) {
				detailForm.setFieldsValue({
					cube: carWidth * carLength * vehicleHeight,
				});
			}
		}
		if (Object.keys(changedValues).indexOf('driverName') > -1) {
			detailForm.setFieldsValue({
				driver1: changedValues.driverCode,
			});
		}
		if (detailForm.getFieldValue('rowStatus') !== 'I') {
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	const getSelectDccodeList = () => {
		const dcCode = props.form.getFieldValue('multiDcCode');
		if (dcCode && dcCode.length > 0) {
			return dcCode.join(',').split(',')[0];
		} else {
			return gDccode;
		}
	};

	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					storerkey: 'FW00',
					dcCode: getSelectDccodeList(),
					outGroupCd: '',
					delYn: 'N',
					rowStatus: 'I', // 신규 행 상태로 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
		],
	};

	// 표 버튼 설정 - 차량정보
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'pre', // 이전
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					// Form 변경 감지 체크
					if (detailForm.getFieldValue('rowStatus') === 'U') {
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
					// Form 변경 감지 체크
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							// 다음 Row 선택 Function
							gridRef.current.setNextRowSelected();
						});
					} else {
						gridRef.current.setNextRowSelected();
					}
				},
			},
			{
				btnType: 'btn1', // 출발지설정
				btnLabel: 'TC센터 설정',
				callBackFn: () => {
					handleOpenTcCodeCfgPopup();
				},
			},
			{
				btnType: 'new', // 신규
				callBackFn: initDetailForm,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};

	// 표 버튼 설정 - 배송/조달기본정보
	const tableBtn2: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 표 버튼 설정 - 기사정보
	const tableBtn3: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'save',
			// 	callBackFn: saveMaster,
			// },
		],
	};

	// 그리드 초기화
	const inoutGridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			editRenderer: {
				type: 'DropDownListRenderer',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
			},
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			},
		},
		{
			dataField: 'outGroupCd',
			headerText: '출차그룹',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				listFunction: (rowIndex: number, colIndex: number, item: any) => {
					// 물류센터 코드에 따라 출차그룹 리스트를 가져온다.
					return getCarGroupList(item.dcCode);
				},
				keyField: 'outGroupCd', // key 에 해당되는 필드명
				valueField: 'outGroupNm',
			},
			required: true,
		},
		{
			dataField: 'inTime',
			headerText: '입차시간',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'outTime',
			headerText: '출차시간',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'popno',
			headerText: 'POP',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tcDcCode',
			visible: false,
		},
		{
			dataField: 'tcName',
			headerText: '출발지TC',
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'tc',
				searchDropdownProps: {
					dataFieldMap: {
						tcDcCode: 'tcCode',
						tcName: 'tcName',
					},
				},
				iconPosition: 'right',
				align: 'center',
				onClick: function (event: any) {
					dcPopModal.current.handlerOpen();
				},
			},
		},
		{
			dataField: 'tcDcName',
			visible: false,
		},
		{
			dataField: 'dockno',
			headerText: '도크',
			dataType: 'string',
		},
	];

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		modalRef.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	const popupCloseEvent = () => {
		return;
	};

	// 출발지TC센터설정 팝업 열기
	const handleOpenTcCodeCfgPopup = () => {
		tcCodeCfgModal.current?.handlerOpen();
	};

	// 출발지TC센터설정 팝업 닫기
	const handleCloseTcCodeCfgPopup = () => {
		tcCodeCfgModal.current?.handlerClose();
	};

	//센터검색 팝업 callback
	const confirmPopup = (selectedRow: any) => {
		gridRef1.current.setCellValue(gridRef1.current.getSelectedIndex()[0], 'tcDcCode', selectedRow[0].tcCode);
		gridRef1.current.setCellValue(gridRef1.current.getSelectedIndex()[0], 'tcName', selectedRow[0].tcName);
		dcPopModal.current.handlerClose();
	};

	// 20260206@기사검색 팝업 callback - 전화번호 세팅 By sss
	const callBackPoup = async (rows: any[]) => {
		const selected = rows?.[0];
		if (!selected) return;

		const code = selected.code ?? selected.driverId ?? detailForm.getFieldValue('code');
		// const code = selected.driverId;
		if (!code) return;
		let phone1 = '';
		const res = await apiGetCmDriverList({ driverId: code });
		const driver = res?.data;
		phone1 = driver?.phone1 ? dataRegex.formatPhone(driver.phone1) : '';
		detailForm.setFieldsValue({
			phone1,
			phone2: formHistory.phone2,
			driver1: code ?? detailForm.getFieldValue('driver1'),
			driver2: formHistory.driver2,
		});

		if (detailForm.getFieldValue('rowStatus') !== 'I') {
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	//센터검색 팝업 닫기
	const dcPopCloseEvent = () => {
		dcPopModal.current.handlerClose();
	};

	//파일업로드 팝업 열기
	const onClickFileUploader = (item: any) => {
		fileUploadModal.current.handlerOpen();
		setAttchFileGrpNo(item.ATTCH_FILE_GRP_NO);
		return;
	};

	//파일업로드 팝업 닫기
	const uploadPopCloseEvent = () => {
		fileUploadModal.current.handlerClose();
	};

	const disabledDate = (current: any) => {
		return current < dayjs().startOf('day');
	};

	// 시간정보정제
	const padTime = (timeStr: string) => {
		// 1. 콜론(':')을 제거 (예: '10:00' -> '1000', '9:30' -> '930')
		const cleanStr = String(timeStr).replace(/:/g, '');

		// 2. 4자리로 만들고 앞을 '0'으로 채움 (예: '930' -> '0930')
		return cleanStr.padStart(4, '0');
	};

	/**
	 * EDMS 파일 보기
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickEdmsFileOpen = (item: any) => {
		const params = {
			aprvflag: '2',
			attrid: '100',
			id: user.userNo,
			pw: user.userNo,
			mode: '1',
			doctype: '1313',
			requestno: item.carNo,
			procflag: '1',
		};
		extUtil.openEdms(params);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		if (searchLatLng[0] === 0) {
			return;
		}
		detailForm.setFieldsValue({
			latitude: searchLatLng[0],
			longitude: searchLatLng[1],
			garageAddress1: addressInfo.fullAddress1,
			garageAddress3: addressInfo.fullAddress3,
			rowStatus: detailForm.getFieldValue('rowStatus') === 'I' ? 'I' : 'U',
		});
		setLatLng([searchLatLng[0].toString() || '', searchLatLng[1].toString() || '']);
		refModal.current.handlerClose();
	}, [searchLatLng]);

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			const gridData = props.data;

			// for (const item of gridData) {
			// 	item.custName = item.custName ? `[${item.custKey}]${item.custName}` : '';
			// 	item.carAgentName = item.carAgentName ? `[${item.carAgentKey}]${item.carAgentName}` : '';
			// }

			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		if (!formDriverNew) {
			setFormHistory(detailForm.getFieldsValue());
			setFormDriverDisabled(false);
			detailForm.setFieldsValue({ driverId: '' });
			detailForm.setFieldsValue({ driverName: '' });
			detailForm.setFieldsValue({ driverCode: '' });
			detailForm.setFieldsValue({ workTime: [] });
			detailForm.setFieldsValue({ driver1: '' });
			detailForm.setFieldsValue({ phone1: '' });
			detailForm.setFieldsValue({ driver2: '' });
			detailForm.setFieldsValue({ phone2: '' });
			detailForm.setFieldsValue({ btScannerGive: '' });
			detailForm.setFieldsValue({ pdaPhone2: '' });
			detailForm.setFieldsValue({ smpGive: '' });
			detailForm.setFieldsValue({ toDate: '' });
			detailForm.setFieldsValue({ driverMemo: '' });
			detailForm.setFieldsValue({
				rowStatus: detailForm.getFieldValue('rowStatus') === 'I' ? 'I' : 'U',
			});
		} else {
			if (formHistory === null) return;
			setFormDriverDisabled(true);
			detailForm.setFieldsValue({ rowStatus: 'R' });
			detailForm.setFieldsValue({ driverId: formHistory.driverId });
			detailForm.setFieldsValue({ driverName: formHistory.driverName });
			detailForm.setFieldsValue({ driverCode: formHistory.driverCode });
			detailForm.setFieldsValue({ workTime: formHistory.workTime });
			detailForm.setFieldsValue({ driver1: formHistory.driver1 });
			detailForm.setFieldsValue({ phone1: formHistory.phone1 });
			detailForm.setFieldsValue({ driver2: formHistory.driver2 });
			detailForm.setFieldsValue({ phone2: formHistory.phone2 });
			detailForm.setFieldsValue({ btScannerGive: formHistory.btScannerGive });
			detailForm.setFieldsValue({ pdaPhone2: formHistory.pdaPhone2 });
			detailForm.setFieldsValue({ smpGive: formHistory.smpGive });
			detailForm.setFieldsValue({ toDate: formHistory.toDate });
			detailForm.setFieldsValue({ driverMemo: formHistory.driverMemo });
			//detailForm.setFieldsValue(formHistory);
		}
	}, [formDriverNew]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<CustomForm
						key="MsCarDriverDetail-left"
						form={gridForm}
						initialValues={{ selectBox1: 'a', datePicker1: dayjs() }}
						disabled={formDisabled}
					>
						<AGrid dataProps={'row-single'}>
							<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn}>
								{/* <li>
								<SelectBox
									name="selectBox1"
									options={[
										{ label: '차량소독증 유효기간TO', value: 'a' },
										{ label: '보건증 유효기간TO', value: 'b' },
									]}
									className="bg-white"
								/>
							</li>
							<li>
								<DatePicker
									name="datePicker1"
									allowClear
									showNow={true}
									// label={'차량소독증 유효기간TO'}
								/>
							</li>
							<Button
								type="default"
								onClick={() => {
									const checkedItems = gridRef.current.getCheckedRowItems();

									if (checkedItems.length < 1) {
										showAlert(null, t('msg.MSG_COM_VAL_010'));
										return;
									}

									const datePicker1 = gridForm.getFieldValue('datePicker1');
									const selectBox1 = gridForm.getFieldValue('selectBox1');

									for (const item of checkedItems) {
										if (selectBox1 === 'a') {
											gridRef.current.setCellValue(item.rowIndex, 'fromDate', datePicker1.format('YYYY-MM-DD'));
										} else if (selectBox1 === 'b') {
											gridRef.current.setCellValue(item.rowIndex, 'toDate', datePicker1.format('YYYY-MM-DD'));
										}
									}
								}}
							>
								선택적용
							</Button> */}
								<Button onClick={onClickFileUploader}>파일업로드</Button>
								<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>

						<CustomModal ref={modalRef} width="1000px">
							<MsCarDriverUploadExcelPopup close={closeEvent} />
						</CustomModal>
					</CustomForm>,
					<>
						<AGrid className="form-inner">
							<TableTopBtn tableTitle={'상세정보'} tableBtn={tableBtn} className="fix-title">
								{/* <Button onClick={onClickFileUploader}>차량정보 파일업로드</Button> */}
							</TableTopBtn>
							<ScrollBox>
								<Form
									form={detailForm}
									onValuesChange={onValuesChange}
									initialValues={{ rowStatus: 'R' }}
									disabled={formDisabled}
								>
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-2">
											<Form.Item name="rowStatus" hidden>
												<Input />
											</Form.Item>
											<Form.Item name="serialKey" hidden>
												<Input />
											</Form.Item>
											<Form.Item name="carNo" hidden>
												<Input />
											</Form.Item>
											<Form.Item name="carAgentName" hidden>
												<Input />
											</Form.Item>
											{/* <li>
									<SelectBox
										name="dcCode"
										label={t('lbl.DCCODE')}
										options={userDccodeList}
										fieldNames={{ label: 'dcname', value: 'dccode' }}
									/>
								</li> */}
											<li>
												{/* <InputText
											name="carNo"
											label={t('lbl.CARNO')}
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/> */}
												{/* <CmCarSearch
										form={detailForm}
										label={t('lbl.CARNO')}
										required
										name="carName"
										code="carCode"
										returnValueFormat="code"
									/> */}
												<InputText
													name="carName"
													label={t('lbl.CARNO')}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
													disabled={carNoDisabled}
													onChange={checkValidTextLenth('carName', 60)}
												/>
												{/* 차량번호 */}
											</li>
											<li>
												<SelectBox
													name="carCapacity"
													label={'차량톤급'}
													options={getCommonCodeList('CARCAPACITY', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
												{/* 차량타입 */}
											</li>
											<li>
												<SelectBox
													name="contractType"
													label={t('lbl.CONTRACTTYPE')} // 계약유형
													options={getCommonCodeList('CONTRACTTYPE', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
												{/* 계약유형 */}
											</li>
											<li>
												<SelectBox
													name="deliveryType"
													label={'배송유형'}
													options={[
														{
															cdNm: '--- 선택 ---',
															comCd: null,
														},
														{
															cdNm: '배송',
															comCd: '01',
														},
														{
															cdNm: '수송',
															comCd: '02',
														},
														{
															cdNm: '조달(일배)',
															comCd: '03',
														},
														{
															cdNm: '조달(저장)',
															comCd: '04',
														},
														{
															cdNm: '고객자차',
															comCd: '05',
														},
														{
															cdNm: '반품',
															comCd: '06',
														},
													]}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													mode={'multiple'}
													required
												/>
												{/* 배송유형 */}
											</li>
											<li>
												<SelectBox
													name="carOrderCloseCd"
													label={'마감유형'}
													options={getCommonCodeList('CAR_ORDERCLOSE', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
											</li>
											<li>
												<SelectBox
													name="reuseYn"
													label={'2회전가능여부'}
													options={getCommonCodeList('YN', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
												{/* 다회전가능여부 */}
											</li>
											<li>
												<SelectBox
													name="vehicleYear"
													label={t('lbl.REGISTRATIONDATE')}
													options={Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => {
														const year = 2000 + i;
														return { cdNm: `${year}년`, comCd: `${year}` };
													})}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
												{/* 차량연식 */}
											</li>
											<li>
												<SelectBox
													name="vehicleTypeCd"
													label={'연료구분'}
													options={getCommonCodeList('FUELTYPE', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
												{/* 차종 */}
											</li>
											<li>
												<InputNumber
													name="fuelEfficiency"
													label={t('lbl.FUELEFFICIENCY')}
													placeholder={t('lbl.FUELEFFICIENCY')}
													precision={2}
												/>
											</li>
											<li>
												<SelectBox
													name="sttlYn"
													label={'정산여부'}
													options={getCommonCodeList('YN2', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
											</li>
											<li className="range-align">
												<Col span={13} className="pd0">
													<InputNumber
														name="carWidth"
														label={t('lbl.CARGOSIZE') + '(cm)'}
														placeholder="길이"
														step={10}
													/>
												</Col>
												<span>*</span>
												<Col span={5} className="pd0">
													<InputNumber name="carLength" placeholder="폭" step={10} />
												</Col>
												<span>*</span>
												<Col span={5} className="pd0">
													<InputNumber name="vehicleHeight" placeholder="높이" step={10} />
												</Col>
												{/* 탑규격 */}
											</li>
											<li>
												<InputNumber
													name="cube"
													label={t('lbl.CUBE') + '(㎥)'}
													precision={2}
													formatter={(str: number) => (str / 1000000).toFixed(2)}
													disabled={true}
												/>
												{/* 체적 */}
											</li>
											<li>
												<InputNumber
													name="optLoadWeight"
													label={'기본적재중량(Kg)'}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
													max={maxWeightValue}
												/>
												{/* 적정적재중량 */}
											</li>
											<li>
												<InputNumber
													name="maxWeight"
													label={'최대적재량(Kg)'}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
													onBlur={(e: any) => {
														// 최대적재령 변경 시 적정적재중량보다 작게 입력되면 적정적재중량을 최대적재량으로 맞춤
														const basicLoadWeight = detailForm.getFieldValue('optLoadWeight');
														if (Number(e.target.value) < Number(basicLoadWeight)) {
															detailForm.setFieldValue('optLoadWeight', e.target.value);
														}
													}}
												/>
												{/* 최대적재량 */}
											</li>
											<li>
												<InputNumber
													name="carOther03"
													label={'기본착지수'}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
													max={maxLandingValue}
												/>
												{/* 기본착지수 */}
											</li>
											<li>
												<InputNumber
													name="maxLanding"
													label={'최대착지수'}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
													onBlur={(e: any) => {
														// 최대착지수 변경 시 기본착지수보다 작게 입력되면 기본착지수를 최대착지수로 맞춤
														const basicLanding = detailForm.getFieldValue('carOther03');
														if (Number(e.target.value) < Number(basicLanding)) {
															detailForm.setFieldValue('carOther03', e.target.value);
														}
													}}
												/>
												{/* 최대착지수 */}
											</li>
											{/* *신규* 2회전 관련항목 4개 */}
											<li>
												<InputNumber
													name="baseWeight2nd"
													label={'2회전기본적재량(Kg)'}
													required={reuseYnValue === 'Y'}
													rules={[{ required: reuseYnValue === 'Y', validateTrigger: 'none' }]}
													max={maxWeight2Value}
													disabled={reuseYnValue !== 'Y'}
												/>
												{/* 적정적재중량 */}
											</li>
											<li>
												<InputNumber
													name="maxWeight2nd"
													label={'2회전 최대적재량(Kg)'}
													required={reuseYnValue === 'Y'}
													rules={[{ required: reuseYnValue === 'Y', validateTrigger: 'none' }]}
													onBlur={(e: any) => {
														// 최대적재령 변경 시 적정적재중량보다 작게 입력되면 적정적재중량을 최대적재량으로 맞춤
														const basicLoadWeight = detailForm.getFieldValue('baseWeight2nd');
														if (Number(e.target.value) < Number(basicLoadWeight)) {
															detailForm.setFieldValue('baseWeight2nd', e.target.value);
														}
													}}
													disabled={reuseYnValue !== 'Y'}
												/>
												{/* 최대적재량 */}
											</li>
											<li>
												<InputNumber
													name="baseLanding2nd"
													label={'2회전 기본착지수'}
													required={reuseYnValue === 'Y'}
													rules={[{ required: reuseYnValue === 'Y', validateTrigger: 'none' }]}
													max={maxLanding2Value}
													disabled={reuseYnValue !== 'Y'}
												/>
												{/* 기본착지수 */}
											</li>
											<li>
												<InputNumber
													name="maxLanding2nd"
													label={'2회전 최대착지수'}
													required={reuseYnValue === 'Y'}
													rules={[{ required: reuseYnValue === 'Y', validateTrigger: 'none' }]}
													onBlur={(e: any) => {
														// 최대착지수 변경 시 기본착지수보다 작게 입력되면 기본착지수를 최대착지수로 맞춤
														const basicLanding = detailForm.getFieldValue('baseLanding2nd');
														if (Number(e.target.value) < Number(basicLanding)) {
															detailForm.setFieldValue('baseLanding2nd', e.target.value);
														}
													}}
													disabled={reuseYnValue !== 'Y'}
												/>
												{/* 최대착지수 */}
											</li>
											{/** */}
											<li>
												<InputNumber name="optPlt" label={'적정 PLT수'} /> {/* 적정 PLT수 */}
											</li>
											<li>
												<InputText name="thermometerNo" label={'온도기록장치ID'} /> {/* 온도기록장치ID */}
											</li>
											<li>
												<DatePicker name="fromDate" label={'차량소독증유효기간'} disabledDate={disabledDate} />
												{/* 차량소독증유효기간(TO) */}
											</li>
											<li>
												<DatePicker name="toDate2" label={'차량등록증유효기간'} disabledDate={disabledDate} />
											</li>
											<li>
												<SelectBox
													name="subDriverYn"
													label={'보조원 유무'}
													options={getCommonCodeList('YN', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
												{/* 보조원 유무 */}
											</li>
											<li>
												<SelectBox
													name="delYn"
													label={'사용여부'}
													options={getCommonCodeList('DEL_YN', '')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
												{/* 사용여부 */}
											</li>
											<li>
												<InputText name="addDate" label={t('lbl.ADDDATE')} disabled={true} /> {/* 최초 등록일자 */}
											</li>
											<li>
												<InputText name="addWho" label={t('lbl.ADDWHO')} disabled={true} /> {/* 최초 등록자 */}
											</li>
											<li>
												<InputText name="editDate" label={t('lbl.EDITDATE')} disabled={true} /> {/* 최종 변경일자 */}
											</li>
											<li>
												<InputText name="editWho" label={t('lbl.EDITWHO')} disabled={true} /> {/* 최종변경자 */}
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>

									<TableTopBtn tableTitle={'운송사/차고지 정보'} tableBtn={tableBtn2} />
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-2">
											<li>
												{/* <SelectBox
											name="custKey"
											label={'운송사'}
											options={getMsCarrierList('LOCAL')}
											fieldNames={{ label: 'description', value: 'carrierKey' }}
										/> */}
												<CmCarrierSearch
													form={detailForm}
													selectionMode="singleRow"
													name="custName"
													code="custKey"
													returnValueFormat="carDriver"
													carrierType="LOCAL"
													label="운송사"
													required
													callBack={(result: any) => {
														const item = result[0];
														if (item) {
															detailForm.setFieldsValue({
																custName: item.name,
																custKey: item.code,
															});
															if (detailForm.getFieldValue('rowStatus') !== 'I') {
																detailForm.setFieldValue('rowStatus', 'U');
															}
														}
													}}
												/>
												{/* 운송사 */}
											</li>
											{/* 차량소유업체 */}
											{/* <li>
										<SelectBox
											name="sttlCompDiv"
											label={'정산대상회사'}
											options={[
												{
													cdNm: '--- 선택 ---',
													comCd: '',
												},
												{
													cdNm: '운송사',
													comCd: 'LOCAL',
												},
												{
													cdNm: '2차 운송사',
													comCd: 'SUBC',
												},
											]}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li> */}
											{/* 정산대상회사 */}
											<li>
												{/* <SelectBox
											name="carAgentKey"
											label={t('lbl.CARAGENTNAME')}
											options={getMsCarrierList('SUBC')}
											fieldNames={{ label: 'description', value: 'carrierKey' }}
											onChange={(value: string) => {
												detailForm.setFieldValue('carAgentPhone', getFindCarrier('SUBC', value).phone1);
												detailForm.setFieldValue('carAgentName', getFindCarrier('SUBC', value).description);
											}}
										/> */}
												<CmCarrierSearch
													form={detailForm}
													selectionMode="singleRow"
													name="carAgentName"
													code="carAgentKey"
													returnValueFormat="carDriver"
													label={'2차 운송사'}
													carrierType="SUBC"
													required
													callBack={(result: any) => {
														const item = result[0];
														if (item) {
															detailForm.setFieldsValue({
																carAgentName: item.name,
																carAgentKey: item.code,
															});
															if (detailForm.getFieldValue('rowStatus') !== 'I') {
																detailForm.setFieldValue('rowStatus', 'U');
															}
														}
													}}
												/>
											</li>
											{/* 2차 운송사 */}
											<li>
												<InputText name="carAgentPhone" label={t('lbl.CARAGENTPHONE')} />
											</li>
											{/* 차량업체전화 */}
											<li className="range-align">
												<Col span={18} className="pd0">
													<InputNumber
														name="latitude"
														label={'차고지 위경도'}
														readOnly
														required
														rules={[{ required: true, validateTrigger: 'none' }]}
													/>
												</Col>
												<span>,</span>
												<Col span={6} className="pd0">
													<InputNumber name="longitude" readOnly />
												</Col>
												<span>
													<Button name="map" onClick={openModal}>
														지도
													</Button>
												</span>
											</li>
											<li>
												<InputNumber label={'반경'} name="radius" />
											</li>
											<li>
												<DatePicker
													label="체류시간"
													name="stytime"
													format="HH:mm"
													picker="time"
													placeholder={'시분 선택'}
													showNow={false}
													allowClear
													// required
												/>
											</li>
											<li>
												<InputText name="garageAddress1" label={'행정동 정보'} /> {/* 행정동 주소1 */}
											</li>
											<li>
												<InputText name="garageAddress2" label={'행정동 상세주소'} />
											</li>
											<li>
												<InputText name="garageAddress3" label={'도로명 정보'} /> {/* 도로명 주소1 */}
											</li>
											<li>
												<InputText name="garageAddress4" label={'도로명 상세주소'} />
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>
									<GridTopBtn gridTitle="센터 입출차정보" gridBtn={gridBtn1} />
									<GridAutoHeight height={300}>
										<AUIGrid ref={gridRef1} columnLayout={inoutGridCol} gridProps={inoutGridProps} />
									</GridAutoHeight>
									<TableTopBtn tableTitle={'기사정보'} tableBtn={tableBtn3} className="mt20">
										<Button onClick={() => setFormDriverNew(!formDriverNew)}>{formDriverNew ? '신규' : '취소'}</Button>
									</TableTopBtn>
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-2">
											<Form.Item name="driverId" hidden>
												<Input />
											</Form.Item>
											<Form.Item name="driverCode" hidden>
												<Input />
											</Form.Item>
											<li>
												<CmDriverSearch
													name="driverName"
													code="driverCode"
													form={detailForm}
													label={t('lbl.DRIVERNAME')}
													returnValueFormat="onlyName"
													nameOnly={true}
													callBack={callBackPoup}
													disabled={formDriverNew}
													required
													// rules={[{ required: true, validateTrigger: 'none' }]}
												/>
												{/* <InputText name="driverName" placeholder="입력해주세요" label={t('lbl.DRIVER1')} /> */}
												{/* 기사명 */}
											</li>
											<li>
												<InputText name="driver1" label={t('lbl.DRIVERID')} disabled /> {/* 기사ID */}
											</li>
											<li>
												<InputText
													name="phone1"
													label={'기사 전화번호'}
													required
													maxLength={13}
													rules={[
														{
															pattern: PHONE_PATTERN,
															message: '올바른 전화번호 형식이 아닙니다.',
														},
														{
															required: true,
															validateTrigger: 'onBlur',
														},
													]}
													onBlur={(e: any) => {
														const formatted = dataRegex.formatPhone(e.target.value);
														detailForm.setFieldsValue({ phone1: formatted });
													}}
												/>
												{/* 기사 전화번호 */}
											</li>
											<li>
												<Rangepicker
													name="workTime"
													// onChange={onChangeAddDt}
													allowClear
													showNow={false}
													label={'총근무시간'}
													format="HH:mm"
													picker="time"
													order={false}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
													onChange={onValuesChange}
												/>
												{/* 총근무시간 */}
											</li>
											<li>
												<InputText name="driver2" label={'동승자명'} /> {/* 동승자명 */}
											</li>
											<li>
												<InputText
													name="phone2"
													label={'동승자연락처'}
													onBlur={(e: any) => {
														const formatted = dataRegex.formatPhone(e.target.value);
														detailForm.setFieldsValue({ phone2: formatted });
													}}
												/>{' '}
												{/* 동승자연락처 */}
											</li>
											<li>
												<SelectBox
													name="btScannerGive"
													label={'스캐너 지급 유무'}
													options={getCommonCodeList('YN', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
												{/* 블루투스스캐너 지급 유무 */}
											</li>
											<li>
												<InputText name="pdaPhone2" label={'스캐너 시리얼번호'} />
												{/* 블루투스스캐너 시리얼번호 */}
											</li>
											<li>
												<SelectBox
													name="smpGive"
													label={'스마트폰 지급 유무'}
													options={getCommonCodeList('YN', '--- 선택---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
											</li>
											{/* 스마트폰 지급 유무 */}
											<li>
												<DatePicker name="toDate" label={'보건증유효기간'} />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="driverMemo" label={t('lbl.MEMO')} /> {/* 메모 */}
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>
								</Form>
							</ScrollBox>
						</AGrid>
					</>,
				]}
			/>
			{/* 지도팝업 */}
			<CustomModal ref={refModal} width="1280px">
				<CmMapPopup
					setSearchLatLng={setSearchLatLng}
					setAddressInfo={setAddressInfo}
					searchText={searchAddr}
					close={popupCloseEvent}
					lat={latLng[0]}
					lon={latLng[1]}
					showRadius={true}
					radius={radius}
					stytime={stytime}
					callBackFn={(result: any) => {
						setRadius(result.radius);
						setStytime(result.stytime);

						detailForm.setFieldsValue({
							stytime: result.stytime ? dayjs(padTime(result.stytime), 'HHmm') : '',
							radius: result.radius,
						});
					}}
				/>
			</CustomModal>

			{/* 출발지TC센터설정 팝업 */}
			<CustomModal ref={tcCodeCfgModal} width="1280px">
				<MsTcCodeCfgPopup close={handleCloseTcCodeCfgPopup} dcCode={selectDcCode} />
			</CustomModal>

			{/* 센터검색 팝업 */}
			<CustomModal ref={dcPopModal} width="1000px">
				<CmSearchPopup type={'tc'} callBack={confirmPopup} close={dcPopCloseEvent}></CmSearchPopup>
			</CustomModal>

			{/* 차량정보 파일업로드 */}
			<CustomModal ref={fileUploadModal} width="1084px">
				<MsCarDriverFileUploadPopup
					ref={fileUploadModal}
					paramAttchFileGrpNo={attchFileGrpNo}
					callBack={uploadPopCloseEvent}
				/>
			</CustomModal>
		</>
	);
});

export default MsCarDriverDetail;

const CustomForm = styled(Form)`
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
`;
