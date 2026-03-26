/*
 ############################################################################
 # FiledataField	: IbTirdPartyMast.tsx
 # Description		: 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산
 # Author			: KimDongHan
 # Since			: 2025.09.25
 ############################################################################
*/
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import {
	apiPostDetailT3List,
	apiPostMasterT1List,
	apiPostMasterT2List,
	apiPostMasterT3List,
	apiPostMasterT4List,
	apiPostSaveMasterT1List,
	apiPostSaveMasterT2List,
	apiPostSaveMasterT3List,
	apiPostSaveMasterT4List,
	apiPostUpdateMasterT4List,
} from '@/api/ib/apiIbTirdPartyMast';
import TabsArray from '@/components/common/TabsArray';
import IbTirdPartyMastDetail from '@/components/ib/tirdPartyMast/IbTirdPartyMastDetail';
import IbTirdPartyMastSearch from '@/components/ib/tirdPartyMast/IbTirdPartyMastSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const IbTirdPartyMast = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const pricetypeList = getCommonCodeList('3PL_STATUS');
	const dccodeList = getUserDccodeList();
	const reasonCodeList = getCommonCodeList('REASONCODE_CONFIRM');
	const gridRef = useRef<any>(null); // 단가마스터
	const gridRef1 = useRef<any>(null); // 협력사관리
	const gridRef2 = useRef<any>(null); // 검수관리
	const gridRef3 = useRef<any>(null); // 검수관리 상세
	const gridRef4 = useRef<any>(null); // 정산관리

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]); // 단가마스터
	const [gridData1, setGridData1] = useState([]); // 협력사관리
	const [gridData2, setGridData2] = useState([]); // 검수관리
	const [gridData3, setGridData3] = useState([]); // 검수관리 상세
	const [gridData4, setGridData4] = useState([]); // 정산관리

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	/*
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const getFwNm = (item: any) => {
		if (item.channel === '1') {
			// 확정
			return t('lbl.CONFIRM');
		} else {
			// 미확정
			return t('lbl.UNCONFIRMED');
		}
	};

	// 일배구분(검수관리_탭)
	const getDeliverytypeNm = (item: any) => {
		if (item.deliverytype === '1') {
			// 일배
			return t('lbl.DAILY_TAB');
		} else if (item.deliverytype === '2') {
			// 광역일배
			return t('lbl.DCSTODAILY');
		} else if (item.deliverytype === '3') {
			// 광역/일배
			return t('lbl.IB_TP_DCSTODAILY');
		} else {
			// 광역일배
			return t('lbl.DCSTODAILY');
		}
	};

	// 진행상태(검수관리_탭)
	const getStatusNm = (item: any) => {
		if (item.status === '1') {
			// 미진행
			return t('lbl.NOT_STARTED');
		} else if (item.status === '2') {
			// 부분완료
			return t('lbl.PARTIAL_COMPLETE');
		} else if (item.status === '3') {
			// 검수완료
			return t('lbl.INSPECTION_COMPLETED');
		}
	};

	// 검수완료율(%)(검수관리_탭)
	const formatRate = (value: any): string => {
		if (value === null || value === undefined || value === '') return '';
		const s = String(value).trim();
		// 기존 콤마와 % 제거
		const cleaned = s.replace(/,/g, '').replace('%', '');
		if (cleaned === '') return '';
		const n = Number(cleaned);
		if (Number.isNaN(n)) return s; // 숫자로 파싱 불가면 원본 문자열 반환
		// 정수면 소수 표시 없이, 소수면 최대 2자리(불필요한 0은 붙이지 않음)
		const opts: Intl.NumberFormatOptions = Number.isInteger(n) ? {} : { maximumFractionDigits: 2 };
		return n.toLocaleString(undefined, opts) + '%';
	};

	// 조회
	const searchMasterList = async () => {
		// 유효성 검사 필수 항목
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();

		let data;
		// 단가마스터_탭 조회
		if (activeKey === '1') {
			gridRef.current?.clearGridData();
			({ data } = await apiPostMasterT1List(requestParams));
			setGridData(data || []);
			// 협력사관리_탭 조회
		} else if (activeKey === '2') {
			gridRef1.current?.clearGridData();
			({ data } = await apiPostMasterT2List(requestParams));
			setGridData1(data || []);
			// 검수관리_탭 조회
		} else if (activeKey === '3') {
			// 날짜 check
			const fromDt = requestParams.calDocdt[0];
			const toDt = requestParams.calDocdt[1];

			const dateDifference = toDt.diff(fromDt, 'days') + 1;

			if (dateDifference > 31) {
				showAlert(null, t('msg.MSG_IB_TIRD_PARTY_MAST_001', [dateDifference]));
				return;
			}

			const [calDocdtFrom, calDocdtTo] = requestParams.calDocdt;
			requestParams.calDocdtFrom = calDocdtFrom.format('YYYYMMDD');
			requestParams.calDocdtTo = calDocdtTo.format('YYYYMMDD');
			delete requestParams.calDocdt;

			gridRef2.current?.clearGridData();
			gridRef3.current?.clearGridData();
			({ data } = await apiPostMasterT3List(requestParams));
			const newData = data.map((item: any) => ({
				...item,
				//deliverytype: getDeliverytypeNm(item),
				//status: getStatusNm(item),
				rate: formatRate(item.rate),
			}));
			setGridData2(newData || []);
			// 정산관리_탭 조회
		} else if (activeKey === '4') {
			// 날짜 check
			const fromDt = requestParams.calSlipdt[0];
			const toDt = requestParams.calSlipdt[1];

			const dateDifference = toDt.diff(fromDt, 'days') + 1;

			if (dateDifference > 31) {
				showAlert(null, t('msg.MSG_IB_TIRD_PARTY_MAST_001', [dateDifference]));
				return;
			}

			const [calSlipdtFrom, calSlipdtTo] = requestParams.calSlipdt;
			requestParams.calSlipdtFrom = calSlipdtFrom.format('YYYYMMDD');
			requestParams.calSlipdtTo = calSlipdtTo.format('YYYYMMDD');
			delete requestParams.calSlipdt;
			gridRef4.current?.clearGridData();
			({ data } = await apiPostMasterT4List(requestParams));
			const newData = data.map((item: any) => ({
				...item,
				ibcffw: getFwNm(item),
				ibcf3pl: getFwNm(item),
				ibcfyn: getFwNm(item),
			}));
			setGridData4(newData || []);
		}
	};

	// 검수관리_탭 상세 조회
	const searchDetailList = async (requestParams: any) => {
		const newParams = {
			deliverydate: requestParams.deliverydate,
			fromCustkey: requestParams.fromcustkey,
			dccode: requestParams.dccode,
		};

		gridRef3.current?.clearGridData();
		const { data } = await apiPostDetailT3List(newParams);
		setGridData3(data || []);
	};

	// 단가마스터_탭 저장
	const saveMasterT1List = async () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 수정된 것만(체크박스 제외)
		// validationYn: false 옵션으로 유효성 검사 로직 제외
		const updatedItems = gridRef.current?.getChangedData({ validationYn: false }).map((item: any) => {
			return {
				...item,
				pricetypeNm: pricetypeList.find((list: any) => list.comCd === item.pricetype)?.cdNm || '',
				dcname: dccodeList.find((list: any) => list.dccode === item.dccode)?.dcname || '',
			};
		});

		if (!updatedItems || updatedItems.length === 0) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// 필수값 체크
		if (!gridRef.current?.validateRequiredGridData()) {
			return;
		}

		// 저장하시겠습니까? 신규 : N건, 수정 : N건, 삭제 : N건
		gridRef.current?.showConfirmSave(() => {
			const params = {
				saveT1List: updatedItems,
			};

			// 저장 API 호출
			apiPostSaveMasterT1List(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						searchMasterList();
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	// 협력사관리_탭 저장
	const saveMasterT2List = async () => {
		const checkedItems = gridRef1.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef1.current?.getCustomCheckedRowItems({ isGetRowIndex: true });
		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		const updatedItems = gridRef1.current?.getChangedData({ validationYn: false }).map((item: any) => {
			return {
				...item,
				dcname: dccodeList.find((list: any) => list.dccode === item.dccode)?.dcname || '',
			};
		});

		if (!updatedItems || updatedItems.length === 0) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// 필수값 체크
		if (!gridRef1.current?.validateRequiredGridData()) {
			return;
		}

		// 저장하시겠습니까? 신규 : N건, 수정 : N건, 삭제 : N건
		gridRef1.current?.showConfirmSave(() => {
			const params = {
				saveT2List: updatedItems,
			};

			// 저장 API 호출
			apiPostSaveMasterT2List(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						searchMasterList();
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	// 검수관리_탭 강제확정
	const saveMasterT3List = async () => {
		const checkedItems = gridRef3.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef3.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				saveT3DetailList: checkedItems,
			};

			// 저장 API 호출
			apiPostSaveMasterT3List(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						const selectedRow = gridRef2.current?.getSelectedRows()[0];
						searchDetailList(selectedRow);
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	// 정산관리_탭 저장
	const saveMasterT4List = async () => {
		const checkedItems = gridRef4.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef4.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				saveT4List: checkedItems,
			};

			// 저장 API 호출
			apiPostSaveMasterT4List(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						searchMasterList();
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	// 정산관리_탭 저장
	const updateMasterT4List = async () => {
		const checkedItems = gridRef4.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef4.current?.getCustomCheckedRowItems({ isGetRowIndex: true });
		if (!checkedItems || checkedItems.length < 1) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 수정하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_002'), async () => {
			const params = {
				saveT4List: checkedItems,
			};

			// 저장 API 호출
			apiPostUpdateMasterT4List(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						searchMasterList();
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	// 강제확정 사유 변경시 귀책 변경 함수
	const changeReasonCode = async () => {
		const param = form1.getFieldValue('reasonCode');
		reasonCodeList.find((list: any) => {
			if (list.comCd === param) {
				form1.setFieldValue('reasonWho', list.convdescr);
			}
		});
	};

	// 안전한 빈값 검사 유틸 함수
	const gfn_IsEmpty = (value: any): boolean => {
		// null 또는 undefined
		if (value === null || value === undefined) return true;

		// 문자열(공백만 있는 문자열도 비어있음으로 처리)
		if (typeof value === 'string') return value.trim().length === 0;

		// 숫자와 불리언은 비어있지 않은 것으로 간주
		if (typeof value === 'number' || typeof value === 'boolean') return false;

		// 배열
		if (Array.isArray(value)) return value.length === 0;

		// 일반 객체({})는 열거 가능한 자체 키가 없으면 비어있음으로 처리
		if (typeof value === 'object') {
			// Date 등 일반 객체가 아닌 경우는 비어있지 않은 것으로 처리
			if (Object.prototype.toString.call(value) !== '[object Object]') return false;
			return Object.keys(value).length === 0;
		}

		// 예비 처리: 문자열로 변환하여 검사
		try {
			return String(value).trim().length === 0;
		} catch (e) {
			return false;
		}
	};

	//선택적용
	const applyReason = async () => {
		const checkedItems = gridRef3.current?.getCheckedRowItems();

		if (checkedItems.length < 1) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 유효성 검사 필수 항목
		const isValid = await validateForm(form1);

		if (!isValid) {
			return;
		}

		const reasonCode = form1.getFieldValue('reasonCode');
		const reasonWho = form1.getFieldValue('reasonWho');
		const reasonText = form1.getFieldValue('reasonText');

		// 1	바코드불량량  협력사
		// 2	입고시간지연	협력사
		// 3	중분류미진행	협력사
		// 4	입고검수지연	3PL
		// 5	협력사미입고	협력사

		let reasonCodeNm = '';
		reasonCodeList.find((list: any) => {
			if (list.comCd === reasonCode) {
				reasonCodeNm = list.cdNm;
			}
		});

		if (reasonCode === '4') {
			for (const item of checkedItems) {
				gridRef3.current?.setCellValue(item.rowIndex, 'reasoncode3', reasonCodeNm);
				gridRef3.current?.setCellValue(item.rowIndex, 'reasonwho3', reasonWho);
				gridRef3.current?.setCellValue(item.rowIndex, 'reasontext3', reasonText);
				const ndpCnt = gridRef3.current?.getCellValue(item.rowIndex, 'ndpCnt');
				const ncf = gridRef3.current?.getCellValue(item.rowIndex, 'ncf');
				if (gfn_IsEmpty(ndpCnt)) {
					gridRef3.current?.setCellValue(item.rowIndex, 'ndpCnt', ncf);
				}
			}
		} else {
			for (const item of checkedItems) {
				gridRef3.current?.setCellValue(item.rowIndex, 'reasoncode', reasonCodeNm);
				gridRef3.current?.setCellValue(item.rowIndex, 'reasonwho', reasonWho);
				gridRef3.current?.setCellValue(item.rowIndex, 'reasontext', reasonText);
				const cfCust = gridRef3.current?.getCellValue(item.rowIndex, 'cfCust');
				const ncf = gridRef3.current?.getCellValue(item.rowIndex, 'ncf');
				if (gfn_IsEmpty(cfCust)) {
					gridRef3.current?.setCellValue(item.rowIndex, 'cfCust', ncf);
				}
			}
		}
	};

	// 검색영역 초기 세팅
	const searchBox = {
		calDocdt: dates, // 입고일자
		calSlipdt: dates, // 입고일자
		ordertype: '', // 일배구분
		status: '', // 진행상태
		confirmyn: '', // 확정여부
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearGridData();
		// 	gridRef1.current?.clearGridData();
		// 	gridRef2.current?.clearGridData();
		// 	gridRef3.current?.clearGridData();
		// 	gridRef4.current?.clearGridData();
		// },
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 소팅 초기화
	useEffect(() => {
		gridRef.current?.clearGridData();
		gridRef1.current?.clearGridData();
		gridRef2.current?.clearGridData();
		gridRef3.current?.clearGridData();
		gridRef4.current?.clearGridData();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		gridRef3.current?.resize('100%', '100%');
		gridRef4.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	const tabItems = [
		{
			// 단가마스터
			key: '1',
			label: t('lbl.IB_TIRD_PARTY_MAST_T1'),
			children: (
				<IbTirdPartyMastDetail
					form={form}
					form1={form1}
					activeKey={activeKey}
					activeKeyRef={activeKeyRef}
					changeReasonCode={changeReasonCode}
					applyReason={applyReason}
					gridRef={gridRef}
					gridRef1={gridRef1}
					gridRef2={gridRef2}
					gridRef3={gridRef3}
					gridRef4={gridRef4}
					gridData={gridData}
					gridData1={gridData1}
					gridData2={gridData2}
					gridData3={gridData3}
					gridData4={gridData4}
					searchDetailList={searchDetailList}
					saveMasterT1List={saveMasterT1List}
					saveMasterT2List={saveMasterT2List}
					saveMasterT3List={saveMasterT3List}
					saveMasterT4List={saveMasterT4List}
					updateMasterT4List={updateMasterT4List}
				/>
			),
		},
		{
			// 협력사관리
			key: '2',
			label: t('lbl.IB_TIRD_PARTY_MAST_T2'),
			children: (
				<IbTirdPartyMastDetail
					form={form}
					form1={form1}
					activeKey={activeKey}
					activeKeyRef={activeKeyRef}
					changeReasonCode={changeReasonCode}
					applyReason={applyReason}
					gridRef={gridRef}
					gridRef1={gridRef1}
					gridRef2={gridRef2}
					gridRef3={gridRef3}
					gridRef4={gridRef4}
					gridData={gridData}
					gridData1={gridData1}
					gridData2={gridData2}
					gridData3={gridData3}
					gridData4={gridData4}
					searchDetailList={searchDetailList}
					saveMasterT1List={saveMasterT1List}
					saveMasterT2List={saveMasterT2List}
					saveMasterT3List={saveMasterT3List}
					saveMasterT4List={saveMasterT4List}
					updateMasterT4List={updateMasterT4List}
				/>
			),
		},
		{
			// 검수관리
			key: '3',
			label: t('lbl.IB_TIRD_PARTY_MAST_T3'),
			children: (
				<IbTirdPartyMastDetail
					form={form}
					form1={form1}
					activeKey={activeKey}
					activeKeyRef={activeKeyRef}
					changeReasonCode={changeReasonCode}
					applyReason={applyReason}
					gridRef={gridRef}
					gridRef1={gridRef1}
					gridRef2={gridRef2}
					gridRef3={gridRef3}
					gridRef4={gridRef4}
					gridData={gridData}
					gridData1={gridData1}
					gridData2={gridData2}
					gridData3={gridData3}
					gridData4={gridData4}
					searchDetailList={searchDetailList}
					saveMasterT1List={saveMasterT1List}
					saveMasterT2List={saveMasterT2List}
					saveMasterT3List={saveMasterT3List}
					saveMasterT4List={saveMasterT4List}
					updateMasterT4List={updateMasterT4List}
				/>
			),
		},
		{
			// 정산관리
			key: '4',
			label: t('lbl.IB_TIRD_PARTY_MAST_T4'),
			children: (
				<IbTirdPartyMastDetail
					form={form}
					form1={form1}
					activeKey={activeKey}
					activeKeyRef={activeKeyRef}
					changeReasonCode={changeReasonCode}
					applyReason={applyReason}
					gridRef={gridRef}
					gridRef1={gridRef1}
					gridRef2={gridRef2}
					gridRef3={gridRef3}
					gridRef4={gridRef4}
					gridData={gridData}
					gridData1={gridData1}
					gridData2={gridData2}
					gridData3={gridData3}
					gridData4={gridData4}
					searchDetailList={searchDetailList}
					saveMasterT1List={saveMasterT1List}
					saveMasterT2List={saveMasterT2List}
					saveMasterT3List={saveMasterT3List}
					saveMasterT4List={saveMasterT4List}
					updateMasterT4List={updateMasterT4List}
				/>
			),
		},
	];

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<IbTirdPartyMastSearch {...formProps} />
			</SearchFormResponsive>
			<TabsArray activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />
		</>
	);
};

export default IbTirdPartyMast;
