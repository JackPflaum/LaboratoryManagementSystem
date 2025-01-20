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
        marginTop: "10px",
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
    sampleHeader: {
        marginTop: "20px",
    },
    sampleSection: {
        paddingLeft: 10,
    },
    resultsSection: {
        marginTop: "10px",
        paddingLeft: 10,
    }
});

const DividerLine = ({ width }: { width: string }) => (
    <View style={{ borderBottomWidth: 0.8, borderBottomColor: "black", marginVertical: 10, width: `${width}%` }} />
);


const ResultsPDF = ({ job, samples }: PDFProps) => {
    const headerWidth: string = "100";
    const sampleSectionWidth: string = "75";

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.header}>
                        <Text style={pdfStyles.headerText}>Client:</Text> {job?.client}
                    </Text>
                    <DividerLine width={headerWidth} />
                    <Text style={pdfStyles.header}>
                        <Text style={pdfStyles.headerText}>Job Number:</Text> {job?.jobNumber}
                    </Text>
                    <DividerLine width={headerWidth} />
                    <View style={pdfStyles.sampleSection}>
                        {samples?.map((sample,) => (
                            <View key={sample.id} >
                                <Text style={pdfStyles.sampleHeader}>
                                    <Text style={pdfStyles.headerText}>Sample:</Text> {sample.sampleNumber}
                                </Text>
                                <Text>
                                    <Text style={pdfStyles.headerText}>Type:</Text> {sample.type}
                                </Text>
                                {sample.tests.map((test) => (
                                    <View key={test.id} style={pdfStyles.resultsSection}>
                                        <Text>Test: {test.testName}</Text>
                                        <Text>Result: {`${test.result} ${test.unit}`}</Text>
                                    </View>
                                ))}
                                <DividerLine width={sampleSectionWidth} />
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ResultsPDF;
