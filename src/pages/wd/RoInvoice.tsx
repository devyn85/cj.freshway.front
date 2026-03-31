/*
 ############################################################################
 # FiledataField	: RoInvoice.tsx
 # Description		: 입고 > 입고작업 > 반출명세서출력
 # Author			: KimDongHyeon
 # Since			: 2025.07.16
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostDetailList, apiPostMasterList, apiPostPrintMasterList } from '@/api/wd/apiRoInvoice';
import RoInvoiceDetail from '@/components/wd/roInvoice/RoInvoiceDetail';
import RoInvoiceSearch from '@/components/wd/roInvoice/RoInvoiceSearch';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import reportUtil from '@/util/reportUtil';
import dayjs from 'dayjs';

// Store

const RoInvoice = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [totalCountDetail, setTotalCountDetail] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			invoicedt: dayjs(),
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
		requestParams.invoicedt = requestParams.invoicedt.format('YYYYMMDD');

		gridRef.current.clearGridData();
		gridRef1.current.clearGridData();
		const { data } = await apiPostMasterList(requestParams);
		setGridData(data || []);
		setTotalCount(data?.totalCount || 0);
	};

	const searchDetailList = async (requestParams: any) => {
		const { data } = await apiPostDetailList(requestParams);
		setGridDataDetail(data || []);
		setTotalCountDetail(data?.totalCount || 0);
	};

	const printMasterList = async (isMaster: boolean) => {
		const list = isMaster ? gridRef.current.getCheckedRowItemsAll() : gridRef1.current.getCheckedRowItemsAll();
		if (list.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const params = {
				fixdccode: form.getFieldValue('fixdccode'),
				avc_COMMAND: 'CREATION_DELIVERYFORM',
				isMaster,
				invoicePrintKey: dayjs().format('YYYYMMDDHHmmss'),
				saveList: gridRef.current.getCheckedRowItemsAll(),
				saveDetailList: gridRef1.current.getCheckedRowItemsAll(),
			};
			const requestParams = form.getFieldsValue();
			requestParams.invoicedt = requestParams.invoicedt.format('YYYYMMDD');

			const res = await apiPostPrintMasterList({ ...params, ...requestParams });
			if (res.statusCode > -1) {
				const dataSet = {
					ds_reportHeader: res.data.masterList, // 헤더 정보
					ds_reportDetail: res.data.detailList, // 상세 정보
				};

				// 3. 리포트에 전송할 파라미터
				const params: any = {};
				params.INVOICE_TITLE = '반품납품서 (공급받는자용)';

				reportUtil.openAgentReportViewer('RO_Invoice_NoAppr.mrd', dataSet, params);
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
			<SearchForm {...formProps}>
				<RoInvoiceSearch {...formProps} />
			</SearchForm>

			<RoInvoiceDetail
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridDataDetail={gridDataDetail}
				totalCount={totalCount}
				searchDetailList={searchDetailList}
				printMasterList={printMasterList}
			/>
		</>
	);
};

export default RoInvoice;
