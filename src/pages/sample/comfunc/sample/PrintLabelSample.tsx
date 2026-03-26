import { Form } from 'antd';
import { useRef, useState } from 'react';
// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import SearchForm from '@/components/common/custom/form/SearchFormResponsive';
import PrintLabelSampleDetail from '@/components/sample/printLabelSample/PrintLabelSampleDetail';
import PrintLabelSampleSearch from '@/components/sample/printLabelSample/PrintLabelSampleSearch';

const { VITE_RD_BASE_URL } = import.meta.env; // RD 기본 URL

// 라벨별 컬럼 정의
const gridColMap: Record<string, any[]> = {
	// 1. CJFWWD11 배송분류표라벨(축육)_개선_20220401
	CJFWWD11: [
		{ dataField: 'barcode1', headerText: '바코드1', align: 'center', dataType: 'code' }, // 1. <BARCODE1> 바코드1
		{ dataField: 'markword', headerText: '특별관리고객표기', align: 'center', dataType: 'code' }, // 2. <MARKWORD> 특별관리고객표기
		{ dataField: 'storagetype', headerText: '저장조건', align: 'center', dataType: 'code' }, // 3. <STORAGETYPE> 저장조건
		{ dataField: 'loc', headerText: '저장빈', align: 'center', dataType: 'code' }, // 4. <LOC> 저장빈
		{ dataField: 'custname1', headerText: '납품처명1', align: 'center', dataType: 'code' }, // 5. <CUSTNAME1> 납품처명1
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 6. <SKUNAME1> 상품명1
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 7. <SKU> 상품코드
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 8. <SKUNAME2> 상품명2
		{ dataField: 'custname2', headerText: '납품처명2', align: 'center', dataType: 'code' }, // 9. <CUSTNAME2> 납품처명2
		{ dataField: 'placeoforigin', headerText: '원산지', align: 'center', dataType: 'code' }, // 10. <PLACEOFORIGIN> 원산지
		{ dataField: 'qty', headerText: '수량', align: 'center', dataType: 'code' }, // 11. <QTY> 수량
		{ dataField: 'pageno1', headerText: '페이지번호1', align: 'center', dataType: 'code' }, // 12. <PAGENO1> 페이지번호1
		{ dataField: 'deliverygroup', headerText: '차량번호', align: 'center', dataType: 'code' }, // 13. <DELIVERYGROUP> 차량번호
		{ dataField: 'qty_2', headerText: '수량_2', align: 'center', dataType: 'code' }, // 14. <QTY_2> 수량_2
		{ dataField: 'from_custname', headerText: '업체명', align: 'center', dataType: 'code' }, // 15. <FROM_CUSTNAME> 업체명
		{ dataField: 'from_carname', headerText: '배송차량명', align: 'center', dataType: 'code' }, // 16. <FROM_CARNAME> 배송차량명
		{ dataField: 'qr_code', headerText: 'QR바코드', align: 'center', dataType: 'code' }, // 17. <QR_CODE> QR바코드
		{ dataField: 'pageno2', headerText: '페이지번호2', align: 'center', dataType: 'code' }, // 18. <PAGENO2> 페이지번호2
		{ dataField: 'deliverydt', headerText: '배송일자', align: 'center', dataType: 'code' }, // 19. <DELIVERYDT> 배송일자
		{ dataField: 'memo', headerText: '특이사항', align: 'center', dataType: 'code' }, // 20. <MEMO> 특이사항
		{ dataField: 'barcode2', headerText: '바코드2', align: 'center', dataType: 'code' }, // 21. <BARCODE2> 바코드2
		{ dataField: 'barcodetxt', headerText: '바코드텍스트', align: 'center', dataType: 'code' }, // 22. <BARCODETXT> 바코드텍스트
		{ dataField: 'etc_msg', headerText: '기타 메시지', align: 'center', dataType: 'code' }, // 23. <ETC_MSG> 기타 메시지
	],

	// 2. CJFWWD13 배송분류표라벨(동탄축육)_개선_20220401
	CJFWWD13: [
		{ dataField: 'barcode1', headerText: '바코드1', align: 'center', dataType: 'code' }, // 1. <BARCODE1> 바코드1
		{ dataField: 'markword', headerText: '특별관리고객표기', align: 'center', dataType: 'code' }, // 2. <MARKWORD> 특별관리고객표기
		{ dataField: 'storagetype', headerText: '저장조건', align: 'center', dataType: 'code' }, // 3. <STORAGETYPE> 저장조건
		{ dataField: 'loc', headerText: '저장빈', align: 'center', dataType: 'code' }, // 4. <LOC> 저장빈
		{ dataField: 'custname1', headerText: '납품처명1', align: 'center', dataType: 'code' }, // 5. <CUSTNAME1> 납품처명1
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 6. <SKUNAME1> 상품명1
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 7. <SKU> 상품코드
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 8. <SKUNAME2> 상품명2
		{ dataField: 'custname2', headerText: '납품처명2', align: 'center', dataType: 'code' }, // 9. <CUSTNAME2> 납품처명2
		{ dataField: 'placeoforigin', headerText: '원산지', align: 'center', dataType: 'code' }, // 10. <PLACEOFORIGIN> 원산지
		{ dataField: 'qty', headerText: '수량', align: 'center', dataType: 'code' }, // 11. <QTY> 수량
		{ dataField: 'pageno1', headerText: '페이지번호1', align: 'center', dataType: 'code' }, // 12. <PAGENO1> 페이지번호1
		{ dataField: 'deliverygroup', headerText: '차량번호', align: 'center', dataType: 'code' }, // 13. <DELIVERYGROUP> 차량번호
		{ dataField: 'qty_2', headerText: '수량_2', align: 'center', dataType: 'code' }, // 14. <QTY_2> 수량_2
		{ dataField: 'from_custname', headerText: '업체명', align: 'center', dataType: 'code' }, // 15. <FROM_CUSTNAME> 업체명
		{ dataField: 'from_carname', headerText: '배송차량명', align: 'center', dataType: 'code' }, // 16. <FROM_CARNAME> 배송차량명
		{ dataField: 'qr_code', headerText: 'QR바코드', align: 'center', dataType: 'code' }, // 17. <QR_CODE> QR바코드
		{ dataField: 'pageno2', headerText: '페이지번호2', align: 'center', dataType: 'code' }, // 18. <PAGENO2> 페이지번호2
		{ dataField: 'deliverydt', headerText: '배송일자', align: 'center', dataType: 'code' }, // 19. <DELIVERYDT> 배송일자
		{ dataField: 'lblStoqty', headerText: '자/타센터 수량', align: 'center', dataType: 'code' }, // 20. <LBL_STOQTY> 자/타센터 수량
		{ dataField: 'barcode2', headerText: '바코드2', align: 'center', dataType: 'code' }, // 21. <BARCODE2> 바코드2
		{ dataField: 'barcodetxt', headerText: '바코드텍스트', align: 'center', dataType: 'code' }, // 22. <BARCODETXT> 바코드텍스트
		{ dataField: 'etc_msg', headerText: '기타 메세지', align: 'center', dataType: 'code' }, // 23. <ETC_MSG> 기타메세지
	],

	// 3. CJFWWD15 배송분류표라벨(양산전용)_개선_20220927
	CJFWWD15: [
		{ dataField: 'markword', headerText: '특별관리고객표기', align: 'center', dataType: 'code' }, // 1. <MARKWORD> 특별관리고객표기
		{ dataField: 'storagetype', headerText: '저장조건', align: 'center', dataType: 'code' }, // 2. <STORAGETYPE> 저장조건
		{ dataField: 'loc', headerText: '저장빈', align: 'center', dataType: 'code' }, // 3. <LOC> 저장빈
		{ dataField: 'barcode1', headerText: '바코드1', align: 'center', dataType: 'code' }, // 4. <BARCODE1> 바코드1
		{ dataField: 'custname1', headerText: '납품처명1', align: 'center', dataType: 'code' }, // 5. <CUSTNAME1> 납품처명1
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 6. <SKUNAME1> 상품명1
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 7. <SKUNAME2> 상품명2
		{ dataField: 'placeoforigin', headerText: '원산지', align: 'center', dataType: 'code' }, // 8. <PLACEOFORIGIN> 원산지
		{ dataField: 'custname2', headerText: '납품처명2', align: 'center', dataType: 'code' }, // 9. <CUSTNAME2> 납품처명2
		{ dataField: 'qr_code', headerText: 'QR바코드', align: 'center', dataType: 'code' }, // 10. <BARCODE2> QR바코드
		{ dataField: 'qty', headerText: '수량', align: 'center', dataType: 'code' }, // 11. <QTY> 수량
		{ dataField: 'deliverydt', headerText: '배송일자', align: 'center', dataType: 'code' }, // 12. <DELIVERYDT> 배송일자
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 13. <SKU> 상품코드
		{ dataField: 'pageno2', headerText: '페이지번호2', align: 'center', dataType: 'code' }, // 14. <PAGENO2> 페이지번호2
		{ dataField: 'pageno1', headerText: '페이지번호1', align: 'center', dataType: 'code' }, // 15. <PAGENO1> 페이지번호1
		{ dataField: 'deliverygroup_chg', headerText: '차량번호', align: 'center', dataType: 'code' }, // 16. <DELIVERYGROUP_CHG> 차량번호
		{ dataField: 'barcode2', headerText: '바코드2', align: 'center', dataType: 'code' }, // 17. <BARCODE2> 바코드2
		{ dataField: 'memo_ofn', headerText: '온푸비고', align: 'center', dataType: 'code' }, // 18. <MEMO_OFN> 온푸비고
		{ dataField: 'sms_yn', headerText: '소터대상', align: 'center', dataType: 'code' }, // 19. <SMS_YN> 소터대상
		{ dataField: 'barcodetxt', headerText: '바코드텍스트', align: 'center', dataType: 'code' }, // 20. <BARCODETXT> 바코드텍스트
		{ dataField: 'etc_msg', headerText: '기타 메시지', align: 'center', dataType: 'code' }, // 21. <ETC_MSG> 기타 메시지
	],

	// 4. CJFWWD16 배송분류표라벨(하나로마트전용)_20230620
	CJFWWD16: [
		{ dataField: 'custname1', headerText: '납품처명1', align: 'center', dataType: 'code' }, // 1. <CUSTNAME1> 납품처명1
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 2. <SKUNAME1> 상품명1
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 3. <SKU> 상품코드
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 4. <SKUNAME2> 상품명2
		{ dataField: 'qty', headerText: '수량', align: 'center', dataType: 'code' }, // 5. <QTY> 수량
		{ dataField: 'deliverydt', headerText: '배송일자', align: 'center', dataType: 'code' }, // 6. <DELIVERYDT> 배송일자
		{ dataField: 'qtyperbox', headerText: '입수량', align: 'center', dataType: 'code' }, // 7. <QTYPERBOX> 입수량
		{ dataField: 'qr_code', headerText: 'QR바코드', align: 'center', dataType: 'code' }, // 8. <QR_CODE> QR바코드
		{ dataField: 'stock_lottable01', headerText: '유통기한', align: 'center', dataType: 'code' }, // 9. <STOCK_LOTTABLE01> 유통기한
		{ dataField: 'boxbarcode', headerText: 'BOX 바코드', align: 'center', dataType: 'code' }, // 10. <BOXBARCODE> BOX 바코드
		{ dataField: 'boxbarcodetxt', headerText: 'BOX 바코드 텍스트', align: 'center', dataType: 'code' }, // 11. <BOXBARCODETXT> BOX 바코드 텍스트
	],

	// 5. CJFWWD18 배송분류표라벨(쿠팡전용)_20230914
	CJFWWD18: [
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 1. <SKU> 상품코드
		{ dataField: 'custname1', headerText: '입고처명1', align: 'center', dataType: 'code' }, // 2. <CUSTNAME1> 입고처명1
		{ dataField: 'deliverydt', headerText: '입고일자', align: 'center', dataType: 'code' }, // 3. <DELIVERYDT> 입고일자
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 4. <SKUNAME1> 상품명1
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 5. <SKUNAME2> 상품명2
		{ dataField: 'custname2', headerText: '납품처명2', align: 'center', dataType: 'code' }, // 6. <CUSTNAME2> 납품처명2
		{ dataField: 'stock_lottable01', headerText: '유통기한', align: 'center', dataType: 'code' }, // 7. <STOCK_LOTTABLE01> 유통기한
		{ dataField: 'eabarcodetxt', headerText: 'EA 바코드 텍스트', align: 'center', dataType: 'code' }, // 8. <EABARCODETXT> EA 바코드 텍스트
		{ dataField: 'boxbarcode', headerText: 'BOX바코드', align: 'center', dataType: 'code' }, // 9. <BOXBARCODE> BOX바코드
		{ dataField: 'boxbarcodetxt', headerText: 'BOX 바코드 텍스트', align: 'center', dataType: 'code' }, // 10. <BOXBARCODETXT> BOX 바코드 텍스트
	],

	// 6. CJFWWD20 배송분류표라벨(통합)_20241226
	CJFWWD20: [
		{ dataField: 'deliverydt', headerText: '배송일자', align: 'center', dataType: 'code' }, // 1. <DELIVERYDT> 배송일자
		{ dataField: 'storagetype', headerText: '저장조건', align: 'center', dataType: 'code' }, // 2. <STORAGETYPE> 저장조건
		{ dataField: 'sms_yn', headerText: '소터대상', align: 'center', dataType: 'code' }, // 3. <SMS_YN> 소터대상
		{ dataField: 'qr_code', headerText: 'QR바코드', align: 'center', dataType: 'code' }, // 4. <QR_CODE> QR바코드
		{ dataField: 'markword', headerText: '특별관리고객표기', align: 'center', dataType: 'code' }, // 5. <MARKWORD> 특별관리고객표기
		{ dataField: 'loc', headerText: '저장빈', align: 'center', dataType: 'code' }, // 6. <LOC> 저장빈
		{ dataField: 'custname1', headerText: '납품처명1', align: 'center', dataType: 'code' }, // 7. <CUSTNAME1> 납품처명1
		{ dataField: 'from_custname', headerText: '업체명', align: 'center', dataType: 'code' }, // 8. <FROM_CUSTNAME> 업체명
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 9. <SKUNAME1> 상품명1
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 10. <SKU> 상품코드
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 11. <SKUNAME2> 상품명2
		{ dataField: 'custname2', headerText: '납품처명2', align: 'center', dataType: 'code' }, // 12. <CUSTNAME2> 납품처명2
		{ dataField: 'deliverygroup', headerText: '차량번호', align: 'center', dataType: 'code' }, // 13. <DELIVERYGROUP> 차량번호
		{ dataField: 'qty', headerText: '수량', align: 'center', dataType: 'code' }, // 14. <QTY> 수량
		{ dataField: 'pageno1', headerText: '배송차량명', align: 'center', dataType: 'code' }, // 15. <PAGENO1> 배송차량명
		{ dataField: 'cargroup', headerText: '출차조', align: 'center', dataType: 'code' }, // 16. <CARGROUP> 출차조
		{ dataField: 'pageno2', headerText: '페이지번호1', align: 'center', dataType: 'code' }, // 17. <PAGENO2> 페이지번호1
		{ dataField: 'lblStoqty', headerText: '자/타센터 수량', align: 'center', dataType: 'code' }, // 19. <LBL_STOQTY> 자/타센터 수량
		{ dataField: 'barcode2', headerText: '바코드2', align: 'center', dataType: 'code' }, // 20. <BARCODE2> 바코드2
		{ dataField: 'memo_ofn', headerText: '온푸비고', align: 'center', dataType: 'code' }, // 21. <MEMO_OFN> 온푸비고
		{ dataField: 'barcodetxt', headerText: '바코드텍스트', align: 'center', dataType: 'code' }, // 22. <BARCODETXT> 바코드텍스트
	],

	// 7. CJFWDP1 입고라벨(대)
	CJFWDP1: [
		{ dataField: 'qtyperbox', headerText: '박스입수량', align: 'center', dataType: 'code' }, // 1. <QTYPERBOX> 박스입수량
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 2. <SKUNAME2> 상품명2
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 3. <SKUNAME1> 상품명1
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 4. <SKU> 상품코드
		{ dataField: 'lottable01', headerText: '유통기한', align: 'center', dataType: 'code' }, // 5. <LOTTABLE01> 유통기한
		{ dataField: 'barcode', headerText: '바코드', align: 'center', dataType: 'code' }, // 6. <BARCODE> 바코드
		{ dataField: 'title', headerText: '상단타이틀', align: 'center', dataType: 'code' }, // 7. <TITLE> 상단타이틀
		{ dataField: 'placeoforigin', headerText: '원산지', align: 'center', dataType: 'code' }, // 8. <PLACEOFORIGIN> 원산지
		{ dataField: 'custname', headerText: '거래처명', align: 'center', dataType: 'code' }, // 9. <CUSTNAME> 거래처명
		{ dataField: 'custkey', headerText: '거래처코드', align: 'center', dataType: 'code' }, // 10. <CUSTKEY> 거래처코드
		{ dataField: 'slipdt', headerText: '전표일자', align: 'center', dataType: 'code' }, // 11. <SLIPDT> 전표일자
	],

	// 8. CJFWDP2 입고라벨(축육)
	CJFWDP2: [
		{ dataField: 'weight', headerText: '중량', align: 'center', dataType: 'code' }, // 1. <WEIGHT> 중량
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 2. <SKU> 상품코드
		{ dataField: 'barcode', headerText: '바코드', align: 'center', dataType: 'code' }, // 3. <BARCODE> 바코드
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 4. <SKUNAME1> 상품명1
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 5. <SKUNAME2> 상품명2
		{ dataField: 'qtyperbox', headerText: '박스입수량', align: 'center', dataType: 'code' }, // 6. <QTYPERBOX> 박스입수량
		{ dataField: 'placeoforigin', headerText: '원산지', align: 'center', dataType: 'code' }, // 7. <PLACEOFORIGIN> 원산지
		{ dataField: 'convertlot', headerText: '도축일', align: 'center', dataType: 'code' }, // 8. <CONVERTLOT> 도축일
		{ dataField: 'storagetype', headerText: '저장조건', align: 'center', dataType: 'code' }, // 9. <STORAGETYPE> 저장조건
		{ dataField: 'lottable01', headerText: '유통기한', align: 'center', dataType: 'code' }, // 10. <LOTTABLE01> 유통기한
		{ dataField: 'serialno', headerText: '유통이력번호', align: 'center', dataType: 'code' }, // 11. <SERIALNO> 유통이력번호
		{ dataField: 'barcode', headerText: '바코드', align: 'center', dataType: 'code' }, // 12. <BARCODE> 바코드 (중복)
	],

	// 9. CJFWDP3 입고라벨(소)
	CJFWDP3: [
		{ dataField: 'custkey', headerText: '거래처코드', align: 'center', dataType: 'code' }, // 1. <CUSTKEY> 거래처코드
		{ dataField: 'slipdt', headerText: '전표일자', align: 'center', dataType: 'code' }, // 2. <SLIPDT> 전표일자
		{ dataField: 'custname', headerText: '거래처명', align: 'center', dataType: 'code' }, // 3. <CUSTNAME> 거래처명
		{ dataField: 'sku', headerText: '상품코드', align: 'center', dataType: 'code' }, // 4. <SKU> 상품코드
		{ dataField: 'qtyperbox', headerText: '박스입수량', align: 'center', dataType: 'code' }, // 5. <QTYPERBOX> 박스입수량
		{ dataField: 'placeoforigin', headerText: '원산지', align: 'center', dataType: 'code' }, // 6. <PLACEOFORIGIN> 원산지
		{ dataField: 'skuname1', headerText: '상품명1', align: 'center', dataType: 'code' }, // 7. <SKUNAME1> 상품명1
		{ dataField: 'skuname2', headerText: '상품명2', align: 'center', dataType: 'code' }, // 8. <SKUNAME2> 상품명2
		{ dataField: 'title', headerText: '상단타이틀', align: 'center', dataType: 'code' }, // 9. <TITLE> 상단타이틀
		{ dataField: 'lottable01', headerText: '유통기한', align: 'center', dataType: 'code' }, // 10. <LOTTABLE01> 유통기한
		{ dataField: 'barcode', headerText: '바코드', align: 'center', dataType: 'code' }, // 11. <BARCODE> 바코드
	],
};

