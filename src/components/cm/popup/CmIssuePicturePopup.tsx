/*
 ############################################################################
 # FiledataField	: CmIssuePicturePopup.tsx
 # Description		: 배송 이슈 사진 팝업
 # Author			: Canal Frame
 # Since			: 26.02.20
 ############################################################################
*/
// lib
import { Carousel } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Utils
import fileUtil from '@/util/fileUtils';

//component
import Icon from '@/components/common/Icon';
import Skeleton from '@/components/common/Skeleton';

// Type
import type { CarouselProps } from 'antd';
import styled, { css } from 'styled-components';

//API Call Function
import { apiPostIssuePictureList } from '@/api/cm/apiCmSearch';

type popupProps = {
	close?: any;
	param?: any;
	width?: string;
	height?: string;
	style?: React.CSSProperties;
	open: boolean;
	items?: imageItem[];
	footer?: React.ReactNode;
	showArrows?: boolean;
	infinite?: boolean;
	titleFallback?: string;
};

type imageItem = {
	src: string;
	alt?: string;
	width?: string;
	height?: string;
	title?: string;
	style?: React.CSSProperties;
};

const CmIssuePicturePopup = forwardRef((props: popupProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// * 아이템 정규화 (undefined 방어)
	const [items, setItems] = useState<imageItem[]>(() => props.items ?? []);
	const [downloadEnd, setDownloadEnd] = useState(false);

	// * 기본값: 무한루프 화살표 활성, 단일도 dots 노출(아이템 1개 이상이면 무조건)
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

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 배송 이슈 사진 목록 조회
	 */
	const getIssuePictureList = () => {
		const params = {
			dccode: props.param?.dccode || '',
			deliverydt: props.param?.deliverydt || '',
			truthcustkey: props.param?.truthcustkey || '',
			carno: props.param?.carno || '',
			priority: props.param?.priority || '1',
		};

		apiPostIssuePictureList(params).then(res => {
			if (res.data.length > 0) {
				// reset current items before starting sequential download
				setItems([]);
				downloadFile(res.data, 0);
			} else {
				setDownloadEnd(true);
			}
		});
	};

	/**
	 * 파일 조회 클릭 이벤트 함수
	 * @returns {void}
	 */
	function onClickSearch() {
		getIssuePictureList();
	}

	/**
	 * 파일 이미지 다운로드 (재귀적으로 순차 다운로드)
	 * @param {Array} fileList 다운로드할 파일 목록
	 * @param {number} index
	 */
	const downloadFile = async (fileList: any[], index: number) => {
		const current = fileList[index];

		// 마지막 '/' 위치 찾기
		const lastSlashIndex = current.filelocation.lastIndexOf('/');
		// 마지막 '/' 이전까지 잘라내기 (슬래시 제외)
		const dirPath = lastSlashIndex >= 0 ? current.filelocation.substring(0, lastSlashIndex) : current.filelocation;

		const params = {
			dirType: 'saveFullPath',
			attchFileNm: current.filename,
			savePathNm: current.filelocation,
			saveFileNm: current.filename,
			readOnly: true,
		};

		try {
			//const fileUrl = await fileUtil.downloadFile(params);
			await fileUtil.downloadFile(params).then(async (data: string) => {
				if (data) {
					setItems(prev => [
						...prev,
						{
							src: data,
							alt: current.filename,
							title: current.filename,
						},
					]);
				}

				const nextIndex = index + 1;

				if (nextIndex < fileList.length) {
					await downloadFile(fileList, nextIndex);
				} else {
					setDownloadEnd(true);
				}
			});

			// if (fileUrl) {
			// 	setItems(prev => [
			// 		...prev,
			// 		{
			// 			src: fileUrl,
			// 			alt: current.filename,
			// 			title: current.filename,
			// 		},
			// 	]);
			//}

			// const nextIndex = index + 1;

			// if (nextIndex < fileList.length) {
			// 	await downloadFile(fileList, nextIndex);
			// } else {
			// 	setDownloadEnd(true);
			// }
		} catch (error) {
			setDownloadEnd(true);
			//console.error('Error downloading file:', error);
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 초기화 처리 - 데이터 조회
	 */
	useEffect(() => {
		getIssuePictureList();
	}, []);

	/**
	 * open/items 변경 시 상태 초기화
	 */
	useEffect(() => {
		//if (!props.open) return;

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
	}, [downloadEnd]);

	/**
	 *  활성 슬라이드 로딩 여부
	 */
	const isActiveLoading = useMemo(() => {
		//if (!props.open) return false;
		if (items.length === 0) return false;
		return loadingMap[activeIndex] ?? true;
	}, [activeIndex, items.length, loadingMap]);

	/**
	 * 이미지 로드 완료 처리
	 */
	const markLoaded = useCallback((index: number) => {
		setLoadingMap(prev => {
			if (prev[index] === false) return prev;
			return { ...prev, [index]: false };
		});
	}, []);

	/**
	 * 슬라이드 변경 처리
	 */
	const handleAfterChange = useCallback<NonNullable<CarouselProps['afterChange']>>(current => {
		setActiveIndex(current);
		setLoadingMap(prev => {
			if (prev[current] === undefined) return { ...prev, [current]: true };
			return prev;
		});
	}, []);

	/**
	 * 현재 이미지 타이틀(타이틀은 imageItem.title 우선)
	 */
	const currentTitle = useMemo(() => {
		// if (items.length === 0) return props.titleFallback ?? '';
		// return items[activeIndex]?.title ?? props.titleFallback ?? '';

		return t('lbl.UNLOAD_PHOTO_VIEW');
	}, [activeIndex, items, props.titleFallback]);

	/**
	 * 닫기
	 */
	const handleClose = useCallback(() => {
		props.close?.();
	}, [props]);

	/**
	 * 이전/다음
	 */
	const handlePrev = useCallback(() => {
		//if (!props.open) return;
		if (!showArrows) return;
		if (!canNavigate) return;
		carouselRef.current?.prev?.();
	}, [showArrows, canNavigate]);

	const handleNext = useCallback(() => {
		//if (!props.open) return;
		if (!showArrows) return;
		if (!canNavigate) return;
		carouselRef.current?.next?.();
	}, [showArrows, canNavigate]);

	/**
	 * 키보드(ESC 닫기, 좌우 이동)
	 */
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			// 		if (e.key === 'Escape') {
			// 				handleClose();
			// 			return;
			// 		if (!showArrows) return;
			// 		if (!canNavigate) return;
			if (e.key === 'ArrowLeft') handlePrev();
			if (e.key === 'ArrowRight') handleNext();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [handleClose, handlePrev, handleNext, showArrows, canNavigate]);

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
							<Skeleton variant="text" width={'100%'} height={'100%'} />
						</LoadingOverlay>
					)}

					{downloadEnd && items.length === 0 ? (
						<Empty>{t('msg.MSG_COM_ERR_053')}</Empty>
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
});
export default CmIssuePicturePopup;

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
	border-radius: 1px;
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
	border-radius: 0px;
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
