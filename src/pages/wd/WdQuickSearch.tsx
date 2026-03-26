/*
 ############################################################################
 # FiledataField	: QuickSearch.tsx
 # Description		: 출고 > 출고작업 > 퀵배송조회
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api
import { apiPostMasterList } from '@/api/wd/apiWdQuickSearch';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import WdQuickSearchDetail from '@/components/wd/quickSearch/WdQuickSearchDetail';
import WdQuickSearchSearch from '@/components/wd/quickSearch/WdQuickSearchSearch';
import dateUtil from '@/util/dateUtil';

// lib
const WdQuickSearch = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const today = dateUtil.getToDay('YYYY-MM-DD');
	const storerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);
	const [formRef] = Form.useForm();
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPage, setTotalPage] = useState(0);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: null,
		sku: null,
		skuName: null,
		stocktype: null,
		storagetype: null,
	}); // 검색영역

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	조회
	 */
	const searchMasterList = () => {
		// 그리드/상태 초기화
		refs.gridRef?.current?.clearGridData?.();
		setGridData([]);
		setTotalCnt(0);
		setCurrentPage(0);
		setTotalPage(0);

		const params = {
			...form.getFieldsValue(),
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYY-MM-DD'),
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYY-MM-DD'),
			currentPage: 1,
			limit: 1000,
		};

		// 전체 데이터를 누적할 배열
		const allData: any[] = [];
		searchMasterListImp(params, allData);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 * @param {Array} allData - 전체 데이터 누적 배열
	 */
	const searchMasterListImp = (params: any, allData: any[]) => {
		apiPostMasterList(params).then(res => {
			const resultList = res.data.resultList || [];
			// 페이지 정보
			const totalCount = res.data.totalCount;
			const totalPage = res.data.totalPage;
			const currentPage = res.data.currentPage;

			if (!resultList.length && currentPage === 1) {
				showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
				return;
			}

			setTotalPage(totalPage);
			setCurrentPage(currentPage);

			// 전체 데이터에 누적
			allData.push(...resultList);

			// 남은 페이지 있으면 다음 페이지 요청
			if (currentPage < totalPage) {
				searchMasterListImp({ ...params, currentPage: (currentPage ?? 1) + 1 }, allData);
			} else {
				// 최종 페이지 조회 완료 후 필터링
				const status = form.getFieldValue('status');
				const quickDocno = form.getFieldValue('quickDocno');

				let filteredData = [...allData];

				// status 필터
				if (status && status !== '') {
					filteredData = filteredData.filter(item => item.orderState?.toLowerCase().includes(status));
				}

				// quickDocno 필터
				if (quickDocno && quickDocno.trim() !== '') {
					filteredData = filteredData.filter(item =>
						item.serialNumber?.toLowerCase().includes(quickDocno.toLowerCase()),
					);
				}

				// 필터링된 데이터를 그리드에 표시
				setGridData(filteredData);
				setTotalCnt(filteredData.length);
			}
		});
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdQuickSearchSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdQuickSearchDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				formRef={formRef}
				search={searchMasterList}
			/>
		</>
	);
};

export default WdQuickSearch;
