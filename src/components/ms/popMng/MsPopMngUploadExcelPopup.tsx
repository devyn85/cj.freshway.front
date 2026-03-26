/*
 ############################################################################
 # FiledataField	: MsPopMngUploadExcelPopup.tsx
 # Description		:  상품 엑셀 업로드 팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.07.22
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import dayjs from 'dayjs';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostSaveExcelList } from '@/api/ms/apiMsPopMng';
import fileUtil from '@/util/fileUtils';

interface PropsType {
	close?: any;
}

const MsPopMngUploadExcelPopup = (props: PropsType) => {
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
			headerText: t('lbl.DCCODE'), // 물류센터
			dataField: 'dccode',
		},
		{
			headerText: t('lbl.POPNO'), // POP번호
			dataField: 'deliverygroup',
		},
		// {
		// 	headerText: 'BCR사용',
		// 	dataField: 'other02',
		// },
		{
			headerText: '롤테이너',
			dataField: 'other01',
		},
		{
			headerText: t('lbl.CUST_CODE'),
			dataField: 'custkey',
			required: true,
		},
		{
			headerText: t('lbl.CARNO'), // 차량번호
			dataField: 'carno',
		},
		{
			headerText: '변경시작일자',
			dataField: 'fromdate',
			required: true,
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		// 변경 데이터 확인
		const gridData = gridRef.current.getGridData();
		const updateData = gridData.map((item: any) => {
			const fromdate = item.fromdate ? item.fromdate : dayjs().add(3, 'day').format('YYYYMMDD');
			return {
				...item,
				fromdate,
			};
		});

		gridRef.current.setGridData(updateData);

		// setGridData로 인해 _$uid가 재생성되므로, 갱신된 데이터를 다시 가져와야 합니다.
		const newGridData = gridRef.current.getGridData();

		const params = {
			avc_COMMAND: 'DATACHECK',
			processtype: 'SPMS_CUSTXPOP_EXLCHK',
			saveList: newGridData.map((item: any) => {
				return {
					...item,
					rolltainerNo: item.other01,
					popno: item.deliverygroup,
					deliverydt: item.fromdate,
					slipdt: item.fromdate,
					slipno: item.fromdate,
					sliptype: item.fromdate,
				};
			}),
		};

		if (!params || params.saveList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		apiPostSaveExcelList(params).then(res => {
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
			const rowsToUpdate = res.data.data;
			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				const rowKeys = Object.keys(row);
				const checkKeys = ['dccode', 'popno', 'rolltainerNo', 'custkey', 'carno', 'fromdate'];

				// 3. GridData를 순회하며 일치하는 레코드를 찾습니다.
				const foundIndex = params.saveList.findIndex((gridRow: any) => {
					// 모든 키에 대해 비교를 수행합니다.
					return rowKeys.every(key => {
						// 제외 키 목록에 포함되어 있으면 비교하지 않습니다.
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

				const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [params.saveList[foundIndex]._$uid]);
				if (rowIndex !== undefined) {
					updateData.push({
						processYn: row.processYn === 'N' ? 'Y' : 'N', // 프로시저에서 넘어올때 성공시 N 실패시 E로 넘어옴
						processMsg: row.processMsg,
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

	const saveExcelList = () => {
		// 변경 데이터 확인
		const params = {
			avc_COMMAND: 'DATAUPLOAD',
			processtype: 'SPMS_CUSTXPOP_EXCEL',
			saveList: gridRef.current.getCustomCheckedRowItems().map((item: any) => {
				return {
					...item,
					deliverydt: item.fromdate,
					slipdt: item.fromdate,
					slipno: item.fromdate,
					sliptype: item.fromdate,
				};
			}),
		};
		if (!params || params.saveList.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = params.saveList.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : 0건
				수정 : ${params.saveList.length}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveExcelList(params).then(() => {
				gridRef.current.setSelectedRowValue({ ...params, rowStatus: 'R' });
				gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();
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

	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '거래처별_POP관리.xlsx',
		};

		fileUtil.downloadFile(params);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelSelect',
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
			// {
			// 	btnType: 'plus',
			// },
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
			<PopupMenuTitle name="POP 일괄업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					{/* "양식 다운로드"를 gridBtn으로 넘기지 않고 버튼으로 추가 */}
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
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

export default MsPopMngUploadExcelPopup;
