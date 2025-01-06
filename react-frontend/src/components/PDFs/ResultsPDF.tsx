import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { JobAttributes, SampleAttributes } from '../../types/interfaces';


interface PDFProps {
    job?: JobAttributes,
    samples?: SampleAttributes[]
};

// PDF Document styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "white",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    header: {
        fontSize: "16px",
        fontWeight: 900,
    },
});


const ResultsPDF = ({ job, samples }: PDFProps) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.header}>Client: {job?.client}</Text>
                </View>
                <View style={styles.section}>
                    <Text>Job Number: {job?.jobNumber}</Text>
                </View>
                {samples?.map((sample, index) => (
                    <View key={index}>
                        <Text>Sample: {sample.sampleNumber}</Text>
                        <Text>Type: {sample.type}</Text>
                        {sample.tests.map((test, testIndex) => (
                            <View key={testIndex}>
                                <Text>Test: {test.testName}</Text>
                                <Text>Result: {`${test.result} ${test.unit}`}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </Page>
        </Document>
    );
};

export default ResultsPDF;
