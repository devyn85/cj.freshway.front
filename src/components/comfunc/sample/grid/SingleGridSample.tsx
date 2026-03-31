/*
 ############################################################################
 # FiledataField	: SingleGridSample.tsx
 # Description		: 단일 그리드 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Libs
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Input, Select } from 'antd';

// Utils
import dateUtils from '@/util/dateUtil';

// Components
import PageGridBtn from '@/components/common/PageGridBtn';

// API Call Function
import { apiGetUserList } from '@/api/common/apiSysmgt';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Style & CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

const SingleGridSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	// AUI Grid Component 제어를 위한 Ref
	const gridRef = useRef(null);

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		fixedColumnCount: 2,
		fillColumnSizeMode: false,
		showFooter: true,
		// 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
		showDragKnobColumn: true,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		enableDrag: true,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		enableMultipleDrag: true,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		enableDrop: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '근속연수 평균:',
			positionField: 'empNo',
		},
		{
			dataField: 'period',
			positionField: 'period',
			operation: 'AVG',
			formatString: '#,##0',
			postfix: '년',
		},
		{
			labelText: '연봉 합계:',
			positionField: 'mailAddr',
			align: 'right',
		},
		{
			dataField: 'salary',
			positionField: 'salary',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '원',
		},
	];

	// 그리드 버튼 Props
	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			gridRef.current.addRow({ userStatus: '01', userEnable: '1' });
		},
		isMinus: true,
		minusFunction: function () {
			gridRef.current.removeRow('selectedIndex');
		},
		isCopy: true,
		copyFunction: function () {
			const selectedRow = gridRef.current.getSelectedRows();
			if (selectedRow && selectedRow.length > 0) {
				const item = selectedRow[0];
				item.comCd = '';
				gridRef.current.addRow(item, 'selectionDown');
			}
		},
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// data 조회 method
	const onClickSearchButton = () => {
		// Grid Data 초기화
		gridRef.current.clearGridData();

		// 사용자 정보 조회
		apiGetUserList({}).then(res => {
			const gridData = res.data.map((data: any) => {
				// summary 계산을 위한 근속연수, 연봉 랜덤 지정
				const period = Math.ceil(commUtil.secureRandom(15));
				const salary = Math.ceil(commUtil.secureRandom(5000) + 5000) * 10000;
				return { ...data, period, salary };
			});
			// data setting
			gridRef.current.setGridData(gridData);
		});
	};

	//그리드 컬럼
	const getGridCol = () => {
		return [
			{
				headerText: 'Fixed Column',
				children: [
					{
						dataField: 'userId',
						headerText: t('sysmgt.users.user.userId'),
						width: '15%',
						required: true,
						maxlength: 12,
					},
					{
						dataField: 'userNm',
						headerText: t('sysmgt.users.user.userNm'),
						width: '15%',
						required: true,
						maxlength: 200,
					},
				],
			},
			{
				dataField: 'empNo',
				headerText: t('sysmgt.users.user.empNo'),
				width: '10%',
				maxlength: 20,
			},
			{
				headerText: '근속연수',
				dataField: 'period',
				dataType: 'numeric',
				postfix: '년',
				filter: {
					showIcon: true,
					type: 'numeric',
				},
				width: '10%',
				position: 'middle',
			},
			{
				dataField: 'mailAddr',
				headerText: '이메일',
				width: '15%',
				maxlength: 20,
			},
			{
				headerText: '연봉',
				dataField: 'salary',
				width: '10%',
				dataType: 'numeric',
				formatString: '#,##0',
				postfix: '원',
				filter: {
					showIcon: true,
					type: 'numeric',
				},
				headerTooltip: {
					show: true,
					tooltipHtml: 'tooltip sample 입니다.<br/> 실제 연봉과 상관 없는 데이터입니다.',
				},
			},
			{
				dataField: 'userStatus',
				headerText: t('sysmgt.users.user.userStatus'),
				width: '10%',
				required: true,
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'dropDown',
					list: getCommonCodeList('USER_STATUS'),
				},
			},
			{
				dataField: 'userEnable',
				headerText: t('sysmgt.users.user.userEnable'),
				width: '10%',
				renderer: {
					type: 'CheckBoxEditRenderer',
					checkValue: '1',
					unCheckValue: '0',
					editable: true,
				},
			},
			{
				dataField: 'regId',
				headerText: t('com.col.regId'),
				width: '10%',
				editable: false,
				filter: {
					showIcon: true,
				},
			},
			{
				dataField: 'regDt',
				headerText: t('com.col.regDt'),
				width: '10%',
				editable: false,
			},
		];
	};

	// 그리드 엑셀 다운로드 (DRM 적용)
	const downloadExcel = () => {
		const params = {
			fileName: 'ExcelDownloadSample_' + dateUtils.getToDay('YYYYMMDDHHMMss'),
		};
		gridRef.current.exportToXlsxGrid(params);
	};

	/**
	 * 사용자 이름 필터 적용
	 * @param {string} value 사용자 이름 필터 기준 value
	 */
	const userOnSearch = (value: string) => {
		if (value === '') {
			gridRef.current.clearFilterAll();
		} else {
			const regx = new RegExp(`${value}`, 'i');
			const filterFn = (dataField: string, value: string) => {
				return regx.test(value);
			};
			gridRef.current.setFilter('userNm', filterFn);
		}
	};

	/**
	 * 사용자 상태 필터 적용
	 * @param {string} value 사용자 상태 필터 기준 value
	 */
	const userStatusOnChange = (value: string) => {
		if (value === '') {
			gridRef.current.clearFilterAll();
		} else {
			gridRef.current.setFilterByValues('userStatus', value);
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// Component Mounted
	useEffect(() => {
		onClickSearchButton();
		// 그리드 초기화
		// 에디팅 시작 이벤트 바인딩
		const gridRefCur = gridRef.current;
		// 에디팅 시작 이벤트 바인딩
		gridRefCur.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRefCur.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'userId') {
				return gridRefCur.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	}, []);

	return (
		<AGrid>
			<PageGridBtn gridBtn={gridBtn} gridTitle="단일 그리드" position={'prefix'}>
				<Input.Search placeholder="이름을 입력하세요." onSearch={userOnSearch} />
				<Select
					placeholder="사용자 상태를 선택하세요."
					options={getCommonCodeList('USER_STATUS', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					onChange={userStatusOnChange}
				/>
				<Button onClick={downloadExcel}>
					{/* 행복사 */}
					{t('com.btn.excelDownload')}
				</Button>
			</PageGridBtn>
			<AUIGrid ref={gridRef} columnLayout={getGridCol()} gridProps={gridProps} footerLayout={footerLayout} />
		</AGrid>
	);
};

export default SingleGridSample;
