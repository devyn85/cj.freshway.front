import { ItemTypes } from '@/components/tm/planTimeline/types';
import React from 'react';
import { useDragLayer } from 'react-dnd';
import styled from 'styled-components';

const DragPreviewContainer = styled.div`
	position: fixed;
	pointer-events: none;
	z-index: 9999;
	left: 0;
	top: 0;
`;

const PreviewBadge = styled.div`
	border: 1px solid #1890ff;
	color: #1890ff;
	background: white;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: bold;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	display: flex;
	align-items: center;
	gap: 6px;
	white-space: nowrap;
`;

const CountBadge = styled.span`
	background-color: rgba(255, 255, 255, 0.3);
	padding: 2px 6px;
	border-radius: 10px;
	font-size: 11px;
`;

export const CustomDragLayer: React.FC = () => {
	const { itemType, isDragging, item, currentOffset } = useDragLayer(monitor => ({
		item: monitor.getItem(),
		itemType: monitor.getItemType(),
		currentOffset: monitor.getClientOffset(),
		isDragging: monitor.isDragging(),
	}));

	if (!isDragging || !currentOffset) {
		return null;
	}

	// 미배차/반품 주문 드래그가 아니면 렌더링하지 않음
	if (itemType !== ItemTypes.UNASSIGNED_ORDER && itemType !== ItemTypes.RETURN_ORDER) {
		return null;
	}

	const { taskIds, isReturnOrder, isMultiple } = item || {};
	const count = taskIds?.length || 1;
	const label = '주문';

	// 단일 선택이면 기본 드래그 프리뷰 사용
	if (!isMultiple || count <= 1) {
		return null;
	}

	return (
		<DragPreviewContainer
			style={{
				transform: `translate(${currentOffset.x + 16}px, ${currentOffset.y + 16}px)`,
			}}
		>
			<PreviewBadge>
				<span>주문 {count}건 이동</span>
			</PreviewBadge>
		</DragPreviewContainer>
	);
};
