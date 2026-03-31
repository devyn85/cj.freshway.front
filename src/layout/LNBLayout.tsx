import ErrorBoundary from '@/components/common/ErrorBoundary';
import ErrorScreen from '@/components/common/ErrorScreen';
import React from 'react';

import Footer from '@/layout/Footer/Footer';
import MainAside from '@/layout/LNB/MainAside';
import MainHeader from '@/layout/LNB/MainHeader';

import { apiGetLatestLogin } from '@/api/common/apiCommon';
import MainTabs from '@/layout/Tab/MainTabs';
import { showAlert } from '@/util/MessageUtil';

import CustomTooltip from '@/components/common/custom/CustomTooltip';
import { useKeydown } from '@/hooks/useKeydown';
import { useKeydownAUIGrid } from '@/hooks/useKeydownAUIGrid';
import { usePageLayoutVisible } from '@/hooks/usePageLayoutVisible';
import { useAppDispatch } from '@/store/core/coreHook';
import { toggleSidebarVisible } from '@/store/core/layoutStore';
import { Button } from 'antd';

const LNBLayout = (props: any) => {
	const { children } = props;

	const dispatch = useAppDispatch();
	const { layout } = usePageLayoutVisible();
	const isSidebarVisible = layout.isSidebarVisible;

	useEffect(() => {
		// getAccessInfo();
	}, []);

	/**
	 * 최근 접속 정보
	 */
	function getAccessInfo() {
		const isShowAccessInfo = localStorage.getItem('isShowAccessInfo') || 'Y';

		if (isShowAccessInfo != 'Y') return;
		const params = {};
		apiGetLatestLogin(params).then(res => {
			setMessage(res.data);
		});
	}

	/**
	 * 최근 로그인 메세지 설정
	 * @param {Array} data 최근 로그인 데이터 목록
	 * @returns {void}
	 */
	function setMessage(data: any) {
		let ipAddr = null;
		let logDtm = null;
		if (data.length > 0) {
			ipAddr = data[0]?.ipAddr;
			logDtm = data[0]?.logDtm;
		}
		const messaging = '최근 로그인 : ' + logDtm + '\n' + '(' + ipAddr + ')';

		showAlert('Information', messaging, () => {
			localStorage.setItem('isShowAccessInfo', 'N');
		});
	}

	const onClickAsideToggle = () => {
		dispatch(toggleSidebarVisible());
		window.dispatchEvent(new Event('resize'));
	};

	useKeydown({ key: 'F9' }, () => {
		onClickAsideToggle();
	});

	useKeydownAUIGrid({ key: 'F9' }, () => {
		onClickAsideToggle();
	});

	return (
		<ErrorBoundary fallback={<ErrorScreen />}>
			<main className="main-wrapper">
				<MainHeader />
				<MainTabs />
				{isSidebarVisible && <MainAside />}
				<div className="content">
					<CustomTooltip placement="bottomLeft" title={isSidebarVisible ? '메뉴닫기' : '메뉴열기'}>
						<Button className={`btn-aside-toggle`} aria-label="메뉴닫기" onClick={onClickAsideToggle} />
					</CustomTooltip>
					{/* <Icon icon="icon-aside-toggle-16" /> */}
					{/* </Button> */}
					{/* Route 화면 */}
					{children}
				</div>
				<Footer />
			</main>
		</ErrorBoundary>
	);
};

export default React.memo(LNBLayout);
