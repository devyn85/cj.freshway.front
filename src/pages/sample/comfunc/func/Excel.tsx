/*
 ############################################################################
 # FiledataField	: Excel.tsx
 # Description		: Excel Download Template
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// component
import MenuTitle from '@/components/common/custom/MenuTitle';
import DownloadExcel from '@/components/comfunc/func/excel/DownloadExcel';
import UploadExcel from '@/components/comfunc/func/excel/UploadExcel';

const Excel = () => {
	// const { menu } = useLocation().state;

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle />
			{/* 그리드 영역 */}
			<DownloadExcel></DownloadExcel>
			{/* 업로드 영역 */}
			<UploadExcel></UploadExcel>
		</>
	);
};
export default Excel;
