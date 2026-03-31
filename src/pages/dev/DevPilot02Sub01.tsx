/*
 ############################################################################
 # FiledataField	: DevPilot02Sub01.tsx
 # Description		: 오라클 패키지 예제
 # Author			: sss
 # Since			: 	25.06.21		
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
import Constants from '@/util/constants';
import { Form } from 'antd';
// Libs

// Components
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';
import { showAlert, showConfirm } from '@/util/MessageUtil';
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

	// 컴포넌트 접근을 위한 Ref(2/4)
	const gridRef = useRef<any>(null);

	// 초기 값(3/4)
	const searchBox = {
		storerkey: useSelector((state: any) => state.global.globalVariable.gStorerkey),
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode),
	};

	// 기타(4/4)

	// 그리드
	const [gridData, setGridData] = useState([]); // 마스터그리드 데이터
	const [totalCnt, setTotalCnt] = useState(0); // 마스터그리드 카운트

	// 페이징
	const throttle = useThrottle(); // 페이징 조회 제한 함수
	const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
	const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
	const [pageSize] = useState(Constants.PAGE_INFO.PAGE_SIZE); // 페이지당 행 수

	// 그리드 속성
	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells', //드래그하여 cell 멀티셀렉트
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		//independentAllCheckBox: true,
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
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false }, // 물류센터
		{ dataField: 'storerkey', headerText: t('lbl.STORERKEY'), dataType: 'code', editable: false }, // 회사
		{ dataField: 'sku', headerText: t('lbl.SKUCD'), editable: false, dataType: 'code', filter: { showIcon: true } }, // 상품코드
		{ dataField: 'skuDescr', headerText: t('lbl.SKUNM'), editable: false, filter: { showIcon: true } }, // ..
		{ dataField: 'wharea', headerText: t('lbl.WHAREA'), editable: false },
		{ dataField: 'whareafloor', headerText: t('lbl.WHAREAFLOOR'), dataType: 'code', editable: false },
		{ dataField: 'loccategory', headerText: t('lbl.LOCCATEGORY'), editable: false },
		{ dataField: 'loclevel', headerText: t('lbl.LOCLEVEL'), editable: false },
		{ dataField: 'zone', headerText: t('lbl.ZONE'), editable: false },
		{ dataField: 'loc', headerText: t('lbl.LOC'), editable: false },
		{ dataField: 'abc', headerText: t('lbl.ABC'), dataType: 'code', editable: false },
		{ dataField: 'minpoqty', headerText: t('lbl.MINPOQTY'), dataType: 'numeric', editable: false },
		{ dataField: 'targetpoqty', headerText: t('lbl.TARGETPOQTY'), dataType: 'numeric', editable: false },
		{ dataField: 'effectivedate', headerText: t('lbl.EFFECTIVEDATE'), dataType: 'date', editable: false },
		{ dataField: 'other01', headerText: t('lbl.INVOICE_CRT_PRT_SEQ'), editable: false },
		{ dataField: 'other02', headerText: t('lbl.ALLOCFIXTYPE'), editable: false },
		{ dataField: 'other03', headerText: t('lbl.OTHER03'), editable: false },
		{ dataField: 'other04', headerText: t('lbl.OTHER04'), editable: false },
		{ dataField: 'other05', headerText: t('lbl.OTHER05'), editable: false },
		{ dataField: 'status', headerText: t('lbl.STATUS'), dataType: 'code', editable: false },
		{
			dataField: 'smsYn',
			headerText: t('lbl.SMS_YN'),
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN2', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'invoiceCrtType',
			headerText: t('lbl.INVOICE_CRT_TYPE'),
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('INVOICE_CRT_TYPE', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{ dataField: 'delYn', headerText: '', visible: false },
		{ dataField: 'serialkey', headerText: '', visible: false },
		{ dataField: 'cubeYn', headerText: t('lbl.CUBE_YN'), dataType: 'code', editable: false },
		{ dataField: 'addwho', headerText: t('lbl.ADDWHO'), editable: false },
		{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), dataType: 'date', editable: false },
		{ dataField: 'editwho', headerText: t('lbl.EDITWHO'), editable: false },
		{ dataField: 'editdate', headerText: t('lbl.EDITDATE'), dataType: 'date', editable: false },
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
		setCurrentPage(1);
		setTotalPages(1);
		gridRef.current.clearGridData();
		// 조회 조건 설정
		const params = {
			dccode: form.getFieldValue('dccode'),
			//
			startRow: 0,
			listCount: pageSize,
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
			if (res.data.list != null && res.data.list.length > 0) {
				setTotalCnt(res.data.list.length + totalCnt);
				setTotalPages(res.data.totalPages);
				setCurrentPage(res.data.pageNum);
				gridRef.current.appendData(res.data.list);
			}
		});
	};

	const apiSearchDevPilot02List = (params: any) => {
		return axios.get('/api/dev/pilot02/v1.0/getMasterList', { params }).then(res => res.data);
	};

	/**
	 * 목록 조회 및 스크롤 페이징
	 */
	const searchMasterScroll = throttle(() => {
		const tt = currentPage - 1;
		const params = {
			dccode: form.getFieldValue('dccode'),
			//
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		searchMasterImp(params);
	}, 500);

	/**
	 * 선택상품제외처리
	 */
	const onClickException = () => {
		const checkedRows = gridRef.current.getCheckedRowItemsAll();

		if (checkedRows.length < 1) {
			showAlert(null, t('com.msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.confirmSave'), () => {
			// 저장하시겠습니까?
			const params = {
				dccode: form.getFieldValue('dccode'),
				avc_COMMAND: 'CONFIRM',
				saveList: gridRef.current.getCheckedRowItemsAll(),
			};

			apiPostSaveInquiry(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
					return;
				}
			});
		});
	};

	/**
	 * 선택상품제외처리 - 템프table방식
	 */
	const onClickException2 = () => {
		const checkedRows = gridRef.current.getCheckedRowItemsAll();

		if (checkedRows.length < 1) {
			showAlert(null, t('com.msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// {0} 를/을 처리하시겠습니까?
		showConfirm(null, t('MSG_COM_CFM_020', '상품제외'), () => {
			// 저장하시겠습니까?
			const params = {
				dccode: form.getFieldValue('dccode'),
				avc_COMMAND: 'BATCHPROCESSCONFIRM',
				saveList: gridRef.current.getCheckedRowItemsAll(),
			};

			apiPostSaveInquiryByTempTable(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
					return;
				}
			});
		});
	};

	/**
	 * 선택상품제외처리 API
	 * @param {any} params 검색 조건
	 * @returns {object} 목록
	 */
	const apiPostSaveInquiryByTempTable = (params: any) => {
		return axios.post('/api/dev/pilot02/v1.0/saveInquiryByTempTable', params).then(res => res.data);
	};

	/**
	 * 선택상품제외처리 API
	 * @param {any} params 검색 조건
	 * @returns {object} 목록
	 */
	const apiPostSaveInquiry = (params: any) => {
		return axios.post('/api/dev/pilot02/v1.0/saveInquiry', params).then(res => res.data);
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

		/**
		 * 그리드 스크롤
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('vScrollChange', (event: any) => {
			if (event.position == event.maxPosition) {
				setCurrentPage((currentPage: any) => currentPage + 1);
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	});

	// grid data 변경 감지
	// useEffect(() => {
	// 	const gridRefCur = gridRef.current;
	// 	if (gridRefCur) {
	// 		gridRefCur?.setGridData(gridData);
	// 		gridRefCur?.setSelectionByIndex(0, 0);
	// 	}
	// }, [gridData]);

	/**
	 * currentPage 변경되면 조회 실행
	 */
	useEffect(() => {
		if (currentPage > 1) {
			searchMasterScroll();
		}
	}, [currentPage]);

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
				<GridTopBtn gridBtn={gridBtn} totalCnt={totalCnt}>
					{/* 실행하기 */}
					<Button type="default" size="small" onClick={() => onClickException()}>
						상품제외처리
					</Button>
					{/* 실행하기 */}
					<Button type="default" size="small" onClick={() => onClickException2()}>
						상품제외처리(Temp Table)
					</Button>
				</GridTopBtn>

				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default DevPilot02Sub;
