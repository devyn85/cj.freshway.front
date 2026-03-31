/*
 ############################################################################
 # FiledataField	: MsSkuUploadExcelPopup.tsx
 # Description		:  상품 엑셀 업로드 팝업
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
import { apiGetValidateExcelList, apiPostSaveExcelList } from '@/api/ms/apiMsSku';

interface PropsType {
	close?: any;
}

const MsSkuUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			headerText: '상품코드',
			dataField: 'sku',
			required: true,
		},
		{
			headerText: 'PLT 단수',
			dataField: 'layerPerPlt',
		},
		{
			headerText: 'PLT 1단 박스수',
			dataField: 'boxPerLayer',
		},
		{
			headerText: '팔랫당박스수',
			dataField: 'boxPerPlt',
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

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

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		const params = gridRef.current.getGridData().map((item: any) => {
			return {
				...item,
			};
		});

		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 필수값 체크
		const isValid = await validateGridDataWithDelay();
		if (!isValid) {
			return;
		}

		apiGetValidateExcelList(params).then(res => {
			const checkColumn = [
				{
					dataField: 'processYn',
					headerText: '체크결과',
				},
				{
					dataField: 'processMsg',
					headerText: '체크메시지',
				},
			];
			gridRef.current.addColumn(checkColumn, 1);

			const rowsToUpdate = res.data;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				const rowIndex = gridRef.current.getRowIndexesByValue('sku', [row.sku]);
				if (rowIndex !== undefined) {
					let processMsg;
					let processYn;
					if (row.processYn === 'N') {
						processMsg = '등록된 상품이 없습니다.';
						processYn = 'N';
					} else {
						processMsg = '정상';
						processYn = 'Y';
					}
					updateData.push({
						processYn: processYn,
						processMsg: processMsg,
						rowStatus: 'U',
					});
					updateIndex.push(rowIndex);
				}
			});
			gridRef.current.updateRows(updateData, updateIndex);
			// 오류케이스 체크 해제
			const uncheckedItems = gridRef.current.getGridData().filter((item: any) => {
				return item.processYn === 'N';
			});
			const uncheckedIds = uncheckedItems.map((item: any) => item._$uid);

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
		// 	apiPostSaveExcelList(updatedItems).then(() => {
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
		// 변경 데이터 확인
		// dlvcustkey 사용 안 한다고 함 일단 강제 set
		const params = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
				dlvcustkey: item.custkey,
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

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : 0건
				수정 : ${params.length}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveExcelList(params).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						close();
					},
				});
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
			{
				btnType: 'excelDownload', // 엑셀다운로드
				btnLabel: '양식다운로드',
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

	/**
	 * 다운로드용 샘플 데이터 추가
	 */
	useEffect(() => {
		gridRef.current.setGridData([
			{
				sku: '',
				layerPerPlt: 0,
				boxPerLayer: 0,
				boxPerPlt: 0,
			},
		]);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="상품정보 엑셀 업로드" showButtons={false} />

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

export default MsSkuUploadExcelPopup;
