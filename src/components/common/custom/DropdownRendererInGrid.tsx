import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { applyDropdownPosition, calculateDropdownPosition } from '@/util/dropdownPositionUtil';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface StyledGridDropdownWrapperProps {
	cellElementRect?: {
		top: number;
		height: number;
		left: number;
		width: number;
	};
}

interface DropdownRendererInGridProps {
	columns: any;
	dropdownData: any;
	handleDropdownClick: any;
	cellElementRect: any;
	_tGrid?: any;
}

const StyledGridDropdownWrapper = styled.div<StyledGridDropdownWrapperProps>`
	position: fixed;
	top: ${({ cellElementRect }) => (cellElementRect ? `${cellElementRect.top + cellElementRect.height + 2}px` : 'auto')};
	left: ${({ cellElementRect }) =>
		cellElementRect ? `${cellElementRect.left + cellElementRect.width / 2}px` : 'auto'};
	width: fit-content;
	min-width: 200px;
	max-width: 500px;
	transform: translateX(-50%);
	z-index: 1050;

	/* 드롭다운 테이블 셀의 텍스트 개행 방지 */
	.data-table td {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: none;
	}
`;

/**
 * AUI Grid용 드롭다운 테이블 렌더링 (StyledComponents 적용)
 * DropdownRenderer의 공통 로직을 재사용하면서 Grid 영역 내 위치 조정 적용
 * @param {DropdownRendererInGridProps} props 컴포넌트 props
 * @returns {React.ReactElement} 드롭다운 테이블 JSX 엘리먼트
 * @example
 * ```
 * <DropdownRendererInGrid
 *   columns={dropdownConfig.columns}
 *   dropdownData={dropdownData}
 *   handleDropdownClick={handleDropdownClick}
 *   cellElementRect={cellElementRect}
 * />
 * ```
 */
const DropdownRendererInGrid: React.FC<DropdownRendererInGridProps> = ({
	columns,
	dropdownData,
	handleDropdownClick,
	cellElementRect,
	_tGrid,
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const dropdownBodyRef = useRef<HTMLTableSectionElement | null>(null);

	useEffect(() => {
		if (dropdownRef.current && cellElementRect) {
			// 드롭다운이 렌더링된 후 위치 조정
			const adjustedPosition = calculateDropdownPosition(cellElementRect, dropdownRef.current);
			applyDropdownPosition(dropdownRef.current, adjustedPosition);
		}
	}, [cellElementRect, dropdownData]); // dropdownData 변경 시에도 위치 재조정

	/**
	 * Drop Down 노출시 포커스 이동
	 */
	useEffect(() => {
		setTimeout(() => {
			const firstRow = dropdownBodyRef.current?.querySelector('tr');
			firstRow?.focus();
		}, 300);
	}, [dropdownData]);

	return (
		<StyledGridDropdownWrapper ref={dropdownRef} cellElementRect={cellElementRect}>
			{DropdownRenderer(columns, dropdownData, handleDropdownClick, null, {
				bodyRef: dropdownBodyRef,
				_tGrid,
			})}
		</StyledGridDropdownWrapper>
	);
};

export default DropdownRendererInGrid;
