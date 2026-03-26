/*
 ############################################################################
 # FiledataField	: DetailFilepage.tsx
 # Description		: 파일업로드 상세
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// utils
// component
import { apiGetEaiIamTest } from '@/api/sample/apiSample';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmEdmsImageViewerPopup from '@/components/cm/popup/CmEdmsImageViewerPopup';
import CmImageViewerPopup from '@/components/cm/popup/CmImageViewerPopup';
import CmPdfViewerPopup from '@/components/cm/popup/CmPdfViewerPopup';
import ExtExcelTemplateUploadPopup from '@/components/comfunc/func/filePage/ExtExcelTemplateUploadPopup';
import ExtFaxUploadPopup from '@/components/comfunc/func/filePage/ExtFaxUploadPopup';
import MsCarDriverFileUploadPopup from '@/components/comfunc/func/filePage/MsCarDriverFileUploadPopup';
import MsPlantXslFileUploadPopup from '@/components/comfunc/func/filePage/MsPlantXslFileUploadPopup';
import PageGridBtn from '@/components/common/PageGridBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button, InputText, SearchForm } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useAppSelector } from '@/store/core/coreHook';
import extUtil from '@/util/extUtil';
import { Form } from 'antd';

type GridFileType = {
	type: string;
	pid: string;
	rowIndex: number;
	columnIndex: number;
	text: string;
	item: object;
	dataField: string;
};

const DetailFilepage = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, search } = props;
	// 다국어
	const { t } = useTranslation();

	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const refModalExcelTemplate = useRef(null);
	const refModalFax = useRef(null);
	const refModalImg = useRef(null);
	const refModalEdmsImg = useRef(null);
	const refModalPdf = useRef(null);
	const [form] = Form.useForm();

	const [attchFileGrpNo, setAttchFileGrpNo] = useState(null);
	const [imgFileName, setImgFileName] = useState('경기94아7803_1_20260920.png');
	const fileIdList = [
		'D1E0E2589E0A9CF0DE1568BB12D5B4F69627AE5E493AA1D258025DD3DEB3AEBA',
		'ADE1921627DE62A850ACF2CF9BD980BFF0081B635C3CC55E38E2155070AC4769',
	];

	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기

	const gridDate = [
		{
			BBS_SEQ: '1',
			BBS_SCP: '2',
			BBS_TP: '0000000011',
			BBS_TITLE: '4',
			ATTACH_NAME: '경기94아7803',
			REGR_NM: '6',
			REG_DT: '7',
			ATTCH_FILE_GRP_NO: '8',
		},
		{
			BBS_SEQ: '11',
			BBS_SCP: '22',
			BBS_TP: '0000000012',
			BBS_TITLE: '44',
			ATTACH_NAME: '경기81바5638',
			REGR_NM: '66',
			REG_DT: '77',
			ATTCH_FILE_GRP_NO: '88',
		},
	];

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'BBS_SEQ',
			headerText: t('comfunc.bbs.grid.bbsSeq'), // 게시번호
		},
		{
			dataField: 'BBS_SCP',
			headerText: t('comfunc.bbs.grid.bbsScp'), // 공지대상
		},
		{
			dataField: 'BBS_TP',
			headerText: '전자결재',
			commRenderer: {
				type: 'search',
				iconPosition: '',
				onClick: function () {
					onClickApprovalOpen();
				},
			},
		},
		{
			dataField: 'BBS_TITLE',
			headerText: t('comfunc.bbs.grid.bbsTitle'), // 제목
		},
		{
			dataField: 'ATTACH_NAME',
			headerText: '차량번호',
			commRenderer: {
				type: 'search',
				iconPosition: '',
				onClick: function (event: GridFileType) {
					onClickEdmsFileOpen(event.item);
					// onClickFileUploader(event.item);
				},
			},
		},
		{
			dataField: 'REGR_NM',
			headerText: t('comfunc.bbs.grid.regrNm'), // 게시자
		},
		{
			dataField: 'REG_DT',
			headerText: t('comfunc.bbs.grid.regDt'), // 게시일
		},
		{
			dataField: 'ATTCH_FILE_GRP_NO',
			visible: false,
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
	 * EDMS 파일 보기
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickEdmsFileOpen = (item: any) => {
		const params = {
			aprvflag: '2',
			attrid: '100',
			id: user.userNo,
			pw: user.userNo,
			mode: '1',
			doctype: '1313',
			requestno: item.ATTACH_NAME,
			procflag: '1',
		};
		extUtil.openEdms(params);
	};

	/**
	 * 전자결재용 SSO ID 요청
	 * @returns {void}
	 */
	const onClickEaiIamTest = async () => {
		return apiGetEaiIamTest(null).then(res => {
			if (res.statusCode === 0) {
				return res.data;
			}
		});
	};

	/**
	 * 전자결재 보기
	 * @returns {void}
	 */
	const onClickApprovalOpen = () => {
		const params = {
			formSerial: 'SCM01',
			systemID: 'SCM',
			DATA_KEY1: '20150717',
			DATA_KEY2: '0000000011',
			// OTU_ID: result,
		};
		extUtil.openApproval(params);
		// onClickEaiIamTest().then((result: any) => {
		// 	const params = {
		// 		formSerial: 'SCM01',
		// 		systemID: 'SCM',
		// 		DATA_KEY1: '20150717',
		// 		DATA_KEY2: '0000000011',
		// 		OTU_ID: result,
		// 	};
		// 	extUtil.openApproval(params);
		// });
	};

	/**
	 * 셀 클릭 파일 업로드
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickFileUploader = (item: any) => {
		refModal.current.handlerOpen();
		setAttchFileGrpNo(item.ATTCH_FILE_GRP_NO);
		return;
	};

	/**
	 * 셀 클릭 파일 업로드
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickFileUploader2 = (item: any) => {
		refModal2.current.handlerOpen();
	};

	/**
	 * 엑셀양식 파일 업로드
	 * @returns {void}
	 */
	const onClickExcelTemplateFileUploader = () => {
		refModalExcelTemplate.current.handlerOpen();
	};

	/**
	 * Fax 파일 업로드
	 * @returns {void}
	 */
	const onClickFaxFileUploader = () => {
		refModalFax.current.handlerOpen();
	};

	/**
	 * 이미지 팝업
	 * @returns {void}
	 */
	const onClickImgPopup = () => {
		refModalImg.current.handlerOpen();
	};

	/**
	 * EDMS 이미지 팝업
	 * @returns {void}
	 */
	const onClickEdmsImgPopup = () => {
		refModalEdmsImg.current.handlerOpen();
	};

	/**
	 * PDF 팝업
	 * @returns {void}
	 */
	const onClickPdfPopup = () => {
		refModalPdf.current.handlerOpen();
	};

	/**
	 * 팝업 콜백
	 * @returns {void}
	 */
	const popupCallBack = () => {
		refModal.current.handlerClose();
		refModal2.current.handlerClose();
		refModalExcelTemplate.current.handlerClose();
		refModalFax.current.handlerClose();
		refModalImg.current.handlerClose();
		// search();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		ref.current.setGridData(gridDate);
	}, [gridDate]);

	return (
		<>
			{/* 그리드 */}
			<SearchForm form={form} initialValues={{ fileName: '경기94아7803_1_20260920.png' }}>
				<AGrid dataProps={'row-pull'}>
					<PageGridBtn>
						<Button onClick={onClickExcelTemplateFileUploader}>엑셀양식 파일업로드</Button>
						<Button onClick={onClickFaxFileUploader}>FAX 파일업로드</Button>
						<Button onClick={onClickFileUploader}>차량정보 파일업로드</Button>
						<Button onClick={onClickFileUploader2}>저장위치정보 파일업로드</Button>
						<InputText
							name="fileName"
							label="이미지 파일명"
							value={imgFileName}
							onChange={(e: any) => {
								setImgFileName(e.target.value);
							}}
						/>
						<Button onClick={onClickImgPopup}>이미지 팝업</Button>
						<Button onClick={onClickEdmsImgPopup}>EDMS 이미지 팝업</Button>
						<Button onClick={onClickPdfPopup}>PDF 팝업</Button>
					</PageGridBtn>
					<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				{/* 엑셀양식 파일업로드 */}
				<CustomModal ref={refModalExcelTemplate} width="1084px">
					<ExtExcelTemplateUploadPopup ref={refModalExcelTemplate} callBack={popupCallBack} />
				</CustomModal>
				{/* Fax 파일업로드 */}
				<CustomModal ref={refModalFax} width="1084px">
					<ExtFaxUploadPopup ref={refModalFax} callBack={popupCallBack} />
				</CustomModal>
				{/* 차량정보 파일업로드 */}
				<CustomModal ref={refModal} width="1084px">
					<MsCarDriverFileUploadPopup ref={refModal} paramAttchFileGrpNo={attchFileGrpNo} callBack={popupCallBack} />
				</CustomModal>
				{/* 저장위치 파일업로드 */}
				<CustomModal ref={refModal2} width="1084px">
					<MsPlantXslFileUploadPopup ref={refModal2} callBack={popupCallBack} />
				</CustomModal>
				{/* 이미지 팝업 */}
				<CustomModal ref={refModalImg} width="1084px">
					<CmImageViewerPopup dirType={'fax'} attchFileNm={imgFileName} />
				</CustomModal>
				<CustomModal ref={refModalEdmsImg} width="1084px">
					<CmEdmsImageViewerPopup workplaceId={'101'} fileId={fileIdList} />
				</CustomModal>
				{/* PDF 팝업 */}
				<CustomModal ref={refModalPdf} width="1084px">
					<CmPdfViewerPopup />
				</CustomModal>
			</SearchForm>
		</>
	);
});

export default DetailFilepage;
