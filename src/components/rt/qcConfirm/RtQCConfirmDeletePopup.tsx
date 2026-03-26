/*
 ############################################################################
 # FiledataField	: RtQCConfirmDeletePopup.tsx
 # Description		: 판정중삭제
 # Author			: KimDongHyeon
 # Since			: 2025.10.24
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';

// component
import { InputText, MultiInputText, Rangepicker, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils
import { apiPostMasterList2 } from '@/api/rt/apiRtQCConfirm';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { getCommonCodeList } from '@/store/core/comCodeStore';
// API Call Function

const RtQCConfirmDeletePopup = forwardRef(({ callBack, form, closeModal1, searchForm }: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const dateFormat = 'YYYY-MM-DD';
	const { t } = useTranslation();
	const gridRef = useRef(null);
	const modalRef = useRef(null);
	const [gridData, setGridData] = useState([]);
	const [loopTrParams, setLoopTrParams] = useState({});

	const gridCol = [
		{ headerText: t('lbl.QCTYPE_RT'), dataField: 'processtypename', dataType: 'code', editable: false }, // 처리구분
		{ headerText: t('lbl.SOURCEKEY_RT'), dataField: 'docno', dataType: 'code', editable: false }, // 고객주문번호
		{ headerText: t('lbl.DOCDT_RT'), dataField: 'slipdt', dataType: 'date', editable: false }, // 반품요청일자
		{ headerText: t('lbl.RETURNDELAYYN_RT'), dataField: 'vendoreturnyn', dataType: 'code', editable: false }, // 반품지연여부
		{
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			dataField: 'custkey',
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.fromCustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
		}, // 관리처코드
		{
			headerText: t('lbl.FROM_CUSTNAME_RT'),
			dataField: 'fromCustname',
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 관리처명
		{
			headerText: t('lbl.TO_VATNO'),
			dataField: 'billtocustkey',
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.billtocustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
		}, // 판매처코드
		{
			headerText: t('lbl.TO_VATOWNER'),
			dataField: 'billtocustname',
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 판매처명
		{ headerText: t('lbl.SALEGROUP'), dataField: 'saleorganize', dataType: 'code', editable: false }, // 영업조직
		{ headerText: t('lbl.SALEDEPARTMENT'), dataField: 'saledepartment', dataType: 'code', editable: false }, // 사업장
		{ headerText: t('lbl.CUSTGROUP'), dataField: 'salegroup', dataType: 'code', editable: false }, // 영업그룹
		{ headerText: t('lbl.CLAIMDTLIDS'), dataField: 'other03', dataType: 'code', editable: false }, // VoC(소)
		{ headerText: t('lbl.CLAIMDTLID'), dataField: 'other04', dataType: 'code', editable: false }, // VoC(세)
		{ headerText: t('lbl.NOTRECALLREASON_RT'), dataField: 'reasoncode', dataType: 'code', editable: false }, // 미회수사유
		{ headerText: t('lbl.REASONTYPE'), dataField: 'other01', dataType: 'code', editable: false }, // 귀책구분
		{ headerText: t('lbl.BLNGDEPTCD'), dataField: 'blngdeptname', editable: false }, // 귀속구분
		{ headerText: t('lbl.LOGI_RESP_YN'), dataField: 'logiRespYn', dataType: 'code', editable: false }, // 물류귀책여부
		{ headerText: t('lbl.RESP_TYPE'), dataField: 'respTypeNm', dataType: 'code', editable: false }, // 귀책배부
		{ headerText: t('lbl.MOVE_LOC'), dataField: 'toLoc', dataType: 'code', editable: false }, // 이동로케이션
		{
			headerText: t('lbl.VENDOR'),
			dataField: 'vendor',
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.vendor,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
		}, // 협력사코드
		{
			headerText: t('lbl.VENDORNAME'),
			dataField: 'vendorname',
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 협력사명
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					headerText: t('lbl.SKU'),
					dataField: 'sku',
					dataType: 'code',
					editable: false,
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							const params = {
								sku: e.item.sku,
								skuDescr: e.item.skuName,
							};
							gridRef.current.openPopup(params, 'sku');
						},
					},
				}, // 상품코드
				{
					headerText: '상품명칭',
					dataField: 'skuname',
					editable: false,
					filter: {
						showIcon: true,
					},
				}, // 상품명칭
			],
		},
		{ headerText: t('lbl.PLANT'), dataField: 'plantDescr', dataType: 'code', editable: false }, // 플랜트
		{ headerText: t('lbl.STORAGETYPE'), dataField: 'storagetype', dataType: 'code', editable: false }, // 저장조건
		{ headerText: t('lbl.CHANNEL_DMD'), dataField: 'channelName', dataType: 'code', editable: false }, // 저장유무
		{ headerText: t('lbl.UOM'), dataField: 'storeruom', dataType: 'code', editable: false }, // 단위
		{
			headerText: t('lbl.CONFIRMQTY_RT'),
			dataField: 'confirmqty',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 반품수량
		{
			headerText: t('lbl.QCQTY'),
			dataField: 'orderqty',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 판정수량
		{ headerText: t('lbl.REASONMSG_RTQC'), dataField: 'reasonmsg', dataType: 'code', editable: false }, // 처리변경사유
		{
			headerText: '기준일(제조)',
			dataField: 'lotManufacture',
			dataType: 'code',
			align: 'center',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 기준일(제조)
		{
			headerText: '기준일(소비)',
			dataField: 'lotExpire',
			dataType: 'code',
			align: 'center',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 기준일(소비)
		{
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{ headerText: t('lbl.SERIALNO'), dataField: 'serialno', dataType: 'code', editable: false }, // 이력번호
				{ headerText: t('lbl.BARCODE'), dataField: 'barcodeSn', dataType: 'code', editable: false }, // 바코드
				{ headerText: t('lbl.BLNO'), dataField: 'convserialno', dataType: 'code', editable: false }, // B/L 번호
				{ headerText: t('lbl.BUTCHERYDT'), dataField: 'butcherydt', dataType: 'date', editable: false }, // 도축일자
				{ headerText: t('lbl.FACTORYNAME'), dataField: 'factoryname', editable: false }, // 도축장
				{ headerText: t('lbl.CONTRACTTYPE'), dataField: 'contracttype', dataType: 'code', editable: false }, // 계약유형
				{ headerText: t('lbl.CONTRACTCOMPANY'), dataField: 'wdCustkey', dataType: 'code', editable: false }, // 계약업체
				{ headerText: t('lbl.CONTRACTCOMPANYNAME'), dataField: 'wdCustname', editable: false }, // 계약업체명
				{ headerText: t('lbl.FROM'), dataField: 'fromvaliddt', dataType: 'date', editable: false }, // 보내는곳
				{ headerText: t('lbl.TO'), dataField: 'tovaliddt', dataType: 'date', editable: false }, // 받는곳
				{
					headerText: t('lbl.SERIALORDERQTY'),
					dataField: 'serialorderqty',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔예정량
				{
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataField: 'serialinspectqty',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔량
				{
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataField: 'serialscanweight',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔중량
			],
		},
		{ headerText: t('매입센터'), dataField: 'stoDcname', dataType: 'code', editable: false }, // 매입센터
		{ headerText: t('lbl.QCSTATUS_RT'), dataField: 'status', dataType: 'code', editable: false }, // 처리상태
	];

	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells',
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickSearch = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [fromSlipdt, toSlipdt] = requestParams.qcdt;
		requestParams.slipdtFrom = fromSlipdt.format('YYYYMMDD');
		requestParams.slipdtTo = toSlipdt.format('YYYYMMDD');
		requestParams.fixdccode = searchForm.getFieldValue('fixdccode');
		requestParams.popSearchYn = 'Y';
		requestParams.statusRtqc = '90'; //처리완료건
		delete requestParams.slipdt;
		delete requestParams.qcdt;

		const { data } = await apiPostMasterList2(requestParams);
		setGridData(data || []);
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.resetFields();
		form.setFieldValue('qcdt', searchForm.getFieldValue('slipdt'));
		form.setFieldValue('qctype', searchForm.getFieldValue('qctype'));
		gridRef.current.clearGridData();
	};

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		callBack(selectedRow);
		form.resetFields();
	};

	/**
	 * 확인
	 */
	const checkRowData = () => {
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		showConfirm(
			null,
			`상태만 '판정완료'에서 '미판정'으로 변경됩니다. 판정처리시 이동한 내용들은 모두 수동으로 원복 시켜야합니다.\n판정삭제 하시겠습니까?`,
			async () => {
				const params = {
					apiUrl: '/api/rt/qcConfirm/v1.0/deleteMasterList',
					saveDataList: checkedItems.map((item: any) => ({
						...item,
						fixdccode: searchForm.getFieldValue('fixdccode'),
					})),
				};

				setLoopTrParams(params);
				modalRef.current.handlerOpen();
			},
		);
	};

	const titleFunc = {
		searchYn: onClickSearch,
		refresh: onClickRefreshButton,
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		gridRef.current.setGridData(gridData);

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData]);

	useEffect(() => {
		//초기화
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="판정 삭제" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={form} initialValues={{}} groupClass="grid-column-2" isAlwaysVisible>
				{/* <li>
					<CmStorerKeySelectBox nameKey="storerKey" label={'회사'} />
				</li> */}
				<li>
					<Rangepicker
						label={t('lbl.QCDT_RT')} //광역반품일자
						name="qcdt"
						// defaultValue={dates} // 초기값 설정
						format={dateFormat} // 화면에 표시될 형식
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<MultiInputText
						label={t('lbl.SOURCEKEY_RT')} //고객반품주문번호
						name="docno"
						placeholder={t('msg.placeholder1', [t('lbl.SOURCEKEY_RT')])}
						// required
						// rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<CmCustSearch
						form={form}
						name="fromCustkeyNm"
						code="fromCustkey"
						label={t('lbl.CUSTKEY_WD')} /*협력사코드*/
					/>
				</li>
				<li>
					<CmSkuSearch
						form={form} //상품
						selectionMode="multipleRows"
						name="skuName"
						code="sku"
						required={false}
					/>
				</li>
				<li>
					<SelectBox //처리구분
						name="qctype"
						span={24}
						required
						options={getCommonCodeList('QCTYPE_RT')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
						label={t('lbl.QCTYPE_RT')}
					/>
				</li>
			</SearchFormResponsive>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(gridData?.length)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={closeModal1}>닫기</Button>
				<Button type="primary" onClick={checkRowData}>
					판정삭제
				</Button>
			</ButtonWrap>

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeModal1} />
			</CustomModal>
		</>
	);
});

export default RtQCConfirmDeletePopup;
