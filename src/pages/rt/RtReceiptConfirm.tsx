/*
 ############################################################################
 # FiledataField	: RtReceiptConfirm.tsx
 # Description		: 반품 > 반품작업 > 반품확정처리
 # Author			: KimDongHyeon
 # Since			: 2025.09.16
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
	apiPostCancelMaster,
	apiPostDetailList,
	apiPostDetailList2,
	apiPostMaMdInfoList,
	apiPostMasterList,
	apiPostSendMaster,
	apiPostTempSaveMasterList,
} from '@/api/rt/apiRtReceiptConfirm';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import RtReceiptConfirmDetail from '@/components/rt/receiptConfirm/RtReceiptConfirmDetail';
import RtReceiptConfirmEmailPopup from '@/components/rt/receiptConfirm/RtReceiptConfirmEmailPopup';
import RtReceiptConfirmSearch from '@/components/rt/receiptConfirm/RtReceiptConfirmSearch';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import dayjs from 'dayjs';
// Store

const RtReceiptConfirm = () => {
	/**
	 *
	 * @param template
	 * @param obj
	 */
	function convertTemplate(template: string, obj: any) {
		return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
			return obj.hasOwnProperty(key) ? commUtil.nvl(obj[key], '') : '';
		});
	}

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { moveMenu } = useMoveMenu();
	const location = useLocation();
	const [queryParam, setQueryParam] = useState<any>({});

	const RT_CHG_DEPT_DAY = getCommonCodeList('RT_CHG_DEPT_DAY')?.[0]?.comCd;
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
	const modalRef2 = useRef(null);
	const modalRef3 = useRef(null);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);
	const gridRef3 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();
	const [popupForm] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridDataDetail2, setGridDataDetail2] = useState([]);

	const [activeKey, setActiveKey] = useState('2');
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
	 */
	const searchMasterList = async () => {
		gridRef.current?.clearGridData();
		gridRef1.current?.clearGridData();
		gridRef2.current?.clearGridData();
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
		delete requestParams.slipdt;

		if (requestParams.blno || requestParams.serialno || requestParams.wdCustkey) {
			requestParams.serialCheck = '1';
		}

		const { data } = await apiPostMasterList(requestParams);
		setGridData(data || []);
	};

	const searchDetailList = async (rowData: any) => {
		if (rowData?.serialyn == 'N') {
			setGridDataDetail([]);
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
		delete requestParams.slipdt;
		if (!requestParams.blno || !requestParams.serialno || !requestParams.wdCustkey) {
			requestParams.serialCheck = '1';
		}
		const { data } = await apiPostDetailList({ ...requestParams, ...rowData });
		setGridDataDetail(data || []);
	};

	const searchDetailList2 = async (requestParams: any) => {
		const { data } = await apiPostDetailList2(requestParams);
		setGridDataDetail2(data || []);
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchMasterList();
		(activeKeyRef.current === '1' ? gridRef1 : gridRef3).current?.clearGridData();
	};

	//저장
	const saveMasterList = async (gridNo: number) => {
		const checkedItems = gridRef.current.getCheckedRowItems();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//수량체크
		const isNotQty = checkedItems.some((item: any) => {
			const { tranqty, shortagetranqty, reasoncode, returntype } = item.item;
			if (tranqty == 0 && shortagetranqty == 0) {
				return true;
			}
		});
		if (isNotQty) {
			showAlert(null, t('msg.required', ['반품작업량 or 미회수작업량']));
			return;
		}

		//회수여부
		const isNotType = checkedItems.some((item: any) => {
			const { tranqty, shortagetranqty, reasoncode, returntype } = item.item;
			if (tranqty != 0 && !returntype) {
				return true;
			}
		});
		if (isNotType) {
			showAlert(null, t('msg.required', ['회수여부']));
			return;
		}

		//미회수사유
		const isNotReason = checkedItems.some((item: any) => {
			const { tranqty, shortagetranqty, reasoncode, returntype } = item.item;
			if (shortagetranqty != 0 && !reasoncode) {
				return true;
			}
		});
		if (isNotReason) {
			showAlert(null, t('msg.required', ['미회수사유']));
			return;
		}

		gridRef.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/rt/receiptConfirm/v1.0/saveMaster',
				avc_COMMAND: 'CONFIRM',
				saveDataList: checkedItems.map((item: any) => item.item),
				dataKey: 'saveMasterList',
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	//임시저장
	const tempSaveMasterList = async (gridNo: number) => {
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//이메일여부
		const isAlreadySend = checkedItems.some((el: any) => {
			return el.emailSendDate;
		});
		if (isAlreadySend) {
			showAlert(null, '이메일 전송 건은 수정 할 수없습니다.');
			return;
		}

		//필수
		const isEmptyCd = checkedItems.some((el: any) => {
			return !el.chgReqDeptCd;
		});
		if (isEmptyCd) {
			showAlert(null, t('msg.requiredInput', [t('lbl.REASONTYPE_CHAN')]));
			return;
		}

		gridRef.current.showConfirmSave(async () => {
			const params = {
				saveMasterList: checkedItems,
			};
			const res = await apiPostTempSaveMasterList(params);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined) {
				showAlert('', t('msg.confirmSaved'), searchMasterList);
			}
		});
	};

	//이메일
	const sendMasterList = async (gridNo: number) => {
		showConfirm(null, t('msg.confirmSave'), async () => {
			const checkedItems = gridRef.current.getCheckedRowItemsAll();
			const checkedItem = checkedItems[0];
			const params = popupForm.getFieldsValue();
			const res = await apiPostSendMaster({ ...params, ...checkedItem });
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined) {
				showAlert('', t('msg.confirmSaved'), () => {
					modalRef1.current.handlerClose();
					searchMasterList();
				});
			}
		});
	};

	const openModal = () => {
		modalRef2.current.handlerOpen();
	};

	const openEmailModal = async (gridNo: number) => {
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		if (checkedItems.length > 1) {
			showAlert(null, t('msg.MSG_COM_VAL_011'));
			return;
		}

		//이메일여부
		const isAlreadySend = checkedItems.some((el: any) => {
			return el.emailSendDate;
		});
		if (isAlreadySend) {
			showAlert(null, '이미 이메일 전송되었습니다.');
			return;
		}

		//선행체크
		const oriChgReqDeptCd = gridData.find((c: any) => c.docno == checkedItems[0].docno)?.chgReqDeptCd;
		if (!oriChgReqDeptCd) {
			showAlert(null, '임시저장을 먼저 해야합니다.');
			return;
		}

		const checkedItem = checkedItems[0];
		const params = {
			...checkedItem,
			gubun: checkedItem.reference15 != 'Y' ? 'MD' : 'MA',
		};
		const { data } = await apiPostMaMdInfoList(params);
		popupForm.setFieldsValue({
			rcvrEmailAddr: data?.[0]?.mailId,
			rcvrNm: data?.[0]?.somdname,
			title: '반품오더 귀책변경요청',
			cnts: convertTemplate(htmlTemplate, { ...checkedItem, chgDay: RT_CHG_DEPT_DAY }),
		});
		modalRef1.current.handlerOpen();
	};

	//취소
	const cancelMasterList = async (gridNo: number) => {
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//선행체크
		const isNotTempSave = checkedItems.some((el: any) => {
			const oriChgReqDeptCd = gridData.find((c: any) => c.docno == el.docno)?.chgReqDeptCd;
			return !oriChgReqDeptCd;
		});
		if (isNotTempSave) {
			showAlert(null, '임시저장을 먼저 해야합니다.');
			return;
		}

		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				saveMasterList: checkedItems,
			};
			const res = await apiPostCancelMaster(params);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined) {
				showAlert('', t('msg.confirmSaved'), searchMasterList);
			}
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current?.clearGridData();
			gridRef1.current?.clearGridData();
			gridRef2.current?.clearGridData();
		},
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
	};

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

	useEffect(() => {
		setQueryParam(location.state);
	}, [location]);

	useEffect(() => {
		//const [slipdtFrom, slipdtTo] = requestParams.slipdt;

		if (queryParam.docno) {
			form.resetFields(); // 기존 값 초기화

			const dccode = queryParam.dccode;
			const fixDccodeValue = Array.isArray(dccode) ? dccode[0] : dccode;
			form.setFieldsValue({
				...(fixDccodeValue ? { fixdccode: fixDccodeValue } : {}),
				slipdt: [dayjs(queryParam.slipdtFrom), dayjs(queryParam.slipdtTo)],
				docno: queryParam.docno,
				sku: queryParam.sku,
				skuName: decodeURIComponent(queryParam.skuName),
			});
			searchMasterList();
		}
	}, [queryParam]);

	// src/templates/returnNotice.ts
	const htmlTemplate = `
<div>
  <strong>
    {{chgDay}}일이내 미 응답 시, 귀책 자동변경되오니 참고 부탁드립니다.<br>
  </strong>
	<div>
		<p>
			반품오더: 
			{{docno}}
		</p>
		<p>
			귀책변경: 
			{{other01}} → {{chgReqDeptNm}}
		</p>
		<p>
			거래처코드/명: 
			{{fromCustkey}}({{fromCustname}})
		</p>
		<p>
			반품사유:
			{{potypename}} /
			{{other03}} /
			{{other04}}
		</p>
		<p>
			상품코드/명: 
			{{sku}}({{skuname}})
		</p>
		<p>
			단위/수량: 
			{{uom}}/{{orderqty}}
		</p>
		<p>
			저장유무: 
			{{channel}}
		</p>
		<p>
			저장조건: 
			{{storagetype}}
		</p>
		<p>
			변경요청사유: 
			
		</p>
	
		<a href="https://safsqa2.ifresh.co.kr//com/html5/index.jsp?menuId=CJFS_SA&subMenuId=P-COM-SA-C-224" target="_blank" rel="noopener noreferrer">
			바로가기
		</a>
	</div>
</div>
`;

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<RtReceiptConfirmSearch {...formProps} />
			</SearchFormResponsive>

			<RtReceiptConfirmDetail
				form1={form1}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridRef2={gridRef2}
				gridData={gridData}
				activeKey={activeKey}
				setActiveKey={setActiveKey}
				gridDataDetail={gridDataDetail}
				gridDataDetail2={gridDataDetail2}
				searchDetailList={searchDetailList}
				searchDetailList2={searchDetailList2}
				tempSaveMasterList={tempSaveMasterList}
				openEmailModal={openEmailModal}
				saveMasterList={saveMasterList}
				cancelMasterList={cancelMasterList}
				openModal={openModal}
				modalRef3={modalRef3}
			/>

			{/*마스터저장*/}
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			<CustomModal ref={modalRef1} width="1000px">
				<RtReceiptConfirmEmailPopup
					popupForm={popupForm}
					sendMasterList={sendMasterList}
					close={modalRef1?.current?.handlerClose}
				/>
			</CustomModal>

			<CustomModal ref={modalRef2} width="800px">
				<CmUserCdCfgPopup codeType={'RT_CHG_DEPT_DAY'} close={modalRef2?.current?.handlerClose} />
			</CustomModal>

			<CustomModal ref={modalRef3} width="350px">
				<div className="tbl-view">
					<table>
						<thead>
							<tr>
								<th>일자</th>
								<th>배차 번호</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="ta-c">{'2025-11-11'} todo</td>
								<td className="ta-c">{'99가9999'} todo</td>
							</tr>
						</tbody>
					</table>
				</div>
			</CustomModal>
		</>
	);
};

export default RtReceiptConfirm;
