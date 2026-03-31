/*
 ############################################################################
 # FiledataField	: MsDistrictUploadExcelPopup.tsx
 # Description		:  권역별차량관리 엑셀 업로드 팝업
 # Author			: jangjaehyun
 # Since			: 25.07.01
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetValidateExcelList, apiPostSaveMasterList } from '@/api/ms/apiMsDistrict';

interface PropsType {
	close?: any;
	dccode?: string;
}

const MsDistrictUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, dccode } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'), // 물류센터
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'workPopNo',
			headerText: t('lbl.DISTRICT'), // 배송권역
			dataType: 'code',
		},
		{
			dataField: 'districtCode',
			headerText: t('lbl.LBL_DELIVERYGROUP'), // pop
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'chuteNo',
			headerText: t('슈트번호'), // 배송권역
			dataType: 'code',
		},
		{
			dataField: 'rolltainerMax',
			headerText: '롤테이너(Max)',
			dataType: 'numeric',
		},
		{
			headerText: '롤테이너번호구간',
			children: [
				{
					dataField: 'rolltainerStartNo',
					headerText: 'From',
					dataType: 'numeric',
					maxlength: 5,
				},
				{
					dataField: 'rolltainerEndNo',
					headerText: 'To',
					dataType: 'numeric',
					maxlength: 5,
				},
			],
		},
		{
			dataField: 'carNo',
			headerText: t('lbl.CARNO'),
			dataType: 'code',
			required: true,
		},
		// {
		// 	dataField: 'delYn',
		// 	headerText: t('lbl.CONTROLTYPE'),
		// 	dataType: 'code',
		// },
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return item.processYn !== 'N';
		},
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * grid data 에 대한 valid  체크
	 */
	const validaterDataInfo = () => {
		// 중복 체크 (물류센터,배송권역,pop,자동차번호)
		if (gridRef.current.validatePKGridData(['dcCode', 'workPopNo', 'districtCode', 'carNo'])) {
			const gridObj = gridRef.current;
			const allData = gridObj.getGridData();
			// 전체 엑셀 데이터가 아닌, 사용자가 저장하려고 "체크한" 데이터만 검사 대상으로 변경
			const checkItem = gridObj.getCustomCheckedRowItems();

			for (const item of checkItem) {
				const currentStartNo = Number(item.rolltainerStartNo || 0);
				const currentEndNo = Number(item.rolltainerEndNo || 0);
				const currentRolltainerMax = Number(item.rolltainerMax || 0);

				//currentStartNo, currentEndNo 값이 currentRolltainerMax 보다 크면 안됨
				if (currentStartNo > currentRolltainerMax || currentEndNo > currentRolltainerMax) {
					showMessage({
						content: '롤테이너(Max) 값보다 클 수 없습니다',
						modalType: 'error',
					});
					return false;
				}

				// currentStartNo 값이 currentEndNo 값보다 클 수 없음
				if (commUtil.isNotEmpty(currentEndNo) && currentStartNo > currentEndNo) {
					showMessage({
						content: 'From 값이 To 값보다 클 수 없습니다',
						modalType: 'error',
					});
					return false;
				}

				// deCode : 물류센터, districtCode : pop,
				// const otherData = allData.filter((aRow: any) => aRow._$uid !== item._$uid);
				const otherData = allData.filter(
					(aRow: any) =>
						aRow._$uid !== item._$uid && aRow.dcCode === item.dcCode && aRow.districtCode === item.districtCode,
				);
				const isOverLapped = otherData.find((row: any) => {
					const otherStart = Number(row.rolltainerStartNo || 0);
					const otherEnd = Number(row.rolltainerEndNo || 0);

					return currentStartNo <= otherEnd && currentEndNo >= otherStart;
				});

				if (isOverLapped) {
					showMessage({
						content: `동센터(${isOverLapped.dcCode})의 동POP(${isOverLapped.districtCode})에 
						중복된 롤테이너 From: ${isOverLapped.rolltainerStartNo} , to: ${isOverLapped.rolltainerEndNo} 
						정보가 존재합니다`,
						modalType: 'error',
					});

					return false;
				}
			}
			return true;
		}
	};

	/**
	 * 엑셀 데이터 세팅 후 필수값 체크를 위한 delay
	 * 지정된 지연 시간 후 그리드 유효성 검사를 수행하고 결과를 Promise로 반환
	 * @returns {Promise<boolean>} 유효성 검사 결과 (true/false)
	 */
	const validateGridDataWithDelay = () => {
		return new Promise(resolve => {
			// AUIGrid가 데이터 처리를 완료할 지연 시간 설정
			setTimeout(() => {
				// 유효성 검사 로직 호출
				const isValid = gridRef.current.validateRequiredGridData();
				// 검사 결과를 Promise의 resolve를 통해 반환
				resolve(isValid);
			}, 50);
		});
	};

	// 엑셀 선택 시 처리: 컬럼 세팅 후 검증 호출
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	// 서버 검증 호출 및 Grid 반영
	const validateExcelList = async () => {
		let params = gridRef.current.getGridData();
		if (!params || params.length < 1) {
			showMessage({ content: t('msg.MSG_COM_VAL_020'), modalType: 'info' });
			return;
		}

		// 팝업 전달 dccode 기본 주입
		if (dccode) {
			params = params.map((row: any) => ({ ...row, dcCode: row.dcCode || dccode }));
			gridRef.current.setGridData(params);
		}

		const isValid = await validateGridDataWithDelay();
		if (!isValid) return;

		apiGetValidateExcelList(params).then((res: any) => {
			const rowsToUpdate = res?.data?.data || res?.data || [];
			const checkColumn = [
				{ dataField: 'processYn', headerText: '체크결과' },
				{ dataField: 'processMsg', headerText: '체크메시지' },
				{ dataField: 'rowStatus', headerText: '상태(I/U)', visible: false },
			];
			gridRef.current.addColumn(checkColumn, 1);

			const gridRows = gridRef.current.getGridData();
			const updateData: any[] = [];
			const updateIndex: any[] = [];

			rowsToUpdate.forEach((row: any) => {
				const idx = gridRows.findIndex(
					(g: any) =>
						g.dcCode === row.dcCode &&
						g.districtCode === row.districtCode &&
						g.carNo === row.carNo &&
						g.workPopNo === (row.workPopNo === null ? '' : row.workPopNo),
				);
				if (idx >= 0) {
					const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [gridRows[idx]._$uid]);
					if (rowIndex !== undefined) {
						const processYn = row.processYn || 'N';
						const processMsg = row.processMsg || '';
						const rowStatus = row.updateYn === 'Y' ? 'U' : 'I';
						updateData.push({ processYn, processMsg, rowStatus });
						updateIndex.push(rowIndex);
					}
				}
			});

			if (updateData.length > 0) {
				gridRef.current.updateRows(updateData, updateIndex);
			}

			const uncheckedItems = gridRef.current.getGridData().filter((it: any) => it.processYn === 'N');
			const uncheckedIds = uncheckedItems.map((it: any) => it._$uid);
			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveExcelList = () => {
		// // 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		// const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		// if (!updatedItems || updatedItems.length < 1) {
		// 	showMessage({
		// 		content: t('msg.MSG_COM_VAL_020'),
		// 		modalType: 'info',
		// 	});
		// 	return;
		// }
		// if (!gridRef.current.validateRequiredGridData()) return;

		// // 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		// 	apiPostSaveMasterList(updatedItems).then(() => {
		// 		// 전체 체크 해제
		// 		gridRef.current.setAllCheckedRows(false);
		// 		// AUIGrid 변경이력 Cache 삭제
		// 		gridRef.current.resetUpdatedItems();
		// 		showMessage({
		// 			content: t('msg.MSG_COM_SUC_003'),
		// 			modalType: 'info',
		// 		});
		// 	});
		// });

		const validData = validaterDataInfo();
		if (!validData) return false;

		const params = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		// 유효성 검사 통과 못한 데이터 확인
		// const isProcessYN = params.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		// if (isProcessYN) {
		// 	showMessage({
		// 		content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
		// 		modalType: 'info',
		// 	});
		// 	return;
		// }

		//params.length 대신에 params[].rowStatus 건수로 변경
		// Block save when any selected row is not validated
		const isProcessYN = params.some((item: any) => item.processYn !== 'Y');
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const newCount = params.filter((item: any) => item.rowStatus === 'I').length;
		const updateCount = params.filter((item: any) => item.rowStatus === 'U').length;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${newCount}건
				수정 : ${updateCount}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveMasterList(params).then((res: any) => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							close();
						},
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// 	btnLabel: '양식다운로드',
			// },
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
		],
	};

	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '배송권역별_차량_관리.xlsx',
		};

		fileUtil.downloadFile(params);
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	/**
	 * 다운로드용 샘플 데이터 추가
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (!gridRefCur) return;

		// cellClick 이벤트에서 processYn이 'N'이면 체크 막기
		gridRefCur.bind('cellClick', (event: any) => {
			if (event.dataField === gridRefCur.getProp('customRowCheckColumnDataField')) {
				// 체크하려고 할 때 (unCheckValue -> checkValue로 변경하려고 할 때)
				if (event.value === gridRefCur.getProp('customRowCheckColumnUnCheckValue')) {
					// processYn이 'N'이면 체크 막기
					if (event.item?.processYn === 'N') {
						setTimeout(() => {
							gridRefCur.setCellValue(
								event.rowIndex,
								gridRefCur.getProp('customRowCheckColumnDataField'),
								gridRefCur.getProp('customRowCheckColumnUnCheckValue'),
								true,
							);
						}, 0);
					}
				}
			}
		});

		// 25/12/16 수정: 초기 행 삭제
		// gridRef.current.setGridData([
		// 	{
		// 		dcCode: '',
		// 		workPopNo: '',
		// 		districtCode: '',
		// 		rolltainerMax: 0,
		// 		rolltainerStartNo: 0,
		// 		rolltainerEndNo: 0,
		// 		carNo: '',
		// 		delYn: 'N',
		// 	},
		// ]);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="권역별차량관리 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					{/* "양식 다운로드"를 gridBtn으로 넘기지 않고 버튼으로 추가 */}
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default MsDistrictUploadExcelPopup;
