/**
 * 유틸 : 유틸 > fileUtil
 * @module util/fileUtil
 * @author canalFrame <canalframe@cj.net>
 * @since 1.0.0
 */
import dataRegex from '@/util/dataRegex';
import React from 'react';
import commUtil from './commUtil';

// API
import { apiPostExcelUpload } from '@/api/cm/apiCmExcel';
import { apiPostDownloadFile } from '@/api/cm/apiCmFile';

class fileUtil extends React.Component {
	/**
	 * fileExtensionValid 함수 설명 작성
	 * @function fileExtensionValid
	 * @param {string} name name
	 * @param {string} allowFile allowFile
	 * @returns {boolean} 결과
	 */
	static fileExtensionValid(name: string, allowFile: string) {
		// file 확장자
		const extension = fileUtil.removeFileName(name);

		// 1. 허용하지 않은 확장자일경우
		// 2. 확장자가 없는경우이다.
		if (!(allowFile.indexOf(extension) > -1) || extension === '') {
			return false;
		}
		return true;
	}

	/**
	 * removeFileName
	 * @function removeFileName
	 * @param {string} filename filename
	 * @returns {string} filename.toLowerCase
	 */
	static removeFileName(filename: string) {
		const lastIndex = filename.lastIndexOf('.');
		if (lastIndex < 0) {
			return '';
		}
		return filename.substring(lastIndex + 1).toLowerCase();
	}

	/**
	 * file size 변환 (바이트 -> 메가바이트)
	 * 기본 파일 size 변경시 사용
	 * @function convertByteToMb
	 * @param {number} size size
	 * @returns {number} Mb
	 */
	static convertByteToMb(size: number) {
		return size * 1024 * 1024;
	}

	/**
	 * 이미지 File 규격 Check
	 * @function getImgFrameSize
	 * @param {File} file 이미지 파일
	 * @returns {object} width: 가로 길이, height: 세로 길이
	 */
	static getImgFrameSize(file: File) {
		const img = new Image();
		img.src = URL.createObjectURL(file);

		return { width: img.naturalWidth, height: img.naturalHeight };
	}

	/**
	 * file type이 Image인지 판별한다.
	 * @function isImage
	 * @param {File} file validation 대상 file
	 * @returns {boolean} returns
	 */
	static isImage = (file: File) => {
		return file?.type?.startsWith('image');
	};

	/**
	 * file type이 Video인지 판별한다.
	 * @function isVideo
	 * @param {File} file validation 대상 file
	 * @returns {any} file type
	 */
	static isVideo = (file: File) => {
		return file?.type?.startsWith('video');
	};

	/**
	 * file size와 max size보다 작은지 판별한다.
	 * @function fileSizeValid
	 * @param {File} file validation 대상 file
	 * @param {number} maxSize 파일 업로드 제한 사이즈(MB 단위)
	 * @returns {boolean} returns
	 */
	static fileSizeValid = (file: File, maxSize = 10): boolean => {
		if (commUtil.isEmpty(file)) {
			return false;
		}
		return file?.size > fileUtil.convertByteToMb(maxSize);
	};

	/**
	 * file format이 허용된 file format인지 판별한다.
	 * @function fileFormatValid
	 * @param {File} file validation 대상 file
	 * @param {Array} allowedFormats 허용된 file format list(default:'all', example:['png','jpg','svg'])
	 * @returns {boolean} returns
	 */
	static fileFormatValid(file: File, allowedFormats: Array<string | null> | string | null = 'all') {
		if (commUtil.isEmpty(file)) {
			return false;
		}
		if (commUtil.isEmpty(allowedFormats) || allowedFormats === 'all') {
			return true;
		}
		return []
			.concat(allowedFormats)
			.map((format: string) => {
				return format.toLowerCase();
			})
			.includes(file.name.split('.')[1].toLowerCase());
	}

	/**
	 * 파일 업로드
	 * @function upload
	 * @param {File} file file data
	 * @returns {string} imgUrl
	 */
	static async upload(file: File) {
		const imgUrl = '';

		const formData = new FormData();
		if (!file) {
			return;
		}
		formData.append('file', file);

		// image upload
		// await apiUploadTempImage(formData)
		// 	.then((res: any) => {
		// 		imgUrl = res.data;
		// 	})
		// 	.catch(() => {
		// 		imgUrl = '';
		// 	});

		return imgUrl;
	}

	/**
	 * base 64 변환
	 * @function convertByBase64
	 * @param {File} file 파일
	 * @param {Function} callback callback 함수
	 */
	static async convertByBase64(file: File, callback: any) {
		const reader = new FileReader();
		let baseString;
		reader.onloadend = function () {
			baseString = reader.result;
			callback(baseString);
		};
		reader.readAsDataURL(file);
	}

