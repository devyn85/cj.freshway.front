import { useCallback, useRef, useState } from 'react';

export const useGridResize = (gridRefs: React.RefObject<any>[]) => {
	const [isResizing, setIsResizing] = useState(false);
	const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const performResize = useCallback(
		(delay: number = 150) => {
			if (isResizing) return;

			if (resizeTimeoutRef.current) {
				clearTimeout(resizeTimeoutRef.current);
			}

			resizeTimeoutRef.current = setTimeout(() => {
				setIsResizing(true);

				try {
					gridRefs.forEach(gridRef => {
						if (gridRef.current?.resize) {
							gridRef.current.resize();
						}
					});
				} catch (error) {
				} finally {
					setTimeout(() => setIsResizing(false), 100);
				}
			}, delay);
		},
		[gridRefs, isResizing],
	);

	return { performResize };
};

// // 사용 예시
// const DistrictGroupDetail = forwardRef((props: any, ref: any) => {
//     const { performResize } = useGridResize([ref.gridRefGrp, ref.gridRefDtl]);

//     useEffect(() => {
//         performResize(200); // 마운트 시에만
//     }, []);

//     // ...
// });
