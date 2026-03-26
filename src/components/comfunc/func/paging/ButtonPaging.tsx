/*
 ############################################################################
 # FiledataField	: ButtonPaging.tsx
 # Description		: 버튼 페이징
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

import { Col, Pagination, Row, Flex } from 'antd';

import PageGridBtn from '@/components/common/PageGridBtn';
import { SelectBox } from '@/components/common/custom/form';

interface Props {
	data?: any;
	setData?: any;
	search?: any;
	setCurrentPage?: any;
	totalPage?: any;
	pageSize?: any;
}

const ButtonPaging = (props: Props) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, search, setCurrentPage, totalPage, pageSize } = props;
	//다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);

	const gridCol = [
		{
			dataField: 'exnNo',
			headerText: t('sysmgt.exclog.grid.exnNo'), // 일련번호
		},
		{
			dataField: 'excptCnts',
			headerText: t('sysmgt.exclog.grid.excptCnts'), // 예외내용
		},
		{
			dataField: 'occrDy',
			headerText: t('sysmgt.exclog.grid.occrDy'), // 발생일자
		},
		{
			dataField: 'clntAddr',
			headerText: t('sysmgt.exclog.grid.clntAddr'), // 클라이언트주소
		},
		{
			dataField: 'svrAddr',
			headerText: t('sysmgt.exclog.grid.svrAddr'), // 서버주소
		},
		{
			dataField: 'callUri',
			headerText: t('sysmgt.exclog.grid.callUri'), // 호출URL
		},
	];

	const gridProps = {
		editable: false,
		showRowNumColumn: false,
	};

	const gridBtn = {
		isAddBtn1: true,
		addLabel1: t('com.btn.search'),
		addFunction1: function () {
			search();
		},
	};
	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		gridRef.current.setGridData(data);
	}, [data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} gridTitle={t('sysmgt.exclog.title')} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<Row className="sp-my-2 flex-align-just">
				<Col span={8}>
					<SelectBox
						span={8}
						name="userId"
						defaultValue="100"
						//label={t('sysmgt.exclog.search.userId')}
						//placeholder={t('msg.placeholder2', [t('sysmgt.roles.group.authority')])}
						options={[{ cdNm: '100', comCd: '200' }]}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</Col>
				<Col span={8} className="">
					<Pagination
						//style={{ background: '#BD34FE' }}
						simple
						total={totalPage}
						pageSize={pageSize}
						showSizeChanger={false}
						onChange={page => {
							setCurrentPage(page);
						}}
					></Pagination>
				</Col>
				<Col span={8} className="flex-just-end">
					<div className="total">
						전체 100건 중 <strong>1~10</strong>
					</div>
				</Col>
			</Row>
		</>
	);
};

export default ButtonPaging;
