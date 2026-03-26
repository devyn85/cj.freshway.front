/*
 ############################################################################
 # FiledataField	: RtQCConfirm.tsx
 # Description		: 반품 > 반품작업 > 반품판정처리
 # Author			: KimDongHyeon
 # Since			: 2025.09.23
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
import { apiPostMasterList, apiPostMasterList2, apiPostSaveMasterList2 } from '@/api/rt/apiRtQCConfirm';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import TabsArray from '@/components/common/TabsArray';
import RtQCConfirmDeletePopup from '@/components/rt/qcConfirm/RtQCConfirmDeletePopup';
import RtQCConfirmDetail from '@/components/rt/qcConfirm/RtQCConfirmDetail';
import RtQCConfirmDetail2 from '@/components/rt/qcConfirm/RtQCConfirmDetail2';
import RtQCConfirmDetail3 from '@/components/rt/qcConfirm/RtQCConfirmDetail3';
import RtQCConfirmSearch from '@/components/rt/qcConfirm/RtQCConfirmSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store

const RtQCConfirm = () => {
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

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();
	const [form2] = Form.useForm();
	const [form3] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridDataExcel, setGridDataExcel] = useState([]);
	const [gridDataExcel2, setGridDataExcel2] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [gridData4, setGridData4] = useState([]);
	const [gridDataDetail2, setGridDataDetail2] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			slipdt: dates,
			qctype: 'RETURNOUT',
		}),
		[],
	);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		//이동결과탭에선 조회 X
		if (activeKey == '3') {
			return;
		}

		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		delete requestParams.slipdt;

		const { data } =
			activeKey === '1' ? await apiPostMasterList(requestParams) : await apiPostMasterList2(requestParams);
		if (activeKey === '1') {
			setGridData(data || []);
		} else {
			setGridData2(data || []);
		}
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchMasterList();
		(activeKeyRef.current === '1' ? gridRef1 : gridRef3).current.clearGridData();
	};

	const openModal = () => {
		modalRef.current.handlerOpen();
	};

	const closeModal = () => {
		modalRef.current.handlerClose();
	};

	const openModal1 = () => {
		form3.setFieldValue('qcdt', form.getFieldValue('slipdt'));
		form3.setFieldValue('qctype', form.getFieldValue('qctype'));
		modalRef1.current.handlerOpen();
	};

	const closeModal1 = () => {
		modalRef1.current.handlerClose();
		searchMasterList();
	};

	//저장
	const saveRtQCConfirmMaster = async (gridNo: number) => {
		const checkedItems = gridRef.current.getCheckedRowItemsAll();
		const checkedItemsWithIndex = gridRef.current.getCheckedRowItems();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//폐기시에만 물류귀책여부 필수체크
		let rowIndex = 0;
		const isEmptyLogiRespYn = checkedItemsWithIndex.some((el: any) => {
			rowIndex = gridRef.current.getRowIndexesByValue('_$uid', el.item._$uid)[0];
			return el.item.disuseqty != 0 && !el.item.logiRespYn;
		});
		if (isEmptyLogiRespYn) {
			showAlert(null, t('msg.requiredInput', [t('lbl.LOGI_RESP_YN')]));
			gridRef.current.setSelectionByIndex(rowIndex, gridRef.current?.getColumnIndexByDataField('logiRespYn'));
			return;
		}

		//폐기시에만 귀책배부 필수체크
		const isEmptyRespType = checkedItemsWithIndex.some((el: any) => {
			rowIndex = gridRef.current.getRowIndexesByValue('_$uid', el.item._$uid)[0];
			return el.item.disuseqty != 0 && !el.item.respType;
		});
		if (isEmptyRespType) {
			showAlert(null, t('msg.requiredInput', [t('lbl.RESP_TYPE')]));
			gridRef.current.setSelectionByIndex(rowIndex, gridRef.current?.getColumnIndexByDataField('respType'));
			return;
		}

		//수량확인
		const isValidQty = checkedItemsWithIndex.some((item: any) => {
			const { confirmqty, orgReturnoutqty, orgDisuseqty, orgGoodqty, returnoutqty, disuseqty, goodqty } = item.item;
			return confirmqty - orgReturnoutqty - orgDisuseqty - orgGoodqty - returnoutqty - disuseqty - goodqty < 0;
		});
		if (isValidQty) {
			showAlert(null, t('예정량보다 많은량을 입력하셨습니다.'));
			return;
		}

		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				fixdccode: form.getFieldValue('fixdccode'),
				apiUrl: '/api/rt/qcConfirm/v1.0/saveMasterList',
				avc_COMMAND: 'PLANCONFIRM',
				saveDataList: checkedItems,
				dataKey: 'saveList',
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	//저장2
	const saveRtQCConfirmMaster2 = async (gridNo: number) => {
		const checkedItems = gridRef1.current.getCheckedRowItemsAll();
		const checkedItemsWithIndex = gridRef1.current.getCheckedRowItems();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//FROM LOC 재고 확인
		let rowIndex = 0;
		const isValidQty = checkedItemsWithIndex.some((item: any) => {
			const { orderqty, qty } = item.item;
			rowIndex = item.rowIndex;
			return qty - orderqty < 0;
		});
		if (isValidQty) {
			showAlert(null, t('처리 가능량보다 많은 수량을 입력 하셨습니다.'));
			gridRef1.current.setSelectionByIndex(rowIndex, gridRef1.current?.getColumnIndexByDataField('orderqty'));
			return;
		}

		//location 생성 확인
		const isNotLoc = checkedItemsWithIndex.some((item: any) => {
			const { processtype, toLocYn } = item.item;
			rowIndex = item.rowIndex;
			if (processtype == 'DISUSE' && toLocYn == 'N') {
				return true;
			}
		});
		if (isNotLoc) {
			showAlert(null, t('이동로케이션이 없습니다.'));
			gridRef1.current.setSelectionByIndex(rowIndex, gridRef1.current?.getColumnIndexByDataField('toLoc'));
			return;
		}

		const stoItems = checkedItems.filter((item: any) => item.processtype == 'RETURNOUT' && item.stoDccode);
		if (stoItems.length > 1) {
			const stoDccode = stoItems[0].stoDccode;
			const isDupSto = stoItems.some((item: any) => {
				if (item.stoDccode !== stoDccode) {
					return true;
				}
			});

			if (isDupSto) {
				showAlert(null, t('다른매입센터는 선택할수없습니다.'));
				return;
			}
		}

		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				fixdccode: form.getFieldValue('fixdccode'),
				saveList: checkedItems,
				avc_COMMAND: 'BATCHPROCESSCONFIRM',
				qcdt: form2.getFieldValue('qcdt').format('YYYYMMDD'),
				wdAutoalloc: 'Y',
			};
			const res = await apiPostSaveMasterList2(params);
			const { data } = res;
			gridRef1.current.clearGridData();
			if (res.error == undefined && data?.errorCode == undefined && !(res?.statusCode < 0)) {
				gridRef1.current.clearGridData();
				if (data?.move?.resultList?.length > 0 || data?.sto?.length > 0) {
					showAlert(null, t('msg.MSG_COM_VAL_201')); // 처리되었습니다. 결과탭으로 이동합ㅇ니다.
					setActiveKey('3');
					setTimeout(() => {
						setGridData([]);
						setGridData2([]);
						setGridData3(data?.move?.resultList || []);
						setGridData4(data?.sto || []);
					}, 10);
				} else {
					showAlert(null, t('msg.confirmSaved')); // 처리되었습니다. 결과탭으로 이동합니다.
				}
			}
		});
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

	const tabItems = [
		{
			key: '1',
			label: '판정',
			children: (
				<RtQCConfirmDetail
					form1={form1}
					isShow={activeKey == '1'}
					gridRef={gridRef}
					gridRef1={gridRef1}
					gridData={gridData}
					gridDataDetail={gridDataDetail}
					gridDataExcel={gridDataExcel}
					openModal={openModal}
					openModal1={openModal1}
					saveRtQCConfirmMaster={saveRtQCConfirmMaster}
				/>
			),
		},
		{
			key: '2',
			label: '처리',
			children: (
				<RtQCConfirmDetail2
					form2={form2}
					isShow={activeKey == '2'}
					gridRef1={gridRef1}
					gridData2={gridData2}
					openModal={openModal}
					openModal1={openModal1}
					saveRtQCConfirmMaster2={saveRtQCConfirmMaster2}
				/>
			),
		},
		{
			key: '3',
			label: '이동결과',
			children: (
				<RtQCConfirmDetail3
					isShow={activeKey == '3'}
					gridRef2={gridRef2}
					gridData3={gridData3}
					gridRef3={gridRef3}
					gridData4={gridData4}
				/>
			),
		},
	];

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		gridRef3.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<RtQCConfirmSearch {...formProps} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />

			{/*마스터저장*/}
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			{/*판정삭제팝업*/}
			<CustomModal ref={modalRef1} width="1280px">
				<RtQCConfirmDeletePopup form={form3} closeModal1={closeModal1} searchForm={form} />
			</CustomModal>
		</>
	);
};

export default RtQCConfirm;
