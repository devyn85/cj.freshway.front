/*
############################################################################
# Type: Plan Timeline Types
# 목적: TmPlan 타임라인 관련 타입 정의
# 
# [주요 타입]
# - DragItemBlock: 드래그 아이템 (타임라인 블록)
# - ItemTypes: 드래그 아이템 타입 상수
############################################################################
*/

import { TmEngineStepDto } from '@/api/tm/apiTmDispatch';

// 드래그 아이템 (타임라인 블록)
export interface DragItemBlock {
	type: string;
	id: string;
	block?: {
		id: string;
		text: string;
		startTime: number;
		duration: number;
		color: string;
		originStep?: TmEngineStepDto; // 원본 스텝 데이터
	};
}

// 드래그 아이템 타입 상수
export const ItemTypes = {
	TIMELINE_BLOCK: 'TIMELINE_BLOCK',
	UNASSIGNED_ORDER: 'UNASSIGNED_ORDER',
	RETURN_ORDER: 'RETURN_ORDER',
};

