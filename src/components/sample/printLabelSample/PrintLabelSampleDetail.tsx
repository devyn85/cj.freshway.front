// PrintLabelSampleDetail.tsx
// filepath: c:\CJFW_WMS\workspace\cjfw-wms-bo-front\src\components\sample\printLabelSample\PrintLabelSampleDetail.tsx
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { forwardRef, useEffect } from 'react';
const PrintLabelSampleDetail = forwardRef(
	({ gridCol, gridData, form, previewImages, showGrid, showImage, imgStyle }: any, gridRef: any) => {
		//const gridCol = props.columnLayout ?? [];
		//const gridData = props.gridData ?? [];
		// 부모가 form 을 넘겨주며는 props.form 으로 사용할 수 있음.
		//const form = props.form ?? null;
		//const PrintLabelSampleDetail = forwardRef<any, any>(/* ...생략... */);
		const gridProps = {
			editable: true,
			fillColumnSizeMode: true,
			selectionMode: 'multipleCells',
			rowIdField: 'rowId',
		};

		/**
		 * 인쇄
		 */
		const printMasterList = () => {
			// const ds_reportHeader = typeof gridRef.current.getGridData === 'function'
			// 	? gridRef.current.getGridData()
			// 	: [];

			const sampleXml = `<?xml version="1.0" encoding="euc-kr"?>
<root>
	<dataset id="ds_cjfwdplabel">
		<colinfo id="PAPERTYPE" size="256" summ="default" type="STRING"/>
		<colinfo id="DESCRIPTION" size="256" summ="default" type="STRING"/>
		<colinfo id="BOLD" size="256" summ="default" type="STRING"/>
		<colinfo id="SEQ" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_X" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONTSIZE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="AREA_GB" size="256" summ="default" type="STRING"/>
		<colinfo id="LANDSCAPE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONT" size="256" summ="default" type="STRING"/>
		<colinfo id="VAR_NAME" size="256" summ="default" type="STRING"/>
		<colinfo id="CONTROLCODE" size="256" summ="default" type="STRING"/>
		<colinfo id="LINE_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="LINE_X" size="256" summ="default" type="DECIMAL"/>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>WBL_AREA</FONT>
			<FONTSIZE>0</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>800</POS_X>
			<POS_Y>1650</POS_Y>
			<SEQ>1</SEQ>
			<VAR_NAME>&lt;WBL_AREA&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>228112</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>42</POS_Y>
			<SEQ>2</SEQ>
			<VAR_NAME>&lt;SKU&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024/04/05</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>694</POS_X>
			<POS_Y>1216</POS_Y>
			<SEQ>3</SEQ>
			<VAR_NAME>&lt;SLIPDT&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>부엉이돈등심</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>574</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>4</SEQ>
			<VAR_NAME>&lt;SKUNAME1&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(부엉이돈까스용&#32;5Kg/BOX)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>508</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>5</SEQ>
			<VAR_NAME>&lt;SKUNAME2&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>이천물류센터</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>490</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>6</SEQ>
			<VAR_NAME>&lt;CUSTNAME&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BY3,2^BCB,90,N,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>2600</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>686</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>7</SEQ>
			<VAR_NAME>&lt;CUSTKEY&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024-04-16</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>70</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>224</POS_X>
			<POS_Y>140</POS_Y>
			<SEQ>8</SEQ>
			<VAR_NAME>&lt;LOTTABLE01&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BCR^BY5,25,150,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>B228112-20240416B</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>50</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>244</POS_X>
			<POS_Y>150</POS_Y>
			<SEQ>9</SEQ>
			<VAR_NAME>&lt;BARCODE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>388</POS_Y>
			<SEQ>10</SEQ>
			<VAR_NAME>&lt;TITLE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION/>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>450</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>11</SEQ>
			<VAR_NAME>&lt;QTYPERBOX&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(한국)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>452</POS_X>
			<POS_Y>486</POS_Y>
			<SEQ>12</SEQ>
			<VAR_NAME>&lt;PLACEOFORIGIN&gt;</VAR_NAME>
		</record>
	</dataset>
</root>
<?xml version="1.0" encoding="euc-kr"?>
<root>
	<dataset id="ds_cjfwdplabel">
		<colinfo id="PAPERTYPE" size="256" summ="default" type="STRING"/>
		<colinfo id="DESCRIPTION" size="256" summ="default" type="STRING"/>
		<colinfo id="BOLD" size="256" summ="default" type="STRING"/>
		<colinfo id="SEQ" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_X" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONTSIZE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="AREA_GB" size="256" summ="default" type="STRING"/>
		<colinfo id="LANDSCAPE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONT" size="256" summ="default" type="STRING"/>
		<colinfo id="VAR_NAME" size="256" summ="default" type="STRING"/>
		<colinfo id="CONTROLCODE" size="256" summ="default" type="STRING"/>
		<colinfo id="LINE_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="LINE_X" size="256" summ="default" type="DECIMAL"/>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>WBL_AREA</FONT>
			<FONTSIZE>0</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>800</POS_X>
			<POS_Y>1650</POS_Y>
			<SEQ>1</SEQ>
			<VAR_NAME>&lt;WBL_AREA&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>256914</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>42</POS_Y>
			<SEQ>2</SEQ>
			<VAR_NAME>&lt;SKU&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024/04/05</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>694</POS_X>
			<POS_Y>1216</POS_Y>
			<SEQ>3</SEQ>
			<VAR_NAME>&lt;SLIPDT&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>이삭푸드&#32;생등심</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>574</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>4</SEQ>
			<VAR_NAME>&lt;SKUNAME1&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(최고당돈까스용&#32;NEW_박스단위발주&#32;2.5Kg/EA)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>508</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>5</SEQ>
			<VAR_NAME>&lt;SKUNAME2&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>이천물류센터</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>490</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>6</SEQ>
			<VAR_NAME>&lt;CUSTNAME&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BY3,2^BCB,90,N,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>2600</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>686</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>7</SEQ>
			<VAR_NAME>&lt;CUSTKEY&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024-04-22</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>70</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>224</POS_X>
			<POS_Y>140</POS_Y>
			<SEQ>8</SEQ>
			<VAR_NAME>&lt;LOTTABLE01&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BCR^BY5,25,150,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>B256914-20240422B</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>50</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>244</POS_X>
			<POS_Y>150</POS_Y>
			<SEQ>9</SEQ>
			<VAR_NAME>&lt;BARCODE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>388</POS_Y>
			<SEQ>10</SEQ>
			<VAR_NAME>&lt;TITLE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2EA/BOX</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>450</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>11</SEQ>
			<VAR_NAME>&lt;QTYPERBOX&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(한국)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>452</POS_X>
			<POS_Y>486</POS_Y>
			<SEQ>12</SEQ>
			<VAR_NAME>&lt;PLACEOFORIGIN&gt;</VAR_NAME>
		</record>
	</dataset>
</root>
<?xml version="1.0" encoding="euc-kr"?>
<root>
	<dataset id="ds_cjfwdplabel">
		<colinfo id="PAPERTYPE" size="256" summ="default" type="STRING"/>
		<colinfo id="DESCRIPTION" size="256" summ="default" type="STRING"/>
		<colinfo id="BOLD" size="256" summ="default" type="STRING"/>
		<colinfo id="SEQ" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_X" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONTSIZE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="AREA_GB" size="256" summ="default" type="STRING"/>
		<colinfo id="LANDSCAPE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONT" size="256" summ="default" type="STRING"/>
		<colinfo id="VAR_NAME" size="256" summ="default" type="STRING"/>
		<colinfo id="CONTROLCODE" size="256" summ="default" type="STRING"/>
		<colinfo id="LINE_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="LINE_X" size="256" summ="default" type="DECIMAL"/>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>WBL_AREA</FONT>
			<FONTSIZE>0</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>800</POS_X>
			<POS_Y>1650</POS_Y>
			<SEQ>1</SEQ>
			<VAR_NAME>&lt;WBL_AREA&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>292994</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>42</POS_Y>
			<SEQ>2</SEQ>
			<VAR_NAME>&lt;SKU&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024/04/05</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>694</POS_X>
			<POS_Y>1216</POS_Y>
			<SEQ>3</SEQ>
			<VAR_NAME>&lt;SLIPDT&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>닭도리</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>574</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>4</SEQ>
			<VAR_NAME>&lt;SKUNAME1&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(8~9호_18각도리_껍질있음_신규&#32;800g/EA)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>508</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>5</SEQ>
			<VAR_NAME>&lt;SKUNAME2&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>이천물류센터</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>490</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>6</SEQ>
			<VAR_NAME>&lt;CUSTNAME&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BY3,2^BCB,90,N,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>2600</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>686</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>7</SEQ>
			<VAR_NAME>&lt;CUSTKEY&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024-01-24</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>70</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>224</POS_X>
			<POS_Y>140</POS_Y>
			<SEQ>8</SEQ>
			<VAR_NAME>&lt;LOTTABLE01&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BCR^BY5,25,150,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>B292994-20240124B</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>50</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>244</POS_X>
			<POS_Y>150</POS_Y>
			<SEQ>9</SEQ>
			<VAR_NAME>&lt;BARCODE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>388</POS_Y>
			<SEQ>10</SEQ>
			<VAR_NAME>&lt;TITLE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>10EA/BOX</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>450</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>11</SEQ>
			<VAR_NAME>&lt;QTYPERBOX&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(한국)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>452</POS_X>
			<POS_Y>486</POS_Y>
			<SEQ>12</SEQ>
			<VAR_NAME>&lt;PLACEOFORIGIN&gt;</VAR_NAME>
		</record>
	</dataset>
</root>
<?xml version="1.0" encoding="euc-kr"?>
<root>
	<dataset id="ds_cjfwdplabel">
		<colinfo id="PAPERTYPE" size="256" summ="default" type="STRING"/>
		<colinfo id="DESCRIPTION" size="256" summ="default" type="STRING"/>
		<colinfo id="BOLD" size="256" summ="default" type="STRING"/>
		<colinfo id="SEQ" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_X" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONTSIZE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="AREA_GB" size="256" summ="default" type="STRING"/>
		<colinfo id="LANDSCAPE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONT" size="256" summ="default" type="STRING"/>
		<colinfo id="VAR_NAME" size="256" summ="default" type="STRING"/>
		<colinfo id="CONTROLCODE" size="256" summ="default" type="STRING"/>
		<colinfo id="LINE_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="LINE_X" size="256" summ="default" type="DECIMAL"/>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>WBL_AREA</FONT>
			<FONTSIZE>0</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>800</POS_X>
			<POS_Y>1650</POS_Y>
			<SEQ>1</SEQ>
			<VAR_NAME>&lt;WBL_AREA&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>292995</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>42</POS_Y>
			<SEQ>2</SEQ>
			<VAR_NAME>&lt;SKU&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024/04/05</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>694</POS_X>
			<POS_Y>1216</POS_Y>
			<SEQ>3</SEQ>
			<VAR_NAME>&lt;SLIPDT&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>닭가슴살</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>574</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>4</SEQ>
			<VAR_NAME>&lt;SKUNAME1&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(130±10g/덩어리_껍질제거_신규&#32;2Kg/EA)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>508</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>5</SEQ>
			<VAR_NAME>&lt;SKUNAME2&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>이천물류센터</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>490</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>6</SEQ>
			<VAR_NAME>&lt;CUSTNAME&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BY3,2^BCB,90,N,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>2600</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>686</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>7</SEQ>
			<VAR_NAME>&lt;CUSTKEY&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024-03-04</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>70</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>224</POS_X>
			<POS_Y>140</POS_Y>
			<SEQ>8</SEQ>
			<VAR_NAME>&lt;LOTTABLE01&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BCR^BY5,25,150,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>B292995-20240304B</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>50</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>244</POS_X>
			<POS_Y>150</POS_Y>
			<SEQ>9</SEQ>
			<VAR_NAME>&lt;BARCODE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>388</POS_Y>
			<SEQ>10</SEQ>
			<VAR_NAME>&lt;TITLE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>6EA/BOX</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>450</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>11</SEQ>
			<VAR_NAME>&lt;QTYPERBOX&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(한국)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>452</POS_X>
			<POS_Y>486</POS_Y>
			<SEQ>12</SEQ>
			<VAR_NAME>&lt;PLACEOFORIGIN&gt;</VAR_NAME>
		</record>
	</dataset>
</root>
<?xml version="1.0" encoding="euc-kr"?>
<root>
	<dataset id="ds_cjfwdplabel">
		<colinfo id="PAPERTYPE" size="256" summ="default" type="STRING"/>
		<colinfo id="DESCRIPTION" size="256" summ="default" type="STRING"/>
		<colinfo id="BOLD" size="256" summ="default" type="STRING"/>
		<colinfo id="SEQ" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="POS_X" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONTSIZE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="AREA_GB" size="256" summ="default" type="STRING"/>
		<colinfo id="LANDSCAPE" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="FONT" size="256" summ="default" type="STRING"/>
		<colinfo id="VAR_NAME" size="256" summ="default" type="STRING"/>
		<colinfo id="CONTROLCODE" size="256" summ="default" type="STRING"/>
		<colinfo id="LINE_Y" size="256" summ="default" type="DECIMAL"/>
		<colinfo id="LINE_X" size="256" summ="default" type="DECIMAL"/>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>WBL_AREA</FONT>
			<FONTSIZE>0</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>800</POS_X>
			<POS_Y>1650</POS_Y>
			<SEQ>1</SEQ>
			<VAR_NAME>&lt;WBL_AREA&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>292997</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>42</POS_Y>
			<SEQ>2</SEQ>
			<VAR_NAME>&lt;SKU&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024/04/05</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>694</POS_X>
			<POS_Y>1216</POS_Y>
			<SEQ>3</SEQ>
			<VAR_NAME>&lt;SLIPDT&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>닭다리살</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>574</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>4</SEQ>
			<VAR_NAME>&lt;SKUNAME1&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(100±10g/덩어리_정육_껍질있음_신규&#32;2Kg/EA)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>508</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>5</SEQ>
			<VAR_NAME>&lt;SKUNAME2&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>이천물류센터</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>490</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>6</SEQ>
			<VAR_NAME>&lt;CUSTNAME&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BY3,2^BCB,90,N,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>2600</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>20</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>686</POS_X>
			<POS_Y>1046</POS_Y>
			<SEQ>7</SEQ>
			<VAR_NAME>&lt;CUSTKEY&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>TRUE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>2024-03-13</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>70</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>224</POS_X>
			<POS_Y>140</POS_Y>
			<SEQ>8</SEQ>
			<VAR_NAME>&lt;LOTTABLE01&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE>&lt;ZPL&gt;,150^BCR^BY5,25,150,N,N^FD&lt;TEXTDATA&gt;&lt;/ZPL&gt;</CONTROLCODE>
			<DESCRIPTION>B292997-20240313B</DESCRIPTION>
			<FONT>CODE128-SKU</FONT>
			<FONTSIZE>50</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>244</POS_X>
			<POS_Y>150</POS_Y>
			<SEQ>9</SEQ>
			<VAR_NAME>&lt;BARCODE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION></DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>28</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>682</POS_X>
			<POS_Y>388</POS_Y>
			<SEQ>10</SEQ>
			<VAR_NAME>&lt;TITLE&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>6EA/BOX</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>450</POS_X>
			<POS_Y>40</POS_Y>
			<SEQ>11</SEQ>
			<VAR_NAME>&lt;QTYPERBOX&gt;</VAR_NAME>
		</record>
		<record>
			<AREA_GB>HEADER</AREA_GB>
			<BOLD>FALSE</BOLD>
			<CONTROLCODE/>
			<DESCRIPTION>(한국)</DESCRIPTION>
			<FONT>HY견고딕</FONT>
			<FONTSIZE>16</FONTSIZE>
			<LANDSCAPE>90</LANDSCAPE>
			<LINE_X>0</LINE_X>
			<LINE_Y>0</LINE_Y>
			<PAPERTYPE>CJFWDP1</PAPERTYPE>
			<POS_X>452</POS_X>
			<POS_Y>486</POS_Y>
			<SEQ>12</SEQ>
			<VAR_NAME>&lt;PLACEOFORIGIN&gt;</VAR_NAME>
		</record>
	</dataset>
</root>
`;
			//console.log(('ds_reportHeader', reportUtil.makeLabelTagXmlByRoot(sampleXml));
			//const blocks = reportUtil.makeLabelTagXmlWithRecode(sampleXml);
			const xmlWithRecode = reportUtil.makeLabelTagXmlWithRecode(sampleXml);

			// const ds_labelReportHeader = gridRef.current.getGridData();

			// const dataSet = {
			// 	ds_labelReportHeader,
			// };

			// if (ds_labelReportHeader.length < 1) {
			// 	showAlert(null, '데이터가 없습니다.'); // 데이터가 없습니다.
			// 	return;
			// }
			// showConfirm(null, '인쇄 하시겠습니까?', () => {

			// 	let labelId = form.getFieldValue('labelCode');

			// 	//let fileName = 'Label' + labelId + '.mrd';
			// 	let fileName = form.getFieldValue('fileName');
			// 	let previewYn = form.getFieldValue('previewYn');
			// 	let count = form.getFieldValue('printCnt') || 1;
			// 	//  * @param fileName   - 리포트 파일명(필수)
			// 	//  * @param dataSet    - 리포트 데이터셋(필수, 라벨 데이터)
			// 	//  * @param labelId    - 라벨 코드(필수, 용지 크기 분기용)
			// 	//  * @param previewYn  - 미리보기 여부('Y'면 미리보기, 아니면 인쇄)
			// 	//  * @param count      - 인쇄매수(라벨 반복 개수)
			// 	//console.log('fileName', fileName);
			// 	//console.log('dataSet', dataSet);
			// 	//console.log('labelId', labelId);
			// 	//console.log('previewYn', previewYn);
			// 	//console.log('count', count);

			// 	reportUtil.openLabelReportViewerSample(fileName, dataSet, labelId, previewYn, count);

			//});
		};

		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'print', //출력
					callBackFn: printMasterList,
				},
			],
		};

		// 컬럼 또는 데이터 변경 시 그리드에 반영
		useEffect(() => {
			if (gridRef && gridRef.current) {
				if (typeof gridRef.current.setColumnLayout === 'function') {
					gridRef.current.setColumnLayout(gridCol);
				}
				if (typeof gridRef.current.setGridData === 'function') {
					gridRef.current.setGridData(gridData);
				}
			}
		}, [gridCol, gridData, gridRef]);

		if (showGrid) {
			return (
				<AGrid dataProps={'row-single'}>
					<GridTopBtn gridBtn={gridBtn} gridProps={gridProps} totalCnt={0} />
					<AUIGrid
						ref={gridRef}
						columnLayout={gridCol}
						gridProps={{
							...gridProps,
							height: 100,
						}}
						key={JSON.stringify(gridCol)}
					/>
				</AGrid>
			);
		}

		// ...existing code...
		// ...existing code...
		// ...existing code...
		if (showImage) {
			return (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						height: '100%',
						boxSizing: 'border-box',
						overflow: 'hidden',
					}}
				>
					{/* 상단 라벨 영역 */}
					<div
						style={{
							display: 'flex',
							width: '100%',
							height: 40,
							minHeight: 40,
							maxHeight: 40,
							fontWeight: 'bold',
							fontSize: 18,
							alignItems: 'center',
						}}
					>
						<div style={{ flex: 1, textAlign: 'center' }}>AS-IS</div>
						<div
							style={{
								width: 0,
								background: '#222',
								margin: '0 8px',
								borderRadius: 1,
							}}
						/>
						<div style={{ flex: 1, textAlign: 'center' }}>TO-BE</div>
					</div>
					{/* 이미지 2칸 영역 */}
					<div
						style={{
							display: 'flex',
							width: '100%',
							flex: 1,
							minHeight: 0,
							alignItems: 'stretch',
							justifyContent: 'stretch',
						}}
					>
						<div
							style={{
								flex: 1,
								paddingRight: 8,
								boxSizing: 'border-box',
								display: 'flex',
								flexDirection: 'column',
								minHeight: 0,
							}}
						>
							<img
								src={previewImages.asis}
								alt="AS-IS"
								style={{
									...imgStyle,
									width: '100%',
									height: '100%',
									objectFit: 'contain',
									flex: 1,
									minHeight: 0,
									display: 'block',
								}}
							/>
						</div>
						<div
							style={{
								width: 0,
								height: '100%',
								background: '#222',
								margin: '0 8px',
								borderRadius: 1,
							}}
						/>
						<div
							style={{
								flex: 1,
								paddingLeft: 8,
								boxSizing: 'border-box',
								display: 'flex',
								flexDirection: 'column',
								minHeight: 0,
							}}
						>
							<img
								src={previewImages.tobe}
								alt="TO-BE"
								style={{
									...imgStyle,
									width: '100%',
									height: '100%',
									objectFit: 'contain',
									flex: 1,
									minHeight: 0,
									display: 'block',
								}}
							/>
						</div>
					</div>
				</div>
			);
		}
		// ...existing code...
		// ...existing code...
		// ...existing code...
	},
);

export default PrintLabelSampleDetail;