const labelList = [
	{ label: '배송분류표라벨(축육)_개선_20220401', value: 'CJFWWD11', fileName: 'WD_Label_CJFWWD11.mrd' },
	{ label: '배송분류표라벨(동탄축육)_개선_20220401', value: 'CJFWWD13', fileName: 'WD_Label_CJFWWD13.mrd' },
	{ label: '배송분류표라벨(양산전용)_개선_20220927', value: 'CJFWWD15', fileName: 'WD_Label_CJFWWD15.mrd' },
	{ label: '배송분류표라벨(하나로마트전용)_20230620', value: 'CJFWWD16', fileName: 'WD_Label_CJFWWD16.mrd' },
	{ label: '배송분류표라벨(쿠팡전용)_20230914', value: 'CJFWWD18', fileName: 'WD_Label_CJFWWD18.mrd' },
	{ label: '배송분류표라벨(통합)_20241226', value: 'CJFWWD20', fileName: 'WD_Label_CJFWWD20.mrd' },
	{ label: '입고라벨(대)', value: 'CJFWDP1', fileName: 'DP_Label_CJFWDP1.mrd' },
	{ label: '입고라벨(축육)', value: 'CJFWDP2', fileName: 'DP_Label_CJFWDP2.mrd' },
	{ label: '입고라벨(소)', value: 'CJFWDP3', fileName: 'DP_Label_CJFWDP3.mrd' },
];

