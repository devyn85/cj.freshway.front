/*
############################################################################
 # FiledataField	: TmSearchHjDong.tsx
 # Description		: 센터별구간설정(행정동팝업)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 2025.09.12
 ############################################################################
*/

import CustomModal from '@/components/common/custom/CustomModal';
import TmHjdPopUp from '@/components/tm/distanceBand/TmHjdPopUp';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

interface PopupParams {
	gridRef: any;
	rowIndex: number;
	dataFieldMap: Record<string, string>; // 예: { custcd: "code", custnm: "name" }
	selectRow: any;
	selectData: any;
	// popupType: string;
	onConfirm?: (selectedRows: any[]) => void; // 추가 콜백 함수
}

const TmSearchHjDong = forwardRef((_, ref) => {
	const modalRef = useRef<any>(null);
	const [popupParams, setPopupParams] = useState<PopupParams | null>(null);

	// 외부에서 호출할 수 있는 open 메서드
	useImperativeHandle(ref, () => ({
		open: (params: PopupParams) => {
			////console.log((params);
			setPopupParams(params);
			// 다음 tick에 modal open
			setTimeout(() => modalRef.current?.handlerOpen(), 0);
		},
		handlerClose: () => {
			modalRef.current?.handlerClose();
		},
	}));

	// 팝업 확인 시 실행될 콜백
	const handleConfirm = (selectedRows: any[]) => {
		if (!popupParams || !selectedRows || selectedRows.length === 0) {
			const { gridRef, rowIndex, dataFieldMap, selectData } = popupParams;
			gridRef?.current?.removeRow(rowIndex);
			modalRef.current?.handlerClose();
			showAlert(null, '선택된 데이터가 이미 존재합니다.'); // 데이터가 없습니다.
			return;
		}
		////console.log((selectedRows);
		// 외부에서 전달받은 콜백 함수가 있으면 실행
		if (popupParams?.onConfirm) {
			popupParams.onConfirm(selectedRows);
		} else {
			const { gridRef, rowIndex, dataFieldMap, selectData } = popupParams;
			if (selectedRows.length === 1) {
				// 기존 로직 (콜백이 없는 경우)

				const rowData = selectedRows[0];
				//console.log((rowData);
				if (rowData._$depth <= 1 || rowData.sigKorNm === '전체' || isEmpty(rowData.sigKorNm)) {
					showAlert('', '2레벨 부터 선택 가능합니다.');
					return;
				}
				if (rowData.sigKorNm === '전체') {
					//console.log((2);
				}
				if (isEmpty(rowData.sigKorNm)) {
					rowData.sigKorNm = '전체';
				}
				if (isEmpty(rowData.hjdongNm)) {
					rowData.hjdongNm = '전체';
				}

				// 업데이트할 필드 구성
				const updateObj: Record<string, any> = {
					// ...selectData,
					dcCode: selectData.dcCode,
					fromDate: dayjs().format('YYYYMMDD'), // 내일,
					toDate: '29991231',
					courier: selectData.courier,
					courierRange: selectData.base, // base에 courierRange 값 할당
				};
				Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
					updateObj[targetField] = rowData[sourceField];
				});
				////console.log((updateObj);
				////console.log((rowIndex);
				// 안전한 업데이트를 위해 next tick으로 밀기
				setTimeout(() => {
					gridRef?.current?.updateRow(updateObj, rowIndex);
					modalRef.current?.handlerClose();
				}, 0);
				// rowIndex 값으로 rowId 조회 후 체크박스 추가
				popupParams?.gridRef?.current?.addCheckedRowsByIds(
					popupParams?.gridRef?.current?.indexToRowId(popupParams?.rowIndex),
				);
			} else if (selectedRows.length > 1) {
				const { gridRef, dataFieldMap, selectData } = popupParams;

				// //console.log((selectData);

				const hasInvalidRow = selectedRows.some(
					rowData => rowData._$depth <= 1 || rowData.sigKorNm === '전체' || isEmpty(rowData.sigKorNm),
				);
				//console.log((selectedRows);
				if (hasInvalidRow) {
					//console.log((selectedRows);
					showAlert('', '2레벨 부터 선택 가능합니다.');
					return;
				}
				gridRef?.current?.removeRow(rowIndex);
				selectedRows.forEach(rowData => {
					if (rowData._$depth <= 1) {
						showAlert('', '2레벨 부터 선택 가능합니다.');
						return;
					}
					// 'sigKorNm', 'hjdongNm' 값이 없으면 '전체'로 세팅
					if (isEmpty(rowData.sigKorNm)) {
						rowData.sigKorNm = '전체';
					}
					if (isEmpty(rowData.hjdongNm)) {
						rowData.hjdongNm = '전체';
					}

					// 매핑된 필드로 새 row 생성
					const newRow: Record<string, any> = {
						// ...selectData,
						dcCode: selectData.dcCode,
						fromDate: dayjs().format('YYYYMMDD'), // 내일,
						toDate: '29991231',
						courier: selectData.courier,
						// courierRange: selectData.base, // base에 courierRange 값 할당
						rowStatus: 'I',
						courierRange: selectData.base, // base에 courierRange 값 할당
						// fromDate: dayjs().format('YYYYMMDD'), // 오늘 날짜
						// toDate: '29991231', // 종료일
						// 필요시 다른 필드도 추가
					};
					Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
						newRow[targetField] = rowData[sourceField];
					});
					// row 추가
					gridRef?.current?.addRow(newRow);
				});
				// 모달 닫기
				setTimeout(() => {
					modalRef.current?.handlerClose();
				}, 0);
			}
		}
	};

	const handleClose = () => {
		modalRef.current?.handlerClose();
	};

	return (
		<CustomModal ref={modalRef} width="340px">
			{/* {popupParams && <CmSearchPopup type={popupParams.popupType} callBack={handleConfirm} close={handleClose} />} */}
			{popupParams && <TmHjdPopUp callBack={handleConfirm} close={handleClose} data={popupParams.selectData} />}
		</CustomModal>
	);
});

export default TmSearchHjDong;
