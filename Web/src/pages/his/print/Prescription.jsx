import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrescriptionApi from "../../../services/PrescriptionService";
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

export default function Prescription() {
    const { id } = useParams();
    const [prescription, setPrescription] = useState(null);
    const [details, setDetails] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await PrescriptionApi.get({ prescriptionid: id });
                setPrescription(res.data);

                const detailRes = await PrescriptionApi.getDetail(id);
                setDetails(detailRes.data);
            } catch (err) {
                toast.error("Lỗi khi lấy dữ liệu đơn thuốc.");
            }
        }
        fetchData();
    }, [id]);

    if (!prescription) return <p>Đang tạo phiếu PDF...</p>;

    const { patient, medicalexamination, doctor } = prescription;

    const styles = StyleSheet.create({
        page: { fontFamily: "TimesNewRoman", padding: "15mm", fontSize: 12 },
        header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
        headerLeft: {},
        headerRight: { textAlign: "right" },
        title: { textAlign: "center", fontSize: 20, fontWeight: "bold", marginVertical: 10 },
        content: { marginTop: 10, fontSize: 12 },
        infoRow: { flexDirection: "row", marginBottom: 4 },
        infoLabel: { width: "30%", fontWeight: "bold" },
        infoValue: { width: "70%" },
        tableContainer: {
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#000",
        },
        tableHeader: {
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#000",
            paddingVertical: 4,
            alignItems: "center",
        },
        tableRow: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            paddingVertical: 3,
            alignItems: "center",
        },
        tableCell: {
            flex: 1,
            fontSize: 12,
            paddingHorizontal: 4,
        },
        sttCell: {
            width: "10%",
            textAlign: "center",
        },
        nameCell: {
            width: "40%",
        },
        quantityCell: {
            width: "20%",
            textAlign: "center",
        },
        usageCell: {
            width: "30%",
        },
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
                    <Text style={styles.title}>ĐƠN THUỐC</Text>
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
                            <Text style={styles.infoLabel}>Danh sách thuốc</Text>
                        </View>
                        {details.length > 0 && (
                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableCell, styles.sttCell]}>STT</Text>
                                    <Text style={[styles.tableCell, styles.nameCell]}>Tên thuốc</Text>
                                    <Text style={[styles.tableCell, styles.quantityCell]}>Số lượng</Text>
                                    <Text style={[styles.tableCell, styles.usageCell]}>Hướng dẫn dùng</Text>
                                </View>
                                {details.map((item, index) => (
                                    <View key={item.prescriptiondetailid} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.sttCell]}>{index + 1}</Text>
                                        <Text style={[styles.tableCell, styles.nameCell]}>{item.medicine?.name}</Text>
                                        <Text style={[styles.tableCell, styles.quantityCell]}>{item.quantity}</Text>
                                        <Text style={[styles.tableCell, styles.usageCell]}>{item.usageinstructions}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
                            <View>
                                <Text>Lời dặn:</Text>
                                <Text>{prescription?.doctoradvice}</Text>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <View style={{ alignItems: "center" }}>
                                    <Text>Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</Text>
                                </View>
                                <View style={{ alignItems: "center" }}>
                                    <Text>BÁC SĨ KHÁM BỆNH</Text>
                                </View>
                                <View style={{ alignItems: "center" ,marginTop: 30}}>
                                    <Text>{doctor?.name}</Text>
                                </View>
                                <View style={{ alignItems: "center" }}>
                                    <Text>ĐT liên hệ: {doctor?.phonenumber}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </Page>
            </Document>
        </PDFViewer>
    );
}
