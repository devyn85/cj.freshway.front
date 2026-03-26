/*
 ############################################################################
 # FiledataField	: WdShipmentExDCCarrierPricePopup.tsx
 # Description		: 운송비 단가 조회 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.11.11
 ############################################################################
 */

// CSS

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { useEffect } from 'react';

// Type

// Utils

// Store

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API
import { apiPostCarrierPriceList } from '@/api/wd/apiWdShipmentExDC';

interface PropsType {
	closeEventHandler?: any;
	callBack?: any;
	fromSlipdt?: any;
	toSlipdt?: any;
	sendData: any;
}

const WdShipmentExDCCarrierPricePopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// 그리드 Ref
	const gridRef = useRef(null);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'courierNm',
			headerText: t('lbl.CARRIER'), //운송사
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tonNm',
			headerText: t('lbl.TON_GRADE'), //톤급
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetypeNm',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'price',
			headerText: t('lbl.UNITPRICE'), //단가
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'routeId', //노선 아이디
			visible: false,
		},
		{
			dataField: 'tcrSerialkey', //노선데이터번호
			visible: false,
		},
		{
			dataField: 'courier', //운송사
			visible: false,
		},
		{
			dataField: 'ton', //톤급
			visible: false,
		},
		{
			dataField: 'storagetype', //저장조건
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const handleClose = () => {
		props.closeEventHandler();
	};

	/**
	 * 목록 조회
	 */
	const searchPriceList = () => {
		if (props.sendData && props.sendData.length > 0) {
			// 조회용 파라미터
			const dccode = props.sendData[0].dccode;
			const organize = props.sendData[0].organize;
			const toCustkey = props.sendData[0].toCustkey;
			const storagetype = props.sendData[0].storagetype;
			let fromdt = props.sendData[0].docdt;
			let todt = props.sendData[0].docdt;

			for (const item of props.sendData) {
				if (item.docdt < fromdt) {
					fromdt = item.docdt;
				}
				if (item.docdt > todt) {
					todt = item.docdt;
				}
			}

			const params = {
				dccode: dccode,
				organize: organize,
				toCustkey: toCustkey,
				storagetype: storagetype,
				fromdt: fromdt,
				todt: todt,
			};

			// 그리드 초기화
			gridRef?.current.clearGridData();

			// API 호출
			apiPostCarrierPriceList(params).then(res => {
				gridRef.current.setGridData(res.data);

				if (res.data.length > 0) {
					// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
					// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
					const colSizeList = gridRef.current.getFitColumnSizeList(true);
					// 구해진 칼럼 사이즈를 적용 시킴.
					gridRef.current.setColumnSizeList(colSizeList);
				}
			});
		}
	};

	/**
	 * 확인 버튼 클릭 이벤트
	 */
	const saveMasterList = async () => {
		// 배부할 운송료 금액 합산
		const allRows: any[] = gridRef.current.getCheckedRowItemsAll();

		if (!allRows || allRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		props.callBack(allRows);
		props.closeEventHandler();
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 로딩 시 자동 조회 실행
	 */
	useEffect(() => {
		searchPriceList();
	});

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="운임단가" func={titleFunc} />

			{/* 화면 상세 영역 정의 */}
			<Form form={form}>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</Form>

			{/* 버튼 영역 정의 */}
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={handleClose}>
					취소
				</Button>
				<Button size={'middle'} onClick={saveMasterList} type="primary">
					확인
				</Button>
			</ButtonWrap>
		</>
	);
};

export default WdShipmentExDCCarrierPricePopup;
