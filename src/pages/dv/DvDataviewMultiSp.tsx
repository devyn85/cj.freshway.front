/*
 ############################################################################
 # FiledataField	: DvDataviewMultiSp.tsx
 # Description		: 출고 > 출고현황 > 일배입출차이현황
 # Author			: YangChangHwan
 # Since			: 25.06.13
 ############################################################################
*/
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DvDataviewMultiSpDetail from '@/components/dv/dataviewMultiSp/DvDataviewMultiSpDetail';
import DvDataviewMultiSpGrid1 from '@/components/dv/dataviewMultiSp/DvDataviewMultiSpGrid1';
import DvDataviewMultiSpSearch from '@/components/dv/dataviewMultiSp/DvDataviewMultiSpSearch';

// API
import { apiSearchDvDataviewMultiSpDetailList, apiSearchDvDataviewMultiSpList } from '@/api/dv/apiDvDataviewMultiSp';

// Utils
import Splitter from '@/components/common/Splitter';
import { useAppSelector } from '@/store/core/coreHook';
import { validateForm } from '@/util/FormUtil';
import dayjs, { Dayjs } from 'dayjs';

type SearchParams = {
	deliverydate: [Dayjs, Dayjs];
	dccode: string | null;
	putawaytype: string | null;
	diffqtyyn: string | null;
	fromSlipdt?: string;
	toSlipdt?: string;
	currPage?: number;
};

const DvDataviewMultiSp = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const grid1Ref = useRef<any>(null);

	// Antd Form 사용
	const [conditionForm] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState<[Dayjs, Dayjs]>(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState<any[]>([]);
	const [grid1Data, setGrid1Data] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [totalGrid1Count, setTotalGrid1Count] = useState(0);
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo<SearchParams>(
		() => ({
			deliverydate: dates,
			dccode: globalVariable.gDccode,
			putawaytype: null,
			diffqtyyn: null,
		}),
		[dates, globalVariable.gDccode],
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * API 호출
	 */
	const callApi = useCallback(async (apiFunc: any, params: any, callback?: any) => {
		const res = await apiFunc(params);
		return callback?.(res);
	}, []);

	/**
	 *
	 * @param sendParams
	 */
	const searchGrid1 = async (sendParams?: any) => {
		await callApi(apiSearchDvDataviewMultiSpDetailList, sendParams, resCallbackGrid1);
	};

	// 6. 응답 데이터 핸들러
	const resCallback = useCallback((res: any) => {
		const { data } = res;
		setGridData(data?.list || data || []);
		!data?.skipCount &&
			setTotalCount(data?.totalCount && data?.totalCount <= 0 ? 0 : data?.totalCount || data?.length || 0);

		return res;
	}, []);

	// API 호출 및 응답 처리
	const executeSearch = useCallback(
		async (sendParams?: SearchParams, currPage = currentPage) => {
			await callApi(apiSearchDvDataviewMultiSpList, { ...sendParams, currPage }, resCallback);
		},
		[currentPage, callApi, resCallback],
	);

	/**
	 *
	 */
	const resCallbackGrid1 = useCallback((res: any) => {
		const { data } = res;
		setGrid1Data(data?.list || data || []);
		!data?.skipCount &&
			setTotalGrid1Count(data?.totalCount && data?.totalCount <= 0 ? 0 : data?.totalCount || data?.length || 0);
		gridRef.current?.setFocus();
		return res;
	}, []);

	const handleSearch = useCallback(
		async (initFlag = false) => {
			const requestParams = reqParams();

			if (!requestParams) {
				return;
			}

			// 입력 값 검증
			const isValid = await validateForm(conditionForm);
			if (!isValid) {
				return;
			}

			const isValidDate = validateDeliveryDate(requestParams.deliverydate);
			if (!isValidDate) {
				return;
			}

			// 그리드 초기화
			if (initFlag) {
				gridRef.current?.clearGridData();
				grid1Ref.current?.clearGridData();
				setCurrentPage(1);
			}

			executeSearch(requestParams, initFlag ? 1 : currentPage);
		},
		[conditionForm, currentPage, executeSearch],
	);

	// 페이지 버튼 함수 바인딩
	const titleFunc = useMemo(
		() => ({
			searchYn: handleSearch.bind(null, true),
		}),
		[handleSearch],
	);

	const formProps = {
		form: conditionForm,
		initialValues: searchBox,
		dates,
		setDates,
		search: handleSearch.bind(null, true),
	};

	/**
	 * 요청 파라미터 생성
	 * @returns {object} 요청 파라미터
	 */
	function reqParams(): SearchParams | null {
		const params = conditionForm.getFieldsValue() as Partial<SearchParams>;

		if (commUtil.isNull(params.deliverydate)) {
			showAlert('', '출고일자를 선택해주세요.');
			return null;
		}

		if (
			!Array.isArray(params.deliverydate) ||
			commUtil.isNull(params.deliverydate[0]) ||
			commUtil.isNull(params.deliverydate[1])
		) {
			showAlert('', '출고일자를 선택해주세요.');
			return null;
		}

		return {
			deliverydate: params.deliverydate as [Dayjs, Dayjs],
			dccode: params.dccode ?? null,
			putawaytype: params.putawaytype ?? null,
			diffqtyyn: params.diffqtyyn ?? null,
			fromSlipdt: params.deliverydate[0].format('YYYYMMDD'),
			toSlipdt: params.deliverydate[1].format('YYYYMMDD'),
		};
	}

	const validateDeliveryDate = (deliveryDt: [Dayjs, Dayjs]) => {
		if (deliveryDt[0].isAfter(deliveryDt[1])) {
			showAlert(null, '배송일자 시작일자는 종료일자보다 이전일 수 없습니다.');
			return false;
		}

		if (deliveryDt[1].diff(deliveryDt[0], 'day') > 31) {
			showAlert(null, '최대 31일 이상 조회 할 수 없습니다.');
			return false;
		}

		return true;
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		grid1Ref?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchForm {...formProps}>
				<DvDataviewMultiSpSearch {...formProps} />
			</SearchForm>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<DvDataviewMultiSpDetail
						key="DvDataviewMultiSpDetail"
						ref={gridRef}
						data={gridData}
						setCurrentPage={setCurrentPage}
						searchGrid1={searchGrid1}
						totalCount={totalCount}
					/>,
					<DvDataviewMultiSpGrid1
						key="DvDataviewMultiSpGrid1"
						ref={grid1Ref}
						data={grid1Data}
						totalCount={totalGrid1Count}
						callApi={callApi}
					/>,
				]}
			/>
		</>
	);
};

export default DvDataviewMultiSp;
