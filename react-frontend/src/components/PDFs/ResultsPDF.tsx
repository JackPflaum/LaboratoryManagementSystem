import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { JobAttributes, SampleAttributes } from '../../types/interfaces';


interface PDFProps {
    job?: JobAttributes,
    samples?: SampleAttributes[]
};

// PDF Document styles
const pdfStyles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "white",
    },
    header: {
        fontSize: "16px",
        marginBottom: "5px",
        paddingLeft: 10,
    },
    headerText: {
        fontSize: "20px",
        fontWeight: "semibold"
    },
    section: {
        marginTop: "5px",
        paddingLeft: 10
    },
    sampleSection: {
        paddingLeft: 10,
    },
    resultsSection: {
        marginTop: "10px",
    }
});

const DividerLine = () => (
    <View style={{ borderBottomWidth: 0.8, borderBottomColor: "black", marginVertical: 10 }} />
);


const ResultsPDF = ({ job, samples }: PDFProps) => {
    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.header}>
                        <Text style={pdfStyles.headerText}>Client:</Text> {job?.client}
                    </Text>
                    <DividerLine />
                    <Text style={pdfStyles.header}>
                        <Text style={pdfStyles.headerText}>Job Number:</Text> {job?.jobNumber}
                    </Text>
                    <DividerLine />
                    <View style={pdfStyles.sampleSection}>
                        {samples?.map((sample,) => (
                            <View key={sample.id} >
                                <Text>
                                    <Text style={pdfStyles.headerText}>Sample:</Text> {sample.sampleNumber}
                                </Text>
                                <Text>Type: {sample.type}</Text>
                                {sample.tests.map((test) => (
                                    <View key={test.id} style={pdfStyles.resultsSection}>
                                        <Text>Test: {test.testName}</Text>
                                        <Text>Result: {`${test.result} ${test.unit}`}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ResultsPDF;
