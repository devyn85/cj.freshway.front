/*
 ############################################################################
 # FiledataField	: DevPilot02Sub02.tsx
 # Description		: 개인정보 마스킹 예제
 # Author			: sss
 # Since			: 23.08.21
 ############################################################################
*/
import axios from '@/api/Axios';
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { Button, SearchForm } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
// Libs

// Components
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// Hooks
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { useSelector } from 'react-redux';

interface Props {
	menuName: string;
}

const DevPilot02Sub = forwardRef<any, Props>((props, ref) => {
	/**
	 * 부모에서 호출 시 useImperativeHandle을 통해 서브 컴포넌트의 메서드를 호출할 수 있도록 설정
	 * 		- searchMaster: 서브 컴포넌트의 searchMaster를 호출
	 * 		- resetFn: 서브 컴포넌트의 resetFn을 호출
	 */
	useImperativeHandle(ref, () => ({
		searchMaster,
		resetFn,
	}));

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const [form] = Form.useForm(); // Antd Form
	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파마리터

	// 컴포넌트 접근을 위한 Ref(2/4)
	const gridRef = useRef<any>(null);
	const refModal = useRef<any>(null);

	// 초기 값(3/4)
	const searchBox = {
		storerkey: useSelector((state: any) => state.global.globalVariable.gStorerkey),
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode),
	};

	// 기타(4/4)

	// 그리드
	const [gridData, setGridData] = useState([]); // 마스터그리드 데이터
	const [totalCnt, setTotalCnt] = useState(0); // 마스터그리드 카운트

	// 그리드 속성
	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells', //드래그하여 cell 멀티셀렉트
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		independentAllCheckBox: false,
		// fixedColumnCount: 2,
		fillColumnSizeMode: false,
		showFooter: true,
		showDragKnobColumn: false, // 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
		enableDrag: false, // 드래깅 행 이동 가능 여부 (기본값 : false)
		enableMultipleDrag: false, // 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		enableDragByCellDrag: true, // 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDrop: false, // 드랍 가능 여부 (기본값 : true)

		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
			if (item.delYn == 'N') {
				//return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	const gridCol = [
		{ dataField: 'empNo', headerText: '사번', dataType: 'code', editable: false }, // 번호
		{ dataField: 'name', headerText: '이름', dataType: 'code', editable: false }, // 이름
		{ dataField: 'engName', headerText: '영문이름', dataType: 'code', editable: false }, // 영문이름
		{ dataField: 'telNo', headerText: '전화번호', dataType: 'code', editable: false }, // 전화번호
		{ dataField: 'addr', headerText: '주소', dataType: 'code', editable: false }, // 주소
		{ dataField: 'email', headerText: 'email', dataType: 'code', editable: false }, // email
		{ dataField: 'jumin', headerText: '주민등록번호', dataType: 'code', editable: false }, // 주민등록번호
		{ dataField: 'birth', headerText: '생일', dataType: 'code', editable: false }, // 생일
		{ dataField: 'jumin', headerText: '주민등록번호', dataType: 'code', editable: false }, // 주민등록번호
		{ dataField: 'drvLicense', headerText: '운전면허', dataType: 'code', editable: false }, // 운전면허
		{ dataField: 'passport', headerText: '여권', dataType: 'code', editable: false }, // 여권
		{ dataField: 'cashCard', headerText: '카드번호1', dataType: 'code', editable: false }, // 카드번호1
		{ dataField: 'creditCard', headerText: '카드번호2', dataType: 'code', editable: false }, // 카드번호2
		{ dataField: 'etcCard', headerText: '카드번호3', dataType: 'code', editable: false }, // 카드번호3
		{ dataField: 'bizNo', headerText: '사업자번호', dataType: 'code', editable: false }, // 사업자번호
		{ dataField: 'accountNo', headerText: '계좌번호', dataType: 'code', editable: false }, // 계좌번호
		{ dataField: 'qrCd', headerText: 'QR', dataType: 'code', editable: false }, // QR
		{ dataField: 'ip', headerText: 'ip', dataType: 'code', editable: false }, // ip
		{ dataField: 'id', headerText: 'id', dataType: 'code', editable: false }, // id
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 초기화
	 */
	const resetFn = () => {
		gridRef.current.clearGridData();
		form.resetFields();
	};

	/**
	 * 조회
	 */
	const searchMaster = async () => {
		gridRef.current.clearGridData();
		// 조회 조건 설정
		const params = {
			docno: form.getFieldValue('docno'),
		};

		searchMasterImp(params);
	};

	/**
	 * 조회 구현 함수
	 * @param params
	 */
	const searchMasterImp = (params: any) => {
		// API 호출
		apiSearchDevPilot02List(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				gridRef.current.setGridData(res.data);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current?.setColumnSizeList(gridRef.current?.getFitColumnSizeList(true));
			}
		});
	};

	const apiSearchDevPilot02List = (params: any) => {
		return axios.get('/api/dev/pilot02/v1.0/getMaskingList', { params }).then(res => res.data);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		reset: resetFn, // 초기화
		searchYn: searchMaster, // 조회
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});
	};

	/**
	 * 팝업 열기 이벤트
	 * @param params
	 */
	const fnCmIndividualPopup = (params: any) => {
		setPopUpParams(params);
		refModal.current.handlerOpen();
	};

	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent = () => {
		refModal.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	//화면 초기 세팅
	useEffect(() => {
		// 더블 클릭 시
		gridRef.current.bind('cellDoubleClick', async (event: { dataField: string; value: any; rowIndex: number }) => {
			const params = { url: '', individualKey: '', empNo: '' }; // 팝업 파라미터 초기화
			params.url = '/api/dev/pilot02/v1.0/getMaskingList'; // 팝업 URL 설정
			params.empNo = gridRef.current.getCellValue(event.rowIndex, 'empNo'); // 사번 설정

			if (event.dataField === 'name') {
				params.individualKey = 'name'; // 개인정보 키 설정 - 이름
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'engName') {
				params.individualKey = 'engName'; // 개인정보 키 설정 - 영문이름
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'addr') {
				params.individualKey = 'addr'; // 개인정보 키 설정 - 주소
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'telNo') {
				params.individualKey = 'telNo'; // 개인정보 키 설정 - 전화번호
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'email') {
				params.individualKey = 'email'; // 개인정보 키 설정 - 이메일
				fnCmIndividualPopup(params);
			}
		});
	}, []);

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
				<Button
					onClick={() => resetFn()}
					icon={<IcoSvg data={icoSvgData.icoRefresh} label={'새로고침'} />}
					style={{ marginRight: '1px' }}
				/>
				<Button type="secondary" onClick={() => searchMaster()}>
					{'조회'}
				</Button>
			</div>
			<div style={{ height: 'auto' }}>
				{/* START.검색 영역 정의 */}
				<SearchForm form={form} initialValues={searchBox}>
					<UiFilterArea>
						<UiFilterGroup>
							<li>
								<span>
									<CmGMultiDccodeSelectBox
										name="dccode"
										label={t('lbl.DCCODE')}
										span={24}
										placeholder="선택해주세요"
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</span>
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>
				{/* END.검색 영역 정의 */}
			</div>

			<AGrid dataProps={'row-single'}>
				<GridTopBtn gridBtn={gridBtn} totalCnt={totalCnt}></GridTopBtn>

				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={refModal} width="700px">
				<CmIndividualPopup popUpParams={popUpParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default DevPilot02Sub;
