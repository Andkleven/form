import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  // StyleSheet,
  // Font,
  PDFViewer,
  PDFDownloadLink
  // BlobProvider,
  // Canvas,
  // pdf
} from "@react-pdf/renderer";
import { Button } from "react-bootstrap";
import query from "graphql/query";
import { useQuery } from "react-apollo";
import Loading from "components/Loading";

const fontsize = 7;

export const Report = ({ project, description, item }) => {
  const p = project && project.data;
  const d = description && description.data;
  const i = item;
  let le = null;
  let leData = null;
  if (i.leadEngineers) {
    le = i.leadEngineers;
    leData = JSON.parse(le.data);
  }
  let op = null;
  let opData = null;
  if (i.operators) {
    op = i.operators;
    opData = JSON.parse(op.data);
  }

  // const qc =
  if (p && d && i) {
    return (
      <Document
        title="Report"
        author="Trelleborg Offshore Norway AS"
        creator="Trelleborg Offshore Norway AS"
        producer="Trelleborg Offshore Norway AS"
        subject="Coating Report"
        keywords="coating report trelleborg offshore norway as"
      >
        <Page size="A4" style={{ padding: 30 }}>
          <Row style={{ alignItems: "flex-end" }}>
            <Col>
              <Title>Coating Report</Title>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <P>Item Number: {i.itemId}</P>
            </Col>
          </Row>
          <Line />
          <Row style={{ marginBottom: 10 }}>
            <Col>
              <Entry label="Project Name" values={p.projectName} />
              <Entry label="Project Number" values={p.projectNumber} />
              <Entry label="Client" values={p.client} />
              <Entry label="ITP Document Number" values={p.itpDocumentNumber} />
              <Entry label="Project Manager" values={p.projectManager} />
              <Entry label="Supervisor" values={p.supervisor} />
              <Entry label="Lead Engineer" values={p.leadEngineers} />
              <Entry
                label="Supervising Engineer"
                values={p.supervisingEngineer}
              />
              <Entry label="Quality Control" values={p.qualityControl} />
              <Entry label="Description" values={d.descriptionNameMaterialNo} />
              <Entry label="Geometry" values={d.geometry} />
              <Entry label="IFS Activity Codes" values={d.ifsActivityCodes} />
              <Entry label="CPS" values={d.CPS} />
            </Col>
            <Col></Col>
          </Row>

          {leData && opData && (
            <>
              <Subtitle>Steel Preparation</Subtitle>
              <Line />
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <Entry
                    label="Test"
                    values={["Standard", "Criteria", "Result", "Employee"]}
                  />
                  {leData.relativeHumidity ? (
                    <Entry
                      label="Relative Humidity"
                      values={[
                        "ISO 8502-4",
                        leData.relativeHumidity &&
                          `${leData.relativeHumidity}%`,
                        opData.relativeHumidity &&
                          `${opData.relativeHumidity}%`,
                        opData.relativeHumidityUserField
                      ]}
                    />
                  ) : null}
                  {leData.airTemperature ? (
                    <Entry
                      label="Air Temperature"
                      values={[
                        "ISO 8502-4",
                        leData.airTemperature && `${leData.airTemperature}°C`,
                        opData.airTemperature && `${opData.airTemperature}°C`,
                        opData.airTemperatureUserField
                      ]}
                    />
                  ) : null}
                  {leData.steelTemperature ? (
                    <Entry
                      label="Steel Temperature"
                      values={[
                        "ISO 8502-4",
                        leData.steelTemperature &&
                          `${leData.steelTemperature}°C`,
                        opData.steelTemperature &&
                          `${opData.steelTemperature}°C`,
                        opData.steelTemperatureUserField
                      ]}
                    />
                  ) : null}
                  {leData.temperatureOverDewPoint ? (
                    <Entry
                      label="Temperature over Dew Point"
                      values={[
                        "ISO 8502-4, Difference between Steel Temperature and Dew Point Temperature",
                        leData.temperatureOverDewPoint &&
                          `${leData.temperatureOverDewPoint}°C`,
                        opData.temperatureOverDewPoint &&
                          `${opData.temperatureOverDewPoint}°C`,
                        opData.temperatureOverDewPointUserField
                      ]}
                    />
                  ) : null}
                  {leData.blastMediaConductivity ? (
                    <Entry
                      label="Blast Media Conductivity"
                      values={[
                        "ISO 8502-9",
                        leData.blastMediaConductivity &&
                          `${leData.blastMediaConductivity}µS/cm`,
                        opData.blastMediaConductivity &&
                          `${opData.blastMediaConductivity}µS/cm`,
                        opData.blastMediaConductivityUserField
                      ]}
                    />
                  ) : null}
                  {leData.surfaceProfileMin ? (
                    <Entry
                      label="Surface Profile Min (Roughness)"
                      values={[
                        "ISO 8503-4",
                        leData.surfaceProfileMin &&
                          `${leData.surfaceProfileMin}µm`,
                        opData.surfaceProfileMin &&
                          `${opData.surfaceProfileMin}µm`,
                        opData.surfaceProfileMinUserField
                      ]}
                    />
                  ) : null}
                  {leData.surfaceProfileMax ? (
                    <Entry
                      label="Surface Profile Max (Roughness)"
                      values={[
                        "ISO 8503-4",
                        leData.surfaceProfileMax &&
                          `${leData.surfaceProfileMax}Rz`,
                        opData.surfaceProfileMax &&
                          `${opData.surfaceProfileMax}Rz`,
                        opData.surfaceProfileMaxUserField
                      ]}
                    />
                  ) : null}
                  {leData.solubleSaltLevel ? (
                    <Entry
                      label="Soluble Salt Level"
                      values={[
                        "ISO 8502-5/9",
                        leData.solubleSaltLevel &&
                          `${leData.solubleSaltLevel}mg/m²`,
                        opData.solubleSaltLevel &&
                          `${opData.solubleSaltLevel}mg/m²`,
                        opData.solubleSaltLevelUserField
                      ]}
                    />
                  ) : null}
                  {leData.dustTest ? (
                    <Entry
                      label="Dust Test"
                      values={[
                        "ISO 8502-3, Whole number between 1-5",
                        leData.dustTest,
                        opData.dustTest,
                        opData.dustTestUserField
                      ]}
                    />
                  ) : null}
                  {leData.inspectionOfSteelSurface ? (
                    <Entry
                      label="Inspection of Steel Surface"
                      values={[
                        "ISO 8501-3, Welds to be grade P3",
                        leData.inspectionOfSteelSurface,
                        opData.inspectionOfSteelSurface,
                        opData.inspectionOfSteelSurfaceUserField
                      ]}
                    />
                  ) : null}
                  {leData.compressedAirCheck ? (
                    <Entry
                      label="Compressed Air Check"
                      values={[
                        "ASTM D 4285, No oil and no water",
                        leData.compressedAirCheck,
                        opData.compressedAirCheck,
                        opData.compressedAirCheckUserField
                      ]}
                    />
                  ) : null}
                  {leData.surfaceCleanliness ? (
                    <Entry
                      label="Surface Cleanliness"
                      values={[
                        "ISO 8501-1, Min. Sa 2,5 (Rust grade A or B)",
                        leData.surfaceCleanliness,
                        opData.surfaceCleanliness,
                        opData.surfaceCleanlinessUserField
                      ]}
                    />
                  ) : null}
                  {leData.uvTest ? (
                    <Entry
                      label="UV Test"
                      values={[
                        "No reflecting light",
                        leData.uvTest,
                        opData.uvTest,
                        opData.uvTestUserField
                      ]}
                    />
                  ) : null}
                  {/* TODO: Custom tests */}
                </Col>
              </Row>
            </>
          )}
          <Row style={{ marginBottom: 10 }}>
            <Col style={{ marginRight: 7 }}>
              <B>Primer 1</B>
              <Line />
              {/* TODO: Add Primer 1 entries */}
            </Col>
            <Col style={{ marginRight: 7 }}>
              <B>Primer 2</B>
              <Line />
              {/* TODO: Add Primer 2 entries */}
            </Col>
            {/* TODO: Conditional name? */}
            <Col style={{ marginRight: 7 }}>
              <B>Rubber Cement Before Coating</B>
              <Line />
              {/* TODO: Add Rubber Cement Before Coating entries */}
            </Col>
          </Row>

          <Subtitle>Coating and Vulcanization</Subtitle>
          <Line />
          <Row>
            <Col style={{ marginRight: 7 }}>
              <Entry
                style={{ alignItems: "flex-end" }}
                label="Layer"
                values={[
                  "Compound Number",
                  "Mix Date",
                  "Date and Time",
                  "Employee"
                ]}
              />
            </Col>
            <Col style={{ width: "51%" }}>
              {/* TODO: Add conditional visibility */}
              <Row>
                <Col>
                  {/* TODO: Conditional name */}
                  <B>Rubber Cement</B>
                </Col>
                <Col>
                  <B>Mix Date</B>
                </Col>
              </Row>
              <Line />
              {/* TODO: Add entries */}

              {/* TODO: Add conditional visibility */}
              {/* TODO: Create Vulc loop */}
              <P>{`Vulcanization step ${1}`}</P>
              <Line />
              {/* TODO: Add entries */}

              {/* TODO: Add conditional visibility */}
              <Row>
                <Col>
                  <B>Final Measurements</B>
                </Col>
                <Col>
                  {/* TODO: Add actual min-max */}
                  <P>{`(min-max: ${1}mm-${999}mm)`}</P>
                </Col>
              </Row>
              <Line />
              {/* TODO: Add entries */}
            </Col>
          </Row>

          <Subtitle>Touch-Up</Subtitle>
          <Line />
          <Row>
            <Col>
              <Entry
                label={"Touch-Up"}
                values={[
                  "Performed/Not performed",
                  "Datetime",
                  "by employee ???"
                ]}
              />
            </Col>
          </Row>

          <Subtitle>Final Inspection</Subtitle>
          <Line />
          <P style={{ marginBottom: 10 }}>Submitted on {"TODO: Datetime"}</P>
          <Row>
            <Col>
              <Entry
                style={{ alignItems: "flex-end" }}
                label={"Test"}
                values={["Standard", "Criteria", "Result", "Employee"]}
              />
            </Col>
          </Row>
        </Page>

        <Page size="A4" style={{ padding: 30 }}>
          <Row style={{ alignItems: "flex-end" }}>
            <Col>
              <Title>Attachments</Title>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <P>Item Number: {i.itemId}</P>
            </Col>
          </Row>
          <Line />
        </Page>
      </Document>
    );
  }

  return null;
};

