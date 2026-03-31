import Icon from '@/components/common/Icon';
import Skeleton from '@/components/common/Skeleton';
import type { CarouselProps } from 'antd';
import { Carousel } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

type imageItem = {
	src: string;
	alt?: string;
	width?: string;
	height?: string;
	title?: string;
	style?: React.CSSProperties;
};

type CustomImageModalProps = {
	width?: string;
	height?: string;
	style?: React.CSSProperties;
	open: boolean;
	onClose?: () => void;
	items?: imageItem[];
	footer?: React.ReactNode;
	showArrows?: boolean;
	infinite?: boolean;
	titleFallback?: string;
};
/**---------------------------------------------------------------------------/
 *
 * ! CustomImageModal
 *
 * * 이미지 목록을 Carousel로 표시하는 모달 오버레이 컴포넌트
 * * open=true일 때만 렌더링되며, 배경 클릭(Overlay)·닫기 버튼·ESC 키로 닫기 동작을 수행한다
 * * items를 내부에서 빈 배열로 정규화하여(undef 방어) 렌더링 분기를 안정화한다
 * * 무한 루프(infinite)·화살표(showArrows)· 아이템 2개 이상 dots 노출 기본값은 모두 활성(true)이다
 *
 * * 동작 규칙
 *   * 렌더링/표시
 *     * props.open이 false면 null을 반환하여 DOM을 렌더링하지 않는다
 *     * items.length===0이면 “이미지가 없습니다.” 빈 상태 UI를 렌더링한다
 *   * 주요 분기 조건 및 처리 우선순위
 *     * dots 표시 규칙: items가 0개면 숨김, 2개 이상이면 항상 표시, 
 *     * 타이틀 표시 규칙: items가 비어있으면 titleFallback, 있으면 현재 activeIndex의 item.title 우선, 없으면 titleFallback
 *     * 로딩 오버레이 규칙: open=true && items 존재 시 현재 activeIndex의 로딩 상태가 true면 Skeleton 오버레이를 표시한다
 *   * 이벤트 처리 방식
 *     * 배경(Overlay) mousedown에서 target===currentTarget인 경우에만 닫기(컨텐츠 영역 클릭은 닫힘 방지)
 *     * 닫기 버튼 클릭 시 onClose 콜백을 호출한다(옵셔널)
 *     * Carousel afterChange에서 activeIndex를 갱신하며, 해당 인덱스의 로딩 상태가 미정(undefined)이면 true로 초기화한다
 *     * 이미지 onLoad/onError 모두 동일하게 해당 인덱스 로딩 상태를 false로 전환해 로딩 오버레이를 해제한다
 *     * 화살표 버튼 클릭은 showArrows=true && open=true일 때만 prev/next 동작을 수행한다
 *     * 키보드 이벤트는 open=true일 때만 window에 등록되며:
 *       * Escape: 닫기 처리
 *       * ArrowLeft/ArrowRight: showArrows=true일 때만 이전/다음 이동
 *   * disabled 상태에서 차단되는 동작
 *     * 본 컴포넌트는 disabled props는 없으며, open=false 상태에서 모든 UI/이벤트 동작은 비활성(미렌더링/리스너 미등록)된다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * Overlay는 fixed/inset:0로 전체 화면을 덮고, 중앙 정렬 + 반투명 배경을 적용한다(z-index: 9999)
 *   * Dialog는 width props(기본 920px) + max-width로 뷰포트에 맞춰 제한되며, border-radius/box-shadow로 모달 형태를 구성한다
 *   * Header는 고정 높이(52px)와 하단 보더를 가지며, Title은 ellipsis로 한 줄 말줄임 처리한다
 *   * Body는 height props(기본 70vh)로 고정 높이를 사용하며, 내부에서 LoadingOverlay는 absolute/inset:0로 컨텐츠를 덮는다(z-index:2)
 *   * CarouselBox는 slick 요소들의 height를 100%로 강제해 슬라이드가 Body 높이를 채우도록 한다
 *   * ArrowButton은 CarouselBox 기준 absolute로 좌/우(10px) 배치되며, showArrows=true일 때만 렌더링된다(z-index:3)
 *   * ImageWrapper는 중앙 정렬 + overflow hidden이며, Image는 object-fit: contain으로 비율 유지 표시를 한다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * open: 필수(boolean) — 모달 렌더링/이벤트 등록의 기준
 *     * onClose: 선택 — 닫기 트리거(배경/버튼/ESC) 발생 시 호출
 *     * items: 선택(imageItem[]) — 미지정 시 빈 배열로 처리
 *     * width/height/style: 선택 — Dialog/Body의 크기 및 스타일 적용
 *     * footer: 선택(ReactNode) — Header 우측 영역에 렌더링
 *     * showArrows: 선택(boolean) — 화살표 렌더링 및 좌우 이동 허용 여부(기본 true)
 *     * infinite: 선택(boolean) — Carousel의 무한 루프 여부(기본 true)
 *     * titleFallback: 선택(string) — 현재 아이템 타이틀이 없거나 items가 비어있을 때의 대체 타이틀
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * items를 useMemo로 정규화하여 이후 length 기반 분기 및 인덱스 접근의 기준으로 사용한다
 *     * open 또는 items 변경 시 activeIndex를 0으로 초기화하고, 모든 인덱스를 loading=true로 초기화한 뒤 첫 슬라이드로 이동(goTo(0, true))한다
 *     * 로딩 상태는 index별 map(Record<number, boolean>)으로 관리하며, 이미지 로드 성공/실패와 무관하게 완료 시 false로 전환한다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 서버 통신/제어 로직은 없으며, props 기반으로 동작하는 클라이언트(UI) 제어 컴포넌트이다
 *
 * @module CustomImageModal
 * open 상태에 따라 화면 오버레이 모달을 표시하고, Carousel로 이미지 목록을 탐색할 수 있도록 제공하며
 * 현재 이미지 로딩 상태에 따라 Skeleton 오버레이를 표시하고 title/화살표/dots를 규칙에 따라 제어한다
 *
 * @usage
 *  const items = useMemo(
		() => [
			{
				title: 'test01',
				src: 'https://test.com/sample-1.jpg',
				alt: 'sample-1',
			},
			{
				title: 'test02',
				src: 'https://test.com/sample-2.jpg',
				alt: 'sample-2',
			},
			{
				title: 'test03',
				src: 'https://test.com/sample-3.jpg',
				alt: 'sample-3',
			},
		],
		[],
	);
 * 	<CustomImageModal open={open} onClose={handleClose} items={items} />
 *
/---------------------------------------------------------------------------**/
const CustomImageModal = (props: CustomImageModalProps) => {
	// * 아이템 정규화 (undefined 방어)
	const items = useMemo(() => props.items ?? [], [props.items]);

	// * 기본값: 무한루프/화살표 활성, 단일도 dots 노출(아이템 1개 이상이면 무조건)
	const infinite = props.infinite ?? true;
	const showArrows = props.showArrows ?? true;

	// * items 2개 이상일 때만 dots/arrow 노출
	const canNavigate = items.length >= 2;

	// * dots: items 0/1이면 숨김, 2개 이상이면 표시
	const showDots = useMemo(() => {
		if (!canNavigate) return false;
		return true;
	}, [canNavigate]);

	// * 로딩 상태: 현재 슬라이드 이미지가 로드될 때까지 Skeleton 표시
	const [activeIndex, setActiveIndex] = useState(0);
	const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

	// * Carousel ref
	const carouselRef = useRef<any>(null);

	// * open/items 변경 시 상태 초기화
	useEffect(() => {
		if (!props.open) return;

		setActiveIndex(0);
		setLoadingMap(() => {
			const next: Record<number, boolean> = {};
			items.forEach((_, idx) => {
				next[idx] = true;
			});
			return next;
		});

		// * open 시 첫 슬라이드로 이동
		requestAnimationFrame(() => {
			carouselRef.current?.goTo?.(0, true);
		});
	}, [props.open, items]);

	// * 활성 슬라이드 로딩 여부
	const isActiveLoading = useMemo(() => {
		if (!props.open) return false;
		if (items.length === 0) return false;
		return loadingMap[activeIndex] ?? true;
	}, [activeIndex, items.length, loadingMap, props.open]);

	// * 이미지 로드 완료 처리
	const markLoaded = useCallback((index: number) => {
		setLoadingMap(prev => {
			if (prev[index] === false) return prev;
			return { ...prev, [index]: false };
		});
	}, []);

	// * 슬라이드 변경 처리
	const handleAfterChange = useCallback<NonNullable<CarouselProps['afterChange']>>(current => {
		setActiveIndex(current);
		setLoadingMap(prev => {
			if (prev[current] === undefined) return { ...prev, [current]: true };
			return prev;
		});
	}, []);

	// * 현재 이미지 타이틀(타이틀은 imageItem.title 우선)
	const currentTitle = useMemo(() => {
		if (items.length === 0) return props.titleFallback ?? '';
		return items[activeIndex]?.title ?? props.titleFallback ?? '';
	}, [activeIndex, items, props.titleFallback]);

	// * 닫기
	const handleClose = useCallback(() => {
		props.onClose?.();
	}, [props]);

	// * 이전/다음
	const handlePrev = useCallback(() => {
		if (!props.open) return;
		if (!showArrows) return;
		if (!canNavigate) return;
		carouselRef.current?.prev?.();
	}, [props.open, showArrows, canNavigate]);

	const handleNext = useCallback(() => {
		if (!props.open) return;
		if (!showArrows) return;
		if (!canNavigate) return;
		carouselRef.current?.next?.();
	}, [props.open, showArrows, canNavigate]);

	// * 키보드(ESC 닫기, 좌우 이동)
	useEffect(() => {
		if (!props.open) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleClose();
				return;
			}
			if (!showArrows) return;
			if (!canNavigate) return;
			if (e.key === 'ArrowLeft') handlePrev();
			if (e.key === 'ArrowRight') handleNext();
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [props.open, handleClose, handlePrev, handleNext, showArrows, canNavigate]);

	if (!props.open) return null;

	return (
		<Overlay
			onMouseDown={e => {
				if (e.target === e.currentTarget) handleClose();
			}}
		>
			<Dialog width={props.width} style={props.style}>
				<Header>
					<Title title={currentTitle}>{currentTitle}</Title>
					<HeaderRight>
						{props.footer}
						<CloseButton type="button" onClick={handleClose} aria-label="close">
							<Icon icon="icon-pc-popup-close-20-px-bl" />
						</CloseButton>
					</HeaderRight>
				</Header>

				<Body height={props.height ?? '70vh'}>
					{isActiveLoading && (
						<LoadingOverlay>
							<Skeleton variant="rectangular" width={'100%'} height={'100%'} />
						</LoadingOverlay>
					)}

					{items.length === 0 ? (
						<Empty>이미지가 없습니다.</Empty>
					) : (
						<CarouselBox>
							{showArrows && canNavigate && (
								<>
									<ArrowButton type="button" $pos="left" onClick={handlePrev} aria-label="prev">
										<Icon icon="icon-arrow-left-20" />
									</ArrowButton>
									<ArrowButton type="button" $pos="right" onClick={handleNext} aria-label="next">
										<Icon icon="icon-arrow-right-20" />
									</ArrowButton>
								</>
							)}

							<Carousel
								ref={carouselRef}
								infinite={infinite}
								arrows={false}
								dots={showDots}
								afterChange={handleAfterChange}
								adaptiveHeight={false}
							>
								{items.map((it, idx) => (
									<div key={`${it.src}-${idx}`}>
										<ImageWrapper height={props.height ?? '70vh'}>
											<Image
												src={it.src}
												alt={it.alt ?? ''}
												onLoad={() => markLoaded(idx)}
												onError={() => markLoaded(idx)}
												width={it.width}
												height={it.height}
												style={it.style}
												loading="eager"
											/>
										</ImageWrapper>
									</div>
								))}
							</Carousel>
						</CarouselBox>
					)}
				</Body>
			</Dialog>
		</Overlay>
	);
};

