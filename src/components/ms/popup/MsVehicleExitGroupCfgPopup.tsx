/*
############################################################################
# FiledataField : MsVehicleExitGroupCfgPopup.tsx
# Description   : 출차그룹설정 팝업
# Author        : YeoSeungCheol
# Since         : 25.08.04
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';

// hooks
import { useThrottle } from '@/hooks/useThrottle';

// api
import { apiGetVehicleExitGroupCfg, apiPostSaveVehicleExitGroupCfg } from '@/api/ms/apiMsVehicleExitGroupCfgPopup';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

interface PropsType {
	close: () => void;
	customDccode?: string | number;
}

const MsVehicleExitGroupCfgPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { close } = props;
	const gridRef = useRef<any>();
	const throttle = useThrottle();

	// scroll Paging
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const storerkey = useAppSelector(state => state.global.globalVariable.gStorerkey);
	const gDccode = useAppSelector(state => state.global.globalVariable.gDccode);

	// 물류센터 목록
	const userDccodeList = getUserDccodeList('') ?? [];

	/**
	 * DC코드를 [코드]센터명 형태로 변환하는 함수
	 * @param {number} rowIndex 행 인덱스
	 * @param {number} columnIndex 컬럼 인덱스
	 * @param {any} value DC코드 값
	 * @returns {string} [코드]센터명 형태의 문자열
	 */
	const dcCodeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		const dcInfo = userDccodeList.find((item: any) => item.dccode === value);
		return dcInfo ? dcInfo.dcname : value || '';
	};

	/**
	 * 입력 받은 시간이 24:00 이면 입력 안되게 처리 해야 함.
	 * @param {string} oldValue 예전 value
	 * @param {string} newValue 새로 입력 받은 value
	 * @param {any} item row 정보
	 * @param {string} dataField 컬럼 id
	 * @returns
	 */
	const validateHourEnd = (oldValue: string, newValue: string, item: any, dataField: string) => {
		// //console.log(`dataField : ${dataField}`);
		const isValid = commUtil.isNotEmpty(newValue) && newValue === '24:00';

		return { validate: !isValid, message: '24:00 을 입력 할수 없습니다.' }; // flase 가 되어야 오류 처리가 됨.
	};

	// 공통코드 옵션
	const carGroupOptions = getCommonCodeList('CARGROUP', '선택', '');
	const useYnOptions = [
		{ comCd: 'Y', cdNm: '사용' },
		{ comCd: 'N', cdNm: '미사용' },
	];
	// 그리드 컬럼 정의
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'), // 물류센터
			dataField: 'dcCode',
			dataType: 'code',
			cellMerge: true,
			editable: false,
			labelFunction: dcCodeLabelFunc,
		},
		{
			headerText: t('lbl.OUTGROUPCD'), // 출차그룹
			dataField: 'outGroupCd',
			required: true,
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				keyField: 'comCd',
				valueField: 'cdNm',
				list: carGroupOptions,
				textField: 'cdNm',
			},
			filter: {
				showIcon: true,
				inline: true,
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const option = carGroupOptions.find((item: any) => item.comCd === String(value));
				return option?.cdNm || value;
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// cellEditBegin 이벤트에 막아놓은 조건
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.UNLOADTIME'), // 입차시간
			dataField: 'inTime',
			required: true,
			dataType: 'code',
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99', // HH:MM 형태
				placeholder: 'HH:MM',
				validator: validateHourEnd,
			},
		},
		{
			headerText: t('lbl.OUTCARTIME'), // 출차시간
			dataField: 'outTime',
			required: true,
			dataType: 'code',
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99', // HH:MM 형태
				placeholder: 'HH:MM',
				validator: validateHourEnd,
			},
		},
		{
			headerText: t('lbl.REMARK'), // 사용여부
			dataField: 'rmk',
			dataType: 'string',
		},
		// {
		// 	headerText: t('lbl.USE_YN'), // 사용여부
		// 	dataField: 'useYn',
		// 	required: true,
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		keyField: 'comCd',
		// 		valueField: 'cdNm',
		// 		list: useYnOptions,
		// 		textField: 'cdNm',
		// 	},
		// 	filter: {
		// 		showIcon: true,
		// 		inline: true,
		// 	},
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		const option = useYnOptions.find((item: any) => item.comCd === value);
		// 		return option?.cdNm || value;
		// 	},
		// },
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		selectionMode: 'multipleCells',
		enableCellMerge: true,
		editingStart: function (event: any) {
			// 기존 행의 경우 물류센터와 출차그룹 편집 제한
			if (event.item.rowState !== 'added') {
				if (event.dataField === 'dcCode' || event.dataField === 'outGroupCd') {
					return false; // 편집 금지
				}
			}
			return true;
		},
	};

	// 버튼 설정
	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'plus' as const,
				initValues: {
					dcCode: props.customDccode,
					outGroupCd: '',
					outTime: '',
					inTime: '',
					useYn: 'Y',
				},
				callBackFn: () => {
					// 행이 추가된 후 rowStatus 설정
					setTimeout(() => {
						const gridData = gridRef.current.getGridData();
						const lastRowIndex = gridData.length - 1;
						if (lastRowIndex >= 0) {
							// 신규 행에 rowStatus 설정
							gridRef.current.setCellValue(lastRowIndex, 'rowStatus', 'I');
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
	 * 시간 입력 검증 함수
	 * @param {string} timeValue HH:MM 형태의 시간
	 * @returns {boolean} 검증 결과 (true: 유효, false: 무효)
	 */
	const validateTime = (timeValue: string) => {
		// 빈 값이나 placeholder 값은 required 검증에서 별도 처리
		if (!timeValue || timeValue.trim() === '' || timeValue === '__:__' || timeValue === 'HH:MM') {
			return true; // 빈 값은 허용 (required 검증은 별도)
		}

		// 완전하지 않은 입력 체크
		if (timeValue.includes('_')) {
			showAlert(null, '시간을 완전히 입력해주세요.');
			return false;
		}

		const timePattern = /^([0-1][0-9]|2[0-4]):([0-5][0-9])$/;
		if (!timePattern.test(timeValue)) {
			showAlert(null, 'HH:MM 형식으로 정확히 입력해주세요.');
			return false;
		}

		const [hours, minutes] = timeValue.split(':').map(Number);

		// 시간 검증 (00-24)
		if (hours < 0 || hours > 24) {
			showAlert(null, '시간은 00~24 사이로 입력해주세요.');
			return false;
		}

		// 분 검증 (00-59)
		if (minutes < 0 || minutes > 59) {
			showAlert(null, '분은 00~59 사이로 입력해주세요.');
			return false;
		}

		return true;
	};

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = useCallback(() => {
		setCurrentPage(1);
		gridRef.current.clearGridData();
		searchScroll(true, '');
	}, []);

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		onClickSearchButton();
	};

	// 메뉴 타이틀에 연결할 함수
	// const titleFunc = useMemo(
	// 	() => ({
	// 		searchYn: onClickSearchButton,
	// 		refresh: onClickRefreshButton,
	// 	}),
	// 	[onClickSearchButton, onClickRefreshButton],
	// );

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value: string) => {
		const tt = currentPage - 1;
		const params = {
			storerkey,
			dcCode: gDccode,
			customDccode: props.customDccode,
			searchValue: value || '',
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPage !== 1,
		};

		apiGetVehicleExitGroupCfg(params).then((res: any) => {
			settingSelectData(res.data);
		});
	}, 500);

	/**
	 * response 데이터 grid에 설정
	 * @param {Array} data grid에 설정할 데이터
	 */
	const settingSelectData = (data: any) => {
		if (data.list?.length > 0) {
			const convertedData = data.list.map((item: any) => ({
				...item,
				outGroupCd: Number(item.outGroupCd),
			}));

			if (currentPage === 1) {
				setTotalCount(data.totalCount);
				// 첫 페이지일 때 데이터 새로 설정
				gridRef.current.setGridData(convertedData);
			} else {
				// 스크롤 페이징일 때 데이터 추가
				gridRef.current.appendData(convertedData);
			}

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
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

		gridRef.current.showConfirmSave(() => {
			const processedData = changed.map((row: any) => ({
				...row,
				storerkey,
				dcCode: row.dcCode || props.customDccode,
			}));

			apiPostSaveVehicleExitGroupCfg(processedData).then(() => {
				showAlert(null, t('msg.MSG_COM_SUC_003')); // 저장되었습니다.
				onClickSearchButton();
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

			// 신규행만 필터링 (rowStatus가 'I'인 행만)
			const newRows = checkedRows.filter((row: any) => row.rowStatus === 'I');

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
			setCurrentPage((currentPage: any) => currentPage + 1);
		},
		totalCount,
	});

	// 스크롤 이벤트 바닥일 경우 불러오기
	useEffect(() => {
		/**
		 * 그리드 셀 편집 시작 (신규일때만 출차그룹 편집 허용)
		 */
		gridRef.current.bind('cellEditBegin', (event: any) => {
			// 출차그룹 컬럼의 경우 신규행만 편집 허용
			if (event.dataField === 'outGroupCd') {
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
			// 시간 검증
			if (event.dataField === 'outTime' || event.dataField === 'inTime') {
				const timeValue = event.value;
				if (!validateTime(timeValue)) {
					// 검증 실패 시 이전 값으로 되돌림
					gridRef.current.setCellValue(event.rowIndex, event.dataField, event.oldValue);
				}
			}

			// 출차그룹 중복 검증
			if (event.dataField === 'outGroupCd') {
				const newValue = event.value;
				const currentRowIndex = event.rowIndex;

				// 전체 그리드 데이터 가져오기
				const allData = gridRef.current.getGridData();

				// 같은 출차그룹이 다른 행에 있는지 확인 (타입 변환 고려)
				const duplicateRow = allData.find(
					(row: any, index: number) =>
						index !== currentRowIndex && String(row.outGroupCd) === String(newValue) && newValue !== '',
				);

				if (duplicateRow) {
					showAlert(null, '이미 존재하는 출차그룹입니다. 다른 출차그룹을 선택해주세요.');
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
			searchScroll(true, '');
		}
	}, [currentPage]);

	// 초기 데이터 로드
	useEffect(() => {
		onClickSearchButton();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="출차그룹설정" />

			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="출차그룹목록" totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL') || '닫기'}</Button>
			</ButtonWrap>
		</>
	);
};

export default MsVehicleExitGroupCfgPopup;
