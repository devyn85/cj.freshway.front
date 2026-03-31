/*
 ############################################################################
 # FiledataField	: Paging.tsx
 # Description		: 페이징
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { Form, Row, Flex, Col, Select } from 'antd';
import dayjs from 'dayjs';
//Utils
import dataTransform from '@/util/dataTransform';
import dateUtils from '@/util/dateUtil';
//Components
import ButtonPaging from '@/components/comfunc/func/paging/ButtonPaging';
import ScrollPaging from '@/components/comfunc/func/paging/ScrollPaging';
import { DateRange, SearchForm, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//API Call Function
import { apiGetPagingScrollList } from '@/api/common/apiComfunc';

import { useThrottle } from '@/hooks/useThrottle';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

const Paging = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const { menu } = useLocation().state;
	//다국어
	const { t } = useTranslation();
	const [form] = Form.useForm();

	const today = dateUtils.getToDay('YYYY-MM-DD');
	const [searchBox] = useState({
		fromDt: dayjs(dateUtils.subtractYear(today, 1, 'YYYY-MM-DD')),
		thruDt: dayjs(today),
		startRow: '0',
		listCount: '10',
		userId: '',
	});

	const throttle = useThrottle();

	// 컴포넌트 접근을 위한 Ref
	const scrGridRef = useRef(null);

	// button Paging
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(10);
	const [totalPage, setTotalPage] = useState(1);

	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(15);

	const [btnGridData, setBtnGridData] = useState([]);
	const [scrGridData, setScrGridData] = useState([]);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const searchBtn = () => {
		// gridRef1.current.clearGridData();
		// if (!searchBoxRef?.current?.checkRequired()) return;

		// const searchParam = searchBoxRef?.current?.getSearchBoxParam();
		const searchParam = dataTransform.convertSearchData(form.getFieldsValue());
		const params = {
			...searchParam,
			startRow: 0 + (currentPage - 1) * pageSize,
			listCount: pageSize,
		};
		apiGetPagingScrollList(params).then(res => {
			setTotalPage(res.data.totalCount);
			setBtnGridData(res.data.list);
		});
	};

	const searchScroll = throttle(() => {
		// if (!searchBoxRef?.current?.checkRequired()) return;

		// const searchParam = searchBoxRef?.current?.getSearchBoxParam();
		const searchParam = dataTransform.convertSearchData(form.getFieldsValue());
		const tt = currentPageScr - 1;
		const params = {
			...searchParam,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
		};

		apiGetPagingScrollList(params).then(res => {
			setScrGridData(res.data.list);
		});
	}, 500);

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		searchBtn();
	}, [currentPage]);

	useEffect(() => {
		searchScroll();
	}, [currentPageScr]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle />

			{/* 조회 컴포넌트 */}
			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox}>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-1">
						<li>
							<DateRange
								label={t('comfunc.bbs.search.daterange')}
								span={24}
								format="YYYY-MM-DD"
								fromName="fromDt"
								toName="thruDt"
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			{/* 그리드 영역 */}
			{/* 버튼 페이징 */}
			<ButtonPaging
				search={searchBtn}
				setCurrentPage={setCurrentPage}
				totalPage={totalPage}
				pageSize={pageSize}
				data={btnGridData}
			/>

			{/* 스크롤 페이징 */}
			<ScrollPaging ref={scrGridRef} search={searchScroll} data={scrGridData} setCurrentPage={setCurrentPageScr} />
		</>
	);
};
9;

export default Paging;
