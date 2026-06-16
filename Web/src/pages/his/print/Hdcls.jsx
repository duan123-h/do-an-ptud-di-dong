import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Servicerequest from "../../../services/his/ServicerequestService";
import {
    PDFViewer,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";

import TimesNewRoman from "../../../store/admin/assets/fonts/font-times-new-roman/SVN-Times-New-Roman.ttf";
import TimesNewRomanBold from "../../../store/admin/assets/fonts/font-times-new-roman/SVN-Times-New-Roman-Bold.ttf";
import TimesNewRomanItalic from "../../../store/admin/assets/fonts/font-times-new-roman/SVN-Times-New-Roman-Italic.ttf";
import TimesNewRomanBoldItalic from "../../../store/admin/assets/fonts/font-times-new-roman/SVN-Times-New-Roman-Bold-Italic.ttf";

Font.register({
    family: "TimesNewRoman",
    fonts: [
        { src: TimesNewRoman, fontWeight: "normal", fontStyle: "normal" },
        { src: TimesNewRomanBold, fontWeight: "bold", fontStyle: "normal" },
        { src: TimesNewRomanItalic, fontWeight: "normal", fontStyle: "italic" },
        { src: TimesNewRomanBoldItalic, fontWeight: "bold", fontStyle: "italic" },
    ],
});

export default function Hdcls() {
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [requestDetail, setRequestDetail] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await Servicerequest.getDetail(id);
                setRequest(res.data);
                const res1 = await Servicerequest.getDetails(id);
                setRequestDetail(res1.data);
            } catch (err) {
                toast.error("Lỗi khi lấy dữ liệu phiếu CLS.");
            }
        }
        fetchData();
    }, [id]);

    if (!request||!requestDetail) return <p>Đang tạo phiếu PDF...</p>;

    const patient = request.patient || {};
    const doctor = request.doctor || {};
    const medicalexamination = request.medicalexamination || {};
    const details = requestDetail || []; 

    const styles = StyleSheet.create({
        page: { fontFamily: "TimesNewRoman", padding: "15mm", fontSize: 12 },
        header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
        headerLeft: {},
        headerRight: { textAlign: "right" },
        title: { textAlign: "center", fontSize: 18, fontWeight: "bold", marginVertical: 10 },
        content: { marginTop: 10 },
        infoRow: { flexDirection: "row", marginBottom: 4 },
        infoLabel: { width: "30%", fontWeight: "bold" },
        infoValue: { width: "70%" },
        tableContainer: { marginTop: 10, borderWidth: 1, borderColor: "#000" },
        tableHeader: {
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#000",
            paddingVertical: 4,
        },
        tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 3 },
        tableCell: { flex: 1, fontSize: 12, paddingHorizontal: 4 },
        sttCell: { width: "15%", textAlign: "center" },
        nameCell: { width: "45%" },
        roomCell: { width: "40%" },
        footer: { marginTop: 15, textAlign: "center", fontStyle: "italic" },
    });

    return (
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text>BỘ Y TẾ</Text>
                            <Text>Bệnh viện A</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <Text>MS: 47 - BV - 01</Text>
                            <Text>Mã BN: {patient?.patientid}</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>PHIẾU HƯỚNG DẪN THỰC HIỆN CẬN LÂM SÀNG</Text>
                    <View style={styles.content}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Họ tên người bệnh:</Text>
                            <Text style={styles.infoValue}>{patient?.fullname}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Địa chỉ:</Text>
                            <Text style={styles.infoValue}>{patient?.address}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Chẩn đoán:</Text>
                            <Text style={styles.infoValue}>{medicalexamination?.diseasename}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Bệnh phụ:</Text>
                            <Text style={styles.infoValue}>{medicalexamination?.secondarydiseasenames}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Danh sách chỉ định</Text>
                        </View>
                        {details.length > 0 && (
                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableCell, styles.sttCell]}>STT ƯU TIÊN</Text>
                                    <Text style={[styles.tableCell, styles.nameCell]}>TÊN CHỈ ĐỊNH</Text>
                                    <Text style={[styles.tableCell, styles.roomCell]}>PHÒNG THỰC HIỆN</Text>
                                </View>
                                {details.map((item, index) => (
                                    <View key={item.servicerequestdetailid} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.sttCell]}>{item.queueorder}</Text>
                                        <Text style={[styles.tableCell, styles.nameCell]}>{item.service?.name}</Text>
                                        <Text style={[styles.tableCell, styles.roomCell]}>{item.service?.outpatientclinic?.name}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 30 }}>
                            <View style={{ alignItems: "center" }}>
                                <Text>Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</Text>
                                <Text>BÁC SĨ CHỈ ĐỊNH</Text>
                                <Text style={{ marginTop: 30 }}>{doctor?.name}</Text>
                                <Text>ĐT liên hệ: {doctor?.phonenumber}</Text>
                            </View>
                        </View>
                    </View>

                </Page>
            </Document>
        </PDFViewer>
    );
}
