/*
 ############################################################################
 # FiledataField	: PopupUserHistory.tsx
 # Description		: 사용자 접속정보 팝업
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
// component
import TableWrap from '@/assets/styled/TableWrap/TableWrap';
import Title from '@/assets/styled/Title/Title';
// API Call Function
import { apiGetLoginLogOutList } from '@/api/common/apiCommon';

const PopupHistory = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	//다국어
	const { t } = useTranslation();

	const [dataSource, setDataSource] = useState([]);

	const columns = [
		{
			title: 'Login',
			dataIndex: 'loginDt',
			key: 'loginDt',
		},
		{
			title: 'Logout',
			dataIndex: 'lotDt',
			key: 'lotDt',
		},
		{
			title: '접속 IP',
			dataIndex: 'loginIp',
			key: 'loginIp',
		},
		{
			title: '성공여부',
			dataIndex: 'loginSuccYn',
			key: 'loginSuccYn',
		},
	];

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		apiGetLoginLogOutList({}).then(res => {
			setDataSource(dataSource => {
				dataSource = res.data.map((data: object, index: number) => {
					return Object.assign(data, { key: index });
				});
				return dataSource;
			});
		});
	}, []);

	return (
		<>
			<TableWrap data-props="center" style={{ height: '380px' }}>
				<Title>
					<h1>접속이력</h1>
				</Title>
				<Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ y: 300 }} />
			</TableWrap>
		</>
	);
};

export default PopupHistory;