export default CustomImageModal;

const Overlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 9999;
	background: rgba(0, 0, 0, 0.55);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
`;

const Dialog = styled.div<{ width?: string }>`
	width: ${({ width }) => width ?? '920px'};
	max-width: calc(100vw - 48px);
	background: #ffffff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
`;

const Header = styled.div`
	height: 52px;
	padding: 0 12px 0 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const Title = styled.div`
	min-width: 0;
	font-size: 18px;
	font-weight: 600;
	line-height: 20px;
	color: rgba(0, 0, 0, 0.88);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const HeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const CloseButton = styled.button`
	width: 36px;
	height: 36px;
	border: 0;
	background: transparent;
	border-radius: 8px;
	font-size: 22px;
	line-height: 22px;
	cursor: pointer;
	color: rgba(0, 0, 0, 0.72);

	&:hover {
		background: rgba(0, 0, 0, 0.06);
	}
`;

const Body = styled.div<{ height?: string }>`
	position: relative;
	width: 100%;
	height: ${({ height }) => height ?? '60vh'};
`;

const LoadingOverlay = styled.div`
	position: absolute;
	inset: 0;
	z-index: 2;
`;

const CarouselBox = styled.div`
	position: relative;
	width: 100%;
	height: 100%;

	.slick-slider,
	.slick-list,
	.slick-track {
		height: 100%;
	}

	.slick-slide > div {
		height: 100%;
	}

	.slick-dots {
		bottom: 10px;
		li button {
			background: #007651;
			opacity: 0.5;
		}
		li.slick-active {
			::after {
				background: inherit;
			}
			button {
				opacity: 1;
			}
		}
	}
`;

const ImageWrapper = styled.div<{ height?: string }>`
	width: 100%;
	height: ${({ height }) => height ?? '60vh'};
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;

const Image = styled.img<{ width?: string; height?: string }>`
	width: ${({ width }) => width ?? '100%'};
	height: ${({ height }) => height ?? '100%'};
	object-fit: contain;
	display: block;
`;

const ArrowButton = styled.button<{ $pos: 'left' | 'right' }>`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	z-index: 3;
	width: 44px;
	height: 44px;
	border: 0;
	border-radius: 9999px;
	cursor: pointer;
	background: rgba(0, 0, 0, 0.45);
	color: #fff;
	font-size: 28px;
	line-height: 28px;

	svg {
		path {
			fill: #fff;
		}
	}

	${({ $pos }) =>
		$pos === 'left'
			? css`
					left: 10px;
			  `
			: css`
					right: 10px;
			  `}

	&:hover {
		background: rgba(0, 0, 0, 0.6);
	}
`;

const Empty = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: rgba(0, 0, 0, 0.55);
	color: #c6c6c6;
	font-size: 20px;
	font-weight: bold;
	font-family: 'Pretendard', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue',
		'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
`;
