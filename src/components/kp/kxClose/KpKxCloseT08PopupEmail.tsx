/*
 ############################################################################
 # FiledataField	: KpKxCloseT08PopupEmail.tsx
 # Description		: KX 실적 미수신 이메일 전송 팝업
 # Author			: 
 # Since			: 26.02.11
 # 
 # 기능:
 # - EMAILSENDER 공통코드 조회로 송신자 정보 자동 세팅
 # - 메일 제목, 송신자, 참조, 내용 입력
 # - 수신자 그리드: 수신자명, 수신 이메일 (행 추가/삭제 가능)
 # - 상세내역 그리드: KX 실적 미수신 내역 표시
 # - 내용 자동완성: 현재 로그인 사용자명과 기본 메시지 포함
 # - 이메일 전송: apiSaveEmail API 호출
 # 
 # 데이터 흐름:
 # 1. 부모에서 선택된 행의 수신자/상세 데이터 전달
 # 2. 폼에 기본값 및 EMAILSENDER 공통코드 값 세팅
 # 3. 사용자가 내용 수정 가능
 # 4. 확인 후 apiSaveEmail 호출
 # 5. 성공 시 processCnt 건수 표시 및 부모 search() 호출
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { Button, Form } from 'antd';
import { useEffect, useRef } from 'react';

// API
import { apiSaveEmail } from '@/api/kp/apiKpKxClose';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import GridTopBtn from '@/components/common/GridTopBtn';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText, InputTextArea } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { t } from 'i18next';

interface PropsType {
	close?: () => void;
	defaultValues?: {
		title?: string;
		sendEmail?: string;
		refEmailAdd?: string;
		conts?: string;
	};
	receiverData?: any[];
	detailData?: any[];
}
const KpKxCloseT08PopupEmail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const [form] = Form.useForm();

	// Declare react Ref(2/4)
	const receiverGridRef = useRef<any>(null);
	const detailGridRef = useRef<any>(null);

	// Declare init value(3/4)

	// 기타(4/4)

	// 그리드 컬럼 정의
	const gridCol = [
		{ dataField: 'rcvrNm', headerText: t('수신자명'), width: 120, dataType: 'text' }, // 수신자명
		{ dataField: 'rcvrEmail', headerText: t('수신자이메일'), width: 240, dataType: 'text' }, // 수신자이메일
	];

	// 그리드 컬럼 정의
	const gridCol1 = [
		{ dataField: 'doctype', headerText: t('lbl.DOCGUBUN'), width: 80, dataType: 'text', cellMerge: true }, // 문서구분
		{ dataField: 'deliverydate', headerText: t('lbl.DOCDT_PLT'), width: 90, dataType: 'date', cellMerge: true }, // 배송일자
		{ dataField: 'docno', headerText: t('lbl.DOCNO'), width: 90, dataType: 'text', cellMerge: true }, // 문서번호
		{ dataField: 'docline', headerText: t('lbl.DOCLINE'), width: 80, dataType: 'text' }, // 문서라인
		{ dataField: 'sku', headerText: t('lbl.SKU'), width: 80, dataType: 'text' }, // SKU코드
		{ dataField: 'openqty', headerText: t('lbl.OPENQTY'), width: 80, dataType: 'numeric', formatString: '#,##0.##' }, // 지시수량
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY'),
			width: 90,
			dataType: 'numeric',
			formatString: '#,##0.##',
		}, // 확정수량
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 80, dataType: 'text' }, // 조직코드
		{ dataField: 'etcTxt', headerText: t('lbl.MEMO1'), width: 120, dataType: 'text' }, // 메모
		{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), width: 90, dataType: 'date' }, // 등록일자
		// { dataField: 'rcvrEmail', headerText: '수신자이메일', width: 140, dataType: 'text' }, // 수신자이메일
		// { dataField: 'rcvrNm', headerText: t('lbl.RCVRNM'), width: 100, dataType: 'text' }, // 수신자명
	];

	const gridProps = {
		editable: true,
		showCustomRowCheckColumn: true,
	};

	const gridProps1 = {
		editable: false,
		enableCellMerge: true,
	};

	const defaultFormValues = {
		title: '[WMS]KX미처리건 공유드립니다.',
		sendEmail: '',
		refEmailAdd: '',
		conts:
			'안녕하세요.식품IT)영업물류파트 김인호입니다.\n\nKX미처리건 공유드립니다.\n업체에서 처리하도록 요청 부탁드립니다.\n\n',
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	// 수신자 그리드 행 추가
	const addReceiverRow = () => {
		receiverGridRef.current?.addRow({
			rcvrNm: '',
			rcvrEmail: '',
		});
	};

	// 수신자 그리드 행 삭제
	const deleteReceiverRow = () => {
		const gridRef = receiverGridRef.current;
		const checkedRows = gridRef?.getCheckedRowItems?.() ?? [];

		if (checkedRows.length === 0) {
			showAlert(null, '삭제할 행을 선택해 주세요.');
			return;
		}

		checkedRows.forEach((row: any) => {
			const item = row.item ?? row;
			if (item?._$uid) {
				gridRef.removeRowByRowId(item._$uid);
			}
		});
	};

	// 전송 버튼 클릭
	/**
	 * 이메일 전송 처리 함수
	 *
	 * 설명:
	 * 1. 폼 유효성 검증
	 * 2. 메일 제목, 송신자, 내용 및 수신자/상세내역 그리드 데이터 수집
	 * 3. 사용자 확인 팝업 표시
	 * 4. 확인 후 API를 통해 이메일 전송
	 *
	 * params 구조:
	 * - title: 메일 제목
	 * - sendEmail: 송신 이메일 (코드값)
	 * - sendName: 송신자명 (숨김 필드)
	 * - refEmailAdd: 참조 이메일
	 * - conts: 메일 내용
	 * - receiversList: 수신자 그리드 데이터 배열
	 * - detailList: 상세내역 그리드 데이터 배열
	 *
	 * 응답 처리:
	 * - statusCode === 0 (성공): processCnt 건수 표시 및 부모 search() 호출로 데이터 새로고침
	 * - 그 외: API 응답의 에러 메시지 처리
	 */
	const handleSend = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// 저장하시겠습니까? - 이메일 전송
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				...form.getFieldsValue(),
				receiversList: receiverGridRef.current?.getGridData?.() ?? [],
				detailList: detailGridRef.current?.getGridData?.() ?? [],
			};

			apiSaveEmail(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, `${res.data?.processCnt || 0}건 처리되었습니다`);
					props.search();
				}
			});
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		/**
		 * 화면 로드 시 EMAILSENDER 공통코드 조회 및 폼 초기화
		 *
		 * 설명:
		 * 팝업이 처음 노출될 때 공통코드 'EMAILSENDER'를 조회하여
		 * 송신자 이메일과 송신자명을 자동으로 세팅합니다.
		 *
		 * 공통코드 구조:
		 * - comCd: 이메일 주소 (예: admin@company.com)
		 * - cdNm: 송신자명 (예: 식품IT)영업물류파트)
		 *
		 * 폼 필드 매핑:
		 * - sendEmail: 공통코드의 comCd 값
		 * - sendName: 공통코드의 cdNm 값 (숨김 필드)
		 * - refEmailAdd: 참조 이메일 (sendEmail과 동일 값)
		 *
		 * props.defaultValues가 있으면 해당 값으로 덮어쓰기
		 */
		const emailSenderCode = getCommonCodeList('EMAILSENDER');
		const emailSender = emailSenderCode?.[0] ?? {};

		form.setFieldsValue({
			...defaultFormValues,
			sendEmail: emailSender?.comCd || '',
			sendName: emailSender?.cdNm || '',
			refEmailAdd: emailSender?.comCd || '',
			...(props.defaultValues ?? {}),
		});
	}, []);

	useEffect(() => {
		const gridRef = receiverGridRef.current;
		if (gridRef) {
			const data = props.receiverData ?? [];
			gridRef.setGridData(data);
			if (data.length > 0) {
				gridRef.setColumnSizeList(gridRef.getFitColumnSizeList(true));
			}
		}
	}, [props.receiverData]);

	useEffect(() => {
		const gridRef = detailGridRef.current;
		if (gridRef) {
			const data = props.detailData ?? [];
			gridRef.setGridData(data);
			if (data.length > 0) {
				gridRef.setColumnSizeList(gridRef.getFitColumnSizeList(true));
			}
		}
	}, [props.detailData]);

	return (
		<>
			<PopupMenuTitle name="KX실적미수신 이메일 전송" showButtons={false} />

			<Form form={form}>
				<AGrid>
					<UiDetailViewArea>
						<UiDetailViewGroup>
							<li className="col-1">
								<InputText name="title" label={t('lbl.TITLE')} required />
							</li>
							<li className="col-1">
								<InputText name="sendEmail" label="송신" />
								<Form.Item name="sendName" hidden>
									<InputText />
								</Form.Item>
							</li>
							<li className="col-1">
								<Form.Item label="수신" colon>
									<div style={{ display: 'flex', gap: 8, width: '100%' }}>
										<div style={{ flex: 1, height: 120 }}>
											<AUIGrid ref={receiverGridRef} columnLayout={gridCol} gridProps={gridProps} />
										</div>
										<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
											{/* 수신자 행추가 버튼
											 * 설명: 수신자 그리드에 빈 행(rcvrNm, rcvrEmail)을 추가합니다.
											 * 사용자가 새로운 수신자 정보를 입력할 수 있도록 합니다.
											 */}
											<Button size="small" onClick={addReceiverRow}>
												행추가
											</Button>
											{/* 수신자 행삭제 버튼
											 * 설명: 체크박스로 선택된 수신자 행을 삭제합니다.
											 * 선택된 행이 없으면 경고 메시지를 표시합니다.
											 * 삭제 전 행의 _$uid(내부 고유 ID)를 확인합니다.
											 */}
											<Button size="small" onClick={deleteReceiverRow}>
												행삭제
											</Button>
										</div>
									</div>
								</Form.Item>
							</li>
							<li className="col-1">
								<InputText name="refEmailAdd" label="참조" readOnly />
							</li>
							<li className="col-1">
								<InputTextArea name="conts" label="CONTENT" autoSize={{ minRows: 4, maxRows: 8 }} />
							</li>
						</UiDetailViewGroup>
					</UiDetailViewArea>
				</AGrid>
			</Form>

			<AGrid>
				<GridTopBtn gridTitle="KX 실적 미수신내역" totalCnt={(props.detailData ?? []).length} />
				<AUIGrid ref={detailGridRef} columnLayout={gridCol1} gridProps={gridProps1} />
			</AGrid>

			<ButtonWrap data-props="single">
				{/* 닫기 버튼
				 * 설명: 팝업 창을 닫습니다.
				 * 부모 컴포넌트에서 전달된 props.close() 함수를 호출합니다.
				 * 입력된 데이터는 저장되지 않습니다.
				 */}
				<Button onClick={props.close}>닫기</Button>

				{/* 전송 버튼
				 * 설명: 이메일을 전송합니다.
				 * 처리 순서:
				 * 1. 폼 유효성 검증 (validateForm)
				 * 2. 현재 폼 값 및 그리드 데이터 수집
				 * 3. 사용자 확인 다이얼로그 표시 (showConfirm)
				 * 4. 확인 후 apiSaveEmail API 호출
				 * 5. 성공 시 처리 건수 표시 및 부모 search() 호출로 데이터 새로고침
				 *
				 * 전송되는 데이터:
				 * - title: 메일 제목
				 * - sendEmail: 송신자 이메일
				 * - sendName: 송신자명 (숨김 필드)
				 * - refEmailAdd: 참조 이메일
				 * - conts: 메일 내용
				 * - receiversList: 수신자 그리드 데이터
				 * - detailList: 상세내역 그리드 데이터
				 */}
				<Button type="primary" onClick={handleSend}>
					전송
				</Button>
			</ButtonWrap>
		</>
	);
});
export default KpKxCloseT08PopupEmail;
