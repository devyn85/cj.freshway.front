/*
 ############################################################################
 # FiledataField	: MsCenterDoc.tsx
 # Description		: 기준정보 > 센터기준정보 > 센터서류
 # Author			: jangjaehyun
 # Since			: 25.06.24
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsCenterDocDetail from '@/components/ms/centerDoc/MsCenterDocDetail';
import MsCenterDocSearch from '@/components/ms/centerDoc/MsCenterDocSearch';
import MsCenterDocUserPopup from '@/components/ms/popup/MsCenterDocUserPopup';

// API
import { apiGetMasterList } from '@/api/ms/apiMsCenterDoc';

const MsCenterDoc = () => {
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

	const CenterDocUserPopupModal = useRef(null);
	const CenterDocUserPopupRef = useRef(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		addDt: [dayjs(), dayjs()],
		multiDcCode: [gDccode],
		reqNo: null,
		custNm: null,
		custKey: null,
		regYn: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};
	/**
	 * 조회 실행
	 * @returns {void}
	 */
	const searchMasterListRun = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		params.fromDt = params.addDt[0].format('YYYYMMDD');
		params.toDt = params.addDt[1].format('YYYYMMDD');

		apiGetMasterList(params).then(res => {
			const data = res.data.map((row: any) => {
				let newRow = row;
				if (row.addWho && row.addWho.startsWith('2')) {
					newRow = { ...newRow, addWhoNm: '온리원푸드넷' };
				}
				if (row.editWho && row.editWho.startsWith('2')) {
					newRow = { ...newRow, editWhoNm: '온리원푸드넷' };
				}
				return newRow;
			});
			setGridData(data);
			setTotalCnt(data.length); // 전체 데이터 개수 설정
			// setGridData(res.data);
			// setTotalCnt(res.data.length); // 전체 데이터 개수 설정

			const colSizeList = gridRef.current.getFitColumnSizeList(true);

			colSizeList[6] = 140; // reqDoc 칼럼 사이즈 고정
			gridRef.current.setColumnSizeList(colSizeList);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
		setting: () => {
			handleOpenCenterDocUserPopup();
		},
	};

	// 로케이션일괄업로드 팝업 열기
	const handleOpenCenterDocUserPopup = () => {
		CenterDocUserPopupModal.current?.handlerOpen();
		// 팝업이 열린 후 약간의 지연을 두고 값 설정
		setTimeout(() => {
			const multiDcCode = form.getFieldValue('multiDcCode');
			if (multiDcCode && CenterDocUserPopupRef.current) {
				CenterDocUserPopupRef.current.setMultiDcCode(multiDcCode);
			}
		}, 300);
	};
	// 로케이션일괄업로드 팝업 닫기
	const handleCloseCenterDocUserPopup = () => {
		CenterDocUserPopupModal.current?.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<MsCenterDocSearch form={form} search={searchMasterList} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsCenterDocDetail ref={gridRef} data={gridData} totalCnt={totalCnt} callBackFn={searchMasterList} form={form} />

			<CustomModal ref={CenterDocUserPopupModal} width="1280px">
				<MsCenterDocUserPopup
					ref={CenterDocUserPopupRef}
					close={handleCloseCenterDocUserPopup}
					parentFormValues={form.getFieldsValue()}
				/>
			</CustomModal>
		</>
	);
};
export default MsCenterDoc;
