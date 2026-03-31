/*
 ############################################################################
 # FiledataField	: BbsAdminMng.tsx
 # Description		: 공지사항
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
// utils
import { useAppSelector } from '@/store/core/coreHook';
import dataTransform from '@/util/dataTransform';
import dateUtils from '@/util/dateUtil';
// component
import DetailBbsAdminMng from '@/components/comfunc/func/bbsAdminMng/DetailBbsAdminMng';
import SearchBbsAdminMng from '@/components/comfunc/func/bbsAdminMng/SearchBbsAdminMng';
import CustomModal from '@/components/common/custom/CustomModal';
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import PopupBbsAdminMng from '@/components/popup/PopupBbsAdminMng';
// API Call Function
import { apiGetAdminCheck, apiGetBbsList } from '@/api/common/apiComfunc';

const BbsAdminMng = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// menu 정보 및 권한 필요시 사용
	// const { menu } = useLocation().state;

	// store
	const user = useAppSelector(state => state.user.userInfo); // 유저정보

	// form
	const [form] = Form.useForm();

	// Ref
	const gridRef = useRef(null);
	const refModal = useRef(null);

	// variable
	const today = dateUtils.getToDay('YYYY-MM-DD');
	const [searchBox] = useState({
		fromDt: dayjs(dateUtils.subtractYear(today, 1, 'YYYY-MM-DD')),
		thruDt: dayjs(today),
		bbsTpCd: '',
		searchType: '1',
		bbsTitleNote: '',
		bbsScpCd: '',
		viewYn: '',
	});
	const [resData, setResData] = useState([]);
	const [bbsSeq, setBbsSeq] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 신규 등록
	 */
	const onClickNewRegister = () => {
		setBbsSeq('');
		refModal.current.handlerOpen();
	};

	const onClickBbsDetail = () => {
		refModal.current.handlerOpen();
	};

	/**
	 * 조회
	 */
	const onClickSearchButton = () => {
		// 검색 조건
		const params = dataTransform.convertSearchData(form.getFieldsValue());

		apiGetBbsList(params).then(res => {
			setResData(res.data);
		});
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		searchYn: onClickSearchButton,
	};

	/**
	 * 모달 닫기
	 */
	const closeModal = () => {
		refModal.current.handlerClose();
		onClickSearchButton();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 어드민 여부
		/**
		 *
		 */
		async function isAdminUser() {
			const params = {
				userId: user.userNm || '',
			};
			await apiGetAdminCheck(params).then(res => {
				if (res.data) {
					setIsAdmin(res.data);
				}
			});
		}
		isAdminUser();
		// 검색
		onClickSearchButton();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" func={titleFunc} slotLocation="left">
				{isAdmin && <Button onClick={onClickNewRegister}>신규등록</Button>}
			</MenuTitle>
			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchBbsAdminMng search={onClickSearchButton} />
			</SearchForm>
			{/* 그리드 영역 */}
			<DetailBbsAdminMng
				ref={gridRef}
				data={resData}
				setBbsSeq={setBbsSeq}
				setOpen={onClickBbsDetail}
			></DetailBbsAdminMng>
			{/* 팝업 */}
			<CustomModal ref={refModal} width="1084px">
				<PopupBbsAdminMng isAdmin={isAdmin} bbsSeq={bbsSeq} close={closeModal} />
			</CustomModal>
		</>
	);
};

export default BbsAdminMng;
