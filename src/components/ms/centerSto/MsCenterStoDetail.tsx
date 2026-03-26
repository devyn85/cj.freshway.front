/*
 ############################################################################
 # FiledataField	: MsCenterStoDetail.tsx
 # Description		: 기준정보 > 센터기준정보 > 센터이체마스터
 # Author			: JeongHyeongCheol
 # Since			: 25.08.06
 ############################################################################
*/
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import { Button, Form } from 'antd';

// Components
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import MsCenterStoUploadExcelPopup from '@/components/ms/centerSto/MsCenterStoUploadExcelPopup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import {
	apiGetClosetypeDcList,
	apiGetClosetypeSkuList,
	apiGetPickList,
	apiGetPickTypeList,
	apiGetPriorityList,
	apiPostSaveClosetypeDcList,
	apiPostSaveClosetypeSkuList,
	apiPostSavePickList,
	apiPostSavePriorityList,
} from '@/api/ms/apiMsCenterSto';

// types
import { GridBtnPropsType } from '@/types/common';

interface MsCenterStoDetailProps {
	masterData?: Array<object>;
	setPriorityData?: any;
}

const MsCenterStoDetail = (props: MsCenterStoDetailProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	//Antd Form 사용
	const [form] = Form.useForm();

	const { t } = useTranslation();

	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);
	const gridRef3 = useRef<any>(null);
	const gridRef4 = useRef<any>(null);

	const [gridData1, setGridData1] = useState<any[]>([]);
	const [gridData2, setGridData2] = useState<any[]>([]);
	const [gridData3, setGridData3] = useState<any[]>([]);
	const [gridData4, setGridData4] = useState<any[]>([]);

	const [totalCnt1, setTotalCnt1] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [totalCnt4, setTotalCnt4] = useState(0);

	const [popupType, setPopupType] = useState('');
	const refModalPop = useRef<any>(null);
	const refModalExcel = useRef<any>(null);

	// 현재 탭 정보(우측 탭 전용: 1,2)
	const [activeKey, setActiveKey] = useState('1');

	const [totalPickTypeList, setTotalPickTypeList] = useState<any[]>([]);
	const pickTypeListRef = useRef<any[]>([]);

	const userAuthInfo = useAppSelector(state => state.user.userInfo);
	const dccodeList = getUserDccodeList();
	const [dccode, setDccode] = useState(userAuthInfo.defDccode);

	const LEFT_TAB_KEY = '11';
	const PRIORITY_TAB_KEY = '31';

	const roles = useMemo(() => {
		// * roles가 string/array/기타로 내려오는 모든 케이스를 string[]로 정규화
		const raw = (userAuthInfo as any)?.roles;

		if (Array.isArray(raw)) {
			return raw.map(v => String(v ?? '').trim()).filter(Boolean);
		}

		if (typeof raw === 'string') {
			// "00,05" / "00|05" / "00 05" 등 혼합 구분자 대응
			return raw
				.split(/[,| ]+/g)
				.map(v => v.trim())
				.filter(Boolean);
		}

		return [] as string[];
	}, [userAuthInfo?.roles]);

	const canAccessPriorityTab = useMemo(() => {
		// * 수급 센터 우선 순위 설정 탭 접근 권한 여부
		const allowRoles = ['00', '05', '50', '51', '000', '010', '300'];
		return allowRoles.some(r => roles.includes(r));
	}, [roles]);

	// 입고전략
	const dccodeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		const dcname = dccodeList.find(item => item.dccode === value)?.dcname;
		return dcname;
	};

	const dailyDeadlineStoLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('DAILY_DEADLINE_STO', value)?.cdNm;
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
		gridRef3?.current?.resize?.('100%', '100%');
		gridRef4?.current?.resize?.('100%', '100%');
	}, []);

	// * 탭 전환/재진입 시에도 데이터가 동일하면 useEffect가 안 타는 케이스를 보정
	const syncGridForActiveTab = useCallback(
		(key: string) => {
			// * Tabs 전환 직후 DOM/레이아웃 확정 이후에 resize/데이터 세팅이 되어야 안정적이라 RAF로 지연
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (key === '1' && gridRef2.current) {
						gridRef2.current?.setGridData?.(gridData2);
						gridRef2.current?.setSelectionByIndex?.(0, 0);
						const colSizeList = gridRef2.current?.getFitColumnSizeList?.(true);
						if (colSizeList) gridRef2.current?.setColumnSizeList?.(colSizeList);
						gridRef2.current?.resize?.('100%', '100%');
						return;
					}

					if (key === '2' && gridRef3.current) {
						gridRef3.current?.setGridData?.(gridData3);
						gridRef3.current?.setSelectionByIndex?.(0, 0);
						const colSizeList = gridRef3.current?.getFitColumnSizeList?.(true);
						if (colSizeList) gridRef3.current?.setColumnSizeList?.(colSizeList);
						gridRef3.current?.resize?.('100%', '100%');
						return;
					}

					if (key === PRIORITY_TAB_KEY && gridRef4.current) {
						gridRef4.current?.setGridData?.(gridData4);
						gridRef4.current?.setSelectionByIndex?.(0, 0);
						const colSizeList = gridRef4.current?.getFitColumnSizeList?.(true);
						if (colSizeList) gridRef4.current?.setColumnSizeList?.(colSizeList);
						gridRef4.current?.resize?.('100%', '100%');
					}
				});
			});
		},
		[PRIORITY_TAB_KEY, gridData2, gridData3, gridData4],
	);

	// 그리드 초기화
	const gridCol1 = [
		{
			dataField: 'dccode',
			headerText: '센터',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				keyField: 'dccode',
				valueField: 'dcname',
				list: dccodeList,
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					// * 신규(I) 행 + 권한 보유자만 센터 변경 가능
					if (item.rowStatus === 'I') {
						return !canAccessPriorityTab;
					}
					return true;
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// * 편집 가능 여부에 따라 isEdit class 부여/제거
				if (item?.rowStatus !== 'I' || !canAccessPriorityTab) {
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'dcClosetype',
			headerText: '마감유형',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DAILY_DEADLINE_STO'),
			},
			required: true,
		},
		{
			dataField: 'groupType',
			headerText: '그룹유형',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('PICKING_GROUP_TYPE'),
			},
			required: true,
		},
		{
			dataField: 'pickedType',
			headerText: '피킹유형',
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					// * 그룹유형 GR인 경우 다건 선택 허용
					if (item.groupType === 'GR') {
						return {
							type: 'DropDownListRenderer',
							listFunction: (rowIndex: number, colIndex: number, item: any) => {
								return pickTypeListRef.current;
							},
							multipleMode: true,
							keyField: 'cdNm',
							valueField: 'comCd',
						};
					}
					return {
						type: 'DropDownListRenderer',
						listFunction: (rowIndex: number, colIndex: number, item: any) => {
							return pickTypeListRef.current;
						},
						keyField: 'cdNm',
						valueField: 'comCd',
					};
				},
			},
			required: true,
		},
		{
			dataField: 'applyYn',
			headerText: '적용여부',
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
	];

	const gridCol2 = [
		{
			dataField: 'dccode',
			headerText: '센터',
			commRenderer: {
				type: 'dropDown',
				list: getUserDccodeList(),
				keyField: 'dccode',
				valueField: 'dcname',
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'dcClosetype',
			headerText: '마감유형',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DAILY_DEADLINE_STO'),
			},
			required: true,
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
				},
				onClick: function () {
					// * 상품제외 탭에서만 SKU 팝업 오픈
					if (activeKey === '1') {
						setPopupType('sku');
						refModalPop.current.handlerOpen();
					}
				},
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'skuName',
			headerText: '상품명',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'applyYn',
			headerText: '적용여부',
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
	];

	const gridCol3 = [
		{
			dataField: 'dccode',
			headerText: '센터',
			commRenderer: {
				type: 'dropDown',
				list: getUserDccodeList(),
				keyField: 'dccode',
				valueField: 'dcname',
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'dcClosetype',
			headerText: '마감유형',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DAILY_DEADLINE_STO'),
			},
			required: true,
		},
		{
			dataField: 'applyYn',
			headerText: '적용여부',
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
	];

	const gridCol4 = [
		{
			dataField: 'dcClosetype',
			headerText: '마감유형',
			labelFunction: dailyDeadlineStoLabelFunc,
			editable: false,
		},
		{
			dataField: 'toPriority',
			headerText: '선순위',
			editRenderer: {
				type: 'InputEditRenderer',
				regExp: /^[1-7]$/,
			},
		},
		{
			dataField: 'dccode',
			headerText: '센터',
			labelFunction: dccodeLabelFunc,
			editable: false,
		},
		{
			dataField: 'applyYn',
			headerText: '적용여부',
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		fillColumnSizeMode: false,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};
	const createGridProps = () => ({
		...gridProps,
	});
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// * 피킹유형 dropdown 데이터 조회
	const searchPickTypeList = () => {
		apiGetPickTypeList().then((res: any) => {
			setTotalPickTypeList(res.data);
		});
	};

	// * 피킹유형 자동 설정 조회 (본인 센터만 노출)
	const searchPickList = () => {
		apiGetPickList().then((res: any) => {
			const filteredData = res.data.filter((item: any) => item.dccode === userAuthInfo.defDccode);
			setGridData1(filteredData);
			setTotalCnt1(filteredData.length);
		});
	};

	// * 상품 제외 조회
	const searchClosetypeSkuList = () => {
		apiGetClosetypeSkuList().then((res: any) => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
		});
	};

	// * 센터 제외 조회
	const searchClosetypeDcList = () => {
		apiGetClosetypeDcList().then((res: any) => {
			setGridData3(res.data);
			setTotalCnt3(res.data.length);
		});
	};

	// * 수급 센터 우선 순위 설정 조회
	const searchPriorityList = () => {
		apiGetPriorityList().then((res: any) => {
			setGridData4(res.data);
			setTotalCnt4(res.data.length);
		});
	};

	// * 피킹유형 자동 설정 저장 유효성 검사 (동일 마감유형 내 피킹유형 중복 방지)
	const validatePickList = () => {
		const gridData = gridRef1.current.getGridData();
		const dcCloseValidationMap = new Map();

		for (const item of gridData) {
			const currentDcClosetype = item.dcClosetype;
			const currentGroupType = item.groupType;
			const currentPickedTypes = item.pickedType
				.split(',')
				.map((type: any) => type.trim())
				.filter((type: string) => type !== '');

			if (!dcCloseValidationMap.has(currentDcClosetype)) {
				dcCloseValidationMap.set(currentDcClosetype, {
					groupTypes: new Set(),
					otherGroupPickedTypes: new Set(),
				});
			}

			const validationData = dcCloseValidationMap.get(currentDcClosetype);

			for (const type of currentPickedTypes) {
				if (validationData.otherGroupPickedTypes.has(type)) {
					return true;
				}
			}

			validationData.groupTypes.add(currentGroupType);
			currentPickedTypes.forEach((type: any) => validationData.otherGroupPickedTypes.add(type));
		}
		return false;
	};

	// * 피킹유형 자동 설정 저장
	const savePickList = () => {
		const params = gridRef1.current.getChangedData({ validationYn: false });

		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		if (!gridRef1.current.validateRequiredGridData()) {
			return;
		}

		const isValidate = validatePickList();
		if (isValidate) {
			showMessage({
				content: '중복된 값은 저장할수 없습니다',
				modalType: 'info',
			});
			return;
		}

		const isInvalid = params.some((item: any) => {
			// * INV(별도오더)는 피킹유형 단건만 허용
			if (item.groupType !== 'INV') return false;
			const pickedList = item.pickedType?.split(',') || [];
			return pickedList.length > 1;
		});

		if (isInvalid) {
			showMessage({
				content: '별도오더의 경우 피킹유형은 단건만 선택 가능합니다.',
				modalType: 'info',
			});
			return;
		}

		gridRef1.current.showConfirmSave(() => {
			apiPostSavePickList(params).then((res: any) => {
				if (res.status === 200) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							searchPickList();
						},
					});
				}
			});
		});
	};

	// * 상품제외 저장 유효성 검사 (센터+마감유형+상품코드 중복 방지)
	const validateClosetypeSkuList = () => {
		const gridData = gridRef2.current.getGridData();
		const uniqueKeys = new Set();

		for (const item of gridData) {
			const key = `${item.dccode}_${item.dcClosetype}_${item.sku}`;
			if (uniqueKeys.has(key)) {
				return true;
			}
			uniqueKeys.add(key);
		}

		return false;
	};

	// * 상품제외 저장
	const saveClosetypeSkuList = () => {
		const params = gridRef2.current.getChangedData({ validationYn: false });

		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		if (!gridRef2.current.validateRequiredGridData()) {
			return;
		}

		const isValidate = validateClosetypeSkuList();
		if (isValidate) {
			showMessage({
				content: '중복된 값은 저장할 수 없습니다',
				modalType: 'info',
			});
			return;
		}

		const isSku = params.some((item: any) => {
			return !item.skuName;
		});

		if (isSku) {
			showMessage({
				content: '상품코드를 확인하세요.',
				modalType: 'info',
			});
			return;
		}

		gridRef2.current.showConfirmSave(() => {
			apiPostSaveClosetypeSkuList(params).then((res: any) => {
				if (res.status === 200) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							searchClosetypeSkuList();
						},
					});
				}
			});
		});
	};

	// * 센터제외 저장 유효성 검사 (센터+마감유형 중복 방지)
	const validateClosetypeDcList = () => {
		const gridData = gridRef3.current.getGridData();
		const uniqueKeys = new Set();

		for (const item of gridData) {
			const key = `${item.dccode}_${item.dcClosetype}`;
			if (uniqueKeys.has(key)) {
				return true;
			}
			uniqueKeys.add(key);
		}

		return false;
	};

	// * 센터제외 저장
	const saveClosetypeDcList = () => {
		const params = gridRef3.current.getChangedData({ validationYn: false });

		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		if (!gridRef3.current.validateRequiredGridData()) {
			return;
		}

		const isValidate = validateClosetypeDcList();
		if (isValidate) {
			showMessage({
				content: '중복된 값은 저장할수 없습니다',
				modalType: 'info',
			});
			return;
		}

		gridRef3.current.showConfirmSave(() => {
			apiPostSaveClosetypeDcList(params).then((res: any) => {
				if (res.status === 200) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							searchClosetypeDcList();
						},
					});
				}
			});
		});
	};

	// * 수급 센터 우선 순위 설정 저장 유효성 검사 (마감유형+선순위 중복 방지)
	const validatePriorityList = () => {
		const gridData = gridRef4.current.getGridData();
		const uniqueKeys = new Set();
		for (const item of gridData) {
			if (!item.toPriority) continue;
			const key = `${item.dcClosetype}_${item.toPriority}`;
			if (uniqueKeys.has(key)) {
				return true;
			}
			uniqueKeys.add(key);
		}
		return false;
	};

	// * 수급 센터 우선 순위 설정 저장
	const savePriorityList = () => {
		const params = gridRef4.current.getChangedData({ validationYn: false });

		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		if (!gridRef4.current.validateRequiredGridData()) {
			return;
		}

		const isValidate = validatePriorityList();
		if (isValidate) {
			showMessage({
				content: '중복된 값은 저장할수 없습니다',
				modalType: 'info',
			});
			return;
		}

		gridRef4.current.showConfirmSave(() => {
			apiPostSavePriorityList(params).then((res: any) => {
				if (res.status === 200) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							searchPriorityList();
							props.setPriorityData(params);
						},
					});
				}
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1,
		btnArr: [
			{
				btnType: 'plus',
				initValues: {
					rowStatus: 'I',
					dccode: userAuthInfo.defDccode,
				},
			},
			{ btnType: 'delete' },
			{ btnType: 'save', callBackFn: savePickList },
		],
	};

	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2,
		btnArr: [{ btnType: 'plus' }, { btnType: 'delete' }, { btnType: 'save', callBackFn: saveClosetypeSkuList }],
	};

	const gridBtn3: GridBtnPropsType = {
		tGridRef: gridRef3,
		btnArr: [{ btnType: 'plus' }, { btnType: 'delete' }, { btnType: 'save', callBackFn: saveClosetypeDcList }],
	};

	const gridBtn4: GridBtnPropsType = {
		tGridRef: gridRef4,
		btnArr: [{ btnType: 'save', callBackFn: savePriorityList }],
	};

	// * 엑셀 업로드 팝업 오픈
	const excelUpload = () => {
		refModalExcel.current.handlerOpen();
	};

	// * 탭 전환 시 그리드 데이터/리사이즈 동기화 (우측 탭 전용)
	const tabClick = (key: string, e: any) => {
		setActiveKey(key);

		if (key === '1') {
			// * 탭 재진입 시에도 그리드 데이터/컬럼/리사이즈 강제 동기화
			syncGridForActiveTab('1');
			return;
		}

		if (key === '2') {
			if (!gridData3.length) {
				searchClosetypeDcList();
			}
			syncGridForActiveTab('2');
			return;
		}

		if (key === PRIORITY_TAB_KEY) {
			syncGridForActiveTab(PRIORITY_TAB_KEY);
		}
	};

	// * 검색 팝업 선택 결과 반영 (상품제외 SKU 입력)
	const confirmPopup = (selectedRow: any) => {
		if (popupType === 'sku') {
			gridRef2.current.setCellValue(gridRef2.current.getSelectedIndex()[0], 'sku', selectedRow[0].code);
			gridRef2.current.setCellValue(gridRef2.current.getSelectedIndex()[0], 'skuName', selectedRow[0].name);
		}
		refModalPop.current.handlerClose();
	};

	// * 팝업 닫기
	const closeEvent = () => {
		refModalPop.current.handlerClose();
		refModalExcel.current.handlerClose();
	};

	// * 초기 이벤트 바인딩 + 초기 조회
	const initEvent = () => {
		gridRef1.current.bind('cellEditEnd', function (event: any) {
			// * 센터 변경 시 피킹유형 리스트 필터링 기준(dccode) 갱신
			if (event.dataField == 'dccode') {
				setDccode(event.value);
			}
		});

		searchPickTypeList();
		searchPickList();
		searchClosetypeSkuList();
		searchPriorityList();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// * 컴포넌트 마운트 시 초기 바인딩/조회
	useEffect(() => {
		initEvent();
	}, []);

	// * 센터코드(dccode) 기준으로 피킹유형 드롭다운 목록 생성
	useEffect(() => {
		if (totalPickTypeList.length === 0) return;

		const editList = totalPickTypeList
			.filter((item: any) => item.dccode === dccode)
			.map((item: any) => ({
				comGrpCd: 'pickType',
				cdNm: item.pickedType,
				comCd: item.pickedType,
			}));

		pickTypeListRef.current = editList;
	}, [totalPickTypeList, dccode]);

	// * 피킹유형 자동 설정 그리드 데이터 바인딩/컬럼 자동맞춤
	useEffect(() => {
		if (gridData1.length > 0 && gridRef1.current) {
			gridRef1.current?.setGridData(gridData1);
			gridRef1.current?.setSelectionByIndex(0, 0);
			const colSizeList = gridRef1.current.getFitColumnSizeList(true);
			gridRef1.current.setColumnSizeList(colSizeList);
		}
	}, [gridData1]);

	// * 상품제외 그리드 데이터 바인딩/컬럼 자동맞춤
	useEffect(() => {
		if (gridRef2.current) {
			gridRef2.current?.setGridData(gridData2);
			gridRef2.current?.setSelectionByIndex(0, 0);
			const colSizeList = gridRef2.current.getFitColumnSizeList(true);
			gridRef2.current.setColumnSizeList(colSizeList);
		}
	}, [gridData2]);

	// * 센터제외 그리드 데이터 바인딩/컬럼 자동맞춤
	useEffect(() => {
		if (gridRef3.current) {
			gridRef3.current?.setGridData(gridData3);
			gridRef3.current?.setSelectionByIndex(0, 0);
			const colSizeList = gridRef3.current.getFitColumnSizeList(true);
			gridRef3.current.setColumnSizeList(colSizeList);
		}
	}, [gridData3]);

	// * 수급센터 우선순위 그리드 데이터 바인딩/컬럼 자동맞춤
	useEffect(() => {
		if (gridRef4.current) {
			gridRef4.current?.setGridData(gridData4);
			gridRef4.current?.setSelectionByIndex(0, 0);
			const colSizeList = gridRef4.current.getFitColumnSizeList(true);
			gridRef4.current.setColumnSizeList(colSizeList);
		}
	}, [gridData4]);

	// * 탭 이동으로 인해 그리드가 재마운트/리레이아웃 되어도 항상 동기화되도록 activeKey 기준 보정
	useEffect(() => {
		syncGridForActiveTab(activeKey);
	}, [activeKey, syncGridForActiveTab]);

	// * 마스터 데이터 변경 시 우선순위 재조회
	useEffect(() => {
		if (props.masterData) {
			searchPriorityList();
		}
	}, [props.masterData]);

	// * 좌측(피킹유형 자동 설정) 탭 구성(단독 1개)
	const leftTabItems = useMemo(() => {
		return [
			{
				key: LEFT_TAB_KEY,
				label: '피킹유형 자동 설정',
				children: (
					<>
						<AGrid style={{ marginTop: '15px' }}>
							<GridTopBtn gridBtn={gridBtn1} totalCnt={totalCnt1} />
						</AGrid>
						<GridAutoHeight id="automatically set-picking-type-grid">
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={createGridProps()} />
						</GridAutoHeight>
					</>
				),
			},
		];
	}, [gridBtn1, gridCol1, gridProps, totalCnt1]);

	// * 우측(상품제외/센터제외) 탭 구성(우선순위는 단독으로 분리)
	const rightTabItems = useMemo(() => {
		return [
			{
				key: '1',
				label: '상품제외',
				children: (
					<>
						<AGrid style={{ marginTop: '15px' }}>
							<GridTopBtn gridBtn={gridBtn2} totalCnt={totalCnt2}>
								<Button onClick={excelUpload}>상품엑셀업로드</Button>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight id="Excluding-products">
							<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={createGridProps()} />
						</GridAutoHeight>
					</>
				),
			},
			{
				key: '2',
				label: '센터제외',
				children: (
					<>
						<AGrid style={{ marginTop: '15px' }}>
							<GridTopBtn gridBtn={gridBtn3} totalCnt={totalCnt3} />
						</AGrid>
						<GridAutoHeight id="excluding-center-grid">
							<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={createGridProps()} />
						</GridAutoHeight>
					</>
				),
			},
		];
	}, [excelUpload, gridBtn2, gridBtn3, gridCol2, gridCol3, gridProps, totalCnt2, totalCnt3]);

	// * 수급 센터 우선 순위 설정 탭 구성(단독 1개, 권한 없으면 아예 탭/영역 제거)
	const priorityTabItems = useMemo(() => {
		if (!canAccessPriorityTab) return [];

		return [
			{
				key: PRIORITY_TAB_KEY,
				label: '수급 센터 우선 순위 설정',
				children: (
					<>
						<AGrid style={{ marginTop: '15px' }}>
							<GridTopBtn gridBtn={gridBtn4} totalCnt={totalCnt4} />
						</AGrid>
						<GridAutoHeight id="prioritizin-supply-centers-grid">
							<AUIGrid ref={gridRef4} columnLayout={gridCol4} gridProps={createGridProps()} />
						</GridAutoHeight>
					</>
				),
			},
		];
	}, [canAccessPriorityTab, gridBtn4, gridCol4, gridProps, totalCnt4]);

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				items={
					canAccessPriorityTab
						? [
								<TabsArray key="left" activeKey={LEFT_TAB_KEY} onChange={null} items={leftTabItems} />,
								<TabsArray
									key="right"
									activeKey={activeKey}
									onChange={key => {
										tabClick(key, null);
									}}
									items={rightTabItems}
								/>,
								<TabsArray key="priority" activeKey={PRIORITY_TAB_KEY} onChange={null} items={priorityTabItems} />,
						  ]
						: [
								<TabsArray key="left" activeKey={LEFT_TAB_KEY} onChange={null} items={leftTabItems} />,
								<TabsArray
									key="right"
									activeKey={activeKey}
									onChange={key => {
										tabClick(key, null);
									}}
									items={rightTabItems}
								/>,
						  ]
				}
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
			/>

			<CustomModal ref={refModalExcel} width="1000px">
				<MsCenterStoUploadExcelPopup close={closeEvent} gridData={gridData2} />
			</CustomModal>

			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default MsCenterStoDetail;
