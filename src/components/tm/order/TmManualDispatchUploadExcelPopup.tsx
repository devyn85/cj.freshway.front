/*
############################################################################
# File			: TmManualDispatchUploadExcelPopup.tsx
# Description	: 수동배차 엑셀 업로드 팝업
# Author		: AI Assistant
# Since			: 25.12.23
############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import dayjs from 'dayjs';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Type
import { GridBtnPropsType } from '@/types/common';

// API

// Util
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';
import { useTranslation } from 'react-i18next';

import { apiPostOrderManualExcelUploadSave, apiPostOrderManualExcelUploadValidation } from '@/api/wm/apiWmDocument';
import { ChangeEvent, useRef } from 'react';

interface PropsType {
	dccode: string;
	deliveryDate: string;
	close?: () => void;
}

const TmManualDispatchUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, dccode, deliveryDate } = props;
	const excelUploadFileRef = useRef<HTMLInputElement>(null);
	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef<any>(null);

	// 그리드 초기화 (dataField는 API column 이름과 동일)
	const gridCol = [
		{ dataField: 'processYn', headerText: '체크결과', dataType: 'code' },
		{ dataField: 'processMsg', headerText: '체크메시지' },
		{ dataField: 'DCCODE', headerText: '물류센터코드', dataType: 'code' },
		{ dataField: 'DCNAME', headerText: '물류센터', dataType: 'code' },
		{ dataField: 'DELIVERY_DATE', headerText: '배송일자', dataType: 'date' },
		{ dataField: 'DELIVERY_TYPE', headerText: '배송유형', dataType: 'code' },
		{ dataField: 'AREA_GROUP_NAME', headerText: '권역그룹', dataType: 'code' },
		{ dataField: 'AREA_NAME', headerText: '권역', dataType: 'code' },
		{ dataField: 'DONG_CODE', headerText: '행정동코드', dataType: 'code' },
		{ dataField: 'ZIP_CODE', headerText: '우편번호', dataType: 'code' },
		{ dataField: 'CLAIM_YN', headerText: '클레임', dataType: 'code' },
		{ dataField: 'POP_NAME', headerText: 'POP', dataType: 'code' },
		{ dataField: 'TRUTH_CUST_KEY', headerText: '실착지코드', dataType: 'code' },
		{ dataField: 'CUST_NAME', headerText: '실착지명', dataType: 'text' },
		{ dataField: 'CUST_KEY', headerText: '관리처코드', dataType: 'code' },
		{ dataField: 'FROM_CUST_NAME', headerText: '관리처명', dataType: 'text' },
		{ dataField: 'SLIP_NO', headerText: '전표번호', dataType: 'code' },
		{ dataField: 'CLOSE_ROUTE', headerText: '주문마감경로', dataType: 'code' },
		{ dataField: 'CARNO', headerText: '차량번호', dataType: 'code' },
		{
			dataField: 'TURN',
			headerText: '회차',
			dataType: 'turnNo',
			style: 'ta-c',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === null || value === undefined || value === '') return '';
				// 소수점 제거하고 정수로 변환
				const intValue = Math.floor(Number(value));
				return Number.isNaN(intValue) ? value : intValue.toString();
			},
		},
		{ dataField: 'DRIVER_NAME', headerText: '기사명', dataType: 'code' },
		{ dataField: 'DRIVER_PHONE', headerText: '전화번호', dataType: 'code' },
		{ dataField: 'CONTRACT_TYPE', headerText: '계약유형', dataType: 'code' },
		{ dataField: 'TOTAL_WEIGHT', headerText: '중량(kg)', dataType: 'numeric', formatString: '#,##0.00' },
		{ dataField: 'TOTAL_CUBE', headerText: '체적(m³)', dataType: 'numeric', formatString: '#,##0.00' },
		{ dataField: 'FACE_CHECK_YN', headerText: '대면검수여부', dataType: 'code' },
		{ dataField: 'OTD', headerText: 'OTD', dataType: 'code' },
		{ dataField: 'SPECIAL_CONDITION_YN', headerText: '특수조건', dataType: 'code' },
		{ dataField: 'KEY_YN', headerText: '키 유무', dataType: 'code' },
		{ dataField: 'KEY_DETAIL', headerText: '키 상세조건', dataType: 'text' },
		{ dataField: 'ADDRESS', headerText: '주소', dataType: 'text' },
	];

	const transformApiResponse = (rows: any[]) => {
		return rows.map(row => {
			const rowData: Record<string, any> = { rowNumber: row.rowNumber };

			// cells 배열을 순회하며 데이터 추출 (모든 셀의 value 사용)
			row.cells?.forEach((cell: any) => {
				const { column, value } = cell;
				rowData[column] = value;
			});

			// invalidCells 체크
			// - rows의 invalidCells: 비정상적인 값, DB에 없는 데이터 등
			// - invalidRows의 invalidCells: 필수값 체크 실패
			const invalidCells = row.invalidCells || [];
			const hasError = invalidCells.length > 0;

			// processYn, processMsg 계산 (첫 번째 에러만 표시)
			return {
				...rowData,
				processYn: hasError ? 'N' : 'Y',
				processMsg: hasError ? invalidCells[0].errorMessage : '정상',
			};
		});
	};

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		enableCellMerge: false,
		editableMergedCellsAll: true,
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			// processYn이 'N'인 경우 체크박스 비활성화
			// showCustomRowCheckColumn 사용 시: false 반환 시 비활성화, true 반환 시 활성화 (반전 로직)
			return item?.processYn !== 'N';
		},
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 엑셀 파일 업로드 및 유효성 검사
	 * @param {ChangeEvent<HTMLInputElement>} e 이벤트 객체
	 */
	const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.currentTarget;
		const file = target.files?.[0];
		if (!file) return;

		try {
			// deliveryDate를 YYYYMMDD 형식으로 포맷
			const formattedDeliveryDate = deliveryDate ? dayjs(deliveryDate).format('YYYYMMDD') : dayjs().format('YYYYMMDD');

			const res = await apiPostOrderManualExcelUploadValidation({
				file: file,
				dccode: dccode,
				deliveryDate: formattedDeliveryDate,
			});

			if (res.statusCode === 0 && res.data) {
				const { rows, invalidRows } = res.data;
				// rows와 invalidRows를 합쳐서 처리 (rowNumber 기준 중복 제거)
				const allRowsMap = new Map<number, any>();

				// rows 먼저 추가
				(rows || []).forEach((row: any) => {
					allRowsMap.set(row.rowNumber, row);
				});

				// invalidRows 추가 (같은 rowNumber가 있으면 덮어쓰기)
				(invalidRows || []).forEach((row: any) => {
					allRowsMap.set(row.rowNumber, row);
				});

				// Map을 배열로 변환
				const allRows = Array.from(allRowsMap.values());
				const gridData = transformApiResponse(allRows);
				gridRef.current?.setGridData(gridData);

				// 컬럼 너비 자동 조절 (데이터 길이에 맞게)
				if (gridData && gridData.length > 0) {
					const colSizeList = gridRef.current?.getFitColumnSizeList?.(true);
					if (colSizeList) {
						const extraWidthDataFields = ['TRUTH_CUST_KEY', 'CUST_KEY', 'DRIVER_PHONE'];
						extraWidthDataFields.forEach(dataField => {
							const idx = gridRef.current?.getColumnIndexByDataField?.(dataField);
							colSizeList[idx] = colSizeList[idx] + 10;
						});
						gridRef.current?.setColumnSizeList?.(colSizeList);
					}
				}

				// 정상 행(processYn이 'Y')은 기본적으로 체크박스 선택
				setTimeout(() => {
					gridRef.current?.setCheckedRowsByValue('processYn', 'Y');
				}, 100);
			} else {
				showAlert('알림', res.statusMessage || '업로드에 실패했습니다.');
			}
		} catch (error: any) {
			showAlert('알림', `${error.message} 엑셀 업로드 중 오류가 발생했습니다.`);
		}
	};

	/**
	 * 저장 API 호출 성공 처리
	 * @param {any} res API 응답 객체
	 */
	const handleSaveSuccess = (res: any) => {
		showMessage({
			content: res.statusMessage || t('msg.MSG_COM_SUC_003'),
			modalType: 'info',
			onOk: () => {
				close?.();
			},
		});
	};

	/**
	 * 저장 API 호출 실패 처리
	 * @param {any} res API 응답 객체
	 */
	const handleSaveFailure = (res: any) => {
		const errorMsg = res.data?.errorMsg || res.statusMessage || '저장에 실패했습니다.';
		showMessage({
			content: errorMsg,
			modalType: 'info',
		});
	};

	/**
	 * 저장 API 호출 처리
	 * @param {string} formattedDeliveryDate 포맷된 배송일자
	 * @param {any[]} transformedData 변환된 데이터
	 */
	const handleSaveApiCall = async (formattedDeliveryDate: string, transformedData: any[]) => {
		const res = await apiPostOrderManualExcelUploadSave({
			dccode,
			deliveryDate: formattedDeliveryDate,
			rows: transformedData,
		});
		if (res.statusCode === 201) {
			handleSaveSuccess(res);
		} else {
			handleSaveFailure(res);
		}
	};

	const saveExcelList = async () => {
		// 체크된 행 가져오기
		const checkedRows = gridRef.current?.getCheckedRowItems() || [];

		if (checkedRows.length === 0) {
			showAlert('알림', '선택된 데이터가 없습니다.');
			return;
		}

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = checkedRows.some((item: any) => item.item?.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		// 차량번호별 개수 체크 (50개 제한)
		const carnoCountMap = new Map<string, number>();
		checkedRows.forEach((row: any) => {
			const rowData = row.item || row;
			const carno = rowData.CARNO;
			if (carno) {
				carnoCountMap.set(carno, (carnoCountMap.get(carno) || 0) + 1);
			}
		});

		// 50개 이상인 차량번호 확인
		// const exceededCarnos = Array.from(carnoCountMap.entries())
		// 	.filter(([, count]) => count >= 50)
		// 	.map(([carno]) => carno);

		// if (exceededCarnos.length > 0) {
		// 	showMessage({
		// 		content: '동일한 차량의 경유 포인트는 50건 이상을 할당할 수 없습니다. 배차를 재조정하시고 다시 시도 바랍니다.',
		// 		modalType: 'info',
		// 	});
		// 	return;
		// }

		// 그리드 데이터를 API 형식으로 변환
		const formattedDeliveryDate = deliveryDate ? dayjs(deliveryDate).format('YYYYMMDD') : dayjs().format('YYYYMMDD');

		const transformedData = checkedRows.map((row: any) => {
			const rowData = row.item || row;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { processMsg, processYn, rowNumber, customRowCheckYn, rowIndex, _$uid, ...rest } = rowData;
			const cells = Object.entries(rest).map(([column, value]) => ({
				column,
				value: value || '',
			}));

			return {
				rowNumber: rowNumber || 1,
				dccode,
				deliveryDate: formattedDeliveryDate,
				cells,
			};
		});

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
			신규 : 0건
			수정 : ${transformedData.length}건
			삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			handleSaveApiCall(formattedDeliveryDate, transformedData);
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'excelSelect',
				isActionEvent: false,
				callBackFn: () => {
					excelUploadFileRef.current?.click();
				},
			},
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
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

export default TmManualDispatchUploadExcelPopup;
