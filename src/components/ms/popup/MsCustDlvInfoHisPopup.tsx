/*
 ############################################################################
 # FiledataField	: MsCustDlvInfoHisPopup.tsx
 # Description		: 고객배송조건 수신이력 조회 팝업
 # Author			: YeoSeungCheol
 # Since			: 25.07.29
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText, SearchForm } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// API Call Function
import { apiGetCustDlvInfoHis } from '@/api/ms/apiMsCustDlvInfoHis';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

/**
 * =====================================================================
 *	01. 변수 선언부
 * =====================================================================
 */
interface PropsType {
	callBack?: any;
	close?: any;
	custKey?: string;
}

const MsCustDlvInfoHisPopup = (props: PropsType) => {
	const { callBack, close, custKey } = props;

	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gridRef = useRef(null);

	const [popupList, setPopupList] = useState([]);
	const [totalCount, setTotalCount] = useState(0);

	const [searchBox] = useState({
		custCode: custKey || '',
		dateRange: [dayjs().subtract(1, 'month'), dayjs()],
	});

	const gridId = uuidv4() + '_gridWrap';

	// YN 라벨함수
	const ynLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('YN', value)?.cdNm || value;
	};

	// 시간 포맷 라벨함수 (HHMM -> HH:MM)
	const timeFormatLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return value ? `${value.slice(0, 2)}:${value.slice(2, 4)}` : '';
	};

	const gridCol = [
		{
			// 확정
			headerText: t('lbl.CONFIRM'),
			dataField: 'status',
			dataType: 'code',
			width: 80,
			// editable: true,
			style: 'gird-button-default',
			renderer: {
				type: 'TemplateRenderer',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return `<button type="button" class="aui-grid-button-renderer confirm-action-btn">확정</button>`;
			},
		},
		{
			// 확정시간
			headerText: t('lbl.CONFIRMDT'),
			dataField: 'confirmdate',
			dataType: 'date',
			formatString: 'YYYYMMDDHHMMSS',
			editable: true,
		},
		{
			// 시스템
			headerText: t('lbl.SYS'),
			dataField: 'sourceSystem',
			dataType: 'code',
		},
		{
			// 작성시간
			headerText: t('lbl.WRITETIME'),
			dataField: 'createddate',
			dataType: 'date',
			formatString: 'YYYYMMDDHHMMSS',
		},
		{
			// 작성자명
			headerText: '작성자명',
			dataField: 'createdbyname',
			dataType: 'string',
		},
		{
			// 거래처
			headerText: t('lbl.CUST'),
			dataField: 'custkey',
			dataType: 'code',
		},
		{
			// 거래처명
			headerText: t('lbl.CUST_NAME'),
			dataField: 'custname',
			dataType: 'string',
		},
		{
			// 실착지 주소 일치 여부
			headerText: '실착지 주소 일치 여부',
			dataField: 'addressmatchyn',
			dataType: 'code',
			labelFunction: ynLabelFunc,
		},
		{
			// 실착지 주소
			headerText: '실착지 주소',
			dataField: 'truthaddress1',
			dataType: 'string',
		},
		{
			// 실착지 상세주소
			headerText: '실착지 상세주소',
			dataField: 'truthaddress2', // arrivaldetailaddress
			dataType: 'string',
		},
		{
			// 실착지 우편번호
			headerText: '실착지 우편번호',
			dataField: 'truthzipcode', // arrivalpostalcode
			dataType: 'string',
		},
		{
			// 대면 검수 여부
			headerText: '대면검수여부',
			dataField: 'faceinspect',
			dataType: 'code',
			labelFunction: ynLabelFunc,
		},
		{
			// 검수 실무자 전화번호
			headerText: '검수 실무자 전화번호',
			dataField: 'inspectionworkerphone',
			dataType: 'string',
		},
		{
			// 검수자용 납품서 출력 여부
			headerText: '검수자용 납품서 출력 여부',
			dataField: 'inspectorprintyn',
			dataType: 'code',
			labelFunction: ynLabelFunc,
		},
		{
			// 건물/주차장 진입 가능 높이
			headerText: '건물/주차장 진입 가능 높이',
			dataField: 'parkingheight',
			dataType: 'string',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return getCommonCodebyCd('CRM_DLV_PARKINGHEIGHT', value)?.cdNm || value;
			},
		},
		{
			// 출입 key
			headerText: t('lbl.ENTRANCEKEYINFO'),
			dataField: 'keytype',
			dataType: 'string',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return getCommonCodebyCd('CRM_DLV_KEYTYPE', value)?.cdNm || value;
			},
		},
		{
			// 출입 key 상세
			headerText: t('lbl.ENTRANCEKEYDETAILINFO'),
			dataField: 'keydetail',
			dataType: 'string',
		},
		{
			// 배송요청시간(FROM)
			headerText: '배송요청시간(FROM)',
			dataField: 'reqdlvtime2From',
			dataType: 'code',
			labelFunction: timeFormatLabelFunc,
		},
		{
			// 배송요청시간(TO)
			headerText: '배송요청시간(TO)',
			dataField: 'reqdlvtime2To',
			dataType: 'code',
			labelFunction: timeFormatLabelFunc,
		},
		{
			// 납품 가능 시간
			headerText: t('lbl.DLV_YN_TIME'),
			dataField: 'deliveryavailabletime',
			dataType: 'string',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return getCommonCodebyCd('CRM_DLV_DELIVERYAVLTIME', value)?.cdNm || value;
			},
		},
		{
			// 건물 개방 시간
			headerText: t('lbl.BLDG_OPEN_TIME'),
			dataField: 'buildingopentime',
			dataType: 'string',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return getCommonCodebyCd('CRM_DLV_BUILDINGOPENTIME', value)?.cdNm || value;
			},
		},
		{
			// 출입 이동 동선
			headerText: '출입 이동 동선',
			dataField: 'accessway',
			dataType: 'string',
		},
		{
			// 적재위치(냉동)
			headerText: '적재위치(냉동)',
			dataField: 'freezeplace',
			dataType: 'string',
		},
		{
			// 적재위치(냉장)
			headerText: '적재위치(냉장)',
			dataField: 'coldplace',
			dataType: 'string',
		},
		{
			// 적재위치(상온)
			headerText: '적재위치(상온)',
			dataField: 'htemperature',
			dataType: 'string',
		},
		{
			// 반품 위치
			headerText: '반품 위치',
			dataField: 'loadplace2',
			dataType: 'string',
		},
		{
			// 초도배송 요청일자
			headerText: '초도배송 요청일자',
			dataField: 'initrequestdt',
			dataType: 'date',
			formatString: 'YYYY-MM-DD',
		},
		{
			// 초도배송 요청시간(FROM)
			headerText: '초도배송 요청시간(FROM)',
			dataField: 'initrequesttimestart',
			dataType: 'code',
			labelFunction: timeFormatLabelFunc,
		},
		{
			// 초도배송 요청시간(TO)
			headerText: '초도배송 요청시간(TO)',
			dataField: 'initrequesttimeend',
			dataType: 'code',
			labelFunction: timeFormatLabelFunc,
		},
		{
			// 초도배송 대면검수 여부
			headerText: '초도배송 대면검수 여부',
			dataField: 'initftfinspectionyn',
			dataType: 'code',
			labelFunction: ynLabelFunc,
		},
		{
			// 초도배송 담당자 연락처
			headerText: '초도배송 담당자 연락처',
			dataField: 'initdeliverycontact',
			dataType: 'string',
		},
		{
			// 배송유형
			headerText: t('lbl.DELIVERYTYPE_2'),
			dataField: 'deliverytype',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return getCommonCodebyCd('CRM_DLV_DELIVERYTYPE', value)?.cdNm || value;
			},
		},
		{
			// 온도기록지 제출 대상 여부
			headerText: '온도기록지 제출 대상 여부',
			dataField: 'temptarget',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return getCommonCodebyCd('CRM_DLV_TMEPTARGET', value)?.cdNm || value;
			},
		},
		{
			// 라벨 출력 유형
			headerText: t('lbl.LABELPRINTCATEGORY'),
			dataField: 'labelprinttype',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return getCommonCodebyCd('CRM_DLV_LABELPRINTTYPE', value)?.cdNm || value;
			},
		},
		{
			// 배송도착 알림 수신 여부
			headerText: '배송도착 알림 수신 여부',
			dataField: 'deliverynotiyn',
			dataType: 'code',
			labelFunction: ynLabelFunc,
		},
		{
			// 배송도착 알림 수신 휴대폰 번호
			headerText: '배송도착 알림 수신 휴대폰 번호',
			dataField: 'deliverynotiphone',
			dataType: 'string',
		},
		{
			// 배송도착 알림 수신 시간(FROM)
			headerText: '배송도착 알림 수신 시간(FROM)',
			dataField: 'deliverynotitimeStart',
			labelFunction: timeFormatLabelFunc,
			// dataType: 'date',
			// formatString: 'YYYY-MM-DD HH:mm:ss',
		},
		{
			// 배송도착 알림 수신 시간(TO)
			headerText: '배송도착 알림 수신 시간(TO)',
			dataField: 'deliverynotitimeend',
			labelFunction: timeFormatLabelFunc,
			// dataType: 'date',
			// formatString: 'YYYY-MM-DD HH:mm:ss',
		},
		{
			// 파일
			headerText: t('lbl.FILE'),
			dataField: 'edmsfileid',
			dataType: 'string',
		},
		{
			headerText: '초도배송시 전달사항',
			dataField: 'initdeliverydesc',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '사번',
			dataField: 'emploeenumber',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '작성자 이메일',
			dataField: 'createdbyemail',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '업장유형',
			dataField: 'storetype',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '생성일',
			dataField: 'adddate',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '수정일',
			dataField: 'editdate',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '생성자',
			dataField: 'addwho',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '수정자',
			dataField: 'editwho',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '고객유형',
			dataField: 'custtype',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: '',
			dataField: 'serialkey',
			dataType: 'string',
			visible: false,
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: 'singleRow',
		extraColumnOrders: ['showRowCheckColumn', 'showRowNumColumn'],
		showRowCheckColumn: false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = () => {
		const formValues = form.getFieldsValue();

		// 거래처 필수 입력 검증
		if (commUtil.isEmpty(formValues.custCode)) {
			showAlert(null, t('msg.MSG_COM_VAL_001', ['거래처']));
			return;
		}

		gridRef.current?.clearGridData();
		const dateRange = formValues.dateRange || [];
		const params = {
			custCode: formValues.custCode || '',
			fromDate: dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : '',
			toDate: dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : '',
			startRow: 0,
			listCount: 100,
		};

		apiGetCustDlvInfoHis(params).then(res => {
			if (res.statusCode === 0) {
				setPopupList(res.data.list || []);
				setTotalCount(res.data.totalCount || 0);
				gridRef.current?.setGridData(res.data.list || []);
			}
		});
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({
			custCode: '',
			dateRange: [dayjs().subtract(1, 'day'), dayjs()],
		});
		gridRef.current?.clearGridData();
		setPopupList([]);
		setTotalCount(0);
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		searchYn: onClickSearchButton,
		refresh: onClickRefreshButton,
	};

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current?.getSelectedRows();
		callBack?.(selectedRow);
	};

	/**
	 * 확인 버튼 클릭 시
	 */
	const checkRowData = () => {
		const selectedRow = gridRef.current?.getSelectedRows();
		if (!selectedRow || selectedRow.length === 0) {
			return;
		}
		callBack?.(selectedRow);
	};

	/**
	 * 확정 버튼 클릭 처리
	 * @param {number} rowIndex 행 인덱스
	 * @param {any} item 행 데이터
	 */
	const handleConfirmClick = (rowIndex: number, item: any) => {
		const currentTime = dayjs().format('YYYYMMDDHHmmss');
		// 확정 버튼 클릭 시 확정시간을 현재 시간으로 변경
		gridRef.current.setCellValue(rowIndex, 'confirmdate', currentTime);
		// 확정 버튼 클릭 시 상태를 '01'로 변경
		gridRef.current.setCellValue(rowIndex, 'status', '01');

		const updatedItem = {
			// 기존 데이터
			...item,
			confirmdate: currentTime,
			status: '01',
			serialkeyHis: item.serialkey,
			/**
			 * 부모 화면과 불일치 또는 추가적으로 필요한 변수 맵핑
			 */
			// 거래처배송지정보 영역 시작
			truthcustkey: item.custkey, // 실착지관리거래처코드
			truthcustname: item.custname, // 실착지 관리 거래처명
			// truthaddress1: item.arrivaladdress1, // 실착지 주소
			// truthaddress2: item.arrivaldetailaddress, // 실착지 상세 주소
			// 거래처배송지정보 영역 끝

			// 배송메모/알림/검수정보 시작
			keytype2: item.keytype, // 출입KEY정보
			// 배송메모/알림/검수정보 끝

			// 배송유형정보 영역 시작
			// 배송유형정보 영역 끝
		};
		showAlert(null, '확정되었습니다. 화면에서 수정 후 최종 저장하시기 바랍니다.');
		callBack?.(updatedItem);
		close?.();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	useEffect(() => {
		onClickSearchButton();
		if (gridRef.current) {
			// 셀 클릭 이벤트 - 확정 버튼 처리
			gridRef.current.bind('cellClick', (event: any) => {
				// 확정 컬럼이 아니면 무시
				if (event.dataField !== 'status') return;

				const target = event.orgEvent.target as HTMLElement;

				// 확정 버튼 클릭인지 확인 (특별한 클래스로 구분)
				if (target.classList.contains('confirm-action-btn')) {
					handleConfirmClick(event.rowIndex, event.item);
				}
				// 텍스트 클릭은 무시
			});

			// 더블클릭 이벤트
			// gridRef.current.bind('cellDoubleClick', function () {
			// 	selectRowData();
			// });
		}
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="고객배송조건 수신이력" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<InputText
								label={t('lbl.CUST')}
								// label={t('lbl.VENDORCODENAME')}
								required
								name="custCode"
								placeholder={t('msg.placeholder2', ['거래처 코드'])}
								onPressEnter={onClickSearchButton}
								disabled={!!custKey}
							/>
						</li>
						<li>
							<Rangepicker name="dateRange" label="수신기간" format="YYYY-MM-DD" allowClear />
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount || 0)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
				{/* <Button type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button> */}
			</ButtonWrap>
		</>
	);
};

export default MsCustDlvInfoHisPopup;
