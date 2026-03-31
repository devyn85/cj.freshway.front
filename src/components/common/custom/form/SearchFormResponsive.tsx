// Lib
import { Button, Form } from 'antd';
import { memo, useEffect, useRef, useState } from 'react';

// CSS
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import Search from '@/assets/styled/Search/Search';
import icoSvgData from '@/components/common/icoSvgData.json';

// Store

// Component
import IcoSvg from '@/components/common/IcoSvg';
import { usePageLayoutVisible } from '@/hooks/usePageLayoutVisible';

interface SearchFromProps {
	form: any;
	initialValues?: object;
	children?: any;
	onValuesChange?: (changedValues: any, allValues: any | null) => void;
	groupClass?: any; // UiFilterGroup 영역 class
	initialExpanded?: boolean;
	isAlwaysVisible?: boolean;
	hideToggleButton?: boolean;
}

const SearchForm = (props: SearchFromProps) => {
	const {
		form,
		children,
		initialValues,
		onValuesChange,
		groupClass,
		initialExpanded = false,
		isAlwaysVisible = false,
		hideToggleButton = false,
	} = props;

	const {
		layout: { isSearchFormVisible },
	} = usePageLayoutVisible();

	const [expanded, setExpanded] = useState(initialExpanded);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	// 검색영역 줄 높이
	useEffect(() => {
		setTimeout(() => {
			setExpanded(true);

			const el = groupRef.current;
			if (!el) return;

			const liElements = el.querySelectorAll('li');
			if (liElements.length === 0) {
				setShowToggleBtn(false);
				return;
			}

			const firstLiHeight = liElements[1]?.offsetHeight;
			const totalHeight = el?.offsetHeight;
			const lineCount = Math.round(totalHeight / firstLiHeight);

			setShowToggleBtn(lineCount > 3);
			setExpanded(initialExpanded); // initialExpanded 에 따라 초기 확장 상태 설정
		});
		// }, 100); // setTimeout 필요하면 다시 설정
	}, [children]);

	return (
		<Search style={{ display: isAlwaysVisible ? 'block' : isSearchFormVisible ? 'block' : 'none' }}>
			<Form form={form} initialValues={initialValues} preserve={true} onValuesChange={onValuesChange}>
				<UiFilterArea>
					<UiFilterGroup className={!expanded ? groupClass + ' hide' : groupClass} ref={groupRef}>
						{children}
					</UiFilterGroup>
					{showToggleBtn && !hideToggleButton && (
						<div className="btn-group align-center">
							<Button
								type={'primary'}
								icon={<IcoSvg data={expanded ? icoSvgData.icoArrowUp : icoSvgData.icoArrowDown} />}
								onClick={() => setExpanded(prev => !prev)}
							/>
						</div>
					)}
				</UiFilterArea>
			</Form>
		</Search>
	);
};

export default memo(SearchForm);
