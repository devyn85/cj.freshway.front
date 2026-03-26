/*
 ############################################################################
 # FiledataField	: TmAmountByCarFileUploadPopup.tsx
 # Description		: 차량별운송비관리 증빙 파일 업로드
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.03.20
 ############################################################################
*/
// lib
import { Button, Col, Image, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

//Utils

//component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

//API Call Function
import {
	apiPostDeleteFile,
	apiPostDownloadFile,
	apiPostFileList,
	apiPostSaveFileUpload,
} from '@/api/tm/apiTmAmountByCar';

// 넘겨받은 Props 타입 정의
type popupProps = {
	serialkey: any;
	close?: any;
	callBack: any;
};

const TmAmountByCarFileUploadPopup = forwardRef((props: popupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);

	const [totalSize, setTotalSize] = useState(0);
	const [totalSizeMB, setTotalSizeMB] = useState('0');

	// 파일 크기 제한
	const MAX_UPLOAD_SIZE = 10486000;

	const [fileInfoList, setFileInfoList] = useState([]);
	const [previewImage, setPreviewImage] = useState('');
	const uploadFile = useRef(null);
	const [saveFormData, setSaveFormData] = useState([]);

	/*
	 ### 그리드 초기화 ###
	 */
	const gridCol = [
		{
			headerText: t('lbl.FILENAME'),
			dataField: 'fileNm', // fileName
			editable: false,
		},
		{
			headerText: t('lbl.FILE_SIZE'),
			dataField: 'attchFileSz', // fileSizeBytes
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'attchFileNm', // transFileName
			visible: false,
		},
		{
			dataField: 'attchFileExtNm', // fileExtension
			visible: false,
		},
		{
			dataField: 'fileLocation', // fileLocation
			visible: false,
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'serialkeyH',
			visible: false,
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		softRemoveRowMode: true,
		softRemovePolicy: 'exceptNew',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = () => {
		// 그리드 초기화
		gridRef.current.clearGridData();

		// 조회 조건 설정
		const params = {
			serialkeyH: props.serialkey,
		};

		apiPostFileList(params).then((res: any) => {
			const gridRefCur = gridRef.current;
			if (gridRefCur) {
				gridRefCur?.setGridData(res.data);
				gridRefCur?.setSelectionByIndex(0, 0);

				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
		});
	};

	/**
	 * Totalsize 재설정
	 */
	function resizingTotal() {
		const attchFileSzList = gridRef.current.getColumnValues('fileSizeBytes', true);
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
				fileTp: 'cpt',
				fileNm: element.name,
				attchFileNm: element.name,
				attchFileSz: element.size.toString(),
				attchFileExtNm: element.name.split('.')[1],
				rowStatus: 'I',
				uuid: uuidv4(),
			};

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
		// const lastFile = files[files.length - 1];
		// if (dataRegex.isImage(lastFile.name?.toLowerCase())) {
		// 	setPreviewImage(window.URL.createObjectURL(lastFile));
		// }

		// 같은 파일을 재업로드할 수 있도록 이벤트 초기화
		event.target.value = '';
	}

	/**
	 * 파일 업로드 저장 함수
	 * @returns {void}
	 */
	function onClickSaveButton() {
		const gridList = gridRef.current.getChangedData();

		if (gridList.length == 0) {
			showAlert('', t('msg.MSG_COM_VAL_020'));
			return false;
		}
		const formDataParam = new FormData(); // 파일 전송할 form
		saveFormData.forEach(function (item: any) {
			formDataParam.append('file', item);
		});

		formDataParam.append(
			'fileInfoList',
			new Blob([JSON.stringify(gridList)], {
				type: 'application/json',
			}),
		);

		formDataParam.append('serialkeyH', props.serialkey);

		apiPostSaveFileUpload(formDataParam).then(res => {
			if (res.data.statusCode === 0) {
				showAlert('', t('msg.MSG_COM_SUC_003'), () => {
					props.callBack(res.data, gridRef.current?.getGridData().length);
					searchMasterList();
				});
			}
		});
	}

	/**
	 * 파일 다운로드
	 * @param {object} event 파일 다운로드 이벤트
	 */
	async function registerFileDownloadEvent(event: any) {
		const serialkey = gridRef.current.getCellValue(event.rowIndex, 'serialkey');

		if (commUtil.isEmpty(serialkey)) {
			return;
		}

		const params = {
			serialkeyH: props.serialkey,
			serialkey: event.item.serialkey,
			readOnly: true,
		};

		apiPostDownloadFile(params).then(res => {
			const objectUrl = fileUtils.download(res);
		});
	}

	/**
	 * 선택한 파일이 이미지인 경우 미리보기 세팅
	 * @param {object} event 파일 선택 변경 이벤트
	 */
	const registerRowSelectEvent = (event: any) => {
		if (!dataRegex.isImage(gridRef.current.getCellValue(event.rowIndex, 'attchFileExtNm')?.toLowerCase())) {
			setPreviewImage('');
			return;
		}

		// 업로드 대기열에 있는지 확인
		const previewNm = event.item.attchFileNm;
		const previewFile = saveFormData.find(file => {
			return file.name == previewNm;
		});

		if (previewFile) {
			// 업로드 대기열에 있는 경우 미리보기
			// setPreviewImage(window.URL.createObjectURL(previewFile));
		} else {
			// 이미 업로드 된 파일인 경우
			const serialkey = gridRef.current.getCellValue(event.rowIndex, 'serialkey');

			if (commUtil.isEmpty(serialkey)) {
				return;
			}

			const params = {
				serialkeyH: props.serialkey,
				serialkey: event.item.serialkey,
				readOnly: true,
			};

			apiPostDownloadFile(params).then(res => {
				const download = window.URL.createObjectURL(new Blob([res.data]));
				setPreviewImage(download);
			});

			setPreviewImage('');
		}
	};

	/**
	 * 첨부파일 삭제
	 */
	function onClickRemoveButton() {
		const selectedItem = gridRef.current.getCheckedRowItems()[0];
		if (!selectedItem) {
			showAlert('', t('msg.MSG_COM_VAL_043'));
			return;
		}

		const deleted = selectedItem.item;
		const serialkey = deleted?.SERIALKEY || deleted?.serialkey;

		// 서버에 저장된 파일인 경우
		if (serialkey) {
			showConfirm(null, t('msg.MSG_COM_CFM_001'), () => {
				apiPostDeleteFile({
					serialkey: serialkey,
				}).then(res => {
					if (res.statusCode === 0) {
						gridRef.current.removeRow(selectedItem.rowIndex);
						setPreviewImage('');
						setTotalSize(totalSize - Number(deleted.fileSize));
						showMessage({
							content: t('msg.MSG_COM_SUC_006'),
							modalType: 'info',
							onOk: () => {
								searchMasterList();
							},
						});
					}
				});
			});
		} else {
			// 새로 추가된 파일인 경우 (로컬에서만 제거)
			gridRef.current.removeRow(selectedItem.rowIndex);
			setPreviewImage('');
			setTotalSize(totalSize - Number(deleted.fileSize));

			// saveFormData에서도 제거
			const updatedSaveData = saveFormData.filter((file: any) => file.name !== deleted.fileName);
			setSaveFormData(updatedSaveData);

			// fileInfoList에서도 제거
			const updatedFileInfoList = fileInfoList.filter((file: any) => file.fileName !== deleted.fileName);
			setFileInfoList(updatedFileInfoList);
		}
	}

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setTotalSizeMB((totalSize / 1024 / 1024).toFixed(2));
	}, [totalSize]);

	useEffect(() => {
		searchMasterList();
	}, []);

	useEffect(() => {
		gridRef.current.bind('cellClick', (event: any) => {
			if (event.dataField == 'fileNm') {
				registerFileDownloadEvent(event);
			} else {
				registerRowSelectEvent(event);
			}
		});
	}, []);

	return (
		<>
			<PopupMenuTitle name={'파일업로드'} showButtons={false} showChildrens={true}>
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
				<Row gutter={12} className="flex-wrap">
					<Col span={15}>
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</Col>
					{/* 미리보기 */}
					<Col span={9}>
						<div className="preview">
							{previewImage != '' ? (
								<Image className="" src={previewImage} />
							) : (
								<span>이미지만 미리보기가 가능합니다</span>
							)}
						</div>
					</Col>
				</Row>
			</AGrid>

			<ButtonWrap data-props="message">
				<span>총 업로드 크기: {totalSizeMB} MB</span>
				<span>※ 총 파일 제한 사이즈: 10MB, 파일명내 허용된 특수문자: ., _, -, (, ), [, ]</span>
			</ButtonWrap>
		</>
	);
});
export default TmAmountByCarFileUploadPopup;
