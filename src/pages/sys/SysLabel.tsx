/*
 ############################################################################
 # FiledataField	: SysLabel.tsx
 # Description		: Admin > 시스템운영 > 라벨
 # Author			: JiSooKim
 # Since			: 25.08.21
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import SysLabelDetail from '@/components/sys/label/SysLabelDetail';
import SysLabelSearch from '@/components/sys/label/SysLabelSearch';

// API
import { apiGetMasterList } from '@/api/sys/apiSysLabel';

// Store
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

const SysLabel = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [currentPageScr, setCurrentPageScr] = useState(1); // 스크롤 페이징 현재 페이지

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @param {number} pageScr 현재 페이지
	 * @returns {void}
	 */
	const searchLabel = (pageScr?: number) => {
		if (typeof pageScr !== 'number') pageScr = 1;

		if (gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchLabelRun(pageScr);
			});
		} else {
			searchLabelRun(pageScr);
		}
	};

	/**
	 * 조회 실행
	 * @param {number} pageScr 현재 페이지
	 * @returns {void}
	 */
	const searchLabelRun = (pageScr?: number) => {
		// gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		params.startRow = ((pageScr ?? currentPageScr) - 1) * 100;
		params.listCount = 100;

		apiGetMasterList(params).then(res => {
			if (pageScr === 1) {
				gridRef.current.setGridData(res.data.list);
			} else {
				gridRef.current.appendData(res.data.list);
			}

			if (res.data.totalCount > 0) {
				setTotalCnt(res.data.totalCount); // 전체 데이터 개수 설정
			} else if (res.data.list.length < 1) {
				setTotalCnt(0);
			}

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			// const colSizeList = gridRef.current.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			// gridRef.current.setColumnSizeList(colSizeList);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: () => {
			gridRef.current.clearGridData();
			setCurrentPageScr(1);
			searchLabel(1);
		}, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPageScr((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: totalCnt,
	});

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		if (currentPageScr > 1) {
			searchLabel(currentPageScr); // 스크롤 시 데이터 추가 (페이지 리셋 안함)
		}
	}, [currentPageScr]);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form}>
				<SysLabelSearch form={form} search={searchLabel} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<SysLabelDetail ref={gridRef} data={gridData} totalCnt={totalCnt} callBackFn={searchLabel} form={form} />
		</>
	);
};
export default SysLabel;
