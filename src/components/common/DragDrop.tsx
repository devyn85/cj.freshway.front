import React, { ReactNode } from 'react';
import type { Direction, DragStart, DragUpdate, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export type StartResponder = (start: DragStart, provided: ResponderProvided) => void;
export type UpdateResponder = (update: DragUpdate, provided: ResponderProvided) => void;
export type BeforeDragStartResponder = (start: DragStart) => void;
export type EndResponder = (result: DropResult, provided: ResponderProvided) => void;

/**
 * 드래그할 컴포넌트에 넘기는 props가 많은 경우
 * children을 통해 컴포넌트를 가져오는 것이 낫다
 */
type DragDropProps = {
	droppableId?: string;

	items?: Array<any>;
	itemKey?: string; // items 배열 중 KEY로 사용할 필드명
	isDragDisabled?: string; // 드레그 비활성화 컬럼명 (items 포함된 컬럼명)
	onDragEnd?: EndResponder | undefined; // 상위 컴포넌트 func
	onDragStart?: StartResponder | undefined; // 상위 컴포넌트 func
	onDragUpdate?: UpdateResponder | undefined; // 상위 컴포넌트 func
	onBeforeDragStart?: BeforeDragStartResponder | undefined; // 상위 컴포넌트 func

	direction?: Direction | undefined;

	children?: ReactNode | ReactNode[];
	className?: string;
	draggingClass?: string;
};

const DragDrop = (props: DragDropProps) => {
	const {
		droppableId,
		items,
		itemKey,
		onDragEnd,
		onDragStart,
		onDragUpdate,
		onBeforeDragStart,
		children,
		direction = 'vertical',
		isDragDisabled,
	} = props;

	/**
	 * DND 종료 핸들러
	 * @param {DropResult} result dnd 종료 결과
	 * @param {ResponderProvided} provided provider
	 * @returns {void}
	 */
	const onDragEndHanler = (result: DropResult, provided: ResponderProvided) => {
		// 예외
		if (!result.destination) return;
		if (!onDragEnd) return;
		// 결과 전달
		onDragEnd(result, provided);
	};

	/**
	 * DND 시작 핸들러
	 * @param {DragStart} start dnd 시작 정보
	 * @param {ResponderProvided} provided provider
	 * @returns {void}
	 */
	const onDragStartHandler = (start: DragStart, provided: ResponderProvided) => {
		// 예외
		if (!start.source) return;
		if (!onDragStart) return;
		// 결과 전달
		onDragStart(start, provided);
	};

	/**
	 * DND 업데이트 핸들러
	 * @param {DragUpdate} update dnd update 정보
	 * @param {ResponderProvided} provided provider
	 * @returns {void}
	 */
	const onDragUpdateHandler = (update: DragUpdate, provided: ResponderProvided) => {
		// 예외
		if (!update.source) return;
		if (!update.destination) return;
		if (!onDragUpdate) return;
		// 결과 전달
		onDragUpdate(update, provided);
	};

	/**
	 * DND 시작 전 핸들러
	 * @param {DragStart} start DND 시작 정보
	 * @returns {*} ReactNode
	 */
	const onBeforeDragStartHandler = (start: DragStart) => {
		// 예외
		if (!start.source) return;
		if (!onBeforeDragStart) return;
		// 결과 전달
		onBeforeDragStart(start);
	};

	// children과 items에 대한 방어 로직
	const childrenArray = React.Children.toArray(children);
	const itemsArray = Array.isArray(items) && items?.length ? items : new Array(childrenArray.length).fill(null);

	return (
		<DragDropContext
			onDragEnd={onDragEndHanler}
			onDragStart={onDragStartHandler}
			onDragUpdate={onDragUpdateHandler}
			onBeforeDragStart={onBeforeDragStartHandler}
		>
			<Droppable droppableId={droppableId ?? 'droppable'} direction={direction}>
				{provided => (
					<div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex' }}>
						{childrenArray.map((child: any, index) => {
							const currentItem: any = itemsArray[index] ?? {};
							const keyValue =
								itemKey && currentItem && currentItem[itemKey] != null ? String(currentItem[itemKey]) : String(index);
							const disabledFlag = isDragDisabled && currentItem ? Boolean(currentItem[isDragDisabled]) : false;

							return (
								<Draggable key={keyValue} draggableId={keyValue} index={index} isDragDisabled={disabledFlag}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className={snapshot.isDragging ? props.draggingClass : props.className}
										>
											{child}
										</div>
									)}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default DragDrop;
