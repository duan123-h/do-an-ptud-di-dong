import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import ReceptionApi from "../../../services/his/OutpatientregistrationService";

import TimesNewRoman from "../../../store/admin/assets/fonts/font-times-new-roman/SVN-Times-New-Roman.ttf";
import TimesNewRomanBold from "../../../store/admin/assets/fonts/font-times-new-roman/SVN-Times-New-Roman-Bold.ttf";
import TimesNewRomanItalic from "../../../store/admin/assets/fonts/font-times-new-roman/SVN-Times-New-Roman-Italic.ttf";
import TimesNewRomanBoldItalic from "../../../store/admin/assets/fonts/font-times-new-roman/SVN-Times-New-Roman-Bold-Italic.ttf";
import {
    PDFViewer,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
} from "@react-pdf/renderer";
import { useLocation, useParams } from "react-router-dom";
Font.register({
  family: "TimesNewRoman",
  fonts: [
    { src: TimesNewRoman, fontWeight: "normal", fontStyle: "normal" },
    { src: TimesNewRomanBold, fontWeight: "bold", fontStyle: "normal" },
    { src: TimesNewRomanItalic, fontWeight: "normal", fontStyle: "italic" },
    { src: TimesNewRomanBoldItalic, fontWeight: "bold", fontStyle: "italic" },
  ],
});

export default function Reception() {
    const location = useLocation();
    const { id } = useParams();
    const [data, setData] = useState(null);
    async function getReception(id) {
        try {
            console.log("Fetching reception data for id:", id);
            const res = await ReceptionApi.getDetail(id);
            setData(res.data)
        } catch (error) {
            toast.error("lỗi không thể lấy chi tiết phiếu đăng ký khám.");
        }
    };
    useEffect(() => {
        getReception(id);
    }, [location]);

    if (!data) return <p>Đang tạo phiếu PDF...</p>;

    const {
        patient,
        department,
        outpatientclinic,
        queueorder,
        registrationtime,
    } = data;

    const styles = StyleSheet.create({
        page: {
            fontSize: 12,
            fontFamily: "TimesNewRoman",
        },
        box: {
            width: "100%",
            padding: "8mm",
            margin: "0 auto",
        },
        header: {
            textAlign: "center",
            marginBottom: 12,
        },
        title: {
            fontSize: 16,
            fontWeight: "bold",
        },
        sub: {
            fontSize: 11,
            marginTop: 2,
        },
        orderNumber: {
            textAlign: "center",
            marginVertical: 0,
        },
        orderText: {
            fontSize: 36,
            color: "red",
            fontWeight: "bold",
        },
        section: {
            marginTop: 10,
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: "bold",
            borderBottom: "1px solid #ccc",
            marginBottom: 6,
            paddingBottom: 3,
        },
        row: {
            flexDirection: "row",
            marginBottom: 4,
        },
        label: {
            width: "40%",
            fontWeight: "bold",
        },
        value: {
            width: "60%",
            fontStyle: "normal",
        },
        footer: {
            marginTop: 15,
            textAlign: "center",
            fontStyle: "italic",
            fontSize: 10,
        },
    });

    return (
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <Document>
                <Page size="A6" style={styles.page}>
                    <View style={styles.box}>
                        <View style={styles.header}>
                            <Text style={styles.title}>PHIẾU THỨ TỰ KHÁM BỆNH</Text>
                            <Text style={styles.sub}>Bệnh viện A</Text>
                            <Text style={styles.sub}>
                                Ngày tiếp nhận: {registrationtime?.substring(0, 10)}
                            </Text>
                        </View>
                        <View style={styles.orderNumber}>
                            <Text style={styles.orderText}>{queueorder}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Thông tin địa điểm</Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>Khoa:</Text>
                                <Text style={styles.value}>{department.name}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Phòng:</Text>
                                <Text style={styles.value}>{outpatientclinic.name}</Text>
                            </View>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Thông tin bệnh nhân</Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>Mã BN:</Text>
                                <Text style={styles.value}>{patient.patientid}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Họ và tên:</Text>
                                <Text style={styles.value}>{patient.fullname}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Ngày sinh:</Text>
                                <Text style={styles.value}>{patient.dateofbirth}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>SĐT:</Text>
                                <Text style={styles.value}>{patient.phone}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Địa chỉ:</Text>
                                <Text style={styles.value}>{patient.address}</Text>
                            </View>
                        </View>
                        <Text style={styles.footer}>
                            Vui lòng chờ đến lượt khám
                        </Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
}
