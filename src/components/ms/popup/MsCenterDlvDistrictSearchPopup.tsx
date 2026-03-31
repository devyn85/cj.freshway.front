/*
############################################################################
# FiledataField   : MsCenterDlvDistrictSearchPopup.tsx
# Description     : 배송 권역 검색 목록 팝업
# Author          : hyeonhobyun
# Since           : 25.09.18
############################################################################
*/
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// component
import CustomModal from '@/components/common/custom/CustomModal';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Datepicker, InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import MsCenterDlvDistrictMapPopup from '@/components/ms/popup/MsCenterDlvDistrictMapPopup';

// utils & store
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';
import commUtil from '@/util/commUtil';
import constants from '@/util/constants';

// api
import { apiPostGetMasterList } from '@/api/ms/apiMsDeliveryDistrict';

interface PropsType {
	close: () => void;
	callBack?: (rows: any[]) => void;
	dccode?: string;
}

const MsCenterDlvDistrictSearchPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { close, callBack, dccode } = props;

	const user = useAppSelector(state => state.user.userInfo);
	const [form] = Form.useForm();
	const gridRef = useRef<any>();
	const mapModalRef = useRef<any>();

	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(constants.PAGE_INFO.PAGE_SIZE);

	const [mapParams, setMapParams] = useState<any>(null);

	const gridId = uuidv4() + '_gridWrap';

	const searchBoxInit = {
		effectiveDate: dayjs(),
		// dccode: user?.defDccode ?? '',
		dccode: dccode || user?.defDccode || '',
		searchDistrict: '',
		searchDistrictGroup: '',
	};

	const gridCol = useMemo(() => {
		return [
			{
				dataField: 'dccode',
				headerText: '물류센터',
				dataType: 'code',
				width: 90,
			},
			{
				dataField: 'dlvgroupId',
				headerText: '권역그룹ID',
				dataType: 'code',
				width: 110,
			},
			{
				dataField: 'dlvgroupNm',
				headerText: '권역그룹명',
				dataType: 'string',
			},
			{
				dataField: 'popList',
				headerText: '대표POP',
				dataType: 'string',
				width: 120,
				labelFunction: (rowIndex: number, columnIndex: number, value: any) => {
					if (Array.isArray(value)) return value.join(', ');
					return value ?? '';
				},
			},
			{
				dataField: 'dlvdistrictId',
				headerText: '권역ID',
				dataType: 'code',
				width: 110,
			},
			{
				dataField: 'dlvdistrictNm',
				headerText: '권역명',
				dataType: 'string',
			},
			{
				headerText: '권역 지도',
				width: 90,
				style: 'aui_comm_search--center',
				commRenderer: {
					type: 'search',
					onClick: (event: any) => {
						const item = event.item || {};
						setMapParams({
							dccode: item.dccode,
							effectiveDate: form.getFieldValue('effectiveDate')?.format('YYYYMMDD') ?? dayjs().format('YYYYMMDD'),
							dlvgroupId: item.dlvgroupId,
							dlvdistrictId: item.dlvdistrictId,
						});
						mapModalRef.current?.handlerOpen();
					},
				},
			},
			{
				dataField: 'fromDate',
				headerText: '적용시작일자',
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				width: 120,
			},
			{
				dataField: 'toDate',
				headerText: '적용종료일자',
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				width: 120,
			},
		];
	}, [t]);

	const gridProps = useMemo(() => {
		return {
			editable: false,
			showRowCheckColumn: false,
			enableFilter: true,
			enableCellMerge: true,
			editableMergedCellsAll: true,
		};
	}, []);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * 목록 조회
	 * @param {boolean} isReset 초기 검색 여부
	 */
	const fetchList = (isReset = false) => {
		const tt = isReset ? 0 : currentPage - 1;
		const fields = form.getFieldsValue();
		const params = {
			effectiveDate: fields.effectiveDate ? dayjs(fields.effectiveDate).format('YYYYMMDD') : dayjs().format('YYYYMMDD'),
			dccode: fields.dccode || '',
			searchDistrict: fields.searchDistrict || '',
			searchDistrictGroup: fields.searchDistrictGroup || '',
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
			skipCount: !isReset && currentPage !== 1,
		};

		apiPostGetMasterList(params).then((res: any) => {
			const dataList = res?.data?.list ?? res?.data ?? res?.list ?? [];
			const total = res?.data?.totalCount ?? res?.totalCount ?? dataList.length;

			if (isReset) {
				setTotalCount(total);
				gridRef.current?.setGridData?.(dataList);
			} else if (gridRef.current) {
				// 스크롤 추가
				if (currentPage === 1) gridRef.current.setGridData(dataList);
				else gridRef.current.appendData(dataList);
			}

			// 칼럼 사이즈 맞춤
			const colSizeList = gridRef.current?.getFitColumnSizeList?.(true);
			gridRef.current?.setColumnSizeList?.(colSizeList);
		});
	};

	const onClickSearch = () => {
		setCurrentPage(1);
		gridRef.current?.clearGridData?.();
		fetchList(true);
	};

	const onClickRefresh = () => {
		form.setFieldsValue({
			dccode: props?.dccode ?? '',
			searchDistrict: '',
			searchDistrictGroup: '',
			effectiveDate: dayjs(),
		});
		setCurrentPage(1);
		gridRef.current?.clearGridData?.();
		fetchList(true);
	};

	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearch,
			refresh: onClickRefresh,
		}),
		[],
	);

	const selectRowData = () => {
		const selectedRow = gridRef.current?.getSelectedRows?.() ?? [];
		if (selectedRow?.length && callBack) callBack(selectedRow);
		close();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		// 초기 검색
		form.setFieldsValue(searchBoxInit);
		fetchList(true);
	}, []);

	useEffect(() => {
		// 더블클릭 선택
		gridRef.current?.bind?.('cellDoubleClick', function () {
			selectRowData();
		});
	}, []);

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => setCurrentPage(prev => prev + 1),
		totalCount,
	});

	useEffect(() => {
		if (currentPage > 1) fetchList(false);
	}, [currentPage]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="배송 권역 검색" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBoxInit} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-3">
						<li>
							<SelectBox
								disabled
								label={t('lbl.DCCODE') || '물류센터'}
								name="dccode"
								width={100}
								options={getUserDccodeList('')}
								fieldNames={{ label: 'dcname', value: 'dccode' }}
								initval={dccode || user?.defDccode}
							/>
						</li>
						<li>
							<InputText
								label="권역명"
								name="searchDistrict"
								width={120}
								placeholder="권역명"
								onPressEnter={onClickSearch}
							/>
						</li>
						<li>
							<InputText
								label="권역그룹명"
								name="searchDistrictGroup"
								width={120}
								placeholder="권역그룹명"
								onPressEnter={onClickSearch}
							/>
						</li>
						<li>
							<Datepicker
								format={'YYYY-MM-DD'}
								allowClear={false}
								label={t('lbl.APPLYDT') || '적용일자'}
								name="effectiveDate"
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid
				 ref={gridRef}
				 columnLayout={gridCol}
				 gridProps={gridProps}
				 name={gridId}
				/>
			</AGrid>

			{/* 지도 팝업 */}
			<CustomModal ref={mapModalRef} width="1200px">
				<MsCenterDlvDistrictMapPopup params={mapParams} />
			</CustomModal>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL') || '닫기'}
				</Button>
				<Button size={'middle'} type="primary" onClick={selectRowData}>
					{t('lbl.BTN_CONFIRM') || '확인'}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default MsCenterDlvDistrictSearchPopup;
