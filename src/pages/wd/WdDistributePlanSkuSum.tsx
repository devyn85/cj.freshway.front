/*
 ############################################################################
 # FiledataField	: WdDistributePlanSkuSum.tsx
 # Description		: 출고 > 출고현황 > 미출예정확인(상품별합계)
 # Author			: YangChangHwan
 # Since			: 25.05.20
 ############################################################################
*/
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdDistributePlanSkuSumDetail from '@/components/wd/distributePlanSkuSum/WdDistributePlanSkuSumDetail';
import WdDistributePlanSkuSumSearch from '@/components/wd/distributePlanSkuSum/WdDistributePlanSkuSumSearch';

// API
import { apiSearchWdDistributePlanSkuSumList } from '@/api/wd/apiWdDistributePlanSkuSum';

// Utils
import commUtil from '@/util/commUtil';
import dataTransform from '@/util/dataTransform';
import { showAlert } from '@/util/MessageUtil';

// Store

const WdDistributePlanSkuSum = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const createInitialData = () =>
		({
			gArea: null,
			gAuthId: '',
			gAuthority: '00',
			gComCd: 'E10',
			gDccode: '2600',
			gEmpNo: '830911',
			gLang: 'ko',
			gMultiArea: null,
			gMultiCourier: null,
			gMultiDccode: '2600',
			gMultiOrganize: '2600',
			gMultiStorerkey: 'FW00',
			gOrganize: null,
			gSpid: '1175063060',
			gStartSysCl: 'LOGISONE',
			gStorerkey: 'FW00',
			gUserGrpCd: '01',
			gUserGrpNm: null,
			gUserId: 'hyeyeon822',
			gUserNm: '김혜연님',
			gUserNo: '1000011771',
		} as any);

	const createSearchParams = (searchBox: any, form: any, pageParams?: any) => {
		const formData = dataTransform.convertSearchData(form.getFieldsValue());
		const deliverydate = form.getFieldValue('slipdt')?.format('YYYYMMDD');

		return {
			...searchBox,
			...formData,
			...pageParams,
			slipdt: deliverydate,
			deliverydate,
		};
	};

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [conditionForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// const PAGE_SIZE = 100;
	// 검색영역 초기 세팅
	const searchBox = useMemo(createInitialData, []);

	const refModal = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	// API 호출 및 응답 처리
	const executeSearch = useCallback(
		async (page = currentPage) => {
			const pageParams = {};
			const params = createSearchParams(searchBox, conditionForm, pageParams);
			const response = await apiSearchWdDistributePlanSkuSumList(params);

			setGridData(response.data || []);
			response.data.length > 0 && setTotalCount(response.data.length || 0);
		},
		[currentPage, conditionForm, searchBox],
	);

	/**
	 * API 호출
	 */
	const callApi = useCallback(async (apiFunc: any, params: any, callback?: any) => {
		const res = await apiFunc(params);
		return callback?.(res);
	}, []);

	// 검색 초기화
	const handleSearch = useCallback(async () => {
		// //rules에 지정된 validation 기준으로 검증
		// const isValid = await validateForm(conditionForm);

		if (commUtil.isNull(conditionForm.getFieldValue('slipdt'))) {
			showAlert(null, '출고전표일자는 필수 입력입니다.'); // 항목은 필수값입니다.
			// showAlert(null, `'${t('lbl.DOCDT_WD')}'은(는) 필수 입력입니다.`); // 항목은 필수값입니다.
			return;
		}

		// 그리드 초기화
		gridRef.current?.clearGridData();

		// setCurrentPage(1);
		executeSearch();
	}, [executeSearch]);

	// 페이지 버튼 함수 바인딩
	const titleFunc = useMemo(() => ({ searchYn: handleSearch }), [handleSearch]);
	const formProps = useMemo(
		() => ({
			form: conditionForm,
			initialValues: searchBox,
			// onValuesChange: () => {}, // 필요시 로직 추가
		}),
		[conditionForm, searchBox],
	);

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchForm {...formProps}>
				<WdDistributePlanSkuSumSearch {...formProps} />
			</SearchForm>
			<WdDistributePlanSkuSumDetail
				ref={gridRef}
				data={gridData}
				refModal={refModal}
				setCurrentPage={setCurrentPage}
				totalCount={totalCount}
			/>
		</>
	);
};

export default WdDistributePlanSkuSum;
