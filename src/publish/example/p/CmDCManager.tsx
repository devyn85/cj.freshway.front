// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row } from 'antd';
// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// Store

// API

const CmDCManager = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const groupRef = useRef<HTMLUListElement>(null);
	const [expanded, setExpanded] = useState(false);

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
	const getGridCol = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '물류센터',
			},
			{
				headerText: '물류센터명',
			},
			{
				headerText: '접속서버',
			},
			{
				headerText: '접속데이터베이스',
			},
			{
				headerText: '접속유형',
			},
			{
				headerText: '센터유형',
			},
			{
				headerText: '대금청구거래처',
			},
			{
				headerText: '내역',
			},
			{
				headerText: '센터그룹',
			},
			{
				headerText: '회차',
			},
			{
				headerText: '권역구분',
			},
			{
				headerText: '권역코드',
			},
			{
				headerText: '경유지',
			},
			{
				headerText: '배송그룹',
			},
			{
				headerText: '납품서유형',
			},
			{
				headerText: '주출고처',
			},
			{
				headerText: '차량',
			},
			{
				headerText: '소유주명',
			},
			{
				headerText: '국가코드',
			},
			{
				headerText: '주,도',
			},
			{
				headerText: '시,읍,면',
			},
			{
				headerText: '우편번호',
			},
			{
				headerText: '기본주소',
			},
			{
				headerText: '상세주소',
			},
			{
				headerText: '전화번호1',
			},
			{
				headerText: '전화번호2',
			},
			{
				headerText: '팩스번호',
			},
			{
				headerText: '사업자 등록 등록번호',
			},
			{
				headerText: '사업자 등록 사업주명',
			},
			{
				headerText: '사업자 등록 업태',
			},
			{
				headerText: '사업자 등록 종목	',
			},
			{
				headerText: '사업자 등록 기본주소',
			},
			{
				headerText: '사업자 등록 상세주소',
			},
			{
				headerText: '사업자 등록 전화번호',
			},
			{
				headerText: '사업자 등록 팩스번호',
			},
			{
				headerText: '관리 사원명1',
			},
			{
				headerText: '관리 사원명2',
			},
			{
				headerText: '관리 사원 전화번호1',
			},
			{
				headerText: '관리 사원 전화번호2',
			},
			{
				headerText: '적용일자시작',
			},
			{
				headerText: '적용일자종료',
			},
			{
				headerText: '업무 시작 시간(24hr 2300)',
			},
			{
				headerText: '업무 종료 시간(24hr 2300)',
			},
			{
				headerText: '기본표시FLOATMASK',
			},
			{
				headerText: '메모',
			},
			{
				headerText: '인터페이스파일명',
			},
			{
				headerText: '진행상태',
			},
			{
				headerText: '삭제여부',
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
					btnType: 'save', // 저장
				},
			],
		};

		return gridBtn;
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
			},
		],
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
			<MenuTitle authority="searchYn|saveYn" name={'물류센터관리'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<SelectBox label={'물류센터'} />
				</li>
			</SearchFormResponsive>
			<Row gutter={8}>
				<Col span={12}>
					<AGrid>
						<GridTopBtn gridTitle={'물류센터 목록'} gridBtn={getGridBtn()} totalCnt={props.totalCnt} />
						<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} className="row-single" />
					</AGrid>
				</Col>
				<Col span={12}>
					<AGrid>
						<TableTopBtn tableTitle={'물류센터내역'} tableBtn={tableBtn} />
						<Row gutter={0}>
							<Col span={24}>
								<UiDetailViewArea>
									<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
										<li>
											<InputText label={'물류센터'} placeholder="물류센터 입력" />
										</li>
										<li>
											<InputText label={'물류센터명'} placeholder="물류센터명 선택" />
										</li>
										<li>
											<InputText label={'저속서버'} placeholder="저속서버 입력" />
										</li>
										<li>
											<InputText label={'접속데이터베이스'} placeholder="접속데이터베이스 입력" />
										</li>
										<li>
											<InputText label={'접속유형'} placeholder="접속유형 입력" />
										</li>
										<li>
											<SelectBox label={'SMS관리여부'} placeholder="SMS관리여부 입력" />
										</li>
										<li>
											<InputText label={'센터유형'} placeholder="센터유형 입력" />
										</li>
										<li>
											<InputText label={'대금청구거래처'} placeholder="대금청구거래처 입력" />
										</li>
										<li>
											<InputText label={'내역'} placeholder="내역 입력" />
										</li>
										<li>
											<InputText label={'센터그룹'} placeholder="센터그룹 입력" />
										</li>
										<li>
											<InputText label={'회차'} placeholder="회차 입력" />
										</li>
										<li>
											<InputText label={'권역구분'} placeholder="권역구분 입력" />
										</li>
										<li>
											<InputText label={'권역코드'} placeholder="권역코드 입력" />
										</li>
										<li>
											<InputText label={'경유지'} placeholder="경유지 입력" />
										</li>
										<li>
											<InputText label={'배송그룹'} placeholder="배송그룹 입력" />
										</li>
										<li>
											<InputText label={'납품서유형'} placeholder="납품서유형 입력" />
										</li>
										<li>
											<InputText label={'주출고처'} placeholder="주출고처  입력" />
										</li>
										<li>
											<InputText label={'차량 소유주명'} placeholder="차량 소유주명  입력" />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</Col>
							<Col span={24}>
								<UiDetailViewArea>
									<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
										<li>
											<InputText label={'국가코드'} placeholder="국가코드 입력" />
										</li>
										<li>
											<InputText label={'주,도'} placeholder="주,도 입력" />
										</li>
										<li>
											<InputText label={'시,읍,면'} placeholder="시,읍,면 입력" />
										</li>
										<li>
											<InputText label={'우편번호'} placeholder="우편번호 입력" />
										</li>
										<li style={{ gridColumn: '1 / span 2' }}>
											<InputText label={'기본주소'} placeholder="기본주소 입력" />
										</li>
										<li style={{ gridColumn: '1 / span 2' }}>
											<InputText label={'상세주소'} placeholder="상세주소 입력" />
										</li>
										<li>
											<InputText label={'전화번호1'} placeholder="전화번호1 입력" />
										</li>
										<li>
											<InputText label={'전화번호2'} placeholder="전화번호2 입력" />
										</li>
										<li>
											<InputText label={'팩스번호'} placeholder="팩스번호 입력" />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</Col>
							<Col span={24}>
								<UiDetailViewArea>
									<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
										<li>
											<InputText label={'사업자 등록 등록번호'} placeholder="사업자 등록 등록번호 입력" />
										</li>
										<li>
											<InputText label={'사업자 등록 사업주명'} placeholder="사업자 등록 사업주명 입력" />
										</li>
										<li>
											<InputText label={'사업자 등록 형태'} placeholder="사업자 등록 형태 입력" />
										</li>
										<li>
											<InputText label={'사업자 등록 종목'} placeholder="사업자 등록 종목 입력" />
										</li>
										<li style={{ gridColumn: '1 / span 2' }}>
											<InputText label={'사업자 등록 기본주소'} placeholder="사업자 등록 기본주소 입력" />
										</li>
										<li style={{ gridColumn: '1 / span 2' }}>
											<InputText label={'사업자 등록 상세주소'} placeholder="사업자 등록 상세주소 입력" />
										</li>
										<li>
											<InputText label={'사업자 등록 전화번호'} placeholder="사업자 등록 전화번호 입력" />
										</li>
										<li>
											<InputText label={'사업자 등록 팩스번호'} placeholder="사업자 등록 팩스번호 입력" />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</Col>
							<Col span={24}>
								<UiDetailViewArea>
									<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
										<li>
											<InputText label={'관리 사원명1'} placeholder="관리 사원명1 입력" />
										</li>
										<li>
											<InputText label={'관리 사원 전화번호1'} placeholder="관리 사원 전화번호1 입력" />
										</li>
										<li>
											<InputText label={'관리 사원명2'} placeholder="관리 사원명2 입력" />
										</li>
										<li>
											<InputText label={'관리 사원 전화번호2'} placeholder="관리 사원 전화번호2 입력" />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</Col>
							<Col span={24}>
								<UiDetailViewArea>
									<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
										<li>
											<InputText label={'적용일자시작'} placeholder="적용일자시작 입력" />
										</li>
										<li>
											<InputText label={'적용일자종료'} placeholder="적용일자종료 입력" />
										</li>
										<li>
											<InputText label={'업무 시작 시간(24h)'} placeholder="업무 시작 시간(24hr 2300) 입력" />
										</li>
										<li>
											<InputText label={'업무 종료 시간(24h)'} placeholder="업무 종료 시간(24hr 2300) 입력" />
										</li>
										<li>
											<InputText label={'기본표시FALOTMASK'} placeholder="기본표시FALOTMASK 입력" />
										</li>
										<li style={{ gridColumn: '1 / span 2' }}>
											<InputText label={'메모'} placeholder="메모 입력" />
										</li>
										<li>
											<InputText label={'인터페이스파일명'} placeholder="인터페이스파일명 입력" />
										</li>
										<li>
											<InputText label={'진행상태'} placeholder="진행상태 입력" />
										</li>
										<li>
											<InputText label={'삭제여부'} placeholder="삭제여부 입력" />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</Col>
							<Col span={24}>
								<UiDetailViewArea>
									<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
										<li>
											<DatePicker label={'등록일자'} />
										</li>
										<li>
											<DatePicker label={'최종변경시간'} />
										</li>
										<li>
											<InputText label={'생성인'} placeholder="생성인 입력" />
										</li>
										<li>
											<InputText label={'최정변경자'} placeholder="최정변경자 입력" />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</Col>
						</Row>
					</AGrid>
				</Col>
			</Row>
		</>
	);
});

export default CmDCManager;
