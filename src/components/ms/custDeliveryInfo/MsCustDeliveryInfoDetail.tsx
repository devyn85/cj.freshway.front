/*
 ############################################################################
 # FiledataField	: MsCustDeliveryInfoDetail.tsx
 # Description		: 기준정보 > 거래처기준정보 > 고객배송조건 
 # Author			: JeongHyeongCheol
 # Since			: 25.08.22
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Components
import CmMapPopup from '@/components/cm/popup/CmMapPopup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button, InputRange, InputSearch, InputText, LabelText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import MsCustDeliveryInfoFileUploadPopup from '@/components/ms/custDeliveryInfo/MsCustDeliveryInfoFileUploadPopup';
import MsCustDeliveryInfoUploadExcelPopup from '@/components/ms/custDeliveryInfo/MsCustDeliveryInfoUploadExcelPopup';
import MsCustDlvInfoHisPopup from '@/components/ms/popup/MsCustDlvInfoHisPopup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Switch } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import pLimit from 'p-limit';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// API Call Function
import {
	apiGetMaster,
	apiGetMasterPrintList,
	apiPostSaveMaster,
	apiPostSaveMasterList,
	apiSelectAddressList,
} from '@/api/ms/apiMsCustDeliveryInfo';

// util
import { showConfirm, showMessage } from '@/util/MessageUtil';

// types
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// hooks
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
interface MsCustDeliveryInfoDetailProps {
	form?: any;
	detailForm?: any;
	gridData?: Array<object>;
	setCurrentPage?: any;
	totalCount?: number;
	search?: any;
	selectedRow?: any;
	setSelectedRow?: any;
}
const MsCustDeliveryInfoDetail = forwardRef((props: MsCustDeliveryInfoDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, detailForm, setCurrentPage, totalCount, gridData, search, selectedRow, setSelectedRow } = props;
	const { t } = useTranslation();
	const { VITE_EDMS_IMG_URL } = import.meta.env; // EDMS 이미지 URL

	const [gridForm] = Form.useForm();
	const tableRef = useRef(null);
	const receiveHistoryRef = useRef(null);
	const mapModalRef = useRef(null);
	const imageRef = useRef(null);
	const custRef = useRef(null);
	const excelRef = useRef(null);
	const [cust, setCust] = useState('');
	const [popupType, setPopupType] = useState('cust');

	// 이미지 업로드
	const [custkey, setCustkey] = useState('');
	const [code, setCode] = useState('');

	const [isDetailResearch, setIsDetailResearch] = useState(false);
	const [formDisabled, setFormDisabled] = useState(true);
	// const [selectedRow, setSelectedRow] = useState(null);

	// switch
	const [switchStates, setSwitchStates] = useState({
		kidsClYn: false,
		dlvWaitYn: false,
		distantYn: false,
		lngDistantYn: false,
		faceinspectExpPayYn: false,
	});

	const [selectBoxFaceinspectBoolean, setSelectBoxFaceinspectBoolean] = useState(false);
	const [switchFaceInspectionYnBoolean, setSwitchFaceInspectionYnBoolean] = useState(false);

	// 지도 관련 상태
	const [searchAddr, setSearchAddr] = useState('');
	const [radius, setRadius] = useState('');
	const [stytime, setStytime] = useState('');
	const APP_KEY = constants.TMAP.APP_KEY;
	const limit = pLimit(10); // tmap 호출시 동시에 10개만 허용

	// 유효성
	/**
	 * 전화번호 및 팩스번호 정규식 패턴
	 * 기존: 010, 011, 016, 017, 018, 019
	 * 추가: 02, 031, 032, 033, 041, 042, 051, 052, 053, 054, 055, 061, 062, 063, 064, 070
	 * 비고1: 하이픈 포험, 미포함 커버 (기존방식에서 변경)
	 * 비고2: 3자리-4자리, 4자리-3자리 커버
	 * 비고3: 하이픈 없이 입력시 자동으로 하이픈 붙여주는 기능O (공통 개발 사항)
	 */
	const PHONE_PATTERN = /^(01[016-9]|02|0[3-6]\d|070|080)-?\d{3,4}-?\d{4}$/;
	const NUMBER_PATTERN = /^\d+$/;
	const WORKTIME_PATTERN = /^\d{1,4}$/;

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	// 거래처 유형명
	const custtypedescrLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	};

	// 분류유형
	const custgroupLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTOMER-CUSTTYPE', value)?.cdNm;
	};
	// 삭제여부
	const delYnLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('DEL_YN', value)?.cdNm;
	};

	// 시간변환
	const timeFormatLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		if (!value) {
			return value;
		}

		const cleanedStr = value.trim();

		if (cleanedStr.includes(':')) {
			return cleanedStr;
		}

		// 콜론이 없고 길이가 4인 경우 (예: '0000', '1430')
		if (cleanedStr.length === 4) {
			// 앞 두 자리는 시(Hour), 뒤 두 자리는 분(Minute)
			const hour = cleanedStr.substring(0, 2);
			const minute = cleanedStr.substring(2, 4);

			// HH:MM 포맷으로 조합하여 반환
			return `${hour}:${minute}`;
		}

		// 그 외 처리 불가능한 경우 (길이가 4가 아니거나 예상치 못한 포맷)
		return value;
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dlvDccode',
			//dlvDcname
			headerText: t('lbl.DLV_DCCODE'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custtype',
			headerText: t('lbl.CUSTTYPE'),
			labelFunction: custtypedescrLabelFunc,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.CUST_CODE'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.CUST_NAME'),
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'armyYn',
			headerText: t('lbl.ARMY_YN'),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN2'),
			},
		},
		{
			dataField: 'distancetype',
			headerText: t('lbl.PICKINGTYPE'),
			editRenderer: {
				type: 'ComboBoxRenderer',
				list: getCommonCodeList('DISTANCETYPE'),
				keyField: 'comCd',
				valueField: 'comCd',
				autoCompleteMode: true,
				autoEasyMode: true,
				matchFromFirst: false,
			},
		},
		{
			dataField: 'districtname',
			headerText: '권역(MDM)',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dlvInfoApplyYn',
			headerText: '배송정보적용요청여부',
			editable: false,
		},

		{
			dataField: 'custgroup',
			headerText: '고객분류',
			labelFunction: custgroupLabelFunc,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'hqCustkey',
			headerText: t('lbl.BRAND_CUSTKEY'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'hqCustname',
			headerText: t('lbl.BRAND_CUSTNAME2'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'saleCustkey',
			headerText: t('lbl.TO_VATNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'saleCustname',
			headerText: t('lbl.TO_VATOWNER'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'mngCustkey',
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'mngCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'truthcustkey',
			headerText: t('lbl.TRUTH_CUSTKEY'),
			commRenderer: {
				type: 'search',
				// align: 'left' | 'center' | 'right'
				popupType: 'cust',
				searchDropdownProps: {
					dataFieldMap: {
						truthcustkey: 'code',
						truthaddress1: 'address1',
						truthaddress2: 'address2',
					},
					callbackBeforeUpdateRow: async (e: any) => {
						const selectRow = [e];

						if (e.which === 'clipboard') {
							setCust(selectRow[0].code);

							const checkedRowItems = gridRef.current.getCheckedRowItems();
							const updateObj = e.updateObj;
							const updateIndexs = checkedRowItems
								.filter((item: any) => item.item.uid === e.item.uid)
								.map((item: any) => item.rowIndex);

							await handleSearch(selectRow[0].address1).then((result: any) => {
								updateObj.latitude = result.latitude;
								updateObj.longitude = result.longitude;
								detailForm.setFieldValue('truthaddress1', selectRow[0].address1);
								detailForm.setFieldValue('truthaddress2', selectRow[0].address2);
								detailForm.setFieldValue('truthcustkey', selectRow[0].code);
								detailForm.setFieldValue('truthcustname', selectRow[0].name);
								gridRef.current.restoreEditedCells(updateIndexs); // 이전값으로 복구 ( 편집 셀 닫기 )
								gridRef.current.updateRows(updateObj, updateIndexs); // 드롭다운에서 선택한 값으로 행 업데이트
							});
							return true;
						} else {
							confirmPopup(selectRow);
						}
					},
				},
				onClick: function (e: any) {
					setPopupType('cust');
					custRef.current.handlerOpen();
				},
			},
		},
		{
			dataField: 'recTruthcustkey',
			headerText: '추천실착지코드',
			commRenderer: {
				type: 'confirm',
				// align: 'left' | 'center' | 'right'
				labelText: '추천실착지코드',
				onClick: function (event: any) {
					setPopupType('truthcustkey');
					setCust(event.item.custkey);
					custRef.current.handlerOpen();
				},
				visibleFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					// 행 아이템의 추천실착지 코드 케이스가 아니라면 버튼 표시 하지 않음
					if (item?.recTruthcustkey === 'N') {
						return false;
					}
					return true;
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.recTruthcustkey === 'N') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'truthaddress1',
			headerText: '실착지주소',
			editable: false,
			visible: false,
		},
		{
			dataField: 'truthaddress2',
			headerText: '실착지상세주소',
			editable: false,
			visible: false,
		},
		{
			dataField: 'latitude',
			headerText: '실착지위경도',
			editable: false,
			visible: false,
		},
		{
			dataField: 'longitude',
			headerText: '실착지위경도',
			editable: false,
			visible: false,
		},
		{
			dataField: 'faceinspect',
			headerText: t('lbl.FACE_TO_FACE_INSPECTION_YN '),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN2'),
			},
		},
		{
			dataField: 'reqdlvtime2From',
			headerText: 'OTD(From)',
			labelFunction: timeFormatLabelFunc,
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99',
				textAlign: 'center',
				placeholder: '__:__', // 플레이스홀더
				applyMaskValue: true, // 실제 데이터 적용은 마스크 풀린 값이 적용됨.
				validator: function (oldValue: any, newValue: any, item: any) {
					// 에디팅 유효성 검사
					let isValid = true;
					const timeArr = newValue.split(':');

					// 시간 영역 체크 00:00 ~ 23:59 까지만 가능
					if (parseInt(timeArr[0]) > 23 || parseInt(timeArr[1]) > 59) {
						isValid = false;
					}

					return { validate: isValid, message: t('msg.MSG_COM_VAL_221') };
				},
			},
		},
		{
			dataField: 'reqdlvtime2To',
			headerText: 'OTD(To)',
			labelFunction: timeFormatLabelFunc,
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99',
				textAlign: 'center',
				placeholder: '__:__', // 플레이스홀더
				applyMaskValue: true, // 실제 데이터 적용은 마스크 풀린 값이 적용됨.
				validator: function (oldValue: any, newValue: any, item: any) {
					// 에디팅 유효성 검사
					let isValid = true;
					const timeArr = newValue.split(':');

					// 시간 영역 체크 00:00 ~ 23:59 까지만 가능
					if (parseInt(timeArr[0]) > 23 || parseInt(timeArr[1]) > 59) {
						isValid = false;
					}

					return { validate: isValid, message: t('msg.MSG_COM_VAL_221') };
				},
			},
			// dataType: 'date',
			// formatString: 'hh:MM',
		},
		{
			dataField: 'keytype2',
			headerText: t('lbl.ENTRANCEKEYINFO'),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('CRM_DLV_KEYTYPE'),
			},
		},
		{
			dataField: 'keydetail',
			headerText: t('lbl.ENTRANCEKEYDETAILINFO'),
		},
		{
			dataField: 'floor',
			headerText: '층수',
		},
		// {
		// 	dataField: 'tonnage',
		// 	headerText: '차량진입 제한(톤수)',
		// 	commRenderer: {
		// 		type: 'dropDown',
		// 		list: getCommonCodeList('TONNAGE'),
		// 	},
		// },

		{
			dataField: 'freezeplace',
			headerText: '적재위치(냉동)',
		},
		{
			dataField: 'coldplace',
			headerText: '적재위치(냉장)',
		},
		{
			dataField: 'htemperature',
			headerText: '적재위치(상온)',
		},
		{
			dataField: 'loadplace2',
			headerText: t('lbl.LOADPLACE'),
		},
		{
			dataField: 'empname1',
			headerText: 'MA명',
			editable: false,
		},

		{
			dataField: 'initdeliverydesc',
			headerText: '초도배송메모',
			editable: false,
			visible: false,
		},
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},

		{
			dataField: 'adddate',
			headerText: t('lbl.CREATEDATE'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			labelFunction: delYnLabelFunc,
			editable: false,
		},

		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.MODIFYDATE'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'cardmemo',
			headerText: '요청사항(거래처카드)',
		},
	];
	// 그리드 속성
	const gridProps = {
		enableFilter: true,
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		rowIdField: 'uid',
		exportToXlsxGridCustom: () => {
			const params = {
				exceptColumnFields: ['addwho', 'regNm', 'editwho', 'updNm'], // 제외컬럼
				columnSizeOfDataField: { dlvInfoApplyYn: 200 },
			};
			gridRef.current?.exportToXlsxGrid(params);
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 일괄적용
	 * @returns {void}
	 */
	const batchApp = async () => {
		const type = gridForm.getFieldValue('truthType');
		if (!type) {
			showMessage({
				content: '실착지 적용을 선택해주세요',
				modalType: 'info',
			});
			return;
		}

		const checkedItems = gridRef.current?.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경
		const allData = gridRef.current.getGridData();
		// setGridData() 호출 시 체크가 해제되므로, 이전에 체크된 행들의 ID를 저장해 둡니다.
		const getAddress = apiSelectAddressList;
		const checkedRowIds = checkedItems.map((item: any) => item.item.uid);
		const checkedRowIndexes = new Set(checkedRowIds);
		const newData = await Promise.all(
			allData.map(async (row: any, index: number) => {
				if (checkedRowIndexes.has(row.uid)) {
					let latitude;
					let longitude;
					const truthcustkey = type === 'C02' ? row.saleCustkey : row.mngCustkey;

					const params = {
						name: truthcustkey,
						multiSelect: '',
						startRow: 0,
						listCount: 5000,
						skipCount: true,
					};
					if (params.name) {
						try {
							const res = await getAddress(params);

							// api 조회 결과
							if (res.data.length === 1) {
								const updaterow = res.data[0]; // 드롭다운 데이터가 1개일 경우 바로 행 업데이트
								const geoResult = await handleSearch(updaterow.address1);
								latitude = geoResult.latitude;
								longitude = geoResult.longitude;
								return {
									...row,
									truthcustkey: truthcustkey,
									truthaddress1: updaterow.address1,
									truthaddress2: updaterow.address2,
									latitude: latitude,
									longitude: longitude,
								};
							}
						} catch (error) {
							// console.error('조회 중 오류 발생:', error);
						}
					} else {
						return {
							...row,
							truthcustkey: truthcustkey,
							truthaddress1: '',
							truthaddress2: '',
							latitude: '',
							longitude: '',
						};
					}
				}
				return row;
			}),
		);
		// setGridData 대신 updateRowsById 사용햐여 변경된 행만 업데이트
		if (newData.length > 0) {
			gridRef.current.updateRowsById(newData, true); // isMarkEdited: true
		}
		// 이전에 체크된 행들을 다시 체크합니다.
		gridRef.current.setCheckedRowsByIds(checkedRowIds);
	};

	// 시간정보정제
	const padTime = (timeStr: string) => {
		// 1. 콜론(':')을 제거 (예: '10:00' -> '1000', '9:30' -> '930')
		const cleanStr = String(timeStr).replace(/:/g, '');

		// 2. 4자리로 만들고 앞을 '0'으로 채움 (예: '930' -> '0930')
		return cleanStr.padStart(4, '0');
	};
	const formatTime = (timeStr: any) => {
		if (!timeStr) return '';
		// "HHmm" 형태로 들어온 문자열을 "HH:mm"으로 변환
		const timeObj = dayjs(timeStr, 'HHmm');
		return timeObj.isValid() ? timeObj.format('HH:mm') : '';
	};
	/**
	 * 그리드 프린트
	 * @returns {void}
	 */
	const printMasterList = async () => {
		const multiCustkey: any[] = [];
		const params = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			multiCustkey.push(item.custkey); // 메인 로직
			const startTime = formatTime(item?.reqdlvtime2From);
			const endTime = formatTime(item?.reqdlvtime2To);

			return {
				...item,
				description: item.custname,
				arrivaladdress: item.truthaddress1,
				arrivaldetailaddress: item.truthaddress2,
				arrivalpostalcodeFmt: item.truthzipcode,
				temptarget: getCommonCodebyCd('CRM_DLV_TMEPTARGET', item.temptarget)?.cdNm,
				deliveryrequesttimestart: startTime,
				deliveryrequesttimeend: endTime,
				ftfinspectionyn: item.faceinspect,
				movemententry: item.accessway,
				goodslocationroom: item.htemperature,
				goodslocationrefrig: item.coldplace,
				goodslocationfrozen: item.freezeplace,
				returnlocation: item.loadplace2,
				parkingheightnm: getCommonCodebyCd('CRM_DLV_PARKINGHEIGHT', item.parkingheight)?.cdNm,
				keytype: getCommonCodebyCd('CRM_DLV_KEYTYPE', item.keytype)?.cdNm,
				keytype2: getCommonCodebyCd('CRM_DLV_KEYTYPE', item.keytype2)?.cdNm,
				deliveryavailabletimenm: getCommonCodebyCd('CRM_DLV_DELIVERYAVLTIME', item.deliveryavailabletime)?.cdNm,
				buildingopentimenm: getCommonCodebyCd('CRM_DLV_BUILDINGOPENTIME', item.buildingopentime)?.cdNm,
				initdeliverydesc: item.initdeliverydesc,
				initrequesttimestart: formatTime(item?.initrequesttimestart),
				initrequesttimeend: formatTime(item?.initrequesttimeend),
			};
		});

		if (params.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		const printParam = { custkey: multiCustkey.join(',') };
		const edmsUrl = `${VITE_EDMS_IMG_URL}/101/`;

		await apiGetMasterPrintList(printParam).then(res => {
			res.data.forEach((item: any) => {
				params.forEach((pItem: any) => {
					if (pItem?.custkey === item?.issueno) {
						pItem.storeAccessRoute_1 = item?.storeAccessRoute1 ? edmsUrl + item?.storeAccessRoute1 : '';
						pItem.storeAccessRoute_2 = item?.storeAccessRoute2 ? edmsUrl + item?.storeAccessRoute2 : '';
						pItem.storeAccessRoute_3 = item?.storeAccessRoute3 ? edmsUrl + item?.storeAccessRoute3 : '';
						pItem.storeAccessRoute_4 = item?.storeAccessRoute4 ? edmsUrl + item?.storeAccessRoute4 : '';
						pItem.goodslocationfrozen_1 = item?.goodslocationfrozen1 ? edmsUrl + item?.goodslocationfrozen1 : '';
						pItem.goodslocationfrozen_2 = item?.goodslocationfrozen2 ? edmsUrl + item?.goodslocationfrozen2 : '';
						pItem.goodslocationrefrig_1 = item?.goodslocationrefrig1 ? edmsUrl + item?.goodslocationrefrig1 : '';
						pItem.goodslocationrefrig_2 = item?.goodslocationrefrig2 ? edmsUrl + item?.goodslocationrefrig2 : '';
						pItem.goodslocationroom_1 = item?.goodslocationroom1 ? edmsUrl + item?.goodslocationroom1 : '';
						pItem.goodslocationroom_2 = item?.goodslocationroom2 ? edmsUrl + item?.goodslocationroom2 : '';
						pItem.returnlocation_1 = item?.returnlocation1 ? edmsUrl + item?.returnlocation1 : '';
						pItem.returnlocation_2 = item?.returnlocation2 ? edmsUrl + item?.returnlocation2 : '';
					}
				});
			});
		});

		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
			viewRdReportMaster(params);
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param params
	 */
	const viewRdReportMaster = (params: any) => {
		// 리포트 파일명
		const fileName = 'MS_CustDelivery.mrd';
		// 리포트에 전송할 파라미터
		const reprotParams = {
			TITLE: '거래처정보',
		};
		// 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = { ds_report: params };
		reportUtil.openAgentReportViewer(fileName, dataSet, reprotParams);
	};

	/**
	 * 목록 수정사항 저장
	 * @returns {void}
	 */
	const saveMasterList = async () => {
		// 변경 데이터 확인

		const params = gridRef.current.getChangedData();
		// validation
		if (params.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}
		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		const saveParams = params.map((item: any) => {
			return {
				...item,
				reqdlvtime2From: item.reqdlvtime2From ? padTime(item.reqdlvtime2From) : '',
				reqdlvtime2To: item.reqdlvtime2To ? padTime(item.reqdlvtime2To) : '',
			};
		});
		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(saveParams).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						search(); // 콜백 함수 호출
					},
				});
			});
		});
	};

	/**
	 * 상세정보 호출
	 * @param {any} values 조회 데이터
	 * @returns {void}
	 */
	const searchMaster = (values: any) => {
		const params = values;

		apiGetMaster(params).then(res => {
			const masterData = res.data.masterDto;
			form.resetFields();
			detailForm.resetFields();

			if (masterData) {
				form.setFieldsValue({
					...masterData,
					stytime: '',
					reqdlvtime2From: '',
					reqdlvtime2To: '',
					// avgWorkTime: '',
					deliverynotitimestart: '',
					dlvDccode: selectedRow?.dlvDccode,
					regNm: masterData.regNm ? masterData.regNm : masterData.addwho,
					updNm: masterData.updNm ? masterData.updNm : masterData.editwho,
					rowStatus: 'R',
				});

				detailForm.setFieldsValue({
					...masterData,
					longitude: masterData.longitude ? fixValue(masterData.longitude) : null,
					latitude: masterData.latitude ? fixValue(masterData.latitude) : null,
					stytime: masterData.stytime ? dayjs(padTime(masterData.stytime), 'HHmm') : '',
					reqdlvtime2From: masterData.reqdlvtime2From ? dayjs(padTime(masterData.reqdlvtime2From), 'HHmm') : '',
					reqdlvtime2To: masterData.reqdlvtime2To ? dayjs(padTime(masterData.reqdlvtime2To), 'HHmm') : '',
					// avgWorkTime: masterData.avgWorkTime ? dayjs(padTime(masterData.avgWorkTime), 'mm') : '',
					deliverynotitimestart: masterData.deliverynotitimestart
						? dayjs(padTime(masterData.deliverynotitimestart), 'HHmm')
						: '',
					initrequesttimestart: masterData.initrequesttimestart ? formatTime(masterData.initrequesttimestart) : '',
					initrequesttimeend: masterData.initrequesttimeend ? formatTime(masterData.initrequesttimeend) : '',
				});

				// 대면검수여부 select box 값이 N 이면 disable : true 처리.
				// setSelectBoxFaceinspectBoolean(
				// 	commUtil.isEmpty(masterData.faceinspect) || masterData.faceinspect == 'N' ? true : false,
				// );
				// 대면검수여부 select box 값이 N이면 대면비용지급여부 switch 값 disable : true 처리
				setSwitchFaceInspectionYnBoolean(
					commUtil.isEmpty(masterData.faceinspect) || masterData.faceinspect == 'N' ? true : false,
				);

				setSwitchStates(prevStates => {
					return {
						...prevStates,
						kidsClYn: masterData.kidsClYn === 'Y',
						dlvWaitYn: masterData.dlvWaitYn === 'Y',
						distantYn: masterData.distantYn === 'Y',
						lngDistantYn: masterData.lngDistantYn === 'Y',
						faceinspectExpPayYn: masterData.faceinspectExpPayYn === 'Y',
					};
				});
				setRadius(masterData.radius);
				setStytime(masterData.stytime);
				setCust(masterData.truthcustkey);
				setFormDisabled(false);
			}
		});
	};

	/**
	 * 상세정보 수정사항 저장
	 * @returns {void}
	 */
	const saveMaster = async () => {
		// 변경 여부 검증
		if (form.getFieldValue('rowStatus') === 'R') {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		const isValid = await validateForm(detailForm);
		if (!isValid) {
			return;
		}

		const params = {
			...form.getFieldsValue(true),
			...detailForm.getFieldsValue(true),
			stytime:
				detailForm.getFieldValue('stytime') === '' || detailForm.getFieldValue('stytime') === null
					? ''
					: detailForm.getFieldValue('stytime').format('HHmm'),
			reqdlvtime2From:
				detailForm.getFieldValue('reqdlvtime2From') === '' || detailForm.getFieldValue('reqdlvtime2From') === null
					? ''
					: detailForm.getFieldValue('reqdlvtime2From').format('HHmm'),
			reqdlvtime2To:
				detailForm.getFieldValue('reqdlvtime2To') === '' || detailForm.getFieldValue('reqdlvtime2To') === null
					? ''
					: detailForm.getFieldValue('reqdlvtime2To').format('HHmm'),
			// avgWorkTime:
			// 	detailForm.getFieldValue('avgWorkTime') === '' || detailForm.getFieldValue('avgWorkTime') === null
			// 		? ''
			// 		: detailForm.getFieldValue('avgWorkTime').format('mm'),
			deliverynotitimestart:
				detailForm.getFieldValue('deliverynotitimestart') === '' ||
				detailForm.getFieldValue('deliverynotitimestart') === null
					? ''
					: detailForm.getFieldValue('deliverynotitimestart').format('HHmm'),
		};
		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveMaster(params).then((res: any) => {
				if (res.data.statusCode > -1) {
					form.setFieldValue('rowStatus', 'R');
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: async () => {
							await search(); // 콜백 함수 호출
						},
					});
				}
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
			btnArr: [
				{
					btnType: 'print', // 인쇄
					callBackFn: printMasterList,
				},
				{
					btnType: 'save', // 저장
					callBackFn: saveMasterList,
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
			tGridRef: tableRef, // 타겟 그리드 Ref
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
	 * 상세 표 버튼 설정
	 * @returns {TableBtnPropsType} 표 버튼 설정 객체
	 */
	const setTableBtn2 = () => {
		const tableBtn: TableBtnPropsType = {
			tGridRef: tableRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn1', // 수신내역
					btnLabel: '수신내역',
					callBackFn: () => {
						const custkey = form.getFieldValue('custkey');
						setCustkey(custkey);
						receiveHistoryRef.current.handlerOpen();
					},
				},
			],
		};

		return tableBtn;
	};

	// 상세 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: tableRef, // 타겟 그리드 Ref
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		const key = Object.keys(changedValues);
		const value = Object.values(changedValues);
		if (key.length > 0) {
			// 변경된 값이 있을 때만 처리
			form.setFieldValue('rowStatus', 'U');
		} else {
			form.setFieldValue('rowStatus', 'R');
		}

		if (key.includes('truthcustkey') && value.includes('')) {
			detailForm.setFieldsValue({
				truthcustkey: '',
				truthcustname: '',
				truthaddress1: '',
				truthaddress2: '',
				latitude: '',
				longitude: '',
			});
		}
		if (key.includes('truthcustkey')) {
			setCust(changedValues.truthcustkey);
		}
		if (changedValues.radius) {
			setRadius(changedValues.radius);
		}
		if (changedValues.stytime) {
			setStytime(changedValues.stytime.format('HHmm'));
		}
		if (changedValues.unloadLvlCd) {
			setSwitchStates({
				kidsClYn: false,
				dlvWaitYn: false,
				distantYn: false,
				lngDistantYn: false,
				faceinspectExpPayYn: false,
			});
		}
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onChangeFaceInspect = (changedValues: any, allValues: any) => {
		const key = Object.keys(changedValues);
		const value = Object.values(changedValues);
		if (key.length > 0) {
			// 변경된 값이 있을 때만 처리
			form.setFieldValue('rowStatus', 'U');
		} else {
			form.setFieldValue('rowStatus', 'R');
		}
		// 대명비용지급여부 switch 사용 가능 하게 활성화 처리.
		setSwitchFaceInspectionYnBoolean(value[0] === 'Y' ? false : true);
		// 특수조건 대면비용지급여부 unchecked 처리.
		setSwitchStates(preVal => {
			return {
				...preVal,
				faceinspectExpPayYn: false,
			};
		});

		// switch value N 으로 설정 해서 switch 사용 안함으로 토굴 처리.
		detailForm.setFieldValue('faceinspectExpPayYn', 'N');
	};

	// 공통 onChange 핸들러
	const handleSwitchChange = (checked: any, name: string) => {
		form.setFieldValue('rowStatus', 'U');
		detailForm.setFieldValue('unloadLvlCd', null);

		/*
		 	kidsClYn : 키즈 분류여부
			dlvWaitYn: 납품 대기 여부
			distantYn: 격오지 여부
			lngDistantYn: 장거리여부
			faceinspectExpPayYn: 대면검수 비용지급
		 */
		setSwitchStates(prevStates => {
			// 1. '격오지' 또는 '장거리' 스위치를 켰을 때
			if (checked && (name === 'distantYn' || name === 'lngDistantYn')) {
				return {
					...prevStates,
					kidsClYn: false,
					dlvWaitYn: false,
					distantYn: name === 'distantYn',
					lngDistantYn: name === 'lngDistantYn',
					faceinspectExpPayYn: false,
				};
			}
			// '키즈' 켜지면 '납품대기' 스위치를 켜야함.
			else if (checked && name === 'kidsClYn') {
				// '격오지'와 '장거리'를 false로 초기화

				return {
					...prevStates,
					[name]: checked,
					dlvWaitYn: true, // 납품 대기 여부
					distantYn: false,
					lngDistantYn: false,
				};
			}
			// '납품대기' 켜지면 '격오지여부,장거리여부 초기화'. 그외 놔둠.
			else if (checked && name === 'dlvWaitYn') {
				// '격오지'와 '장거리'를 false로 초기화
				return {
					...prevStates,
					[name]: checked,
					distantYn: false,
					lngDistantYn: false,
				};
			}
			// 대면비용지급여부 스위치를 켰을대 납품대기여부 켜줘야 함.
			else if (checked && name === 'faceinspectExpPayYn') {
				return {
					...prevStates,
					[name]: checked,
					dlvWaitYn: true, // 납품 대기 여부
					distantYn: false,
					lngDistantYn: false,
					kidsClYn: false,
				};
			} else {
				// 일반적인 상태 변경
				return {
					...prevStates,
					// kidsClYn: false,
					// dlvWaitYn: false,
					// distantYn: false,
					// lngDistantYn: false,
					// faceinspectExpPayYn: false,
					[name]: checked,
				};
			}
		});
	};

	/**
	 * =====================================================================
	 *  popup 관련 함수
	 * =====================================================================
	 */

	// 고객배송조건 수신이력 팝업 콜백
	const handleCustDlvInfoHisCallback = (data: any) => {
		// detailForm.resetFields();
		if (data.sourceSystem === 'OFN') {
			detailForm.setFieldsValue({
				keytype2: data.keytype,
				keydetail: data.keydetail,
				initdeliverydesc: data.initdeliverydesc,
				status: data.status,
				serialkeyHis: data.serialkeyHis,
				truthzipcode: data.truthzipcode, // 우편번호
			});
		} else if (data.sourceSystem === 'CS') {
			detailForm.setFieldsValue({
				keytype2: data.keytype,
				keydetail: data.keydetail,
				inspectionworkerphone: data.inspectionworkerphone,
				inspectorprintyn: data.inspectorprintyn,
				deliveryavailabletime: data.deliveryavailabletime,
				buildingopentime: data.buildingopentime,
				accessway: data.accessway, // as is MOVEMENTENTRY
				freezeplace: data.freezeplace, // as is GOODSLOCATIONFROZEN
				coldplace: data.coldplace, // as is GOODSLOCATIONREFRIG
				htemperature: data.htemperature, // as is GOODSLOCATIONROOM
				loadplace2: data.loadplace2, // as is RETURNLOCATION
				status: data.status,
				serialkeyHis: data.serialkeyHis,
				truthzipcode: data.truthzipcode, // 우편번호
			});
		} else {
			detailForm.setFieldsValue({
				...data,
				stytime: data.stytime ? dayjs(data.stytime, 'HHmm') : '',
				reqdlvtime2From: data.reqdlvtime2From ? dayjs(data.reqdlvtime2From, 'HHmm') : '',
				reqdlvtime2To: data.reqdlvtime2To ? dayjs(data.reqdlvtime2To, 'HHmm') : '',
				// avgWorkTime: data.avgWorkTime ? dayjs(data.avgWorkTime, 'mm') : '',
				deliverynotitimestart: data.deliverynotitimestart ? dayjs(data.deliverynotitimestart, 'mm') : '',
				status: data.status,
				serialkeyHis: data.serialkeyHis,
				truthzipcode: data.truthzipcode, // 우편번호
			});
		}
		setSwitchStates(prevStates => {
			return {
				...prevStates,
				kidsClYn: data.kidsClYn === 'Y',
				dlvWaitYn: data.dlvWaitYn === 'Y',
				distantYn: data.distantYn === 'Y',
				lngDistantYn: data.lngDistantYn === 'Y',
			};
		});
		form.setFieldValue('rowStatus', 'U');
		closeEvent();
	};

	/**
	 * 거래처코드 팝업조회
	 * @returns {void}
	 */
	const getCustkey = () => {
		setPopupType('cust');
		custRef.current.handlerOpen();
	};

	/**
	 * 거래처코드 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = async (selectedRow: any) => {
		if (selectedRow && gridRef?.current) {
			setTimeout(async () => {
				const code = popupType === 'truthcustkey' ? selectedRow[0]?.truthcustkey : selectedRow[0]?.code;
				const name = selectedRow[0]?.name;
				const address1 = popupType === 'truthcustkey' ? selectedRow[0]?.truthaddress1 : selectedRow[0]?.address1;
				const address2 = popupType === 'truthcustkey' ? selectedRow[0]?.truthaddress2 : selectedRow[0]?.address2;
				//console.log((`address1: ${address1}   || address2 : ${address2}`);
				gridRef.current?.setCellValue(gridRef.current.getSelectedIndex()[0], 'truthcustkey', code);
				detailForm.setFieldValue('truthcustkey', code);
				detailForm.setFieldValue('truthcustname', name);
				detailForm.setFieldValue('truthaddress1', address1);
				detailForm.setFieldValue('truthaddress2', address2);

				detailForm.setFieldValue('truthzipcode', ''); //

				await handleSearch(address1).then((result: any) => {
					// 결과가 없을 경우를 대비한 기본값 설정 및 구조 분해 할당
					const { latitude = '', longitude = '' } = result || {};

					// 업데이트용 객체 생성
					const updateObj = { latitude, longitude, truthaddress1: address1 };

					// Form 필드와 Grid 업데이트를 한 번에 처리
					detailForm.setFieldsValue(updateObj);
					gridRef.current.updateRow(updateObj, 'selectedIndex');
					custRef.current.handlerClose();
				});
				setCust(code);
			}, 0);
		}
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const excelUpload = () => {
		excelRef.current.handlerOpen();
	};

	/**
	 * 이미지 팝업
	 * @param type
	 */
	const imagePopup = (type: any) => {
		const custkey = form.getFieldValue('custkey');
		setCustkey(custkey);
		setCode(type);
		imageRef.current.handlerOpen();
	};

	/**
	 * 위/경도 조회 지도
	 */
	const searchMap = () => {
		const address = detailForm.getFieldValue('truthaddress1');
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
		if (searchLatLng?.length === 2 && gridRef.current) {
			const [latitude, longitude] = searchLatLng;
			// 선택된 행의 경도, 위도 업데이트
			detailForm.setFieldValue('longitude', fixValue(longitude));
			detailForm.setFieldValue('latitude', fixValue(latitude));
			form.setFieldValue('rowStatus', 'U');
			mapModalRef.current?.handlerClose();
		}
	};

	/**
	 * 지도 팝업 콜백 함수 (주소)
	 * @param {object} addressInfo 주소 정보
	 */
	const handleAddressCallback = (addressInfo: any) => {
		if (addressInfo?.fullAddress && gridRef.current) {
			detailForm.setFieldValue('truthaddress1', addressInfo.fullAddress3);
		}
	};

	/**
	 * 지도 api 콜백 함수 (주소)
	 * @param {object} addressInfo 주소 정보
	 * @param searchText
	 * @returns
	 */
	const handleSearch = async (searchText: any) => {
		// if (!keyword.trim() && !searchText.trim()) return;
		try {
			const response = await limit(() =>
				axios.get('https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?format=json&callback=result', {
					params: {
						version: 1,
						format: 'json',
						coordType: 'WGS84GEO',
						fullAddr: searchText,
					},
					headers: {
						appKey: APP_KEY,
					},
					withCredentials: false,
				}),
			);
			const { coordinateInfo } = response.data;
			if (coordinateInfo?.coordinate?.length === 0) {
				showAlert(null, t('msg.MSG_COM_ERR_007'));
				return;
			}

			// 검색 결과가 여러개 일 경우
			let lat = parseFloat(coordinateInfo.coordinate[0].lat);
			let lon = parseFloat(coordinateInfo.coordinate[0].lon);
			if (isNaN(lat) && isNaN(lon)) {
				lat = parseFloat(coordinateInfo.coordinate[0].newLat);
				lon = parseFloat(coordinateInfo.coordinate[0].newLon);
			}

			detailForm.setFieldValue('longitude', fixValue(lon));
			detailForm.setFieldValue('latitude', fixValue(lat));
			form.setFieldValue('rowStatus', 'U');
			const place = {
				longitude: fixValue(lon),
				latitude: fixValue(lat),
			};

			return place;
		} catch (error) {
			return;
		}
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		mapModalRef.current?.handlerClose();
		custRef.current?.handlerClose();
		excelRef.current?.handlerClose();
		receiveHistoryRef.current?.handlerClose();
		// imageRef.current?.handlerClose();
	};

	// 강 input text 의 제한 을 체크 하고 문자열을 자른다.
	const checkValidTextLenth =
		(fieldName: string, maxBytes: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { value } = e.target;
			const truncated = commUtil.truncateByBytes(value, maxBytes);

			if (value !== truncated) {
				detailForm.setFieldsValue({ [fieldName]: truncated });
			}
		};
	/**
	 * =====================================================================
	 *  그리드 이벤트 설정
	 * =====================================================================
	 */
	let prevRowIndex: any = null;
	const initEvent = () => {
		form.setFieldValue('rowStatus', 'R');
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 실행 시작시
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditBegin', function (event: any) {
			if (event.dataField === 'recTruthcustkey' && event.value === 'N') {
				return false;
			}
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
			if (event.primeCell?.item?.uid === prevRowIndex) return;
			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.item?.uid;
			const primeCell = event.primeCell;
			setSelectedRow(primeCell.item);
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

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		if (gridData.length > 0) {
			setFormDisabled(true);
			//rowIdField 설정
			const newRows = gridData.map((row: any, idx: any) => ({
				...row,
				uid: `ua-${row.custkey}`,
			}));
			gridRef.current.appendData(newRows);
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
			setIsDetailResearch(true);
		}
	}, [gridData]);

	useEffect(() => {
		if (selectedRow) {
			searchMaster(selectedRow);
			setIsDetailResearch(false);
		}
	}, [selectedRow, isDetailResearch]);

	// 특수조건 set
	useEffect(() => {
		detailForm.setFieldValue('kidsClYn', switchStates.kidsClYn ? 'Y' : 'N');
		detailForm.setFieldValue('dlvWaitYn', switchStates.dlvWaitYn ? 'Y' : 'N');
		detailForm.setFieldValue('distantYn', switchStates.distantYn ? 'Y' : 'N');
		detailForm.setFieldValue('lngDistantYn', switchStates.lngDistantYn ? 'Y' : 'N');
		detailForm.setFieldValue('faceinspectExpPayYn', switchStates.faceinspectExpPayYn ? 'Y' : 'N');
	}, [switchStates]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		tableRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={setGridBtn()} totalCnt={totalCount}>
								<Form layout="inline" form={gridForm}>
									<SelectBox
										name="truthType"
										label="실착지 적용"
										className="bg-white"
										options={[
											{ cdNm: '판매처', comCd: 'C02' },
											{ cdNm: '관리처', comCd: 'C03' },
										]}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										style={{ width: 150 }}
									/>
								</Form>
								<Button size={'small'} onClick={batchApp}>
									일괄적용
								</Button>
								<Button size={'small'} onClick={excelUpload}>
									엑셀업로드
								</Button>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid className="form-inner" style={{ padding: '10px 0', marginBottom: 0 }}>
							<TableTopBtn
								tableTitle={t('lbl.DETAIL')}
								tableBtn={setTableBtn()}
								className="fix-title"
								disabled={formDisabled}
							/>
							<ScrollBox>
								<div>
									{/*상세정보*/}
									<Form form={form} onValuesChange={onValuesChange} disabled={true}>
										<Form.Item name="serialkey" hidden />
										<Form.Item name="dlvDccode" hidden />
										<Form.Item name="districtcode" hidden />
										<Form.Item name="edmsfileid" hidden />
										<Form.Item name="kidsClYn" hidden />
										<Form.Item name="dlvWaitYn" hidden />
										<Form.Item name="distantYn" hidden />
										<Form.Item name="lngDistantYn" hidden />
										<Form.Item name="rowStatus" hidden />

										<UiDetailViewArea>
											<UiDetailViewGroup ref={tableRef}>
												<li>
													<InputText label={t('lbl.CUST_CODE')} name="custkey" allowClear={false} />
												</li>
												<li>
													<InputText label={'주출고센터'} name="dlvDccode" allowClear={false} />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.MNGPLCID')} name="dlvcustkey" allowClear={false} />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.CUST_NAME')} name="custname" allowClear={false} />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.MNGPLCIDNM')} name="dlvcustname" allowClear={false} />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputRange
														label={t('lbl.OTD_DELIVERYREQTIME')}
														fromName="reqdlvtime1From"
														toName="reqdlvtime1To"
														disabled={true}
													/>
												</li>
												<li>
													<InputText label={t('lbl.CUSTORDERCLOSETYPE')} name="custorderclosetype" allowClear={false} />
												</li>
												<li>
													<SelectBox
														label={t('lbl.FACE_TO_FACE_INSPECTION_YN ')}
														name="inspecttype"
														options={getCommonCodeList('YN')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.ADDRESS1')} name="address1" />
												</li>
												<li>
													<InputText label={'권역(MDM)'} name="districtname" />
												</li>
												<li>
													<SelectBox
														label={'강성거래처'}
														name="other02"
														options={getCommonCodeList('YN')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={'기본주소2'} name="address2" />
												</li>
												<li>
													<InputText label={t('lbl.ZIPCODE')} name="zipcode" />
												</li>
												<li>
													<SelectBox
														label={'RED Zone 여부'}
														name="qctype"
														options={getCommonCodeList('YN')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={'도로명주소'} name="address3" />
												</li>
												<li>
													<InputText label={t('lbl.PHONE')} name="phone1" />
												</li>
												<li>
													<SelectBox label={'거래처 열쇠 여부'} name="keytype" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={'도로명주소2'} name="address4" />
												</li>
												<li>
													<InputText label={t('lbl.FAX')} name="fax" />
												</li>
												<li>
													<InputText label={'거래처 열쇠수령장소'} name="other01" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.DLVSTRATEGY')} name="dlvstrategy1" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.ENTRYCONDITION')} name="entrycondition1" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={'하역조건1'} name="unloadcondition1" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={'하역조건2'} name="unloadcondition2" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.UNLOADPLACE')} name="unloadplace" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.LOADPLACE')} name="loadplace" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<SelectBox
														label={t('lbl.DELIVERYTYPE_2')}
														name="dlvtype"
														options={getCommonCodeList('CUSTOMER-SHIPTYPE')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<SelectBox
														label={t('lbl.VLT_TEMP_SUBMIT_YN')}
														name="tempertype"
														options={getCommonCodeList('CUSTOMER-TEMPTARGET')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.ADDWHO')} name="regNm" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.ADDDATE')} name="adddate" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.EDITWHO')} name="updNm" />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={t('lbl.EDITDATE')} name="editdate" />
												</li>
											</UiDetailViewGroup>
										</UiDetailViewArea>
									</Form>
									<TableTopBtn tableTitle={'거래처배송지정보'} tableBtn={setTableBtn2()} />
									<Form form={detailForm} onValuesChange={onValuesChange} disabled={formDisabled}>
										<Form.Item name="status" hidden />
										<Form.Item name="serialkeyHis" hidden />
										<Form.Item name="arrivaldetailaddress" hidden />
										<Form.Item name="arrivalpostalcode" hidden />
										<Form.Item name="initrequestdt" hidden />
										<Form.Item name="deliverynotitimeend" hidden />
										<Form.Item name="emploeenumber" hidden />
										<Form.Item name="createdbyemail" hidden />
										<Form.Item name="createdbyname" hidden />
										<Form.Item name="createddate" hidden />
										<Form.Item name="storetype" hidden />
										<Form.Item name="edmsfileid" hidden />
										<Form.Item name="confirmdate" hidden />
										<Form.Item name="adddate" hidden />
										<Form.Item name="editdate" hidden />
										<Form.Item name="addwho" hidden />
										<Form.Item name="editwho" hidden />
										<Form.Item name="truthzipcode" hidden />
										<Form.Item name="custtype" hidden />

										<UiDetailViewArea>
											<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
												<li>
													<InputSearch label={'실착지관리거래처코드'} name="truthcustkey" onSearch={getCustkey} />
												</li>
												<li>
													<InputText label={'실착지 관리 거래처명'} name="truthcustname" disabled={true} />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={'실착지 주소'} name="truthaddress1" disabled={true} />
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText label={'실착지 상세 주소'} name="truthaddress2" />
												</li>
												<li>
													<InputText label={'층수'} name="floor" />
												</li>
												<li>
													<SelectBox
														label={'실착지 주소일치여부'}
														name="addressmatchyn"
														options={getCommonCodeList('YN')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li className="flex-wrap">
													<InputRange label={'위도/경도'} fromName="latitude" toName="longitude" disabled={true} />
													<Button className="ml5" onClick={searchMap}>
														좌표찾기
													</Button>
												</li>
												<li>
													<SelectBox
														label={t('lbl.ARMY_YN')}
														name="armyYn"
														options={getCommonCodeList('YN2')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
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
												</li>
												<li>
													<InputText label={'MA명'} name="empname1" disabled={true} />
												</li>
												<li>
													<InputText label={'MA연락처'} name="empphone1" disabled={true} />
												</li>
											</UiDetailViewGroup>
										</UiDetailViewArea>
										<TableTopBtn tableTitle={'배송메모 /알림/ 검수정보'} tableBtn={tableBtn}>
											<Button onClick={() => imagePopup('12')}>업장 출입 이동 동선</Button>
											<Button onClick={() => imagePopup('13')}>상품적재위치(냉동)</Button>
											<Button onClick={() => imagePopup('14')}>상품적재위치(냉장)</Button>
											<Button onClick={() => imagePopup('15')}>상품적재위치(상온)</Button>
											<Button onClick={() => imagePopup('16')}>반품위치</Button>
										</TableTopBtn>
										<UiDetailViewArea>
											<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
												<li>
													<SelectBox
														label={t('lbl.ENTRANCEKEYINFO')}
														name="keytype2"
														options={getCommonCodeList('CRM_DLV_KEYTYPE')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li>
													<InputText
														label={t('lbl.ENTRANCEKEYDETAILINFO')}
														name="keydetail"
														onChange={checkValidTextLenth('keydetail', 1000)}
													/>
												</li>
												<li>
													<SelectBox
														label={t('lbl.BLDG_OPEN_TIME')} // 건물개방시간
														name="buildingopentime"
														options={getCommonCodeList('CRM_DLV_BUILDINGOPENTIME')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
														// rules={[{ required: true, validateTrigger: 'none' }]}
														// required
													/>
												</li>
												<li>
													<SelectBox
														label={t('lbl.DLV_YN_TIME')} // 납품가능시간
														name="deliveryavailabletime"
														options={getCommonCodeList('CRM_DLV_DELIVERYAVLTIME')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
														// rules={[{ required: true, validateTrigger: 'none' }]}
														// required
													/>
												</li>
												<li>
													<SelectBox
														label={'차량진입 제한톤수'}
														name="tonnage"
														options={getCommonCodeList('TONNAGE')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li>
													<SelectBox
														label={'건물진입가능높이'}
														name="parkingheight"
														options={getCommonCodeList('CRM_DLV_PARKINGHEIGHT')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText
														label={'업장 출입 이동동선'}
														name="accessway"
														onChange={checkValidTextLenth('accessway', 1000)}
													/>
												</li>
												<li>
													<InputText
														label={'적재위치 (냉동)'}
														name="freezeplace"
														onChange={checkValidTextLenth('freezeplace', 255)}
													/>
												</li>
												<li>
													<InputText
														label={'적재위치(냉장)'}
														name="coldplace"
														onChange={checkValidTextLenth('coldplace', 255)}
													/>
												</li>
												<li>
													<InputText
														label={'적재위치 (상온)'}
														name="htemperature"
														onChange={checkValidTextLenth('htemperature', 255)}
													/>
												</li>
												<li>
													<InputText
														label={t('lbl.LOADPLACE')}
														name="loadplace2"
														onChange={checkValidTextLenth('loadplace2', 255)}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }} className="flex-wrap lab-txt">
													<LabelText label={t('lbl.SPECIAL_CONDITION')} style={{ width: '130px' }} />
													<Col className="flex-wrap align-center">
														<div className="switch-form">
															키즈분류여부{' '}
															<Switch
																checked={switchStates.kidsClYn}
																onChange={checked => handleSwitchChange(checked, 'kidsClYn')}
															/>
														</div>
														<div className="switch-form">
															납품대기여부{' '}
															<Switch
																checked={switchStates.dlvWaitYn}
																onChange={checked => handleSwitchChange(checked, 'dlvWaitYn')}
															/>
														</div>
														<div className="switch-form">
															{t('lbl.DISTANT_YN') + ' '}
															<Switch
																checked={switchStates.distantYn}
																onChange={checked => handleSwitchChange(checked, 'distantYn')}
															/>
														</div>
														<div className="switch-form">
															장거리여부{' '}
															<Switch
																checked={switchStates.lngDistantYn}
																onChange={checked => handleSwitchChange(checked, 'lngDistantYn')}
															/>
														</div>
														<div className="switch-form">
															대면비용지급여부{' '}
															<Switch
																checked={switchStates.faceinspectExpPayYn}
																onChange={checked => handleSwitchChange(checked, 'faceinspectExpPayYn')}
																disabled={switchFaceInspectionYnBoolean}
															/>
														</div>
													</Col>
													<Col span={6}>
														<SelectBox
															label={t('lbl.UNLOAD_DIFFICULTY')}
															className="bg-white lab-min"
															name="unloadLvlCd"
															options={getCommonCodeList('UNLOAD_DIFFICULTY')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
													</Col>
												</li>
												<li className="range-align">
													<Col span={16} className="pd0">
														<DatePicker
															label="OTD (배송요청시간)"
															name="reqdlvtime2From"
															format="HH:mm"
															picker="time"
															placeholder={'시분 선택'}
															showNow={false}
															allowClear
															onChange={onValuesChange}
														/>
													</Col>
													<span>~</span>
													<Col span={16} className="pd0">
														<DatePicker
															name="reqdlvtime2To"
															format="HH:mm"
															picker="time"
															placeholder={'시분 선택'}
															showNow={false}
															allowClear
															onChange={onValuesChange}
														/>
													</Col>
												</li>
												<li>
													<SelectBox
														label={t('lbl.FACE_TO_FACE_INSPECTION_YN ')}
														name="faceinspect"
														options={getCommonCodeList('YN')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
														onChange={onChangeFaceInspect}
														// disabled={true}
													/>
												</li>
												<li>
													<SelectBox
														label={'검수자용출력여부'}
														name="inspectorprintyn"
														options={getCommonCodeList('YN')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li>
													<InputText
														label={'검수실무자 전화번호'}
														name="inspectionworkerphone"
														rules={[
															{
																pattern: PHONE_PATTERN,
																message: '올바른 전화번호 형식이 아닙니다.',
															},
														]}
													/>
												</li>
												<li>
													<InputText label={'평균 납품 시간'} name="avgArrivedtime" disabled={true} />
												</li>
												{/* <li>
									<DatePicker
										label="평균작업시간(분)"
										name="avgWorkTime"
										format="mm"
										picker="time"
										placeholder={'시간 선택'}
										allowClear
										showNow={false}
									/>
								</li> */}
												<li>
													<InputText
														label="평균작업시간(분)"
														name="avgWorkTime"
														disabled={true}
														// rules={[
														// 	{
														// 		pattern: WORKTIME_PATTERN,
														// 		message: '숫자만 입력가능합니다.',
														// 	},
														// ]}
													/>
												</li>
												<li className="flex-wrap lab-txt">
													<LabelText label="도착알림" />
													<Col span={8}>
														<SelectBox
															label="수신여부"
															className="bg-white lab-min"
															name="deliverynotiyn"
															options={getCommonCodeList('YN')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
															disabled={true}
														/>
													</Col>
													<Col span={14}>
														<DatePicker
															label="수신시간"
															className="bg-white lab-min"
															name="deliverynotitimestart"
															format="HH:mm"
															picker="time"
															placeholder={'시분 선택'}
															showNow={false}
															allowClear
															disabled={true}
														/>
													</Col>
												</li>
												<li>
													<InputText
														label={'알림 수신 전화번호'}
														name="deliverynotiphone"
														rules={[
															{
																pattern: PHONE_PATTERN,
																message: '올바른 전화번호 형식이 아닙니다.',
															},
														]}
														disabled={true}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText
														label={'요청사항(거래처카드)'}
														name="cardmemo"
														onChange={checkValidTextLenth('cardmemo', 1000)}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText
														label={t('lbl.MEMO_NOREFLECTION')}
														name="memo"
														onChange={checkValidTextLenth('memo', 4000)}
													/>
												</li>
												<li style={{ gridColumn: 'span 2' }}>
													<InputText
														label={'메모 (납품서 반영)'}
														name="supplymemo"
														onChange={checkValidTextLenth('supplymemo', 4000)}
													/>
												</li>
											</UiDetailViewGroup>
										</UiDetailViewArea>
										<TableTopBtn tableTitle={'배송유형정보'} tableBtn={tableBtn} />
										<UiDetailViewArea>
											<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
												<li>
													<SelectBox
														label={t('lbl.DELIVERYTYPE_2')}
														name="deliverytype"
														options={getCommonCodeList('CRM_DLV_DELIVERYTYPE')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
														disabled
													/>
												</li>
												<li>
													<SelectBox
														label={t('lbl.LABELPRINTCATEGORY')}
														name="labelprinttype"
														options={getCommonCodeList('CRM_DLV_LABELPRINTTYPE')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li>
													<SelectBox
														label={t('lbl.PICKINGTYPE')}
														name="distancetype"
														options={getCommonCodeList('DISTANCETYPE')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li>
													<SelectBox
														label={'온도기록지 제출대상여부'}
														name="temptarget"
														options={getCommonCodeList('CRM_DLV_TMEPTARGET')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
														disabled={true}
													/>
												</li>
												<li>
													<SelectBox
														label={'레드존여부'}
														name="redzoneYn"
														options={getCommonCodeList('YN')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li>
													<SelectBox
														label={'납품서 출력순서'}
														name="custstrategy5"
														options={getCommonCodeList('CUSTSTRATEGY5', '--- 선택 ---', '')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
											</UiDetailViewGroup>
										</UiDetailViewArea>
										<TableTopBtn tableTitle={'초도배송정보'} tableBtn={tableBtn} />
										<UiDetailViewArea>
											<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
												<li>
													<InputText label={'초도배송담당자연락처'} name="initdeliverycontact" disabled={true} />
												</li>
												<li>
													<InputText label={'초도배송전달사항'} name="initdeliverydesc" disabled={true} />
												</li>
												<li>
													<InputRange
														label={'초도배송요청시간'}
														fromName="initrequesttimestart"
														toName="initrequesttimeend"
														disabled={true}
													/>
												</li>
												<li>
													<InputText label={'초도배송대면검수여부'} name="initftfinspectionyn" disabled={true} />
												</li>
												<li>
													<InputText label={'고객삭제여부'} name="delYn" disabled={true} />
												</li>
											</UiDetailViewGroup>
										</UiDetailViewArea>
									</Form>
								</div>
							</ScrollBox>
						</AGrid>
					</>,
				]}
			/>

			{/* 지도 팝업 */}
			<CustomModal ref={mapModalRef} width="1280px">
				<CmMapPopup
					showRadius={true}
					radius={radius}
					stytime={stytime}
					setSearchLatLng={handleMapCallback}
					setAddressInfo={handleAddressCallback}
					searchText={searchAddr}
					lat={detailForm.getFieldValue('latitude')}
					lon={detailForm.getFieldValue('longitude')}
					callBackFn={(result: any) => {
						setRadius(result.radius);
						setStytime(result.stytime);

						detailForm.setFieldsValue({
							stytime: result.stytime ? dayjs(padTime(result.stytime), 'HHmm') : '',
							radius: result.radius,
						});
					}}
					close={closeEvent}
				/>
			</CustomModal>
			{/* 공통 팝업(거래처) */}
			<CustomModal ref={custRef} width="1000px">
				<CmSearchPopup type={popupType} codeName={cust} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
			{/* 고객배송조건 수신이력 조회 팝업 */}
			<CustomModal ref={receiveHistoryRef} width="1280px">
				<MsCustDlvInfoHisPopup callBack={handleCustDlvInfoHisCallback} custKey={custkey} close={closeEvent} />
			</CustomModal>
			{/* 이미지 팝업 */}
			<CustomModal ref={imageRef} width="1084px">
				<MsCustDeliveryInfoFileUploadPopup ref={imageRef} issueno={custkey} code={code} callBack={closeEvent} />
			</CustomModal>
			{/* 엑셀 업로드 팝업 */}
			<CustomModal ref={excelRef} width="1084px">
				<MsCustDeliveryInfoUploadExcelPopup close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default MsCustDeliveryInfoDetail;
