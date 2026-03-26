/*
 ############################################################################
 # FiledataField	: DpSkuLabelInspect.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력(검수)
 # Author			: YangChangHwan
 # Since			: 25.06.24
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchForm, SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
import { apiSearchDpSkuLabelInspectGrid1List, apiSearchDpSkuLabelInspectList } from '@/api/dp/apiDpSkuLabelInspect';

// Hooks
// Utils
import DpSkuLabelInspectDetail from '@/components/dp/skuLabelInspect/DpSkuLabelInspectDetail';
import DpSkuLabelInspectSearch from '@/components/dp/skuLabelInspect/DpSkuLabelInspectSearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';
import { apiPostMasterList } from '@/api/dp/apiDpUnload';

// Store

const DpSkuLabelInspect = () => {
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
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 *
	 * @param sendParams
	 */
	const searchDetailList = async (rowData: any) => {
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		delete requestParams.slipdt;
		if (requestParams.unloadtime) {
			const [unloadtimeFrom, unloadtimeTo] = requestParams.unloadtime;
			requestParams.unloadtimeFrom = unloadtimeFrom.format('HHmm');
			requestParams.unloadtimeTo = unloadtimeTo.format('HHmm');
		}
		//joinfg 조건
		requestParams.joinfg = requestParams.tempoptiyn == 'Y' || requestParams.unloadtime ? 'Y' : 'N';

		const { data } = await apiSearchDpSkuLabelInspectGrid1List({ ...requestParams, ...rowData });
		setGridDataDetail(data || []);
	};

	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		gridRef.current.clearGridData();
		gridRef1.current.clearGridData();

		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		delete requestParams.slipdt;
		if (requestParams.unloadtime) {
			const [unloadtimeFrom, unloadtimeTo] = requestParams.unloadtime;
			requestParams.unloadtimeFrom = unloadtimeFrom.format('HHmm');
			requestParams.unloadtimeTo = unloadtimeTo.format('HHmm');
		}
		//joinfg 조건
		requestParams.joinfg = requestParams.tempoptiyn == 'Y' || requestParams.unloadtime ? 'Y' : 'N';

		const { data } = await apiSearchDpSkuLabelInspectList(requestParams);
		setGridData(data || []);
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

	// 인쇄
	const printDetailList = () => {
		// 1. 체크된 데이터
		const list = gridRef1.current.getCheckedRowItemsAll();

		// 2. 체크된 데이터 확인
		if (list.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 3. 체크된 데이터를 담는다.
		// 인쇄 를/을 처리하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
			// CJFWDP3	입고라벨(소)
			const labelData = list
				.filter((row: any) => Number(row.printedqty) > 0) // 0보다 큰 것만
				.flatMap((row: any) => {
					const printedQty = Number(row.printedqty);
					const strLottable01 =
						row.lottable01 && row.lottable01 !== 'STD'
							? `${row.lottable01?.substring(0, 4)}-${row.lottable01?.substring(4, 6)}-${row.lottable01?.substring(
									6,
									8,
							  )}`
							: 'STD';
					const barcode = `B${row.lblSku}-${row.lottable01}B`;

					// printedQty 갯수만큼 동일한 row를 복제
					return Array(printedQty)
						.fill(null)
						.map(() => ({
							custkey: row.lblCustkey, // 01. 거래처코드
							slipdt: row.lblSlipdt, // 02. 전표일자
							custname: row.lblCustname, // 03. 거래처명
							sku: row.lblSku, // 04. 상품코드
							qtyperbox: row.lblQtyperbox, // 05. 입수량
							placeoforigin: row.lblPlaceoforigin, // 06. 원산지
							skuname1: row.lblSkuname1, // 07. 상품명1
							skuname2: row.lblSkuname2, // 08. 상품명2
							title: row.lblTitle, // 09. 상단타이틀
							lottable01: strLottable01, // 10. 소비기한
							barcode: barcode, // 11. 바코드
						}));
				});

			if (labelData.length === 0) {
				showAlert(null, t('msg.noPrintData')); // 인쇄할 데이터가 없습니다.
				return;
			}

			// 4. 라벨 파일명
			const fileName: string[] = ['DP_Label_CJFWDP1.mrd'];

			// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
			const dataSet = [labelData];

			// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId: string[] = ['CJFWDP3'];

			// 7. 라벨 출력 (바로인쇄 or 미리보기)
			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		//
	}, []);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive {...formProps}>
				<DpSkuLabelInspectSearch {...formProps} />
			</SearchFormResponsive>

			<DpSkuLabelInspectDetail
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridDataDetail={gridDataDetail}
				searchDetailList={searchDetailList}
				printDetailList={printDetailList}
			/>
		</>
	);
};

export default DpSkuLabelInspect;
