/*
 ############################################################################
 # FiledataField	: DpInspectDailyPrint.tsx
 # Description		: 입고 > 입고작업 > 일배입고검수출력
 # Author			: KimDongHyeon
 # Since			: 2025.07.10
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
	apiPostMasterList,
	apiPostPoNotMapDetailList,
	apiPostPrintMasterList,
	apiPostSavePoMapping,
} from '@/api/dp/apiDpInspectDailyPrint';
import DpInspectDailyPrintDetail from '@/components/dp/inspectDailyPrint/DpInspectDailyPrintDetail';
import DpInspectDailyPrintSearch from '@/components/dp/inspectDailyPrint/DpInspectDailyPrintSearch';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import reportUtil from '@/util/reportUtil';
import dayjs from 'dayjs';

// Store

const DpInspectDailyPrint = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataPoNot, setGridDataPoNot] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [totalCountDetail, setTotalCountDetail] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			docdt: dates,
			printType: 'DCCODE', // 출력유형
		}),
		[],
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [docdtFrom, docdtTo] = requestParams.docdt;
		requestParams.docdtFrom = docdtFrom.format('YYYYMMDD');
		requestParams.docdtTo = docdtTo.format('YYYYMMDD');
		delete requestParams.docdt;

		const { data } = await apiPostMasterList(requestParams);
		setGridData(data.masterList || []);
		setGridDataPoNot(data.poNotMapList || []);
	};

	const searchDetailList = async (requestParams: any) => {
		const { isPoNotMap } = requestParams;
		const apiPostDetail = isPoNotMap ? apiPostPoNotMapDetailList : apiPostDetailList;
		const { data } = await apiPostDetail(requestParams);
		setGridDataDetail(data || []);
	};

	const savePoMapping = async (requestParams: any) => {
		showConfirm(null, t('msg.MSG_COM_CFM_023', ['POSO맵핑']), async () => {
			const [docdtFrom, docdtTo] = requestParams.docdt;
			requestParams.docdtFrom = docdtFrom.format('YYYYMMDD');
			requestParams.docdtTo = docdtTo.format('YYYYMMDD');
			const params = {
				gDccode: form.getFieldValue('fixdccode'),
				avc_COMMAND: 'CONFIRM',
				docdtFrom: requestParams.docdtFrom,
				docdtTo: requestParams.docdtTo,
			};

			const res = await apiPostSavePoMapping(params);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined) {
				showAlert('', '저장되었습니다');
			}
		});
	};

	const printMasterList = async () => {
		if (gridRef.current.getCheckedRowItemsAll().length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const requestParams = form.getFieldsValue();
			const [docdtFrom, docdtTo] = requestParams.docdt;
			requestParams.docdtFrom = docdtFrom.format('YYYYMMDD');
			requestParams.docdtTo = docdtTo.format('YYYYMMDD');
			requestParams.saveList = gridRef.current.getCheckedRowItemsAll();
			delete requestParams.docdt;

			const res = await apiPostPrintMasterList(requestParams);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined) {
				// 2. 리포트에 XML 생성을 위한 DataSet 생성
				const dataSet = {
					ds_reportHeader: data,
				};

				const printType = form.getFieldValue('printType');
				// 3. 리포트에 전송할 파라미터
				const params: any = {};
				params.FILE_NAME = printType == 'TMINPLAN' ? 'TM_DPModifyList.mrd' : 'DP_Inspect_Daily.mrd';
				params.INVOICE_TITLE = printType == 'TMINPLAN' ? '차량변경지' : '일배입고검수';

				reportUtil.openAgentReportViewer(params.FILE_NAME, dataSet, params);
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
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive {...formProps}>
				<DpInspectDailyPrintSearch {...formProps} />
			</SearchFormResponsive>

			<DpInspectDailyPrintDetail
				form={form}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridRef2={gridRef2}
				gridData={gridData}
				gridDataPoNot={gridDataPoNot}
				gridDataDetail={gridDataDetail}
				searchDetailList={searchDetailList}
				savePoMapping={savePoMapping}
				printMasterList={printMasterList}
			/>
		</>
	);
};

export default DpInspectDailyPrint;
