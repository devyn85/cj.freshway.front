/*
 ############################################################################
 # FiledataField	: LargeData.tsx
 # Description		: 대량데이터 처리
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { Button } from 'antd';
// component
import DetailLargeData from '@/components/comfunc/func/largeData/DetailLargeData';
import MenuTitle from '@/components/common/custom/MenuTitle';
// API Call Function
import { apiGetLargeDataExcel, apiGetLargeDataSearch } from '@/api/common/apiComfunc';

const LargeData = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const { menu } = useLocation().state;
	const gridRef = useRef(null);
	const [gridData, setGridData] = useState([]);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 */
	function onClickSearchButton() {
		apiGetLargeDataSearch({}).then(res => {
			setGridData(res.data);
		});
	}

	/**
	 * 다운로드 API
	 */
	const onClickDownload = () => {
		apiGetLargeDataExcel({ responseType: 'blob' }).then(res => {
			excelDownloadProcess(res);
		});
	};

	/**
	 * 엑셀 다운로드
	 * @param {object} res 엑셀 파일 객체
	 * @returns {void}
	 */
	const excelDownloadProcess = (res: any) => {
		const fileName = decodeURI(res.headers['content-disposition'].split('filename=')[1].replace(/\"/g, ''));

		const download = window.URL.createObjectURL(new Blob([res.data]));

		const fileLink = document.createElement('a');
		fileLink.href = download;
		fileLink.setAttribute('download', fileName);

		document.body.appendChild(fileLink);
		fileLink.click();
		fileLink.remove();
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		searchYn: onClickSearchButton,
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		onClickSearchButton();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" func={titleFunc} slotLocation="right">
				<Button type="primary" onClick={onClickDownload}>
					엑셀다운로드
				</Button>
			</MenuTitle>
			{/* 그리드 영역 */}
			<DetailLargeData ref={gridRef} data={gridData}></DetailLargeData>
		</>
	);
};

export default LargeData;
