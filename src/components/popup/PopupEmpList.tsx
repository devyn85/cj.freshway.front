/*
 ############################################################################
 # FiledataField	: PopupEmpList.tsx
 # Description		: 사원 조회 팝업
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button, Form, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PageGridBtn from '@/components/common/PageGridBtn';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { InputText, SearchForm } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

interface PropsType {
	callBack?: any;
	searchParam?: string;
	searchName?: string;
	gridData?: Array<object>;
	search?: any;
}

const PopupEmpList = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, searchName, gridData, search } = props;
	const { t } = useTranslation();

	const [form] = Form.useForm();
	const [searchBox] = useState({
		userNm: '',
	});

	const gridRef = useRef(null);

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			// 사원명
			headerText: t('com.col.userNm'),
			dataField: 'userNm',
			align: 'center',
		},
		{
			// 사용자ID
			headerText: t('com.col.userId'),
			dataField: 'userId',
			align: 'center',
		},
		{
			// 사원번호
			headerText: t('com.col.empNo'),
			dataField: 'empNo',
			align: 'center',
		},
		{
			// 이메일
			headerText: t('com.col.mailAddr'),
			dataField: 'mailAddr',
			align: 'center',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: 'singleRow' as const,
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
		search(true, searchBox.userNm);
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		searchYn: onClickSearchButton,
	};

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		callBack(selectedRow[0]);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		form.setFieldValue('userNm', searchName);
	}, [searchName]);

	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', function () {
			selectRowData();
		});
	});

	useEffect(() => {
		gridRef.current.setGridData(gridData);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle name="사원" authority="searchYn" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				<Row>
					<InputText
						label={t('sysmgt.users.user.userNm')}
						name="userNm"
						span={12}
						placeholder={t('msg.placeholder2', [t('sysmgt.users.user.userNm')])}
						onPressEnter={onClickSearchButton}
					/>
				</Row>
			</SearchForm>

			{/* 그리드 영역 */}
			<AGrid>
				<PageGridBtn />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button type="primary" onClick={selectRowData}>
					{t('com.btn.select')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default PopupEmpList;
