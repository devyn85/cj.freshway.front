// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Col, Form, Row } from 'antd';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmReceivePopup from '@/components/cm/popup/CmReceivePopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { CheckBox, Datepicker, InputText, InputTextArea, SearchForm, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// API
import { apiGetCmCodeDetailList } from '@/api/cm/apiCmCode';

const CbCommunityDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const modalRef = useRef(null);

	// grid data
	const [selItem, setSelItem] = useState<any>({});

	// grid Ref
	ref.gridRefMaster = useRef();
	ref.gridRefFile = useRef();
	ref.gridRefRcv = useRef();

	// 사용자 상세 입력 폼
	const [formDtl] = Form.useForm();

	// 공지사항 그리드 칼럼 레이아웃 설정
	const gridColMaster = [
		{
			headerText: '제목',
			dataField: '제목',
		},
		{
			headerText: '등록자',
			dataField: '등록자',
		},
		{
			headerText: '등록일시',
			dataField: '등록일시',
			dataType: 'date',
		},
	];

	// 공지사항 그리드 속성 설정
	const gridPropsMaster = {
		editable: true,
		showRowCheckColumn: true,
	};

	// 첨부파일 그리드 칼럼 레이아웃 설정
	const gridColFile = [
		{
			headerText: 'FILE_NM',
			dataField: 'FILE_NM',
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {},
			},
		},
		{
			headerText: 'FILE_SIZE',
			dataField: 'FILE_SIZE',
		},
	];

	// 첨부파일 그리드 속성 설정
	const gridPropsFile = {
		editable: true,
		showRowCheckColumn: true,
	};

	// 수신처 그리드 칼럼 레이아웃 설정
	const gridColRcv = [
		{
			headerText: '수신처유형',
			dataField: '수신처유형',
		},
		{
			headerText: '수신처명',
			dataField: '수신처명',
		},
	];

	// 수신처 그리드 속성 설정
	const gridPropsRcv = {
		editable: true,
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 코드 상세 조회
	 * @param {string} basecode 공통 그룹 코드
	 * @returns {void}
	 */
	const searchDtl = (basecode: string) => {
		if (commUtil.isNull(basecode)) {
			const selectedRow = ref.gridRefMaster.current.getSelectedRows();
			if (selectedRow.length > 0 && !ref.gridRefMaster.current.isAddedById(selectedRow[0]._$uid)) {
				setSelItem(selectedRow[0]);

				const params = {
					storerkey: selectedRow[0].storerkey,
					codelist: selectedRow[0].basecode,
				};
				apiGetCmCodeDetailList(params).then(res => {
					// const gridData = res.data;
				});
			} else {
				return;
			}
		}
	};

	// 공지사항 그리드 버튼 설정
	const gridBtnMaster: GridBtnPropsType = {
		tGridRef: ref.gridRefMaster, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
			},
			{
				btnType: 'print', // 행추가
			},
		],
	};

	// 공지사항 상세 버튼 설정
	const tableBtnDetail: TableBtnPropsType = {
		tGridRef: ref.gridRefMaster, // 사용자 목록 그리드 Ref
		btnArr: [
			{
				btnType: 'pre', // 이전
			},
			{
				btnType: 'post', // 다음
			},
			{
				btnType: 'new', // 신규
			},
		],
	};

	// 첨부파일 그리드 버튼 설정
	const gridBtnFile: GridBtnPropsType = {
		tGridRef: ref.gridRefFile, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete', // 행삭제
			},
		],
	};

	// 수신처 그리드 버튼 설정
	const gridBtnRcv: GridBtnPropsType = {
		tGridRef: ref.gridRefRcv, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete', // 행삭제
			},
		],
	};

	/**
	 * 수신처 검색 팝업
	 */
	const onClickReceivePopup = () => {
		modalRef.current.handlerOpen();
	};

	/**
	 * 수신처 검색 팝업 닫기
	 */
	const closeEventReceivePopup = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		const gridDataMaster = [
			{
				제목: '2025년 3/4분기 CJ프레시웨이 서버 작업',
				등록자: 'dev01',
				등록일시: '2025-07-11',
			},
			{
				제목: '[공지] 피킹(원거리)유형 미정의 관리처 리스트 오픈',
				등록자: 'dev01',
				등록일시: '2025-07-09',
			},
			{
				제목: '반품판정처리 수정 건',
				등록자: 'dev01',
				등록일시: '2025-07-01',
			},
		];

		const gridDataFile = [
			{
				FILE_NM: '재교비교_1월.xls',
				FILE_SIZE: '14 KB',
			},
			{
				FILE_NM: '수불비교_1월.xls',
				FILE_SIZE: '100 KB',
			},
		];

		const gridDataRcv = [
			{
				수신처유형: '수신그룹',
				수신처명: '센터관리자',
			},
			{
				수신처유형: '수신그룹',
				수신처명: '이천물류센터',
			},
			{
				수신처유형: '사용자',
				수신처명: '홍길동',
			},
			{
				수신처유형: '사용자',
				수신처명: '코난',
			},
			{
				수신처유형: '사용자',
				수신처명: '둘리',
			},
		];

		// TO-DO(GS) : 추후 테스트 DATA 삭제
		setTimeout(() => {
			ref.gridRefMaster.current?.setGridData(gridDataMaster);
			ref.gridRefFile.current?.setGridData(gridDataFile);
			ref.gridRefRcv.current?.setGridData(gridDataRcv);
		});
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRefMaster.current;

		// 마스터 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function () {
			// 상세코드 조회
			searchDtl(null);
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRefMaster.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			<AGridWrap>
				<AGrid>
					<GridTopBtn gridBtn={gridBtnMaster} gridTitle={'목록'} totalCnt={props.totalCnt} />
					<AUIGrid ref={ref.gridRefMaster} columnLayout={gridColMaster} gridProps={gridPropsMaster} />
				</AGrid>

				<Row gutter={[16, 16]}>
					<Col span={10}>
						<AGrid>
							<TableTopBtn tableTitle={'상세'} tableBtn={tableBtnDetail} />
							<SearchForm form={formDtl}>
								<UiDetailViewArea>
									<UiDetailViewGroup>
										<li className="col-1">
											<SelectBox
												name="brdDocDivCd"
												label={'문서유형'}
												initval={'NOTICE'}
												options={getCommonCodeList('COMMUNITYTYPE')}
												fieldNames={{ label: 'cdNm', value: 'comCd' }}
												disabled={true}
											/>
										</li>
										<li className="col-2">
											<CheckBox name={'팝업 노출 여부'} label="팝업 노출 여부" />
										</li>
										<li className="col-2">
											<Datepicker label="게시종료일자" name="게시종료일자" allowClear />
										</li>
										<li className="col-1">
											<InputText label={'제목'} />
										</li>
										<li className="col-1">
											<InputTextArea label={'내용'} rows={15} />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</SearchForm>
						</AGrid>
					</Col>
					<Col span={7}>
						<AGrid>
							<GridTopBtn gridBtn={gridBtnFile} gridTitle={'첨부파일'}>
								<Button>파일추가</Button>
							</GridTopBtn>
							<AUIGrid ref={ref.gridRefFile} columnLayout={gridColFile} gridProps={gridPropsFile} />
						</AGrid>
					</Col>
					<Col span={7}>
						<AGrid>
							<GridTopBtn gridBtn={gridBtnRcv} gridTitle={'수신처'}>
								<Button onClick={onClickReceivePopup}>수신처추가</Button>
							</GridTopBtn>
							<AUIGrid ref={ref.gridRefRcv} columnLayout={gridColRcv} gridProps={gridPropsRcv} />
						</AGrid>
					</Col>
				</Row>
			</AGridWrap>
			<CustomModal ref={modalRef} width="900px">
				<CmReceivePopup close={closeEventReceivePopup} />
			</CustomModal>
		</>
	);
});

export default CbCommunityDetail;
