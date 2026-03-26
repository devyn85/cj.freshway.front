/*
 ############################################################################
 # FiledataField	: DpSkuLabel.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력
 # Author			: KimDongHyeon
 # Since			: 2025.08.07
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
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
	apiPostDetailList,
	apiPostDetailList2,
	apiPostMasterList,
	apiPostMasterList2,
	apiPostPrintList,
} from '@/api/dp/apiDpSkuLabel';
import { apiPostSaveMasterList } from '@/api/st/apiStSkuLabelExDC';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import TabsArray from '@/components/common/TabsArray';
import DpSkuLabelDetail from '@/components/dp/skuLabel/DpSkuLabelDetail';
import DpSkuLabelDetail2 from '@/components/dp/skuLabel/DpSkuLabelDetail2';
import DpSkuLabelSearch from '@/components/dp/skuLabel/DpSkuLabelSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import reportUtil from '@/util/reportUtil';
import dayjs from 'dayjs';

// Store

const DpSkuLabel = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const expCodeList = getCommonCodeList('EXPIRATION_DATE_DP');
	const expCodeListMap = expCodeList.map((item: any) => {
		const [storagetype, start, end, rate] = item.comCd.split('_');
		return {
			cdNm: item.cdNm,
			storagetype,
			start,
			end,
			rate,
		};
	});
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);
	const gridRef3 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridDataDetail2, setGridDataDetail2] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			slipdt: dates,
		}),
		[],
	);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param item
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		delete requestParams.slipdt;

		if (requestParams.blno || requestParams.serialno || requestParams.contractcompany) {
			requestParams.serialCheck = '1';
		}

		const { data } =
			activeKey === '1' ? await apiPostMasterList(requestParams) : await apiPostMasterList2(requestParams);
		if (activeKey === '1') {
			gridRef.current.clearGridData();
			gridRef1.current.clearGridData();
			setGridData(data || []);
		} else {
			gridRef2.current.clearGridData();
			gridRef3.current.clearGridData();
			setGridData2(data || []);
		}
	};

	const searchDetailList = async (row: any) => {
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		delete requestParams.slipdt;

		if (requestParams.blno || requestParams.serialno || requestParams.contractcompany) {
			requestParams.serialCheck = '1';
		}

		const activeKey = activeKeyRef.current;
		const { data } =
			activeKey === '1'
				? await apiPostDetailList({ ...requestParams, ...row })
				: await apiPostDetailList2({ ...requestParams, ...row });
		if (activeKey === '1') {
			setGridDataDetail(data || []);
		} else {
			setGridDataDetail2(data || []);
		}
	};

	const saveDpSkuLabel = async (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
			},
			3: {
				ref: gridRef3,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getChangedData({
			validationYn: false,
			andCheckedYn: true,
		});

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		showConfirm(null, `저장하시겠습니까?\n삭제 시, 원오더는 예외정보만 삭제 됩니다.`, async () => {
			const params = {
				apiUrl: '/api/dp/skuLabel/v1.0/saveDpSkuLabel',
				saveDataList: checkedItems,
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchDetailList((activeKeyRef.current === '1' ? gridRef : gridRef2).current.getSelectedRows()[0]);
	};

	const openModal = () => {
		modalRef1.current.handlerOpen();
	};

	const closeModal = () => {
		modalRef1.current.handlerClose();
	};

	// 인쇄
	const printDetailList = (gridNo: number, isA4: boolean) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				gridData: gridDataDetail,
				labelId: 'CJFWDP3',
				fileName: 'DP_Label_CJFWDP1.mrd',
				fileNameA4: 'DP_SKU_LABEL_A4.mrd',
			},
			3: {
				ref: gridRef3,
				gridData: gridDataDetail2,
				labelId: 'CJFWDP2',
				fileName: 'DP_Label_CJFWDP2.mrd',
				fileNameA4: 'DP_SKU_LABEL_A4.mrd',
			},
		};

		// 1. 체크된 데이터
		const list = gridMap[gridNo].ref.current.getCheckedRowItemsAll();

		// 2. 체크된 데이터 확인
		if (list.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 잔여율 확인
		const idxList = gridMap[gridNo].ref.current.getCheckedRowItems();
		const isRateInvalid = idxList.some((item: any) => {
			return !commUtil.isDpPossible(item.item, expCodeListMap);
		});
		if (isRateInvalid) {
			showAlert(null, t('소비기한임박율이 미만입니다.'));
			return;
		}

		// 3. 체크된 데이터를 담는다.
		// 인쇄 를/을 처리하시겠습니까?
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			// CJFWDP3	입고라벨(소)
			const labelData = [];

			for (const row of list.filter((r: any) => Number(r.printedqty) > 0)) {
				const printedQty = Number(row.printedqty);
				let qty = '';
				if (row.uom == 'KG') {
					qty = `${row.orderqty} KG`;
				} else {
					const box = Math.floor(parseInt(row.orderqty) / parseInt(row.qtyperbox));
					const ea = parseInt(row.orderqty) % parseInt(row.qtyperbox);
					if (box > 0) {
						qty = `${box} BOX `;
					}
					qty += `${ea} EA`;
				}

				for (let i = 0; i < printedQty; i++) {
					labelData.push({
						sku: row.lblSku,
						slipdt: row.slipdt,
						loc: row.loc,
						expiredt: row.lotExpire == 'STD' ? '' : dayjs(row.lotExpire, 'YYYYMMDD').format('YYYY-MM-DD'),
						uom:
							commUtil.isEmpty(row.boxperlayer) || commUtil.isEmpty(row.layerperplt)
								? ''
								: `${row.boxperlayer}*${row.layerperplt}`,
						qty,
						docdtyyyy: dayjs(row.slipdt, 'YYYYMMDD').format('YYYY'),
						docdtmmdd: dayjs(row.slipdt, 'YYYYMMDD').format('MM-DD'),
						skuname1: row.lblSkuname1,
						skuname2: row.lblSkuname2,
						custkey: row.lblCustkey,
						custname: gridNo == 1 ? row.lblCustname : gridRef2.current.getSelectedRows()[0].fromCustname,
						lottable01: row.lotExpire == 'STD' ? '' : dayjs(row.lotExpire, 'YYYYMMDD').format('YYYY-MM-DD'),
						barcode:
							gridNo == 1
								? `B${row.sku}-${row.durationtype == '1' ? row.lotExpire : row.lotManufacture}B`
								: row.lblBarcodetext,
						placeoforigin: row.lblPlaceoforigin,
						title: row.lblTitle,
						qtyperbox: row.lblQtyperbox,
						serialno: row.lblSerialno,
						weight: row.lblWeight,
						convertlot: row.lblConvertlot,
						storagetype: row.storagetype,
					});
				}
			}

			if (labelData.length === 0) {
				showAlert(null, t('msg.noPrintData')); // 인쇄할 데이터가 없습니다.
				return;
			}

			// 4. 라벨 파일명
			const fileName: string[] = [isA4 ? gridMap[gridNo].fileNameA4 : gridMap[gridNo].fileName];

			// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
			const dataSet = [labelData];

			// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId: string[] = [gridMap[gridNo].labelId];

			// 7. 라벨 출력 (바로인쇄 or 미리보기)
			if (isA4) {
				const dataSet = {
					ds_report: labelData,
				};

				// 3. 리포트에 전송할 파라미터
				const params: any = {};
				// params.INVOICE_TITLE = '저장품 입고예정 현황';

				reportUtil.openAgentReportViewer(fileName[0], dataSet, params);
			} else {
				reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
			}
		});
	};

	const printDetailList2 = async (gridNo: number, isA4: boolean) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				gridData: gridDataDetail,
				labelId: 'CJFWDP3',
				fileName: 'DP_Label_CJFWDP1.mrd',
				fileNameA4: 'DP_SKU_LABEL_A4.mrd',
			},
			3: {
				ref: gridRef3,
				gridData: gridDataDetail2,
				labelId: 'CJFWDP2',
				fileName: 'DP_Label_CJFWDP2.mrd',
				fileNameA4: 'DP_SKU_LABEL_A4.mrd',
			},
		};

		// 1. 체크된 데이터
		const list = gridMap[gridNo].ref.current.getCheckedRowItemsAll().filter((item: any) => {
			return item.rowStatus == 'I';
		});

		// 2. 체크된 데이터 확인
		if (list.length === 0) {
			showAlert(null, '복사한 행만 출력 가능합니다');
			return;
		}

		// 잔여율 확인
		const idxList = gridMap[gridNo].ref.current.getCheckedRowItems();
		const isRateInvalid = idxList.some((item: any) => {
			return !commUtil.isDpPossible(item.item, expCodeListMap);
		});
		if (isRateInvalid) {
			showAlert(null, t('소비기한임박율이 미만입니다.'));
			return;
		}

		// 3. 체크된 데이터를 담는다.
		// 인쇄 를/을 처리하시겠습니까?
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//패키지 저장
			const params = {
				avc_COMMAND: 'BATCHCREATION',
				saveList: list.map((item: any) => ({
					...item,
					durationRate: null,
				})),
			};
			const res = await apiPostSaveMasterList(params);
			if (res?.statusCode < 0) {
				return;
			}
			//저장된것 조회
			const { data } = await apiPostPrintList({ fromCustname: gridRef2.current.getSelectedRows()[0].fromCustname });

			// CJFWDP3	입고라벨(소)
			const labelData = [];

			let idx = 0;
			for (const row of data.filter((r: any) => Number(r.printedqty) > 0)) {
				const printedQty = Number(row.printedqty);
				let qty = '';
				if (list[idx].uom == 'KG') {
					qty = `${list[idx].orderqty} KG`;
				} else {
					const box = Math.floor(parseInt(list[idx].orderqty) / parseInt(list[idx].qtyperbox));
					const ea = parseInt(list[idx].orderqty) % parseInt(list[idx].qtyperbox);
					if (box > 0) {
						qty = `${box} BOX `;
					}
					qty += `${ea} EA`;
				}

				for (let i = 0; i < printedQty; i++) {
					labelData.push({
						sku: row.lblSku,
						slipdt: list[idx].slipdt,
						loc: list[idx].loc,
						expiredt: list[idx].lotExpire == 'STD' ? '' : dayjs(list[idx].lotExpire, 'YYYYMMDD').format('YYYY-MM-DD'),
						uom:
							commUtil.isEmpty(list[idx].boxperlayer) || commUtil.isEmpty(list[idx].layerperplt)
								? ''
								: `${list[idx].boxperlayer}*${list[idx].layerperplt}`,
						qty,
						docdtyyyy: dayjs(list[idx].slipdt, 'YYYYMMDD').format('YYYY'),
						docdtmmdd: dayjs(list[idx].slipdt, 'YYYYMMDD').format('MM-DD'),
						skuname1: row.lblSkuname1,
						skuname2: row.lblSkuname2,
						custname: row.lblCustname,
						lottable01: list[idx].lotExpire == 'STD' ? '' : dayjs(list[idx].lotExpire, 'YYYYMMDD').format('YYYY-MM-DD'),
						barcode: row.lblBarcodetext,
						serialno: row.lblSerialno,
						weight: row.lblWeight,
						convertlot: row.lblConvertlot,
						qtyperbox: row.lblQtyperbox,
						placeoforigin: row.lblPlaceoforigin,
						storagetype: row.storagetype,
					});
				}
				idx++;
			}

			if (labelData.length === 0) {
				showAlert(null, t('msg.noPrintData')); // 인쇄할 데이터가 없습니다.
				return;
			}

			// 4. 라벨 파일명
			const fileName: string[] = [isA4 ? gridMap[gridNo].fileNameA4 : gridMap[gridNo].fileName];

			// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
			const dataSet = [labelData];

			// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId: string[] = [gridMap[gridNo].labelId];

			// 7. 라벨 출력 (바로인쇄 or 미리보기)
			if (isA4) {
				const dataSet = {
					ds_report: labelData,
				};

				// 3. 리포트에 전송할 파라미터
				const params: any = {};
				// params.INVOICE_TITLE = '저장품 입고예정 현황';

				reportUtil.openAgentReportViewer(fileName[0], dataSet, params);
			} else {
				reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
			}
			searchDetailList(gridRef2.current.getSelectedRows()[0]);
		});
	};

	const copyDetailList = (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
			},
			3: {
				ref: gridRef3,
			},
		};

		let selectedRowTmp = [];
		selectedRowTmp = gridMap[gridNo].ref.current?.getCheckedRowItems();

		if (selectedRowTmp && selectedRowTmp.length > 0) {
			selectedRowTmp?.forEach((selectedRowItem: any, index: number) => {
				const item = Object.assign({}, selectedRowItem['item'], { sliplineSeq: null, barcode: '', rowStatus: 'I' });
				const addedRowIndex = selectedRowItem['rowIndex'] + index + 1;

				gridMap[gridNo].ref.current.addRow(item, addedRowIndex);
			});
		}
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current.clearGridData();
			gridRef1.current.clearGridData();
		},
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
	};

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		gridRef3.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	const tabItems = [
		{
			key: '1',
			label: '일반상품(PO기준)',
			children: (
				<DpSkuLabelDetail
					gridRef={gridRef}
					gridRef1={gridRef1}
					gridData={gridData}
					gridDataDetail={gridDataDetail}
					saveDpSkuLabel={saveDpSkuLabel}
					searchDetailList={searchDetailList}
					openModal={openModal}
					printDetailList={printDetailList}
					copyDetailList={copyDetailList}
				/>
			),
		},
		{
			key: '2',
			label: '이력상품',
			children: (
				<DpSkuLabelDetail2
					gridRef2={gridRef2}
					gridRef3={gridRef3}
					gridData={gridData2}
					gridDataDetail={gridDataDetail2}
					saveDpSkuLabel={saveDpSkuLabel}
					searchDetailList={searchDetailList}
					openModal={openModal}
					printDetailList={printDetailList}
					copyDetailList={copyDetailList}
					printDetailList2={printDetailList2}
				/>
			),
		},
	];

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<DpSkuLabelSearch {...formProps} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			<CustomModal ref={modalRef1} width="350px">
				<div className="tbl-view">
					<table>
						<thead>
							<tr>
								<th rowSpan={2}>저장타입</th>
								<th colSpan={2}>소비기간</th>
								<th rowSpan={2}>입고기준(%)</th>
							</tr>
							<tr>
								<th>시작일</th>
								<th>종료일</th>
							</tr>
						</thead>
						<tbody>
							{expCodeListMap.map((item: any, index: number) => (
								<tr key="expCodeListMap-tr">
									<td className="ta-c">{item.cdNm}</td>
									<td className="ta-c">{item.start}</td>
									<td className="ta-c">{item.end}</td>
									<td className="ta-c">{item.rate}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CustomModal>
		</>
	);
};

export default DpSkuLabel;
