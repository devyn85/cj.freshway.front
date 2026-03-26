/*
 ############################################################################
 # FileName     : WdKxDeliveryInvoiceDetail2.tsx
 # Description  : 출고 > 출고작업 > 택배송장발행(온라인) > N배송 탭
 # Author       : sss
 # Since        : 2025.12.22
 ############################################################################
 
 ■ 주요 기능
 --------------------------------------------------
 1. N배송 주문 송장 관리 (배송서비스구분: 03)
    - 송장분리: N배송 주문을 개별 송장으로 분리 처리
    - 박스번호/포장수량 편집 및 저장
    - 행 복사/삭제 기능
    - 운송장 출력 (라벨 인쇄)
    - 송장 접수 처리
 
 2. 데이터 검증
    - 필수 입력값 검증 (박스번호, 포장수량 등)
    - 운송장번호별 주문수량과 포장수량 일치 여부 검증
    - 상태별 작업 가능 여부 검증
 
 3. 그리드 기능
    - 셀 병합 (운송장번호별)
    - 행 체크박스 (상태별 활성/비활성)
    - 편집 가능/불가능 상태 구분
    - 체크된 행만 저장/처리
 
 ■ 주요 함수
 --------------------------------------------------
 - saveMasterInvoiceDivide()     : 송장분리 처리 (접수확정 상태만 가능)
 - saveMasterList01()            : 박스정보 저장 (박스번호, 포장수량 등)
 - deleteRows()                  : 행 삭제 (신규행 완전삭제, 기존행 삭제표시)
 - saveMasterInvoiceReceipt()    : 송장접수 처리 (송장분리완료 상태만 가능)
 - printMasterList()             : 운송장 라벨 출력
 
 ■ 상태 코드
 --------------------------------------------------
 - 10: 업로드
 - 11: 업로드삭제
 - 12: 접수실패
 - 13: 배송제외
 - 16: 접수확정 → 송장분리 가능
 - 17: 송장분리완료 → 송장접수 가능
 - 20: 택배접수완료
 - 21: 택배접수취소
 
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util
import { showAlert, showConfirm } from '@/util/MessageUtil';
import reportUtil from '@/util/reportUtil';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// API
import { Form } from 'antd';
// Hooks

// lib
// type
import { GridBtnPropsType } from '@/types/common';
// asset
import {
	apiPostPrintMasterList,
	apiSaveMasterInvoiceDivide,
	apiSaveMasterInvoiceReceipt,
	apiSaveMasterList02,
} from '@/api/wd/apiKxDeliveryInvoice';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import {
	bindGridEvents,
	buildGridCol,
	isCanDelete02,
	isCanDivide,
	isCanInvoiceReceipt,
	isDisabledCheckbox,
	validateInvoiceQtyEquality,
} from '@/components/wd/kxDeliveryInvoice/WdKxDeliveryInvoice';

interface Props {
	form: any;
	deliverySvcTypeTab: string; // 배송서비스구분 - 01:일반,02:반품,03:N배송
	search: any;
	data: Array<any>;
	totalCnt: number;
}
const WdKxDeliveryInvoiceDetail2 = forwardRef((props: Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, deliverySvcTypeTab, search, data } = props; // Antd Form
	const refModal = useRef(null);
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [formRef] = Form.useForm();
	const [popupType, setPopupType] = useState('');
	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파마리터

	const islVisibleCol = false; // 컬럼 보이기/숨기기 토글용 변수

	// 삭제된 행들을 저장할 전역변수
	const deletedRowsRef = useRef<any[]>([]);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const refModalPop = useRef(null); // 그리드 팝업용 ref
	const refModalIndividualPop = useRef(null);

	//그리드 컬럼
	const gridCol = buildGridCol(t, islVisibleCol, {
		gridRef: ref.gridRef,
		refModalPop: refModalPop,
		setPopupType: setPopupType,
		deliverySvcTypeTab: deliverySvcTypeTab,
		extraHiddenCols: [
			{ dataField: 'kxCustkey', editable: false, visible: islVisibleCol }, // kxCustkey
			{ dataField: 'storagetype', editable: false, visible: islVisibleCol }, // storagetype
		],
	});

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		isLegacyRemove: true, // 화면에서 직접 행삭제 방식 사용
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
		//
		enableCellMerge: true, // 셀 병합 실행
		// 행 체크 칼럼(엑스트라 체크박스)의 병합은 rcptNo 필드와 동일하게 병합 설정
		rowCheckMergeField: 'rcptNo',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabledCheckbox(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabledCheckbox(item); // status > '00'이면 체크박스 비활성화
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 송장분리 처리
	 */
	const saveMasterInvoiceDivide = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// isDisabled가 true인 행이 있으면 메시지 표시
		const disabledRows = checkedRows.filter((row: any) => !isCanDivide(row.item ?? row));
		if (disabledRows.length > 0) {
			showAlert('', '처리할 수 없는 상태의 행이 선택되어 있습니다.[접수확정만 가능]');
			return;
		}

		// const buildSaveList = () => {
		// 	return gridRef.getCheckedRowItemsAll().map((row: any) => ({
		// 		serialkey: row.serialkey,
		// 	}));
		// };

		const params = {
			//fixdccode: form.getFieldValue('fixdccode'),
			fixdccode: '2900', // TODO임시용
			reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일
			deliverySvcTypeTab: deliverySvcTypeTab, // 배송서비스구분 - 01:일반,02:반품,03:N배송
			//saveList: buildSaveList(),
			serialkey: gridRef
				.getCheckedRowItemsAll()
				.map((row: any) => row.serialkey)
				.join(','),
			docno: [...new Set(gridRef.getCheckedRowItemsAll().map((row: any) => row.docno))].join(','), // 중복 제거
		};

		const totalCnt = gridRef.getCheckedRowItemsAll().length;

		showConfirm(null, t('송장 분리 처리를 진행하시겠습니까?'), () => {
			apiSaveMasterInvoiceDivide(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, `총 ${totalCnt}건 중 ${res.data?.processCnt || 0}건 처리되었습니다`);
					props.search();
				}
			});
		});
	};

	/**
	 * 송장접수 처리
	 * @param {any} params
	 * @param {any} params.saveList
	 */
	const saveMasterInvoiceReceipt = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 송장을 접수할 수 없는 상태의 행이 있으면 메시지 표시
		const disabledRows = checkedRows.filter((row: any) => !isCanInvoiceReceipt(row.item ?? row));
		if (disabledRows.length > 0) {
			showAlert('', '송장분리완료 상태가 아닌 행이 선택되어 있습니다.[송장분리완료만 가능]');
			return;
		}

		// const isChanged = gridRef.getChangedData({ validationYn: false });
		// if (!isChanged || isChanged.length < 1) {
		// 	showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
		// 	return;
		// }

		// 입력 값 검증
		// const isValid = await validateForm(formRef);
		// if (!isValid) {
		// 	return;
		// }

		// validation
		//if (!gridRef.validateRequiredGridData()) return;

		const allCheckedItems = gridRef.getCheckedRowItemsAll();

		// docno별로 그룹화하여 각 그룹의 첫 번째 항목만 추출
		/*
	그리드에 체크된 것 중
	docno serialkey
	G260121000002_1 1
	G260121000002_2 2
	G260121000002_3 3
	G260121000002_3 4
	G260121000002_3 5

	docno로 그룹해서 serialkey 첫번째
	docno serialkey
	G260121000002_1 1
	G260121000002_2 2
	G260121000002_3 3		
		*/
		const docnoMap = new Map<string, any>();
		for (const item of allCheckedItems) {
			const docno = item.docno;
			if (!docnoMap.has(docno)) {
				docnoMap.set(docno, item);
			}
		}

		const params = {
			//fixdccode: form.getFieldValue('fixdccode'),
			fixdccode: '2900', // TODO임시용
			reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일
			deliverySvcTypeTab: deliverySvcTypeTab, // 배송서비스구분 - 01:일반,02:반품,03:N배송
			saveList: Array.from(docnoMap.values()),
		};

		const totalCnt = gridRef.getCheckedRowItemsAll().length;

		// 저장하시겠습니까?
		showConfirm(null, t('접수 처리를 진행하시겠습니까?'), () => {
			apiSaveMasterInvoiceReceipt(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, `총 ${totalCnt}건 중 ${res.data?.processCnt || 0}건 처리되었습니다`);
					props.search();
				}
			});
		});
	};

	/**
	 * 출력
	 */
	const printMasterList = () => {
		const gridRef = ref.gridRef.current; // 차량별 그리드

		if (gridRef.getCheckedRowItemsAll().length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		// 인쇄 하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			// 저장 시 전송할 필드를 선택해 구성
			const buildSaveList = () => {
				const gridRef = ref.gridRef.current;
				return gridRef.getCheckedRowItemsAll().map((row: any) => ({
					docno: row.docno,
				}));
			};
			const params = {
				fixdccode: form.getFieldValue('fixdccode'),
				reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일
				deliverySvcTypeTab: deliverySvcTypeTab, // 배송서비스구분 - 01:일반,02:반품,03:N배송
				//saveList: buildSaveList(), // 선택된 행의 데이터
				docno: [...new Set(gridRef.getCheckedRowItemsAll().map((row: any) => row.docno))].join(','), // 중복 제거
			};

			apiPostPrintMasterList(params).then(res => {
				if (res.statusCode > -1) {
					viewRdReportMaster(res); // 리포트 뷰어 열기)
				}
			});
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportMaster = (res: any) => {
		if (!res.data.reportList || res.data.reportList.length < 1) {
			showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
			return;
		}

		// 1. 리포트 파일명
		//const fileName = 'WD_HomeDeliveryLabel.mrd';
		//const fileName = 'WD_Label_CJFWWD25.mrd';
		const fileName: string[] = ['WD_Label_CJFWWD25.mrd'];

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		// const dataSet = {
		// 	ds_report: res.data.reportList, // 상세 정보
		// };

		const dataSet: any[] = [res.data.reportList];

		// 3. 리포트 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
		//const labelId = ['CJFWWD25'];
		const labelId: string[] = ['CJFWWD25'];

		//reportUtil.openLabelReportViewer([fileName], [dataSet], labelId);
		reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
	};

	/**
	 * 행삭제 버튼 클릭
	 * @returns
	 */
	const deleteRows3 = () => {
		const gridRef = ref.gridRef.current;
		const chk = gridRef.getCheckedRowItems();

		if (chk.length === 0) {
			showAlert('', '삭제할 행을 선택해 주세요.');
			return;
		}
		if (chk.filter((row: any) => row.item.delYn === 'Y').length > 0) {
			showAlert('', '이미 삭제된 행이 존재합니다.');
			return;
		}

		// isDisabled가 true인 행이 있으면 메시지 표시
		const disabledRows = chk.filter((row: any) => !isCanDelete02(row.item ?? row));
		if (disabledRows.length > 0) {
			showAlert('', '삭제할 수 없는 상태의 행이 선택되어 있습니다.');
			return;
		}

		// 신규행과 기존행 분리
		const newRows = chk.filter((row: any) => {
			const item = row.item ?? row;
			return item.rowStatus === 'I';
		});

		const existingRows = chk.filter((row: any) => {
			const item = row.item ?? row;
			return item.rowStatus !== 'I';
		});

		// 신규행은 완전히 삭제
		if (newRows.length > 0) {
			const newRowUids = newRows.map((row: any) => {
				const item = row.item ?? row;
				return item._$uid;
			});
			const allGridData = gridRef.getGridData();
			const filteredData = allGridData.filter((item: any) => !newRowUids.includes(item._$uid));
			gridRef.setGridData(filteredData);
			setTotalCnt(filteredData.length);
		}

		// 기존행은 삭제 표시만
		existingRows.forEach((row: any) => {
			const item = row.item ?? row;
			item.rowStatus = 'D';
			item.delYn = 'Y';
			gridRef.removeRowByRowId(item._$uid);
		});
	};

	const deleteRows = () => {
		const checkedData = ref.gridRef.current?.getCheckedRowItems();

		if (!checkedData || checkedData.length === 0) {
			showAlert(null, t('msg.MSG_COM_VAL_072')); // 삭제할 행을 선택하세요
			return;
		}

		// 그리드 rowIndex 기반으로 필터링
		const allData = ref.gridRef.current?.getGridData() || [];
		const checkedRowIndices = new Set(checkedData.map((item: any) => item.rowIndex));

		// 삭제될 행들을 전역변수에 저장
		const rowsToDelete = allData.filter((item: any, index: number) => checkedRowIndices.has(index));
		deletedRowsRef.current = [...(deletedRowsRef.current || []), ...rowsToDelete];

		// 그리드에서 행 제거
		const filteredData = allData.filter((item: any, index: number) => !checkedRowIndices.has(index));
		ref.gridRef.current?.setGridData(filteredData);
		setGridData(filteredData);
	};

	/**
	 * 저장
	 */
	const saveMasterList01 = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없고 삭제된 행도 없으면 경고 메시지 표시
		if (checkedRows.length < 1 && (!deletedRowsRef.current || deletedRowsRef.current.length < 1)) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const isChanged = gridRef.getChangedData({ validationYn: false });
		// 변경사항이 없고 삭제된 행도 없으면 경고 메시지 표시
		if ((!isChanged || isChanged.length < 1) && (!deletedRowsRef.current || deletedRowsRef.current.length < 1)) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// isDisabled가 true인 행이 있으면 메시지 표시
		const disabledRows = checkedRows.filter((row: any) => !isCanDelete02(row.item ?? row));
		if (disabledRows.length > 0) {
			showAlert('', '삭제할 수 없는 상태의 행이 선택되어 있습니다.');
			return;
		}

		// 입력 값 검증
		// const isValid = await validateForm(formRef);
		// if (!isValid) {
		// 	return;
		// }

		// validation - 삭제되지 않은 행만 검증
		const removedItems = gridRef.getRemovedItems(); // 삭제된 행
		const removedUidSet = new Set<string>((removedItems || []).map((ri: any) => ri.item?._$uid ?? ri._$uid));

		// 삭제되지 않은 체크된 행만 검증
		const nonDeletedRows = checkedRows.filter((row: any) => {
			const item = row.item ?? row;
			return !removedUidSet.has(item._$uid) && item.delYn !== 'Y' && item.rowStatus !== 'D';
		});

		// 삭제되지 않은 행에 대해서만 필수값 검증
		if (nonDeletedRows.length > 0) {
			if (!gridRef.validateRequiredGridData()) return;
		}

		// START.rowStatus 처리
		// 체크된 데이터 중 삭제된 행은 rowStatus='D'로, 신규행은 'I'로, 수정된 행은 'U'로 세팅
		const saveList = (checkedRows || []).map((ci: any) => {
			const it = ci.item ?? ci;
			if (removedUidSet.has(it._$uid) || it.delYn === 'Y' || it.rowStatus === 'D') {
				return { ...it, rowStatus: 'D', delYn: it.delYn ?? 'Y' };
			}
			// 신규 행 체크 (rowStatus가 'I'이거나 기존에 없던 행)
			if (it.rowStatus === 'I') {
				return { ...it, rowStatus: 'I' };
			}
			return { ...it, rowStatus: 'U' };
		});

		// 삭제된 행들을 saveList에 추가 (rowStatus='D')
		if (deletedRowsRef.current && deletedRowsRef.current.length > 0) {
			const deletedRows = deletedRowsRef.current.map((row: any) => ({
				...row,
				rowStatus: 'D',
				delYn: 'Y',
			}));
			saveList.push(...deletedRows);
			// 저장 후 삭제된 행 초기화
			deletedRowsRef.current = [];
		}
		// END.rowStatus 처리

		// 운송장번호별 수량 합계 검증 (수정된 행만 대상)
		const qtyCheck = validateInvoiceQtyEquality(saveList);
		// if (!qtyCheck.valid) {
		// 	const first = qtyCheck.mismatches[0];
		// 	showAlert(
		// 		null,
		// 		`${t('운송장번호')} ${first.invoiceno}: ${t('lbl.ORDERQTY')} ${first.orderSum} / ${t('포장수량')} ${
		// 			first.boxSum
		// 		} ${t('이(가) 일치하지 않습니다.')}`,
		// 	);
		// 	return;
		// }

		// 저장하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_003'), async () => {
			const params = {
				saveList: saveList,
			};
			apiSaveMasterList02(params).then(async res => {
				if (res?.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다

					await props.search();
				}
			});
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			// 송장분리 버튼 (N배송,일반 에서만 표시)
			...(deliverySvcTypeTab === '03' || deliverySvcTypeTab === '01'
				? [
						{
							btnType: 'btn1' as const,
							btnLabel: t('송장분리'),
							authType: 'save' as const,
							callBackFn: saveMasterInvoiceDivide,
						},
				  ]
				: []),
			{
				btnType: 'btn1' as const,
				btnLabel: deliverySvcTypeTab === '03' ? t('N송장저장') : t('주문저장'),
				authType: 'save', // 권한
				callBackFn: saveMasterList01, // 주문내역 저장
			},
			// 행복사 버튼 (N배송,일반 에서만 표시)
			...(deliverySvcTypeTab === '03' || deliverySvcTypeTab === '01'
				? [
						{
							btnType: 'copy' as const,
							initValues: { rowStatus: 'I' },
						},
				  ]
				: []),

			// 행삭제 버튼
			{
				btnType: 'delete' as const,
				isActionEvent: false,
				authType: 'save' as const,
				callBackFn: deleteRows,
			},

			{
				btnType: 'btn2' as const,
				btnLabel: t('운송장출력'), // 운송장출력
				authType: 'save', // 권한
				callBackFn: printMasterList,
			},
			{
				btnType: 'btn3' as const,
				btnLabel: t('송장접수'), // 접수
				authType: 'save', // 권한
				callBackFn: saveMasterInvoiceReceipt,
			},
		],
	};

	/**
	 * 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		setTimeout(() => {
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'boxno', selectedRow[0].code);
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'boxname', selectedRow[0].name);
			refModalPop.current.handlerClose();
		}, 0);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalPop.current.handlerClose();
	};

	/**
	 * 팝업 열기 이벤트
	 * @param params
	 */
	const fnCmIndividualPopup = (params: any) => {
		setPopUpParams(params);
		refModalIndividualPop.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent01 = () => {
		refModalIndividualPop.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef && props.data) {
			// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경(2/2)
			const newRows = props.data.map((row: any, idx: any) => ({
				...row,
				uid: `ua-${idx + 1}`,
			}));
			//gridRef?.setGridData(props.data);
			gridRef?.setGridData(newRows);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	/**
	 * 컴포넌트 마운트 시 그리드 이벤트 초기화
	 * - 셀 편집 완료 이벤트 바인딩
	 */
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		// 그리드 이벤트 바인딩
		bindGridEvents(gridRef, t, form, fnCmIndividualPopup, deliverySvcTypeTab);
	}, []);

	return (
		<>
			{/* 그리드 영역 */}

			<AGrid className="">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					<Form form={formRef} layout="inline"></Form>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModalPop} />
			{/* 개인정보 팝업 */}
			<CustomModal ref={refModalIndividualPop} width="700px" draggable={true}>
				<CmIndividualPopup popUpParams={popUpParams} close={closeEvent01} />
			</CustomModal>
		</>
	);
});

export default WdKxDeliveryInvoiceDetail2;
