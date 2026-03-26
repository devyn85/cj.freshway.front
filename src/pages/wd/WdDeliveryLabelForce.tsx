/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelForce.tsx
 # Description		: 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)
 # Author			: KimDongHan
 # Since			: 2025.10.17
 ############################################################################
*/
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form, Tabs } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterT1List, apiPostMasterT2List, apiPostSavePrintList } from '@/api/wd/apiWdDeliveryLabelForce';
import CustomModal from '@/components/common/custom/CustomModal';
import ExcelFileInput from '@/components/common/ExcelFileInput';
import WdDeliveryLabelForceDetail from '@/components/wd/deliveryLabelForce/WdDeliveryLabelForceDetail';
import WdDeliveryLabelForceDetail2 from '@/components/wd/deliveryLabelForce/WdDeliveryLabelForceDetail2';
import WdDeliveryLabelForcePop from '@/components/wd/deliveryLabelForce/WdDeliveryLabelForcePop';
import WdDeliveryLabelForceSearch from '@/components/wd/deliveryLabelForce/WdDeliveryLabelForceSearch';
import dateUtils from '@/util/dateUtil';
import { validateForm } from '@/util/FormUtil';
import TabPane from 'antd/lib/tabs/TabPane';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Store

const WdDeliveryLabelForce = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const modalRef = useRef(null);

	const [popupForm] = Form.useForm();

	// 엑셀 업로드 팝업 Ref
	const modalExcelRef = useRef(null);

	//const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const gDcname = useSelector((state: any) => state.global.globalVariable.gDccodeNmOnlyNm);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data const printOrderList
	const [gridData, setGridData] = useState([]); // 분류표출력
	const [gridData1, setGridData1] = useState([]); // 기준정보

	const [activeKey, setActiveKey] = useState('1');
	//const activeKeyRef = useRef(activeKey);

	const comboDccode = Form.useWatch('dccode', form);
	const comboPrintOrder = Form.useWatch('printOrder', form);

	const [printOrderList, setPrintOrderList] = useState([]);
	const [orgPrintOrderList, setOrgPrintOrderList] = useState([]);

	// 다국어
	const { t } = useTranslation();

	/*
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const toCamelCase = (input: any) => {
		if (input == null) return '';
		const s = String(input).trim();
		if (!s) return '';
		// If there are no separators and it already looks like camelCase, return as-is
		if (!/[_\-\s]/.test(s) && /[a-z]/.test(s[0])) return s;
		const parts = s.toLowerCase().split(/[_\-\s]+/);
		return parts.map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))).join('');
	};

	//선택적용
	const applyReason = () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (checkedItems.length < 1) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		const fromCustname = form1.getFieldValue('fromCustname');
		//const searchlabelColRaw = String(form1.getFieldValue('searchlabelCol')).trim();
		const searchlabelColRaw = form1.getFieldValue('searchlabelCol');
		const searchlabelCol = toCamelCase(searchlabelColRaw);
		const searchlabelText = form1.getFieldValue('searchlabelText');

		for (const item of checkedItems) {
			if (fromCustname !== '') {
				gridRef.current?.setCellValue(item.rowIndex, 'lblFromCustname', fromCustname);
			}
			if (searchlabelCol && searchlabelText !== '') {
				gridRef.current?.setCellValue(item.rowIndex, searchlabelCol, searchlabelText);
			}
		}
	};

	// 출력순서 조회
	const searchPrintOrder = async () => {
		const params = {
			dccode: comboDccode,
			usePgm: storeUtil.getMenuInfo().progCd,
		};

		const printOrderList = await apiPostMasterT2List(params);

		setOrgPrintOrderList(printOrderList.data || []);

		const printOrderMap = printOrderList.data.map((item: any) => ({
			comCd: item.prtNm,
			cdNm: item.prtNm,
		}));

		// SelectBox에서 사용할 comCd/cdNm 형태로 설정 (맨 앞에 전체 항목 추가)
		if (printOrderMap.length > 0) {
			setPrintOrderList([{ comCd: '', cdNm: t('lbl.SELECT') }, ...printOrderMap]);
		} else {
			setPrintOrderList([{ comCd: '', cdNm: t('lbl.SELECT') }]);
		}
		form.setFieldValue('printOrder', printOrderList);
		form.setFieldValue('printOrder', '');
	};

	// 출력순서에 의한 Sort
	const gridSort = async () => {
		// 폼에서 선택된 printOrder 값 가져오기
		const printOrder = form.getFieldValue('printOrder');

		if (!printOrder) {
			gridRef.current?.clearSortingAll();
			return;
		}

		const selected = orgPrintOrderList.find((item: any) => item.prtNm === printOrder) || {};

		// 정렬 정보 배열을 준비
		const sortingInfo: { dataField: string; sortType: number }[] = [];

		// prdOrd1..prdOrd8 및 seq1..seq8 순회
		for (let i = 1; i <= 8; i++) {
			const prdKey = `prdOrd${i}`; // ex: prdOrd1
			const seqKey = `seq${i}`; // ex: seq1

			let prdVal = selected[prdKey];
			const seqVal = selected[seqKey];

			// prdVal 값이 없으면 건너뜀
			if (prdVal == null) continue;
			prdVal = String(prdVal).trim();
			if (!prdVal) continue;

			// 그리드 컬럼명(camelCase)으로 변환 (toCamelCase 헬퍼 재사용)
			const dataField = toCamelCase(prdVal);

			// seqVal 정규화:
			// - 값은 항상 'ASC' 또는 'DESC' 라고 가정
			// - 'ASC' => 1, 'DESC' => -1
			const sortType = String(seqVal).trim().toUpperCase() === 'DESC' ? -1 : 1;

			// 정렬정보 추가
			sortingInfo.push({ dataField, sortType });
		}

		// 그리드에 정렬 적용 (정렬 정보가 없으면 정렬 해제)
		if (gridData.length > 0) {
			if (sortingInfo.length > 0) {
				gridRef.current?.setSorting(sortingInfo);
				// 선택을 첫 셀로 이동 (선택사항)
				gridRef.current?.setSelectionByIndex(0, 0);
			} else {
				gridRef.current?.clearSortingAll();
			}
		}
	};

	// 조회
	const searchMasterList = async () => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		let requestParams = form.getFieldsValue();

		let data;

		if (activeKey === '1') {
			requestParams.taskdt = requestParams.taskdt.format('YYYYMMDD');
			let checkDccode = commUtil.nvl(form.getFieldValue('checkDccode'), []);
			checkDccode = checkDccode.toString(); // 물류센터 ->	문자열 변환[1,2,3]
			requestParams = { ...requestParams, checkDccode: checkDccode };

			gridRef.current?.clearGridData();
			({ data } = await apiPostMasterT1List(requestParams));
			setGridData(data || []);
		} else if (activeKey === '2') {
			requestParams.usePgm = storeUtil.getMenuInfo().progCd;
			gridRef1.current?.clearGridData();
			({ data } = await apiPostMasterT2List(requestParams));
			setGridData1(data || []);
		}
	};

	// 엑셀다운로드
	const downloadExcel = async () => {
		const gridData = gridRef.current?.getGridData();

		if (!gridData || gridData.length < 1) {
			// 엑셀다운로드 할 정보가 없습니다.
			showAlert(null, t('msg.MSG_NO_EXCEL_DATA'));
			return;
		}
		const params = {
			fileName: `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDDHHMMss')}`,
		};
		gridRef.current?.exportToXlsxGrid(params);
	};

	// 팝업 오픈
	const openStoPop = async () => {
		const requestParams = form.getFieldsValue();

		popupForm.setFieldsValue({
			dccode: requestParams.dccode,
			dcname: gDcname,
			taskdt: requestParams.taskdt,
		});

		modalRef.current?.handlerOpen();
	};

	// 라벨출력
	const printLabel = async () => {
		//const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		const checkedItems = gridRef.current?.getCheckedRowItemsAll({ isGetRowIndexInItem: true });
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length < 1) {
			// 인쇄할 데이터가 없습니다.
			showAlert(null, t('msg.noPrintData'));
			return;
		}

		// 체크한 항목은 rowIndex 기준 오름차순 정렬
		const sortItem = checkedItems.sort((a: any, b: any) => (a.rowIndex ?? 0) - (b.rowIndex ?? 0));
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			for (const item of checkedItems) {
				if (commUtil.isNull(item.lblBarcode1)) {
					// 바코드1 정보가 없는경우\r\n출력을 진행할 수 없습니다.
					showAlert(null, t('msg.MSG_WD_DELIVERY_LABEL_FORCE_007'));
					return;
				}
			}

			const labelData = sortItem.map((row: any) => {
				const deliverygroup = row.lblDeliverygroup === 'INPLAN' ? '' : row.lblDeliverygroup;
				// 안전하게 문자열로 변환한 뒤 오른쪽(끝) 공백만 제거하고 한 칸 띄워 F를 붙입니다.
				const baseBarcodetxt = String(row.lblBarcodetxt ?? '').trimEnd();
				const barcodetxt = `${baseBarcodetxt} F`;
				const cargroup = row.lblCargroup === 'NODATA' ? '' : row.lblCargroup;

				// AS-IS 코드
				// if(g_DCCODE == "2260"  && objDs.GetColumn(nRow, "LBL_FOLABEL_YN") == 'Y'){
				// 2026.01.06 김동한 확인 결과 분기문이 동일하게 분기 처리 없이 처리함.
				// 레포트 파일에 없는 컬럼은 정의하지 않음.
				return {
					custname1: row.lblCustname1, // 01. custname1
					custname2: row.lblCustname2, // 02. custname2
					skuname1: row.lblSkuname1, // 03. skuname1
					skuname2: row.lblSkuname2, // 04. skuname2
					qty: row.lblQty, // 05. qty
					pageno2: row.lblPageno2, // 06. pageno2
					deliverydt: row.lblDeliverydt, // 07. deliverydt
					deliverygroup: deliverygroup, // 08. deliverygroup
					from_custname: row.lblFromCustname, // 09. from_custname
					loc: row.lblLoc, // 10. loc
					sku: row.lblSku, // 11. sku
					barcode2: row.lblBarcode2, // 12. barcode2
					barcodetxt: barcodetxt, // 13. barcodetxt
					storagetype: row.lblStoragetype, // 14. storagetype
					qr_code: row.lblBarcode1, // 15. qr_code
					pageno1: row.lblPageno1, // 16. pageno1
					cargroup: cargroup, // 17. cargroup
					memo_ofn: row.lblMemoOfn, // 18. memo_ofn
					lbl_stoqty: row.lblStoqty, // 19. lbl_stoqty
					markword: row.lblMarkword, // 20. markword
					sms_yn: row.lblSmsYn, // 21. sms_yn
					title: row.lblTitle, // 22. title
					pageno3: row.lblPageno3, // 23. pageno3
					//qty1: row.lblQty1, // 24. qty2
					qty1: row.lblStoqty, // 24. qty2 2026.01.27 박의병님 오더로 수정함(타센터sto수량으로)
					dcname: row.lblDcname, // 25. dcname
					//storagetype1: row.lblStoragetype1, // 26. storagetype2
					storagetype1: row.lblRealStoragetype, // 26. storagetype 2025.12.26 추가
				};
			});

			if (!labelData || labelData.length === 0) {
				showAlert(null, t('msg.noPrintData'));
				return;
			}
			const params = {
				dccode: checkedItems[0].dccode,
				invoiceno: checkedItems?.map((item: any) => item.lblBarcode1).join(','),
				deliverydate: checkedItems[0].lblManudate,
			};

			apiPostSavePrintList(params).then(res => {
				if (res.statusCode === 0) {
					const fileName: string[] = ['WD_Label_CJFWWD21.mrd'];
					const dataSet: any[] = [labelData];
					const labelId: string[] = ['CJFWWD21'];

					//reportUtil.openLabelReportViewer(fileName, dataSet, labelId, false, true);
					reportUtil.openLabelReportViewer(fileName, dataSet, labelId, false, true);
					searchMasterList();
				}
			});

			// const fileName: string[] = ['WD_Label_CJFWWD21.mrd'];
			// const dataSet: any[] = [labelData];
			// const labelId: string[] = ['CJFWWD21'];

			// reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	const closeEvent = () => {
		modalRef.current?.handlerClose();
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const uploadExcel = () => {
		modalExcelRef.current?.click();
	};

	// /**
	//  * 엑셀 업로드 팝업 닫기
	//  */
	// const closeEventExcel = () => {
	// 	modalExcelRef.current?.handlerClose();
	// };

	const onDataExcel = (data: any) => {
		// 현재 그리드 데이터
		gridRef.current?.clearGridData();

		if (data === undefined || data.length < 1) {
			showAlert(null, '업로드 파일에 입력 정보가 없습니다.');
			return;
		}

		// 그리드 컬럼 헤더 정보 가져옴.
		const dataFieldsWithMeta = gridRef.current
			.getColumnInfoList()
			.map((col: any, index: number) => ({
				index,
				dataField: col.dataField,
				visible: col.visible !== false,
			}))
			.filter((col: { dataField: any }) => !!col.dataField);

		// 그리드 데이터 생성
		const excelGridData = data.map((row: any) => {
			const newRow: any = {};
			let excelIndex = 0;

			// 엑셀 데이터와 그리드 컬럼 매칭
			dataFieldsWithMeta.forEach(({ dataField, visible }: { dataField: string; visible: boolean }) => {
				if (visible) {
					// visible한 컬럼은 엑셀의 실제 순서와 매칭
					newRow[dataField] = row[excelIndex];
					excelIndex++;
				}
			});
			return newRow;
		});

		gridRef.current?.setGridData(excelGridData);
	};

	// 검색영역 초기 세팅 (16개)
	const searchBox = {
		//dccode: '',                  // 01. 물류센터
		taskdt: dayjs(), // 02. 출고일자
		crossdocktype: '', // 03. C/D타입
		//pickBatchNo:'',						   // 04. 대배치키(Input)
		//pickNo: '',						       // 05. 피킹번호(Input)
		ordertype: '', // 06. 주문유형
		crossDc: '', // 07. CROSS센터
		printmethod: 'NEW', // 08. 출력방법
		tasksystem: '', // 09. 피킹방법
		//toCustkey: '',               // 10. 관리처코드(팝업)
		printOrder: '', // 11. 출력순서 (AS-IS 없음.)
		//sku: '',                     // 12. 상품코드(팝업)
		skugroup: '', // 13. 상품분류
		storagetype: '', // 14. 저장조건
		distancetype: '', // 15. 원거리유형
		crossYn: '0', // 16. CROSS 재고 제외
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
		searchPrintOrder,
		printOrderList,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearGridData();
		// 	gridRef1.current?.clearGridData();
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
		gridRef.current?.clearSortingAll();
		gridRef1.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
	}, [activeKey]);

	useEffect(() => {
		if (activeKey === '1') {
			if (comboDccode) {
				searchPrintOrder();
			}
		}
	}, [comboDccode]);

	useEffect(() => {
		if (comboPrintOrder) {
			// gridSort가 async 이므로 에러를 잡아 로그로 남김
			gridSort();
		} else {
			gridRef.current?.clearSortingAll();
		}
	}, [comboPrintOrder]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<WdDeliveryLabelForceSearch {...formProps} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKey} onChange={key => setActiveKey(key)} className="contain-wrap">
				<TabPane tab={t('lbl.WD_DELIVERY_LABEL_FORCE_T1')} key="1">
					<WdDeliveryLabelForceDetail
						gridRef={gridRef}
						gridData={gridData}
						downloadExcel={downloadExcel}
						openStoPop={openStoPop}
						printLabel={printLabel}
						form1={form1}
						applyReason={applyReason}
						gridSort={gridSort}
						uploadExcel={uploadExcel}
					/>
				</TabPane>
				<TabPane tab={t('lbl.WD_DELIVERY_LABEL_FORCE_T2')} key="2">
					<WdDeliveryLabelForceDetail2
						gridRef1={gridRef1}
						gridData1={gridData1}
						form={form}
						searchMasterList={searchMasterList}
					/>
				</TabPane>
			</Tabs>
			<CustomModal ref={modalRef} width="600px">
				<WdDeliveryLabelForcePop popupForm={popupForm} close={closeEvent} />
			</CustomModal>

			{/* 엑셀 업로드 영역 정의 */}
			<ExcelFileInput ref={modalExcelRef} onData={onDataExcel} startRow={1} />
		</>
	);
};

export default WdDeliveryLabelForce;
