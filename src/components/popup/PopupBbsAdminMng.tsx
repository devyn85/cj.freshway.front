/*
 ############################################################################
 # FiledataField	: PopupBbsAdminMng.tsx
 # Description		: 공지사항 팝업
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
// utils
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import commUtil from '@/util/commUtil';
import dataTransform from '@/util/dataTransform';
import dateUtil from '@/util/dateUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import FormWrap from '@/assets/styled/FormWrap/FormWrap';
import CustomModal from '@/components/common/custom/CustomModal';
import { DateRange, InputText, InputTextArea, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import PopupFileUploader from '@/components/popup/PopupFileUploader';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// API Call Function
import { apiGetBbsAttchFileList, apiGetBbsDetail, apiPostRemoveBbs, apiPostSaveBbs } from '@/api/common/apiComfunc';

// 넘겨받은 Props 타입 정의
type modalProps = {
	bbsSeq?: string;
	isAdmin?: boolean;
	close?: any;
};

const PopupBbsAdminMng = (props: modalProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// props
	const { bbsSeq, isAdmin = false, close } = props;
	// 다국어
	const { t } = useTranslation();

	// store
	const userInfo = useAppSelector(state => state.user.userInfo);

	// ref
	const gridRef = useRef(null);
	const refModal = useRef(null);

	// variable
	const gridId = uuidv4() + '_gridWrap';
	const today = dateUtil.getToDay('YYYYMMDD');
	const [form] = Form.useForm();
	const [formParam, setFormParam] = useState({
		bbsSeq: bbsSeq,
		bbsScpCd: '1',
		bbsTpCd: null,
		fromDt: dayjs(today),
		thruDt: dayjs(dateUtil.addMonths(today, 1, 'YYYYMMDD')),
		regrNm: '',
		regrDtm: today,
		bbsTitle: '',
		bbsNote: '',
		attchFileGrpNo: '',
		vwYn: '0',
		popYn: '0',
		topYn: '0',
	});

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('comfunc.filepage.grid.attchFileNm'),
			dataField: 'attchFileNm',
			align: 'left',
		},
		{
			headerText: t('comfunc.filepage.grid.attchFileSz'),
			dataField: 'attchFileSz',
			align: 'left',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 *
	 */
	async function onClickSaveButton() {
		const param = dataTransform.convertSearchData(formParam);
		if (commUtil.isEmpty(param.bbsTitle)) {
			showAlert(null, t('validation.required', [t('comfunc.bbs.grid.bbsTitle')]));
			return;
		}
		if (commUtil.isEmpty(param.bbsNote)) {
			showAlert(null, t('validation.required', [t('comfunc.bbs.grid.bbsNote')]));
			return;
		}
		if (commUtil.isEmpty(param.bbsTpCd)) {
			showAlert(null, t('validation.required', [t('comfunc.bbs.grid.bbsTpCd')]));
			return;
		}
		if (commUtil.isEmpty(param.fromDt) || commUtil.isEmpty(param.thruDt)) {
			showAlert(null, t('validation.required', [t('comfunc.bbs.search.daterange')]));
			return;
		}

		const fromDt = form.getFieldValue('fromDt');
		const thruDt = form.getFieldValue('thruDt');
		if (dateUtil.isAfter(fromDt, thruDt)) {
			showAlert(null, '게시 종료일이 게시 시작일보다 빠를 수 없습니다');
			return;
		}

		// param.fromDt = fromDt.format('YYYYMMDD');
		// param.thruDt = thruDt.format('YYYYMMDD');
		// TO-DO 날짜 변환

		//저장하시겠습니까
		showConfirm(null, t('com.msg.confirmSave'), () => {
			apiPostSaveBbs(param).then(() => {
				close();
			});
		});
	}

	// 공지사항 번호가 있을 시 상세조회
	/**
	 *
	 */
	function searchBbsDetail() {
		if (commUtil.isEmpty(bbsSeq)) return;

		apiGetBbsDetail({ bbsSeq: bbsSeq }).then(res => {
			if (!res.data || res.data.length == 0) {
				return;
			}
			setFormParam({ ...res.data[0], bbsSeq: bbsSeq });
			const values = res.data[0];
			values.thruDt = dateUtil.toDayjs(values.thruDt);
			values.fromDt = dateUtil.toDayjs(values.fromDt);

			form.setFieldsValue(values);
			searchAttchFileList(values.attchFileGrpNo);
		});
		// setIsRender(true);
	}

	/**
	 * 파일정보 조회
	 * @param {string} attchFileGrpNo 첨부파일 그룹 순번
	 */
	function searchAttchFileList(attchFileGrpNo?: string) {
		attchFileGrpNo = attchFileGrpNo || formParam.attchFileGrpNo;
		if (commUtil.isEmpty(attchFileGrpNo)) return;

		apiGetBbsAttchFileList({ attchFileGrpNo: attchFileGrpNo }).then(res => {
			gridRef.current.setGridData(res.data);
		});
	}

	/**
	 * 파일 업로드 팝업
	 */
	function openFileUploader() {
		refModal.current.handlerOpen();
	}

	const onChangeEvent = (value: string, allValues: any) => {
		setFormParam(formParam => {
			formParam = Object.assign(formParam, allValues);
			return formParam;
		});
	};

	/**
	 * 팝업 콜백
	 * @param {string} grpNo 첨부파일 그룹 순번
	 * @returns {void}
	 */
	const popupCallBack = (grpNo: any) => {
		refModal.current.handlerClose();
		setFormParam({ ...formParam, attchFileGrpNo: grpNo });
		searchAttchFileList(grpNo);
	};

	/**
	 * 삭제 버튼
	 */
	const onClickRemoveButton = () => {
		showConfirm(null, t('com.msg.confirmDelete'), () => {
			apiPostRemoveBbs({
				bbsSeq: bbsSeq,
				userId: userInfo.userId,
			}).then(() => {
				close();
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
		searchBbsDetail();
	}, []);

	return (
		<>
			<MenuTitle name={t('comfunc.bbs.title')}>
				{isAdmin && commUtil.isNotEmpty(bbsSeq) ? (
					<Button onClick={onClickRemoveButton}>{t('com.btn.delete')}</Button>
				) : null}
				{isAdmin ? (
					<Button type="primary" onClick={onClickSaveButton}>
						{t('com.btn.save')}
					</Button>
				) : null}
			</MenuTitle>
			{/* 공지사항 */}
			<FormWrap form={form} preserve={false} initialValues={formParam} onValuesChange={onChangeEvent}>
				<Row>
					<SelectBox
						span={10}
						label={t('comfunc.bbs.grid.bbsTp')}
						required={true}
						name="bbsTpCd"
						options={getCommonCodeList('BBS_TP')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
					/>
					<InputText label={t('comfunc.bbs.grid.regrNm')} name="regrNm" span={7} readOnly={true} />
					<InputText label={t('comfunc.bbs.grid.regDt')} name="regrDtm" span={7} readOnly={true} />
				</Row>
				<Row>
					<DateRange
						label={t('comfunc.bbs.search.daterange')}
						span={10}
						required={true}
						format="YYYY-MM-DD"
						fromName="fromDt"
						toName="thruDt"
					/>
					<SelectBox
						span={7}
						label={t('comfunc.bbs.grid.vwYn')}
						name="vwYn"
						options={[
							{ label: 'Y', value: '1' },
							{
								label: 'N',
								value: '0',
							},
						]}
						placeholder="선택해주세요"
					/>
				</Row>
				<Row>
					<InputText span={24} label={t('comfunc.bbs.grid.bbsTitle')} name="bbsTitle" required={true} />
				</Row>
				<Row>
					<InputTextArea
						label={t('comfunc.bbs.grid.bbsNote')}
						name="bbsNote"
						required={true}
						span={24}
						placeholder="텍스트를 입력해주세요."
						maxLength={100}
						rows={8}
					/>
				</Row>
			</FormWrap>
			<AGrid>
				<div>
					<h3>{t('comfunc.bbs.attch.title')}</h3>
					<div>
						<span>{t('comfunc.bbs.attch.guide')}</span>
						<Button type="primary" onClick={openFileUploader}>
							{t('comfunc.bbs.attch.file')}
						</Button>
					</div>
				</div>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>
			<CustomModal ref={refModal} width="1084px">
				<PopupFileUploader ref={refModal} paramAttchFileGrpNo={formParam.attchFileGrpNo} callBack={popupCallBack} />
			</CustomModal>
		</>
	);
};
export default PopupBbsAdminMng;
