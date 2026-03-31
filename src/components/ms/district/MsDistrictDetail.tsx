// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import MsDistrictUploadExcelPopup from '@/components/ms/district/MsDistrictUploadExcelPopup';
import MsCenterDlvDistrictSearchPopup from '@/components/ms/popup/MsCenterDlvDistrictSearchPopup';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsDistrict';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';

const MsDistrictDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	//조회 팝업
	const modalRef = useRef(null);
	const modalRef2 = useRef(null);
	const modalRef3 = useRef(null);

	// 그리드 초기화
	const gridCol = [
		// {
		// 	dataField: 'dcCode',
		// 	headerText: t('lbl.DCCODE'),
		// 	dataType: 'string',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: userDccodeList,
		// 		keyField: 'dccode', // key 에 해당되는 필드명
		// 		valueField: 'dcname',
		// 	},
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return userDccodeList.find((item: any) => item.dccode === value)?.dcname || '';
		// 	},
		// 	required: true,
		// },
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
			},
			filter: {
				showIcon: true,
			},
			editable: false,
			cellMerge: true,
			mergeRef: 'districtCode',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			},
			cellMerge: true,
			mergeRef: 'districtCode',
			mergePolicy: 'restrict',
		},
		// {
		// 	dataField: 'workPopNo',
		// 	headerText: t('lbl.DISTRICT'),
		// 	dataType: 'code',
		// 	cellMerge: true,
		// 	mergeRef: 'districtCode',
		// 	mergePolicy: 'restrict',
		// 	visible: false,
		// },
		// {
		// 	dataField: 'dlvDistrictId',
		// 	headerText: t('lbl.DISTRICT'),
		// 	visible: false,
		// },
		{
			dataField: 'dlvDistrictNm',
			headerText: '배송권역',
			cellMerge: true,
			mergeRef: 'districtCode',
			mergePolicy: 'restrict',
			commRenderer: {
				type: 'search',
				onClick: (e: any) => {
					modalRef3.current.handlerOpen();
				},
			},
		},
		{
			dataField: 'districtCode',
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			dataType: 'code',
			required: true,
			cellMerge: true,
			mergeRef: 'districtCode',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'chuteNo',
			headerText: t('슈트번호'), // 배송권역
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'districtCode',
			mergePolicy: 'restrict',
			editRenderer: {
				type: 'InputEditRenderer',
				maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
			},
		},
		{
			dataField: 'rolltainerMax',
			headerText: '롤테이너(Max)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 숫자만 입력 가능하도록 설정
				allowPoint: false, // 소수점 허용 여부 (필요에 따라 설정)
				allowNegative: false, // 마이너스 부호(-) 허용 안 함 (즉, 양수만 허용)
			},
			maxlength: 5,
			cellMerge: true,
			mergeRef: 'districtCode',
			mergePolicy: 'restrict',
		},
		{
			headerText: '롤테이너번호구간',
			children: [
				{
					dataField: 'rolltainerStartNo',
					headerText: 'From',
					dataType: 'numeric',
					maxlength: 5,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 숫자만 입력 가능하도록 설정
						allowPoint: false, // 소수점 허용 여부 (필요에 따라 설정)
						allowNegative: false, // 마이너스 부호(-) 허용 안 함 (즉, 양수만 허용)
					},
				},
				{
					dataField: 'rolltainerEndNo',
					headerText: 'To',
					dataType: 'numeric',
					maxlength: 5,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 숫자만 입력 가능하도록 설정
						allowPoint: false, // 소수점 허용 여부 (필요에 따라 설정)
						allowNegative: false, // 마이너스 부호(-) 허용 안 함 (즉, 양수만 허용)
					},
				},
			],
		},
		{
			dataField: 'carNo',
			headerText: t('lbl.CARNO'),
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'car2',
				searchDropdownProps: {
					dataFieldMap: {
						carNo: 'code',
						// carNo: 'name',
					},
				},
				onClick: function (event: any) {
					modalRef.current.handlerOpen();
				},
			},
			required: true,
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.CONTROLTYPE'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN', ''),
			},
		},
		// {
		// 	dataField: 'addWho',
		// 	visible: false,
		// },
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		// {
		// 	dataField: 'editWho',
		// 	visible: false,
		// },
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		enableCellMerge: true,
		editableMergedCellsAll: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
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
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			//같은 dcCode와 districtCode 안에서 rolltainerStartNo, rolltainerEndNo 값의 범위가 중복되지 않도록 처리
			const currentDcCode = gridRef.current.getCellValue(event.rowIndex, 'dcCode');
			const currentDistrictCode = gridRef.current.getCellValue(event.rowIndex, 'districtCode');
			const currentWorkPopNo = gridRef.current.getCellValue(event.rowIndex, 'workPopNo');

			//권역(workPopNo) 하나에 속한 POP(districtCode)가 다른 POP(districtCode)에도 있는 경우 : "POP가 {0} 권역 에 설정되어있습니다"
			if (event.dataField === 'districtCode') {
				const allData = gridRef.current.getGridData();
				for (let i = 0; i < allData.length; i++) {
					if (i === event.rowIndex) continue; // 현재 편집 중인 행은 건너뜀
					const row = allData[i];
					if (row.dcCode === currentDcCode && row.districtCode === event.value && event.item.workPopNo !== '') {
						if (row.workPopNo === currentWorkPopNo) continue; // 같은 권역이면 패스
						showMessage({
							content: `POP가 ${row.workPopNo} 권역 에 설정되어있습니다`,
							modalType: 'error',
						});
						// 중복이 발견되면 편집을 취소하고 이전 값으로 되돌림
						gridRef.current.setCellValue(event.rowIndex, event.dataField, event.oldValue);
						return;
					}

					if (row.dcCode === currentDcCode && row.districtCode === event.value && event.item.workPopNo === '') {
						// 배송권역을 자동 입력
						gridRef.current.setCellValue(event.rowIndex, 'workPopNo', row.dlvDistrictId);
						gridRef.current.setCellValue(event.rowIndex, 'dlvDistrictId', row.dlvDistrictId);
						gridRef.current.setCellValue(event.rowIndex, 'dlvDistrictNm', row.dlvDistrictNm);
						return;
					}
				}
			}

			// dcCode, districtCode, workPopNo 가 같은 값이 있으면 rolltainerMax 값은 동일하게 맞춰준다.
			if (event.dataField === 'dcCode' || event.dataField === 'districtCode' || event.dataField === 'workPopNo') {
				const allData = gridRef.current.getGridData();
				let rolltainerMaxValue = null;
				for (let i = 0; i < allData.length; i++) {
					if (i === event.rowIndex) continue; // 현재 편집 중인 행은 건너뜀
					const row = allData[i];
					if (
						row.dcCode === currentDcCode &&
						row.districtCode === currentDistrictCode &&
						row.workPopNo === currentWorkPopNo
					) {
						rolltainerMaxValue = row.rolltainerMax;
						break;
					}
				}
				if (rolltainerMaxValue !== null) {
					gridRef.current.setCellValue(event.rowIndex, 'rolltainerMax', rolltainerMaxValue);
				}
			}

			// rolltainerMax 값을 입력했을 때 dcCode, districtCode, workPopNo 가 같고 rolltainerMax 값이 적거나 null인 행이 있다면
			// 해당 행의 rolltainerMax 값을 동일하게 맞춰준다.
			if (event.dataField === 'rolltainerMax') {
				const allData = gridRef.current.getGridData();
				for (let i = 0; i < allData.length; i++) {
					if (i === event.rowIndex) continue; // 현재 편집 중인 행은 건너뜀
					const row = allData[i];
					if (
						row.dcCode === currentDcCode &&
						row.districtCode === currentDistrictCode &&
						row.workPopNo === currentWorkPopNo
					) {
						if (row.rolltainerMax === null || row.rolltainerMax !== event.value) {
							gridRef.current.setCellValue(i, 'rolltainerMax', event.value);
							gridRef.current.setCheckedRowsByIds([gridRef.current.getItemByRowIndex(i)._$uid]);
						}
					}
				}
			}

			// 편집이 완료된 후, 해당 행을 수정 상태로 변경한다.
			if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
		});

		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			if (
				event.dataField === 'dcCode' ||
				event.dataField === 'plant' ||
				event.dataField === 'storageType' ||
				event.dataField === 'distanceType'
			) {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}

			return true;
		});
	};

	/**
	 * 저장할 목록을 가지고 같은 그룹의 데이터와 중복 체크를 한다.
	 * @param {any} checkList 저장할 목록
	 * @param {string[]} columns 중복 체크할 컬럼 목록
	 * @returns {boolean} true : 검증성공, false: 검증실패
	 */
	const checkDuplicateByGroup = (checkList: any, columns: string[]) => {
		// 'dcCode',
		// 		'districtCode',
		// 		'rolltainerStartNo',
		// 		'rolltainerEndNo',
		// 		'carNo',
		// 중복 검사( 물류센터, pop , 롤테이너 구간 , 차량번호 )
		// const groupData = gridRef.current.getOrgGridData()?.filter((item: any) => item.delYn === 'N' && currentRow.kitSku === item.kitSku); // delYn === 'N' 이면 사용여부 정상
		const groupData = gridRef.current.getOrgGridData()?.reduce((acc: any, item: any) => {
			if (item.delYn === 'Y') return acc;
			const groupKey = item.districtCode;
			if (!acc[groupKey]) acc[groupKey] = [];
			acc[groupKey].push(item);
			return acc;
		}, {});

		// 저장할 목록 정보 checkList
		for (const currentRow of checkList) {
			if (currentRow.delYn === 'Y') continue;
			if (!groupData || !groupData[currentRow.districtCode]) continue;
			// 같은 그룹 정보만 조회

			// 현재 행(currentRow)을 제외한 "나머지 전체 행" 중에서 중복이 있는지 검사.
			const isDuplicate = groupData[currentRow.districtCode].some((otherRow: any) => {
				// 자기 자신은 비교 대상에서 제외
				if (currentRow._$uid === otherRow._$uid) return false;
				return columns.every(col => {
					return currentRow[col] === otherRow[col];
				});
			});

			if (isDuplicate) {
				showMessage({
					content: t('msg.duplication2', [
						,
						`${currentRow.districtCode}] 그룹에 [${currentRow.rolltainerStartNo}과 ${currentRow.rolltainerEndNo}] 로 중복되는 ${currentRow.carNo}가 있습니다.`,
					]), // 중복된 {{0}}(이)가 존재합니다
					modalType: 'info',
				});
				return false; // 중복이 있으면 여기서 검증실패.
			}
		}
		return true;
	};
	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// Update 먼저 처리 후 Insert 처리
		updatedItems.sort((a: any, b: any) => {
			if (a.rowStatus === 'U' && b.rowStatus === 'I') return -1;
			if (a.rowStatus === 'I' && b.rowStatus === 'U') return 1;
			return 0;
		});

		if (!gridRef.current.validateRequiredGridData()) return;

		// 동일한 POP(districtCode) 내 슈트번호(chuteNo), 배송권역(dlvDistrictNm) 정합성 검사 (전체 데이터 중 delYn='N' 기준)
		const allData = gridRef.current.getGridData();
		const districtMap = new Map();

		// 수정/추가된 데이터가 속한 물류센터/POP 그룹 키만 수집
		const updatedGroupKeys = new Set(
			updatedItems.filter((item: any) => item.delYn !== 'Y').map((item: any) => `${item.dcCode}_${item.districtCode}`),
		);

		for (const row of allData) {
			if (row.delYn === 'Y') continue; // 사용안함('Y')인 데이터는 비교 대상에서 제외
			const { dcCode, districtCode, chuteNo, dlvDistrictNm } = row;
			if (!dcCode || !districtCode) continue;

			const groupKey = `${dcCode}_${districtCode}`;
			if (!updatedGroupKeys.has(groupKey)) continue; // 사용자가 수정한 그룹이 아니면 검사 패스

			if (!districtMap.has(groupKey)) {
				districtMap.set(groupKey, { chuteNo, dlvDistrictNm });
			} else {
				const group = districtMap.get(groupKey);
				if (String(group.chuteNo || '') !== String(chuteNo || '')) {
					showMessage({
						content: `동일한 물류센터/POP(${dcCode}/${districtCode}) 데이터 간에 슈트번호가 다른 데이터가 존재합니다.`,
						modalType: 'error',
					});
					return;
				}
				if (String(group.dlvDistrictNm || '') !== String(dlvDistrictNm || '')) {
					showMessage({
						content: `동일한 물류센터/POP(${dcCode}/${districtCode}) 데이터 간에 배송권역이 다른 데이터가 존재합니다.`,
						modalType: 'error',
					});
					return;
				}
			}
		}

		for (const item of updatedItems) {
			if (item.delYn === 'Y') continue; // 현재 저장/수정 하려는 대상이 삭제('Y') 상태면 롤테이너 구간 겹침 검사 생략

			const currentStartNo = item.rolltainerStartNo || 0;
			const currentEndNo = item.rolltainerEndNo || 0;
			const currentRolltainerMax = item.rolltainerMax || 0;

			//currentStartNo, currentEndNo 값이 currentRolltainerMax 보다 크면 안됨
			if (currentStartNo > currentRolltainerMax || currentEndNo > currentRolltainerMax) {
				showMessage({
					content: '롤테이너(Max) 값보다 클 수 없습니다',
					modalType: 'error',
				});
				return;
			}

			// currentStartNo 값이 currentEndNo 값보다 클 수 없음
			if (commUtil.isNotEmpty(currentEndNo) && currentStartNo > currentEndNo) {
				showMessage({
					content: 'From 값이 To 값보다 클 수 없습니다',
					modalType: 'error',
				});
				return;
			}

			const isDuplicate = checkDuplicateByGroup(updatedItems, [
				,
				'dcCode',
				'districtCode',
				'rolltainerStartNo',
				'rolltainerEndNo',
				'carNo',
			]);

			for (let i = 0; i < allData.length; i++) {
				const row = allData[i];
				if (row.delYn === 'Y') continue; // 기존 데이터가 삭제('Y') 상태면 겹침 비교에서 제외
				if (row.dcCode === item.dcCode && row.districtCode === item.districtCode) {
					const startNo = row.rolltainerStartNo;
					const endNo = row.rolltainerEndNo;
					if (item._$uid === row._$uid) continue; // 자기 자신은 비교하지 않음
					// 범위가 겹치는지 확인
					if (
						(commUtil.isNotEmpty(startNo) && //  전체그리드 -> 시작롤테이너
							commUtil.isNotEmpty(currentStartNo) && //선택한 로우 시작롤테이너
							startNo <= currentStartNo &&
							currentStartNo <= endNo) || // startNo 가 currentStartNo 사이에 있거나
						(commUtil.isNotEmpty(startNo) &&
							commUtil.isNotEmpty(currentEndNo) &&
							startNo <= currentEndNo &&
							currentEndNo <= endNo) || // endNo 가 currentEndNo 사이에 있거나
						(commUtil.isNotEmpty(currentStartNo) &&
							commUtil.isNotEmpty(endNo) &&
							currentStartNo <= startNo &&
							endNo <= currentEndNo) // currentStartNo 가 startNo 와 endNo 사이에 있거나
					) {
						showMessage({
							content: '동센터의 동POP에 중복된 롤테이너 정보가 존재합니다',
							modalType: 'error',
						});
						return;
					}
				}
			}
		}

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				if (res.statusCode > -1) {
					gridRef.current.setAllCheckedRows(false);
					gridRef.current.resetUpdatedItems();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn?.(); // 콜백 함수 호출
						},
					});
				}
			});
		});
	};

	const getSelectDccodeList = () => {
		if (commUtil.isNotEmpty(props.selectDcCode)) {
			return props.selectDcCode.split(',')[0];
		}
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'curPlus', // 행삽입
				initValues: {
					storerkey: 'FW00',
					dcCode: getSelectDccodeList(), // 첫 번째 행의 물류센터 코드로 초기화
					status: '90',
					delYn: 'N',
					workPopNo: '',
					rowStatus: 'I', // 신규 행 상태로 설정
				},
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					storerkey: 'FW00',
					dcCode: getSelectDccodeList(), // 첫 번째 행의 물류센터 코드로 초기화
					status: '90',
					delYn: 'N',
					workPopNo: '',
					rowStatus: 'I', // 신규 행 상태로 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	const confirmPopup = (selectedRow: any) => {
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'carNo', selectedRow[0].code);
		modalRef.current.handlerClose();
	};

	const districtConfirmPopup = (selectedRow: any) => {
		// 그리드의 dccode와 districtCode가 같은 행들에 대해 workPopNo, dlvDistrictId, dlvDistrictNm 값 설정
		const allData = gridRef.current.getGridData();
		const currentDcCode = gridRef.current.getCellValue(gridRef.current.getSelectedIndex()[0], 'dcCode');
		const currentDistrictCode = gridRef.current.getCellValue(gridRef.current.getSelectedIndex()[0], 'districtCode');
		for (let i = 0; i < allData.length; i++) {
			if (allData[i].dcCode === currentDcCode && allData[i].districtCode === currentDistrictCode) {
				gridRef.current.setCellValue(i, 'workPopNo', selectedRow[0].dlvdistrictId);
				gridRef.current.setCellValue(i, 'dlvDistrictId', selectedRow[0].dlvdistrictId);
				gridRef.current.setCellValue(i, 'dlvDistrictNm', selectedRow[0].dlvdistrictNm);
			}
		}

		modalRef3.current.handlerClose();
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	const closeEvent2 = () => {
		modalRef2.current.handlerClose();
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		modalRef2.current.handlerOpen();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt}>
					<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={modalRef} width="1280px">
				{/* <CmCarPopup close={closeEvent} callBack={confirmPopup} selectionMode={'singleRow'}></CmCarPopup> */}
				<CmSearchPopup type={'car'} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
			<CustomModal ref={modalRef2} width="1280px">
				<MsDistrictUploadExcelPopup close={closeEvent2} dccode={props.selectDcCode} />
			</CustomModal>
			<CustomModal ref={modalRef3} width="1280px">
				<MsCenterDlvDistrictSearchPopup
					callBack={districtConfirmPopup}
					close={() => modalRef3?.current?.handlerClose?.()}
					dccode={getSelectDccodeList()}
				/>
			</CustomModal>
		</>
	);
});

export default MsDistrictDetail;
