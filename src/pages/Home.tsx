/*
 ############################################################################
 # FiledataField	: Home.tsx
 # Description		: Home
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */
// LIB
import { Carousel } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Store & API
import { apiPostSaveNoticeRead } from '@/api/cm/apiCmMain';
import { apiGetNoticePopList } from '@/api/cm/apiCmPublic';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { setNoticeCnt } from '@/store/core/menuStore';

// Components
import NewMaster from '@/components/cm/home/NewMaster';
import WdMaster from '@/components/cm/home/WdMaster';
import CmNoticePopup from '@/components/cm/popup/CmNoticePopup';
import CustomModal from '@/components/common/custom/CustomModal';

const Home = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const location = useLocation();
	const dispatch = useAppDispatch(); // store 에 요청 전송
	const initialized = useAppSelector(state => state.menu.initialized); // fetchInitApi 초기값 설정 완료 여부
	const noticeCnt = useAppSelector(state => state.menu.noticeCnt); // 알림 개수

	const [activeIndex, setActiveIndex] = useState(0);
	const [popYnList, setPopYnList] = useState([]); // 팝업형 공지사항 목록
	const refNoticeModal = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 슬라이드 변경 감지
	 * @param {number} current 현재 active 된 index
	 */
	const handleChange = (current: number) => {
		setActiveIndex(current);

		// 그리드 사이즈 맞추기 위해 호출
		window.dispatchEvent(new Event('resize'));
	};

	/**
	 * 오늘 날짜 가져오기
	 * @returns {string} 날자값
	 */
	const getToday = () => {
		const today = new Date();
		return today.toISOString().slice(0, 10); // yyyy-mm-dd
	};

	/**
	 * 공지사항 팝업 목록 조회
	 */
	const getNoticePop = () => {
		const hideDate = localStorage.getItem('noticeHideDate');
		const today = getToday();

		apiGetNoticePopList(null).then(res => {
			if (res.statusCode === 0) {
				const resultData = res?.data;

				// POP 알림 노출
				if (!refNoticeModal.current.getIsOpen() && resultData?.length > 0) {
					// 알림 읽음 처리
					const filterData = resultData.filter((data: any) => data.readYn === 'N');
					if (filterData?.length > 0) {
						apiPostSaveNoticeRead({ brdnum: filterData.map((v: any) => v.brdnum).join(',') }).then(() => {
							// 읽음 처리된 목록 알림 개수에서 빼기
							dispatch(setNoticeCnt(noticeCnt - filterData?.length));
						});
					}

					// 읽지 않은 공지사항 팝업 있으면 노출
					// "오늘 하루 그만보기" 체크
					if (filterData?.length > 0 || hideDate !== today) {
						// 공지사항 팝업 노출
						setPopYnList(resultData);
						refNoticeModal.current.handlerOpen();
					}
				}
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setTimeout(() => {
			handleChange(0);
		}, 200);

		if (initialized) {
			getNoticePop();
		}
	}, [location, initialized]);

	return (
		<>
			<div className="contain-wrap main-section">
				<Carousel arrows={true} dots={true} infinite={false} afterChange={handleChange} speed={500}>
					<div className="inner">
						<h1>센터별 출고물동량(저장/일배 구분) 및 출고라벨건수</h1>
						{/* 활성화된 슬라이드에만 리사이즈 이벤트를 강하게 전달하기 위해 isActive 전달 */}
						<WdMaster isActive={activeIndex === 0} />
					</div>
					<div className="inner">
						<h1>신규 마스터 인입현황</h1>
						{/* 활성화된 슬라이드에만 리사이즈 이벤트를 강하게 전달하기 위해 isActive 전달 */}
						<NewMaster isActive={activeIndex === 1} />
					</div>
				</Carousel>
			</div>
			{/* 공지사항 팝업 */}
			<CustomModal ref={refNoticeModal} width="720px">
				<CmNoticePopup
					data={popYnList}
					close={() => {
						refNoticeModal.current.handlerClose();
					}}
				/>
			</CustomModal>
		</>
	);
};

export default Home;
