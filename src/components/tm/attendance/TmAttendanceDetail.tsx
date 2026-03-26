/*
 ############################################################################
 # FiledataField	: TmAttendanceDetail.tsx
 # Description		: 근태관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.16
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import { GridBtnPropsType } from '@/types/common';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
//types
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiSaveMasterList } from '@/api/tm/apiTmAttendance';
//store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

const TmAttendanceDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const refModal = useRef(null);
	const [dtlListCnt, setDtlListCnt] = useState(0);
	/**
	 * 공통함수 호출 ([comCd]cdNm형으로 변형)
	 * @param rowIndex
	 * @param columnIndex
	 * @param value
	 * @returns
	 */

	const getCarCapCityTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};
	const getContractTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
	};

	//물류센터 공통코드 호출
	const getCustomCommonCodeList = (rowIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('WMS_MNG_DC');
		const convert = list.map(item => ({
			...item,
			display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.display : null;
	};

	// useMemo를 사용하여 attendanceCodeList가 렌더링 시마다 재생성되는 것을 방지합니다.
	const attendanceCodeList = useMemo(() => {
		// 근태코드에서 DATA1의 값이 'Y'인 데이터만 표시
		const allowedCodes = getCommonCodeList('ATTENDANCE_TYPE', ' ', '').filter(item => item.data1 === 'Y');
		allowedCodes.unshift({ comCd: '', cdNm: '' });
		return allowedCodes;
	}, []); // 의존성 배열이 비어 있으므로 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.

	const gridCol = [
		{
			dataField: 'defDccode',
			headerText: t('lbl.DEF_DCCODE'), //기본센터
			dataType: 'code',
			width: 120,
			editable: false,
			style: 'ta-c',
			labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'description',
			headerText: t('lbl.CARRIER'), //운송사
			dataType: 'code',
			width: 120,
			style: 'ta-c',
			editable: false,
		},
		{
			dataField: 'caragentname',
			headerText: t('lbl.SLAVE_COURIER'), //2차운송사
			dataType: 'code',
			width: 120,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'contractType',
			headerText: '계약유형',
			dataType: 'code',
			width: 100,
			editable: false,
			labelFunction: getContractTypeCommonCode,
			style: 'ta-c',
		},
		{
			dataField: 'carNo',
			headerText: t('lbl.CARNO'), //차량번호
			dataType: 'code',
			width: 100,
			style: 'ta-c',
			editable: false,
		},
		{
			dataField: 'carCapacity',
			headerText: t('lbl.QTY_TON'), //톤수
			dataType: 'code',
			width: 73,
			editable: false,
			labelFunction: getCarCapCityTypeCommonCode,
			style: 'ta-c',
		},
		{
			dataField: 'driverName',
			headerText: t('lbl.DRIVERNAME'), //기사명,
			dataType: 'code',
			width: 100,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'workDays',
			headerText: t('lbl.ONBIZDAYS'), //영업일수
			dataType: 'code',
			width: 73,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'workCnt',
			headerText: t('lbl.DELIVERYDAYCNT'), //운행일수
			dataType: 'code',
			width: 73,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'cnt11',
			headerText: t('lbl.OVERTIMEWORK'), //특근
			dataType: 'code',
			width: 73,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'cnt13',
			headerText: t('lbl.NOWORKPRICE'), //무급
			dataType: 'code',
			width: 73,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'cnt14',
			headerText: t('lbl.PAYWORKPRICE'), //유급
			dataType: 'code',
			width: 73,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'cnt15',
			headerText: t('lbl.RECOGNIZE_ABSENT'), //인지결행
			dataType: 'code',
			width: 73,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'cnt16',
			headerText: t('lbl.UNRECOGNIZE_ABSENT'), //미인지결행
			dataType: 'code',
			width: 80,
			editable: false,
			style: 'ta-c',
		},
		{
			dataField: 'cnt12',
			headerText: t('lbl.VACATION'), //휴가
			dataType: 'code',
			width: 73,
			editable: false,
			style: 'ta-c',
		},
		// {
		// 	dataField: 'cnt17',
		// 	headerText: '기타',
		// 	width: 73,
		// 	editable: false,
		// 	dataType: 'code',
		// },
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 저장
	 * @returns
	 */
	const saveMaster = async () => {
		// 변경 데이터 확인
		const menus = ref.gridRef.current.getChangedData({ validationYn: false });
		// const menus = ref.gridRef.current.getChangedData();
		if (!menus || menus.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		// validation
		if (menus.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		}

		const param = {
			saveList: menus,
		};
		apiSaveMasterList(param)
			.then(res => {
				if (res.statusCode === 0) {
					ref.gridRef.current.clearGridData();
					props.fnCallBack(); // 저장 성공 후에만 호출
					showAlert('저장', '저장되었습니다.');
				} else {
					showAlert('저장 결과', '저장에 실패하였습니다. 다시 시도해주세요.');
				}
			})
			.catch(e => {
				showAlert('저장 결과', '저장 중 오류가 발생했습니다.');
			});
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// fixedRowCount: 9,
		// 고정 열(Column) 개수
		fixedColumnCount: 9,
		// headerHeight: 30,
		useContextMenu: true,
	};

	const footerLayout = [{}];
	/**
	 *
	 * @param rowIndex
	 * @param columnIndex
	 * @param value
	 * @param headerText
	 * @param item
	 * @param dataField
	 */
	function dayGbColorFunc(
		rowIndex: number,
		columnIndex: number,
		value: any,
		headerText: string,
		item: any,
		dataField: string,
	) {
		const day = (item?.dayGb ?? '').toString();
		const restYn = (item?.restYn ?? '').toString();
		// 휴일 우선 빨강 처리 원하면 아래 주석 해제
		// if ((item?.restYn ?? '') === 'Y') return { color: '#d32f2f', fontWeight: 'bold' };

		if (day === '일') return { color: 'red' }; // 빨강
		if (day === '토') return { color: 'blue' }; // 파랑
		if (restYn === 'Y') return { color: 'red' };
		else return { color: '' };
	}
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		const gridRefCur1 = ref.gridRef1.current;

		// 사용자 목록 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function () {
			// searchDtl();
		});
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			// gridRefCur?.setGridData(newData);
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				// gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('driverName', { width: 125 });
				gridRefCur.setColumnPropByDataField('defDccode', { width: 130 });
				gridRefCur.setColumnPropByDataField('carNo', { width: 130 });
			}
			ref.gridRef.current.setFixedColumnCount(7); // 7개 컬럼 고정
		}
	}, [props.data]);
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		// 매핑 객체 생성
		const calendar = props.calendarData || [];

		// AUIGrid 컬럼 정의
		const columns = Array.from({ length: calendar.length }, (_, i) => {
			const day = String(i + 1).padStart(2, '0'); // 01, 02 ...
			const yoil = calendar[i].dayGb.charAt(0) || '';
			// const restYn = dayOfrestYnMap[day] || 'N'; // 휴일 여부
			const restYn = calendar[i].restYn || 'Y';
			const workYn = calendar[i].workYn || 'N';

			const headerText = `${day}일${yoil ? `(${yoil})` : ''}`;

			// "일" 또는 "토"가 headerText에 포함되어 있으면 색상 지정
			let headerStyle = {};
			if (yoil.includes('일') || restYn === 'Y') {
				headerStyle = 'red';
			} else if (yoil.includes('토')) {
				headerStyle = 'blue';
			}
			return {
				dataField: `d${day}`,
				width: 90,
				headerText: `<span style="color:${headerStyle}">${headerText}</span>`,
				editable: workYn !== 'N',
				// editable: true,
				style: 'ta-c',
				labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
					const match = attendanceCodeList.find(i => i.comCd == value);
					return match ? match.cdNm : value;
				},
				styleFunction: function () {
					// 휴일(restYn === 'Y')이 아닌 경우 isEdit 클래스를 적용하여 편집 가능한 셀임을 표시합니다.
					if (workYn !== 'N') {
						return 'isEdit';
					}
				},
				// headerStyle: { color: 'red', fontWeight: 'bold' },
				// styleFunction: function (rowIndex, columnIndex, value, headerText, item, dataField) {
				// 	if (headerText.includes('토')) {
				// 		return { color: 'blue', fontWeight: 'bold' };
				// 	}
				// },
				// renderer: {
				// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				// 	type: 'DropDownListRenderer',
				// 	list: attendanceCodeList,
				// 	keyField: 'comCd', // key 에 해당되는 필드명
				// 	valueField: 'cdNm',
				// },
				editRenderer: {
					type: 'ConditionRenderer',
					conditionFunction: function () {
						// 휴일(restYn === 'Y')인 경우, 편집을 비활성화합니다.
						if (workYn === 'N')
							return {
								type: 'InputEditRenderer',
							};
						// 휴일이 아닌 경우, 드롭다운 리스트를 보여줍니다.
						else
							return {
								type: 'DropDownListRenderer',
								list: attendanceCodeList, // 메모이제이션된 리스트를 사용합니다.
								keyField: 'comCd', // key 에 해당되는 필드명
								valueField: 'cdNm',
							};
					},
				},
			};
		});
		const layout = [...gridCol, ...columns];

		gridRefCur.changeColumnLayout(layout);
	}, [props.calendarData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle="차량목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default TmAttendanceDetail;
