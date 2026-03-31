/*
 ############################################################################
 # FiledataField	: OmUserSelectPopup.tsx
 # Description		: 주문 > 센터간STO > 담당자검색팝업
 # Author			: LeeJeongCheol
 # Since			: 26.03.25
 ############################################################################
*/
// lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReact';
// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import { Button, Form } from 'antd';

// API Call Function
import { apiGetAllUserPopupList } from '@/api/cm/apiCmSearch';

interface OmUserSelectPopupProps {
	callBack?: (rows: any[]) => void;
	close?: () => void;
}

const OmUserSelectPopup = forwardRef(({ callBack, close }: OmUserSelectPopupProps, ref: any) => {
	const { t } = useTranslation();

	const gridRef = useRef<any>(null);
	const [form] = Form.useForm();

	const [list, setList] = useState<any[]>([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// =========================
	// 초기 검색조건
	// =========================
	const searchBox = {
		userNm: '',
		delYn: 'N',
	};

	const gridProps = {
		showRowCheckColumn: true,
		rowCheckToRadio: true, // 단일 선택
		enableFilter: true,
		fillColumnSizeMode: true,
	};

	const gridCol = [
		{
			dataField: 'userId',
			headerText: '사번',
			width: 120,
		},
		{
			dataField: 'userNm',
			headerText: '사원명',
			style: 'aui-center',
		},
		{
			dataField: 'mailId',
			headerText: '이메일',
		},
		{
			dataField: 'deptNm',
			headerText: '부서',
		},
	];

	useEffect(() => {
		gridRef.current?.bind('cellDoubleClick', onCellDoubleClick);
	}, []);

	const onClickSearch = () => {
		const params = {
			...form.getFieldsValue(),
			startRow: 0,
			listCount: 100,
		};

		apiGetAllUserPopupList(params).then(res => {
			if (res.statusCode === 0) {
				setList(res.data || []);
				setTotalCnt(res.data?.length || 0);

				gridRef.current?.setGridData(res.data || []);
			}
		});
	};

	const onCellDoubleClick = (event: any) => {
		const row = gridRef.current.getItemByRowIndex(event.rowIndex);
		if (!row) return;

		callBack?.([row.item]);
		close?.();
	};

	const onConfirm = () => {
		const selected = gridRef.current?.getCheckedRowItems() || [];

		if (selected.length === 0) {
			showMessage({ content: '선택된 사원이 없습니다.' });
			return;
		}

		callBack?.(selected.map((item: any) => item.item)); // ✅ 이미 잘됨
		close?.();
	};

	return (
		<>
			<PopupMenuTitle name="사원 선택" func={{ searchYn: onClickSearch }} />

			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<InputText name="userNm" label="사원명" onPressEnter={onClickSearch} />
						</li>
						<li>
							<SelectBox
								name="delYn"
								label="사용여부"
								options={[
									{ cdNm: '전체', comCd: '' },
									{ cdNm: '사용', comCd: 'N' },
									{ cdNm: '미사용', comCd: 'Y' },
								]}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<AGrid>
				<GridTopBtn gridTitle="사원 목록" totalCnt={totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>닫기</Button>
				<Button type="primary" onClick={onConfirm}>
					확인
				</Button>
			</ButtonWrap>
		</>
	);
});

export default OmUserSelectPopup;