export const ReportDownload = ({ project, description, item, ...props }) => {
  return (
    <PDFDownloadLink
      document={
        <Report project={project} description={description} item={item} />
      }
      {...props}
    >
      {({ blob, url, loading, error }) => {
        return (
          <Button variant={"success"} className="w-100" disabled={loading}>
            {loading ? "Loading..." : props.children}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default ({ project, description, item, ...props }) => {
  const id = item.id;
  // const id = item["item"][id];

  if (!id) {
    return "No item ID received.";
  }

  let { loading, error, data } = useQuery(query["ITEM"], {
    variables: {
      id
    }
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return error;
  }

  if (data) {
    // Delete
    const i = data["items"][0];
    // const le = i.leadEngineers;
    const op = i.operators;

    return (
      <>
        <PDFViewer
          className="w-100"
          style={{ maxHeight: "calc(100vh - 200px)", height: 1000 }}
        >
          <Report
            project={project}
            description={description}
            item={data["items"][0]}
          ></Report>
        </PDFViewer>
        <div>
          <pre>{JSON.stringify(JSON.parse(op.data), null, 2)}</pre>
          {/* <pre>{JSON.stringify(project, null, 2)}</pre>
          <pre>{JSON.stringify(description, null, 2)}</pre>
          <pre>{JSON.stringify(item, null, 2)}</pre>
          <pre>{JSON.stringify(le, null, 2)}</pre>
          <pre>{JSON.stringify(op, null, 2)}</pre>
          <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      </>
    );
  }

  return null;
};

const Entry = ({ label, values, ...props }) => {
  const isNonEmpty = [undefined, null, false, true, ""].includes(values);
  const hasValues = isNonEmpty || (Array.isArray(values) && values.length < 1);

  if (hasValues) {
    return null;
  }

  const colStyle = {
    marginLeft: 7
  };

  return (
    <Row
      {...props}
      style={{
        marginBottom: 4,
        ...props.style
      }}
    >
      <Col>
        <P>{label}</P>
      </Col>
      {Array.isArray(values) ? (
        values.map((value, index) => (
          <Col key={`${label}-value-${index}`} style={colStyle}>
            <P>{value}</P>
          </Col>
        ))
      ) : (
        <Col style={colStyle}>
          <P>{values}</P>
        </Col>
      )}
    </Row>
  );
};

const Line = props => {
  return (
    <View
      {...props}
      style={{
        borderBottom: "1pt solid #DDDDDD",
        width: "100%",
        marginVertical: "3pt",
        ...props.style
      }}
    ></View>
  );
};

const Row = props => {
  return (
    <View
      {...props}
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        ...props.style
      }}
    >
      {props.children}
    </View>
  );
};

const Col = props => {
  return (
    <View
      {...props}
      style={{ width: "100%", fontSize: fontsize, ...props.style }}
    >
      {props.children}
    </View>
  );
};

const Title = props => {
  return (
    <Text
      {...props}
      style={{
        fontSize: fontsize * 1.5,
        ...props.style
      }}
    >
      {props.children}
    </Text>
  );
};

const Subtitle = props => {
  return (
    <Text
      {...props}
      style={{
        fontSize: fontsize * 1.25,
        ...props.style
      }}
    >
      {props.children}
    </Text>
  );
};

const P = props => {
  return (
    <Text
      {...props}
      style={{
        fontSize: fontsize,
        ...props.style
      }}
    >
      {props.children}
    </Text>
  );
};

const B = props => {
  return (
    <Text
      {...props}
      style={{
        // fontSize: fontsize,
        fontWeight: 900,
        ...props.style
      }}
    >
      {props.children}
    </Text>
  );
};
