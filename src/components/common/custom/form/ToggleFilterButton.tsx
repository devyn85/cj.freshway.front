import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface ToggleFilterButtonProps {
	show: boolean;
	onToggle?: (expanded: boolean) => void;
}

const ToggleFilterButton = ({ show, onToggle }: ToggleFilterButtonProps) => {
	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	const handleClick = () => {
		setExpanded(prev => {
			const next = !prev;
			onToggle?.(next); // 부모에게 전달
			return next;
		});
	};

	//검색영역 줄 높이
	useEffect(() => {
		setExpanded(true);
		requestAnimationFrame(() => {
			const el = groupRef.current;
			if (!el) return;

			const liElements = el.querySelectorAll('li');
			if (liElements.length === 0) return;

			const firstLiHeight = liElements[0].offsetHeight;
			const totalHeight = el.offsetHeight;
			const lineCount = totalHeight / firstLiHeight;

			setShowToggleBtn(lineCount > 3);
			setExpanded(false);
		});
	}, []);

	if (!show) return null;
	return (
		<>
			{showToggleBtn && (
				<div className="btn-group align-center">
					<Button
						type={'secondary'}
						icon={<IcoSvg data={expanded ? icoSvgData.icoArrowUp : icoSvgData.icoArrowDown} />}
						onClick={handleClick}
					/>
				</div>
			)}
		</>
	);
};

export default ToggleFilterButton;
