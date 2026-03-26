/*
 ############################################################################
 # FiledataField	: RtReturnOut.tsx
 # Description		: 반품 > 반품작업 > 협력사반품지시
 # Author			: KimDongHyeon
 # Since			: 2025.10.13
 ############################################################################
*/
import { fetchGrpCommCode } from '@/store/core/comCodeStore';
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
import dayjs from 'dayjs';
import { apiPostExcelList, apiPostMasterList } from '@/api/rt/apiRtReturnOut';
import { validateForm } from '@/util/FormUtil';
import RtReturnOutSearch from '@/components/rt/returnOut/RtReturnOutSearch';
import RtReturnOutDetail from '@/components/rt/returnOut/RtReturnOutDetail';
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import { apiPostSaveConfirm } from '@/api/rt/apiRtReturnOutExDC';
import RtReturnOutMstPop1 from '@/components/rt/returnOut/RtReturnOutMstPop1';

// Store

const RtReturnOut = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const expCodeList = getCommonCodeList('EXPIRATION_DATE_RT');
	const expCodeListMap = expCodeList.map((item: any) => {
		const [storagetype, start, end, rate] = item.comCd.split('_');
		return {
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
	const gridRef4 = useRef<any>(null);
	const gridRef5 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();
	const [form2] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridDataExcel, setGridDataExcel] = useState([]);
	const [gridDataDetail2, setGridDataDetail2] = useState([]);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			slipdt: dates,
			stocktype: 'BAD',
		}),
		[],
	);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();

		const { data } = await apiPostMasterList(requestParams);
		setGridData(data || []);
	};

	const searchExcelList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		delete requestParams.slipdt;

		const { data } = await apiPostExcelList(requestParams);

		setGridDataExcel(data || []);
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchMasterList();
		gridRef.current.clearGridData();
	};

	const openModal = () => {
		modalRef1.current.handlerOpen();
	};

	const closeModal = () => {
		fetchGrpCommCode();
		modalRef1.current.handlerClose();
	};

	//선택적용
	const applyReason = (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				form: form1,
			},
			3: {
				ref: gridRef3,
				form: form2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		const reasonCode = gridMap[gridNo].form.getFieldValue('reasonCode') || '';
		const reasonMsg = gridMap[gridNo].form.getFieldValue('reasonMsg') || '';

		for (const item of checkedItems) {
			gridMap[gridNo].ref.current.setCellValue(item.rowIndex, 'reasoncode', reasonCode);
			gridMap[gridNo].ref.current.setCellValue(item.rowIndex, 'reasonmsg', reasonMsg);
		}
	};

	//예외저장
	const saveExcept = async (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
			},
			3: {
				ref: gridRef3,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current
			.getChangedData({ validationYn: false, andCheckedYn: false })
			.filter((item: any) => item.rowStatus === 'U');

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		gridMap[gridNo].ref.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/rt/skuLabel/v1.0/saveDpSkuLabel',
				saveDataList: checkedItems,
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	//저장
	const saveRtReturnOutMaster = async (gridNo: number) => {
		const EX_PARTNER_LIST = getCommonCodeList('EX_PARTNER');
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = gridRef.current.getChangedData({ validationYn: false, andCheckedYn: false });

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//예외협력사확인
		const isExPartner = checkedItems.some((item: any) => {
			const { custkey } = item;
			if (EX_PARTNER_LIST.map((ex: any) => ex.comCd).includes(custkey)) {
				return true;
			}
		});
		if (isExPartner) {
			showAlert(null, t('예외협력업체는 저장 불가합니다'));
			return;
		}

		const updatedItems: any[] = [];

		// 그리드 입력 값 검증
		for (const item of checkedItems) {
			const uom = item.uom;
			const qty = item.qty;
			const wdQty = item.wdQty;

			// 반품요청수량이 재고수량보다 많은지 확인한다.
			if (qty < wdQty) {
				showMessage({
					content: '반품요청수량이 재고수량보다 많습니다.',
					modalType: 'warning',
				});
				return;
			}

			// 반품수량 소수 입력은 단위가 KG일 때만 가능하다.
			if (uom !== 'KG') {
				if (wdQty > 0 && wdQty < 1) {
					const sku = item.sku;
					showMessage({
						content: '[상품코드 : ' + sku + ']' + ' KG단위가 아닌 상품의 반품수량은 정수로만 입력 가능합니다.',
						modalType: 'warning',
					});
					return;
				}
			}

			// 중복 건은 제외한다
			const exists = updatedItems.find((el: any) => {
				return (
					el.dccode === item.dccode &&
					el.storerkey === item.storerkey &&
					el.organize === item.organize &&
					el.custkey === item.custkey
				);
			});

			if (!exists) {
				updatedItems.push(item);
			}
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				avc_DCCODE: form.getFieldValue('fixdccode'),
				avc_COMMAND: 'CONFIRM',
				fixdccode: form.getFieldValue('fixdccode'),
				wdDate: form1.getFieldValue('wdDate').format('YYYYMMDD'),
				docExistYn: 'false',
				saveHeaderList: updatedItems, //ds_in
				saveDetailList: checkedItems, //ds_detail
			};

			apiPostSaveConfirm(params).then(res => {
				if (res.statusCode === 0) {
					showAlert('', t('msg.confirmSaved'), searchMasterList);
				}
			});
		});
	};

	//대상확정
	const saveRtReturnOutDetail = async (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				parentRef: gridRef,
				gridData: gridDataDetail,
			},
			3: {
				ref: gridRef3,
				parentRef: gridRef2,
				gridData: gridDataDetail2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItems();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//수량확인
		const isValidQty = checkedItems.some((item: any) => {
			const { orderqty, confirmqty, shortageqty, tranqty, shortagetranqty } =
				gridMap[gridNo].ref.current.getGridData()[item.rowIndex];
			return orderqty - confirmqty - shortageqty - tranqty - shortagetranqty < 0;
		});
		if (isValidQty) {
			showAlert(null, t('반품 가능량보다 많은 수량을 입력 하셨습니다.'));
			return;
		}

		// 잔여율 확인
		const isRateInvalid = checkedItems.some((item: any) => {
			const findOrig = gridMap[gridNo].gridData.find((origItem: any) => origItem.docline == item.item.docline);
			if (findOrig?.excptYn == 'Y') {
				return false; // 예외인 경우는 잔여율 체크하지 않음
			}

			const expCode = expCodeListMap.find((c: any) => {
				return (
					(item.item.storagetype == c.storagetype || item.item.storagetypeCode == c.storagetype) &&
					item.item.duration >= c.start &&
					item.item.duration <= c.end
				);
			});

			if (parseInt(commUtil.calcDurationRate(item.item.lotExpire, item.item.duration)) < parseInt(expCode?.rate)) {
				return true;
			}
		});
		//표준센터이동 체크 X
		if (gridMap[gridNo].parentRef.current.getSelectedRows()[0].ordertype != 'ZUB' && isRateInvalid) {
			showAlert(null, t('소비기한임박율이 미만입니다.'));
			return;
		}

		gridMap[gridNo].ref.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/rt/returnOut/v1.0/saveDetail',
				avc_COMMAND: 'CONFIRM',
				saveDataList: checkedItems.map((item: any) => item.item),
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	//방단적용
	const savePlt = async (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				parentRef: gridRef,
			},
			3: {
				ref: gridRef3,
				parentRef: gridRef2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItemsAll();
		const custkey = gridMap[gridNo].parentRef.current.getSelectedRows()[0].fromCustkey;

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect'));
			return;
		}

		//필수체크
		const isEmpty = checkedItems.some(
			(item: any) => commUtil.isEmpty(item.boxperlayer) || commUtil.isEmpty(item.layerperplt),
		);
		if (isEmpty) {
			showAlert(null, t('msg.required', ['PLT(방), PLT(단)']));
			return;
		}

		gridMap[gridNo].ref.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/rt/returnOut/v1.0/saveBoxPlt',
				saveDataList: checkedItems.map((item: any) => ({ ...item, custkey })),
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	//수량적용
	const applyQty = (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				form: form1,
			},
			3: {
				ref: gridRef3,
				form: form2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		for (const item of checkedItems) {
			const { orderqty, confirmqty, shortageqty } = gridMap[gridNo].ref.current.getGridData()[item.rowIndex];
			gridMap[gridNo].ref.current.setCellValue(
				item.rowIndex,
				'tranqty',
				parseInt(orderqty) - parseInt(confirmqty) - parseInt(shortageqty),
			);
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
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<RtReturnOutSearch {...formProps} />
			</SearchFormResponsive>

			<RtReturnOutDetail
				form1={form1}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridRef4={gridRef4}
				gridData={gridData}
				gridDataDetail={gridDataDetail}
				gridDataExcel={gridDataExcel}
				openModal={openModal}
				applyReason={applyReason}
				saveExcept={saveExcept}
				saveRtReturnOutMaster={saveRtReturnOutMaster}
				saveRtReturnOutDetail={saveRtReturnOutDetail}
				savePlt={savePlt}
				applyQty={applyQty}
				searchExcelList={searchExcelList}
			/>

			{/*마스터저장*/}
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			<CustomModal ref={modalRef1} width="800px">
				<RtReturnOutMstPop1 codeType={'EX_PARTNER'} close={closeModal} />
			</CustomModal>
		</>
	);
};

export default RtReturnOut;
