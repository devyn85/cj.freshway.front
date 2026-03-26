// Lib
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// Store

// API
import { apiGetMsExDcRateList } from '@/api/ms/apiMsExDcRate';
// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsExDcRateDetail from '@/components/ms/exDcRate/MsExDcRateDetail';
import MsExDcRateSearch from '@/components/ms/exDcRate/MsExDcRateSearch';
import { showConfirm } from '@/util/MessageUtil';

/**
 * =====================================================================
 *  01. 변수 선언부
 * =====================================================================
 */
const { TabPane } = Tabs;

const MsExDcRate = () => {
	//다국어
	const { t } = useTranslation();
	// antd Form instance
	const [searchForm] = Form.useForm();

	// 조회 데이터 상태
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// Ref
	const refs: any = useRef(null);

	// Redux 전역 상태

	const dcCode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색 초기값
	const [searchBox] = useState({
		date: [dayjs().subtract(1, 'year'), dayjs()],
		strDateType: 'start',
		delYn: null,
		storageType: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * @description : 요율관리 목록 조회
	 */
	const searchMaster = () => {
		if (dcCode !== '2170') {
			return false;
		}

		if (refs.gridRef.current.getChangedData().length > 0) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'),
				() => {
					searchApi();
				},
				() => {
					return false;
				},
			);
		} else {
			searchApi();
		}
	};

	const searchApi = () => {
		const fromKey = `${searchForm.getFieldValue('strDateType')}dateFrom`;
		const toKey = `${searchForm.getFieldValue('strDateType')}dateTo`;
		const params = searchForm.getFieldsValue();

		const searchData = {
			...params,
			[fromKey]: params.date[0].format('YYYYMMDD'),
			[toKey]: params.date[1].format('YYYYMMDD'),
		};

		apiGetMsExDcRateList(searchData).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	/**
	 * 상단 메뉴바 버튼 바인딩
	 */
	const titleFunc = {
		searchYn: searchMaster,
		// reset: resetFn,
	};

	/**
	 * =====================================================================
	 *  03. 렌더링
	 * =====================================================================
	 */
	return (
		<>
			{/* 상단 메뉴 및 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<MsExDcRateSearch searchMaster={searchMaster} form={searchForm} />
			</SearchFormResponsive>

			<MsExDcRateDetail ref={refs} totalCount={totalCnt} data={gridData} callBackFn={searchApi} user={dcCode} />
		</>
	);
};

export default MsExDcRate;
