// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, Rangepicker, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import BatchManualExecPop from '@/publish/example/p/BatchManualExecPop';
import BatchParamSetPop from '@/publish/example/p/BatchParamSetPop';
import BatchScheduleSetPop from '@/publish/example/p/BatchScheduleSetPop';

// API

const BatchMng = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/* popup */
	const popModal1 = useRef(null);
	const popModal2 = useRef(null);
	const popModal3 = useRef(null);

	// POP 스케쥴 설정 열기
	const handleOpenPop1 = () => {
		popModal1.current?.handlerOpen();
	};
	// POP 스케쥴 설정 닫기
	const handleClosePop1 = () => {
		popModal1.current?.handlerClose();
	};

	// POP 인수 설정 열기
	const handleOpenPop2 = () => {
		popModal2.current?.handlerOpen();
	};
	// POP 인수 설정 닫기
	const handleClosePop2 = () => {
		popModal2.current?.handlerClose();
	};

	// // POP 수동 JOB 실행 열기
	const handleOpenPop3 = () => {
		popModal3.current?.handlerOpen();
	};
	// POP 수동 JOB 실행 닫기
	const handleClosePop3 = () => {
		popModal3.current?.handlerClose();
	};

	// POP 조회 팝업 콜백 예제
	// const handlePopPopupCallback = (data: any) => {
	// 	//console.log('Selected POP data:', data);

	// 	handleClosePopPopup();
	// };

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '코너코드',
			},
			{
				headerText: 'JOB 그룹',
			},
			{
				headerText: 'JOB 이름',
			},
			{
				headerText: 'JOB 설명',
			},
			{
				headerText: '작업 추가',
			},
			{
				headerText: '작업스케줄(cron)',
			},
			{
				headerText: '자연어로 표시',
			},
			{
				headerText: '인수 설정',
			},
			{
				headerText: '수동 실행',
			},
			{
				headerText: '타임아웃 설정(초)',
			},
			{
				headerText: '최근 수정(초)',
			},
			{
				headerText: '실행 시작시간',
			},
			{
				headerText: '실행 종료시간',
			},
			{
				headerText: '작업 상태',
			},
			{
				headerText: '소스 경로',
			},
			{
				headerText: '사용 여부',
			},
			{
				headerText: '등록자',
			},
			{
				headerText: '등록일시',
			},
			{
				headerText: '수정자',
			},
			{
				headerText: '수정 일자',
			},
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = () => {
		return {
			editable: true,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
			enableFilter: true,
		};
	};

	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'copy', // 행복사
					initValues: {
						menuId: '',
						regId: '',
						regDt: '',
					},
				},
				{
					btnType: 'curPlus', // 행삽입
				},
				{
					btnType: 'plus', // 행추가
					initValues: {
						menuYn: 0,
						useYn: 0,
					},
				},
				{
					btnType: 'delete', // 행삭제
				},
				{
					btnType: 'save', // 저장
				},
			],
		};

		return gridBtn;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" name={'배치 등록/수정'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label={'실행일자'} />
				</li>
				<li>
					<InputText label={'JOB 이름/설명'} placeholder="JOB 혹은 JOB 설명을 입력해주세요." />
				</li>
				<li>
					<SelectBox label={'작업 추가'} placeholder="전체" />
				</li>
				<li>
					<SelectBox label={'상태'} placeholder="전체" />
				</li>
				<li>
					<SelectBox label={'사용여부'} placeholder="전체" />
				</li>
			</SearchFormResponsive>

			<AGrid>
				<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} totalCnt={124}></GridTopBtn>
				<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
			</AGrid>

			<ButtonWrap>
				<Button size="middle" onClick={handleOpenPop1}>
					스케쥴 설정
				</Button>
				<Button size="middle" onClick={handleOpenPop2}>
					인수 설정
				</Button>
				<Button size="middle" onClick={handleOpenPop3}>
					수동 JOB 실행
				</Button>
			</ButtonWrap>
			<CustomModal ref={popModal1} width="600px">
				<BatchScheduleSetPop
					// callBack={handlePopPopupCallback}
					close={handleClosePop1}
					selectionMode="multipleRows"
				/>
			</CustomModal>
			<CustomModal ref={popModal2} width="720px">
				<BatchParamSetPop
					// callBack={handlePopPopupCallback}
					close={handleClosePop2}
					selectionMode="multipleRows"
				/>
			</CustomModal>
			<CustomModal ref={popModal3} width="720px">
				<BatchManualExecPop
					// callBack={handlePopPopupCallback}
					close={handleClosePop3}
					selectionMode="multipleRows"
				/>
			</CustomModal>
		</>
	);
});

export default BatchMng;
