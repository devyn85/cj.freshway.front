import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

interface PopupParams {
	gridRef: any;
	rowIndex: number;
	dataFieldMap: Record<string, string>; // 예: { custcd: "code", custnm: "name" }
	popupType: string;
	codeName?: string;
	customDccode?: string; // 추가: customDccode 필드(검색조건의 물류센터 적용)
	data?: any; // 추가: data 필드(검색조건의 위탁물류 적용)
	onConfirm?: (selectedRows: any[]) => void; // 추가 콜백 함수
	onCallBack?: (selectedRows: any[]) => void; // 추가 콜백 함수
}

const CmSearchWrapper = forwardRef((_, ref) => {
	const modalRef = useRef<any>(null);
	const [popupParams, setPopupParams] = useState<PopupParams | null>(null);

	// 외부에서 호출할 수 있는 open 메서드
	useImperativeHandle(ref, () => ({
		open: (params: PopupParams) => {
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
		if (!popupParams || !selectedRows || selectedRows.length === 0) return;

		// 외부에서 전달받은 콜백 함수가 있으면 실행
		if (popupParams?.onConfirm) {
			popupParams.onConfirm(selectedRows);
		} else {
			// 기존 로직 (콜백이 없는 경우)
			const { gridRef, rowIndex, dataFieldMap } = popupParams;
			const rowData = selectedRows[0];

			// 업데이트할 필드 구성
			const updateObj: Record<string, any> = {};
			Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
				updateObj[targetField] = rowData[sourceField];
			});

			// 안전한 업데이트를 위해 next tick으로 밀기
			setTimeout(() => {
				gridRef?.current?.updateRow(updateObj, rowIndex);
				modalRef.current?.handlerClose();

				if (popupParams?.onCallBack) {
					popupParams.onCallBack(selectedRows);
				}
			}, 0);
		}

		// rowIndex 값으로 rowId 조회 후 체크박스 추가
		popupParams?.gridRef?.current?.addCheckedRowsByIds(
			popupParams?.gridRef?.current?.indexToRowId(popupParams?.rowIndex),
		);
	};

	const handleClose = () => {
		modalRef.current?.handlerClose();
	};

	return (
		<CustomModal ref={modalRef} width="1280px">
			{popupParams && (
				<CmSearchPopup
					type={popupParams.popupType}
					callBack={handleConfirm}
					close={handleClose}
					codeName={popupParams?.codeName}
					customDccode={popupParams?.customDccode}
					data={popupParams?.data}
				/>
			)}
		</CustomModal>
	);
});

export default CmSearchWrapper;
