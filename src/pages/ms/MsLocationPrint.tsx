/*
 ############################################################################
 # FiledataField	: MsLocationPrint.tsx
 # Description		: 기준정보 > 물류센터 정보 > 로케이션 라벨 출력
 # Author			: KimDongHan
 # Since			: 2025.09.24
 ############################################################################
*/
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterList } from '@/api/ms/apiMsLocationPrint';
import MsLocationPrintDetail from '@/components/ms/locationPrint/MsLocationPrintDetail';
import MsLocationPrintSearch from '@/components/ms/locationPrint/MsLocationPrintSearch';
import { validateForm } from '@/util/FormUtil';

// Store

const MsLocationPrint = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	//const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();

		// 그리드 초기화
		gridRef.current?.clearGridData();
		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};

	// 인쇄는 로케이션 그룹별 단수 기준으로 출력됨.
	// QR 인쇄
	const printQr = () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length < 1) {
			// 인쇄할 데이터가 없습니다.
			showAlert(null, t('msg.noPrintData'));
			return;
		}

		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
		// QR 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_MS_LOCATION_PRINT_001'), async () => {
			// 결과 행들을 담을 배열
			const rows: any[] = [];

			// 체크된 각 행(item)마다 별도로 처리 (다른 행의 값과 이어지지 않음)
			for (const item of checkedItems) {
				// loc 필드값 (locGroup 사용)
				const prefix = (item.locGroup ?? '').toString().trim();

				// layerList를 분리 (예: "01,02,03")
				const raw = item.layerList ?? '';
				const values = raw
					.split(',')
					.map((s: string) => s.trim())
					.filter(Boolean);

				// layerList가 비어있다면 loc만 넣은 한 행을 추가 (빈값은 ''로)
				if (values.length === 0) {
					const emptyRow: any = { loc: prefix || '' };
					for (let k = 0; k < 5; k++) {
						emptyRow[`loc${k + 1}`] = '';
						emptyRow[`loc${k + 1}_layer`] = '';
					}
					rows.push(emptyRow);
					continue;
				}

				// values를 객체 배열로 변환 (원값과 숫자값)
				const valueObjs: { raw: string; num: number | null }[] = values.map((v: string) => {
					const num = parseInt(v, 10);
					return {
						raw: v,
						num: Number.isNaN(num) ? null : num,
					};
				});

				// 전체를 숫자 기준 오름차순 정렬(비숫자 null은 뒤로)
				valueObjs.sort((a, b) => {
					if (a.num === null && b.num === null) return 0;
					if (a.num === null) return 1;
					if (b.num === null) return -1;
					return a.num! - b.num!;
				});

				// 정렬된 전체 배열을 5개씩 묶어서 각 출력 행 생성
				for (let i = 0; i < valueObjs.length; i += 5) {
					const chunk = valueObjs.slice(i, i + 5);

					const row: any = {};
					// loc 필드에는 해당 행의 locGroup 값을 넣음 (빈이면 '')
					row['loc'] = prefix || '';

					for (let j = 0; j < 5; j++) {
						const it = chunk[j];
						// locN: 접두사+원래값 (예: A + 01 => A01), 없으면 ''
						row[`loc${j + 1}`] = it ? `${prefix}${it.raw}` : '';
						// locN_layer: 숫자값 뒤에 "단" 붙임, 숫자 아닌 경우 ''
						row[`loc${j + 1}_layer`] = it && it.num !== null ? `${it.num}${String(t('lbl.DAN')).trim()}` : '';
					}
					rows.push(row);
				}
			}

			// 1. 리포트 파일명
			const fileName = ['MS_Label_CJFWMS1.mrd'];

			// 2. 리포트에 XML 생성을 위한 DataSet 생성
			const dataSet = [rows];

			// 3. 리포트 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId = ['CJFWST1'];

			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	// 바코드 인쇄
	const printBarcode = () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length < 1) {
			// 인쇄할 데이터가 없습니다.
			showAlert(null, t('msg.noPrintData'));
			return;
		}

		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
		// 바코드 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_MS_LOCATION_PRINT_002'), async () => {
			// 결과 행들을 담을 배열
			const rows: any[] = [];

			// 체크된 각 행(item)마다 별도로 처리 (다른 행의 값과 이어지지 않음)
			for (const item of checkedItems) {
				// loc 필드값 (locGroup 사용)
				const prefix = (item.locGroup ?? '').toString().trim();

				// layerList를 분리 (예: "01,02,03")
				const raw = item.layerList ?? '';
				const values = raw
					.split(',')
					.map((s: string) => s.trim())
					.filter(Boolean);

				// layerList가 비어있다면 loc만 넣은 한 행을 추가 (빈값은 ''로)
				if (values.length === 0) {
					const emptyRow: any = { loc: prefix || '' };
					for (let k = 0; k < 5; k++) {
						emptyRow[`BARCODE${k + 1}`] = '';
					}
					rows.push(emptyRow);
					continue;
				}

				// values를 객체 배열로 변환 (원값과 숫자값) — 숫자 정렬 기준은 유지하되 실제 BARCODE에는 원값 사용
				const valueObjs: { raw: string; num: number | null }[] = values.map((v: string) => {
					const num = parseInt(v, 10);
					return {
						raw: v,
						num: Number.isNaN(num) ? null : num,
					};
				});

				// 전체를 숫자 기준 오름차순 정렬(비숫자 null은 뒤로)
				valueObjs.sort((a, b) => {
					if (a.num === null && b.num === null) return 0;
					if (a.num === null) return 1;
					if (b.num === null) return -1;
					return a.num! - b.num!;
				});

				// 정렬된 전체 배열을 5개씩 묶어서 각 출력 행 생성
				for (let i = 0; i < valueObjs.length; i += 5) {
					const chunk = valueObjs.slice(i, i + 5);

					const row: any = {};
					// loc 필드에는 해당 행의 locGroup 값을 넣음 (빈이면 '')
					row['loc'] = prefix || '';

					for (let j = 0; j < 5; j++) {
						const it = chunk[j];
						// BARCODEN: 접두사+원래값 (예: A + 01 => A01), 없으면 ''
						row[`barcode${j + 1}`] = it ? `${prefix}${it.raw}` : '';
					}
					rows.push(row);
				}
			}

			// 1. 리포트 파일명
			const fileName = ['MS_Label_CJFWMS2.mrd'];

			// 2. 리포트에 XML 생성을 위한 DataSet 생성
			const dataSet = [rows];

			// 3. 리포트 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId = ['CJFWMS2'];

			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	// 검색영역 초기 세팅
	const searchBox = {
		whareafloor: '',
		loctype: '',
		loccategory: '',
		loclevel: '',
		locflag: '',
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearGridData();
		// },
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 소팅 초기화
	useEffect(() => {
		gridRef.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
	});

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<MsLocationPrintSearch {...formProps} />
			</SearchFormResponsive>

			<MsLocationPrintDetail gridRef={gridRef} gridData={gridData} printQr={printQr} printBarcode={printBarcode} />
		</>
	);
};

export default MsLocationPrint;
