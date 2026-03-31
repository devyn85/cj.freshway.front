/*
 ############################################################################
 # FiledataField	: WdTaskTap2Detail.tsx
 # Description		: 피킹작업지시-진행현황 Detail
 # Author			: 공두경
 # Since			: 25.08.29
 ############################################################################
*/
import { Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button, InputText } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import {
	apiGetMultiPrintList,
	apiGetPrintBarcodeList,
	apiGetPrintList,
	apiGetPrintSTDList,
	apiGetTab2DetailList,
	apiSaveDivisionTask,
	apiSaveManualPickingBatch,
	apiSaveMergeTask,
	apiSaveMobilePickingBatch,
	apiSavePickingBatchDelete,
} from '@/api/wd/apiWdTask';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import reportUtil from '@/util/reportUtil';

const WdTaskTap2Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			organize: selectedRow[0].organize,
			tasksystem: selectedRow[0].tasksystem,
			taskdt: selectedRow[0].taskdt,
			pickBatchNo: selectedRow[0].pickBatchNo,
			pickNo: selectedRow[0].pickNo,
			pickListNo: selectedRow[0].pickListNo,
			toCustkey: selectedRow[0].toCustkey,
		};

		apiGetTab2DetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
			setTotalCnt(res.data.length);
		});
	};

	/**
	 * 수동피킹
	 */
	const onClickBatch = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'BATCHPICKCONFIRM',
				saveManualPickingBatchList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveManualPickingBatch(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 모바일피킹지시
	 */
	const onClickBatchMobile = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		if (checkedRows.some((row: any) => row.workqty > 0)) {
			showAlert(null, '피킹된 건은 모바일피킹지시 할 수 없습니다.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				mobileFlag: 'Y',
				saveMobilePickingBatchList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveMobilePickingBatch(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};
	/**
	 * 모바일피킹지시취소
	 */
	const onClickBatchMobileCancel = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		if (checkedRows.some((row: any) => row.workqty > 0)) {
			showAlert(null, '피킹된 건은 모바일피킹지시취소 할 수 없습니다.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				mobileFlag: 'N',
				saveMobilePickingBatchList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveMobilePickingBatch(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 피킹분리
	 */
	const onDivisionTask = async () => {
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		if (checkedRows.some((row: any) => row.workqty > 0)) {
			showAlert(null, '피킹된 건은 피킹분리 할 수 없습니다.');
			return;
		}
		if (checkedRows.some((row: any) => row.mobileInstructYn === 'Y')) {
			showAlert(null, '모바일지시된 건은 피킹분리 할 수 없습니다.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'DIVISION_TASK',
				saveDivisionTaskList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveDivisionTask(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 피킹병합
	 */
	const onMergeTask = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		if (checkedRows.length == 1) {
			showAlert(null, t('피킹병합시 최소 2행이상의 데이터가 필요합니다. '));
			return;
		}

		// 1. 유효성 검사: 모든 행이 병합 가능한지 확인합니다.
		// checkedRows 배열의 첫 번째 요소를 기준으로 나머지 모든 요소가 동일한 속성 값을 갖는지 검사
		const { plant, storagetype, distancetype, createkey, mobileInstructYn } = checkedRows[0];
		const isMergeable = checkedRows.every(
			(row: any) =>
				row.plant === plant &&
				row.storagetype === storagetype &&
				row.distancetype === distancetype &&
				row.createkey === createkey &&
				row.mobileInstructYn === mobileInstructYn,
		);

		if (!isMergeable) {
			showAlert(null, '병합할 수 없는 데이터가 있습니다.');
			return;
		}
		if (checkedRows.some((row: any) => row.workqty > 0)) {
			showAlert(null, '피킹된 건은 피킹병합 할 수 없습니다.');
			return;
		}

		// 2. 최대값 찾기: `reduce`를 사용하여 'pickNo'가 가장 큰 행 찾기.
		const minRow = checkedRows.reduce((prev: any, current: any) => (prev.pickNo < current.pickNo ? prev : current));

		if (!minRow) {
			showAlert(null, '병합할 수 있는 데이터가 없습니다.');
			return;
		}

		// 3. 결과 변수 할당: 찾은 행에서 필요한 값을 추출.
		const { pickBatchNo: min_pickBatchNo, pickNo: min_pickNo, pickListNo: min_pickListNo } = minRow;

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'MERGE_TASK',
				minPickNo: min_pickNo,
				minPickBatchNo: min_pickBatchNo,
				minPickListNo: min_pickListNo,
				saveMergeTaskList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveMergeTask(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 피킹생성취소
	 */
	const onClickBatchCancel = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		if (checkedRows.some((row: any) => row.workqty > 0)) {
			showAlert(null, '피킹된 건은 피킹생성취소 할 수 없습니다.');
			return;
		}
		if (checkedRows.some((row: any) => row.mobileInstructYn === 'Y')) {
			showAlert(null, '모바일지시된 건은 피킹생성취소 할 수 없습니다.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'BATCH_DELETE',
				savePickingBatchDeleteList: checkedRows, // 선택된 행의 데이터
			};

			apiSavePickingBatchDelete(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						ref.gridRef2.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 출력
	 */
	const onPrintList = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		const params = props.form.getFieldsValue();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_007', ['출력 항목'])); // {0}을(를) 선택해 주십시오.
			return;
		}

		if (params.printpickinglist == 'PICKINGLIST2600' && checkedRows.length > 1) {
			const { storagetype } = checkedRows[0];
			const isContinew = checkedRows.every((row: any) => row.storagetype === storagetype);

			if (!isContinew) {
				showAlert(null, '저장조건이 일치하지 않습니다. \n동일한 저장조건으로 선택해 주십시오.');
				return;
			}
			searchMultiPickingList();
		} else {
			if (checkedRows.length > 1) {
				showAlert(null, t('msg.MSG_COM_VAL_011')); // 2건 이상 체크되었습니다. 1건만 선택되어야 합니다.
				return;
			}

			if (params.printpickinglist == 'PICKINGLISTCUST') {
				searchPickingList_STD();
			} else {
				searchPickingList();
			}
		}
	};

	const searchPickingList_STD = () => {
		const selectedRow = ref.gridRef.current.getCheckedRowItemsAll();
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			organize: selectedRow[0].organize,
			tasksystem: selectedRow[0].tasksystem,
			taskdt: selectedRow[0].taskdt,
			pickBatchNo: selectedRow[0].pickBatchNo,
			pickNo: selectedRow[0].pickNo,
			pickListNo: selectedRow[0].pickListNo,
			printOrder: searchParams.printorder,
			printmemo: searchParams.printmemo,
			printtype: searchParams.printpickinglist,
			crossYn: searchParams.crossYn,
		};

		apiGetPrintSTDList(params).then(res => {
			// const gridData_STD = res.data.reportSTDlList;
			viewRdReportMaster(res);
		});
	};

	const searchPickingList = () => {
		const selectedRow = ref.gridRef.current.getCheckedRowItemsAll();
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			organize: selectedRow[0].organize,
			tasksystem: selectedRow[0].tasksystem,
			taskdt: selectedRow[0].taskdt,
			pickBatchNo: selectedRow[0].pickBatchNo,
			pickNo: selectedRow[0].pickNo,
			pickListNo: selectedRow[0].pickListNo,
			printOrder: searchParams.printorder,
			printmemo: searchParams.printmemo,
			printtype: searchParams.printpickinglist,
			crossYn: searchParams.crossYn,
		};

		apiGetPrintList(params).then(res => {
			// const gridData_Header = res.data.reportHeaderList;
			// const gridData_Detail = res.data.reportDetailList;
			viewRdReportMaster(res);
		});
	};

	const searchMultiPickingList = () => {
		const selectedRow = ref.gridRef.current.getCheckedRowItemsAll();
		const searchParams = props.form.getFieldsValue();
		const pickListNo = selectedRow.map((row: any) => row.pickListNo).join(',');
		const params = {
			dccode: selectedRow[0].dccode,
			organize: selectedRow[0].organize,
			taskdt: selectedRow[0].taskdt,
			pickListNos: pickListNo,
			printOrder: searchParams.printorder,
			printmemo: searchParams.printmemo,
			printtype: searchParams.printpickinglist,
			crossYn: searchParams.crossYn,
		};

		apiGetMultiPrintList(params).then(res => {
			// const gridData_Header = res.data.reportHeaderList;
			// const gridData_Detail = res.data.reportDetailList;
			viewRdReportMaster(res);
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportMaster = (res: any) => {
		const params = props.form.getFieldsValue();
		const type = params.printpickinglist;

		// // 1. 리포트 파일명
		let fileName = '';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		let dataSet = {};

		// 3. 리포트에 전송할 파라미터
		const reprotParams = {
			TITLE: '재고 품목별 피킹리스트',
		};

		if (type === 'PICKINGLISTCUST') {
			if (!res.data.reportSTDlList || res.data.reportSTDlList.length < 1) {
				showAlert(null, t('msg.NODATA')); // 데이터가 없습니다.
				return;
			}
			// 거래처별피킹리스트
			fileName = 'WD_Task_CUST.mrd';
			dataSet = { ds_reportHeader: res.data.reportSTDlList };
		} else {
			if (!res.data.reportHeaderList || res.data.reportHeaderList.length < 1) {
				showAlert(null, t('msg.NODATA')); // 데이터가 없습니다.
				return;
			}
			// 표준피킹리스트(유형1)
			if (type === 'PICKINGLISTSTD1') {
				fileName = 'WD_Task.mrd';
				// 표준피킹리스트(유형2)
			} else if (type === 'PICKINGLISTSTD2') {
				fileName = 'WD_Task_Type2.mrd';
				// 표준피킹리스트(유형3)
			} else if (type === 'PICKINGLIST2600') {
				fileName = 'WD_Task_Type2600.mrd';
				// 작업구역피킹리스트
			} else {
				fileName = 'WD_Task_Type3.mrd';
			}

			dataSet = { ds_reportHeader: res.data.reportHeaderList, ds_reportDetail: res.data.reportDetailList };
		}

		reportUtil.openAgentReportViewer(fileName, dataSet, reprotParams);
	};

	/**
	 * raw 응답을 받아서 perRow 개수로 묶은 rows 생성.
	 * rows 항목은:
	 *  - plt1..pltN (원본 전체 문자열)
	 *  - PLTA1..PLTAN (접두부, 예: "PLT_2600")
	 *  - PLTB1..PLTBN (숫자 접미, 예: "00000000002935")
	 * @param raw
	 * @param params
	 * @param perRow
	 */
	const generatePltRows = (raw: any, params: any, perRow: number): any[] => {
		// raw 유효성
		if (!raw) return [];

		// normalize -> items (항목 배열: startBarcodeNo 등)
		let items: any[] = [];
		if (Array.isArray(raw)) {
			// 만약 서버가 이미 plt1..pltN 형태의 레코드를 반환하면 그대로 리턴
			if (raw.length > 0 && (raw[0].plt1 !== undefined || raw[0].PLT1 !== undefined)) {
				return raw;
			}
			items = raw;
		} else if (typeof raw === 'object') {
			if (raw.startBarcodeNo || raw.startBarcode) items = [raw];
			else items = Object.values(raw).flat();
		} else {
			return [];
		}

		// 각 item -> 개별 바코드 문자열 배열 expanded
		const expanded: string[] = [];
		for (const it of items) {
			const start = String(it?.startBarcodeNo ?? it?.startBarcode ?? '');
			const printcnt = Math.max(1, Number(it?.printcnt ?? it?.printCnt ?? params.printcnt ?? 1));
			if (!start) continue;

			const m = start.match(/^(.*?)(\d+)$/);
			if (!m) {
				for (let i = 0; i < printcnt; i++) expanded.push(start);
				continue;
			}

			const prefix = m[1];
			const numStr = m[2];
			const width = numStr.length;

			try {
				const base = BigInt(numStr);
				for (let i = 0; i < printcnt; i++) {
					const cur = (base + BigInt(i)).toString().padStart(width, '0');
					expanded.push(prefix + cur);
				}
			} catch {
				const baseNum = Number(numStr || '0');
				for (let i = 0; i < printcnt; i++) {
					const cur = String(baseNum + i).padStart(width, '0');
					expanded.push(prefix + cur);
				}
			}
		}

		// helper: val -> { plta, pltb }
		const splitPlt = (val: string | null) => {
			if (val == null) return { plta: null, pltb: null };
			const s = String(val);
			const m = s.match(/^(.*?)(\d+)$/);
			if (m) {
				const plta = m[1].replace(/_$/, '') || null;
				const pltb = m[2] || null;
				return { plta, pltb };
			}
			const idx = s.lastIndexOf('_');
			if (idx > -1) {
				const plta = s.substring(0, idx) || null;
				const pltb = s.substring(idx + 1) || null;
				return { plta, pltb };
			}
			return { plta: null, pltb: null };
		};

		// chunk into rows with dynamic perRow size
		const rows: any[] = [];
		for (let i = 0; i < expanded.length; i += perRow) {
			const chunk = expanded.slice(i, i + perRow);
			const row: any = {};
			for (let j = 0; j < perRow; j++) {
				const val = chunk[j] ?? null;
				row[`plt${j + 1}`] = val;

				const { plta, pltb } = splitPlt(val);
				// 소문자 호환이 필요하면 아래도 유지해도 됩니다 (지우려면 제거)
				row[`plta${j + 1}`] = plta;
				row[`pltb${j + 1}`] = pltb;
			}
			rows.push(row);
		}

		return rows;
	};

	/**
	 * PLT 바코드 출력
	 */
	const onBarcodePrint = () => {
		// 폼 인스턴스에서 현재 탭에 맞는 값을 가져옵니
		const searchParams = props.form.getFieldsValue();
		const params = {
			fixdccode: searchParams.fixdccode,
			printcnt: searchParams.printcnt,
		};
		if (commUtil.isNull(params.printcnt) || Number(params.printcnt) <= 0) {
			showAlert(null, t('msg.MSG_COM_VAL_218', ['PLT출력수량'])); // {{0}} 을/를 입력하십시요.
			return;
		}
		apiGetPrintBarcodeList(params).then(res => {
			//viewRdReportBarcode(res);

			const raw = res?.data?.reportBarcodelList ?? res?.data;
			if (!raw) {
				showAlert(null, t('msg.NODATA'));
				return;
			}

			const rows = generatePltRows(raw, params, 8);

			// 1. 리포트 파일명
			const fileName = ['WD_Label_CJFWWD23.mrd'];

			// 2. 리포트에 XML 생성을 위한 DataSet 생성
			const dataSet = [rows];

			// 3. 리포트 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId = ['CJFWWD23'];

			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	/**
	 * PLT QR코드 출력
	 */
	const onBarcodeQRPrint = () => {
		// 폼 인스턴스에서 현재 탭에 맞는 값을 가져옵니
		const searchParams = props.form.getFieldsValue();
		const params = {
			fixdccode: searchParams.fixdccode,
			printcnt: searchParams.printcnt,
		};
		if (commUtil.isNull(params.printcnt) || Number(params.printcnt) <= 0) {
			showAlert(null, t('msg.MSG_COM_VAL_218', ['PLT출력수량'])); // {{0}} 을/를 입력하십시요.
			return;
		}
		apiGetPrintBarcodeList(params).then(res => {
			//viewRdReportBarcode(res);

			const raw = res?.data?.reportBarcodelList ?? res?.data;
			if (!raw) {
				showAlert(null, t('msg.NODATA'));
				return;
			}

			const rows = generatePltRows(raw, params, 5);

			// 1. 리포트 파일명
			const fileName = ['WD_Label_CJFWWD24.mrd'];

			// 2. 리포트에 XML 생성을 위한 DataSet 생성
			const dataSet = [rows];

			// 3. 리포트 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId = ['CJFWWD24'];

			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportBarcode = (res: any) => {
		const params = props.form.getFieldsValue();
		const type = params.printpickinglist;

		// // 1. 리포트 파일명
		const fileName = '';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {};

		// 3. 리포트에 전송할 파라미터
		const reprotParams = {
			TITLE: 'PLT 바코드',
		};

		reportUtil.openAgentReportViewer(fileName, dataSet, reprotParams);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'),
			dataType: 'code',
		},
		{
			dataField: 'taskdt',
			headerText: t('lbl.TASKDT'),
			dataType: 'date',
		},
		{
			dataField: 'tasksystemdesc',
			headerText: t('lbl.TASKSYSTEM_WD'),
			dataType: 'code',
		},
		{
			headerText: t('lbl.BATCHINFO'),
			children: [
				{
					dataField: 'createdescr',
					headerText: t('lbl.BATCHGROUP'),
				},
				{
					dataField: 'storagetypedesc',
					headerText: t('lbl.STORAGETYPE'),
					dataType: 'code',
				},
				{
					dataField: 'distancetype',
					headerText: t('lbl.PICKINGTYPE'),
					dataType: 'code',
				},
				{
					dataField: 'skucount',
					headerText: t('lbl.SKUCOUNT'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'storerorderqty',
					headerText: t('lbl.OPENQTY_WD'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'processqty',
					headerText: t('lbl.PROCESSQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'workqty',
					headerText: t('lbl.WORKQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'inspectqty',
					headerText: t('lbl.INSPECTQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'confirmqty',
					headerText: t('lbl.CONFIRMQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{
			dataField: 'pickBatchNo',
			headerText: t('lbl.PICK_BATCH_NO'),
			dataType: 'code',
		},
		{
			dataField: 'pickNo',
			headerText: t('lbl.PICK_NO'),
			dataType: 'code',
		},
		{
			dataField: 'workkg',
			headerText: t('lbl.PROCESSQTY_KG'), // 처리물량(KG)
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'printCnt',
			headerText: t('lbl.PRINT_CNT_ENG'), // 프린트횟수
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'printDate',
			headerText: t('lbl.PRINT_TIME_ENG'), // 프린트시간
			dataType: 'date',
		},
		{
			dataField: 'scancount',
			headerText: t('lbl.SCAN_YN'),
			dataType: 'code',
		},
		{
			dataField: 'mobileInstructYn',
			headerText: '모바일<br>지시여부',
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'organize',
		},
		{
			dataField: 'custcount',
			positionField: 'custcount',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'docnocount',
			positionField: 'docnocount',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'skucount',
			positionField: 'skucount',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'storerorderqty',
			positionField: 'storerorderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workkg',
			positionField: 'workkg',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn3',
				btnLabel: '피킹병합', // 피킹병합
				callBackFn: onMergeTask,
			},
			{
				btnType: 'btn4',
				btnLabel: '모바일피킹지시', // 모바일피킹지시
				callBackFn: onClickBatchMobile,
			},
			{
				btnType: 'btn7',
				btnLabel: '모바일피킹지시취소', // 모바일피킹지시
				callBackFn: onClickBatchMobileCancel,
			},
			{
				btnType: 'btn2',
				btnLabel: '수동피킹', // 수동피킹
				callBackFn: onClickBatch,
			},
			{
				btnType: 'print', // 인쇄
				callBackFn: onPrintList,
			},
			{
				btnType: 'btn8',
				btnLabel: '피킹생성취소', // 피킹생성취소
				callBackFn: onClickBatchCancel,
			},
		],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol2 = [
		{
			dataField: 'deliverydate',
			headerText: t('lbl.DOCDT_WD'),
			dataType: 'date',
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO_WD'),
			dataType: 'code',
		},
		{
			headerText: t('lbl.CUSTINFO'),
			children: [
				{
					dataField: 'toCustkey',
					headerText: t('lbl.TO_CUSTKEY_WD'),
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									custkey: e.item.toCustkey,
								},
								'cust',
							);
						},
					},
				},
				{
					dataField: 'toCustname',
					headerText: t('lbl.TO_CUSTNAME'),
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									sku: e.item.sku,
								},
								'sku',
							);
						},
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			headerText: t('lbl.QTYINFO'),
			children: [
				{
					dataField: 'taskcount',
					headerText: t('lbl.TASKCOUNT'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'processqty',
					headerText: t('lbl.PROCESSQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'workqty',
					headerText: t('lbl.WORKQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'inspectqty',
					headerText: t('lbl.INSPECTQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'confirmqty',
					headerText: t('lbl.CONFIRMQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.STORERUOM'),
			dataType: 'code',
		},
		{
			dataField: 'workkg',
			headerText: t('lbl.PROCESSQTY_KG'), // 처리물량(KG)
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: '고객(하나로마트 경로만)', // 고객(하나로마트 경로만)
			children: [
				{
					dataField: 'reference07',
					headerText: t('lbl.CUSTKEY_WD'),
					dataType: 'code',
				},
				{
					dataField: 'reference08',
					headerText: t('lbl.CUSTNAME_WD'),
				},
			],
		},
		/*START.hidden 컬럼*/
		{ dataField: 'mobileInstructYn', editable: false, visible: false }, // 모바일지시여부
		/*END.hidden 컬럼*/
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'deliverygroup',
		},
		{
			dataField: 'taskcount',
			positionField: 'taskcount',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workkg',
			positionField: 'workkg',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn3',
				btnLabel: '피킹분리', // 피킹분리
				callBackFn: onDivisionTask,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			} else {
				ref.gridRef2.current.clearGridData();
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem || event.primeCell.dataField === 'customRowCheckYn') return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			searchDtl();
		});
	}, []);

	// 대문자 변환
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// 입력값에서 숫자만 추출 (0으로 시작하는 경우 제거)
		const numericValue = e.target.value.replace(/[^0-9]/g, '');

		// 양의 정수만 허용: 0이 아닌 숫자로 시작하거나 빈 문자열 허용
		const cleanedValue = numericValue.replace(/^0+/, '') || '';

		if (Number(cleanedValue) > 1200) {
			showAlert(null, 'PLT출력수량은 1,200 이하로 입력해 주십시오.');
			props.form.setFieldsValue({ printcnt: '' });
			return;
		}

		props.form.setFieldsValue({ printcnt: cleanedValue });
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Form form={props.form} className="h100">
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt}>
									<li>
										<InputText label="PLT출력수량" onChange={handleChange} name="printcnt" className="bg-white" />
									</li>
									<Button onClick={onBarcodePrint}>{'PLT 바코드'}</Button>
									<Button onClick={onBarcodeQRPrint}>{'QR코드'}</Button>
								</GridTopBtn>
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
							</GridAutoHeight>
						</>,
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridBtn={gridBtn2} gridTitle="상세" totalCnt={totalCnt} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid
									ref={ref.gridRef2}
									columnLayout={gridCol2}
									gridProps={gridProps2}
									footerLayout={footerLayout2}
								/>
							</GridAutoHeight>
						</>,
					]}
				/>
			</Form>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdTaskTap2Detail;