	/**
	 * 엑셀의 내용을 Dataset 에 import 한다.
	 * @param {any} e React.ChangeEvent<HTMLInputElement>
	 * @param {number} nSheetIdx 읽어올 엑셀의 sheet index ('0' base)
	 * @param {any} gridRef 타겟 그리드 Ref
	 * @param {number} nStartRow 읽어올 시작 row. (default = 1)
	 * @param {Function} callback 화면별 validation callback함수
	 * @returns {void}
	 */
	static excelImport(
		e: React.ChangeEvent<HTMLInputElement>,
		nSheetIdx: number,
		gridRef: any,
		nStartRow: number,
		callback: any,
	) {
		const target = e.currentTarget;
		const file = target.files[0];

		if (file === undefined) {
			return;
		} else {
			// 칼럼의 계층형 최대 높이 구하기
			let depth = 1;
			const columnLayout = gridRef?.current?.getColumnLayout();
			const getColumnDepth = (columnLayoutList: any) => {
				columnLayoutList?.map((layout: any) => {
					if (layout.depth > depth) {
						depth = layout.depth;
					}

					if (commUtil.isNotEmpty(layout.children)) {
						getColumnDepth(layout.children);
					}
				});
			};
			getColumnDepth(columnLayout);

			// 그리드 자식들의 칼럼 Key 목록
			const columnKeyList: any[] = [];
			if (gridRef?.current?.props?.gridProps?.showRowNumColumn !== false) {
				// 로우 넘버링 유무에 따른 칼럼 추가
				columnKeyList.push('no');
			}
			const columnInfoList = gridRef?.current?.getColumnInfoList();
			columnInfoList?.map((columnInfo: any) => {
				// 커스텀 엑스트라 체크박스 칼럼 제외
				if (gridRef?.current?.getProp('customRowCheckColumnDataField') !== columnInfo.dataField) {
					columnKeyList.push(columnInfo.dataField);
				}
			});

			const jsonData = { startRow: depth, columnNames: columnKeyList };
			const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
			const formData = new FormData();
			formData.append('file', file);
			formData.append('params', jsonBlob);

			const params = formData;
			gridRef?.current?.clearGridData();
			apiPostExcelUpload(params).then(res => {
				if (res.statusCode == 0) {
					gridRef.current?.addRow(res.data.rowsData);
					// 칼럼 사이즈 재조정
					const colSizeList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(colSizeList);

					// 화면별 validation callback함수
					callback();
				}
			});
		}
	}

	/**
	 * 엑셀의 내용을 Dataset 에 import 한다.
	 * @param {any} e React.ChangeEvent<HTMLInputElement>
	 * @param {number} nSheetIdx 읽어올 엑셀의 sheet index ('0' base)
	 * @param {any} gridRef 타겟 그리드 Ref
	 * @param {number} nStartRow 읽어올 시작 row. (default = 1)
	 * @returns {void}
	 */
	static excelImportNonHeader(
		e: React.ChangeEvent<HTMLInputElement>,
		nSheetIdx: number,
		nStartRow: number,
	): Promise<any[] | undefined> {
		return new Promise((resolve, reject) => {
			const target = e.currentTarget;
			const file = target.files?.[0];

			if (file === undefined) {
				resolve(undefined);
				return;
			}

			// 칼럼의 계층형 최대 높이 구하기
			const leaf = 1;
			const columnKeyList: any[] = [];

			const jsonData = { startRow: nStartRow, columnNames: columnKeyList };
			const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
			const formData = new FormData();
			formData.append('file', file);
			formData.append('params', jsonBlob);

			const params = formData;
			apiPostExcelUpload(params)
				.then(res => {
					if (res.statusCode == 0) {
						resolve(res.data.rowsData);
					} else {
						reject(new Error('Excel upload failed'));
					}
				})
				.catch(err => {
					reject(new Error(err instanceof Error ? err.message : String(err)));
				});
		});
	}

	/**
	 * NAS 파일 다운로드
	 * @param {any} params 다운로드 파일 정보
	 * @param {string} params.dirType 업로드 위치 타입 (fax: 'cf.upload.dir.fax', email: 'cf.upload.dir.email', approval: 'cf.upload.dir.approval', savePath: 'savePathNm')
	 * @param {string} params.attchFileNm 실제 파일명
	 * @param {string} params.savePathNm 실제 업로드 위치
	 * @param {string} params.saveFileNm 저장 파일명 (default: attchFileNm)
	 * @param {string} params.readOnly 파일 읽기/쓰기 여부 (true: 이미지 팝업 용도)
	 * @param {string} params.drmUseYn DRM 사용 여부 (default: 'N')
	 * @returns {Promise<string>} 임시 파일 URL
	 */
	static async downloadFile(params: {
		dirType: string;
		attchFileNm: string;
		savePathNm?: string;
		saveFileNm?: string;
		readOnly?: boolean;
		drmUseYn?: string;
	}): Promise<string> {
		let objectUrl = '';
		await apiPostDownloadFile(params).then(res => {
			objectUrl = fileUtil.download(res, params);
		});
		return objectUrl;
	}

	/**
	 * 파일 다운로드
	 * @param {any} res 파일 다운로드 결과
	 * @param {any} params 다운로드 파일 정보
	 * @returns {string} 임시 파일 URL
	 */
	static download(res: any, params?: any): string {
		let objectUrl = '';
		if (res.status === 200 && res.data?.size > 0) {
			const fileName = dataRegex.decodeDisposition(res.headers['content-disposition']);
			const download = window.URL.createObjectURL(new Blob([res.data]));

			// 쓰기/읽기 여부 구분
			if (!params?.readOnly) {
				const fileLink = document.createElement('a');
				fileLink.href = download;
				fileLink.setAttribute('download', fileName);
				document.body.appendChild(fileLink);
				fileLink.click();
				fileLink.remove();
			}

			objectUrl = download;
		}
		return objectUrl;
	}
}

export default fileUtil;
