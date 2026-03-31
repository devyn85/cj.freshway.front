import { Tabs } from 'antd';
import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

const { TabPane } = Tabs;

export type TabsArrayItem = {
	key: string;
	label: ReactNode;
	children: ReactNode;
	disabled?: boolean;
	forceRender?: boolean;
	destroyOnHide?: boolean;
	className?: string;
};

export type TabsArrayProps = {
	items: TabsArrayItem[];
	activeKey: string;
	onChange: (key: string) => void;

	className?: string;
	type?: 'line' | 'card' | 'editable-card';
	size?: 'large' | 'middle' | 'small';
	centered?: boolean;
	tabPosition?: 'top' | 'right' | 'bottom' | 'left';
	animated?: boolean | { inkBar?: boolean; tabPane?: boolean };
	destroyInactiveTabPane?: boolean;
	forceRender?: boolean;
	destroyOnHide?: boolean;
	onResizing?: () => void;
	onResizeEnd?: () => void;
};

const TabsArray = ({
	items,
	activeKey,
	onChange,
	className,
	type,
	size,
	centered,
	tabPosition,
	animated,
	destroyInactiveTabPane = true,
	forceRender,
	destroyOnHide,
	onResizing,
	onResizeEnd,
}: TabsArrayProps) => {
	const rafRef = useRef<number | null>(null);
	const rootRef = useRef<HTMLDivElement | null>(null);

	// * 탭 전환 시 외부 그리드가 즉시 레이아웃 재계산하도록(레이아웃 확정 이후 RAF 2회)
	const syncActivePaneLayout = useCallback(() => {
		if (!onResizeEnd) return;

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				onResizeEnd();
			});
		});
	}, [onResizeEnd]);

	// * Splitter onResizing처럼 과도 호출 방지(RAF)
	const callResizingRaf = useCallback(() => {
		if (!onResizing) return;
		if (rafRef.current) return;

		rafRef.current = window.requestAnimationFrame(() => {
			rafRef.current = null;
			onResizing();
		});
	}, [onResizing]);

	const handleChange = useCallback(
		(key: string) => {
			onChange(key);
			syncActivePaneLayout();
		},
		[onChange, syncActivePaneLayout],
	);

	// * TabsArray 자체 컨테이너 사이즈 변화에도 외부 그리드가 따라가도록 ResizeObserver로 감지
	useEffect(() => {
		if (!onResizing && !onResizeEnd) return;

		const el = rootRef.current;
		if (!el) return;

		let ro: ResizeObserver | null = null;

		if (typeof ResizeObserver !== 'undefined') {
			ro = new ResizeObserver(() => {
				callResizingRaf();
			});
			ro.observe(el);
		}

		return () => {
			ro?.disconnect();
		};
	}, [callResizingRaf, onResizing, onResizeEnd]);

	useEffect(() => {
		return () => {
			if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
		};
	}, []);

	// * activeKey가 외부에서 변경되는 케이스(프로그램 전환)도 동일하게 레이아웃 동기화
	useEffect(() => {
		syncActivePaneLayout();
	}, [activeKey, syncActivePaneLayout]);

	const disabledKeys = useMemo(() => items.filter(it => it.disabled).map(it => it.key), [items]);

	const panes = useMemo(
		() =>
			items.map(it => {
				const paneForceRender = it.forceRender ?? forceRender;
				const paneDestroyOnHide = it.destroyOnHide ?? destroyOnHide;

				return (
					<StyledTabPane
						key={it.key}
						tab={it.label}
						disabled={it.disabled}
						forceRender={paneForceRender}
						className={it.className}
					>
						<PaneFill>{paneDestroyOnHide && activeKey !== it.key ? null : it.children}</PaneFill>
					</StyledTabPane>
				);
			}),
		[items, forceRender, destroyOnHide, activeKey],
	);

	return (
		<Root ref={rootRef} className={className} $disabledKeys={disabledKeys}>
			<StyledTabs
				activeKey={activeKey}
				onChange={handleChange}
				type={type}
				size={size}
				centered={centered}
				tabPosition={tabPosition}
				animated={animated}
				destroyInactiveTabPane={destroyInactiveTabPane}
			>
				{panes}
			</StyledTabs>
		</Root>
	);
};

export default TabsArray;

const Root = styled.div<{ $disabledKeys: string[] }>`
	width: 100% !important;
	height: 100% !important;
	min-width: 0 !important;
	min-height: 0 !important;

	${({ $disabledKeys }) =>
		$disabledKeys
			.map(
				key => `
		.ant-tabs-tab[data-node-key='${key}'] {
			color: rgba(0, 0, 0, 0.25) !important;
			cursor: not-allowed !important;
		}

		.ant-tabs-tab[data-node-key='${key}'] .ant-tabs-tab-btn {
			color: rgba(0, 0, 0, 0.25) !important;
			cursor: not-allowed !important;
		}
	`,
			)
			.join('\n')}
`;

const StyledTabs = styled(Tabs)`
	&&&& {
		width: 100% !important;
		height: 100% !important;
		min-width: 0 !important;
		min-height: 0 !important;
	}

	&&&&.ant-tabs {
		display: flex !important;
		flex-direction: column !important;
		height: 100% !important;
		min-height: 0 !important;
	}

	&&&&.ant-tabs > .ant-tabs-nav {
		flex: 0 0 auto !important;
		margin: 0 !important;
	}

	&&&&.ant-tabs > .ant-tabs-content-holder {
		flex: 1 1 auto !important;
		height: 100% !important;
		min-height: 0 !important;
		min-width: 0 !important;
		overflow: hidden !important;
	}

	&&&&.ant-tabs > .ant-tabs-content-holder > .ant-tabs-content {
		height: 100% !important;
		min-height: 0 !important;
		min-width: 0 !important;
	}

	&&&&.ant-tabs > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane {
		height: 100% !important;
		min-height: 0 !important;
		min-width: 0 !important;
		padding: 0 !important;
	}

	&&&& .ant-tabs-content [class^='ant-tabs'] {
		min-height: 0 !important;
		overflow: hidden !important;
	}
`;

const StyledTabPane = styled(TabPane)`
	width: 100% !important;
	height: 100% !important;
	min-width: 0 !important;
	min-height: 0 !important;
`;

const PaneFill = styled.div`
	width: 100% !important;
	height: 100% !important;
	min-width: 0 !important;
	min-height: 0 !important;
	display: flex !important;
	flex-direction: column !important;
`;
