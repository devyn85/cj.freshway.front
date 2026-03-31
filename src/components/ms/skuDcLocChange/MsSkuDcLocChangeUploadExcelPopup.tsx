/*
 ############################################################################
 # FiledataField	: MsSkuDcLocChangeUploadExcelPopup.tsx
 # Description		:  저장품 기본 로케이션 관리 엑셀 업로드 팝업
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
import { apiGetValidateExcelList, apiPostSaveMasterList } from '@/api/ms/apiMsSkuDcLocChange';

interface PropsType {
	close?: any;
	dcCode?: string;
}

const MsSkuDcLocChangeUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, dcCode } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'),
			dataType: 'string',
			required: true,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			required: true,
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
	 * @param e
	 */
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
				const rowKeys = Object.keys(row);
				const checkKeys = ['dcCode', 'zon', 'loc', 'sku'];
				const foundIndex = params.findIndex((gridRow: any) => {
					// 모든 키에 대해 비교를 수행합니다.
					return rowKeys.every(key => {
						// 키 목록에 포함되어 있지 않으면 비교하지 않습니다.
						if (!checkKeys.includes(key)) {
							return true; // 제외할 필드는 항상 true로 간주하여 비교를 통과시킵니다.
						}

						// --- 값 정규화(Normalize) 로직 추가 ---
						// null, undefined를 ''(빈 문자열)로 통일 처리
						const normalize = (value: any) => {
							return value === null || value === undefined ? '' : value;
						};

						const normalizedRowValue = normalize(row[key]);
						const normalizedGridValue = normalize(gridRow[key]);

						// 현재 row의 값과 gridRow의 값이 동일한지 비교합니다.
						// (두 값이 모두 null이거나 undefined인 경우도 true로 처리)
						return normalizedRowValue == normalizedGridValue;
					});
				});
				const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [params[foundIndex]._$uid]);
				if (rowIndex !== undefined) {
					updateData.push({
						processYn: row.processYn,
						processMsg: row.processMsg,
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
		const updatedItems = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
			};
		});
		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
		신규 및 수정 : ${updatedItems.length}건`;

		const params = { processtype: 'MS_SKUDCLOCCHANGE', locList: updatedItems };

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveMasterList(params).then(res => {
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
				btnType: 'excelForm', // 엑셀다운로드
			},
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
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

	/**
	 * 다운로드용 샘플 데이터 추가
	 */
	useEffect(() => {
		gridRef.current.setGridData([]);
		// {
		// 	dcCode: '',
		// 	zone: '',
		// 	loc: '',
		// 	sku: '',
		// },
		// ]);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="저장품 기본 로케이션 엑셀 업로드" showButtons={false} />

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

export default MsSkuDcLocChangeUploadExcelPopup;