const PrintLabelSample = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 상태 선언은 모두 최상단에!
	const [form] = Form.useForm();
	const labelCodeWatch = Form.useWatch('labelCode', form);
	//window.form = form;
	const [gridData, setGridData] = useState([]);
	const [gridCol, setGridCol] = useState(gridColMap['CJFWWD20']);
	// 조회영역 초기값 설정
	const [searchBox] = useState({
		labelCode: 'CJFWWD20', // 초기 라벨 코드
		previewYn: 'Y', // 초기 미리보기 여부
		printCnt: 1, // 초기 인쇄 매수
	});
	const gridRef = useRef(null);
	//const [selectedLabel, setSelectedLabel] = useState("CJFWWD20");
	//const [selectedLabel, setSelectedLabel] = useState(form.getFieldValue('labelCode'));
	//const [selectedLabel, setSelectedLabel] = useState(() => form.getFieldValue('labelCode') || searchBox.labelCode);
	const [previewYn, setPreviewYn] = useState('Y');
	const [count, setCount] = useState(1);

	const search = () => {
		//console.log(("Search triggered with label:", selectedLabel);

		const selectedLabel = form.getFieldValue('labelCode');

		let tempGrdiData: any[] = [];

		// 1. CJFWWD11 배송분류표라벨(축육)_개선_20220401
		if (selectedLabel === 'CJFWWD11') {
			tempGrdiData = [
				{
					barcode1: '4538621964096910020000100001', // 1. <BARCODE1> 바코드1
					markword: '#핵심고객#', // 2. <MARKWORD> 특별관리고객표기
					storagetype: '냉장', // 3. <STORAGETYPE> 저장조건
					loc: 'R01-0101', // 4. <LOC> 저장빈
					custname1: '최고당돈까스(먹골역점)', // 5. <CUSTNAME1> 납품처명1
					skuname1: '이삭푸드 생안심', // 6. <SKUNAME1> 상품명1
					sku: '381247', // 7. <SKU> 상품코드
					skuname2: '(최고당돈까스용 40g*25장 1Kg/EA)', // 8. <SKUNAME2> 상품명2
					custname2: '( 5EA/BOX )', // 9. <CUSTNAME2> 납품처명2
					placeoforigin: 'FW한KR', // 10. <PLACEOFORIGIN> 원산지
					qty: '1BOX', // 11. <QTY> 수량
					pageno1: '경기91자5900', // 12. <PAGENO1> 페이지번호1
					deliverygroup: 'C344-8', // 13. <DELIVERYGROUP> 차량번호
					qty_2: '수량_2', // 14. <QTY_2> 수량_2
					from_custname: '업체명 테스트', // 15. <FROM_CUSTNAME> 업체명
					from_carname: '배송차량명', // 16. <FROM_CARNAME> 배송차량명
					qr_code: 'QR바코드', // 17. <QR_CODE> QR바코드
					pageno2: '1/1', // 18. <PAGENO2> 페이지번호2
					deliverydt: '2024-04-05', // 19. <DELIVERYDT> 배송일자
					memo: '메모 테스트', // 20. <MEMO> 특이사항
					barcode2: '4538621964096910020000100001', // 21. <BARCODE2> 바코드2
					barcodetxt: '45386 2196409691 0020 000100 001 F', // 22. <BARCODETXT> 바코드텍스트
					etc_msg: '본 배송분류표는 식품위생법상의 고지사항과는 무관합니다.', // 23. <ETC_MSG> 기타 메시지
				},
			];
		}

		// 2. CJFWWD13	배송분류표라벨(동탄축육)_개선_20220401
		if (selectedLabel === 'CJFWWD13') {
			tempGrdiData = [
				{
					barcode1: '4538621963940690010000200001', // 1. <BARCODE1> 바코드1
					markword: '#핵심고객#', // 2. <MARKWORD> 특별관리고객표기
					storagetype: '냉장', // 3. <STORAGETYPE> 저장조건
					loc: 'STD', // 4. <LOC> 저장빈
					custname1: '최고당돈까스(N가산디지털점)', // 5. <CUSTNAME1> 납품처명1
					skuname1: '해련식품 생등심', // 6. <SKUNAME1> 상품명1
					sku: '328625', // 7. <SKU> 상품코드
					skuname2: '(최고당돈까스용 신규_박스단위발주 2.5Kg/EA)', // 8. <SKUNAME2> 상품명2
					custname2: '( 2EA/BOX )', // 9. <CUSTNAME2> 납품처명2
					placeoforigin: 'FW한KR', // 10. <PLACEOFORIGIN> 원산지
					qty: '2BOX', // 11. <QTY> 수량
					pageno1: '경기89아7765', // 12. <PAGENO1> 페이지번호1
					deliverygroup: '동Ze184-5', // 13. <DELIVERYGROUP> 차량번호
					qty_2: '수량_2', // 14. <QTY_2> 수량_2
					from_custname: '업체명이지', // 15. <FROM_CUSTNAME> 업체명
					from_carname: '배송차량명', // 16. <FROM_CARNAME> 배송차량명
					qr_code: 'QR바코드', // 17. <QR_CODE> QR바코드
					pageno2: '1/1', // 18. <PAGENO2> 페이지번호2
					deliverydt: '2024-04-05', // 19. <DELIVERYDT> 배송일자
					lblStoqty: '자/타센터 수량', // 20. <LBL_STOQTY> 자/타센터 수량
					barcode2: '4538621963940690010000200001', // 21. <BARCODE2> 바코드2
					barcodetxt: '45386 2196394069 0010 000200 001 F', // 22. <BARCODETXT> 바코드텍스트
					etc_msg: '본 배송분류표는 식품위생법상의 고지사항과는 무관합니다.', // 23. <ETC_MSG> 기타메세지
				},
			];
		}
		// 3. CJFWWD15	배송분류표라벨(양산전용)_개선_20220927
		if (selectedLabel === 'CJFWWD15') {
			tempGrdiData = [
				{
					markword: '#핵심고객#', // 1. <MARKWORD> 특별관리고객표기
					storagetype: '냉동', // 2. <STORAGETYPE> 저장조건
					loc: 'STD', // 3. <LOC> 저장빈
					barcode1: '4538621964356520010004700001', // 4. <BARCODE1> 바코드1
					custname1: '진성푸드', // 5. <CUSTNAME1> 납품처명1
					skuname1: '맘스터치 모짜렐라치즈스틱', // 6. <SKUNAME1> 상품명1
					skuname2: '(25g*40±5개입 1Kg/EA)', // 7. <SKUNAME2> 상품명2
					placeoforigin: 'FW', // 8. <PLACEOFORIGIN> 원산지
					custname2: '( 10EA/BOX )', // 9. <CUSTNAME2> 납품처명2
					qr_code: '4538621964356520010004700001', // 10. <BARCODE2> QR바코드
					qty: '47EA', // 11. <QTY> 수량
					deliverydt: '2024-04-05', // 12. <DELIVERYDT> 배송일자
					sku: '369410', // 13. <SKU> 상품코드
					pageno2: '1/1', // 14. <PAGENO2> 페이지번호2
					pageno1: '인천85바2032', // 15. <PAGENO1> 페이지번호1
					deliverygroup_chg: 'D410-3', // 16. <DELIVERYGROUP_CHG> 차량번호
					barcode2: '4538621964356520010004700001', // 17. <BARCODE2> 바코드2
					memo_ofn: '1/30반품', // 18. <MEMO_OFN> 온푸비고
					sms_yn: 'N', // 19. <SMS_YN> 소터대상
					barcodetxt: '45386 2196435652 0010 004700 001 F', // 20. <BARCODETXT> 바코드텍스트
					etc_msg: '본 배송분류표는 식품위생법상의 고지사항과는 무관합니다.', // 21. <ETC_MSG> 기타 메시지
				},
			];
		}

		// 4. CJFWWD16 배송분류표라벨(하나로마트전용)_20230620
		if (selectedLabel === 'CJFWWD16') {
			tempGrdiData = [
				{
					custname1: '농협경제지주_안성센터_주문(저온)', // 1. <CUSTNAME1> 납품처명1
					skuname1: '굿딜 알찬미니떡갈비', // 2. <SKUNAME1> 상품명1
					sku: '391333', // 3. <SKU> 상품코드
					skuname2: '(유통용 15±2*66±3개입 1Kg/EA)', // 4. <SKUNAME2> 상품명2
					qty: '1BOX', // 5. <QTY> 수량
					deliverydt: '2024-04-05', // 6. <DELIVERYDT> 배송일자
					qtyperbox: '10EA/BOX', // 7. <QTYPERBOX> 입수량
					qr_code: '4538621963889470050000100001', // 8. <QR_CODE> QR바코드
					stock_lottable01: '20250710', // 9. <STOCK_LOTTABLE01> 유통기한
					boxbarcode: '18801955024115', // 10. <BOXBARCODE> BOX 바코드
					boxbarcodetxt: '18801955024115', // 11. <BOXBARCODETXT> BOX 바코드 텍스트
				},
			];
		}

		// 5. CJFWWD18 배송분류표라벨(쿠팡전용)_20230914
		if (selectedLabel === 'CJFWWD18') {
			tempGrdiData = [
				{
					sku: '194801', // 1. <SKU> 상품코드
					custname1: '주식회사 쿠팡 인천17물류센터', // 2. <CUSTNAME1> 입고처명1
					deliverydt: '2023-04-05', // 3. <DELIVERYDT> 입고일자
					skuname1: '이츠웰 등심대박돈까스', // 4. <SKUNAME1> 상품명1
					skuname2: '(리뉴얼_200g*10입 2Kg/EA)', // 5. <SKUNAME2> 상품명2
					custname2: '( 6EA/BOX )', // 6. <CUSTNAME2> 납품처명2
					stock_lottable01: '20231213', // 7. <STOCK_LOTTABLE01> 유통기한
					eabarcodetxt: '8801955006299', // 8. <EABARCODETXT> EA 바코드 텍스트
					boxbarcode: '18801955006296', // 9. <BOXBARCODE> BOX바코드
					boxbarcodetxt: '18801955006296', // 10. <BOXBARCODETXT> BOX 바코드 텍스트
				},
			];
		}

		// 6. CJFWWD20 배송분류표라벨(통합)_20241226
		if (selectedLabel === 'CJFWWD20') {
			tempGrdiData = [
				{
					deliverydt: '2024-04-05', // 1. <DELIVERYDT> 배송일자
					storagetype: '냉동', // 2. <STORAGETYPE> 저장조건
					sms_yn: 'N', // 3. <SMS_YN> 소터대상
					qr_code: '4538621964285730010140000002', // 4. <QR_CODE> QR바코드
					markword: '#핵심고객#', // 5. <MARKWORD> 특별관리고객표기
					loc: '중단빈', // 6. <LOC> 저장빈
					custname1: '홈플러스(주)(안성신선센터_수산, 이천)', // 7. <CUSTNAME1> 납품처명1
					from_custname: '홈플러스(주)(안성신선센터_수산, 이천)', // 8. <FROM_CUSTNAME> 업체명
					skuname1: '생칵테일새우', // 9. <SKUNAME1> 상품명1
					sku: '397854', // 10. <SKU> 상품코드
					skuname2: '(PDTO_31-40_200g*2_LARGE 400g/EA)', // 11. <SKUNAME2> 상품명2
					custname2: '( 10EA/BOX )', // 12. <CUSTNAME2> 납품처명2
					deliverygroup: 'C304-6', // 13. <DELIVERYGROUP> 차량번호
					qty: '1400EA', // 14. <QTY> 수량
					pageno1: '경기94자8688', // 15. <PAGENO1> 배송차량명
					cargroup: '4조', // 16. <CARGROUP> 출차조
					pageno2: '1/1', // 17. <PAGENO2> 페이지번호1
					lblStoqty: '140BOX/0EA', // 19. <LBL_STOQTY> 자/타센터 수량
					barcode2: '4538621964285730010140000002', // 20. <BARCODE2> 바코드2
					memo_ofn: '1/30반품', // 21. <MEMO_OFN> 온푸비고
					barcodetxt: '45386 2196428573 0010 140000 002 F', // 22. <BARCODETXT> 바코드텍스트
				},
			];
		}

		// 7. CJFWDP1 입고라벨(대)
		if (selectedLabel === 'CJFWDP1') {
			tempGrdiData = [
				{
					qtyperbox: '6EA/BOX', // 1. <QTYPERBOX> 박스입수량
					skuname2: '(찌개용 380g/EA)', // 2. <SKUNAME2> 상품명2
					skuname1: '행복한콩 모두부', // 3. <SKUNAME1> 상품명1
					sku: '133716', // 4. <SKU> 상품코드
					lottable01: 'STD', // 5. <LOTTABLE01> 유통기한
					barcode: 'B133716-STDB', // 6. <BARCODE> 바코드
					title: '(TEST TITLE)', // 7. <TITLE> 상단타이틀
					placeoforigin: '(TEST)', // 8. <PLACEOFORIGIN> 원산지
					custname: '진천', // 9. <CUSTNAME> 거래처명
					custkey: '1000-1260', // 10. <CUSTKEY> 거래처코드
					slipdt: '2024/04/05', // 11. <SLIPDT> 전표일자
				},
			];
		}

		// 8. CJFWDP2 입고라벨(축육)
		if (selectedLabel === 'CJFWDP2') {
			tempGrdiData = [
				{
					weight: '2.5KG', // 1. <WEIGHT> 중량
					sku: '256914', // 2. <SKU> 상품코드
					barcode: 'S0000428487S', // 3. <BARCODE> 바코드
					skuname1: '이삭푸드 생등심', // 4. <SKUNAME1> 상품명1
					skuname2: '(최고당돈까스용 NEW_박스단위발주 2.5Kg/EA)', // 5. <SKUNAME2> 상품명2
					qtyperbox: '2EA/BOX', // 6. <QTYPERBOX> 박스입수량
					placeoforigin: '(한국)', // 7. <PLACEOFORIGIN> 원산지
					convertlot: '//', // 8. <CONVERTLOT> 도축일
					storagetype: '<냉장>', // 9. <STORAGETYPE> 저장조건
					lottable01: '2024/04/24', // 10. <LOTTABLE01> 유통기한
					serialno: 'L12403299195304', // 11. <SERIALNO> 유통이력번호
				},
			];
		}

		// 9. CJFWDP3 입고라벨(소)
		if (selectedLabel === 'CJFWDP3') {
			tempGrdiData = [
				{
					custkey: '2900', // 1. <CUSTKEY> 거래처코드
					slipdt: '2024/04/05', // 2. <SLIPDT> 전표일자
					custname: '영등포센터', // 3. <CUSTNAME> 거래처명
					sku: '100358', // 4. <SKU> 상품코드
					qtyperbox: '40EA/BOX', // 5. <QTYPERBOX> 박스입수량
					placeoforigin: '(TEST)', // 6. <PLACEOFORIGIN> 원산지
					skuname1: '백설 부침가루', // 7. <SKUNAME1> 상품명1
					skuname2: '(1Kg/EA)', // 8. <SKUNAME2> 상품명2
					title: '(냉동) [H05-5101]', // 9. <TITLE> 상단타이틀
					lottable01: '2026-06-18', // 10. <LOTTABLE01> 유통기한
					barcode: 'B100358-20260618', // 11. <BARCODE> 바코드
				},
			];
		}

		setGridData(tempGrdiData);
	};

	const search2 = () => {
		//console.log(("Search triggered with label:", form.getFieldValue('labelCode'));
	};

	const titleFunc = {
		searchYn: search,
	};

	useEffect(() => {
		//console.log(("Label code changed:", labelCodeWatch);
		// 초기 라벨 설정
		setGridCol(gridColMap[labelCodeWatch]);
		setGridData([]); // 라벨 변경 시 데이터 초기화
		form.setFieldValue('fileName', labelList.find(label => label.value === labelCodeWatch)?.fileName || '');
		handleLabelChange(labelCodeWatch);
	}, [labelCodeWatch]);

	// 이미지 URL 상태 추가
	const [previewImages, setPreviewImages] = useState({
		asis: '',
		tobe: '',
	});

	const handleLabelChange = (value: string) => {
		setPreviewImages({
			asis: `${VITE_RD_BASE_URL}/report/ReportingServer/mrd/image/asis/${value}.jpeg`,
			tobe: `${VITE_RD_BASE_URL}/report/ReportingServer/mrd/image/tobe/${value}.jpeg`,
		});
	};

	return (
		<>
			<MenuTitle func={titleFunc} />
			<SearchForm form={form} initialValues={searchBox}>
				<PrintLabelSampleSearch form={form} labelList={labelList} />
			</SearchForm>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					height: 'calc(100vh - 100px)', // 전체 높이에서 상단 영역 제외
					overflow: 'hidden',
				}}
			>
				{/* 그리드 영역 div1 */}
				<div
					style={{
						flex: 'none',
						height: 100,
						minHeight: 100,
						maxHeight: 100,
						overflow: 'hidden',
						borderBottom: '1px solid #ddd', // 하단 줄 추가
					}}
				>
					<PrintLabelSampleDetail
						ref={gridRef}
						gridCol={gridCol}
						gridData={gridData}
						form={form}
						previewImages={previewImages}
						showGrid={true}
						showImage={false}
						imgStyle={{
							width: '100%',
							height: '100%',
							objectFit: 'contain',
							display: 'block',
							margin: 0,
							padding: 0,
							background: '#fff',
						}}
					/>
				</div>
				{/* 이미지 영역 div2 */}
				<div
					style={{
						flex: 1, // 남은 공간 모두 사용
						width: '100%',
						overflow: 'hidden',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'stretch',
						alignItems: 'stretch',
						padding: 0,
						margin: 0,
						border: '1px solid #ddd', // 테두리 줄 추가
						boxSizing: 'border-box', // 테두리 포함
					}}
				>
					<PrintLabelSampleDetail
						previewImages={previewImages}
						showGrid={false}
						showImage={true}
						imgStyle={{
							width: '100%',
							height: '100%',
							objectFit: 'contain',
							display: 'block',
							margin: 0,
							padding: 0,
							background: '#fff',
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default PrintLabelSample;
