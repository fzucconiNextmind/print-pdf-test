import {
  BlobProvider,
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },

  image: {
    width: "50%",
    aspectRatio: 1,
    marginVertical: 15,
  },

  view: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});
const ChartsDocument = ({ svgList }: { svgList: string[] }) => {
  // Use DOMParser to parse new svg element from svgString
  return (
    <Document>
      <Page style={styles.body}>
        <View>
          <Text style={styles.title}> This is a Pdf sample </Text>
          <View style={styles.view}>
            {svgList.map((chart, id) => {
              return <Image style={styles.image} key={id} src={chart} />;
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ChartsDocument;
