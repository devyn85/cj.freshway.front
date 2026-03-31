/*
 ############################################################################
 # FiledataField	: DvPackingScarceStock.tsx
 # Description		: 출고 > 출고현황 > 부족분리스트(RDC검증)
 # Author			: YangChangHwan
 # Since			: 25.06.10
 ############################################################################
*/
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DvPackingScarceStockDetail from '@/components/dv/packingScarceStock/DvPackingScarceStockDetail';
import DvPackingScarceStockSearch from '@/components/dv/packingScarceStock/DvPackingScarceStockSearch';

// API
import { apiSearchDvPackingScarceStockList } from '@/api/dv/apiDvPackingScarceStock';

// Hooks

// Utils
import dataTransform from '@/util/dataTransform';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const DvPackingScarceStock = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const sendParamsKeys = ['slipdt', 'sku', 'docno'];

	let requestParams: any = {};

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [conditionForm] = Form.useForm();

	// condifion data state
	const [slipdt, setSlipdt] = useState(dayjs());

	// grid data
	const [gridData, setGridData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			slipdt: dayjs(),
			stockyn: true,
			allocatedyn: true,
		}),
		[],
	);

	const refModal = useRef(null);

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

	// API 호출 및 응답 처리
	const executeSearch = useCallback(
		async (sendParams?: any, currPage = currentPage) => {
			const reqParams = {
				...sendParams,
				currPage,
			};

			await apiSearchDvPackingScarceStockList(reqParams).then(resCallback);
		},
		// [],
		[currentPage, conditionForm, searchBox],
	);

	// 6. 응답 데이터 핸들러
	const resCallback = useCallback((res: any) => {
		const { data } = res;
		setGridData(data?.list || data || []);
		!data?.skipCount &&
			setTotalCount(data?.totalCount && data?.totalCount <= 0 ? 0 : data?.totalCount || data?.length || 0);
	}, []);

	const handleSearch = useCallback(
		async (initFlag = false) => {
			requestParams = reqParams();

			// 입력 값 검증
			const isValid = await validateForm(conditionForm);
			if (!isValid) {
				return;
			}
			const { allocatedyn, openyn, pickedyn, realityyn, sku, slipdt, stockyn, storagetype, fixdccode } = requestParams;

			const filteredparams = {
				slipdt: dayjs(slipdt).format('YYYYMMDD'),
				allocatedyn: allocatedyn ? 1 : 0,
				openyn: openyn ? 1 : 0,
				pickedyn: pickedyn ? 1 : 0,
				realityyn: realityyn ? 1 : 0,
				stockyn: stockyn ? 1 : 0,
				sku,
				storagetype,
				fixdccode,
			};

			// 그리드 초기화
			if (initFlag) {
				gridRef.current?.clearGridData();
				setCurrentPage(1);
			}

			executeSearch(filteredparams);
		},
		[executeSearch],
	);

	// 페이지 버튼 함수 바인딩
	const titleFunc = useMemo(
		() => ({
			searchYn: handleSearch.bind(null, true),
			reset: () => {
				conditionForm.resetFields();
			},
		}),
		[handleSearch],
	);

	const formProps = {
		form: conditionForm,
		initialValues: searchBox,
		// onValuesChange: () => {
		// 	// //console.log('변경된 값:', conditionForm.getFieldsValue());
		// }, // 필요시 로직 추가
		slipdt,
		setSlipdt,
	};

	/**
	 * 요청 파라미터 생성
	 * @returns {object} 요청 파라미터
	 */
	function reqParams() {
		const searchParam = dataTransform.convertSearchData(conditionForm.getFieldsValue());

		return searchParam;
	}

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
			<SearchForm {...formProps}>
				<DvPackingScarceStockSearch {...formProps} />
			</SearchForm>
			<DvPackingScarceStockDetail
				form={conditionForm}
				ref={gridRef}
				data={gridData}
				refModal={refModal}
				setCurrentPage={setCurrentPage}
				totalCount={totalCount}
			/>
		</>
	);
};

export default DvPackingScarceStock;
