// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row } from 'antd';

// Util

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import { InputText, Rangepicker, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const BatchHistory = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const isopen = props.isopen; // 부모 컴포넌트에서 isopen prop을 받아옴

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol1 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '코너코드',
			},
			{
				headerText: 'JOB 이름',
			},
			{
				headerText: 'JOB 실행 ID',
			},
			{
				headerText: 'JOB 인스턴스 ID',
			},
			{
				headerText: '실행 시작시간',
			},
			{
				headerText: '실행 종료시간',
			},
			{
				headerText: '작업소요시간(초)',
			},
			{
				headerText: 'JOB 결과',
			},
			{
				headerText: '메시지',
			},
		];
	};
	const getGridCol2 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: 'Step 실행 ID',
			},
			{
				headerText: 'Step 이름',
			},
			{
				headerText: 'Step 시작 시간',
			},
			{
				headerText: 'Step 종료 시간',
			},
			{
				headerText: 'Read 건수',
			},
			{
				headerText: 'Commit 건수',
			},
			{
				headerText: 'Skip 건수',
			},
			{
				headerText: 'Rollback 건수',
			},
			{
				headerText: 'Step 작업결과',
			},
		];
	};
	const getGridCol3 = () => {
		return [
			{
				headerText: '파라미터 이름',
			},
			{
				headerText: '파라미터 타입',
			},
			{
				headerText: '파라미터 값',
			},
		];
	};
	const getGridCol4 = () => {
		return [
			{
				dataField: 'empNo',
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
			<MenuTitle authority="searchYn|saveYn" name={'배치 이력 조회'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label={'실행일자'} />
				</li>
				<li>
					<InputText label={'JOB 이름'} placeholder="JOB을 입력해주세요" />
				</li>
				<li>
					<SelectBox label={'JOB 상태'} placeholder="전체" />
				</li>
				<li>
					<SelectBox label={'Step 상태'} placeholder="전체" />
				</li>
				<li>
					<InputText label={'JOB 실행ID'} placeholder="JOB 실행ID를 입력해주세요" />
				</li>
				<li>
					<InputText label={'JOB 인스턴스 ID'} placeholder="JOB 인스턴스 ID를 입력해주세요" />
				</li>
			</SearchFormResponsive>

			<Row gutter={12}>
				<Col span={10}>
					<AGrid>
						<GridTopBtn gridTitle={'JOB 이력'} gridBtn={getGridBtn()} totalCnt={124}></GridTopBtn>
						<AUIGrid columnLayout={getGridCol1()} gridProps={getGridProps()} />
					</AGrid>
				</Col>
				<Col span={14}>
					<AGrid>
						<GridTopBtn gridTitle={'Step 이력'} gridBtn={getGridBtn()}></GridTopBtn>
						<AUIGrid columnLayout={getGridCol2()} gridProps={getGridProps()} />
					</AGrid>
					<Row gutter={12}>
						<Col span={8}>
							<AGrid>
								<GridTopBtn gridTitle={'JOB PARAM'} gridBtn={getGridBtn()}></GridTopBtn>
								<AUIGrid columnLayout={getGridCol3()} gridProps={getGridProps()} />
							</AGrid>
						</Col>
						<Col span={16}>
							<AGrid>
								<GridTopBtn gridTitle={'DB 이력'} gridBtn={getGridBtn()}></GridTopBtn>
								<AUIGrid columnLayout={getGridCol4()} gridProps={getGridProps()} />
							</AGrid>
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
});

export default BatchHistory;
