// API Call Function

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Component
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import { InputTextArea } from '@/components/common/custom/form';

const SysExecuteLogDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	const { t } = useTranslation();

	const getGridCol = () => {
		return [
			{
				headerText: t('lbl.EXECUTEDT'),
				dataField: 'executedt',
				dataType: 'code',
			},
			{
				headerText: t('lbl.OBJECTNAME'),
				dataField: 'objectname',
				dataType: 'code',
			},
			{
				headerText: t('lbl.SYSTEM'),
				dataField: 'system',
				dataType: 'code',
			},
			{
				headerText: t('lbl.COMMAND'),
				dataField: 'command',
				dataType: 'code',
			},
			{
				headerText: t('lbl.WORKER'),
				dataField: 'worker',
				dataType: 'code',
			},
			{
				headerText: t('lbl.SPID'),
				dataField: 'spid',
				dataType: 'code',
			},
			{
				headerText: t('lbl.RUNTIME'),
				dataField: 'runtime',
				dataType: 'code',
			},
			{
				headerText: t('lbl.EXECUTETIME'),
				dataField: 'executetime',
				dataType: 'code',
			},
			{
				headerText: t('lbl.ERR'),
				dataField: 'err',
				dataType: 'code',
			},
			{
				headerText: t('lbl.ERRMSG'),
				dataField: 'errmsg',
				dataType: 'string',
			},
			{
				headerText: t('lbl.USERDISPMSG'),
				dataField: 'userdispmsg',
				dataType: 'code',
			},
			{
				headerText: t('lbl.RETURNMSG_EN'),
				dataField: 'returnmsg',
				dataType: 'code',
			},
			{
				headerText: t('lbl.DCCODE'),
				dataField: 'dccode',
				dataType: 'code',
			},
			{
				headerText: t('lbl.STORERKEY'),
				dataField: 'storerkey',
				dataType: 'code',
			},
			{
				headerText: t('lbl.STORE'),
				dataField: 'organize',
				dataType: 'code',
			},
			{
				headerText: t('lbl.AREA'),
				dataField: 'area',
				dataType: 'code',
			},
			{
				headerText: t('lbl.REQUESTCODE'),
				dataField: 'requestcode',
				dataType: 'code',
			},
			{
				headerText: t('lbl.REQUESTMSG'),
				dataField: 'requestmsg',
				dataType: 'code',
			},
		];
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	const initEvent = () => {
		ref.gridRef.current?.bind('selectionChange', function (event: any) {
			// 상세코드 조회
			searchDetailList(ref.gridRef.current.getSelectedRows()[0]);
		});
	};

	/**
	 * 상세 목록 조회
	 * @param param
	 * @param params
	 * @param row
	 */
	const searchDetailList = (row: any) => {
		// const formData = props.form.getFieldsValue();
		// const params = { ...row, ...formData };
		// text area
		form.setFieldsValue({ resultMessage: debugSql(row) });
	};

	const debugSql = (row: any) => {
		let sql = '';

		if (row.err != '0') {
			sql += `/*\n`;
			sql += `ERROR CODE : ${row.err} \n`;
			sql += `ERROR MSG. : ${row.returnmsg} \n`;
			sql += `TRANSLATE. : ${row.userdispmsg} \n`;
			sql += `*/\n`;
		}

		if (row.system == 'LOGISONEPDA' || row.system == 'LOGISONESMARTPHONE') {
			sql += `DECLARE\n`;
			sql += `	I_EXECUTESTEP		INTEGER;\n`;
			sql += `	I_ERR						INTEGER;\n`;
			sql += `	VC_RESULTMSG		NVARCHAR2(2000);\n`;
			sql += `	VC_RETURNMSG		SYS_REFCURSOR;\n`;
			sql += `BEGIN \n`;
			sql += `	${row.objectname}(\n`;
			sql += `		/**AVC_SYSTEM       =>*/ '${row.system}',\n`;
			sql += `		/**AVC_EXECUTEMODE  =>*/ 'DEBUG',\n`;
			sql += `		/**AVC_COMMAND      =>*/ '${row.command}',\n`;
			sql += `		/**AVC_DCCODE       =>*/ '${row.dccode}',\n`;
			sql += `		/**AVC_STORERKEY    =>*/ '${row.storerkey}',\n`;
			sql += `		/**AVC_ORGANIZE     =>*/ '${row.organize}',\n`;
			sql += `		/**AVC_AREA         =>*/ '${row.area}',\n`;
			sql += `		/**AVC_REQUESTCODE  =>*/ '${row.requestcode}',\n`;
			sql += `		/**AVC_REQUESTMSG   =>*/ '${row.requestmsg}',\n`;
			sql += `		/**AVC_WORKER       =>*/ '${row.worker}',\n`;
			sql += `		/**AVC_SECURITYKEY  =>*/ '',\n`;
			sql += `		/**AI_SPID          =>*/ ${row.spid},\n`;
			sql += `		/**I_ERR            =>*/ I_ERR,\n`;
			sql += `		/**VC_RESULTMSG     =>*/ VC_RESULTMSG,\n`;
			sql += `		/**VC_RETURNMSG     =>*/ VC_RETURNMSG\n`;
			sql += `	);\n`;
			sql += `END;\n`;
		} else {
			sql += `DECLARE \n`;
			sql += `	I_EXECUTESTEP   INTEGER;\n`;
			sql += `	I_ERR           INTEGER;\n`;
			sql += `	VC_RESULTMSG    NVARCHAR2(2000);\n`;
			sql += `	VC_RETURNMSG    NVARCHAR2(2000); \n`;
			sql += `BEGIN \n`;
			sql += `	${row.objectname}( \n`;
			sql += `		AVC_SYSTEM        => '${row.system}',\n `;
			sql += `		AVC_EXECUTEMODE   => 'DEBUG',\n`;
			sql += `		AVC_COMMAND       => '${row.command}',\n`;
			sql += `		AVC_DCCODE        => '${row.dccode}',\n`;
			sql += `		AVC_STORERKEY     => '${row.storerkey}',\n`;
			sql += `		AVC_ORGANIZE      => '${row.organize}',\n`;
			sql += `		AVC_AREA          => '${row.area}',\n`;
			sql += `		AVC_REQUESTCODE   => '${row.requestcode}',\n`;
			sql += `		AVC_REQUESTMSG    => '${row.requestmsg}',\n`;
			sql += `		AVC_WORKER        => '${row.worker}',\n`;
			sql += `		AVC_SECURITYKEY   => '',\n`;
			sql += `		AI_SPID           => ${row.spid},\n`;
			sql += `		I_ERR             => I_ERR,\n`;
			sql += `		VC_RESULTMSG      => VC_RESULTMSG,\n`;
			sql += `		VC_RETURNMSG      => VC_RETURNMSG\n`;
			sql += `	);\n`;
			sql += `END;\n`;
		}
		return sql;
	};

	// 그리드 속성 설정
	const gridProps = {
		fillColumnSizeMode: false, // 자동 너비 맞춤 비활성화
		// enableColumnResize: false, // 컬럼 리사이즈 비활성화
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.err != '0' && item.runtime > 2) {
				return 'error-warning'; // CSS 클래스 이름 반환
			}

			if (item.err != '0') {
				return 'color-danger'; // CSS 클래스 이름 반환
			}

			if (item.runtime > 2) {
				return 'bg-warning'; // CSS 클래스 이름 반환 ;
			}

			return 'row-base'; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 최초 마운트시 초기화
	useEffect(() => {
		initEvent();
	});

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
				gridRefCur1.setColumnPropByDataField('errmsg', { width: 200 });
				gridRefCur1.setColumnPropByDataField('userdispmsg', { width: 200 });
				gridRefCur1.setColumnPropByDataField('requestmsg', { width: 200 });
			} else {
				form.setFieldsValue({ resultMessage: '' });
			}
		}
	}, [props.data]);

	const [form] = Form.useForm();
	return (
		<>
			<Form form={form}>
				<AGridWrap className="contain-wrap">
					<AGrid className="h100">
						<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
					</AGrid>
					<InputTextArea
						name="resultMessage"
						autoSize={{ minRows: 18, maxRows: 15 }}
						style={{ width: '100%', backgroundColor: '#f5f5f5', fontFamily: 'monospace' }}
						allowClear={false}
					/>
				</AGridWrap>
			</Form>
		</>
	);
});

export default SysExecuteLogDetail;
