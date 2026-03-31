/**
 * 최초 렌더링을 제외하고 useEffect 실행 시
 * @param {Function} func 실행할 함수
 * @param {*} deps 감지 대상
 * @returns {void}
 */
const useDidMountEffect = (func: any, deps: any) => {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) func();
		else didMount.current = true;
	}, deps);
};

export default useDidMountEffect;
