import { TmReturnOrderDto, TmUnassignedOrderDto, TmVehiclesDto } from '@/api/tm/apiTmDispatch';
import { showAlert } from '@/util/MessageUtil';
import { Modal } from 'antd';
import { useCallback, useState } from 'react';

// 결과 탭 스냅샷 데이터 타입
export interface ResultTabSnapshot {
	unassignedOrders: TmUnassignedOrderDto[];
	returnOrders: TmReturnOrderDto[];
	vehicles: TmVehiclesDto[];
}

// 결과 탭 데이터 타입
export interface ResultTabData {
	key: string;
	label: string;
	snapshot: ResultTabSnapshot;
}

interface UseResultTabsOptions {
	maxTabs?: number; // 최대 탭 개수 (기본값: 5)
	onTabChange?: (snapshot: ResultTabSnapshot) => void; // 탭 전환 시 콜백
	shouldConfirm?: () => boolean; // 탭 전환 시 확인창 표시 여부 (true면 확인창 표시)
}

interface UseResultTabsReturn {
	tabs: ResultTabData[];
	activeTabKey: string;
	tabCounter: number;
	createTab: (label: string, snapshot: ResultTabSnapshot) => void;
	handleTabChange: (targetKey: string) => void;
	handleTabEdit: (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => void;
	initializeTabs: (initialSnapshot: ResultTabSnapshot) => void;
	clearTabs: () => void;
	getCurrentTabSnapshot: () => ResultTabSnapshot | undefined;
	updateCurrentTabSnapshot: (snapshot: ResultTabSnapshot) => void;
	tabItems: { key: string; label: string; closable: boolean }[];
}

export const useResultTabs = (options: UseResultTabsOptions = {}): UseResultTabsReturn => {
	const { maxTabs = 5, onTabChange, shouldConfirm } = options;

	const [tabs, setTabs] = useState<ResultTabData[]>([]);
	const [activeTabKey, setActiveTabKey] = useState<string>('');
	const [tabCounter, setTabCounter] = useState(0);

	// 초기 탭 생성
	const initializeTabs = useCallback((initialSnapshot: ResultTabSnapshot) => {
		const initialTabKey = `tab-${Date.now()}`;
		setTabs([
			{
				key: initialTabKey,
				label: '최적화 1',
				snapshot: JSON.parse(JSON.stringify(initialSnapshot)),
			},
		]);
		setActiveTabKey(initialTabKey);
		setTabCounter(1);
	}, []);

	// 탭 초기화 (배차옵션 변경 시 재계산용)
	const clearTabs = useCallback(() => {
		setTabs([]);
		setActiveTabKey('');
		setTabCounter(0);
	}, []);

	// 새 탭 생성
	const createTab = useCallback(
		(label: string, snapshot: ResultTabSnapshot) => {
			const newTabKey = `tab-${Date.now()}`;
			const newTabNumber = tabCounter + 1;

			setTabs(prev => {
				const newTab: ResultTabData = {
					key: newTabKey,
					label: `${label} ${newTabNumber}`,
					snapshot: JSON.parse(JSON.stringify(snapshot)),
				};
				const updatedTabs = [...prev, newTab];
				// 최대 개수 초과 시 가장 오래된 탭 제거
				if (updatedTabs.length > maxTabs) {
					updatedTabs.shift();
				}
				return updatedTabs;
			});

			setTabCounter(newTabNumber);
			setActiveTabKey(newTabKey);
		},
		[tabCounter, maxTabs],
	);

	// 현재 탭의 스냅샷 가져오기
	const getCurrentTabSnapshot = useCallback((): ResultTabSnapshot | undefined => {
		const currentTab = tabs.find(t => t.key === activeTabKey);
		return currentTab ? JSON.parse(JSON.stringify(currentTab.snapshot)) : undefined;
	}, [tabs, activeTabKey]);

	// 현재 탭의 스냅샷 업데이트
	const updateCurrentTabSnapshot = useCallback(
		(snapshot: ResultTabSnapshot) => {
			setTabs(prev =>
				prev.map(tab => (tab.key === activeTabKey ? { ...tab, snapshot: JSON.parse(JSON.stringify(snapshot)) } : tab)),
			);
		},
		[activeTabKey],
	);

	// 탭 전환 핸들러
	const handleTabChange = useCallback(
		(targetKey: string) => {
			if (targetKey === activeTabKey) return;

			const targetTab = tabs.find(t => t.key === targetKey);
			if (!targetTab) return;

			const doChange = () => {
				setActiveTabKey(targetKey);
				onTabChange?.(JSON.parse(JSON.stringify(targetTab.snapshot)));
			};

			// shouldConfirm이 true를 반환하면 확인창 표시
			if (shouldConfirm?.()) {
				Modal.confirm({
					title: '탭 전환',
					content: '현재 작업 중인 상태가 초기화됩니다. 계속하시겠습니까?',
					okText: '확인',
					cancelText: '취소',
					onOk: doChange,
				});
			} else {
				doChange();
			}
		},
		[activeTabKey, tabs, onTabChange, shouldConfirm],
	);

	// 탭 닫기 핸들러
	const handleTabClose = useCallback(
		(targetKey: string) => {
			if (tabs.length <= 1) {
				showAlert('알림', '최소 1개의 탭은 유지해야 합니다.');
				return;
			}

			Modal.confirm({
				title: '탭 닫기',
				content: '해당 결과를 삭제하시겠습니까?',
				okText: '확인',
				cancelText: '취소',
				onOk: () => {
					setTabs(prev => {
						const newTabs = prev.filter(t => t.key !== targetKey);
						// 현재 활성 탭이 닫히는 경우 다른 탭으로 전환
						if (activeTabKey === targetKey && newTabs.length > 0) {
							const newActiveTab = newTabs[newTabs.length - 1];
							setActiveTabKey(newActiveTab.key);
							onTabChange?.(JSON.parse(JSON.stringify(newActiveTab.snapshot)));
						}
						return newTabs;
					});
				},
			});
		},
		[tabs, activeTabKey, onTabChange],
	);

	// 탭 편집 핸들러 (닫기 버튼 클릭 시)
	const handleTabEdit = useCallback(
		(targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
			if (action === 'remove' && typeof targetKey === 'string') {
				handleTabClose(targetKey);
			}
		},
		[handleTabClose],
	);

	// Tabs 컴포넌트용 items 배열
	const tabItems = tabs.map(tab => ({
		key: tab.key,
		label: tab.label,
		closable: tabs.length > 1,
	}));

	return {
		tabs,
		activeTabKey,
		tabCounter,
		createTab,
		handleTabChange,
		handleTabEdit,
		initializeTabs,
		clearTabs,
		getCurrentTabSnapshot,
		updateCurrentTabSnapshot,
		tabItems,
	};
};
