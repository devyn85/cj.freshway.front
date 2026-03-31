/*
 ############################################################################
 # FiledataField	: DvDataviewSingleSp.tsx
 # Description		: 재고 > 재고현황 > 자동창고처리현황
 # Author			: YangChangHwan
 # Since			: 25.06.09
 ############################################################################
*/
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';
import _ from 'lodash';

// Component
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DvDataviewSingleSpDetail from '@/components/dv/dvDataviewSingleSp/DvDataviewSingleSpDetail';
import DvDataviewSingleSpSearch from '@/components/dv/dvDataviewSingleSp/DvDataviewSingleSpSearch';

// API
import { apiSearchDvDataviewSingleSpList } from '@/api/dv/apiDvDataviewSingleSp';

// Hooks

// Utils
import commUtil from '@/util/commUtil';
import dataTransform from '@/util/dataTransform';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store

const DvDataviewSingleSp = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const sendParamsKeys = ['ifDate', 'sku', 'docno'];

	let requestParams = {};

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [conditionForm] = Form.useForm();

	// condifion data state
	const [ifDate, setIfDate] = useState(dayjs());

	// grid data
	const [gridData, setGridData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			ifDate: dayjs(),
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
			await apiSearchDvDataviewSingleSpList({ ...sendParams, currPage }).then(resCallback);
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

	/**
	 * @description 요청 파라미터 유효성 검사
	 * @param params
	 * @returns {object} 요청 파라미터
	 */
	function validateCondition(params: any) {
		if (!validateTandDt(params)) return false;
		return true;
	}

	const handleSearch = useCallback(
		(initFlag = false) => {
			requestParams = reqParams();

			if (!validateCondition(requestParams)) {
				return;
			}

			// 그리드 초기화
			if (initFlag) {
				gridRef.current?.clearGridData();
				setCurrentPage(1);
			}

			executeSearch(requestParams);
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
		ifDate,
		setIfDate,
	};

	/**
	 * 요청 파라미터 생성
	 * @returns {object} 요청 파라미터
	 */
	function reqParams() {
		const searchParam = dataTransform.convertSearchData(conditionForm.getFieldsValue());

		return _.pick(searchParam, sendParamsKeys);
	}

	/**
	 *
	 * @param params
	 * @returns
	 */
	function validateTandDt(params: any) {
		if (commUtil.isNull(params.ifDate)) {
			showAlert(null, '전송시간는 필수 입력입니다.');
			return false;
		}
		return true;
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
				<DvDataviewSingleSpSearch {...formProps} />
			</SearchForm>
			<DvDataviewSingleSpDetail
				ref={gridRef}
				data={gridData}
				refModal={refModal}
				setCurrentPage={setCurrentPage}
				totalCount={totalCount}
			/>
		</>
	);
};

export default DvDataviewSingleSp;
