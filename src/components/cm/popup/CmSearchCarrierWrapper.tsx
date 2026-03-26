import CmSearchCarrierPopup from '@/components/cm/popup/CmSearchCarrierPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

interface PopupParams {
	gridRef: any;
	rowIndex: number;
	dataFieldMap: Record<string, string>; // 예: { custcd: "code", custnm: "name" }
	popupType: string;
	codeName?: string;
	customDccode?: string; // 추가: customDccode 필드(검색조건의 물류센터 적용)
	carrierType?: string;
	onConfirm?: (selectedRows: any[]) => void; // 추가 콜백 함수
}

const CmSearchCarrierWrapper = forwardRef((_, ref) => {
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
		if (popupParams?.onConfirm) {
			popupParams.onConfirm(selectedRows);
		} else {
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
				<CmSearchCarrierPopup
					type={popupParams.popupType}
					callBack={handleConfirm}
					close={handleClose}
					codeName={popupParams?.codeName}
					customDccode={popupParams?.customDccode}
					carrierType={popupParams?.carrierType}
				/>
			)}
		</CustomModal>
	);
});

export default CmSearchCarrierWrapper;
