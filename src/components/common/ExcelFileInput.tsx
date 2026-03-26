// lib
import React, { forwardRef } from 'react';

// Util
import fileUtil from '@/util/fileUtils';

interface ExcelFileInputProps {
	id?: string;
	accept?: string;
	style?: React.CSSProperties;
	startRow: any;
	onData?: (data: any[][]) => void; // 엑셀 데이터 콜백
}

const ExcelFileInput = forwardRef<HTMLInputElement, ExcelFileInputProps>(
	({ id = 'excelUploadInput', accept = '.xls,.xlsx', style = { display: 'none' }, onData, startRow }, ref) => {
		//const [excelData, setExcelData] = useState<any[][]>([]);
		const inputRef = (ref as React.RefObject<HTMLInputElement>) || useRef<HTMLInputElement>(null);
		const effectiveStartRow = startRow ?? 1;

		const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
			const data = await fileUtil.excelImportNonHeader(e, 0, effectiveStartRow);
			if (data) {
				onData && onData(data);
				e.target.value = '';
			}

			/* DRM 없이 로컬에서 처리하고자 하면 이 코드로 */
			/*
      const file = e.target.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (evt: ProgressEvent<FileReader>) => {
				const data = evt.target?.result;
				if (!data) return;
				const workbook = XLSX.read(data, { type: 'binary' });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
					header: 1,
					defval: '',
					range: effectiveStartRow,
				});
				setExcelData(jsonData);
				onData && onData(jsonData);
			};
			reader.readAsArrayBuffer(file);
			e.target.value = '';
      */
		};

		return <input ref={inputRef} id={id} type="file" accept={accept} onChange={onFileChange} style={style} />;
	},
);

export default ExcelFileInput;
