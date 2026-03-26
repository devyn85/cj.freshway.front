import { CSSProperties, ReactNode, useMemo } from 'react';
import styled from 'styled-components';

export type ScrollDirection = 'vertical' | 'horizontal' | 'both' | 'none';

export type ScrollBoxProps = {
	height?: number | string;
	width?: number | string;
	direction?: ScrollDirection;
	padding?: number | string;
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
};

const toCssSize = (v?: number | string) => {
	if (v === undefined) return undefined;
	return typeof v === 'number' ? `${v}px` : v;
};
/**---------------------------------------------------------------------------/
 *
 * ! ScrollBox
 *
 * * 지정한 크기와 스크롤 방향 규칙을 기준으로 자식 영역을 감싸는 레이아웃용 스크롤 컨테이너 컴포넌트
 * * 별도 상태 없이 props 기반으로만 동작하며, height/width/padding/style를 병합한 최종 인라인 스타일을 Root에 적용한다
 * * direction 값에 따라 스크롤 허용 여부를 제어하며, children은 내부에 그대로 렌더링된다
 * * 외부 훅이나 콜백 실행 없이 정적 레이아웃 래퍼 역할만 수행한다
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * height, width, padding은 숫자면 px 문자열로 변환하고, 문자열이면 그대로 사용한다
 *     * style 병합 시 계산된 기본 스타일 뒤에 spread 되므로, 동일 속성이 있으면 외부 style 값이 최종 우선 적용된다
 *     * direction이 'none'이면 스크롤을 막고, 그 외 값이면 overflow를 auto로 처리한다
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * 자체 이벤트 처리 로직은 없으며, 전달받은 children 내부 이벤트에 관여하지 않는다
 *   * disabled 상태에서 차단되는 동작
 *     * disabled 개념은 없으며, direction='none'일 때만 스크롤 동작이 차단된다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * Root는 position: relative, min-width: 0, min-height: 0을 기본으로 사용해 부모 레이아웃 안에서 축소 가능하게 동작한다
 *   * display: flex와 flex-direction: column을 고정 적용하여 내부 자식들을 세로 축 기준으로 배치한다
 *   * overflow는 direction 값에 따라 조건부 적용되며:
 *     * 'none'이면 overflow: hidden
 *     * 그 외('vertical' | 'horizontal' | 'both')이면 overflow: auto
 *   * direction 타입이 세분화되어 있으나 실제 스타일 분기는 'none' 여부만 사용하며, 축별 overflow 분리는 하지 않는다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * height, width, padding, className, style, children, direction 모두 선택값이다
 *     * direction의 기본값은 'vertical', height/width의 기본값은 '100%'이다
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * toCssSize는 undefined를 그대로 유지하고, 숫자는 px 단위 문자열로 보정한다
 *     * mergedStyle은 useMemo로 계산되며, height/width/padding/style 변경 시에만 재계산된다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 서버 제어 로직은 없으며, props로만 제어되는 클라이언트 레이아웃 컴포넌트이다
 *
 * @module ScrollBox
 * 지정한 크기와 overflow 정책을 기준으로 스크롤 가능한 래퍼 영역을 구성하며,
 * 외부 스타일과 자식 요소를 함께 수용하는 공용 레이아웃 컨테이너 역할을 수행한다
 *
 * @usage
 * <ScrollBox
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const ScrollBox = ({
	height = '100%',
	width = '100%',
	direction = 'vertical',
	padding,
	className,
	style,
	children,
}: ScrollBoxProps) => {
	const mergedStyle = useMemo<CSSProperties>(
		() => ({
			height: toCssSize(height),
			width: toCssSize(width),
			padding: toCssSize(padding),
			...style,
		}),
		[height, width, padding, style],
	);

	return (
		<Root className={className} style={mergedStyle} $direction={direction}>
			{children}
		</Root>
	);
};

export default ScrollBox;

const Root = styled.div<{ $direction: ScrollDirection }>`
	position: relative;
	min-width: 0;
	min-height: 0;

	${({ $direction }) =>
		$direction !== 'none' &&
		`
      overflow: auto;
    `}

	${({ $direction }) =>
		$direction === 'none' &&
		`
      overflow: hidden;
    `}
	display: flex;
	flex-direction: column;
`;
