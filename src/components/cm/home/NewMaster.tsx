/*
 ############################################################################
 # FiledataField	: CmCode.tsx
 # Description		: 코드마스터 
 # Author			: JangGwangSeok
 # Since			: 25.04.30
 ############################################################################
 */

// Lib
import { Form } from 'antd';

// Component
import NewMasterDetail from '@/components/cm/home/NewMasterDetail';
import NewMasterSearch from '@/components/cm/home/NewMasterSearch';
import { SearchFormResponsive } from '@/components/common/custom/form';

// API Call Function
import { apiGetKpDcNewMasterList } from '@/api/kp/apiDcMonitoring';

// Store
import { useAppSelector } from '@/store/core/coreHook';
import styled from 'styled-components';

const NewMaster = ({ isActive }: { isActive: boolean }) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	// Antd Form 사용
	const [form] = Form.useForm();

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// grid data
	const prevValue = useRef(null);
	const [isFirst, setFirst] = useState(true);
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const initialized = useAppSelector(state => state.menu.initialized); // fetchInitApi 초기값 설정 완료 여부

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 신규 마스터 정보 조회
	 * @returns {void}
	 */
	const getNewMaster = () => {
		if (!initialized) return false;
		if (!isActive) return false;

		const params = form.getFieldsValue();

		if (commUtil.isEmpty(params['fixdccode'])) {
			return false;
		}

		//keep-alive 무시 처리
		if (JSON.stringify(prevValue.current) === JSON.stringify(params)) {
			return;
		}

		prevValue.current = params;

		// 그리드 초기화
		refs.gridRefGrp.current.clearGridData();
		refs.gridRefDtl.current.clearGridData();

		apiGetKpDcNewMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);

			// 데이터 바인딩 후 컬럼 폭 최적화
			setTimeout(refreshGridSize, 100);

			// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
			refs.gridRefGrp?.current?.setColumnSizeList(refs.gridRefGrp?.current?.getFitColumnSizeList(true));
		});
	};

	// 신규 마스터 그리드 칼럼 레이아웃 설정
	// 그리드 리사이즈 및 컬럼 비율 재조정 함수
	const refreshGridSize = () => {
		const grp = refs.gridRefGrp.current;
		const dtl = refs.gridRefDtl.current;

		if (grp) {
			grp.resize(); // 프레임 리사이즈
			// fillColumnSizeMode 옵션을 다시 계산하여 컬럼 너비 복구
			grp.setColumnSizeList(grp.getFitColumnSizeList(true));
		}
		if (dtl) {
			dtl.resize();
			dtl.setColumnSizeList(dtl.getFitColumnSizeList(true));
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 슬라이드 active 됐을때만 로직 실행
		if (isFirst && isActive && initialized) {
			// 신규 마스터 정보 조회
			getNewMaster();
			setFirst(false);
		}
	}, [isActive, initialized]);

	// 2. 브라우저 리사이즈 대응 (디바운싱 적용)
	useEffect(() => {
		let timer: any;
		const onResize = () => {
			// 홈 화면일 경우에만 리사이즈 처리
			if (!window.location.pathname.includes('/home') || !isActive) return;

			clearTimeout(timer);
			timer = setTimeout(() => {
				refreshGridSize();
			}, 150); // 리사이즈가 끝난 뒤 실행
		};

		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
			clearTimeout(timer);
		};
	}, [isActive]);

	return (
		<Wrap>
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form}>
				<NewMasterSearch form={form} search={getNewMaster} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<NewMasterDetail
				isActive={isActive}
				ref={refs}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={getNewMaster}
				form={form}
			/>
		</Wrap>
	);
};

const Wrap = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;

export default NewMaster;
