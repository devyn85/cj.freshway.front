import type { CSSProperties, HTMLAttributes } from 'react';
import { forwardRef, useMemo } from 'react';

type SkeletonVariant = 'text' | 'rectangular' | 'rounded' | 'circular';
type SkeletonAnimation = 'pulse' | 'wave' | false;

export type SkeletonProps = HTMLAttributes<HTMLSpanElement> & {
	variant?: SkeletonVariant;
	animation?: SkeletonAnimation;
	width?: number | string;
	height?: number | string;
	radius?: number | string;
};

// * 숫자/문자열 사이즈를 CSS size로 정규화
const toCssSize = (v?: number | string) => {
	if (v === undefined) return undefined;
	return typeof v === 'number' ? `${v}px` : v;
};

// * variant 기반 border-radius 계산
const getRadius = (variant: SkeletonVariant, radius?: number | string) => {
	if (radius !== undefined) return toCssSize(radius);
	if (variant === 'circular') return '9999px';
	if (variant === 'rounded') return '12px';
	if (variant === 'text') return '6px';
	return '6px';
};

// * variant별 기본 높이(명시가 없을 때)
const getDefaultHeight = (variant: SkeletonVariant) => {
	if (variant === 'text') return '1em';
	if (variant === 'circular') return '40px';
	return '40px';
};

const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
	({ variant = 'text', animation = 'wave', width, height, radius, style, ...rest }, ref) => {
		const w = useMemo(() => toCssSize(width), [width]);
		const h = useMemo(() => toCssSize(height), [height]);
		const r = useMemo(() => getRadius(variant, radius), [variant, radius]);

		const rootStyle: CSSProperties = {
			display: 'inline-block',
			position: 'relative',
			overflow: 'hidden',
			userSelect: 'none',
			width: w ?? '100%',
			height: h ?? getDefaultHeight(variant),
			borderRadius: r,
			backgroundColor: '#E5E7EB',
			color: 'transparent',
			...(variant === 'text'
				? {
						transform: 'scale(1, 0.6)',
						transformOrigin: '0 55%',
				  }
				: null),
			...(style as CSSProperties),
		};

		return (
			<>
				<span ref={ref} aria-busy="true" aria-live="polite" style={rootStyle} {...rest}>
					{animation === 'wave' ? (
						<span
							style={{
								position: 'absolute',
								inset: 0,
								transform: 'translateX(-100%)',
								background:
									'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
								animation: 'skeleton-wave 1.6s ease-in-out 0.3s infinite',
							}}
						/>
					) : null}
				</span>

				{animation === 'pulse' ? (
					<style>
						{`
              @keyframes skeleton-pulse {
                0% { opacity: 1; }
                50% { opacity: 0.45; }
                100% { opacity: 1; }
              }
            `}
					</style>
				) : null}

				{animation === 'wave' ? (
					<style>
						{`
              @keyframes skeleton-wave {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}
					</style>
				) : null}

				{animation === 'pulse' ? (
					<style>
						{`
              [data-skeleton-pulse="true"] {
                animation: skeleton-pulse 1.5s ease-in-out 0.5s infinite;
              }
            `}
					</style>
				) : null}
			</>
		);
	},
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
