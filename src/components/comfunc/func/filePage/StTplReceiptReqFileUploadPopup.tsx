/*
 ############################################################################
 # FiledataField	: PopupFileUploader.tsx
 # Description		: 팝업 파일 업로드
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

//Utils

//component
import {
	apiGetDocNo,
	apiGetUploadFileList,
	apiPostConfirmTplReceipReqFileUpload,
	apiPostDeleteTplReceipReqFileUpload,
	apiPostSaveTplReceipReqFileUploadTemp,
	apiPoststTplReceiptReqFileDownload,
} from '@/api/st/apiStTplReceiptReq';
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import fileUtil from '@/util/fileUtils';
import { isEmpty } from 'lodash';

//API Call Function

// 넘겨받은 Props 타입 정의
type popupProps = {
	docNo: any;
	callBack: any;
	docType: any;
	rowStatus: any;
};

const StTplReceiptReqFileUploadPopup = forwardRef((props: popupProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, docNo, docType, rowStatus } = props;
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);
	ref.gridRef = useRef();
	const [totalSize, setTotalSize] = useState(0);
	const [totalSizeMB, setTotalSizeMB] = useState('0');

	const MAX_UPLOAD_SIZE = 31458000;

	const [fileInfoList, setFileInfoList] = useState([]);
	const [previewImage, setPreviewImage] = useState('');
	const [newDocNo, setNewDocNo] = useState('');
	const uploadFile = useRef(null);
	const [saveFormData, setSaveFormData] = useState([]);

	const gridCol = [
		{
			headerText: 'docNo',
			dataField: 'docNo',
			visible: false,
		},
		{
			headerText: 'transFileName',
			dataField: 'transFileName',
			visible: false,
		},
		{
			headerText: 'serialkey',
			dataField: 'serialkey',
			visible: false,
		},
		{
			headerText: '파일명',
			dataField: 'fileName',
			dataType: 'default',
			editable: false,
		},
		// {
		// 	/**
		// 	 * 상태
		// 	 * N = 저장 상태(NAS), Y = 확정 상태 (EDMS)
		// 	 */
		// 	headerText: '상태',
		// 	dataField: 'status',
		// 	dataType: 'code',
		// 	editable: false,
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		if (value === 'Y') {
		// 			return '확정';
		// 		} else if (value === 'N') {
		// 			return '미확정';
		// 		} else {
		// 			return '';
		// 		}
		// 	},
		// },
		{
			/**
			 * 경로
			 * 업로드 경로(CRM, WMS, ...)
			 */
			headerText: '경로',
			dataField: 'uploadLocation',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '파일작성일자',
			dataField: 'adddate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			headerText: 'comfunc.filepage.grid.attchFileExtNm',
			dataField: 'fileExtension',
			visible: false,
		},
		{
			headerText: '파일크기(KB)',
			dataField: 'fileSize',
			dataType: 'numeric',
			visible: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return Math.round(value / 1024).toLocaleString();
			},
		},
	];

	const gridProps = {
		editable: true,
		softRemoveRowMode: true,
		softRemovePolicy: 'exceptNew',
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * Totalsize 재설정
	 */
	function resizingTotal() {
		const attchFileSzList = gridRef.current.getColumnValues('attchFileSz', true);
		let sum = 0;
		attchFileSzList.forEach(function (item: number) {
			sum += Number(item);
		});

		setTotalSize(sum);
	}

	/**
	 * 업로드 클릭
	 */
	function onClickFileUpload() {
		uploadFile.current.click();
	}

	/**
	 * 업로드 이벤트
	 * @param {object} event 업로드 파일 변경 이벤트
	 */
	function changeUploadEvent(event: any) {
		const files = uploadFile.current.files;
		const tmpFileList = [...fileInfoList];
		const tmpSaveList = [...saveFormData];

		for (const element of files) {
			// 사이즈 검사
			if (totalSize + element.size >= MAX_UPLOAD_SIZE) {
				showAlert('', t('msg.MSG_COM_ERR_006'));
				continue;
			}

			setTotalSize(totalSize + element.size);
			const currentFile = {
				docNo: docNo,
				fileName: element.name,
				// attchFileSz: element.size.toString(),
				fileSize: element.size,
				docType: docType,
				// attchFileExtNm: element.name.split('.')[1],
				fileExt: element.name.split('.').pop() || '',
				uploadDate: new Date().toISOString(),
				fileTp: 'cpt',
				rowStatus: 'I',
				uuid: uuidv4(),
			};
			if (isEmpty(currentFile.docNo)) {
				currentFile.docNo = newDocNo;
			}
			// 임시 저장
			tmpFileList.push(currentFile);
			tmpSaveList.push(element);

			gridRef.current.addRow(currentFile, 'last');
		}

		resizingTotal();

		// 파일 리스트 저장
		setFileInfoList(tmpFileList);
		setSaveFormData(tmpSaveList);

		// preview 마지막 파일
		const lastFile = files[files.length - 1];
		if (dataRegex.isImage(lastFile.name?.toLowerCase())) {
			setPreviewImage(window.URL.createObjectURL(lastFile));
		}

		// 같은 파일을 재업로드할 수 있도록 이벤트 초기화
		event.target.value = '';
	}

	/**
	 * 첨부파일 삭제
	 */
	function onClickRemoveButton() {
		const selectedItems = gridRef.current.getCheckedRowItems();

		// 선택된 항목 검증
		if (!selectedItems || selectedItems.length === 0) {
			showAlert('', '삭제할 파일을 선택해주세요.');
			return;
		}

		const deleted = selectedItems;
		// const serialkey = deleted?.SERIALKEY || deleted?.serialkey;
		const serialkey = selectedItems.map((row: any) => row.item?.serialkey).filter((v: any) => !!v);

		// 서버에 저장된 파일인 경우
		if (serialkey) {
			handleServerFileDelete(selectedItems, deleted, serialkey);
		} else {
			// 새로 추가된 파일인 경우 (로컬에서만 제거)
			handleLocalFileDelete(selectedItems, deleted);
		}
	}
	/**
	 * 서버 저장된 파일 삭제 처리
	 * @param selectedItem
	 * @param deleted
	 * @param serialkey
	 */
	function handleServerFileDelete(selectedItem: any, deleted: any, serialkey: string) {
		const payload = { docNo, docType, serialkeys: [serialkey] };

		if (selectedItem.status === 'Y') {
			showAlert('', '이미 확정된 파일은 삭제할 수 없습니다.');
			return;
		}
		if (isEmpty(payload.docNo)) {
			payload.docNo = newDocNo;
		}

		apiPostDeleteTplReceipReqFileUpload(payload)
			.then(res => {
				if (res?.data?.statusCode === 0) {
					// 그리드에서 행 제거
					const serialkeyList = selectedItem.map((row: any) => row.rowIndex).filter((v: any) => !!v);
					for (const e of serialkeyList) {
						gridRef.current.removeRow(e);
					}

					// UI 상태 업데이트
					setPreviewImage('');
					updateTotalSize(deleted);

					showMessage({
						content: '파일이 삭제되었습니다.',
						modalType: 'info',
					});

					// 부모 컴포넌트에 결과 전달
					// callBack?.(res.data);
					apiGetUploadFileList(payload).then(res => {
						// //console.log('uploadPopup api === ', res);
						// gridRef.current.setGridData(res.data);
						// const colSizeList = gridRef.current.getFitColumnSizeList(true);

						// gridRef.current.setColumnSizeList(colSizeList);
						// resizingTotal();

						const params = {
							// newDocNo: newDocNo,
							count: res.data.length,
							ref: ref.griRef,
						};
						callBack(params);
					});
				}
			})
			.catch(error => {});
	}
	/**
	 * 파일 다운로드
	 * @param {object} event 파일 다운로드 이벤트
	 */
	function registerFileDownloadEvent(event: any) {
		const serialkey = gridRef.current.getCellValue(event.rowIndex, 'serialkey');
		const attchFileNm = gridRef.current.getCellValue(event.rowIndex, 'transFileName');
		const fileName = gridRef.current.getCellValue(event.rowIndex, 'fileName');
		const docNo1 = !isEmpty(docNo) ? docNo : newDocNo;

		if (commUtil.isEmpty(serialkey)) {
			return;
		}

		const params = {
			// attchFileNm: attchFileNm,
			// saveFileNm: fileName,
			attchFileNm: fileName,
			saveFileNm: attchFileNm,
			docNo: docNo1,
		};

		apiPoststTplReceiptReqFileDownload(params).then(res => {
			fileUtil.download(res);
		});
	}
	/**
	 * 로컬 파일 삭제 처리 (새로 추가된 파일)
	 * @param selectedItem
	 * @param deleted
	 */
	function handleLocalFileDelete(selectedItem: any, deleted: any) {
		// 그리드에서 행 제거
		gridRef.current.removeRow(selectedItem.rowIndex);

		// UI 상태 업데이트
		setPreviewImage('');
		updateTotalSize(deleted);

		// saveFormData에서도 제거
		const fileName = deleted.fileName || deleted.attchFileNm;
		const updatedSaveData = saveFormData.filter((file: any) => file.name !== fileName);
		setSaveFormData(updatedSaveData);
	}
	/**
	 * 총 파일 크기 업데이트
	 * @param deleted
	 */
	function updateTotalSize(deleted: any) {
		const fileSize = Number(deleted.fileSizeBytes ?? deleted.fileSize ?? deleted.attchFileSz ?? 0);
		setTotalSize(prevSize => Math.max(0, prevSize - fileSize));
	}
	/**
	 * 조회
	 */
	// const searchMasterList = () => {
	// 	// 그리드 초기화
	// 	gridRef.current.clearGridData();

	// 	// 조회 조건 설정
	// 	const params = {
	// 		serialkey: props.serialkey,
	// 	};

	// 	apiPostFileList(params).then((res: any) => {
	// 		const gridRefCur = gridRef.current;
	// 		if (gridRefCur) {
	// 			gridRefCur?.setGridData(res.data);
	// 			gridRefCur?.setSelectionByIndex(0, 0);

	// 			const colSizeList = gridRef.current.getFitColumnSizeList(true);
	// 			gridRef.current.setColumnSizeList(colSizeList);
	// 		}
	// 	});
	// };
	/**
	 * 파일 업로드 저장 함수
	 * @returns {void}
	 */
	function onClickSaveButton() {
		const gridList = gridRef.current.getChangedData({ validationYn: false });

		if (gridList.length == 0) {
			showAlert('', '업로드할 파일이 없습니다.');
			return false;
		}

		// // 고객배송조건 이미지팝업 조건
		// if (gridList.length > 2) {
		// 	showAlert('', '첨부파일은 총 2개만 가능합니다.');
		// 	return false;
		// }

		const formDataParam = new FormData(); // 파일 전송할 form
		saveFormData.forEach(function (item: any) {
			formDataParam.append('file', item);
		});

		// FileUploaderEdms 규격으로 파일 메타 구성 (TmIssue와 동일)
		const mappedList = saveFormData.map((file: any) => {
			const name = file?.name || '';
			const size = file?.size ?? 0;
			const ext = name.lastIndexOf('.') > -1 ? name.substring(name.lastIndexOf('.') + 1) : '';
			return {
				fileTp: 'cpt',
				attchFileNm: name,
				attchFileSz: String(size),
				attchFileExtNm: ext,
				rowStatus: 'I',
			};
		});

		formDataParam.append(
			'fileInfoList',
			new Blob([JSON.stringify(mappedList)], {
				type: 'application/json',
			}),
		);
		if (isEmpty(docNo)) {
			formDataParam.append('docNo', newDocNo);
		} else {
			formDataParam.append('docNo', docNo);
		}

		formDataParam.append('docType', docType);
		formDataParam.append('uploadLocation', 'WMS');
		if (isEmpty(rowStatus)) {
			formDataParam.append('status', 'N');
		} else {
			formDataParam.append('status', rowStatus); // 임시저장
		}

		// 임시저장 호출
		// formDataParam.append('code', code);
		apiPostSaveTplReceipReqFileUploadTemp(formDataParam).then(res => {
			if (res.data.statusCode === 0) {
				showAlert('', t('msg.MSG_COM_SUC_003'), () => {
					if (isEmpty(docNo)) {
						// formDataParam.append('docNo', );

						const params = {
							newDocNo: newDocNo,
							count: gridRef.current.getRowCount(),
						};
						callBack(params);
					} else {
						// formDataParam.append('docNo', docNo);
						const params = {
							// newDocNo: newDocNo,
							count: gridRef.current.getRowCount(),
						};
						callBack(params);
					}
				});
			}
		});
	}

	/**
	 * 확정(EDMS): 체크된 파일들 EDMS 업로드 (STATUS='Y'로 변경)
	 */
	function onClickConfirmButton() {
		const selected = gridRef.current.getCheckedRowItems();

		if (!selected || selected.length === 0) {
			showAlert('', '확정할 파일을 선택하세요.');
			return;
		}
		const serialkeys = selected.map((it: any) => it.item.SERIALKEY || it.item.serialkey).filter((v: any) => !!v);
		if (serialkeys.length === 0) {
			showAlert('', '선택 항목에 serialkey가 없습니다.');
			return;
		}
		// 제한: 기존 확정 + 선택 > 2는 백엔드에서 거름
		apiPostConfirmTplReceipReqFileUpload({ docNo, serialkeys }).then(res => {
			if (res.data.statusCode === 0) {
				showAlert('', t('msg.MSG_COM_SUC_003'), () => {
					callBack(res.data);
				});
			}
		});
	}

	/**
	 * 선택한 파일이 이미지인 경우 미리보기 세팅
	 * @param {object} event 파일 선택 변경 이벤트
	 */
	const registerRowSelectEvent = (event: any) => {
		if (!dataRegex.isImage(gridRef.current.getCellValue(event.rowIndex, 'fileExtension')?.toLowerCase())) {
			setPreviewImage('');
			return;
		}

		// 업로드 대기열에 있는지 확인
		const previewNm = event.item.fileName;

		const previewFile = saveFormData.find(file => {
			return file.name == previewNm;
		});

		if (previewFile) {
			// 업로드 대기열에 있는 경우 미리보기
			setPreviewImage(window.URL.createObjectURL(previewFile));
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setTotalSizeMB((totalSize / 1024 / 1024).toFixed(2));
	}, [totalSize]);

	// useEffect(() => {
	// 	// TO-DO : 업무 화면에 맞는 DATA 조회 로직 필요
	// 	const gridData = [
	// 		{
	// 			fileNm: '테스트_업로드_이미지.png',
	// 			attchFileNm: 'WMS_PLANTXSL_1751437631662_0.png',
	// 			attchFileSz: '77777',
	// 			attchFileExtNm: 'png',
	// 			serialkey: '77777',
	// 		},
	// 		{
	// 			fileNm: '2024년 CJ프레시웨이 표준계약서_삼일냉장제2물류.pdf',
	// 			attchFileNm: 'WMS_PLANTXSL_1729569930932_0.pdf',
	// 			attchFileSz: '251418',
	// 			attchFileExtNm: 'pdf',
	// 			serialkey: '83',
	// 		},
	// 		{
	// 			fileNm: '(준표준)창고보관계약서_삼일냉장_추가 약정(2024년).docx',
	// 			attchFileNm: 'WMS_PLANTXSL_1729569932605_1.docx',
	// 			attchFileSz: '35408',
	// 			attchFileExtNm: 'docx',
	// 			serialkey: '84',
	// 		},
	// 		{
	// 			fileNm: '2025년 CJ프레시웨이 표준계약서_삼일냉장제2물류.docx',
	// 			attchFileNm: 'WMS_PLANTXSL_1740101827778_0.docx',
	// 			attchFileSz: '221728',
	// 			attchFileExtNm: 'docx',
	// 			serialkey: '160',
	// 		},
	// 	];
	// 	gridRef.current.setGridData(gridData);
	// 	resizingTotal();
	// 	// searchMasterList();
	// }, []);
	useEffect(() => {
		const params = {
			docNo: docNo,
			docType: docType,
		};

		if (isEmpty(params.docNo) || params.docNo === null) {
			apiGetDocNo(params).then(res => {
				setNewDocNo(res.data.docNo);
			});
		} else {
			// 파일 목록 조회
			apiGetUploadFileList(params).then(res => {
				gridRef.current.setGridData(res.data);
				const colSizeList = gridRef.current.getFitColumnSizeList(true);

				gridRef.current.setColumnSizeList(colSizeList);
				resizingTotal();
			});
		}
		// gridRef.current.bind('cellClick', (event: any) => {
		// 	registerRowSelectEvent(event);
		// });
	}, []);
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField == 'fileName') {
				registerFileDownloadEvent(event);
			}
		});
	}, []);

	return (
		<>
			<PopupMenuTitle name={'위탁입출고 파일업로드'} showButtons={false} showChildrens={true}>
				{/* 파일업로드, 저장, 삭제 */}
				<Button onClick={onClickFileUpload}>{'파일추가'}</Button>
				<input
					ref={uploadFile}
					id="uploadInput"
					multiple
					type="file"
					style={{ display: 'none' }}
					onChange={changeUploadEvent}
				/>

				<Button onClick={onClickRemoveButton}>{'파일삭제'}</Button>
				<Button onClick={onClickSaveButton}>{'파일업로드'}</Button>
			</PopupMenuTitle>
			{/* 그리드 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<ButtonWrap data-props="message">
				<span>총 업로드 크기: {totalSizeMB} MB</span>
				<span>※ 총 파일 제한 사이즈: 30MB, 파일명내 허용된 특수문자: ., _, -, (, ), [, ]</span>
			</ButtonWrap>
		</>
	);
});
export default StTplReceiptReqFileUploadPopup;
