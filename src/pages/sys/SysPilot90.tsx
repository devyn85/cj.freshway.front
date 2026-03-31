/*
 ############################################################################
 # FiledataField	: SysPilot10.tsx
 # Description		: 파일럿 10
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/

import { apiGetCarDriverList } from '@/api/sample/apiCarMaster';
import CmCarPopSearch from '@/components/cm/popup/CmCarPopSearch';
import CmDriverSearch from '@/components/cm/popup/CmDriverSearch';
import CmSkuGroup2Search from '@/components/cm/popup/CmSkuGroup2Search';
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DetailSampleCarDriver from '@/components/sample/centerMaster/sample/DetailSampleCarDriver';
import SearchSampleCarDriver from '@/components/sample/centerMaster/sample/SearchSampleCarDriver';
import { Divider, Form } from 'antd';

// lib
const SysPilot90 = () => {
	const [form] = Form.useForm();
	const [sampleForm] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const refs: any = useRef(null);
	const onvaluesChange = (changedValues: any, allValues: any) => {
		return;
	};

	const search = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);
		const params = sampleForm.getFieldsValue();

		apiGetCarDriverList(params).then(res => {
			setGridData(res.data);
			// setTotalCnt(res.data.length);
		});
	};
	const save = () => {
		// const gridData = refs.gridRef.current.getCheckedRowItems();
		// //console.log('gridData', gridData);
		const authGrpList = refs.gridRef.current.getChangedData();

		const checked = refs.gridRef.current.getCheckedRowItemsAll();
		const edited = refs.gridRef.current.getEditedRowItems();
	};
	const new1 = () => {
		const grid = refs.gridRef.current;
		grid.addRow({});

		alert('new');
	};
	const titleFunc = {
		searchYn: search,
		saveYn: save,
		newYn: new1,
		btn1Yn: () => {
			alert('btn1');
		},
	};
	return (
		<>
			<MenuTitle />
			<div className="grid-column-2">
				<SearchForm form={form} onValuesChange={onvaluesChange}>
					<Divider orientation="left">파일럿 90 팝업 테스트 기사 ID 조회(multipleRows)</Divider>
					<CmDriverSearch
						form={form}
						name="locationName1"
						code="locatiosnCode1"
						selectionMode="multipleRows"
					></CmDriverSearch>
					<Divider orientation="left">파일럿 90 팝업 테스트 기사 ID 조회(singleRow)</Divider>
					<CmDriverSearch
						form={form}
						name="locationName2"
						code="locatiosnCode2"
						selectionMode="singleRow"
						returnValueFormat="code"
					></CmDriverSearch>
					<Divider orientation="left">파일럿 90 팝업 테스트 기사 ID 조회(default)</Divider>
					<CmDriverSearch form={form} name="locationName3" code="locatiosnCode3"></CmDriverSearch>

					<Divider orientation="left">
						파일럿 90 차량/POP 번호 조회 팝업 return name - [거래처별 POP 관리]{form.getFieldValue('testNm')}
					</Divider>
					<CmCarPopSearch
						// ref={cmCarPopRef} // ⭐ 외부 ref 연결
						form={form}
						name="testNm"
						code="testCd"
						returnValueFormat="name"
						selectionMode="multipleRows"
						// isGrid={true} // ✅ true면 InputSearch 감춤
					/>
					<Divider orientation="left">
						파일럿 90 차량/POP 번호 조회 팝업 return code - [거래처별 POP 관리]{form.getFieldValue('carPopName1')}
					</Divider>
					<CmCarPopSearch
						form={form}
						name="carPopName1"
						code="carPopCode"
						selectionMode="multipleRows"
						returnValueFormat="code"
					></CmCarPopSearch>
					<Divider orientation="left">파일럿 90 팝업 상품그룹2 조회(singleRow)</Divider>
					<CmSkuGroup2Search
						form={form}
						name="CmSkuGroup2Search"
						code="CmSkuGroup2SearchCode"
						selectionMode="multipleRows"
						returnValueFormat="name"
					></CmSkuGroup2Search>
				</SearchForm>
				<SearchForm form={sampleForm}>
					<SearchSampleCarDriver search={search} form={sampleForm} />
				</SearchForm>
				<MenuTitle func={titleFunc} authority="searchYn|newYn|btn1Yn|saveYn" />
				<DetailSampleCarDriver ref={refs} form={detailForm} data={gridData} />
			</div>
		</>
	);
};

export default SysPilot90;
