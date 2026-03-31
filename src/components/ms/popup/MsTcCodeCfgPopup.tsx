/*
############################################################################
# FiledataField : MsTcCodeCfgPopup.tsx
# Description   : 출발지TC센터설정 팝업
# Author        : YeoSeungCheol
# Since         : 25.08.18
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// component
import CmMapPopup from '@/components/cm/popup/CmMapPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SearchForm } from '@/components/common/custom/form';
import SelectBox from '@/components/common/custom/form/SelectBox';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// store

// hooks
import { useThrottle } from '@/hooks/useThrottle';

// api
import { apiGetMsTcCodeCfgPopup, apiPostSaveMsTcCodeCfgPopup } from '@/api/ms/apiMsTcCodeCfgPopup';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

interface PropsType {
	close: () => void;
	dcCode?: string;
}

const MsTcCodeCfgPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { close } = props;
	const gridRef = useRef<any>();
	const throttle = useThrottle();
	const mapModalRef = useRef<any>();
	const [form] = Form.useForm();

	// 검색 조건 초기값
	const [searchBox] = useState({
		searchVal: '', // 출발지코드/명
		useYn: '', // 사용여부
	});

	// 지도 관련 상태
	const [searchAddr, setSearchAddr] = useState('');
	const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
	const [addressInfo, setAddressInfo] = useState<any>(null);
	const [currentRadius, setCurrentRadius] = useState<string>('');
	const [currentStytime, setCurrentStytime] = useState<string>('');

	// scroll Paging
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);
	const dcCode = props.dcCode;

	// 사용여부 옵션
	const useYnOptions = [
		{ comCd: '', cdNm: '전체' },
		{ comCd: 'Y', cdNm: '사용' },
		{ comCd: 'N', cdNm: '미사용' },
	];

	/**
	 * 위경도 좌표 포맷팅 함수 (소수점 셋째자리까지 표시)
	 * @param {any} value 좌표 값
	 * @returns {string|number} 포맷팅된 좌표 값
	 */
	const formatCoordinate = (value: any) => {
		if (!value || isNaN(parseFloat(value))) {
			return value;
		}
		const numValue = parseFloat(value);
		// 소수점 셋째자리까지만 표시 (실제 값은 변경하지 않음)
		return parseFloat(numValue.toFixed(4));
	};

	/**
	 * 분 단위를 HHmm 형식으로 변환
	 * @param {any} minutes 분 단위 값
	 * @returns {string} HHmm 형식의 문자열
	 */
	const convertMinutesToHHmm = (minutes: any) => {
		if (!minutes || isNaN(parseInt(minutes))) {
			return '';
		}
		const totalMinutes = parseInt(minutes);
		const hours = Math.floor(totalMinutes / 60);
		const minutesPart = totalMinutes % 60;
		return `${String(hours).padStart(2, '0')}${String(minutesPart).padStart(2, '0')}`;
	};
	// 그리드 컬럼 정의
	const gridCol = [
		{
			headerText: t('lbl.DEPARTURE_CD'), // 출발지코드
			dataField: 'tcCode',
			required: true,
			dataType: 'code',
			// width: 120,
			editable: false,
		},
		{
			headerText: t('lbl.DEPARTURE'), // 출발지
			dataField: 'tcName',
			required: true,
			dataType: 'string',
			// width: 200,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.LATITUDE'), // 위도
			dataField: 'latitude',
			required: true,
			dataType: 'numeric',
			// width: 120,
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => formatCoordinate(value),
		},
		{
			headerText: t('lbl.LONGITUDE'), // 경도
			dataField: 'longitude',
			required: true,
			dataType: 'numeric',
			// width: 120,
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => formatCoordinate(value),
		},
		{
			// 반경
			headerText: t('lbl.RADIUS'),
			dataField: 'radius',
			dataType: 'numeric',
			editable: true,
		},
		// 체류시간(초)
		{
			headerText: t('lbl.STYTIME'),
			dataField: 'stytime',
			dataType: 'numeric',
			editable: true,
		},
		{
			headerText: t('lbl.ADDRESS'), // 주소
			dataField: 'address1',
			required: true,
			dataType: 'string',
			// width: 300,
			editable: false,
		},
		{
			headerText: t('lbl.ADDRESS2'), // 상세주소
			dataField: 'address2',
			// required: true,
			dataType: 'string',
			// width: 300,
			editable: true,
		},
		{
			headerText: t('lbl.MAP'), // 지도
			dataField: 'mapButton',
			// dataType: 'string',
			// width: 80,
			commRenderer: {
				type: 'map',
				labelText: t('lbl.MAP'),
				onClick: function (event: any) {
					setSelectedRowIndex(event.rowIndex);
					setSearchAddr(event.item.address1 || '');
					// 현재 행의 반경과 체류시간 값 가져오기
					setCurrentRadius(event.item.radius || '');
					// stytime은 분 단위이므로 HHmm 형식으로 변환
					setCurrentStytime(convertMinutesToHHmm(event.item.stytime));
					mapModalRef.current?.handlerOpen();
				},
			},
		},
		{
			headerText: t('lbl.USE_YN'), // 사용여부
			dataField: 'useYn',
			dataType: 'code',
			// width: 100,
			editRenderer: {
				type: 'DropDownListRenderer',
				keyField: 'comCd',
				valueField: 'cdNm',
				list: useYnOptions.filter(item => item.comCd !== ''), // 그리드에서는 "전체" 사용여부를 표시하지 않음.
				textField: 'cdNm',
			},
			filter: {
				showIcon: true,
				inline: true,
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const option = useYnOptions.find((item: any) => item.comCd === value);
				return option?.cdNm || value;
			},
		},
		{
			dataField: 'addWho',
			headerText: t('lbl.ADDWHO'), // 등록자
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'editWho',
			headerText: t('lbl.EDITWHO'), // 수정자
			dataType: 'manager',
			managerDataField: 'editWho',
			editable: false,
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		selectionMode: 'multipleCells',
		editingStart: function (event: any) {
			// 출발지코드는 항상 편집 금지 (자동 생성)
			if (event.dataField === 'tcCode') {
				return false;
			}

			// 기존 행의 경우 경도, 위도 편집 제한 (지도 버튼을 통해서만 입력)
			if (event.item.rowState !== 'added') {
				if (event.dataField === 'longitude' || event.dataField === 'latitude') {
					return false; // 편집 금지
				}
			}

			return true;
		},
	};

	/**
	 * 다음 TC 코드 생성
	 */
	const getNextTcCode = () => {
		const allData = gridRef.current?.getGridData() || [];
		const existingCodes = allData.map((row: any) => row.tcCode).filter((code: string) => code && code.startsWith('TC'));

		let maxNumber = 0;
		existingCodes.forEach((code: string) => {
			const numberPart = parseInt(code.substring(2));
			if (!isNaN(numberPart) && numberPart > maxNumber) {
				maxNumber = numberPart;
			}
		});

		const nextNumber = maxNumber + 1;
		return `TC${String(nextNumber).padStart(3, '0')}`;
	};

	// 버튼 설정
	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'plus' as const,
				initValues: {
					tcCode: '',
					tcName: '',
					address1: '',
					radius: '',
					stytime: '',
					longitude: '',
					latitude: '',
					useYn: 'Y',
				},
				callBackFn: () => {
					// 행이 추가된 후 TC 코드 설정 및 rowStatus 설정
					setTimeout(() => {
						const gridData = gridRef.current.getGridData();
						const lastRowIndex = gridData.length - 1;
						if (lastRowIndex >= 0) {
							// 신규 행에 rowStatus 설정 (표준 패턴: setCellValue 사용으로 변경이력 보존)
							gridRef.current.setCellValue(lastRowIndex, 'rowStatus', 'I');

							// TC 코드 설정
							if (!gridData[lastRowIndex].tcCode || gridData[lastRowIndex].tcCode === '') {
								const newTcCode = getNextTcCode();
								gridRef.current.setCellValue(lastRowIndex, 'tcCode', newTcCode);
							}
						}
					}, 10);
				},
			},
			{
				btnType: 'delete' as const,
				callBackFn: () => onDelete(),
			},
			{
				btnType: 'save' as const,
				callBackFn: () => onSave(),
			},
		],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 지도 팝업 콜백 함수 (좌표)
	 * @param {Array} searchLatLng 검색된 좌표 [경도, 위도]
	 */
	const handleMapCallback = (searchLatLng: [number, number]) => {
		if (selectedRowIndex !== null && searchLatLng && searchLatLng.length === 2 && gridRef.current) {
			const [latitude, longitude] = searchLatLng;

			// 선택된 행의 경도, 위도 업데이트
			gridRef.current.setCellValue(selectedRowIndex, 'longitude', longitude.toString());
			gridRef.current.setCellValue(selectedRowIndex, 'latitude', latitude.toString());

			mapModalRef.current?.handlerClose();
			setSelectedRowIndex(null);
		}
	};

	/**
	 * 지도 팝업 콜백 함수 (주소)
	 * @param {object} addressInfo 주소 정보
	 */
	const handleAddressCallback = (addressInfo: any) => {
		if (selectedRowIndex !== null && addressInfo && addressInfo.fullAddress && gridRef.current) {
			gridRef.current.setCellValue(selectedRowIndex, 'address1', addressInfo.fullAddress3);

			// addressInfo를 그리드 데이터에 직접 저장 (setGridData 사용하지 않음으로써 행 상태 보존)
			const currentData = gridRef.current.getGridData();
			currentData[selectedRowIndex].addressInfo = addressInfo;
			// gridRef.current.setGridData(currentData); // 제거: 체크박스와 rowState 초기화 방지
		}
	};

	/**
	 * 지도 팝업 콜백 함수 (반경, 체류시간)
	 * @param {object} result 반경, 체류시간 정보
	 */
	const handleMapResultCallback = (result: any) => {
		if (selectedRowIndex !== null && gridRef.current) {
			// 반경 업데이트
			if (result.radius !== undefined && result.radius !== null && result.radius !== '') {
				gridRef.current.setCellValue(selectedRowIndex, 'radius', result.radius);
			}
			// 체류시간 업데이트 (HHmm 형식의 문자열을 분 단위로 변환)
			if (result.stytime !== undefined && result.stytime !== null && result.stytime !== '') {
				// stytime은 HHmm 형식의 문자열이므로 분 단위로 변환
				// 예: "0930" -> 9시간 30분 = 570분
				const timeStr = String(result.stytime).padStart(4, '0');
				const hours = parseInt(timeStr.substring(0, 2));
				const minutes = parseInt(timeStr.substring(2, 4));
				const totalMinutes = hours * 60 + minutes;
				gridRef.current.setCellValue(selectedRowIndex, 'stytime', totalMinutes.toString());
			}
		}
	};

	/**
	 * 지도 팝업 닫기
	 */
	const handleMapClose = () => {
		mapModalRef.current?.handlerClose();
		setSelectedRowIndex(null);
		setAddressInfo(null); // 주소 정보 초기화
		setCurrentRadius(''); // 반경 초기화
		setCurrentStytime(''); // 체류시간 초기화
	};

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = useCallback(() => {
		setCurrentPage(1);
		gridRef.current.clearGridData();
		const formValues = form.getFieldsValue();
		searchScroll(true, formValues);
	}, []);

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		onClickSearchButton();
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {object} formValues 검색 조건
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, formValues?: any) => {
		const tt = currentPage - 1;
		const searchData = formValues || form.getFieldsValue();
		const params = {
			searchVal: searchData.searchVal || '',
			useYn: searchData.useYn || '',
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPage !== 1,
		};

		apiGetMsTcCodeCfgPopup(params).then((res: any) => {
			settingSelectData(res.data);
		});
	}, 500);

	/**
	 * response 데이터 grid에 설정
	 * @param {Array} data grid에 설정할 데이터
	 */
	const settingSelectData = (data: any) => {
		if (data.list?.length > 0) {
			if (currentPage === 1) {
				setTotalCount(data.totalCount);
				// 첫 페이지일 때 데이터 새로 설정
				gridRef.current.setGridData(data.list);
			} else {
				// 스크롤 페이징일 때 데이터 추가
				gridRef.current.appendData(data.list);
			}

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
			gridRef.current.setColumnPropByDataField('latitude', { width: 80 });
			gridRef.current.setColumnPropByDataField('longitude', { width: 80 });
			gridRef.current.setColumnPropByDataField('mapButton', { width: 60 });
		} else if (currentPage === 1) {
			setTotalCount(0);
			gridRef.current.setGridData([]);
		}
	};

	// 저장
	const onSave = () => {
		const changed = gridRef.current.getChangedData({ validationYn: false });
		if (!changed || changed.length < 1) {
			// 변경사항이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		// 표준화된 저장 확인 메시지 (신규/수정/삭제 건수 표시)
		gridRef.current.showConfirmSave(() => {
			const processedData = changed.map((row: any) => ({
				...row,
				dcCode: dcCode.length > 0 ? dcCode[0] : '',
			}));

			apiPostSaveMsTcCodeCfgPopup(processedData).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.MSG_COM_SUC_003')); // 저장되었습니다.
					onClickSearchButton();
				}
			});
		});
	};

	// 삭제 (신규행만 로컬 삭제)
	const onDelete = () => {
		throttle(() => {
			const checkedRows = gridRef.current.getCheckedRowItems();
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, '삭제할 행을 선택하세요.');
				return;
			}

			// 신규행만 필터링 (rowState가 'added'인 행만)
			const newRows = checkedRows.filter((row: any) => row.rowState === 'added');

			if (newRows.length === 0) {
				showAlert(null, '신규 추가된 행만 삭제할 수 있습니다.');
				return;
			}

			// 삭제하시겠습니까?
			showConfirm(null, '선택된 신규행을 삭제하시겠습니까?', () => {
				// 로컬에서만 삭제 (서버 API 호출 없음)
				newRows.forEach((row: any) => {
					gridRef.current.removeRow(row.rowIndex);
				});
				showAlert(null, '삭제되었습니다.');
			});
		}, 500);
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount,
	});

	// 스크롤 이벤트 바닥일 경우 불러오기
	useEffect(() => {
		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		gridRef.current.bind('cellEditBegin', (event: any) => {
			// 출발지코드는 항상 편집 금지
			if (event.dataField === 'tcCode') {
				return false;
			}

			// 출발지 컬럼의 경우 신규행만 편집 허용
			if (event.dataField === 'tcName') {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}

			return true;
		});

		// 셀 편집 종료 시 검증
		gridRef.current.bind('cellEditEnd', function (event: any) {
			// 출발지코드 중복 검증
			if (event.dataField === 'tcCode') {
				const newValue = event.value;
				const currentRowIndex = event.rowIndex;

				// 전체 그리드 데이터 가져오기
				const allData = gridRef.current.getGridData();

				// 같은 출발지코드가 다른 행에 있는지 확인
				const duplicateRow = allData.find(
					(row: any, index: number) => index !== currentRowIndex && row.tcCode === newValue && newValue !== '',
				);

				if (duplicateRow) {
					showAlert(null, '이미 존재하는 출발지코드입니다. 다른 출발지코드를 입력해주세요.');
					// 이전 값으로 되돌림
					gridRef.current.setCellValue(event.rowIndex, event.dataField, event.oldValue);
				}
			}
		});
	}, []);

	/**
	 * 스크롤하여 페이지 이동되면 데이터 조회
	 */
	useEffect(() => {
		if (currentPage > 1) {
			const formValues = form.getFieldsValue();
			searchScroll(true, formValues);
		}
	}, [currentPage]);

	// 초기 데이터 로드
	useEffect(() => {
		onClickSearchButton();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="출발지TC센터설정" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<InputText
								label="출발지코드/명"
								name="searchVal"
								placeholder={t('msg.MSG_COM_VAL_006', ['출발지코드 또는 출발지명'])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
						<li>
							<SelectBox
								name="useYn"
								label={t('lbl.USE_YN')}
								options={useYnOptions}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="출발지TC센터목록" totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 지도 팝업 */}
			<CustomModal ref={mapModalRef} width="1280px">
				<CmMapPopup
					setSearchLatLng={handleMapCallback}
					setAddressInfo={handleAddressCallback}
					searchText={searchAddr}
					close={handleMapClose}
					showRadius={true}
					radius={currentRadius}
					stytime={currentStytime}
					callBackFn={handleMapResultCallback}
					lat={
						selectedRowIndex !== null && gridRef.current
							? gridRef.current.getGridData()[selectedRowIndex]?.latitude
							: undefined
					}
					lon={
						selectedRowIndex !== null && gridRef.current
							? gridRef.current.getGridData()[selectedRowIndex]?.longitude
							: undefined
					}
				/>
			</CustomModal>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL') || '닫기'}</Button>
			</ButtonWrap>
		</>
	);
};

export default MsTcCodeCfgPopup;
