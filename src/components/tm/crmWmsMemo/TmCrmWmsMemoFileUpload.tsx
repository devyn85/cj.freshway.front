/*
 ############################################################################
 # FiledataField	: TmCrmWmsMemoFileUpload.tsx
 # Description		: CRM요청관리 첨부파일 업로드
 # Author			: YeoSeungCheol
 # Since			: 25.12.12
 ############################################################################
*/
// lib
import { Button, Col, Image, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

//component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

//API Call Function
import { apiDeletePopupUploadFile, apiGetPopupUploadFileList, apiSavePopupUploadFile } from '@/api/tm/apiTmCrmWmsMemo';
import { showAlert, showMessage } from '@/util/MessageUtil';
import dataRegex from '@/util/dataRegex';
import fileUtil from '@/util/fileUtils';

const { VITE_EDMS_IMG_URL } = import.meta.env; // EDMS 이미지 URL

// 넘겨받은 Props 타입 정의
type popupProps = {
	serialKey: string;
	issueNo: string;
	status?: string;
	close: () => void;
	onSave?: (fileList: any[]) => void;
};

const TmCrmWmsMemoFileUpload = (props: popupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { serialKey, issueNo, close, onSave, status } = props;
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);
	// 파일 업로드 버튼 제어용. 03 확정일 경우에는 disabled 시킨다.
	const [isDisabled, setIsDisabled] = useState(false);

	const [totalSize, setTotalSize] = useState(0);
	const [totalSizeMB, setTotalSizeMB] = useState('0');

	const MAX_UPLOAD_SIZE = 31458000;

	const [fileInfoList, setFileInfoList] = useState([]);
	const [previewImage, setPreviewImage] = useState('');
	const uploadFile = useRef(null);
	const [saveFormData, setSaveFormData] = useState([]);

	/*
	 ### 그리드 초기화 ###
	 */
	const gridCol = [
		{
			headerText: '파일명',
			dataField: 'fileName',
			editable: false,
		},
		{
			headerText: '파일크기(KB)',
			dataField: 'fileSize',
			dataType: 'numeric',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return Math.round(value / 1024).toLocaleString();
			},
		},
		{
			dataField: 'fileExt',
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
	 * 파일 목록 조회
	 */
	const loadFileList = () => {
		apiGetPopupUploadFileList({ serialKey, issueNo }).then(res => {
			if (res.statusCode === 0) {
				const fileData = res.data.map((item: any) => ({
					...item,
					fileName: item.FILE_NAME,
					fileSize: parseInt(item.FILE_SIZE_BYTES || '0'),
					fileExt: item.FILE_EXTENSION,
					uploadDate: item.ADDDATE,
					serialKey: item.serialKey,
					issueNo: item.issueNo,
					rowStatus: 'R', // 기존 파일은 조회 상태
				}));
				gridRef.current.setGridData(fileData);

				// 총 파일 크기 계산
				const totalFileSize = fileData.reduce((sum: number, file: any) => sum + file.fileSize, 0);
				setTotalSize(totalFileSize);

				// 데이터 설정 후 컬럼 크기 자동 조정
				if (res.data && res.data.length > 0) {
					const colSizeList = gridRef.current.getFitColumnSizeList(true);
					gridRef.current.setColumnSizeList(colSizeList);
				}
			}
		});
	};
	/**
	 * Totalsize 재설정
	 */
	function resizingTotal() {
		const fileSizeList = gridRef.current.getColumnValues('fileSize', true);
		let sum = 0;
		fileSizeList.forEach(function (item: number) {
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
				serialKey: serialKey,
				issueNo: issueNo,
				fileName: element.name,
				fileSize: element.size,
				fileExt: element.name.split('.').pop() || '',
				uploadDate: new Date().toISOString(),
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
		const lastFile = files[files.length - 1];
		if (dataRegex.isImage(lastFile.name?.toLowerCase())) {
			setPreviewImage(window.URL.createObjectURL(lastFile));
		}

		// 같은 파일을 재업로드할 수 있도록 이벤트 초기화
		event.target.value = '';

		// 로컬 업로드 시 파일 이름이 길 때 컬럼 크기 자동 조정
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		gridRef.current.setColumnSizeList(colSizeList);
	}

	/**
	 * 첨부파일 삭제
	 */
	function onClickRemoveButton() {
		const selectedItem = gridRef.current.getCheckedRowItems()[0];
		if (!selectedItem) {
			showAlert('', '삭제할 파일을 선택해주세요.');
			return;
		}

		const deleted = selectedItem.item;
		const serialkey = deleted?.SERIALKEY || deleted?.serialkey;

		// 서버에 저장된 파일인 경우
		if (serialkey) {
			showConfirm(null, '선택한 파일을 삭제하시겠습니까?', () => {
				apiDeletePopupUploadFile({
					serialKey: serialKey,
					issueNo: issueNo,
				}).then(res => {
					if (res.statusCode === 0) {
						gridRef.current.removeRow(selectedItem.rowIndex);
						setPreviewImage('');
						setTotalSize(totalSize - Number(deleted.fileSize));
						showMessage({
							content: '파일이 삭제되었습니다.',
							modalType: 'info',
							onOk: () => {
								loadFileList();
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
	 * 파일 업로드 저장 함수
	 * @returns {void}
	 */
	function onClickSaveButton() {
		const gridList = gridRef.current.getChangedData({ validationYn: false });

		if (!gridList || gridList.length === 0) {
			showAlert('', t('msg.MSG_COM_VAL_020'));
			return false;
		}
		const formDataParam = new FormData();
		// 파일 파트 추가
		saveFormData.forEach((file: any) => {
			formDataParam.append('file', file);
		});

		const mappedList = saveFormData.map((file: any) => {
			const name = file?.name || '';
			const ext = name.lastIndexOf('.') > -1 ? name.substring(name.lastIndexOf('.') + 1) : '';
			const size = file?.size ?? 0;
			return {
				fileTp: 'cpt',
				fileNm: name,
				attchFileNm: name,
				attchFileSz: String(size),
				attchFileExtNm: ext,
				rowStatus: 'I',
			};
		});
		formDataParam.append('fileInfoList', new Blob([JSON.stringify(mappedList)], { type: 'application/json' }));
		// 서버 멀티파트 컨벤션(일부 엔드포인트는 serialkey 요구) 대응
		// TmIssue는 issueno를 식별자로 사용하므로 동일값을 serialkey로도 전달
		formDataParam.append('serialKey', serialKey);
		formDataParam.append('issueNo', issueNo);
		formDataParam.append('docType', '100');
		// apiSavePopupUploadFile(formDataParam, { serialkey, serialkey: serialkey, docType: '100' })
		showConfirm(null, '파일을 업로드하시겠습니까?', () => {
			apiSavePopupUploadFile(formDataParam).then(res => {
				const ok = res?.statusCode === 0 || res?.data?.statusCode === 0;
				if (ok) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							loadFileList();
							setSaveFormData([]);
							const totalFiles = gridRef.current.getGridData().length;
							onSave?.(totalFiles);
							// close();	// 저장 후 팝업 닫기
						},
					});
				}
			});
		});
	}

	/**
	 * 선택한 파일이 이미지인 경우 미리보기 세팅
	 * @param {object} event 파일 선택 변경 이벤트
	 */
	const registerRowSelectEvent = async (event: any) => {
		if (!dataRegex.isImage(gridRef.current.getCellValue(event.rowIndex, 'fileExt')?.toLowerCase())) {
			setPreviewImage('');
			return;
		}

		// 업로드 대기열에 있는지 확인
		const previewNm = event.item.fileName;
		const previewFile = saveFormData.find((file: any) => {
			return file.name == previewNm;
		});
		if (previewFile) {
			// 업로드 대기열에 있는 경우 미리보기
			setPreviewImage(window.URL.createObjectURL(previewFile));
		} else {
			const item = event.item || {};
			const ext = String(item.fileExt || item.FILE_EXTENSION || '').toLowerCase();
			if (!ext) {
				setPreviewImage('');
				return;
			}

			try {
				// EDMS 확정 파일인 경우
				const workplaceId = item.UPLOAD_WORKPLACE_ID || item.uploadWorkplaceId || '101';
				const fileId = item.UPLOAD_RES_DOC_ID || item.uploadResDocId || item.UPLOAD_HASH_ID || item.uploadHashId;
				if (fileId) {
				} else if (item.FILE_LOCATION || item.fileLocation) {
					// NAS 임시 파일인 경우
					const transFileName = item.TRANS_FILE_NAME || item.transFileName;
					const addwho = item.ADDWHO || item.addwho;
					if (transFileName && addwho) {
						const params = {
							attchFileNm: transFileName,
							dirType: 'savePath',
							savePathNm: `edms/${addwho}`,
							readOnly: true,
						};
						await fileUtil.downloadFile(params).then((data: string) => {
							setPreviewImage(data || '');
						});
					} else {
						setPreviewImage('');
					}
				} else {
					setPreviewImage('');
				}
			} catch (err) {}
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

	useEffect(() => {
		setIsDisabled(status === '03');
	}, [status]);

	useEffect(() => {
		gridRef.current.bind('cellClick', (event: any) => {
			registerRowSelectEvent(event);
		});
		// 컴포넌트 마운트 시 기존 파일 목록 조회
		loadFileList();
	}, []);

	return (
		<>
			<PopupMenuTitle name={'CRM요청관리 첨부파일 업로드'} showButtons={false} showChildrens={true}>
				<div className="flex1">
					<span className="msg">
						CRM요청관리와 관련된 파일을 업로드할 수 있습니다.&#10;
						<br />
						지원 파일 형식: 이미지(사진) 파일&#10;
						<br />
						최대 파일 크기: 30MB, 다중 파일 업로드 가능
					</span>
				</div>
				{/* 파일업로드, 저장, 삭제 */}
				<Button onClick={onClickFileUpload} disabled={isDisabled}>
					{'파일추가'}
				</Button>
				<input
					ref={uploadFile}
					id="uploadInput"
					multiple
					type="file"
					style={{ display: 'none' }}
					accept="image/*"
					onChange={changeUploadEvent}
				/>

				<Button onClick={onClickRemoveButton} disabled={isDisabled}>
					{'파일삭제'}
				</Button>
				<Button onClick={onClickSaveButton} disabled={isDisabled}>
					{'파일업로드'}
				</Button>
			</PopupMenuTitle>
			{/* 그리드 */}
			{/* <AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid> */}
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
				<span>※ 총 파일 제한 사이즈: 30MB, 파일명내 허용된 특수문자: ., _, -, (, ), [, ]</span>
			</ButtonWrap>
		</>
	);
};
export default TmCrmWmsMemoFileUpload;
