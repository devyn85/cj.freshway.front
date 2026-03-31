/*
 ############################################################################
 # FiledataField	: CmLoginHistoryPopup.tsx
 # Description		: 접속이력 팝업
 # Author			: KimJiSoo
 # Since			: 25.10.24
 ############################################################################
*/
// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils

// Store

// API Call Function
import { apiGetLoginHistory } from '@/api/cm/apiCmLogin';
import AGrid from '@/assets/styled/AGrid/AGrid';

interface PropsType {
	close?: any;
}

const CmLoginHistoryPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	const { t } = useTranslation();
	const gridRef = useRef<any>(); // 그리드 Ref
	const [totalCnt, setTotalCnt] = useState(0); // 총 개수

	// const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: 'Login',
			dataField: 'loginDt',
		},
		{
			headerText: 'Logout',
			dataField: 'lotDt',
		},
		{
			headerText: '접속 IP',
			dataField: 'loginIp',
			dataType: 'code',
		},
		{
			headerText: '성공여부',
			dataField: 'loginSuccYn',
			dataType: 'code',
		},
	];

	const gridProps = {
		editable: false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 데이터 조회 (API 호출)
	 */
	const fetchGridData = () => {
		// 검색 버튼 클릭 시 또는 초기 로드 시 페이지 리셋
		gridRef.current?.clearGridData();

		apiGetLoginHistory().then(res => {
			gridRef.current?.setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		fetchGridData();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="접속이력" />

			{/* 상단에 총 건수 사용시 주석해제 */}
			{/* <TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCnt)}건</span>
			</TotalCount> */}

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} type="primary" onClick={close}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmLoginHistoryPopup;
