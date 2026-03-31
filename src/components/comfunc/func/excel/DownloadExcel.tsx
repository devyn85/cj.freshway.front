/*
 ############################################################################
 # FiledataField	: DownloadExcel.tsx
 # Description		: 엑셀 다운로드
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
//Utils
import dateUtils from '@/util/dateUtil';

const DownloadExcel = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	//다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);

	const gridCol = [
		{
			headerText: 'A',
			dataField: 'A',
		},
		{
			headerText: 'B',
			dataField: 'B',
		},
		{
			headerText: 'C',
			dataField: 'C',
		},
		{
			headerText: 'D',
			dataField: 'D',
		},
	];

	const gridProps = {
		editable: true,
		showRowNumColumn: false,
	};

	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			gridRef.current.addRow({});
		},
		isMinus: true,
		minusFunction: function () {
			gridRef.current.removeRow('selectedIndex');
		},
		isAddBtn1: true,
		addLabel1: t('com.btn.excelDownload'),
		addFunction1: function () {
			const params = {
				fileName: 'ExcelDownloadSample_' + dateUtils.getToDay('YYYYMMDDHHMMss'),
			};
			gridRef.current.exportToXlsxGrid(params);
		},
	};

	return (
		<>
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} gridTitle={t('comfunc.excel.title.download')} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default DownloadExcel;
