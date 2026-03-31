/*
 ############################################################################
 # FiledataField	: BbsAdminMng.tsx
 # Description		: 공지사항
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// utils
import commUtil from '@/util/commUtil';
import dataRegex from '@/util/dataRegex';
import { showAlert } from '@/util/MessageUtil';
// component
import FormWrap from '@/assets/styled/FormWrap/FormWrap';
import MenuTitle from '@/components/common/custom/MenuTitle';
// API Call Function
import { apiGetFindIdSearch } from '@/api/common/apiCommon';

type ItemProps = {
	label: string;
	value: string;
};
type apiProps = {
	userId: string;
};

const PopupFindId = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [findIdList, setFindIdList] = useState([]);
	const [data, setData] = useState({
		name: '',
		email: '',
		findResult: '',
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 * @param {object} e 변경 이벤트
	 * @returns {void}
	 */
	//input에 입력될 때마다 state값 변경되게 하는 함수
	const onChangeParam = (e: any) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};
	// 입력 값 검증
	// const checkValidation = (data: { name: string; email: string }) => {
	const checkValidation = (data: any) => {
		const { name, email } = data;
		// id check
		if (commUtil.isEmpty(name)) {
			showAlert('', t('com.msg.errFindNm'), false);
			return false;
		}

		// email
		if (commUtil.isEmpty(email)) {
			showAlert('', t('com.msg.errFindEmail'), false);
			return false;
		}
		// email 규칙
		if (!dataRegex.validEmail(email)) {
			showAlert('', t('com.msg.wrongEmail'), false);
			return false;
		}
		return true;
	};
	// 조회
	const onClickSearchButton = () => {
		// validation
		if (!checkValidation(data)) {
			return;
		}

		// api
		const params = { ...data };
		const options: ItemProps[] = [];
		apiGetFindIdSearch(params).then(res => {
			if (commUtil.isEmpty(res.data)) {
				options.push({
					label: t('login.findIdPopup.noData'),
					value: t('login.findIdPopup.noData'),
				});
				setFindIdList(options);
				setData(data => {
					data.findResult = t('login.findIdPopup.noData');
					return { ...data };
				});
			} else {
				setData(data => {
					data.findResult = res.data[0].userId;
					return { ...data };
				});
				res.data.forEach((item: apiProps) => {
					options.push({
						label: item.userId,
						value: item.userId,
					});
				});
				setFindIdList(options);
			}
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		form.setFieldsValue(data);
	}, [data]);

	return (
		<>
			<MenuTitle name={t('login.findId')} />
			<FormWrap form={form}>
				<Row>
					<Col span={24}>
						{/* email */}
						<Form.Item label={t('login.findIdPopup.name')} name="name">
							<Input
								placeholder={t('msg.placeholder2', [t('login.findIdPopup.name')])}
								name="name"
								onChange={onChangeParam}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						{/* 이메일 */}
						<Form.Item label={t('login.findIdPopup.email')}>
							<Input
								placeholder={t('msg.placeholder2', [t('login.findIdPopup.email')])}
								name="email"
								onChange={onChangeParam}
							/>
							<Button onClick={onClickSearchButton}>조회</Button>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						{/* 조회결과 */}
						<Form.Item label={t('login.findIdPopup.result')} name="findResult">
							<Select placeholder={t('login.findIdPopup.result')} options={findIdList}></Select>
						</Form.Item>
					</Col>
				</Row>
			</FormWrap>
		</>
	);
};

export default PopupFindId;
