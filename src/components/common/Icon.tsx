import React from 'react';

interface IconProps {
	icon: string;
	text?: string;
	className?: string;
	onClick?: any;
}

const Icon = ({ icon, text, className, onClick }: IconProps) => {
	const ref = useRef<React.JSXElementConstructor<any> | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
	}, [icon]);

	useEffect(() => {
		const getSvg = async () => {
			try {
				/**
				 * dynamic import 사용 시 `상대경로/${파일명}.확장자` 구조로 정확히 명시해주어야합니다.
				 * [참고] https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
				 * 위 구조 미준수 시, build할 때 webpack에서 해당 경로의 불필요한 파일까지 번들링할 수 있으므로 정책적으로 막혀있습니다.
				 * 따라서, 해당 파일들이 번들링되지 않아 import 되지 않으니 유의바랍니다.
				 * [참고] https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
				 */
				const svgIcon = await import(`../../assets/img/icon/${icon}.svg`);
				ref.current = svgIcon.default as unknown as React.JSXElementConstructor<any>;
				setLoading(false);
			} catch (error) {
				ref.current = null;
				setLoading(false);
			}
		};
		if (loading && icon) {
			getSvg();
		}
	}, [icon, loading]);

	return (
		<>
			{ref.current && <ref.current className={className} onClick={onClick} />}
			{text}
		</>
	);
};

export default memo(Icon);
