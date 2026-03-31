/*
 ############################################################################
 # FiledataField	: batchMng.tsx
 # Description		: 배치 > 배치관리 > 배치 등록/수정
 # Author			: yewon.kim
 # Since			: 25.07.04
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';

import BatchMngSearch from '@/components/batch/batchMng/BatchMngSearch';
import BatchMngList from '@/components/batch/batchMng/BatchMngList';

// API Call Function
import { apiGetBatchMngList } from '@/api/batch/apiBatchMng';
import { SearchFormResponsive } from '@/components/common/custom/form';
import { showConfirm } from '@/util/MessageUtil';

// hooks

const BatchMng = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const refs: any = useRef(null);
	const [totalCnt, setTotalCnt] = useState(0);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
		jobInterval: null,
		jobGubun: null,
		useYn: null,
	});

	// grid data
	const [gridData, setGridData] = useState([]);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회버튼
	 * @returns {void}
	 */
	const searchMngList = () => {
		if (gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t("msg.MSG_COM_CFM_009"), () => {
				searchMngListRun();
				}
			);
		} else {
			searchMngListRun();
		}
	};

	/**
	 * API 조회
	 * @returns {void}
	 */
	const searchMngListRun = () => {
		gridRef.current.clearGridData();

		const params = form.getFieldsValue();
		apiGetBatchMngList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length)
		});
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMngList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<BatchMngSearch ref={refs} search={searchMngList} form={form}/>
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<BatchMngList gridRef={gridRef} gridData={gridData} totalCnt={totalCnt} onSearch={searchMngList}/>
		</>
	);
};

export default BatchMng;
